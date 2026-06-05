import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, ShieldCheck } from "lucide-react";
import {
  ACCOUNT,
  MARKET,
  creditBounds,
  MAX_PURCHASE,
  borrowingContext,
} from "../lib/margin";
import type { Position } from "../lib/margin";
import { usd0, btc } from "../lib/utils";
import { Slider } from "./ui/Slider";

interface Props {
  amount: number;
  credit: number;
  setAmount: (v: number) => void;
  setCredit: (v: number) => void;
  position: Position;
}

const cardClass =
  "flex flex-col rounded-xl bg-surface p-7 shadow-card sm:p-8";

function Eyebrow({ step, children }: { step: number; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/20 text-xs font-bold text-brand-300">
        {step}
      </span>
      <span className="text-sm font-medium text-ink-400">{children}</span>
    </div>
  );
}

function BigAmountInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const display = value ? value.toLocaleString("en-US") : "0";
  return (
    <div className="flex items-center justify-center text-ink-900">
      <span className="font-display text-4xl font-bold text-ink-300">$</span>
      <input
        value={value ? value.toLocaleString("en-US") : ""}
        onChange={(e) => {
          const digits = e.target.value.replace(/[^0-9]/g, "");
          onChange(Math.min(Number(digits || 0), MAX_PURCHASE));
        }}
        inputMode="numeric"
        placeholder="0"
        aria-label="Purchase amount"
        className="font-display bg-transparent text-center text-5xl font-bold tracking-tight outline-none placeholder:text-ink-300"
        style={{ width: `${Math.max(1, display.length) + 0.5}ch` }}
      />
    </div>
  );
}

function PurchaseAmountCard({
  amount,
  setAmount,
  position,
}: {
  amount: number;
  setAmount: (v: number) => void;
  position: Position;
}) {
  const chips = [1000, 2500, 5000, MAX_PURCHASE];
  return (
    <section className={cardClass}>
      <Eyebrow step={1}>How much do you want?</Eyebrow>
      <h2 className="mt-2 text-xl font-bold leading-snug tracking-tight text-ink-900">
        How much Bitcoin do you want to buy?
      </h2>

      <div className="mt-auto pt-8 text-center">
        <BigAmountInput value={amount} onChange={setAmount} />
        <p className="tabular mt-1.5 text-sm text-ink-400">
          ≈ {btc(position.quantity)} at {usd0(MARKET.btcPrice)}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {chips.map((c) => {
          const active = amount === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setAmount(c)}
              className={`rounded-[12px] px-3.5 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-brand-500 text-white"
                  : "bg-white/[0.05] text-ink-500 hover:bg-white/[0.1] hover:text-ink-700"
              }`}
            >
              {c === MAX_PURCHASE ? "Max" : usd0(c)}
            </button>
          );
        })}
      </div>

      <div className="mt-7 grid grid-cols-2 divide-x divide-white/[0.06] border-t border-white/[0.06] pt-4 text-center">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
            Available cash
          </div>
          <div className="tabular mt-0.5 text-sm font-medium text-ink-700">
            {usd0(ACCOUNT.cashBalance)}
          </div>
        </div>
        <div>
          <div className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
            Available credit
          </div>
          <div className="tabular mt-0.5 text-sm font-medium text-ink-700">
            {usd0(ACCOUNT.creditLimit)}
          </div>
        </div>
      </div>
    </section>
  );
}

