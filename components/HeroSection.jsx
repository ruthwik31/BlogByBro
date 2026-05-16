"use client";

import { useState } from "react";

const BLOG_NAME = process.env.NEXT_PUBLIC_BLOG_NAME || "My Blog";
const TAGLINE =
  process.env.NEXT_PUBLIC_BLOG_TAGLINE || "Thoughts, stories and ideas";

const stickers = [
  {
    emoji: "💡",
    msg: "Fresh posts await!",
    x: "6%",
    y: "18%",
    dur: "3.2s",
    delay: "0s",
  },
  {
    emoji: "💡",
    msg: "Big ideas inside",
    x: "87%",
    y: "12%",
    dur: "3.8s",
    delay: "0.6s",
  },
  {
    emoji: "💡",
    msg: "New stories launching",
    x: "93%",
    y: "55%",
    dur: "4.1s",
    delay: "1.1s",
  },
  {
    emoji: "💡",
    msg: "Grab a good read",
    x: "3%",
    y: "65%",
    dur: "3.0s",
    delay: "1.7s",
  },
  {
    emoji: "💡",
    msg: "Right on target!",
    x: "80%",
    y: "80%",
    dur: "3.6s",
    delay: "0.9s",
  },
  {
    emoji: "💡",
    msg: "Hot takes ahead ☕",
    x: "16%",
    y: "85%",
    dur: "2.9s",
    delay: "2.1s",
  },
  {
    emoji: "💡",
    msg: "Stellar content",
    x: "50%",
    y: "4%",
    dur: "4.4s",
    delay: "0.3s",
  },
  {
    emoji: "💡",
    msg: "Creative vibes only",
    x: "38%",
    y: "91%",
    dur: "3.4s",
    delay: "1.4s",
  },
];

export default function HeroSection() {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="relative overflow-hidden py-20 md:py-28 select-none">
      {/* Soft gradient blobs in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-20 left-1/3 w-80 h-80 rounded-full blur-3xl opacity-30 dark:opacity-10"
          style={{
            background: "radial-gradient(circle, #818cf8, transparent)",
          }}
        />
        <div
          className="absolute -bottom-10 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 dark:opacity-10"
          style={{
            background: "radial-gradient(circle, #ec4899, transparent)",
            animationDelay: "1.5s",
          }}
        />
      </div>

      {/* Floating stickers — hidden on mobile to avoid clutter */}
      {stickers.map((s, i) => (
        <div
          key={i}
          className="absolute hidden sm:block z-10 cursor-pointer"
          style={{ left: s.x, top: s.y }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        >
          {/* The emoji */}
          <span
            className="sticker-float text-2xl md:text-3xl drop-shadow-sm"
            style={{ "--dur": s.dur, animationDelay: s.delay }}
          >
            {s.emoji}
          </span>

          {/* Tooltip */}
          {hovered === i && (
            <div className="tooltip-in absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 pointer-events-none">
              <div className="px-3 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold rounded-xl whitespace-nowrap shadow-xl">
                {s.msg}
              </div>
              {/* Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-neutral-900 dark:border-t-white" />
            </div>
          )}
        </div>
      ))}

      {/* Hero text */}
      <div className="relative text-center max-w-2xl mx-auto px-4 z-10">
        <p className="text-lg mb-1.5 animate-bounce inline-block">👻</p>
        <h1 className="hero-gradient-text text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2 leading-none pb-1">
          {BLOG_NAME}
        </h1>
        <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
          {TAGLINE}
        </p>
      </div>
    </section>
  );
}
