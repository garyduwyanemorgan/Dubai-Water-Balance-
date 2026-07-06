"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CLIMATE_OPTIONS,
  DEFAULT_PARAMS,
  DISCLAIMER,
  INTERVENTION_OPTIONS,
  SLIDER_CONFIG,
} from "@/lib/constants";
import type {
  ClimateScenario,
  InterventionPackage,
  ScenarioParams,
} from "@/lib/types";
import {
  computeScenario,
  MARINE_AMBIENT,
  WATER_TABLE_BANDS,
} from "@/lib/scenarios";
import { paramsToQuery, queryToParams } from "@/lib/share";
import Slider from "@/components/ui/Slider";
import Toggle from "@/components/ui/Toggle";
import TrajectoryChart from "@/components/viz/TrajectoryChart";

export default function Trajectory() {
  const [params, setParams] = useState<ScenarioParams>(DEFAULT_PARAMS);
  const [copied, setCopied] = useState(false);

  // Hydrate from any shared URL params after mount (avoids SSR mismatch).
  useEffect(() => {
    if (window.location.search) {
      setParams(queryToParams(window.location.search));
    }
  }, []);

  // Keep the URL in sync so the current scenario is always shareable.
  useEffect(() => {
    const query = paramsToQuery(params);
    const url = `${window.location.pathname}?${query}#trajectory`;
    window.history.replaceState(null, "", url);
  }, [params]);

  const result = useMemo(() => computeScenario(params), [params]);

  function set<K extends keyof ScenarioParams>(
    key: K,
    value: ScenarioParams[K]
  ) {
    setParams((p) => ({ ...p, [key]: value }));
  }

  async function share() {
    const url = `${window.location.origin}${window.location.pathname}?${paramsToQuery(params)}#trajectory`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this scenario link:", url);
    }
  }

  const e = result.endpoints;

  return (
    <section
      id="trajectory"
      className="scene flex min-h-screen flex-col justify-center bg-sand-light px-6 py-20 md:pl-48 md:pr-10"
    >
      <div className="mx-auto w-full max-w-6xl">
        <span className="text-xs uppercase tracking-widest text-muted">
          04 · Project Forward
        </span>
        <h2 className="mt-4 font-serif text-2xl leading-tight text-ink md:text-4xl">
          What happens if the next 15 years look like the last 15?
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Controls */}
          <div className="space-y-6">
            <Slider
              label={SLIDER_CONFIG.tseReuse.label}
              value={params.tseReuse}
              min={SLIDER_CONFIG.tseReuse.min}
              max={SLIDER_CONFIG.tseReuse.max}
              step={SLIDER_CONFIG.tseReuse.step}
              unit={SLIDER_CONFIG.tseReuse.unit}
              format={(v) => v.toFixed(1)}
              onChange={(v) => set("tseReuse", v)}
            />
            <Slider
              label={SLIDER_CONFIG.leakageRate.label}
              value={params.leakageRate}
              min={SLIDER_CONFIG.leakageRate.min}
              max={SLIDER_CONFIG.leakageRate.max}
              step={SLIDER_CONFIG.leakageRate.step}
              unit={SLIDER_CONFIG.leakageRate.unit}
              onChange={(v) => set("leakageRate", v)}
            />
            <Slider
              label={SLIDER_CONFIG.irrigationRate.label}
              value={params.irrigationRate}
              min={SLIDER_CONFIG.irrigationRate.min}
              max={SLIDER_CONFIG.irrigationRate.max}
              step={SLIDER_CONFIG.irrigationRate.step}
              unit={SLIDER_CONFIG.irrigationRate.unit}
              onChange={(v) => set("irrigationRate", v)}
            />
            <Slider
              label={SLIDER_CONFIG.stormPulse.label}
              value={params.stormPulse}
              min={SLIDER_CONFIG.stormPulse.min}
              max={SLIDER_CONFIG.stormPulse.max}
              step={SLIDER_CONFIG.stormPulse.step}
              unit={SLIDER_CONFIG.stormPulse.unit}
              onChange={(v) => set("stormPulse", v)}
            />
            <Toggle<ClimateScenario>
              label="Climate scenario"
              value={params.climate}
              options={CLIMATE_OPTIONS}
              onChange={(v) => set("climate", v)}
            />
            <Toggle<InterventionPackage>
              label="Intervention package"
              value={params.intervention}
              options={INTERVENTION_OPTIONS}
              onChange={(v) => set("intervention", v)}
            />

            <div className="flex flex-col gap-2 print:hidden">
              <button
                onClick={() => setParams(DEFAULT_PARAMS)}
                className="w-full rounded-sm border border-deepblue/30 px-4 py-2 text-sm font-medium text-deepblue transition-colors hover:bg-deepblue hover:text-sand-light"
              >
                Reset to current trajectory
              </button>
              <div className="flex gap-2">
                <button
                  onClick={share}
                  className="flex-1 rounded-sm border border-deepblue/20 px-4 py-2 text-sm text-muted transition-colors hover:text-ink"
                >
                  {copied ? "Link copied ✓" : "Share this scenario"}
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 rounded-sm border border-deepblue/20 px-4 py-2 text-sm text-muted transition-colors hover:text-ink"
                >
                  Export PDF
                </button>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-3">
            <TrajectoryChart
              title="Shallow aquifer salinity"
              unit="dS/m"
              data={result.salinity}
              color="#3f6b5e"
            />
            <TrajectoryChart
              title="Cumulative salt loading to soil column"
              unit="t/km²"
              data={result.saltLoading}
              color="#c8881f"
            />
            <TrajectoryChart
              title="Rising water table depth (below surface)"
              unit="m"
              data={result.waterTable}
              color="#1c3d5a"
              inverted
              refBands={[
                { y1: WATER_TABLE_BANDS.red, y2: WATER_TABLE_BANDS.amber, color: "#c8881f", opacity: 0.14 },
                { y1: 0, y2: WATER_TABLE_BANDS.red, color: "#9b3434", opacity: 0.16 },
              ]}
            />
            <TrajectoryChart
              title="Marine salinity at brine discharge zone"
              unit="ppt"
              data={result.marine}
              color="#9b3434"
              refLines={[
                { y: MARINE_AMBIENT, label: "ambient Gulf", color: "#1c3d5a" },
              ]}
            />
          </div>
        </div>

        {/* Live summary sentence */}
        <p className="mt-8 border-l-2 border-amber pl-4 font-serif text-lg leading-relaxed text-ink md:text-xl">
          At this scenario, by 2040 the highest-application zones see shallow
          aquifer salinity reach{" "}
          <span className="font-semibold text-brackish">
            {e.salinity2040.value.toFixed(1)} dS/m
          </span>{" "}
          <span className="text-base font-normal text-muted">
            (plausible {e.salinity2040.lo.toFixed(1)}–
            {e.salinity2040.hi.toFixed(1)})
          </span>{" "}
          and water tables within{" "}
          <span className="font-semibold text-deepblue">
            {e.waterTableDepth2040.value.toFixed(1)} m
          </span>{" "}
          <span className="text-base font-normal text-muted">
            (plausible {e.waterTableDepth2040.lo.toFixed(1)}–
            {e.waterTableDepth2040.hi.toFixed(1)})
          </span>{" "}
          of the surface.
        </p>

        <p className="mt-6 text-xs text-muted">
          {DISCLAIMER} Equations are first-order analytical projections (GSRM
          Tier 2), not full MODFLOW.{" "}
          <Link
            href="/methods"
            className="text-deepblue underline underline-offset-2 hover:text-deepblue-light"
          >
            Methods &amp; full equation disclosure ↗
          </Link>
        </p>
      </div>
    </section>
  );
}
