// Verifies the section snap: clicks the ball, then sends wheel "flicks" and
// checks the page eases to each successive section target.
import fs from "node:fs";
const BASE = process.env.QA_URL || "http://localhost:3000";
const OUT = "/tmp/qa";
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const t = await (await fetch(`http://localhost:9222/json/new?${encodeURIComponent(BASE)}`, { method: "PUT" })).json();
const ws = new WebSocket(t.webSocketDebuggerUrl);
let id = 0; const p = new Map();
ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && p.has(m.id)) { p.get(m.id)(m); p.delete(m.id); } });
await new Promise((r) => ws.addEventListener("open", () => r()));
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; p.set(i, (m) => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = (expr) => send("Runtime.evaluate", { expression: expr, returnByValue: true }).then((r) => r.result.value);
const shot = async (n) => { const { data } = await send("Page.captureScreenshot", { format: "jpeg", quality: 80 }); fs.writeFileSync(`${OUT}/s-${n}.jpg`, Buffer.from(data, "base64")); console.log("shot", n); };
const wheel = () => send("Input.dispatchMouseEvent", { type: "mouseWheel", x: 640, y: 400, deltaX: 0, deltaY: 120 });

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
await sleep(4000);
await shot("00-closed"); // check white ring + lower label

await ev("document.querySelector('.intro-hit')?.click()");
await sleep(2600); // open animation
const span = await ev("document.querySelector('[data-stage]').offsetHeight - innerHeight");
const targets = [0, 0.23, 0.41, 0.61, 0.805, 0.945].map((c) => Math.round(c * span));
console.log("span", span, "section targets", targets);

const ys = [Math.round(await ev("scrollY"))];
for (let i = 0; i < 3; i++) {
  await wheel();
  await sleep(900);
  ys.push(Math.round(await ev("scrollY")));
}
console.log("scrollY after each flick:", ys);
await shot("01-after-flicks");

// each flick should land near the next section target
const ok = ys.slice(1).every((y, i) => Math.abs(y - targets[i + 1]) < span * 0.04);
console.log(JSON.stringify({ snapWorks: ok, expected: targets.slice(1, 4), got: ys.slice(1) }));
ws.close();
