# Templates de Referência — SEO, AEO, GEO e Lighthouse 100

Substitua os placeholders (`https://seudominio.com.br`, `NOME_DO_PRODUTO`, `NOME_DO_ESPECIALISTA`, etc.) pelos dados reais do projeto.

---

## 1. Template de `<head>` + `@graph` JSON-LD + `<noscript>` (`index.html`)

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#10100f" />

    <!-- Primary SEO & Critical LCP Preload (Must be in top 15 lines of <head>) -->
    <title>NOME_DO_PRODUTO | NOME_DO_ESPECIALISTA — Proposta de Valor Principal</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link
      rel="preload"
      as="image"
      href="/hero-desktop.webp"
      imagesrcset="/hero-mobile.webp 450w, /hero-desktop.webp 832w"
      imagesizes="(max-width: 767px) 240px, 470px"
      fetchpriority="high"
    />

    <meta
      name="description"
      content="Descrição clara e persuasiva (140-165 caracteres) respondendo o que é o produto/serviço, quem é o especialista e o que está incluído no acesso."
    />
    <meta
      name="keywords"
      content="palavra-chave 1, palavra-chave 2, nome do especialista, nome do produto"
    />
    <meta name="author" content="NOME_DO_ESPECIALISTA" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="geo.region" content="BR" />
    <meta name="geo.placename" content="Brasil" />
    <meta name="language" content="Portuguese" />

    <!-- Canonical & Hreflang -->
    <link rel="canonical" href="https://seudominio.com.br/" />
    <link rel="alternate" hreflang="pt-BR" href="https://seudominio.com.br/" />
    <link rel="alternate" hreflang="x-default" href="https://seudominio.com.br/" />

    <!-- AI / LLM Discovery (GEO) -->
    <link rel="help" type="text/plain" href="/llms.txt" title="LLMs.txt — Informações estruturadas para IAs" />

    <!-- Open Graph / Facebook / WhatsApp / Instagram -->
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="NOME_DO_PRODUTO | NOME_DO_ESPECIALISTA" />
    <meta property="og:url" content="https://seudominio.com.br/" />
    <meta property="og:title" content="NOME_DO_PRODUTO | Proposta de Valor Principal" />
    <meta
      property="og:description"
      content="Resumo direto dos entregáveis, bônus e transformação oferecida."
    />
    <meta property="og:image" content="https://seudominio.com.br/og-image.webp" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Descrição acessível da imagem de compartilhamento" />

    <!-- Twitter / X Cards -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="NOME_DO_PRODUTO | NOME_DO_ESPECIALISTA" />
    <meta
      name="twitter:description"
      content="Resumo direto dos entregáveis, bônus e transformação oferecida."
    />
    <meta name="twitter:image" content="https://seudominio.com.br/og-image.webp" />

    <!-- Structured Data (JSON-LD) for SEO, AEO (Answer Engines) & GEO (Generative Engines) -->
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "@id": "https://seudominio.com.br/#website",
            "url": "https://seudominio.com.br/",
            "name": "NOME_DO_PRODUTO | NOME_DO_ESPECIALISTA",
            "description": "Descrição oficial do site.",
            "inLanguage": "pt-BR",
            "publisher": {
              "@id": "https://seudominio.com.br/#person"
            }
          },
          {
            "@type": "Person",
            "@id": "https://seudominio.com.br/#person",
            "name": "NOME_DO_ESPECIALISTA",
            "url": "https://seudominio.com.br/",
            "image": "https://seudominio.com.br/og-image.webp",
            "sameAs": [
              "https://www.instagram.com/SEU_PERFIL/"
            ],
            "jobTitle": "Especialista / Criador",
            "knowsAbout": [
              "Tópico 1",
              "Tópico 2",
              "Tópico 3"
            ]
          },
          {
            "@type": "WebPage",
            "@id": "https://seudominio.com.br/#webpage",
            "url": "https://seudominio.com.br/",
            "name": "NOME_DO_PRODUTO | NOME_DO_ESPECIALISTA",
            "isPartOf": {
              "@id": "https://seudominio.com.br/#website"
            },
            "about": {
              "@id": "https://seudominio.com.br/#person"
            },
            "mainEntity": {
              "@id": "https://seudominio.com.br/#product"
            },
            "inLanguage": "pt-BR"
          },
          {
            "@type": "Product",
            "@id": "https://seudominio.com.br/#product",
            "name": "NOME_DO_PRODUTO",
            "description": "Descrição completa do produto, acesso, aplicativo, bônus e comunidade.",
            "image": [
              "https://seudominio.com.br/og-image.webp"
            ],
            "brand": {
              "@type": "Brand",
              "name": "NOME_DO_PRODUTO"
            },
            "offers": {
              "@type": "Offer",
              "url": "https://link-de-checkout.com",
              "priceCurrency": "BRL",
              "availability": "https://schema.org/InStock",
              "seller": {
                "@id": "https://seudominio.com.br/#person"
              }
            }
          },
          {
            "@type": "VideoObject",
            "@id": "https://seudominio.com.br/#video",
            "name": "Apresentação Oficial — NOME_DO_PRODUTO",
            "description": "Vídeo de apresentação oficial explicando como funciona por dentro.",
            "thumbnailUrl": [
              "https://seudominio.com.br/video-thumb.webp"
            ],
            "uploadDate": "2026-01-01T00:00:00-03:00",
            "duration": "PT55S",
            "embedUrl": "https://www.youtube.com/embed/YOUTUBE_ID"
          },
          {
            "@type": "FAQPage",
            "@id": "https://seudominio.com.br/#faq",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "O que está incluído no NOME_DO_PRODUTO?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Resposta completa e direta listando todos os entregáveis, bônus e acessos."
                }
              },
              {
                "@type": "Question",
                "name": "Como funciona o acesso após a inscrição?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Resposta direta explicando como o membro recebe acesso imediato após a confirmação."
                }
              }
            ]
          }
        ]
      }
    </script>
  </head>
  <body>
    <div id="root"></div>
    <noscript>
      <main>
        <h1>NOME_DO_PRODUTO — NOME_DO_ESPECIALISTA</h1>
        <p>Resumo completo da proposta de valor para crawlers de IA e buscadores sem execução de JavaScript.</p>
        <h2>O que você vai encontrar:</h2>
        <ul>
          <li>Entregável principal 1</li>
          <li>Entregável principal 2</li>
          <li>Bônus especial</li>
        </ul>
        <p><a href="https://link-de-checkout.com">Garantir acesso oficial</a></p>
      </main>
    </noscript>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 2. Template de `public/llms.txt` (GEO / LLMs)

