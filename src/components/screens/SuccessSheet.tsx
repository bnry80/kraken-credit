import { motion, AnimatePresence } from "framer-motion";
import type { Position } from "../../lib/margin";
import { btcQty, usd0 } from "../../lib/utils";
import { ease } from "../../lib/motion";
import { ContinueButton } from "../ui/ContinueButton";

interface Props {
  open: boolean;
  position: Position;
  onDone: () => void;
}

export function SuccessSheet({ open, position, onDone }: Props) {
  const borrowing = position.creditDrawn > 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 z-40 bg-ink-900/25 backdrop-blur-[2px]"
            onClick={onDone}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.42, ease }}
            className="absolute inset-x-0 bottom-0 z-50 rounded-t-[28px] bg-surface px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-8 shadow-[0_-8px_40px_rgba(10,11,15,0.12)]"
          >
            <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-ink-200" />

            <h2 className="text-[24px] font-bold tracking-tight text-ink-900">
              Purchase Complete
            </h2>

            <div className="mt-5 space-y-1">
              <p className="text-[17px] font-medium text-ink-900">
                You bought {btcQty(position.quantity)} BTC
              </p>
              {borrowing && (
                <p className="text-[15px] text-ink-500">
                  {usd0(position.creditDrawn)} funded with credit
                </p>
              )}
            </div>

            {borrowing && (
              <p className="mt-5 text-[14px] leading-relaxed text-ink-400">
                Interest accrues while funds remain borrowed.
              </p>
            )}

            <div className="mt-8 flex justify-end">
              <ContinueButton onClick={onDone}>View Position</ContinueButton>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
