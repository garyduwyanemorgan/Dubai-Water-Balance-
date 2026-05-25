"use client";

import { useState } from "react";
import { getSource, statusLabel } from "@/lib/citations";

interface Props {
  sourceKey: string;
  children: React.ReactNode;
}

// Inline citation chip: hover (desktop) or tap (touch) reveals a compact source.
export default function CitationTooltip({ sourceKey, children }: Props) {
  const [open, setOpen] = useState(false);
  const source = getSource(sourceKey);
  if (!source) return <>{children}</>;

  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <button
        type="button"
        className="cursor-help border-b border-dotted border-muted/60 text-left"
        aria-label={`Source: ${source.title}`}
        onClick={() => setOpen((o) => !o)}
      >
        {children}
      </button>
      {open && (
        <span className="absolute bottom-full left-0 z-40 mb-2 w-64 rounded-sm border border-deepblue/15 bg-sand-light p-3 text-xs leading-relaxed text-ink shadow-lg">
          <span className="mb-1 block text-[10px] uppercase tracking-wide text-deepblue">
            {statusLabel(source.status)}
          </span>
          <span className="block font-medium">{source.title}</span>
          <span className="mt-0.5 block text-muted">
            {source.authors} ({source.year})
          </span>
        </span>
      )}
    </span>
  );
}
