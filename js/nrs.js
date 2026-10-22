/*
 * Resumo das Normas Regulamentadoras (NRs) que cada problema cobre, mostrado na gaveta "NRs" do modal.
 *
 * NRS: uma ficha por norma (nome, do que trata e link do texto oficial no gov.br).
 * NR_ITENS[id do problema]: os itens da norma que se aplicam ao problema, resumidos com as nossas palavras.
 * Os números dos itens foram conferidos no texto oficial (PDFs do gov.br) em out/2026.
 */
(function () {
  const VIG = 'https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/';
  const ARQ = 'https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/arquivos/normas-regulamentadoras/';

  const NRS = {
    'NR-1': {
      nome: 'Disposições Gerais e Gerenciamento de Riscos Ocupacionais',
      sobre: 'A base de todas as outras: a empresa identifica os perigos, avalia os riscos e escolhe as medidas de prevenção.',
      url: VIG + 'nr-01-atualizada-2025-i-3.pdf'
    },
    'NR-6': {
      nome: 'Equipamentos de Proteção Individual (EPI)',
      sobre: 'Quando o EPI é obrigatório, quem paga, quem treina e como ele é aprovado (CA).',
      url: VIG + 'nr-06-atualizada-2025-ii.pdf'
    },
    'NR-10': {
      nome: 'Segurança em Instalações e Serviços em Eletricidade',
      sobre: 'Proteção contra choque e arco elétrico: desenergização, aterramento, isolação, sinalização e trabalhador autorizado.',
      url: ARQ + 'nr-10-atualizada-2019-1.pdf',
      aviso: 'Um texto novo da NR-10 (Portaria MTE nº 737/2026) passa a valer em 01/06/2027 e muda a numeração. Os itens abaixo são do texto em vigor hoje.'
    },
    'NR-12': {
      nome: 'Segurança no Trabalho em Máquinas e Equipamentos',
      sobre: 'Proteções, intertravamentos, parada de emergência, partida, manutenção com bloqueio e um capítulo só para transportadores (12.8).',
      url: VIG + 'NR12atualizada2023.pdf'
    },
    'NR-15': {
      nome: 'Atividades e Operações Insalubres',
      sobre: 'Limites de exposição a agentes como ruído, calor e produtos químicos. O ruído está no Anexo 1.',
      url: ARQ + 'nr-15-anexo-01.pdf'
    },
    'NR-17': {
      nome: 'Ergonomia',
      sobre: 'Adaptar o trabalho às pessoas: postura, mobiliário, levantamento de cargas, pausas e organização do trabalho.',
      url: VIG + 'nr-17-atualizada-2023.pdf'
    },
    'NR-23': {
      nome: 'Proteção contra Incêndios',
      sobre: 'Medidas de prevenção contra incêndio, saídas de emergência e informação aos trabalhadores. Os detalhes técnicos vêm do Corpo de Bombeiros de cada estado.',
      url: ARQ + 'nr-23-atualizada-2022.pdf'
    },
    'NR-26': {
      nome: 'Sinalização de Segurança',
      sobre: 'Uso de cores para identificar equipamentos de segurança, delimitar áreas e advertir sobre riscos.',
      url: ARQ + 'nr-26-atualizada-2022.pdf'
    }
  };

  // Hierarquia das medidas de prevenção (NR-1, item 1.4.1, alínea g)
  const HIERARQUIA = [
    'Eliminar o fator de risco',
    'Proteção coletiva (grades, intertravamentos, sensores)',
    'Medidas administrativas e de organização do trabalho',
    'Proteção individual (EPI)'
  ];

  const NR_ITENS = {
    1: [
      { nr: 'NR-12', item: '12.8.1', texto: 'Os movimentos perigosos de transportadores contínuos acessíveis na operação devem ser protegidos, principalmente nos pontos de esmagamento, agarramento e aprisionamento.' },
      { nr: 'NR-12', item: '12.5.1', texto: 'Zonas de perigo precisam de proteções fixas, proteções móveis e dispositivos de segurança interligados.' },
      { nr: 'NR-12', item: '12.8.1.2', texto: 'Vale usar proteção fixa distante junto com proteção móvel intertravada, que só deixa pessoal especializado entrar para inspeção e manutenção.' }
    ],
    2: [
      { nr: 'NR-12', item: '12.8.7', texto: 'Transportadores contínuos acessíveis devem ter parada de emergência ao longo de toda a extensão, que possa ser acionada de qualquer posição de trabalho.' },
      { nr: 'NR-12', item: '12.6.6', texto: 'Com acionador por cabo, as chaves devem trabalhar tracionadas: se o cabo romper ou afrouxar, a esteira para sozinha.' },
      { nr: 'NR-12', item: '12.6.8', texto: 'Depois da parada de emergência, o rearme é manual e só pode ser feito depois de corrigido o que causou a parada.' }
    ],
    3: [
      { nr: 'NR-12', item: '12.8.8', texto: 'Se o desalinhamento da correia ou a sobrecarga de material oferecerem risco, a esteira deve ter dispositivos que a desliguem ao passar dos limites de segurança.' },
      { nr: 'NR-12', item: '12.11.3', texto: 'Desobstruir é uma intervenção: só com a esteira parada, as energias isoladas e os comandos bloqueados.' }
    ],
    4: [
      { nr: 'NR-12', item: '12.3.5', texto: 'O painel da máquina deve ter porta sempre fechada, sinalização de choque elétrico, acesso restrito, estar limpo e sem objetos, e ter os circuitos identificados.' },
      { nr: 'NR-12', item: '12.3.2', texto: 'Carcaças e partes metálicas que possam ficar energizadas devem ser aterradas.' },
      { nr: 'NR-10', item: '10.2.8.2.1', texto: 'Quando não dá para desenergizar, usar outras proteções coletivas: isolação das partes vivas, barreiras, sinalização e seccionamento automático.' },
      { nr: 'NR-10', item: '10.4.4.1', texto: 'Invólucros e compartimentos elétricos são só para isso: é proibido guardar objetos dentro deles.' }
    ],
    5: [
      { nr: 'NR-12', item: '12.11.3', texto: 'Manutenção só com a máquina parada: isolar e descarregar todas as energias, bloquear os dispositivos de corte na posição desligado e colocar etiqueta com data, hora, motivo e responsável.' },
      { nr: 'NR-12', item: '12.4.9', texto: 'Se o acionamento por alguém não autorizado puder ferir uma pessoa, a máquina precisa permitir bloquear os comandos de partida.' },
      { nr: 'NR-10', item: '10.5.1', texto: 'Só está desenergizado depois desta sequência: seccionar, impedir a reenergização, testar ausência de tensão, aterrar temporariamente, proteger o que segue energizado e sinalizar o impedimento.' }
    ],
    6: [
      { nr: 'NR-17', item: '17.6.1', texto: 'O posto de trabalho deve ter regulagens que o adaptem às medidas do corpo (antropometria) de quem trabalha nele.' },
      { nr: 'NR-17', item: '17.6.3', texto: 'A altura da superfície de trabalho deve ser compatível com a atividade e permitir boa postura, visão e alcance.' },
      { nr: 'NR-12', item: '12.9.1', texto: 'O trabalho em máquinas e equipamentos deve respeitar a NR-17.' }
    ],
    7: [
      { nr: 'NR-17', item: '17.5.2', texto: 'Os pontos de pega e de depósito das cargas devem ser organizados para não obrigar a flexões, extensões e torções excessivas do tronco.' },
      { nr: 'NR-17', item: '17.5.2.1', texto: 'É proibido o levantamento não eventual de cargas com a pega a mais de 60 cm do corpo, quando isso puder prejudicar a saúde.' },
      { nr: 'NR-17', item: '17.5.4', texto: 'Adotar meios técnicos facilitadores, limitar frequência e número de movimentos e alternar atividades ou fazer pausas em períodos de no máximo 2 horas.' },
      { nr: 'NR-17', item: '17.5.5', texto: 'Quem faz transporte manual de cargas deve ser orientado sobre como levantar, carregar e depositar.' }
    ],
    8: [
      { nr: 'NR-12', item: '12.4.10', texto: 'Ligar um conjunto de máquinas ou uma máquina de grande dimensão por um único comando exige sinal sonoro ou visual antes.' },
      { nr: 'NR-12', item: '12.4.11', texto: 'Quando necessário, usar alertas extras, como sinais visuais e telecomunicação.' },
      { nr: 'NR-12', item: '12.11.3', texto: 'Limpeza e ajuste também são intervenções: só com a esteira parada e bloqueada.' }
    ],
    9: [
      { nr: 'NR-12', item: '12.5.9', texto: 'Transmissões de força (correias, polias, correntes) acessíveis devem ter proteção fixa, ou móvel com intertravamento, que impeça o acesso por todos os lados.' },
      { nr: 'NR-12', item: '12.5.9.1', texto: 'Se a proteção for móvel e a transmissão tiver inércia (continua girando), o intertravamento deve ser com bloqueio.' }
    ],
    10: [
      { nr: 'NR-12', item: '12.5.10', texto: 'Máquinas com risco de projeção de materiais devem ter proteções que garantam a segurança dos trabalhadores.' },
      { nr: 'NR-12', item: '12.8.3', texto: 'O transportador só pode ser usado para o tipo e a capacidade de carga para os quais foi projetado.' }
    ],
    11: [
      { nr: 'NR-12', item: '12.8.1', texto: 'Movimentos perigosos de transportadores acessíveis devem ser protegidos. A carga voltando pela rampa é um desses movimentos.' },
      { nr: 'NR-12', item: '12.5.10', texto: 'Risco de projeção ou queda de materiais exige proteção. O freio anti-retorno (backstop) não aparece pelo nome na NR: ele é a medida técnica que atende esses itens.' }
    ],
    12: [
      { nr: 'NR-12', item: '12.8.6', texto: 'É proibido ficar ou andar sobre partes em movimento (ou que possam se mover) de transportadores que não foram feitas para isso.' },
      { nr: 'NR-12', item: '12.8.6.2', texto: 'Circular sobre transportadores só por passarelas com proteção contra quedas (Anexo III, item 7).' },
      { nr: 'NR-12', item: '12.8.2', texto: 'Esteiras com a borda da correia a mais de 2,70 m do piso devem ter passarelas em toda a extensão, dos dois lados.' }
    ],
    13: [
      { nr: 'NR-15', item: 'Anexo 1', texto: 'Limite de tolerância para ruído: 85 dB(A) por 8 horas. A cada 5 dB a mais, o tempo cai pela metade (95 dB(A): 2 horas).' },
      { nr: 'NR-6', item: '6.5.1', texto: 'A empresa deve fornecer de graça o EPI certo (com CA), treinar, exigir o uso e registrar a entrega. Pela ordem da NR-1, o protetor auricular vem depois de reduzir o ruído na fonte e enclausurar o motor.' }
    ],
    14: [
      { nr: 'NR-23', item: '23.3.1', texto: 'A prevenção contra incêndio segue a legislação estadual: as Instruções Técnicas do Corpo de Bombeiros pedem extintor desobstruído, sinalizado e com piso demarcado.' },
      { nr: 'NR-23', item: '23.3.2', texto: 'Todos os trabalhadores devem saber usar os equipamentos de combate a incêndio e conhecer os alarmes e as rotas de saída.' },
      { nr: 'NR-26', item: '26.3.2', texto: 'As cores que identificam equipamentos de segurança e delimitam áreas seguem as normas técnicas oficiais (vermelho para combate a incêndio).' }
    ]
  };

  window.NRS = { NRS, NR_ITENS, HIERARQUIA };
})();
