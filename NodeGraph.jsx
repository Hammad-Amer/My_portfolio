// NodeGraph.jsx
// Ambient "multi-agent ML pipeline" visual for the Short Profile bento.
// Renders a <canvas> of connected nodes with signals traveling along the
// edges — green/purple to match the theme. Driven by requestAnimationFrame.
//
// Follows the same discipline as Globe.jsx: ~30fps cap, paused when scrolled
// offscreen or the tab is hidden, and a single static frame is always painted
// so a paused graph still looks right.
//
// Usage: <NodeGraph className="mock-graph" />

import { useRef, useEffect } from "react";

const ACCENT = "16, 242, 148";   // --accent  #10f294
const PURPLE = "139, 124, 245";  // --purple  #8b7cf5

export function NodeGraph({ className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");

    let W = 0, H = 0, dpr = 1;
    let nodes = [];   // { x, y, ox, oy, ax, ay, ph, sp, hue }
    let edges = [];   // { a, b, pulse, pulseSp, pulseGap }

    // Lay out nodes on a loose grid then jitter, so the graph reads as a
    // pipeline rather than a random cloud. Rebuilt whenever the box resizes.
    function build() {
      const rect = cvs.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const bw = Math.round(rect.width * dpr);
      const bh = Math.round(rect.height * dpr);
      // Skip if the box hasn't actually changed (guards against resize churn).
      if (bw === cvs.width && bh === cvs.height && nodes.length) return;
      W = rect.width; H = rect.height;
      cvs.width = bw;
      cvs.height = bh;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = 4, rows = 3;
      nodes = [];
      let i = 0;
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          // Skip a couple of cells so the lattice isn't a perfect grid.
          if ((c === 1 && r === 2) || (c === 2 && r === 0)) continue;
          const padX = W * 0.14, padY = H * 0.18;
          const gx = padX + (c / (cols - 1)) * (W - padX * 2);
          const gy = padY + (r / (rows - 1)) * (H - padY * 2);
          const jx = (Math.sin(i * 12.9898) * 43758.5453 % 1) * W * 0.06;
          const jy = (Math.sin(i * 78.233) * 12543.123 % 1) * H * 0.06;
          nodes.push({
            ox: gx + jx, oy: gy + jy,
            x: gx, y: gy,
            ax: 3 + (i % 3), ay: 2 + (i % 4),  // drift amplitude (px)
            ph: i * 0.7,                         // drift phase
            sp: 0.5 + (i % 3) * 0.18,            // drift speed
            hue: i % 3 === 0 ? PURPLE : ACCENT,
          });
          i++;
        }
      }

      // Connect each node to its 2 nearest neighbors (dedup undirected pairs).
      edges = [];
      const seen = new Set();
      for (let a = 0; a < nodes.length; a++) {
        const dists = [];
        for (let b = 0; b < nodes.length; b++) {
          if (a === b) continue;
          const dx = nodes[a].ox - nodes[b].ox;
          const dy = nodes[a].oy - nodes[b].oy;
          dists.push({ b, d: dx * dx + dy * dy });
        }
        dists.sort((p, q) => p.d - q.d);
        for (let k = 0; k < 2; k++) {
          const b = dists[k].b;
          const key = a < b ? a + "-" + b : b + "-" + a;
          if (seen.has(key)) continue;
          seen.add(key);
          edges.push({
            a, b,
            pulse: Math.random(),                 // 0..1 position along edge
            pulseSp: 0.18 + Math.random() * 0.22, // travel speed
          });
        }
      }
    }

    let t = 0;
    let last = performance.now();
    let raf = 0;
    let running = false;
    let onScreen = false;

    function render() {
      ctx.clearRect(0, 0, W, H);

      // Update node positions (gentle drift around the base point).
      for (const n of nodes) {
        n.x = n.ox + Math.sin(t * n.sp + n.ph) * n.ax;
        n.y = n.oy + Math.cos(t * n.sp * 0.8 + n.ph) * n.ay;
      }

      // Edges + traveling signal.
      ctx.lineWidth = 1;
      for (const e of edges) {
        const a = nodes[e.a], b = nodes[e.b];
        ctx.strokeStyle = "rgba(255,255,255,0.10)";
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();

        // Signal dot riding the edge.
        e.pulse += e.pulseSp * 0.016;
        if (e.pulse > 1) e.pulse -= 1;
        const px = a.x + (b.x - a.x) * e.pulse;
        const py = a.y + (b.y - a.y) * e.pulse;
        ctx.fillStyle = `rgba(${ACCENT}, 0.9)`;
        ctx.beginPath();
        ctx.arc(px, py, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Nodes with a soft glow.
      for (const n of nodes) {
        const pulse = 0.6 + 0.4 * Math.sin(t * 1.4 + n.ph);
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 9);
        g.addColorStop(0, `rgba(${n.hue}, ${0.35 * pulse})`);
        g.addColorStop(1, `rgba(${n.hue}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 9, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${n.hue}, ${0.85})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // ~30fps is plenty for a slow ambient graph.
    const FRAME_MS = 1000 / 30;
    let acc = 0;
    function loop(now) {
      if (!running) return;
      let dt = (now - last) / 1000; last = now;
      if (dt > 0.1) dt = 0.1;
      t += dt;
      acc += dt * 1000;
      raf = requestAnimationFrame(loop);
      if (acc >= FRAME_MS) { acc = 0; render(); }
    }

    function start() {
      if (running) return;
      running = true;
      last = performance.now();
      acc = FRAME_MS;
      raf = requestAnimationFrame(loop);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }
    function sync() {
      if (onScreen && !document.hidden) start();
      else stop();
    }

    build();
    render();

    const io = new IntersectionObserver((entries) => {
      onScreen = entries[0].isIntersecting;
      sync();
    }, { threshold: 0.01 });
    io.observe(cvs);
    document.addEventListener("visibilitychange", sync);

    const ro = new ResizeObserver(() => { build(); render(); });
    ro.observe(cvs);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return <canvas ref={ref} className={"node-graph " + className} />;
}
