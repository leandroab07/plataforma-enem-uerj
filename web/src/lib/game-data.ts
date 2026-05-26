export interface ItemVF {
  enunciado: string
  correto: boolean
  explicacao: string
}

export interface ItemQuiz {
  enunciado: string
  alternativas: Record<string, string>
  gabarito: string
  explicacao: string
}

export interface GameData {
  vf: ItemVF[]
  quiz: ItemQuiz[]
}

export const GAMES: Record<string, GameData> = {
  'mat.funcoes.linear': {
    vf: [
      {
        enunciado: 'Na função f(x) = 3x + 2, quando x aumenta, f(x) também aumenta.',
        correto: true,
        explicacao: 'Como a = 3 > 0, a função é crescente.',
      },
      {
        enunciado: 'O coeficiente b representa a inclinação da reta.',
        correto: false,
        explicacao: 'A inclinação é o coeficiente a (angular). b é o coeficiente linear — onde a reta corta o eixo y.',
      },
      {
        enunciado: 'A função f(x) = −2x + 5 é decrescente.',
        correto: true,
        explicacao: 'Como a = −2 < 0, a função é decrescente.',
      },
      {
        enunciado: 'Toda função afim tem exatamente uma raiz (zero).',
        correto: false,
        explicacao: 'Se a = 0, a função é constante e não tem raiz (a menos que b = 0).',
      },
      {
        enunciado: 'O gráfico de f(x) = ax + b é sempre uma reta.',
        correto: true,
        explicacao: 'A função afim tem grau 1, seu gráfico é sempre uma linha reta.',
      },
      {
        enunciado: 'Se f(0) = 7, então b = 7.',
        correto: true,
        explicacao: 'f(0) = a·0 + b = b. Logo b = 7.',
      },
    ],
    quiz: [
      {
        enunciado: 'Qual é a raiz da função f(x) = 2x − 8?',
        alternativas: { A: 'x = 2', B: 'x = 4', C: 'x = −4', D: 'x = 8' },
        gabarito: 'B',
        explicacao: '2x − 8 = 0 → 2x = 8 → x = 4',
      },
      {
        enunciado: 'Uma função afim tem a = 3 e f(2) = 11. Qual é b?',
        alternativas: { A: 'b = 5', B: 'b = 4', C: 'b = 3', D: 'b = 6' },
        gabarito: 'A',
        explicacao: '11 = 3·2 + b → 11 = 6 + b → b = 5',
      },
      {
        enunciado: 'Qual das funções abaixo é decrescente?',
        alternativas: { A: 'f(x) = x + 3', B: 'f(x) = 2x', C: 'f(x) = −x + 1', D: 'f(x) = 3x − 2' },
        gabarito: 'C',
        explicacao: 'f(x) = −x + 1 tem a = −1 < 0, portanto é decrescente.',
      },
      {
        enunciado: 'Um táxi cobra R$4 de bandeirada e R$2/km. Qual a função custo?',
        alternativas: { A: 'f(x) = 4x + 2', B: 'f(x) = 2x + 4', C: 'f(x) = 6x', D: 'f(x) = 2x − 4' },
        gabarito: 'B',
        explicacao: 'Custo = 2·km + 4. f(x) = 2x + 4, onde a = 2 (R$/km) e b = 4 (bandeirada).',
      },
      {
        enunciado: 'Qual o coeficiente angular da reta que passa por (1, 5) e (3, 9)?',
        alternativas: { A: 'a = 1', B: 'a = 3', C: 'a = 2', D: 'a = 4' },
        gabarito: 'C',
        explicacao: 'a = Δy/Δx = (9−5)/(3−1) = 4/2 = 2',
      },
    ],
  },

  'mat.funcoes.quadratica': {
    vf: [
      {
        enunciado: 'Se a > 0, a parábola tem concavidade para cima.',
        correto: true,
        explicacao: 'O sinal de a determina a concavidade: a > 0 → ∪, a < 0 → ∩.',
      },
      {
        enunciado: 'Se Δ < 0, a função quadrática tem duas raízes reais.',
        correto: false,
        explicacao: 'Δ < 0 → nenhuma raiz real. Δ = 0 → raiz dupla. Δ > 0 → duas raízes.',
      },
      {
        enunciado: 'O vértice da parábola é o ponto onde a função assume seu valor máximo ou mínimo.',
        correto: true,
        explicacao: 'Máximo quando a < 0, mínimo quando a > 0.',
      },
      {
        enunciado: 'Na função f(x) = 2x² − 4x + 1, o vértice tem xᵥ = 1.',
        correto: true,
        explicacao: 'xᵥ = −b/2a = −(−4)/(2·2) = 4/4 = 1.',
      },
      {
        enunciado: 'A soma das raízes é igual a −b/a.',
        correto: true,
        explicacao: 'Relações de Girard: x₁ + x₂ = −b/a e x₁·x₂ = c/a.',
      },
    ],
    quiz: [
      {
        enunciado: 'Calcule o discriminante de x² − 5x + 6 = 0.',
        alternativas: { A: 'Δ = 1', B: 'Δ = 4', C: 'Δ = 7', D: 'Δ = 11' },
        gabarito: 'A',
        explicacao: 'Δ = b² − 4ac = 25 − 4·1·6 = 25 − 24 = 1',
      },
      {
        enunciado: 'Qual é o vértice de f(x) = x² − 4x + 3?',
        alternativas: { A: '(2, −1)', B: '(−2, 1)', C: '(2, 1)', D: '(4, 3)' },
        gabarito: 'A',
        explicacao: 'xᵥ = 4/2 = 2 | yᵥ = 4 − 8 + 3 = −1 → vértice (2, −1)',
      },
      {
        enunciado: 'Uma parábola com a < 0 e Δ = 0 tem quantas raízes reais?',
        alternativas: { A: 'Nenhuma', B: 'Uma (raiz dupla)', C: 'Duas distintas', D: 'Infinitas' },
        gabarito: 'B',
        explicacao: 'Δ = 0 sempre resulta em raiz dupla, independente do sinal de a.',
      },
      {
        enunciado: 'O produto das raízes de 2x² + 3x − 5 = 0 é:',
        alternativas: { A: '3/2', B: '−5/2', C: '5/2', D: '−3/2' },
        gabarito: 'B',
        explicacao: 'x₁·x₂ = c/a = −5/2',
      },
      {
        enunciado: 'Qual função tem vértice na origem (0,0)?',
        alternativas: { A: 'f(x) = x² + 1', B: 'f(x) = x²', C: 'f(x) = x² − 2x', D: 'f(x) = (x−1)²' },
        gabarito: 'B',
        explicacao: 'f(x) = x² tem b = 0 e c = 0, logo xᵥ = 0 e yᵥ = 0.',
      },
    ],
  },

  'mat.probabilidade': {
    vf: [
      {
        enunciado: 'A probabilidade de um evento impossível é 0.',
        correto: true,
        explicacao: 'Evento impossível: P(∅) = 0. Evento certo: P(Ω) = 1.',
      },
      {
        enunciado: 'P(A) pode ser maior que 1 se o evento for muito provável.',
        correto: false,
        explicacao: 'Probabilidade sempre está entre 0 e 1: 0 ≤ P(A) ≤ 1.',
      },
      {
        enunciado: 'Lançar dois dados são eventos independentes.',
        correto: true,
        explicacao: 'O resultado de um dado não afeta o resultado do outro.',
      },
      {
        enunciado: 'P(A) + P(Ā) = 1, onde Ā é o complementar de A.',
        correto: true,
        explicacao: 'Todo evento e seu complementar somam 1 (certeza).',
      },
      {
        enunciado: 'Uma moeda justa tem P(cara) = P(coroa) = 0,6.',
        correto: false,
        explicacao: 'Uma moeda justa tem P(cara) = P(coroa) = 1/2 = 0,5.',
      },
    ],
    quiz: [
      {
        enunciado: 'Uma urna tem 3 bolas vermelhas e 2 azuis. P(vermelha) = ?',
        alternativas: { A: '2/5', B: '3/5', C: '3/2', D: '1/2' },
        gabarito: 'B',
        explicacao: 'P(V) = 3/(3+2) = 3/5',
      },
      {
        enunciado: 'Jogando um dado, P(número par) = ?',
        alternativas: { A: '1/6', B: '2/6', C: '3/6', D: '4/6' },
        gabarito: 'C',
        explicacao: 'Pares: {2,4,6} = 3 casos. Total: 6. P = 3/6 = 1/2.',
      },
      {
        enunciado: 'P(A) = 0,3. Qual é P(Ā)?',
        alternativas: { A: '0,3', B: '0,5', C: '0,7', D: '1,3' },
        gabarito: 'C',
        explicacao: 'P(Ā) = 1 − P(A) = 1 − 0,3 = 0,7',
      },
      {
        enunciado: 'P(A) = 1/2 e P(B) = 1/3, eventos independentes. P(A e B) = ?',
        alternativas: { A: '5/6', B: '1/6', C: '1/5', D: '2/3' },
        gabarito: 'B',
        explicacao: 'P(A∩B) = P(A)·P(B) = 1/2 · 1/3 = 1/6',
      },
      {
        enunciado: 'Um baralho tem 52 cartas. P(ás) = ?',
        alternativas: { A: '4/52 = 1/13', B: '1/52', C: '4/13', D: '1/4' },
        gabarito: 'A',
        explicacao: 'Há 4 ases em 52 cartas. P = 4/52 = 1/13.',
      },
    ],
  },

  'mat.estatistica': {
    vf: [
      {
        enunciado: 'A mediana é sempre igual à média aritmética.',
        correto: false,
        explicacao: 'Só coincidem em distribuições simétricas. Em geral são diferentes.',
      },
      {
        enunciado: 'Um conjunto pode ter mais de uma moda.',
        correto: true,
        explicacao: 'Um conjunto bimodal tem duas modas (dois valores com mesma frequência máxima).',
      },
      {
        enunciado: 'A média aritmética é sensível a valores extremos (outliers).',
        correto: true,
        explicacao: 'Um valor muito alto ou baixo puxa a média para si, sem afetar a mediana.',
      },
      {
        enunciado: 'Para calcular a mediana, os dados precisam estar ordenados.',
        correto: true,
        explicacao: 'A mediana é o valor central dos dados ordenados.',
      },
      {
        enunciado: 'Moda é o valor com menor frequência no conjunto.',
        correto: false,
        explicacao: 'Moda é o valor com MAIOR frequência — o mais repetido.',
      },
    ],
    quiz: [
      {
        enunciado: 'Notas: 4, 6, 7, 8, 10. Qual é a média?',
        alternativas: { A: '6', B: '7', C: '6,5', D: '8' },
        gabarito: 'B',
        explicacao: '(4+6+7+8+10)/5 = 35/5 = 7',
      },
      {
        enunciado: 'Dados: 3, 5, 7, 9, 11. Qual é a mediana?',
        alternativas: { A: '5', B: '7', C: '9', D: '3' },
        gabarito: 'B',
        explicacao: 'Ordenados: 3,5,7,9,11. Elemento central (3º de 5) = 7.',
      },
      {
        enunciado: 'Conjunto: 2, 3, 3, 5, 7, 3, 8. Qual é a moda?',
        alternativas: { A: '3', B: '5', C: '7', D: '2' },
        gabarito: 'A',
        explicacao: 'O valor 3 aparece 3 vezes — é o mais frequente.',
      },
      {
        enunciado: 'Dados: 10, 20, 30, 40. Qual é a mediana?',
        alternativas: { A: '20', B: '25', C: '30', D: '15' },
        gabarito: 'B',
        explicacao: 'Par de elementos: mediana = (20+30)/2 = 25.',
      },
    ],
  },

  'mat.algebra.equacoes1': {
    vf: [
      {
        enunciado: 'Em 2x + 3 = 7, a solução é x = 2.',
        correto: true,
        explicacao: '2x = 7 − 3 = 4 → x = 2. Verificação: 2(2)+3 = 7 ✓',
      },
      {
        enunciado: 'Ao dividir ambos os lados por 0, a equação permanece equivalente.',
        correto: false,
        explicacao: 'Divisão por zero é indefinida. Nunca divida por zero!',
      },
      {
        enunciado: 'ax + b = 0 sempre tem solução quando a ≠ 0.',
        correto: true,
        explicacao: 'x = −b/a é a solução única para qualquer a ≠ 0.',
      },
      {
        enunciado: 'Se x = −3 é solução de 2x + k = 0, então k = 6.',
        correto: true,
        explicacao: '2(−3) + k = 0 → −6 + k = 0 → k = 6.',
      },
    ],
    quiz: [
      {
        enunciado: 'Resolva: 3x − 9 = 0',
        alternativas: { A: 'x = 3', B: 'x = −3', C: 'x = 9', D: 'x = 0' },
        gabarito: 'A',
        explicacao: '3x = 9 → x = 3',
      },
      {
        enunciado: 'Qual o valor de x em: x/2 + 3 = 7?',
        alternativas: { A: 'x = 2', B: 'x = 8', C: 'x = 5', D: 'x = 4' },
        gabarito: 'B',
        explicacao: 'x/2 = 4 → x = 8',
      },
      {
        enunciado: 'Em 50 pessoas, faltaram 5 e ficaram k. Qual k?',
        alternativas: { A: '55', B: '45', C: '40', D: '50' },
        gabarito: 'B',
        explicacao: 'k = 50 − 5 = 45',
      },
    ],
  },

  'mat.geometria.plana.basico': {
    vf: [
      {
        enunciado: 'A soma dos ângulos internos de um triângulo é 180°.',
        correto: true,
        explicacao: 'Isso vale para qualquer triângulo, sem exceção.',
      },
      {
        enunciado: 'Em um triângulo retângulo, a hipotenusa é o menor lado.',
        correto: false,
        explicacao: 'A hipotenusa é sempre o maior lado — está oposta ao ângulo reto de 90°.',
      },
      {
        enunciado: 'Num triângulo 3-4-5: 3² + 4² = 5².',
        correto: true,
        explicacao: '9 + 16 = 25. É o triângulo pitagórico mais famoso!',
      },
      {
        enunciado: 'Dois triângulos são semelhantes se têm a mesma área.',
        correto: false,
        explicacao: 'Semelhança = mesmos ângulos + lados proporcionais. Mesma área não garante semelhança.',
      },
    ],
    quiz: [
      {
        enunciado: 'Catetos 6 e 8. Qual a hipotenusa?',
        alternativas: { A: '10', B: '14', C: '12', D: '√100' },
        gabarito: 'A',
        explicacao: 'a² = 36 + 64 = 100 → a = 10',
      },
      {
        enunciado: 'Um triângulo tem ângulos 40° e 70°. O terceiro ângulo é:',
        alternativas: { A: '60°', B: '70°', C: '80°', D: '90°' },
        gabarito: 'B',
        explicacao: '180° − 40° − 70° = 70°',
      },
      {
        enunciado: 'No triângulo 30-60-90, se o menor cateto é 3, a hipotenusa é:',
        alternativas: { A: '3√2', B: '6', C: '3√3', D: '9' },
        gabarito: 'B',
        explicacao: 'Lados: 1:√3:2. Menor cateto = 3 → hipotenusa = 2·3 = 6.',
      },
    ],
  },
}
