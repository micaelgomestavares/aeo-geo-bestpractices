# aeo-geo-bestpractices

> Skill para agentes de IA que deixa qualquer landing page ou app web **encontrável por buscadores e por IAs** (SEO + AEO + GEO) e mira **98–100 em todas as categorias do Google Lighthouse 13**, inclusive a nova categoria *Agentic Browsing*.

Funciona com **Claude Code**, **Cursor**, **Google Antigravity**, **Codex**, **OpenCode** e qualquer agente compatível com o padrão aberto [Agent Skills](https://agentskills.io) (`SKILL.md`).

```bash
npx skills add micaelgomestavares/aeo-geo-bestpractices
```

---

## O que a skill faz

Quando você pede ao agente algo como *"melhora o SEO desse site"*, *"quero aparecer no ChatGPT/Perplexity"*, *"cria o llms.txt"* ou *"bate 100 no Lighthouse"*, ele segue um playbook em 5 etapas:

| Etapa | O que é aplicado |
| --- | --- |
| **1. SEO técnico** | `<title>` e `description` otimizados, `canonical` + `hreflang`, Open Graph, Twitter Cards, `robots.txt` e `sitemap.xml` com imagens e vídeo. |
| **2. AEO** (*Answer Engine Optimization*) | Um único grafo `@graph` em JSON-LD conectando `WebSite`, `Person`/`Organization`, `WebPage`, `Product`, `Course`, `VideoObject` e `FAQPage`, mais um fallback `<noscript>` semântico para crawlers que não executam JavaScript. |
| **3. GEO** (*Generative Engine Optimization*) | `/llms.txt` + `<link rel="help">`, manifesto `/.well-known/ard.json` (Agent Resource Discovery v0.91) e liberação explícita de `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `Google-Extended` e outros no `robots.txt`. |
| **4. Performance e acessibilidade** | Preload do LCP com `fetchpriority="high"`, `srcSet`/`sizes` calibrados para o DPR 1.75 do Lighthouse Mobile, TBT zero (CSS na GPU + `IntersectionObserver`, `Lenis` carregado sob demanda, timers isolados) e contraste WCAG AA. |
| **5. Validação** | Script que roda o Lighthouse em **Desktop e Mobile** e lista cada auditoria que ainda não está com nota máxima. |

Antes de alterar qualquer coisa, o agente confirma o **domínio canônico** e pergunta se você quer o **FAQ visível** na página ou apenas nos dados estruturados.

---

## Instalação

### Via `skills` CLI (recomendado)

Requer [Node.js](https://nodejs.org) 18+.

```bash
# No projeto atual (o CLI pergunta para quais agentes instalar)
npx skills add micaelgomestavares/aeo-geo-bestpractices

# Global, disponível em todos os seus projetos
npx skills add micaelgomestavares/aeo-geo-bestpractices -g

# Para um agente específico
npx skills add micaelgomestavares/aeo-geo-bestpractices -a claude-code
```

Também dá para usar a URL completa:

```bash
npx skills add https://github.com/micaelgomestavares/aeo-geo-bestpractices
```

### Manual

Clone o repositório e copie a pasta para o diretório de skills do seu agente:

| Agente | Projeto | Global |
| --- | --- | --- |
| Claude Code | `.claude/skills/aeo-geo-bestpractices/` | `~/.claude/skills/aeo-geo-bestpractices/` |
| Google Antigravity / genérico | `.agents/skills/aeo-geo-bestpractices/` | `~/.gemini/config/skills/aeo-geo-bestpractices/` |

Para outros agentes, prefira o `skills` CLI, que já sabe o caminho certo de cada um.

```bash
git clone https://github.com/micaelgomestavares/aeo-geo-bestpractices.git ~/.claude/skills/aeo-geo-bestpractices
```

---

## Como usar

Depois de instalada, é só pedir em linguagem natural. O agente ativa a skill sozinho:

```text
Otimiza essa landing page para SEO, AEO e GEO e deixa ela 100 no Lighthouse.
```

```text
Cria o llms.txt e o ard.json desse site.
```

Em agentes com slash commands, você também pode chamar direto com `/aeo-geo-bestpractices`.

### Rodando o Lighthouse manualmente

O script de validação também pode ser usado sozinho:

```bash
# Projeto Vite: rode o build antes, e o script sobe o `vite preview` na porta 4173
npm run build
node <pasta-da-skill>/scripts/run-lighthouse.mjs

# Qualquer URL (local ou em produção)
node <pasta-da-skill>/scripts/run-lighthouse.mjs https://meusite.com.br
```

Ele exibe as notas de `performance`, `accessibility`, `best-practices`, `seo` e `agentic-browsing` e detalha o que falta corrigir. É preciso ter o Google Chrome instalado.

---

## Estrutura

```text
aeo-geo-bestpractices/
├── SKILL.md                  # Instruções que o agente segue
├── references/
│   └── templates.md          # Templates de JSON-LD, llms.txt, ard.json, robots.txt e sitemap.xml
└── scripts/
    └── run-lighthouse.mjs    # Lighthouse automatizado (Desktop + Mobile)
```

---

## Stacks suportadas

React, Vite, Next.js, Vue e HTML estático. As regras de SEO, AEO e GEO valem para qualquer site. As dicas de performance têm atenção especial para SPAs.

---

## Contribuindo

Issues e pull requests são bem-vindos. Se uma regra ficou desatualizada (o Lighthouse e os crawlers de IA mudam rápido), abra uma issue com o link da mudança.

---

Feito por [Micael Gomes](https://github.com/micaelgomestavares).
