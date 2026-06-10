import { motion } from "framer-motion";
import { buildPosition, fallOutcomes } from "../../lib/margin";
import type { Position } from "../../lib/margin";
import { btcQty, usd, usd0 } from "../../lib/utils";
import { stagger } from "../../lib/motion";
import { FlowShell } from "../mobile/FlowShell";
import { ContinueButton } from "../ui/ContinueButton";

interface Props {
  position: Position;
  onContinue: () => void;
  onBack: () => void;
}

export function UnderstandScreen({ position, onContinue, onBack }: Props) {
  const borrowing = position.creditDrawn > 0;
  const cashOnly = buildPosition({
    cashCommitted: position.cashCommitted,
    creditDrawn: 0,
    price: position.entryPrice,
  });
  const outcomes = fallOutcomes(position);
  const liqPct = Math.round(position.liquidationDropPct * 100);

  return (
    <FlowShell
      onBack={onBack}
      footer={
        <ContinueButton onClick={onContinue}>Review Purchase</ContinueButton>
      }
    >
      <div className="no-scrollbar h-full overflow-y-auto px-5 pb-6">
        <motion.p
          {...stagger(0)}
          className="text-[13px] font-medium tracking-wide text-[#545454]"
        >
          {borrowing ? "Before you borrow" : "Before you buy"}
        </motion.p>
        <motion.h1
          {...stagger(1)}
          className="mt-2 text-[26px] font-semibold leading-[1.2] tracking-[-0.02em] text-black"
        >
          Here's what changes when you use credit.
        </motion.h1>
        <motion.p
          {...stagger(2)}
          className="mt-3 text-[16px] leading-relaxed text-[#545454]"
        >
          Borrowing increases both your buying power and your risk.
        </motion.p>

        {borrowing && (
          <>
            <motion.section {...stagger(3)} className="mt-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#545454]">
                Buying power
              </p>
              <div className="mt-6 space-y-7">
                <div>
                  <p className="text-[15px] font-medium text-[#545454]">Cash only</p>
                  <p className="font-diatype tabular mt-1.5 text-[30px] font-bold tracking-tight text-black">
                    {btcQty(cashOnly.quantity)} BTC
                  </p>
                  <p className="mt-2 text-[15px] leading-snug text-[#545454]">
                    Uses only your available cash.
                  </p>
                </div>
                <div>
                  <p className="text-[15px] font-medium text-[#545454]">Cash + credit</p>
                  <p className="font-diatype tabular mt-1.5 text-[30px] font-bold tracking-tight text-black">
                    {btcQty(position.quantity)} BTC
                  </p>
                  <p className="mt-2 text-[15px] leading-snug text-[#545454]">
                    Includes {usd0(position.creditDrawn)} borrowed from your credit
                    line.
                  </p>
                </div>
              </div>
            </motion.section>

            <motion.section {...stagger(4)} className="mt-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#545454]">
                Borrowing cost
              </p>
              <p className="mt-5 text-[15px] font-medium text-[#545454]">
                Cost of borrowing
              </p>
              <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-2">
                <p className="font-diatype tabular text-[26px] font-bold text-black">
                  {usd(position.dailyInterest)}
                  <span className="text-[15px] font-medium text-[#545454]">/day</span>
                </p>
                <p className="font-diatype tabular text-[26px] font-bold text-black">
                  {usd(position.monthlyInterest)}
                  <span className="text-[15px] font-medium text-[#545454]">/month</span>
                </p>
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-[#545454]">
                Interest only accrues while funds remain borrowed. Repay borrowed
                funds at any time.
              </p>
            </motion.section>

            <motion.section {...stagger(5)} className="mt-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#545454]">
                Risk
              </p>
              <p className="mt-5 text-[15px] font-medium text-[#545454]">
                If Bitcoin falls
              </p>
              <div className="mt-4 space-y-4">
                {outcomes.map((o) => {
                  const valueAfter = position.positionUsd * (1 - o.dropPct);

                  if (o.liquidation) {
                    return (
                      <div
                        key={o.dropPct}
                        className="rounded-2xl bg-black px-5 py-5 text-white"
                      >
                        <p className="text-[15px] font-semibold">
                          {liqPct}% decline
                        </p>
                        <p className="mt-2 text-[15px] leading-relaxed text-white/80">
                          Kraken may sell part or all of your position to repay
                          the loan.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div key={o.dropPct}>
                      <p className="text-[15px] font-semibold text-black">
                        {Math.round(o.dropPct * 100)}% decline
                      </p>
                      <p className="mt-1 text-[15px] text-[#545454]">
                        Position value ≈ {usd0(valueAfter)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          </>
        )}

        {!borrowing && (
          <motion.section {...stagger(3)} className="mt-10">
            <p className="text-[15px] font-medium text-[#545454]">Cash only</p>
            <p className="font-diatype tabular mt-1.5 text-[30px] font-bold tracking-tight text-black">
              {btcQty(position.quantity)} BTC
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-[#545454]">
              You're funding this purchase entirely with cash. No borrowing costs
              or liquidation risk.
            </p>
          </motion.section>
        )}
      </div>
    </FlowShell>
  );
}
