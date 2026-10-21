# Ficha técnica dos problemas

> Arquivo gerado por `node tools/gerar-docs.js` a partir de `js/data.js`. Não edite à mão: altere `js/data.js` e rode o script de novo.

São 14 problemas: 13 visíveis no infográfico e 1 escondido, que só fica clicável depois que todos os outros forem corrigidos.

## Resumo

| # | Problema | NR | Prioridade | Automação |
|---|---|---|---|---|
| 1 | Ponto de esmagamento no tambor de tração | NR-12 | Alta | ⚙ Sim |
| 2 | Sem parada de emergência ao longo da linha | NR-12 | Alta | ⚙ Sim |
| 3 | Atolamento com o motor forçando | NR-12 | Média | ⚙ Sim |
| 4 | Painel elétrico do CLP e inversor aberto | NR-10 | Alta | ◐ Parcial |
| 5 | Manutenção sem bloqueio e etiquetagem (LOTO) | NR-10 / NR-12 | Alta | ◐ Parcial |
| 6 | Ergonomia: altura inadequada da esteira | NR-17 | Média | ⚙ Sim |
| 7 | Ergonomia: levantamento repetitivo de caixas | NR-17 | Média | ⚙ Sim |
| 8 | Partida inesperada da esteira | NR-12 | Alta | ⚙ Sim |
| 9 | Transmissão exposta entre motor e redutor | NR-12 | Alta | ◐ Parcial |
| 10 | Queda de material da esteira elevada | NR-12 | Média | ◐ Parcial |
| 11 | Retorno de carga na esteira inclinada | NR-12 | Média | ⚙ Sim |
| 12 | Travessia por cima da esteira | NR-12 | Média | ✖ Não |
| 13 | Ruído excessivo de motor e rolamentos | NR-15 / NR-6 | Baixa | ◐ Parcial |
| 14 | Extintor de incêndio bloqueado *(escondido)* | NR-23 / NR-26 | Alta | ✖ Não |

---

## 1. Ponto de esmagamento no tambor de tração

**Categoria:** Mecânico · **NR:** NR-12 · **Prioridade:** Alta · **Automação:** ⚙ Sim

| | |
|---|---|
| **Onde** | Cabeceira motriz: ponto onde a correia encontra o tambor de tração. |
| **Quem fica exposto** | Operadores e equipe de manutenção. |
| **Consequência** | Esmagamento, fraturas, laceração ou amputação. |
| **Perigo** | Movimento rotativo contínuo do tambor de tração. |
| **Exposição** | O operador coloca a mão na esteira em movimento para soltar uma caixa enroscada. |
| **Risco** | Alta probabilidade de o braço ser puxado para o ponto de convergência, com gravidade de fratura ou amputação. |

**O caso:** Um operador tentou retirar manualmente uma caixa enroscada na lateral da esteira com o equipamento energizado e em movimento. O braço foi puxado para o ponto de convergência entre a correia de borracha e o tambor de tração: fratura exposta no antebraço, cirurgia e mais de 90 dias de afastamento.

**Solução:**
- Proteção fixa enclausurante sobre o tambor (só sai com ferramenta).
- Chave de intertravamento na proteção, ligada a um relé de segurança.
- Sinalização de "ponto de esmagamento" na cabeceira.

**Como reduz o risco:** A grade impede fisicamente que a mão alcance o ponto de convergência. Se a grade for removida, o relé de segurança corta imediatamente a energia do motor.

**Automação:** Chave de intertravamento na grade → Relé de segurança → Contator corta o motor. Se alguém abrir ou remover a grade, o contato da chave abre e o relé de segurança desliga o motor na hora.

