# ADR-005 — Anti-Memorização: Por que Questões Únicas Importam

**Status:** Aceito  
**Data:** 2026-05-24  
**Autores:** time de produto

---

## Contexto

A distinção entre "dominar um conceito" e "memorizar uma resposta" é o problema central de qualquer sistema de prática de questões. Em plataformas sem proteção anti-memorização, um comportamento comum é:

1. Aluno acerta a questão X.
2. Sistema registra acerto e aumenta mastery.
3. Aluno vê questão X de novo (por revisão espaçada ou por sorte).
4. Reconhece a resposta (não o raciocínio) e acerta novamente.
5. Mastery infla artificialmente.
6. Aluno chega ao vestibular sem saber resolver variantes do mesmo problema.

Esse problema é documentado empiricamente. Kornell & Bjork (2008) mostraram que alunos superestimam consistentemente sua retenção quando praticam via repetição do mesmo item em vez de variação de itens. No contexto de vestibular de medicina — onde a margem de erro é pequena — mastery inflado é ativamente prejudicial.

---

## Decisão: três camadas de proteção

### Camada 1 — Threshold duplo para status `dominado`

O status `dominado` exige simultaneamente:

```
mastery_score >= THRESHOLD_DOMINADO (0.75)
AND total_tentativas >= MIN_TENTATIVAS_DOMINIO (8)
AND questoes_unicas_acertadas >= MIN_QUESTOES_UNICAS_DOMINIO (5)
```

A terceira condição é a mais importante e a mais difícil de satisfazer com memorização:

- Um aluno que acertou a mesma questão 8 vezes tem `questoes_unicas_acertadas = 1` — nunca será `dominado`.
- Um aluno que acertou 5 questões diferentes precisa ter demonstrado o conceito em contextos distintos.

**Por que 5 questões únicas?** Com 5 itens de dificuldade variada (fácil, médio, difícil, fácil, médio), a probabilidade de que um aluno que não domina o conceito acerte todos os 5 por chute puro é `0.25^5 = 0.1%` (4 alternativas). Isso é aceitável como threshold.

**Por que não mais?** O banco de questões por tópico pode ser pequeno (10–15 questões para tópicos específicos do UERJ). Exigir 8 ou 10 únicas seria impraticável para esses tópicos.

### Camada 2 — Peso decrescente de re-tentativas

```typescript
peso(tentativa) = 
  1.0  se questao_id não aparece em tentativas anteriores do aluno neste tópico
  0.3  se questao_id já foi tentada antes (qualquer número de vezes)
```

`PESO_RE_TENTATIVA = 0.3` significa:

- Primeira vez que acerta questão X: peso 1.0 no cálculo de mastery_raw.
- Segunda vez que acerta questão X: peso 0.3.
- Terceira, quarta, N-ésima: peso 0.3 (não diminui mais — a revisão tem algum valor).

Isso não elimina o valor da revisão (revisar a mesma questão tem benefício pedagógico real), mas impede que revisões repetidas da mesma questão inflem o score para 100%.

**Exemplo:** Aluno acerta questão X 10 vezes. Contribuição ao mastery: `1.0 + 9 × 0.3 = 3.7` acertos ponderados sobre `1.0 + 9 × 0.3 = 3.7` tentativas ponderadas. Mastery parcial = 1.0. Mas `questoes_unicas_acertadas = 1` — trava o status em `em_progresso`.

### Camada 3 — Agendamento de questões NOVAS após erro

Quando aluno erra questão Y:

```sql
INSERT INTO agenda_revisao (aluno_id, questao_id, agendado_para, motivo)
SELECT
  $aluno_id,
  q.id,
  now() + interval '1 day',
  'erro_recente'
FROM questoes q
WHERE q.topico_id = $topico_id
  AND q.id != $questao_id_que_errou  -- questao DIFERENTE
  AND NOT EXISTS (
    SELECT 1 FROM tentativas t
    WHERE t.aluno_id = $aluno_id AND t.questao_id = q.id
  )
LIMIT 2;
```

O sistema agenda 2 questões **diferentes** do mesmo tópico para o dia seguinte. O objetivo não é "revisar a questão que errou" — é verificar se o aluno aprendeu o conceito testando-o em novos contextos.

**Por que não re-mostrar a mesma questão imediatamente após erro?** Porque isso testa memória de curto prazo, não aprendizado. O intervalo de 24h garante consolidação.

---

## O que NÃO é anti-memorização

- O aluno pode solicitar revisão da mesma questão (`tipo_servimento = revisao_aluno`). Isso é legítimo e desejável — compreender por que errou é aprendizado real.
- O sistema mostra a questão errada novamente em `/revisao` com `tipo_servimento = revisao_agendada`, mas o peso dessa re-tentativa já está penalizado pela Camada 2.
- Re-tentativas da mesma questão são registradas normalmente em `tentativas` — a penalização é no cálculo de mastery, não na remoção do registro.

---

## Métrica de taxa de recuperação

```
taxa_recuperacao = questoes_recuperadas / total_tópicos_enfraquecidos
```

Onde `questoes_recuperadas = COUNT(eventos_progressao WHERE evento = 'recuperado')`.

Essa métrica é exposta no dashboard como indicador de aprendizado real (não memorização): "Você recuperou 8 de 12 tópicos que tinham enfraquecido." Um sistema sem anti-memorização tornaria esse número artificialmente alto (mastery nunca cairia para "enfraquecido" porque re-tentativas o manteriam alto).

---

## Lacunas documentadas

1. **Variantes de questões:** O banco atual não tem "questões-irmãs" (variantes do mesmo problema com números diferentes). Esse seria o mecanismo anti-memorização ideal. Na v1, usamos questões diferentes do mesmo tópico como proxy.

2. **Questões com gabarito público:** Questões de vestibulares passados têm gabaritos disponíveis online. Um aluno determinado pode consultar a resposta antes de tentar. Não é possível prevenir isso tecnicamente. Mitigação: a obrigação de 5 questões únicas acertadas aumenta o custo de trapacear sistematicamente.

3. **Limite do banco por tópico:** Tópicos com poucos itens disponíveis (~8–10) podem ser "esgotados" (aluno tentou todas as questões únicas). Quando `ganho_marginal = 0`, o sistema para de recomendar o tópico até que novas questões sejam mapeadas e adicionadas.

---

## Consequências

A Camada 1 (threshold duplo) e a Camada 2 (peso decrescente) são implementadas inteiramente no algoritmo de mastery em `/src/lib/diagnostico/mastery.ts` e testadas via Vitest com fixtures de tentativas simuladas. A Camada 3 (agendamento de novas questões) é implementada por trigger Postgres na RPC `submeter_resposta`.
