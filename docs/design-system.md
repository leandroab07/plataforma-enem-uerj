# Design System — Plataforma de Estudos ENEM/UERJ

> Referência visual para UAIs e componentes da plataforma. Derivado de ADR-L04.  
> Alvo: estética de Brilliant.org + PhET + Khan Academy. Aluno-alvo: 17 anos, vestibulando de Medicina.

---

## Paleta de cores

### Cores primárias

| Nome | Token Tailwind | Hex | Uso |
|---|---|---|---|
| Ação primária | `blue-600` | `#2563EB` | Botões, links, foco |
| Ação primária claro | `blue-50` | `#EFF6FF` | Fundos de destaque suave |
| Simulação | `teal-500` | `#14B8A6` | Objetos manipuláveis, handles |
| Simulação claro | `teal-50` | `#F0FDFA` | Fundo de área de simulação |

### Cores de área do conhecimento

| Área | Token | Hex |
|---|---|---|
| Matemática | `orange-500` | `#F97316` |
| Física | `blue-500` | `#3B82F6` |
| Química | `teal-500` | `#14B8A6` |
| Biologia | `emerald-500` | `#10B981` |
| História | `rose-500` | `#F43F5E` |
| Geografia | `sky-500` | `#0EA5E9` |
| Linguagens | `violet-500` | `#8B5CF6` |
| Filosofia | `slate-500` | `#64748B` |
| Sociologia | `pink-500` | `#EC4899` |

### Feedback semântico

| Estado | Texto | Fundo | Borda |
|---|---|---|---|
| Acerto | `emerald-700` | `emerald-50` | `emerald-200` |
| Erro | `red-700` | `red-50` | `red-200` |
| Dica | `amber-700` | `amber-50` | `amber-200` |
| Neutro | `slate-700` | `slate-50` | `slate-200` |

### Neutros

| Nome | Token | Hex | Uso |
|---|---|---|---|
| Fundo de página | `white` | `#FFFFFF` | |
| Fundo de card | `slate-50` | `#F8FAFC` | |
| Borda | `slate-200` | `#E2E8F0` | |
| Texto principal | `slate-900` | `#0F172A` | |
| Texto secundário | `slate-500` | `#64748B` | |
| Texto desabilitado | `slate-300` | `#CBD5E1` | |

### Regras de contraste (WCAG 2.1 AA)

- Texto normal (< 18px): razão mínima **4.5:1**
- Texto grande (≥ 18px bold): razão mínima **3:1**
- Componentes de UI (bordas de input, ícones com significado): razão mínima **3:1**

Ferramenta: https://webaim.org/resources/contrastchecker/

---

## Tipografia

### Fonte: Inter (variable)

Carregada via `@fontsource/inter` ou Google Fonts. Fallback: `ui-sans-serif, system-ui, sans-serif`.

### Escala tipográfica

| Uso | Classe Tailwind | Tamanho | Peso | Cor padrão |
|---|---|---|---|---|
| Título de UAI | `text-2xl font-bold` | 24px | 700 | `slate-900` |
| Título de seção | `text-lg font-semibold` | 18px | 600 | `slate-800` |
| Subtítulo | `text-base font-semibold` | 16px | 600 | `slate-700` |
| Corpo de teoria | `text-base leading-relaxed` | 16px | 400 | `slate-700` |
| UI / botão | `text-sm font-medium` | 14px | 500 | herda |
| Microtexto | `text-xs` | 12px | 400 | `slate-500` |
| Fórmula inline (KaTeX) | — | 16px | — | `slate-900` |

### Fórmulas matemáticas (KaTeX)

```tsx
// Inline
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

// Uso inline
<InlineMath math="C_1 V_1 = C_2 V_2" />

// Uso display (equação centralizada)
<div className="my-4 py-3 px-4 bg-slate-50 border border-slate-200 rounded-lg text-center">
  <BlockMath math="\Delta H_{rxn} = \sum \Delta H_f(produtos) - \sum \Delta H_f(reagentes)" />
</div>
```

---

## Componentes de layout (UAI)

