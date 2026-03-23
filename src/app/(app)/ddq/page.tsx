"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  Sparkles,
  Lock,
  Target,
  Shield,
  Droplets,
  BarChart3,
  Layers,
  FileText,
  Receipt,
  Settings2,
  Scale,
  Leaf,
  Gavel,
  Cpu,
  Users,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PillSelector } from "@/components/ui/pill-selector";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

// ── Types ──

interface DDQOption {
  value: string;
  label: string;
  description?: string;
}

interface DDQQuestionData {
  id: number;
  slug: string;
  question_text: string;
  question_type: string;
  options: DDQOption[] | null;
  min_value: number | null;
  max_value: number | null;
  step_value: number | null;
  default_value: string | null;
  helper_text: string | null;
  required: boolean;
  phase: string;
  category: { slug: string; name: string; icon: string | null };
  answer: unknown;
}

interface CategoryProgress {
  slug: string;
  name: string;
  phase: string;
  total: number;
  answered: number;
  complete: boolean;
}

// ── Icon map ──

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  User: Target,
  Target: Target,
  Shield: Shield,
  Droplets: Droplets,
  BarChart3: BarChart3,
  Layers: Layers,
  FileText: FileText,
  Receipt: Receipt,
  Settings2: Settings2,
  Scale: Scale,
  Leaf: Leaf,
  Gavel: Gavel,
  Cpu: Cpu,
  Users: Users,
  AlertTriangle: AlertTriangle,
};

// ── Main DDQ Page ──

