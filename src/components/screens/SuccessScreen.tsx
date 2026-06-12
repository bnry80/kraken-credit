import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Position } from "../../lib/margin";
import { btcQty, usd0 } from "../../lib/utils";
import { fadeItem, riseItem, sceneStagger } from "../../lib/motion";
import { springs } from "../../lib/springs";
import { haptics } from "../../lib/haptics";
import { FloatingCoins } from "../ui/FloatingCoins";
import { Pressable } from "../ui/Pressable";

interface Props {
  position: Position;
  onDone: () => void;
}

export function SuccessScreen({ position, onDone }: Props) {
  const reduce = useReducedMotion();
  const item = reduce ? fadeItem : riseItem;

  useEffect(() => {
    haptics.success();
  }, []);

  return (
    <motion.div
      variants={sceneStagger}
      initial="hidden"
      animate="show"
      className="relative flex h-full flex-col overflow-hidden bg-white"
    >
      {/* Hero: coins + check + headline, vertically centered in the space
          above the card so it stays centered at any screen height. */}
      <div className="relative flex w-full min-w-0 flex-1 flex-col items-center justify-center overflow-hidden pt-[max(8px,env(safe-area-inset-top))]">
        {/* Faint lavender orb — Figma node 147:1491. Static, positioned to
            sit behind the "Position created" headline area. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[58%] z-0 h-[466px] w-[328px] -translate-x-1/2 -translate-y-1/2"
        >
          <div className="absolute" style={{ inset: "-25.75% -36.59%" }}>
            <img src="/orb.svg" alt="" className="block h-full w-full" />
          </div>
        </div>

        <FloatingCoins className="relative z-0 shrink-0" />

        {/* Glassy check hero, overlapping the coins */}
        <div className="relative z-20 -mt-[58px] h-[191px] w-[183px] shrink-0">
          <motion.div
            className="relative h-full w-full"
            initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.5, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.12, ...springs.bouncy }}
          >
            <img
              src="/success-check-blur.png"
              alt=""
              className="absolute left-1/2 top-[49px] h-[141px] w-[167px] -translate-x-1/2 object-cover blur-[4.217px]"
            />
            <img
              src="/success-check.png"
              alt=""
              className="absolute left-1/2 top-0 h-[153px] w-[182px] -translate-x-1/2 object-cover"
            />
          </motion.div>
        </div>

        {/* Title + headline amount */}
        <motion.div
          variants={item}
          className="relative z-10 mt-[6px] flex w-[265px] flex-col items-center gap-[10px] text-center"
        >
          <p className="text-[20px] font-medium tracking-[-0.04em] text-black">
            Position created
          </p>
          <p className="text-[16px] font-medium tracking-[-0.04em] text-[#7f7f7f]">
            Your Bitcoin position is now active
          </p>
          <p className="text-trim tabular whitespace-nowrap font-diatype text-[60px] font-medium tracking-[-0.03em] text-[#7a2eff]">
            {btcQty(position.quantity)} BTC
          </p>
        </motion.div>
      </div>

      {/* Detail card — bottom-anchored with safe-area inset so iOS Safari's
          bottom UI doesn't cover it on real devices. */}
      <motion.div
        variants={item}
        className="relative z-10 mx-2 mb-[max(8px,env(safe-area-inset-bottom))]"
      >
          <div className="flex flex-col gap-[30px] overflow-clip rounded-[54px] bg-[#f4f4f7] px-[24px] pb-[24px] pt-[30px] shadow-[0_23px_32.2px_rgba(0,0,0,0.16)]">
          <div className="flex w-full flex-col items-start gap-[16px] rounded-[16px] border border-[#f9f9f9] bg-white p-[16px]">
            <p className="text-[16px] font-medium tracking-[-0.04em] text-black">
              {usd0(position.positionUsd)} position funded with:
            </p>
            <div className="flex w-full flex-col gap-[11px]">
              <FundedRow label="Cash" value={usd0(position.cashCommitted)} />
              <FundedRow label="Borrowed" value={usd0(position.creditDrawn)} />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Pressable
              onClick={onDone}
              haptic="medium"
              scale={0.96}
              className="group flex items-center gap-[10px] rounded-[40px] bg-black px-[28px] py-[24px] text-[16px] font-medium tracking-[-0.04em] text-white"
            >
              View position
              <span className="text-[15px] transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Pressable>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FundedRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex w-full items-center justify-between">
      <p className="text-[14px] font-medium tracking-[-0.04em] text-black">
        {label}
      </p>
      <p className="tabular text-[13px] font-medium tracking-[-0.04em] text-black">
        {value}
      </p>
    </div>
  );
}
