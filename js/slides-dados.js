/*
 * Conteúdo da apresentação em slides (apresentacao.html).
 * Os textos dos problemas, das soluções e das NRs vêm de js/data.js e js/nrs.js;
 * aqui fica só o que é próprio da apresentação: seções, equipe, roteiro de fala,
 * a parte de cada apresentador, peças do diagrama, quadro de perigos do PDF, pessoas expostas, outros casos reais,
 * as três melhorias e a estimativa de risco.
 */
(function () {
  const EQUIPE = ['Lucas Pereira Ramos', 'Jean Henrique Moraes Boeing', 'Vitor Hugo Alves', 'Rafael Josué Velain', 'Kauan Mikael'];
  const ESCOLA = 'Centro de Educação Profissional "Dario Geraldo Salles"';
  const DISCIPLINA = 'Segurança e Higiene do Trabalho';
  const PERGUNTA = 'Como fazer este processo automatizado funcionar com segurança, reduzindo a exposição das pessoas aos perigos identificados?';

  // as cinco perguntas do trabalho; cor = destaque da seção na barra de progresso
  const SECOES = [
    { n: 1, titulo: 'Identificação e funcionamento do processo', cor: '#6f9be0' },
    { n: 2, titulo: 'Perigos, pessoas expostas e consequências', cor: '#e5484d' },
    { n: 3, titulo: 'Acidente real e normas regulamentadoras', cor: '#f5c242' },
    { n: 4, titulo: 'Medidas de controle e três melhorias propostas', cor: '#2ecc71' },
    { n: 5, titulo: 'Avaliação dos resultados e conclusão da equipe', cor: '#b99cff' }
  ];

  // ordem dos slides; secao 0 = capa. parte = qual apresentador fala (5 partes de 4 slides, sem contar a capa;
  // a equipe decide quem fica com cada parte).
  // roteiro = o que falar (aparece com a tecla R ou no link com ?roteiro)
  const SLIDES = [
    { id: 'capa', secao: 0, parte: 1, titulo: 'Esteira Segura',
      roteiro: 'Bom dia, turma. Nós vamos apresentar o trabalho "Automação Segura". O processo escolhido foi a esteira transportadora automatizada. Cada um de nós vai apresentar uma parte: como ela funciona, onde estão os perigos, os acidentes reais, as nossas melhorias e os resultados. Vamos começar pelo processo.' },

    // parte 1: o processo e o mapa dos perigos
    { id: 'processo', secao: 1, parte: 1, titulo: 'O processo: esteira transportadora automatizada',
      roteiro: 'A esteira é um sistema eletromecânico que leva peças e produtos de uma etapa para outra sem parar: da produção para a inspeção e para a embalagem. Ela aparece em envase, em centros de logística e alimentando robôs. A pergunta que guiou o trabalho está aqui embaixo: como fazer isso funcionar com segurança?' },

    { id: 'funcionamento', secao: 1, parte: 1, titulo: 'Como funciona: a esteira é uma malha de controle',
      roteiro: 'A esteira não é só um motor girando. O sensor vê a caixa, o CLP decide, o inversor controla a velocidade do motor e o motor puxa a correia pelo tambor de tração. Vou tocar nas peças para mostrar cada uma. Notem as zonas em vermelho: alimentação e recolhimento, onde as pessoas encostam na esteira, e o ponto de esmagamento no tambor.' },

    { id: 'conceitos', secao: 2, parte: 1, titulo: 'Perigo, exposição e risco',
      roteiro: 'Antes de listar os perigos, três palavras que parecem iguais mas não são. Perigo é a fonte: o tambor girando. Exposição é como a pessoa chega até ele: pôr a mão para soltar uma caixa. Risco é a chance vezes a gravidade: a chance de esmagar ou amputar o braço.' },

    { id: 'mapa', secao: 2, parte: 1, titulo: 'Mapa dos perigos da esteira',
      roteiro: 'Este é o nosso infográfico. Encontramos 13 problemas ligados diretamente à esteira. Os de borda vermelha são de prioridade alta. Vou abrir alguns: onde estão, quem fica exposto e o que pode acontecer. Agora vamos ver quem são as pessoas expostas a esses perigos.' },

    // parte 2: pessoas expostas, tipos de perigo e os dois acidentes
    { id: 'pessoas', secao: 2, parte: 2, titulo: 'Pessoas expostas: quem corre risco',
      roteiro: 'Cada perigo atinge pessoas diferentes. Os operadores são os mais expostos, porque passam o turno inteiro na alimentação e na coleta. A manutenção e os eletricistas correm risco quando abrem a máquina ou o painel. E até quem só passa perto da esteira pode ser atingido.' },

    { id: 'quadro', secao: 2, parte: 2, titulo: 'Tipos de perigo: onde estão e o que causam',
      roteiro: 'Aqui está o resumo por tipo de perigo. O mecânico é o que mais aparece: são os pontos onde a correia encontra os rolos. Mas tem também o elétrico do painel, o movimento inesperado, a ergonomia e o ruído. Na última coluna estão os números dos problemas do infográfico.' },

    { id: 'acidente', secao: 3, parte: 2, titulo: 'Acidente real: esmagamento no tambor de tração',
      roteiro: 'Este é o caso que analisamos no trabalho. Uma caixa enroscou, o operador foi soltar com a esteira ligada e o braço foi puxado para o tambor. Fratura exposta e mais de 90 dias afastado. Repare que foram três falhas juntas: rolo sem proteção, nenhuma parada de emergência por perto e nenhum sensor de atolamento. Essas três falhas viraram as nossas três melhorias.' },

    { id: 'pecem', secao: 3, parte: 2, titulo: 'Caso real recente: Porto do Pecém (CE)',
      roteiro: 'Isto não é coisa do passado. Em janeiro de 2026, no Porto do Pecém, um trabalhador de 23 anos foi puxado por uma esteira de carvão durante a manutenção e morreu. A fiscalização encontrou exatamente os problemas que mostramos: parada de emergência que não funcionava, manutenção com a máquina ligada e partes móveis sem proteção. E isso se repete em outros lugares, como vamos ver agora.' },

    // parte 3: outros casos, NRs, ordem das medidas e a melhoria 1
    { id: 'casos', secao: 3, parte: 3, titulo: 'O mesmo acidente em outros lugares',
      roteiro: 'Esse padrão aparece no mundo todo. No Reino Unido, um trabalhador foi desobstruir a esteira e teve o braço puxado. Em Piracicaba, um braço amputado. Em São Bernardo do Campo, uma mão ferida e esteiras sem proteção. E no Japão, ficar preso em esteira foi 21% dos acidentes fatais do setor. É sempre a mesma história: a mão na esteira ligada e partes móveis sem proteção.' },

    { id: 'nrs', secao: 3, parte: 3, titulo: 'As normas regulamentadoras',
      roteiro: 'A norma central é a NR-12, de máquinas, que tem um capítulo só para transportadores. A NR-10 cuida do painel elétrico, a NR-17 da ergonomia e a NR-1 obriga a empresa a colocar todos esses perigos no PGR. Vou abrir cada uma para mostrar os itens que valem para a esteira.' },

    { id: 'hierarquia', secao: 4, parte: 3, titulo: 'A ordem das medidas de controle',
      roteiro: 'A NR-1 manda seguir uma ordem: primeiro eliminar o perigo, depois proteção coletiva, depois medidas administrativas e só no fim o EPI. Por isso o nosso foco foi a automação e as proteções coletivas: elas protegem todo mundo e não dependem de alguém lembrar de usar algo.' },

    { id: 'melhoria1', secao: 4, parte: 3, titulo: 'Melhoria 1: proteção fixa com chave de intertravamento', problema: 1,
      roteiro: 'Primeira melhoria: uma grade fechando o tambor de tração. A grade sozinha já impede a mão de chegar. E se alguém tirar a grade, a chave de intertravamento avisa o relé de segurança, que corta o motor na hora. Vejam o antes e o depois. Agora, as outras duas melhorias.' },

    // parte 4: melhorias 2 e 3, as outras medidas e o LOTO
    { id: 'melhoria2', secao: 4, parte: 4, titulo: 'Melhoria 2: cabo de parada de emergência', problema: 2,
      roteiro: 'Segunda melhoria: um cabo ao longo de toda a lateral. Qualquer pessoa, em qualquer ponto, puxa o cabo e a esteira para. E ela só volta depois de um rearme manual. Foi exatamente o que faltou no Pecém.' },

    { id: 'melhoria3', secao: 4, parte: 4, titulo: 'Melhoria 3: sensor de acúmulo com tempo limite no CLP', problema: 3,
      roteiro: 'Terceira melhoria: um sensor no ponto onde as caixas enroscam. Se ele fica bloqueado mais tempo que o normal, o CLP entende que é atolamento e desliga a esteira. Assim o motor não força a carga e ninguém tem pressa de soltar a caixa com a mão.' },

    { id: 'medidas', secao: 4, parte: 4, titulo: 'A solução de cada problema',
      roteiro: 'Além das três melhorias principais, cada problema do infográfico tem a sua solução. As engrenagens mostram quais usam automação e o meio círculo, quais usam em parte. Vou abrir alguns exemplos.' },

    { id: 'loto', secao: 4, parte: 4, titulo: 'Manutenção segura: bloqueio e etiquetagem (LOTO)',
      roteiro: 'Na manutenção, como na troca de rolete ou na limpeza da correia, sensores não bastam. Vale o LOTO: desligar na chave geral, colocar cadeado e etiqueta, esperar a energia do inversor sair e medir tensão zero antes de pôr a mão. Agora, os resultados.' },

    // parte 5: avaliação, números, conclusão e fechamento
    { id: 'matriz', secao: 5, parte: 5, titulo: 'Avaliação: o risco antes e depois',
      roteiro: 'Para avaliar o resultado, classificamos cada problema por probabilidade e gravidade. Antes, quase tudo estava no vermelho. Agora vou aplicar as melhorias. A probabilidade cai bastante. A gravidade nem sempre cai, porque um tambor continua podendo esmagar: por isso inspeção e treinamento continuam importantes.' },

    { id: 'numeros', secao: 5, parte: 5, titulo: 'Resultados em números',
      roteiro: 'Em números: 13 problemas, mais da metade resolvida com automação e quase todo o resto com ajuda dela. Só a travessia não tem nada de automação: a solução é uma passarela. A automação ajuda muito, mas não resolve tudo sozinha.' },

    { id: 'conclusao', secao: 5, parte: 5, titulo: 'Conclusão da equipe',
      roteiro: 'Respondendo à pergunta norteadora: primeiro, separar fisicamente a pessoa do perigo. Segundo, fazer a máquina parar sozinha e avisar. Terceiro, manutenção só com energia zero. Com isso a esteira fica segura sem depender só do EPI.' },

    { id: 'fim', secao: 5, parte: 5, titulo: 'Agora é com vocês',
      roteiro: 'Para terminar, a turma vai usar o infográfico e corrigir os 13 problemas da esteira. Obrigado de toda a equipe!' }
  ];

  // perfis de esteira (figura 1 do PDF) e aplicações típicas
  const TIPOS = [
    { nome: 'Rolos livres ou motorizados', icone: 'rolos' },
    { nome: 'Correia plana (tração)', icone: 'plana' },
    { nome: 'Correia inclinada', icone: 'inclinada' }
  ];
  const APLICACOES = [
    { nome: 'Linhas de envase', texto: 'Garrafas e frascos passam por sensores ópticos.' },
    { nome: 'Logística e triagem', texto: 'Leitura de código de barras em movimento e desvio pneumático dos pacotes.' },
    { nome: 'Células robotizadas', texto: 'Alimenta braços robóticos sem ninguém na zona de risco.' }
  ];

  // peças clicáveis do diagrama "Como funciona"
  const COMPONENTES = {
    sensor: { nome: 'Sensor fotoelétrico', texto: 'Um feixe de luz cruza a esteira. Quando a caixa corta o feixe, o CLP sabe que ela passou.', seg: 'Se o feixe fica cortado tempo demais, é atolamento (melhoria 3).' },
    indutivo: { nome: 'Sensor indutivo', texto: 'Detecta metal sem encostar. Aqui ele conta as voltas do tambor: se a esteira parar ou girar ao contrário, o CLP percebe.', seg: 'Ajuda a detectar carga travada e retorno da correia.' },
    clp: { nome: 'CLP', texto: 'O cérebro do sistema: lê os sensores, decide e manda o inversor acelerar, frear ou parar.', seg: 'Coordena paradas, alarmes e o aviso antes de partir.' },
    inversor: { nome: 'Inversor de frequência', texto: 'Controla a velocidade do motor e as rampas de aceleração e desaceleração.', seg: 'Guarda energia nos capacitores: espere de 3 a 5 min depois de desligar.' },
    rele: { nome: 'Relé de segurança', texto: 'Circuito separado do CLP, feito para falhar do jeito seguro. Recebe a emergência e os intertravamentos.', seg: 'Corta o motor quando alguém abre a grade ou puxa o cabo.' },
    motor: { nome: 'Motor trifásico + redutor', texto: 'Motor de 220 V / 380 V que gira o tambor de tração pela transmissão (correia e polias).', seg: 'Transmissão exposta agarra dedos e roupas (problema 9).' },
    tambor: { nome: 'Tambor de tração', texto: 'Puxa a correia. Onde a correia encontra o tambor fica o ponto de esmagamento.', seg: 'A zona mais perigosa da esteira (problema 1).' },
    rolo: { nome: 'Rolo movido', texto: 'Na outra ponta, só acompanha a correia e mantém ela esticada.', seg: 'Também forma um ponto de esmagamento.' },
    ihm: { nome: 'IHM', texto: 'A tela do operador: liga, desliga e mostra os alarmes.', seg: 'O "Stop" da IHM não serve para manutenção: precisa de LOTO.' }
  };

  // tabela "Identificação dos perigos" do PDF, com os tipos que o infográfico acrescentou
  const QUADRO = [
    { cat: 'Mecânico', perigo: 'Pontos de enroscamento e prensamento', onde: 'Entre a correia e os rolos, nas extremidades; transmissão motor–redutor', quem: 'Operadores e equipe de manutenção', consequencia: 'Esmagamento, fraturas, laceração ou amputação' },
    { cat: 'Elétrico', perigo: 'Tensão de 220\u00a0V / 380\u00a0V', onde: 'Caixa de ligação do motor, painel do CLP e inversor', quem: 'Eletricistas e técnicos de automação', consequencia: 'Choque grave, queimadura por arco elétrico, morte' },
    { cat: 'Cinemático', perigo: 'Movimento imprevisto', onde: 'Superfície de transporte', quem: 'Operadores ao limpar ou ajustar a esteira', consequencia: 'Arraste e queda do trabalhador, contusões' },
    { cat: 'Ergonômico', perigo: 'Postura estática e repetitividade', onde: 'Postos de alimentação (início) e coleta (fim)', quem: 'Operadores de linha de produção', consequencia: 'LER/DORT, lombalgia' },
    { cat: 'Físico', perigo: 'Ruído do motor e dos rolamentos', onde: 'Motor de acionamento da esteira inclinada', quem: 'Todos os trabalhadores do setor', consequencia: 'Perda auditiva induzida por ruído (irreversível)' }
  ];

  // grupos de pessoas expostas, a partir do campo "quem" de cada problema (js/data.js)
  const PESSOAS = [
    { quem: 'Operadores de produção', onde: 'Alimentação, coleta e ao longo da linha', risco: 'Arraste, esmagamento e lesões na coluna', problemas: [1, 3, 6, 7, 8, 9, 11], cor: '#3f8de0' },
    { quem: 'Equipe de manutenção', onde: 'Cabeceira, transmissão e troca de roletes', risco: 'A esteira parte durante o serviço', problemas: [1, 5, 9], cor: '#ef6c57' },
    { quem: 'Eletricistas e técnicos de automação', onde: 'Painel do CLP, inversor e motor', risco: 'Choque e arco elétrico', problemas: [4, 5], cor: '#f5c242' },
    { quem: 'Quem passa perto', onde: 'Corredores, embaixo e por cima da linha', risco: 'Queda de material e arraste ao atravessar', problemas: [2, 10, 12], cor: '#9b6ef0' },
    { quem: 'Todos do setor', onde: 'Perto do motor e dos rolamentos', risco: 'Perda auditiva por ruído, sem volta', problemas: [13], cor: '#4caf50' }
  ];

  // outros casos reais; fonte = trecho da URL de uma referência do problema em js/data.js (o link vem de lá)
  const CASOS = [
    { local: 'jan/2024 · Bristol (Reino Unido)', problema: 3, fonte: 'circularonline',
      texto: 'Ao desobstruir uma esteira, o trabalhador escorregou e teve o braço puxado na ponta sem proteção: fraturas e lesão de nervos. Multa de £64.666.' },
    { local: 'Cerâmica · Piracicaba (SP)', problema: 1, fonte: 'Volume_3',
      texto: 'Um trabalhador teve o braço direito amputado ao verificar um defeito com a esteira em movimento.' },
    { local: 'Madeireira · São Bernardo do Campo (SP)', problema: 10, fonte: 'prt2.mpt',
      texto: 'Depois que um operador feriu gravemente a mão, os auditores encontraram esteiras sem proteção e sem manutenção preventiva. O MPT exigiu proteções nos transportadores.' },
    { local: '2014 a 2020 · Japão', problema: 8, fonte: 'mhlw',
      texto: 'Ficar preso em esteira foi 21% dos acidentes fatais do setor analisado. O alerta: a esteira pode começar a se mover de repente.' }
  ];

  // linha do tempo do acidente do PDF (seção 3)
  const ACIDENTE = {
    passos: [
      'Uma caixa enroscou na lateral da esteira.',
      'O operador foi soltar com a mão, com a esteira energizada e em movimento.',
      'O braço foi puxado para o ponto entre a correia e o tambor de tração.',
      'Fratura exposta no antebraço, cirurgia e mais de 90 dias de afastamento.'
    ],
    perigos: [
      { texto: 'Rolo sem enclausuramento', problema: 1 },
      { texto: 'Sem parada de emergência acessível', problema: 2 },
      { texto: 'Sem detecção de atolamento: o motor continuou forçando', problema: 3 }
    ],
    fonte: 'Ministério do Trabalho e Emprego / Fundacentro (2022)'
  };

  // o que a fiscalização encontrou no Pecém (SINAIT, jan/2026) e o caso de Bristol (HSE)
  const PECEM = {
    achados: [
      { texto: 'Parada de emergência inoperante', problema: 2 },
      { texto: 'Manutenção com a esteira funcionando', problema: 5 },
      { texto: 'Partes móveis sem proteção', problema: 1 }
    ],
    exigencias: 'Parar totalmente a esteira em qualquer manutenção, permissão de trabalho com análise de risco, demarcar as áreas de circulação e treinar trabalho em altura (NR-35).'
  };

  // grupos de NRs nos cartões; trabalho = o que o PDF diz sobre a norma
  const NR_GRUPOS = [
    { nrs: ['NR-12'], rotulo: 'Máquinas', trabalho: 'É a norma central do projeto. Exige que a zona de convergência entre rolo e correia tenha proteções fixas enclausurantes, impedindo fisicamente o acesso do trabalhador à área de esmagamento.' },
    { nrs: ['NR-10'], rotulo: 'Eletricidade', trabalho: 'Vale para o painel do CLP e a ligação do motor: aterramento das carcaças, isolamento dos bornes e desenergização segura com travamento.' },
    { nrs: ['NR-17'], rotulo: 'Ergonomia', trabalho: 'A altura da esteira deve combinar com as medidas dos operadores, evitando flexão constante do tronco para pôr ou tirar caixas.' },
    { nrs: ['NR-1'], rotulo: 'Gerenciamento de riscos', trabalho: 'Todos os perigos da tabela precisam estar no PGR (Programa de Gerenciamento de Riscos) da empresa, com plano de ação.', todos: true },
    { nrs: ['NR-15', 'NR-6'], rotulo: 'Ruído e EPI' }
  ];

  // exemplos de cada nível da hierarquia da NR-1 (mesma ordem de NRS.HIERARQUIA)
  const HIERARQUIA_EXEMPLOS = [
    { itens: ['Robô paletizador ou manipulador a vácuo: ninguém levanta caixa', 'Posto com altura ajustável: ninguém se curva'], problemas: [7, 6] },
    { itens: ['Grades com intertravamento no tambor e na transmissão', 'Cabo de emergência em toda a lateral', 'Sensores + CLP: atolamento, carga desalinhada, giro reverso', 'Sirene antes da partida, passarela, painel fechado'], problemas: [1, 9, 2, 3, 10, 11, 8, 12, 4] },
    { itens: ['Bloqueio e etiquetagem (LOTO) na manutenção', 'Rodízio, pausas e treinamento', 'Organização (5S), sinalização e inspeção'], problemas: [5, 6, 7] },
    { itens: ['Protetor auricular, só depois de reduzir o ruído na fonte', 'Luva e bota não impedem um esmagamento'], problemas: [13] }
  ];

  // as três melhorias: a tabela "Controle de riscos" do PDF (seção 8)
  const MELHORIAS = {
    1: { n: 1, problema: 'Acesso manual ao rolo tracionador', controle: 'Proteção fixa com chave de intertravamento', prioridade: 'Alta', nr: 'NR-12, itens 12.8.1 e 12.5.1',
      como: 'Se a grade for removida, o contato da chave abre e envia sinal ao relé de segurança, que corta imediatamente a energia do motor.' },
    2: { n: 2, problema: 'Impossibilidade de parar a máquina de longe', controle: 'Cabo de parada de emergência (chave de tração)', prioridade: 'Alta', nr: 'NR-12, itens 12.8.7, 12.6.6 e 12.6.8',
      como: 'Instalado ao longo de toda a lateral: qualquer pessoa em qualquer ponto da linha para a esteira na hora, puxando o cabo.' },
    3: { n: 3, problema: 'Acionamento forçado com carga travada', controle: 'Sensor de acúmulo + lógica de tempo limite no CLP', prioridade: 'Média', nr: 'NR-12, itens 12.8.8 e 12.11.3',
      como: 'Se o sensor ficar obstruído por X segundos sem variação, o CLP assume "atolamento" e desliga a esteira, evitando a quebra e o convite a soltar a caixa com a mão.' }
  };

  // cenário da manutenção (PDF, seção 9)
  const LOTO_CENARIO = {
    cenario: 'Troca de rolete e limpeza profunda da correia.',
    energias: 'Elétrica (painel e inversor) e mecânica (a tensão da correia esticada).',
    aviso: 'Aqui sensores e chaves de segurança não bastam: o bloqueio e etiquetagem é obrigatório.'
  };
  const LOTO = [
    { t: 'Desenergizar', d: 'Não basta o "Stop" da IHM: abrir a chave seccionadora principal.' },
    { t: 'Bloquear e etiquetar', d: 'Cadeado pessoal + etiqueta com nome e motivo.' },
    { t: 'Energia residual', d: 'Esperar de 3 a 5 min (capacitores do inversor) e aliviar a tensão da correia.' },
    { t: 'Validar', d: 'Profissional NR-10 mede "tensão zero" nos bornes do motor.' }
  ];

  // estimativa qualitativa da equipe: [probabilidade, gravidade] de 1 (baixa) a 3 (alta), antes e depois do controle.
  // As proteções coletivas derrubam a probabilidade; a gravidade só cai quando a medida limita o dano.
  const RISCO = {
    1: { antes: [3, 3], depois: [1, 3] },
    2: { antes: [2, 3], depois: [1, 2] },
    3: { antes: [3, 2], depois: [1, 2] },
    4: { antes: [2, 3], depois: [1, 3] },
    5: { antes: [2, 3], depois: [1, 3] },
    6: { antes: [3, 2], depois: [1, 2] },
    7: { antes: [3, 2], depois: [1, 1] },
    8: { antes: [2, 3], depois: [1, 3] },
    9: { antes: [2, 3], depois: [1, 3] },
    10: { antes: [2, 2], depois: [1, 2] },
    11: { antes: [2, 2], depois: [1, 2] },
    12: { antes: [2, 3], depois: [1, 3] },
    13: { antes: [2, 2], depois: [1, 2] }
  };

  const CONCLUSAO = [
    { t: 'Separar a pessoa do perigo', d: 'Grades, intertravamentos e passarelas: a mão não alcança o ponto de esmagamento.' },
    { t: 'A máquina para sozinha e avisa', d: 'Cabo de emergência, sensores e CLP param a esteira antes do acidente; a sirene avisa antes de partir.' },
    { t: 'Manutenção só com energia zero', d: 'LOTO com cadeado e teste de tensão. O EPI fica como última camada, não como a solução.' }
  ];

  const REFERENCIAS = [
    { titulo: 'Análise de acidente em sistema transportador de correia', fonte: 'MTE / Fundacentro, 2022' },
    { titulo: 'Porto do Pecém: esteira interditada após morte de trabalhador', fonte: 'SINAIT, jan/2026', url: 'https://www.sinait.org.br/noticia/23040/ce-fiscalizacao-portuaria-interdita-esteira-transportadora-de-carvao-mineral-no-porto-do-pecem-depois-de-morte-de-trabalhador' },
    { titulo: 'Recicladora multada após braço puxado ao desobstruir esteira', fonte: 'HSE (Reino Unido), via Circular Online', url: 'https://www.circularonline.co.uk/news/waste-and-recycling-company-fined-after-employee-suffers-life-changing-injuries/' },
    { titulo: 'Cartilhas "Alerta de Segurança": proteção de esteiras', fonte: 'CEREST Piracicaba', url: 'https://piracicaba.sp.gov.br/wp-content/uploads/2024/11/Cartilha_Volume_3_-_Protecao_de_esteiras_ceramica.pdf' },
    { titulo: 'Normas Regulamentadoras NR-1, 6, 10, 12, 15 e 17', fonte: 'Ministério do Trabalho e Emprego (gov.br)', url: 'https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes' }
  ];

  window.APRESENTACAO = {
    EQUIPE, ESCOLA, DISCIPLINA, PERGUNTA, SECOES, SLIDES, TIPOS, APLICACOES, COMPONENTES, QUADRO,
    PESSOAS, CASOS, ACIDENTE, PECEM, LOTO_CENARIO, NR_GRUPOS, HIERARQUIA_EXEMPLOS, MELHORIAS, LOTO, RISCO, CONCLUSAO, REFERENCIAS
  };
})();
