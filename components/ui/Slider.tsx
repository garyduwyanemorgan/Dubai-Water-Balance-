"use client";

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  format?: (v: number) => string;
  onChange: (v: number) => void;
}

export default function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  format,
  onChange,
}: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label className="text-sm font-medium text-ink">{label}</label>
        <span className="font-serif text-lg tabular-nums text-deepblue">
          {format ? format(value) : value}
          <span className="ml-1 text-xs font-sans text-muted">{unit}</span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-deepblue/20 accent-deepblue"
      />
    </div>
  );
}
