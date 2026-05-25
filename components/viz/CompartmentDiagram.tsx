"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import compartments from "@/data/compartments.json";
import type { CompartmentBand, Inflow, InternalFlow } from "@/lib/types";

const bands = compartments.bands as CompartmentBand[];
const inflows = compartments.inflows as Inflow[];
const internalFlows = compartments.internalFlows as InternalFlow[];

const COLOR: Record<string, string> = {
  sand: "#c8a96a",
  brackish: "#3f6b5e",
  deepblue: "#1c3d5a",
  amber: "#c8881f",
  brine: "#9b3434",
  muted: "#6b6a63",
};

const BAND_FILL: Record<string, string> = {
  surface: "#efe7d6",
  shallow: "#e4ddcb",
  deep: "#dcd3bd",
  marine: "#d3cbb4",
};

// Geometry (viewBox units)
const W = 1000;
const BAND_H = 110;
const GAP = 6;
const TOP = 20;
const LEFT = 40;
const RIGHT = 760;

function bandY(i: number) {
  return TOP + i * (BAND_H + GAP);
}

export default function CompartmentDiagram() {
  const [selected, setSelected] = useState<CompartmentBand | null>(null);
  const [hover, setHover] = useState<{ text: string; x: number; y: number } | null>(
    null
  );

  const totalH = TOP + bands.length * (BAND_H + GAP) + 10;

  function bandIndex(id: string) {
    return bands.findIndex((b) => b.id === id);
  }

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${W} ${totalH}`}
        className="w-full"
        role="img"
        aria-label="Four-compartment water system diagram"
      >
        <defs>
          {Object.entries(COLOR).map(([k, v]) => (
            <marker
              key={k}
              id={`arrow-${k}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={v} />
            </marker>
          ))}
        </defs>

        {/* Bands */}
        {bands.map((band, i) => {
          const y = bandY(i);
          return (
            <g
              key={band.id}
              onClick={() => setSelected(band)}
              className="cursor-pointer"
            >
              <rect
                x={LEFT}
                y={y}
                width={RIGHT - LEFT}
                height={BAND_H}
                fill={BAND_FILL[band.id]}
                stroke={band.hasOwner ? "rgba(28,61,90,0.18)" : "#c8881f"}
                strokeWidth={band.hasOwner ? 1 : 2}
                strokeDasharray={band.hasOwner ? "0" : "6 4"}
                rx={2}
              />
              <text
                x={LEFT + 18}
                y={y + 34}
                className="font-semibold"
                fontSize={18}
                fill="#1a1a17"
              >
                {band.label}
              </text>
              <text x={LEFT + 18} y={y + 56} fontSize={12} fill="#6b6a63">
                {band.sublabel}
              </text>

              {/* Institutional KPI overlay (right side) */}
              {band.hasOwner ? (
                band.authorities.map((a, ai) => (
                  <text
                    key={a.name}
                    x={RIGHT + 16}
                    y={y + 24 + ai * 20}
                    fontSize={12}
                    fill="#1c3d5a"
                  >
                    <tspan className="font-medium">{a.name}</tspan>
                    <tspan fill="#6b6a63"> · {a.kpi}</tspan>
                  </text>
                ))
              ) : (
                <g>
                  <text
                    x={RIGHT + 16}
                    y={y + 40}
                    fontSize={34}
                    className="font-serif font-semibold"
                    fill="#c8881f"
                  >
                    ?
                  </text>
                  <text x={RIGHT + 52} y={y + 36} fontSize={12} fill="#9c6912">
                    no authority
                  </text>
                  <text x={RIGHT + 52} y={y + 52} fontSize={12} fill="#9c6912">
                    listed
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Inbound flow arrows (from left margin into target band) */}
        {inflows.map((flow, idx) => {
          const ti = bandIndex(flow.target);
          const ty = bandY(ti) + 28 + (idx % 3) * 22;
          const stroke = COLOR[flow.color];
          return (
            <g
              key={flow.id}
              onMouseEnter={(e) =>
                setHover({
                  text: flow.tooltip,
                  x: e.nativeEvent.offsetX,
                  y: e.nativeEvent.offsetY,
                })
              }
              onMouseLeave={() => setHover(null)}
              className="cursor-help"
            >
              <motion.line
                x1={2}
                y1={ty}
                x2={LEFT}
                y2={ty}
                stroke={stroke}
                strokeWidth={flow.weight === "thick" ? 4 : 2}
                strokeDasharray={flow.pattern === "intermittent" ? "8 6" : "0"}
                markerEnd={`url(#arrow-${flow.color})`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: idx * 0.15, ease: "easeOut" }}
              />
              <text x={4} y={ty - 6} fontSize={10} fill={stroke}>
                {flow.label}
              </text>
            </g>
          );
        })}

        {/* Internal vertical flows between bands */}
        {internalFlows.map((flow, idx) => {
          const fi = bandIndex(flow.from);
          const ti = bandIndex(flow.to);
          const x = LEFT + 150 + idx * 110;
          const yFrom =
            flow.direction === "down"
              ? bandY(fi) + BAND_H
              : bandY(fi);
          const yTo =
            flow.direction === "down" ? bandY(ti) : bandY(ti) + BAND_H;
          const stroke = COLOR[flow.color];
          return (
            <g
              key={flow.id}
              onMouseEnter={(e) =>
                setHover({
                  text: flow.tooltip,
                  x: e.nativeEvent.offsetX,
                  y: e.nativeEvent.offsetY,
                })
              }
              onMouseLeave={() => setHover(null)}
              className="cursor-help"
            >
              <motion.line
                x1={x}
                y1={yFrom}
                x2={x}
                y2={yTo}
                stroke={stroke}
                strokeWidth={flow.id === "downward" ? 1.5 : 2.5}
                strokeDasharray={flow.id === "downward" ? "3 4" : "0"}
                markerEnd={`url(#arrow-${flow.color})`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 1.4,
                  delay: 0.6 + idx * 0.2,
                  ease: "easeOut",
                }}
              />
              <text
                x={x + 6}
                y={(yFrom + yTo) / 2}
                fontSize={9.5}
                fill={stroke}
                className="font-medium"
              >
                {flow.label}
              </text>
            </g>
          );
        })}
      </svg>

      {hover && (
        <div
          className="pointer-events-none absolute z-20 max-w-xs rounded-sm border border-deepblue/20 bg-sand-light px-3 py-2 text-xs leading-snug text-ink shadow-lg"
          style={{
            left: Math.min(hover.x + 12, 640),
            top: hover.y + 12,
          }}
        >
          {hover.text}
        </div>
      )}

      <p className="mt-3 text-center text-xs text-muted">
        Click any compartment to explore. Hover any flow for volume, chemistry,
        and source.
      </p>

      <SidePanel band={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function SidePanel({
  band,
  onClose,
}: {
  band: CompartmentBand | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {band && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-ink/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 h-screen w-full max-w-md overflow-y-auto border-l border-deepblue/15 bg-sand-light p-6 shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-5 top-5 text-muted hover:text-ink"
            >
              ✕
            </button>
            <h3 className="font-serif text-2xl text-deepblue">{band.label}</h3>
            <p className="text-sm text-muted">{band.sublabel}</p>

            <div className="mt-6 space-y-5">
              <PanelRow label="What enters" body={band.panel.enters} />
              <PanelRow label="What accumulates" body={band.panel.accumulates} />
              <PanelRow
                label="What no-one is measuring"
                body={band.panel.unmeasured}
                warn
              />
            </div>

            <div className="mt-6 border-t border-deepblue/10 pt-4">
              <span className="text-xs uppercase tracking-wide text-muted">
                Institutional ownership
              </span>
              {band.hasOwner ? (
                <ul className="mt-2 space-y-1 text-sm text-ink">
                  {band.authorities.map((a) => (
                    <li key={a.name}>
                      <span className="font-medium text-deepblue">{a.name}</span>
                      <span className="text-muted"> — {a.kpi}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm font-medium text-amber-dark">
                  No authority listed. This is the gap.
                </p>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function PanelRow({
  label,
  body,
  warn = false,
}: {
  label: string;
  body: string;
  warn?: boolean;
}) {
  return (
    <div>
      <span
        className={`text-xs uppercase tracking-wide ${
          warn ? "text-amber-dark" : "text-muted"
        }`}
      >
        {label}
      </span>
      <p className="mt-1 text-sm leading-relaxed text-ink/90">{body}</p>
    </div>
  );
}
