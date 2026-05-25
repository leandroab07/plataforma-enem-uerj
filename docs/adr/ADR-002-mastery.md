# ADR-002 — Modelo de Mastery (conhecimento do aluno)

**Status:** Aceito  
**Data:** 2026-05-24  
**Autores:** time de produto

---

## Contexto

O coração da plataforma é estimar o quanto um aluno domina um tópico dado seu histórico de tentativas. Esse score precisa:

1. Atualizar em tempo real após cada resposta.
2. Modelar esquecimento (aluno que não pratica regride).
3. Penalizar re-acerto da mesma questão (anti-memorização).
4. Funcionar com poucos dados (cold start: primeiras 3–5 tentativas).
5. Ser auditável: o aluno deve conseguir entender por que está "enfraquecido".
6. Ser implementável sem infraestrutura de ML (sem treinamento, sem GPU).

---

## Alternativas avaliadas

### Opção A: BKT — Bayesian Knowledge Tracing (Corbett & Anderson, 1994)

Modelo clássico de ITS. Representa o conhecimento como variável latente binária (aprendeu / não aprendeu). Quatro parâmetros por tópico:
- `P(L0)`: probabilidade de já saber antes da primeira tentativa
- `P(T)`: probabilidade de aprender após cada tentativa
- `P(G)`: probabilidade de acertar sem saber (chute)
- `P(S)`: probabilidade de errar sabendo (deslize)

**Prós:** Fundamentação teórica sólida, amplamente validado em pesquisa de ITS.

**Contras:**
- Estado binário (sabe / não sabe) é inadequado para tópicos com gradação de domínio como "Funções" (que vai de "reconhece função" a "demonstra propriedades de bijeção").
- Não modela esquecimento — uma vez marcado como "aprendido", o BKT não regride.
- Estimativa dos 4 parâmetros requer corpus calibrado de pelo menos 200–500 alunos por tópico. Não temos esse volume no cold start.
- A extensão BKT com forgetting (Qiu et al.) adiciona complexidade sem eliminar a limitação do estado binário.

**Veredito: rejeitado.** Inadequado para modelar gradação de domínio e esquecimento sem corpus calibrado.

---

### Opção B: Elo adaptado (estilo Duolingo, 2016)

Modela tanto habilidade do aluno (θ_aluno) quanto dificuldade de cada questão (δ_questao) como escalares. Após cada resposta, atualiza os dois com passo K:

```
P(acerto) = 1 / (1 + exp(-(θ - δ)))
θ_novo = θ + K × (acertou - P(acerto))
```

**Prós:** Simples, interpretável, calibra dificuldade das questões automaticamente com uso.

**Contras:**
- Requer volume de dados para calibrar δ das questões (Elo de uma questão nova é impreciso até ~30 respostas de alunos diferentes). Plataforma no início tem 1 aluno.
- Score único por aluno (não por tópico) — incompatível com a necessidade de `mastery_score(topico)` granular.
- Não modela esquecimento nativamente.
- Re-tentativa da mesma questão contamina o Elo (aluno pode inflar θ respondendo a mesma fácil repetidamente).

**Veredito: rejeitado** para mastery principal. Pode ser usado futuramente para calibrar `dificuldade` das questões (campo nullable no schema) quando tivermos volume de dados.

---

### Opção C: IRT — Item Response Theory (2PL/3PL)

Gold standard em psicometria. Modela:
- `a`: discriminação da questão (quanto o item diferencia alunos)
- `b`: dificuldade
- `c`: chute (modelo 3PL)
- `θ`: habilidade latente do aluno

Estimativa via EM (Expectation-Maximization) ou MCMC.

**Prós:** Mais preciso quando calibrado, separa habilidade do aluno de dificuldade do item.

**Contras:**
- Exige corpus de calibração: mínimo ~500 respondentes por item para estimativa estável de `a` e `b`.
- Não implementável no frontend/edge sem biblioteca especializada (ltm em R, mirt em R, ou pyirt em Python) — vai contra a stack escolhida.
- Não modela esquecimento.
- Opaco ao aluno ("sua habilidade latente é 1.23 logits" não é acionável).

**Veredito: rejeitado** para v1. Considerar como extensão futura para calibrar parâmetros de questões quando base de usuários crescer.

---

### Opção D: Beta-Binomial com decaimento exponencial (escolhida)

Modelo probabilístico simples, implementável em TypeScript puro, sem dependências externas.

#### Fundamento teórico

A distribuição Beta é conjugada à Bernoulli: dado um prior Beta(α, β) e n_acertos de n_tentativas, o posterior é Beta(α + n_acertos, β + n_erros). A média do posterior é a estimativa natural do mastery.

```
mastery_raw = (PRIOR_ALPHA + acertos_ponderados) / 
              (PRIOR_ALPHA + PRIOR_BETA + tentativas_ponderadas)
```

