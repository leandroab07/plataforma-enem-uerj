# ADR-L03 — Separação entre tentativas_uai e tentativas

**Status:** Aceito  
**Data:** 2026-05-26  
**Autores:** time de produto

---

## Contexto

O BRIEF original define `tentativas` como a tabela somativa que alimenta o algoritmo de mastery Beta-Binomial. Cada registro em `tentativas` representa uma resposta a uma questão real do banco (ENEM/UERJ), e seu peso no cálculo de mastery é direto.

As UAIs introduzem microexercícios formativos na seção 4 — questões curtas, construídas especificamente para a UAI, desenhadas para guiar o aluno durante o aprendizado, não para avaliá-lo. Esses microexercícios são contextualizados com a simulação, têm dicas disponíveis, e geralmente são mais fáceis que questões reais — propositalmente, para construir confiança e fixar vocabulário antes da aplicação.

Se microexercícios formativos alimentarem `tentativas`, o mastery do aluno vai inflado artificialmente. Um aluno que acertou 4 microexercícios fáceis de Diluições durante a UAI parecerá "dominante" antes de nunca ter respondido uma questão ENEM real. Isso degrada a qualidade do diagnóstico, distorce a recomendação de próximos tópicos, e potencialmente prejudica o aluno na prova real.

---

## Decisão

### Separação hard entre tabelas

| Tabela | O que registra | Alimenta mastery? | Peso pedagógico |
|---|---|---|---|
| `tentativas` | Questões reais ENEM/UERJ (seção 5 da UAI + prática avulsa) | **Sim** | Somativo |
| `tentativas_uai` | Microexercícios formativos (seção 4 da UAI) | **Não** | Formativo |

**Regra inviolável:** Nenhum caminho no código deve escrever em `tentativas` a partir de um microexercício da seção 4. Esta separação é garantida por:

1. **Schema separado** — `tentativas_uai` é tabela própria, não view de `tentativas`
2. **RPC separada** — `submeter_microexercicio(uai_id, secao, microex_id, resposta)` escreve em `tentativas_uai`; `submeter_resposta(questao_id, resposta)` escreve em `tentativas`
3. **Edge Function separada** — nenhuma das duas RPCs chama a outra
4. **Revisão obrigatória** — qualquer PR que toque nas duas tabelas simultaneamente requer revisão explícita com comentário "revisão de separação formativo/somativo"

### Schema das tabelas

```sql
-- Formativo (não alimenta mastery)
create table public.tentativas_uai (
  id          uuid primary key default gen_random_uuid(),
  aluno_id    uuid references auth.users not null,
  uai_id      text references unidades_aprendizagem(id) not null,
  secao       smallint not null check (secao between 1 and 4), -- nunca 5
  microex_id  text not null,
  resposta    jsonb not null,
  correto     boolean not null,
  dica_usada  boolean not null default false,
  tempo_s     smallint,
  created_at  timestamptz default now()
);

-- Somativo (alimenta mastery — schema existente, sem alteração de lógica)
-- tentativas já existe; seção 5 da UAI usa submeter_resposta padrão

-- Progresso de navegação na UAI
create table public.progresso_uai (
  aluno_id        uuid references auth.users not null,
  uai_id          text references unidades_aprendizagem(id) not null,
  secao_atual     smallint not null default 1,
  concluida       boolean not null default false,
  iniciada_em     timestamptz default now(),
  concluida_em    timestamptz,
  ultima_interacao timestamptz default now(),
  primary key (aluno_id, uai_id)
);
```

### O que `tentativas_uai` permite (e não permite)

**Permite:**
- Calcular taxa de acerto por microexercício para melhorar o conteúdo (analytics de produto)
- Exibir ao aluno seu histórico de prática dentro da UAI ("você usou dica em 2 de 5")
- Detectar se aluno está travado em um microexercício específico (suporte pedagógico)
- Contar tentativas_uai como critério de desbloqueio da seção 5 (aluno deve tentar todos os microexercícios antes de acessar questões reais)

**Não permite:**
- Nenhuma query que some `tentativas_uai.correto` no cálculo de `mastery_score`
- Nenhum trigger que atualize `estado_topico` baseado em `tentativas_uai`
- Nenhuma exibição ao aluno de "você acertou X%" usando dados de `tentativas_uai` como proxy de mastery

### Diagrama de fluxo de dados

```
Seção 4 (microexercício)
  └─► submeter_microexercicio() [Edge Function]
        └─► INSERT tentativas_uai
              └─► Analytics de produto (nunca mastery)

Seção 5 (questão real ENEM/UERJ)
  └─► submeter_resposta() [Edge Function existente]
        └─► INSERT tentativas (schema existente)
              └─► UPDATE estado_topico (mastery Beta-Binomial)
                    └─► Recomendações, dashboard, progresso oficial
```

---

## Justificativas

**Por que não usar um flag em `tentativas` para distinguir formativo/somativo?** Uma única tabela com flag é uma bomba relógio. Query de mastery pode inadvertidamente incluir linhas formativas se o WHERE for esquecido em alguma JOIN. Tabelas separadas com RPCs separadas eliminam esse risco por construção — você não pode "esquecer o WHERE" se a tabela simplesmente não existe no contexto errado.

**Por que seção 5 usa `submeter_resposta` sem modificação?** O BRIEF original já tem essa RPC com lógica de gabarito no schema `private`. Não há razão para criar alternativa. A seção 5 da UAI é funcionalmente idêntica à prática avulsa: o aluno responde uma questão real do banco, o gabarito é verificado no servidor, o mastery é atualizado. A UAI apenas seleciona e apresenta essas questões com contexto diferente — o backend é o mesmo.

**Por que `secao` tem check `between 1 and 4`?** Constraint explícita no banco que impede fisicamente que seção 5 seja registrada em `tentativas_uai`. Mesmo que um bug no frontend envie `secao: 5`, o banco rejeita. Defense in depth.

**Alternativa rejeitada — peso menor (não zero) para microexercícios no mastery:** Alguns sistemas usam 0.1× ou 0.2× para atividades formativas. Rejeitado porque: (a) calibrar o peso é arbitrário e muda o comportamento do Beta-Binomial de forma não-documentada; (b) ainda há risco de inflação em tópicos com muitos microexercícios; (c) a separação clean é mais auditável.

---

## Consequências

### Positivas
- Integridade do mastery preservada — diagnóstico reflete apenas desempenho em questões reais
- Dados de `tentativas_uai` ainda são valiosos para analytics de produto sem poluir o sistema de avaliação
- Constraints no banco previnem bugs de código

### Negativas / riscos
- Duas tabelas para manter (migrations, RLS, backups). Mitigação: RLS de `tentativas_uai` é idêntica à de `tentativas` — copiar e adaptar.
- Aluno pode ficar confuso se vir dois contadores diferentes ("você acertou 5 microexercícios mas seu mastery está em 40%"). Mitigação: UI nunca exibe mastery dentro da UAI. Progresso na UAI = seções concluídas, não mastery score.

---

## Desvios futuros

Qualquer proposta de usar `tentativas_uai` como input para mastery — diretamente ou via peso — requer ADR próprio e aprovação explícita. O default é: microexercício formativo não conta para mastery, sem exceção.
