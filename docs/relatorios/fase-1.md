# Relatório — Fase 1: Inventário e Normalização das Questões

**Data:** 2026-05-24  
**Status:** Aguardando aprovação para Fase 2  
**Script:** `src/scripts/ingestao/01-normalizar.py`  
**Output:** `content/questoes_normalizadas/enem.json`, `uerj.json`, `ingestao_log.json`

---

## Resumo executivo

| Métrica | ENEM | UERJ |
|---|---|---|
| Total questões de origem | 2.689 | 1.418 |
| Qualidade `ok` | **2.673 (99,4%)** | **939 (66,2%)** |
| Qualidade `revisar` | 16 (0,6%) | 479 (33,8%) |
| Qualidade `descartar` | 0 | 0 |
| Taxa de parsing bem-sucedido | **99,4%** | **66,2%** |

O ENEM está em excelente estado. A UERJ tem dois problemas sistemáticos documentados abaixo que precisam de ação antes da Fase 3.

---

## ENEM — Detalhamento por ano

| Ano | Total | ok | revisar |
|---|---|---|---|
| 2009 | 179 | 179 | 0 |
| 2010 | 180 | 180 | 0 |
| 2011 | 180 | 179 | 1 |
| 2012 | 180 | 180 | 0 |
| 2013 | 180 | 179 | 1 |
| 2014 | 180 | 178 | 2 |
| 2015 | 179 | 176 | 3 |
| 2016 | 180 | 175 | 5 |
| 2017 | 180 | 180 | 0 |
| 2018 | 179 | 179 | 0 |
| 2019 | 177 | 177 | 0 |
| 2020 | 177 | 177 | 0 |
| 2021 | 180 | 178 | 2 |
| 2022 | 180 | 178 | 2 |
| 2023 | 178 | 178 | 0 |
| **Total** | **2.689** | **2.673** | **16** |

## ENEM — Detalhamento por área

| Área | Total | ok | revisar |
|---|---|---|---|
| ciencias-humanas | 809 | 806 | 3 |
| ciencias-natureza | 619 | 614 | 5 |
| linguagens | 619 | 619 | 0 |
| matematica | 642 | 634 | 8 |

---

## ENEM — Casos para revisão humana (16 questões)

### Tipo 1: Questões com apenas 4 alternativas (7 questões)

Esperado: 5 alternativas (A–E). Todas têm texto e gabarito válido. Causa provável: questão cancelada/com gabarito anulado onde uma alternativa foi removida, ou erro de scraping da API.

| id_origem | Enunciado (chars) | Área |
|---|---|---|
| ENEM-2011-180 | 582 | — |
| ENEM-2013-064 | 724 | — |
| ENEM-2016-047 | 620 | — |
| ENEM-2021-105 | 815 | — |
| ENEM-2021-175 | 641 | — |
| ENEM-2022-144 | 1.490 | — |
| ENEM-2022-166 | 639 | — |

**Ação recomendada:** verificar na API se a questão tem 5 alternativas — se sim, re-baixar. Se a API retorna 4, marcar `qualidade = "ok"` manualmente (questão válida com menos alternativas).

### Tipo 2: Questões com enunciado curto (9 questões)

Todas têm 5 alternativas e gabarito válido. O texto curto (<50 chars) indica que o enunciado principal está em uma imagem não extraída pelo scraping.

| id_origem | Enunciado (chars) |
|---|---|
| ENEM-2014-144 | 35 |
| ENEM-2014-146 | 46 |
| ENEM-2015-052 | 39 |
| ENEM-2015-166 | 47 |
| ENEM-2015-179 | 44 |
| ENEM-2016-088 | 48 |
| ENEM-2016-090 | 33 |
| ENEM-2016-165 | 42 |
| ENEM-2016-179 | 23 |

**Ação recomendada:** verificar campo `local_images` — se a imagem foi baixada, a questão é usável na plataforma (a imagem carrega o enunciado). Marcar `qualidade = "ok"` manualmente após confirmação.

---

## UERJ — Detalhamento por tipo

| Tipo | Total | ok | revisar |
|---|---|---|---|
| Objetiva | 921 | 442 | 479 |
| Discursiva | 497 | 497 | 0 |
| **Total** | **1.418** | **939** | **479** |

As 497 questões discursivas estão todas com `qualidade = "ok"` e `tipo = "discursiva"`, conforme decisão da Fase 0. Elas entram no banco como tipo especial sem avaliação automática.

## UERJ — Detalhamento por ano

| Ano | Objetivas | Discursivas | ok total | revisar total | Problema identificado |
|---|---|---|---|---|---|
| 2014 | 91 | 42 | 42 | 91 | **Gabarito ausente sistêmico (100%)** |
| 2015 | 1 | 128 | 128 | 1 | Gabarito ausente (1 questão) |
| 2016 | 129 | 0 | 129 | 0 | — |
| 2017 | 54 | 83 | 83 | 54 | **Gabarito ausente sistêmico (100%)** |
| 2018 | 116 | 15 | 15 | 116 | **Gabarito ausente sistêmico (100%)** |
| 2019 | 103 | 15 | 15 | 103 | **Gabarito ausente sistêmico (100%)** |
| 2020 | 115 | — | 119 | 10 | Parcial (7%) |
| 2021 | 0 | 8 | 8 | 0 | **Objetivas não extraídas (formato PDF invertido)** |
| 2022 | 55 | — | 44 | 11 | Parcial (18%) |
| 2023 | 51 | — | 45 | 10 | Parcial (17%) |
| 2024 | 107 | — | 105 | 25 | Parcial (21%) |
| 2025 | 113 | — | 112 | 18 | Parcial (14%) |
| 2026 | 115 | — | 94 | 40 | Parcial (33%) |

