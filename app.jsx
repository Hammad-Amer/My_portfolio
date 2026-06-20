// Portfolio — dark terminal aesthetic, Professional/Personal modes
import { useState, useEffect, useRef } from "react";
import { ProjectCard } from "./ProjectCard.jsx";
import { Globe } from "./Globe.jsx";
import { NodeGraph } from "./NodeGraph.jsx";
import { SongPlayer } from "./SongPlayer.jsx";

/* ---------- Typewriter ---------- */
function Typewriter({ text, speed = 55, startDelay = 300, className = "" }) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setOut(""); setDone(false);
    let i = 0;
    const start = setTimeout(() => {
      const id = setInterval(() => {
        i++;
        setOut(text.slice(0, i));
        if (i >= text.length) { clearInterval(id); setDone(true); }
      }, speed);
    }, startDelay);
    return () => clearTimeout(start);
  }, [text]);
  return <span className={className}>{out}{!done && <span className="caret">&nbsp;</span>}</span>;
}

/* ---------- Count-up number ---------- */
function CountUp({ to, duration = 1200 }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = parseFloat(to);
    if (isNaN(target)) { setVal(to); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const start = performance.now();
          const tick = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setVal(Math.round(target * eased));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{val}</span>;
}

/* ---------- Scroll progress bar ---------- */
function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      if (ref.current) ref.current.style.width = (scrolled * 100) + "%";
    };
    window.addEventListener("scroll", on, { passive: true });
    on();
    return () => window.removeEventListener("scroll", on);
  }, []);
  return <div ref={ref} className="scroll-progress" />;
}

