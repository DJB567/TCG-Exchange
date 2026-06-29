// Headless QA harness: drives the page via Chrome DevTools Protocol,
// scrolls through the six sections, screenshots each, and reports console
// errors + which overlay is visible at each scroll position.
import fs from "node:fs";

const BASE = process.env.QA_URL || "http://localhost:3001";
const OUT = "/tmp/qa";
fs.mkdirSync(OUT, { recursive: true });

async function cdpTarget() {
  // open a fresh tab pointed at the site
  const res = await fetch(
    `http://localhost:9222/json/new?${encodeURIComponent(BASE)}`,
    { method: "PUT" },
  );
  return res.json();
}

function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  const listeners = [];
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    } else if (msg.method) {
      listeners.forEach((l) => l(msg));
    }
  });
  const ready = new Promise((r) => ws.addEventListener("open", () => r()));
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const mid = ++id;
      pending.set(mid, (m) =>
        m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result),
      );
      ws.send(JSON.stringify({ id: mid, method, params }));
    });
  return { ready, send, on: (l) => listeners.push(l) };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Raw scroll positions. The first ~0.18 is the Pokéball intro; the six content
// sections live in the world region after it: raw t ≈ 0.18 + subPos * 0.82.
const SCROLLS = [
  { name: "00-intro-ball", t: 0.02 },
  { name: "00b-intro-land", t: 0.16 },
  { name: "01-hero", t: 0.23 },
  { name: "02-exchange", t: 0.36 },
  { name: "03-games", t: 0.51 },
  { name: "04-events", t: 0.67 },
  { name: "05-locations", t: 0.84 },
  { name: "06-visit", t: 0.95 },
];

const errors = [];

(async () => {
  const target = await cdpTarget();
  const c = connect(target.webSocketDebuggerUrl);
  await c.ready;
  c.on((m) => {
    if (m.method === "Runtime.exceptionThrown") {
      errors.push("EXCEPTION: " + (m.params.exceptionDetails?.text || "") + " " +
        (m.params.exceptionDetails?.exception?.description || ""));
    }
    if (m.method === "Runtime.consoleAPICalled" && (m.params.type === "error" || m.params.type === "warning")) {
      errors.push(m.params.type.toUpperCase() + ": " +
        m.params.args.map((a) => a.value ?? a.description ?? "").join(" "));
    }
    if (m.method === "Log.entryAdded" && (m.params.entry.level === "error" || m.params.entry.level === "warning")) {
      errors.push("LOG-" + m.params.entry.level + ": " + m.params.entry.text);
    }
  });
  await c.send("Page.enable");
  await c.send("Runtime.enable");
  await c.send("Log.enable");
  await c.send("Console.enable");
  const MOBILE = process.env.QA_MOBILE === "1";
  await c.send("Emulation.setDeviceMetricsOverride",
    MOBILE
      ? { width: 375, height: 812, deviceScaleFactor: 2, mobile: true }
      : { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });

  // let frames load + loader exit
  await sleep(3500);

  const results = [];
  for (const s of SCROLLS) {
    const evalRes = await c.send("Runtime.evaluate", {
      expression: `(() => {
        const stage = document.querySelector('[data-stage]');
        const span = stage.offsetHeight - window.innerHeight;
        window.scrollTo(0, stage.offsetTop + ${s.t} * span);
        return new Promise(r => setTimeout(() => {
          // which overlay is most visible
          const ov = [...document.querySelectorAll('[data-overlay-id]')]
            .map(e => ({ id: e.getAttribute('data-overlay-id'), op: parseFloat(getComputedStyle(e).opacity) }))
            .sort((a,b) => b.op - a.op);
          // canvas pixel variance (is it actually drawing a frame?)
          const cv = document.querySelector('canvas');
          const cx = cv.getContext('2d');
          const d = cx.getImageData(cv.width/2, cv.height/2, 8, 8).data;
          let sum=0; for(let i=0;i<d.length;i+=4){sum+=d[i]+d[i+1]+d[i+2];}
          const arrow = document.querySelector('[data-arrow]');
          r(JSON.stringify({
            top: Math.round(ov[0].op*100)/100, topId: ov[0].id,
            canvasMid: Math.round(sum/(d.length/4)),
            arrowDrawn: arrow ? arrow.getAttribute('data-drawn') : null,
            loaderGone: !!document.querySelector('[aria-hidden="true"]')
          }));
        }, 700));
      })()`,
      awaitPromise: true,
      returnByValue: true,
    });
    const info = JSON.parse(evalRes.result.value);
    const shot = await c.send("Page.captureScreenshot", { format: "jpeg", quality: 70 });
    fs.writeFileSync(`${OUT}/${MOBILE ? "m-" : ""}${s.name}.jpg`, Buffer.from(shot.data, "base64"));
    results.push({ section: s.name, ...info });
  }

  console.log(JSON.stringify({ results, errors }, null, 2));
  process.exit(0);
})().catch((e) => { console.error("HARNESS ERROR", e); process.exit(1); });
