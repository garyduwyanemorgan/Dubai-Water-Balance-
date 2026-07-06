import coeff from "@/data/scenarios.json";
import type {
  Endpoint,
  ScenarioParams,
  ScenarioResult,
  SeriesPoint,
} from "./types";

// All equations are reference physics — illustrative, not site-calibrated.
// Defaults (DEFAULT_PARAMS) reproduce the "current trajectory": what happens
// if the next 15 years look like the last 15.

const { startYear, endYear } = coeff.horizon;

function years(): number[] {
  const out: number[] = [];
  for (let y = startYear; y <= endYear; y++) out.push(y);
  return out;
}

function climateFactor(c: ScenarioParams["climate"]): number {
  return coeff.salinity.climateFactor[c] ?? 1.0;
}

function interventionFactor(i: ScenarioParams["intervention"]): number {
  return (coeff.intervention as Record<string, number>)[i] ?? 1.0;
}

// Equation 1 — shallow aquifer salinity: S(t) = S0 + R·t·M(L,I,C)
function salinitySeries(p: ScenarioParams): SeriesPoint[] {
  const { S0, R, leakageRef, irrigationRef } = coeff.salinity;
  const leakageFactor = Math.pow(p.leakageRate / 100 / leakageRef, 0.5);
  const irrigationFactor = Math.pow(p.irrigationRate / 100 / irrigationRef, 0.6);
  const M =
    leakageFactor *
    irrigationFactor *
    climateFactor(p.climate) *
    interventionFactor(p.intervention);
  return years().map((year) => {
    const t = year - startYear;
    return { year, value: round(S0 + R * t * M) };
  });
}

// Equation 2 — cumulative salt loading (tonnes/km² per high-application zone)
function saltLoadingSeries(p: ScenarioParams): SeriesPoint[] {
  const { c_NaCl, f_ret, k_soil, unitScale } = coeff.saltLoading;
  const annual =
    p.tseReuse *
    c_NaCl *
    f_ret *
    k_soil *
    unitScale *
    (p.irrigationRate / 100) *
    interventionFactor(p.intervention);
  let cumulative = 0;
  return years().map((year) => {
    cumulative += annual;
    return { year, value: round(cumulative) };
  });
}

// Equation 3 — water table rise: depth below surface = startDepth − Δh(t)
function waterTableSeries(p: ScenarioParams): SeriesPoint[] {
  const { startDepth, n_e, rechargeRef, stormPulseRef } = coeff.waterTable;
  const leakageFactor = p.leakageRate / 100 / coeff.salinity.leakageRef;
  const irrigationFactor = p.irrigationRate / 100;
  const stormFactor = p.stormPulse / stormPulseRef;
  const annualRecharge =
    rechargeRef *
    (0.5 * leakageFactor + 0.4 * irrigationFactor + 0.1 * stormFactor);
  const headRisePerYear =
    (annualRecharge / n_e) * interventionFactor(p.intervention);
  return years().map((year) => {
    const t = year - startYear;
    const depth = Math.max(0, startDepth - headRisePerYear * t);
    return { year, value: round(depth) };
  });
}

// Equation 4 — marine compartment salinity (mixing-cell, ppt)
function marineSeries(p: ScenarioParams): SeriesPoint[] {
  const { ambient, brineRef, mixingSensitivity, turnoverDamping } = coeff.marine;
  // Less land reuse implies marginally more discharge to the sea.
  const brineFactor = 1 + 0.12 * (brineRef - p.tseReuse);
  return years().map((year) => {
    const t = year - startYear;
    const frac = 1 - Math.exp(-turnoverDamping * (t / (endYear - startYear)));
    const excess =
      mixingSensitivity *
      frac *
      brineFactor *
      interventionFactor(p.intervention);
    return { year, value: round(ambient + excess) };
  });
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

type BandKey = keyof typeof coeff.uncertainty;

// Attach a fanning p10–p90 envelope to a series. The half-width grows with the
// forecast horizon, so certainty is highest near "today" and widest at 2040.
// Illustrative only — this is scenario spread, not a calibrated statistical CI.
function withBand(series: SeriesPoint[], key: BandKey): SeriesPoint[] {
  const band = coeff.uncertainty[key] as { base: number; growth: number };
  return series.map((pt, i) => {
    const halfWidth = band.base + band.growth * i;
    return {
      ...pt,
      lo: round(Math.max(0, pt.value * (1 - halfWidth))),
      hi: round(pt.value * (1 + halfWidth)),
    };
  });
}

function endpoint(series: SeriesPoint[]): Endpoint {
  const p = series[series.length - 1];
  return { value: p.value, lo: p.lo ?? p.value, hi: p.hi ?? p.value };
}

export function computeScenario(p: ScenarioParams): ScenarioResult {
  const salinity = withBand(salinitySeries(p), "salinity");
  const saltLoading = withBand(saltLoadingSeries(p), "saltLoading");
  const waterTable = withBand(waterTableSeries(p), "waterTable");
  const marine = withBand(marineSeries(p), "marine");
  return {
    salinity,
    saltLoading,
    waterTable,
    marine,
    endpoints: {
      salinity2040: endpoint(salinity),
      waterTableDepth2040: endpoint(waterTable),
      saltLoading2040: endpoint(saltLoading),
      marine2040: endpoint(marine),
    },
  };
}

export const HORIZON = { startYear, endYear };
export const WATER_TABLE_BANDS = {
  amber: coeff.waterTable.amberDepth,
  red: coeff.waterTable.redDepth,
};
export const MARINE_AMBIENT = coeff.marine.ambient;