O prior Beta(2, 2) (simétrico, concentrado em 0.5) representa "aluno que nunca tentou provavelmente sabe algo, mas não tudo" — mais realista que Beta(1,1) uniforme.

#### Ponderação anti-memorização

Re-tentativas da mesma questão recebem peso `PESO_RE_TENTATIVA = 0.3` em vez de 1.0:

```
peso(tentativa, questao_id) = 
  1.0  se é primeira tentativa dessa questão
  0.3  se questão já foi tentada antes
```

Isso impede que 10 re-acertos da mesma questão equivalham a 10 acertos de questões diferentes.

#### Ponderação por dificuldade

Acerto em questão difícil (dificuldade 4–5) vale mais que acerto em fácil (1–2):

```
peso_dificuldade = dificuldade / 3.0  (normalizado em torno de 1.0 para dificuldade 3)
```

#### Decaimento exponencial (Ebbinghaus)

Após calcular mastery_raw, aplica decaimento pela curva do esquecimento:

```
decay_score = mastery_raw × exp(-dias_desde_last_attempt / DECAY_HALF_LIFE_DAYS)
```

Com `DECAY_HALF_LIFE_DAYS = 21` (3 semanas), um aluno que dominava um tópico e ficou 3 semanas sem praticar verá seu decay_score cair para 50% do mastery_raw. Em 6 semanas, para 25%.

Justificativa do HALF_LIFE = 21 dias: estudos de retenção em contexto de vestibular (Kornell & Bjork, 2008; Cepeda et al., 2006) mostram retenção de ~60–70% após 3 semanas para material estudado sem revisão espaçada. 21 dias é um valor conservador (fácil de rever para cima com dados reais).

#### Requisitos anti-memorização explícitos

Além da ponderação de peso, o status `dominado` exige condições simultâneas:
- `mastery_raw >= THRESHOLD_DOMINADO (0.75)`
- `total_tentativas >= MIN_TENTATIVAS_DOMINIO (8)`
- `questoes_unicas_acertadas >= MIN_QUESTOES_UNICAS_DOMINIO (5)` — o mais importante

A terceira condição garante que um aluno que acertou a mesma questão 8 vezes nunca seja marcado como dominante. Ele precisou acertar ao menos 5 questões DIFERENTES do tópico.

**Prós:**
- Implementável em ~50 linhas de TypeScript sem dependências.
- Interpretável: "você acertou 7 de 9, mas faz 4 semanas sem praticar" explica o status ao aluno.
- Funciona com n=1 (prior bayesiano estabiliza a estimativa).
- Extensível: os pesos podem ser ajustados empiricamente via constantes nomeadas.

**Contras:**
- Não calibra dificuldade das questões automaticamente (as questões têm `dificuldade` nullable; calibração é trabalho futuro via Elo).
- Esquecimento linear por tópico ignora que diferentes tópicos têm curvas diferentes (por exemplo, fórmulas matemáticas esquecem mais rápido que conceitos de interpretação). Mitigação: `DECAY_HALF_LIFE_DAYS` pode ser por tópico futuramente.

---

## Decisão

Adotar **Opção D — Beta-Binomial com decaimento exponencial** para v1.

---

## Constantes — justificativas

| Constante | Valor | Justificativa |
|---|---|---|
| PRIOR_ALPHA | 2 | Prior Beta(2,2): crença que aluno "sabe algo" antes de tentar |
| PRIOR_BETA | 2 | Simétrico: incerteza equilibrada antes de qualquer dado |
| DECAY_HALF_LIFE_DAYS | 21 | Literatura de retenção em contexto de vestibular |
| MIN_TENTATIVAS_DOMINIO | 8 | Tamanho mínimo de amostra para estimativa Beta estável |
| MIN_QUESTOES_UNICAS_DOMINIO | 5 | Core do anti-memorização: diversidade de itens |
| PESO_RE_TENTATIVA | 0.3 | Re-acerto vale 30% de um acerto novo — desencoraja memorização de resposta |
| THRESHOLD_DOMINADO | 0.75 | 75% de acerto ponderado = domínio robusto |
| THRESHOLD_ENFRAQUECIDO | 0.50 | Abaixo de 50% do mastery_raw original = precisa revisão |
| THRESHOLD_PREREQUISITO_OK | 0.60 | Pré-requisito com 60% mastery_raw é suficiente para prosseguir |
| COLD_START_PIVOT | 20 | Em n=20 tentativas, α=0.5: metade peso genérico, metade personalizado |

Todas as constantes devem ser revisadas empiricamente após 100+ alunos acumularem histórico.

---

## Consequências

O modelo é simples de testar (Vitest com datas simuladas), simples de depurar (score calculável manualmente), e evoluível para BKT ou IRT em fases futuras sem quebrar o schema de banco (mastery_score na view materializada pode ser recomputada por trigger ao trocar o algoritmo).
