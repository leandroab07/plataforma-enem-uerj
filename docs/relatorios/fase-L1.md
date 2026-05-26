# Relatório — Fase L1: Template e Infraestrutura de UAI

**Data de conclusão:** 2026-05-26  
**Fase:** L1 (sem conteúdo real de produção — template validado)  
**Status:** Concluído — aguardando aprovação para iniciar Fase L2

---

## Resumo executivo

A Fase L1 estabeleceu a infraestrutura completa para Unidades de Aprendizagem Integradas (UAIs): schema de banco de dados, tipos TypeScript, rota de navegação e template de UI com as 6 seções. A UAI de Diluições (`CN.QUIM.DILUICOES`) foi construída com conteúdo real (não lorem ipsum) para validar o template em condições representativas.

---

## Entregas

### Dependências instaladas

| Pacote | Uso |
|---|---|
| `framer-motion` | Transições de seção e feedback de microexercícios |
| `katex` + `@types/katex` | Renderização de fórmulas matemáticas (display mode) |
| `konva` + `react-konva` | Preparado para Fase L2 (simulações custom) — não usado em L1 |

### Arquivos criados / modificados

| Arquivo | Tipo | Descrição |
|---|---|---|
| `web/src/lib/uai-types.ts` | Novo | Interfaces TypeScript: UAI, ConteudoUAI, Microexercicio, ProgressoUAI, TentativaUAI |
| `web/src/lib/uai-data.ts` | Novo | Mock data com UAI completa de Diluições (conteúdo real das 6 seções) |
| `web/src/pages/UAIPage.tsx` | Novo | Página completa com template das 6 seções + lógica de microexercícios |
| `web/src/App.tsx` | Modificado | Rota `/aprender/:uaiId` adicionada |
| `supabase/migrations/20260526_uai_schema.sql` | Novo | Schema: `unidades_aprendizagem`, `tentativas_uai`, `progresso_uai` com RLS |

### Schema do banco de dados

Três tabelas criadas com RLS:

- **`unidades_aprendizagem`**: catálogo de UAIs, conteúdo como JSONB, status (rascunho/revisao/publicada)
- **`tentativas_uai`**: microexercícios formativos, `secao check (1..4)` impede registro de seção 5
- **`progresso_uai`**: rastreamento de qual seção o aluno está, com trigger de `ultima_interacao`

Separação formativo/somativo implementada por constraint de banco: a coluna `secao` em `tentativas_uai` tem `check (secao between 1 and 4)` — seção 5 (somativa) é fisicamente impossível de registrar aqui.

---

## Template das 6 seções

| # | Seção | Status em L1 | Implementado |
|---|---|---|---|
| 1 | Abertura — Pergunta-âncora | Completo | Card com pergunta provocativa + botão de início |
| 2 | Intuição — Cena interativa | Placeholder | Área da simulação visível com mensagem "Fase L3" |
| 3 | Formalização — Teoria + KaTeX | Completo | Renderização de texto, fórmulas KaTeX, destaques, listas, exemplos |
| 4 | Prática guiada — Microexercícios | Completo | Fluxo completo: opções → 1º erro → dica → 2ª tentativa → feedback |
| 5 | Aplicação — Questões reais | Placeholder | Explicação + placeholder visual; vinculação de questões em L3 |
| 6 | Síntese — Resumo + conexões | Completo | Resumo textual + cards de tópicos desbloqueados + estado de conclusão |

### Fluxo de microexercícios (Seção 4)

1. Aluno seleciona opção
2. **Se errar (1ª vez):** dica aparece, opção incorreta fica desabilitada, aluno tenta novamente
3. **Se errar (2ª vez) ou acertar:** feedback com explicação completa aparece
4. Avança para próximo exercício
5. Ao final: tela de resultado com contagem de acertos
6. Botão "Ir para questões reais" aparece após conclusão de todos os microexercícios

### KaTeX

Fórmulas do tipo `formula` na teoria são renderizadas com `katex.renderToString()` em display mode, sobre fundo `bg-slate-950` (terminal aesthetic, consistente com o resto da plataforma).

---

## Navegação e acessibilidade

- **Breadcrumb de 6 pontos**: pontos clicáveis apenas para seções já acessadas (não permite pular para frente)
- **Scroll para o topo** ao trocar de seção
- **`aria-label`** em todos os botões do breadcrumb
- **`aria-pressed`** nas opções de múltipla escolha
- **`aria-label`** na área de simulação placeholder

---

## Rota

```
/aprender/:uaiId
```

Exemplo funcional: `/aprender/CN.QUIM.DILUICOES`

---

## Impacto no bundle

| Antes de L1 | Depois de L1 |
|---|---|
| 647 kB (gzip: 194 kB) | 1.052 kB (gzip: 318 kB) |

Aumento de ~405 kB (não gzip) devido a KaTeX (fontes) + Framer Motion. Mitigação planejada: lazy-loading de `/aprender/*` via `React.lazy()` — não implementado em L1 para manter escopo simples. Registrar como task em L2.

---

## Validação do template

A UAI de Diluições tem conteúdo pedagógico real e representativo:
- Pergunta-âncora: cálculo de diluição com contexto de suco de laranja
- Teoria: 6 seções com texto + fórmula C₁V₁=C₂V₂ em KaTeX + destaque + lista + exemplo
- 3 microexercícios com dicas específicas e explicações detalhadas
- Conexões para Estequiometria e Equilíbrio Químico

---

## O que NÃO foi feito (intencional)

- Sem integração com Supabase (demo mode, mock data) — L3 conecta
- Sem simulação custom — L2 constrói biblioteca, L3 integra
- Sem questões reais na seção 5 — L3 mapeia questões do banco para este tópico
- Sem gravação de `tentativas_uai` no banco — L3 implementa RPC
- Sem lazy-loading do bundle — registrar como tech debt a resolver em L2

---

## Critérios de aprovação para iniciar Fase L2

- [ ] Template das 6 seções aprovado visualmente (navegar em `/aprender/CN.QUIM.DILUICOES`)
- [ ] Fluxo de microexercícios (dica → feedback) aprovado
- [ ] KaTeX rendering da fórmula C₁V₁=C₂V₂ legível
- [ ] Confirmação de que Konva.js pode ser usado para L2 (dependência já instalada)

---

## Próxima fase

**Fase L2 — Biblioteca de simulação química**

Escopo:
- `Bancada.tsx` — canvas Konva principal
- `Bequer.tsx` — vidraria com drag-and-drop, volume, conteúdo
- `Substancia.ts` + `Mistura.ts` — modelo físico com conservação de massa
- `PainelMedicao.tsx` — exibe concentração, volume, pH
- Modo passo-a-passo para acessibilidade
- Storybook para cada componente

Sem UAI real ainda — apenas a biblioteca isolada.

Aguardo aprovação desta fase antes de iniciar L2.
