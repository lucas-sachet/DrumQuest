import { UserProfile, Module, Badge, Achievement, SkillNode, PracticeHistory } from "./types";

export const INITIAL_MODULES: Module[] = [
  {
    id: "mod-1",
    name: "Fundamentos do Ritmo",
    difficulty: "Iniciante",
    xpReward: 150,
    timeEstimate: "15 min",
    status: "completed",
    lessons: [
      {
        id: "les-1",
        title: "A Postura e a Pinça Correta",
        moduleId: "mod-1",
        moduleName: "Fundamentos do Ritmo",
        difficulty: "Iniciante",
        xpReward: 50,
        timeSeconds: 180,
        description: "A base de toda grande performance de bateria começa na forma como você se posiciona e segura as baquetas. Aprenda a pinça americana, o equilíbrio da baqueta (fulcrum) e evite lesões.",
        objective: "Segurar as baquetas usando a técnica de pinça americana com relaxamento e rebote natural.",
        whatYouLearn: [
          "Como encontrar o ponto de equilíbrio (fulcrum) da baqueta.",
          "Postura correta da coluna, ombros e braços no banco.",
          "Pinça de polegar e indicador e suporte dos outros dedos.",
          "O movimento de punho vs. movimento de dedos."
        ],
        exercises: [
          {
            id: "ex-1-1",
            title: "Encontrando o Fulcrum (Ponto de Equilíbrio)",
            description: "Segure a baqueta a 1/3 de distância da base. Bata no pad e deixe a baqueta ricochetear o máximo de vezes possível sem segurar.",
            bpmDefault: 60,
            rhythmPattern: "Bata e Deixe Ricochetear",
            durationSeconds: 60,
            drumPattern: [1, 0, 0, 0, 1, 0, 0, 0]
          },
          {
            id: "ex-1-2",
            title: "Pinça Americana de Baqueta",
            description: "Com o dorso das mãos virado em um ângulo de 45 graus, pratique golpes alternados simples focando no movimento de punho.",
            bpmDefault: 80,
            rhythmPattern: "D E D E D E D E (Alternado)",
            durationSeconds: 120,
            drumPattern: [1, 0, 1, 0, 1, 0, 1, 0]
          }
        ],
        commonMistakes: [
          "Segurar a baqueta muito na ponta ou muito na base, matando o rebote.",
          "Apertar as baquetas com muita força (causa fadiga e dores).",
          "Cotovelos excessivamente abertos ou colados no corpo."
        ],
        tips: [
          "Deixe a baqueta fazer 80% do trabalho de subida através do rebote natural.",
          "Pratique na frente de um espelho para verificar se os ombros estão relaxados e alinhados."
        ]
      },
      {
        id: "les-2",
        title: "Semínimas e Colcheias no Metrônomo",
        moduleId: "mod-1",
        moduleName: "Fundamentos do Ritmo",
        difficulty: "Iniciante",
        xpReward: 100,
        timeSeconds: 300,
        description: "Compreender o tempo e as subdivisões é vital. Praticaremos a transição limpa entre semínimas (uma nota por tempo) e colcheias (duas notas por tempo).",
        objective: "Transicionar de forma fluida entre semínimas e colcheias mantendo precisão rítmica perfeita.",
        whatYouLearn: [
          "O que é uma semínima e como contá-la (1, 2, 3, 4).",
          "O que é uma colcheia e como contar a subdivisão (1 e, 2 e, 3 e, 4 e).",
          "Manter a pulsação constante do metrônomo mesmo ao dobrar a velocidade das notas."
        ],
        exercises: [
          {
            id: "ex-2-1",
            title: "Semínimas Sólidas",
            description: "Toque notas simples alternadas junto com o clique do metrônomo. Mantenha os punhos relaxados.",
            bpmDefault: 70,
            rhythmPattern: "1   2   3   4 (D E D E)",
            durationSeconds: 120,
            drumPattern: [1, 0, 0, 0, 1, 0, 0, 0]
          },
          {
            id: "ex-2-2",
            title: "Subdivisão em Colcheias",
            description: "Toque duas notas por clique. Conte em voz alta: '1 e 2 e 3 e 4 e'.",
            bpmDefault: 70,
            rhythmPattern: "1 e 2 e 3 e 4 e (D E D E D E D E)",
            durationSeconds: 180,
            drumPattern: [1, 1, 1, 1, 1, 1, 1, 1]
          }
        ],
        commonMistakes: [
          "Acelerar as colcheias (ficar à frente do metrônomo).",
          "Tocar a colcheia do 'e' torta ou muito colada na próxima cabeça de tempo."
        ],
        tips: [
          "Marque o pulso principal com o calcanhar ou o dedão do pé para ancorar seu tempo.",
          "Fale 'e' em voz alta. Falar a subdivisão ajuda o cérebro a calcular o tempo."
        ]
      }
    ]
  },
  {
    id: "mod-2",
    name: "Dominando os Rudimentos",
    difficulty: "Iniciante",
    xpReward: 300,
    timeEstimate: "25 min",
    status: "available",
    lessons: [
      {
        id: "les-3",
        title: "O Toque Simples (Single Stroke)",
        moduleId: "mod-2",
        moduleName: "Dominando os Rudimentos",
        difficulty: "Iniciante",
        xpReward: 80,
        timeSeconds: 240,
        description: "O Toque Simples (D E D E) é o rudimento mais fundamental de todos. Embora pareça simples, alcançar velocidade, consistência e volume idêntico em ambas as mãos exige foco mental extremo.",
        objective: "Desenvolver consistência sonora e equilíbrio dinâmico entre a mão dominante e a não dominante.",
        whatYouLearn: [
          "O padrão rítmico do Toque Simples em semicolcheias.",
          "Igualar o volume e o timbre do golpe da mão esquerda ao da mão direita.",
          "O conceito de 'mão líder' e como inverter a liderança."
        ],
        exercises: [
          {
            id: "ex-3-1",
            title: "Toque Simples Alternado de Aquecimento",
            description: "Toque semicolcheias mantendo a altura das baquetas idêntica para som uniforme.",
            bpmDefault: 80,
            rhythmPattern: "D E D E D E D E D E D E D E D E",
            durationSeconds: 120,
            drumPattern: [1, 1, 1, 1, 1, 1, 1, 1]
          },
          {
            id: "ex-3-2",
            title: "Desafio de Velocidade Controlada",
            description: "Inicie confortável, aumente 10 BPM e tente sustentar o movimento com os dedos relaxados.",
            bpmDefault: 100,
            rhythmPattern: "D E D E D E D E D E D E D E D E",
            durationSeconds: 120,
            drumPattern: [1, 1, 1, 1, 1, 1, 1, 1]
          }
        ],
        commonMistakes: [
          "Mão esquerda mais fraca ou mais baixa, produzindo som desequilibrado.",
          "Tensionar os ombros à medida que o andamento aumenta."
        ],
        tips: [
          "Monitore visualmente a altura das pontas das baquetas: elas devem atingir a mesma altura no ar.",
          "Sussurre a contagem para manter o foco na pulsação subjacente."
        ]
      },
      {
        id: "les-4",
        title: "O Toque Duplo (Double Stroke)",
        moduleId: "mod-2",
        moduleName: "Dominando os Rudimentos",
        difficulty: "Iniciante",
        xpReward: 100,
        timeSeconds: 300,
        description: "Diferente do toque simples, o Toque Duplo (DD EE DD EE) utiliza o rebote físico para produzir um segundo golpe com um único movimento do punho. É a chave para velocidade extrema e dinâmicas avançadas.",
        objective: "Dominar o golpe duplo aproveitando o rebote livre e o fechamento controlado dos dedos.",
        whatYouLearn: [
          "O princípio físico do 'Golpe e Rebote' (Stroke and Bounce).",
          "Técnica de empurrar com os dedos traseiros para fortalecer o segundo toque.",
          "Evitar o 'toque arrastado' e manter os dois golpes com o mesmo volume."
        ],
        exercises: [
          {
            id: "ex-4-1",
            title: "Diddle Lento Alternado",
            description: "Toque dois golpes lentos com a direita, depois dois com a esquerda. Force o segundo toque a soar tão alto quanto o primeiro.",
            bpmDefault: 60,
            rhythmPattern: "D D E E D D E E D D E E D D E E",
            durationSeconds: 120,
            drumPattern: [1, 0, 1, 0, 1, 0, 1, 0]
          },
          {
            id: "ex-4-2",
            title: "Double Stroke Roll Fluido",
            description: "Transicione do movimento do punho para o rebote auxiliado pelos dedos à medida que o andamento acelera.",
            bpmDefault: 90,
            rhythmPattern: "D D E E D D E E D D E E D D E E",
            durationSeconds: 180,
            drumPattern: [1, 1, 1, 1, 1, 1, 1, 1]
          }
        ],
        commonMistakes: [
          "O segundo toque sai abafado ou fraco ('D-d E-e').",
          "A baqueta desliza nos dedos e perde o controle da direção."
        ],
        tips: [
          "Pense em 'jogar e pegar'. Jogue o primeiro golpe e aperte levemente os dedos médio e anelar para empurrar o segundo golpe.",
          "Treine em uma almofada de sofá (sem rebote natural) para desenvolver os músculos dos dedos!"
        ]
      },
      {
        id: "les-5",
        title: "O Paradiddle Essencial",
        moduleId: "mod-2",
        moduleName: "Dominando os Rudimentos",
        difficulty: "Iniciante",
        xpReward: 120,
        timeSeconds: 360,
        description: "O Paradiddle mistura toques simples e duplos (D E D D - E D E E). Ele é o canivete suíço dos bateristas, permitindo mover-se ao redor do kit de bateria sem cruzar os braços ou ficar preso a uma mão.",
        objective: "Tocar o padrão do Paradiddle clássico mantendo acento no primeiro toque de cada grupo.",
        whatYouLearn: [
          "A mecânica rítmica do Paradiddle Simples.",
          "Como o paradiddle inverte a mão que lidera o tempo automaticamente.",
          "Aplicação de acentos (golpe forte) no início de cada frase (D e d d E d e e)."
        ],
        exercises: [
          {
            id: "ex-5-1",
            title: "Padrão Linear do Paradiddle",
            description: "Toque todas as notas com dinâmicas idênticas no pad de estudo de forma lenta e rigorosa.",
            bpmDefault: 80,
            rhythmPattern: "D E D D E D E E D E D D E D E E",
            durationSeconds: 180,
            drumPattern: [1, 1, 1, 1, 1, 1, 1, 1]
          },
          {
            id: "ex-5-2",
            title: "Paradiddle Acentuado (Groove Feel)",
            description: "Toque as notas em MAIÚSCULO fortes (acentos) e as minúsculas extremamente suaves (notas fantasma).",
            bpmDefault: 90,
            rhythmPattern: "D e d d E d e e D e d d E d e e",
            durationSeconds: 180,
            drumPattern: [1, 1, 1, 1, 1, 1, 1, 1]
          }
        ],
        commonMistakes: [
          "Tocar os toques duplos mais rápidos que os simples, destruindo a grade do compasso.",
          "Esquecer a inversão de mãos no meio do padrão."
        ],
        tips: [
          "O primeiro golpe de cada grupo (D e E) deve vir de uma altura de braço maior, enquanto os outros golpes vêm de apenas 5 cm do pad.",
          "Cante mentalmente o andamento: 'Pa-ra-di-dle Pa-ra-di-dle'."
        ]
      }
    ]
  },
  {
    id: "mod-3",
    name: "Grooves e Coordenação",
    difficulty: "Intermediário",
    xpReward: 500,
    timeEstimate: "45 min",
    status: "locked",
    lessons: [
      {
        id: "les-6",
        title: "O Groove de Rock 8 Beats Clássico",
        moduleId: "mod-3",
        moduleName: "Grooves e Coordenação",
        difficulty: "Intermediário",
        xpReward: 150,
        timeSeconds: 400,
        description: "Este é o ritmo que move o mundo. Praticamente 70% de todas as músicas pop/rock utilizam variações deste groove. Vamos coordenar Chimbal constante, Caixa no tempo 2 e 4, e Bumbo variando.",
        objective: "Tocar o groove de rock clássico sem flutuações e com o chimbal relaxado.",
        whatYouLearn: [
          "Coordenação em 3 membros independentes.",
          "Manter o chimbal constante em colcheias enquanto bumbo e caixa se intercalam.",
          "Evitar que o chimbal 'siga' os golpes do bumbo ou caixa acidentalmente."
        ],
        exercises: [
          {
            id: "ex-6-1",
            title: "Coordenação Bumbo & Chimbal",
            description: "Mantenha o chimbal contínuo e adicione o bumbo estrito nos tempos 1 e 3.",
            bpmDefault: 80,
            rhythmPattern: "CH+BU  CH  CH+BU  CH  CH+BU  CH",
            durationSeconds: 200,
            drumPattern: [1, 0, 1, 0, 1, 0, 1, 0]
          }
        ],
        commonMistakes: [
          "Bumbo atrasando em relação ao chimbal.",
          "Chimbal falhando ou parando de soar quando a caixa é golpeada."
        ],
        tips: [
          "Treine apenas Chimbal e Caixa primeiro, depois adicione o bumbo aos poucos.",
          "Mantenha o calcanhar do pedal de bumbo levemente elevado para melhor controle físico."
        ]
      }
    ]
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: "bdg-1",
    name: "Pioneiro do Ritmo",
    description: "Iniciou sua jornada épica de evolução no DrumQuest.",
    icon: "Award",
    unlockedAt: "2026-07-06",
    rarity: "Comum"
  },
  {
    id: "bdg-2",
    name: "Pulso de Ferro",
    description: "Alcançou um streak de 7 dias consecutivos de prática diária.",
    icon: "Flame",
    unlockedAt: "2026-07-12",
    rarity: "Raro"
  },
  {
    id: "bdg-3",
    name: "Lorde do Paradiddle",
    description: "Dominou a aula de Paradiddles e alcançou 120 BPM no teste.",
    icon: "ShieldAlert",
    rarity: "Épico"
  },
  {
    id: "bdg-4",
    name: "Metrônomo Humano",
    description: "Manteve consistência rítmica de 98% por mais de 5 minutos seguidos.",
    icon: "Timer",
    rarity: "Épico"
  },
  {
    id: "bdg-5",
    name: "Batera Lendário",
    description: "Desbloqueou todos os nós da Árvore de Habilidades no nível máximo.",
    icon: "Crown",
    rarity: "Lendário"
  },
  {
    id: "bdg-6",
    name: "Hardware Conectado",
    description: "Conectou uma bateria eletrônica via Web MIDI pela primeira vez.",
    icon: "Cpu",
    rarity: "Raro"
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach-1",
    name: "Mestre dos Fundamentos",
    description: "Complete todas as lições do módulo Fundamentos do Ritmo.",
    progress: 2,
    maxProgress: 2,
    isUnlocked: true,
    xpReward: 200,
    icon: "CheckCircle2"
  },
  {
    id: "ach-2",
    name: "Maratonista de Baquetas",
    description: "Acumule 10 horas totais de prática ativa no aplicativo.",
    progress: 8.2,
    maxProgress: 10,
    isUnlocked: false,
    xpReward: 350,
    icon: "Clock"
  },
  {
    id: "ach-3",
    name: "Velocidade de Cruzeiro",
    description: "Sustente um groove rítmico a mais de 110 BPM na sessão de treino.",
    progress: 100,
    maxProgress: 110,
    isUnlocked: false,
    xpReward: 150,
    icon: "Zap"
  },
  {
    id: "ach-4",
    name: "Consistência Absoluta",
    description: "Obtenha nota S em 3 treinos consecutivos.",
    progress: 2,
    maxProgress: 3,
    isUnlocked: false,
    xpReward: 250,
    icon: "TrendingUp"
  },
  {
    id: "ach-5",
    name: "Explorador de Habilidades",
    description: "Gaste 800 XP para desbloquear/evoluir nós da Árvore de Habilidades.",
    progress: 450,
    maxProgress: 800,
    isUnlocked: false,
    xpReward: 300,
    icon: "GitBranch"
  }
];

