import type { Metadata } from "next";
import Link from "next/link";
import coeff from "@/data/scenarios.json";
import { getAllSources, statusLabel } from "@/lib/citations";
import { DISCLAIMER } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Methods — The Inversion | GDM Enviro Consulting",
  description:
    "Full disclosure of the reference-physics equations, coefficients, and sources behind the Gulf Water Inversion scenario engine.",
};

function Eq({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-3 overflow-x-auto rounded-sm border border-deepblue/10 bg-sand-light px-4 py-3 font-serif text-lg text-deepblue">
      {children}
    </div>
  );
}

function Coef({ k, v, src }: { k: string; v: string | number; src?: string }) {
  return (
    <tr className="border-b border-deepblue/10">
      <td className="py-1.5 pr-4 font-medium text-ink">{k}</td>
      <td className="py-1.5 pr-4 tabular-nums text-deepblue">{v}</td>
      <td className="py-1.5 text-xs text-muted">{src ?? "—"}</td>
    </tr>
  );
}

export default function MethodsPage() {
  const sources = getAllSources();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/#trajectory"
        className="text-sm text-deepblue underline underline-offset-4 hover:text-deepblue-light"
      >
        ← Back to the scenario engine
      </Link>

      <h1 className="mt-6 font-serif text-3xl text-ink md:text-4xl">
        Methods
      </h1>

      <div className="mt-4 rounded-sm border border-amber/40 bg-amber/10 px-4 py-3 text-sm text-amber-dark">
        <strong>{DISCLAIMER}</strong> These are first-order analytical
        projections in the GSRM Tier 2 sense — physically grounded but not
        site-calibrated. The point is responsiveness to the parameter space,
        not site-specific accuracy. Full Tier 3 (site-calibrated
        MODFLOW/PHREEQC) is a separate body of work.
      </div>

      {/* Equation 1 */}
      <section className="mt-10">
        <h2 className="font-serif text-2xl text-deepblue">
          1 · Shallow aquifer salinity trajectory
        </h2>
        <Eq>S(t) = S₀ + R · t · M(L, I, C)</Eq>
        <p className="text-sm leading-relaxed text-ink/80">
          Salinity grows linearly from a baseline at a base rate, scaled by a
          multiplier <em>M</em> that combines leakage rate <em>L</em>,
          irrigation rate <em>I</em>, and climate scenario <em>C</em> (and the
          selected intervention package). At default parameters <em>M</em> ≈ 1,
          reproducing the published current trajectory.
        </p>
        <table className="mt-3 w-full text-sm">
          <tbody>
            <Coef k="S₀ baseline" v={`${coeff.salinity.S0} dS/m`} src={coeff.salinity.S0_source} />
            <Coef k="R base rate" v={`${coeff.salinity.R} dS/m/year`} src={coeff.salinity.R_source} />
            <Coef k="Climate factor (observed / RCP4.5 / RCP8.5)" v={`${coeff.salinity.climateFactor.observed} / ${coeff.salinity.climateFactor.rcp45} / ${coeff.salinity.climateFactor.rcp85}`} />
          </tbody>
        </table>
      </section>

      {/* Equation 2 */}
      <section className="mt-10">
        <h2 className="font-serif text-2xl text-deepblue">
          2 · Cumulative salt loading
        </h2>
        <Eq>Q_salt(t) = Σ V_TSE · c_(Na+Cl) · f_ret · k_soil</Eq>
        <p className="text-sm leading-relaxed text-ink/80">
          Per-year integration of salt delivered to the soil column from reused
          water. TSE volume comes from the slider; concentration from the IR222
          baseline; the irrigation return fraction and soil dissolution
          multiplier are held constant.
        </p>
        <table className="mt-3 w-full text-sm">
          <tbody>
            <Coef k="c_(Na+Cl) concentration" v={`${coeff.saltLoading.c_NaCl} mg/L`} src={coeff.saltLoading.c_NaCl_source} />
            <Coef k="f_ret irrigation return fraction" v={coeff.saltLoading.f_ret} src={coeff.saltLoading.f_ret_source} />
            <Coef k="k_soil dissolution multiplier" v={coeff.saltLoading.k_soil} />
          </tbody>
        </table>
      </section>

      {/* Equation 3 */}
      <section className="mt-10">
        <h2 className="font-serif text-2xl text-deepblue">
          3 · Water table rise
        </h2>
        <Eq>Δh(t) = R_net(L, I, P) · t / n_e</Eq>
        <p className="text-sm leading-relaxed text-ink/80">
          Net recharge (a function of leakage, irrigation, and storm-pulse
          frequency <em>P</em>) accumulates as head rise, divided by effective
          porosity. Reported as depth below surface from a starting depth; an
          amber band marks &lt;{coeff.waterTable.amberDepth} m and red marks
          &lt;{coeff.waterTable.redDepth} m.
        </p>
        <table className="mt-3 w-full text-sm">
          <tbody>
            <Coef k="Starting depth" v={`${coeff.waterTable.startDepth} m`} />
            <Coef k="n_e effective porosity" v={coeff.waterTable.n_e} src={coeff.waterTable.n_e_source} />
          </tbody>
        </table>
      </section>

      {/* Equation 4 */}
      <section className="mt-10">
        <h2 className="font-serif text-2xl text-deepblue">
          4 · Marine compartment salinity
        </h2>
        <Eq>S_marine(t) = S_ambient + ΔS · (1 − e^(−τ·t))</Eq>
        <p className="text-sm leading-relaxed text-ink/80">
          A simple mixing-cell model: near-shore salinity rises asymptotically
          above ambient Gulf salinity with brine input and turnover damping. Land
          reuse marginally offsets discharge to the sea.
        </p>
        <table className="mt-3 w-full text-sm">
          <tbody>
            <Coef k="S_ambient Gulf salinity" v={`${coeff.marine.ambient} ppt`} src={coeff.marine.ambient_source} />
            <Coef k="Mixing sensitivity ΔS" v={coeff.marine.mixingSensitivity} />
            <Coef k="Turnover damping τ" v={coeff.marine.turnoverDamping} />
          </tbody>
        </table>
      </section>

      {/* Source registry */}
      <section className="mt-12">
        <h2 className="font-serif text-2xl text-deepblue">Source registry</h2>
        <p className="mt-2 text-sm text-muted">
          Every numerical claim in the app references one of these keys. Status
          flags indicate verification state — figures are provisional and have
          not been independently re-verified against original documents.
        </p>
        <div className="mt-4 space-y-4">
          {Object.entries(sources).map(([key, s]) => (
            <div
              key={key}
              className="rounded-sm border border-deepblue/10 bg-sand-light p-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-mono text-xs text-muted">{key}</span>
                <span className="rounded-sm bg-deepblue/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-deepblue">
                  {statusLabel(s.status)}
                </span>
              </div>
              <h3 className="mt-1 text-sm font-medium text-ink">{s.title}</h3>
              <p className="text-xs text-muted">
                {s.authors} ({s.year})
                {s.journal ? ` · ${s.journal}` : ""}
              </p>
              <p className="mt-2 text-xs text-ink/80">
                <span className="text-muted">Claim: </span>
                {s.claim_used}
              </p>
              {(s.url || s.doi) && (
                <a
                  href={s.url || `https://doi.org/${s.doi}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-xs text-deepblue underline underline-offset-2"
                >
                  {s.doi ? `doi:${s.doi}` : "source"} ↗
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-12 border-t border-deepblue/10 pt-6 text-xs text-muted">
        <span className="font-serif font-semibold text-deepblue">GDM</span>{" "}
        Enviro Consulting · The Inversion — Reading the Subsurface
      </footer>
    </main>
  );
}
