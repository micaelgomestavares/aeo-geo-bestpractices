# Angular (17+)

Detecção: existe `angular.json` na raiz ou `@angular/core` no `package.json`.

Aplique as etapas do `SKILL.md` com as adaptações abaixo. Os templates de conteúdo (`@graph`, `llms.txt`, `ard.json`, `robots.txt`, `sitemap.xml`) continuam em [`../templates.md`](../templates.md).

---

## Onde fica cada coisa

| Item | Local no Angular |
| --- | --- |
| `<head>` global (meta tags, preload do LCP, JSON-LD, `<link rel="help">`) | `src/index.html` |
| Arquivos públicos (`llms.txt`, `robots.txt`, `sitemap.xml`, `.well-known/ard.json`) | `public/` (projetos criados no Angular 18+). Em projetos mais antigos: `src/` ou `src/assets/`, declarados no array `assets` do `angular.json`. |
| Saída do build | `dist/<projeto>/browser/` (builder `application`, padrão desde o 17). Em builders antigos: `dist/<projeto>/`. |

### Garanta que `.well-known/` vai para o build

Depois do `ng build`, confirme que `dist/<projeto>/browser/.well-known/ard.json` existe. Se não existir, declare a pasta explicitamente no `angular.json`:

```json
"assets": [
  { "glob": "**/*", "input": "public" },
  { "glob": "**/*", "input": "public/.well-known", "output": ".well-known" }
]
```

---

## SEO e AEO

1. **Meta tags estáticas** (landing page de rota única): coloque tudo direto no `src/index.html`, igual ao template. É o que os crawlers sem JavaScript enxergam.
2. **Meta tags por rota** (apps com várias páginas): use os serviços `Title` e `Meta` de `@angular/platform-browser`, ou a propriedade `title` das rotas + um `TitleStrategy` customizado.
   ```ts
   private readonly title = inject(Title);
   private readonly meta = inject(Meta);

   ngOnInit() {
     this.title.setTitle('NOME_DO_PRODUTO | Proposta de Valor');
     this.meta.updateTag({ name: 'description', content: '...' });
     this.meta.updateTag({ property: 'og:title', content: '...' });
   }
   ```
   Isso só chega aos crawlers de IA se a página for pré-renderizada (veja abaixo).
3. **JSON-LD `@graph`**: para uma landing, cole o `<script type="application/ld+json">` direto no `src/index.html`. Para JSON-LD dinâmico por rota, injete o script via `DOCUMENT` + `Renderer2` dentro de um componente que roda no servidor (SSR/prerender).

## Crawlers sem JavaScript: prefira pré-renderização ao `<noscript>`

Em SPA pura, `<app-root>` chega vazio. A solução ideal no Angular é gerar HTML pronto no build:

```bash
ng add @angular/ssr
```

- Ative a pré-renderização das rotas públicas (no Angular 19+, `RenderMode.Prerender` em `app.routes.server.ts`; no 17/18, `"prerender": true` no `angular.json`).
- Mantenha `provideClientHydration()` no `app.config.ts` para o Angular reaproveitar o HTML em vez de recriar o DOM (evita piora no LCP e TBT).
- Se o projeto não puder usar SSR/prerender, use o fallback `<noscript><main>...</main></noscript>` no `src/index.html`, **fora** do `<app-root>`.

---

## Performance

### LCP

- **Com image CDN/loader configurado**: use `NgOptimizedImage` na imagem principal.
  ```html
  <img ngSrc="hero.webp" width="470" height="560" priority
       ngSrcset="240w, 450w, 832w" sizes="(max-width: 767px) 240px, 470px" alt="..." />
  ```
  `priority` aplica `fetchpriority="high"` e `loading="eager"`. Atenção: `ngSrcset` exige um loader configurado (`provideImageKitLoader`, `provideCloudinaryLoader` etc.).
- **Sem loader**: use `<img>` comum com `srcset`/`sizes` calibrados para o DPR 1.75 (regra do `SKILL.md`), `fetchpriority="high"` e o `<link rel="preload" as="image">` no topo do `src/index.html`.

### TBT zero

- **Timers e animações fora da detecção de mudanças**: rode `setInterval`, `requestAnimationFrame`, listeners de scroll e o `Lenis` dentro de `NgZone.runOutsideAngular()`. Caso contrário, cada tick dispara change detection na árvore toda.
  ```ts
  private readonly zone = inject(NgZone);

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      addEventListener('wheel', () => this.loadLenis(), { passive: true, once: true });
    });
  }

  private async loadLenis() {
    const { default: Lenis } = await import('lenis');
    // ...
  }
  ```
- **Abaixo da dobra**: envolva seções pesadas em `@defer (on viewport) { ... } @placeholder { ... }` para tirá-las do bundle inicial.
- **Zoneless** (Angular 18+): considere `provideZonelessChangeDetection()` (no 18/19, `provideExperimentalZonelessChangeDetection()`) e remova `zone.js` dos `polyfills`. Elimina o custo do Zone.js no carregamento.
- **Contador regressivo**: isole o relógio em um componente folha com `ChangeDetectionStrategy.OnPush` e atualize um `signal` dentro do `runOutsideAngular`, para que só os dígitos re-renderizem.
- Prefira **animações CSS** (`@keyframes`, `transition` com `transform`) a `@angular/animations` no carregamento inicial.

---

## Validação

```bash
node <skill>/scripts/run-lighthouse.mjs
```

O script detecta o Angular, roda `npm run build` e serve `dist/<projeto>/browser` em `http://localhost:4173`. Se o projeto usa SSR e você quer testar o servidor Node, suba-o manualmente (`node dist/<projeto>/server/server.mjs`) e passe a URL como argumento.