function FundingCard({
  amount,
  credit,
  setCredit,
  position,
}: {
  amount: number;
  credit: number;
  setCredit: (v: number) => void;
  position: Position;
}) {
  const cash = position.cashCommitted;
  const bounds = creditBounds(amount);
  const cashPct = amount > 0 ? (cash / amount) * 100 : 0;
  const creditPct = amount > 0 ? (credit / amount) * 100 : 0;

  return (
    <section className={cardClass}>
      <Eyebrow step={2}>How are you paying?</Eyebrow>
      <h2 className="mt-2 text-xl font-bold leading-snug tracking-tight text-ink-900">
        How are you funding this purchase?
      </h2>

      {/* Stacked funding bar */}
      <div className="mt-7 flex h-4 w-full gap-1 overflow-hidden rounded-full">
        <motion.div
          className="h-full rounded-l-full bg-mint-400"
          style={{ borderRadius: creditPct === 0 ? 9999 : undefined }}
          animate={{ width: `${cashPct}%` }}
          transition={{ type: "spring", stiffness: 170, damping: 24 }}
        />
        <motion.div
          className="h-full rounded-r-full bg-brand-500"
          style={{ borderRadius: cashPct === 0 ? 9999 : undefined }}
          animate={{ width: `${creditPct}%` }}
          transition={{ type: "spring", stiffness: 170, damping: 24 }}
        />
      </div>

      {/* Two figures */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-mint-500/[0.08] p-4 ring-1 ring-mint-400/15">
          <div className="flex items-center gap-2 text-mint-300">
            <span className="h-2.5 w-2.5 rounded-full bg-mint-400" />
            <span className="text-sm font-medium">Your cash</span>
          </div>
          <div className="tabular mt-1.5 text-2xl font-semibold text-ink-900">
            {usd0(cash)}
          </div>
        </div>
        <div className="rounded-2xl bg-brand-500/[0.12] p-4 ring-1 ring-brand-400/20">
          <div className="flex items-center gap-2 text-brand-300">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />
            <span className="text-sm font-medium">Borrowed</span>
          </div>
          <div className="tabular mt-1.5 text-2xl font-semibold text-ink-900">
            {usd0(credit)}
          </div>
        </div>
      </div>

      {/* Borrow slider */}
      <div className="mt-auto pt-6">
        <div className="mb-2.5 text-sm font-medium text-ink-500">
          Amount to borrow
        </div>
        <Slider
          value={credit}
          min={bounds.min}
          max={bounds.max === bounds.min ? bounds.min + 1 : bounds.max}
          step={50}
          accent="brand"
          onChange={setCredit}
        />
        <div className="mt-2.5 flex justify-between text-xs text-ink-400">
          <span>Cash available {usd0(ACCOUNT.cashBalance)}</span>
          <span>Credit available {usd0(ACCOUNT.creditLimit)}</span>
        </div>
      </div>
    </section>
  );
}

function OutcomeCard({ position }: { position: Position }) {
  const borrowing = position.creditDrawn > 0;
  const context = borrowingContext(position);

  if (borrowing && context) {
    return (
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={context}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
          className="mt-4 flex items-center gap-4 rounded-xl bg-brand-600 p-6 shadow-float sm:mt-5 sm:p-7"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold leading-tight text-white sm:text-xl">
              {context}
            </p>
            <p className="tabular mt-1 text-sm text-white/70">
              {usd0(position.creditDrawn)} of this purchase is funded with
              credit.
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="mt-4 flex items-center gap-4 rounded-xl bg-mint-500/[0.1] p-6 ring-1 ring-mint-400/20 sm:mt-5 sm:p-7">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-mint-500 text-white">
        <ShieldCheck className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold leading-tight text-mint-300 sm:text-xl">
          You're buying with cash only.
        </p>
        <p className="mt-1 text-sm text-mint-400">
          No borrowing, no interest, and no risk of liquidation.
        </p>
      </div>
    </div>
  );
}

export function ConfigurePurchase({
  amount,
  credit,
  setAmount,
  setCredit,
  position,
}: Props) {
  return (
    <div>
      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2 lg:gap-5">
        <PurchaseAmountCard
          amount={amount}
          setAmount={setAmount}
          position={position}
        />
        <FundingCard
          amount={amount}
          credit={credit}
          setCredit={setCredit}
          position={position}
        />
      </div>

      <OutcomeCard position={position} />
    </div>
  );
}