export const INITIAL_SKILLS: SkillNode[] = [
  // TEMPO
  {
    id: "sk-tempo-1",
    name: "Metrônomo Interno",
    category: "Tempo",
    level: 2,
    maxLevel: 5,
    description: "Habilidade de manter o andamento estável sem suporte visual ou auditivo constante.",
    dependencies: [],
    isUnlocked: true,
    xpCost: 80
  },
  {
    id: "sk-tempo-2",
    name: "Subdivisão Dinâmica",
    category: "Tempo",
    level: 0,
    maxLevel: 5,
    description: "Transições perfeitas entre Semínimas, Colcheias, Tercinas e Semicolcheias.",
    dependencies: ["sk-tempo-1"],
    isUnlocked: false,
    xpCost: 150
  },
  
  // COORDENAÇÃO
  {
    id: "sk-coord-1",
    name: "Mão-Pé Sincronizada",
    category: "Coordenação",
    level: 3,
    maxLevel: 5,
    description: "Sincronia física exata entre os golpes de caixa (mão) e pedal de bumbo (pé).",
    dependencies: [],
    isUnlocked: true,
    xpCost: 90
  },
  {
    id: "sk-coord-2",
    name: "Cruzamento Linear",
    category: "Coordenação",
    level: 0,
    maxLevel: 5,
    description: "Distribuição de notas lineares entre pratos e tambores sem golpes simultâneos.",
    dependencies: ["sk-coord-1"],
    isUnlocked: false,
    xpCost: 180
  },

  // RUDIMENTOS
  {
    id: "sk-rud-1",
    name: "Toque Simples (RLRL)",
    category: "Rudimentos",
    level: 4,
    maxLevel: 5,
    description: "Igualdade rítmica e de volume entre batidas alternadas de direita e esquerda.",
    dependencies: [],
    isUnlocked: true,
    xpCost: 70
  },
  {
    id: "sk-rud-2",
    name: "Toque Duplo (RRLL)",
    category: "Rudimentos",
    level: 2,
    maxLevel: 5,
    description: "Uso correto do rebote para produzir golpes duplos precisos e rápidos.",
    dependencies: ["sk-rud-1"],
    isUnlocked: true,
    xpCost: 120
  },
  {
    id: "sk-rud-3",
    name: "Paradiddles (RLRR LRLL)",
    category: "Rudimentos",
    level: 1,
    maxLevel: 5,
    description: "Fluidez na combinação de toques simples e duplos, permitindo inversões de mão.",
    dependencies: ["sk-rud-2"],
    isUnlocked: true,
    xpCost: 150
  },

  // GROOVES
  {
    id: "sk-grv-1",
    name: "Backbeat Rock Clássico",
    category: "Grooves",
    level: 3,
    maxLevel: 5,
    description: "Pulsação sólida em 8-bits com caixa estrita nos tempos 2 e 4.",
    dependencies: [],
    isUnlocked: true,
    xpCost: 80
  },
  {
    id: "sk-grv-2",
    name: "Sincopação Funk 16-bits",
    category: "Grooves",
    level: 0,
    maxLevel: 5,
    description: "Grooves complexos com notas fantasmas na caixa e bumbos fora do tempo.",
    dependencies: ["sk-grv-1"],
    isUnlocked: false,
    xpCost: 200
  },

  // INDEPENDÊNCIA
  {
    id: "sk-ind-1",
    name: "Chimbal de Pé Independente",
    category: "Independência",
    level: 1,
    maxLevel: 5,
    description: "Marcar semínimas com o pedal esquerdo enquanto toca outros ritmos com as mãos.",
    dependencies: [],
    isUnlocked: true,
    xpCost: 160
  },

  // DINÂMICA
  {
    id: "sk-dyn-1",
    name: "Acentuações e Ghost Notes",
    category: "Dinâmica",
    level: 2,
    maxLevel: 5,
    description: "Diferença extrema de volume entre notas acentuadas e notas fantasma sussurradas.",
    dependencies: [],
    isUnlocked: true,
    xpCost: 100
  },

  // LEITURA
  {
    id: "sk-read-1",
    name: "Leitura de Partituras",
    category: "Leitura",
    level: 2,
    maxLevel: 5,
    description: "Compreensão rápida da notação de bateria tradicional (linhas e posições).",
    dependencies: [],
    isUnlocked: true,
    xpCost: 100
  },

  // TÉCNICA
  {
    id: "sk-tec-1",
    name: "Técnica Möller",
    category: "Técnica",
    level: 0,
    maxLevel: 5,
    description: "Utilização do movimento chicoteado do braço para golpes acentuados múltiplos sem esforço.",
    dependencies: [],
    isUnlocked: true,
    xpCost: 250
  }
];

