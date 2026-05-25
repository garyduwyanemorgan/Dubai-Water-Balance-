"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { getSource, formatCitation, statusLabel } from "@/lib/citations";

interface Props {
  sourceKey: string | null;
  context?: string;
  onClose: () => void;
}

export default function SourceModal({ sourceKey, context, onClose }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (sourceKey) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [sourceKey, onClose]);

  const source = sourceKey ? getSource(sourceKey) : undefined;

  return (
    <AnimatePresence>
      {source && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Source citation"
            className="relative z-10 w-full max-w-lg rounded-sm border border-deepblue/15 bg-sand-light p-6 shadow-xl"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 text-muted hover:text-ink"
            >
              ✕
            </button>
            <div className="mb-3 inline-block rounded-sm bg-deepblue/10 px-2 py-1 text-xs uppercase tracking-wide text-deepblue">
              {statusLabel(source.status)}
            </div>
            <h3 className="font-serif text-xl leading-snug text-ink">
              {source.title}
            </h3>
            <p className="mt-1 text-sm text-muted">{formatCitation(source)}</p>

            {context && (
              <p className="mt-4 text-sm leading-relaxed text-ink/80">
                {context}
              </p>
            )}

            <dl className="mt-4 space-y-2 border-t border-deepblue/10 pt-4 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted">
                  Claim used
                </dt>
                <dd className="text-ink/90">{source.claim_used}</dd>
              </div>
              {source.notes && (
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted">
                    Verification note
                  </dt>
                  <dd className="text-ink/70">{source.notes}</dd>
                </div>
              )}
            </dl>

            {(source.url || source.doi) && (
              <a
                href={source.url || `https://doi.org/${source.doi}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-sm font-medium text-deepblue underline underline-offset-4 hover:text-deepblue-light"
              >
                {source.doi ? `doi:${source.doi}` : "View source"} ↗
              </a>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
