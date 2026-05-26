-- =============================================================================
-- Migração: Schema de Unidades de Aprendizagem Integradas (UAI)
-- Fase L1 — 2026-05-26
--
-- ATENÇÃO: tentativas_uai é FORMATIVO — nunca alimenta o algoritmo de mastery.
-- Apenas tentativas (schema existente, seção 5 da UAI) afeta estado_topico.
-- Ver ADR-L03 para justificativa completa.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Tabela: unidades_aprendizagem
-- Catálogo de UAIs disponíveis na plataforma
-- ---------------------------------------------------------------------------
create table if not exists public.unidades_aprendizagem (
  id                text primary key,            -- ex.: 'CN.QUIM.DILUICOES'
  topico_id         text not null,               -- referência ao tópico (mock-data.ts)
  titulo            text not null,
  area              text not null,               -- 'quimica', 'fisica', etc.
  tem_simulacao     boolean not null default false,
  tipo_simulacao    text not null default 'nenhuma'
    check (tipo_simulacao in ('phet_embed', 'custom_konva', 'nenhuma')),
  config_simulacao  jsonb not null default '{}', -- config específica (URL PhET, params, etc.)
  conteudo          jsonb not null default '{}', -- seções 1-6 (ver uai-types.ts)
  versao_conteudo   integer not null default 1,
  status            text not null default 'rascunho'
    check (status in ('rascunho', 'revisao', 'publicada')),
  atualizado_em     timestamptz not null default now()
);

comment on table public.unidades_aprendizagem is
  'Catálogo de Unidades de Aprendizagem Integradas. Conteúdo armazenado como JSONB (seções 1-6).';

-- RLS: alunos autenticados leem apenas UAIs publicadas
alter table public.unidades_aprendizagem enable row level security;

create policy "alunos_leem_uais_publicadas"
  on public.unidades_aprendizagem
  for select
  to authenticated
  using (status = 'publicada');

-- ---------------------------------------------------------------------------
-- Tabela: tentativas_uai
-- Respostas a microexercícios FORMATIVOS (seção 4 da UAI)
-- NUNCA alimenta mastery — ver ADR-L03
-- ---------------------------------------------------------------------------
create table if not exists public.tentativas_uai (
  id          uuid primary key default gen_random_uuid(),
  aluno_id    uuid references auth.users not null,
  uai_id      text references public.unidades_aprendizagem(id) not null,
  secao       smallint not null check (secao between 1 and 4),  -- NUNCA 5
  microex_id  text not null,
  resposta    jsonb not null,      -- { opcao_id: 'b' } ou { valor: 1.5 }
  correto     boolean not null,
  dica_usada  boolean not null default false,
  tempo_s     smallint,            -- segundos para responder (nullable)
  created_at  timestamptz not null default now()
);

comment on table public.tentativas_uai is
  'Tentativas em microexercícios formativos (seção 4 da UAI). '
  'NÃO alimenta mastery — ver ADR-L03. Apenas analytics de produto.';

comment on column public.tentativas_uai.secao is
  'Seção da UAI. Check constraint impede registro de seção 5 (somativa) aqui.';

-- RLS
alter table public.tentativas_uai enable row level security;

create policy "alunos_inserem_proprias_tentativas_uai"
  on public.tentativas_uai
  for insert
  to authenticated
  with check (auth.uid() = aluno_id);

create policy "alunos_leem_proprias_tentativas_uai"
  on public.tentativas_uai
  for select
  to authenticated
  using (auth.uid() = aluno_id);

-- ---------------------------------------------------------------------------
-- Tabela: progresso_uai
-- Rastreamento de qual seção o aluno está em cada UAI
-- ---------------------------------------------------------------------------
create table if not exists public.progresso_uai (
  aluno_id          uuid references auth.users not null,
  uai_id            text references public.unidades_aprendizagem(id) not null,
  secao_atual       smallint not null default 1 check (secao_atual between 1 and 6),
  concluida         boolean not null default false,
  iniciada_em       timestamptz not null default now(),
  concluida_em      timestamptz,
  ultima_interacao  timestamptz not null default now(),
  primary key (aluno_id, uai_id)
);

comment on table public.progresso_uai is
  'Progresso de navegação do aluno nas seções da UAI (1-6). '
  'Separado de tentativas — apenas rastreamento de posição, não desempenho.';

-- RLS: aluno gerencia apenas seu próprio progresso
alter table public.progresso_uai enable row level security;

create policy "alunos_gerem_proprio_progresso_uai"
  on public.progresso_uai
  for all
  to authenticated
  using (auth.uid() = aluno_id)
  with check (auth.uid() = aluno_id);

-- Atualiza ultima_interacao automaticamente
create or replace function public.atualizar_ultima_interacao_uai()
returns trigger language plpgsql security definer as $$
begin
  new.ultima_interacao = now();
  return new;
end;
$$;

create trigger trg_progresso_uai_ultima_interacao
  before update on public.progresso_uai
  for each row execute function public.atualizar_ultima_interacao_uai();

-- ---------------------------------------------------------------------------
-- Índices
-- ---------------------------------------------------------------------------
create index if not exists idx_tentativas_uai_aluno_uai
  on public.tentativas_uai (aluno_id, uai_id);

create index if not exists idx_tentativas_uai_microex
  on public.tentativas_uai (uai_id, microex_id);

-- ---------------------------------------------------------------------------
-- Verificação de integridade (executar após migração para confirmar)
-- ---------------------------------------------------------------------------
-- select relname, obj_description(oid) from pg_class
-- where relname in ('unidades_aprendizagem', 'tentativas_uai', 'progresso_uai');
