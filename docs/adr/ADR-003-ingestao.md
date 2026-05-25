# ADR-003 — Estratégia de Ingestão das Questões Existentes

**Status:** Aceito  
**Data:** 2026-05-24  
**Autores:** time de produto

---

## Contexto

O projeto já possui dois arquivos de questões normalizadas produzidos por scripts de scraping:

```
/workspace/educacao/questões/
  enem/
    questoes_enem.json      (~2.689 questões, 4.8 MB)
    questoes_enem.xlsx
    images/                 (~1.844 imagens baixadas)
  uerj/
    questoes_uerj.json      (~1.418 questões, 1.2 MB)
    questoes_uerj.xlsx
    images/                 (~512 imagens extraídas de PDF)
```

**Restrição absoluta:** os arquivos originais não podem ser modificados.

A plataforma precisa ingerir essas questões para:
1. Populá-las na tabela `questoes` do Supabase.
2. Mapear cada questão a um `topico_id` (mapeamento validado pelo humano antes de carregar).

---

## Estrutura dos dados de origem

### ENEM (`questoes_enem.json`)

Cada objeto tem os campos:

```json
{
  "title": "Questão 1 - ENEM 2023",
  "index": 1,
  "discipline": "linguagens",
  "language": "espanhol",
  "year": 2023,
  "context": "**TEXTO I**\n\n...",
  "files": ["https://enem.dev/2023/questions/1/...jpg"],
  "correctAlternative": "A",
  "alternativesIntroduction": "O filme Como estrellas...",
  "alternatives": [
    {"letter": "A", "text": "...", "file": null, "isCorrect": true},
    ...
  ],
  "local_images": ["images/2023/Q001_....jpg"],
  "_fingerprint": "md5hash"
}
```

**Campos relevantes para o schema da plataforma:**
- `year` → `questoes.ano`
- `index` → `questoes.numero_original`
- `discipline` → base para `topico_id` (mapeamento intermediário por área)
- `context` + `alternativesIntroduction` → `questoes.enunciado` (concatenados)
- `alternatives` → `questoes.alternativas` (jsonb)
- `correctAlternative` → `questoes.gabarito` (nunca exposto ao cliente)
- `local_images` → referência a arquivos físicos (a plataforma fará upload para Supabase Storage)
- `language` → tag secundária (questões de idioma são subconjunto de linguagens)

**Campos ausentes / nullable na origem:**
- `dificuldade`: não existe na fonte → `null` inicialmente
- `topico_id`: não existe → pipeline de mapeamento (ADR-003 seção abaixo)
- `tempo_medio_resolucao_s`: não existe → `null` inicialmente

### UERJ (`questoes_uerj.json`)

Cada objeto tem os campos:

```json
{
  "fonte": "UERJ",
  "ano": 2024,
  "exame": "1º Exame de Qualificação",
  "numero": 15,
  "tipo": "objetiva",
  "contexto": "texto extraído do PDF...",
  "enunciado": "",
  "alternativas": {"A": "...", "B": "...", "C": "...", "D": "..."},
  "gabarito": "B",
  "tem_imagens": false,
  "imagens": ["images/2024/1__exame/Q15_hash_0.jpeg"],
  "_fingerprint": "md5hash"
}
```

**Diferenças importantes em relação ao ENEM:**
- Apenas 4 alternativas (A–D), não 5.
- Campo `tipo` distingue `objetiva` vs `discursiva`.
- Questões discursivas não têm `gabarito` — serão marcadas com `gabarito = null` e `dificuldade = null`.
- Texto extraído de PDF tem qualidade variável (artefatos de OCR, quebras de linha incomuns).
- Questões sem texto extraível (apenas imagens) têm `contexto` curto — precisam de revisão humana.

---

## Pipeline de ingestão

O pipeline é **unidirecional** (leitura dos JSONs → normalização → validação → output), nunca modifica a origem.

### Etapa 1 — Leitura e normalização (`/src/scripts/ingestao/01-normalizar.ts`)

Produz `/content/questoes_normalizadas/enem.json` e `uerj.json` no formato do schema da plataforma:

```typescript
interface QuestaoNormalizada {
  id_origem: string;           // "ENEM-2023-001" ou "UERJ-2024-1Q-015"
  prova: "ENEM" | "UERJ";
  ano: number;
  numero_original: string;
  enunciado: string;           // context + "\n\n" + alternativesIntroduction (ENEM)
                               // contexto + "\n\n" + enunciado (UERJ)
  alternativas: Record<string, string>;  // {A: "...", B: "...", ...}
  gabarito: string | null;     // nunca sai daqui para o cliente
  dificuldade: null;           // calibrado futuramente
  tags_secundarias: string[];  // ["espanhol"] para questões de idioma ENEM
  topico_id_sugerido: null;    // preenchido na Etapa 2
  imagens_locais: string[];
  qualidade: "ok" | "revisar" | "descartar";
  motivo_revisao: string | null;
}
```

