import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { ACCOUNT, MARKET, MAX_PURCHASE, clampCredit } from "../../lib/margin";
import { btcQty, usd, usd0 } from "../../lib/utils";
import { fadeItem, riseItem, sceneStagger } from "../../lib/motion";
import { FloatingCoins } from "../ui/FloatingCoins";
import { FundingSlider } from "../ui/FundingSlider";
import { Keypad } from "../ui/Keypad";
import { Pressable } from "../ui/Pressable";

interface Props {
  amount: number;
  credit: number;
  onAmountChange: (next: number) => void;
  onCreditChange: (next: number) => void;
  onContinue: () => void;
}

export function BuildScreen({
  amount,
  credit,
  onAmountChange,
  onCreditChange,
  onContinue,
}: Props) {
  const reduce = useReducedMotion();
  const item = reduce ? fadeItem : riseItem;

  const [keypadOpen, setKeypadOpen] = useState(false);
  const [entry, setEntry] = useState("");

  const drawn = clampCredit(amount, credit);
  const cash = amount - drawn;

  const openKeypad = () => {
    // Start with a fresh buffer so the first digit replaces the current amount
    // instead of appending to it.
    setEntry("");
    setKeypadOpen(true);
  };

  const commitEntry = (next: string) => {
    const n = Math.min(MAX_PURCHASE, Math.max(0, parseInt(next || "0", 10)));
    setEntry(String(n));
    onAmountChange(n);
  };

  return (
    <div className="relative h-full overflow-hidden bg-white">
      <FloatingCoins className="absolute left-[-16px] top-[289px] z-0" />

      <motion.div
        variants={sceneStagger}
        initial="hidden"
        animate="show"
        className="relative z-10 flex h-full flex-col"
      >
        {/* Header */}
        <div className="flex flex-col gap-[30px] px-[28px] pt-[84px]">
          <motion.div variants={item} className="flex flex-col gap-[20px]">
            <p className="text-[18px] font-medium tracking-[-0.04em] text-black">
              Buy Bitcoin
            </p>
            <p className="w-[168px] text-[20px] font-medium tracking-[-0.04em] text-[#7f7f7f]">
              How much would you like to buy?
            </p>
          </motion.div>

          <motion.div variants={item}>
            <Pressable
              onClick={openKeypad}
              haptic="selection"
              scale={0.985}
              dim={false}
              className="flex flex-col items-start gap-[30px]"
              ariaLabel="Edit amount"
            >
              <span className="text-trim tabular font-diatype text-[80px] font-medium tracking-[-0.03em] text-black">
                {usd0(amount)}
              </span>
              <span className="text-trim text-[20px] font-medium tracking-[-0.04em] text-[#7f7f7f]">
                ≈ {btcQty(amount / MARKET.btcPrice)} BTC
              </span>
            </Pressable>
          </motion.div>
        </div>

        <div className="flex-1" />

        {/* Funding mix card */}
        <motion.div
          variants={item}
          className="mx-2 mb-2 flex flex-col gap-[30px] overflow-clip rounded-[54px] border border-[#7a2eff] bg-[#f4f4f7] pb-[24px] pt-[30px] shadow-[0_23px_32.2px_rgba(0,0,0,0.16)]"
        >
          <div className="flex flex-col gap-[24px]">
            <div className="flex flex-col gap-[8px] px-[24px]">
              <p className="text-[20px] font-medium tracking-[-0.04em] text-black">
                Choose your funding mix
              </p>
              <p className="text-[16px] font-medium tracking-[-0.04em] text-[#7f7f7f]">
                Use cash, credit, or both.
              </p>
            </div>

            <div className="flex gap-[30px] px-[24px]">
              <FundingCard
                label="Cash"
                value={usd(cash)}
                available={`${usd0(ACCOUNT.cashBalance)} available`}
              />
              <FundingCard
                label="Credit"
                value={usd(drawn)}
                available={`${usd0(ACCOUNT.creditLimit)} available`}
              />
            </div>

            <div className="px-[24px]">
              <FundingSlider
                amount={amount}
                credit={drawn}
                onChange={onCreditChange}
              />
            </div>
          </div>

          <div className="flex justify-end px-[24px]">
            <Pressable
              onClick={onContinue}
              disabled={amount <= 0}
              haptic="medium"
              scale={0.96}
              className="group flex items-center gap-[10px] rounded-[40px] bg-black px-[28px] py-[20px] text-[16px] font-medium tracking-[-0.04em] text-white"
            >
              Continue
              <ArrowRight
                className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={2}
              />
            </Pressable>
          </div>
        </motion.div>
      </motion.div>

      <Keypad
        open={keypadOpen}
        onKey={(d) => commitEntry(entry + d)}
        onDelete={() => commitEntry(entry.slice(0, -1))}
        onDone={() => setKeypadOpen(false)}
        onClose={() => setKeypadOpen(false)}
      />
    </div>
  );
}

function FundingCard({
  label,
  value,
  available,
}: {
  label: string;
  value: string;
  available: string;
}) {
  return (
    <div className="flex flex-1 flex-col gap-[12px] rounded-[12px] border border-[#f9f9f9] bg-white p-[16px]">
      <p className="text-[16px] font-medium tracking-[-0.04em] text-[#11161c]">
        {label}
      </p>
      <p className="text-trim tabular font-diatype text-[16px] font-medium text-[#7a2eff]">
        {value}
      </p>
      <p className="text-trim text-[13px] font-normal tracking-[-0.04em] text-[#545454]">
        {available}
      </p>
    </div>
  );
}
