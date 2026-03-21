"use client";

interface PillOption {
  label: string;
  value: string;
}

interface PillSelectorProps {
  options: PillOption[];
  selected: string | string[];
  onChange: (value: string | string[]) => void;
  multiSelect?: boolean;
}

export function PillSelector({
  options,
  selected,
  onChange,
  multiSelect = false,
}: PillSelectorProps) {
  const isSelected = (value: string) =>
    Array.isArray(selected) ? selected.includes(value) : selected === value;

  const handleClick = (value: string) => {
    if (multiSelect) {
      const arr = Array.isArray(selected) ? selected : [selected];
      if (arr.includes(value)) {
        onChange(arr.filter((v) => v !== value));
      } else {
        onChange([...arr, value]);
      }
    } else {
      onChange(value);
    }
  };

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar" role="group">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => handleClick(opt.value)}
          className={`
            shrink-0 px-4 py-2 rounded-full text-[14px] font-medium
            min-h-[44px] transition-colors duration-200
            ${
              isSelected(opt.value)
                ? "bg-accent-blue text-white"
                : "bg-bg-surface text-text-secondary hover:bg-bg-surface-hover"
            }
          `}
          role={multiSelect ? "checkbox" : "radio"}
          aria-checked={isSelected(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
