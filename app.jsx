// Portfolio — dark terminal aesthetic, Professional/Personal modes
const { useState, useEffect, useRef } = React;

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
    const on = (e) => {
      if (!ref.current) return;
      ref.current.style.transform = `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`;
    };
    window.addEventListener("pointermove", on);
    return () => window.removeEventListener("pointermove", on);
  }, []);
  return <div ref={ref} className="bg-orb" />;
}

/* ---------- Placeholder content ---------- */
const DATA = {
  name: { first: "Your", last: "Name" },
  role: "Software Engineer",
  lede: "IT Specialist & Full-Stack Developer | Pragmatic, delivery-oriented | Fintech & Cloud | Your Region",
  email: "hello@example.com",
  stats: [
    { num: "22", label: "Age" },
    { num: "2", label: "Years of experience" },
    { num: "19", label: "Projects worked on" },
    { num: "9", label: "Projects Deployed" },
  ],
  education: [
    { title: "High school certificate", date: "Sep 1, 2019 - Jun 15, 2022", grade: "98.5", school: "Placeholder High School — Honorary student" },
    { title: "Bachelor in Information Technology", date: "Sep 1, 2022 - Jun 15, 2026", grade: "3.7", school: "Placeholder National University" },
  ],
  projects: [
    { title: "Mining Exchange Platform", desc: "Commodity trading platform with real-time auction and settlement.", mock: "mock-1", label: "DASHBOARD" },
    { title: "Crypto Markets Tracker", desc: "Market dashboard with live charts and portfolio management.", mock: "mock-2", label: "CHARTS" },
    { title: "Brokerage Mini App", desc: "Stock trading with account and balance management.", mock: "mock-3", label: "MOBILE" },
    { title: "Hotel & Resorts SaaS", desc: "SaaS platform for resort management, integrating payments.", mock: "mock-4", label: "LANDING" },
  ],
  experience: [
    { title: "Frontend Engineer", desc: "Shipped three projects as a team lead, and built a real-time auction interface. Continuously improving UX, exploring Framer Motion for animations.", v: "" },
    { title: "Backend Engineer", desc: "Designed and built ISO-secure monolith and microservices where over 100 million USD worth of trades have been executed.", v: "v2" },
    { title: "Teammate", desc: "Worked with stakeholders to develop Mining Commodity Exchange System. Led dev team, and deployed projects successfully.", v: "v3" },
    { title: "Aspiring DevOps", desc: "Maintained multiple systems, currently preparing for Solutions Architect certification.", v: "v4" },
  ],
  timeline: [
    { year: "2025", copy: "It's been quite an exciting year. While finishing my thesis, I built core dealer-broker systems and organized online annual general meetings for 10 companies. Honored to be named Student of the Year and to win a cloud scholarship among 200+ students. Separately, completed a one-month internship abroad.", label: "THESIS & INTERNSHIP" },
    { year: "2024", copy: "Focused on freelance consulting and performance tuning. Wrote a lot of TypeScript, shipped several side projects, and got comfortable with multi-agent systems.", label: "CONSULTING" },
    { year: "2023", copy: "Joined my first team as a junior engineer. Worked on fintech systems handling real money — the best kind of pressure to grow under.", label: "FIRST ROLE" },
  ],
  hobbies: [
    { title: "Morning Run", desc: "There's something special about running in the morning. Not an athlete, but it makes me feel truly peaceful. Also enjoy fitness and swimming." },
    { title: "Enjoyer of good books", desc: "I enjoy many pastimes, from video games to movies and music, but reading novels is how I spend most of my time lately." },
    { title: "Music Enthusiast", desc: "I also play guitar and piano, sharing my music online occasionally." },
    { title: "Dream of Becoming a Polyglot", desc: "Currently learning a new language, and planning to study more in the future. No specific goal yet." },
  ],
  life: [
    { kicker: "Books", title: "Fiction Novels", cls: "life-1" },
    { kicker: "Music", title: "Musical Instruments, Band", cls: "life-2" },
    { kicker: "Computer, IT", title: "Interest, Work", cls: "life-3" },
    { kicker: "Fitness", title: "Sport, Wellness", cls: "life-4" },
  ],
  routine: [
    { t: "6:00 AM", what: "Wake up" },
    { t: "8:00 AM", what: "School / Work" },
    { t: "5:00 PM", what: "Gym" },
    { t: "6:00 PM", what: "Read books" },
    { t: "7:00 PM", what: "Piano & Music" },
    { t: "9:00 PM", what: "Sleep" },
  ],
  plan: ["Graduation", "Travel Abroad", "Master Piano", "Master Guitar", "Go Gym", "Read Books", "Learn Languages", "Learn Trading", "Make Family Happy", "Make Friends Happy"],
  tags: [
    { cls: "tag-blue", label: "Books read", n: "+50" },
    { cls: "tag-purple", label: "Animes watched", n: "+300" },
    { cls: "tag-red", label: "Movies watched", n: "+200" },
    { cls: "tag-green", label: "Musics learned", n: "+20" },
    { cls: "tag-yellow", label: "Kanji learned", n: "+1100" },
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
  };
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">{paths[name]}</svg>;
};

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
        <a className="nav-link" href="#contact">Contact</a>
        <a className="nav-lang" href="#"><Icon name="globe" size={14}/> English ▾</a>
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
        strokeDasharray={dash} filter="url(#av-glow)">
        <animateTransform attributeName="transform" type="rotate"
          from="0 50 50" to="360 50 50" dur="14s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

