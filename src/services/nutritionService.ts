import { PreferenciasNutricionais, Macronutrientes, ObjetivoNutricional } from '@/types/nutrition';

// Fórmula de Harris-Benedict para cálculo do TMB (Taxa Metabólica Basal)
const calcularTMB = (peso: number, altura: number, idade: number, genero: 'masculino' | 'feminino'): number => {
  if (genero === 'masculino') {
    return 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * idade);
  } else {
    return 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * idade);
  }
};

// Fator de atividade para multiplicar pelo TMB
const fatorAtividade = {
  sedentario: 1.2, // Pouco ou nenhum exercício
  leve: 1.375, // Exercício leve 1-3x por semana
  moderado: 1.55, // Exercício moderado 3-5x por semana
  muito_ativo: 1.725, // Exercício pesado 6-7x por semana
  extremamente_ativo: 1.9 // Exercício muito pesado, trabalho físico
};

// Ajuste de calorias baseado no objetivo
const ajusteObjetivo = {
  perda_peso: -500, // Déficit calórico para perda de peso
  ganho_massa: 500, // Superávit calórico para ganho de massa
  manutencao: 0, // Manutenção do peso atual
  saude: 0 // Foco em saúde, sem alteração calórica
};

// Distribuição de macronutrientes baseada no objetivo
const distribuicaoMacros = {
  perda_peso: {
    proteinas: 2.2, // g/kg de peso corporal
    gorduras: 0.8, // g/kg de peso corporal
    // Carboidratos preenchem o restante das calorias
  },
  ganho_massa: {
    proteinas: 2.0, // g/kg de peso corporal
    gorduras: 1.0, // g/kg de peso corporal
    // Carboidratos preenchem o restante das calorias
  },
  manutencao: {
    proteinas: 1.8, // g/kg de peso corporal
    gorduras: 0.9, // g/kg de peso corporal
    // Carboidratos preenchem o restante das calorias
  },
  saude: {
    proteinas: 1.6, // g/kg de peso corporal
    gorduras: 1.0, // g/kg de peso corporal
    // Carboidratos preenchem o restante das calorias
  }
};

// Cálculo das necessidades calóricas diárias
export const calcularNecessidadeCalorica = (preferencias: PreferenciasNutricionais): number => {
  const tmb = calcularTMB(
    preferencias.peso,
    preferencias.altura,
    preferencias.idade,
    preferencias.genero
  );

  const gastoEnergetico = tmb * fatorAtividade[preferencias.nivelAtividade];
  const caloriasAlvo = gastoEnergetico + ajusteObjetivo[preferencias.objetivo];

  return Math.round(caloriasAlvo);
};

// Cálculo da distribuição de macronutrientes
export const calcularMacronutrientes = (
  preferencias: PreferenciasNutricionais,
  caloriasAlvo: number
): Macronutrientes => {
  const { peso, objetivo } = preferencias;
  const distribuicao = distribuicaoMacros[objetivo];

  // Cálculo das proteínas
  const proteinas = Math.round(peso * distribuicao.proteinas);
  const caloriasProteinas = proteinas * 4;

  // Cálculo das gorduras
  const gorduras = Math.round(peso * distribuicao.gorduras);
  const caloriasGorduras = gorduras * 9;

  // Cálculo dos carboidratos (restante das calorias)
  const caloriasRestantes = caloriasAlvo - caloriasProteinas - caloriasGorduras;
  const carboidratos = Math.round(caloriasRestantes / 4);

  return {
    proteinas,
    carboidratos,
    gorduras
  };
};

// Distribuição das refeições ao longo do dia
export const distribuirRefeicoes = (
  caloriasAlvo: number,
  macros: Macronutrientes,
  numeroRefeicoes: number
): { calorias: number; macros: Macronutrientes }[] => {
  // Distribuição percentual das calorias por refeição
  const distribuicaoPadrao = {
    3: [0.35, 0.40, 0.25], // 3 refeições
    4: [0.30, 0.15, 0.35, 0.20], // 4 refeições
    5: [0.25, 0.15, 0.30, 0.15, 0.15], // 5 refeições
    6: [0.20, 0.15, 0.25, 0.15, 0.15, 0.10] // 6 refeições
  };

  const distribuicao = distribuicaoPadrao[numeroRefeicoes as keyof typeof distribuicaoPadrao];
  
  return distribuicao.map(percentual => ({
    calorias: Math.round(caloriasAlvo * percentual),
    macros: {
      proteinas: Math.round(macros.proteinas * percentual),
      carboidratos: Math.round(macros.carboidratos * percentual),
      gorduras: Math.round(macros.gorduras * percentual)
    }
  }));
};

// Cálculo da necessidade de água
export const calcularNecessidadeAgua = (peso: number, nivelAtividade: string): number => {
  // Base: 35ml por kg de peso corporal
  let necessidadeBase = peso * 35;

  // Ajuste baseado no nível de atividade
  const ajusteAtividade = {
    sedentario: 1,
    leve: 1.1,
    moderado: 1.2,
    muito_ativo: 1.3,
    extremamente_ativo: 1.4
  };

  return Math.round(necessidadeBase * ajusteAtividade[nivelAtividade as keyof typeof ajusteAtividade]);
};

// Validação de macronutrientes
export const validarMacronutrientes = (macros: Macronutrientes, caloriasAlvo: number): boolean => {
  const caloriasTotal = (macros.proteinas * 4) + (macros.carboidratos * 4) + (macros.gorduras * 9);
  const diferenca = Math.abs(caloriasTotal - caloriasAlvo);
  
  // Permite uma margem de erro de 50 calorias
  return diferenca <= 50;
};

// Cálculo do IMC
export const calcularIMC = (peso: number, altura: number): number => {
  const alturaMetros = altura / 100;
  return Number((peso / (alturaMetros * alturaMetros)).toFixed(1));
};

// Interpretação do IMC
export const interpretarIMC = (imc: number): string => {
  if (imc < 18.5) return 'Abaixo do peso';
  if (imc < 24.9) return 'Peso normal';
  if (imc < 29.9) return 'Sobrepeso';
  if (imc < 34.9) return 'Obesidade grau 1';
  if (imc < 39.9) return 'Obesidade grau 2';
  return 'Obesidade grau 3';
}; 