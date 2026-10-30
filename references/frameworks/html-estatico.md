# HTML estático (sem framework)

Detecção: existe `index.html` na raiz e não há `package.json` com framework conhecido (ou não há `package.json`).

É o cenário mais simples: o HTML já chega completo para qualquer crawler. **Não use o fallback `<noscript>`**. Copie os templates de [`../templates.md`](../templates.md) praticamente como estão.

---

## Onde fica cada coisa

| Item | Local |
| --- | --- |
| `<head>` (meta tags, preload, JSON-LD, `<link rel="help">`) | Em **cada** `.html` (cada página tem seu `title`, `description`, `canonical` e `WebPage` no `@graph`) |
| `llms.txt`, `robots.txt`, `sitemap.xml` | Raiz do site publicado |
| `ard.json` | `.well-known/ard.json` na raiz do site publicado |

### Cuidado com a pasta `.well-known` na hospedagem

- **GitHub Pages**: o Jekyll ignora pastas que começam com ponto. Crie um arquivo vazio `.nojekyll` na raiz do site para `.well-known/` ser publicada.
- **Apache / Nginx / hospedagens compartilhadas**: confirme que `https://seudominio.com.br/.well-known/ard.json` responde `200` com `Content-Type: application/json`, e `/llms.txt` com `text/plain`.
- **Netlify, Vercel, Cloudflare Pages**: servem `.well-known/` normalmente.

---

## Performance

- **LCP**: `<link rel="preload" as="image" imagesrcset="..." imagesizes="..." fetchpriority="high">` nas primeiras linhas do `<head>`. Na imagem, use `<picture>` com AVIF/WebP, `srcset`/`sizes` calibrados (regra do DPR 1.75) e `fetchpriority="high"`. Nas demais imagens, `loading="lazy"` e `decoding="async"`, sempre com `width` e `height` para evitar CLS.
- **CSS**: incorpore o CSS crítico (acima da dobra) em um `<style>` no `<head>` e carregue o restante normalmente. Evite `@import` em cascata.
- **JavaScript**: todo `<script>` com `defer` ou `type="module"`. Bibliotecas como `Lenis` via `import()` dinâmico na primeira interação.
- **Fontes**: `font-display: swap`; hospede as fontes no próprio domínio quando possível.
- Sem bundler, minifique HTML/CSS/JS manualmente ou na hospedagem (a maioria das CDNs já comprime com Brotli/Gzip).

---

## Validação

```bash
node <skill>/scripts/run-lighthouse.mjs
```

Sem `package.json` com script de build, o script serve a pasta atual em `http://localhost:4173` (via `npx serve`) e roda o Lighthouse. Se os arquivos do site estiverem em uma subpasta (ex.: `site/`), rode o comando de dentro dela ou passe a URL publicada.

