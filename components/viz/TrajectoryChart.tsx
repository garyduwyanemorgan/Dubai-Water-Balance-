"use client";

import {
  CartesianGrid,
  Line,
  ComposedChart,
  ReferenceArea,
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

export default function TrajectoryChart({
  title,
  unit,
  data,
  color,
  inverted = false,
  refBands = [],
  refLines = [],
}: Props) {
  return (
    <div className="rounded-sm border border-deepblue/15 bg-sand-light p-3">
      <div className="mb-1 flex items-baseline justify-between">
        <h4 className="text-xs font-medium uppercase tracking-wide text-ink">
          {title}
        </h4>
        <span className="text-[10px] text-muted">{unit}</span>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <ComposedChart
          data={data}
          margin={{ top: 4, right: 8, bottom: 0, left: -12 }}
        >
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
          <Tooltip
            contentStyle={{
              background: "#f4efe4",
              border: "1px solid rgba(28,61,90,0.2)",
              borderRadius: 2,
              fontSize: 11,
            }}
            labelStyle={{ color: "#1a1a17" }}
            formatter={(v: number | string) => [`${v} ${unit}`, ""]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
