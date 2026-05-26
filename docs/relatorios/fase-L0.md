# Relatório — Fase L0: ADRs de Unidades de Aprendizagem Integradas

**Data de conclusão:** 2026-05-26  
**Fase:** L0 (sem código — apenas documentação)  
**Status:** Concluído — aguardando aprovação para iniciar Fase L1

---

## Resumo executivo

A Fase L0 estabeleceu as bases documentais para o sistema de Unidades de Aprendizagem Integradas (UAIs) conforme definido no adendo ao BRIEF original. Cinco ADRs foram escritos, cobrindo as decisões arquiteturais, pedagógicas e de design que guiarão todas as fases subsequentes.

Nenhum código foi produzido nesta fase — intencional e conforme o escopo definido.

---

## Entregas

### ADRs produzidos

| ADR | Título | Decisão central |
|---|---|---|
| ADR-L01 | Política de UAI vs Tópico Simples | Critério obrigatório (fenômeno manipulável contínuo) + ≥2 de 5 critérios de reforço para qualificar como UAI |
| ADR-L02 | PhET vs Simulação Custom | PhET primeiro; simulação custom apenas por: ausência, inadequação didática, necessidade de validação de estado interno (C3), ou especificidade curricular |
| ADR-L03 | Separação tentativas_uai vs tentativas | Separação hard: microexercícios (seção 4) → tentativas_uai (formativo, não alimenta mastery); questões reais (seção 5) → tentativas (somativo, mastery normal) |
| ADR-L04 | Design System e Diretrizes Visuais | Inter + paleta semântica + KaTeX + Framer Motion + Konva; estilo cartoon profissional (Brilliant/PhET/Khan), nunca infantilizado |
| ADR-L05 | Acessibilidade em Simulações | WCAG 2.1 AA obrigatório; modo passo-a-passo em toda simulação custom; aria-live para estado da simulação; teclado completo |

### Documentos auxiliares

| Arquivo | Conteúdo |
|---|---|
| `/docs/design-system.md` | Referência visual completa: paleta, tipografia, componentes, animações, vidrarias |
| `/docs/mapeamentos/uai-candidatos.md` | Classificação de todos os tópicos atuais da plataforma em UAI / Simples / Pendente |

---

## Decisões de escopo confirmadas

**UAIs prioritárias (em ordem de execução):**

1. **L3 — Diluições (CN.QUIM.DILUICOES):** Prova de conceito. Simulação custom por necessidade de validação de estado (C3). Antes de aprovar L4, esta UAI deve ser testada pelo produto.
2. **L4 — Estequiometria (CN.QUIM.ESTEQUIOMETRIA):** Segunda UAI. Reutiliza biblioteca de simulação química construída em L2.
3. **L5+ — Cinemática + Eletrodinâmica:** Via PhET embed, sem simulação custom nova.
4. **L6 — Genética, Ecologia, Funções, Equilíbrio:** A definir na fase — depende de aprovação de L3.

**Tópicos confirmados como simples (sem UAI):** Literatura, Filosofia, Sociologia, História, Gramática, Variação linguística, Redação, Geografia descritiva.

---

## Stack técnica confirmada para UAIs

Adições ao stack do BRIEF original:

| Biblioteca | Versão | Uso | Status |
|---|---|---|---|
| `react-konva` + `konva` | latest | Canvas interativo para simulações custom | A instalar em L1 |
| `framer-motion` | latest | Transições e micro-animações de seção | A instalar em L1 |
| `react-katex` + `katex` | latest | Fórmulas matemáticas | A instalar em L1 |

Nenhuma outra biblioteca foi adicionada à stack. Recharts já presente no ecossistema para gráficos se necessário.

---

## Riscos identificados nesta fase

| Risco | Probabilidade | Impacto | Mitigação documentada |
|---|---|---|---|
| PhET muda URLs ou descontinua simulações | Média | Alto | ADR-L02: verificar URLs antes de cada release; considerar self-hosting |
| Erro de modelagem física em simulação custom | Média | Alto | ADR-L02: revisão por especialista obrigatória antes de produção |
| Scope creep de UAIs (construir onde não agrega) | Alta | Médio | ADR-L01: critérios binários auditáveis; lista de candidatos documentada |
| Acessibilidade retrofitada (não desde o início) | Média | Alto | ADR-L05: checklist obrigatório em todo PR de componente de simulação |

---

## Critérios de aprovação para iniciar Fase L1

- [ ] ADRs L01–L05 revisados e aprovados pelo produto
- [ ] Classificação de UAI para Diluições confirmada (Custom, C3)
- [ ] Design system revisado e paleta aprovada
- [ ] Confirmação de que Framer Motion + Konva + KaTeX podem ser adicionados ao bundle (impacto: ~80kb gzip lazy-loaded)

---

## Próxima fase

**Fase L1 — Template e infraestrutura de UAI**

Escopo resumido:
- Schema `unidades_aprendizagem`, `tentativas_uai`, `progresso_uai` no Supabase com RLS
- Rota `/aprender/:uaiId` com layout das 6 seções
- Componentes genéricos de navegação, checkpoint, seção
- KaTeX integrado
- Placeholder onde simulação entraria
- UAI de exemplo com conteúdo lorem ipsum para validar template

**Sem conteúdo real ainda. Sem simulação ainda.**

Aguardo aprovação desta fase antes de iniciar L1.
