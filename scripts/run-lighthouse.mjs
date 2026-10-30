#!/usr/bin/env node
import { spawn, execSync } from "node:child_process";
import { readFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const skipBuild = args.includes("--no-build");
const urlArg = args.find(a => !a.startsWith("--"));
const targetUrl = urlArg || "http://localhost:4173";
const shouldSpawnPreview = !urlArg;
const outDir = join(process.cwd(), ".lighthouse-tmp");

let server = null;
if (shouldSpawnPreview) {
  const pkgPath = join(process.cwd(), "package.json");
  const hasBuildScript =
    existsSync(pkgPath) && Boolean(JSON.parse(readFileSync(pkgPath, "utf8")).scripts?.build);
  if (hasBuildScript && !skipBuild) {
    console.log("▶ Executando build de produção (npm run build) ...");
    execSync("npm run build", { stdio: "inherit" });
  }

  console.log("▶ Subindo servidor de preview em http://localhost:4173 ...");
  server = spawn("npx", ["vite", "preview", "--port", "4173", "--strictPort"], {
    stdio: "ignore",
    shell: true,
  });
  await new Promise(r => setTimeout(r, 2200));
}

function printReportSummary(label, reportPath) {
  const report = JSON.parse(readFileSync(reportPath, "utf8"));
  const scores = Object.fromEntries(
    Object.entries(report.categories).map(([k, v]) => [k, Math.round((v.score ?? 0) * 100)])
  );
  console.log(`\n========================================`);
  console.log(`LIGHTHOUSE SCORES (${label}):`, scores);
  console.log(`========================================`);

  for (const [k, cat] of Object.entries(report.categories)) {
    if ((cat.score ?? 0) < 1) {
      console.log(`--- PENDÊNCIAS EM ${k.toUpperCase()} (${Math.round((cat.score ?? 0) * 100)}) ---`);
      for (const ref of cat.auditRefs) {
        const a = report.audits[ref.id];
        if (a && a.score !== null && a.score < 1 && (ref.weight > 0 || k !== "performance")) {
          console.log(`  [${a.id}] score=${a.score} weight=${ref.weight}: ${a.title} (${a.displayValue || ""})`);
          if (a.details?.items?.length) {
            for (const item of a.details.items.slice(0, 4)) {
              console.log("    ->", JSON.stringify(item).slice(0, 220));
            }
          }
        }
      }
    }
  }
}

try {
  mkdirSync(outDir, { recursive: true });
  const desktopJson = join(outDir, "lighthouse-desktop.json");
  const mobileJson = join(outDir, "lighthouse-mobile.json");

  console.log("▶ Executando Google Lighthouse (DESKTOP)...");
  execSync(
    `npx lighthouse "${targetUrl}" --preset=desktop --output=json --output-path="${desktopJson}" --chrome-flags="--headless=new --no-sandbox" --quiet`,
    { stdio: "inherit" }
  );
  printReportSummary("DESKTOP", desktopJson);

  console.log("\n▶ Executando Google Lighthouse (MOBILE 4G)...");
  execSync(
    `npx lighthouse "${targetUrl}" --output=json --output-path="${mobileJson}" --chrome-flags="--headless=new --no-sandbox" --quiet`,
    { stdio: "inherit" }
  );
  printReportSummary("MOBILE", mobileJson);
} finally {
  if (server) {
    server.kill();
  }
  rmSync(outDir, { recursive: true, force: true });
}

