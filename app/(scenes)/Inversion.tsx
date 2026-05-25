"use client";

import { useState } from "react";
import findingsData from "@/data/findings.json";
import type { Finding } from "@/lib/types";
import Card from "@/components/ui/Card";
import SourceModal from "@/components/ui/SourceModal";

const findings = findingsData.cards as Finding[];

export default function Inversion() {
  const [modal, setModal] = useState<{ key: string; context: string } | null>(
    null
  );

  return (
    <section
      id="inversion"
      className="scene flex min-h-screen flex-col justify-center bg-sand-light px-6 py-20 md:pl-48 md:pr-10"
    >
      <div className="mx-auto w-full max-w-5xl">
        <span className="text-xs uppercase tracking-widest text-muted">
          02 · What Changed
        </span>
        <h2 className="mt-4 font-serif text-2xl leading-tight text-ink md:text-4xl">
          The inversion has already happened. Six findings.
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {findings.map((f, i) => (
            <Card
              key={f.id}
              finding={f}
              index={i}
              onOpen={(key, context) => setModal({ key, context })}
            />
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-3xl text-center text-sm leading-relaxed text-muted">
          {findingsData.closingLine}
        </p>
      </div>

      <SourceModal
        sourceKey={modal?.key ?? null}
        context={modal?.context}
        onClose={() => setModal(null)}
      />
    </section>
  );
}
