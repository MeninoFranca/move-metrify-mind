export type TipoEvento = 
  | "treino"
  | "refeicao"
  | "medida"
  | "meta"
  | "descanso";

export interface EventoCalendario {
  id: string;
  userId: string;
  tipo: TipoEvento;
  titulo: string;
  descricao?: string;
  dataInicio: Date;
  dataFim: Date;
  recorrente: boolean;
  diasRecorrencia?: number[]; // 0-6 para dias da semana
  cor: string;
  concluido: boolean;
  treinoId?: string; // Referência ao treino se tipo === "treino"
  refeicaoId?: string; // Referência à refeição se tipo === "refeicao"
  metaId?: string; // Referência à meta se tipo === "meta"
}

export interface ConfiguracoesCalendario {
  visualizacao: "mes" | "semana" | "dia";
  mostrarConcluidos: boolean;
  filtroTipos: TipoEvento[];
  horaInicio: string; // HH:mm
  horaFim: string; // HH:mm
}

export interface EstatisticasCalendario {
  eventosPlanejados: number;
  eventosConcluidos: number;
  treinosSemanais: number;
  diasConsecutivos: number;
  proximoEvento?: EventoCalendario;
} 