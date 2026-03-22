"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, AlertTriangle, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { WIZARD } from "@/constants/content";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import { calculatePositionSize, calculateRiskReward } from "@/lib/utils/calculations";

interface TradeRecommendation {
  id: number;
  ticker: string;
  company_name: string;
  order_type: string;
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  thesis: string;
  ai_score: number;
}

interface StepData {
  orderType?: string;
  limitPrice?: number;
  riskPct?: number;
  shares?: number;
  dollarAmount?: number;
}

export default function TradePage() {
  return (
    <Suspense fallback={<div className="p-[16px] text-text-secondary">Loading...</div>}>
      <TradePageContent />
    </Suspense>
  );
}

function TradePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const recId = searchParams.get("rec");

  const [rec, setRec] = useState<TradeRecommendation | null>(null);
  const [step, setStep] = useState(1);
  const [stepData, setStepData] = useState<StepData>({});
  const [loading, setLoading] = useState(true);
  const [fillPriceModal, setFillPriceModal] = useState(false);
  const [fillPrice, setFillPrice] = useState("");
  const [portfolioBalance, setPortfolioBalance] = useState(50000);

  const fetchRec = useCallback(async () => {
    if (!recId) {
      // Check for saved wizard state
      const res = await fetch("/api/wizard");
      if (res.ok) {
        const state = await res.json();
        if (state?.recommendation) {
          setRec(state.recommendation);
          setStep(state.current_step || 1);
          setStepData(JSON.parse(state.step_data || "{}"));
          setLoading(false);
          return;
        }
      }
      setLoading(false);
      return;
    }

    const res = await fetch(`/api/recommendations/${recId}`);
    if (res.ok) {
      const data = await res.json();
      setRec(data);
      setStepData({
        orderType: data.order_type,
        limitPrice: data.entry_price,
        riskPct: 0.02,
      });
    }
    // Fetch profile for balance
    const profileRes = await fetch("/api/profile");
    if (profileRes.ok) {
      const profile = await profileRes.json();
      setPortfolioBalance(profile.portfolio_balance ?? 50000);
    }
    setLoading(false);
  }, [recId]);

  useEffect(() => { fetchRec(); }, [fetchRec]);

  // Save wizard state on step change
  useEffect(() => {
    if (!rec) return;
    fetch("/api/wizard", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recommendation_id: rec.id, current_step: step, step_data: stepData }),
    });
  }, [step, stepData, rec]);

  if (loading) return <div className="p-[16px] text-text-secondary">Loading...</div>;

  if (!rec) {
    return (
      <div className="p-[16px] flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-[16px] text-text-secondary">
          Start a trade from any recommendation on the Home screen.
        </p>
        <Button className="mt-4" onClick={() => router.push("/home")}>Go to Home</Button>
      </div>
    );
  }

  const entryPrice = stepData.limitPrice || rec.entry_price;
  const posSize = calculatePositionSize(portfolioBalance, stepData.riskPct || 0.02, entryPrice, rec.stop_loss);
  const rr = calculateRiskReward(entryPrice, rec.stop_loss, rec.take_profit);

  async function handleConfirmTrade(actualFillPrice?: number) {
    if (!rec) return;
    const price = actualFillPrice ?? entryPrice;
    const res = await fetch("/api/trades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ticker: rec.ticker,
        action: "buy",
        shares: posSize.shares,
        entry_price: price,
        stop_loss: rec.stop_loss,
        take_profit: rec.take_profit,
        order_type: stepData.orderType ?? "limit",
        source: "ai_recommendation",
        recommendation_id: rec.id,
      }),
    });
    if (res.ok) {
      await fetch("/api/wizard", { method: "DELETE" });
      showToast("Trade logged! View in portfolio.", "success");
      router.push("/portfolio");
    } else {
      showToast("Failed to save trade. Tap to retry.", "error");
    }
  }

  async function handleSkip() {
    if (!rec) return;
    await fetch("/api/wizard", { method: "DELETE" });
    await fetch(`/api/recommendations/${rec.id}`, {
      method: "PATCH",
    }).catch(() => {});
    router.push("/home");
  }

  const steps = [
    { num: 1, title: WIZARD.step1Title },
    { num: 2, title: WIZARD.step2Title },
    { num: 3, title: WIZARD.step3Title },
    { num: 4, title: WIZARD.step4Title },
    { num: 5, title: WIZARD.step5Title },
  ];

  return (
    <div className="p-[16px]">
      {/* Stepper */}
      <div className="flex flex-col gap-1 mb-6">
        {steps.map((s) => (
          <div key={s.num} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-medium shrink-0 ${
              s.num < step ? "bg-gain-green text-white" : s.num === step ? "bg-accent-blue text-white" : "bg-bg-surface text-text-tertiary"
            }`}>
              {s.num < step ? <Check className="h-4 w-4" /> : s.num}
            </div>
            <span className={`text-[14px] ${s.num === step ? "text-text-primary font-medium" : "text-text-tertiary"}`}>
              {s.title}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1: Analysis Summary */}
      {step === 1 && (
        <div>
          <div className="bg-bg-surface rounded-[12px] p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[14px] font-mono font-medium text-text-primary">{rec.ticker}</span>
              <span className="text-[14px] text-text-secondary">{rec.company_name}</span>
            </div>
            <p className="text-[14px] text-text-secondary italic">{rec.thesis}</p>
            <div className="flex justify-between mt-3 text-[12px]">
              <span className="text-loss-red">Stop: {formatCurrency(rec.stop_loss)}</span>
              <span className="text-accent-blue">Entry: {formatCurrency(rec.entry_price)}</span>
              <span className="text-gain-green">Target: {formatCurrency(rec.take_profit)}</span>
            </div>
          </div>
          <Button fullWidth onClick={() => setStep(2)}>Next</Button>
        </div>
      )}

      {/* Step 2: Order Type */}
      {step === 2 && (
        <div>
          <div className="flex flex-col gap-3 mb-4">
            {(["market", "limit", "stop_limit"] as const).map((type) => {
              const labels = { market: "Market Order", limit: "Limit Order", stop_limit: "Stop-Limit Order" };
              const descs = { market: WIZARD.orderTypes.market, limit: WIZARD.orderTypes.limit, stopLimit: WIZARD.orderTypes.stopLimit };
              const isRecommended = type === rec.order_type;
              const selected = stepData.orderType === type;
              return (
                <button
                  key={type}
                  onClick={() => setStepData({ ...stepData, orderType: type })}
                  className={`w-full p-4 rounded-[12px] border text-left ${
                    selected ? "border-accent-blue bg-accent-blue/10" : "border-border-default bg-bg-surface"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[16px] text-text-primary font-medium">{labels[type]}</span>
                    {isRecommended && <Badge color="blue" size="sm">✓ Recommended</Badge>}
                  </div>
                  <p className="text-[12px] text-text-secondary mt-1">
                    {type === "stop_limit" ? descs.stopLimit : descs[type as keyof typeof descs]}
                  </p>
                </button>
              );
            })}
          </div>
          {stepData.orderType !== "market" && (
            <Input
              label="Limit Price"
              dollar
              value={String(stepData.limitPrice || rec.entry_price)}
              onChange={(v) => setStepData({ ...stepData, limitPrice: parseFloat(v) || rec.entry_price })}
            />
          )}
          <div className="flex gap-3 mt-4">
            <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
            <Button fullWidth disabled={!stepData.orderType} onClick={() => setStep(3)}>Next</Button>
          </div>
        </div>
      )}

      {/* Step 3: Position Size */}
      {step === 3 && (
        <div>
          <div className="bg-bg-surface rounded-[12px] p-4 mb-4">
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div>
                <p className="text-[12px] text-text-secondary">Shares</p>
                <p className="text-[18px] font-semibold text-text-primary tabular-nums">{posSize.shares}</p>
              </div>
              <div>
                <p className="text-[12px] text-text-secondary">Amount</p>
                <p className="text-[18px] font-semibold text-text-primary tabular-nums">{formatCurrency(posSize.dollarAmount)}</p>
              </div>
              <div>
                <p className="text-[12px] text-text-secondary">Portfolio %</p>
                <p className="text-[18px] font-semibold text-text-primary tabular-nums">{(posSize.portfolioPct * 100).toFixed(1)}%</p>
              </div>
            </div>
            <Slider
              min={0.005}
              max={0.05}
              step={0.005}
              value={stepData.riskPct || 0.02}
              onChange={(v) => setStepData({ ...stepData, riskPct: v })}
              label="Risk per trade"
              formatValue={(v) => `${(v * 100).toFixed(1)}%`}
            />
          </div>
          <p className="text-[14px] text-text-secondary mb-4">
            Risking {formatCurrency(rr.riskDollars * posSize.shares)} to target {formatCurrency(rr.rewardDollars * posSize.shares)} (R:R 1:{rr.ratio.toFixed(1)})
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
            <Button fullWidth onClick={() => setStep(4)}>Next</Button>
          </div>
        </div>
      )}

      {/* Step 4: Pre-Trade Checklist */}
      {step === 4 && (
        <div>
          <div className="space-y-3 mb-4">
            <CheckItem ok label={`Order type: ${stepData.orderType === "stop_limit" ? "Stop-Limit" : stepData.orderType === "limit" ? "Limit" : "Market"} @ ${formatCurrency(entryPrice)}`} />
            <CheckItem ok label={`Position within risk: ${(posSize.portfolioPct * 100).toFixed(1)}% of portfolio`} />
            <CheckItem ok label={`Stop-loss: ${formatCurrency(rec.stop_loss)} (${formatPercent(-((entryPrice - rec.stop_loss) / entryPrice) * 100)})`} />
            <CheckItem ok={rr.ratio >= 1.5} label={`Risk/Reward: 1:${rr.ratio.toFixed(1)}`} />
            <CheckItem ok label="No earnings within 5 days" />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep(3)}>Back</Button>
            <Button fullWidth onClick={() => setStep(5)}>Confirm & Prepare</Button>
          </div>
        </div>
      )}

      {/* Step 5: Execute / Handoff */}
      {step === 5 && (
        <div>
          <div className="bg-bg-surface rounded-[12px] p-4 mb-4">
            <h3 className="text-[16px] font-semibold text-text-primary mb-3">Trade Summary</h3>
            <div className="space-y-2">
              <TradeField label="Action" value="BUY" />
              <TradeField label="Ticker" value={rec.ticker} />
              <TradeField label="Order Type" value={stepData.orderType || "limit"} />
              <TradeField label="Price" value={formatCurrency(entryPrice)} />
              <TradeField label="Shares" value={String(posSize.shares)} />
              <TradeField label="Stop-Loss" value={formatCurrency(rec.stop_loss)} />
              <TradeField label="Take-Profit" value={formatCurrency(rec.take_profit)} />
            </div>
          </div>

          <Button
            fullWidth
            variant="secondary"
            className="mb-3"
            onClick={() => {
              const text = WIZARD.copyFormat(rec.ticker, rec.company_name, stepData.orderType || "limit", formatCurrency(entryPrice), posSize.shares, formatCurrency(rec.stop_loss), formatCurrency(rec.take_profit));
              navigator.clipboard.writeText(text).then(
                () => showToast("Copied to clipboard", "success"),
                () => showToast("Couldn't copy to clipboard", "error")
              );
            }}
          >
            <Copy className="h-4 w-4" /> {WIZARD.copyButton}
          </Button>

          <Button
            fullWidth
            className="mb-4"
            onClick={() => {
              window.open(`https://digital.fidelity.com/prgw/digital/research/quote/dashboard/summary?symbol=${rec.ticker}`, "_blank");
            }}
          >
            <ExternalLink className="h-4 w-4" /> {WIZARD.fidelityButton}
          </Button>

          <p className="text-[14px] text-text-secondary text-center mb-4">{WIZARD.postTradePrompt}</p>

          <div className="flex flex-col gap-2">
            <Button fullWidth onClick={() => setFillPriceModal(true)}>{WIZARD.confirmPlaced}</Button>
            <Button fullWidth variant="secondary" onClick={() => { router.push("/home"); }}>
              {WIZARD.confirmNotYet}
            </Button>
            <Button fullWidth variant="secondary" onClick={handleSkip}>
              {WIZARD.confirmDeclined}
            </Button>
          </div>
        </div>
      )}

      {/* Fill Price Modal */}
      <Modal open={fillPriceModal} onClose={() => setFillPriceModal(false)} title="Fill Price">
        <p className="text-[14px] text-text-secondary mb-3">
          What was your actual fill price? (Optional)
        </p>
        <Input dollar value={fillPrice} onChange={setFillPrice} placeholder={String(entryPrice)} />
        <div className="flex gap-3 mt-4">
          <Button variant="secondary" onClick={() => { setFillPriceModal(false); handleConfirmTrade(); }}>
            Skip
          </Button>
          <Button fullWidth onClick={() => {
            const fp = parseFloat(fillPrice);
            if (fp && Math.abs(fp - entryPrice) / entryPrice > 0.05) {
              const pct = ((Math.abs(fp - entryPrice) / entryPrice) * 100).toFixed(1);
              if (!confirm(WIZARD.fillPriceWarning(pct + "%"))) return;
            }
            setFillPriceModal(false);
            handleConfirmTrade(fp || undefined);
          }}>
            Confirm
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function CheckItem({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3">
      {ok ? (
        <div className="w-6 h-6 rounded-full bg-gain-green/20 flex items-center justify-center">
          <Check className="h-4 w-4 text-gain-green" />
        </div>
      ) : (
        <div className="w-6 h-6 rounded-full bg-warning-amber/20 flex items-center justify-center">
          <AlertTriangle className="h-4 w-4 text-warning-amber" />
        </div>
      )}
      <span className="text-[14px] text-text-primary">{label}</span>
    </div>
  );
}

function TradeField({ label, value }: { label: string; value: string }) {
  const { showToast } = useToast();
  return (
    <div className="flex items-center justify-between">
      <span className="text-[14px] text-text-secondary">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[14px] text-text-primary font-medium tabular-nums">{value}</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(value).then(
              () => showToast("Copied", "success"),
              () => {}
            );
          }}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label={`Copy ${label}`}
        >
          <Copy className="h-3 w-3 text-text-tertiary" />
        </button>
      </div>
    </div>
  );
}

// Need Badge import
import { Badge } from "@/components/ui/badge";
