"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { useToast } from "@/components/ui/toast";
import { SETTINGS } from "@/constants/content";
import { formatCurrency, formatDate } from "@/lib/utils/format";

interface UserProfile {
  archetype: string;
  investing_style: string;
  risk_tolerance: number;
  instruments: string;
  portfolio_balance: number;
  portfolio_balance_updated_at: string;
}

interface UsageData {
  monthly_cost: number;
  monthly_budget: number;
  daily_calls: number;
  daily_cap: number;
}

function useSettingsData() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [settings, setSettings] = useState<Record<string, string>>({});

  const fetchAll = useCallback(async () => {
    const [p, u, s] = await Promise.all([
      fetch("/api/profile").then((r) => r.ok ? r.json() : null),
      fetch("/api/usage").then((r) => r.json()),
      fetch("/api/settings").then((r) => r.json()),
    ]);
    setProfile(p);
    setUsage(u);
    setSettings(s);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return { profile, setProfile, usage, settings, setSettings };
}

export default function SettingsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { profile, setProfile, usage, settings, setSettings } = useSettingsData();
  const [showBalance, setShowBalance] = useState(false);
  const [balanceInput, setBalanceInput] = useState("");
  const [showClear, setShowClear] = useState(false);

  async function handleBalanceUpdate() {
    const val = parseFloat(balanceInput);
    if (!val || val <= 0) return;
    const res = await fetch("/api/profile/balance", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ portfolio_balance: val }),
    });
    if (res.ok) {
      showToast("Portfolio balance updated.", "success");
      setShowBalance(false);
      const updated = await res.json();
      setProfile(updated);
    }
  }

  async function toggleColorblind() {
    const newVal = settings.colorblind_mode === "true" ? "false" : "true";
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ colorblind_mode: newVal }),
    });
    setSettings({ ...settings, colorblind_mode: newVal });
  }

  async function handleClearData() {
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trash_data: "pending_clear",
        trash_expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
      }),
    });
    showToast("All data cleared. You have 7 days to undo.", "info");
    setShowClear(false);
    setSettings({ ...settings, trash_data: "pending_clear", trash_expires_at: new Date(Date.now() + 7 * 86400000).toISOString() });
  }

  function downloadFile(url: string, filename: string) {
    fetch(url).then((r) => r.blob()).then((blob) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      showToast("Export complete", "success");
    }).catch(() => showToast("Export failed", "error"));
  }

  return (
    <div className="p-[16px]">
      <h1 className="text-[22px] font-semibold text-text-primary mb-6">Settings</h1>

      {/* Investor Profile */}
      <h2 className="text-[18px] font-semibold text-text-primary mb-3">{SETTINGS.profileSection}</h2>
      <Card className="mb-6">
        {profile ? (
          <div className="space-y-2">
            <p className="text-[18px] font-semibold text-accent-blue">{profile.archetype}</p>
            <p className="text-[14px] text-text-secondary">Style: {profile.investing_style}</p>
            <p className="text-[14px] text-text-secondary">Risk: {profile.risk_tolerance}/4</p>
            <p className="text-[14px] text-text-secondary">
              Instruments: {JSON.parse(profile.instruments || "[]").join(", ")}
            </p>
            <Button size="sm" variant="secondary" onClick={() => router.push("/onboarding")} className="mt-2">
              {SETTINGS.recalibrate}
            </Button>
          </div>
        ) : (
          <p className="text-[14px] text-text-secondary">No profile yet.</p>
        )}
      </Card>

      {/* Portfolio Balance */}
      <h2 className="text-[18px] font-semibold text-text-primary mb-3">{SETTINGS.balanceSection}</h2>
      <Card className="mb-6">
        <p className="text-[22px] font-bold text-text-primary tabular-nums mb-1">
          {profile ? formatCurrency(profile.portfolio_balance) : "$0.00"}
        </p>
        {profile?.portfolio_balance_updated_at && (
          <p className="text-[12px] text-text-tertiary mb-3">
            {SETTINGS.balanceLastUpdated(formatDate(profile.portfolio_balance_updated_at))}
          </p>
        )}
        <Button size="sm" variant="secondary" onClick={() => {
          setBalanceInput(profile?.portfolio_balance?.toString() || "");
          setShowBalance(true);
        }}>
          {SETTINGS.updateBalance}
        </Button>
      </Card>

      {/* Display */}
      <h2 className="text-[18px] font-semibold text-text-primary mb-3">{SETTINGS.displaySection}</h2>
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-text-primary">{SETTINGS.colorblindToggle}</span>
          <button
            onClick={toggleColorblind}
            className={`w-12 h-7 rounded-full transition-colors relative ${settings.colorblind_mode === "true" ? "bg-accent-blue" : "bg-bg-input"}`}
            role="switch"
            aria-checked={settings.colorblind_mode === "true"}
          >
            <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-transform ${settings.colorblind_mode === "true" ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>
      </Card>

      {/* API Usage */}
      <h2 className="text-[18px] font-semibold text-text-primary mb-3">{SETTINGS.costSection}</h2>
      <Card className="mb-6">
        {usage && (
          <div className="space-y-3">
            <div>
              <p className="text-[14px] text-text-primary mb-1">
                {SETTINGS.costDisplay(`$${usage.monthly_cost.toFixed(2)}`, `$${usage.monthly_budget.toFixed(2)}`)}
              </p>
              <div className="h-2 bg-bg-input rounded-full overflow-hidden">
                <div className="h-full bg-accent-blue rounded-full" style={{ width: `${Math.min(100, (usage.monthly_cost / usage.monthly_budget) * 100)}%` }} />
              </div>
            </div>
            <p className="text-[14px] text-text-secondary">
              {SETTINGS.dailyCalls(usage.daily_calls, usage.daily_cap)}
            </p>
          </div>
        )}
      </Card>

      {/* Data Management */}
      <h2 className="text-[18px] font-semibold text-text-primary mb-3">Data Management</h2>
      <div className="space-y-2 mb-6">
        <Button fullWidth variant="secondary" onClick={() => downloadFile("/api/export/csv", "alphaedge-trades.csv")}>
          {SETTINGS.exportCSV}
        </Button>
        <Button fullWidth variant="secondary" onClick={() => downloadFile("/api/export/json", "alphaedge-backup.json")}>
          {SETTINGS.exportJSON}
        </Button>
        <Button fullWidth variant="danger" onClick={() => setShowClear(true)}>
          {SETTINGS.clearButton}
        </Button>
      </div>

      {/* About */}
      <p className="text-[12px] text-text-tertiary text-center mt-8 mb-4">
        AlphaEdge v1.0 — Built with Claude API + Yahoo Finance data
      </p>

      {/* Balance Update Sheet */}
      <BottomSheet open={showBalance} onClose={() => setShowBalance(false)} title="Update Balance">
        <Input dollar value={balanceInput} onChange={setBalanceInput} label="Portfolio Balance" />
        <Button fullWidth className="mt-4" onClick={handleBalanceUpdate} disabled={!balanceInput}>
          Update
        </Button>
      </BottomSheet>

      {/* Clear Data Modal */}
      <Modal open={showClear} onClose={() => setShowClear(false)} title="Clear All Data">
        <p className="text-[14px] text-text-secondary mb-4">{SETTINGS.clearConfirmation}</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowClear(false)}>{SETTINGS.clearCancel}</Button>
          <Button variant="danger" onClick={handleClearData}>{SETTINGS.clearConfirm}</Button>
        </div>
      </Modal>
    </div>
  );
}
