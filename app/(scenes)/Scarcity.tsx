import { getPopulation, getDesalination } from "@/lib/data";
import SparklineCounter from "@/components/viz/SparklineCounter";

export default function Scarcity() {
  const population = getPopulation();
  const desalination = getDesalination();

  return (
    <section
      id="scarcity"
      className="scene flex min-h-screen flex-col items-center justify-center bg-sand px-6 py-20 md:pl-44"
    >
      <div className="mx-auto max-w-2xl text-center">
        {/* Brand mark — visible on every viewport (the nav rail is desktop-only) */}
        <div className="mb-8 flex justify-center">
          <div className="group relative inline-flex">
            <span
              aria-hidden
              className="absolute -inset-2 rounded-full bg-gradient-to-tr from-brackish via-amber to-brine opacity-60 blur-lg transition-all duration-500 group-hover:opacity-100"
            />
            <img
              src="/logo.png"
              alt="GDM Enviro Consulting logo"
              width={80}
              height={80}
              className="relative h-20 w-20 rounded-full object-cover shadow-xl ring-2 ring-sand-light transition-transform duration-500 ease-hydro group-hover:scale-105"
            />
          </div>
        </div>
        <span className="text-xs uppercase tracking-widest text-muted">
          01 · The Old Problem
        </span>
        <h1 className="mt-6 font-serif text-3xl leading-tight text-ink md:text-5xl">
          Dubai was built on the assumption that water is the constraint.
        </h1>
        <p className="mt-6 text-base leading-relaxed text-ink/70 md:text-lg">
          Population 1985 → 2024: 370,000 → 3.7 million. Tenfold growth in one
          professional generation.
        </p>

        <div className="mt-14">
          <SparklineCounter
            population={population}
            desalination={desalination}
          />
        </div>

        <p className="mt-16 font-serif text-xl italic text-deepblue md:text-2xl">
          The premise no longer holds.
        </p>
      </div>
    </section>
  );
}
