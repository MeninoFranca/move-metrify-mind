export type TipoLembrete = 
  | "hidratacao"
  | "treino"
  | "refeicao"
  | "suplemento"
  | "sono";

export type FrequenciaLembrete =
  | "diaria"
  | "semanal"
  | "personalizada";

export interface HorarioLembrete {
  hora: number;
  minuto: number;
  diasSemana?: number[]; // 0-6, onde 0 é domingo
}

export interface Lembrete {
  id: string;
  tipo: TipoLembrete;
  titulo: string;
  descricao?: string;
  frequencia: FrequenciaLembrete;
  horarios: HorarioLembrete[];
  ativo: boolean;
  ultimaNotificacao?: Date;
  proximaNotificacao?: Date;
  userId: string;
}

export interface ConfiguracoesLembrete {
  hidratacao: {
    intervalo: number; // minutos entre lembretes
    periodoInicio: string; // HH:mm
    periodoFim: string; // HH:mm
    diasSemana: number[]; // 0-6
    meta: number; // ml por dia
  };
  treino: {
    antecedencia: number; // minutos antes do treino
    lembreteRecorrente: boolean;
  };
  refeicao: {
    antecedencia: number; // minutos antes da refeição
    lembretePreparacao: boolean;
  };
} 