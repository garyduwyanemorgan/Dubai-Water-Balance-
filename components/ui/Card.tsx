"use client";

import { motion } from "framer-motion";
import type { Finding } from "@/lib/types";

interface Props {
  finding: Finding;
  index: number;
  onOpen: (sourceKey: string, context: string) => void;
}

export default function Card({ finding, index, onOpen }: Props) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(finding.source, finding.context)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 0.61, 0.36, 1] }}
      className="group flex flex-col items-start rounded-sm border border-deepblue/15 bg-sand-light p-6 text-left transition-colors duration-300 hover:border-deepblue/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-deepblue"
    >
      <span className="font-serif text-5xl font-semibold leading-none text-deepblue md:text-6xl">
        {finding.number}
      </span>
      <span className="mt-4 text-sm leading-snug text-ink/90">
        {finding.headline}
      </span>
      <span className="mt-4 text-xs text-muted transition-colors group-hover:text-deepblue">
        Source ↗
      </span>
    </motion.button>
  );
}
