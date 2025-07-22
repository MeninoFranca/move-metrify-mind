export type ObjetivoNutricional = 'perda_peso' | 'ganho_massa' | 'manutencao' | 'saude';

export type NivelAtividade = 'sedentario' | 'leve' | 'moderado' | 'muito_ativo' | 'extremamente_ativo';

export interface PreferenciasNutricionais {
  peso: number;
  altura: number;
  idade: number;
  genero: 'masculino' | 'feminino';
  objetivo: ObjetivoNutricional;
  nivelAtividade: NivelAtividade;
  numeroRefeicoes: number;
  restricoes: string[];
  preferencias: string[];
}

export interface Macronutrientes {
  proteinas: number;
  carboidratos: number;
  gorduras: number;
}

export interface Alimento {
  id: string;
  nome: string;
  porcao: number;
  unidade: string;
  calorias: number;
  macros: Macronutrientes;
  categoria: string;
}

export interface Refeicao {
  id: string;
  nome: string;
  horario: string;
  alimentos: {
    alimento: Alimento;
    quantidade: number;
  }[];
  calorias: number;
  macros: Macronutrientes;
  foto?: string;
}

export interface PlanoAlimentar {
  id: string;
  userId: string;
  data: Date;
  objetivo: ObjetivoNutricional;
  caloriasAlvo: number;
  macrosAlvo: Macronutrientes;
  refeicoes: Refeicao[];
}

export interface RegistroAlimentar {
  id: string;
  userId: string;
  data: Date;
  refeicao: Refeicao;
}

export interface ListaCompras {
  id: string;
  userId: string;
  dataGeracao: Date;
  itens: {
    alimento: Alimento;
    quantidade: number;
    comprado: boolean;
  }[];
}

export interface TrackingNutricional {
  id: string;
  userId: string;
  data: Date;
  registros: RegistroAlimentar[];
  caloriasTotal: number;
  macrosTotal: Macronutrientes;
  agua: number;
  meta: {
    calorias: number;
    macros: Macronutrientes;
    agua: number;
  };
} 