### Container de página de UAI

```tsx
<div className="min-h-screen bg-white">
  <div className="max-w-2xl mx-auto px-4 py-6">
    {/* conteúdo */}
  </div>
</div>
```

### Card de seção

```tsx
<div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
  {/* conteúdo */}
</div>
```

### Área de simulação

```tsx
<div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden" style={{ minHeight: 320 }}>
  {/* Canvas Konva ou iframe PhET */}
</div>
```

### Navegação de seções (breadcrumb)

6 pontos conectados por linha fina:
- Concluído: `bg-blue-600`
- Atual: `bg-blue-600 ring-2 ring-blue-200`
- Futuro: `bg-slate-200`

### Botão primário (avançar seção)

```tsx
<button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors">
  Próxima seção →
</button>
```

### Card de feedback (microexercício)

```tsx
// Acerto
<div className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex gap-2">
  <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600" />
  {explicacao}
</div>

// Erro
<div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-800 flex gap-2">
  <XCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
  {explicacao}
</div>
```

---

## Animações (Framer Motion)

### Entrada de seção

```tsx
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.2, ease: 'easeOut' }}
>
```

### Feedback de acerto

```tsx
<motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 0.25 }}>
```

### Regras absolutas de animação

- Duração máxima de transição UI: **300ms**
- Animação de pouring/derramamento: **400–600ms**
- Easing: `easeOut` para entradas, `easeIn` para saídas. **Nunca `bounce`.**
- Sem confetes, explosões de partículas, ou brilhos pulsantes ao acertar
- Sem sons de celebração

---

## Vidrarias e objetos de simulação

### Estilo de traço (SVG / Konva)

| Propriedade | Valor |
|---|---|
| `strokeWidth` | `2.5` |
| `stroke` | `#475569` (slate-600) |
| Fill da vidraria | `#F8FAFC` com opacidade `0.8` |
| Fill do líquido | cor da substância com opacidade `0.7` |
| Sombra | `drop-shadow(0 2px 4px rgba(0,0,0,0.12))` |

### Cores de substâncias padrão

| Substância | Cor | Hex |
|---|---|---|
| Água / solução incolor | Azul-claro transparente | `rgba(186, 230, 253, 0.5)` |
| CuSO₄ (sulfato de cobre) | Azul | `rgba(59, 130, 246, 0.7)` |
| KMnO₄ (permanganato) | Roxo | `rgba(147, 51, 234, 0.7)` |
| K₂Cr₂O₇ (dicromato) | Laranja | `rgba(249, 115, 22, 0.7)` |
| Fenolftaleína (básico) | Rosa | `rgba(236, 72, 153, 0.7)` |
| Indicador ácido | Vermelho | `rgba(239, 68, 68, 0.7)` |

### Estados de objeto manipulável (Konva)

| Estado | Aparência |
|---|---|
| Default | borda `2px #94A3B8` (slate-400) |
| Hover | borda `2px #2563EB` (blue-600), cursor grab |
| Dragging | borda `2px #2563EB`, opacidade `0.85`, cursor grabbing |
| Encaixado | borda `2px #059669` (emerald-600) |

---

## Iconografia

**Biblioteca:** Lucide React (já presente)

| Tamanho | Uso |
|---|---|
| `size={16}` | Ícone inline em texto |
| `size={20}` | Ícone em botão ou label |
| `size={24}` | Ação primária, ícone de seção |

Nunca usar ícone sem `aria-label` ou texto adjacente visível.

---

## Checklist de design para novos componentes

```
[ ] Cores verificadas contra paleta definida
[ ] Contraste WCAG AA verificado (≥ 4.5:1 para texto normal)
[ ] Nenhuma cor como único indicador de estado (sempre + ícone ou texto)
[ ] Substâncias/fenômenos com cor têm rótulo textual
[ ] Animações ≤ 300ms, easing suave
[ ] Sem mascotes, badges de celebração, confetes, sons
[ ] Inter como fonte; KaTeX para fórmulas (nunca imagem)
[ ] Modo passo-a-passo implementado para simulações Konva
```
