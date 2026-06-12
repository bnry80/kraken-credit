import {
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
  type Variants,
} from "framer-motion";
import { ease } from "../../lib/motion";
import { springs } from "../../lib/springs";
import { haptics } from "../../lib/haptics";

interface Props<T extends string> {
  stack: T[];
  renderStep: (step: T) => ReactNode;
  onPop: () => void;
  edgeWidth?: number;
}

// Depth transition: screens don't slide, they cross-dissolve with a subtle
// zoom so navigation reads as moving through layers. Forward, the incoming
// screen grows in from slightly-smaller while the outgoing recedes past the
// viewer; back is the exact inverse. The per-screen content stagger (riseItem)
// then animates each element in, so the *elements* carry the motion.
const depth: Variants = {
  enter: (dir: number) => ({ opacity: 0, scale: dir >= 0 ? 0.96 : 1.04 }),
  center: {
    opacity: 1,
    scale: 1,
    transition: {
      scale: springs.smooth,
      opacity: { duration: 0.4, ease, delay: 0.06 },
    },
  },
  exit: (dir: number) => ({
    opacity: 0,
    scale: dir >= 0 ? 1.04 : 0.96,
    transition: { duration: 0.3, ease },
  }),
};

export function NavStack<T extends string>({
  stack,
  renderStep,
  onPop,
  edgeWidth = 24,
}: Props<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  const current = stack[stack.length - 1];
  const canGoBack = stack.length > 1;

  // Direction (push = forward, pop = back) computed synchronously so the
  // exiting screen picks the correct variant on the very first frame.
  const lenRef = useRef(stack.length);
  const dirRef = useRef(1);
  if (stack.length > lenRef.current) dirRef.current = 1;
  else if (stack.length < lenRef.current) dirRef.current = -1;
  lenRef.current = stack.length;
  const dir = dirRef.current;

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ---- Interactive back gesture (drives the depth motion, not a slide) ----
  // While dragging from the left edge the current screen gently recedes and
  // rounds its corners (like a card being set down); releasing past threshold
  // hands off to the depth pop transition.
  const dragP = useMotionValue(0);
  const wrapScale = useTransform(dragP, [0, 1], [1, 0.93]);
  const wrapOpacity = useTransform(dragP, [0, 1], [1, 0.75]);
  const wrapRadius = useTransform(dragP, [0, 1], [0, 36]);
  const drag = useRef({ active: false, startX: 0, lastX: 0, lastT: 0, vel: 0 });

  const onPointerDown = (e: ReactPointerEvent) => {
    if (!canGoBack || width === 0) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      lastX: e.clientX,
      lastT: performance.now(),
      vel: 0,
    };
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = Math.max(0, Math.min(e.clientX - d.startX, width));
    dragP.set(dx / width);
    const now = performance.now();
    const dt = now - d.lastT;
    if (dt > 0) d.vel = (e.clientX - d.lastX) / dt;
    d.lastX = e.clientX;
    d.lastT = now;
  };

  const endDrag = () => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    const p = dragP.get();
    if (p > 0.35 || d.vel > 0.45) {
      haptics.impact("light");
      dragP.set(0);
      onPop();
    } else {
      animate(dragP, 0, springs.smooth);
    }
  };

  useLayoutEffect(() => {
    if (!canGoBack) {
      drag.current.active = false;
      dragP.set(0);
    }
  }, [canGoBack, dragP]);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      <motion.div
        className="relative h-full w-full overflow-hidden bg-white"
        style={{ scale: wrapScale, opacity: wrapOpacity, borderRadius: wrapRadius }}
      >
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={current}
            custom={dir}
            variants={depth}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 bg-white"
          >
            {renderStep(current)}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {canGoBack && (
        <div
          className="absolute left-0 top-0 z-50 h-full"
          style={{ width: edgeWidth, touchAction: "pan-y" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        />
      )}
    </div>
  );
}
