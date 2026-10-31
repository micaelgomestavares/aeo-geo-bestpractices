<p align="center">
  <a href="./README.md"><img src="https://flagcdn.com/24x18/us.png" width="24" height="18" alt="" /> <b>English</b></a>
  &nbsp;&middot;&nbsp;
  <a href="./README.pt-BR.md"><img src="https://flagcdn.com/24x18/br.png" width="24" height="18" alt="" /> Português</a>
</p>

<p align="center">
  <img src="./assets/banner.png" alt="aeo-geo-bestpractices — SEO · AEO · GEO · Lighthouse 100" width="100%" />
</p>

<p align="center">
  <a href="https://github.com/micaelgomestavares/aeo-geo-bestpractices/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License" /></a>
  <a href="https://agentskills.io"><img src="https://img.shields.io/badge/Agent_Skills-standard-black.svg" alt="Agent Skills" /></a>
  <a href="https://developer.chrome.com/docs/lighthouse"><img src="https://img.shields.io/badge/Lighthouse-100%2F100-success.svg?logo=lighthouse" alt="Lighthouse 100" /></a>
  <a href="https://github.com/micaelgomestavares/aeo-geo-bestpractices/stargazers"><img src="https://img.shields.io/github/stars/micaelgomestavares/aeo-geo-bestpractices?style=flat" alt="GitHub Stars" /></a>
  <a href="https://github.com/micaelgomestavares/aeo-geo-bestpractices/issues"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" /></a>
</p>

# aeo-geo-bestpractices

> An AI agent skill that makes any landing page or web app **discoverable by search engines and AI assistants** (SEO + AEO + GEO) and targets **98–100 in every Google Lighthouse 13 category**, including the new *Agentic Browsing* category.

