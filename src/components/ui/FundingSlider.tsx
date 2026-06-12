import {
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { creditBounds } from "../../lib/margin";
import { haptics } from "../../lib/haptics";

interface Props {
  amount: number;
  credit: number;
  onChange: (credit: number) => void;
}

const STEP = 50; // snap credit to $50 increments

/**
 * Cash ↔ Credit allocation slider. The fill (left, purple) is the cash share;
 * dragging right = more cash, left = more credit. The draggable range is bounded
 * by the real margin math: you must borrow at least `min` (cash can't cover it)
 * and at most `max` (credit limit / purchase size).
 */
export function FundingSlider({ amount, credit, onChange }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackW, setTrackW] = useState(0);
  const dragging = useRef(false);
  const lastEmitted = useRef(credit);

  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => setTrackW(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { min, max } = creditBounds(amount);
  const usable = amount > 0;
  const cash = amount - credit;
  const cashFrac = usable ? cash / amount : 0;

  // Allowed cash-fraction window derived from the credit bounds.
  const fracMin = usable ? (amount - max) / amount : 0; // most credit
  const fracMax = usable ? (amount - min) / amount : 1; // most cash

  const setFromClientX = (clientX: number) => {
    const el = trackRef.current;
    if (!el || !usable) return;
    const rect = el.getBoundingClientRect();
    let frac = (clientX - rect.left) / rect.width;
    frac = Math.max(fracMin, Math.min(fracMax, frac));
    const raw = amount * (1 - frac);
    const snapped = Math.round(raw / STEP) * STEP;
    const next = Math.min(max, Math.max(min, snapped));
    if (next !== lastEmitted.current) {
      lastEmitted.current = next;
      haptics.selection();
      onChange(next);
    }
  };

  const onPointerDown = (e: ReactPointerEvent) => {
    if (!usable) return;
    dragging.current = true;
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    if (dragging.current) setFromClientX(e.clientX);
  };
  const endDrag = () => {
    dragging.current = false;
  };

  const fillW = Math.max(8, Math.min(1, cashFrac) * trackW);

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-label="Funding mix: cash versus credit"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={credit}
      className="relative h-[55px] w-full touch-none select-none overflow-hidden rounded-[12px] bg-[#e6e6e6]"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div
        className="absolute bottom-0 left-0 top-0 rounded-[12px] shadow-[3px_0_8.8px_rgba(0,0,0,0.15)]"
        style={{
          width: fillW,
          background: "linear-gradient(to left, #7a2eff, #a36eff)",
        }}
      />
      <span className="pointer-events-none absolute left-[13px] top-1/2 -translate-y-1/2 text-[14px] font-medium tracking-[-0.04em] text-[#fafafb]">
        More Cash
      </span>
      <span className="pointer-events-none absolute right-[16px] top-1/2 -translate-y-1/2 text-[14px] font-medium tracking-[-0.04em] text-[#a8a8a8]">
        More Credit
      </span>
      <div
        className="pointer-events-none absolute top-1/2 h-[27px] w-[2px] -translate-y-1/2 overflow-hidden rounded-[4px] shadow-[1px_0_2.6px_rgba(0,0,0,0.18)]"
        style={{ left: fillW - 5 }}
      >
        <img
          src="/slider-handle.png"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
