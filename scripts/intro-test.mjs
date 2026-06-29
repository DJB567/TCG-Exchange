// Interaction test for the click-to-open intro: screenshots the closed ball,
// clicks it, waits for the open animation, then verifies world + scroll + replay.
import fs from "node:fs";
const BASE = process.env.QA_URL || "http://localhost:3000";
const MOBILE = process.env.QA_MOBILE === "1";
const PRE = MOBILE ? "mi-" : "i-";
const OUT = "/tmp/qa";
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const target = await (
  await fetch(`http://localhost:9222/json/new?${encodeURIComponent(BASE)}`, {
    method: "PUT",
  })
).json();

const ws = new WebSocket(target.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
ws.addEventListener("message", (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m);
    pending.delete(m.id);
  }
});
await new Promise((r) => ws.addEventListener("open", () => r()));
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const mid = ++id;
    pending.set(mid, (m) =>
      m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result),
    );
    ws.send(JSON.stringify({ id: mid, method, params }));
  });

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", MOBILE
  ? { width: 390, height: 844, deviceScaleFactor: 2, mobile: true }
  : { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });

const shot = async (name) => {
  const { data } = await send("Page.captureScreenshot", { format: "jpeg", quality: 80 });
  fs.writeFileSync(`${OUT}/${PRE}${name}.jpg`, Buffer.from(data, "base64"));
  console.log("shot", PRE + name);
};
const evals = (expr) => send("Runtime.evaluate", { expression: expr, returnByValue: true });

await sleep(4000); // loader + critical frames
await shot("00-closed");

// click the center of the ball
const phaseClosed = (await evals("document.querySelector('main').textContent.includes('open')")).result.value;
await evals("document.querySelector('.intro-hit')?.click()");
await sleep(2600); // open animation (~2s) + settle
await shot("01-opened");

// scroll is now unlocked — jump partway in to a content section
const locked = (await evals("getComputedStyle(document.documentElement).overflow")).result.value;
await evals("window.scrollTo(0, document.querySelector('[data-stage]').offsetHeight * 0.36)");
await sleep(700);
await shot("02-section");

// replay via the header logo
await evals("window.scrollTo(0,0); document.querySelector('header a')?.click()");
await sleep(700);
await shot("03-replayed");

console.log(JSON.stringify({ promptHadOpenText: phaseClosed, overflowAfterOpen: locked }));
ws.close();
