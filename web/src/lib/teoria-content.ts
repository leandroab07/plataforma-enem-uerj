export interface SecaoTeoria {
  tipo: 'texto' | 'formula' | 'exemplo' | 'destaque' | 'lista'
  titulo?: string
  conteudo: string | string[]
}

export interface TeoriaTopico {
  topicoId: string
  secoes: SecaoTeoria[]
}

export const TEORIA: Record<string, TeoriaTopico> = {
  'mat.estatistica': {
    topicoId: 'mat.estatistica',
    secoes: [
      {
        tipo: 'texto',
        titulo: 'O que é Estatística?',
        conteudo:
          'Estatística é a ciência de coletar, organizar, analisar e interpretar dados. No ENEM, as questões envolvem principalmente leitura de gráficos e tabelas, e o cálculo de medidas de tendência central.',
      },
      {
        tipo: 'destaque',
        titulo: 'As três medidas centrais',
        conteudo: 'Média, Mediana e Moda são as medidas mais cobradas. Saber diferenciar as três é fundamental.',
      },
      {
        tipo: 'formula',
        titulo: 'Média Aritmética',
        conteudo: 'x̄ = (x₁ + x₂ + ... + xₙ) / n\n\nSoma todos os valores e divide pela quantidade de elementos.',
      },
      {
        tipo: 'exemplo',
        titulo: 'Exemplo — Média',
        conteudo:
          'Notas de um aluno: 6, 7, 8, 9, 10\nMédia = (6 + 7 + 8 + 9 + 10) / 5 = 40 / 5 = 8\n\nA média do aluno é 8.',
      },
      {
        tipo: 'texto',
        titulo: 'Mediana',
        conteudo:
          'A mediana é o valor central quando os dados estão ordenados. Se o número de elementos for par, a mediana é a média dos dois valores centrais.',
      },
      {
        tipo: 'exemplo',
        titulo: 'Exemplo — Mediana',
        conteudo:
          'Dados: 3, 5, 7, 9, 11 → Mediana = 7 (elemento central)\nDados: 4, 6, 8, 10 → Mediana = (6 + 8)/2 = 7',
      },
      {
        tipo: 'texto',
        titulo: 'Moda',
        conteudo:
          'A moda é o valor que aparece com maior frequência no conjunto. Um conjunto pode ser amodal (sem moda), unimodal (uma moda), bimodal (duas modas) etc.',
      },
      {
        tipo: 'lista',
        titulo: 'Dicas para o ENEM',
        conteudo: [
          'Em gráficos de barras, compare visualmente as alturas antes de calcular.',
          'A mediana não é afetada por valores extremos — a média sim.',
          'Se o enunciado pedir "valor mais frequente", é a moda.',
          'Leia o eixo y dos gráficos com atenção à escala (pode começar em valor diferente de zero).',
        ],
      },
    ],
  },

  'mat.probabilidade': {
    topicoId: 'mat.probabilidade',
    secoes: [
      {
        tipo: 'texto',
        titulo: 'Espaço Amostral e Eventos',
        conteudo:
          'O espaço amostral (Ω) é o conjunto de todos os resultados possíveis de um experimento. Um evento é qualquer subconjunto do espaço amostral.',
      },
      {
        tipo: 'formula',
        titulo: 'Probabilidade Clássica',
        conteudo:
          'P(A) = n(A) / n(Ω)\n\nn(A) = número de resultados favoráveis ao evento A\nn(Ω) = número total de resultados possíveis\n\n0 ≤ P(A) ≤ 1',
      },
      {
        tipo: 'exemplo',
        titulo: 'Exemplo — Dado',
        conteudo:
          'Lançar um dado: Ω = {1, 2, 3, 4, 5, 6}\nP(sair número par) = {2, 4, 6} / 6 = 3/6 = 1/2 = 50%',
      },
      {
        tipo: 'destaque',
        titulo: 'Eventos Complementares',
        conteudo: 'P(A) + P(Ā) = 1\n\nSe a probabilidade de chover é 30%, a de não chover é 70%.',
      },
      {
        tipo: 'texto',
        titulo: 'Eventos Independentes',
        conteudo:
          'Dois eventos são independentes quando a ocorrência de um não afeta a probabilidade do outro. Nesse caso, a probabilidade de ambos ocorrerem é o produto das probabilidades individuais.',
      },
      {
        tipo: 'formula',
        titulo: 'Eventos Independentes',
        conteudo: 'P(A ∩ B) = P(A) × P(B)',
      },
      {
        tipo: 'exemplo',
        titulo: 'Exemplo — Moeda e Dado',
        conteudo:
          'P(cara na moeda) = 1/2\nP(6 no dado) = 1/6\nP(cara E 6) = 1/2 × 1/6 = 1/12',
      },
      {
        tipo: 'lista',
        titulo: 'O que cai no ENEM',
        conteudo: [
          'Probabilidade com urnas (extrair bolas de cores diferentes).',
          'Probabilidade com cartas de baralho.',
          'Combinação com probabilidade: quantas maneiras × probabilidade de cada.',
          'Probabilidade de exatamente k sucessos em n tentativas (Binomial).',
        ],
      },
    ],
  },

  'mat.algebra.equacoes1': {
    topicoId: 'mat.algebra.equacoes1',
    secoes: [
      {
        tipo: 'texto',
        titulo: 'Equação do 1.º Grau',
        conteudo:
          'Uma equação do 1.º grau em x tem a forma ax + b = 0, com a ≠ 0. O objetivo é descobrir o valor de x que torna a igualdade verdadeira.',
      },
      {
        tipo: 'formula',
        titulo: 'Forma Geral e Solução',
        conteudo: 'ax + b = 0\n\nx = -b / a',
      },
      {
        tipo: 'texto',
        titulo: 'Princípios de Equivalência',
        conteudo:
          'Você pode realizar a mesma operação nos dois lados da equação sem alterar a solução. Os dois princípios fundamentais são: adicionar/subtrair o mesmo valor nos dois lados, e multiplicar/dividir pelos dois lados por um número diferente de zero.',
      },
      {
        tipo: 'exemplo',
        titulo: 'Exemplo passo a passo',
        conteudo:
          'Resolver: 3x - 6 = 9\n\nPasso 1: somar 6 nos dois lados → 3x = 15\nPasso 2: dividir por 3 nos dois lados → x = 5\n\nVerificação: 3(5) - 6 = 15 - 6 = 9 ✓',
      },
      {
        tipo: 'destaque',
        titulo: 'Equações com frações',
        conteudo:
          'Multiplique todos os termos pelo MMC dos denominadores para eliminar as frações antes de resolver.',
      },
      {
        tipo: 'exemplo',
        titulo: 'Exemplo com frações',
        conteudo:
          'x/2 + x/3 = 5\nMMC(2,3) = 6\n6·(x/2) + 6·(x/3) = 6·5\n3x + 2x = 30\n5x = 30\nx = 6',
      },
      {
        tipo: 'lista',
        titulo: 'Erros comuns',
        conteudo: [
          'Esquecer de inverter o sinal ao passar um termo para o outro lado.',
          'Distribuir incorretamente ao multiplicar por um fator.',
          'Não verificar a resposta substituindo na equação original.',
        ],
      },
    ],
  },

  'mat.funcoes.linear': {
    topicoId: 'mat.funcoes.linear',
    secoes: [
      {
        tipo: 'texto',
        titulo: 'Função Afim (ou Linear)',
        conteudo:
          'Uma função afim tem a forma f(x) = ax + b, onde a é o coeficiente angular (inclinação) e b é o coeficiente linear (ponto onde o gráfico corta o eixo y).',
      },
      {
        tipo: 'formula',
        titulo: 'Forma Geral',
        conteudo: 'f(x) = ax + b\n\na = coeficiente angular (taxa de variação)\nb = coeficiente linear (valor inicial)',
      },
      {
        tipo: 'destaque',
        titulo: 'Interpretação de a e b',
        conteudo:
          'a > 0 → função crescente\na < 0 → função decrescente\na = 0 → função constante\nb = f(0) → valor quando x = 0',
      },
      {
        tipo: 'exemplo',
        titulo: 'Exemplo — Táxi',
        conteudo:
          'Um táxi cobra R$ 5,00 de bandeirada + R$ 2,00 por km.\n\nf(x) = 2x + 5\n\na = 2 (R$/km), b = 5 (taxa fixa)\n10 km → f(10) = 2(10) + 5 = R$ 25,00',
      },
      {
        tipo: 'texto',
        titulo: 'Zeros da Função',
        conteudo: 'O zero da função (raiz) é onde f(x) = 0, ou seja, onde o gráfico cruza o eixo x:\nax + b = 0 → x = -b/a',
      },
      {
        tipo: 'exemplo',
        titulo: 'Coeficiente Angular entre 2 Pontos',
        conteudo:
          'Dados os pontos A(1, 3) e B(4, 9):\na = Δy/Δx = (9 - 3) / (4 - 1) = 6/3 = 2\n\nUsando A: 3 = 2(1) + b → b = 1\nPortanto: f(x) = 2x + 1',
      },
    ],
  },

  'mat.funcoes.quadratica': {
    topicoId: 'mat.funcoes.quadratica',
    secoes: [
      {
        tipo: 'texto',
        titulo: 'Função Quadrática',
        conteudo:
          'A função quadrática tem a forma f(x) = ax² + bx + c, com a ≠ 0. Seu gráfico é uma parábola, que abre para cima se a > 0 e para baixo se a < 0.',
      },
      {
        tipo: 'formula',
        titulo: 'Fórmula de Bhaskara (Raízes)',
        conteudo: 'Δ = b² - 4ac\n\nx = (-b ± √Δ) / 2a\n\n• Δ > 0 → duas raízes reais distintas\n• Δ = 0 → raiz dupla (uma raiz)\n• Δ < 0 → sem raízes reais',
      },
      {
        tipo: 'formula',
        titulo: 'Coordenadas do Vértice',
        conteudo: 'xᵥ = -b / 2a\nyᵥ = -Δ / 4a\n\nO vértice é o ponto máximo (a < 0) ou mínimo (a > 0) da parábola.',
      },
      {
        tipo: 'exemplo',
        titulo: 'Exemplo Completo',
        conteudo:
          'f(x) = x² - 5x + 6\na=1, b=-5, c=6\n\nΔ = 25 - 24 = 1\nx = (5 ± 1) / 2 → x₁ = 3, x₂ = 2\n\nVértice: xᵥ = 5/2 = 2,5 | yᵥ = -1/4 = -0,25',
      },
      {
        tipo: 'destaque',
        titulo: 'Relações de Girard',
        conteudo: 'Soma das raízes: x₁ + x₂ = -b/a\nProduto das raízes: x₁ · x₂ = c/a\n\nPermitem encontrar raízes sem Bhaskara em casos especiais.',
      },
      {
        tipo: 'lista',
        titulo: 'Interpretações no ENEM',
        conteudo: [
          'Lucro máximo/mínimo → vértice da parábola.',
          'Quando o resultado é zero → raízes (ex: quando o objeto cai no chão).',
          'Sinal da função: f(x) > 0 ou f(x) < 0 entre as raízes.',
          'Questões com "qual o valor de x que maximiza..." sempre levam ao vértice.',
        ],
      },
    ],
  },

  'mat.geometria.plana.basico': {
    topicoId: 'mat.geometria.plana.basico',
    secoes: [
      {
        tipo: 'texto',
        titulo: 'Triângulos',
        conteudo:
          'Um triângulo tem três lados e três ângulos internos. A soma dos ângulos internos de qualquer triângulo é sempre 180°.',
      },
      {
        tipo: 'formula',
        titulo: 'Teorema de Pitágoras',
        conteudo: 'Em um triângulo retângulo:\n\na² = b² + c²\n\nonde a é a hipotenusa (lado maior, oposto ao ângulo reto) e b, c são os catetos.',
      },
      {
        tipo: 'exemplo',
        titulo: 'Exemplo — Pitágoras',
        conteudo:
          'Catetos: 3 e 4. Qual a hipotenusa?\na² = 3² + 4² = 9 + 16 = 25\na = 5\n\nO famoso triângulo 3-4-5!',
      },
      {
        tipo: 'destaque',
        titulo: 'Triângulos Notáveis',
        conteudo:
          '30°-60°-90°: lados 1 : √3 : 2\n45°-45°-90°: lados 1 : 1 : √2\n\nMemorize esses — aparecem frequentemente!',
      },
      {
        tipo: 'texto',
        titulo: 'Semelhança de Triângulos',
        conteudo:
          'Dois triângulos são semelhantes quando têm os mesmos ângulos. Os lados correspondentes são proporcionais, permitindo calcular medidas desconhecidas.',
      },
      {
        tipo: 'exemplo',
        titulo: 'Semelhança — A Rampa do ENEM',
        conteudo:
          'Rampa com altura total 2,2m. Paciente andou 3,2m e chegou a 0,8m de altura.\n\nTriângulos semelhantes: 3,2/0,8 = d/(2,2-0,8) = d/1,4\nd = 3,2 × 1,4 / 0,8 = 5,6m',
      },
      {
        tipo: 'lista',
        titulo: 'Dicas práticas',
        conteudo: [
          '√2 ≈ 1,41 | √3 ≈ 1,73 — memorize estas aproximações.',
          'Para provar semelhança: basta igualar dois ângulos (o terceiro é consequência).',
          'Em problemas com sombra, poste, espelho — pense em semelhança.',
          'Rampas e escadas frequentemente envolvem Pitágoras.',
        ],
      },
    ],
  },
}