/* ---------- Floating orb that follows cursor ---------- */
function BgOrb() {
  const ref = useRef(null);
  useEffect(() => {
    let raf = 0, x = 0, y = 0;
    const apply = () => {
      raf = 0;
      if (ref.current) ref.current.style.transform = `translate(${x - 300}px, ${y - 300}px)`;
    };
    // Coalesce many pointermove events into one transform write per frame.
    const on = (e) => { x = e.clientX; y = e.clientY; if (!raf) raf = requestAnimationFrame(apply); };
    window.addEventListener("pointermove", on, { passive: true });
    return () => { window.removeEventListener("pointermove", on); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return <div ref={ref} className="bg-orb" />;
}

/* ---------- Placeholder content ---------- */
const DATA = {
  name: { first: "Hammad", last: "Amer" },
  role: "AI & Full-Stack Engineer",
  location: "Pakistan",
  lede: "Software Engineer at the intersection of AI and Full-Stack Development.",
  email: "hammadamer386@gmail.com",
  stats: [
    { num: "23", label: "Age" },
    { num: "1", label: "Years of experience" },
    { num: "20", label: "Projects worked on" },
    { num: "2", label: "Dean's List honors" },
  ],
  education: [
    {
      title: "Bachelor of Science in Computer Science",
      date: "Aug 2022 - Jun 2026",
      grade: "",
      school: "FAST NUCES — Islamabad. Coursework: Data Structures & Algorithms, Generative AI, MLOps, Cloud Computing, Web Programming, Information Security.",
    },
  ],
  projects: [
    {
      title: "SpineScan",
      desc: "AI diagnostic tool that classifies 25 lumbar-spine degenerative conditions from MRI scans, with Grad-CAM explainability and a MERN dashboard.",
      mock: "mock-1", label: "AI · MEDICAL",
      url: "https://github.com/Hammad-Amer/SpineScan",
      image: "/images/projects/spinescan.png",
      tech: ["PyTorch", "Python", "React", "YOLOX"],
      github: "https://github.com/Hammad-Amer/SpineScan",
    },
    {
      title: "Multimodal RAG",
      desc: "Retrieval-augmented pipeline that answers text and image queries from PDFs using Sentence-BERT, CLIP and FAISS, with an LLM-powered chat interface.",
      mock: "mock-2", label: "RAG · LLM",
      url: "https://github.com/Hammad-Amer/MultiModalRag",
      image: "/images/projects/multimodalrag.png",
      tech: ["Python", "LLaMA2", "CLIP", "FAISS"],
      github: "https://github.com/Hammad-Amer/MultiModalRag",
    },
    {
      title: "TORCS AI Driver",
      desc: "Machine-learning agent that learns to autonomously drive and race a car inside the TORCS simulator.",
      mock: "mock-3", label: "SELF-DRIVING AI",
      url: "https://github.com/Hammad-Amer/TORCS-Simulator",
      image: "/images/projects/torcs.jpg",
      tech: ["Python", "Machine Learning"],
      github: "https://github.com/Hammad-Amer/TORCS-Simulator",
    },
    {
      title: "AWS Microservices Deployment",
      desc: "End-to-end DevOps pipeline deploying a two-service app to a Kubernetes cluster on AWS EC2 — provisioned with Terraform, configured via Ansible, delivered with ArgoCD.",
      mock: "mock-4", label: "DEVOPS · CLOUD",
      url: "https://github.com/Hammad-Amer/Aws-Microservices-Deployment",
      image: "/images/projects/aws_microservices.png",
      tech: ["AWS", "Kubernetes", "Docker", "Terraform"],
      github: "https://github.com/Hammad-Amer/Aws-Microservices-Deployment",
    },
    {
      title: "ConnectMe",
      desc: "Instagram-inspired Android social app with real-time chat, stories and voice/video calls — evolved from a Firebase backend to a custom REST + MySQL stack.",
      mock: "mock-5", label: "ANDROID · SOCIAL",
      url: "https://github.com/Hammad-Amer/ConnectMe",
      image: "/images/projects/connect_me.jpg",
      tech: ["Kotlin", "Firebase", "MySQL"],
      github: "https://github.com/Hammad-Amer/ConnectMe",
    },
    {
      title: "SecureChat",
      desc: "End-to-end encrypted client/server messaging built from raw cryptographic primitives (no TLS) — Diffie-Hellman key exchange, certificates and replay protection.",
      mock: "mock-6", label: "SECURITY",
      url: "https://github.com/Hammad-Amer/securechat-skeleton",
      image: "/images/projects/securechat.png",
      tech: ["Python", "Cryptography", "MySQL"],
      github: "https://github.com/Hammad-Amer/securechat-skeleton",
    },
    {
      title: "Marketplace",
      desc: "Android buy-and-sell marketplace with real-time chat, image uploads, push notifications and offline SQLite caching over a MySQL API.",
      mock: "mock-1", label: "ANDROID",
      url: "https://github.com/Hammad-Amer/Marketplace",
      image: "",
      tech: ["Kotlin", "MySQL", "SQLite"],
      github: "https://github.com/Hammad-Amer/Marketplace",
    },
    {
      title: "Pacman in SFML",
      desc: "Classic Pacman built in C++ with SFML graphics and POSIX threads powering concurrent ghost AI, collision detection and smooth animation.",
      mock: "mock-2", label: "GAME · C++",
      url: "https://github.com/Hammad-Amer/Pacman-in-SFML",
      image: "",
      tech: ["C++", "SFML", "pthreads"],
      github: "https://github.com/Hammad-Amer/Pacman-in-SFML",
    },
    {
      title: "FortPiler",
      desc: "A custom compiler for a self-designed programming language — its own keywords, operators and built-in functions, with lexer, parser and code generation.",
      mock: "mock-3", label: "COMPILER",
      url: "https://github.com/Hammad-Amer/FortPiler",
      image: "",
      tech: ["C++", "Compiler Design"],
      github: "https://github.com/Hammad-Amer/FortPiler",
    },
  ],
  experience: [
    { title: "AI/ML Developer Intern", meta: "Code Generation · Jun – Sep 2025", desc: "Built an automated Financial Data Parser using multi-agent architectures and genetic algorithms, and owned end-to-end integration of the ML models into the startup's production applications.", v: "" },
    { title: "Freelance Technical Consultant", meta: "Fiverr · May 2023 – Feb 2024", desc: "Provided technical consulting — improving website performance and search visibility through infrastructure audits, technical SEO and performance tuning.", v: "v2" },
  ],
  timeline: [
    { year: "2025", copy: "Interned as an AI/ML Developer at Code Generation, building a multi-agent financial data parser, and kicked off my Final Year Project, SpineScan — an AI tool that reads spinal MRIs. Made the Dean's List along the way.", label: "", img: "/images/2025.png" },
    { year: "2024", copy: "Took my first real steps into AI — teaching a car to drive itself in the TORCS simulator — while shipping ConnectMe, a full-blown social media app with real-time chat, stories and voice/video calls.", label: "Project", img: "/images/2024.jpg" },
    { year: "2023", copy: "Started freelancing on Fiverr as a technical consultant — tuning website performance and search visibility — while deepening my full-stack and systems coursework.", label: "", img: "/images/2023.png" },
  ],
  hobbies: [
    { title: "Gym", desc: "Training and lifting is my daily reset — as much for a clear head as for the body. ", img: "/images/gym_hobbies.jpeg" },
    { title: "Gaming", desc: "From story-driven single-player worlds to competitive matches, gaming is how I unwind and keep my curiosity fed.", img: "/images/gaming.jpeg" },
    { title: "Painting", desc: "I love putting color to canvas. Painting is where the creative, artistic side of me gets to breathe.", img: "/images/painting.jpg" },
  ],
  travel: {
    title: "Cultural Exploration",
    desc: "I want to experience as many cultures as I can — first making my way across all of Pakistan, then setting my sights on Europe next.",
  },
  life: [
    { kicker: "Fitness", title: "Fitness", cls: "life-1", img: "/images/gym1.jpeg" },
    { kicker: "Travel", title: "Exploring the World", cls: "life-2", img: "/images/travel.jpeg" },
    { kicker: "Music", title: "Listening to Music", cls: "life-3", img: "/images/Music.jpeg" },
    { kicker: "Computer, IT", title: "AI & Engineering", cls: "life-4", img: "/images/AI&engineering.jpeg" },
  ],
  routine: [
    { t: "8:00 AM", what: "Wake up & gym" },
    { t: "11:00 AM", what: "Lock in & deep work" },
    { t: "8:00 PM", what: "Discord with friends" },
    { t: "11:00 PM", what: "Wind down with music" },
    { t: "12:00 AM", what: "Sleep" },
  ],
  plan: ["Land an AI/ML role", "Travel the whole of Pakistan", "Explore Europe", "Get seriously fit", "Build my own product", "Learn an instrument", "Get back into painting"],
  tags: [
    { cls: "tag-blue", label: "Games played", n: "+700" },
    { cls: "tag-purple", label: "Movies & series watched", n: "+500" },
    { cls: "tag-red", label: "Books read", n: "+30" },
    { cls: "tag-green", label: "Paintings made", n: "+150" },
    { cls: "tag-yellow", label: "Cities explored", n: "+200" },
  ],
};

/* ---------- Icons ---------- */
const Icon = ({ name, size = 16 }) => {
  const paths = {
    arrow: <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    facebook: <path d="M13 22v-8h3l.5-4H13V7.5c0-1 .3-1.8 1.8-1.8H17V2.2C16.5 2.1 15.3 2 14 2c-2.8 0-4.5 1.7-4.5 4.8V10H7v4h2.5v8h3.5z" fill="currentColor"/>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" fill="none"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" fill="none"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></>,
    youtube: <path d="M22 12s0-3-.4-4.4a2.5 2.5 0 0 0-1.8-1.8C18.5 5.5 12 5.5 12 5.5s-6.5 0-7.8.3a2.5 2.5 0 0 0-1.8 1.8C2 9 2 12 2 12s0 3 .4 4.4a2.5 2.5 0 0 0 1.8 1.8c1.3.3 7.8.3 7.8.3s6.5 0 7.8-.3a2.5 2.5 0 0 0 1.8-1.8c.4-1.4.4-4.4.4-4.4zM10 15V9l5 3-5 3z" fill="currentColor"/>,
    linkedin: <><rect x="2" y="9" width="4" height="13" fill="currentColor"/><circle cx="4" cy="4.5" r="2.3" fill="currentColor"/><path d="M22 22v-7c0-3.4-1.8-5-4.2-5a3.7 3.7 0 0 0-3.4 1.9V10h-4v12h4v-6.6c0-1.8.8-2.8 2.2-2.8 1.3 0 2 .8 2 2.8V22h3.4z" fill="currentColor"/></>,
    github: <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.7.3-1.1.6-1.4-2.2-.3-4.5-1.1-4.5-5 0-1.1.4-2 1-2.7-.1-.2-.4-1.2.1-2.5 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.5.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.5 5 .4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5A10 10 0 0 0 12 2z" fill="currentColor"/>,
    cap: <path d="M12 3 2 8l10 5 10-5-10-5zm-8 8v4l8 4 8-4v-4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round"/>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" fill="none"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12h18" stroke="currentColor" strokeWidth="1.6" fill="none"/></>,
    folder: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round"/>,
    send: <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round" strokeLinecap="round"/>,
    copy: <><rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" fill="none"/><path d="M4 16V6a2 2 0 0 1 2-2h10" stroke="currentColor" strokeWidth="1.6" fill="none"/></>,
    external: <><path d="M14 3h7v7" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round"/><path d="M21 3 10 14" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round"/></>,
    globe: <><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" fill="none"/><path d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" stroke="currentColor" strokeWidth="1.6" fill="none"/></>,
    alarm: <><circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="1.6" fill="none"/><path d="M12 9v4l3 2M5 3 2 6m17-3 3 3" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round"/></>,
    pin: <><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" fill="none"/></>,
  };
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">{paths[name]}</svg>;
};

/* ---------- Tech stack icons ---------- */
const TECH_ICONS = {
  nextjs: {
    bg: "#000", color: "#fff", label: "Next.js",
    svg: <><circle cx="12" cy="12" r="11" fill="currentColor" opacity="0.001"/><path d="M8 7.5v9M8 7.5l8.5 10.5M16 7.5v5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"/></>,
  },
  express: {
    bg: "#000", color: "#fff", label: "Express",
    svg: <text x="12" y="15.5" textAnchor="middle" fill="currentColor" fontFamily="ui-monospace, monospace" fontSize="9" fontWeight="700" fontStyle="italic">ex</text>,
  },
  typescript: {
    bg: "#3178C6", color: "#fff", label: "TypeScript",
    svg: <text x="12" y="15.5" textAnchor="middle" fill="currentColor" fontFamily="system-ui, sans-serif" fontSize="9" fontWeight="800">TS</text>,
  },
  tailwind: {
    bg: "#0B1120", color: "#38BDF8", label: "Tailwind",
    svg: <path d="M6 10c1.2-2.5 2.8-3.5 4.8-3 1.3.4 2.2 1.4 3.2 2.5 1.2 1.2 2.4 1.5 3.6.8-.8 2-2 2.8-3.7 2.5-1.2-.2-2.2-1-3.2-2-1.2-1.4-2.6-1.8-4.7-.8zm-3 5c1.2-2.5 2.8-3.5 4.8-3 1.3.4 2.2 1.4 3.2 2.5 1.2 1.2 2.4 1.5 3.6.8-.8 2-2 2.8-3.7 2.5-1.2-.2-2.2-1-3.2-2-1.2-1.4-2.6-1.8-4.7-.8z" fill="currentColor"/>,
  },
  react: {
    bg: "#000", color: "#61DAFB", label: "React",
    svg: <><circle cx="12" cy="12" r="1.6" fill="currentColor"/><ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="currentColor" strokeWidth="1" fill="none"/><ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="currentColor" strokeWidth="1" fill="none" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="currentColor" strokeWidth="1" fill="none" transform="rotate(-60 12 12)"/></>,
  },
  node: {
    bg: "#000", color: "#8CC84B", label: "Node.js",
    svg: <><path d="M12 2.5 3.2 7.5v9L12 21.5l8.8-5v-9L12 2.5z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round"/><text x="12" y="15" textAnchor="middle" fill="currentColor" fontFamily="system-ui, sans-serif" fontSize="7" fontWeight="700">N</text></>,
  },
  mongodb: {
    bg: "#000", color: "#4DB33D", label: "MongoDB",
    svg: <path d="M12 2c-1 3.5-4.5 5.5-4.5 10s2.5 8.5 4.5 9.5c2-1 4.5-5 4.5-9.5S13 5.5 12 2zm0 4v15" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"/>,
  },
};

function TechIcon({ name, size = 32 }) {
  const t = TECH_ICONS[name];
  if (!t) return null;
  const inner = Math.round(size * 0.6);
  return (
    <span className="tech-dot" style={{ background: t.bg, color: t.color }} title={t.label} aria-label={t.label}>
      <svg viewBox="0 0 24 24" width={inner} height={inner} aria-hidden="true">{t.svg}</svg>
    </span>
  );
}

/* ---------- Reveal on scroll ---------- */
function useReveal(deps = []) {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.in)");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, deps);
}

/* ---------- Nav ---------- */
function Nav({ mode, setMode }) {
  return (
    <header className="nav">
      <a href="#top" className="nav-brand">
        <span>{DATA.name.first}</span>
        <span className="nav-brand-dot" />
      </a>
      <nav className="nav-links" aria-label="primary">
        <a className={"nav-link" + (mode === "pro" ? " active" : "")} href="#top" onClick={(e)=>{e.preventDefault(); setMode("pro");}}>Professional</a>
        <a className={"nav-link" + (mode === "personal" ? " active" : "")} href="#top" onClick={(e)=>{e.preventDefault(); setMode("personal");}}>Personal</a>
        <a className="nav-lang" href="/resume/Hammad-Amer-Resume.pdf" target="_blank" rel="noopener noreferrer"><Icon name="external" size={13}/> Resume</a>
      </nav>
    </header>
  );
}

/* ---------- Avatar ring (SVG — varying dash sizes) ---------- */
function AvatarRing() {
  const dash = "20 8 5 5 14 7 4 6 22 9 8 5 16 7 3 8 18 6";
  return (
    <svg className="avatar-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="av-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.6" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <radialGradient id="bg-glow" cx="50%" cy="50%" r="50%">
          <stop offset="55%" stopColor="rgba(34,221,170,0)" />
          <stop offset="82%" stopColor="rgba(34,221,170,0.15)" />
          <stop offset="100%" stopColor="rgba(34,221,170,0.04)" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="49" fill="url(#bg-glow)" />
      <circle cx="50" cy="50" r="48" fill="none"
        stroke="var(--accent)" strokeWidth="1.2"
        strokeDasharray={dash} filter="url(#av-glow)" />
    </svg>
  );
}

/* ---------- Interactive profile portrait ----------
   Shows photo 1 by default. Behaviour adapts to the device:
   - Hover-capable (laptop/desktop): hovering flips to photo 2, leaving reverts.
   - Touch (no hover): a tap flips to photo 2, and it auto-reverts to photo 1
     after 3s, or the user can tap again to flip back immediately. */
function ProfileAvatar() {
  const [flipped, setFlipped] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => { mq.removeEventListener?.("change", update); clearTimeout(timer.current); };
  }, []);

  // Tap toggles on touch devices only; hover drives it on desktop.
  const toggle = () => {
    if (canHover) return;
    clearTimeout(timer.current);
    setFlipped((f) => {
      const next = !f;
      if (next) timer.current = setTimeout(() => setFlipped(false), 3000);
      return next;
    });
  };
  const hoverProps = canHover
    ? { onMouseEnter: () => setFlipped(true), onMouseLeave: () => setFlipped(false) }
    : {};

  return (
    <button
      type="button"
      className="avatar-toggle"
      onClick={toggle}
      {...hoverProps}
      aria-pressed={flipped}
      aria-label={flipped ? "Show first profile photo" : "Show second profile photo"}
    >
      <img className="avatar-photo" src="/images/profileimg1.png" alt="Hammad Amer"
        style={{ opacity: flipped ? 0 : 1 }} draggable="false" />
      <img className="avatar-photo" src="/images/profileimg2.png" alt="" aria-hidden="true"
        style={{ opacity: flipped ? 1 : 0 }} draggable="false" />
    </button>
  );
}

