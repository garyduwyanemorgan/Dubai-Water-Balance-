import CompartmentDiagram from "@/components/viz/CompartmentDiagram";

export default function Compartments() {
  return (
    <section
      id="compartments"
      className="scene flex min-h-screen flex-col justify-center bg-sand px-6 py-20 md:pl-48 md:pr-10"
    >
      <div className="mx-auto w-full max-w-6xl">
        <span className="text-xs uppercase tracking-widest text-muted">
          03 · Where It All Goes
        </span>
        <h2 className="mt-4 font-serif text-2xl leading-tight text-ink md:text-4xl">
          Four compartments. The flows between them are the integration.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Every compartment has an authority and a target — except the shallow
          subsurface, where the inversion is actually happening.
        </p>

        <div className="mt-8">
          <CompartmentDiagram />
        </div>
      </div>
    </section>
  );
}
