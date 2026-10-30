# Vue (Vite) e Nuxt

Detecção:
- **Nuxt**: existe `nuxt.config.ts` / `nuxt.config.js` ou `nuxt` no `package.json`.
- **Vue + Vite (SPA)**: existe `vite.config.*` e `vue` no `package.json`, sem Nuxt.

Os templates de conteúdo (`@graph`, `llms.txt`, `ard.json`, `robots.txt`, `sitemap.xml`) continuam em [`../templates.md`](../templates.md).

---

## Vue + Vite (SPA)

Funciona como o guia [`vite-react.md`](./vite-react.md):

- Meta tags, JSON-LD e `<noscript>` direto no `index.html` da raiz (fora do `<div id="app">`).
- Arquivos públicos em `public/`; build em `dist/`.
- `@unhead/vue` (`useHead`) serve para títulos por rota no navegador, mas não substitui o HTML estático para crawlers sem JS.
- Seções pesadas abaixo da dobra: `defineAsyncComponent(() => import('./Secao.vue'))`.
- Se houver muitas rotas importantes para SEO, considere migrar para Nuxt (SSR/SSG).

---

## Nuxt 3 / 4

O Nuxt renderiza no servidor (ou pré-renderiza com `nuxi generate`), então **não use o fallback `<noscript>`**.

### Onde fica cada coisa

| Item | Local |
| --- | --- |
| `<head>` global | `app.head` no `nuxt.config.ts` |
| Meta tags por página | `useSeoMeta()` / `useHead()` dentro do `<script setup>` |
| Arquivos públicos (`llms.txt`, `robots.txt`, `sitemap.xml`, `.well-known/ard.json`) | `public/` (no Nuxt 2 era `static/`) |
| Saída | `nuxi build` → `.output/` (servidor Node) · `nuxi generate` → `.output/public/` (estático) |

### SEO, AEO e GEO

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      link: [
        { rel: 'canonical', href: 'https://seudominio.com.br/' },
        { rel: 'help', type: 'text/plain', href: '/llms.txt', title: 'LLMs.txt — Informações estruturadas para IAs' },
      ],
    },
  },
});
```

```vue
<script setup lang="ts">
useSeoMeta({
  title: 'NOME_DO_PRODUTO | NOME_DO_ESPECIALISTA — Proposta de Valor',
  description: '140–165 caracteres...',
  ogTitle: '...',
  ogDescription: '...',
  ogImage: 'https://seudominio.com.br/og-image.jpg',
  twitterCard: 'summary_large_image',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
});

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@graph': [/* ... */] }),
  }],
});
</script>
```

Para `robots.txt` e `sitemap.xml` gerados automaticamente, os módulos `@nuxtjs/robots` e `@nuxtjs/sitemap` são uma alternativa aos arquivos estáticos. Confira se a configuração final libera os crawlers de IA listados no `SKILL.md`.

### Performance

- **LCP**: com `@nuxt/image`, use `<NuxtImg>` / `<NuxtPicture>` na imagem principal com `preload`, `fetchpriority="high"`, `loading="eager"` e `sizes` calibrado (regra do DPR 1.75). Sem o módulo, use `<img>` com `srcset` e o preload via `useHead({ link: [{ rel: 'preload', as: 'image', ... }] })`.
- **Hidratação**: componentes com prefixo `Lazy` (`<LazySecaoPesada />`) saem do bundle inicial. No Nuxt 3.16+, combine com hidratação tardia (`hydrate-on-visible`, `hydrate-on-idle`).
- **Somente cliente**: widgets que não precisam de SSR (chat, mapas) em `<ClientOnly>` ou arquivos `.client.vue`.
- `Lenis`, timers e animações: mesmas regras do `SKILL.md`. Inicialize dentro de `onMounted` com import dinâmico na primeira interação.

---

## Validação

```bash
node <skill>/scripts/run-lighthouse.mjs
```

- **Vue + Vite**: roda `npm run build` e sobe `vite preview` na porta 4173.
- **Nuxt**: roda `npm run build`; se existir `.output/server/index.mjs`, sobe o servidor Node na porta 4173, senão serve `.output/public/`.

