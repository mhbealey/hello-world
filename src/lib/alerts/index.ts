import { prisma } from "@/lib/db/client";
import { getDataProvider } from "@/lib/data";
import type { AlertItem } from "@/lib/types";
import { ALERTS } from "@/constants/content";
import { formatCurrency } from "@/lib/utils/format";

export async function generateAlerts(): Promise<AlertItem[]> {
  const alerts: AlertItem[] = [];

  // 1. Check stop-loss and take-profit breaches on open trades
  const openTrades = await prisma.trade.findMany({ where: { status: "open" } });
  const provider = getDataProvider();

  for (const trade of openTrades) {
    try {
      const quote = await provider.getQuote(trade.ticker);
      if (!quote) continue;

      if (trade.stop_loss && quote.price <= trade.stop_loss) {
        alerts.push({
          id: `stop_loss_${trade.id}`,
          type: "stop_loss",
          ticker: trade.ticker,
          triggerPrice: trade.stop_loss,
          currentPrice: quote.price,
          tradeId: trade.id,
          message: ALERTS.stopLoss(trade.ticker, formatCurrency(trade.stop_loss), formatCurrency(quote.price)),
        });
      }

      if (trade.take_profit && quote.price >= trade.take_profit) {
        alerts.push({
          id: `take_profit_${trade.id}`,
          type: "take_profit",
          ticker: trade.ticker,
          triggerPrice: trade.take_profit,
          currentPrice: quote.price,
          tradeId: trade.id,
          message: ALERTS.takeProfit(trade.ticker, formatCurrency(trade.take_profit), formatCurrency(quote.price)),
        });
      }

      // Stock split detection: price >50% different from entry
      const priceDiff = Math.abs(quote.price - trade.entry_price) / trade.entry_price;
      if (priceDiff > 0.5) {
        alerts.push({
          id: `split_${trade.ticker}`,
          type: "stock_split",
          ticker: trade.ticker,
          message: ALERTS.stockSplit(trade.ticker),
        });
      }
    } catch {
      // Skip if quote fails
    }
  }

  // 2. Check expiring recommendations
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const expiringRecs = await prisma.recommendation.findMany({
    where: {
      status: "active",
      expires_at: { lte: tomorrow },
    },
  });
  for (const rec of expiringRecs) {
    alerts.push({
      id: `expiring_${rec.id}`,
      type: "expiring_rec",
      ticker: rec.ticker,
      recommendationId: rec.id,
      message: ALERTS.expiringRec(rec.ticker),
    });
  }

  // 3. Check stale portfolio balance
  const profile = await prisma.userProfile.findFirst();
  if (profile) {
    const daysSinceUpdate = (now.getTime() - profile.portfolio_balance_updated_at.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate > 30) {
      alerts.push({
        id: "stale_balance",
        type: "stale_balance",
        message: ALERTS.staleBalance,
      });
    }
  }

  // 4. Check unfinished wizard
  const wizard = await prisma.wizardState.findFirst();
  if (wizard) {
    const rec = await prisma.recommendation.findUnique({ where: { id: wizard.recommendation_id } });
    if (rec) {
      alerts.push({
        id: `wizard_${wizard.id}`,
        type: "unfinished_wizard",
        ticker: rec.ticker,
        recommendationId: rec.id,
        message: ALERTS.unfinishedWizard(rec.ticker),
      });
    }
  }

  return alerts;
}