---

## UERJ — Problemas sistemáticos identificados

### Problema 1 — Gabarito ausente em anos 2014–2019 (365 questões objetivas)

O script de extração `fetch_uerj.py` não extraiu o gabarito dos PDFs dos anos 2014, 2015, 2017, 2018 e 2019. O gabarito provavelmente está no PDF em formato diferente do esperado pelas regex atuais.

| Ano | Objetivas sem gabarito |
|---|---|
| 2014 | 91 / 91 (100%) |
| 2015 | 1 / 1 (100%) |
| 2017 | 54 / 54 (100%) |
| 2018 | 116 / 116 (100%) |
| 2019 | 103 / 103 (100%) |
| **Total** | **365 questões** |

**Impacto:** Essas questões têm texto e alternativas válidos, mas sem gabarito não podem ser usadas para avaliação automática. Elas entrarão no banco com `gabarito = null` e serão marcadas como `gabarito_ausente` — não serão servidas ao aluno pela RPC `submeter_resposta` até correção.

**Opções de resolução:**
1. Re-executar `fetch_uerj.py` com regex de gabarito estendida para esses anos.
2. Preencher gabarito manualmente (365 questões — custoso).
3. Consultar gabaritos oficiais disponíveis no site da UERJ e criar script de enriquecimento.

**Recomendação:** Opção 3 — existe uma [página de gabaritos no site da UERJ](https://www.vestibular.uerj.br/gabarito/) com PDFs de gabarito por exame. Escrever script de extração de gabarito separado é mais confiável que regex em texto de questão.

### Problema 2 — UERJ 2021 sem questões objetivas (60 questões não extraídas)

O PDF da UERJ 2021 usa o formato invertido `01\nQuestão` (número antes da palavra-chave), oposto ao formato 2018+ que usa `Questão\nXX`. O parser existente extrai apenas as 8 questões discursivas.

**Impacto:** 60 questões objetivas de 2021 ausentes do banco.

**Opção de resolução:** Adaptar `fetch_uerj.py` com um terceiro parser para o formato 2021.

### Problema 3 — Alternativas incompletas em 20 questões objetivas

| Motivo | Quantidade |
|---|---|
| 2 alternativas (A, C) | 14 |
| 3 alternativas | 3 |
| 1 alternativa | 1 |
| Gabarito inválido (not in keys) | 6 |

Causas prováveis: alternativas em imagem não extraída do PDF, ou erros de regex que cortaram parte do texto. Precisam de inspeção manual.

---

## Lacunas registradas (para /docs/lacunas.md)

As lacunas abaixo são adicionadas ao registro central:

1. **UERJ 2014–2019: gabaritos ausentes.** 365 questões objetivas sem gabarito. Resolver antes da Fase 3 para não reduzir o banco de questões disponíveis.

2. **UERJ 2021: objetivas não extraídas.** 60 questões ausentes por formato PDF não suportado. Resolve com terceiro parser.

3. **ENEM: questões com 4 alternativas.** 7 questões onde a API retorna 4 alternativas (esperado: 5). Verificar se são questões canceladas ou erro de extração.

4. **ENEM: questões apenas-imagem.** 9 questões com enunciado <50 chars — texto está nas imagens. Verificar se `local_images` existe para essas questões antes da Fase 3.

---

## O que a Fase 2 vai produzir

Ao aprovar esta fase, a Fase 2 executará:

1. **Modelagem de tópicos de Matemática** em `/content/topicos/matematica/topicos.json` — lista de tópicos com `id`, `titulo`, `descricao`, `nivel` (1–4), `pre_requisitos[]`, `peso_enem_estimado`, `peso_uerj_estimado`.

2. **Grafo de pré-requisitos** para Matemática — validação de que o grafo é um DAG sem ciclos.

3. **Relatório** em `/docs/relatorios/fase-2.md` com: total de tópicos por área/nível, cobertura estimada das questões ENEM e UERJ de Matemática, lacunas identificadas.

A Fase 2 NÃO vai: mapear questões a tópicos (isso é Fase 3), criar código de produção, tocar no banco de dados.

---

## Perguntas para você antes da Fase 2

1. **Resolução do gabarito UERJ 2014–2019:** Quer que a Fase 2 inclua um script de enriquecimento de gabaritos (extraindo dos PDFs de gabarito oficiais da UERJ), ou prefere tratar isso na Fase 3 quando mapear as questões de Matemática?

2. **Escopo de Matemática:** A Fase 2 cobre apenas Matemática (conforme plano original) ou você quer que já mapeie os tópicos de outra área em paralelo?

3. **Granularidade dos tópicos:** Você prefere tópicos com granularidade **fina** (ex: "Funções — Domínio e Imagem" separado de "Funções — Gráfico de Funções Lineares") ou **grossa** (ex: "Funções" como tópico único com sub-habilidades)? A granularidade fina é melhor para o algoritmo de mastery mas exige mais tópicos de calibrar.

---

**Aguardando aprovação para iniciar a Fase 2.**
