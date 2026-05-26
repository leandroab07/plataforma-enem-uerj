export type TipoMapa = 'linker' | 'fill'

// --- LINKER: arrastar/clicar para conectar conceito ↔ definição ---
export interface LinkerPar {
  id: string
  conceito: string
  definicao: string
}

export interface MapaLinkerData {
  tipo: 'linker'
  instrucao: string
  pares: LinkerPar[]
}

// --- FILL: mapa com nós em branco para completar ---
export interface FillNo {
  id: string
  rotulo: string        // texto visível quando preenchido
  fixo: boolean         // false = nó em branco para o aluno preencher
  x: number             // posição % no container (0-100)
  y: number
}

export interface FillAresta {
  de: string
  para: string
}

export interface MapaFillData {
  tipo: 'fill'
  instrucao: string
  nos: FillNo[]
  arestas: FillAresta[]
  opcoes: string[]      // opções disponíveis para preencher os nós em branco
}

export type MapaData = MapaLinkerData | MapaFillData

export const MAPAS: Record<string, MapaData> = {
  'mat.estatistica': {
    tipo: 'fill',
    instrucao: 'Complete o mapa conceitual escolhendo os termos corretos para cada nó em branco.',
    nos: [
      { id: 'root',     rotulo: 'Estatística',        fixo: true,  x: 50, y: 8  },
      { id: 'med-tend', rotulo: 'Medidas de\nTendência Central', fixo: true, x: 20, y: 30 },
      { id: 'disp',     rotulo: 'Medidas de\nDispersão', fixo: true, x: 75, y: 30 },
      { id: 'media',    rotulo: 'Média',               fixo: false, x: 8,  y: 56 },
      { id: 'mediana',  rotulo: 'Mediana',             fixo: false, x: 24, y: 56 },
      { id: 'moda',     rotulo: 'Moda',                fixo: false, x: 40, y: 56 },
      { id: 'dp',       rotulo: 'Desvio\nPadrão',      fixo: false, x: 65, y: 56 },
      { id: 'var',      rotulo: 'Variância',           fixo: false, x: 84, y: 56 },
      { id: 'formula-m',rotulo: 'x̄ = Σxᵢ/n',          fixo: true,  x: 8,  y: 82 },
      { id: 'central-m',rotulo: 'Valor\ncentral',      fixo: true,  x: 24, y: 82 },
    ],
    arestas: [
      { de: 'root',     para: 'med-tend' },
      { de: 'root',     para: 'disp'     },
      { de: 'med-tend', para: 'media'    },
      { de: 'med-tend', para: 'mediana'  },
      { de: 'med-tend', para: 'moda'     },
      { de: 'disp',     para: 'dp'       },
      { de: 'disp',     para: 'var'      },
      { de: 'media',    para: 'formula-m'},
      { de: 'mediana',  para: 'central-m'},
    ],
    opcoes: ['Média', 'Mediana', 'Moda', 'Desvio\nPadrão', 'Variância', 'Amplitude', 'Frequência'],
  },

  'mat.probabilidade': {
    tipo: 'linker',
    instrucao: 'Conecte cada conceito à sua definição correta clicando nos dois lados.',
    pares: [
      {
        id: 'p1',
        conceito: 'Espaço Amostral (Ω)',
        definicao: 'Conjunto de todos os resultados possíveis de um experimento',
      },
      {
        id: 'p2',
        conceito: 'Evento',
        definicao: 'Subconjunto do espaço amostral',
      },
      {
        id: 'p3',
        conceito: 'Probabilidade Clássica',
        definicao: 'P(A) = casos favoráveis / total de casos',
      },
      {
        id: 'p4',
        conceito: 'Evento Complementar',
        definicao: 'P(A) + P(Ā) = 1',
      },
      {
        id: 'p5',
        conceito: 'Eventos Independentes',
        definicao: 'P(A ∩ B) = P(A) × P(B)',
      },
    ],
  },

  'mat.algebra.equacoes1': {
    tipo: 'fill',
    instrucao: 'Organize os passos de resolução de uma equação do 1.º grau na ordem correta.',
    nos: [
      { id: 'eq',      rotulo: 'ax + b = c',          fixo: true,  x: 50, y: 6  },
      { id: 'passo1',  rotulo: 'Isolar\ntermos em x', fixo: false, x: 20, y: 32 },
      { id: 'passo2',  rotulo: 'Isolar\no x',         fixo: false, x: 50, y: 32 },
      { id: 'passo3',  rotulo: 'Verificar\nna equação', fixo: false, x: 80, y: 32 },
      { id: 'ex1',     rotulo: '3x = c - b',          fixo: true,  x: 20, y: 60 },
      { id: 'ex2',     rotulo: 'x = (c-b)/a',         fixo: true,  x: 50, y: 60 },
      { id: 'ex3',     rotulo: 'Substituir\ne conferir', fixo: true,  x: 80, y: 60 },
    ],
    arestas: [
      { de: 'eq',     para: 'passo1' },
      { de: 'passo1', para: 'passo2' },
      { de: 'passo2', para: 'passo3' },
      { de: 'passo1', para: 'ex1'    },
      { de: 'passo2', para: 'ex2'    },
      { de: 'passo3', para: 'ex3'    },
    ],
    opcoes: ['Isolar\ntermos em x', 'Isolar\no x', 'Verificar\nna equação', 'Simplificar', 'Fatorar'],
  },

  'mat.funcoes.quadratica': {
    tipo: 'linker',
    instrucao: 'Conecte cada elemento da função quadrática ao que ele representa.',
    pares: [
      {
        id: 'q1',
        conceito: 'a > 0',
        definicao: 'Parábola com concavidade para cima',
      },
      {
        id: 'q2',
        conceito: 'Discriminante (Δ)',
        definicao: 'Δ = b² - 4ac — determina o número de raízes reais',
      },
      {
        id: 'q3',
        conceito: 'Vértice da parábola',
        definicao: 'Ponto de máximo (a < 0) ou mínimo (a > 0) da função',
      },
      {
        id: 'q4',
        conceito: 'Raízes da equação',
        definicao: 'Valores de x onde f(x) = 0 (cruzam o eixo x)',
      },
      {
        id: 'q5',
        conceito: 'Δ < 0',
        definicao: 'A parábola não toca o eixo x — sem raízes reais',
      },
    ],
  },

  'mat.funcoes.linear': {
    tipo: 'fill',
    instrucao: 'Complete o mapa da função afim f(x) = ax + b identificando cada componente.',
    nos: [
      { id: 'funcao',   rotulo: 'f(x) = ax + b',         fixo: true,  x: 50, y: 6  },
      { id: 'a',        rotulo: 'a',                       fixo: true,  x: 22, y: 32 },
      { id: 'b',        rotulo: 'b',                       fixo: true,  x: 78, y: 32 },
      { id: 'ang',      rotulo: 'Coeficiente\nAngular',    fixo: false, x: 10, y: 60 },
      { id: 'taxa',     rotulo: 'Taxa de\nVariação',       fixo: false, x: 32, y: 60 },
      { id: 'lin',      rotulo: 'Coeficiente\nLinear',     fixo: false, x: 68, y: 60 },
      { id: 'inicio',   rotulo: 'Valor\nInicial f(0)',     fixo: false, x: 88, y: 60 },
      { id: 'cresc',    rotulo: 'a>0 → crescente\na<0 → decrescente', fixo: true, x: 22, y: 86 },
    ],
    arestas: [
      { de: 'funcao', para: 'a'    },
      { de: 'funcao', para: 'b'    },
      { de: 'a',      para: 'ang'  },
      { de: 'a',      para: 'taxa' },
      { de: 'b',      para: 'lin'  },
      { de: 'b',      para: 'inicio' },
      { de: 'ang',    para: 'cresc' },
    ],
    opcoes: ['Coeficiente\nAngular', 'Taxa de\nVariação', 'Coeficiente\nLinear', 'Valor\nInicial f(0)', 'Inclinação', 'Interseção'],
  },

  'mat.geometria.plana.basico': {
    tipo: 'linker',
    instrucao: 'Associe cada teorema ou fórmula ao que ele calcula ou afirma.',
    pares: [
      {
        id: 'g1',
        conceito: 'Teorema de Pitágoras',
        definicao: 'a² = b² + c² — relaciona os lados de um triângulo retângulo',
      },
      {
        id: 'g2',
        conceito: 'Triângulo 30-60-90',
        definicao: 'Lados proporcionais a 1 : √3 : 2',
      },
      {
        id: 'g3',
        conceito: 'Semelhança de triângulos',
        definicao: 'Mesmos ângulos → lados correspondentes proporcionais',
      },
      {
        id: 'g4',
        conceito: 'Soma dos ângulos internos',
        definicao: '180° em qualquer triângulo',
      },
      {
        id: 'g5',
        conceito: 'Triângulo 45-45-90',
        definicao: 'Lados proporcionais a 1 : 1 : √2',
      },
    ],
  },
}
