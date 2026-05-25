# Relatório — Fase 3: Mapeamento Automático Questão → Tópico

**Data:** 2026-05-25  
**Status:** Aguardando revisão humana (começar por Matemática)  
**Scripts:** `03-mapear-topico.py`, `03b-aplicar-mapeamento.py`  
**Output:** `docs/mapeamentos/*.csv` (8 arquivos, 3.137 sugestões)

---

## Resumo por área

| Prova | Área | Total | Alta (≥0.35) | Média (0.15–0.35) | Baixa (<0.15) |
|---|---|---|---|---|---|
| ENEM | matematica | 634 | 41 (6%) | 184 (29%) | 409 (65%) |
| UERJ | matematica | 138 | 23 (17%) | 65 (47%) | 50 (36%) |
| ENEM | ciencias-natureza | 614 | 124 (20%) | 228 (37%) | 262 (43%) |
| UERJ | ciencias-natureza | 120 | 38 (32%) | 53 (44%) | 29 (24%) |
| ENEM | ciencias-humanas | 806 | 146 (18%) | 407 (50%) | 253 (31%) |
| UERJ | ciencias-humanas | 137 | 28 (20%) | 69 (50%) | 40 (29%) |
| ENEM | linguagens | 619 | 26 (4%) | 123 (20%) | 470 (76%) |
| UERJ | linguagens | 69 | 5 (7%) | 39 (57%) | 25 (36%) |
| **Total** | — | **3.137** | **431 (14%)** | **1.149 (37%)** | **1.557 (50%)** |

---

## Por que a confiança baixa é tão alta?

A taxa de "baixa" confiança reflete a natureza das questões do ENEM, **não um problema do algoritmo**:

1. **ENEM é contextualizado:** A maioria das questões apresenta um texto ou situação-problema real ("A população mundial...", "Um pesquisador observou..."). O conceito matemático está na resolução, não no enunciado. Palavras-chave de tópico (ex: "logaritmo") raramente aparecem explicitamente.

2. **Linguagens é estruturalmente diferente:** Questões de leitura e interpretação não usam vocabulário técnico de subtópicos — qualquer texto pode gerar qualquer tipo de pergunta. Esperado ter 76% baixa confiança.

3. **Matemática ENEM:** 65% baixa, mas muitas dessas são questões com imagens (gráficos, figuras geométricas) onde o enunciado de texto é curto. O contexto visual seria necessário para classificar corretamente.

**Consequência para a revisão:** as sugestões "alta" provavelmente estão corretas; as "média" merecem verificação rápida; as "baixa" precisam de leitura da questão para classificar.

---

## Estratégia de revisão recomendada

### Ordem de prioridade
1. **Matemática** (772 linhas total) → mais bem delimitada, revisão mais rápida
2. **Ciências da Natureza** (734 linhas) → keywords científicos precisos
3. **Ciências Humanas** (943 linhas) → maior volume, mais subjetivo
4. **Linguagens** (688 linhas) → mais trabalhoso, muitas baixas

### Como preencher o CSV

Abra `docs/mapeamentos/enem_matematica.csv` (e `uerj_matematica.csv`) num editor de planilhas.

Colunas que você preenche:
- `aprovado`: `sim` se o tópico sugerido está correto | `nao` se errado
- `topico_corrigido`: ID do tópico correto (se `aprovado = nao`)

IDs de tópicos disponíveis:

**Matemática:**
```
mat.numeros.reais          mat.algebra.expressoes     mat.algebra.equacoes1
mat.algebra.equacoes2      mat.algebra.sistemas       mat.funcoes.conceito
mat.funcoes.linear         mat.funcoes.quadratica     mat.funcoes.exponencial
mat.funcoes.logaritmica    mat.funcoes.compostas      mat.progressoes.pa
mat.progressoes.pg         mat.trigonometria.triangulo mat.trigonometria.circulo
mat.geometria.plana.basico mat.geometria.plana.semelhanca mat.geometria.plana.areas
mat.geometria.plana.circunferencia mat.geometria.espacial
mat.geometria.analitica.reta mat.geometria.analitica.circunferencia
mat.geometria.analitica.conicas mat.combinatoria
mat.probabilidade          mat.estatistica            mat.financeira
mat.matrizes               mat.numeros.complexos
```

Se uma questão não se encaixa em nenhum tópico disponível, deixe `aprovado = nao` e `topico_corrigido = NOVO_TOPICO` — isso sinaliza que um tópico precisa ser criado.

### Dicas para revisão eficiente

- **Comece pelas "alta"** (41 ENEM + 23 UERJ = 64 questões) — devem estar maioritariamente corretas. Aprove rapidamente e corrija exceções.
- **Média** (184 ENEM + 65 UERJ = 249): leia o enunciado_100 e verifique se o tópico sugerido faz sentido.
- **Baixa** (409 ENEM): para questões com imagem (enunciado começa com `![](https://`), o tópico deve ser inferido do contexto visual — sugira o mais provável ou marque para segunda rodada.

---

## Após a revisão

Execute:
```bash
python3 src/scripts/ingestao/03b-aplicar-mapeamento.py
```

O script:
1. Lê todos os CSVs revisados
2. Aplica `topico_id_sugerido` às questões aprovadas/corrigidas em `enem.json` e `uerj.json`
3. Gera `docs/relatorios/fase-3b.md` com cobertura por tópico

---

## Lacunas identificadas

1. **Questões com imagem (sem texto):** ~400 questões ENEM têm enunciado iniciado com `![](url)` — não são classificáveis por keyword. Precisam de revisão visual manual ou serão deixadas com `topico_id_sugerido = null` na v1.

2. **Questões UERJ sem área:** das 503 objetivas ok, 39 não foram atribuídas a nenhuma área pela classificação automática (score < 0.05 em todas as áreas). Possível causa: questões muito curtas ou com texto ambíguo.

3. **Tópicos de Linguagens:** taxa de confiança baixa estrutural. Para Linguagens, o mapeamento manual é quase inevitável — considerar se vale o custo para v1.

---

## O que a Fase 4 vai produzir

Ao concluir a revisão de Matemática (e executar `03b-aplicar-mapeamento.py`):

A **Fase 4** configurará o banco de dados Supabase:
1. **Schema SQL completo**: tabelas `questoes`, `gabaritos` (schema private), `topicos`, `pre_requisitos`, `tentativas`, `estado_topico`, `agenda_revisao`, `eventos_progressao`
2. **RLS policies** em todas as tabelas (conforme ADR-006)
3. **Script de seed**: carrega `questoes` validadas (com `topico_id` preenchido) no banco via Supabase Admin API
4. **Edge Function** `submeter-resposta` (esqueleto — sem a lógica de mastery ainda)

A Fase 4 vai exigir: `SUPABASE_URL` e `SUPABASE_ANON_KEY` (você precisará criar um projeto no Supabase).

---

**Próximo passo: revise `docs/mapeamentos/enem_matematica.csv` e `uerj_matematica.csv`, depois avise para continuar com Fase 3b.**
