import fs from "node:fs";
import path from "node:path";

export interface TimePoint {
  year: number;
  value: number;
}

function parseCsv(file: string): TimePoint[] {
  const raw = fs.readFileSync(path.join(process.cwd(), "data", file), "utf8");
  const lines = raw.trim().split("\n").slice(1);
  return lines.map((line) => {
    const [year, value] = line.split(",");
    return { year: Number(year), value: Number(value) };
  });
}

export function getPopulation(): TimePoint[] {
  return parseCsv("population.csv");
}

export function getDesalination(): TimePoint[] {
  return parseCsv("desalination.csv");
}
