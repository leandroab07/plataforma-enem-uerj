# Mapeamento de Candidatos a UAI

> Classificação de tópicos conforme critérios do ADR-L01.  
> Atualizar a cada fase de expansão de UAIs.  
> Última atualização: 2026-05-26

---

## Legenda de critérios (ADR-L01)

**Critério obrigatório:** Fenômeno com parâmetros contínuos manipuláveis e efeito diretamente observável.

**Critérios de reforço (precisam de ≥2):**
- R1: ≥3 questões ENEM nos últimos 5 anos
- R2: Erro conceitual comum que simulação corrige por evidência
- R3: Relação numérica não-intuitiva sem visualização
- R4: Simulação PhET ou aberta disponível
- R5: Alta transferência para outros tópicos

---

## Tópicos classificados como UAI

| ID do tópico | Nome | Critérios atendidos | Tipo de simulação | Fase prevista | Status |
|---|---|---|---|---|---|
| `CN.QUIM.DILUICOES` | Diluições e soluções | Obrig. + R1,R2,R3,R4,R5 | Custom (C3 — validação de estado) | L3 | Prova de conceito |
| `CN.QUIM.ESTEQUIOMETRIA` | Estequiometria | Obrig. + R1,R2,R3,R5 | Custom (C3) | L4 | Planejado |
| `CN.FIS.CINEMATICA` | Cinemática | Obrig. + R1,R3,R4,R5 | PhET embed | L5+ | Planejado |
| `CN.FIS.ELETRODIN` | Eletrodinâmica básica | Obrig. + R1,R2,R3,R4 | PhET embed | L5+ | Planejado |
| `CN.BIO.GENETICA` | Genética mendeliana | Obrig. + R1,R2,R3,R5 | Custom (C1 — ausência PhET específico) | L6 | Planejado |
| `CN.BIO.ECOLOGIA` | Ecologia — pirâmides e cadeias | Obrig. + R1,R2,R3 | Custom (C1) | L6 | Planejado |
| `MT.FUNCOES` | Funções (gráficos manipuláveis) | Obrig. + R1,R2,R3,R5 | Custom (C3) | L6 | Planejado |
| `CN.QUIM.EQUILIBRIO` | Equilíbrio químico | Obrig. + R1,R2,R3,R4 | PhET embed | L6 | Planejado |

---

## Tópicos classificados como simples (sem UAI)

| ID do tópico | Nome | Motivo de exclusão |
|---|---|---|
| `LG.LIT.MODERNISMO` | Literatura: Modernismo | Sem fenômeno manipulável; critério obrigatório não atendido |
| `LG.LIT.ROMANTISMO` | Literatura: Romantismo | Sem fenômeno manipulável |
| `LG.INTERPRETACAO` | Interpretação de texto | Análise qualitativa; simulação não agrega |
| `LG.GRAMATICA` | Gramática | Classificação; sem relação numérica |
| `LG.REDACAO` | Redação | Produção textual; simulação contraproducente |
| `LG.VARIACAO` | Variação linguística | Análise qualitativa |
| `CH.HIST.BRASIL.COLONIAL` | Brasil colonial | Narrativa histórica; critério obrigatório não atendido |
| `CH.HIST.BRASIL.IMPERIAL` | Brasil imperial | Narrativa histórica |
| `CH.HIST.BRASIL.VARGAS` | Era Vargas | Narrativa histórica |
| `CH.HIST.MUNDIAL.GUERRAS` | Guerras mundiais | Narrativa histórica |
| `CH.HIST.MUNDIAL.GUERRA_FRIA` | Guerra Fria | Narrativa histórica |
| `CH.HIST.BRASIL.DITADURA` | Ditadura militar | Narrativa histórica |
| `CH.GEO.BRASIL.REGIOES` | Regiões do Brasil | Mapa conceitual; sem relação numérica manipulável |
| `CH.GEO.MUNDO.CLIMA` | Clima e biomas | Sem interação causal manipulável no nível ENEM |
| `CH.GEO.MUNDO.POPULACAO` | População mundial | Dados estáticos; gráfico passivo suficiente |
| `CH.FIL.ILUMINISMO` | Iluminismo | Narrativa filosófica |
| `CH.FIL.ETICA` | Ética filosófica | Análise qualitativa |
| `CH.SOC.DESIGUALDADE` | Desigualdade social | Análise qualitativa; dados passivos suficientes |
| `CH.SOC.TRABALHO` | Mundo do trabalho | Análise qualitativa |
| `CH.SOC.CULTURA` | Cultura e identidade | Análise qualitativa |

---

## Tópicos pendentes de classificação

| ID do tópico | Nome | Notas |
|---|---|---|
| `CN.QUIM.TERMOQUIMICA` | Termoquímica | Calor e entalpia têm relação numérica (R3); verificar se PhET cobre adequadamente (R4) |
| `CN.FIS.ONDAS` | Ondas e som | Fenômeno manipulável (frequência, amplitude); PhET "Wave on a String" candidato |
| `CN.FIS.OPTICA` | Óptica geométrica | Reflexão/refração manipulável; PhET "Bending Light" candidato |
| `MT.GEOMETRIA.PLANA` | Geometria plana | Áreas e perímetros têm visualização; avaliar se simulação agrega além de imagem estática |
| `MT.COMBINATORIA` | Análise combinatória | Difícil visualizar; provavelmente tópico simples |

---

## Processo de reclassificação

Para mover tópico de "simples" para "UAI":
1. Registrar evidência de erro conceitual frequente (dados do banco de tentativas ou literatura pedagógica)
2. Confirmar critérios atendidos na tabela acima
3. Definir tipo de simulação (PhET vs. custom) com justificativa em ADR-L02
4. Incluir em proposta de fase com aprovação
