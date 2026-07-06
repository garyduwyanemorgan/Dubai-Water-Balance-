export type SourceStatus =
  | "verify"
  | "triangulate"
  | "peer-reviewed"
  | "in-hand"
  | "official"
  | "industry"
  | "secondary"
  | "synthesis"
  | "reference"
  | "unverified";

export interface Source {
  title: string;
  authors: string;
  year: number;
  journal: string;
  doi: string;
  url: string;
  claim_used: string;
  confidence: string;
  status: SourceStatus;
  notes: string;
}

export type SourceRegistry = Record<string, Source>;

export interface Finding {
  id: string;
  number: string;
  headline: string;
  source: string;
  context: string;
}

export interface Authority {
  name: string;
  kpi: string;
}

export interface CompartmentBand {
  id: string;
  label: string;
  sublabel: string;
  color: string;
  authorities: Authority[];
  hasOwner: boolean;
  panel: {
    enters: string;
    accumulates: string;
    unmeasured: string;
  };
}

export interface Inflow {
  id: string;
  label: string;
  target: string;
  color: string;
  weight: "thick" | "thin";
  pattern: "continuous" | "intermittent";
  tooltip: string;
  source: string;
}

export interface InternalFlow {
  id: string;
  label: string;
  from: string;
  to: string;
  color: string;
  direction: "up" | "down";
  tooltip: string;
  source: string;
}

export type ClimateScenario = "observed" | "rcp45" | "rcp85";
export type InterventionPackage = "none" | "monitoring" | "quality" | "full";

export interface ScenarioParams {
  tseReuse: number;
  leakageRate: number;
  irrigationRate: number;
  climate: ClimateScenario;
  stormPulse: number;
  intervention: InterventionPackage;
}

export interface SeriesPoint {
  year: number;
  value: number;
  /** Lower bound of the plausible (p10) uncertainty envelope. */
  lo?: number;
  /** Upper bound of the plausible (p90) uncertainty envelope. */
  hi?: number;
}

/** A central value with its plausible low/high envelope at the 2040 horizon. */
export interface Endpoint {
  value: number;
  lo: number;
  hi: number;
}

export interface ScenarioResult {
  salinity: SeriesPoint[];
  saltLoading: SeriesPoint[];
  waterTable: SeriesPoint[];
  marine: SeriesPoint[];
  endpoints: {
    salinity2040: Endpoint;
    waterTableDepth2040: Endpoint;
    saltLoading2040: Endpoint;
    marine2040: Endpoint;
  };
}
