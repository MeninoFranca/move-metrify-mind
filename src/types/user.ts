export interface Usuario {
  id: string;
  nome: string;
  email: string;
  foto?: string;
  dataNascimento: Date;
  genero: "masculino" | "feminino" | "outro";
  altura: number;
  peso: number;
  nivelAtividade: "sedentario" | "moderado" | "ativo" | "muito_ativo";
  objetivo: "perda_peso" | "ganho_massa" | "manutencao" | "definicao";
  restricoesAlimentares: string[];
  preferenciasAlimentares: string[];
  experienciaTreino: "iniciante" | "intermediario" | "avancado";
  diasTreino: number[];
  equipamentosDisponiveis: string[];
  notificacoesAtivas: boolean;
  tema: "claro" | "escuro" | "sistema";
  idioma: "pt-BR";
  unidadeMedida: "metrico" | "imperial";
  ultimoLogin: Date;
}

export interface ConfiguracoesUsuario {
  notificacoes: {
    email: boolean;
    push: boolean;
    lembretes: boolean;
    atualizacoes: boolean;
    marketing: boolean;
  };
  privacidade: {
    perfilPublico: boolean;
    compartilharProgresso: boolean;
    mostrarEstatisticas: boolean;
    permitirMencoes: boolean;
  };
  preferencias: {
    tema: "claro" | "escuro" | "sistema";
    unidadeMedida: "metrico" | "imperial";
    formatoData: "dd/MM/yyyy" | "MM/dd/yyyy";
    formatoHora: "12h" | "24h";
    idioma: "pt-BR";
  };
  backup: {
    automatico: boolean;
    frequencia: "diario" | "semanal" | "mensal";
    ultimoBackup?: Date;
  };
}

export interface AtualizacaoUsuario {
  campo: keyof Usuario;
  valorAntigo: any;
  valorNovo: any;
  data: Date;
} 