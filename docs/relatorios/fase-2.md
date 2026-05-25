# Relatório — Fase 2: Modelagem de Tópicos e Enriquecimento de Gabaritos

**Data:** 2026-05-25  
**Status:** Aguardando aprovação para Fase 3  
**Scripts:** `01b-enriquecer-gabaritos-uerj.py`, `02-validar-topicos.py`  
**Output:** `content/topicos/*/topicos.json`, `content/topicos/todos.json`, `content/questoes_normalizadas/uerj.json` (atualizado)

---

## Parte 1 — Enriquecimento de Gabaritos UERJ

### Resultado

| Métrica | Valor |
|---|---|
| Gabaritos recuperados (automático, PDFs 2020–2026) | **63** |
| Gabaritos já presentes (sem alteração) | 367 |
| Objetivas sem gabarito 2014–2019 (template criado) | 365 |

### Estado atual das objetivas UERJ

| Ano | Objetivas ok | Revisar | Sem gabarito |
|---|---|---|---|
| 2014 | 0 | 91 | 91 |
| 2015 | 0 | 1 | 1 |
| 2017 | 0 | 54 | 54 |
| 2018 | 0 | 116 | 116 |
| 2019 | 0 | 103 | 103 |
| 2020 | **113** | 2 | 1 |
| 2022 | **51** | 4 | 3 |
| 2023 | **48** | 3 | 2 |
| 2024 | **105** | 2 | 0 |
| 2025 | **109** | 4 | 0 |
| 2026 | 77 | 38 | 37 |
| **Total** | **503 (55%)** | 418 | 408 |

### Por que 2014–2019 não têm gabarito automático

Após análise dos PDFs via PyMuPDF e pdfplumber, confirmou-se que:

- Os PDFs de 2014–2019 são versões comentadas **sem label "Gabarito: X"**. O gabarito está implícito no texto do comentário (que explica o raciocínio da resposta correta, mas não a nomeia por letra).
- Os PDFs de 2020+ têm label explícita "Gabarito: B." após cada comentário — foi essa mudança de formato que permitiu a extração automática.

### Template para 2014–2019

Criado em `content/questoes_normalizadas/gabaritos_manuais_uerj.json` com estrutura:

```json
{
  "2014_1o_exame_de_qualificacao": {
    "ano": 2014,
    "exame": "1º Exame de Qualificação",
    "_instrucao": "Preencha 'gabarito' com A, B, C ou D para cada questão...",
    "questoes": {
      "1": { "gabarito": null },
      "2": { "gabarito": null },
      ...
    }
  }
}
```

Ao preencher e re-executar `01b-enriquecer-gabaritos-uerj.py`, os gabaritos são aplicados automaticamente ao `uerj.json` normalizado.

### Granularidade da decisão

As 365 questões de 2014–2019 têm texto e alternativas válidos — apenas falta o gabarito. São questões de qualidade potencialmente alta (anos com provas clássicas). Recomendo preencher o template manualmente em uma sessão de trabalho (~2–3 horas para 365 respostas), usando os gabaritos oficiais disponíveis em arquivos físicos ou publicações da UERJ.

---

## Parte 2 — Modelagem de Tópicos

### Resumo

| Área ENEM | Disciplinas | Tópicos | Raízes | Folhas |
|---|---|---|---|---|
| Matemática | matemática | 29 | 4 | 14 |
| Ciências da Natureza | física + química + biologia | 51 | 4 | 25 |
| Ciências Humanas | história + geografia + filosofia + sociologia | 35 | 9 | 14 |
| Linguagens | port. + literatura + artes + inglês + espanhol | 12 | 5 | 9 |
| **Total** | — | **127** | **18** | **62** |

O grafo passou pela validação completa:
- ✓ Sem IDs duplicados
- ✓ Sem referências quebradas (todo `pre_requisito` existe como ID)
- ✓ Grafo é um DAG (algoritmo de Kahn — nenhum ciclo detectado)

### Critérios de granularidade adotados

Escolheu-se **granularidade média-fina**: nem tópicos amplos demais (ex: "Funções" único) nem excesso de sub-habilidades (ex: "Funções — Domínio de f(x) = √(x-2)").

Regra prática: cada tópico deve comportar entre **8 e 25 questões** no banco ENEM + UERJ. Com 2.673 questões ENEM e ~450 objetivas UERJ com gabarito (2020+), os 127 tópicos implicam média de ~25 questões por tópico — suficiente para o threshold de 5 únicas acertadas (ADR-005) sem esgotar rapidamente o banco.

