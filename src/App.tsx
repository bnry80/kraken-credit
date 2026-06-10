import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";
import { PhoneFrame } from "./components/phone/PhoneFrame";
import { ConfigureScreen } from "./components/screens/ConfigureScreen";
import { UnderstandScreen } from "./components/screens/UnderstandScreen";
import { ReviewScreen } from "./components/screens/ReviewScreen";
import { SuccessSheet } from "./components/screens/SuccessSheet";
import { buildPosition, clampCredit, MAX_PURCHASE } from "./lib/margin";
import { ease, slide } from "./lib/motion";

const STEPS = ["configure", "understand", "review"] as const;
type Step = (typeof STEPS)[number] | "success";

export default function App() {
  const [amount, setAmountState] = useState(3000);
  const [credit, setCreditState] = useState(1500);
  const [step, setStep] = useState<Step>("configure");
  const [direction, setDirection] = useState(1);

  const setAmount = (v: number) => {
    const a = Math.min(Math.max(0, v), MAX_PURCHASE);
    setAmountState(a);
    setCreditState((c) => clampCredit(a, c));
  };
  const setCredit = (v: number) => setCreditState(clampCredit(amount, v));

  const position = buildPosition({
    cashCommitted: amount - clampCredit(amount, credit),
    creditDrawn: clampCredit(amount, credit),
  });

  const goTo = (next: Step) => {
    if (next === "success") {
      setStep("success");
      return;
    }
    const cur = STEPS.indexOf(step as (typeof STEPS)[number]);
    const nxt = STEPS.indexOf(next);
    setDirection(nxt >= cur ? 1 : -1);
    setStep(next);
  };

  const back = () => {
    const idx = STEPS.indexOf(step as (typeof STEPS)[number]);
    if (idx > 0) goTo(STEPS[idx - 1]);
  };

  const reset = () => {
    setStep("configure");
    setDirection(-1);
    setAmountState(3000);
    setCreditState(1500);
  };

  const flowStep = step === "success" ? "review" : step;

  return (
    <PhoneFrame>
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
              key={flowStep}
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.38, ease }}
              className="absolute inset-0"
            >
              {flowStep === "configure" && (
                <ConfigureScreen
                  amount={amount}
                  setAmount={setAmount}
                  credit={position.creditDrawn}
                  setCredit={setCredit}
                  position={position}
                  onContinue={() => goTo("understand")}
                />
              )}
              {flowStep === "understand" && (
                <UnderstandScreen
                  position={position}
                  onContinue={() => goTo("review")}
                  onBack={back}
                />
              )}
              {flowStep === "review" && (
                <ReviewScreen
                  position={position}
                  onConfirm={() => goTo("success")}
                  onBack={back}
                />
              )}
            </motion.div>
        </AnimatePresence>

        <SuccessSheet
          open={step === "success"}
          position={position}
          onDone={reset}
        />
      </div>
      <Analytics />
    </PhoneFrame>
  );
}
