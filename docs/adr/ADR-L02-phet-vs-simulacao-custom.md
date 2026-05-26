# ADR-L02 — PhET vs Simulação Custom

**Status:** Aceito  
**Data:** 2026-05-26  
**Autores:** time de produto

---

## Contexto

Quando um tópico é classificado como UAI (ver ADR-L01), a seção de simulação pode ser satisfeita de três formas:

1. **Embed de PhET** — simulação já existente, licença aberta, alta qualidade didática
2. **Simulação custom** — construída com React + Konva.js no próprio codebase
3. **Nenhuma** — UAI sem simulação, apenas teoria + microexercícios + questões

PhET (University of Colorado, phet.colorado.edu) oferece ~150 simulações HTML5 com licença CC-BY 4.0. São didaticamente robustas, peer-reviewed, e cobriam mais de 40 países. Construir equivalente custom tem custo alto e risco de modelagem incorreta.

Este ADR define o fluxograma de decisão entre as três opções e os critérios para justificar simulação custom.

---

## Decisão

### Fluxograma de decisão

```
Tópico classificado como UAI
            │
            ▼
Existe simulação PhET cobrindo o conceito central?
            │
    ┌───────┴───────┐
   Não             Sim
    │               │
    │    A simulação é didaticamente adequada para ENEM?
    │    (critérios abaixo)
    │               │
    │       ┌───────┴───────┐
    │      Não             Sim
    │       │               │
    │       │    A simulação é embeddável via iframe
    │       │    sem bloqueio de X-Frame-Options?
    │       │               │
    │       │       ┌───────┴───────┐
    │       │      Não             Sim
    │       │       │               │
    └───────┘       │          ── PhET embed ──
         │          │          Componente <SimulacaoPhET>
         │          │          com atribuição CC-BY visível
         ▼          ▼
    Simulação      Link externo
    custom         com instruções
    (Konva.js)     (sem embed)
```

### Critérios de adequação didática do PhET

PhET é adequado se atender **todos** os critérios:

| Critério | Como verificar |
|---|---|
| Cobre o conceito central do tópico, não apenas conceito relacionado | Testar a simulação contra o objetivo de aprendizagem da UAI |
| Interface em português disponível ou terminologia não cria confusão | Verificar opções de idioma no PhET |
| Não exige Java ou Flash (somente HTML5) | Verificar badge "HTML5" na página do PhET |
| Nível de complexidade compatível com ensino médio (não universitário avançado) | Avaliar se aluno de 17 anos consegue operar sem instrução extensa |

### Critérios obrigatórios para justificar simulação custom

Simulação custom só é construída se **pelo menos um** dos seguintes for verdadeiro:

| Critério | Exemplo |
|---|---|
| **C1 — Ausência:** Não existe PhET nem simulação aberta equivalente | Diluição com vidrarias específicas do currículo ENEM |
| **C2 — Inadequação:** PhET existe mas cobre versão universitária do conceito, não EM | PhET de termodinâmica → ciclo de Carnot (não é ENEM) |
| **C3 — Integração:** Precisamos validar estado-alvo da simulação nos microexercícios (impossível no PhET) | "Prepare 500 mL de NaCl 0,5 mol/L" — exige leitura do estado interno |
| **C4 — Especificidade curricular:** O conceito aparece no ENEM com contexto específico que PhET não modela | Questão de UERJ com vidraria labelled com marcas brasileiras |

**Critério C3 é o mais importante.** Se os microexercícios da seção 4 precisam validar que o aluno chegou a um estado específico (não apenas "responda após brincar"), PhET não serve — não há API para ler seu estado interno.

### Mapeamento de tópicos UAI planejados

