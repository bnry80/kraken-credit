import { useCallback, useEffect, useState, type CSSProperties } from "react";
import {
  motion,
  useAnimationControls,
  useReducedMotion,
} from "framer-motion";
import { backOut, ease } from "../../lib/motion";
import { haptics } from "../../lib/haptics";

const SHEET = "/coins-hero.png";

// Crop windows lifted directly from the Figma node. Each coin shows a different
// region of the same 5-coin sprite sheet. Percentages are resolution
// independent, so the downscaled sheet lines up exactly.
type CoinSpec = {
  w: number;
  h: number;
  left: number;
  top: number;
  imgW: number;
  imgL: number;
  imgH: number;
  imgT: number;
};

const STAGE_W = 650;
const STAGE_H = 168;

// Progressive (gradient) blur: stack copies of each coin, each blurred more and
// masked to reveal a band lower down. Top stays crisp, bottom softens — applied
// per coin object rather than as one flat blur over the whole cluster.
const BLUR_LAYERS: { blur: number; mask?: string }[] = [
  { blur: 0 },
  { blur: 1.2, mask: "linear-gradient(to bottom, transparent 16%, black 42%)" },
  { blur: 2.8, mask: "linear-gradient(to bottom, transparent 38%, black 64%)" },
  { blur: 5, mask: "linear-gradient(to bottom, transparent 56%, black 86%)" },
];

// The crop is clipped with overflow-hidden, so blurred copies get sliced flat at
// the box edges (hard lines). This feathers left/right/bottom to transparent so
// those edges dissolve; the top is left opaque to keep each coin crisp up top.
const EDGE_FADE =
  "linear-gradient(to right, transparent 0%, black 9%, black 91%, transparent 100%), " +
  "linear-gradient(to bottom, black 0%, black 78%, transparent 100%)";

const edgeMaskStyle = {
  maskImage: EDGE_FADE,
  WebkitMaskImage: EDGE_FADE,
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
} as CSSProperties;

const COINS: CoinSpec[] = [
  { w: 116.334, h: 118.028, left: 0, top: 45.18, imgW: 298.54, imgL: -42.75, imgH: 294.26, imgT: -172.2 },
  { w: 111.251, h: 116.898, left: 136.84, top: 28.24, imgW: 312.18, imgL: -17.63, imgH: 297.1, imgT: -71.58 },
  { w: 92.05, h: 103.345, left: 268.6, top: 0, imgW: 377.3, imgL: -139.26, imgH: 336.07, imgT: -22.95 },
  { w: 111.251, h: 116.898, left: 381.16, top: 28.24, imgW: 312.18, imgL: -197.3, imgH: 297.1, imgT: -71.58 },
  { w: 115.204, h: 118.593, left: 512.92, top: 45.18, imgW: 301.47, imgL: -157.23, imgH: 292.86, imgT: -170.67 },
];

function Coin({
  spec,
  index,
  playKey,
}: {
  spec: CoinSpec;
  index: number;
  playKey: number;
}) {
  const reduce = useReducedMotion();
  const controls = useAnimationControls();

  // Gentle, perpetual bob — each coin drifts at a slightly different cadence
  // so the cluster never looks mechanically in sync.
  const idle = useCallback(() => {
    if (reduce) return;
    controls.start({
      y: [0, -7 - index, 0],
      rotate: [0, index % 2 === 0 ? 1.5 : -1.5, 0],
      transition: {
        duration: 3.4 + index * 0.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.18,
      },
    });
  }, [controls, index, reduce]);

  useEffect(() => {
    idle();
  }, [idle]);

  // Easter egg: tap the cluster and every coin leaps + spins, then resettles.
  useEffect(() => {
    if (playKey === 0 || reduce) return;
    let active = true;
    (async () => {
      await controls.start({
        y: -34,
        rotate: [0, -14, 16, 0],
        scale: [1, 1.16, 1],
        transition: { duration: 0.6, ease: backOut, delay: index * 0.05 },
      });
      if (active) idle();
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playKey]);

  return (
    <motion.div
      className="absolute"
      style={{ width: spec.w, height: spec.h, left: spec.left, top: spec.top }}
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.08, duration: 0.6, ease }}
    >
      <motion.div className="h-full w-full" animate={controls} style={edgeMaskStyle}>
        {BLUR_LAYERS.map((layer, li) => (
          <div
            key={li}
            className="absolute inset-0 overflow-hidden"
            style={
              layer.mask
                ? { maskImage: layer.mask, WebkitMaskImage: layer.mask }
                : undefined
            }
          >
            <img
              alt=""
              draggable={false}
              className="absolute max-w-none select-none"
              src={SHEET}
              style={{
                width: `${spec.imgW}%`,
                left: `${spec.imgL}%`,
                height: `${spec.imgH}%`,
                top: `${spec.imgT}%`,
                filter: layer.blur ? `blur(${layer.blur}px)` : undefined,
              }}
            />
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export function FloatingCoins({ className }: { className?: string }) {
  const [playKey, setPlayKey] = useState(0);

  const play = () => {
    setPlayKey((k) => k + 1);
    haptics.impact("medium");
  };

  return (
    <div
      className={className}
      role="button"
      tabIndex={0}
      aria-label="Crypto coins — tap to play"
      onClick={play}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          play();
        }
      }}
    >
      <div
        className="relative cursor-pointer select-none"
        style={{ width: STAGE_W, height: STAGE_H }}
      >
        {/* Soft glow that pulses each time the cluster is poked. */}
        <motion.div
          key={playKey}
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[220px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(150,170,255,0.45), rgba(150,170,255,0))",
          }}
          initial={playKey === 0 ? false : { opacity: 0.7, scale: 0.7 }}
          animate={{ opacity: 0, scale: 1.25 }}
          transition={{ duration: 0.9, ease }}
        />
        {COINS.map((spec, i) => (
          <Coin key={i} spec={spec} index={i} playKey={playKey} />
        ))}
        {/* Soft bg-colored glow over the left coins (Figma "Ellipse 4"): blends
            the cluster into the page so the right-hand coin reads as the hero. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(190px 200px at 120px 120px, rgba(255,255,255,0.9), rgba(255,255,255,0) 72%)",
          }}
        />
      </div>
    </div>
  );
}
