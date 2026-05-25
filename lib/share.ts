import type {
  ClimateScenario,
  InterventionPackage,
  ScenarioParams,
} from "./types";
import { DEFAULT_PARAMS, SLIDER_CONFIG } from "./constants";

const CLIMATES: ClimateScenario[] = ["observed", "rcp45", "rcp85"];
const INTERVENTIONS: InterventionPackage[] = [
  "none",
  "monitoring",
  "quality",
  "full",
];

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function num(
  raw: string | null,
  fallback: number,
  min: number,
  max: number,
  step: number
): number {
  if (raw === null) return fallback;
  const v = Number(raw);
  if (!Number.isFinite(v)) return fallback;
  const snapped = Math.round(v / step) * step;
  return clamp(Number(snapped.toFixed(2)), min, max);
}

export function paramsToQuery(p: ScenarioParams): string {
  const q = new URLSearchParams({
    tse: String(p.tseReuse),
    leak: String(p.leakageRate),
    irr: String(p.irrigationRate),
    climate: p.climate,
    storm: String(p.stormPulse),
    interv: p.intervention,
  });
  return q.toString();
}

export function queryToParams(search: string): ScenarioParams {
  const q = new URLSearchParams(search);
  const climate = q.get("climate") as ClimateScenario | null;
  const interv = q.get("interv") as InterventionPackage | null;
  return {
    tseReuse: num(
      q.get("tse"),
      DEFAULT_PARAMS.tseReuse,
      SLIDER_CONFIG.tseReuse.min,
      SLIDER_CONFIG.tseReuse.max,
      SLIDER_CONFIG.tseReuse.step
    ),
    leakageRate: num(
      q.get("leak"),
      DEFAULT_PARAMS.leakageRate,
      SLIDER_CONFIG.leakageRate.min,
      SLIDER_CONFIG.leakageRate.max,
      SLIDER_CONFIG.leakageRate.step
    ),
    irrigationRate: num(
      q.get("irr"),
      DEFAULT_PARAMS.irrigationRate,
      SLIDER_CONFIG.irrigationRate.min,
      SLIDER_CONFIG.irrigationRate.max,
      SLIDER_CONFIG.irrigationRate.step
    ),
    climate:
      climate && CLIMATES.includes(climate)
        ? climate
        : DEFAULT_PARAMS.climate,
    stormPulse: num(
      q.get("storm"),
      DEFAULT_PARAMS.stormPulse,
      SLIDER_CONFIG.stormPulse.min,
      SLIDER_CONFIG.stormPulse.max,
      SLIDER_CONFIG.stormPulse.step
    ),
    intervention:
      interv && INTERVENTIONS.includes(interv)
        ? interv
        : DEFAULT_PARAMS.intervention,
  };
}

export function isDefault(p: ScenarioParams): boolean {
  return (
    p.tseReuse === DEFAULT_PARAMS.tseReuse &&
    p.leakageRate === DEFAULT_PARAMS.leakageRate &&
    p.irrigationRate === DEFAULT_PARAMS.irrigationRate &&
    p.climate === DEFAULT_PARAMS.climate &&
    p.stormPulse === DEFAULT_PARAMS.stormPulse &&
    p.intervention === DEFAULT_PARAMS.intervention
  );
}