| Tópico | UAI ID | PhET candidato | Opção escolhida | Critério |
|---|---|---|---|---|
| Diluições | CN.QUIM.DILUICOES | "Concentration" (phet.colorado.edu/pt/simulations/concentration) | Custom | C3 — validação de estado-alvo |
| Estequiometria | CN.QUIM.ESTEQUIOMETRIA | "Reactants, Products and Leftovers" | Custom | C3 — validação mol exato |
| Cinemática | CN.FIS.CINEMATICA | "The Moving Man" | PhET embed | Adequado, sem validação de estado |
| Eletrodinâmica básica | CN.FIS.ELETRODIN | "Circuit Construction Kit: DC" | PhET embed | Adequado para EM |
| Genética mendeliana | CN.BIO.GENETICA | — | Custom | C1 — ausência de PhET para Punnett ENEM-específico |
| Ecologia (pirâmides) | CN.BIO.ECOLOGIA | — | Custom | C1 — ausência |

### Requisitos para simulação custom aprovada

Toda simulação custom deve antes de entrar em produção:

1. **Modelagem fisicamente/quimicamente correta revisada** — pelo menos uma leitura do código por pessoa com formação na área
2. **Serialização de estado** — snapshot JSON representando cena completa
3. **Validação de estado-alvo** — função `validarEstado(atual: EstadoSim, esperado: EstadoSim, tolerancia: number): boolean`
4. **Modo passo-a-passo** — substitui interação livre por sequência guiada (acessibilidade; ver ADR-L05)
5. **Storybook story** — pelo menos um story por componente da biblioteca `/src/components/simulacao_quimica/`

---

## Justificativas

**Por que PhET primeiro?** Custo vs. qualidade. PhET investe anos em cada simulação, com testes com alunos reais. Construir equivalente own-brand leva semanas e tem risco de erro de modelagem. Para simulações onde não precisamos de validação de estado interno, PhET é claramente superior.

**Por que CC-BY exige atribuição visível?** A licença Creative Commons Attribution 4.0 exige crédito ao criador original (University of Colorado Boulder / PhET Interactive Simulations). Não é apenas ética — é obrigação legal. Toda embed de PhET deve incluir texto "Simulação: PhET Interactive Simulations, University of Colorado Boulder (CC-BY 4.0)" visível na UI.

**Por que Konva.js para simulações custom?** SVG puro tem boa performance para SVGs estáticos ou com poucas animações. Para simulações com múltiplos objetos arrastáveis, colisão, e atualização de estado a 60fps, o overhead do DOM do SVG fica perceptível. Konva usa Canvas 2D, que é ~3× mais performático para esse caso de uso. Canvas 2D é suportado em todos os browsers alvo. (Three.js/WebGL seria overkill para simulações 2D de laboratório.)

**Alternativa rejeitada — P5.js:** Boa biblioteca para arte generativa, mas não tem modelo de componentes React nativo. Integrar com React exige workarounds. Konva tem `react-konva` como binding oficial.

**Alternativa rejeitada — d3.js:** Excelente para visualizações de dados, mas não é uma engine de simulação interativa. Manipulação de objetos arrastáveis em d3 é verbosa e manutenção difícil.

---

## Consequências

### Positivas
- Economia de custo: tópicos com PhET adequado não precisam de dev de simulação
- Atribuição CC-BY garante conformidade legal
- Critério C3 (validação de estado) é o gatilho claro para custom vs. embed
- Mapeamento de tópicos documentado permite planejamento de fases

### Negativas / riscos
- PhET pode mudar URLs ou descontinuar simulações. Mitigação: verificar URLs antes de cada release; considerar self-hosting do HTML5 bundle para simulações críticas (PhET permite redistribuição sob CC-BY).
- Simulação custom tem risco de erro de modelagem. Mitigação: revisão por especialista + testes de unidade para as funções de cálculo (ex.: `calcularConcentracaoFinal`, `calcularMolsNaReacao`).

---

## Desvios futuros

Qualquer adição de nova biblioteca de simulação (além de Konva.js) requer ADR próprio com justificativa de por que Konva não resolve o caso. Não há exceção para "é mais fácil".