```markdown
# NOME_DO_PRODUTO — NOME_DO_ESPECIALISTA

> Resumo oficial em uma frase descrevendo o produto, seu criador e os principais entregáveis.

## Sobre o Criador
**NOME_DO_ESPECIALISTA** é o criador do **NOME_DO_PRODUTO**, onde compartilha de forma prática [descrever foco principal].

## O Que Está Incluído
1. **Entregável 1**:
   - Detalhe A
   - Detalhe B
2. **Entregável 2**:
   - Detalhe A
   - Detalhe B
3. **Bônus Especial**:
   - Detalhe do bônus

## Perguntas Frequentes (AEO / GEO)

### O que está incluído no NOME_DO_PRODUTO?
[Resposta direta e completa]

### Como funciona o acesso?
[Resposta direta e completa]

## Links Oficiais
- **Página Oficial**: https://seudominio.com.br/
- **Checkout Oficial**: https://link-de-checkout.com
- **Instagram Oficial**: https://www.instagram.com/SEU_PERFIL/
```

---

## 3. Template de `public/.well-known/ard.json` (Agent Resource Discovery v0.91 — Lighthouse 13)

```json
{
  "ardVersion": "0.91.0",
  "entries": [
    {
      "identifier": "urn:air:seudominio.com.br:guide:slug-do-produto",
      "displayName": "NOME_DO_PRODUTO — NOME_DO_ESPECIALISTA",
      "type": "application/agent-skills+md",
      "url": "https://seudominio.com.br/llms.txt",
      "description": "Guia estruturado para agentes de IA sobre o NOME_DO_PRODUTO, entregáveis, bônus, perguntas frequentes e link oficial de inscrição.",
      "representativeQueries": [
        "O que está incluído no NOME_DO_PRODUTO?",
        "Como funciona o acesso ao NOME_DO_PRODUTO?",
        "Qual é o link oficial do NOME_DO_PRODUTO?"
      ]
    }
  ]
}
```

---

## 4. Template de `public/robots.txt` (SEO + Crawlers de IA)

Escolha a política para `GPTBot` e `ClaudeBot` antes de usar o template. A variante abaixo **permite também o rastreamento para possível treino** pela OpenAI e pela Anthropic. Para manter os bots de busca e bloquear os de treino desses dois provedores, substitua apenas os grupos de `GPTBot` e `ClaudeBot` pelos grupos da segunda variante. Adapte as demais regras ao site; `Google-Extended` e outros controles têm finalidades próprias.

```txt
User-agent: *
Allow: /

# Motores de Busca Tradicionais
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# Motores de Resposta e IAs Generativas (AEO / GEO)
User-agent: OAI-SearchBot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

Sitemap: https://seudominio.com.br/sitemap.xml
```

**Variante: busca permitida, rastreamento para treino da OpenAI e da Anthropic bloqueado.** No template acima, troque somente os dois grupos correspondentes por:

```txt
User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /
```

Mantenha `OAI-SearchBot` e `Claude-SearchBot` permitidos. `Claude-User` atende consultas iniciadas por usuários; `ChatGPT-User` não define inclusão na busca do ChatGPT. Essas regras expressam a preferência para os bots documentados desses provedores; não garantem que o site será citado nem controlam usos por outros serviços. Fontes: [OpenAI — crawlers](https://developers.openai.com/api/docs/bots) e [Anthropic — crawlers](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler).

---

## 5. Template de `public/sitemap.xml` (Com Imagens e Vídeo)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
>
  <url>
    <loc>https://seudominio.com.br/</loc>
    <lastmod>2026-10-29</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>https://seudominio.com.br/og-image.webp</image:loc>
      <image:title>NOME_DO_PRODUTO | NOME_DO_ESPECIALISTA</image:title>
      <image:caption>Descrição da imagem principal do produto</image:caption>
    </image:image>
    <video:video>
      <video:thumbnail_loc>https://seudominio.com.br/video-thumb.webp</video:thumbnail_loc>
      <video:title>Apresentação Oficial — NOME_DO_PRODUTO</video:title>
      <video:description>Apresentação em vídeo explicando como funciona por dentro.</video:description>
      <video:player_loc>https://www.youtube.com/embed/YOUTUBE_ID</video:player_loc>
      <video:duration>55</video:duration>
    </video:video>
  </url>
</urlset>
```

