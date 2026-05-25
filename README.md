# Plataforma de Estudos ENEM · UERJ

Plataforma de estudo adaptativo para ENEM e UERJ com foco em Medicina. Usa modelo beta-binomial para calcular domínio por tópico e spaced repetition para revisão.

## Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Deploy**: Vercel (frontend) + Supabase (backend)

## Rodando localmente

```bash
cd web
npm install
npm run dev
# http://localhost:5173 — funciona sem Supabase em modo demonstração
```

## Configuração com Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Execute `docs/sql/schema.sql` no SQL Editor
3. Copie `web/.env.example` → `web/.env` e preencha as chaves
4. Execute o seed:

```bash
export SUPABASE_URL=https://SEU_PROJETO.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
python3 src/scripts/ingestao/04-seed-supabase.py
```

5. Deploy da Edge Function:

```bash
supabase functions deploy submeter-resposta
```

## Estrutura

```
content/
  questoes_normalizadas/   — enem.json e uerj.json (~3.100 questões)
  topicos/                 — grafo de 127 tópicos por área (DAG)
docs/
  sql/schema.sql           — Schema completo do Supabase
  adr/                     — Decisões de arquitetura
  relatorios/              — Relatórios por fase do projeto
  mapeamentos/             — CSVs questão → tópico (revisão humana)
src/scripts/ingestao/      — Pipeline de normalização e seed
web/                       — Frontend React
supabase/functions/        — Edge Functions
```

## Fases do projeto

| Fase | Descrição | Status |
|---|---|---|
| 1 | Normalização das questões ENEM + UERJ | ✅ |
| 2 | Modelagem de tópicos (127 tópicos, DAG) + enriquecimento de gabaritos | ✅ |
| 3 | Mapeamento automático questão → tópico | ✅ |
| 4 | Schema SQL + Frontend base + Edge Function | ✅ |
| 5 | Mastery no banco + integração produção | 🔜 |

## Modelo de domínio (ADR-002)

- **Beta-Binomial**: `α=2, β=2` como prior
- **Threshold dominado**: score ≥ 0.75 **E** ≥ 5 questões únicas acertadas
- **Decaimento**: meia-vida de 21 dias
- **Anti-memorização**: peso 0.3 em re-tentativas

## Licença

Código: MIT  
Questões ENEM: domínio público (INEP/MEC)  
Questões UERJ: uso educacional, distribuição gratuita
