export function calculateSimpleReturn(entry: number, exit: number): number {
  if (entry === 0) return 0;
  return ((exit - entry) / entry) * 100;
}

export function calculatePositionSize(
  portfolioBalance: number,
  riskPct: number,
  entryPrice: number,
  stopLoss: number
): { shares: number; dollarAmount: number; portfolioPct: number } {
  const riskPerShare = Math.abs(entryPrice - stopLoss);
  if (riskPerShare === 0) {
    const dollarAmount = portfolioBalance * riskPct;
    const shares = Math.floor(dollarAmount / entryPrice);
    return {
      shares,
      dollarAmount: shares * entryPrice,
      portfolioPct: (shares * entryPrice) / portfolioBalance,
    };
  }

  const riskDollars = portfolioBalance * riskPct;
  const shares = Math.floor(riskDollars / riskPerShare);
  const dollarAmount = shares * entryPrice;
  const portfolioPct = dollarAmount / portfolioBalance;

  return { shares, dollarAmount, portfolioPct };
}

export function calculateRiskReward(
  entry: number,
  stopLoss: number,
  takeProfit: number
): { riskDollars: number; rewardDollars: number; ratio: number } {
  const riskDollars = Math.abs(entry - stopLoss);
  const rewardDollars = Math.abs(takeProfit - entry);
  const ratio = riskDollars > 0 ? rewardDollars / riskDollars : 0;

  return { riskDollars, rewardDollars, ratio };
}
