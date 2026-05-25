"use client";

import { useEffect, useState } from "react";
import { SCENES } from "@/lib/constants";

export default function NavRail() {
  const [active, setActive] = useState<string>("scarcity");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    SCENES.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Scene navigation"
      className="fixed left-0 top-0 z-30 hidden h-screen w-44 flex-col justify-between border-r border-deepblue/10 bg-sand/60 px-5 py-6 backdrop-blur-sm md:flex"
    >
      <div>
        <a href="#scarcity" className="block">
          <span className="block font-serif text-base font-semibold leading-tight text-deepblue">
            GDM
          </span>
          <span className="block text-[10px] uppercase tracking-widest text-muted">
            Enviro Consulting
          </span>
        </a>

        <ul className="mt-10 space-y-1">
          {SCENES.map((s) => {
            const isActive = active === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={`group flex items-baseline gap-2 rounded-sm py-1.5 text-sm transition-colors duration-300 ${
                    isActive ? "text-deepblue" : "text-muted hover:text-ink"
                  }`}
                >
                  <span className="font-serif text-xs tabular-nums">
                    {s.label}
                  </span>
                  <span
                    className={`leading-tight ${isActive ? "font-medium" : ""}`}
                  >
                    {s.title}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="text-[10px] leading-relaxed text-muted">
        The Inversion
        <br />
        Reading the Subsurface
      </p>
    </nav>
  );
}
