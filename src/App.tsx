import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Nav } from "./components/Nav";
import { ConfigurePurchase } from "./components/ConfigurePurchase";
import { Consequences } from "./components/Consequences";
import { ReviewDialog } from "./components/ReviewDialog";
import { buildPosition, clampCredit, MAX_PURCHASE } from "./lib/margin";
import { usd0 } from "./lib/utils";

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

export default function App() {
  const [amount, setAmountState] = useState(3000);
  const [credit, setCreditState] = useState(1500);
  const [reviewOpen, setReviewOpen] = useState(false);

  const setAmount = (v: number) => {
    const a = Math.min(Math.max(0, v), MAX_PURCHASE);
    setAmountState(a);
    setCreditState((c) => clampCredit(a, c));
  };
  const setCredit = (v: number) => setCreditState(clampCredit(amount, v));

  const cash = amount - clampCredit(amount, credit);
  const position = buildPosition({
    cashCommitted: cash,
    creditDrawn: clampCredit(amount, credit),
  });

  const borrowing = position.creditDrawn > 0;

  return (
    <div className="min-h-screen">
      <Nav />

      <main className="mx-auto max-w-[1200px] px-2.5 pb-40 pt-8 sm:px-10 sm:pt-12">
        <motion.div {...fade} className="mb-7 px-1">
          <h1 className="font-display text-[30px] font-black leading-tight tracking-tight text-ink-900 sm:text-[38px]">
            Cash or credit?
          </h1>
          <p className="mt-2 text-base leading-relaxed text-ink-400">
            Decide how to pay for your Bitcoin — use your own cash, or borrow
            from your credit line to buy more.
          </p>
        </motion.div>

        <motion.div {...fade} transition={{ ...fade.transition, delay: 0.05 }}>
          <ConfigurePurchase
            amount={amount}
            credit={position.creditDrawn}
            setAmount={setAmount}
            setCredit={setCredit}
            position={position}
          />
        </motion.div>

        <motion.div {...fade} transition={{ ...fade.transition, delay: 0.1 }}>
          <Consequences position={position} />
        </motion.div>

        <p className="mt-6 px-1 text-center text-xs leading-relaxed text-ink-300">
          Prototype with illustrative figures. Bitcoin price, an 8.5% borrow
          rate, and credit terms are mocked. Not financial advice.
        </p>
      </main>

      {/* Persistent commitment bar — the primary action stays in reach */}
      <AnimatePresence>
        {!reviewOpen && (
          <motion.div
            initial={{ y: 32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 32, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-30 bg-bg/80 shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.85)] backdrop-blur-xl"
          >
            <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-2.5 py-4 sm:gap-4 sm:px-10">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-ink-400">You're buying</p>
                <p className="tabular truncate text-lg font-semibold text-ink-900">
                  {usd0(amount)} of BTC
                  {borrowing && (
                    <span className="font-medium text-ink-400">
                      {" "}
                      · {usd0(position.creditDrawn)} borrowed
                    </span>
                  )}
                </p>
              </div>
              <button
                type="button"
                disabled={amount <= 0}
                onClick={() => setReviewOpen(true)}
                className="group inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-[12px] bg-brand-500 px-4 py-[15px] text-base font-medium leading-[22px] text-white transition-colors hover:bg-brand-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
              >
                <span className="hidden xs:inline">Review purchase</span>
                <span className="xs:hidden">Review</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ReviewDialog
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        position={position}
      />
    </div>
  );
}