**Critérios de qualidade automáticos:**
- `qualidade = "revisar"` se:
  - `enunciado.length < 50` (provável questão apenas com imagens, texto não extraído)
  - `alternativas` tem menos de 4 chaves
  - `gabarito` não pertence a `Object.keys(alternativas)`
  - UERJ: `tipo === "discursiva"` (estrutura diferente, precisa revisão manual)
- `qualidade = "descartar"` se:
  - `alternativas` está vazio E `gabarito` está vazio (questão sem estrutura recuperável)

### Etapa 2 — Mapeamento automático questão→tópico (`/src/scripts/ingestao/02-mapear-topico.ts`)

Heurística em duas camadas:

**Camada A — Mapeamento por área (ENEM)**

O campo `discipline` do ENEM mapeia diretamente para a área do tópico:

```
"ciencias-humanas"    → área "humanas"
"ciencias-natureza"   → área "natureza"
"linguagens"          → área "linguagens"
"matematica"          → área "matematica"
```

Com isso, toda questão do ENEM já tem uma área candidata. Isso é mapeamento de primeiro nível, não de tópico.

**Camada B — Mapeamento por palavras-chave (heurística TF-IDF simples)**

Para cada questão, computar similaridade de seu enunciado contra a lista de tópicos da área:

```typescript
function sugerirTopico(enunciado: string, topicosArea: Topico[]): {
  topico_id: string;
  confianca: number;  // 0–1
  alternativas: string[];  // top-3 candidatos
}
```

A função usará:
1. Busca por palavras-chave específicas por tópico (lista mantida em `mapeamento_keywords.json`).
2. Fallback: TF-IDF simples comparando enunciado com `titulo + descricao` do tópico.

Para UERJ, sem campo `discipline`, o mapeamento depende inteiramente da Camada B.

**Output da Etapa 2:**

Arquivo CSV em `/docs/mapeamentos/questoes_mat.csv` (e equivalentes por área) com:

```csv
id_origem,prova,ano,numero,topico_id_sugerido,confianca,topico_alt_1,topico_alt_2,aprovado_por_humano
ENEM-2015-001,ENEM,2015,1,mat.funcoes.definicao,0.87,mat.funcoes.grafico,mat.algebra.expressoes,
ENEM-2015-002,ENEM,2015,2,mat.geometria.plana.area,0.73,...,...,
```

A coluna `aprovado_por_humano` fica vazia até o humano revisar e validar. **O banco de dados só recebe questões com `aprovado_por_humano` preenchido.**

### Etapa 3 — Seed validado (`/src/scripts/ingestao/03-seed-validado.ts`)

Lê o CSV revisado pelo humano, filtra apenas `aprovado_por_humano != ""`, e chama a Supabase Admin API para inserir em `questoes`. Idempotente (usa `upsert` com `id_origem` como chave única de deduplicação).

### Etapa 4 — Upload de imagens (`/src/scripts/ingestao/04-upload-imagens.ts`)

Para cada questão com `imagens_locais`, faz upload para Supabase Storage em:
```
bucket: questoes-imagens
path: {prova}/{ano}/{id_origem}/{filename}
```

Atualiza o registro da questão no banco com as URLs do Storage.

---

## Casos problemáticos identificados

| Problema | Volume estimado | Tratamento |
|---|---|---|
| UERJ questões apenas-imagem (texto não extraído do PDF) | ~5–10% do UERJ | `qualidade = "revisar"`, aguarda input manual do texto |
| UERJ questões discursivas (sem alternativas) | ~10 por exame discursivo | `qualidade = "revisar"`, usar apenas como material de leitura |
| ENEM questões com imagens mas sem texto complementar | ~15% do ENEM | `qualidade = "ok"` se alternativas têm texto; a imagem já está em `imagens_locais` |
| Gabarito nulo no UERJ (discursivo) | ~10 por exame | `gabarito = null`, questão marcada como não avaliável automaticamente |
| ENEM 2021 pós-prisão: questão com gabarito anulado | raro | Manter gabarito original, tag `"anulada": true` |

---

## O que NÃO acontece nesta estratégia

- Nunca alterar os JSONs originais em `questões/enem/` ou `questões/uerj/`.
- Nunca carregar questões no banco sem validação humana do `topico_id`.
- Nunca usar IA para gerar explicações das questões na v1.
- Nunca descartar questão problemática silenciosamente — sempre registrar em log de ingestão.

---

## Consequências

A Fase 1 produz os arquivos normalizados e o relatório de qualidade. A Fase 3 produz o CSV de mapeamento para cada área (começando por Matemática) aguardando validação humana. O banco só recebe dados após checkpoint humano explícito.
