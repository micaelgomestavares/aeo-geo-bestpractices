#!/usr/bin/env node
/**
 * Executa o Google Lighthouse (Desktop + Mobile) e lista as auditorias pendentes.
 *
 * Uso:
 *   node run-lighthouse.mjs                    # detecta a stack, faz build e sobe o preview
 *   node run-lighthouse.mjs --no-build         # pula o build
 *   node run-lighthouse.mjs --stack=angular    # força a stack (angular|next|nuxt|astro|vite|static)
 *   node run-lighthouse.mjs https://site.com   # testa uma URL, sem build nem preview
 */
import { spawn, execSync } from "node:child_process";
import { readFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";

const PORT = 4173;
const cwd = process.cwd();
const args = process.argv.slice(2);
const skipBuild = args.includes("--no-build");
const stackArg = args.find(a => a.startsWith("--stack="))?.split("=")[1];
const urlArg = args.find(a => !a.startsWith("--"));
const targetUrl = urlArg || `http://localhost:${PORT}`;
const outDir = join(cwd, ".lighthouse-tmp");

const readJson = path => {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
};

const pkg = readJson(join(cwd, "package.json"));
const deps = { ...pkg?.dependencies, ...pkg?.devDependencies };
const hasFile = (...names) => names.some(n => existsSync(join(cwd, n)));

function detectStack() {
  if (stackArg) return stackArg;
  if (hasFile("angular.json") || deps["@angular/core"]) return "angular";
  if (hasFile("next.config.js", "next.config.mjs", "next.config.ts") || deps.next) return "next";
  if (hasFile("nuxt.config.ts", "nuxt.config.js") || deps.nuxt) return "nuxt";
  if (hasFile("astro.config.mjs", "astro.config.ts", "astro.config.js") || deps.astro) return "astro";
  if (hasFile("vite.config.ts", "vite.config.js", "vite.config.mjs") || deps.vite) return "vite";
  if (hasFile("index.html")) return "static";
  return null;
}

/** Pasta de saída do Angular: dist/<projeto>/browser (builder application) ou dist/<projeto>. */
function angularOutputDir() {
  const ng = readJson(join(cwd, "angular.json"));
  const name = ng?.defaultProject || Object.keys(ng?.projects ?? {})[0];
  const opt = ng?.projects?.[name]?.architect?.build?.options?.outputPath;
  const base = typeof opt === "string" ? opt : opt?.base || join("dist", name ?? "");
  const browser = typeof opt === "object" && opt?.browser !== undefined ? opt.browser : "browser";
  const withBrowser = join(cwd, base, browser);
  return existsSync(withBrowser) ? withBrowser : join(cwd, base);
}

const serveStatic = dir => ({ cmd: `npx --yes serve "${dir}" -l ${PORT}` });

/** Comando que sobe o servidor de preview para cada stack (avaliado depois do build). */
function previewCommand(stack) {
  switch (stack) {
    case "angular":
      return serveStatic(angularOutputDir());
    case "next":
      return existsSync(join(cwd, "out")) ? serveStatic(join(cwd, "out")) : { cmd: `npx next start -p ${PORT}` };
    case "nuxt":
      return existsSync(join(cwd, ".output", "server", "index.mjs"))
        ? { cmd: "node .output/server/index.mjs", env: { PORT: String(PORT), NITRO_PORT: String(PORT) } }
        : serveStatic(join(cwd, ".output", "public"));
    case "astro":
      return { cmd: `npx astro preview --port ${PORT}` };
    case "vite":
      return { cmd: `npx vite preview --port ${PORT} --strictPort` };
    case "static":
      return serveStatic(cwd);
    default:
      return null;
  }
}

async function waitForServer(url, timeoutMs = 90_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.status < 500) return;
    } catch {
      // servidor ainda subindo
    }
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error(`O servidor não respondeu em ${url} após ${timeoutMs / 1000}s.`);
}

function killServer(proc) {
  if (!proc?.pid) return;
  if (process.platform === "win32") {
    try {
      execSync(`taskkill /pid ${proc.pid} /T /F`, { stdio: "ignore" });
    } catch {
      // processo já encerrado
    }
  } else {
    proc.kill("SIGTERM");
  }
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

let server = null;
try {
  if (!urlArg) {
    const stack = detectStack();
    if (!stack) {
      throw new Error(
        "Não foi possível detectar a stack. Use --stack=<angular|next|nuxt|astro|vite|static> ou passe uma URL."
      );
    }
    console.log(`▶ Stack detectada: ${stack}`);

    if (pkg?.scripts?.build && !skipBuild && stack !== "static") {
      console.log("▶ Executando build de produção (npm run build) ...");
      execSync("npm run build", { stdio: "inherit" });
    }

    const preview = previewCommand(stack);
    if (!preview) throw new Error(`Stack desconhecida: ${stack}`);
    console.log(`▶ Subindo servidor de preview: ${preview.cmd}`);
    server = spawn(preview.cmd, {
      stdio: "ignore",
      shell: true,
      env: { ...process.env, ...preview.env },
    });
    await waitForServer(targetUrl);
  }

  mkdirSync(outDir, { recursive: true });
  const desktopJson = join(outDir, "lighthouse-desktop.json");
  const mobileJson = join(outDir, "lighthouse-mobile.json");

  console.log(`▶ Executando Google Lighthouse (DESKTOP) em ${targetUrl} ...`);
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
} catch (err) {
  console.error(`\n✖ ${err.message}`);
  process.exitCode = 1;
} finally {
  killServer(server);
  rmSync(outDir, { recursive: true, force: true });
}
