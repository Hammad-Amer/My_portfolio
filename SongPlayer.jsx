// SongPlayer.jsx
// Compact music player. Plays real audio files placed in `public/music/`.
//
// HOW TO ADD SONGS:
//   1. Drop your audio files (mp3) into  public/music/
//   2. (optional) Drop cover images there too, e.g. public/music/neon-harbor.jpg
//   3. Edit SP_TRACKS below: set `src` to "/music/<file>.mp3", fill in `title`
//      and `artist`, and optionally `cover` ("/music/<image>"). If `cover` is
//      left empty, the built-in SVG album art (the `art` field) is shown instead.
//
// All CSS classes/keyframes are namespaced with `sp-` (see styles.css).

import { useState, useEffect, useRef } from "react";

const SP_TRACKS = [
  {
    id: "t1",
    title: "Peaceful Cafe Jazz",
    artist: "Alex Morgan",
    src: "/music/track1-alexmorgan-peaceful-cafe-jazz.mp3",
    cover: "/music/track1.jpg",
    theme: "linear-gradient(155deg, #F0A45C 0%, #E07A4E 55%, #F6C07A 100%)",
    glow: "rgba(224,122,78,0.55)",
    art: {
      from: "#7FB3FF", to: "#B48CFF",
      shapes: [
        { type: "circle", cx: 62, cy: 38, r: 18, fill: "#FFE27A" },
        { type: "tri", points: "8,96 38,52 68,96", fill: "#FF9BC9" },
        { type: "tri", points: "40,96 72,58 96,96", fill: "#6FE6C2" },
      ],
    },
  },
  {
    id: "t2",
    title: "The Spring of the Universe",
    artist: "Jonas Blakewood",
    src: "/music/track2-jonasblakewood-the-spring-of-the-universe.mp3",
    cover: "/music/track2.jpg",
    theme: "linear-gradient(155deg, #4FA9E0 0%, #3F6BE0 55%, #79D0F0 100%)",
    glow: "rgba(63,107,224,0.55)",
    art: {
      from: "#FFB4A8", to: "#FFD580",
      shapes: [
        { type: "rect", x: 14, y: 20, w: 32, h: 32, fill: "#C37BFF", rot: -12 },
        { type: "rect", x: 52, y: 44, w: 40, h: 40, fill: "#7DD3FC", rot: 18 },
        { type: "circle", cx: 32, cy: 78, r: 10, fill: "#FFFFFF" },
      ],
    },
  },
  {
    id: "t3",
    title: "Half of Me",
    artist: "Miromax Music",
    src: "/music/track3-miromaxmusic-half-of-me.mp3",
    cover: "/music/track3.png",
    theme: "linear-gradient(155deg, #F06E9C 0%, #D24E84 55%, #FF92BE 100%)",
    glow: "rgba(210,78,132,0.55)",
    art: {
      from: "#7AE4C4", to: "#3BA7E9",
      shapes: [
        { type: "circle", cx: 30, cy: 30, r: 14, fill: "#FFF6A8" },
        { type: "wave" },
      ],
    },
  },
];

/* ---------- Album art (cover image, or original SVG placeholder) ---------- */
function SpAlbumArt({ track, playing }) {
  const { art } = track;
  const id = "sp-g-" + track.id;
  return (
    <div style={{
      width: 120, height: 120, borderRadius: 14, overflow: "hidden",
      boxShadow: "0 8px 24px rgba(20,10,60,0.35), inset 0 0 0 2px rgba(255,255,255,0.35)",
      position: "relative",
      transform: playing ? "rotate(-1.2deg)" : "rotate(0deg)",
      transition: "transform 400ms ease",
    }}>
      {track.cover ? (
        <img src={track.cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      ) : (
        <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={art.from} />
              <stop offset="100%" stopColor={art.to} />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="100" height="100" fill={`url(#${id})`} />
          {art.shapes.map((s, i) => {
            if (s.type === "circle") return <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={s.fill} opacity="0.92" />;
            if (s.type === "rect") return <rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} rx="6" fill={s.fill} opacity="0.92" transform={`rotate(${s.rot || 0} ${s.x + s.w / 2} ${s.y + s.h / 2})`} />;
            if (s.type === "tri") return <polygon key={i} points={s.points} fill={s.fill} opacity="0.92" />;
            if (s.type === "wave") return (
              <g key={i} opacity="0.75">
                <path d="M -5 70 Q 15 58 35 70 T 75 70 T 115 70 V 105 H -5 Z" fill="#FFFFFF" opacity="0.35" />
                <path d="M -5 82 Q 15 72 35 82 T 75 82 T 115 82 V 105 H -5 Z" fill="#FFFFFF" opacity="0.6" />
              </g>
            );
            return null;
          })}
        </svg>
      )}
    </div>
  );
}

