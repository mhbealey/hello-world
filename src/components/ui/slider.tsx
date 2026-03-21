"use client";

interface SliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  formatValue?: (value: number) => string;
}

export function Slider({
  min,
  max,
  step,
  value,
  onChange,
  label,
  formatValue,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-text-secondary">{label}</span>
          <span className="text-[14px] font-medium text-text-primary tabular-nums">
            {formatValue ? formatValue(value) : value}
          </span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #3B82F6 ${percentage}%, #1A1B23 ${percentage}%)`,
        }}
      />
    </div>
  );
}
