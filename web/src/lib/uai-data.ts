import type { UAI } from './uai-types'

const DILUICOES: UAI = {
  id: 'CN.QUIM.DILUICOES',
  topico_id: 'qui.solucoes',
  titulo: 'Diluições e Soluções',
  area: 'quimica',
  tem_simulacao: false,
  tipo_simulacao: 'custom_konva',
  config_simulacao: {},
  versao_conteudo: 1,
  status: 'publicada',
  conteudo: {
    pergunta_ancora:
      'Você pega 100 mL de suco de laranja concentrado (2 mol/L) e despeja em um copo com 300 mL de água. A concentração final ficou na metade? Em um quarto? Ou outro valor? Como você descobriria?',

    secao2_instrucao:
      'Imagine a bancada de laboratório abaixo. Você tem béqueres com soluções de cores diferentes, cada uma com sua concentração. Antes de continuar, pense: o que acontece com a concentração quando você transfere parte de uma solução para outra com mais água? A simulação interativa ficará disponível neste espaço na Fase L3.',

    secao3_titulo: 'Diluições: a teoria por trás da bancada',
    secao3_teoria: [
      {
        tipo: 'texto',
        conteudo:
          'Uma diluição é o processo de diminuir a concentração de uma solução adicionando mais solvente — geralmente água. A quantidade de soluto (o que está dissolvido) permanece constante. Só o volume total aumenta.',
      },
      {
        tipo: 'destaque',
        conteudo:
          'Princípio fundamental: em toda diluição, a quantidade de soluto é conservada. n(soluto)_antes = n(soluto)_depois.',
      },
      {
        tipo: 'texto',
        conteudo:
          'Como concentração molar é definida como C = n / V, se n é constante e V aumenta, C diminui proporcionalmente. Isso leva diretamente à equação de diluição:',
      },
      {
        tipo: 'formula',
        conteudo: 'C_1 V_1 = C_2 V_2',
      },
      {
        tipo: 'lista',
        itens: [
          'C₁ = concentração inicial (mol/L)',
          'V₁ = volume inicial da solução concentrada (L ou mL)',
          'C₂ = concentração final após diluição (mol/L)',
          'V₂ = volume final da solução diluída (L ou mL)',
          'Atenção: C₁ e V₁ devem estar nas mesmas unidades que C₂ e V₂',
        ],
      },
      {
        tipo: 'exemplo',
        conteudo:
          'Temos 100 mL de HCl 2,0 mol/L e queremos preparar HCl 0,5 mol/L. Qual volume final precisamos?\n\nC₁V₁ = C₂V₂  →  2,0 × 100 = 0,5 × V₂  →  V₂ = 400 mL\n\nPortanto: medimos 100 mL da solução concentrada e completamos com água até 400 mL. Adicionamos 300 mL de água.',
      },
      {
        tipo: 'texto',
        conteudo:
          'No ENEM, diluições aparecem em contextos de laboratório, controle de qualidade de alimentos, tratamento de água e preparo de medicamentos. A equação é sempre a mesma — o que muda é qual variável você isola.',
      },
    ],

    secao4_microexercicios: [
      {
        id: 'diluicoes-ex1',
        enunciado:
          'Você tem 50 mL de solução de NaCl com concentração 4,0 mol/L. Após adicionar água, o volume final ficou 200 mL. Qual é a concentração final da solução?',
        tipo: 'multipla_escolha',
        opcoes: [
          { id: 'a', texto: '0,5 mol/L' },
          { id: 'b', texto: '1,0 mol/L' },
          { id: 'c', texto: '2,0 mol/L' },
          { id: 'd', texto: '16,0 mol/L' },
        ],
        resposta_correta: 'b',
        dica: 'Use C₁V₁ = C₂V₂. Você conhece C₁ = 4,0 mol/L, V₁ = 50 mL e V₂ = 200 mL. Isole C₂ = C₁V₁/V₂.',
        explicacao:
          'C₂ = C₁V₁/V₂ = (4,0 × 50) / 200 = 200 / 200 = 1,0 mol/L. O volume quadruplicou (50 → 200 mL), então a concentração caiu para um quarto (4,0 → 1,0 mol/L).',
      },
      {
        id: 'diluicoes-ex2',
        enunciado:
          'Para preparar 500 mL de H₂SO₄ 0,2 mol/L a partir de uma solução estoque 2,0 mol/L, qual volume da solução estoque você precisa medir?',
        tipo: 'multipla_escolha',
        opcoes: [
          { id: 'a', texto: '10 mL' },
          { id: 'b', texto: '25 mL' },
          { id: 'c', texto: '50 mL' },
          { id: 'd', texto: '100 mL' },
        ],
        resposta_correta: 'c',
        dica: 'Aqui você isola V₁. V₁ = C₂ × V₂ / C₁ = (0,2 × 500) / 2,0.',
        explicacao:
          'V₁ = (0,2 × 500) / 2,0 = 100 / 2,0 = 50 mL. Você mede 50 mL da solução estoque em uma balão volumétrico e completa com água destilada até a marca de 500 mL.',
      },
      {
        id: 'diluicoes-ex3',
        enunciado:
          'Um químico dilui 200 mL de KOH 3,0 mol/L até atingir a concentração de 0,6 mol/L. Qual é o volume final da solução diluída?',
        tipo: 'multipla_escolha',
        opcoes: [
          { id: 'a', texto: '400 mL' },
          { id: 'b', texto: '600 mL' },
          { id: 'c', texto: '800 mL' },
          { id: 'd', texto: '1000 mL' },
        ],
        resposta_correta: 'd',
        dica: 'V₂ = C₁ × V₁ / C₂ = (3,0 × 200) / 0,6.',
        explicacao:
          'V₂ = (3,0 × 200) / 0,6 = 600 / 0,6 = 1000 mL. A concentração caiu 5× (de 3,0 para 0,6), portanto o volume aumentou 5× (de 200 para 1000 mL). Verificação: 3,0 × 200 = 0,6 × 1000 = 600 ✓',
      },
    ],

    secao5_questoes_ids: [],

    secao6_resumo:
      'Em uma diluição, você adiciona solvente para reduzir a concentração da solução. A quantidade de soluto não muda — só o volume total aumenta. Use C₁V₁ = C₂V₂ para calcular qualquer uma das quatro variáveis quando as outras três são conhecidas.',

    secao6_conexoes: [
      { uai_id: 'CN.QUIM.ESTEQUIOMETRIA', titulo: 'Estequiometria', tipo: 'desbloqueia' },
      { uai_id: 'CN.QUIM.EQUILIBRIO', titulo: 'Equilíbrio Químico', tipo: 'desbloqueia' },
    ],
  },
}

export const UAI_MOCK: Record<string, UAI> = {
  [DILUICOES.id]: DILUICOES,
}
