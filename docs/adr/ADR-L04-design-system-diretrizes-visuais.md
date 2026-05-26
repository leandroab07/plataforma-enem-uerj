# ADR-L04 — Design System e Diretrizes Visuais para UAIs

**Status:** Aceito  
**Data:** 2026-05-26  
**Autores:** time de produto

---

## Contexto

As UAIs introduzem simulações interativas, ilustrações e componentes visuais ricos que não existiam no sistema original. Sem diretrizes visuais explícitas, cada UAI desenvolve seu próprio estilo, resultando em inconsistência que prejudica a experiência e dificulta a manutenção.

O aluno-alvo tem 17 anos e prepara-se para Medicina — um vestibular competitivo que exige seriedade. Design infantilizado é desrespeitoso e contraproducente. Design austero demais é desmotivante. O alvo é o estilo de plataformas como Brilliant.org, Khan Academy e PhET: limpo, colorido com propósito, profissional sem ser frio.

Este ADR e o documento `/docs/design-system.md` (derivado deste ADR) estabelecem as diretrizes visuais que todo componente de UAI deve seguir.

---

## Decisão

### Paleta de cores

**Cor primária (interação, CTAs, destaque)**
- `blue-600` (#2563EB) — ações primárias, botões de avanço, links
- `blue-50` (#EFF6FF) — fundos de seção com destaque suave

**Cor secundária (simulação, elementos manipuláveis)**
- `teal-500` (#14B8A6) — objetos arrastáveis, handles, estados ativos
- `teal-50` (#F0FDFA) — fundo de área de simulação

**Accents por área do conhecimento (consistentes com TopicPage)**
- Química: `teal-500` / `teal-100`
- Física: `blue-500` / `blue-100`
- Biologia: `emerald-500` / `emerald-100`
- Matemática: `orange-500` / `orange-100`

**Semânticos (feedback)**
- Acerto: `emerald-600` (#059669) com fundo `emerald-50`
- Erro: `red-600` (#DC2626) com fundo `red-50`
- Dica: `amber-600` (#D97706) com fundo `amber-50`
- Neutro / informação: `slate-600` com fundo `slate-50`

**Neutros**
- Fundo de página: `white` (#FFFFFF)
- Fundo de card: `slate-50` (#F8FAFC)
- Borda: `slate-200` (#E2E8F0)
- Texto principal: `slate-900` (#0F172A)
- Texto secundário: `slate-500` (#64748B)

**Regras absolutas:**
- Contraste mínimo texto/fundo: 4.5:1 (WCAG AA). Verificar com ferramenta antes de PR.
- Nunca sobrepor dois gradientes saturados.
- Nunca usar cor como único indicador de estado (sempre acompanhar com ícone ou texto).

### Tipografia

**Fonte de corpo e UI:** Inter (já carregada via Tailwind/Google Fonts)
- Corpo de teoria: `text-base` (16px), `leading-relaxed`, `text-slate-700`
- Texto de UI (botões, labels): `text-sm`, `font-medium`
- Microtexto (timestamps, contadores): `text-xs`, `text-slate-500`

**Fonte de título de seção:** Inter com `font-bold`
- Título de UAI (h1): `text-2xl font-bold text-slate-900`
- Título de seção (h2): `text-lg font-semibold text-slate-800`
- Subtítulo (h3): `text-base font-semibold text-slate-700`

**Fórmulas matemáticas:** KaTeX (não MathJax)
- Inline: `\( ... \)` — renderizado em `text-slate-900`
- Display (equação centralizada): `\[ ... \]` — fundo `slate-50`, padding `py-3 px-4`, borda `border border-slate-200 rounded-lg`
- Nunca usar imagem para fórmula — KaTeX é acessível, imagem não.

### Iconografia

**Lucide React** — já presente. Usar sempre que houver ícone disponível.
- Tamanhos padrão: `size={16}` para inline, `size={20}` para botões, `size={24}` para ações primárias
- Cor: herda do texto pai (não definir cor separada sem motivo)
- Nunca usar ícone sem label acessível (`aria-label` ou texto adjacente)

**Ilustrações vetoriais custom** (para abertura de UAI, síntese):
- Traço: 2px, `stroke-linecap="round"`, `stroke-linejoin="round"`
- Fill: cores da paleta com opacidade 0.1–0.2 para preenchimento suave
- Sombra: `drop-shadow` leve (blur 4px, opacidade 15%), nunca múltiplas sombras
- Sem: gradientes radiais complexos, texturas, efeitos de brilho exagerados

### Componentes de simulação (vidrarias e objetos)

**Vidrarias (béqueres, pipetas, etc.):**
- Traço: `stroke-width: 2.5`, `stroke: #475569` (slate-600)
- Fill da vidraria: `#F8FAFC` (slate-50) com `fill-opacity: 0.8`
- Fill do líquido: cor da substância com `fill-opacity: 0.7`
- Superfície do líquido: linha sutil, `stroke: rgba(255,255,255,0.5)`
- Sombra do objeto: `filter: drop-shadow(0 2px 4px rgba(0,0,0,0.12))`

**Bolhas e efeitos:**
- Bolhas de gás: círculos `r: 2–4`, `fill: rgba(255,255,255,0.4)`, animação ascendente suave
- Sem espirais, sem raios, sem estrelas — efeitos devem representar fenômeno físico real

**Objetos manipuláveis (drag-and-drop Konva):**
- Estado default: borda `2px solid #94A3B8` (slate-400)
- Estado hover: borda `2px solid #2563EB` (blue-600), cursor `grab`
- Estado dragging: borda `2px solid #2563EB`, `opacity: 0.85`, cursor `grabbing`
- Estado encaixado/ativado: borda `2px solid #059669` (emerald-600)

### Animações e transições

**Transições de UI (Framer Motion):**
- Entrada de seção: `{ opacity: 0, y: 8 }` → `{ opacity: 1, y: 0 }`, `duration: 0.2`, `ease: "easeOut"`
- Saída: `{ opacity: 0 }`, `duration: 0.15`
- Feedback de acerto/erro: `scale: [1, 1.05, 1]`, `duration: 0.25`
- Nunca usar `bounce` easing — excessivamente infantil

**Animações de simulação:**
- Target: 60fps para interações, 30fps aceitável para animações decorativas
- Duração máxima de transição de estado: 300ms
- Animações de pouring/derramamento: 400–600ms (fisicamente plausível)
- Sem: explosões de partículas ao acertar, confetes, efeitos de brilho pulsante

**Timer e progresso:**
- Barra de progresso: transição CSS `width` com `transition-all duration-300`
- Não animar counter de número (janky) — atualizar direto

### Layout de UAI

**Container principal:**
```
max-w-2xl mx-auto px-4 py-6
```

**Card de seção:**
```
bg-white border border-slate-200 rounded-2xl p-6 shadow-sm
```

**Área de simulação:**
```
bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden
```
Altura mínima: 320px mobile, 400px desktop. Canvas Konva: width 100%, height calculado.

**Navegação de seções (breadcrumb visual):**
- 6 pontos horizontais, conectados por linha
- Concluído: `bg-blue-600`
- Atual: `bg-blue-600 ring-2 ring-blue-200`
- Futuro: `bg-slate-200`

### O que nunca fazer

| Proibido | Alternativa aceita |
|---|---|
| Mascotes humanoides | Ilustrações geométricas de objetos do domínio |
| Comic Sans ou fontes display extravagantes | Inter, Plus Jakarta Sans |
| Gradientes saturados sobrepostos | Cor sólida + fundo suave da mesma família |
| Badges de "Parabéns!" com confete | Feedback textual claro + ícone `CheckCircle` |
| Sons de celebração | Sem áudio (acessibilidade + contexto de prova) |
| Animações com bounce exagerado | `easeOut` suave |
| Clip-art genérico | Ilustração vetorial custom ou Lucide |
| Texto sobre fundo colorido saturado | Texto escuro sobre fundo claro |
| Múltiplas fontes na mesma tela | Inter em todos os pesos |
| Imagem para fórmula matemática | KaTeX |

---

## Justificativas

**Por que Inter?** Variable font amplamente suportada, excelente legibilidade em telas, já disponível no projeto via Tailwind. Alternativa Plus Jakarta Sans para títulos foi considerada mas adiciona request de fonte extra sem ganho perceptível em produto focado em conteúdo.

**Por que KaTeX e não MathJax?** KaTeX renderiza em ~10ms vs ~100ms do MathJax. Para uma plataforma onde fórmulas aparecem em microexercícios (feedback imediato esperado), latência de renderização importa. KaTeX cobre ~90% das necessidades de ensino médio; os 10% restantes (matrizes complexas, notações avançadas) não aparecem no ENEM.

**Por que Framer Motion e não CSS puro?** CSS é suficiente para transições simples, mas Framer Motion oferece layout animations (AnimatePresence, layoutId) que seriam dolorosas em CSS puro — especialmente para a navegação entre seções da UAI onde elementos entram/saem do DOM. O bundle size adicional (~30kb gzip) é justificado pelo ganho de DX e qualidade de animação.

**Por que não Three.js ou WebGL?** Simulações da plataforma são 2D (laboratório de bancada, circuitos, Punnett). Canvas 2D via Konva é suficiente e tem bundle 10× menor que Three.js.

---

## Consequências

### Positivas
- Consistência visual entre UAIs sem esforço de design por tópico
- Diretrizes explícitas reduzem revisões de PR por "isso parece errado"
- Acessibilidade de cores e contraste verificada proativamente

### Negativas / riscos
- Diretrizes visuais precisam de manutenção quando design evolui. Mitigação: versionar `/docs/design-system.md` e referenciar este ADR em PRs de mudança visual.
- Konva + Framer Motion + KaTeX somam ~80kb gzip ao bundle. Mitigação: lazy-load de UAIs — `/aprender/*` carrega esses módulos apenas quando rota é acessada.

---

## Desvios futuros

Qualquer adição de fonte, biblioteca de animação, ou biblioteca de renderização matemática requer justificativa escrita neste ADR ou em ADR novo. Mudanças na paleta de cores que afetem mais de 2 componentes requerem revisão de contraste documentada.
