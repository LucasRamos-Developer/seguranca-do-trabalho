/*
 * Catálogo dos problemas da esteira.
 * Cada problema tem textos do modal, classificação de automação e referências reais.
 * Para adicionar um problema novo veja docs/arquitetura.md.
 *
 * referencias[].tipo:
 *   'video'     -> YouTube (id). embed:false quando o dono bloqueou a incorporação (abre no YouTube).
 *   'caso'      -> acidente real documentado (notícia, relatório de fiscalização, processo).
 *   'imagem'    -> imagem real salva em assets/ref (domínio público), com crédito.
 *   'documento' -> norma, guia técnico, cartilha, artigo ou patente.
 */

const NR_LISTA = 'https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes';

const CASO_PECEM = {
  tipo: 'caso',
  titulo: 'Porto do Pecém (CE): esteira interditada após morte de trabalhador',
  fonte: 'SINAIT — Sindicato Nacional dos Auditores Fiscais do Trabalho',
  data: 'jan/2026',
  url: 'https://www.sinait.org.br/noticia/23040/ce-fiscalizacao-portuaria-interdita-esteira-transportadora-de-carvao-mineral-no-porto-do-pecem-depois-de-morte-de-trabalhador',
  resumo: 'Um trabalhador terceirizado de 23 anos fazia manutenção com a esteira de carvão funcionando, foi puxado para dentro do equipamento e morreu no local. A fiscalização encontrou o dispositivo de parada de emergência inoperante, manutenção com a máquina ligada e partes móveis sem proteção, e interditou a esteira.'
};

