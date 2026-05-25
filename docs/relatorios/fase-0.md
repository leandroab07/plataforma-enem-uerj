# Relatório — Fase 0: ADRs

**Data:** 2026-05-24  
**Status:** Aguardando aprovação para Fase 1

---

## O que foi feito

Foram produzidos 6 ADRs (Architecture Decision Records) em `/docs/adr/`. Nenhum código foi escrito. Nenhuma estrutura de projeto foi criada além da pasta `/docs/`.

| ADR | Título | Decisão principal |
|---|---|---|
| ADR-001 | Stack tecnológica | React + TS + Vite + Tailwind + shadcn/ui + Supabase + Vercel + Vitest, sem desvios |
| ADR-002 | Modelo de mastery | Beta-Binomial com decaimento exponencial (rejeitados: BKT, Elo, IRT) |
| ADR-003 | Ingestão das questões | Pipeline 4 etapas: normalizar → mapear → validar humano → seed. Questoes em dois JSONs existentes |
| ADR-004 | Cold start e blend | α(n) = n/(n+20); score_generico baseado em peso_enem + impacto_downstream; dois caminhos de primeira classe |
| ADR-005 | Anti-memorização | Threshold duplo (mastery ≥ 0.75 AND ≥5 questões únicas); peso 0.3 para re-tentativas; novas questões após erro |
| ADR-006 | Segurança do gabarito | Schema `private` para gabaritos; RPC obrigatória; RLS em todas as tabelas; checklist de auditoria |

---

## Decisões que precisam de validação sua

### 1. Arquitetura do gabarito (ADR-006)

Proposta: mover a coluna `gabarito` para um schema Postgres `private` separado, inacessível para o role `authenticated`. O schema `public.questoes` nunca contém o gabarito. Apenas Edge Functions com `service_role` acessam `private.gabaritos`.

**Pergunta:** Você confirma essa abordagem? A alternativa mais simples (view pública sem a coluna gabarito) é menos segura mas mais fácil de implementar. Recomendamos a abordagem schema separado.

### 2. Threshold de cold start (ADR-004)

`COLD_START_PIVOT = 20` significa que após 20 tentativas o sistema usa 50% recomendação personalizada. Isso equivale a aproximadamente 2 sessões de estudo.

**Pergunta:** Esse ritmo de personalização parece adequado para o aluno-alvo (estudante de pré-vestibular com sessões de 45–90 min)?

### 3. Mínimo de questões únicas para domínio (ADR-005)

`MIN_QUESTOES_UNICAS_DOMINIO = 5` foi calibrado para que `P(dominar sem saber) < 0.1%` (4 alternativas, 5 questões independentes).

**Pergunta:** Confirma 5 como threshold? Para tópicos com banco pequeno (8–10 questões), o aluno pode atingir rapidamente o limite do banco sem alcançar 5 únicas acertadas — o sistema sinaliza isso como "banco esgotado, aguardando novas questões".

### 4. Questões discursivas da UERJ (ADR-003)

As questões discursivas (~10 por exame discursivo, sem alternativas e sem gabarito estruturado) foram identificadas como `qualidade = "revisar"`. Na v1 elas não serão ingeriadas no banco de questões — serão apenas referenciadas para leitura.

**Pergunta:** Confirma excluir as discursivas do banco de questões na v1? Ou quer que elas entrem como tipo especial sem avaliação automática?

---

## Decisões tomadas com as quais você pode discordar

### Por que Beta-Binomial e não BKT?

BKT é o padrão da academia de ITS (Intelligent Tutoring Systems). Escolhemos Beta-Binomial porque:
- BKT exige calibração de 4 parâmetros por tópico com ~200 alunos — não temos esses dados.
- BKT tem estado binário (sabe/não sabe) — inadequado para gradação de domínio.
- Beta-Binomial funciona a partir de n=1 e é interpretável em linguagem humana.

Se você discordar, podemos implementar BKT com parâmetros fixos (empíricos da literatura) como alternativa — o schema de banco não muda.

### Por que score_generico usa impacto_downstream e não apenas peso_enem?

O `peso_enem` indica importância curricular, mas não indica urgência pedagógica. Um tópico fundamental (como "Funções — Definição") pode ter `peso_enem` moderado mas desbloquear 8 outros tópicos. O `impacto_downstream` captura isso. Se preferir simplificar para apenas `peso_enem + peso_uerj` na v1, é ajustável sem quebrar o schema.

---

## Lacunas identificadas e documentadas

As lacunas abaixo serão registradas em `/docs/lacunas.md` na Fase 1:

1. **peso_enem por tópico:** Não calibrado. Valores iniciais serão estimados com base no número histórico de questões de cada área nas provas 2009–2023. Marcado como `null` no banco até calibração.

2. **dificuldade das questões:** Não calibrada. Campo `dificuldade` ficará `null` até que haja dados de alunos suficientes para estimativa Elo (ADR-002).

3. **Questões UERJ 2021:** Apenas 8 questões extraídas de 60 (formato de PDF incompatível com o parser). Essas questões precisam de extração manual ou serão excluídas.

4. **Questões apenas-imagem:** ~5–10% das questões UERJ têm texto não extraível do PDF (questão inteiramente em imagem). Precisam de transcrição manual para entrar no banco.

5. **Pré-requisitos entre áreas:** `conexoes_interareas` existe no schema mas o grafo inter-área não será populado na Fase 2 (apenas Matemática). Humanas e Natureza têm conexões diferentes que precisam de modelagem específica.

---

## O que a Fase 1 vai produzir

Ao aprovar esta fase, a Fase 1 executará:

1. **Inspeção dos arquivos existentes:** ler `questoes_enem.json` (2.689 questões) e `questoes_uerj.json` (1.418 questões), documentar estrutura completa.

2. **Script de normalização** (`01-normalizar.ts`): produz `enem.json` e `uerj.json` no formato `QuestaoNormalizada`, com campo `qualidade` (ok / revisar / descartar) e `motivo_revisao`.

3. **Relatório de qualidade** em `/docs/relatorios/fase-1.md`: total por prova/ano, taxa de parsing bem-sucedido, lista de casos problemáticos.

4. **Criação de `/content/questoes_normalizadas/`**: arquivos de output do pipeline. Os originais permanecem intocados.

A Fase 1 NÃO vai: mapear questões para tópicos (isso é Fase 3), criar tópicos (Fase 2), ou popular o banco (Fase 3+).

---

## Perguntas abertas para você antes da Fase 1

1. O local do projeto deve ser `/workspace/educacao/plataforma/` (irmão de `questões/`)? Confirmar caminho antes de criar `package.json`.

2. Você tem uma conta Supabase e projeto criado? Na Fase 4 precisaremos das variáveis `SUPABASE_URL` e `SUPABASE_ANON_KEY`. Se ainda não tem, a Fase 4 pode incluir as instruções de criação.

3. Para o deploy na Vercel (Fase 4), você quer conectar ao repositório GitHub existente ou criar um novo repositório? O projeto está em git (`main` branch identificado).

4. Qual é o aluno-alvo em termos de nível atual? ("Zerou no ENEM anterior" vs "já tirou 650+ mas quer 750+") — isso afeta os valores de `THRESHOLD_DOMINADO` e o design do diagnóstico inicial.

---

**Aguardando aprovação para iniciar a Fase 1.**
