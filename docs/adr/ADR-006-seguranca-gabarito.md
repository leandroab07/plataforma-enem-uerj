# ADR-006 — Segurança do Gabarito e Row Level Security

**Status:** Aceito  
**Data:** 2026-05-24  
**Autores:** time de produto

---

## Contexto

O princípio mais crítico de segurança da plataforma é: **o gabarito correto jamais pode ser enviado ao cliente antes da resposta do aluno.**

Se o gabarito vazar, a plataforma deixa de medir conhecimento e passa a medir capacidade de interceptar tráfego de rede — o que qualquer aluno com DevTools consegue fazer.

Além disso, a plataforma lida com dados de aprendizado sensíveis: o histórico de tentativas de um aluno revela seus pontos fracos. Esses dados precisam ser isolados entre alunos (nenhum aluno vê dados de outro).

---

## Decisão: gabarito server-side only via RPC

### Por que não RLS na tabela `questoes`?

A abordagem ingênua seria criar uma política RLS que esconde a coluna `gabarito`:

```sql
-- ERRADO: RLS por coluna não existe em Postgres nativamente
CREATE POLICY hide_gabarito ON questoes FOR SELECT
  USING (true) -- qualquer autenticado pode ver
  -- mas como esconder só a coluna gabarito?
```

Postgres RLS opera em linhas, não em colunas. Não há como usar RLS para esconder uma coluna específica de uma linha visível. Alternativas:

1. **View sem a coluna gabarito:** Criar `questoes_publicas` view sem `gabarito`. O problema é que qualquer falha de manutenção (query direta em `questoes` com permissão errada) vaza o gabarito.

2. **Tabela separada:** Mover `gabarito` para tabela `gabaritos` com RLS `USING (false)` para role `authenticated` (nunca acessível diretamente). Mais seguro, mas adiciona join em todas as queries de questão.

3. **RPC obrigatória para avaliação:** A abordagem adotada (ver abaixo).

### Abordagem adotada: RPC submeter_resposta

**No banco:**
```sql
-- questoes: gabarito armazenado, NUNCA exposto via SELECT ao role authenticated
-- A tabela é acessível via SELECT mas gabarito está na tabela gabaritos (schema privado)
```

**Schema de segurança em duas camadas:**

```
schema: public
  - questoes (sem coluna gabarito — gabarito NUNCA vai aqui)

schema: private (inacessível para role authenticated)
  - gabaritos (questao_id, gabarito, explicacao_opcional)
```

O role `authenticated` (alunos) não tem `USAGE` no schema `private`. Apenas Edge Functions rodando com `service_role` (que bypassa RLS) podem acessar `private.gabaritos`.

**RPC em Edge Function (`/supabase/functions/submeter-resposta/index.ts`):**

```typescript
// Recebe: questao_id, resposta_marcada, confianca
// Valida autenticação JWT
// Busca gabarito em private.gabaritos usando service_role client
// Compara resposta_marcada com gabarito
// Registra tentativa em tentativas (via service_role)
// Atualiza estado_topico via trigger
// Atualiza agenda_revisao via trigger
// Retorna ao cliente:
return {
  acertou: boolean,
  gabarito_revelado: string,  // só revelado APÓS registrar a tentativa
  explicacao_opcional: string | null
}
```

**Garantia:** O cliente recebe `gabarito_revelado` apenas depois que a tentativa foi registrada de forma imutável. Não é possível "cancelar" uma tentativa errada ao receber o gabarito.

**Proteção adicional:** A tabela `tentativas` tem uma constraint CHECK que impede `acertou = true` quando `resposta_marcada != gabarito`. Essa verificação acontece no servidor; o cliente nunca envia `acertou` — ele envia apenas `resposta_marcada`.

### Diagrama de fluxo

```
Cliente                     Edge Function              Banco (service_role)
  |                              |                              |
  |-- POST /submeter-resposta -->|                              |
  |   {questao_id, resposta,     |                              |
  |    confianca}                |                              |
  |                              |-- SELECT gabarito ---------->|
  |                              |   FROM private.gabaritos     |
  |                              |<-- gabarito: "B" -----------|
  |                              |                              |
  |                              |-- INSERT tentativas -------->|
  |                              |   {acertou: resposta == gab} |
  |                              |                              |
  |                              |<-- trigger atualiza --------|
  |                              |    estado_topico             |
  |                              |    agenda_revisao            |
  |                              |                              |
  |<-- {acertou, gabarito_rev} --|                              |
```