/* ---------- Professional sections ---------- */
function ProHero() {
  return (
    <section id="top" className="hero shell">
      <div className="reveal">
        <div className="hero-kicker">{DATA.role}</div>
        <h1 className="hero-title">
          <span className="hi">Hello I'm</span>
          <span className="name"><Typewriter text={`${DATA.name.first} ${DATA.name.last}`} speed={70}/></span>
        </h1>
        <p className="hero-desc">{DATA.lede}</p>
        <div className="hero-actions">
          <a className="btn-outline" href="#"><span>VIEW CV</span><span className="arrow">›</span></a>
          <div className="socials">
            <a className="social" href="#" aria-label="Facebook"><Icon name="facebook"/></a>
            <a className="social" href="#" aria-label="Instagram"><Icon name="instagram"/></a>
            <a className="social" href="#" aria-label="YouTube"><Icon name="youtube"/></a>
            <a className="social" href="#" aria-label="LinkedIn"><Icon name="linkedin"/></a>
            <a className="social" href="#" aria-label="GitHub"><Icon name="github"/></a>
          </div>
        </div>
      </div>
      <div className="avatar-wrap reveal">
        <AvatarRing />
        <div className="avatar">
          <div className="avatar-placeholder">PORTRAIT</div>
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
      <div className="edu-grid">
        {DATA.education.map((e) => (
          <article className="card reveal" key={e.title}>
            <h3 className="edu-title">{e.title}</h3>
            <div className="edu-date">{e.date}</div>
            <div className="edu-grade"><Icon name="cap" size={16}/> {e.grade}</div>
            <p className="edu-school">{e.school}</p>
          </article>
        ))}
      </div>
    </section>
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
          <div className="bento-big-mock">DEVICE MOCKUP</div>
          <div className="bento-big-text">Developer building clean, reliable cloud, auction, and trading systems</div>
        </div>
        <div className="bento-box">
          <div className="bento-headline">Fluent in English, Japanese and Mongolian (IELTS 7, N3)</div>
        </div>
        <div className="bento-box bento-small">
          <div>
            <div className="bento-small-label">My primary<br/>tech stack</div>
            <div className="bento-small-stack">NEXT, Express</div>
          </div>
          <div className="stack-chips">
            <div className="chip">Express</div>
            <div className="chip">.NET</div>
            <div className="chip">Typescript</div>
            <div className="chip">GO</div>
          </div>
        </div>
      </div>

      <div className="profile-row reveal">
        <div className="card">
          <div className="bento-small-label" style={{marginBottom:10}}>Software Architect</div>
          <p className="profile-arch">Designing systems and leading technical direction across cloud deployments.</p>
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
          <div><span className="cm">// Importing a single module</span></div>
          <div><span className="ln">1</span><span className="kw">import</span> moduleName <span className="kw">from</span> <span className="str">'modulePath'</span>;</div>
          <div><span className="ln">2</span></div>
          <div><span className="ln">3</span><span className="cm">// Importing multiple modules</span></div>
          <div><span className="ln">4</span><span className="kw">import</span> {"{ module1, module2 }"} <span className="kw">from</span> <span className="str">'modulePath'</span>;</div>
          <div><span className="ln">5</span></div>
          <div><span className="ln">6</span><span className="cm">// Importing an entire module</span></div>
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section className="section shell">
      <h2 className="projects-head reveal">A small selection of <span className="accent">recent projects</span></h2>
      <div className="proj-grid">
        {DATA.projects.map((p, i) => (
          <article className="proj-card reveal" key={p.title} style={{transitionDelay: `${i*50}ms`}}>
            <div className={"proj-thumb " + p.mock} data-label={p.label} />
            <div className="proj-body">
              <h3 className="proj-title">{p.title}</h3>
              <p className="proj-desc">{p.desc}</p>
              <div className="proj-foot">
                <div className="tech-dots">
                  <span className="tech-dot">N</span>
                  <span className="tech-dot">ex</span>
                  <span className="tech-dot ts">TS</span>
                  <span className="tech-dot tw">tw</span>
                </div>
                <a className="proj-link" href="#">Check Live Site <Icon name="external" size={13}/></a>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="explore-more reveal">
        <a className="explore-btn" href="#">Explore more projects</a>
      </div>
    </section>
  );
}

function ExperienceCards() {
  return (
    <section className="section shell">
      <h2 className="projects-head reveal">My <span className="accent">Experience</span></h2>
      <div className="xp-grid">
        {DATA.experience.map((x, i) => (
          <article className="xp-card reveal" key={x.title} style={{transitionDelay: `${i*60}ms`}}>
            <div className={"xp-illust " + x.v}>ICON</div>
            <div className="xp-body">
              <h3 className="xp-title">{x.title}</h3>
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
        <p className="body">I've had the opportunity to develop software across a variety of settings — from small side-jobs to large corporations, mostly building financial systems. Here's my timeline of my journey.</p>
      </div>
      <div className="timeline">
        {DATA.timeline.map((t) => (
          <div className="tl-row reveal" key={t.year}>
            <span className="tl-dot" />
            <div className="tl-year">{t.year}</div>
            <p className="tl-copy">{t.copy}</p>
            <div className="tl-thumb">{t.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Talk({ setMode }) {
  return (
    <section id="contact" className="talk shell">
      <h2 className="talk-title reveal">Let's <span className="accent">Talk</span></h2>
      <p className="talk-body reveal">What led you here? What are you looking for? I would love to hear from you over a virtual coffee chat!</p>
      <a className="btn-purple reveal" href={`mailto:${DATA.email}`}>Let's get in touch <Icon name="send" size={14}/></a>
      <div className="reveal">
        <button className="peer-btn" onClick={() => setMode("personal")}>Peer through my Personal Life</button>
      </div>
    </section>
  );
}

/* ---------- Personal sections ---------- */
function PersonalHero({ setMode }) {
  return (
    <section className="p-hello shell" id="top">
      <div className="reveal">
        <div className="row-1">Hello again?</div>
        <div className="row-2">My nickname is <span className="tag">Nick</span></div>
        <div className="line-sm">Nick is <span className="accent">Curious</span></div>
        <div className="line-md">Built this website with care 🎨 ✨ 🚀</div>
        <a className="write-btn" href={`mailto:${DATA.email}`}>Write a Letter</a>
      </div>
    </section>
  );
}

function Hobbies() {
  return (
    <section className="section shell">
      <h2 className="projects-head reveal">Nick's <span className="accent">Hobbies</span></h2>
      <p className="section-sub reveal">I like to stay active. New hobbies are added almost every year.</p>
      <div className="hobbies-grid reveal">
        {DATA.hobbies.map((h) => (
          <div className="hobby" key={h.title}>
            <h3 className="hobby-title">{h.title}</h3>
            <p className="hobby-desc">{h.desc}</p>
            <div className="hobby-img">IMAGERY</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LifeStrip() {
  return (
    <section className="section shell">
      <h2 className="projects-head reveal" style={{textAlign:"left"}}>Components of <span className="accent">Nick's Life</span></h2>
      <div className="life-strip">
        {DATA.life.map((l, i) => (
          <div className={"life-card reveal " + l.cls} key={l.title} style={{transitionDelay: `${i*50}ms`}}>
            <div className="life-kicker">{l.kicker}</div>
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
          <div className="music-card">
            <div className="music-thumb">ALBUM ART</div>
            <div className="music-title">Favorite Track</div>
            <div className="music-sub">Film Soundtrack</div>
            <div className="music-ctrls">|◂ ▸▸ ▸|</div>
          </div>
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
        <a className="social" href="#" aria-label="Facebook"><Icon name="facebook"/></a>
        <a className="social" href="#" aria-label="Instagram"><Icon name="instagram"/></a>
        <a className="social" href="#" aria-label="YouTube"><Icon name="youtube"/></a>
        <a className="social" href="#" aria-label="LinkedIn"><Icon name="linkedin"/></a>
        <a className="social" href="#" aria-label="GitHub"><Icon name="github"/></a>
      </div>
    </footer>
  );
}

/* ---------- App ---------- */
function App() {
  const [mode, setMode] = useState(() => localStorage.getItem("portfolio-mode") || "pro");
  useEffect(() => {
    localStorage.setItem("portfolio-mode", mode);
    document.body.classList.toggle("mode-personal", mode === "personal");
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [mode]);

  useReveal([mode]);

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

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
