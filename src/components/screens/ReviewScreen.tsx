import { motion, useReducedMotion } from "framer-motion";
import { LayoutGrid, ShieldCheck, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import type { Position } from "../../lib/margin";
import { fadeItem, riseItem, sceneStagger } from "../../lib/motion";
import { FloatingCoins } from "../ui/FloatingCoins";
import { Pressable } from "../ui/Pressable";
import { ReceiptCard } from "../ui/ReceiptCard";

interface Props {
  position: Position;
  onConfirm: () => void;
  onBack: () => void;
}

const PURCHASE_GRADIENT = "linear-gradient(270deg, #7a2eff 0%, #a36eff 100%)";

export function ReviewScreen({ position, onConfirm, onBack }: Props) {
  const liqPct = Math.round(position.liquidationDropPct * 100);
  const reduce = useReducedMotion();
  const item = reduce ? fadeItem : riseItem;

  return (
    <motion.div
      variants={sceneStagger}
      initial="hidden"
      animate="show"
      className="relative h-full overflow-hidden bg-white"
    >
      <FloatingCoins className="absolute left-[-16px] top-[201px] z-0" />

      {/* Header (top-84) */}
      <motion.div
        variants={item}
        className="absolute left-[28px] top-[84px] z-10 flex w-[265px] flex-col gap-[20px]"
      >
        <p className="text-[18px] font-medium tracking-[-0.04em] text-black">
          Buy Bitcoin
        </p>
        <div className="flex flex-col gap-[10px]">
          <p className="text-[20px] font-medium tracking-[-0.04em] text-black">
            Review purchase
          </p>
          <p className="text-[16px] font-medium tracking-[-0.04em] text-[#7f7f7f]">
            Review the details of your purchase before you confirm.
          </p>
        </div>
      </motion.div>

      {/* Detail card — anchored to the bottom, with safe-area inset so the
          card doesn't get hidden behind iOS Safari's bottom UI. */}
      <motion.div
        variants={item}
        className="absolute inset-x-0 bottom-[max(8px,env(safe-area-inset-bottom))] z-10 px-2"
      >
        <div className="flex flex-col gap-[30px] overflow-clip rounded-[54px] bg-[#f4f4f7] px-[24px] pb-[24px] pt-[30px] shadow-[0_23px_32.2px_rgba(0,0,0,0.16)]">
          <div className="flex flex-col gap-[10px]">
            <ReceiptCard position={position} />

            {/* Info panel */}
            <div className="flex w-full flex-col gap-[10px] rounded-[16px] border border-[#f9f9f9] bg-[#f6f5fe] px-[28px] py-[16px]">
              <InfoRow icon={<LayoutGrid className="h-[19px] w-[19px]" strokeWidth={2} />}>
                Interest accrues daily
              </InfoRow>
              <InfoRow icon={<TrendingUp className="h-[19px] w-[19px]" strokeWidth={2} />}>
                Borrowing amplifies gains and losses
              </InfoRow>
              <InfoRow icon={<ShieldCheck className="h-[19px] w-[19px]" strokeWidth={2} />}>
                If Bitcoin falls approximately {liqPct}%, your position may be
                liquidated.
              </InfoRow>
            </div>
          </div>

          {/* Back / Purchase */}
          <div className="flex items-center justify-between">
            <Pressable
              onClick={onBack}
              haptic="light"
              scale={0.94}
              dim={false}
              className="text-[16px] font-medium tracking-[-0.04em] text-[#7f7f7f]"
            >
              Back
            </Pressable>
            <Pressable
              onClick={onConfirm}
              haptic="medium"
              scale={0.96}
              className="group flex items-center gap-[10px] rounded-[40px] px-[28px] py-[24px] text-[16px] font-medium tracking-[-0.04em] text-white shadow-[0_10px_24px_rgba(122,46,255,0.32)]"
              style={{ backgroundImage: PURCHASE_GRADIENT }}
            >
              Purchase position
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

function InfoRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-[16px]">
      <span className="flex h-[21px] w-[19px] shrink-0 items-center justify-center text-[#7a2eff]">
        {icon}
      </span>
      <p className="flex-1 text-[13px] font-medium tracking-[-0.04em] text-black">
        {children}
      </p>
    </div>
  );
}