---

## Row Level Security — políticas por tabela

### `tentativas`
```sql
-- Aluno só vê e insere suas próprias tentativas
CREATE POLICY tentativas_select ON tentativas FOR SELECT
  USING (aluno_id = auth.uid());

CREATE POLICY tentativas_insert ON tentativas FOR INSERT
  WITH CHECK (aluno_id = auth.uid());

-- Nenhum UPDATE ou DELETE permitido (histórico imutável)
```

### `agenda_revisao`
```sql
CREATE POLICY agenda_select ON agenda_revisao FOR SELECT
  USING (aluno_id = auth.uid());

-- INSERT via RPC (service_role bypassa RLS)
-- Aluno não pode inserir diretamente para evitar manipulação de agenda
```

### `estado_topico` (view materializada)
```sql
CREATE POLICY estado_select ON estado_topico FOR SELECT
  USING (aluno_id = auth.uid());
-- View materializada: aluno vê apenas seu próprio estado
```

### `eventos_progressao`
```sql
CREATE POLICY eventos_select ON eventos_progressao FOR SELECT
  USING (aluno_id = auth.uid());
-- Imutável: sem UPDATE, sem DELETE, INSERT apenas via trigger
```

### `topicos`, `pre_requisitos`, `conexoes_interareas`
```sql
-- Leitura para qualquer autenticado
CREATE POLICY topicos_read ON topicos FOR SELECT
  USING (auth.role() = 'authenticated');

-- Escrita apenas para admin
CREATE POLICY topicos_admin ON topicos FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
```

### `questoes` (schema public, sem gabarito)
```sql
-- Leitura para qualquer autenticado (gabarito não está aqui)
CREATE POLICY questoes_read ON questoes FOR SELECT
  USING (auth.role() = 'authenticated');

-- Escrita apenas via Edge Function com service_role
```

---

## Checklist de auditoria de segurança (executar antes de cada release)

- [ ] Nenhuma query de `questoes` no código do cliente inclui coluna `gabarito` (inexistente no schema public)
- [ ] O schema `private` não tem `GRANT USAGE` para role `authenticated`
- [ ] A Edge Function `submeter-resposta` verifica JWT antes de qualquer operação
- [ ] Nenhuma resposta da Edge Function inclui `gabarito` antes de registrar a tentativa
- [ ] RLS está habilitado (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`) em todas as tabelas
- [ ] `tentativas` não tem política de UPDATE ou DELETE
- [ ] `eventos_progressao` não tem política de UPDATE ou DELETE
- [ ] Testes de integração cobrem tentativa de acesso direto a `private.gabaritos` com token de aluno (deve retornar erro 403)

---

## Lacunas e riscos residuais

1. **Gabarito já disponível publicamente:** As questões são de vestibulares passados com gabaritos oficiais online. Um aluno determinado pode consultar o gabarito fora da plataforma. Não é possível prevenir isso — o controle aqui é sobre a integridade do registro de tentativas dentro da plataforma.

2. **Timing attack:** Um aluno poderia medir o tempo de resposta da RPC para inferir se acertou (respostas corretas podem ter caminho de código ligeiramente diferente). Mitigação: adicionar `await sleep(randomInt(50, 150))` na Edge Function para normalizar latência. A implementar na Fase 6.

3. **Admin role:** O token JWT com `role: admin` tem acesso de escrita a tópicos e questões. Esse token não deve ser distribuído para alunos. Implementação futura: usar custom claims JWT via Supabase Auth Hooks em vez de campo no JWT payload.

---

## Consequências

A separação entre schema `public` (questoes sem gabarito) e schema `private` (gabaritos) é a decisão arquitetural mais consequente. Ela garante que nenhum bug de RLS, nenhuma query acidental, e nenhum log de banco exponha o gabarito. O custo é a necessidade de um join no schema privado apenas dentro de Edge Functions com service_role.
