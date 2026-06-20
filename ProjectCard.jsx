// ProjectCard.jsx
// Portfolio project card with 3D tilt-back and hover reveal.
//
// Idle: card tilts back in perspective space, URL pill pokes out of the top.
// Hover: card flattens forward with mouse parallax, "View project" CTA
//        emerges from underneath.
//
// Usage:
//   <ProjectCard
//     title="Hallway Radio"
//     description="A community-owned streaming station..."
//     url="https://hallway.fm"
//     tags={["Raspberry Pi", "Svelte"]}
//     accent="#b8e6a8"
//     tiltDeg={8}
//     thumbnail={{ src: "/thumbs/hallway.jpg" }}
//     index={0}
//   />

import { useState, useRef } from "react";

export function ProjectCard({
  url = "https://example.com",
  title = "Project Title",
  description = "A short one-line description of what this project is.",
  tags = [],
  thumbnail, // { src?: string, label?: string, bg?: string, stripe?: string }
  cta = "View project",
  accent = "#b8e6a8",
  cardBg = "#141311",
  strokeColor = "rgba(255,255,255,0.07)",
  fontTitle = '"Instrument Serif", Georgia, serif',
  fontBody = '"Geist", ui-sans-serif, system-ui, sans-serif',
  fontMono = '"JetBrains Mono", ui-monospace, monospace',
  tiltDeg = 8,
  variant = "default", // "default" | "inverted"
  index = 0,
}) {
  const [hover, setHover] = useState(false);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const ref = useRef(null);

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setMouse({
      x: (e.clientX - r.left) / r.width,
      y: (e.clientY - r.top) / r.height,
    });
  };

  const tiltX = hover ? (mouse.y - 0.5) * 4 : -tiltDeg;
  const tiltY = hover ? (mouse.x - 0.5) * -6 : 0;
  const liftZ = hover ? 24 : 0;
  const transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(${liftZ}px)`;

  const fg = variant === "inverted" ? "#17160f" : "#f3ede0";
  const surface = variant === "inverted" ? "#efe8d9" : cardBg;
  const muted =
    variant === "inverted" ? "rgba(23,22,15,0.56)" : "rgba(243,237,224,0.55)";
  const divider =
    variant === "inverted" ? "rgba(23,22,15,0.09)" : strokeColor;

  return (
    <div
      style={{
        perspective: 1400,
        perspectiveOrigin: "50% 130%",
        padding: "64px 28px 28px",
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        ref={ref}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => {
          setHover(false);
          setMouse({ x: 0.5, y: 0.5 });
        }}
        onMouseMove={onMove}
        style={{
          position: "relative",
          width: 360,
          alignSelf: "stretch",
          display: "flex",
          flexDirection: "column",
          transformStyle: "preserve-3d",
          transform,
          transition: "transform 520ms cubic-bezier(.2,.7,.2,1)",
          willChange: "transform",
        }}
      >
        {/* URL badge */}
        <div
          style={{
            position: "absolute",
            top: -18,
            left: "50%",
            transform: `translate(-50%, 0) translateZ(${hover ? 40 : 8}px)`,
            transition:
              "transform 520ms cubic-bezier(.2,.7,.2,1), opacity 240ms",
            opacity: hover ? 0 : 1,
            padding: "6px 12px 6px 10px",
            borderRadius: 999,
            background: "#0b0a08",
            color: "#e6dcc8",
            border: "0.5px solid rgba(255,255,255,0.12)",
            font: `500 11px/1 ${fontMono}`,
            letterSpacing: "0.02em",
            display: "flex",
            alignItems: "center",
            gap: 8,
            whiteSpace: "nowrap",
            boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: accent,
              boxShadow: `0 0 8px ${accent}`,
            }}
          />
          {url.replace(/^https?:\/\//, "")}
        </div>

        {/* Card surface */}
        <article
          style={{
            position: "relative",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: surface,
            color: fg,
            borderRadius: 18,
            border: `0.5px solid ${divider}`,
            boxShadow: hover
              ? "0 40px 80px -20px rgba(0,0,0,0.6), 0 12px 24px -8px rgba(0,0,0,0.4)"
              : "0 20px 40px -16px rgba(0,0,0,0.55), 0 6px 14px -6px rgba(0,0,0,0.4)",
            transition: "box-shadow 420ms",
            overflow: "hidden",
          }}
        >
          {/* Thumbnail */}
          <div
            style={{
              position: "relative",
              margin: 14,
              borderRadius: 12,
              overflow: "hidden",
              aspectRatio: "16 / 10",
              background:
                thumbnail?.bg ||
                "linear-gradient(140deg, #1e1c18 0%, #2a2620 55%, #1a1814 100%)",
              border: `0.5px solid ${divider}`,
            }}
          >
            {thumbnail?.src ? (
              <img
                src={thumbnail.src}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : (
              <PlaceholderGraphic
                label={thumbnail?.label || "preview"}
                accent={accent}
                fontMono={fontMono}
                stripe={thumbnail?.stripe}
                seed={index}
              />
            )}
          </div>

          {/* Meta */}
          <div
            style={{
              padding: "6px 22px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              flex: 1,
            }}
          >
            <div
              style={{
                font: `400 10px/1 ${fontMono}`,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: muted,
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </div>
            <h3
              style={{
                margin: 0,
                font: `500 30px/1.05 ${fontTitle}`,
                letterSpacing: "-0.01em",
                color: fg,
              }}
            >
              {title}
            </h3>
            <p
              style={{
                margin: 0,
                font: `400 13.5px/1.5 ${fontBody}`,
                color: muted,
                maxWidth: "36ch",
              }}
            >
              {description}
            </p>

            {tags.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  marginTop: "auto",
                  paddingTop: 6,
                }}
              >
                {tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      font: `400 10.5px/1 ${fontMono}`,
                      padding: "5px 8px",
                      borderRadius: 6,
                      border: `0.5px solid ${divider}`,
                      color: muted,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>

        {/* CTA — hidden underneath until hover */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "absolute",
            left: "50%",
            bottom: hover ? -22 : 14,
            transform: `translate(-50%, 0) translateZ(${hover ? 80 : 0}px) scale(${
              hover ? 1 : 0.92
            })`,
            transition:
              "transform 520ms cubic-bezier(.2,.7,.2,1), bottom 520ms cubic-bezier(.2,.7,.2,1), opacity 320ms",
            opacity: hover ? 1 : 0,
            pointerEvents: hover ? "auto" : "none",
            background: accent,
            color: "#17160f",
            font: `500 13px/1 ${fontBody}`,
            letterSpacing: "-0.005em",
            padding: "14px 20px 14px 22px",
            borderRadius: 999,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            boxShadow: `0 14px 40px -8px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(0,0,0,0.1), 0 0 24px ${accent}22`,
            whiteSpace: "nowrap",
          }}
        >
          {cta}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M3 11L11 3M11 3H5M11 3V9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}

function PlaceholderGraphic({ label, accent, fontMono, stripe, seed = 0 }) {
  const angle = 135 + (seed % 3) * 8;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-start",
        padding: 14,
        background:
          stripe ||
          `repeating-linear-gradient(${angle}deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 11px), linear-gradient(150deg, #1c1a16 0%, #232019 60%, #14120f 100%)`,
      }}
    >
      <div
        style={{
          font: `400 10px/1 ${fontMono}`,
          color: "rgba(243,237,224,0.5)",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          padding: "5px 8px",
          borderRadius: 4,
          background: "rgba(0,0,0,0.35)",
          border: "0.5px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(6px)",
        }}
      >
        {label}
      </div>
      <div
        style={{
          position: "absolute",
          top: 14,
          right: 14,
          width: 8,
          height: 8,
          borderRadius: 999,
          background: accent,
          boxShadow: `0 0 10px ${accent}aa`,
        }}
      />
    </div>
  );
}
