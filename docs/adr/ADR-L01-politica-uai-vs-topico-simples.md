# ADR-L01 — Política de UAI vs Tópico Simples

**Status:** Aceito  
**Data:** 2026-05-26  
**Autores:** time de produto

---

## Contexto

O BRIEF original trata todos os tópicos da mesma forma: referência a conteúdo externo + avaliação via questões do banco. O adendo de UAIs introduz um segundo modo: Unidade de Aprendizagem Integrada, com teoria inline, simulação interativa e microexercícios formativos.

Construir UAIs tem custo alto (design, código de simulação, escrita de microexercícios, revisão pedagógica). Fazê-las para todos os tópicos é inviável e desnecessário — aprendizagem ativa por interação física agrega valor genuíno apenas quando o tópico tem comportamento manipulável que ilumina o conceito. Para tópicos como literatura ou filosofia, texto de qualidade faz o trabalho melhor que qualquer simulação.

Este ADR define os critérios objetivos e o processo de decisão para classificar um tópico como UAI ou tópico simples.

---

## Decisão

### Critérios de qualificação para UAI

Um tópico é candidato a UAI se atender ao **critério obrigatório** e a **pelo menos dois critérios de reforço**.

**Critério obrigatório (necessário, não suficiente):**

> Existe um fenômeno ou processo com parâmetros contínuos manipuláveis cujo efeito é diretamente observável e relevante para a compreensão do conceito.

**Critérios de reforço (precisam de dois):**

| # | Critério | Exemplos positivos | Exemplos negativos |
|---|---|---|---|
| R1 | O tópico aparece em pelo menos 3 questões do banco ENEM/UERJ nos últimos 5 anos | Diluições, cinemática, genética | Polissíndeto, filosofia pré-socrática |
| R2 | Existe erro conceitual comum documentado que simulação pode corrigir por evidência direta | "Objetos pesados caem mais rápido", "misturar volumes = somar concentrações" | "Machado de Assis foi realista" |
| R3 | A relação numérica entre variáveis é não-intuitiva sem visualização | C₁V₁=C₂V₂, torque, equilíbrio químico | Classificação de palavras, biomas |
| R4 | Simulação equivalente em PhET ou outra fonte aberta existe (facilita L1 → UAI sem custo total) | Concentração de soluções, circuitos, genética | Análise literária, história política |
| R5 | O conceito tem transferência alta: dominar via UAI desbloqueia outros tópicos com clareza | Mol e estequiometria → diluições → titulação | Realismo literário → outros movimentos |

### Exemplos classificados

| Tópico | Qualifica? | Racional |
|---|---|---|
| Diluições (CN.QUIM.DILUICOES) | **Sim — UAI** | Todos: fenômeno manipulável, alta frequência ENEM, erro "somar volumes" é clássico, PhET existe, desbloqueia titulação |
| Estequiometria | **Sim — UAI** | Fenômeno manipulável (mol), erro de proporção é comum, PhET parcial, desbloqueia toda química quantitativa |
| Cinemática | **Sim — UAI** | Gráfico v×t manipulável, PhET existe, frequência alta, desbloqueia dinâmica |
| Eletrodinâmica básica | **Sim — UAI** | Circuito manipulável, Lei de Ohm é relação não-intuitiva, PhET excelente |
| Genética mendeliana | **Sim — UAI** | Quadrado de Punnett manipulável, erro de probabilidade é frequente |
| Ecologia (pirâmides) | **Sim — UAI** | Fluxo de energia é manipulável, relação 10% é não-intuitiva |
| Literatura modernismo | **Não — tópico simples** | Sem fenômeno manipulável; texto + questões entregam mais |
| Filosofia iluminismo | **Não — tópico simples** | Sem relação numérica; narrativa histórica não se beneficia de simulação |
| História do Brasil colonial | **Não — tópico simples** | Narrativa; questionário guiado é suficiente |
| Variação linguística | **Não — tópico simples** | Análise qualitativa; nenhum critério de reforço atendido |

### Processo de decisão para novos tópicos

```
1. Aplica critério obrigatório?
   └─ Não → Tópico simples. Registrar em /docs/mapeamentos/uai-candidatos.md
   └─ Sim → continua

2. Atende ≥ 2 critérios de reforço?
   └─ Não → Tópico simples por padrão. Pode ser reclassificado com evidência futura.
   └─ Sim → Candidato a UAI

3. Existe PhET ou simulação aberta cobrindo o tópico adequadamente?
   └─ Sim → UAI com PhET (ver ADR-L02)
   └─ Não → UAI com simulação custom — registrar justificativa em ADR-L02

4. Incluir na próxima fase de expansão (nunca construir sem aprovação do produto)
```

### Manutenção da lista

O arquivo `/docs/mapeamentos/uai-candidatos.md` registra todos os tópicos com sua classificação, critérios atendidos e fase prevista. Atualizar a cada fase.

---

## Justificativas

**Por que não fazer UAI para tudo?** Custo de criação e manutenção. Uma UAI bem feita (conteúdo, simulação, microexercícios, revisão pedagógica, acessibilidade) leva ~40–80h de trabalho. Com ~80 tópicos na plataforma, o custo total seria proibitivo. A abordagem seletiva concentra investimento onde o retorno pedagógico é maior.

**Por que exigir critério obrigatório + dois reforços?** Evitar o viés de "simulação sempre é melhor". Pesquisa de learning science (Sweller, Mayer) indica que multimídia só ajuda quando reduz carga cognitiva estranha. Para tópicos textuais, animação pode ser distração, não auxílio.

**Alternativa rejeitada — pontuar tópicos e usar threshold:** Pontuação cria falsa precisão. Critérios binários são mais auditáveis e menos sujeitos a manipulação ("adicione um ponto aqui para chegar ao threshold").

---

## Consequências

### Positivas
- Escopo de UAIs controlado e justificado
- Critérios auditáveis — não há decisões subjetivas sem documentação
- Lista de candidatos disponível para planejamento de fases futuras

### Negativas / riscos
- Critério obrigatório pode ser interpretado de forma ampla. Mitigação: exigir que o fenômeno tenha **variável numérica contínua** manipulável, não apenas "qualquer interação".
- Tópicos borderline exigirão julgamento. Mitigação: decisão sempre documentada em `/docs/mapeamentos/uai-candidatos.md`.

---

## Desvios futuros

Reclassificar um tópico de simples para UAI exige: (a) evidência de que alunos cometem o erro conceitual alvo com frequência alta; (b) confirmação de que simulação específica existe ou pode ser construída com custo razoável; (c) aprovação no relatório de fase.