window.PROBLEMAS = [
  {
    id: 1,
    slug: 'tambor',
    titulo: 'Ponto de esmagamento no tambor de tração',
    curto: 'Esmagamento no tambor',
    categoria: 'Mecânico',
    nr: 'NR-12',
    prioridade: 'Alta',
    automacao: 'sim',
    cadeia: {
      entrada: 'Chave de intertravamento na grade',
      logica: 'Relé de segurança',
      saida: 'Contator corta o motor',
      nota: 'Se alguém abrir ou remover a grade, o contato da chave abre e o relé de segurança desliga o motor na hora.'
    },
    onde: 'Cabeceira motriz: ponto onde a correia encontra o tambor de tração.',
    quem: 'Operadores e equipe de manutenção.',
    consequencia: 'Esmagamento, fraturas, laceração ou amputação.',
    perigo: 'Movimento rotativo contínuo do tambor de tração.',
    exposicao: 'O operador coloca a mão na esteira em movimento para soltar uma caixa enroscada.',
    risco: 'Alta probabilidade de o braço ser puxado para o ponto de convergência, com gravidade de fratura ou amputação.',
    caso: 'Um operador tentou retirar manualmente uma caixa enroscada na lateral da esteira com o equipamento energizado e em movimento. O braço foi puxado para o ponto de convergência entre a correia de borracha e o tambor de tração: fratura exposta no antebraço, cirurgia e mais de 90 dias de afastamento.',
    solucao: [
      'Proteção fixa enclausurante sobre o tambor (só sai com ferramenta).',
      'Chave de intertravamento na proteção, ligada a um relé de segurança.',
      'Sinalização de "ponto de esmagamento" na cabeceira.'
    ],
    comoReduz: 'A grade impede fisicamente que a mão alcance o ponto de convergência. Se a grade for removida, o relé de segurança corta imediatamente a energia do motor.',
    referencias: [
      { tipo: 'caso', titulo: 'Esmagamento em tambor de tração (caso do trabalho)', fonte: 'Ministério do Trabalho e Emprego / Fundacentro', data: '2022', resumo: 'Caso analisado no trabalho trimestral: braço puxado entre correia e tambor de tração com a esteira em movimento. Perigos presentes: rolo sem enclausuramento, falta de parada de emergência acessível e falha na detecção de congestionamento.' },
      { tipo: 'caso', titulo: 'Cartilha "Alerta de Segurança" vol. 3: proteção de esteiras na cerâmica', fonte: 'CEREST Piracicaba', url: 'https://piracicaba.sp.gov.br/wp-content/uploads/2024/11/Cartilha_Volume_3_-_Protecao_de_esteiras_ceramica.pdf', resumo: 'Acidentes reais em esteiras de argila, incluindo um trabalhador que teve o braço direito amputado ao verificar um defeito com a esteira em movimento.' },
      { tipo: 'documento', titulo: 'Conveyor guarding in mines', fonte: 'Governo de Ontário (Canadá)', url: 'https://www.ontario.ca/page/conveyor-guarding-mines', resumo: 'Tambores de cabeceira, de retorno, de acionamento e de desvio precisam de proteção onde o ponto de esmagamento for acessível. A proteção fixa deve exigir ferramenta para ser removida.' },
      { tipo: 'documento', titulo: 'Exposed Belt Transfers: the pinch point hazard hiding in plain sight', fonte: 'Flexco', url: 'https://www.flexco.com/EN/Blogs/Exposed-Belt-Transfers-The-Pinch-Point-Hazard-Hiding-in-Plain-Sight.htm', resumo: 'Os pontos de esmagamento mais comuns ficam onde a correia encontra o tambor de cabeceira, o de retorno e os roletes. Muitos acidentes acontecem ao tentar limpar material com a esteira ligada.' },
      { tipo: 'video', id: 'SdTBV11tdws', titulo: 'Guarding and Safety Around Conveyor Belts' },
      { tipo: 'video', id: '8X_EjsuJPhk', titulo: 'Conveyor Belt Accident (rolo de retorno)' },
      { tipo: 'video', id: 'nYxTjlXC8GM', titulo: 'Minimum Requirements for Conveyor Belt Guarding' },
      { tipo: 'video', id: 'xFauC2NiFGg', titulo: 'Conveyor Guarding with ASGCO Safe-Guard' }
    ]
  },
  {
    id: 2,
    slug: 'emergencia',
    titulo: 'Sem parada de emergência ao longo da linha',
    curto: 'Sem parada de emergência',
    categoria: 'Mecânico',
    nr: 'NR-12',
    prioridade: 'Alta',
    automacao: 'sim',
    cadeia: {
      entrada: 'Cabo de emergência (chave de tração)',
      logica: 'Relé de segurança + rearme manual',
      saida: 'Motor para e não religa sozinho',
      nota: 'Qualquer pessoa ao longo da linha puxa o cabo e a esteira para. Ela só volta a funcionar depois do rearme manual.'
    },
    onde: 'Ao longo de toda a lateral da esteira principal.',
    quem: 'Qualquer pessoa que trabalhe ou passe perto da esteira.',
    consequencia: 'Sem um jeito rápido de parar, um arraste que seria leve vira amputação ou morte.',
    perigo: 'Esteira longa em movimento com um único botão de parada, longe do ponto de risco.',
    exposicao: 'Um colega preso na correia depende de alguém correr até o painel.',
    risco: 'A demora em parar aumenta muito a gravidade do acidente.',
    caso: 'No Porto do Pecém (CE), em janeiro de 2026, um trabalhador de 23 anos foi puxado por uma esteira de carvão durante a manutenção e morreu. A fiscalização constatou que o dispositivo de parada de emergência estava inoperante e interditou a esteira.',
    solucao: [
      'Cabo de parada de emergência (chave de tração) nas duas laterais da esteira.',
      'Botoeiras tipo cogumelo nos postos de alimentação e de coleta.',
      'Ligação a um relé de segurança, com rearme manual e teste periódico registrado.'
    ],
    comoReduz: 'Basta puxar o cabo em qualquer ponto da linha para cortar o motor imediatamente, sem depender de alcançar o painel.',
    referencias: [
      CASO_PECEM,
      { tipo: 'documento', titulo: 'Where must emergency stops be located on a conveyor?', fonte: 'J. J. Keller', url: 'https://jjkellercompliancenetwork.com/regsense/where-must-emergency-stops-also-known-as-e-stops-be-located-on-a-conveyor', resumo: 'Cabos de emergência devem cobrir todo o comprimento da esteira, e ela não pode religar até que a chave acionada seja rearmada.' },
      { tipo: 'video', id: 'QSMlpHFWVpM', titulo: 'Belt Conveyor Emergency Stop Switches' },
      { tipo: 'video', id: 'DtmFwgJ1gSQ', titulo: 'Belt Conveyor with Emergency Stop Pull Cord' },
      { tipo: 'video', id: 'H3uZrKuOUBU', titulo: 'Pull-wire emergency-stop switches (indústria pesada)' },
      { tipo: 'video', id: 'SKYtQh7YXOo', titulo: 'Emergency stop on the conveyor belt' }
    ]
  },
  {
    id: 3,
    slug: 'atolamento',
    titulo: 'Atolamento com o motor forçando',
    curto: 'Atolamento / carga travada',
    categoria: 'Mecânico',
    nr: 'NR-12',
    prioridade: 'Média',
    automacao: 'sim',
    cadeia: {
      entrada: 'Sensor fotoelétrico de acúmulo',
      logica: 'CLP: timeout de X segundos sem variação',
      saida: 'Desliga a esteira e mostra alarme na IHM',
      nota: 'Se o sensor fica obstruído tempo demais, o CLP entende que é atolamento e para tudo antes que alguém tente soltar a carga com a mão.'
    },
    onde: 'Lateral da esteira principal, onde as caixas enroscam.',
    quem: 'Operadores de produção.',
    consequencia: 'Quebra mecânica e, principalmente, o "convite" para o operador desobstruir com a mão e ser arrastado.',
    perigo: 'Motor continua tracionando uma carga travada.',
    exposicao: 'O operador tenta soltar a caixa com a esteira ligada.',
    risco: 'Arraste do braço para os rolos durante a desobstrução.',
    caso: 'Em 27 de janeiro de 2024, em uma recicladora em Bristol (Reino Unido), um trabalhador tentava desobstruir um bloqueio na esteira, escorregou e encostou na extremidade traseira da correia, que não tinha proteção. O braço foi puxado: fraturas, lacerações graves e lesão de nervos. A empresa foi multada em £64.666.',
    solucao: [
      'Sensor de acúmulo (fotoelétrico) no ponto crítico.',
      'Lógica de timeout no CLP: sensor bloqueado por X segundos = atolamento.',
      'Parada automática + alarme na IHM + procedimento de desobstrução com a máquina bloqueada.'
    ],
    comoReduz: 'A esteira para sozinha antes de forçar a carga, eliminando a pressa de resolver na mão com tudo ligado.',
    referencias: [
      { tipo: 'caso', titulo: 'Recicladora multada após braço ser puxado ao desobstruir esteira', fonte: 'HSE (Reino Unido), via Circular Online', data: 'jan/2024 (multa em jun/2026)', url: 'https://www.circularonline.co.uk/news/waste-and-recycling-company-fined-after-employee-suffers-life-changing-injuries/', resumo: 'Bateman Skips Ltd: o trabalhador limpava um bloqueio, escorregou e teve o braço puxado na extremidade sem proteção. A investigação apontou falta de proteção e falta de um sistema seguro para desobstrução.' },
      { tipo: 'documento', titulo: 'Run-back safety mechanism for conveyor apparatus (patente US 4.548.316)', fonte: 'USPTO', url: 'https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/4548316', resumo: 'Explica que, ao remover um atolamento, a energia acumulada na correia faz ela se mover sozinha, mesmo sem motor. Cita um operador esmagado entre a correia e o tambor.' },
      { tipo: 'video', id: '3jo09rnwd5s', titulo: 'Conveyor Jam Detection: como o drive detecta e libera atolamentos' },
      { tipo: 'video', id: 'uL71muVpQcM', titulo: 'Renold: backstop com alívio de tensão para desatolar com segurança', embed: false }
    ]
  },
  {
    id: 4,
    slug: 'painel',
    titulo: 'Painel elétrico do CLP e inversor aberto',
    curto: 'Painel elétrico aberto',
    categoria: 'Elétrico',
    nr: 'NR-10',
    prioridade: 'Alta',
    automacao: 'parcial',
    cadeia: {
      entrada: 'Porta do painel',
      logica: 'Seccionadora com intertravamento da porta',
      saida: 'Porta só abre desenergizada',
      nota: 'A automação garante que ninguém abra o painel energizado. Aterramento, isolamento dos bornes e sinalização continuam sendo medidas elétricas da NR-10.'
    },
    onde: 'Painel de comando do CLP e inversor de frequência (220 V / 380 V).',
    quem: 'Eletricistas e técnicos de automação.',
    consequencia: 'Choque elétrico grave, queimaduras por arco elétrico, morte.',
    perigo: 'Tensão de 220 V / 380 V e energia armazenada no inversor.',
    exposicao: 'Porta aberta, bornes expostos e carcaças sem aterramento ao alcance de qualquer pessoa.',
    risco: 'Contato direto ou indireto com partes energizadas e arco elétrico durante manobras.',
    caso: 'Arcos elétricos em painéis de baixa tensão (480 V) liberam calor, luz e pressão em milissegundos, como mostram os ensaios em câmera lenta das referências. Em painel aberto e sem aterramento, um toque acidental ou uma ferramenta caída basta.',
    solucao: [
      'Painel sempre fechado e trancado, acesso só para profissional autorizado (NR-10).',
      'Aterramento de todas as carcaças metálicas e isolamento dos bornes.',
      'Seccionadora com intertravamento na porta e sinalização de risco elétrico.'
    ],
    comoReduz: 'Elimina o contato acidental com partes energizadas e garante que só se abre o painel sem tensão.',
    referencias: [
      { tipo: 'documento', titulo: 'NR-10: Segurança em Instalações e Serviços em Eletricidade', fonte: 'Ministério do Trabalho e Emprego', url: NR_LISTA, resumo: 'Exige aterramento, isolamento, procedimentos de desenergização e que só profissionais autorizados acessem painéis.' },
      { tipo: 'video', id: 'N28QFNWRDAI', titulo: 'NR-10: Painéis Elétricos' },
      { tipo: 'video', id: 'PO6see7_ODY', titulo: 'Arco elétrico de 480 V em câmera lenta' },
      { tipo: 'video', id: 'K6iJN6kN-Is', titulo: 'What is Arc Flash?' },
      { tipo: 'video', id: 'yIguPksN_qg', titulo: 'Arc Flash / Arc Blast' }
    ]
  },
  {
    id: 5,
    slug: 'loto',
    titulo: 'Manutenção sem bloqueio e etiquetagem (LOTO)',
    curto: 'Manutenção sem LOTO',
    categoria: 'Elétrico / Mecânico',
    nr: 'NR-10 / NR-12',
    prioridade: 'Alta',
    automacao: 'parcial',
    cadeia: {
      entrada: 'Seccionadora bloqueável + sensor de tensão no barramento DC',
      logica: 'CLP monitora energia residual do inversor',
      saida: 'IHM mostra "seguro para abrir"',
      nota: 'A automação ajuda a confirmar a energia zero, mas o LOTO em si (cadeado, etiqueta, teste com multímetro) é um procedimento que as pessoas executam.'
    },
    onde: 'Troca de rolete e limpeza profunda da correia.',
    quem: 'Técnicos de manutenção e de automação.',
    consequencia: 'Partida durante o serviço: arraste, esmagamento, choque, morte.',
    perigo: 'Energia elétrica (painel/inversor) e mecânica (tensão da correia).',
    exposicao: 'O técnico desliga só pelo botão "Stop" da IHM e põe as mãos na correia.',
    risco: 'Qualquer pessoa (ou o próprio CLP) pode religar a esteira com o técnico dentro.',
    caso: 'No Porto do Pecém (CE), em 2026, a manutenção era feita com a esteira em funcionamento. O trabalhador foi puxado e morreu. Entre as exigências da fiscalização: parar totalmente a esteira em qualquer manutenção e emitir permissão de trabalho baseada em análise de risco.',
    solucao: [
      'Abrir a chave seccionadora principal (não basta o "Stop" da IHM).',
      'Colocar cadeado pessoal + etiqueta de identificação.',
      'Aguardar de 3 a 5 minutos para descarregar os capacitores do inversor.',
      'Testar "tensão zero" nos bornes do motor com multímetro e aliviar a tensão da correia.'
    ],
    comoReduz: 'Só quem colocou o cadeado pode tirá-lo: ninguém religa a esteira com o técnico trabalhando.',
    referencias: [
      CASO_PECEM,
      { tipo: 'documento', titulo: 'Minimize Conveyor Injury Risks with Safeguarding', fonte: 'Food Manufacturing', url: 'https://www.foodmanufacturing.com/home/article/21115042/minimize-conveyor-injury-risks-with-safeguarding', resumo: 'Lembra que esteiras têm energia elétrica e cinética e exigem procedimento de LOTO específico para cada máquina, ao contrário do que muitos pensam.' },
      { tipo: 'video', id: 'fxlbx6fBBPE', titulo: 'Bloqueio e Etiquetagem (LOTO): aprenda em 3 minutos' },
      { tipo: 'video', id: 'rDP8wc_21K4', titulo: 'Treinamento LOTO: NR-12 e NR-10' },
      { tipo: 'video', id: 'MFee525FOtU', titulo: 'Lockout Tagout: exemplo seguro × inseguro (animação)' }
    ]
  },
  {
    id: 6,
    slug: 'altura',
    titulo: 'Ergonomia: altura inadequada da esteira',
    curto: 'Ergonomia: altura',
    categoria: 'Ergonômico',
    nr: 'NR-17',
    prioridade: 'Média',
    automacao: 'sim',
    cadeia: {
      entrada: 'Operador se identifica na IHM',
      logica: 'CLP busca a altura ideal do operador',
      saida: 'Atuador elétrico ajusta a altura do posto',
      nota: 'O posto se adapta a cada pessoa, em vez de a pessoa se curvar para o posto.'
    },
    onde: 'Posto de alimentação, no início da esteira.',
    quem: 'Operadores de linha de produção.',
    consequencia: 'Lombalgia e LER/DORT por flexão constante do tronco.',
    perigo: 'Superfície de trabalho baixa demais para a estatura do operador.',
    exposicao: 'O operador se curva centenas de vezes por turno para depositar caixas.',
    risco: 'Lesões na coluna que se acumulam ao longo de meses.',
    caso: 'A NR-17 determina que a altura das superfícies de trabalho seja compatível com as características antropométricas dos trabalhadores. Uma esteira fixa e baixa obriga a flexão do tronco a cada caixa: o problema não é um acidente súbito, mas uma lesão que se instala aos poucos.',
    solucao: [
      'Mesa / esteira de alimentação com altura ajustável.',
      'Altura de trabalho próxima à altura do cotovelo do operador.',
      'Pausas e rodízio de tarefas (NR-17).'
    ],
    comoReduz: 'Com a carga na altura certa, a coluna fica reta e o esforço cai a cada movimento.',
    referencias: [
      { tipo: 'documento', titulo: 'NR-17: Ergonomia', fonte: 'Ministério do Trabalho e Emprego', url: NR_LISTA, resumo: 'Exige que mobiliário e superfícies de trabalho sejam adequados às características antropométricas de quem trabalha.' },
      { tipo: 'video', id: 'gvH1MxRsp1A', titulo: 'Ergonomia na Segurança do Trabalho: 5 pontos da NR-17' },
      { tipo: 'video', id: 'smhGLQ5qwuA', titulo: 'NR-17: orientações posturais no ambiente de trabalho' }
    ]
  },
  {
    id: 7,
    slug: 'levantamento',
    titulo: 'Ergonomia: levantamento repetitivo de caixas',
    curto: 'Ergonomia: levantamento',
    categoria: 'Ergonômico',
    nr: 'NR-17',
    prioridade: 'Média',
    automacao: 'sim',
    cadeia: {
      entrada: 'Sensor de caixa no fim da linha',
      logica: 'CLP coordena o ciclo',
      saida: 'Robô paletizador / manipulador a vácuo',
      nota: 'A máquina faz o levantamento pesado e repetitivo; o operador só supervisiona.'
    },
    onde: 'Fim da linha, na paletização.',
    quem: 'Operadores de linha de produção.',
    consequencia: 'Lombalgia, hérnia de disco, LER/DORT.',
    perigo: 'Movimentação manual de cargas, com repetição e torção do tronco.',
    exposicao: 'O operador pega cada caixa da esteira e empilha no palete, do chão até acima do ombro.',
    risco: 'Sobrecarga acumulada na coluna e nos ombros.',
    caso: 'A movimentação manual de cargas é um dos pontos centrais da NR-17 atual, que exige avaliar o peso, a frequência, a distância e a postura de cada tarefa. No fim de linha, o mesmo operador pode levantar centenas de caixas por turno.',
    solucao: [
      'Robô paletizador ou manipulador a vácuo no fim da linha.',
      'Palete sobre mesa pantográfica (mantém a camada na altura da esteira).',
      'Rodízio de função e pausas.'
    ],
    comoReduz: 'Tira o esforço de levantamento do corpo do trabalhador.',
    referencias: [
      { tipo: 'documento', titulo: 'NR-17: Ergonomia (levantamento, transporte e descarga de materiais)', fonte: 'Ministério do Trabalho e Emprego', url: NR_LISTA, resumo: 'Exige avaliar a movimentação manual de cargas e adotar medidas, como ajudas mecânicas, para reduzir o esforço.' },
      { tipo: 'video', id: 'reK02bRgPGI', titulo: 'Movimentação manual de cargas na nova NR-17' },
      { tipo: 'video', id: 'qlyhj6sAjgc', titulo: 'Elevador a vácuo para caixas de 40 kg' },
      { tipo: 'video', id: 'ZIlcO4MYBKo', titulo: 'Manipulador a vácuo para caixas' },
      { tipo: 'video', id: '5EY9itJgnZg', titulo: 'Automação de fim de linha: paletização' }
    ]
  },
  {
    id: 8,
    slug: 'partida',
    titulo: 'Partida inesperada da esteira',
    curto: 'Partida inesperada',
    categoria: 'Cinemático',
    nr: 'NR-12',
    prioridade: 'Alta',
    automacao: 'sim',
    cadeia: {
      entrada: 'Comando de partida na IHM',
      logica: 'CLP temporiza sirene + sinaleiro',
      saida: 'Só depois o motor liga',
      nota: 'Antes de qualquer partida, a esteira avisa com som e luz por alguns segundos, dando tempo de qualquer pessoa sair de perto.'
    },
    onde: 'Trecho onde o operador limpa a correia.',
    quem: 'Operadores ao limpar ou ajustar a esteira.',
    consequencia: 'Arraste e queda do trabalhador, contusões e fraturas.',
    perigo: 'Esteira parada que volta a andar sem aviso.',
    exposicao: 'O operador está com a mão na correia quando alguém dá partida em outro posto.',
    risco: 'Arraste súbito sem tempo de reação.',
    caso: 'Material de segurança do Ministério da Saúde, Trabalho e Bem-Estar do Japão, traduzido para o português, alerta que a esteira pode começar a se mover de repente se alguém esquecer de desligá-la. O mesmo material aponta que o prendimento em esteiras respondeu por 21% das mortes no setor analisado entre 2014 e 2020.',
    solucao: [
      'Sirene e sinaleiro de pré-partida temporizados pelo CLP.',
      'Rearme manual após qualquer parada.',
      'Partida somente pela IHM, com visão da linha.'
    ],
    comoReduz: 'Ninguém é pego de surpresa: há alguns segundos de aviso antes de qualquer movimento.',
    referencias: [
      { tipo: 'documento', titulo: 'Material de segurança em português (concreto usinado)', fonte: 'MHLW — Ministério da Saúde, Trabalho e Bem-Estar do Japão', url: 'https://www.mhlw.go.jp/content/11300000/000957646.pdf', resumo: 'História em quadrinhos de segurança: o prendimento em esteira transportadora foi 21% das ocorrências fatais de 2014 a 2020, e a esteira pode começar a se mover de repente.' },
      { tipo: 'video', id: 'q_ntfPp9ixs', titulo: 'Emergency conveyor belt switches and alarms' },
      { tipo: 'video', id: 'gpJ8fjvj8l0', titulo: 'Partida de esteira com sinaleiro e sirene via CLP S7', embed: false }
    ]
  },
  {
    id: 9,
    slug: 'transmissao',
    titulo: 'Transmissão exposta entre motor e redutor',
    curto: 'Transmissão exposta',
    categoria: 'Mecânico',
    nr: 'NR-12',
    prioridade: 'Alta',
    automacao: 'parcial',
    cadeia: {
      entrada: 'Proteção removível da transmissão',
      logica: 'Chave de intertravamento → relé de segurança',
      saida: 'Motor desliga se a proteção sair',
      nota: 'A solução principal é mecânica: uma proteção fixa. O intertravamento só é necessário se a proteção precisar ser aberta com frequência.'
    },
    onde: 'Motor + redutor da cabeceira (correia e polias).',
    quem: 'Operadores e manutenção.',
    consequencia: 'Agarramento de dedos, mãos, roupas e cabelo; amputação.',
    perigo: 'Correia de transmissão e polias girando ao alcance da mão.',
    exposicao: 'Passar perto, apoiar a mão ou fazer ajustes com o motor ligado.',
    risco: 'Agarramento no ponto em que a correia entra na polia.',
    caso: 'As cartilhas "Alerta de Segurança" do CEREST Piracicaba registram acidentes reais em esteiras de usinas causados por transmissão de força desprotegida (correias, polias e correntes sem proteção).',
    solucao: [
      'Proteção fixa enclausurando correia e polias.',
      'Se precisar abrir com frequência: proteção móvel com intertravamento.',
      'Sinalização de partes móveis.'
    ],
    comoReduz: 'Sem acesso ao ponto de contato entre correia e polia, não há como ser agarrado.',
    referencias: [
      { tipo: 'imagem', titulo: 'Ponto de contato entre correia de transmissão e polia', fonte: 'OSHA, Departamento do Trabalho dos EUA (domínio público, via Wikimedia Commons)', src: 'assets/ref/osha-correia-polia.gif', url: 'https://commons.wikimedia.org/wiki/File:Power_transmission_belt.gif' },
      { tipo: 'caso', titulo: 'Cartilha "Alerta de Segurança" vol. 2: proteção de esteiras em usinas', fonte: 'CEREST Piracicaba', url: 'https://piracicaba.sp.gov.br/wp-content/uploads/2024/11/Cartilha_Volume_2_-_Protecao_de_esteiras_em_usinas.pdf', resumo: 'Acidentes reais em esteiras de usinas de açúcar e álcool, com análise de causas como a transmissão de força desprotegida.' },
      { tipo: 'documento', titulo: 'Machine Guarding: Hazardous Motions', fonte: 'OSHA eTool', url: 'https://www.osha.gov/etools/machine-guarding/introduction/hazardous-motions-actions', resumo: 'Exemplos de pontos de agarramento: correia e polia, corrente e engrenagem, cremalheira e pinhão.' },
      { tipo: 'video', id: 'TukTqslw_90', titulo: 'Machinery guarding' }
    ]
  },
  {
    id: 10,
    slug: 'queda',
    titulo: 'Queda de material da esteira elevada',
    curto: 'Queda de material',
    categoria: 'Mecânico',
    nr: 'NR-12',
    prioridade: 'Média',
    automacao: 'parcial',
    cadeia: {
      entrada: 'Sensor de carga fora de posição',
      logica: 'CLP detecta caixa desalinhada',
      saida: 'Para a esteira antes da queda',
      nota: 'As guias laterais (mecânicas) seguram a carga; o sensor é uma camada extra.'
    },
    onde: 'Trecho elevado da esteira inclinada.',
    quem: 'Quem passa ou trabalha embaixo da esteira.',
    consequencia: 'Contusões, fraturas e traumatismo por queda de objetos.',
    perigo: 'Caixas sem contenção lateral em altura.',
    exposicao: 'Pessoas circulando sob o trecho elevado.',
    risco: 'Caixa desalinhada cai sobre alguém.',
    caso: 'Em São Bernardo do Campo (SP), após um operador ferir gravemente a mão, auditores fiscais apontaram irregularidades nas esteiras transportadoras de uma empresa de madeira. O MPT propôs um TAC que exigia proteções fixas ou móveis nos transportadores contínuos.',
    solucao: [
      'Guias laterais e bordas de contenção em todo o trecho elevado.',
      'Tela de proteção sob a esteira em áreas de circulação.',
      'Sensor de carga desalinhada ligado ao CLP.'
    ],
    comoReduz: 'A carga fica contida na esteira e, se algo sair do lugar, a linha para.',
    referencias: [
      { tipo: 'caso', titulo: 'Empresa de madeira é acionada pelo MPT após acidente', fonte: 'MPT-SP (Ministério Público do Trabalho)', url: 'https://www.prt2.mpt.mp.br/1157-empresa-de-madeira-e-acionada-pelo-mpt-para-reforcar-medidas-de-seguranca-apos-grave-acidente-com-trabalhador', resumo: 'Relatório de auditores fiscais apontou esteiras sem proteção e falta de manutenção preventiva. O TAC proposto exigia proteções nos transportadores.' },
      { tipo: 'documento', titulo: 'Conveyor Safety: hazards associated with conveyors', fonte: 'Georgia Tech OSHA Consultation', url: 'https://oshainfo.gatech.edu/wp-content/uploads/2025/07/Conveyors-TGrevised.pdf', resumo: 'Guia de treinamento sobre riscos de esteiras, incluindo queda de materiais e pontos de agarramento.' },
      { tipo: 'video', id: 'hM9OGdXtEEQ', titulo: 'How to stop products falling off a conveyor' }
    ]
  },
  {
    id: 11,
    slug: 'retorno',
    titulo: 'Retorno de carga na esteira inclinada',
    curto: 'Retorno na inclinada',
    categoria: 'Mecânico',
    nr: 'NR-12',
    prioridade: 'Média',
    automacao: 'sim',
    cadeia: {
      entrada: 'Sensor de rotação / velocidade zero',
      logica: 'CLP detecta giro reverso',
      saida: 'Aciona freio e alarme',
      nota: 'Junto com o freio anti-retorno (backstop, mecânico), o sensor garante que a correia nunca desça com a carga.'
    },
    onde: 'Esteira inclinada que sobe até a paletização.',
    quem: 'Operadores no pé da esteira inclinada.',
    consequencia: 'Caixas descendo e atingindo pessoas; esmagamento no tambor de retorno.',
    perigo: 'Peso da carga em rampa puxando a correia para trás quando o motor para.',
    exposicao: 'Operador no pé da rampa durante uma parada ou falta de energia.',
    risco: 'Retrocesso súbito da correia carregada.',
    caso: 'Uma patente americana sobre mecanismos anti-retorno descreve que, ao remover um atolamento, a energia elástica acumulada faz a correia se mover mesmo sem motor, e cita um operador esmagado entre a correia e o tambor de retorno.',
    solucao: [
      'Freio anti-retorno (backstop / holdback) no redutor.',
      'Correia com taliscas (cleats) para segurar as caixas.',
      'Sensor de rotação reversa ligado ao CLP.'
    ],
    comoReduz: 'A correia só gira em um sentido: mesmo sem energia, a carga não desce.',
    referencias: [
      { tipo: 'documento', titulo: 'Run-back safety mechanism for conveyor apparatus (patente US 4.548.316)', fonte: 'USPTO', url: 'https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/4548316', resumo: 'Descreve o perigo do retrocesso da correia e o caso de um operador esmagado no tambor de retorno.' },
      { tipo: 'video', id: 'efCE6KoxeXY', titulo: 'Holdback / backstop: o que é e como funciona' },
      { tipo: 'video', id: 'jcQXsNLUUgE', titulo: 'Holdback / backstop: benefícios' },
      { tipo: 'video', id: 'dPtoQ4bBtZo', titulo: 'Esteira inclinada com taliscas (flights)' }
    ]
  },
  {
    id: 12,
    slug: 'travessia',
    titulo: 'Travessia por cima da esteira',
    curto: 'Travessia sobre a esteira',
    categoria: 'Mecânico',
    nr: 'NR-12',
    prioridade: 'Média',
    automacao: 'nao',
    cadeia: {
      nota: 'Aqui a solução é de engenharia mecânica e civil: uma passarela com guarda-corpo. Não depende de sensor nem de CLP.'
    },
    onde: 'Meio da linha principal, onde as pessoas cortam caminho.',
    quem: 'Qualquer trabalhador que precise atravessar a linha.',
    consequencia: 'Queda, arraste pela correia, esmagamento.',
    perigo: 'Pular por cima da correia em movimento.',
    exposicao: 'O trabalhador pisa ou se apoia na esteira para cortar caminho.',
    risco: 'Escorregar e ser arrastado pela correia.',
    caso: 'Na interdição da esteira do Porto do Pecém (2026), a fiscalização exigiu treinamento de trabalho em altura (NR-35), linhas de vida e demarcação das áreas críticas de circulação ao redor da esteira.',
    solucao: [
      'Passarela (escada de transposição) com guarda-corpo sobre a esteira.',
      'Proteção inferior quando houver passagem por baixo.',
      'Proibir e sinalizar a circulação sobre a esteira (NR-12, capítulo 12.8).'
    ],
    comoReduz: 'Cria um caminho seguro: ninguém mais precisa encostar na correia para atravessar.',
    referencias: [
      CASO_PECEM,
      { tipo: 'video', id: 'ozJDTShOG_E', titulo: 'NR-12, capítulo 12.8: transportadores de materiais' },
      { tipo: 'video', id: '8ZsWS8txah8', titulo: 'Escada de travessia sobre esteira (walk-over)' },
      { tipo: 'video', id: 'Jj5MQuk8UiI', titulo: 'Conveyor Crossover: passarela sobre esteira' }
    ]
  },
  {
    id: 13,
    slug: 'robo',
    titulo: 'Célula robótica sem barreira de proteção',
    curto: 'Robô sem cortina de luz',
    categoria: 'Mecânico',
    nr: 'NR-12',
    prioridade: 'Alta',
    automacao: 'sim',
    cadeia: {
      entrada: 'Cortina de luz / scanner de área',
      logica: 'Relé de segurança',
      saida: 'Parada segura do robô e da esteira',
      nota: 'Se alguém cruzar o feixe de luz, o robô para antes de a pessoa chegar ao alcance do braço.'
    },
    onde: 'Braço robótico que retira peças da esteira principal.',
    quem: 'Operadores e manutenção que entram na área do robô.',
    consequencia: 'Golpes, esmagamento contra a esteira, fraturas.',
    perigo: 'Braço robótico em movimento rápido e imprevisível para quem está de fora.',
    exposicao: 'Operador entra na área do robô para ajustar uma peça.',
    risco: 'Ser atingido pelo braço em movimento.',
    caso: 'Em estudos de validação de células robóticas com cerca, scanner e cortina de luz, a regra de segurança central é que o contato humano com o robô deve ser impossível, a menos que o robô esteja parado. O tempo de resposta do sensor e o tempo de parada do robô definem a distância da barreira.',
    solucao: [
      'Cortina de luz de segurança na entrada da célula.',
      'Grade fixa nas demais laterais.',
      'Relé de segurança parando o robô e a esteira.'
    ],
    comoReduz: 'A entrada de qualquer pessoa vira um sinal de parada imediata.',
    referencias: [
      { tipo: 'documento', titulo: 'Simulation-based Testing for Early Safety-Validation of Robot Systems', fonte: 'arXiv 2011.10294', url: 'https://arxiv.org/abs/2011.10294', resumo: 'Célula industrial com cercas, scanner e cortina de luz: o contato humano com o robô só pode ocorrer com o robô parado.' },
      { tipo: 'video', id: '-Ma3Hl4Jevk', titulo: 'Cortina de luz detecta pessoas entrando na área do robô' },
      { tipo: 'video', id: 'peg0F5gTivo', titulo: 'Cortina de luz + trava de porta de segurança' }
    ]
  },
  {
    id: 14,
    slug: 'ruido',
    titulo: 'Ruído excessivo de motor e rolamentos',
    curto: 'Ruído excessivo',
    categoria: 'Físico',
    nr: 'NR-15 / NR-6',
    prioridade: 'Baixa',
    automacao: 'parcial',
    cadeia: {
      entrada: 'Sensor de vibração no rolamento',
      logica: 'CLP compara com o limite (manutenção preditiva)',
      saida: 'Alerta de troca + inversor reduz a velocidade',
      nota: 'A automação ataca a fonte do ruído (rolamento gasto, velocidade). O protetor auricular é só uma medida complementar.'
    },
    onde: 'Motor e redutor da esteira inclinada.',
    quem: 'Todos os trabalhadores do setor.',
    consequencia: 'Perda auditiva induzida por ruído (PAIR), irreversível; estresse e fadiga.',
    perigo: 'Rolamentos gastos e motor em alta rotação.',
    exposicao: 'Oito horas por dia ao lado da fonte.',
    risco: 'Perda auditiva lenta, que só é percebida quando já é tarde.',
    caso: 'Pela NR-15 (Anexo I), o limite de tolerância é de 85 dB(A) para 8 horas diárias. A medição segue a NHO-01 da Fundacentro. A PAIR é gradual e irreversível: o trabalhador normalmente só percebe depois de anos.',
    solucao: [
      'Manutenção preditiva com sensor de vibração.',
      'Enclausuramento acústico do motor/redutor.',
      'Protetor auricular (NR-6) como medida complementar e audiometria periódica.'
    ],
    comoReduz: 'Primeiro reduz o ruído na fonte; só depois protege o ouvido.',
    referencias: [
      { tipo: 'documento', titulo: 'NR-15, Anexo I: limites de tolerância para ruído', fonte: 'Ministério do Trabalho e Emprego', url: NR_LISTA, resumo: '85 dB(A) é o limite para 8 horas de exposição diária.' },
      { tipo: 'video', id: 'mni4A9s_wfg', titulo: 'Perda Auditiva Induzida por Ruído (PAIR)' },
      { tipo: 'video', id: 'VQ2bu0ftYFc', titulo: 'NR-15 e os limites de tolerância ao ruído' },
      { tipo: 'video', id: 'rFXKpezKo_4', titulo: 'EPI: proteção auricular' }
    ]
  },
  {
    id: 15,
    slug: 'extintor',
    escondido: true,
    titulo: 'Extintor de incêndio bloqueado',
    curto: 'Extintor bloqueado',
    categoria: 'Incêndio',
    nr: 'NR-23 / NR-26',
    prioridade: 'Alta',
    automacao: 'nao',
    cadeia: {
      nota: 'Solução organizacional: desobstruir, demarcar o piso e inspecionar. Nenhum sensor resolve uma pilha de caixas na frente do extintor; o que resolve é organização (5S) e inspeção.'
    },
    onde: 'Ao lado do painel elétrico, escondido atrás de caixas.',
    quem: 'Todos: o extintor é a primeira resposta a um princípio de incêndio.',
    consequencia: 'Um princípio de incêndio no painel vira um incêndio de verdade.',
    perigo: 'Painel elétrico (fonte de ignição) com o combate a incêndio inacessível.',
    exposicao: 'Em uma emergência, ninguém consegue pegar o extintor a tempo.',
    risco: 'Perda de segundos decisivos no combate ao fogo.',
    caso: 'Caixas empilhadas na frente do extintor são uma das irregularidades mais comuns em inspeções. Os guias de prevenção pedem que o extintor nunca fique obstruído por móveis, caixas ou equipamentos e que tenha o piso demarcado.',
    solucao: [
      'Retirar as caixas e manter a área livre.',
      'Demarcar o piso: quadrado de 1 × 1 m, fundo vermelho e borda amarela.',
      'Topo do extintor a no máximo 1,60 m do piso, com placa de sinalização.',
      'Inspeção periódica (lacre, manômetro, validade).'
    ],
    comoReduz: 'O extintor fica visível e alcançável em segundos.',
    referencias: [
      { tipo: 'documento', titulo: 'Lâmina de gerenciamento de riscos: proteja contra incêndios', fonte: 'Sompo Seguros', url: 'https://sompo.com.br/documents/d/global/som05224_lamina-de-gerenciamento-de-riscos-property_proteja-contra-incendios_c-1', resumo: 'Sinalização de solo sob extintores e hidrantes: quadrado de 1,00 × 1,00 m, fundo vermelho e borda amarela.' },
      { tipo: 'documento', titulo: 'Cartilha de Extintores de Incêndio', fonte: 'Unilab', url: 'https://unilab.edu.br/wp-content/uploads/2026/07/Cartilha-Extintores-de-Incendio.pdf', resumo: 'Extintor a no máximo 1,60 m do piso, área livre demarcada e nunca obstruído por móveis, caixas ou equipamentos.' },
      { tipo: 'video', id: '5P3Volndqtg', titulo: 'Como demarcar o piso de extintores e hidrantes' },
      { tipo: 'video', id: 'tm6vjnLOM7A', titulo: 'Dimensões da sinalização no piso sob extintores' },
      { tipo: 'video', id: 'RF1EzPoWCLU', titulo: 'Inspeção de extintores na prática' }
    ]
  }
];
