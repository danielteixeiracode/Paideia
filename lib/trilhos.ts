export type FaseTrilho = "ordem" | "crise" | "restauracao";

export type StatusEtapaTrilho = "nao_iniciado" | "em_andamento" | "concluido";

export interface EtapaTrilho {
  id: string;
  /** Ordem de leitura dentro do trilho. */
  ordem: number;
  /** Numeração de leitura como aparece no cânone (ex.: "1–2"). */
  rotulo: string;
  /** Autor e obra. */
  titulo: string;
  fase: FaseTrilho;
  funcaoPedagogica: string;
}

export interface Trilho {
  id: string;
  algarismo: string;
  nome: string;
  subtitulo: string;
  descricao: string;
  etapas: EtapaTrilho[];
}

export const FASES: { id: FaseTrilho; nome: string; resumo: string }[] = [
  { id: "ordem", nome: "Ordem", resumo: "O mundo como cosmos com significado." },
  { id: "crise", nome: "Crise", resumo: "A ruptura dessa ordem." },
  {
    id: "restauracao",
    nome: "Restauração",
    resumo: "A reconquista do sentido, já tendo incorporado a crise.",
  },
];

export const TRILHOS: Trilho[] = [
  {
    id: "literario",
    algarismo: "I",
    nome: "Literário",
    subtitulo: "Do mito fundador à graça recuperada",
    descricao:
      "Desce da integridade heroica de Homero até a dúvida absoluta de Machado e Pessoa — e sobe de novo no sertão brasileiro.",
    etapas: [
      {
        id: "lit-homero",
        ordem: 1,
        rotulo: "1–2",
        titulo: "Homero — Ilíada e Odisseia",
        fase: "ordem",
        funcaoPedagogica:
          "As duas obras homéricas fundam o vocabulário heroico de toda a literatura ocidental subsequente. O herói é aquele cuja identidade é inteira.",
      },
      {
        id: "lit-virgilio",
        ordem: 2,
        rotulo: "3",
        titulo: "Virgílio — Eneida",
        fase: "ordem",
        funcaoPedagogica:
          "Coloca a forma homérica a serviço de um projeto histórico: a fundação de Roma. Introduz a pietas como virtude organizadora.",
      },
      {
        id: "lit-dante",
        ordem: 3,
        rotulo: "4",
        titulo: "Dante — Divina Comédia",
        fase: "ordem",
        funcaoPedagogica:
          "Sintetiza a épica clássica, a cosmologia bíblica e a teologia escolástica numa única arquitetura. Ápice e fechamento do mundo medieval.",
      },
      {
        id: "lit-camoes",
        ordem: 4,
        rotulo: "5",
        titulo: "Camões — Os Lusíadas",
        fase: "ordem",
        funcaoPedagogica:
          "Devolve a forma épica clássica para narrar a expansão marítima portuguesa. Último grande épico “puro” antes do romance.",
      },
      {
        id: "lit-cervantes",
        ordem: 5,
        rotulo: "6",
        titulo: "Cervantes — Dom Quixote",
        fase: "crise",
        funcaoPedagogica:
          "Inaugura o romance moderno: um herói enlouquecido pela própria tradição épica. Primeira obra que questiona se o modelo heroico ainda é habitável.",
      },
      {
        id: "lit-shakespeare",
        ordem: 6,
        rotulo: "7",
        titulo: "Shakespeare (Hamlet / Macbeth ou Rei Lear)",
        fase: "crise",
        funcaoPedagogica:
          "Radicaliza a dúvida no plano da consciência individual. Nasce o sujeito moderno fragmentado.",
      },
      {
        id: "lit-pessoa",
        ordem: 7,
        rotulo: "8",
        titulo: "Fernando Pessoa",
        fase: "crise",
        funcaoPedagogica:
          "Leva a fragmentação ao limite: não um homem em dúvida, mas multiplicado em heterônimos. Ponto de dobradiça — em Mensagem reabre a porta do mito.",
      },
      {
        id: "lit-machado",
        ordem: 8,
        rotulo: "9",
        titulo: "Machado de Assis (Dom Casmurro / Memórias Póstumas)",
        fase: "crise",
        funcaoPedagogica:
          "Ápice do ceticismo: narradores que talvez mintam para si mesmos. Ponto de maior distância do herói homérico íntegro.",
      },
      {
        id: "lit-sertao",
        ordem: 9,
        rotulo: "10",
        titulo: "Euclides da Cunha, Graciliano Ramos, Guimarães Rosa, Ariano Suassuna",
        fase: "restauracao",
        funcaoPedagogica:
          "A virada luminosa do trilho literário: fé messiânica (Os Sertões), estoicismo mudo (Vidas Secas), reafirmação metafísica (Grande Sertão: Veredas — “Deus existe devagar”), comédia católica popular (Auto da Compadecida).",
      },
    ],
  },
  {
    id: "filosofico-teologico",
    algarismo: "II",
    nome: "Filosófico-Teológico",
    subtitulo: "Da razão grega ao Verbo em missão",
    descricao:
      "Nunca desce à crise: caminha direto da razão grega à revelação cristã, terminando em missão histórica concreta.",
    etapas: [
      {
        id: "filo-platao",
        ordem: 1,
        rotulo: "1",
        titulo: "Platão — A República, Apologia de Sócrates, O Banquete",
        fase: "ordem",
        funcaoPedagogica:
          "Funda a filosofia política, a ética do exame de si e a teoria do amor como via de ascensão ao Bem.",
      },
      {
        id: "filo-aristoteles",
        ordem: 2,
        rotulo: "2",
        titulo: "Aristóteles e Porfírio",
        fase: "ordem",
        funcaoPedagogica:
          "Fornece o instrumental lógico e metafísico que a escolástica herdará. Porfírio formula o problema dos universais.",
      },
      {
        id: "filo-plutarco",
        ordem: 3,
        rotulo: "3",
        titulo: "Plutarco — Vidas Paralelas",
        fase: "ordem",
        funcaoPedagogica:
          "Ensina através do exemplo biográfico comparado — a ética como modelo encarnado.",
      },
      {
        id: "filo-tucidides",
        ordem: 4,
        rotulo: "4",
        titulo: "Tucídides — História da Guerra do Peloponeso",
        fase: "ordem",
        funcaoPedagogica:
          "Funda a historiografia crítica, distinta da história mítica ou moralizante.",
      },
      {
        id: "filo-estoicos",
        ordem: 5,
        rotulo: "5",
        titulo: "Sêneca e Marco Aurélio",
        fase: "ordem",
        funcaoPedagogica:
          "O estoicismo romano como ponte ética entre o paganismo filosófico e a moral cristã.",
      },
      {
        id: "filo-agostinho",
        ordem: 6,
        rotulo: "6",
        titulo: "Agostinho — Confissões",
        fase: "ordem",
        funcaoPedagogica:
          "Vira a jornada épica para dentro: a peregrinação é interior. Inaugura a introspecção ocidental.",
      },
      {
        id: "filo-boecio",
        ordem: 7,
        rotulo: "7",
        titulo: "Boécio e Alcuíno",
        fase: "ordem",
        funcaoPedagogica:
          "Boécio consola pela razão e Providência na prisão. Alcuíno preserva e transmite os textos clássicos na corte carolíngia.",
      },
      {
        id: "filo-tomas",
        ordem: 8,
        rotulo: "8",
        titulo: "Tomás de Aquino — Suma Teológica",
        fase: "ordem",
        funcaoPedagogica:
          "Síntese máxima entre razão aristotélica e fé cristã. As três operações do intelecto.",
      },
      {
        id: "filo-humanistas",
        ordem: 9,
        rotulo: "9",
        titulo: "Erasmo, Petrarca e Montaigne",
        fase: "ordem",
        funcaoPedagogica:
          "Humanismo cristão renascentista: dúvida controlada que não rompe com a fé.",
      },
      {
        id: "filo-vieira-anchieta",
        ordem: 10,
        rotulo: "10",
        titulo: "Antônio Vieira e José de Anchieta",
        fase: "restauracao",
        funcaoPedagogica:
          "O trilho termina em missão viva: a palavra como instrumento de ação histórica. Fundam a presença da fé e da língua portuguesa no Brasil.",
      },
    ],
  },
  {
    id: "modernidade",
    algarismo: "III",
    nome: "Modernidade e Pensamento Político",
    subtitulo: "Da ruptura ao sentido reencontrado",
    descricao:
      "O único que toca o fundo histórico real do niilismo — e é justamente nesse fundo mais escuro que a resposta mais luminosa aparece.",
    etapas: [
      {
        id: "mod-maquiavel-hobbes",
        ordem: 1,
        rotulo: "1",
        titulo: "Maquiavel e Hobbes",
        fase: "ordem",
        funcaoPedagogica:
          "Rompem a subordinação da política à teologia. Fundam o Estado moderno sobre o realismo e o contratualismo.",
      },
      {
        id: "mod-locke-pascal",
        ordem: 2,
        rotulo: "2",
        titulo: "Locke e Pascal",
        fase: "ordem",
        funcaoPedagogica:
          "Locke funda o liberalismo político. Pascal mede os limites da própria razão diante do infinito.",
      },
      {
        id: "mod-rousseau-marx",
        ordem: 3,
        rotulo: "3",
        titulo: "Rousseau e Marx",
        fase: "ordem",
        funcaoPedagogica: "O polo utópico-revolucionário da modernidade política.",
      },
      {
        id: "mod-descartes-bacon",
        ordem: 4,
        rotulo: "4",
        titulo: "Descartes e Bacon",
        fase: "ordem",
        funcaoPedagogica:
          "Fundam o racionalismo e o empirismo modernos — as duas vias que substituirão a síntese escolástica.",
      },
      {
        id: "mod-kant-nietzsche",
        ordem: 5,
        rotulo: "5",
        titulo: "Kant e Nietzsche",
        fase: "crise",
        funcaoPedagogica:
          "Kant tenta salvar a moral e a metafísica. Nietzsche declara a “morte de Deus” — a razão moderna se volta contra si mesma.",
      },
      {
        id: "mod-foucault",
        ordem: 6,
        rotulo: "6",
        titulo: "Foucault",
        fase: "crise",
        funcaoPedagogica:
          "Leva a crítica nietzschiana às instituições. Ponto mais extremo do relativismo institucional e epistemológico.",
      },
      {
        id: "mod-comte-smith",
        ordem: 7,
        rotulo: "7",
        titulo: "Comte e Adam Smith",
        fase: "crise",
        funcaoPedagogica:
          "Primeira tentativa de reorganizar a vida coletiva sobre bases racionais, ainda dentro do otimismo iluminista.",
      },
      {
        id: "mod-mises-hayek",
        ordem: 8,
        rotulo: "8",
        titulo: "Mises e Hayek",
        fase: "crise",
        funcaoPedagogica:
          "Crítica ao planejamento central; reafirmação da limitação do conhecimento humano.",
      },
      {
        id: "mod-burke-kirk",
        ordem: 9,
        rotulo: "9",
        titulo: "Burke e Kirk",
        fase: "crise",
        funcaoPedagogica:
          "Fundam o pensamento conservador moderno: defesa da tradição e da prudência contra a razão abstrata revolucionária.",
      },
      {
        id: "mod-frankl-frank",
        ordem: 10,
        rotulo: "10",
        titulo: "Viktor Frankl e Anne Frank",
        fase: "restauracao",
        funcaoPedagogica:
          "O ponto mais decisivo do currículo. Frankl, depois de Auschwitz, funda a logoterapia: o sentido sobrevive ao sofrimento extremo. Anne Frank, em pleno extermínio, ainda acredita na bondade humana.",
      },
      {
        id: "mod-mario-ferreira",
        ordem: 11,
        rotulo: "11",
        titulo: "Mário Ferreira dos Santos",
        fase: "restauracao",
        funcaoPedagogica:
          "Fecha o trilho recuperando a philosophia perennis, articulando lógica, dialética e metafísica clássicas.",
      },
    ],
  },
];

export const SINTESE = {
  titulo: "A Espiral Tripla",
  paragrafos: [
    "Lidos em conjunto, os três trilhos revelam-se como três movimentos de uma única espiral. O Trilho Literário desce da integridade heroica de Homero até a dúvida absoluta de Machado e Pessoa — e sobe de novo no sertão brasileiro. O Trilho Filosófico-Teológico nunca desce à crise: caminha direto da razão grega à revelação cristã, terminando em missão histórica concreta. O Trilho da Modernidade é o único que toca o fundo histórico real do niilismo — e é justamente nesse fundo mais escuro que a resposta mais luminosa aparece: Frankl e Anne Frank atravessam o abismo, não o contornam.",
    "Um currículo clássico verdadeiramente fiel à tradição não ensina a evitar a crise — ensina a atravessá-la. Esse é o sentido último da espiral tripla: a crise vivida até o fundo, em suas três dimensões — narrativa, metafísica e histórico-política — é o único caminho verdadeiro até a restauração do sagrado e do universal.",
  ],
};

export const TOTAL_ETAPAS = TRILHOS.reduce((soma, t) => soma + t.etapas.length, 0);
