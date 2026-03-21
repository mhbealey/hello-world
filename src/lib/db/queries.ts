import { prisma } from "./client";

// ---- UserProfile ----
export async function getProfile() {
  return prisma.userProfile.findFirst();
}

export async function upsertProfile(data: {
  investing_style: string;
  risk_tolerance: number;
  instruments: string;
  portfolio_size_range: string;
  portfolio_balance: number;
  archetype: string;
  risk_score: number;
}) {
  const existing = await prisma.userProfile.findFirst();
  if (existing) {
    return prisma.userProfile.update({
      where: { id: existing.id },
      data: { ...data, portfolio_balance_updated_at: new Date() },
    });
  }
  return prisma.userProfile.create({
    data: { ...data, portfolio_balance_updated_at: new Date() },
  });
}

// ---- Recommendations ----
export async function getRecommendations(filter?: {
  status?: string;
  rating?: string;
  sort?: string;
}) {
  const where: Record<string, unknown> = {};
  if (filter?.status) where.status = filter.status;
  if (filter?.rating) where.rating = filter.rating;

  const orderBy: Record<string, string> = {};
  if (filter?.sort === "confidence") orderBy.confidence = "desc";
  else if (filter?.sort === "time_sensitivity") orderBy.time_sensitivity = "asc";
  else orderBy.ai_score = "desc";

  return prisma.recommendation.findMany({ where, orderBy });
}

export async function createRecommendation(data: Parameters<typeof prisma.recommendation.create>[0]["data"]) {
  return prisma.recommendation.create({ data });
}

export async function updateRecommendation(id: number, data: Parameters<typeof prisma.recommendation.update>[0]["data"]) {
  return prisma.recommendation.update({ where: { id }, data });
}

export async function getRecommendationById(id: number) {
  return prisma.recommendation.findUnique({ where: { id } });
}

// ---- Trades ----
export async function getTrades(filter?: { status?: string; ticker?: string }) {
  const where: Record<string, unknown> = {};
  if (filter?.status) where.status = filter.status;
  if (filter?.ticker) where.ticker = filter.ticker;
  return prisma.trade.findMany({ where, orderBy: { created_at: "desc" } });
}

export async function createTrade(data: Parameters<typeof prisma.trade.create>[0]["data"]) {
  return prisma.trade.create({ data });
}

export async function updateTrade(id: number, data: Parameters<typeof prisma.trade.update>[0]["data"]) {
  return prisma.trade.update({ where: { id }, data });
}

export async function closeTrade(
  id: number,
  exitData: { exit_price: number; exit_date: Date; shares_to_close?: number }
) {
  const trade = await prisma.trade.findUnique({ where: { id } });
  if (!trade) throw new Error("Trade not found");

  const returnPct = ((exitData.exit_price - trade.entry_price) / trade.entry_price) * 100;
  const returnDollars = (exitData.exit_price - trade.entry_price) * trade.shares;

  const actualRr = trade.stop_loss && trade.take_profit
    ? Math.abs(exitData.exit_price - trade.entry_price) / Math.abs(trade.entry_price - trade.stop_loss)
    : null;

  if (exitData.shares_to_close && exitData.shares_to_close < trade.shares) {
    await prisma.trade.create({
      data: {
        ticker: trade.ticker,
        action: "sell",
        shares: exitData.shares_to_close,
        entry_price: trade.entry_price,
        exit_price: exitData.exit_price,
        exit_date: exitData.exit_date,
        order_type: trade.order_type,
        status: "closed",
        return_pct: returnPct,
        return_dollars: (exitData.exit_price - trade.entry_price) * exitData.shares_to_close,
        actual_rr_ratio: actualRr,
        source: trade.source,
        parent_trade_id: trade.id,
        recommendation_id: trade.recommendation_id,
      },
    });
    return prisma.trade.update({
      where: { id },
      data: { shares: trade.shares - exitData.shares_to_close },
    });
  }

  return prisma.trade.update({
    where: { id },
    data: {
      status: "closed",
      exit_price: exitData.exit_price,
      exit_date: exitData.exit_date,
      return_pct: returnPct,
      return_dollars: returnDollars,
      actual_rr_ratio: actualRr,
    },
  });
}

// ---- Watchlist ----
export async function getWatchlist() {
  return prisma.watchlistItem.findMany({ orderBy: { added_at: "desc" } });
}

export async function addToWatchlist(ticker: string, companyName: string) {
  return prisma.watchlistItem.create({
    data: { ticker, company_name: companyName },
  });
}

export async function removeFromWatchlist(id: number) {
  return prisma.watchlistItem.delete({ where: { id } });
}

// ---- Portfolio Snapshots ----
export async function getPortfolioSnapshots(range?: { start?: Date; end?: Date }) {
  const where: Record<string, unknown> = {};
  if (range?.start || range?.end) {
    where.date = {
      ...(range.start && { gte: range.start }),
      ...(range.end && { lte: range.end }),
    };
  }
  return prisma.portfolioSnapshot.findMany({ where, orderBy: { date: "asc" } });
}

export async function createSnapshot(data: {
  date: Date;
  total_value: number;
  daily_pnl: number;
  daily_pnl_pct: number;
  holdings_summary: string;
  sp500_value: number;
}) {
  return prisma.portfolioSnapshot.upsert({
    where: { date: data.date },
    update: data,
    create: data,
  });
}

// ---- Wizard State ----
export async function getWizardState() {
  return prisma.wizardState.findFirst({ orderBy: { updated_at: "desc" } });
}

export async function saveWizardState(data: {
  recommendation_id: number;
  current_step: number;
  step_data: string;
}) {
  const existing = await prisma.wizardState.findFirst();
  if (existing) {
    return prisma.wizardState.update({ where: { id: existing.id }, data });
  }
  return prisma.wizardState.create({ data });
}

export async function clearWizardState() {
  return prisma.wizardState.deleteMany();
}

// ---- App Settings ----
export async function getSetting(key: string) {
  const setting = await prisma.appSettings.findUnique({ where: { key } });
  return setting?.value ?? null;
}

export async function setSetting(key: string, value: string) {
  return prisma.appSettings.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

// ---- API Usage ----
export async function getApiUsage(date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return prisma.apiUsage.findFirst({ where: { date: startOfDay } });
}

export async function incrementApiUsage(cost: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await prisma.apiUsage.findFirst({ where: { date: today } });
  if (existing) {
    return prisma.apiUsage.update({
      where: { id: existing.id },
      data: {
        call_count: existing.call_count + 1,
        estimated_cost: existing.estimated_cost + cost,
      },
    });
  }
  return prisma.apiUsage.create({
    data: { date: today, call_count: 1, estimated_cost: cost },
  });
}
