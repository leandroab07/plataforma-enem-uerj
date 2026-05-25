# ADR-001 — Escolha de Stack Tecnológica

**Status:** Aceito  
**Data:** 2026-05-24  
**Autores:** time de produto

---

## Contexto

Precisamos construir uma plataforma web adaptativa de estudos com as seguintes características determinantes:

- Autenticação segura com Row Level Security (dados de aluno isolados no servidor)
- Lógica de negócio sensível no servidor (gabarito nunca exposto ao cliente)
- Componentes de UI ricos (visualizações de progresso, mapa de calor, curvas temporais)
- Deploys ágeis com preview por PR para iterar rapidamente
- Time pequeno: manutenção de infraestrutura precisa ser mínima

---

## Decisão

Adotamos a stack especificada no documento de requisitos sem desvios:

| Camada | Tecnologia | Versão mínima |
|---|---|---|
| Frontend framework | React | 18 |
| Linguagem | TypeScript | 5 |
| Build tool | Vite | 5 |
| Estilização | TailwindCSS | 3 |
| Componentes | shadcn/ui | latest |
| Backend / DB | Supabase (Postgres 15 + Auth + RLS) | — |
| Deploy | Vercel | — |
| Testes | Vitest | 1 |

---

## Justificativas por componente

### React + TypeScript + Vite

React é a escolha padrão para SPAs com estado complexo de UI. TypeScript captura erros de contrato em compilação — crítico para as interfaces entre o algoritmo de mastery e os componentes de visualização. Vite oferece HMR instantâneo e build production 10–20× mais rápido que CRA/Webpack, sem custo de manutenção de configuração.

**Alternativa rejeitada — Next.js:** SSR seria útil para SEO, mas a plataforma é autenticada; todo conteúdo relevante é privado. O overhead de configuração de route handlers e server components adiciona complexidade desnecessária. Se SEO se tornar requisito (página de marketing pública), Next.js pode ser avaliado para essa camada isolada.

**Alternativa rejeitada — SvelteKit / SolidJS:** Menor ecossistema, menor quantidade de engenheiros familiarizados. O benefício de performance marginal não justifica o risco de adoção.

### TailwindCSS + shadcn/ui

Tailwind permite prototipagem rápida sem criar arquivos CSS separados. shadcn/ui é uma coleção de componentes copiáveis (não uma biblioteca com lock-in), acessíveis por padrão (Radix UI por baixo), e integra nativamente com Tailwind. Componentes críticos já disponíveis: Dialog, Tabs, Progress, Card, Toast, Sheet, Command.

**Alternativa rejeitada — Material UI / Chakra UI:** Ambos impõem um design system opinionado que exige overrides extensivos para customização. shadcn/ui entrega o código no próprio repositório, tornando customização direta e sem dependência de versão de biblioteca.

### Supabase

Supabase entrega em uma única plataforma gerenciada:

1. **Postgres 15** com extensões úteis (pg_cron para recalcular decay, pgcrypto para UUIDs).
2. **Auth** com JWT, suporte a email/senha e OAuth social sem código adicional.
3. **RLS** nativa — políticas de isolamento de dados escritas em SQL, auditáveis, sem código de guarda no servidor de aplicação.
4. **Edge Functions** (Deno) para RPCs sensíveis (submeter_resposta, montar_avaliacao_diagnostica) que nunca expõem gabarito ao cliente.
5. **Realtime** (opcional) para dashboard colaborativo no futuro.
6. **Storage** para eventual armazenamento de imagens de questões.

**Alternativa rejeitada — Firebase:** Modelo de dados NoSQL (Firestore) torna joins, aggregations e triggers relacionais dolorosos. As regras de segurança do Firestore são menos expressivas que RLS SQL. Não há equivalente nativo a Postgres triggers para computar mastery automaticamente.

**Alternativa rejeitada — PlanetScale / Neon + Auth0:** Combinação funcional, mas divide responsabilidade entre dois serviços gerenciados com billing e configuração separados. Supabase integrado reduz superfície operacional.

**Alternativa rejeitada — Prisma:** O documento de requisitos proíbe explicitamente ORMs pesados. Supabase JS client gerado a partir do schema (via `supabase gen types`) fornece tipos TypeScript sem overhead de ORM.

### Vercel

Integração nativa com GitHub para preview deploys por PR. Edge network global para latência baixa. Zero configuração para projetos Vite. O plano gratuito suporta o volume de tráfego da fase inicial.

**Alternativa rejeitada — Netlify:** Funcional, mas Vercel tem integração mais madura com Vite e melhor DX para previews.

**Alternativa rejeitada — self-hosted (VPS + Docker):** Aumenta carga operacional (SSL, CDN, CI/CD, monitoring) sem benefício de funcionalidade ou custo em escala de MVP.

### Vitest

Co-localizado com Vite, sem configuração adicional. Suporta ESM nativo. API idêntica a Jest, facilitando migração de desenvolvedores com histórico em Jest. Mocks e timers integrados — necessário para testar o algoritmo de decay com datas simuladas.

---

## Consequências

### Positivas
- Stack conhecida pela maioria dos engenheiros React/TS
- RLS elimina uma classe inteira de bugs de autorização
- Supabase types gerados garantem contratos frontend↔backend em compile time
- Preview deploys por PR aceleram revisão de produto

### Negativas / riscos
- Lock-in de Supabase: migrar para Postgres self-hosted exigiria reimplementar Auth e RLS fora do Supabase. Mitigação: toda lógica crítica vive em SQL puro (triggers, RPC), portável para qualquer Postgres.
- shadcn/ui não tem versioning de componentes: atualizações são manuais. Mitigação: travar versão do Radix UI e só atualizar componentes quando houver razão explícita.
- Edge Functions em Deno têm cold start (~200ms). Mitigação: RPCs críticas (submeter_resposta) são chamadas após ação do usuário, não bloqueiam renderização inicial.

---

## Desvios futuros

Qualquer desvio desta stack precisa de novo ADR com justificativa escrita. Exemplos que disparariam ADR: adicionar React Query, Zustand, chart library (Recharts vs Visx), ou substituir Edge Functions por outro runtime.