Works with **Claude Code**, **Cursor**, **Google Antigravity**, **Codex**, **OpenCode** and any agent that supports the open [Agent Skills](https://agentskills.io) standard (`SKILL.md`).

```bash
npx skills add micaelgomestavares/aeo-geo-bestpractices
```

> [!NOTE]
> The agent instructions (`SKILL.md` and guides) are written in Brazilian Portuguese. Agents read them without issues and reply in whatever language you use.

---

## What it does

When you ask your agent something like *"improve this site's SEO"*, *"I want to show up on ChatGPT/Perplexity"*, *"create the llms.txt"* or *"get 100 on Lighthouse"*, it follows a 5-step playbook:

| Step | What gets applied |
| --- | --- |
| **1. Technical SEO** | Optimized `<title>` and `description`, `canonical` + `hreflang`, Open Graph, Twitter Cards, `robots.txt` and `sitemap.xml` with image and video entries. |
| **2. AEO** (*Answer Engine Optimization*) | A single JSON-LD `@graph` connecting `WebSite`, `Person`/`Organization`, `WebPage`, `Product`, `Course`, `VideoObject` and `FAQPage`, plus a semantic `<noscript>` fallback for crawlers that don't run JavaScript. |
| **3. GEO** (*Generative Engine Optimization*) | `/llms.txt` + `<link rel="help">`, a `/.well-known/ard.json` manifest (Agent Resource Discovery v0.91), and a `robots.txt` choice: allow `OAI-SearchBot` and `Claude-SearchBot` for search while either allowing or blocking `GPTBot` and `ClaudeBot` for potential model training. Other providers' controls remain separate. |
| **4. Performance & accessibility** | LCP preload with `fetchpriority="high"`, `srcSet`/`sizes` tuned for Lighthouse Mobile's 1.75 DPR, zero TBT (GPU CSS + `IntersectionObserver`, on-demand `Lenis`, isolated timers) and WCAG AA contrast. |
| **5. Validation** | A script that runs Lighthouse on **Desktop and Mobile** and lists every audit that isn't at full score yet. |

Before changing anything, the agent confirms your **canonical domain** and asks whether you want the **FAQ visible** on the page or only in the structured data. When creating or changing `robots.txt`, it also checks your preference for OpenAI and Anthropic training crawlers.

---

## Installation

### With the `skills` CLI (recommended)

Requires [Node.js](https://nodejs.org) 18+.

```bash
# Current project (the CLI asks which agents to install for)
npx skills add micaelgomestavares/aeo-geo-bestpractices

# Global, available in all your projects
npx skills add micaelgomestavares/aeo-geo-bestpractices -g

# For a specific agent
npx skills add micaelgomestavares/aeo-geo-bestpractices -a claude-code
```

The full URL works too:

```bash
npx skills add https://github.com/micaelgomestavares/aeo-geo-bestpractices
```

### Manual

Clone the repository into your agent's skills directory:

| Agent | Project | Global |
| --- | --- | --- |
| Claude Code | `.claude/skills/aeo-geo-bestpractices/` | `~/.claude/skills/aeo-geo-bestpractices/` |
| Google Antigravity / generic | `.agents/skills/aeo-geo-bestpractices/` | `~/.gemini/config/skills/aeo-geo-bestpractices/` |

For other agents, prefer the `skills` CLI, which knows the right path for each one.

```bash
git clone https://github.com/micaelgomestavares/aeo-geo-bestpractices.git ~/.claude/skills/aeo-geo-bestpractices
```

---

## Usage

Once installed, just ask in plain language (or use `/aeo-geo-bestpractices`). Here are **3 recommended prompts** to get the best results:

#### 1. Quick Audit (Inspection only)
```text
Audit this project using the aeo-geo-bestpractices skill. List the current critical gaps for SEO, AEO, GEO and Lighthouse performance before making any changes.
```

#### 2. Full Optimization (Production-ready)
```text
Apply the complete aeo-geo-bestpractices playbook to this project. Keep the visual design intact, configure the connected @graph JSON-LD, create llms.txt and ard.json, and tune image preloads.
```

#### 3. Lighthouse Validation & Benchmark
```text
Run the automated Lighthouse validation script for both mobile and desktop. Report any audit scoring below 100 and fix pending issues.
```

### Running Lighthouse manually

The validation script also works on its own:

```bash
# Detects the stack, runs `npm run build` and starts a preview server on port 4173
node <skill-folder>/scripts/run-lighthouse.mjs

# Skip the build (when the build output is already up to date)
node <skill-folder>/scripts/run-lighthouse.mjs --no-build

# Force the stack: angular | next | nuxt | astro | vite | static
node <skill-folder>/scripts/run-lighthouse.mjs --stack=angular

# Any URL (local or production)
node <skill-folder>/scripts/run-lighthouse.mjs https://mysite.com
```

It prints the `performance`, `accessibility`, `best-practices`, `seo` and `agentic-browsing` scores and details what's left to fix. Google Chrome must be installed.

---

## Structure

```text
aeo-geo-bestpractices/
├── SKILL.md                  # Instructions the agent follows
├── assets/                   # Project banner and visual identity
├── references/
│   ├── templates.md          # JSON-LD, llms.txt, ard.json, robots.txt and sitemap.xml templates
│   └── frameworks/           # Stack-specific guides (Angular, Next.js, Nuxt, Astro...)
└── scripts/
    └── run-lighthouse.mjs    # Automated Lighthouse (Desktop + Mobile)
```

---

## Supported stacks

The SEO, AEO and GEO rules apply to any website. The agent detects your project's stack and follows its guide, which covers where the `<head>` and public folder live, prerendering, images, TBT and the preview command:

| Stack | Guide | Preview in the script |
| --- | --- | --- |
| Angular 17+ | [angular.md](./references/frameworks/angular.md) | `serve dist/<project>/browser` |
| Next.js (App and Pages Router) | [nextjs.md](./references/frameworks/nextjs.md) | `next start` or `serve out/` |
| Nuxt 3/4 and Vue + Vite | [vue-nuxt.md](./references/frameworks/vue-nuxt.md) | Nuxt server or `vite preview` |
| Astro | [astro.md](./references/frameworks/astro.md) | `astro preview` |
| Vite + React | [vite-react.md](./references/frameworks/vite-react.md) | `vite preview` |
| Static HTML | [html-estatico.md](./references/frameworks/html-estatico.md) | `serve .` |

Using another stack (SvelteKit, Remix, Gatsby...)? The agent applies the general rules using the closest guide. New guides are welcome: create `references/frameworks/<stack>.md` following the existing format and add a row to the table in `SKILL.md`.

---

## Contributing

Issues and pull requests are welcome. If a rule is out of date (Lighthouse and AI crawlers change fast), open an issue with a link to the change.

---

## License

[MIT](./LICENSE). Free to use, modify and redistribute.

---

Made by [Micael Gomes](https://github.com/micaelgomestavares).