### Estrutura dos arquivos

```
content/topicos/
  matematica/topicos.json     → 29 tópicos (N1:4, N2:13, N3:10, N4:2)
  fisica/topicos.json         → 18 tópicos (N1:1, N2:9, N3:6, N4:2)
  quimica/topicos.json        → 17 tópicos (N1:2, N2:8, N3:7)
  biologia/topicos.json       → 16 tópicos (N1:1, N2:10, N3:5)
  historia/topicos.json       → 14 tópicos (N1:4, N2:10)
  geografia/topicos.json      → 11 tópicos (N1:4, N2:6, N3:1)
  filosofia/topicos.json      → 5 tópicos  (N2:3, N3:2)
  sociologia/topicos.json     → 5 tópicos  (N2:4, N3:1)
  linguagens/topicos.json     → 12 tópicos (N1:5, N2:7)
  todos.json                  → merge completo (127 tópicos)
```

### Schema por tópico

```typescript
{
  id: string;                    // "mat.funcoes.linear"
  titulo: string;                // "Funções Lineares e Afins"
  descricao: string;             // para keyword matching na Fase 3
  area: string;                  // área ENEM (ciencias-natureza, etc.)
  disciplina: string;            // física, química, biologia, etc.
  nivel: 1 | 2 | 3 | 4;        // complexidade curricular
  pre_requisitos: string[];      // IDs de pré-requisitos
  peso_enem_estimado: null;      // calibrar com dados reais (Fase 6+)
  peso_uerj_estimado: null;      // calibrar com dados reais (Fase 6+)
  keywords: string[];            // termos para Fase 3 (mapeamento automático)
}
```

### Lacunas documentadas

1. **`peso_enem_estimado` e `peso_uerj_estimado`:** todos `null` — calibrar com contagem histórica de questões por tópico após a Fase 3.

2. **Conexões inter-áreas:** tópicos de áreas diferentes que se conectam (ex: `qui.organica.basico` → `bio.celula.metabolismo`) não foram modelados com pré-requisitos cruzados para não complicar o DAG na v1. Esses vínculos existem em `keywords` sobrepostos.

3. **Cobertura UERJ específica:** a UERJ testa alguns subtópicos de Matemática com profundidade maior (ex: `mat.numeros.complexos`, `mat.geometria.analitica.conicas`) — incluídos como nível 4 com peso UERJ estimado alto. Confirmação aguarda a contagem de questões na Fase 3.

4. **Língua Estrangeira:** inglês e espanhol são tratados como um único tópico de compreensão de texto cada — o ENEM e UERJ não detalham sub-habilidades gramaticais.

---

## O que a Fase 3 vai produzir

Ao aprovar esta fase, a Fase 3 executará:

1. **Script de mapeamento automático** (`03-mapear-topico.py`): para cada questão em `enem.json` e `uerj.json`, sugere `topico_id` com score de confiança usando keywords + TF-IDF. Saída: CSVs por área em `docs/mapeamentos/`.

2. **Revisão humana**: CSV com colunas `id_origem`, `topico_sugerido`, `confianca`, `aprovado`. Você revisa e preenche `aprovado` (sim/não) e, se não, insere `topico_corrigido`.

3. **Relatório** em `/docs/relatorios/fase-3.md`: taxa de confiança alta (≥0.8), cobertura por tópico (questões mapeadas / total esperado).

A Fase 3 começa apenas por **Matemática** — a área mais bem delimitada, com keywords mais precisas. Após validação, estende para as demais áreas.

A Fase 3 NÃO vai: popular o banco de dados (Fase 4+), criar código de produção.

---

## Perguntas para você antes da Fase 3

1. **Gabaritos 2014–2019:** Você tem acesso físico aos gabaritos oficiais da UERJ para esses anos? Se sim, prefere preencher o template agora (antes da Fase 3) para maximizar o banco disponível no mapeamento?

2. **Escopo do mapeamento manual:** A Fase 3 produz ~2.689 sugestões de mapeamento ENEM + ~450 UERJ ativas = ~3.100 linhas de CSV para revisar. Você vai revisar tudo de uma vez ou prefere por área (por ex. Matemática primeiro, depois Ciências da Natureza)?

3. **Questões de linguagens:** Questões de língua estrangeira (inglês/espanhol) representam ~120 questões no ENEM. Você quer que elas entrem no banco desde a Fase 4, ou quer focar primeiro nas áreas de exatas/biológicas (mais relevantes para Medicina)?

---

**Aguardando aprovação para iniciar a Fase 3.**
