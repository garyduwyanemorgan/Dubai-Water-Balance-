import type { ScenarioParams } from "./types";

export const SCENE_IDS = [
  "scarcity",
  "inversion",
  "compartments",
  "trajectory",
  "gap",
] as const;

export type SceneId = (typeof SCENE_IDS)[number];

export const SCENES: { id: SceneId; label: string; title: string }[] = [
  { id: "scarcity", label: "01", title: "The Old Problem" },
  { id: "inversion", label: "02", title: "What Changed" },
  { id: "compartments", label: "03", title: "Where It All Goes" },
  { id: "trajectory", label: "04", title: "Project Forward" },
  { id: "gap", label: "05", title: "The Question Nobody Owns" },
];

export const DEFAULT_PARAMS: ScenarioParams = {
  tseReuse: 1.5,
  leakageRate: 15,
  irrigationRate: 100,
  climate: "observed",
  stormPulse: 3,
  intervention: "none",
};

export const SLIDER_CONFIG = {
  tseReuse: { min: 0.5, max: 2.5, step: 0.1, unit: "million m³/day", label: "TSE reuse volume" },
  leakageRate: { min: 5, max: 25, step: 1, unit: "% of throughput", label: "Network leakage rate" },
  irrigationRate: { min: 50, max: 200, step: 5, unit: "% of baseline", label: "Irrigation application rate" },
  stormPulse: { min: 1, max: 10, step: 1, unit: "events/decade", label: "Storm pulse frequency" },
} as const;

export const CLIMATE_OPTIONS = [
  { value: "observed", label: "Observed" },
  { value: "rcp45", label: "RCP 4.5" },
  { value: "rcp85", label: "RCP 8.5" },
] as const;

export const INTERVENTION_OPTIONS = [
  { value: "none", label: "None" },
  { value: "monitoring", label: "Monitoring" },
  { value: "quality", label: "Quality polishing" },
  { value: "full", label: "Full integrated" },
] as const;

export const DISCLAIMER =
  "Reference physics, illustrative scenarios — not site-calibrated.";

export const CONTACT_EMAIL = "gary@gdm-enviro.com";
