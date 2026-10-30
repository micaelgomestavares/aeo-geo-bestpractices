# Vite + React (SPA)

Detecção: existe `vite.config.*` e `react` no `package.json`, sem Next.js nem React Router em modo framework.

Esta é a stack de referência do `SKILL.md`: todas as regras de lá se aplicam diretamente. Abaixo estão os detalhes específicos. Os templates continuam em [`../templates.md`](../templates.md).

---

## Onde fica cada coisa

| Item | Local |
| --- | --- |
| `<head>` global (meta tags, preload do LCP, JSON-LD, `<link rel="help">`, `<noscript>`) | `index.html` na raiz do projeto |
| Arquivos públicos (`llms.txt`, `robots.txt`, `sitemap.xml`, `.well-known/ard.json`) | `public/` (copiados como estão para `dist/`) |
| Saída do build | `dist/` |

---

## SEO e AEO

1. Coloque meta tags, Open Graph e o `@graph` JSON-LD **direto no `index.html`**. Tags criadas via JavaScript (`react-helmet`, `<title>` dentro de componentes no React 19) não são vistas por crawlers que não executam JS.
2. Adicione o fallback `<noscript><main>...</main></noscript>` no `index.html`, **fora** do `<div id="root">`. Não coloque HTML dentro de `#root` quando usar `createRoot().render()`: o React apaga e recria tudo no mount, atrasando o LCP.
3. **Várias rotas** (React Router em modo SPA): cada rota compartilha o mesmo `index.html`, então só a home tem meta tags reais para crawlers sem JS. Se as rotas internas importam para SEO, migre para pré-renderização:
   - React Router v7 em modo framework: `prerender: ['/', '/sobre', ...]` no `react-router.config.ts`.
   - Ou gere HTML estático por rota com um plugin de prerender para Vite.

---

## Performance

- **LCP**: `<link rel="preload" as="image" imagesrcset="..." imagesizes="..." fetchpriority="high">` nas primeiras linhas do `<head>`, com o mesmo `srcset`/`sizes` do `<img>`. Regra do DPR 1.75: largura mobile no `srcset` ≥ `ceil(largura_css × 1.8)`.
- **Code-splitting**: `React.lazy(() => import('./Secao'))` + `<Suspense>` para seções abaixo da dobra; `await import('lenis')` só na primeira interação.
- **Re-renders**: nunca deixe `setInterval` no `<App />`. Isole contadores em componentes folha.
- **Imports de imagem**: imagens em `src/` importadas no JS ganham hash e passam pelo bundler; imagens referenciadas no `index.html` para preload devem estar em `public/` para o caminho ser estável.

---

## Validação

```bash
node <skill>/scripts/run-lighthouse.mjs
```

O script roda `npm run build` e sobe `vite preview` na porta 4173.