/* ---------- Professional sections ---------- */
function ProHero() {
  return (
    <section id="top" className="hero shell">
      <div className="reveal">
        <div className="hero-kicker">
          {DATA.role}
          <span className="hero-loc"><Icon name="pin" size={13}/> Based in {DATA.location}</span>
        </div>
        <h1 className="hero-title">
          <span className="hi">Hello I'm</span>
          <span className="name"><Typewriter text={`${DATA.name.first} ${DATA.name.last}`} speed={70}/></span>
        </h1>
        <p className="hero-desc">{DATA.lede}</p>
        <div className="hero-actions">
          <a className="btn-fill" href="#contact"><span>Let's talk</span><span className="arrow">›</span></a>
          <div className="socials">
            <a className="social" href="https://www.linkedin.com/in/hammad-amer-ch" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Icon name="linkedin"/></a>
            <a className="social" href="https://github.com/Hammad-Amer" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Icon name="github"/></a>
          </div>
        </div>
      </div>
      <div className="avatar-wrap reveal">
        <AvatarRing />
        <div className="avatar">
          <ProfileAvatar />
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <div className="shell">
      <div className="stats reveal">
        {DATA.stats.map((s) => (
          <div className="stat" key={s.label}>
            <span className="stat-num"><CountUp to={s.num}/></span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Education() {
  return (
    <section className="section shell">
      <h2 className="section-title reveal"><span className="ico"><Icon name="cap" size={36}/></span> Education</h2>
      <div className={"edu-grid" + (DATA.education.length === 1 ? " solo" : "")}>
        {DATA.education.map((e) => (
          <article className="card reveal" key={e.title}>
            <h3 className="edu-title">{e.title}</h3>
            <div className="edu-date">{e.date}</div>
            {e.grade && <div className="edu-grade"><Icon name="cap" size={16}/> {e.grade}</div>}
            <p className="edu-school">{e.school}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

// Primary tech stack — grouped, with each tool's authentic logo (rendered as a
// brand-colored mask) and brand color for the tile glow.
const TECH_STACK = [
  { group: "Core Dev", items: [
    { name: "React", slug: "react", brand: "#61DAFB" },
    { name: "Node.js", slug: "nodejs", brand: "#66BB6A" },
    { name: "Python", slug: "python", brand: "#4B8BBE" },
    { name: "C++", slug: "cpp", brand: "#6E9FD2" },
    { name: "Java", slug: "java", brand: "#F89820" },
    { name: "MongoDB", slug: "mongodb", brand: "#4DB33D" },
  ]},
  { group: "Cloud & Infra", items: [
    { name: "AWS", slug: "aws", brand: "#FF9900" },
    { name: "Docker", slug: "docker", brand: "#2496ED" },
    { name: "Kubernetes", slug: "kubernetes", brand: "#5C86EA" },
    { name: "Linux", slug: "linux", brand: "#FCC624" },
  ]},
  { group: "AI & MLOps", items: [
    { name: "PyTorch", slug: "pytorch", brand: "#EE4C2C" },
    { name: "TensorFlow", slug: "tensorflow", brand: "#FF8F00" },
    { name: "MLflow", slug: "mlflow", brand: "#2BA8E8" },
    { name: "Airflow", slug: "airflow", brand: "#3098ED" },
  ]},
];

function TechTile({ name, slug, brand }) {
  return (
    <span className="tile" style={{ "--brand": brand, "--logo": `url(/images/tech/${slug}.svg)` }}>
      <span className="tile-logo" aria-hidden="true" />
      <span className="tile-name">{name}</span>
    </span>
  );
}

function ShortProfile() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(DATA.email).catch(()=>{});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <section className="section shell">
      <h2 className="section-title reveal"><span className="ico"><Icon name="briefcase" size={32}/></span> Short Profile</h2>

      <div className="bento reveal">
        <div className="bento-big">
          <div className="bento-big-mock"><NodeGraph className="mock-graph" /></div>
          <div className="bento-big-text">AI engineer building intelligent, end-to-end products — multi-agent ML pipelines and deep-learning models, deployed in production-grade apps.</div>
        </div>
        <div className="bento-box bento-lang">
          <div className="bento-headline">Fluent in English and Urdu</div>
          <div className="urdu-watermark" aria-hidden="true" lang="ur" dir="rtl">خوش آمدید</div>
        </div>
        <div className="bento-box bento-stack">
          <div className="bento-small-label">My primary tech stack</div>
          <div className="stack-groups">
            {TECH_STACK.map((g) => (
              <div className="stack-group" key={g.group}>
                <div className="stack-group-label">{g.group}</div>
                <div className="stack-tiles">
                  {g.items.map((it) => <TechTile key={it.name} {...it} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="profile-row reveal">
        <div className="card">
          <div className="bento-small-label" style={{marginBottom:10}}>AI / ML Engineer</div>
          <p className="profile-arch">Deploying PyTorch models within scalable MERN architectures — from training pipelines to production.</p>
        </div>
        <div className="profile-ask">
          <div className="profile-ask-title">Do you want to ask a question?</div>
          <button className="copy-btn" onClick={copy}>
            <Icon name="copy" size={14}/> {copied ? "Email is Copied!" : "Copy my email"}
          </button>
        </div>
      </div>

      <div className="scoop reveal" style={{marginTop: 20}}>
        <div className="scoop-left">
          <div className="kicker">The Inside Scoop</div>
          <div className="title">Graduating soon, exploring what's next</div>
        </div>
        <div className="scoop-code">
          <div><span className="ln">1</span><span className="cm"># my debugging strategy</span></div>
          <div><span className="ln">2</span><span className="kw">while</span> <span className="kw">not</span> working:</div>
          <div><span className="ln">3</span>{"    "}print(<span className="str">"but... why?"</span>){"   "}<span className="cm"># 🐛</span></div>
          <div><span className="ln">4</span>{"    "}change_one_thing()</div>
          <div><span className="ln">5</span>{"    "}pray(){"        "}<span className="cm"># 🙏</span></div>
          <div><span className="ln">6</span><span className="cm"># works now. nobody knows why.</span></div>
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const pretty = {
    nextjs: "Next.js", express: "Express", typescript: "TypeScript",
    tailwind: "Tailwind", react: "React", node: "Node.js", mongodb: "MongoDB",
  };
  return (
    <section className="section shell proj-section">
      <h2 className="projects-head reveal">A small selection of <span className="accent">recent projects</span></h2>
      <div className="proj-grid">
        {DATA.projects.slice(0, 6).map((p, i) => (
          <ProjectCard
            key={p.title}
            index={i}
            title={p.title}
            description={p.desc}
            url={p.url.startsWith("http") ? p.url : `https://${p.url}`}
            tags={(p.tech || []).map(t => pretty[t] || t)}
            thumbnail={{ src: p.image, label: p.label }}
            accent="#10F294"
            tiltDeg={8}
            cardBg="#0d0f15"
            strokeColor="rgba(255,255,255,0.06)"
            fontTitle='"JetBrains Mono", ui-monospace, monospace'
            fontBody='"JetBrains Mono", ui-monospace, monospace'
          />
        ))}
      </div>
      <div className="explore-more reveal">
        <a className="explore-btn" href="#projects">Explore more projects <span className="explore-arrow">→</span></a>
      </div>
    </section>
  );
}

function ExperienceCards() {
  // Static cards — the previous version drove a per-frame requestAnimationFrame
  // loop to travel a glow around each card's perimeter, which was costing frames.
  // The accent glow is now a fixed, GPU-cheap CSS gradient that brightens on hover.
  return (
    <section className="section shell">
      <h2 className="projects-head reveal">My <span className="accent">Experience</span></h2>
      <div className="xp-grid">
        {DATA.experience.map((x, i) => (
          <article className="xp-card reveal" key={x.title} style={{transitionDelay: `${i*60}ms`}}>
            <div className={"xp-illust " + x.v}>ICON</div>
            <div className="xp-body">
              <h3 className="xp-title">{x.title}</h3>
              {x.meta && <div className="xp-meta">{x.meta}</div>}
              <p className="xp-desc">{x.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Journey() {
  return (
    <section id="journey" className="section shell">
      <div className="journey-intro reveal">
        <h3 className="title">My journey report</h3>
        <p className="body">I've built software across internships, freelance work and academic projects — spanning AI/ML, full-stack web and mobile apps, and systems. Here's a short timeline of how it came together.</p>
      </div>
      <div className="timeline">
        {DATA.timeline.map((t) => (
          <div className="tl-row reveal" key={t.year}>
            <span className="tl-dot" />
            <div className="tl-year">{t.year}</div>
            <p className="tl-copy">{t.copy}</p>
            <div className="tl-thumb">
              {t.img && <img src={t.img} alt={`${t.year} — ${t.label || t.year}`} loading="lazy" />}
              {t.label && <span className="tl-thumb-label">{t.label}</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Talk({ setMode }) {
  const [copied, setCopied] = useState(false);
  const copyEmail = () => {
    navigator.clipboard?.writeText(DATA.email).catch(()=>{});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <section id="contact" className="talk shell">
      <h2 className="talk-title reveal">Let's <span className="accent">Talk</span></h2>
      <p className="talk-body reveal">What led you here? What are you looking for? I would love to hear from you over a virtual coffee chat!</p>
      <a className="btn-purple reveal" href={`https://mail.google.com/mail/?view=cm&fs=1&to=${DATA.email}&su=${encodeURIComponent("Hello Hammad — let's talk")}`} target="_blank" rel="noopener noreferrer">Let's get in touch <Icon name="send" size={14}/></a>
      <div className="talk-email reveal">
        <span className="talk-email-label">Or reach me directly at</span>
        <a className="talk-email-addr" href={`mailto:${DATA.email}`}>{DATA.email}</a>
        <button className="talk-email-copy" onClick={copyEmail} aria-label="Copy email address">
          <Icon name="copy" size={13}/> {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className="reveal">
        <button className="peer-btn" onClick={() => setMode("personal")}>Peer through my Personal Life</button>
      </div>
    </section>
  );
}

/* ---------- Personal sections ---------- */
// Words that cycle after "Hac is ___" — a mix of work traits and personality.
const HAC_WORDS = ["Curious", "Creative", "Relentless", "Analytical", "Caffeinated", "Always learning"];

// Looping typewriter: types a word, holds, backspaces it, then types the next.
function RotatingWord({ words, className = "", typeSpeed = 110, deleteSpeed = 60, hold = 2200 }) {
  const [wi, setWi] = useState(0);
  const [text, setText] = useState(words[0] || "");
  const [phase, setPhase] = useState("hold"); // typing | hold | deleting
  useEffect(() => {
    if (!words || words.length <= 1) return;
    const word = words[wi];
    let timer;
    if (phase === "hold") {
      timer = setTimeout(() => setPhase("deleting"), hold);
    } else if (phase === "deleting") {
      if (text.length === 0) {
        setWi((p) => (p + 1) % words.length);
        setPhase("typing");
      } else {
        timer = setTimeout(() => setText(text.slice(0, -1)), deleteSpeed);
      }
    } else { // typing
      if (text.length === word.length) {
        setPhase("hold");
      } else {
        timer = setTimeout(() => setText(word.slice(0, text.length + 1)), typeSpeed);
      }
    }
    return () => clearTimeout(timer);
  }, [text, phase, wi, words, typeSpeed, deleteSpeed, hold]);
  // Caret only shows while typing/deleting — it disappears once a word is complete.
  return (
    <span className={className}>
      {text}
      {phase !== "hold" && <span className="type-caret" aria-hidden="true">&nbsp;</span>}
    </span>
  );
}

function PersonalHero({ setMode }) {
  return (
    <section className="p-hello shell" id="top">
      <div className="reveal">
        <div className="row-1">Hello again?</div>
        <div className="row-2">My nickname is <span className="tag">Hac</span></div>
        <div className="line-sm">Hac is <RotatingWord className="accent" words={HAC_WORDS} /></div>
        <div className="line-md">To me, code is a canvas — every pixel here was hand-crafted with care</div>
        <a className="write-btn" href={`https://mail.google.com/mail/?view=cm&fs=1&to=${DATA.email}&su=${encodeURIComponent("A letter for Hac")}`} target="_blank" rel="noopener noreferrer">Write a Letter</a>
      </div>
    </section>
  );
}

function Hobbies() {
  return (
    <section className="section shell">
      <h2 className="projects-head reveal">Hac's <span className="accent">Hobbies</span></h2>
      <p className="section-sub reveal">I pick up hobbies faster than I finish side projects.</p>
      <div className="hobbies-grid reveal">
        {DATA.hobbies.map((h) => (
          <div className="hobby" key={h.title}>
            <h3 className="hobby-title">{h.title}</h3>
            <p className="hobby-desc">{h.desc}</p>
            <div className="hobby-img">
              {h.img ? <img src={h.img} alt={h.title} loading="lazy" /> : "IMAGERY"}
            </div>
          </div>
        ))}
        <div className="hobby hobby-globe-card">
          <h3 className="hobby-title">{DATA.travel.title}</h3>
          <p className="hobby-desc">{DATA.travel.desc}</p>
          <Globe className="hobby-globe" />
        </div>
      </div>
    </section>
  );
}

function LifeStrip() {
  return (
    <section className="section shell">
      <h2 className="projects-head reveal" style={{textAlign:"left"}}>Components of <span className="accent">Hac's Life</span></h2>
      <div className="life-strip">
        {DATA.life.map((l, i) => (
          <div
            className={"life-card reveal " + l.cls}
            key={l.title}
            style={{
              transitionDelay: `${i*50}ms`,
              ...(l.img ? { backgroundImage: `url("${l.img}")`, backgroundSize: "cover", backgroundPosition: "center" } : {}),
            }}
          >
            <div className="life-title">{l.title}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PersonalBento() {
  return (
    <section className="section shell">
      <div className="personal-bento reveal">
        <div className="routine">
          <div className="panel">
            <div className="panel-head"><span>Daily routine</span><Icon name="alarm" size={16}/></div>
            <div className="routine-list">
              {DATA.routine.map((r) => (
                <div className="routine-item" key={r.t}>
                  <div className="t">{r.t}</div>
                  <div className="what">{r.what}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="plan">
          <div className="panel">
            <div className="panel-head"><span className="accent">🎯 Future plan</span><span className="accent">{DATA.plan.length}</span></div>
            <ul className="plan-list">
              {DATA.plan.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>
        </div>

        <div className="music-col">
          <SongPlayer />
          <div className="tags-col">
            {DATA.tags.map((t) => (
              <div className={"tag-row " + t.cls} key={t.label}>
                <span>{t.label}</span><span>{t.n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Thanks() {
  return (
    <section className="shell">
      <div className="thanks reveal">
        <h2 className="thanks-1">For visiting my profile</h2>
        <h2 className="thanks-2">Thank you.</h2>
        <div className="thanks-tag"><span className="avatar-sm" /> {DATA.name.first} {DATA.name.last}</div>
      </div>
    </section>
  );
}

/* ---------- Mode pill (sticky) ---------- */
function ModePill({ mode, setMode }) {
  return (
    <div className="mode-pill" role="tablist">
      <button className={"mode-opt" + (mode === "pro" ? " active" : "")} onClick={() => setMode("pro")} role="tab" aria-selected={mode==="pro"}>Professional</button>
      <button className={"mode-opt personal" + (mode === "personal" ? " active" : "")} onClick={() => setMode("personal")} role="tab" aria-selected={mode==="personal"}>Personal</button>
    </div>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-name">{DATA.name.first} {DATA.name.last}</div>
      <div className="footer-socials">
        <a className="social" href="https://www.linkedin.com/in/hammad-amer-ch" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Icon name="linkedin"/></a>
        <a className="social" href="https://github.com/Hammad-Amer" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Icon name="github"/></a>
      </div>
    </footer>
  );
}

/* ---------- All Projects (archive route) ---------- */
function AllProjects() {
  const pretty = {
    nextjs: "Next.js", express: "Express", typescript: "TypeScript",
    tailwind: "Tailwind", react: "React", node: "Node.js", mongodb: "MongoDB",
  };
  // Curated to the main technologies (cards still show every tag). Each project
  // matches at least one of these, so no filter ever lands on an empty list.
  const techs = ["Python", "PyTorch", "React", "Kotlin", "C++", "AWS", "MySQL"];
  const [filter, setFilter] = useState("All");
  const countFor = (t) => DATA.projects.filter((p) => (p.tech || []).includes(t)).length;
  const list = filter === "All"
    ? DATA.projects
    : DATA.projects.filter((p) => (p.tech || []).includes(filter));

  useReveal([filter]);

  return (
    <main className="archive page-transition">
      <div className="shell">
        <div className="arch-bar">
          <a className="arch-back" href="#top"><span className="arch-back-arrow">←</span> Back to portfolio</a>
          <span className="arch-path">~/projects — {DATA.projects.length} entries</span>
        </div>

        <header className="arch-head reveal">
          <div className="arch-kicker">The Index</div>
          <h1 className="arch-title">Project <span className="accent">Archive</span></h1>
          <p className="arch-sub">Everything I've built and tinkered with — case studies, side quests and experiments. Filter by stack.</p>
        </header>

        <div className="arch-filters reveal">
          <button className={"arch-chip" + (filter === "All" ? " on" : "")} onClick={() => setFilter("All")}>
            All <span className="arch-chip-n">{DATA.projects.length}</span>
          </button>
          {techs.map((t) => (
            <button key={t} className={"arch-chip" + (filter === t ? " on" : "")} onClick={() => setFilter(t)}>
              {pretty[t] || t} <span className="arch-chip-n">{countFor(t)}</span>
            </button>
          ))}
        </div>

        <div className="archive-grid">
          {list.map((p) => {
            const n = DATA.projects.indexOf(p) + 1;
            const href = p.url.startsWith("http") ? p.url : `https://${p.url}`;
            return (
              <a className="arch-card reveal" key={p.title} href={href} target="_blank" rel="noopener noreferrer">
                <div className={"arch-thumb " + p.mock}>
                  <span className="arch-idx">{String(n).padStart(2, "0")}</span>
                  <span className="arch-label">{p.label}</span>
                </div>
                <div className="arch-card-body">
                  <h3 className="arch-name">{p.title}</h3>
                  <p className="arch-desc">{p.desc}</p>
                  <div className="arch-foot">
                    <div className="arch-tech">
                      {(p.tech || []).map((t) => <span key={t} className="arch-tag">{pretty[t] || t}</span>)}
                    </div>
                    <span className="arch-view">View <span className="arch-view-arrow">↗</span></span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        <div className="arch-end reveal">
          <a className="arch-back arch-back-bottom" href="#top"><span className="arch-back-arrow">←</span> Back to portfolio</a>
        </div>
      </div>
    </main>
  );
}

/* ---------- App ---------- */
function App() {
  const [mode, setMode] = useState(() => localStorage.getItem("portfolio-mode") || "pro");
  const [route, setRoute] = useState(() => (window.location.hash === "#projects" ? "projects" : "home"));

  useEffect(() => {
    const onHash = () => {
      setRoute(window.location.hash === "#projects" ? "projects" : "home");
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    localStorage.setItem("portfolio-mode", mode);
    document.body.classList.toggle("mode-personal", mode === "personal");
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [mode]);

  useReveal([mode, route]);

  if (route === "projects") {
    return (
      <>
        <ScrollProgress />
        <BgOrb />
        <AllProjects />
        <Footer />
      </>
    );
  }

  return (
    <>
      <ScrollProgress />
      <BgOrb />
      <Nav mode={mode} setMode={setMode} />
      <main key={mode} className="page-transition">
        {mode === "pro" ? (
          <>
            <ProHero />
            <Stats />
            <Education />
            <ShortProfile />
            <Projects />
            <ExperienceCards />
            <Journey />
            <Talk setMode={setMode} />
          </>
        ) : (
          <>
            <PersonalHero setMode={setMode} />
            <Hobbies />
            <LifeStrip />
            <PersonalBento />
            <Thanks />
          </>
        )}
      </main>
      <Footer />
      <ModePill mode={mode} setMode={setMode} />
    </>
  );
}

export default App;
