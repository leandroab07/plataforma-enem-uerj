# Relatório — Fase 4: Banco de Dados + Frontend Base

**Data:** 2026-05-25  
**Status:** Concluída — aguardando configuração do Supabase para Fase 5  
**Entregáveis:** `docs/sql/schema.sql`, `web/` (React+Vite), `supabase/functions/submeter-resposta/`, `src/scripts/ingestao/04-seed-supabase.py`

---

## O que foi construído

### 1. Schema SQL (`docs/sql/schema.sql`)

Schema completo para executar no Supabase SQL Editor (ordem importa):

| Tabela | Schema | Descrição |
|---|---|---|
| `topicos` | public | Grafo de tópicos com IDs slug |
| `pre_requisitos` | public | Arestas do DAG |
| `questoes` | public | Questões **sem gabarito** |
| `gabaritos` | **private** | Gabarito — só service_role acessa |
| `alunos` | public | Extensão do auth.users |
| `tentativas` | public | Imutável (sem UPDATE/DELETE policy) |
| `estado_topico` | public | Mastery score por aluno×tópico |
| `agenda_revisao` | public | Spaced repetition |
| `eventos_progressao` | public | Log imutável de eventos |

**Segurança:**
- RLS habilitado em todas as tabelas públicas
- Schema `private` com `REVOKE ALL FROM authenticated` — gabarito inacessível ao cliente
- Triggers: criação automática de `aluno` e `estado_topico` ao registrar

### 2. Frontend React (`web/`)

Stack: **React 19 + TypeScript + Vite + Tailwind CSS v4**

```
web/src/
  lib/
    types.ts          — interfaces TypeScript (Topico, Questao, EstadoTopico, …)
    supabase.ts       — cliente Supabase (detecta se está configurado)
    mastery.ts        — cálculo beta-binomial + decaimento (cliente, para modo demo)
    mock-data.ts      — 12 tópicos + 7 questões reais ENEM 2009
    store.ts          — persistência localStorage (modo demo)
  components/
    Layout.tsx        — sidebar + área principal
    MasteryBar.tsx    — barra de progresso de domínio
  pages/
    Login.tsx         — login Supabase ou "Entrar em modo demonstração"
    Dashboard.tsx     — painel com cards de tópico + métricas globais
    TopicosSelect.tsx — seleção de tópico para praticar
    Pratica.tsx       — sessão de questões (resposta → gabarito → próxima)
```

**Modo demonstração** (sem Supabase configurado):
- Questões reais do ENEM 2009, texto puro (sem dependência de imagens)
- Progresso salvo em `localStorage`
- Mastery calculado no cliente (beta-binomial simplificado)
- Aviso visual "Modo demonstração" na sidebar

**Modo produção** (com Supabase):
- Autenticação via Supabase Auth
- Gabarito nunca exposto ao cliente antes da submissão
- Tentativas enviadas via Edge Function (veja abaixo)

### 3. Edge Function (`supabase/functions/submeter-resposta/`)

Esqueleto funcional que:
1. Autentica o aluno via JWT
2. Busca gabarito em `private.gabaritos` (service_role)
3. Verifica se já respondeu (calcula `peso_efetivo`: 1.0 nova, 0.3 re-tentativa)
4. Insere `tentativa` com `aluno_id = auth.uid()` (respeita RLS)
5. Retorna `{ acertou, gabarito, peso_efetivo }`

**Lógica de mastery**: delegada à Fase 5 (TODO marcado no código).

### 4. Script de seed (`04-seed-supabase.py`)

```bash
export SUPABASE_URL=https://SEU_PROJETO.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
python3 src/scripts/ingestao/04-seed-supabase.py

# Ou com dry-run para validar antes:
python3 04-seed-supabase.py --dry-run
```

Carrega em ordem:
1. `content/topicos/todos.json` → `public.topicos` + `public.pre_requisitos`
2. `content/questoes_normalizadas/enem.json` + `uerj.json` → `public.questoes` (objetivas ok)
3. Gabaritos → `private.gabaritos` (via `Content-Profile: private`)

Usa upsert por `id_origem` — re-executável sem duplicatas.

---

## Como rodar o site agora

```bash
cd /plataforma/web
npm run dev
# Acesse http://localhost:5173
# Clique em "Entrar em modo demonstração"
```

O site funciona completamente sem Supabase. Você verá:
- **Painel** com 12 tópicos de Matemática e barras de progresso
- **Praticar** com 7 questões reais do ENEM distribuídas por tópico
- **Feedback** imediato após cada resposta (correto/incorreto + gabarito)
- Progresso persiste entre sessões via localStorage

---

## Para conectar ao Supabase

1. Crie um projeto em supabase.com
2. Execute `docs/sql/schema.sql` no SQL Editor
3. Execute `04-seed-supabase.py` com as chaves do projeto
4. Crie `web/.env` a partir de `web/.env.example`
5. Deploy da Edge Function: `supabase functions deploy submeter-resposta`

---

## Estrutura de arquivos criados

```
plataforma/
  docs/sql/schema.sql                          ← Schema completo
  web/                                         ← Frontend React
    src/lib/{types,supabase,mastery,mock-data,store}.ts
    src/components/{Layout,MasteryBar}.tsx
    src/pages/{Login,Dashboard,TopicosSelect,Pratica}.tsx
    .env.example
  supabase/functions/submeter-resposta/
    index.ts                                   ← Edge Function (esqueleto)
  src/scripts/ingestao/
    04-seed-supabase.py                        ← Seed do banco
```

---

## Lacunas documentadas (Fase 5+)

1. **Atualização de `estado_topico`:** A Edge Function ainda não atualiza o mastery score no banco após cada tentativa. O cálculo acontece só no cliente (modo demo). A Fase 5 deve implementar o trigger ou chamada explícita na Edge Function.

2. **Agendamento de revisão:** A tabela `agenda_revisao` está criada mas nenhuma lógica popula ela ainda.

3. **Questões com imagem:** O modo demo usa apenas questões texto puro. A Fase 5 deve resolver o serving das imagens (CDN ou bucket Supabase Storage).

4. **Tópicos de outras áreas:** O mock tem apenas Matemática. Após a revisão dos CSVs de todas as áreas (Fase 3b), o seed populará todos os 127 tópicos e suas questões.

5. **Seleção adaptativa de questões:** O Dashboard lista todos os tópicos, mas ainda não prioriza os "enfraquecidos" nem sugere o próximo tópico desbloqueado.

---

## Próximas etapas (Fase 5)

Para aprovar e avançar, você precisa:

1. Revisar os CSVs de Matemática (`docs/mapeamentos/enem_matematica.csv` e `uerj_matematica.csv`) — preencher `aprovado` e `topico_corrigido`
2. Executar `03b-aplicar-mapeamento.py` para gerar o relatório de cobertura (Fase 3b)
3. Criar um projeto no Supabase e executar o schema SQL
4. Rodar o seed script para popular o banco com as ~500 questões ok com gabarito

A **Fase 5** vai implementar:
- Lógica completa de mastery no banco (trigger Postgres ou Edge Function)
- Integração real da Fase de questões com Supabase (modo produção funcional)
- Seleção adaptativa: priorizar tópicos "enfraquecidos" e questões não-vistas
- Agenda de revisão spaced repetition

**Próximo passo: revise os CSVs de Matemática e avise quando concluir a Fase 3b.**
