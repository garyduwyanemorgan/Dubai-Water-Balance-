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
        <a href="#scarcity" className="group block">
          <div className="relative mb-3 inline-flex">
            {/* Glowing mosaic halo — intensifies on hover so the mark pops */}
            <span
              aria-hidden
              className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-brackish via-amber to-brine opacity-60 blur-md transition-all duration-500 group-hover:opacity-100 group-hover:blur-lg"
            />
            <img
              src="/logo.png"
              alt="GDM Enviro Consulting logo"
              width={56}
              height={56}
              className="relative h-14 w-14 rounded-full object-cover shadow-lg ring-2 ring-sand-light transition-transform duration-500 ease-hydro group-hover:scale-110 group-hover:-rotate-2"
            />
          </div>
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
