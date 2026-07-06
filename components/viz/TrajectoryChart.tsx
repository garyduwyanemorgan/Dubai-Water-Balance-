"use client";

import { useId } from "react";
import {
  Area,
  CartesianGrid,
  Line,
  ComposedChart,
  ReferenceArea,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SeriesPoint } from "@/lib/types";

interface RefBand {
  y1: number;
  y2: number;
  color: string;
  opacity?: number;
}

interface RefLine {
  y: number;
  label: string;
  color: string;
}

interface Props {
  title: string;
  unit: string;
  data: SeriesPoint[];
  color: string;
  inverted?: boolean;
  refBands?: RefBand[];
  refLines?: RefLine[];
}

interface Row extends SeriesPoint {
  range?: [number, number];
}

function fmt(n: number): string {
  // Trim trailing zeros but keep small values readable.
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

function BandTooltip({
  active,
  payload,
  label,
  unit,
}: {
  active?: boolean;
  payload?: Array<{ dataKey?: string | number; value?: number | number[] }>;
  label?: string | number;
  unit: string;
}) {
  if (!active || !payload?.length) return null;
  const median = payload.find((p) => p.dataKey === "value")?.value as
    | number
    | undefined;
  const range = payload.find((p) => p.dataKey === "range")?.value as
    | [number, number]
    | undefined;
  return (
    <div
      style={{
        background: "#f4efe4",
        border: "1px solid rgba(28,61,90,0.2)",
        borderRadius: 2,
        fontSize: 11,
        padding: "6px 8px",
        lineHeight: 1.5,
      }}
    >
      <div style={{ color: "#1a1a17", fontWeight: 600 }}>{label}</div>
      {median != null && (
        <div style={{ color: "#1a1a17" }}>
          {fmt(median)} {unit}
        </div>
      )}
      {range && (
        <div style={{ color: "#6b6a63" }}>
          range {fmt(range[0])}–{fmt(range[1])} {unit}
        </div>
      )}
    </div>
  );
}

export default function TrajectoryChart({
  title,
  unit,
  data,
  color,
  inverted = false,
  refBands = [],
  refLines = [],
}: Props) {
  const gid = useId().replace(/:/g, "");
  const hasBand = data.some((d) => d.lo != null && d.hi != null);
  const rows: Row[] = data.map((d) => ({
    ...d,
    range:
      d.lo != null && d.hi != null ? ([d.lo, d.hi] as [number, number]) : undefined,
  }));
  const last = data.length ? data[data.length - 1] : undefined;

  return (
    <div className="rounded-sm border border-deepblue/15 bg-sand-light p-3 transition-shadow duration-300 hover:shadow-[0_1px_12px_rgba(28,61,90,0.08)]">
      <div className="mb-1 flex items-baseline justify-between">
        <h4 className="text-xs font-medium uppercase tracking-wide text-ink">
          {title}
        </h4>
        <span className="text-[10px] text-muted">{unit}</span>
      </div>
      <ResponsiveContainer width="100%" height={124}>
        <ComposedChart
          data={rows}
          margin={{ top: 6, right: 10, bottom: 0, left: -12 }}
        >
          <defs>
            <linearGradient id={`band-${gid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1c3d5a" strokeOpacity={0.07} vertical={false} />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 10, fill: "#6b6a63" }}
            tickLine={false}
            axisLine={{ stroke: "#1c3d5a", strokeOpacity: 0.15 }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#6b6a63" }}
            tickLine={false}
            axisLine={false}
            width={36}
            reversed={inverted}
            domain={inverted ? [0, "auto"] : ["auto", "auto"]}
          />
          {refBands.map((b, i) => (
            <ReferenceArea
              key={i}
              y1={b.y1}
              y2={b.y2}
              fill={b.color}
              fillOpacity={b.opacity ?? 0.12}
              ifOverflow="extendDomain"
            />
          ))}
          {hasBand && (
            <Area
              type="monotone"
              dataKey="range"
              stroke={color}
              strokeOpacity={0.25}
              strokeWidth={1}
              fill={`url(#band-${gid})`}
              isAnimationActive={false}
              connectNulls
              activeDot={false}
            />
          )}
          {refLines.map((l, i) => (
            <ReferenceLine
              key={i}
              y={l.y}
              stroke={l.color}
              strokeDasharray="4 3"
              label={{
                value: l.label,
                fontSize: 9,
                fill: l.color,
                position: "insideTopRight",
              }}
            />
          ))}
          <Tooltip content={<BandTooltip unit={unit} />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          {last && (
            <ReferenceDot
              x={last.year}
              y={last.value}
              r={3}
              fill={color}
              stroke="#f4efe4"
              strokeWidth={1.5}
              isFront
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
      {hasBand && (
        <div className="mt-1.5 flex items-center gap-3 text-[9px] text-muted">
          <span className="inline-flex items-center gap-1">
            <span
              className="inline-block h-0.5 w-3 rounded-full"
              style={{ background: color }}
            />
            median
          </span>
          <span className="inline-flex items-center gap-1">
            <span
              className="inline-block h-2 w-3 rounded-[1px]"
              style={{ background: color, opacity: 0.22 }}
            />
            p10–p90 range
          </span>
        </div>
      )}
    </div>
  );
}
