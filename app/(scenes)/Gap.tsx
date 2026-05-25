"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gapsData from "@/data/gaps.json";

const { deliverables, quote, contact } = gapsData;

export default function Gap() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section
      id="gap"
      className="scene flex min-h-screen flex-col justify-center bg-sand px-6 py-20 md:pl-48 md:pr-10"
    >
      <div className="mx-auto w-full max-w-6xl">
        <span className="text-xs uppercase tracking-widest text-muted">
          05 · The Question Nobody Owns
        </span>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left — eight gaps */}
          <div>
            <h2 className="font-serif text-2xl leading-tight text-ink md:text-3xl">
              Eight deliverables. None of them owned.
            </h2>
            <ul className="mt-6 divide-y divide-deepblue/10 border-y border-deepblue/10">
              {deliverables.map((d, i) => (
                <li key={d.id}>
                  <button
                    onClick={() => setOpen(open === d.id ? null : d.id)}
                    className="flex w-full items-baseline justify-between gap-4 py-3 text-left"
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="font-serif text-sm tabular-nums text-muted">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm text-ink">{d.title}</span>
                    </span>
                    <span className="text-xs text-deepblue">
                      {open === d.id ? "−" : "explain"}
                    </span>
                  </button>
                  <AnimatePresence>
                    {open === d.id && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
                        className="overflow-hidden pb-3 pl-8 pr-2 text-sm leading-relaxed text-muted"
                      >
                        {d.explain}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — closing statement */}
          <div className="flex flex-col justify-center">
            <blockquote className="font-serif text-xl leading-relaxed text-ink md:text-2xl">
              {quote.body.split("\n\n").map((para, i) => (
                <p key={i} className={i > 0 ? "mt-5" : ""}>
                  {para}
                </p>
              ))}
            </blockquote>
            <cite className="mt-6 block text-sm not-italic text-muted">
              — {quote.attribution}
            </cite>

            <p className="mt-12 text-sm text-muted">
              {contact.lead} {contact.body}{" "}
              <a
                href={`mailto:${contact.email}`}
                className="text-deepblue underline underline-offset-4 hover:text-deepblue-light"
              >
                {contact.email}
              </a>
              .
            </p>
          </div>
        </div>

        <footer className="mt-16 border-t border-deepblue/10 pt-6 text-xs text-muted">
          <span className="font-serif font-semibold text-deepblue">GDM</span>{" "}
          Enviro Consulting · The Inversion — Reading the Subsurface ·{" "}
          Reference physics, illustrative scenarios — not site-calibrated.
        </footer>
      </div>
    </section>
  );
}