export const INITIAL_HISTORY: PracticeHistory[] = [
  { date: "Seg", minutes: 25, bpm: 85, accuracy: 92, completedCount: 2 },
  { date: "Ter", minutes: 30, bpm: 90, accuracy: 94, completedCount: 3 },
  { date: "Qua", minutes: 15, bpm: 90, accuracy: 89, completedCount: 1 },
  { date: "Qui", minutes: 40, bpm: 95, accuracy: 95, completedCount: 4 },
  { date: "Sex", minutes: 20, bpm: 100, accuracy: 91, completedCount: 2 },
  { date: "Sáb", minutes: 45, bpm: 105, accuracy: 96, completedCount: 5 },
  { date: "Dom", minutes: 10, bpm: 105, accuracy: 93, completedCount: 1 }
];

export const INITIAL_PROFILE: UserProfile = {
  name: "Lucas Achet",
  title: "Aventureiro das Baquetas",
  level: 8,
  xp: 420,
  xpNextLevel: 1000,
  streakDays: 6,
  totalPracticeHours: 8.2,
  totalExercisesCompleted: 18,
  lastPracticeDate: "2026-07-12",
  badges: INITIAL_BADGES,
  achievements: INITIAL_ACHIEVEMENTS,
  skills: INITIAL_SKILLS,
  history: INITIAL_HISTORY,
  modules: INITIAL_MODULES
};
