-- ============================================================
-- Schema da Plataforma de Estudos ENEM/UERJ
-- Versão 1.0 — Fase 4
-- Executar no Supabase SQL Editor (nessa ordem)
-- ============================================================

-- ── Extensões ────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- busca por trigrama (questões)

-- ── Schema privado (gabaritos — inacessível para authenticated) ──
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
REVOKE ALL ON SCHEMA private FROM authenticated;

-- ============================================================
-- TÓPICOS E GRAFO DE PRÉ-REQUISITOS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.topicos (
  id                    TEXT PRIMARY KEY,        -- "mat.funcoes.linear"
  titulo                TEXT NOT NULL,
  descricao             TEXT,
  area                  TEXT NOT NULL,           -- "matematica", "ciencias-natureza", etc.
  disciplina            TEXT NOT NULL,
  nivel                 SMALLINT NOT NULL CHECK (nivel BETWEEN 1 AND 4),
  peso_enem_estimado    NUMERIC(4,2),            -- null até calibrar
  peso_uerj_estimado    NUMERIC(4,2),            -- null até calibrar
  keywords              TEXT[],
  criado_em             TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pre_requisitos (
  topico_id             TEXT NOT NULL REFERENCES public.topicos(id) ON DELETE CASCADE,
  prerequisito_id       TEXT NOT NULL REFERENCES public.topicos(id) ON DELETE CASCADE,
  PRIMARY KEY (topico_id, prerequisito_id)
);

-- ============================================================
-- QUESTÕES (schema public — SEM gabarito)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.questoes (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_origem             TEXT UNIQUE NOT NULL,    -- "ENEM-2023-001"
  prova                 TEXT NOT NULL,           -- "ENEM" | "UERJ"
  ano                   SMALLINT NOT NULL,
  numero_original       TEXT,
  area_origem           TEXT,
  exame_uerj            TEXT,
  tipo                  TEXT NOT NULL DEFAULT 'objetiva',  -- "objetiva" | "discursiva"
  enunciado             TEXT NOT NULL,
  alternativas          JSONB NOT NULL DEFAULT '{}',       -- {"A": "...", "B": "...", ...}
  dificuldade           NUMERIC(4,3),            -- null até calibrar (0.0–1.0)
  tempo_medio_s         INTEGER,                 -- null até calibrar
  tags_secundarias      TEXT[],
  topico_id             TEXT REFERENCES public.topicos(id),
  imagens_locais        TEXT[],
  qualidade             TEXT NOT NULL DEFAULT 'ok',
  motivo_revisao        TEXT,
  criado_em             TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS questoes_topico_idx   ON public.questoes(topico_id);
CREATE INDEX IF NOT EXISTS questoes_prova_idx    ON public.questoes(prova, ano);
CREATE INDEX IF NOT EXISTS questoes_qualidade_idx ON public.questoes(qualidade);

-- ============================================================
-- GABARITOS (schema private — apenas service_role acessa)
-- ============================================================

CREATE TABLE IF NOT EXISTS private.gabaritos (
  questao_id            UUID PRIMARY KEY REFERENCES public.questoes(id) ON DELETE CASCADE,
  gabarito              CHAR(1) NOT NULL CHECK (gabarito IN ('A','B','C','D','E')),
  explicacao            TEXT                     -- null na v1
);

-- ============================================================
-- ALUNOS (extensão do auth.users do Supabase)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.alunos (
  id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome                  TEXT,
  criado_em             TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- TENTATIVAS (imutável — sem UPDATE, sem DELETE)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.tentativas (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id              UUID NOT NULL REFERENCES public.alunos(id) ON DELETE CASCADE,
  questao_id            UUID NOT NULL REFERENCES public.questoes(id),
  topico_id             TEXT REFERENCES public.topicos(id),
  resposta_marcada      CHAR(1) NOT NULL CHECK (resposta_marcada IN ('A','B','C','D','E')),
  acertou               BOOLEAN NOT NULL,
  confianca             SMALLINT CHECK (confianca BETWEEN 1 AND 5),
  tipo_servimento       TEXT NOT NULL DEFAULT 'pratica',
    -- 'pratica' | 'diagnostico' | 'revisao_agendada' | 'revisao_aluno'
  peso_efetivo          NUMERIC(3,2) NOT NULL DEFAULT 1.0,
    -- 1.0 para nova questão, 0.3 para re-tentativa (ADR-005)
  tentada_em            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS tentativas_aluno_topico_idx
  ON public.tentativas(aluno_id, topico_id);
CREATE INDEX IF NOT EXISTS tentativas_aluno_questao_idx
  ON public.tentativas(aluno_id, questao_id);

-- Constraint: acertou deve ser consistente (verificado pela Edge Function,
-- mas garantido também no banco como segunda linha de defesa)
-- Nota: o gabarito não está aqui — essa constraint é verificável apenas
-- na Edge Function que tem acesso ao schema private.

-- ============================================================
-- ESTADO POR TÓPICO (calculado, atualizado por trigger)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.estado_topico (
  aluno_id                  UUID NOT NULL REFERENCES public.alunos(id) ON DELETE CASCADE,
  topico_id                 TEXT NOT NULL REFERENCES public.topicos(id),
  status                    TEXT NOT NULL DEFAULT 'nao_iniciado',
    -- 'nao_iniciado' | 'em_progresso' | 'dominado' | 'enfraquecido'
  mastery_score             NUMERIC(5,4) NOT NULL DEFAULT 0.0,  -- 0.0–1.0
  decay_score               NUMERIC(5,4) NOT NULL DEFAULT 0.0,  -- mastery com decaimento
  total_tentativas          INTEGER NOT NULL DEFAULT 0,
  questoes_unicas_tentadas  INTEGER NOT NULL DEFAULT 0,
  questoes_unicas_acertadas INTEGER NOT NULL DEFAULT 0,
  ultima_tentativa_em       TIMESTAMPTZ,
  atualizado_em             TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (aluno_id, topico_id)
);

CREATE INDEX IF NOT EXISTS estado_topico_aluno_idx
  ON public.estado_topico(aluno_id, status);

-- ============================================================
-- AGENDA DE REVISÃO (Spaced Repetition)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.agenda_revisao (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id              UUID NOT NULL REFERENCES public.alunos(id) ON DELETE CASCADE,
  questao_id            UUID NOT NULL REFERENCES public.questoes(id),
  topico_id             TEXT REFERENCES public.topicos(id),
  agendado_para         DATE NOT NULL,
  motivo                TEXT NOT NULL DEFAULT 'erro_recente',
    -- 'erro_recente' | 'decaimento' | 'revisao_aluno'
  concluido             BOOLEAN NOT NULL DEFAULT FALSE,
  concluido_em          TIMESTAMPTZ,
  criado_em             TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS agenda_aluno_data_idx
  ON public.agenda_revisao(aluno_id, agendado_para)
  WHERE concluido = FALSE;

-- ============================================================
-- EVENTOS DE PROGRESSÃO (log imutável)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.eventos_progressao (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id              UUID NOT NULL REFERENCES public.alunos(id) ON DELETE CASCADE,
  topico_id             TEXT REFERENCES public.topicos(id),
  evento                TEXT NOT NULL,
    -- 'dominado' | 'enfraquecido' | 'recuperado' | 'desbloqueado'
  mastery_score_em      NUMERIC(5,4),
  ocorrido_em           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS eventos_aluno_idx
  ON public.eventos_progressao(aluno_id, ocorrido_em DESC);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.topicos           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pre_requisitos    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questoes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alunos            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tentativas        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estado_topico     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agenda_revisao    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos_progressao ENABLE ROW LEVEL SECURITY;

-- Tópicos: leitura pública para autenticados, escrita só para admin
CREATE POLICY topicos_read ON public.topicos FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY pre_requisitos_read ON public.pre_requisitos FOR SELECT
  USING (auth.role() = 'authenticated');

-- Questões: leitura pública para autenticados (gabarito não está aqui)
CREATE POLICY questoes_read ON public.questoes FOR SELECT
  USING (auth.role() = 'authenticated' AND qualidade = 'ok');

-- Alunos: cada aluno só vê e edita o próprio perfil
CREATE POLICY alunos_self ON public.alunos FOR ALL
  USING (id = auth.uid());

-- Tentativas: aluno só vê e insere as próprias
CREATE POLICY tentativas_select ON public.tentativas FOR SELECT
  USING (aluno_id = auth.uid());
CREATE POLICY tentativas_insert ON public.tentativas FOR INSERT
  WITH CHECK (aluno_id = auth.uid());
-- Sem UPDATE, sem DELETE

-- Estado por tópico: aluno só vê o próprio
CREATE POLICY estado_select ON public.estado_topico FOR SELECT
  USING (aluno_id = auth.uid());

-- Agenda: aluno só vê a própria
CREATE POLICY agenda_select ON public.agenda_revisao FOR SELECT
  USING (aluno_id = auth.uid());

-- Eventos: aluno só vê os próprios
CREATE POLICY eventos_select ON public.eventos_progressao FOR SELECT
  USING (aluno_id = auth.uid());

-- ============================================================
-- TRIGGER: criar perfil de aluno ao registrar
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.alunos (id, nome)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'nome')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- TRIGGER: inicializar estado_topico ao registrar aluno
-- (para todos os tópicos disponíveis)
-- ============================================================

CREATE OR REPLACE FUNCTION public.inicializar_estado_topico()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.estado_topico (aluno_id, topico_id, status)
  SELECT NEW.id, id, 'nao_iniciado' FROM public.topicos
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_aluno_created
  AFTER INSERT ON public.alunos
  FOR EACH ROW EXECUTE FUNCTION public.inicializar_estado_topico();
