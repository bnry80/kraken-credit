import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { Check, Bitcoin, X, AlertTriangle } from "lucide-react";
import type { Position } from "../lib/margin";
import { usd, usd0, btc } from "../lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position: Position;
}

export function ReviewDialog({ open, onOpenChange, position }: Props) {
  const [confirmed, setConfirmed] = useState(false);
  const borrowing = position.creditDrawn > 0;

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setConfirmed(false), 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 focus:outline-none"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="max-h-[92vh] overflow-y-auto rounded-xl bg-surface p-7 shadow-card"
          >
            {!confirmed ? (
              <>
                <div className="flex items-center justify-between">
                  <Dialog.Title className="text-sm font-medium text-ink-400">
                    Review your purchase
                  </Dialog.Title>
                  <Dialog.Close className="flex h-8 w-8 items-center justify-center rounded-full text-ink-300 transition-colors hover:bg-white/[0.06] hover:text-ink-500">
                    <X className="h-4 w-4" />
                  </Dialog.Close>
                </div>

                <div className="mt-5 flex flex-col items-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400">
                    <Bitcoin className="h-7 w-7" />
                  </div>
                  <p className="mt-4 text-sm text-ink-400">
                    You're about to buy
                  </p>
                  <p className="tabular font-display mt-1 text-3xl font-bold tracking-tight text-ink-900">
                    {btc(position.quantity)}
                  </p>
                  <p className="tabular text-sm text-ink-400">
                    ≈ {usd0(position.positionUsd)}
                  </p>
                </div>

                <Label>Funded by</Label>
                <div className="space-y-px overflow-hidden rounded-2xl bg-white/[0.07]">
                  <Row label="Cash" value={usd0(position.cashCommitted)} />
                  {borrowing && (
                    <Row
                      label="Borrowed"
                      value={usd0(position.creditDrawn)}
                      accent
                    />
                  )}
                </div>

                {borrowing ? (
                  <>
                    <Label>Borrowing cost</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-white/[0.04] p-3.5 text-center">
                        <div className="tabular text-lg font-semibold text-ink-900">
                          {usd(position.dailyInterest)}
                        </div>
                        <div className="text-xs text-ink-400">per day</div>
                      </div>
                      <div className="rounded-2xl bg-white/[0.04] p-3.5 text-center">
                        <div className="tabular text-lg font-semibold text-ink-900">
                          {usd(position.monthlyInterest)}
                        </div>
                        <div className="text-xs text-ink-400">per month</div>
                      </div>
                    </div>

                    <Label>Liquidation threshold</Label>
                    <div className="flex items-center gap-3.5 rounded-2xl bg-danger-500/[0.12] p-4 ring-1 ring-danger-400/30">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-danger-500 text-white">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="tabular text-base font-semibold text-danger-300">
                          {`BTC falls ${Math.round(position.liquidationDropPct * 100)}%`}
                        </p>
                        <p className="mt-0.5 text-sm text-ink-500">
                          Kraken may automatically sell your position to repay
                          the loan.
                        </p>
                      </div>
                    </div>

                    <Label>Important tradeoffs</Label>
                    <ul className="space-y-2.5 rounded-2xl bg-brand-500/[0.1] p-4 text-sm text-ink-500 ring-1 ring-brand-400/15">
                      <li className="flex items-start gap-2.5">
                        <Dot /> Interest accrues while funds remain borrowed
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Dot /> Borrowing increases both potential gains and
                        potential losses
                      </li>
                    </ul>
                  </>
                ) : (
                  <div className="mt-4 rounded-2xl bg-mint-500/[0.1] p-4 text-sm text-mint-300 ring-1 ring-mint-400/15">
                    Paid fully with cash — no interest and no risk of your
                    position being sold. It's yours to hold.
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <Dialog.Close className="flex-1 rounded-[12px] bg-brand-500/[0.14] py-[15px] text-base font-medium leading-[22px] text-brand-300 transition-colors hover:bg-brand-500/[0.22]">
                    Go back
                  </Dialog.Close>
                  <button
                    type="button"
                    onClick={() => setConfirmed(true)}
                    className="flex-[1.4] rounded-[12px] bg-brand-500 py-[15px] text-base font-medium leading-[22px] text-white transition-colors hover:bg-brand-600 active:scale-[0.99]"
                  >
                    {borrowing ? "Buy with Credit" : "Buy with Cash"}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center py-4 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-mint-500 text-white"
                >
                  <Check className="h-8 w-8" strokeWidth={3} />
                </motion.div>
                <h3 className="mt-5 text-xl font-bold text-ink-900">
                  Purchase complete
                </h3>
                <p className="tabular mt-1 text-sm text-ink-400">
                  You bought {btc(position.quantity)}
                </p>
                {borrowing && (
                  <p className="mt-4 rounded-full bg-brand-500/15 px-4 py-1.5 text-xs font-medium text-brand-300">
                    {usd0(position.creditDrawn)} borrowed · interest accrues
                    daily
                  </p>
                )}
                <Dialog.Close className="mt-6 w-full rounded-[12px] bg-brand-500 py-[15px] text-base font-medium leading-[22px] text-white transition-colors hover:bg-brand-600">
                  Done
                </Dialog.Close>
              </div>
            )}
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between bg-surface px-4 py-3.5">
      <div className="flex items-center gap-2.5">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            accent ? "bg-brand-500" : "bg-mint-400"
          }`}
        />
        <span className="text-sm text-ink-500">{label}</span>
      </div>
      <span className="tabular text-sm font-semibold text-ink-900">{value}</span>
    </div>
  );
}

function Dot() {
  return (
    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-ink-400">
      {children}
    </p>
  );
}
