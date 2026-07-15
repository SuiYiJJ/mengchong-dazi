import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the 萌宠搭子 product shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>文心一言｜萌宠搭子<\/title>/i);
  assert.match(html, /你好，今天有什么我能帮你的/);
  assert.match(html, /让一只 AI 萌宠理解你，替你轻松破冰/);
  assert.match(html, /轻量 AI 社交功能/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("keeps the prototype client-only and responsive", async () => {
  const [page, css, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /^"use client"/);
  assert.match(page, /文心入口/);
  assert.match(page, /附近搭子/);
  assert.match(page, /百度地图/);
  assert.match(page, /萌宠领养所/);
  assert.match(page, /pet-presets-3d-plus\.png/);
  assert.doesNotMatch(page, /fetch\(|\/api\//);
  assert.match(css, /@media \(max-width: 820px\)/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(layout, /lang="zh-CN"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
