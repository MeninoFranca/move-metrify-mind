import { Alimento } from "@/types/nutrition";

export const alimentosMock: Alimento[] = [
  {
    id: "1",
    nome: "Peito de Frango Grelhado",
    porcao: 100,
    calorias: 165,
    macros: {
      proteinas: 31,
      carboidratos: 0,
      gorduras: 3.6
    },
    categoria: "proteinas"
  },
  {
    id: "2",
    nome: "Arroz Integral Cozido",
    porcao: 100,
    calorias: 112,
    macros: {
      proteinas: 2.6,
      carboidratos: 23.5,
      gorduras: 0.9
    },
    categoria: "carboidratos"
  },
  {
    id: "3",
    nome: "Batata Doce Cozida",
    porcao: 100,
    calorias: 86,
    macros: {
      proteinas: 1.6,
      carboidratos: 20.1,
      gorduras: 0.1
    },
    categoria: "carboidratos"
  },
  {
    id: "4",
    nome: "Azeite de Oliva",
    porcao: 15,
    calorias: 120,
    macros: {
      proteinas: 0,
      carboidratos: 0,
      gorduras: 13.5
    },
    categoria: "gorduras"
  },
  {
    id: "5",
    nome: "Ovo Cozido",
    porcao: 50,
    calorias: 77,
    macros: {
      proteinas: 6.3,
      carboidratos: 0.6,
      gorduras: 5.3
    },
    categoria: "proteinas"
  }
];

export const calcularMacros = (alimentos: Array<{alimento: Alimento, quantidade: number}>) => {
  return alimentos.reduce((total, {alimento, quantidade}) => {
    const fator = quantidade / alimento.porcao;
    return {
      proteinas: total.proteinas + (alimento.macros.proteinas * fator),
      carboidratos: total.carboidratos + (alimento.macros.carboidratos * fator),
      gorduras: total.gorduras + (alimento.macros.gorduras * fator)
    };
  }, {proteinas: 0, carboidratos: 0, gorduras: 0});
};

export const calcularCalorias = (alimentos: Array<{alimento: Alimento, quantidade: number}>) => {
  return alimentos.reduce((total, {alimento, quantidade}) => {
    return total + (alimento.calorias * (quantidade / alimento.porcao));
  }, 0);
}; 