// ---------------------------------------------------------------------------
// Mock account + market assumptions for the credit-line margin prototype.
// All values are illustrative. Clean BTC price keeps the math easy to follow.
// ---------------------------------------------------------------------------

export const ACCOUNT = {
  holderName: "Justin Greene",
  cashBalance: 2500, // USD collateral available to commit
  creditLimit: 5000, // approved credit line
  creditUsed: 0, // pre-existing drawn credit
};

export const MARKET = {
  btcPrice: 100_000, // current BTC/USD (mocked to a round number)
  borrowApr: 0.085, // annual interest rate on borrowed funds
  maintenanceMarginRate: 0.2, // equity must stay above 20% of position value
};

export interface PositionInput {
  cashCommitted: number; // user's own money put into the trade
  creditDrawn: number; // amount borrowed from the credit line
  price?: number; // entry price (defaults to current market)
}

export interface Position {
  cashCommitted: number;
  creditDrawn: number;
  entryPrice: number;
  positionUsd: number; // total size purchased
  quantity: number; // BTC bought
  borrowed: number;
  equity: number; // user's capital at entry
  leverage: number; // positionUsd / cashCommitted
  liquidationPrice: number; // price at which equity hits maintenance margin
  liquidationDropPct: number; // how far BTC must fall to liquidate
  dailyInterest: number;
  monthlyInterest: number;
  yearlyInterest: number;
  creditAvailableAfter: number;
}

export function buildPosition(input: PositionInput): Position {
  const entryPrice = input.price ?? MARKET.btcPrice;
  const cashCommitted = Math.max(0, input.cashCommitted);
  const creditDrawn = Math.max(0, input.creditDrawn);

  const positionUsd = cashCommitted + creditDrawn;
  const quantity = positionUsd / entryPrice;
  const borrowed = creditDrawn;
  const equity = cashCommitted;
  const leverage = cashCommitted > 0 ? positionUsd / cashCommitted : 0;

  // Liquidation: equity = mmr * positionValue
  //   qty*P - borrowed = mmr * qty * P  =>  P = borrowed / (qty * (1 - mmr))
  const liquidationPrice =
    borrowed > 0 && quantity > 0
      ? borrowed / (quantity * (1 - MARKET.maintenanceMarginRate))
      : 0;
  const liquidationDropPct =
    liquidationPrice > 0 ? (entryPrice - liquidationPrice) / entryPrice : 1;

  const yearlyInterest = borrowed * MARKET.borrowApr;
  const dailyInterest = yearlyInterest / 365;
  const monthlyInterest = dailyInterest * 30;

  return {
    cashCommitted,
    creditDrawn,
    entryPrice,
    positionUsd,
    quantity,
    borrowed,
    equity,
    leverage,
    liquidationPrice,
    liquidationDropPct,
    dailyInterest,
    monthlyInterest,
    yearlyInterest,
    creditAvailableAfter: ACCOUNT.creditLimit - ACCOUNT.creditUsed - creditDrawn,
  };
}

// Valid borrow range for a purchase amount: you can borrow up to the credit
// limit (or the whole amount), and must borrow at least the part your cash
// can't cover.
export function creditBounds(amount: number) {
  const max = Math.min(amount, ACCOUNT.creditLimit);
  const min = Math.max(0, amount - ACCOUNT.cashBalance);
  return { min, max };
}

export function clampCredit(amount: number, credit: number): number {
  const { min, max } = creditBounds(amount);
  return Math.min(Math.max(credit, min), max);
}

export const MAX_PURCHASE = ACCOUNT.cashBalance + ACCOUNT.creditLimit;

// Translate the borrow amount into a plain-language outcome about buying power,
// so users understand impact rather than just the dollar figure.
export function borrowingContext(pos: Position): string | null {
  const { cashCommitted: cash, creditDrawn: credit, positionUsd: amount } = pos;
  if (credit <= 0) return null;
  if (cash <= 0) return "This purchase is funded entirely with credit.";

  const creditShare = credit / amount;
  if (creditShare >= 0.66)
    return "Most of this purchase is being funded with credit.";

  const increase = credit / cash; // fractional lift in buying power
  if (increase >= 0.9 && increase <= 1.1)
    return "You're doubling your buying power.";

  const pct = Math.round((increase * 100) / 5) * 5;
  return `You're increasing your buying power by ${pct}%.`;
}

export interface FallOutcome {
  dropPct: number; // e.g. 0.10
  newPrice: number;
  loss: number; // absolute $ loss on the position before liquidation
  liquidation: boolean;
}

// Plain-language "what if BTC falls" rows. Standard drops are only shown while
// they stay above the liquidation threshold; the liquidation point is always
// surfaced as its own outcome.
export function fallOutcomes(
  pos: Position,
  drops: number[] = [0.1, 0.2],
): FallOutcome[] {
  const liqDrop = pos.liquidationDropPct;
  const rows: FallOutcome[] = drops
    .filter((d) => !pos.borrowed || d < liqDrop - 1e-9)
    .map((d) => ({
      dropPct: d,
      newPrice: pos.entryPrice * (1 - d),
      loss: pos.positionUsd * d,
      liquidation: false,
    }));

  if (pos.borrowed > 0 && liqDrop > 0 && liqDrop < 1) {
    rows.push({
      dropPct: liqDrop,
      newPrice: pos.liquidationPrice,
      loss: pos.equity,
      liquidation: true,
    });
  }
  return rows;
}
