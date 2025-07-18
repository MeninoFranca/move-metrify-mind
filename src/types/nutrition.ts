export type MacroNutrients = {
  proteinas: number;
  carboidratos: number;
  gorduras: number;
};

export type ObjetivoNutricional = 
  | "perda_peso"
  | "ganho_massa"
  | "manutencao"
  | "definicao";

export interface Alimento {
  id: string;
  nome: string;
  porcao: number; // em gramas
  calorias: number;
  macros: MacroNutrients;
  categoria: string;
}

export interface Refeicao {
  id: string;
  nome: string;
  horario: string;
  alimentos: Array<{
    alimento: Alimento;
    quantidade: number; // em gramas
  }>;
}

export interface PlanoAlimentar {
  id: string;
  userId: string;
  objetivo: ObjetivoNutricional;
  caloriasAlvo: number;
  macrosAlvo: MacroNutrients;
  refeicoes: Refeicao[];
  dataCriacao: Date;
}

export interface PreferenciasNutricionais {
  restricoes: string[];
  preferencias: string[];
  numeroRefeicoes: number;
  objetivo: ObjetivoNutricional;
  peso: number;
  altura: number;
  idade: number;
  nivelAtividade: "sedentario" | "moderado" | "ativo" | "muito_ativo";
} 