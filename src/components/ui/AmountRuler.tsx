import { useEffect, useMemo, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { btcQty, clamp } from "../../lib/utils";
import { MARKET } from "../../lib/margin";

const TICK_GAP = 18;
const TICK_W = 2;
const RULER_W = 203;
const RULER_H = 34;

interface Props {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}

function valueToOffset(v: number, min: number, step: number) {
  return -((v - min) / step) * TICK_GAP;
}

function offsetToValue(x: number, min: number, max: number, step: number) {
  const index = Math.round(-x / TICK_GAP);
  return clamp(min + index * step, min, max);
}

function tickHeight(dist: number) {
  if (dist <= 0) return 0;
  if (dist === 1) return 24;
  return 19;
}

export function AmountRuler({
  value,
  min,
  max,
  step = 100,
  onChange,
}: Props) {
  const x = useMotionValue(valueToOffset(value, min, step));
  const dragging = useRef(false);

  const tickCount = (max - min) / step;
  const currentIndex = (value - min) / step;
  const minOffset = valueToOffset(max, min, step);
  const maxOffset = valueToOffset(min, min, step);
  const rulerWidth = tickCount * TICK_GAP;

  const ticks = useMemo(
    () =>
      Array.from({ length: tickCount + 1 }, (_, i) => ({
        amount: min + i * step,
        index: i,
      })),
    [min, step, tickCount],
  );

  useEffect(() => {
    if (!dragging.current) {
      animate(x, valueToOffset(value, min, step), {
        type: "spring",
        stiffness: 380,
        damping: 34,
      });
    }
  }, [value, min, step, x]);

  const handleDrag = () => {
    dragging.current = true;
    onChange(offsetToValue(x.get(), min, max, step));
  };

  const handleDragEnd = () => {
    dragging.current = false;
    const snapped = offsetToValue(x.get(), min, max, step);
    onChange(snapped);
    animate(x, valueToOffset(snapped, min, step), {
      type: "spring",
      stiffness: 380,
      damping: 34,
    });
  };

  return (
    <div className="w-full select-none">
      <div className="flex flex-col items-center">
        <p className="font-diatype tabular text-[56px] font-bold leading-none tracking-[-0.03em] text-black sm:text-[64px]">
          ${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}
        </p>
        <p className="tabular mt-3 text-[14px] font-semibold text-[#545454]">
          ≈ {btcQty(value / MARKET.btcPrice)} BTC
        </p>
      </div>

      <div
        className="relative mx-auto mt-8 overflow-hidden"
        style={{ width: RULER_W, height: RULER_H }}
      >
        <div className="pointer-events-none absolute bottom-0 left-1/2 z-20 h-[34px] w-[3px] -translate-x-1/2 rounded-sm bg-[#7132f5]" />

        <motion.div
          className="absolute bottom-0 left-1/2 flex cursor-grab items-end active:cursor-grabbing"
          style={{
            x,
            width: rulerWidth,
            height: RULER_H,
            marginLeft: -rulerWidth / 2,
          }}
          drag="x"
          dragConstraints={{ left: minOffset, right: maxOffset }}
          dragElastic={0}
          dragMomentum={false}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
        >
          {ticks.map((tick) => {
            const dist = Math.abs(tick.index - currentIndex);
            const height = tickHeight(dist);
            if (height === 0) return null;

            return (
              <div
                key={tick.amount}
                className="absolute bottom-0 flex justify-center"
                style={{ left: tick.index * TICK_GAP, width: TICK_GAP }}
              >
                <div
                  className="rounded-sm bg-black/15"
                  style={{ width: TICK_W, height }}
                />
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
