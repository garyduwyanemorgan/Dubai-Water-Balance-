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