**Vídeos reais:**
- **Vídeo do problema:** [Trabalhador puxado pela esteira ao mexer com ela ligada](https://www.youtube.com/watch?v=8X_EjsuJPhk)
- **Vídeo da solução:** [Proteções (grades) ao redor de esteiras](https://www.youtube.com/watch?v=SdTBV11tdws)

**Referências reais:**
- **Caso real:** Esmagamento em tambor de tração (caso do trabalho). Ministério do Trabalho e Emprego / Fundacentro (2022). Caso analisado no trabalho trimestral: braço puxado entre correia e tambor de tração com a esteira em movimento. Perigos presentes: rolo sem enclausuramento, falta de parada de emergência acessível e falha na detecção de congestionamento.
- **Caso real:** [Cartilha "Alerta de Segurança" vol. 3: proteção de esteiras na cerâmica](https://piracicaba.sp.gov.br/wp-content/uploads/2024/11/Cartilha_Volume_3_-_Protecao_de_esteiras_ceramica.pdf). CEREST Piracicaba. Acidentes reais em esteiras de argila, incluindo um trabalhador que teve o braço direito amputado ao verificar um defeito com a esteira em movimento.
- **Referência técnica:** [Conveyor guarding in mines](https://www.ontario.ca/page/conveyor-guarding-mines). Governo de Ontário (Canadá). Tambores de cabeceira, de retorno, de acionamento e de desvio precisam de proteção onde o ponto de esmagamento for acessível. A proteção fixa deve exigir ferramenta para ser removida.
- **Referência técnica:** [Exposed Belt Transfers: the pinch point hazard hiding in plain sight](https://www.flexco.com/EN/Blogs/Exposed-Belt-Transfers-The-Pinch-Point-Hazard-Hiding-in-Plain-Sight.htm). Flexco. Os pontos de esmagamento mais comuns ficam onde a correia encontra o tambor de cabeceira, o de retorno e os roletes. Muitos acidentes acontecem ao tentar limpar material com a esteira ligada.

---

## 2. Sem parada de emergência ao longo da linha

**Categoria:** Mecânico · **NR:** NR-12 · **Prioridade:** Alta · **Automação:** ⚙ Sim

| | |
|---|---|
| **Onde** | Ao longo de toda a lateral da esteira principal. |
| **Quem fica exposto** | Qualquer pessoa que trabalhe ou passe perto da esteira. |
| **Consequência** | Sem um jeito rápido de parar, um arraste que seria leve vira amputação ou morte. |
| **Perigo** | Esteira longa em movimento com um único botão de parada, longe do ponto de risco. |
| **Exposição** | Um colega preso na correia depende de alguém correr até o painel. |
| **Risco** | A demora em parar aumenta muito a gravidade do acidente. |

**O caso:** No Porto do Pecém (CE), em janeiro de 2026, um trabalhador de 23 anos foi puxado por uma esteira de carvão durante a manutenção e morreu. A fiscalização constatou que o dispositivo de parada de emergência estava inoperante e interditou a esteira.

**Solução:**
- Cabo de parada de emergência (chave de tração) nas duas laterais da esteira.
- Botoeiras tipo cogumelo nos postos de alimentação e de coleta.
- Ligação a um relé de segurança, com rearme manual e teste periódico registrado.

**Como reduz o risco:** Basta puxar o cabo em qualquer ponto da linha para cortar o motor imediatamente, sem depender de alcançar o painel.

**Automação:** Cabo de emergência (chave de tração) → Relé de segurança + rearme manual → Motor para e não religa sozinho. Qualquer pessoa ao longo da linha puxa o cabo e a esteira para. Ela só volta a funcionar depois do rearme manual.

**Vídeos reais:**
- **Vídeo do problema:** [Trabalhador preso e arrastado pela esteira: cada segundo para parar conta](https://www.youtube.com/watch?v=DfUZMDCc3pE)
- **Vídeo da solução:** [Esteira com cabo de parada de emergência](https://www.youtube.com/watch?v=DtmFwgJ1gSQ)

**Referências reais:**
- **Caso real:** [Porto do Pecém (CE): esteira interditada após morte de trabalhador](https://www.sinait.org.br/noticia/23040/ce-fiscalizacao-portuaria-interdita-esteira-transportadora-de-carvao-mineral-no-porto-do-pecem-depois-de-morte-de-trabalhador). SINAIT — Sindicato Nacional dos Auditores Fiscais do Trabalho (jan/2026). Um trabalhador terceirizado de 23 anos fazia manutenção com a esteira de carvão funcionando, foi puxado para dentro do equipamento e morreu no local. A fiscalização encontrou o dispositivo de parada de emergência inoperante, manutenção com a máquina ligada e partes móveis sem proteção, e interditou a esteira.
- **Referência técnica:** [Where must emergency stops be located on a conveyor?](https://jjkellercompliancenetwork.com/regsense/where-must-emergency-stops-also-known-as-e-stops-be-located-on-a-conveyor). J. J. Keller. Cabos de emergência devem cobrir todo o comprimento da esteira, e ela não pode religar até que a chave acionada seja rearmada.

---

## 3. Atolamento com o motor forçando

**Categoria:** Mecânico · **NR:** NR-12 · **Prioridade:** Média · **Automação:** ⚙ Sim

| | |
|---|---|
| **Onde** | Lateral da esteira principal, onde as caixas enroscam. |
| **Quem fica exposto** | Operadores de produção. |
| **Consequência** | Quebra mecânica e, principalmente, o "convite" para o operador desobstruir com a mão e ser arrastado. |
| **Perigo** | Motor continua tracionando uma carga travada. |
| **Exposição** | O operador tenta soltar a caixa com a esteira ligada. |
| **Risco** | Arraste do braço para os rolos durante a desobstrução. |

**O caso:** Em 27 de janeiro de 2024, em uma recicladora em Bristol (Reino Unido), um trabalhador tentava desobstruir um bloqueio na esteira, escorregou e encostou na extremidade traseira da correia, que não tinha proteção. O braço foi puxado: fraturas, lacerações graves e lesão de nervos. A empresa foi multada em £64.666.

**Solução:**
- Sensor de acúmulo (fotoelétrico) no ponto crítico.
- Lógica de timeout no CLP: sensor bloqueado por X segundos = atolamento.
- Parada automática + alarme na IHM + procedimento de desobstrução com a máquina bloqueada.

**Como reduz o risco:** A esteira para sozinha antes de forçar a carga, eliminando a pressa de resolver na mão com tudo ligado.

**Automação:** Sensor fotoelétrico de acúmulo → CLP: timeout de X segundos sem variação → Desliga a esteira e mostra alarme na IHM. Se o sensor fica obstruído tempo demais, o CLP entende que é atolamento e para tudo antes que alguém tente soltar a carga com a mão.

**Vídeos reais:**
- **Vídeo do problema:** [Trabalhador preso ao ajeitar caixas com a esteira ligada](https://www.youtube.com/watch?v=P1hM2nRVt7g)
- **Vídeo da solução:** [Detecção automática de atolamento](https://www.youtube.com/watch?v=3jo09rnwd5s)

**Referências reais:**
- **Caso real:** [Recicladora multada após braço ser puxado ao desobstruir esteira](https://www.circularonline.co.uk/news/waste-and-recycling-company-fined-after-employee-suffers-life-changing-injuries/). HSE (Reino Unido), via Circular Online (jan/2024 (multa em jun/2026)). Bateman Skips Ltd: o trabalhador limpava um bloqueio, escorregou e teve o braço puxado na extremidade sem proteção. A investigação apontou falta de proteção e falta de um sistema seguro para desobstrução.
- **Referência técnica:** [Run-back safety mechanism for conveyor apparatus (patente US 4.548.316)](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/4548316). USPTO. Explica que, ao remover um atolamento, a energia acumulada na correia faz ela se mover sozinha, mesmo sem motor. Cita um operador esmagado entre a correia e o tambor.

---

## 4. Painel elétrico do CLP e inversor aberto

**Categoria:** Elétrico · **NR:** NR-10 · **Prioridade:** Alta · **Automação:** ◐ Parcial

| | |
|---|---|
| **Onde** | Painel de comando do CLP e inversor de frequência (220 V / 380 V). |
| **Quem fica exposto** | Eletricistas e técnicos de automação. |
| **Consequência** | Choque elétrico grave, queimaduras por arco elétrico, morte. |
| **Perigo** | Tensão de 220 V / 380 V e energia armazenada no inversor. |
| **Exposição** | Porta aberta, bornes expostos e carcaças sem aterramento ao alcance de qualquer pessoa. |
| **Risco** | Contato direto ou indireto com partes energizadas e arco elétrico durante manobras. |

**O caso:** Arcos elétricos em painéis de baixa tensão (480 V) liberam calor, luz e pressão em milissegundos, como mostram os ensaios em câmera lenta das referências. Em painel aberto e sem aterramento, um toque acidental ou uma ferramenta caída basta.

**Solução:**
- Painel sempre fechado e trancado, acesso só para profissional autorizado (NR-10).
- Aterramento de todas as carcaças metálicas e isolamento dos bornes.
- Seccionadora com intertravamento na porta e sinalização de risco elétrico.

**Como reduz o risco:** Elimina o contato acidental com partes energizadas e garante que só se abre o painel sem tensão.

**Automação:** Porta do painel → Seccionadora com intertravamento da porta → Porta só abre desenergizada. A automação garante que ninguém abra o painel energizado. Aterramento, isolamento dos bornes e sinalização continuam sendo medidas elétricas da NR-10.

**Vídeos reais:**
- **Vídeo do problema:** [Arco elétrico em painel de um frigorífico](https://www.youtube.com/watch?v=xyjgb3uMh8s)
- **Vídeo da solução:** [NR-10: painéis elétricos fechados, identificados e trancados](https://www.youtube.com/watch?v=N28QFNWRDAI)

**Referências reais:**
- **Referência técnica:** [NR-10: Segurança em Instalações e Serviços em Eletricidade](https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes). Ministério do Trabalho e Emprego. Exige aterramento, isolamento, procedimentos de desenergização e que só profissionais autorizados acessem painéis.

---

## 5. Manutenção sem bloqueio e etiquetagem (LOTO)

**Categoria:** Elétrico / Mecânico · **NR:** NR-10 / NR-12 · **Prioridade:** Alta · **Automação:** ◐ Parcial

| | |
|---|---|
| **Onde** | Troca de rolete e limpeza profunda da correia. |
| **Quem fica exposto** | Técnicos de manutenção e de automação. |
| **Consequência** | Partida durante o serviço: arraste, esmagamento, choque, morte. |
| **Perigo** | Energia elétrica (painel/inversor) e mecânica (tensão da correia). |
| **Exposição** | O técnico desliga só pelo botão "Stop" da IHM e põe as mãos na correia. |
| **Risco** | Qualquer pessoa (ou o próprio CLP) pode religar a esteira com o técnico dentro. |

**O caso:** No Porto do Pecém (CE), em 2026, a manutenção era feita com a esteira em funcionamento. O trabalhador foi puxado e morreu. Entre as exigências da fiscalização: parar totalmente a esteira em qualquer manutenção e emitir permissão de trabalho baseada em análise de risco.

**Solução:**
- Abrir a chave seccionadora principal (não basta o "Stop" da IHM).
- Colocar cadeado pessoal + etiqueta de identificação.
- Aguardar de 3 a 5 minutos para descarregar os capacitores do inversor.
- Testar "tensão zero" nos bornes do motor com multímetro e aliviar a tensão da correia.

**Como reduz o risco:** Só quem colocou o cadeado pode tirá-lo: ninguém religa a esteira com o técnico trabalhando.

**Automação:** Seccionadora bloqueável + sensor de tensão no barramento DC → CLP monitora energia residual do inversor → IHM mostra "seguro para abrir". A automação ajuda a confirmar a energia zero, mas o LOTO em si (cadeado, etiqueta, teste com multímetro) é um procedimento que as pessoas executam.

**Vídeos reais:**
- **Vídeo do problema:** [Animação: acidente em esteira sem bloqueio na manutenção](https://www.youtube.com/watch?v=MeKxCVS-tKk)
- **Vídeo da solução:** [Bloqueio e etiquetagem (LOTO) em 3 minutos](https://www.youtube.com/watch?v=fxlbx6fBBPE)

**Referências reais:**
- **Caso real:** [Porto do Pecém (CE): esteira interditada após morte de trabalhador](https://www.sinait.org.br/noticia/23040/ce-fiscalizacao-portuaria-interdita-esteira-transportadora-de-carvao-mineral-no-porto-do-pecem-depois-de-morte-de-trabalhador). SINAIT — Sindicato Nacional dos Auditores Fiscais do Trabalho (jan/2026). Um trabalhador terceirizado de 23 anos fazia manutenção com a esteira de carvão funcionando, foi puxado para dentro do equipamento e morreu no local. A fiscalização encontrou o dispositivo de parada de emergência inoperante, manutenção com a máquina ligada e partes móveis sem proteção, e interditou a esteira.
- **Referência técnica:** [Minimize Conveyor Injury Risks with Safeguarding](https://www.foodmanufacturing.com/home/article/21115042/minimize-conveyor-injury-risks-with-safeguarding). Food Manufacturing. Lembra que esteiras têm energia elétrica e cinética e exigem procedimento de LOTO específico para cada máquina, ao contrário do que muitos pensam.

---

## 6. Ergonomia: altura inadequada da esteira

**Categoria:** Ergonômico · **NR:** NR-17 · **Prioridade:** Média · **Automação:** ⚙ Sim

| | |
|---|---|
| **Onde** | Posto de alimentação, no início da esteira. |
| **Quem fica exposto** | Operadores de linha de produção. |
| **Consequência** | Lombalgia e LER/DORT por flexão constante do tronco. |
| **Perigo** | Superfície de trabalho baixa demais para a estatura do operador. |
| **Exposição** | O operador se curva centenas de vezes por turno para depositar caixas. |
| **Risco** | Lesões na coluna que se acumulam ao longo de meses. |

**O caso:** A NR-17 determina que a altura das superfícies de trabalho seja compatível com as características antropométricas dos trabalhadores. Uma esteira fixa e baixa obriga a flexão do tronco a cada caixa: o problema não é um acidente súbito, mas uma lesão que se instala aos poucos.

**Solução:**
- Mesa / esteira de alimentação com altura ajustável.
- Altura de trabalho próxima à altura do cotovelo do operador.
- Pausas e rodízio de tarefas (NR-17).

**Como reduz o risco:** Com a carga na altura certa, a coluna fica reta e o esforço cai a cada movimento.

**Automação:** Operador se identifica na IHM → CLP busca a altura ideal do operador → Atuador elétrico ajusta a altura do posto. O posto se adapta a cada pessoa, em vez de a pessoa se curvar para o posto.

**Vídeos reais:**
- **Vídeo do problema:** [Ergonomia: os 5 pontos principais da NR-17](https://www.youtube.com/watch?v=gvH1MxRsp1A)
- **Vídeo da solução:** [Postos com elevação ajustável à altura do operador](https://www.youtube.com/watch?v=kRVUCrdpxBI)

**Referências reais:**
- **Referência técnica:** [NR-17: Ergonomia](https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes). Ministério do Trabalho e Emprego. Exige que mobiliário e superfícies de trabalho sejam adequados às características antropométricas de quem trabalha.

---

## 7. Ergonomia: levantamento repetitivo de caixas

**Categoria:** Ergonômico · **NR:** NR-17 · **Prioridade:** Média · **Automação:** ⚙ Sim

| | |
|---|---|
| **Onde** | Fim da linha, na paletização. |
| **Quem fica exposto** | Operadores de linha de produção. |
| **Consequência** | Lombalgia, hérnia de disco, LER/DORT. |
| **Perigo** | Movimentação manual de cargas, com repetição e torção do tronco. |
| **Exposição** | O operador pega cada caixa da esteira e empilha no palete, do chão até acima do ombro. |
| **Risco** | Sobrecarga acumulada na coluna e nos ombros. |

**O caso:** A movimentação manual de cargas é um dos pontos centrais da NR-17 atual, que exige avaliar o peso, a frequência, a distância e a postura de cada tarefa. No fim de linha, o mesmo operador pode levantar centenas de caixas por turno.

**Solução:**
- Robô paletizador ou manipulador a vácuo no fim da linha.
- Palete sobre mesa pantográfica (mantém a camada na altura da esteira).
- Rodízio de função e pausas.

**Como reduz o risco:** Tira o esforço de levantamento do corpo do trabalhador.

**Automação:** Sensor de caixa no fim da linha → CLP coordena o ciclo → Robô paletizador / manipulador a vácuo. A máquina faz o levantamento pesado e repetitivo; o operador só supervisiona.

**Vídeos reais:**
- **Vídeo do problema:** [Movimentação manual de cargas na NR-17](https://www.youtube.com/watch?v=reK02bRgPGI)
- **Vídeo da solução:** [Elevador a vácuo para caixas de 40 kg](https://www.youtube.com/watch?v=qlyhj6sAjgc)

**Referências reais:**
- **Referência técnica:** [NR-17: Ergonomia (levantamento, transporte e descarga de materiais)](https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes). Ministério do Trabalho e Emprego. Exige avaliar a movimentação manual de cargas e adotar medidas, como ajudas mecânicas, para reduzir o esforço.

---

## 8. Partida inesperada da esteira

**Categoria:** Cinemático · **NR:** NR-12 · **Prioridade:** Alta · **Automação:** ⚙ Sim

| | |
|---|---|
| **Onde** | Trecho onde o operador limpa a correia. |
| **Quem fica exposto** | Operadores ao limpar ou ajustar a esteira. |
| **Consequência** | Arraste e queda do trabalhador, contusões e fraturas. |
| **Perigo** | Esteira parada que volta a andar sem aviso. |
| **Exposição** | O operador está com a mão na correia quando alguém dá partida em outro posto. |
| **Risco** | Arraste súbito sem tempo de reação. |

**O caso:** Material de segurança do Ministério da Saúde, Trabalho e Bem-Estar do Japão, traduzido para o português, alerta que a esteira pode começar a se mover de repente se alguém esquecer de desligá-la. O mesmo material aponta que o prendimento em esteiras respondeu por 21% das mortes no setor analisado entre 2014 e 2020.

**Solução:**
- Sirene e sinaleiro de pré-partida temporizados pelo CLP.
- Rearme manual após qualquer parada.
- Partida somente pela IHM, com visão da linha.

**Como reduz o risco:** Ninguém é pego de surpresa: há alguns segundos de aviso antes de qualquer movimento.

**Automação:** Comando de partida na IHM → CLP temporiza sirene + sinaleiro → Só depois o motor liga. Antes de qualquer partida, a esteira avisa com som e luz por alguns segundos, dando tempo de qualquer pessoa sair de perto.

**Vídeos reais:**
- **Vídeo do problema:** [Máquina religada com o trabalhador dentro: seguro × inseguro](https://www.youtube.com/watch?v=MFee525FOtU)
- **Vídeo da solução:** [Chaves de emergência e alarmes de esteira](https://www.youtube.com/watch?v=q_ntfPp9ixs)

**Referências reais:**
- **Referência técnica:** [Material de segurança em português (concreto usinado)](https://www.mhlw.go.jp/content/11300000/000957646.pdf). MHLW — Ministério da Saúde, Trabalho e Bem-Estar do Japão. História em quadrinhos de segurança: o prendimento em esteira transportadora foi 21% das ocorrências fatais de 2014 a 2020, e a esteira pode começar a se mover de repente.

---

## 9. Transmissão exposta entre motor e redutor

**Categoria:** Mecânico · **NR:** NR-12 · **Prioridade:** Alta · **Automação:** ◐ Parcial

| | |
|---|---|
| **Onde** | Motor + redutor da cabeceira (correia e polias). |
| **Quem fica exposto** | Operadores e manutenção. |
| **Consequência** | Agarramento de dedos, mãos, roupas e cabelo; amputação. |
| **Perigo** | Correia de transmissão e polias girando ao alcance da mão. |
| **Exposição** | Passar perto, apoiar a mão ou fazer ajustes com o motor ligado. |
| **Risco** | Agarramento no ponto em que a correia entra na polia. |

**O caso:** As cartilhas "Alerta de Segurança" do CEREST Piracicaba registram acidentes reais em esteiras de usinas causados por transmissão de força desprotegida (correias, polias e correntes sem proteção).

**Solução:**
- Proteção fixa enclausurando correia e polias.
- Se precisar abrir com frequência: proteção móvel com intertravamento.
- Sinalização de partes móveis.

**Como reduz o risco:** Sem acesso ao ponto de contato entre correia e polia, não há como ser agarrado.

**Automação:** Proteção removível da transmissão → Chave de intertravamento → relé de segurança → Motor desliga se a proteção sair. A solução principal é mecânica: uma proteção fixa. O intertravamento só é necessário se a proteção precisar ser aberta com frequência.

**Vídeos reais:**
- **Vídeo do problema:** [Partes móveis sem proteção (machinery guarding)](https://www.youtube.com/watch?v=TukTqslw_90)
- **Vídeo da solução:** [Proteção de correia e polias (V-belt guard)](https://www.youtube.com/watch?v=el5l64bURiQ)

**Referências reais:**
- **Imagem real:** [Ponto de contato entre correia de transmissão e polia](https://commons.wikimedia.org/wiki/File:Power_transmission_belt.gif). OSHA, Departamento do Trabalho dos EUA (domínio público, via Wikimedia Commons). Arquivo local: `assets/ref/osha-correia-polia.gif`.
- **Caso real:** [Cartilha "Alerta de Segurança" vol. 2: proteção de esteiras em usinas](https://piracicaba.sp.gov.br/wp-content/uploads/2024/11/Cartilha_Volume_2_-_Protecao_de_esteiras_em_usinas.pdf). CEREST Piracicaba. Acidentes reais em esteiras de usinas de açúcar e álcool, com análise de causas como a transmissão de força desprotegida.
- **Referência técnica:** [Machine Guarding: Hazardous Motions](https://www.osha.gov/etools/machine-guarding/introduction/hazardous-motions-actions). OSHA eTool. Exemplos de pontos de agarramento: correia e polia, corrente e engrenagem, cremalheira e pinhão.

---

## 10. Queda de material da esteira elevada

**Categoria:** Mecânico · **NR:** NR-12 · **Prioridade:** Média · **Automação:** ◐ Parcial

| | |
|---|---|
| **Onde** | Trecho elevado da esteira inclinada. |
| **Quem fica exposto** | Quem passa ou trabalha embaixo da esteira. |
| **Consequência** | Contusões, fraturas e traumatismo por queda de objetos. |
| **Perigo** | Caixas sem contenção lateral em altura. |
| **Exposição** | Pessoas circulando sob o trecho elevado. |
| **Risco** | Caixa desalinhada cai sobre alguém. |

**O caso:** Em São Bernardo do Campo (SP), após um operador ferir gravemente a mão, auditores fiscais apontaram irregularidades nas esteiras transportadoras de uma empresa de madeira. O MPT propôs um TAC que exigia proteções fixas ou móveis nos transportadores contínuos.

**Solução:**
- Guias laterais e bordas de contenção em todo o trecho elevado.
- Tela de proteção sob a esteira em áreas de circulação.
- Sensor de carga desalinhada ligado ao CLP.

**Como reduz o risco:** A carga fica contida na esteira e, se algo sair do lugar, a linha para.

**Automação:** Sensor de carga fora de posição → CLP detecta caixa desalinhada → Para a esteira antes da queda. As guias laterais (mecânicas) seguram a carga; o sensor é uma camada extra.

**Vídeos reais:**
- **Vídeo do problema:** [Por que as caixas caem da esteira](https://www.youtube.com/watch?v=hM9OGdXtEEQ)
- **Vídeo da solução:** [Guias laterais para esteiras](https://www.youtube.com/watch?v=Z9aJBFHZGLc)

**Referências reais:**
- **Caso real:** [Empresa de madeira é acionada pelo MPT após acidente](https://www.prt2.mpt.mp.br/1157-empresa-de-madeira-e-acionada-pelo-mpt-para-reforcar-medidas-de-seguranca-apos-grave-acidente-com-trabalhador). MPT-SP (Ministério Público do Trabalho). Relatório de auditores fiscais apontou esteiras sem proteção e falta de manutenção preventiva. O TAC proposto exigia proteções nos transportadores.
- **Referência técnica:** [Conveyor Safety: hazards associated with conveyors](https://oshainfo.gatech.edu/wp-content/uploads/2025/07/Conveyors-TGrevised.pdf). Georgia Tech OSHA Consultation. Guia de treinamento sobre riscos de esteiras, incluindo queda de materiais e pontos de agarramento.

---

## 11. Retorno de carga na esteira inclinada

**Categoria:** Mecânico · **NR:** NR-12 · **Prioridade:** Média · **Automação:** ⚙ Sim

| | |
|---|---|
| **Onde** | Esteira inclinada que sobe até a paletização. |
| **Quem fica exposto** | Operadores no pé da esteira inclinada. |
| **Consequência** | Caixas descendo e atingindo pessoas; esmagamento no tambor de retorno. |
| **Perigo** | Peso da carga em rampa puxando a correia para trás quando o motor para. |
| **Exposição** | Operador no pé da rampa durante uma parada ou falta de energia. |
| **Risco** | Retrocesso súbito da correia carregada. |

**O caso:** Uma patente americana sobre mecanismos anti-retorno descreve que, ao remover um atolamento, a energia elástica acumulada faz a correia se mover mesmo sem motor, e cita um operador esmagado entre a correia e o tambor de retorno.

**Solução:**
- Freio anti-retorno (backstop / holdback) no redutor.
- Correia com taliscas (cleats) para segurar as caixas.
- Sensor de rotação reversa ligado ao CLP.

**Como reduz o risco:** A correia só gira em um sentido: mesmo sem energia, a carga não desce.

**Automação:** Sensor de rotação / velocidade zero → CLP detecta giro reverso → Aciona freio e alarme. Junto com o freio anti-retorno (backstop, mecânico), o sensor garante que a correia nunca desça com a carga.

**Vídeos reais:**
- **Vídeo do problema:** [Retorno da correia carregada e o holdback](https://www.youtube.com/watch?v=efCE6KoxeXY)
- **Vídeo da solução:** [Esteira inclinada com taliscas](https://www.youtube.com/watch?v=dPtoQ4bBtZo)

**Referências reais:**
- **Referência técnica:** [Run-back safety mechanism for conveyor apparatus (patente US 4.548.316)](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/4548316). USPTO. Descreve o perigo do retrocesso da correia e o caso de um operador esmagado no tambor de retorno.

---

## 12. Travessia por cima da esteira

**Categoria:** Mecânico · **NR:** NR-12 · **Prioridade:** Média · **Automação:** ✖ Não

| | |
|---|---|
| **Onde** | Meio da linha principal, onde as pessoas cortam caminho. |
| **Quem fica exposto** | Qualquer trabalhador que precise atravessar a linha. |
| **Consequência** | Queda, arraste pela correia, esmagamento. |
| **Perigo** | Pular por cima da correia em movimento. |
| **Exposição** | O trabalhador pisa ou se apoia na esteira para cortar caminho. |
| **Risco** | Escorregar e ser arrastado pela correia. |

**O caso:** Na interdição da esteira do Porto do Pecém (2026), a fiscalização exigiu treinamento de trabalho em altura (NR-35), linhas de vida e demarcação das áreas críticas de circulação ao redor da esteira.

**Solução:**
- Passarela (escada de transposição) com guarda-corpo sobre a esteira.
- Proteção inferior quando houver passagem por baixo.
- Proibir e sinalizar a circulação sobre a esteira (NR-12, capítulo 12.8).

**Como reduz o risco:** Cria um caminho seguro: ninguém mais precisa encostar na correia para atravessar.

**Automação:** Aqui a solução é de engenharia mecânica e civil: uma passarela com guarda-corpo. Não depende de sensor nem de CLP.

**Vídeos reais:**
- **Vídeo do problema:** [Trabalhador sobe na esteira em movimento](https://www.youtube.com/watch?v=DPVJpnSWCik)
- **Vídeo da solução:** [Escada de travessia sobre a esteira](https://www.youtube.com/watch?v=8ZsWS8txah8)

**Referências reais:**
- **Caso real:** [Porto do Pecém (CE): esteira interditada após morte de trabalhador](https://www.sinait.org.br/noticia/23040/ce-fiscalizacao-portuaria-interdita-esteira-transportadora-de-carvao-mineral-no-porto-do-pecem-depois-de-morte-de-trabalhador). SINAIT — Sindicato Nacional dos Auditores Fiscais do Trabalho (jan/2026). Um trabalhador terceirizado de 23 anos fazia manutenção com a esteira de carvão funcionando, foi puxado para dentro do equipamento e morreu no local. A fiscalização encontrou o dispositivo de parada de emergência inoperante, manutenção com a máquina ligada e partes móveis sem proteção, e interditou a esteira.

---

## 13. Ruído excessivo de motor e rolamentos

**Categoria:** Físico · **NR:** NR-15 / NR-6 · **Prioridade:** Baixa · **Automação:** ◐ Parcial

| | |
|---|---|
| **Onde** | Motor de acionamento e rolamentos da esteira inclinada. |
| **Quem fica exposto** | Todos os trabalhadores do setor. |
| **Consequência** | Perda auditiva induzida por ruído (PAIR), irreversível; estresse e fadiga. |
| **Perigo** | Rolamentos gastos e motor em alta rotação. |
| **Exposição** | Oito horas por dia ao lado da fonte. |
| **Risco** | Perda auditiva lenta, que só é percebida quando já é tarde. |

**O caso:** Pela NR-15 (Anexo I), o limite de tolerância é de 85 dB(A) para 8 horas diárias. A medição segue a NHO-01 da Fundacentro. A PAIR é gradual e irreversível: o trabalhador normalmente só percebe depois de anos.

**Solução:**
- Manutenção preditiva com sensor de vibração.
- Enclausuramento acústico do motor/redutor.
- Protetor auricular (NR-6) como medida complementar e audiometria periódica.

**Como reduz o risco:** Primeiro reduz o ruído na fonte; só depois protege o ouvido.

**Automação:** Sensor de vibração no rolamento → CLP compara com o limite (manutenção preditiva) → Alerta de troca + inversor reduz a velocidade. A automação ataca a fonte do ruído (rolamento gasto, velocidade). O protetor auricular é só uma medida complementar.

**Vídeos reais:**
- **Vídeo do problema:** [Perda auditiva induzida por ruído (PAIR)](https://www.youtube.com/watch?v=mni4A9s_wfg)
- **Vídeo da solução:** [Sensor sem fio de vibração em motores e rolamentos](https://www.youtube.com/watch?v=1KAVdPJDODQ)

**Referências reais:**
- **Referência técnica:** [NR-15, Anexo I: limites de tolerância para ruído](https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes). Ministério do Trabalho e Emprego. 85 dB(A) é o limite para 8 horas de exposição diária.

---

## 14. Extintor de incêndio bloqueado (problema escondido)

**Categoria:** Incêndio · **NR:** NR-23 / NR-26 · **Prioridade:** Alta · **Automação:** ✖ Não

| | |
|---|---|
| **Onde** | Ao lado do painel elétrico, escondido atrás de caixas. |
| **Quem fica exposto** | Todos: o extintor é a primeira resposta a um princípio de incêndio. |
| **Consequência** | Um princípio de incêndio no painel vira um incêndio de verdade. |
| **Perigo** | Painel elétrico (fonte de ignição) com o combate a incêndio inacessível. |
| **Exposição** | Em uma emergência, ninguém consegue pegar o extintor a tempo. |
| **Risco** | Perda de segundos decisivos no combate ao fogo. |

**O caso:** Caixas empilhadas na frente do extintor são uma das irregularidades mais comuns em inspeções. Os guias de prevenção pedem que o extintor nunca fique obstruído por móveis, caixas ou equipamentos e que tenha o piso demarcado.

**Solução:**
- Retirar as caixas e manter a área livre.
- Demarcar o piso: quadrado de 1 × 1 m, fundo vermelho e borda amarela.
- Topo do extintor a no máximo 1,60 m do piso, com placa de sinalização.
- Inspeção periódica (lacre, manômetro, validade).

**Como reduz o risco:** O extintor fica visível e alcançável em segundos.

**Automação:** Solução organizacional: desobstruir, demarcar o piso e inspecionar. Nenhum sensor resolve uma pilha de caixas na frente do extintor; o que resolve é organização (5S) e inspeção.

**Vídeos reais:**
- **Vídeo do problema:** [Extintores bloqueados e outras falhas encontradas em inspeção](https://www.youtube.com/watch?v=SZMjHAqb-LM)
- **Vídeo da solução:** [Como demarcar o piso de extintores](https://www.youtube.com/watch?v=5P3Volndqtg)

**Referências reais:**
- **Referência técnica:** [Lâmina de gerenciamento de riscos: proteja contra incêndios](https://sompo.com.br/documents/d/global/som05224_lamina-de-gerenciamento-de-riscos-property_proteja-contra-incendios_c-1). Sompo Seguros. Sinalização de solo sob extintores e hidrantes: quadrado de 1,00 × 1,00 m, fundo vermelho e borda amarela.
- **Referência técnica:** [Cartilha de Extintores de Incêndio](https://unilab.edu.br/wp-content/uploads/2026/07/Cartilha-Extintores-de-Incendio.pdf). Unilab. Extintor a no máximo 1,60 m do piso, área livre demarcada e nunca obstruído por móveis, caixas ou equipamentos.

