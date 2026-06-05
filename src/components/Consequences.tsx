import { motion } from "framer-motion";
import {
  Clock,
  TrendingDown,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { ACCOUNT, MARKET, MAX_PURCHASE, fallOutcomes } from "../lib/margin";
import type { Position } from "../lib/margin";
import { usd, usd0, btc } from "../lib/utils";

function SectionCard({
  icon,
  title,
  children,
  tone = "neutral",
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  tone?: "neutral" | "mint";
}) {
  const iconBg =
    tone === "mint"
      ? "bg-mint-500/15 text-mint-300"
      : "bg-brand-500/15 text-brand-300";
  return (
    <div className="rounded-xl bg-surface p-7 shadow-card">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-2xl ${iconBg}`}
        >
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-ink-900">{title}</h3>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function CostOfBorrowing({ position }: { position: Position }) {
  return (
    <SectionCard icon={<Clock className="h-5 w-5" />} title="The cost of borrowing">
      <p className="text-base text-ink-500">
        Borrowing{" "}
        <span className="font-semibold text-ink-900">
          {usd0(position.borrowed)}
        </span>{" "}
        costs approximately:
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white/[0.04] p-4 text-center">
          <div className="tabular text-2xl font-semibold text-ink-900">
            {usd(position.dailyInterest)}
          </div>
          <div className="mt-0.5 text-sm text-ink-400">per day</div>
        </div>
        <div className="rounded-2xl bg-white/[0.04] p-4 text-center">
          <div className="tabular text-2xl font-semibold text-ink-900">
            {usd(position.monthlyInterest)}
          </div>
          <div className="mt-0.5 text-sm text-ink-400">per month</div>
        </div>
      </div>
      <p className="mt-4 text-sm text-ink-400">
        Interest only applies while funds remain borrowed. Repay anytime to stop
        it.
      </p>
    </SectionCard>
  );
}

function IfBitcoinFalls({ position }: { position: Position }) {
  const outcomes = fallOutcomes(position);
  return (
    <SectionCard
      icon={<TrendingDown className="h-5 w-5" />}
      title="If Bitcoin falls"
    >
      <div className="space-y-2.5">
        {outcomes.map((o, i) => {
          const valueAfter = position.positionUsd * (1 - o.dropPct);
          return (
            <motion.div
              key={o.dropPct}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-3.5 rounded-2xl p-4 ${
                o.liquidation
                  ? "bg-danger-500/[0.12] ring-1 ring-danger-400/25"
                  : "bg-white/[0.04]"
              }`}
            >
              <span
                className={`tabular flex h-11 w-14 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${
                  o.liquidation
                    ? "bg-danger-500 text-white"
                    : "bg-white/[0.08] text-ink-900"
                }`}
              >
                −{Math.round(o.dropPct * 100)}%
              </span>
              <div className="min-w-0">
                <div
                  className={`text-xs font-medium ${
                    o.liquidation ? "text-danger-300" : "text-ink-400"
                  }`}
                >
                  If Bitcoin falls {Math.round(o.dropPct * 100)}%
                </div>
                <div
                  className={`mt-0.5 text-sm font-medium ${
                    o.liquidation ? "text-danger-300" : "text-ink-700"
                  }`}
                >
                  {o.liquidation ? (
                    "Kraken may automatically sell your position to repay the loan"
                  ) : (
                    <>
                      Position value falls to approximately{" "}
                      <span className="font-semibold text-ink-900">
                        {usd0(valueAfter)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      <p className="mt-4 text-sm text-ink-400">
        Because you borrowed, these losses come out of your own cash first.
      </p>
    </SectionCard>
  );
}

function CompareRow({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "good" | "warn" | "danger";
}) {
  const valueTone =
    tone === "good"
      ? "text-mint-300"
      : tone === "danger"
        ? "text-danger-300"
        : tone === "warn"
          ? "text-ink-900"
          : "text-ink-900";
  return (
    <div className="flex items-center justify-between gap-2 py-2">
      <span className="text-xs font-medium text-ink-400">{label}</span>
      <span className={`text-right text-sm font-semibold ${valueTone}`}>
        {value}
      </span>
    </div>
  );
}

function CashVsCredit({ position }: { position: Position }) {
  const cashBtc = position.cashCommitted / MARKET.btcPrice;
  const liqPct = Math.round(position.liquidationDropPct * 100);

  return (
    <SectionCard icon={<Scale className="h-5 w-5" />} title="Cash vs Credit">
      <div className="grid grid-cols-2 gap-3">
        {/* Cash only */}
        <div className="rounded-2xl bg-white/[0.04] p-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-mint-400" />
            <span className="text-sm font-semibold text-ink-700">
              Cash only
            </span>
          </div>
          <div className="mt-3">
            <div className="text-xs font-medium text-ink-400">You can buy</div>
            <div className="tabular mt-0.5 text-2xl font-semibold text-ink-700">
              {btc(cashBtc)}
            </div>
          </div>
          <div className="mt-3 divide-y divide-white/[0.06] border-t border-white/[0.06]">
            <CompareRow label="Interest" value="None" tone="good" />
            <CompareRow label="Liquidation risk" value="None" tone="good" />
          </div>
        </div>

        {/* Cash + Credit */}
        <div className="rounded-2xl bg-brand-500/[0.12] p-4 ring-1 ring-brand-400/25">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />
            <span className="text-sm font-semibold text-brand-300">
              Cash + Credit
            </span>
          </div>
          <div className="mt-3">
            <div className="text-xs font-medium text-brand-300">You can buy</div>
            <div className="tabular mt-0.5 text-2xl font-semibold text-ink-900">
              {btc(position.quantity)}
            </div>
          </div>
          <div className="mt-3 divide-y divide-white/[0.08] border-t border-white/[0.08]">
            <CompareRow
              label="Interest"
              value={`${usd(position.monthlyInterest)}/mo`}
            />
            <CompareRow
              label="Liquidation risk"
              value={`If BTC falls ${liqPct}%`}
              tone="danger"
            />
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm text-ink-400">
        Using credit lets you buy more Bitcoin today, but introduces borrowing
        costs and liquidation risk.
      </p>
    </SectionCard>
  );
}

export function Consequences({ position }: { position: Position }) {
  const borrowing = position.creditDrawn > 0;
  const maxBtc = MAX_PURCHASE / MARKET.btcPrice;

  return (
    <section className="mt-6">
      <div className="mb-5 px-1">
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink-900">
          {borrowing ? "Before you borrow" : "Paying with cash"}
        </h2>
      </div>

      {borrowing ? (
        <div className="space-y-4">
          <CostOfBorrowing position={position} />
          <IfBitcoinFalls position={position} />
          <CashVsCredit position={position} />
        </div>
      ) : (
        <SectionCard
          icon={<ShieldCheck className="h-5 w-5" />}
          title="You're paying with cash"
          tone="mint"
        >
          <p className="text-base leading-relaxed text-ink-500">
            You'll own your Bitcoin outright. There's no interest to pay and no
            risk of your position being sold — whatever happens to the price,
            it's yours to hold.
          </p>
          <p className="mt-4 rounded-2xl bg-white/[0.04] p-4 text-sm text-ink-500">
            Want more Bitcoin? Drawing from your{" "}
            {usd0(ACCOUNT.creditLimit)} credit line could let you buy up to{" "}
            <span className="font-semibold text-ink-900">{btc(maxBtc)}</span>.
          </p>
        </SectionCard>
      )}
    </section>
  );
}
