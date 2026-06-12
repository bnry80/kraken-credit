import type { Position } from "../../lib/margin";
import { btcQty, usd, usd0 } from "../../lib/utils";

export function ReceiptCard({ position }: { position: Position }) {
  const liqPct = Math.round(position.liquidationDropPct * 100);

  return (
    <div className="flex w-full flex-col items-center gap-[16px] rounded-[16px] border border-[#f9f9f9] bg-white p-[16px]">
      <div className="flex flex-col items-center gap-[2px]">
        <p className="text-[16px] font-medium tracking-[-0.04em] text-black">
          You&apos;ll receive
        </p>
        <p className="tabular text-[24px] font-semibold tracking-[-0.04em] text-[#7a2eff]">
          {btcQty(position.quantity)} BTC
        </p>
      </div>

      <div className="flex w-full flex-col gap-[11px]">
        <Row label="Cash" value={usd0(position.cashCommitted)} />
        <Row label="Borrowed" value={usd0(position.creditDrawn)} />
        <div className="h-px w-full bg-[#e9e9ef]" />
        <RowStacked
          label="Borrowing cost"
          top={`${usd(position.dailyInterest)} / day`}
          bottom={`${usd(position.monthlyInterest)} / month`}
        />
        <RowStacked
          label="Liquidation threshold"
          top={`-${liqPct}%`}
          bottom="Approx."
        />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex w-full items-center justify-between">
      <p className="text-[14px] font-medium tracking-[-0.04em] text-black">
        {label}
      </p>
      <p className="tabular text-[13px] font-medium tracking-[-0.04em] text-black">
        {value}
      </p>
    </div>
  );
}

function RowStacked({
  label,
  top,
  bottom,
}: {
  label: string;
  top: string;
  bottom: string;
}) {
  return (
    <div className="flex w-full items-center justify-between">
      <p className="text-[14px] font-medium tracking-[-0.04em] text-black">
        {label}
      </p>
      <div className="flex flex-col items-end">
        <p className="tabular text-[13px] font-medium tracking-[-0.04em] text-black">
          {top}
        </p>
        <p className="tabular text-[13px] font-medium tracking-[-0.04em] text-[#7f7f7f]">
          {bottom}
        </p>
      </div>
    </div>
  );
}
