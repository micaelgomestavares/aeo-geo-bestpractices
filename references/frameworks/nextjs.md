# Next.js (App Router e Pages Router)

Detecção: existe `next.config.js` / `next.config.mjs` / `next.config.ts` ou `next` no `package.json`.

Aplique as etapas do `SKILL.md` com as adaptações abaixo. Os templates de conteúdo (`@graph`, `llms.txt`, `ard.json`, `robots.txt`, `sitemap.xml`) continuam em [`../templates.md`](../templates.md).

> O Next.js já entrega HTML renderizado no servidor (SSR/SSG). **Não use o fallback `<noscript>`**: os crawlers de IA já recebem o conteúdo completo.

---

## Onde fica cada coisa

| Item | App Router (`app/`) | Pages Router (`pages/`) |
| --- | --- | --- |
| Meta tags / Open Graph | `export const metadata` ou `generateMetadata()` em `layout.tsx` / `page.tsx` | `<Head>` de `next/head` em cada página |
| `robots.txt` | `app/robots.ts` ou `public/robots.txt` | `public/robots.txt` |
| `sitemap.xml` | `app/sitemap.ts` ou `public/sitemap.xml` | `public/sitemap.xml` |
| `llms.txt` e `.well-known/ard.json` | `public/llms.txt` e `public/.well-known/ard.json` | igual |

---

## SEO

```tsx
// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://seudominio.com.br'),
  title: 'NOME_DO_PRODUTO | NOME_DO_ESPECIALISTA — Proposta de Valor',
  description: '140–165 caracteres respondendo o que é, para quem é e o que inclui.',
  alternates: { canonical: '/', languages: { 'pt-BR': '/', 'x-default': '/' } },
  robots: {
    index: true,
    follow: true,
    googleBot: { 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'NOME_DO_PRODUTO',
    url: '/',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: '...' }],
  },
  twitter: { card: 'summary_large_image' },
};
```

`robots.ts` liberando os crawlers de IA:

```ts
// app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const aiBots = ['OAI-SearchBot', 'GPTBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot',
    'anthropic-ai', 'Google-Extended', 'Applebot-Extended'];
  return {
    rules: [{ userAgent: '*', allow: '/' }, ...aiBots.map(userAgent => ({ userAgent, allow: '/' }))],
    sitemap: 'https://seudominio.com.br/sitemap.xml',
  };
}
```

Para sitemap com imagens/vídeo (namespaces `image:` e `video:`), o `public/sitemap.xml` estático do template é o caminho mais simples. O `app/sitemap.ts` também aceita os campos `images` e `videos` nas versões recentes.

## AEO: JSON-LD `@graph`

Renderize o grafo como `<script>` no `page.tsx` (ou no `layout.tsx` para entidades globais), escapando `<`:

```tsx
export default function Page() {
  const jsonLd = { '@context': 'https://schema.org', '@graph': [/* ... */] };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      {/* conteúdo */}
    </>
  );
}
```

## GEO: `<link rel="help">` para o `llms.txt`

O objeto `metadata` não tem campo para isso. Renderize o `<link>` no `layout.tsx` raiz (o React 19 move `<link>` para o `<head>` automaticamente):

```tsx
<link rel="help" type="text/plain" href="/llms.txt" title="LLMs.txt — Informações estruturadas para IAs" />
```

---

## Performance

### LCP

- Use `next/image` na imagem principal com `sizes` correto. O Next gera o `srcset` sozinho (a partir de `deviceSizes`/`imageSizes`), então o problema do DPR 1.75 se resolve desde que o `sizes` reflita a largura real em CSS.
- Marque a imagem LCP como prioritária: `priority` (Next ≤ 15) ou `preload` (Next 16+, onde `priority` foi descontinuado). Isso gera o preload com `fetchpriority="high"`.
- Fontes com `next/font` (self-hosted, `display: 'swap'` por padrão). Não adicione `<link rel="preload">` manual de fontes.

### TBT zero

- Mantenha a página como **Server Component** e use `'use client'` só nas folhas interativas. Cada componente cliente vira JS a hidratar.
- Componentes pesados abaixo da dobra: `next/dynamic` (`dynamic(() => import('./Pesado'))`).
- Scripts de terceiros (pixel, analytics, chat): `next/script` com `strategy="lazyOnload"` (ou `afterInteractive` quando necessário).
- `Lenis`, contadores e animações: mesmas regras do `SKILL.md` (import dinâmico na primeira interação, timer isolado em componente folha, animações CSS).

---

## Validação

```bash
node <skill>/scripts/run-lighthouse.mjs
```

O script detecta o Next, roda `npm run build` e sobe `next start` na porta 4173. Com `output: 'export'`, ele serve a pasta `out/` como site estático.

