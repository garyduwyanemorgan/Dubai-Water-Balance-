"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { TimePoint } from "@/lib/data";
import CitationTooltip from "@/components/ui/CitationTooltip";

interface Props {
  population: TimePoint[];
  desalination: TimePoint[];
}

export default function SparklineCounter({ population, desalination }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const startPop = population[0];
  const endPop = population[population.length - 1];

  const count = useMotionValue(startPop.value);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(startPop.value);

  useEffect(() => {
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => unsub();
  }, [rounded]);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, endPop.value, {
      duration: 2.4,
      ease: [0.22, 0.61, 0.36, 1],
    });
    return () => controls.stop();
  }, [inView, count, endPop.value]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-8">
      <div className="text-center">
        <motion.span
          className="block font-serif text-6xl font-semibold tabular-nums text-deepblue md:text-7xl"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          {display.toLocaleString("en-US")}
        </motion.span>
        <span className="mt-2 block text-sm text-muted">
          Dubai population · {startPop.year} → {endPop.year}
        </span>
      </div>

      <Sparkline data={desalination} inView={inView} />
    </div>
  );
}

function Sparkline({ data, inView }: { data: TimePoint[]; inView: boolean }) {
  const w = 280;
  const h = 64;
  const pad = 4;
  const xs = data.map((d) => d.year);
  const ys = data.map((d) => d.value);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);

  const points = data.map((d) => {
    const x = pad + ((d.year - minX) / (maxX - minX)) * (w - pad * 2);
    const y = h - pad - (d.value / maxY) * (h - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const path = `M ${points.join(" L ")}`;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={w} height={h} role="img" aria-label="UAE desalination capacity growth">
        <motion.path
          d={path}
          fill="none"
          stroke="#1c3d5a"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 2, ease: [0.22, 0.61, 0.36, 1] }}
        />
      </svg>
      <CitationTooltip sourceKey="src_013">
        <span className="text-xs text-muted">
          UAE desalination capacity, {minX}–{maxX}
        </span>
      </CitationTooltip>
    </div>
  );
}
