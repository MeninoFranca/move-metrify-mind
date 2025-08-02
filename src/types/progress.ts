export interface Medidas {
  peso: number;
  altura: number;
  pescoco?: number;
  ombros?: number;
  torax?: number;
  bicepsEsquerdo?: number;
  bicepsDireito?: number;
  antebracoEsquerdo?: number;
  antebracoDireito?: number;
  cintura?: number;
  quadril?: number;
  coxaEsquerda?: number;
  coxaDireita?: number;
  panturrilhaEsquerda?: number;
  panturrilhaDireita?: number;
}

export interface FotoProgresso {
  id: string;
  userId: string;
  data: Date;
  url: string;
  tipo: "frente" | "costas" | "perfil";
  observacoes?: string;
}

export interface RegistroProgresso {
  id: string;
  userId: string;
  data: Date;
  medidas: Medidas;
  fotos?: FotoProgresso[];
  peso: number;
  observacoes?: string;
  humor: "otimo" | "bom" | "regular" | "ruim";
  energia: "alta" | "media" | "baixa";
  sono: number; // horas
  hidratacao: number; // ml
}

export interface MetaProgresso {
  id: string;
  userId: string;
  tipo: "peso" | "medida" | "treino" | "nutricao";
  descricao: string;
  valorInicial: number;
  valorAlvo: number;
  valorAtual: number;
  unidade: string;
  dataInicio: Date;
  dataAlvo: Date;
  concluida: boolean;
  progresso: number; // 0-100
}

export interface EstatisticasProgresso {
  tempo_medio_treino: number;
  calorias_queimadas_semana: number;
  treinos_semana: number;
  mediaPeso: number;
  variacaoPeso: number;
  diasTreinados: number;
  metasConcluidas: number;
  metasEmAndamento: number;
  diasConsecutivos: number;
  melhorSequencia: number;
} 