export interface ParamConfig {
  key: string
  label: string
  descricao: string
  min: number
  max: number
  step: number
  default: number
}

export interface KeyPoint {
  label: string
  compute: (params: Record<string, number>) => { x: number; y: number } | null
  cor: string
}

export interface GraphConfig {
  tipo: 'linear' | 'quadratica' | 'exponencial' | 'trigonometrica'
  titulo: string
  formula: (params: Record<string, number>) => string
  fn: (x: number, params: Record<string, number>) => number
  params: ParamConfig[]
  keyPoints?: KeyPoint[]
  xRange?: [number, number]
  yRange?: [number, number]
  dicas: string[]
}

export const GRAPHS: Record<string, GraphConfig> = {
  'mat.funcoes.linear': {
    tipo: 'linear',
    titulo: 'Explorador: Função Afim',
    formula: (p) => {
      const b = p.b >= 0 ? `+ ${p.b}` : `− ${Math.abs(p.b)}`
      return `f(x) = ${p.a}x ${b}`
    },
    fn: (x, p) => p.a * x + p.b,
    params: [
      {
        key: 'a', label: 'a', descricao: 'coeficiente angular (inclinação)',
        min: -5, max: 5, step: 0.5, default: 1,
      },
      {
        key: 'b', label: 'b', descricao: 'coeficiente linear (ponto y)',
        min: -8, max: 8, step: 1, default: 0,
      },
    ],
    keyPoints: [
      {
        label: 'Zero (raiz)',
        compute: (p) => p.a === 0 ? null : ({ x: -p.b / p.a, y: 0 }),
        cor: '#f97316',
      },
      {
        label: 'y-intercept',
        compute: (p) => ({ x: 0, y: p.b }),
        cor: '#7c3aed',
      },
    ],
    xRange: [-10, 10],
    yRange: [-10, 10],
    dicas: [
      'Arraste o slider de a → veja a reta girar!',
      'a > 0: reta sobe da esquerda para a direita',
      'a < 0: reta desce da esquerda para a direita',
      'a = 0: reta horizontal (função constante)',
      'b move a reta para cima ou para baixo sem girar',
    ],
  },

  'mat.funcoes.quadratica': {
    tipo: 'quadratica',
    titulo: 'Explorador: Função Quadrática',
    formula: (p) => {
      const bPart = p.b >= 0 ? `+ ${p.b}x` : `− ${Math.abs(p.b)}x`
      const cPart = p.c >= 0 ? `+ ${p.c}` : `− ${Math.abs(p.c)}`
      return `f(x) = ${p.a}x² ${bPart} ${cPart}`
    },
    fn: (x, p) => p.a * x * x + p.b * x + p.c,
    params: [
      {
        key: 'a', label: 'a', descricao: 'abre para cima (a>0) ou baixo (a<0)',
        min: -3, max: 3, step: 0.5, default: 1,
      },
      {
        key: 'b', label: 'b', descricao: 'desloca o eixo de simetria',
        min: -6, max: 6, step: 1, default: 0,
      },
      {
        key: 'c', label: 'c', descricao: 'posição no eixo y (f(0))',
        min: -8, max: 8, step: 1, default: 0,
      },
    ],
    keyPoints: [
      {
        label: 'Vértice',
        compute: (p) => {
          if (p.a === 0) return null
          const xv = -p.b / (2 * p.a)
          return { x: xv, y: p.a * xv * xv + p.b * xv + p.c }
        },
        cor: '#f97316',
      },
      {
        label: 'y = f(0)',
        compute: (p) => ({ x: 0, y: p.c }),
        cor: '#7c3aed',
      },
    ],
    xRange: [-8, 8],
    yRange: [-10, 10],
    dicas: [
      'a controla a abertura da parábola — quanto maior |a|, mais fechada',
      'a > 0 → concavidade para cima (mínimo no vértice)',
      'a < 0 → concavidade para baixo (máximo no vértice)',
      'O vértice é o ponto laranja — mova b para deslocar lateralmente',
      'Δ = b²−4ac determina se a parábola cruza o eixo x',
    ],
  },

  'mat.funcoes.exponencial': {
    tipo: 'exponencial',
    titulo: 'Explorador: Função Exponencial',
    formula: (p) => `f(x) = ${p.k} · ${p.base}ˣ`,
    fn: (x, p) => p.k * Math.pow(Math.abs(p.base) || 0.01, x),
    params: [
      {
        key: 'base', label: 'base (a)', descricao: 'a > 1: crescimento | 0 < a < 1: decaimento',
        min: 0.1, max: 4, step: 0.1, default: 2,
      },
      {
        key: 'k', label: 'k', descricao: 'coeficiente multiplicativo (valor em x=0)',
        min: -4, max: 4, step: 0.5, default: 1,
      },
    ],
    keyPoints: [
      {
        label: 'f(0) = k',
        compute: (p) => ({ x: 0, y: p.k }),
        cor: '#f97316',
      },
    ],
    xRange: [-5, 5],
    yRange: [-2, 16],
    dicas: [
      'Base > 1 → crescimento exponencial (dívida, juros, vírus)',
      'Base entre 0 e 1 → decaimento (carbono-14, meia-vida)',
      'Base = 1 → reta horizontal (não é exponencial de fato)',
      'k controla o valor em x = 0 e "estica" verticalmente',
      'O domínio é ℝ, a imagem depende do sinal de k',
    ],
  },

  'mat.estatistica': {
    tipo: 'linear',
    titulo: 'Explorador: Média vs Mediana',
    formula: (p) => `valor extremo = ${p.extremo}`,
    fn: (x, _p) => x,
    params: [
      {
        key: 'extremo', label: 'valor extremo', descricao: 'veja como afeta média e mediana',
        min: 0, max: 100, step: 5, default: 10,
      },
    ],
    xRange: [-1, 6],
    yRange: [-5, 110],
    dicas: [
      'A média é fortemente afetada por valores extremos (outliers)',
      'A mediana é robusta — não muda com valores muito altos ou baixos',
      'Em distribuições assimétricas, use a mediana como medida central',
    ],
  },
}
