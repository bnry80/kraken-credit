import { motion } from "framer-motion";
import type { Position } from "../../lib/margin";
import { btcQty, usd, usd0 } from "../../lib/utils";
import { stagger } from "../../lib/motion";
import { FlowShell } from "../mobile/FlowShell";
import { ContinueButton } from "../ui/ContinueButton";
import { DetailRow } from "../ui/DetailRow";

interface Props {
  position: Position;
  onConfirm: () => void;
  onBack: () => void;
}

export function ReviewScreen({ position, onConfirm, onBack }: Props) {
  const borrowing = position.creditDrawn > 0;
  const liqPct = Math.round(position.liquidationDropPct * 100);

  return (
    <FlowShell
      onBack={onBack}
      footer={
        <ContinueButton onClick={onConfirm}>
          {borrowing ? "Buy with Credit" : "Buy with Cash"}
        </ContinueButton>
      }
    >
      <div className="no-scrollbar h-full overflow-y-auto px-5 pb-6">
        <motion.p
          {...stagger(0)}
          className="text-[13px] font-medium text-[#545454]"
        >
          Review purchase
        </motion.p>
        <motion.div {...stagger(1)} className="mt-2">
          <p className="font-diatype tabular text-[36px] font-bold leading-none tracking-tight text-black">
            {btcQty(position.quantity)} BTC
          </p>
          <p className="tabular mt-2 text-[16px] text-[#545454]">
            ≈ {usd0(position.positionUsd)}
          </p>
        </motion.div>

        <motion.div {...stagger(2)} className="mt-8 border-t border-black/[0.06]">
          <DetailRow label="Cash" value={usd0(position.cashCommitted)} />
          {borrowing && (
            <DetailRow label="Borrowed" value={usd0(position.creditDrawn)} />
          )}
        </motion.div>

        {borrowing && (
          <>
            <motion.div {...stagger(3)} className="mt-6 border-t border-black/[0.06]">
              <p className="pt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#545454]">
                Borrowing cost
              </p>
              <DetailRow
                label="Daily"
                value={`${usd(position.dailyInterest)}/day`}
              />
              <DetailRow
                label="Monthly"
                value={`${usd(position.monthlyInterest)}/month`}
              />
            </motion.div>

            <motion.div {...stagger(4)} className="mt-6 border-t border-black/[0.06]">
              <p className="pt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#545454]">
                Risk reminder
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-black">
                If Bitcoin falls approximately {liqPct}%, Kraken may sell your
                position to repay the loan.
              </p>
            </motion.div>

            <motion.ul
              {...stagger(5)}
              className="mt-6 space-y-2.5 text-[15px] leading-relaxed text-[#545454]"
            >
              <li>Interest accrues while funds remain borrowed.</li>
              <li>Borrowing increases both gains and losses.</li>
              <li>You can repay borrowed funds at any time.</li>
            </motion.ul>
          </>
        )}
      </div>
    </FlowShell>
  );
}