export default function DDQPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"overview" | "category">("overview");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [questions, setQuestions] = useState<DDQQuestionData[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, unknown>>({});
  const [progress, setProgress] = useState<{
    total: number;
    answered: number;
    percent: number;
    categories: CategoryProgress[];
    onboardingComplete: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [matching, setMatching] = useState(false);

  // ── Load progress ──

  const fetchProgress = useCallback(async () => {
    try {
      const res = await fetch("/api/ddq/progress");
      if (res.ok) {
        setProgress(await res.json());
      }
    } catch {
      console.error("Failed to fetch DDQ progress");
    }
  }, []);

  useEffect(() => {
    fetchProgress().finally(() => setLoading(false));
  }, [fetchProgress]);

  // ── Load questions for a category ──

  async function startCategory(slug: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/ddq/questions?category=${slug}`);
      if (!res.ok) throw new Error("Failed to load questions");
      const data: DDQQuestionData[] = await res.json();
      setQuestions(data);
      setCurrentIdx(0);

      // Pre-populate answers from existing responses
      const existing: Record<number, unknown> = {};
      for (const q of data) {
        if (q.answer != null) {
          existing[q.id] = q.answer;
        }
      }
      setAnswers(existing);

      setActiveCategory(slug);
      setMode("category");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // ── Save answers ──

  async function saveAnswers() {
    setSaving(true);
    try {
      const responses = Object.entries(answers).map(([qId, answer]) => ({
        question_id: parseInt(qId),
        answer,
      }));

      if (responses.length === 0) return;

      const res = await fetch("/api/ddq/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses }),
      });

      if (!res.ok) throw new Error("Failed to save");

      await fetchProgress();
    } catch (e) {
      console.error("Failed to save DDQ responses:", e);
    } finally {
      setSaving(false);
    }
  }

  // ── Run matching ──

  async function runMatching() {
    setMatching(true);
    try {
      await saveAnswers();
      const res = await fetch("/api/ddq/match", { method: "POST" });
      if (!res.ok) throw new Error("Matching failed");
      router.push("/ddq/results");
    } catch (e) {
      console.error("Matching failed:", e);
    } finally {
      setMatching(false);
    }
  }

  // ── Back to overview ──

  async function finishCategory() {
    await saveAnswers();
    setMode("overview");
    setActiveCategory(null);
    setQuestions([]);
  }

  // ── Current question ──

  const currentQ = questions[currentIdx];
  const currentAnswer = currentQ ? answers[currentQ.id] : undefined;
  const isAnswered = currentAnswer != null && currentAnswer !== "" &&
    !(Array.isArray(currentAnswer) && currentAnswer.length === 0);
  const canAdvance = !currentQ?.required || isAnswered;
  const isLastQuestion = currentIdx === questions.length - 1;

  // ── Render ──

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-accent-blue" />
      </div>
    );
  }

  // ── Category question flow ──

  if (mode === "category" && currentQ) {
    const categoryProgress = Math.round(((currentIdx + 1) / questions.length) * 100);

    return (
      <div className="px-4 pt-2 pb-4 min-h-[calc(100vh-80px)] flex flex-col">
        {/* Progress bar */}
        <div className="h-1 bg-bg-surface rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-accent-blue transition-all duration-300 rounded-full"
            style={{ width: `${categoryProgress}%` }}
          />
        </div>
        <div className="flex items-center justify-between mb-6">
          <span className="text-[12px] text-text-tertiary">
            {currentQ.category.name} — {currentIdx + 1} of {questions.length}
          </span>
          <button
            onClick={finishCategory}
            className="text-[12px] text-text-secondary hover:text-text-primary min-h-[44px] px-2"
          >
            Save & Exit
          </button>
        </div>

        {/* Question */}
        <h2 className="text-[20px] font-semibold text-text-primary mb-3 leading-tight">
          {currentQ.question_text}
        </h2>

        {currentQ.helper_text && (
          <p className="text-[13px] text-text-secondary mb-6">{currentQ.helper_text}</p>
        )}

        {/* Answer input */}
        <div className="flex-1">
          <QuestionInput
            question={currentQ}
            value={currentAnswer}
            onChange={(val) => setAnswers((prev) => ({ ...prev, [currentQ.id]: val }))}
          />
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-border-default">
          <button
            onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
            disabled={currentIdx === 0}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-text-secondary disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {isLastQuestion ? (
            <Button
              fullWidth
              onClick={finishCategory}
              loading={saving}
              disabled={!canAdvance}
            >
              Complete Section
            </Button>
          ) : (
            <Button
              fullWidth
              onClick={() => setCurrentIdx(currentIdx + 1)}
              disabled={!canAdvance}
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // ── Overview ──

  const onboardingCategories = progress?.categories.filter((c) => c.phase === "onboarding") || [];
  const deepeningCategories = progress?.categories.filter((c) => c.phase === "deepening") || [];
  const advancedCategories = progress?.categories.filter((c) => c.phase === "advanced") || [];
  const canMatch = (progress?.answered ?? 0) >= 5;

  return (
    <div className="px-4 pt-2 pb-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-text-primary mb-1">
          Investment Profile
        </h1>
        <p className="text-[14px] text-text-secondary">
          Answer questions to discover which alternative investments match your profile.
          More answers = better matches.
        </p>
      </div>

      {/* Overall progress */}
      {progress && (
        <div className="bg-bg-surface border border-border-default rounded-[12px] p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[14px] text-text-secondary">Profile Completeness</span>
            <span className="text-[14px] font-medium text-text-primary tabular-nums">
              {progress.percent}%
            </span>
          </div>
          <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-blue transition-all duration-500 rounded-full"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <p className="text-[12px] text-text-tertiary mt-2">
            {progress.answered} of {progress.total} questions answered
          </p>
        </div>
      )}

      {/* Match button */}
      <Button
        fullWidth
        size="lg"
        onClick={runMatching}
        loading={matching}
        disabled={!canMatch}
        className="mb-6"
      >
        <Sparkles className="h-5 w-5" />
        {matching ? "Finding Your Matches…" : "Find My Investment Matches"}
      </Button>

      {!canMatch && (
        <p className="text-[12px] text-text-tertiary text-center -mt-4 mb-6">
          Answer at least 5 questions to enable matching
        </p>
      )}

      {/* Category sections */}
      <CategorySection
        title="Core Profile"
        subtitle="Start here — these shape your primary matches"
        categories={onboardingCategories}
        onStart={startCategory}
        locked={false}
      />

      <CategorySection
        title="Deepen Your Profile"
        subtitle="More detail = more accurate matches"
        categories={deepeningCategories}
        onStart={startCategory}
        locked={!progress?.onboardingComplete}
      />

      <CategorySection
        title="Advanced Preferences"
        subtitle="For maximum matching precision"
        categories={advancedCategories}
        onStart={startCategory}
        locked={!progress?.onboardingComplete}
      />
    </div>
  );
}

// ── Category section component ──

function CategorySection({
  title,
  subtitle,
  categories,
  onStart,
  locked,
}: {
  title: string;
  subtitle: string;
  categories: CategoryProgress[];
  onStart: (slug: string) => void;
  locked: boolean;
}) {
  if (categories.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-[16px] font-medium text-text-primary">{title}</h3>
        {locked && <Lock className="h-4 w-4 text-text-tertiary" />}
      </div>
      <p className="text-[12px] text-text-tertiary mb-3">{subtitle}</p>

      <div className="flex flex-col gap-2">
        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.slug] || Target;
          const pct = cat.total > 0 ? Math.round((cat.answered / cat.total) * 100) : 0;

          return (
            <button
              key={cat.slug}
              onClick={() => !locked && onStart(cat.slug)}
              disabled={locked}
              className={`
                w-full flex items-center gap-3 p-3 rounded-[12px] border text-left
                transition-all duration-200
                ${locked
                  ? "opacity-50 cursor-not-allowed border-border-default bg-bg-surface"
                  : cat.complete
                    ? "border-gain-green/30 bg-gain-green/5 hover:bg-gain-green/10"
                    : "border-border-default bg-bg-surface hover:bg-bg-surface-hover"
                }
              `}
            >
              <div className={`
                w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0
                ${cat.complete ? "bg-gain-green/20" : "bg-bg-elevated"}
              `}>
                {cat.complete
                  ? <Check className="h-5 w-5 text-gain-green" />
                  : <Icon className="h-5 w-5 text-text-secondary" />
                }
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-text-primary truncate">{cat.name}</p>
                <p className="text-[12px] text-text-tertiary">
                  {cat.answered}/{cat.total} answered
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {pct > 0 && pct < 100 && (
                  <div className="w-12 h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent-blue rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                )}
                {!locked && <ChevronRight className="h-4 w-4 text-text-tertiary" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Question input renderer ──

function QuestionInput({
  question,
  value,
  onChange,
}: {
  question: DDQQuestionData;
  value: unknown;
  onChange: (val: unknown) => void;
}) {
  switch (question.question_type) {
    case "single_select":
      return (
        <div className="flex flex-col gap-2">
          {(question.options || []).map((opt) => {
            const selected = value === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onChange(opt.value)}
                className={`
                  w-full p-4 rounded-[12px] border text-left min-h-[52px]
                  transition-all duration-200
                  ${selected
                    ? "border-accent-blue bg-accent-blue/10"
                    : "border-border-default bg-bg-surface hover:bg-bg-surface-hover"}
                `}
              >
                <span className="text-[15px] text-text-primary">{opt.label}</span>
                {opt.description && (
                  <p className="text-[12px] text-text-secondary mt-1">{opt.description}</p>
                )}
              </button>
            );
          })}
        </div>
      );

    case "multi_select":
      return (
        <div className="flex flex-wrap gap-2">
          <PillSelector
            options={(question.options || []).map((o) => ({ label: o.label, value: o.value }))}
            selected={Array.isArray(value) ? value as string[] : []}
            onChange={(v) => onChange(v)}
            multiSelect
          />
        </div>
      );

    case "slider":
      return (
        <Slider
          min={question.min_value ?? 0}
          max={question.max_value ?? 100}
          step={question.step_value ?? 1}
          value={typeof value === "number" ? value : (question.min_value ?? 0)}
          onChange={(v) => onChange(v)}
          formatValue={(v) => {
            if (question.slug.includes("percent") || question.slug.includes("pct")) return `${v}%`;
            if (question.slug.includes("year")) return `${v} years`;
            if (question.slug.includes("dollar") || question.slug.includes("amount"))
              return `$${v.toLocaleString()}`;
            return String(v);
          }}
        />
      );

    case "number":
      return (
        <Input
          type="number"
          value={value != null ? String(value) : ""}
          onChange={(v) => onChange(v ? parseFloat(v) : null)}
          placeholder={question.default_value || "Enter a number"}
          dollar={question.slug.includes("dollar") || question.slug.includes("investment") || question.slug.includes("balance")}
        />
      );

    case "text":
      return (
        <textarea
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.default_value || "Type your answer..."}
          className="w-full h-28 bg-bg-input border border-border-default rounded-[12px] p-3
            text-[15px] text-text-primary placeholder:text-text-tertiary
            focus:outline-none focus:border-border-focus resize-none"
        />
      );

    case "ranking":
      // Simplified: treat as multi-select for now
      return (
        <div className="flex flex-col gap-2">
          {(question.options || []).map((opt, idx) => {
            const selected = Array.isArray(value) && (value as string[]).includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => {
                  const arr = Array.isArray(value) ? [...value as string[]] : [];
                  if (arr.includes(opt.value)) {
                    onChange(arr.filter((v) => v !== opt.value));
                  } else {
                    onChange([...arr, opt.value]);
                  }
                }}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-[12px] border text-left min-h-[48px]
                  transition-all duration-200
                  ${selected
                    ? "border-accent-blue bg-accent-blue/10"
                    : "border-border-default bg-bg-surface hover:bg-bg-surface-hover"}
                `}
              >
                <span className={`
                  w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-medium shrink-0
                  ${selected ? "bg-accent-blue text-white" : "bg-bg-elevated text-text-secondary"}
                `}>
                  {selected
                    ? (Array.isArray(value) ? (value as string[]).indexOf(opt.value) + 1 : idx + 1)
                    : idx + 1
                  }
                </span>
                <span className="text-[14px] text-text-primary">{opt.label}</span>
              </button>
            );
          })}
        </div>
      );

    default:
      return (
        <p className="text-[14px] text-text-secondary">
          Unknown question type: {question.question_type}
        </p>
      );
  }
}
