import { useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { PhoneFrame } from "./components/phone/PhoneFrame";
import { NavStack } from "./components/phone/NavStack";
import { BuildScreen } from "./components/screens/BuildScreen";
import { ReviewScreen } from "./components/screens/ReviewScreen";
import { SuccessScreen } from "./components/screens/SuccessScreen";
import { buildPosition, clampCredit, MAX_PURCHASE } from "./lib/margin";
import { clamp } from "./lib/utils";

type Step = "build" | "review" | "success";

export default function App() {
  const [amount, setAmountState] = useState(3000);
  const [credit, setCreditState] = useState(1500);
  const [stack, setStack] = useState<Step[]>(["build", "review", "success"]);

  const drawn = clampCredit(amount, credit);
  const position = buildPosition({
    cashCommitted: amount - drawn,
    creditDrawn: drawn,
  });

  const push = (next: Step) => setStack((s) => [...s, next]);
  const pop = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));

  const setAmount = (next: number) => {
    const a = clamp(Math.round(next), 0, MAX_PURCHASE);
    setAmountState(a);
    setCreditState((c) => clampCredit(a, c));
  };

  const setCredit = (next: number) => {
    setCreditState(clampCredit(amount, next));
  };

  const reset = () => {
    setAmountState(3000);
    setCreditState(1500);
    setStack(["build"]);
  };

  const renderStep = (step: Step) => {
    switch (step) {
      case "build":
        return (
          <BuildScreen
            amount={amount}
            credit={drawn}
            onAmountChange={setAmount}
            onCreditChange={setCredit}
            onContinue={() => push("review")}
          />
        );
      case "review":
        return (
          <ReviewScreen
            position={position}
            onConfirm={() => push("success")}
            onBack={pop}
          />
        );
      case "success":
        return <SuccessScreen position={position} onDone={reset} />;
    }
  };

  return (
    <PhoneFrame>
      <NavStack stack={stack} renderStep={renderStep} onPop={pop} />
      <Analytics />
    </PhoneFrame>
  );
}
