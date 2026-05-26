# ADR-L05 — Acessibilidade em Simulações Interativas

**Status:** Aceito  
**Data:** 2026-05-26  
**Autores:** time de produto

---

## Contexto

Simulações interativas baseadas em Canvas (Konva.js) são intrinsecamente inacessíveis por padrão. Canvas é um bitmap — o DOM não tem conhecimento dos objetos desenhados dentro dele. Screen readers não conseguem ler o conteúdo, e interações por teclado não funcionam sem implementação explícita.

Simulações PhET têm acessibilidade integrada (eles têm time dedicado para isso). Simulações custom precisamos construir acessibilidade do zero.

O aluno-alvo pode ter: baixa visão, daltonismo, limitação motora fina (dificuldade com drag-and-drop preciso), ou usar teclado por preferência ou necessidade. Acessibilidade não é opcional — é requisito desde o dia 1, não retrofit.

Nível alvo: **WCAG 2.1 AA** para toda a UI de UAI. Simulações customizadas devem atingir AA para contraste e operabilidade por teclado; AA para screen reader é desejável mas o "modo passo-a-passo" (ver abaixo) é o mecanismo primário de acessibilidade para simulações.

---

## Decisão

### 1. Contraste de cores

**Regra:** Todo texto sobre fundo deve ter razão de contraste ≥ 4.5:1 (WCAG AA para texto normal) ou ≥ 3:1 (WCAG AA para texto grande ≥ 18px bold).

**Verificação obrigatória em PRs:**
- Usar `axe-core` (via `@axe-core/react` em dev) para audit automático
- Reportar resultados em PR description: "contraste verificado, sem violações AA"

**Casos especiais de simulação:**
- Líquidos coloridos em béqueres: a cor do líquido representa a substância química (informação real), não é apenas decorativa. Se a cor for ambígua para daltônico, adicionar rótulo textual da substância sobre o béquer (ex.: "CuSO₄ — Azul").
- Código de cor para feedback (verde/vermelho): sempre acompanhar com ícone (`CheckCircle` / `XCircle`) e texto. Nunca cor como único sinal.

### 2. Operabilidade por teclado

**Regra:** Toda ação disponível por mouse deve ser acessível por teclado.

**Implementação para drag-and-drop em Konva:**

Canvas não suporta foco nativo. A solução é um overlay de elementos HTML invisíveis (visually hidden mas focusáveis) que representam os objetos manipuláveis:

```tsx
// Padrão para objeto manipulável em Konva com acessibilidade de teclado
<div
  role="button"
  tabIndex={0}
  aria-label={`${objeto.nome}, ${objeto.volume}mL de ${objeto.conteudo}`}
  aria-describedby="instrucoes-drag"
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') selecionarObjeto(objeto.id)
    if (e.key === 'ArrowUp') moverObjeto(objeto.id, 'up')
    if (e.key === 'ArrowDown') moverObjeto(objeto.id, 'down')
    if (e.key === 'ArrowLeft') moverObjeto(objeto.id, 'left')
    if (e.key === 'ArrowRight') moverObjeto(objeto.id, 'right')
    if (e.key === 'Escape') desselecionarObjeto()
  }}
  style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}
/>
```

**Atalhos de teclado padrão para simulações:**
- `Tab` / `Shift+Tab`: navegar entre objetos manipuláveis
- `Enter` / `Espaço`: selecionar objeto (equivale a "pegar")
- Setas direcionais: mover objeto selecionado (10px por tecla)
- `Shift + Seta`: mover 50px (movimento rápido)
- `Escape`: soltar objeto selecionado
- `R`: reset da simulação ao estado inicial
- `?`: abrir painel de ajuda com atalhos listados

**Focus visible:** Todo elemento focusável por teclado deve ter `outline` visível. Nunca `outline: none` sem alternativa equivalente.

### 3. Descrição textual do estado atual

**Regra:** O estado da simulação deve ser legível por screen reader sem depender do visual.

**Implementação:**

Uma região `aria-live="polite"` descreve o estado atual em texto. Atualiza a cada mudança relevante:

```tsx
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {descricaoEstado}
</div>
```

A função `gerarDescricaoEstado(estado: EstadoSim): string` é obrigatória em toda simulação custom. Exemplo de output para simulação de diluições:

```
"Bancada com 3 béqueres. Béquer 1: vazio, 250mL de capacidade. 
 Béquer 2: contém 100mL de CuSO₄ a 2,0 mol/L. 
 Béquer 3: contém 200mL de água destilada. 
 Béquer 2 selecionado. Use as setas para mover."
```

### 4. Modo passo-a-passo

**Regra:** Toda simulação custom deve ter um modo alternativo que substitui interação livre (drag-and-drop no Canvas) por uma sequência de perguntas/escolhas guiadas — operável com apenas teclado e leitura de screen reader.

**Ativação:** Botão "Modo passo-a-passo" visível na UI da simulação (não escondido atrás de menu de acessibilidade — muitos usuários não sabem que precisam ativar).

