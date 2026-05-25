# ADR-004 — Cold Start e Blend de Recomendações

**Status:** Aceito  
**Data:** 2026-05-24  
**Autores:** time de produto

---

## Contexto

Um sistema adaptativo depende de histórico do aluno para recomendar bem. Novos alunos (n=0 tentativas) não têm histórico. A plataforma precisa ser excelente nesse estado — não apenas "funcionar de algum jeito".

**Dois subproblemas:**

1. **Cold start**: como recomendar para aluno sem histórico.
2. **Transição**: como migrar suavemente de recomendações genéricas para personalizadas à medida que o histórico cresce.

**Restrições:**
- O diagnóstico inicial é opcional — o sistema não pode depender dele para funcionar bem.
- A transição não pode ser em degraus (evitar que recomendações mudem bruscamente após a N-ésima tentativa).
- O aluno que pulou o diagnóstico deve ter experiência de primeira classe, não degradada.

---

## Decisão

### score_final e função de blend

```
score_final(topico) = α(n) × score_personalizado(topico, aluno)
                    + (1 − α(n)) × score_generico(topico)

α(n) = n / (n + COLD_START_PIVOT)
```

Com `COLD_START_PIVOT = 20`:

| n (tentativas) | α(n) | % personalizado | % genérico |
|---|---|---|---|
| 0 | 0.000 | 0% | 100% |
| 5 | 0.200 | 20% | 80% |
| 10 | 0.333 | 33% | 67% |
| 20 | 0.500 | 50% | 50% |
| 50 | 0.714 | 71% | 29% |
| 100 | 0.833 | 83% | 17% |
| 200 | 0.909 | 91% | 9% |

A função α(n) é monotonicamente crescente, assintota em 1.0, sem descontinuidades. A transição é imperceptível ao aluno.

### Justificativa do COLD_START_PIVOT = 20

O valor 20 foi escolhido porque:
- Com n < 5, qualquer personalização seria baseada em amostra minúscula (intervalo de confiança muito largo no modelo Beta-Binomial).
- n=20 representa aproximadamente 1–2 sessões de estudo sérias (10–12 questões/sessão), momento em que há sinal suficiente para o modelo personalizado influenciar metade do score.
- O valor é uma constante nomeada (`COLD_START_PIVOT`) — pode ser ajustado empiricamente com dados reais sem alterar a fórmula.

### score_generico(topico)

Calculado uma vez no servidor (cache invalidado apenas quando tópicos mudam). Combina quatro fatores:

```typescript
score_generico(t) = 
  w_peso     × normalizar(peso_enem(t) ?? 5, 0, 10)   // peso curricular ENEM
  + w_uerj   × normalizar(peso_uerj(t) ?? 5, 0, 10)   // peso curricular UERJ
  + w_down   × impacto_downstream(t)                   // quantos tópicos esse desbloqueia
  + w_raiz   × (1 if eh_raiz(t) else 0)               // bonus para tópicos sem pré-requisitos
```

Pesos iniciais: `w_peso=0.4, w_uerj=0.2, w_down=0.3, w_raiz=0.1` (calibráveis por constante).

**`impacto_downstream(t)`:** número de tópicos que têm `t` como pré-requisito (direto ou indireto, até profundidade 3), normalizado pelo máximo do grafo. Representa o quanto dominar esse tópico "desbloqueia" o mapa de estudos.

**`eh_raiz(t)`:** `true` se o tópico não tem pré-requisitos e tem `profundidade = 1`.

**Resultado para Matemática (exemplo):** Tópicos como "Funções — Definição" e "Números Reais — Operações" terão `score_generico` alto por serem raízes com alto impacto_downstream. Tópicos avançados como "Cálculo — Limite" terão score_generico moderado (peso_enem alto, mas impacto_downstream menor).

### score_personalizado(topico, aluno)

Calculado por aluno, por tópico, baseado no `estado_topico` view materializada. Combina:

```typescript
score_personalizado(t, aluno) = 
  w_urgencia   × urgencia(t, aluno)    // enfraquecidos e em_risco têm prioridade
  + w_prontidao × prontidao(t, aluno)  // pré-requisitos satisfeitos?
  + w_marginal  × ganho_marginal(t)    // ainda há questões novas para tentar?
```

**`urgencia`:** Se `status = enfraquecido`, urgencia = 1/decay_score (quanto menor o decay, mais urgente). Se `status = dominado`, urgencia = 0.1 (manutenção baixa prioridade). Se `status = nao_iniciado` e todos pré-reqs ok, urgencia = 0.5.

**`prontidao`:** Proporção de pré-requisitos com `decay_score >= THRESHOLD_PREREQUISITO_OK`. Vale 0.0 se algum pré-requisito está `bloqueado`.

**`ganho_marginal`:** `(total_questoes_topico - questoes_unicas_tentadas_aluno) / total_questoes_topico`. Zero quando aluno esgotou o banco de questões do tópico.

### Diagnóstico opcional e seu efeito no cold start

Quando aluno faz o diagnóstico (~30 questões, cobrindo todos os tópicos-raiz), `n` vai de 0 para ~30 instantaneamente. Isso:
- Move α de 0.0 para 0.60 num único passo (metade diagnóstico, metade personalizado).
- Popula o `estado_topico` com dados reais, tornando `score_personalizado` imediatamente útil.
- Identifica lacunas graves (tópico com mastery_score < 0.3 após 2 tentativas) que o sistema pode priorizar.

Quando aluno pula o diagnóstico, `score_final = score_generico` para as primeiras tentativas. A ordem genérica é boa (tópicos-raiz de maior impacto primeiro), não é um fallback de baixa qualidade.

**Os dois caminhos são caminhos de primeira classe.** O diagnóstico acelera a personalização em ~20 sessões equivalentes, mas quem pula chega ao mesmo lugar naturalmente.

---

## Questões em aberto (para calibração futura)

1. Os pesos `w_peso, w_uerj, w_down, w_raiz` do `score_generico` são estimativas iniciais. Deverão ser ajustados com feedback de alunos reais (qual ordenação genérica levou a melhor desempenho nos vestibulares).

2. `COLD_START_PIVOT = 20` pode ser baixo para alunos que respondem rapidamente sem refletir (inflam `n` sem aprender). Solução futura: ponderar `n` pela diversidade de tópicos tentados, não apenas pelo total de tentativas.

3. Para alunos que tentam o diagnóstico mas o abandonam na metade, o sistema deve usar as respostas parciais ou descartar? Decisão atual: usar o parcial — qualquer dado é melhor que zero.

---

## Consequências

O blend α(n) é calculável em TypeScript puro no cliente (apenas para exibição — o servidor computa o score_final real). Isso permite mostrar ao aluno "suas recomendações são 30% personalizadas" sem roundtrip ao servidor. O score_final real para seleção de questões sempre vem do servidor para evitar manipulação.
