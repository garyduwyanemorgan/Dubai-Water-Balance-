import sourcesData from "@/data/sources.json";
import type { Source, SourceRegistry } from "./types";

const registry = sourcesData as SourceRegistry;

export function getSource(key: string): Source | undefined {
  return registry[key];
}

export function getAllSources(): SourceRegistry {
  return registry;
}

const STATUS_LABEL: Record<string, string> = {
  "verify": "Verify against source",
  "triangulate": "Triangulate",
  "peer-reviewed": "Peer-reviewed",
  "in-hand": "In hand (GDM)",
  "official": "Official source",
  "industry": "Industry data",
  "secondary": "Secondary source",
  "synthesis": "Review synthesis",
  "reference": "Reference value",
  "unverified": "Unverified",
};

export function statusLabel(status: string): string {
  return STATUS_LABEL[status] ?? status;
}

export function formatCitation(source: Source): string {
  const parts = [source.authors, `(${source.year})`, source.title];
  if (source.journal) parts.push(source.journal);
  return parts.filter(Boolean).join(". ");
}