**Comportamento:**
- O Canvas some ou fica em plano de fundo decorativo (não interativo)
- Interface alternativa baseada em HTML/React aparece
- Sequência de ações que a simulação permitiria são apresentadas como perguntas ou seleções:
  - "Qual béquer você quer selecionar?" → dropdown com opções
  - "Qual quantidade deseja transferir?" → input numérico
  - "Para qual destino?" → dropdown
- O estado lógico da simulação evolui identicamente ao modo livre — apenas a interface de input muda
- Feedback textual claro a cada passo ("Você adicionou 50mL de CuSO₄ ao béquer 3. Concentração resultante: 0,67 mol/L")

**Implementação:**
- O estado lógico da simulação é separado da renderização visual
- `EstadoSim` + `dispatch(acao)` funcionam identicamente em ambos os modos
- Apenas o componente de input muda: `<BancadaCanvas>` vs `<BancadaPassoAPasso>`

### 5. Daltonismo

**Cores com significado químico ou físico** (cor do líquido = substância, cor do fio = intensidade) devem ter redundância:
- Rótulo textual adjacente sempre visível (não apenas tooltip)
- Ícone ou padrão de preenchimento diferente quando viável (ex.: líquidos mais concentrados com pontos mais densos)
- Para simulação de circuito elétrico: cor do fio indica intensidade + número da corrente sempre visível no painel

**Simulação de Punnett (genética):** Células dominante/recessivo distinguidas por cor (laranja/azul) + texto do genótipo dentro da célula. Nunca só cor.

### 6. Textos alternativos

- Toda imagem decorativa: `alt=""`
- Toda imagem informativa: `alt` descrevendo o conteúdo
- SVG inline: `<title>` e `<desc>` com descrição textual; `role="img"` no elemento raiz
- Canvas Konva: não tem alt nativo — coberto pelo `aria-live` region descrito acima

### 7. Verificação e checklist de acessibilidade por componente

Todo componente de simulação custom antes de merge deve passar por:

```
[ ] axe-core sem erros críticos ou sérios
[ ] Navegação completa por Tab/Shift+Tab documentada e testada
[ ] Modo passo-a-passo implementado e testado
[ ] aria-live region com gerarDescricaoEstado() implementada
[ ] Cores de substâncias/fenômenos têm rótulo textual
[ ] Contraste AA verificado para textos sobre todos os fundos usados
[ ] Simulação testada em VoiceOver (macOS) ou NVDA (Windows) — pelo menos smoke test
```

---

## Justificativas

**Por que modo passo-a-passo em vez de ARIA roles avançados no Canvas?** Canvas com ARIA completa (usando aria-owns, role=application, aria-activedescendant para objetos virtuais) é possível mas exige um overhead de manutenção enorme — para cada objeto no Canvas, manter sincronizado um elemento virtual no DOM. O modo passo-a-passo oferece a mesma funcionalidade pedagógica (o estado lógico é idêntico) com muito menos complexidade. É uma abordagem pragmática que foi validada pela própria PhET para simulações complexas.

**Por que botão de modo passo-a-passo visível e não no menu de acessibilidade?** Pesquisa da WebAIM indica que ~70% dos usuários de screen reader não clicam em menus de acessibilidade escondidos — eles esperam que o conteúdo já seja acessível. Botão visível é sinal de que a plataforma considerou a acessibilidade, não apenas cumpriu a lei.

**Por que WCAG 2.1 AA e não AAA?** AA é o padrão legal brasileiro (ABNT NBR 17060 referencia WCAG 2.1 AA). AAA seria ideal mas tem requisitos que conflitam com o design visual (ex.: contraste AAA 7:1 para texto normal exige fundos muito claros ou textos muito escuros, limitando a paleta). AA equilibra acessibilidade real e viabilidade de design.

**Alternativa rejeitada — terceirizar acessibilidade para auditoria futura:** Retrofit de acessibilidade em simulações interativas é 3–5× mais caro que implementar desde o início. Estrutura de estado separada (lógica vs. renderização) exigida pelo modo passo-a-passo é boa prática de engenharia de qualquer forma — não há custo extra real.

---

## Consequências

### Positivas
- Plataforma utilizável por alunos com limitação visual, motora ou cognitiva
- Estrutura estado/renderização separada facilita testes unitários da lógica da simulação
- Conformidade legal (LBI — Lei Brasileira de Inclusão, art. 63)

### Negativas / riscos
- Modo passo-a-passo dobra o código de UI de cada simulação. Mitigação: componentes genéricos de modo passo-a-passo em `/src/components/simulacao_quimica/BancadaPassoAPasso.tsx` que recebem o dispatch do estado — não reimplementar por simulação.
- `gerarDescricaoEstado()` fica defasada quando estado muda estrutura. Mitigação: tipagem TypeScript para `EstadoSim` quebra a função em compilação se campos forem removidos.

---

## Desvios futuros

Qualquer simulação custom que não tenha modo passo-a-passo implementado não pode entrar em produção — não há exceção. Abrir issue de acessibilidade antes de merge, não depois.