/* ---------- Floating notes shown over the album art ---------- */
function SpFloatingNotes({ playing }) {
  const NoteEighth = ({ size = 20, color = "#fff" }) => (
    <svg width={size} height={size * 1.15} viewBox="0 0 20 23" fill="none">
      <circle cx="5.5" cy="17" r="3.5" fill={color} />
      <path d="M9 17 V 3 L 17 6 V 8 L 9 5 Z" fill={color} />
    </svg>
  );
  const NoteBeamed = ({ size = 22, color = "#fff" }) => (
    <svg width={size} height={size} viewBox="0 0 26 22" fill="none">
      <circle cx="4" cy="17" r="3.2" fill={color} />
      <circle cx="19" cy="17" r="3.2" fill={color} />
      <path d="M7 17 V 4 H 22 V 17 H 20 V 6 H 9 V 17 Z" fill={color} />
    </svg>
  );

  return (
    <div style={{ position: "absolute", top: 18, right: 18, width: 82, height: 58, pointerEvents: "none" }}>
      <div className="sp-note" style={{ position: "absolute", left: 4, top: 0, animation: playing ? "sp-noteBob1 3.4s ease-in-out infinite" : "none", opacity: playing ? 1 : 0.85 }}>
        <NoteEighth size={18} />
      </div>
      <div className="sp-note" style={{ position: "absolute", left: 46, top: 4, animation: playing ? "sp-noteBob2 3.9s ease-in-out infinite" : "none", opacity: playing ? 1 : 0.85 }}>
        <NoteEighth size={14} />
      </div>
      <div className="sp-note" style={{ position: "absolute", left: 18, top: 30, animation: playing ? "sp-noteBob3 4.4s ease-in-out infinite" : "none", opacity: playing ? 1 : 0.85 }}>
        <NoteBeamed size={22} />
      </div>

      {playing && (
        <>
          <span className="sp-particle sp-p1"><NoteEighth size={12} /></span>
          <span className="sp-particle sp-p2"><NoteEighth size={10} /></span>
          <span className="sp-particle sp-p3"><NoteBeamed size={14} /></span>
        </>
      )}
    </div>
  );
}

/* ---------- Control icons ---------- */
const SpIconPrev = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <rect x="5" y="6" width="2.4" height="16" rx="0.5" fill="currentColor" />
    <path d="M23 6 L9 14 L23 22 Z" fill="currentColor" />
  </svg>
);
const SpIconNext = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <rect x="20.6" y="6" width="2.4" height="16" rx="0.5" fill="currentColor" />
    <path d="M5 6 L19 14 L5 22 Z" fill="currentColor" />
  </svg>
);
const SpIconPlay = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path d="M8 5 L26 16 L8 27 Z" fill="currentColor" />
  </svg>
);
const SpIconPause = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect x="8" y="6" width="5" height="20" rx="1" fill="currentColor" />
    <rect x="19" y="6" width="5" height="20" rx="1" fill="currentColor" />
  </svg>
);

function fmt(sec) {
  if (!sec || !isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ":" + String(s).padStart(2, "0");
}

/* ---------- The player card ---------- */
export function SongPlayer() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState({ cur: 0, dur: 0 });
  const audioRef = useRef(null);
  const track = SP_TRACKS[idx];

  const prev = () => { setTime({ cur: 0, dur: 0 }); setIdx((i) => (i - 1 + SP_TRACKS.length) % SP_TRACKS.length); };
  const next = () => { setTime({ cur: 0, dur: 0 }); setIdx((i) => (i + 1) % SP_TRACKS.length); };
  const toggle = () => setPlaying((p) => !p);

  // Load the new track when the index changes; keep playing if we were playing.
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.load();
    if (playing) a.play().catch(() => setPlaying(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  // Drive the <audio> element from the `playing` state.
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) a.play().catch(() => setPlaying(false));
    else a.pause();
  }, [playing]);

  const onTime = () => {
    const a = audioRef.current;
    if (a) setTime({ cur: a.currentTime, dur: a.duration || 0 });
  };
  const onEnded = () => next();

  const seek = (e) => {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    a.currentTime = ((e.clientX - r.left) / r.width) * a.duration;
  };

  const pct = time.dur ? (time.cur / time.dur) * 100 : 0;

  return (
    <div
      className="sp-card"
      data-playing={playing ? "1" : "0"}
      style={{
        background: track.theme,
        boxShadow: `0 30px 60px -20px ${track.glow}, 0 10px 30px -10px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.35)`,
      }}
    >
      <audio
        ref={audioRef}
        src={track.src}
        preload="metadata"
        onTimeUpdate={onTime}
        onLoadedMetadata={onTime}
        onEnded={onEnded}
      />

      <div style={{ position: "relative" }}>
        <SpAlbumArt track={track} playing={playing} />
        <SpFloatingNotes playing={playing} />
      </div>

      <div style={{ marginTop: 36 }}>
        <div className="sp-title">{track.title}</div>
        <div className="sp-artist">{track.artist}</div>
      </div>

      <div className="sp-progress" onClick={seek} role="progressbar" aria-valuenow={Math.round(pct)}>
        <div className="sp-progress-fill" style={{ width: pct + "%" }} />
      </div>
      <div className="sp-time">
        <span>{fmt(time.cur)}</span>
        <span>{fmt(time.dur)}</span>
      </div>

      <div className="sp-controls">
        <button className="sp-ctrl" onClick={prev} aria-label="Previous track"><SpIconPrev /></button>
        <button className="sp-ctrl sp-ctrl-main" onClick={toggle} aria-label={playing ? "Pause" : "Play"}>
          {playing ? <SpIconPause /> : <SpIconPlay />}
        </button>
        <button className="sp-ctrl" onClick={next} aria-label="Next track"><SpIconNext /></button>
      </div>

      <div className="sp-dots" aria-hidden="true">
        {SP_TRACKS.map((_, i) => <span key={i} className={"sp-dot" + (i === idx ? " on" : "")} />)}
      </div>
    </div>
  );
}
