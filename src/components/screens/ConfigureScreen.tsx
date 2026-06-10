import { ACCOUNT, creditBounds, MAX_PURCHASE } from "../../lib/margin";
import type { Position } from "../../lib/margin";
import { btcQty, usd, usd0 } from "../../lib/utils";
import { AmountRuler } from "../ui/AmountRuler";
import { Slider } from "../ui/Slider";
import { ContinueButton } from "../ui/ContinueButton";

const MIN_AMOUNT = 500;

interface Props {
  amount: number;
  setAmount: (v: number) => void;
  credit: number;
  setCredit: (v: number) => void;
  position: Position;
  onContinue: () => void;
}

function FundingCard({
  label,
  amount: cardAmount,
  available,
}: {
  label: string;
  amount: number;
  available: number;
}) {
  return (
    <div className="flex flex-1 flex-col gap-2.5 rounded-xl bg-[#e3e3e3] px-3 py-4">
      <p className="text-[15px] font-medium text-black">{label}</p>
      <p className="font-diatype tabular text-[16px] font-medium text-black">
        {usd(cardAmount)}
      </p>
      <p className="tabular text-[13px] text-[#545454]">
        {usd(available, {
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
        })}{" "}
        available
      </p>
    </div>
  );
}

export function ConfigureScreen({
  amount,
  setAmount,
  setCredit,
  position,
  onContinue,
}: Props) {
  const cash = position.cashCommitted;
  const borrowed = position.creditDrawn;
  const bounds = creditBounds(amount);
  const qty = btcQty(position.quantity);

  return (
    <div className="flex h-full flex-col bg-[#e8e8e8] pt-[max(12px,env(safe-area-inset-top))] sm:pt-12">
      <div className="relative flex shrink-0 flex-col items-center px-5 pb-2">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-full max-w-sm -translate-x-1/2 -translate-y-1/3 blur-[56px]"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(255,255,255,0.9) 0%, rgba(220,208,255,0.75) 55%, rgba(186,161,255,0.5) 100%)",
          }}
        />
        <div className="relative z-10 w-full text-center">
          <h1 className="text-[17px] font-medium text-black">Buy Bitcoin</h1>
          <p className="mt-1 text-[15px] font-medium text-[#545454]">
            How much would you like to invest?
          </p>
        </div>
        <div className="relative z-10 mt-4 w-full">
          <AmountRuler
            value={amount}
            min={MIN_AMOUNT}
            max={MAX_PURCHASE}
            step={100}
            onChange={setAmount}
          />
        </div>
      </div>

      <div className="mt-auto flex min-h-0 flex-1 flex-col rounded-t-3xl bg-white px-6 pb-5 pt-7">
        <div>
          <h2 className="text-[17px] font-medium text-black">
            How are you funding this purchase?
          </h2>
          <p className="mt-1.5 text-[15px] leading-snug text-[#545454]">
            Use your available cash, credit line, or a combination of both.
          </p>
        </div>

        <div className="mt-5 flex gap-3">
          <FundingCard
            label="Cash"
            amount={cash}
            available={ACCOUNT.cashBalance}
          />
          <FundingCard
            label="Borrowed"
            amount={borrowed}
            available={ACCOUNT.creditLimit}
          />
        </div>

        <div className="mt-4">
          <Slider
            value={borrowed}
            min={bounds.min}
            max={bounds.max === bounds.min ? bounds.min + 1 : bounds.max}
            step={50}
            onChange={setCredit}
          />
        </div>

        <div className="mt-auto flex flex-col items-end gap-3 pt-6">
          <p className="w-full text-center text-[13px] text-[#545454]">
            <span className="font-medium text-black">{qty} BTC purchased</span>
            {borrowed > 0 && (
              <>
                <span className="text-[#c4c4c4]"> · </span>
                {usd0(borrowed)} funded with credit
              </>
            )}
          </p>
          <ContinueButton onClick={onContinue} disabled={amount <= 0}>
            Continue
          </ContinueButton>
        </div>
      </div>
    </div>
  );
}
