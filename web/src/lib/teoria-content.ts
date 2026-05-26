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

  'qui.solucoes': {
    topicoId: 'qui.solucoes',
    secoes: [
      {
        tipo: 'texto',
        titulo: 'O que é uma Solução?',
        conteudo: 'Uma solução é uma mistura homogênea de dois ou mais componentes. O componente em maior quantidade é o solvente (geralmente água) e o que está dissolvido é o soluto. Quanto mais soluto por unidade de volume, mais concentrada a solução.',
      },
      {
        tipo: 'destaque',
        titulo: 'Concentração Molar (Molaridade)',
        conteudo: 'A molaridade (M) indica quantos mols de soluto existem em 1 litro de solução. É a grandeza mais usada em laboratório para preparar e diluir soluções.',
      },
      {
        tipo: 'formula',
        titulo: 'Fórmula da Concentração Molar',
        conteudo: 'M (mol/L) = n (mols de soluto) / V (volume em litros)\n\nM = n / V\n\nExemplo: 0,5 mol de NaCl em 250 mL de solução:\nM = 0,5 / 0,250 = 2,0 mol/L',
      },
      {
        tipo: 'destaque',
        titulo: 'Lei da Diluição — C₁V₁ = C₂V₂',
        conteudo: 'Ao diluir uma solução, o número de mols de soluto permanece constante. Apenas adicionamos mais solvente. Por isso, C₁V₁ (antes) = C₂V₂ (depois).',
      },
      {
        tipo: 'formula',
        titulo: 'Fórmula de Diluição',
        conteudo: 'C₁ × V₁ = C₂ × V₂\n\nC₁ = concentração inicial (mol/L)\nV₁ = volume inicial (L ou mL)\nC₂ = concentração final (mol/L)\nV₂ = volume final (L ou mL)\n\nFator de diluição: fd = V₂/V₁ = C₁/C₂',
      },
      {
        tipo: 'exemplo',
        titulo: 'Exemplo Resolvido',
        conteudo: 'Você tem 100 mL de solução de HCl com C₁ = 3,0 mol/L.\nDeseja obter uma solução com C₂ = 0,5 mol/L.\nQual o volume final necessário?\n\nUsando C₁V₁ = C₂V₂:\n3,0 × 100 = 0,5 × V₂\nV₂ = 300 / 0,5 = 600 mL\n\nPortanto, adicionamos 500 mL de água à solução inicial.',
      },
      {
        tipo: 'lista',
        titulo: 'Fatores que afetam a solubilidade',
        conteudo: [
          'Temperatura: a maioria dos sólidos se dissolve mais em temperaturas altas; gases se dissolvem menos.',
          'Pressão: influencia principalmente a solubilidade de gases (Lei de Henry).',
          'Polaridade: "semelhante dissolve semelhante" — solventes polares dissolvem solutos polares (ex: sal em água).',
          'Agitação e granulação: aumentam a velocidade de dissolução, mas não a solubilidade máxima.',
        ],
      },
    ],
  },

  'qui.estequiometria': {
    topicoId: 'qui.estequiometria',
    secoes: [
      { tipo: 'texto', titulo: 'O que é Estequiometria?', conteudo: 'Estequiometria é o cálculo das relações quantitativas entre reagentes e produtos em uma reação química. Baseia-se na Lei de Lavoisier (conservação de massa) e na proporção dos coeficientes estequiométricos.' },
      { tipo: 'destaque', titulo: 'O conceito de Mol', conteudo: '1 mol = 6,02 × 10²³ partículas (Número de Avogadro). A massa de 1 mol de uma substância em gramas é igual à sua massa molar (em g/mol), obtida da tabela periódica.' },
      { tipo: 'formula', titulo: 'Relações fundamentais', conteudo: 'n = m / M          → mols = massa / massa molar\nn = V / 22,4       → mols de gás (CNTP, V em litros)\nn = N / Nₐ         → mols por número de partículas\n\nMassa molar (M): soma das massas atômicas\nEx: H₂O → M = 2(1) + 16 = 18 g/mol' },
      { tipo: 'exemplo', titulo: 'Cálculo Estequiométrico', conteudo: 'Reação: 2H₂ + O₂ → 2H₂O\n\nQuantos gramas de H₂O são produzidos por 4g de H₂?\n1. n(H₂) = 4g / 2 g/mol = 2 mol\n2. Proporção: 2 mol H₂ → 2 mol H₂O\n3. m(H₂O) = 2 × 18 = 36 g' },
    ],
  },

  // ══════════ QUÍMICA ══════════

  'qui.atomica': {
    topicoId: 'qui.atomica',
    secoes: [
      { tipo: 'texto', titulo: 'Modelos Atômicos', conteudo: 'O átomo é a menor unidade de um elemento químico. Ao longo da história, diferentes modelos foram propostos: Dalton (bola maciça), Thomson (pudim de passas), Rutherford (núcleo central) e Bohr (órbitas quantizadas). Atualmente usamos o modelo quântico.' },
      { tipo: 'lista', titulo: 'Partículas subatômicas', conteudo: ['Próton (p⁺): carga positiva, localizado no núcleo. Z = número de prótons = número atômico.', 'Nêutron (n⁰): sem carga, no núcleo. A − Z = número de nêutrons.', 'Elétron (e⁻): carga negativa, nos orbitais ao redor do núcleo. Em átomos neutros: e⁻ = p⁺.'] },
      { tipo: 'formula', titulo: 'Representação do átomo', conteudo: '  ᴬ\n ᴢX    onde: Z = número atômico (prótons)\n              A = número de massa (p + n)\n              Nêutrons = A − Z\n\nIsótopos: mesmo Z, diferente A (ex: ¹²C e ¹⁴C)\nIsóbaros: mesmo A, diferente Z\nIsótonos: mesmo número de nêutrons' },
      { tipo: 'destaque', titulo: 'Configuração Eletrônica', conteudo: 'Os elétrons se organizam em camadas K, L, M, N... (máx. 2, 8, 18, 32 elétrons). A última camada é a camada de valência, que determina as ligações químicas e a posição do elemento na tabela periódica.' },
      { tipo: 'exemplo', titulo: 'Exemplo: Cloro (Cl)', conteudo: 'Z = 17, A = 35\nElétrons: 17 → K(2), L(8), M(7)\nValência: 7 elétrons → precisa de 1 para completar o octeto → forma Cl⁻\nIsótopo: ³⁷Cl tem 20 nêutrons (35 − 17 = 18 nêutrons no ³⁵Cl)' },
    ],
  },

  'qui.ligacoes': {
    topicoId: 'qui.ligacoes',
    secoes: [
      { tipo: 'texto', titulo: 'Por que os átomos se ligam?', conteudo: 'Os átomos se ligam para atingir maior estabilidade energética, geralmente completando 8 elétrons na camada de valência (Regra do Octeto). A natureza da ligação depende da diferença de eletronegatividade entre os átomos envolvidos.' },
      { tipo: 'lista', titulo: 'Tipos de ligação', conteudo: ['Ligação Iônica: transferência de elétrons entre metal e não-metal. Ex: NaCl. Resulta em íons com cargas opostas que se atraem.', 'Ligação Covalente: compartilhamento de pares de elétrons entre não-metais. Ex: H₂O, CO₂, CH₄.', 'Ligação Metálica: elétrons livres (mar de elétrons) entre cátions metálicos. Explica condutividade e maleabilidade dos metais.'] },
      { tipo: 'formula', titulo: 'Polaridade e eletronegatividade', conteudo: 'ΔEN = diferença de eletronegatividade\n\nΔEN = 0       → ligação apolar (H₂, O₂, N₂)\n0 < ΔEN < 1,7 → covalente polar (H₂O, HCl)\nΔEN ≥ 1,7     → iônica (NaCl, KBr)\n\nMolécula polar ≠ ligação polar:\nCO₂ tem ligações polares, mas é apolar (simétrcia)' },
      { tipo: 'destaque', titulo: 'Geometria molecular (VSEPR)', conteudo: 'A geometria depende dos pares de elétrons ao redor do átomo central. Linear: CO₂; Angular: H₂O; Piramidal: NH₃; Tetraédrica: CH₄. A geometria determina a polaridade da molécula.' },
    ],
  },

  'qui.oxidacao': {
    topicoId: 'qui.oxidacao',
    secoes: [
      { tipo: 'texto', titulo: 'Oxidação e Redução', conteudo: 'Reações de oxirredução envolvem transferência de elétrons. Oxidação é a perda de elétrons (aumento do NOX); redução é o ganho de elétrons (diminuição do NOX). Sempre ocorrem juntas: quem oxida (agente redutor) cede elétrons para quem reduz (agente oxidante).' },
      { tipo: 'formula', titulo: 'Regras do Número de Oxidação (NOX)', conteudo: 'Elemento puro: NOX = 0  (Fe, Cl₂, O₂)\nÍon monoatômico: NOX = carga  (Na⁺ = +1, Cl⁻ = −1)\nH: +1 em compostos (exceto hidretos = −1)\nO: −2 em compostos (exceto peróxidos = −1, OF₂ = +2)\nSoma dos NOX em molécula neutra = 0\nSoma em íon poliatômico = carga do íon' },
      { tipo: 'destaque', titulo: 'Pilha de Daniell', conteudo: 'Converte energia química em elétrica. Ânodo (−): oxidação do Zn → Zn²⁺ + 2e⁻. Cátodo (+): redução do Cu²⁺ + 2e⁻ → Cu. A diferença de potencial (ddp) é medida em Volts e determina se a reação é espontânea (ddp > 0).' },
      { tipo: 'exemplo', titulo: 'Identificar oxidação/redução', conteudo: 'Reação: Fe + CuSO₄ → FeSO₄ + Cu\n\nFe: 0 → +2 (perdeu 2e⁻) = OXIDAÇÃO → Fe é agente redutor\nCu²⁺: +2 → 0 (ganhou 2e⁻) = REDUÇÃO → Cu²⁺ é agente oxidante\n\nMnemônico: OIL RIG — Oxidation Is Loss, Reduction Is Gain' },
    ],
  },

  'qui.organica.basico': {
    topicoId: 'qui.organica.basico',
    secoes: [
      { tipo: 'texto', titulo: 'Química Orgânica', conteudo: 'Estuda compostos do carbono. O carbono forma 4 ligações covalentes e pode se ligar a si mesmo formando cadeias longas. Isso explica a diversidade enorme de compostos orgânicos — base de toda matéria viva, combustíveis, plásticos e medicamentos.' },
      { tipo: 'lista', titulo: 'Funções orgânicas e grupos funcionais', conteudo: ['Hidrocarbonetos: apenas C e H. Alcanos (simples), Alcenos (dupla C=C), Alcinos (tripla C≡C), Aromáticos (benzeno).', 'Álcoois: grupo −OH. Etanol (C₂H₅OH).', 'Ácidos carboxílicos: grupo −COOH. Ácido acético (CH₃COOH).', 'Ésteres: −COO−. Formados por ácido + álcool. Presentes em frutas e perfumes.', 'Cetonas e Aldeídos: grupo carbonila C=O. Acetona, formol.', 'Aminas: grupo −NH₂. Presentes em aminoácidos.'] },
      { tipo: 'formula', titulo: 'Nomenclatura IUPAC de alcanos', conteudo: 'Prefixo (nº de C) + sufixo "ano"\n1C: met-  2C: et-  3C: prop-  4C: but-\n5C: pent- 6C: hex- 7C: hept-  8C: oct-\n\nEx: CH₃−CH₂−CH₃ = propano\n    CH₃−CH₂−OH  = etanol (álcool)\n    CH₃COOH     = ácido etanoico (acético)' },
      { tipo: 'destaque', titulo: 'Isomeria', conteudo: 'Isômeros são compostos com mesma fórmula molecular mas estrutura diferente. Isomeria plana (cadeia, posição, função) e espacial (cis-trans, óptica). O ENEM cobra muito isomeria de posição e função.' },
    ],
  },

  'qui.termoquimica': {
    topicoId: 'qui.termoquimica',
    secoes: [
      { tipo: 'texto', titulo: 'Termoquímica', conteudo: 'Estuda o calor trocado nas reações químicas. Reações exotérmicas liberam calor (ΔH < 0) — ex: combustão. Reações endotérmicas absorvem calor (ΔH > 0) — ex: fotossíntese. O calor de reação é chamado de entalpia (ΔH).' },
      { tipo: 'formula', titulo: 'Lei de Hess e entalpia', conteudo: 'ΔH reação = Σ ΔHf(produtos) − Σ ΔHf(reagentes)\n\nLei de Hess: a variação de entalpia de uma reação\nindepende do caminho — só depende do estado\ninicial e final.\n\nEquação termoquímica:\nC(s) + O₂(g) → CO₂(g)  ΔH = −393 kJ/mol' },
      { tipo: 'lista', titulo: 'Tipos de entalpia', conteudo: ['ΔHf°: entalpia de formação (a partir dos elementos no estado padrão).', 'ΔHcomb: entalpia de combustão (reação com O₂ → CO₂ + H₂O).', 'ΔHneutr: entalpia de neutralização (ácido + base → sal + água).', 'ΔHfus e ΔHvap: mudanças de estado físico.'] },
      { tipo: 'destaque', titulo: 'Energia de ligação', conteudo: 'Quebrar ligações absorve energia; formar ligações libera energia. Se a energia liberada ao formar novas ligações (produtos) > energia absorvida ao quebrar (reagentes) → reação exotérmica (ΔH < 0).' },
    ],
  },

  // ══════════ FÍSICA ══════════

  'fis.mecanica.cinematica': {
    topicoId: 'fis.mecanica.cinematica',
    secoes: [
      { tipo: 'texto', titulo: 'O que é Cinemática?', conteudo: 'Cinemática descreve o movimento sem se preocupar com suas causas. Estuda posição, velocidade e aceleração em função do tempo. Os dois movimentos mais importantes são o MRU (velocidade constante) e o MRUV (aceleração constante).' },
      { tipo: 'formula', titulo: 'Equações fundamentais', conteudo: 'MRU (aceleração = 0)\n  S = S₀ + v·t\n\nMRUV (aceleração constante)\n  v = v₀ + a·t\n  S = S₀ + v₀·t + ½·a·t²\n  v² = v₀² + 2a·ΔS   (Torricelli)\n\nUnidades: S em m, v em m/s, a em m/s², t em s' },
      { tipo: 'lista', titulo: 'Grandezas cinemáticas', conteudo: ['Posição (S): onde o objeto está em relação a um referencial.', 'Deslocamento (ΔS = Sf − Si): variação de posição — é vetorial.', 'Velocidade média (vm = ΔS/Δt): deslocamento por unidade de tempo.', 'Aceleração (a = Δv/Δt): variação de velocidade no tempo — positiva acelera, negativa desacelera.'] },
      { tipo: 'destaque', titulo: 'Queda Livre', conteudo: 'Queda livre é MRUV vertical com a = g ≈ 10 m/s² (para baixo) e v₀ = 0. Ao lançar para cima: v₀ > 0, a = −10 m/s². No ponto mais alto: v = 0. Tempo de subida = tempo de descida em campo gravitacional uniforme.' },
      { tipo: 'exemplo', titulo: 'Problema resolvido', conteudo: 'Um carro sai do repouso com a = 2 m/s². Qual sua velocidade após percorrer 100 m?\n\nUsando Torricelli: v² = v₀² + 2a·ΔS\nv² = 0 + 2(2)(100) = 400\nv = 20 m/s (= 72 km/h)' },
    ],
  },

  'fis.mecanica.dinamica': {
    topicoId: 'fis.mecanica.dinamica',
    secoes: [
      { tipo: 'texto', titulo: 'As Leis de Newton', conteudo: 'Isaac Newton formulou 3 leis que explicam o comportamento de todos os objetos sob a ação de forças (em velocidades não-relativísticas). Estas leis são a base da mecânica clássica e aparecem constantemente no ENEM.' },
      { tipo: 'lista', titulo: '1ª, 2ª e 3ª leis', conteudo: ['1ª Lei (Inércia): todo corpo em repouso permanece em repouso, e em MRU permanece em MRU, a menos que uma força resultante não nula aja sobre ele.', '2ª Lei (F = m·a): a força resultante é igual ao produto da massa pela aceleração. F e a são vetoriais e na mesma direção.', '3ª Lei (Ação e Reação): para toda força de ação há uma força de reação igual, oposta e de mesma linha de ação — em corpos diferentes.'] },
      { tipo: 'formula', titulo: 'Forças comuns', conteudo: 'Peso:      P = m · g          (g ≈ 10 m/s²)\nNormal:    N ⊥ superfície      (reação ao peso)\nAtrito:    f = μ · N          (μ = coef. de atrito)\nTração:    T (ao longo do fio)\n\nResultante: ΣF = m · a' },
      { tipo: 'exemplo', titulo: 'Plano inclinado', conteudo: 'Bloco de 5 kg em rampa de 30°, sem atrito. Qual a aceleração?\n\nForça ao longo do plano: F = P·sen30° = 5·10·0,5 = 25 N\na = F/m = 25/5 = 5 m/s²\n\nCom atrito (μ=0,2): fatrito = μ·N = μ·P·cos30° ≈ 8,66 N\na = (25 − 8,66)/5 ≈ 3,27 m/s²' },
      { tipo: 'destaque', titulo: 'Impulso e quantidade de movimento', conteudo: 'p = m·v (quantidade de movimento). Impulso I = F·Δt = Δp. O princípio da conservação do momento linear diz que, na ausência de forças externas, p_total é constante. Base das colisões (elástica, inelástica).' },
    ],
  },

  'fis.mecanica.energia': {
    topicoId: 'fis.mecanica.energia',
    secoes: [
      { tipo: 'texto', titulo: 'Energia e Trabalho', conteudo: 'Trabalho (W) é a transferência de energia por meio de uma força. Energia é a capacidade de realizar trabalho. O Princípio de Conservação de Energia afirma que energia não se cria nem se destrói, apenas se transforma.' },
      { tipo: 'formula', titulo: 'Fórmulas essenciais', conteudo: 'Trabalho:          W = F · d · cos(θ)\nEnergia Cinética:  Ec = ½ · m · v²\nEnergia Potencial: Ep = m · g · h\nConservação:       Ec₁ + Ep₁ = Ec₂ + Ep₂\nPotência:          P = W/t = F·v  (em Watts)\nRendimento:        η = W_útil / W_total (%)' },
      { tipo: 'lista', titulo: 'Tipos de energia', conteudo: ['Cinética: energia do movimento. Ex: carro em movimento, vento.', 'Potencial gravitacional: energia da posição em campo gravitacional. Ex: água em represa.', 'Potencial elástica: armazenada em molas e elásticos deformados.', 'Térmica: energia interna das partículas. Calor é transferência de energia térmica.', 'Elétrica, nuclear, química, radiante (luz): outras formas frequentes no ENEM.'] },
      { tipo: 'destaque', titulo: 'Rendimento e perdas', conteudo: 'Nenhuma máquina é 100% eficiente. O rendimento η = (energia útil / energia fornecida) × 100%. As perdas geralmente são para calor (atrito, resistência elétrica). O ENEM frequentemente apresenta problemas com hidroelétricas, motores e usinas.' },
    ],
  },

  'fis.eletricidade.basico': {
    topicoId: 'fis.eletricidade.basico',
    secoes: [
      { tipo: 'texto', titulo: 'Corrente e Tensão', conteudo: 'Corrente elétrica (I) é o fluxo ordenado de cargas elétricas (elétrons) por um condutor. Tensão (V) é a diferença de potencial que "empurra" essas cargas. Resistência (R) é a oposição ao fluxo de carga, transformando energia elétrica em calor.' },
      { tipo: 'formula', titulo: 'Lei de Ohm e Potência', conteudo: 'Lei de Ohm:  V = R · I\n\nPotência:   P = V · I = V²/R = R · I²  (em Watts)\nEnergia:    E = P · t  (em kWh ou Joules)\n\nAssociação em série:    R_eq = R₁ + R₂ + R₃\nAssociação em paralelo: 1/R_eq = 1/R₁ + 1/R₂ + 1/R₃' },
      { tipo: 'lista', titulo: 'Leis de Kirchhoff', conteudo: ['Lei dos nós: a soma das correntes que chegam a um nó = soma das que saem. (Conservação de carga)', 'Lei das malhas: a soma das tensões ao longo de uma malha fechada = 0. (Conservação de energia)', 'Aplicadas para resolver circuitos com múltiplas fontes e resistores.'] },
      { tipo: 'destaque', titulo: 'Efeito Joule', conteudo: 'Quando a corrente passa por um resistor, energia elétrica se transforma em calor. Q = R·I²·t (Joule). É por isso que fios superaquecem com corrente alta. Fusíveis e disjuntores protegem o circuito cortando a corrente ao detectar excesso.' },
      { tipo: 'exemplo', titulo: 'Conta de luz', conteudo: 'Um chuveiro de 5500W ligado 1h por dia, durante 30 dias:\nE = P·t = 5500 W × 30 h = 165.000 Wh = 165 kWh\nCusto: 165 × R$0,90 = R$148,50\n\nPor isso o chuveiro elétrico é o maior consumidor residencial!' },
    ],
  },

  'fis.ondas.som': {
    topicoId: 'fis.ondas.som',
    secoes: [
      { tipo: 'texto', titulo: 'O que são ondas?', conteudo: 'Onda é a propagação de uma perturbação que transporta energia sem transportar matéria. Ondas mecânicas precisam de meio material (som, ondas na água). Ondas eletromagnéticas se propagam no vácuo (luz, rádio, raios X).' },
      { tipo: 'formula', titulo: 'Relações fundamentais', conteudo: 'v = λ · f\n\nv = velocidade de propagação (m/s)\nλ = comprimento de onda (m) — distância entre cristas\nf = frequência (Hz) — oscilações por segundo\nT = período (s) = 1/f — tempo de uma oscilação\n\nSom no ar ≈ 340 m/s\nLuz no vácuo = 3×10⁸ m/s' },
      { tipo: 'lista', titulo: 'Características do som', conteudo: ['Altura (tom): determinada pela frequência. Sons agudos → f alta; graves → f baixa. Audição humana: 20 Hz a 20.000 Hz.', 'Intensidade (volume): determinada pela amplitude da onda. Medida em decibéis (dB).', 'Timbre: "cor" do som. Depende dos harmônicos presentes. Diferencia instrumentos musicais.'] },
      { tipo: 'destaque', titulo: 'Efeito Doppler', conteudo: 'Quando a fonte de som se move, o observador percebe frequência diferente da emitida. Fonte se aproximando → frequência aparente maior (agudo). Fonte se afastando → frequência menor (grave). Aplica-se em radar de velocidade, ultrassom e astronomia (redshift).' },
    ],
  },

  'fis.optica': {
    topicoId: 'fis.optica',
    secoes: [
      { tipo: 'texto', titulo: 'Óptica Geométrica', conteudo: 'Estuda a propagação da luz tratando-a como raios em linha reta. Princípio básico: a luz se propaga em linha reta em meios homogêneos (princípio da propagação retilínea). Ao mudar de meio, sofre reflexão e/ou refração.' },
      { tipo: 'formula', titulo: 'Reflexão e Refração', conteudo: 'Reflexão: θᵢ = θᵣ  (ângulo de incidência = ângulo de reflexão)\n\nRefração (Lei de Snell):\n  n₁ · sen(θ₁) = n₂ · sen(θ₂)\n  n = c/v  (índice de refração)\n\nEquação dos espelhos e lentes:\n  1/f = 1/p + 1/p\'   (Gauss)\n  Ampliação: A = −p\'/p' },
      { tipo: 'lista', titulo: 'Espelhos e Lentes', conteudo: ['Espelho plano: imagem virtual, direita, mesmo tamanho, simétricia.', 'Espelho côncavo (convergente): pode ser real ou virtual dependendo da posição do objeto.', 'Espelho convexo (divergente): imagem sempre virtual, direita, menor. Usado em retrovisores.', 'Lente convergente (biconvexa): corrige hipermetropia; forma imagem real quando objeto está além do foco.', 'Lente divergente (bicôncava): corrige miopia; imagem sempre virtual, direita, menor.'] },
      { tipo: 'destaque', titulo: 'Olho humano e defeitos', conteudo: 'O olho é uma lente convergente. Miopia: globo ocular longo, imagem formada antes da retina → corrigida com lente divergente. Hipermetropia: globo curto, imagem formada atrás da retina → lente convergente. Presbiopia: perda da acomodação com a idade.' },
    ],
  },

  'fis.termologia': {
    topicoId: 'fis.termologia',
    secoes: [
      { tipo: 'texto', titulo: 'Temperatura e Calor', conteudo: 'Temperatura mede a energia cinética média das partículas de um corpo. Calor é a transferência de energia térmica entre corpos a temperaturas diferentes — sempre do mais quente para o mais frio, até o equilíbrio térmico (Princípio Zero da Termodinâmica).' },
      { tipo: 'formula', titulo: 'Fórmulas de termologia', conteudo: 'Conversão de temperatura:\n  °C = (°F − 32)/1,8   TK = TC + 273\n\nCalor sensível (muda temperatura, não muda estado):\n  Q = m · c · ΔT    (c = calor específico)\n\nCalor latente (muda de estado, não muda temperatura):\n  Q = m · L\n\nDilatação: ΔL = L₀ · α · ΔT' },
      { tipo: 'lista', titulo: 'Processos termodinâmicos', conteudo: ['Isotérmico: temperatura constante. P·V = cte (Lei de Boyle).', 'Isobárico: pressão constante. V/T = cte (Lei de Charles).', 'Isocórico (isométrico): volume constante. P/T = cte (Lei de Gay-Lussac).', 'Adiabático: sem troca de calor com o exterior.'] },
      { tipo: 'destaque', titulo: 'Máquinas Térmicas e rendimento', conteudo: 'Uma máquina térmica converte calor em trabalho: η = W/Q₁ = (Q₁ − Q₂)/Q₁. O rendimento máximo possível é o de Carnot: η_carnot = 1 − T₂/T₁ (temperaturas em Kelvin). Nenhuma máquina real supera o ciclo de Carnot — isso é a 2ª Lei da Termodinâmica.' },
    ],
  },

  'fis.gravitacao': {
    topicoId: 'fis.gravitacao',
    secoes: [
      { tipo: 'texto', titulo: 'Lei da Gravitação Universal', conteudo: 'Newton descobriu que todo objeto com massa atrai outro objeto com massa por meio da força gravitacional. Essa força é sempre atrativa, age à distância e depende das massas e da distância entre os objetos.' },
      { tipo: 'formula', titulo: 'Fórmula de Newton', conteudo: 'F = G · M · m / r²\n\nF = força gravitacional (N)\nG = constante gravitacional = 6,67 × 10⁻¹¹ N·m²/kg²\nM, m = massas dos objetos (kg)\nr = distância entre os centros (m)\n\nAceleração gravitacional na superfície:\ng = G·M/R²  ≈ 9,8 m/s² ≈ 10 m/s²' },
      { tipo: 'destaque', titulo: 'Peso vs. Massa', conteudo: 'Massa (m) é uma propriedade intrínseca do objeto — não muda com a localização. Peso (P = m·g) é uma força — depende do campo gravitacional local. Na Lua, g ≈ 1,6 m/s², então um astronauta com massa de 70 kg pesa apenas 112 N (vs. 700 N na Terra).' },
      { tipo: 'lista', titulo: 'Leis de Kepler (órbitas)', conteudo: ['1ª Lei: os planetas orbitam o Sol em elipses, com o Sol em um dos focos.', '2ª Lei: a linha Sol-planeta varre áreas iguais em tempos iguais (conservação do momento angular).', '3ª Lei: T² / R³ = constante para todos os planetas do mesmo sistema.'] },
    ],
  },

  // ══════════ BIOLOGIA ══════════

  'bio.celula': {
    topicoId: 'bio.celula',
    secoes: [
      { tipo: 'texto', titulo: 'A Célula — Unidade da Vida', conteudo: 'A célula é a menor unidade estrutural e funcional dos seres vivos. Toda célula provém de outra célula (Teoria celular). Existem dois grandes grupos: procarióticas (sem núcleo definido — bactérias e arqueas) e eucarióticas (com núcleo — animais, plantas, fungos e protistas).' },
      { tipo: 'lista', titulo: 'Organelas e funções', conteudo: ['Núcleo: contém o DNA, controla as atividades celulares e a hereditariedade.', 'Mitocôndria: respiração celular aeróbia → produção de ATP. "Usina de energia".', 'Cloroplasto: fotossíntese (apenas em vegetais). Contém clorofila.', 'Ribossomos: síntese de proteínas. Presentes em todas as células.', 'Retículo Endoplasmático: processamento e transporte de proteínas (rugoso) e lipídios (liso).', 'Complexo de Golgi: empacota e exporta substâncias. "Correios da célula".', 'Lisossomos: digestão celular com enzimas. "Lixo celular".', 'Membrana plasmática: controla entrada e saída de substâncias (permeabilidade seletiva).'] },
      { tipo: 'destaque', titulo: 'Transporte pela membrana', conteudo: 'Difusão simples e osmose: passivo, sem gasto de energia, do maior para o menor gradiente. Transporte ativo: contra o gradiente, gasta ATP. Endocitose/exocitose: ingere ou expele partículas grandes por vesículas.' },
      { tipo: 'formula', titulo: 'Osmose', conteudo: 'Osmose = difusão de água pelo gradiente de concentração\n\nSolução hipotônica (< soluto) → célula incha (turgescência)\nSolução hipertônica (> soluto) → célula murcha (plasmólise)\nSolução isotônica (= soluto) → sem alteração de volume\n\nEx: soro fisiológico ≈ 0,9% NaCl → isotônico para células humanas' },
    ],
  },

  'bio.genetica.mendeliana': {
    topicoId: 'bio.genetica.mendeliana',
    secoes: [
      { tipo: 'texto', titulo: 'As Leis de Mendel', conteudo: 'Gregor Mendel (1865) descobriu os princípios da hereditariedade usando ervilhas. Ele identificou que os traços são controlados por "fatores" (hoje chamados genes) que se apresentam em duas cópias (alelos) e se transmitem de pais para filhos de forma previsível.' },
      { tipo: 'destaque', titulo: '1ª Lei — Segregação', conteudo: 'Cada caráter é determinado por um par de fatores (alelos) que se separam durante a formação dos gametas. Cada gameta recebe apenas UM alelo de cada par. Alelo dominante (A) se expressa sobre o recessivo (a). Genótipo: AA (homozigoto dom.), Aa (heterozigoto), aa (homozigoto rec.)' },
      { tipo: 'formula', titulo: 'Cruzamento e proporções', conteudo: 'Cruzamento Aa × Aa (Punnett):\n\n  |  A  |  a\n---+-----+-----\n A | AA  | Aa\n a | Aa  | aa\n\nProporção genotípica: 1 AA : 2 Aa : 1 aa\nProporção fenotípica: 3 dominantes : 1 recessivo\n(se A completa dominância sobre a)' },
      { tipo: 'lista', titulo: '2ª Lei e exceções', conteudo: ['2ª Lei (Segregação Independente): genes em cromossomos diferentes se segregam independentemente. Base do cruzamento diíbrido (9:3:3:1).', 'Dominância incompleta: Aa tem fenótipo intermediário (ex: flor rosa entre pai vermelho e mãe branca).', 'Codominância: ambos os alelos se expressam (ex: sangue tipo AB).', 'Genes ligados ao sexo: genes no cromossomo X seguem padrão diferente (daltonismo, hemofilia).'] },
    ],
  },

  'bio.evolucao': {
    topicoId: 'bio.evolucao',
    secoes: [
      { tipo: 'texto', titulo: 'Evolução Biológica', conteudo: 'Evolução é a mudança nas características de populações ao longo de gerações. A teoria de Darwin e Wallace (1858) propôs a seleção natural como mecanismo principal. Hoje a Teoria Sintética (Neo-Darwinismo) integra genética, mutação e seleção.' },
      { tipo: 'lista', titulo: 'Mecanismos evolutivos', conteudo: ['Mutação: alteração aleatória no DNA — fonte primária de variação genética.', 'Seleção natural: organismos com características favoráveis ao ambiente sobrevivem e reproduzem mais.', 'Deriva genética: mudanças aleatórias na frequência alélica em populações pequenas.', 'Fluxo gênico: migração transfere alelos entre populações.', 'Recombinação genética: crossing-over na meiose gera novas combinações alélicas.'] },
      { tipo: 'destaque', titulo: 'Especiação', conteudo: 'Espécies são grupos de organismos que se reproduzem entre si e produzem descendentes férteis. Especiação alopátrica: isolamento geográfico separa populações que evoluem independentemente. Especiação simpátrica: surgimento de novas espécies no mesmo território por isolamento reprodutivo.' },
      { tipo: 'lista', titulo: 'Evidências da evolução', conteudo: ['Registro fóssil: formas intermediárias entre espécies ancestrais e modernas.', 'Anatomia comparada: órgãos homólogos (mesma origem, funções diferentes) e análogos (mesma função, origens diferentes).', 'Embriologia: fases embrionárias semelhantes entre vertebrados.', 'Biologia molecular: semelhanças no DNA e nas proteínas revelam parentesco evolutivo.'] },
    ],
  },

  'bio.ecologia': {
    topicoId: 'bio.ecologia',
    secoes: [
      { tipo: 'texto', titulo: 'Ecologia e Ecossistemas', conteudo: 'Ecologia estuda as relações entre seres vivos e seu ambiente. Ecossistema é o conjunto de seres vivos (biocenose) e fatores abióticos (biotopo) em uma área. Os biomas brasileiros incluem Amazônia, Cerrado, Caatinga, Mata Atlântica, Pampa e Pantanal.' },
      { tipo: 'lista', titulo: 'Relações ecológicas', conteudo: ['Predação (+/−): predador se beneficia, presa é prejudicada. Ex: leão e zebra.', 'Parasitismo (+/−): parasita se beneficia, hospedeiro é prejudicado. Ex: tênia no intestino.', 'Comensalismo (+/0): um se beneficia, outro não é afetado. Ex: rêmora e tubarão.', 'Mutualismo (+/+): ambos se beneficiam. Ex: abelha e flor (polinização).', 'Competição (−/−): ambos disputam recursos. Ex: plantas pelo sol.'] },
      { tipo: 'formula', titulo: 'Cadeias e pirâmides', conteudo: 'Produtores → Consumidores primários → Secundários → Terciários\n\nEx: capim → gafanhoto → sapo → cobra → gavião\n\nPirâmide de energia: apenas 10% da energia\npassam de um nível para o próximo.\nProdutores têm maior biomassa e energia.' },
      { tipo: 'destaque', titulo: 'Ciclos biogeoquímicos', conteudo: 'Os elementos circulam entre seres vivos e ambiente. Ciclo do carbono: CO₂ é fixado na fotossíntese e liberado na respiração e decomposição. Ciclo do nitrogênio: fixação por bactérias → assimilação por plantas → nitrificação → desnitrificação. O CO₂ excessivo causa efeito estufa.' },
    ],
  },

  'bio.corpo.cardiovascular': {
    topicoId: 'bio.corpo.cardiovascular',
    secoes: [
      { tipo: 'texto', titulo: 'Sistema Cardiovascular', conteudo: 'O sistema cardiovascular é composto pelo coração, vasos sanguíneos (artérias, veias, capilares) e sangue. Sua função é transportar oxigênio, nutrientes, hormônios e eliminar CO₂ e resíduos metabólicos. Humanos têm circulação dupla e completa.' },
      { tipo: 'lista', titulo: 'Circulação dupla', conteudo: ['Circulação pulmonar (pequena): VD → pulmões → AE. Sangue venoso (rico em CO₂) vai para os pulmões e volta oxigenado.', 'Circulação sistêmica (grande): VE → corpo todo → AD. Sangue arterial (rico em O₂) chega aos tecidos e volta venoso.', 'O coração tem 4 câmaras: dois átrios (recebem) e dois ventrículos (bombeiam). Válvulas impedem refluxo.'] },
      { tipo: 'formula', titulo: 'Componentes do sangue', conteudo: 'Plasma (55%): água + proteínas + sais + hormônios + nutrientes\n\nHemácias / Eritrócitos: transportam O₂ (hemoglobina)\nLeucocitos: defesa imunológica (neutrófilos, linfócitos...)\nPlaquetas: coagulação sanguínea\n\nGrupos sanguíneos: A, B, AB, O\nFator Rh: + ou −' },
      { tipo: 'destaque', titulo: 'Pressão arterial', conteudo: 'Pressão sistólica (120 mmHg): quando o ventrículo contrai. Pressão diastólica (80 mmHg): quando relaxa. Hipertensão (>140/90) e hipotensão são riscos à saúde. Arteriosclerose (acúmulo de placas) aumenta a pressão e pode causar infarto e AVC.' },
    ],
  },

  'bio.botanica': {
    topicoId: 'bio.botanica',
    secoes: [
      { tipo: 'texto', titulo: 'Plantas e Fotossíntese', conteudo: 'As plantas são seres eucarióticos, autótrofos e com parede celular de celulose. São os principais produtores dos ecossistemas terrestres. A fotossíntese é o processo pelo qual convertem luz solar, CO₂ e água em glicose e oxigênio.' },
      { tipo: 'formula', titulo: 'Equações fundamentais', conteudo: 'Fotossíntese:\n6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂\n(luz + clorofila)\n\nRespiração celular (aeróbia):\nC₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP\n\nA fotossíntese ocorre nos cloroplastos.\nA respiração ocorre nas mitocôndrias.' },
      { tipo: 'lista', titulo: 'Partes da planta', conteudo: ['Raiz: absorção de água e sais minerais; ancoragem ao solo.', 'Caule: condução de seiva bruta (xilema: água+sais) e elaborada (floema: glicose).', 'Folha: principal órgão da fotossíntese; possui estômatos para trocas gasosas.', 'Flor: reprodução sexuada — pétalas atraem polinizadores; estames (masc.) e pistilo (fem.).', 'Fruto: protege a semente e auxilia na dispersão. Fruto verdadeiro = ovário desenvolvido.'] },
      { tipo: 'destaque', titulo: 'Transpiração e abertura dos estômatos', conteudo: 'Estômatos são poros nas folhas controlados por células-guarda. Abrem de dia (luz → fotossíntese → captam CO₂) e fecham à noite ou em escassez de água. A transpiração (evaporação pela folha) cria uma força de sucção que puxa a seiva do solo para cima.' },
    ],
  },

  'bio.microbiologia': {
    topicoId: 'bio.microbiologia',
    secoes: [
      { tipo: 'texto', titulo: 'Microrganismos', conteudo: 'Microrganismos são seres visíveis apenas ao microscópio. Incluem vírus (acelulares), bactérias (procarióticas), fungos, protistas e arqueas. São essenciais para os ciclos biogeoquímicos, a produção de alimentos e medicamentos, mas também causam doenças.' },
      { tipo: 'lista', titulo: 'Principais grupos', conteudo: ['Vírus: não são células. Necessitam de célula hospedeira para replicar. Causam: gripe, dengue, HIV, COVID-19. Tratados com antivirais ou vacinas.', 'Bactérias: células procarióticas. Podem ser úteis (Lactobacillus no iogurte, fixadoras de N₂) ou patogênicas (tuberculose, cólera). Tratadas com antibióticos.', 'Fungos: eucarióticos, heterotróficos, decompositores. Leveduras fermentam (pão, cerveja). Candida e dermatofitos causam micoses.', 'Protistas: eucarióticos unicelulares. Inclui protozoários (Plasmodium → malária; Trypanosoma → Chagas) e algas unicelulares.'] },
      { tipo: 'destaque', titulo: 'Vacinas e imunidade', conteudo: 'Vacinas estimulam o sistema imune a produzir anticorpos sem causar a doença. Imunidade ativa (vacina ou infecção natural) = duradoura. Imunidade passiva (anticorpos prontos, ex: soro antiofídico) = temporária. Linfócitos B produzem anticorpos; linfócitos T reconhecem e destroem células infectadas.' },
    ],
  },

  // ══════════ HISTÓRIA ══════════

  'hist.brasil.colonial': {
    topicoId: 'hist.brasil.colonial',
    secoes: [
      { tipo: 'texto', titulo: 'Brasil Colonial (1500–1822)', conteudo: 'O Brasil foi descoberto por Pedro Álvares Cabral em 1500 e colonizado por Portugal. A colônia era explorada em benefício da metrópole (Pacto Colonial). A economia passou por diferentes ciclos: pau-brasil, cana-de-açúcar, mineração (ouro e diamantes) e algodão.' },
      { tipo: 'lista', titulo: 'Ciclos econômicos e características', conteudo: ['Pau-brasil (séc. XVI): extração do corante, mão de obra indígena por escambo.', 'Cana-de-açúcar (séc. XVI–XVII): nordeste, engenhos, escravidão africana, capitanias hereditárias e governo-geral.', 'Mineração (séc. XVIII): Minas Gerais, Vila Rica (Ouro Preto), fiscalização intensa, Inconfidência Mineira (1789).'] },
      { tipo: 'destaque', titulo: 'Escravidão e resistência', conteudo: 'O Brasil importou cerca de 4 milhões de africanos escravizados — o maior fluxo do comércio atlântico de escravos. A resistência incluía quilombos (Palmares tinha ~30.000 habitantes), revoltas (Revolta dos Malês, 1835) e o alforriamento. A escravidão foi abolida pela Lei Áurea em 1888.' },
      { tipo: 'lista', titulo: 'Administração colonial', conteudo: ['Capitanias hereditárias (1534): divisão em faixas doadas a donatários nobres. Pouco sucesso.', 'Governo-Geral (1549): Tomé de Sousa, capital em Salvador, centralização.', 'Invasões holandesas (1624–1654): Holanda ocupou o nordeste; Maurício de Nassau promoveu desenvolvimento científico e cultural.', 'Período pombalino (1750s): reformas do Marquês de Pombal, expulsão dos jesuítas, melhoria da administração colonial.'] },
    ],
  },

  'hist.brasil.imperial': {
    topicoId: 'hist.brasil.imperial',
    secoes: [
      { tipo: 'texto', titulo: 'Independência e Império', conteudo: 'Em 1808, a família real portuguesa fugiu para o Brasil diante da invasão napoleônica, transformando a colônia em sede do Império. Em 1822, Dom Pedro I proclamou a independência às margens do Ipiranga. O Brasil foi a única monarquia da América do Sul a durar décadas.' },
      { tipo: 'lista', titulo: 'Períodos do Império', conteudo: ['1º Reinado (1822–1831): Dom Pedro I, Constituição de 1824 (outorgada), guerras na Cisplatina, crise política, abdicação.', 'Período Regencial (1831–1840): turbulento, revoltas separatistas (Cabanagem, Balaiada, Farroupilha, Sabinada), Ato Adicional de 1834.', '2º Reinado (1840–1889): Dom Pedro II, estabilidade, café como base econômica, Guerra do Paraguai (1864–70), abolição da escravidão (1888), Proclamação da República (1889).'] },
      { tipo: 'destaque', titulo: 'Abolição da Escravidão', conteudo: 'O processo foi gradual: Lei Eusébio de Queirós (1850, proibiu o tráfico negreiro); Lei do Ventre Livre (1871, filhos de escravizadas nasceriam livres); Lei do Sexagenário (1885, liberdade aos maiores de 60 anos); Lei Áurea (13/05/1888, abolição total). A cafeicultura substituiu a mão de obra por imigrantes europeus.' },
    ],
  },

  'hist.brasil.vargas': {
    topicoId: 'hist.brasil.vargas',
    secoes: [
      { tipo: 'texto', titulo: 'Era Vargas (1930–1954)', conteudo: 'Getúlio Vargas chegou ao poder pela Revolução de 1930, que derrubou a República Velha. Governou o Brasil em três fases: Governo Provisório (1930–34), Governo Constitucional (1934–37) e Estado Novo (1937–45). Voltou pelo voto em 1950 e suicidou-se em 1954.' },
      { tipo: 'lista', titulo: 'Características e realizações', conteudo: ['Estado Novo (1937–45): ditadura inspirada no fascismo europeu. Nova Constituição de 1937 ("Polaca"), censura, DIP (propaganda), perseguição a opositores.', 'Trabalhismo e CLT: Vargas criou a CLT (1943), regulando salário mínimo, jornada de 8h, férias. "Pai dos pobres" — populismo.', 'Industrialização: CSN (siderurgia), Petrobras (1953), Vale do Rio Doce. Substituição de importações.', 'Educação: criou o MEC, promoveu a educação pública nacional.'] },
      { tipo: 'destaque', titulo: 'O fim trágico', conteudo: 'Em agosto de 1954, cercado por uma crise política, pressionado pelos militares e pela UDN, Vargas se suicidou no Palácio do Catete deixando uma carta-testamento que culpou "forças internacionais" e setores contrários ao trabalhismo. Seu suicídio gerou comoção popular e enfraqueceu os golpistas temporariamente.' },
    ],
  },

  'hist.mundial.guerras': {
    topicoId: 'hist.mundial.guerras',
    secoes: [
      { tipo: 'texto', titulo: '1ª Guerra Mundial (1914–1918)', conteudo: 'A Primeira Guerra foi desencadeada pelo assassinato do arquiduque Franz Ferdinand. Envolveu Tríplice Entente (França, Reino Unido, Rússia) vs. Tríplice Aliança (Alemanha, Áustria-Hungria, Itália). Novas tecnologias (metralhadoras, gás, aviões) e trincheiras causaram 10 milhões de mortes. Terminou com o Tratado de Versalhes (1919), que humilhou a Alemanha.' },
      { tipo: 'lista', titulo: '2ª Guerra Mundial (1939–1945)', conteudo: ['Causas: crise de 1929, ascensão do nazismo, falha da Liga das Nações, expansionismo alemão.', 'Eixo (Alemanha, Itália, Japão) vs. Aliados (EUA, URSS, UK, França).', 'Holocausto: extermínio de ~6 milhões de judeus e outros grupos.', 'Brasil: enviou a FEB à Itália (1944–45) — único país latino-americano com tropas na Europa.', 'Fim: rendição alemã (maio/45) e japonesa (agosto/45, após bombas atômicas em Hiroshima e Nagasaki).'] },
      { tipo: 'destaque', titulo: 'Consequências e nova ordem', conteudo: 'Após 1945: criação da ONU (1945), Guerra Fria entre EUA e URSS, descolonização da Ásia e África, Plano Marshall para reconstrução europeia, surgimento de Israel (1948) e início do conflito árabe-israelense. O mundo ficou bipolar por décadas.' },
    ],
  },

  'hist.mundial.guerra-fria': {
    topicoId: 'hist.mundial.guerra-fria',
    secoes: [
      { tipo: 'texto', titulo: 'A Guerra Fria (1945–1991)', conteudo: 'Após a 2ª Guerra, EUA e URSS emergiriam como superpotências com sistemas opostos: capitalismo vs. socialismo. A "guerra" era ideológica, diplomática, tecnológica e por vezes militar (por procuração), mas nunca diretamente entre os dois países — sob a ameaça de destruição nuclear mútua (MAD).' },
      { tipo: 'lista', titulo: 'Eventos e fases', conteudo: ['Doutrina Truman (1947): EUA prometem apoiar países ameaçados pelo comunismo.', 'Guerra da Coreia (1950–53): primeira guerra "quente" da Guerra Fria.', 'Corrida espacial: URSS lançou Sputnik (1957) e o 1º humano (Gagarin, 1961). EUA chegaram à Lua (1969).', 'Crise dos Mísseis de Cuba (1962): momento mais perigoso — URSS instalou mísseis nucleares em Cuba.', 'Guerra do Vietnã (1955–75): EUA envolvidos para conter o comunismo, derrota e retirada humilhante.', 'Queda do Muro de Berlim (1989) e dissolução da URSS (1991): fim da Guerra Fria.'] },
      { tipo: 'destaque', titulo: 'Impacto na América Latina', conteudo: 'Os EUA apoiaram golpes militares anticomunistas na América Latina: Brasil (1964), Chile (1973), Argentina (1976). A CIA interferiu em eleições e financiou ditaduras. Cuba socialista (revolução de 1959, Fidel Castro) foi bloqueada economicamente. O desenvolvimentismo brasileiro tinha "alinhamento automático" com os EUA.' },
    ],
  },

  'hist.brasil.ditadura': {
    topicoId: 'hist.brasil.ditadura',
    secoes: [
      { tipo: 'texto', titulo: 'Ditadura Militar (1964–1985)', conteudo: 'O golpe civil-militar de 31 de março/1º de abril de 1964 derrubou o presidente João Goulart (Jango), que propunha reformas de base. Os militares governaram por 21 anos com presidentes generais, suprimindo direitos políticos, perseguindo e torturando opositores.' },
      { tipo: 'lista', titulo: 'Fases da ditadura', conteudo: ['1964–68: período inicial, criação do SNI, cassação de mandatos.', 'AI-5 (13/12/1968): ato institucional mais duro. Fechou o Congresso, suspendeu habeas corpus, intensificou repressão. "Anos de chumbo".', '1969–74: Médici, período mais violento. Milagre econômico (crescimento do PIB ~10% a.a.) com dívida externa e desigualdade.', '1974–79: Geisel, distensão "lenta, gradual e segura". Lei da Anistia (1979).', '1979–85: Figueiredo. Diretas Já! (1984, não aprovado). Tancredo Neves eleito indiretamente; Sarney assume.'] },
      { tipo: 'destaque', titulo: 'Resistência e redemocratização', conteudo: 'A resistência veio de artistas (Chico Buarque, Gilberto Gil), estudantes, Igreja Católica (Dom Hélder Câmara), guerrilha urbana (MR-8, ALN) e rural (Araguaia). A Constituição de 1988 ("Cidadã") consolidou a democracia. Em 1989, Collor venceu as primeiras eleições presidenciais diretas desde 1960.' },
    ],
  },

  'hist.brasil.republica': {
    topicoId: 'hist.brasil.republica',
    secoes: [
      { tipo: 'texto', titulo: 'República Velha (1889–1930)', conteudo: 'A Proclamação da República (15/11/1889, Marechal Deodoro da Fonseca) iniciou a República Velha, dominada pelas oligarquias agrárias. O período foi marcado pela política do café-com-leite (alternância entre São Paulo e Minas Gerais) e pelo coronelismo no interior.' },
      { tipo: 'lista', titulo: 'Características', conteudo: ['Coronelismo: poder local dos fazendeiros que controlavam o voto dos dependentes (voto de cabresto). Eleições eram fraudadas.', 'Política dos governadores: presidente federal apoiava oligarquias estaduais que, em troca, elegiam candidatos governistas.', 'Tenentismo: jovens oficiais do Exército (tenentes) revoltaram-se em busca de modernização. Revoltas de 1922, 1924 e Coluna Prestes.', 'Crise de 1929: quebra da bolsa de Nova York derrubou o preço do café. São Paulo lançou candidato sem acordo com MG → Revolução de 1930.'] },
    ],
  },

  // ══════════ GEOGRAFIA ══════════

  'geo.brasil.regioes': {
    topicoId: 'geo.brasil.regioes',
    secoes: [
      { tipo: 'texto', titulo: 'As Cinco Regiões do Brasil', conteudo: 'O IBGE divide o Brasil em 5 regiões geográficas, cada uma com características naturais, históricas e econômicas distintas. O Brasil é o 5º maior país do mundo (8,5 milhões km²) e possui grande diversidade de climas, biomas e culturas.' },
      { tipo: 'lista', titulo: 'Caracterização das regiões', conteudo: ['Norte: maior região (42% do território), Amazônia, clima equatorial, menor densidade demográfica, mineração, extrativismo. Estados: AM, PA, RR, RO, AC, AP, TO.', 'Nordeste: semiárido (Caatinga), histórico de seca, litoral turístico, polo industrial em crescimento. Maior região em número de estados (9). São Luís, Fortaleza, Recife, Salvador.', 'Centro-Oeste: Cerrado e Pantanal, agronegócio (soja, pecuária), Brasília (capital federal desde 1960). GO, MT, MS, DF.', 'Sudeste: região mais rica e populosa. São Paulo (motor econômico), Rio de Janeiro, Minas Gerais, Espírito Santo. Maior PIB, maior urbanização.', 'Sul: colonização europeia (alemã, italiana), clima subtropical, agricultua familiar, Rio Grande do Sul, Santa Catarina, Paraná.'] },
      { tipo: 'destaque', titulo: 'Desigualdades regionais', conteudo: 'Há grande desequilíbrio: Sudeste e Sul concentram renda, indústria e IDH mais altos. Norte e Nordeste têm menor desenvolvimento histórico devido ao isolamento e modelos de exploração colonial. Políticas de integração (Sudam, Sudene, transferências de renda) tentam reduzir essa disparidade.' },
    ],
  },

  'geo.mundo.populacao': {
    topicoId: 'geo.mundo.populacao',
    secoes: [
      { tipo: 'texto', titulo: 'Dinâmica Populacional', conteudo: 'A população mundial cresceu de 1 bilhão em 1800 para 8 bilhões hoje, com crescimento mais acelerado no séc. XX. A taxa de crescimento = natalidade − mortalidade (acrescida de migração). A transição demográfica descreve a passagem de altas taxas de natalidade e mortalidade para baixas taxas.' },
      { tipo: 'lista', titulo: 'Teorias e conceitos', conteudo: ['Teoria maltusiana: Malthus (1798) alertou que a população cresce geometricamente mas a produção de alimentos cresce aritmeticamente → catástrofe. Na prática, a Revolução Verde superou suas previsões.', 'Transição demográfica: 1ª fase (alta natalidade e mortalidade); 2ª (mortalidade cai, natalidade alta → explosão); 3ª (natalidade cai, crescimento lento); 4ª (ambas baixas, envelhecimento).', 'Pirâmide etária: base larga = população jovem (países em desenvolvimento). Base estreita e topo largo = envelhecimento (Europa, Japão, Brasil em transição).'] },
      { tipo: 'formula', titulo: 'Taxa de crescimento', conteudo: 'Taxa de crescimento (%) = (Natalidade − Mortalidade) / 10\n\nex: Brasil ~1,0% a.a.\n    Países europeus: próximos de 0% ou negativos\n    Países africanos: ~3% a.a.\n\nIDH (Índice de Desenvolvimento Humano):\ncombina longevidade, educação e renda (0 a 1)' },
      { tipo: 'destaque', titulo: 'Migrações', conteudo: 'Migração interna: êxodo rural brasileiro (1950–80) foi o maior movimento do mundo. Hoje há também deslocamento do Sudeste para o Centro-Oeste. Migrações internacionais: refugiados (conflitos, pobreza) e imigrantes econômicos. O Brasil recebe haitianos, venezuelanos e retorna brasileiros do exterior.' },
    ],
  },

  'geo.mundo.clima': {
    topicoId: 'geo.mundo.clima',
    secoes: [
      { tipo: 'texto', titulo: 'Clima e Tempo', conteudo: 'Tempo é o estado momentâneo da atmosfera em um lugar. Clima é o conjunto de condições atmosféricas de uma região ao longo de décadas. Os fatores que determinam o clima incluem latitude, altitude, maritimidade, correntes oceânicas e massas de ar.' },
      { tipo: 'lista', titulo: 'Principais climas do mundo', conteudo: ['Equatorial: quente e úmido o ano todo, chuvas abundantes. Amazônia, bacia do Congo, sudeste asiático.', 'Tropical: temperatura alta, duas estações (seca e chuvosa). Cerrado e partes do Brasil.', 'Semiárido: baixa pluviosidade irregular, temperatura alta. Caatinga, desertos quentes.', 'Subtropical: 4 estações definidas, invernos amenos/frios. Sul do Brasil, Argentina.', 'Temperado oceânico: Europa ocidental, chuvas regulares, verões amenos.', 'Polar: frios extremos, pouca precipitação. Ártico e Antártica.'] },
      { tipo: 'destaque', titulo: 'El Niño e La Niña', conteudo: 'El Niño: aquecimento anormal do Pacífico Sul equatorial. No Brasil: seca no Norte/Nordeste e chuvas excessivas no Sul. La Niña: resfriamento do Pacífico, efeitos opostos. Ambos afetam a agricultura, o abastecimento de água e a frequência de eventos climáticos extremos.' },
      { tipo: 'lista', titulo: 'Mudanças climáticas', conteudo: ['Efeito estufa natural é essencial para a vida; o intensificado pelo CO₂ causa aquecimento global.', 'Consequências: elevação do nível do mar, derretimento das geleiras, eventos extremos mais frequentes, migração de espécies.', 'Acordos internacionais: Protocolo de Quioto (1997), Acordo de Paris (2015) — meta de limitar aquecimento a 1,5°C.'] },
    ],
  },

  'geo.mundo.globalizacao': {
    topicoId: 'geo.mundo.globalizacao',
    secoes: [
      { tipo: 'texto', titulo: 'Globalização', conteudo: 'Globalização é a integração econômica, cultural e tecnológica mundial, acelerada a partir dos anos 1980 com o fim da Guerra Fria, a revolução das telecomunicações e a liberalização do comércio. Gera oportunidades mas também aprofunda desigualdades.' },
      { tipo: 'lista', titulo: 'Dimensões da globalização', conteudo: ['Econômica: livre circulação de capitais, multinacionais, terceirização para países com mão de obra barata.', 'Tecnológica: internet, smartphones, redes sociais encurtam distâncias e criam uma cultura global.', 'Cultural: americanização vs. glocalização (adaptação global ao local). McDonald\'s em todo lugar mas com cardápios locais.', 'Política: organismos internacionais (ONU, OMC, FMI), blocos regionais (UE, Mercosul).'] },
      { tipo: 'destaque', titulo: 'Desigualdade Norte-Sul', conteudo: 'O eixo Norte-Sul separa países desenvolvidos (Europa, EUA, Japão, Austrália) dos em desenvolvimento (África, América Latina, Ásia em desenvolvimento). Os países do Norte controlam as finanças, a tecnologia e as regras do comércio internacional. Essa desigualdade é o tema central da geopolítica moderna.' },
    ],
  },

  'geo.brasil.urbanizacao': {
    topicoId: 'geo.brasil.urbanizacao',
    secoes: [
      { tipo: 'texto', titulo: 'Urbanização no Brasil', conteudo: 'O Brasil passou de 36% urbano em 1950 para 87% em 2022 — uma das urbanizações mais rápidas da história. O processo foi alimentado pelo êxodo rural e pela industrialização do Sudeste. Hoje há 17 municípios com mais de 1 milhão de habitantes.' },
      { tipo: 'lista', titulo: 'Problemas urbanos', conteudo: ['Favelização e habitação precária: crescimento sem planejamento, falta de moradia digna.', 'Segregação socioespacial: ricos no centro/bairros nobres; pobres na periferia, com menos serviços.', 'Mobilidade urbana: trânsito caótico, transporte público insuficiente.', 'Saneamento básico: muitas cidades sem esgoto tratado, poluição de rios.', 'Violência urbana: relacionada à desigualdade e à falta de oportunidades.'] },
      { tipo: 'destaque', titulo: 'Hierarquia urbana', conteudo: 'São Paulo é a metrópole nacional e global. Rio de Janeiro, Brasília, Salvador, Recife, Fortaleza, Belo Horizonte e Curitiba são metrópoles regionais. Cidades médias crescem como opção de qualidade de vida. A rede urbana brasileira é concentrada no Sudeste, com o interior menos urbanizado.' },
    ],
  },

  'geo.mundo.geopolitica': {
    topicoId: 'geo.mundo.geopolitica',
    secoes: [
      { tipo: 'texto', titulo: 'Geopolítica Mundial Contemporânea', conteudo: 'O fim da Guerra Fria criou um mundo "unipolar" com EUA dominantes. Mas surgem novos polos: China (2ª economia), União Europeia, Índia, Rússia. O século XXI é multipolar: disputas por recursos, tecnologia, influência ideológica e ordem internacional.' },
      { tipo: 'lista', titulo: 'Blocos e organismos', conteudo: ['ONU: 193 países, Conselho de Segurança com 5 membros permanentes com direito a veto (EUA, Rússia, China, UK, França).', 'OTAN: aliança militar liderada pelos EUA. Expandiu-se para o leste europeu pós-1991, gerando tensão com a Rússia.', 'BRICS: Brasil, Rússia, Índia, China, África do Sul — países emergentes que buscam alternativa ao Ocidente.', 'Mercosul: integração econômica da América do Sul (Brasil, Argentina, Paraguai, Uruguai, Venezuela suspensa).', 'UE: maior bloco econômico, Euro como moeda comum (exceto alguns membros). Brexit (2020): Reino Unido saiu.'] },
      { tipo: 'destaque', titulo: 'Conflitos atuais', conteudo: 'Conflito Rússia-Ucrânia (desde 2022): maior conflito na Europa desde a 2ª Guerra. Conflito Israel-Palestina: longa disputa territorial com raízes no séc. XX. Tensões no Mar do Sul da China: China reivindica ilhas, confrontando EUA e países vizinhos. Esses conflitos afetam commodities, energia e rotas comerciais globais.' },
    ],
  },

  // ══════════ LINGUAGENS ══════════

  'ling.interpretacao': {
    topicoId: 'ling.interpretacao',
    secoes: [
      { tipo: 'texto', titulo: 'Interpretação de Texto no ENEM', conteudo: 'O ENEM é fortemente baseado em leitura e interpretação. Os textos trazem diferentes gêneros (notícia, conto, poema, charge, anúncio) e cobram a compreensão do sentido literal e figurado, as relações de intertextualidade e a identificação da posição do autor.' },
      { tipo: 'lista', titulo: 'Estratégias de leitura', conteudo: ['Leitura do tema: antes de ler as alternativas, formule sua própria compreensão do texto.', 'Identificar a tese: qual é a ideia central que o autor defende ou apresenta?', 'Perceber argumentos: como o autor sustenta sua tese? Dados, exemplos, citações?', 'Linguagem figurada: metáfora, ironia, eufemismo, hipérbole — frequentes em textos literários.', 'Intertextualidade: o texto dialoga com outro? Parodia ou homenageia?'] },
      { tipo: 'destaque', titulo: 'Funções da linguagem (Jakobson)', conteudo: 'Referencial: transmite informação objetiva. Emotiva: expressa emoções do emissor. Conativa/apelativa: influencia o receptor (publicidade, discurso). Fática: estabelece/mantém o canal. Metalinguística: fala sobre a própria linguagem. Poética: foco na forma da mensagem.' },
      { tipo: 'lista', titulo: 'Tipos de discurso', conteudo: ['Direto: fala do personagem com aspas ou travessão ("Eu preciso de ajuda", disse ela).', 'Indireto: narrador relata com suas palavras (Ela disse que precisava de ajuda).', 'Indireto livre: mistura voz do narrador e do personagem sem marcas (Ela precisava de ajuda, afinal.).'] },
    ],
  },

  'ling.gramatica': {
    topicoId: 'ling.gramatica',
    secoes: [
      { tipo: 'texto', titulo: 'Gramática e Norma Culta', conteudo: 'O ENEM não exige decorar regras gramaticais isoladas, mas saber usá-las em contexto de leitura e produção. Os principais tópicos gramaticais cobrados são concordância verbal e nominal, regência, crase e pontuação.' },
      { tipo: 'lista', titulo: 'Concordância verbal — casos frequentes', conteudo: ['Sujeito coletivo: o coletivo no singular pede verbo no singular: "A multidão gritou".', 'Sujeito composto antes do verbo: verbo no plural: "Pedro e Ana saíram".', 'Sujeito composto pós-verbal: pode concordar com o mais próximo: "Chegaram o menino e a menina" ou "Chegou o menino e a menina".', 'Pronomes indefinidos e interrogativos: "Quem chegou?" (singular). "Nenhum dos alunos chegou."'] },
      { tipo: 'lista', titulo: 'Regência e crase', conteudo: ['Regência verbal: gostar de, assistir a, precisar de, obedecer a, visar a (almejar).', 'Crase: ocorre quando há fusão de "a" (preposição) + "a" (artigo feminino). Use o truque do "ao/à": "Fui ao banco" → "Fui à escola" (crase).', 'Sem crase: antes de verbos, palavras masculinas, pronomes pessoais, "sua", "minha", "uma".'] },
      { tipo: 'destaque', titulo: 'Variação e norma', conteudo: 'O ENEM valoriza o conceito de variação linguística: não existe variedade errada, apenas variedades diferentes. A norma culta é exigida em contextos formais (redação, textos oficiais, literatura). O preconceito linguístico discrimina variedades populares sem base científica.' },
    ],
  },

  'ling.literatura.modernismo': {
    topicoId: 'ling.literatura.modernismo',
    secoes: [
      { tipo: 'texto', titulo: 'Modernismo Brasileiro', conteudo: 'A Semana de Arte Moderna (13–17 de fevereiro de 1922, Teatro Municipal de São Paulo) marcou a ruptura com o academismo. Influenciada pelo vanguardismo europeu (cubismo, futurismo, dadaísmo), a geração modernista buscou uma arte nacional, popular e renovada.' },
      { tipo: 'lista', titulo: 'Fases do modernismo', conteudo: ['1ª fase (1922–1930): "Fase heroica". Ruptura, irreverência, experimentação. Oswald de Andrade (Manifesto Antropófago, pau-brasil), Mário de Andrade (Macunaíma), Manuel Bandeira.', '2ª fase (1930–1945): Maturidade. Poesia mais engajada e social (Carlos Drummond de Andrade, Murilo Mendes, Cecília Meireles). Prosa regionalista: Graciliano Ramos (Vidas Secas), Jorge Amado, Rachel de Queiroz, José Lins do Rego.', '3ª fase / Pós-modernismo (1945–): Poesia concreta (Augusto de Campos), João Guimarães Rosa (Grande Sertão: Veredas), Clarice Lispector.'] },
      { tipo: 'destaque', titulo: 'Manifesto Antropófago (Oswald, 1928)', conteudo: 'A metáfora da antropofagia propõe "devorar" a cultura europeia para recriá-la com identidade brasileira — assim como os Tupinambás comiam seus inimigos para absorver sua força. É o símbolo da autonomia cultural brasileira frente à influência estrangeira.' },
    ],
  },

  'ling.literatura.romantismo': {
    topicoId: 'ling.literatura.romantismo',
    secoes: [
      { tipo: 'texto', titulo: 'Romantismo no Brasil', conteudo: 'O Romantismo chegou ao Brasil em 1836 com a publicação da revista Niterói por Gonçalves de Magalhães. Coincide com a construção da nação após a Independência (1822). Caracteriza-se por valorização do sentimento, da natureza, do passado, do herói nacional e do indivíduo.' },
      { tipo: 'lista', titulo: 'Gerações e autores', conteudo: ['1ª geração (indianista/nacionalista): Gonçalves Dias ("I-Juca Pirama"), José de Alencar (O Guarani, Iracema).', '2ª geração (ultra-romantismo/mal do século): amor impossível, morte, boêmia, evasão. Álvares de Azevedo (Noite na Taverna), Casimiro de Abreu.', '3ª geração (condoreira/social): engajamento político, abolicionismo, republicanismo. Castro Alves ("O Navio Negreiro", "Vozes d\'África").'] },
      { tipo: 'destaque', titulo: 'Prosa romântica — José de Alencar', conteudo: 'Alencar criou romances indianistas (O Guarani, Iracema), regionais (O Sertanejo, O Gaúcho) e urbanos (Senhora, Lucíola). Iracema é um anagrama de "América" — símbolo do Brasil nascente. O romance Iracema fundiu o indígena e o europeu para criar o povo brasileiro.' },
    ],
  },

  'ling.redacao': {
    topicoId: 'ling.redacao',
    secoes: [
      { tipo: 'texto', titulo: 'Redação ENEM — Dissertação Argumentativa', conteudo: 'A redação do ENEM pede uma dissertação argumentativa sobre um tema de ordem social, científica ou filosófica. O candidato deve apresentar um ponto de vista sustentado por argumentos e propor uma intervenção que respeite os direitos humanos. Nota máxima: 1000 pontos.' },
      { tipo: 'lista', titulo: '5 Competências avaliadas', conteudo: ['C1 — Domínio da norma culta da língua portuguesa: ortografia, pontuação, concordância, regência.', 'C2 — Compreensão do tema: não fugir ao tema nem tratar tangencialmente. Ler todos os textos motivadores.', 'C3 — Seleção e uso de repertório sociocultural: usar argumentos de autoridade, dados estatísticos, obras, acontecimentos históricos.', 'C4 — Coesão e coerência: uso adequado de conectivos, progressão de ideias sem contradições.', 'C5 — Proposta de intervenção: quem faz? O quê? Por quê? Como? Com que finalidade? Elaborada e vinculada ao tema.'] },
      { tipo: 'destaque', titulo: 'Estrutura ideal', conteudo: 'Introdução (3–5 linhas): contextualização + tese.\nDesenvolvimento 1 (7–10 linhas): argumento 1 + exemplos/dados.\nDesenvolvimento 2 (7–10 linhas): argumento 2 + evidências.\nConclusão (4–6 linhas): retomada da tese + proposta de intervenção detalhada com 5 elementos.' },
      { tipo: 'lista', titulo: 'Dicas para nota 1000', conteudo: ['Nunca use "eu", "nós" ou "você" — escreva de forma impessoal.', 'Evite clichês como "desde os primórdios" e "ao longo dos tempos".', 'A proposta de intervenção deve ser o mais específica e detalhada possível.', 'Revise sempre: erros de concordância e crase custam pontos na C1.', 'Repertório: relacione o tema com Filosofia, História, Ciências ou obras literárias.'] },
    ],
  },

  'ling.variacao': {
    topicoId: 'ling.variacao',
    secoes: [
      { tipo: 'texto', titulo: 'Variação Linguística', conteudo: 'Toda língua viva varia — nenhuma forma de falar é errada, apenas diferente. A variação ocorre no espaço (dialetos regionais), no tempo (língua evolui), na sociedade (grupos sociais falam diferente) e no estilo (formal vs. informal). O ENEM valoriza essa perspectiva científica sobre a língua.' },
      { tipo: 'lista', titulo: 'Tipos de variação', conteudo: ['Diatópica (geográfica): sotaques e léxico regional. "Mandioca" vs. "aipim" vs. "macaxeira". Nordestino diz "oxente!", gaúcho diz "bah!".', 'Diastrática (social): diferenças entre classes, gerações, grupos. Gírias, jargões profissionais, linguagem da internet.', 'Diafásica (situacional): o mesmo falante usa registros diferentes. Conversa informal com amigos vs. entrevista de emprego.', 'Diacrônica (histórica): língua muda ao longo do tempo. Português medieval ≠ português atual.'] },
      { tipo: 'destaque', titulo: 'Preconceito linguístico', conteudo: 'Preconceito linguístico é o julgamento negativo de variedades não-padrão, frequentemente ligado ao preconceito social e regional. Marcos Bagno, em "Preconceito Linguístico" (1999), critica a ideia de que "o brasileiro não sabe português" — na verdade, falamos de forma diferente da norma escrita culta, que é uma convenção social, não a "língua certa".' },
    ],
  },

  // ══════════ FILOSOFIA ══════════

  'fil.iluminismo': {
    topicoId: 'fil.iluminismo',
    secoes: [
      { tipo: 'texto', titulo: 'Iluminismo (séc. XVII–XVIII)', conteudo: 'O Iluminismo foi um movimento intelectual europeu que defendia o uso da razão para questionar a autoridade da Igreja e do Estado absolutista. "Atreve-te a saber!" (Sapere aude! — Kant). Influenciou as revoluções americana (1776) e francesa (1789) e as independências latino-americanas.' },
      { tipo: 'lista', titulo: 'Principais pensadores', conteudo: ['John Locke (1632–1704): defensor da propriedade privada, governo por consentimento dos governados, direito de resistência. Influenciou a Declaração de Independência dos EUA.', 'Montesquieu (1689–1755): propôs a separação dos três poderes (Executivo, Legislativo, Judiciário) — base das democracias modernas.', 'Jean-Jacques Rousseau (1712–1778): contrato social como acordo que cria soberania popular. "O homem nasce livre e em toda parte se encontra acorrentado."', 'Voltaire (1694–1778): crítico da intolerância religiosa e do fanatismo. Defensor da liberdade de expressão.'] },
      { tipo: 'destaque', titulo: 'Contrato Social', conteudo: 'Os contratualistas propõem que o Estado surgiu de um contrato entre os indivíduos. Hobbes: no estado de natureza, a vida seria "solitária, pobre, sórdida, brutal e breve" → transferimos poder a um soberano absoluto. Locke: contrato preserva direitos naturais. Rousseau: soberania é do povo, inalienável.' },
    ],
  },

  'fil.etica': {
    topicoId: 'fil.etica',
    secoes: [
      { tipo: 'texto', titulo: 'Ética e Filosofia Moral', conteudo: 'Ética é o estudo filosófico do que é certo e errado, do bem e do mal, dos valores e das normas que guiam o comportamento humano. Diferente da moral (conjunto de normas de uma cultura), a ética reflete criticamente sobre essas normas.' },
      { tipo: 'lista', titulo: 'Principais teorias éticas', conteudo: ['Ética das virtudes (Aristóteles): agir bem é exercitar as virtudes (coragem, prudência, justiça). A felicidade (eudaimonia) é o bem supremo, alcançado pelo equilíbrio (mesótes).', 'Ética deontológica (Kant): o que é certo não depende das consequências, mas do dever moral. Imperativo Categórico: "Age apenas segundo a máxima pela qual possas querer que ela se torne lei universal."', 'Utilitarismo (Bentham, Mill): a ação correta é a que produz maior felicidade para o maior número de pessoas. Ética das consequências.', 'Ética do Cuidado (contemporânea): enfatiza relações de cuidado, empatia e responsabilidade pelos vulneráveis.'] },
      { tipo: 'destaque', titulo: 'Ética e Direitos Humanos', conteudo: 'A Declaração Universal dos Direitos Humanos (ONU, 1948) estabelece princípios éticos universais: dignidade, igualdade, liberdade. Problemas éticos contemporâneos incluem bioética (aborto, eutanásia, clonagem), ética ambiental, ética da inteligência artificial e ética do consumo.' },
    ],
  },

  'fil.filosofia.antiga': {
    topicoId: 'fil.filosofia.antiga',
    secoes: [
      { tipo: 'texto', titulo: 'Filosofia Antiga — Grécia', conteudo: 'A filosofia ocidental nasceu na Grécia Antiga (séc. VI a.C.) quando os pré-socráticos buscaram explicações racionais para a origem do mundo (cosmologia) em vez de mitos. Sócrates, Platão e Aristóteles formaram o núcleo da filosofia clássica que influencia o pensamento ocidental até hoje.' },
      { tipo: 'lista', titulo: 'Principais filósofos', conteudo: ['Sócrates (469–399 a.C.): "Só sei que nada sei." Método maiêutico: perguntas para ajudar o interlocutor a encontrar a verdade. Condenado por impiedade e corromper a juventude — tomou cicuta.', 'Platão (428–348 a.C.): Teoria das Formas/Ideias — o mundo sensível é cópia imperfeita do mundo das ideias. A Caverna é a metáfora da filosofia como libertação da ignorância.', 'Aristóteles (384–322 a.C.): fundou a lógica, estudou biologia, física, ética, política. Criticou a teoria das ideias platônica. "O homem é um animal político."'] },
      { tipo: 'destaque', titulo: 'O Mito da Caverna (Platão)', conteudo: 'Prisioneiros acorrentados numa caverna só veem sombras na parede — confundem com realidade. Um liberto sai e vê o sol (a verdade). Se voltar para liberar os outros, será ridicularizado. Metáfora da filosofia: o filósofo busca a verdade (Bem supremo) e deve compartilhá-la com a sociedade.' },
    ],
  },

  // ══════════ SOCIOLOGIA ══════════

  'soc.desigualdade': {
    topicoId: 'soc.desigualdade',
    secoes: [
      { tipo: 'texto', titulo: 'Desigualdades Sociais no Brasil', conteudo: 'O Brasil é um dos países mais desiguais do mundo, com alto Índice de Gini. A desigualdade é multidimensional: econômica (renda e riqueza), social (acesso a serviços), racial (negros ganham menos e têm menos acesso), de gênero (salário médio feminino menor) e regional (Norte/Nordeste vs. Sudeste/Sul).' },
      { tipo: 'lista', titulo: 'Conceitos sociológicos', conteudo: ['Estratificação social: divisão da sociedade em camadas ou estratos com acesso diferenciado a recursos.', 'Mobilidade social: possibilidade de mudar de estrato. Mobilidade ascendente (subir) ou descendente (cair). Educação é principal mecanismo no Brasil.', 'Classes sociais (Marx): definidas pela relação com os meios de produção. Burguesia (donos) vs. proletariado (trabalho).', 'Status social (Weber): prestígio e honra social, não necessariamente ligados à riqueza.', 'Ação afirmativa: políticas que corrigem desigualdades históricas. Cotas raciais nas universidades públicas brasileiras foram aprovadas pelo STF (ADPF 186, 2012).'] },
      { tipo: 'destaque', titulo: 'Raça e Desigualdade', conteudo: 'O Brasil tem o mito da "democracia racial" (Gilberto Freyre) contestado pela sociologia: há discriminação racial estrutural. Negros (pretos e pardos) representam 56% da população mas são maioria nas estatísticas de pobreza, desemprego, encarceramento e vítimas de violência. O movimento negro e o Estatuto da Igualdade Racial (2010) buscam combater o racismo institucional.' },
    ],
  },

  'soc.trabalho': {
    topicoId: 'soc.trabalho',
    secoes: [
      { tipo: 'texto', titulo: 'Trabalho e Capitalismo', conteudo: 'O trabalho é central para a organização social. No capitalismo, o trabalho é uma mercadoria vendida pelo trabalhador ao capital. Karl Marx analisou que o trabalhador produz mais valor do que recebe (mais-valia), gerando lucro para o capitalista e alienação para o trabalhador.' },
      { tipo: 'lista', titulo: 'Conceitos marxistas', conteudo: ['Mais-valia: a diferença entre o valor produzido pelo trabalhador e o salário que recebe. Fonte do lucro capitalista.', 'Alienação: o trabalhador não se reconhece no produto de seu trabalho, não controla o processo e se torna uma engrenagem.', 'Luta de classes: conflito estrutural entre burguesia (capital) e proletariado (trabalho) é o motor da história.', 'Infraestrutura e superestrutura: a base econômica (modos de produção) determina a superestrutura (Estado, ideologia, cultura).'] },
      { tipo: 'destaque', titulo: 'Trabalho no séc. XXI', conteudo: 'Uberização: plataformas digitais criam trabalhadores "autônomos" sem direitos trabalhistas. Gig economy (economia de bicos). Automação e IA ameaçam empregos de média qualificação. Reforma trabalhista de 2017 (Brasil) flexibilizou direitos. Debate sobre renda básica universal (UBI) como resposta ao desemprego tecnológico.' },
    ],
  },

  'soc.cultura': {
    topicoId: 'soc.cultura',
    secoes: [
      { tipo: 'texto', titulo: 'Cultura e Identidade', conteudo: 'Cultura é o conjunto de valores, crenças, normas, costumes, saberes e formas simbólicas de um grupo social. É aprendida (não biológica), compartilhada, dinâmica e cumulativa. A identidade cultural define quem "somos" em relação aos outros.' },
      { tipo: 'lista', titulo: 'Conceitos', conteudo: ['Etnocentrismo: julgamento de culturas alheias a partir dos valores da própria cultura. Ex: ver práticas indígenas como "primitivas".', 'Relativismo cultural: cada cultura deve ser compreendida dentro de seu próprio contexto — sem julgamentos externos.', 'Multiculturalismo: reconhecimento e valorização da diversidade cultural dentro de uma sociedade.', 'Cultura erudita vs. popular vs. de massa: erudita = elite letrada; popular = tradições populares; massa = produzida pela indústria cultural (TV, streaming).'] },
      { tipo: 'destaque', titulo: 'Indústria Cultural (Adorno e Horkheimer)', conteudo: 'A Escola de Frankfurt criticou como o capitalismo transformou a cultura em mercadoria estandardizada. A indústria cultural produz conteúdo em série, conforma gostos, aliena e reproduz a ideologia dominante. O ENEM frequentemente apresenta charges, anúncios e textos que exigem leitura crítica da mídia e da propaganda.' },
    ],
  },

  // ══════════ MATEMÁTICA — TÓPICOS RESTANTES ══════════

  'mat.numeros.reais': {
    topicoId: 'mat.numeros.reais',
    secoes: [
      { tipo: 'texto', titulo: 'Conjuntos Numéricos', conteudo: 'Os números reais (ℝ) são a união de todos os números conhecidos: naturais, inteiros, racionais e irracionais. Eles podem ser representados em uma reta numérica contínua. Todo racional pode ser expresso como fração; todo irracional é uma dízima não periódica.' },
      { tipo: 'lista', titulo: 'Hierarquia dos conjuntos', conteudo: ['ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ', 'Naturais (ℕ): 0, 1, 2, 3, 4... (contagem)', 'Inteiros (ℤ): ...−2, −1, 0, 1, 2... (inclui negativos)', 'Racionais (ℚ): toda fração p/q com q≠0. Inclui dízimas periódicas.', 'Irracionais: √2, √3, π, e — dízimas infinitas não periódicas.', 'Reais (ℝ): todos os anteriores juntos.'] },
      { tipo: 'formula', titulo: 'Operações com potências e raízes', conteudo: 'aᵐ · aⁿ = aᵐ⁺ⁿ          (aᵐ)ⁿ = aᵐⁿ\naᵐ / aⁿ = aᵐ⁻ⁿ          a⁻ⁿ = 1/aⁿ\n(ab)ⁿ = aⁿ·bⁿ           a⁰ = 1 (a≠0)\n\n√a · √b = √(ab)         √a / √b = √(a/b)\n(√a)² = a              √(aⁿ) = a^(n/2)' },
      { tipo: 'destaque', titulo: 'Porcentagem e razões', conteudo: 'Porcentagem (%) é uma razão de denominador 100. Para aumentar X% multiplica por (1 + X/100). Para diminuir X% multiplica por (1 − X/100). Aumentos e descontos sucessivos: (1,20)(0,80) = 0,96 → queda de 4%, não zero!' },
    ],
  },

  'mat.combinatoria': {
    topicoId: 'mat.combinatoria',
    secoes: [
      { tipo: 'texto', titulo: 'Análise Combinatória', conteudo: 'A análise combinatória conta o número de maneiras de selecionar, arranjar ou distribuir objetos. A base de tudo é o Princípio Fundamental da Contagem (PFC): se uma tarefa pode ser feita de m maneiras e outra de n maneiras, juntas podem ser feitas de m × n maneiras.' },
      { tipo: 'formula', titulo: 'Fórmulas fundamentais', conteudo: 'Permutação (todos os elementos, sem repetição):\n  P_n = n!\n\nArranjo (r elementos de n, ordem importa):\n  A(n,r) = n! / (n−r)!\n\nCombinação (r elementos de n, ordem NÃO importa):\n  C(n,r) = n! / [r! · (n−r)!]\n\nLembre: n! = n × (n−1) × (n−2) × ... × 1\n         0! = 1' },
      { tipo: 'lista', titulo: 'Quando usar cada fórmula', conteudo: ['Permutação: quantas senhas de 4 dígitos distintos? 10×9×8×7 = A(10,4).', 'Combinação: quantos grupos de 3 pessoas em 10? C(10,3) = 120. Ordem não importa.', 'Arranjo: quantas formas de escolher e ordenar 3 de 10? A(10,3) = 720. Ordem importa.', 'Com repetição: senhas com dígitos repetidos = 10⁴ = 10.000.'] },
      { tipo: 'destaque', titulo: 'Triângulo de Pascal e Binômio de Newton', conteudo: 'Os coeficientes de (a+b)ⁿ são dados pelas combinações C(n,0), C(n,1),...,C(n,n). (a+b)² = a² + 2ab + b². (a+b)³ = a³ + 3a²b + 3ab² + b³. O ENEM frequentemente pede expansão de binômios em contextos de probabilidade.' },
    ],
  },

  'mat.funcoes.exponencial': {
    topicoId: 'mat.funcoes.exponencial',
    secoes: [
      { tipo: 'texto', titulo: 'Função Exponencial', conteudo: 'A função exponencial tem a forma f(x) = a · bˣ, onde b > 0 e b ≠ 1. É fundamental para modelar crescimento e decrescimento em processos naturais e econômicos: crescimento populacional, juros compostos, meia-vida radioativa, propagação de vírus.' },
      { tipo: 'formula', titulo: 'Propriedades e formas', conteudo: 'f(x) = bˣ  (forma básica, a=1)\n\nb > 1: função CRESCENTE (ex: 2ˣ → crescimento)\n0 < b < 1: função DECRESCENTE (ex: (½)ˣ → decaimento)\n\nJuros compostos: M = C·(1+i)ⁿ\n  M=montante, C=capital, i=taxa, n=período\n\nMeia-vida: N(t) = N₀ · (½)^(t/T₁/₂)' },
      { tipo: 'lista', titulo: 'Aplicações ENEM', conteudo: ['Crescimento populacional: P(t) = P₀ · r^t', 'Juros compostos: investir R$1000 a 10% ao mês → M = 1000·(1,10)^n', 'Decaimento radioativo: carbono-14 tem meia-vida de 5.730 anos.', 'Propagação de vírus: em fase inicial, crescimento exponencial — por isso medidas de distanciamento são cruciais.'] },
      { tipo: 'destaque', titulo: 'Logaritmos — a operação inversa', conteudo: 'Se bˣ = N, então log_b(N) = x. Logaritmo de base 10 é o log comum: log(1000) = 3. Logaritmo natural usa base e ≈ 2,718 (ln). Propriedades: log(a·b) = log a + log b; log(a/b) = log a − log b; log(aⁿ) = n·log a.' },
    ],
  },

  'mat.algebra.equacoes2': {
    topicoId: 'mat.algebra.equacoes2',
    secoes: [
      { tipo: 'texto', titulo: 'Equações do 2º Grau', conteudo: 'Uma equação do 2º grau tem a forma ax² + bx + c = 0, com a ≠ 0. Pode ter 0, 1 ou 2 raízes reais, determinadas pelo discriminante Δ = b² − 4ac. É fundamental para modelar trajetórias parabólicas, lucro máximo/mínimo e diversas situações físicas.' },
      { tipo: 'formula', titulo: 'Fórmula de Bhaskara e discriminante', conteudo: 'Δ = b² − 4ac\n\nx = (−b ± √Δ) / 2a\n\nΔ > 0: duas raízes reais distintas (x₁ ≠ x₂)\nΔ = 0: raiz dupla real (x₁ = x₂ = −b/2a)\nΔ < 0: sem raízes reais (duas raízes complexas)\n\nRelações de Girard:\n  x₁ + x₂ = −b/a\n  x₁ · x₂ = c/a' },
      { tipo: 'exemplo', titulo: 'Problema clássico', conteudo: 'Um número somado ao seu quadrado é igual a 12. Qual é o número?\n\nx + x² = 12  →  x² + x − 12 = 0\nΔ = 1 + 48 = 49\nx = (−1 ± 7) / 2\nx₁ = 3   ou   x₂ = −4\n\nAmbos são soluções matemáticas. O contexto define qual usar.' },
      { tipo: 'destaque', titulo: 'Inequações do 2º grau', conteudo: 'Para resolver ax² + bx + c > 0 (ou < 0): encontre as raízes x₁ e x₂. Se a > 0, a parábola abre para cima: f(x) > 0 fora do intervalo (x < x₁ ou x > x₂), f(x) < 0 entre as raízes. Inverso se a < 0.' },
    ],
  },

  'mat.geometria.plana.areas': {
    topicoId: 'mat.geometria.plana.areas',
    secoes: [
      { tipo: 'texto', titulo: 'Áreas de Figuras Planas', conteudo: 'Área é a medida da região interior de uma figura bidimensional. As fórmulas de área são cobradas em praticamente todo ENEM, frequentemente em contextos práticos como projetos de construção, cálculo de pintura, irrigação e análise de mapas.' },
      { tipo: 'formula', titulo: 'Fórmulas de área', conteudo: 'Quadrado:       A = l²\nRetângulo:      A = b · h\nTriângulo:      A = (b · h) / 2\nParalelogramo:  A = b · h\nTrapézio:       A = (B + b) · h / 2\nLosango:        A = (d₁ · d₂) / 2\nCircunferência: A = π · r²\nSetor circular: A = (θ/360) · π · r²  (θ em graus)' },
      { tipo: 'lista', titulo: 'Relações fundamentais', conteudo: ['Triângulo equilátero: A = (l²·√3)/4; h = (l·√3)/2.', 'Triângulo retângulo com lados a, b, c (hipotenusa): A = (a·b)/2. Pitágoras: c² = a²+b².', 'Fórmula de Héron: A = √[s(s−a)(s−b)(s−c)] onde s = (a+b+c)/2 — para qualquer triângulo.', 'Conversão de unidades: 1 m² = 10.000 cm² = 1.000.000 mm². 1 ha = 10.000 m².'] },
      { tipo: 'exemplo', titulo: 'Figura composta', conteudo: 'Uma piscina tem formato de retângulo (6m × 4m) com um semicírculo de raio 2m em uma extremidade.\n\nÁrea retângulo: 6 × 4 = 24 m²\nÁrea semicírculo: π × 2² / 2 ≈ 6,28 m²\nTotal: ≈ 30,28 m²' },
    ],
  },

  'mat.financeira': {
    topicoId: 'mat.financeira',
    secoes: [
      { tipo: 'texto', titulo: 'Matemática Financeira', conteudo: 'Essencial para o cotidiano e muito cobrado no ENEM. Envolve o conceito de valor do dinheiro no tempo: R$ 1.000 hoje vale mais que R$ 1.000 no futuro, pois pode ser investido e gerar juros. Compreender juros simples e compostos é fundamental para tomar boas decisões financeiras.' },
      { tipo: 'formula', titulo: 'Juros simples e compostos', conteudo: 'Juros Simples:\n  J = C · i · t\n  M = C · (1 + i·t)\n\nJuros Compostos (capitalização):\n  M = C · (1 + i)ⁿ\n  J = M − C\n\nC=capital, i=taxa (decimal), t=tempo, M=montante\n\nEx: R$2.000 a 5% ao mês por 3 meses:\n  Simples: M = 2000·(1+0,05·3) = R$2.300\n  Composto: M = 2000·(1,05)³ ≈ R$2.315,25' },
      { tipo: 'lista', titulo: 'Porcentagem e desconto', conteudo: ['Aumento de X%: multiplicar por (1 + X/100). Ex: +20% → ×1,20.', 'Desconto de X%: multiplicar por (1 − X/100). Ex: −15% → ×0,85.', 'Aumentos/descontos sucessivos não se somam! (1,20)(0,80) = 0,96 → desconto líquido de 4%.', 'Porcentagem de variação: Δ% = (Vf−Vi)/Vi × 100.'] },
      { tipo: 'destaque', titulo: 'Inflação e poder de compra', conteudo: 'Juros reais = juros nominais − inflação (aproximado). A fórmula exata é: (1 + jreal) = (1 + jnom)/(1 + infl). Se os juros nominais são 12% ao ano e a inflação é 6%, o juro real não é 6% — é (1,12/1,06)−1 ≈ 5,66%. O ENEM cobra esse conceito em questões sobre economia.' },
    ],
  },
}
