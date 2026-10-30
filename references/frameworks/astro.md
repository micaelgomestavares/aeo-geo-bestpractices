# Astro

Detecção: existe `astro.config.mjs` / `astro.config.ts` ou `astro` no `package.json`.

O Astro gera HTML estático e envia **zero JavaScript por padrão**, então já parte de uma posição ótima para SEO, AEO, GEO e TBT. **Não use o fallback `<noscript>`**: o HTML já vem completo. Os templates continuam em [`../templates.md`](../templates.md).

---

## Onde fica cada coisa

| Item | Local |
| --- | --- |
| `<head>` (meta tags, preload, JSON-LD, `<link rel="help">`) | Layout base, normalmente `src/layouts/Layout.astro` (ou `BaseLayout.astro`) |
| Arquivos públicos (`llms.txt`, `robots.txt`, `.well-known/ard.json`) | `public/` |
| Sitemap | Integração `@astrojs/sitemap` (exige `site` no `astro.config`) ou `public/sitemap.xml` estático para incluir imagens/vídeo |
| Saída | `dist/` |

---

## SEO, AEO e GEO

```astro
---
// src/layouts/Layout.astro
const { title, description } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site);
const jsonLd = { '@context': 'https://schema.org', '@graph': [/* ... */] };
---
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="help" type="text/plain" href="/llms.txt" title="LLMs.txt — Informações estruturadas para IAs" />
    <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
  </head>
  <body><slot /></body>
</html>
```

- Defina `site: 'https://seudominio.com.br'` no `astro.config` (necessário para `Astro.site`, URLs canônicas e o sitemap).
- `<script>` com atributo `type` diferente de módulo não é processado pelo bundler, então o JSON-LD é emitido exatamente como escrito.

---

## Performance

- **LCP**: use `<Image>` ou `<Picture>` de `astro:assets` com `loading="eager"`, `fetchpriority="high"`, `widths` e `sizes` calibrados (regra do DPR 1.75 do `SKILL.md`). Adicione o `<link rel="preload" as="image">` correspondente no `<head>` do layout.
- **Ilhas**: componentes de React/Vue/Svelte só enviam JS com diretivas `client:*`. Prefira `client:visible` ou `client:idle`; use `client:load` apenas no que é interativo acima da dobra.
- **Scripts**: `<script>` sem atributos é empacotado e carregado como módulo (não bloqueia). Para o `Lenis`, faça `import('lenis')` dentro de um listener `{ once: true }` da primeira interação.
- Prefira **animações CSS** e `IntersectionObserver` a bibliotecas de animação em ilhas.

---

## Validação

```bash
node <skill>/scripts/run-lighthouse.mjs
```

O script roda `npm run build` e sobe `astro preview` na porta 4173. Se o projeto usa um adapter SSR que não suporta `astro preview`, suba o servidor do adapter e passe a URL.

