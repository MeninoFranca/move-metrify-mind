import { Profile } from '@/services/authService';

interface NutritionTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// Fatores de atividade para cálculo de TDEE (Gasto Energético Diário Total)
const activityFactors = {
  beginner: 1.375, // Levemente ativo
  intermediate: 1.55, // Moderadamente ativo
  advanced: 1.725, // Muito ativo
};

/**
 * Calcula as metas nutricionais de um usuário com base no seu perfil.
 * Utiliza a fórmula de Mifflin-St Jeor para o Metabolismo Basal (BMR).
 */
export const calculateNutritionTargets = (profile: Profile): NutritionTargets => {
  if (!profile.weight || !profile.height || !profile.age) {
    // Retorna valores padrão se dados essenciais estiverem faltando
    return { calories: 2000, protein: 150, carbs: 200, fat: 60 };
  }

  // Usando um gênero padrão 'male' se não estiver definido
  const gender = 'male'; 

  // 1. Calcular o Metabolismo Basal (BMR)
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
  } else {
    // Fórmula para 'female', caso adicione no futuro
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
  }
  
  // 2. Calcular o Gasto Energético Diário Total (TDEE)
  const activityLevel = profile.experience_level || 'beginner';
  const tdee = bmr * activityFactors[activityLevel];

  // 3. Ajustar calorias com base no objetivo
  let targetCalories: number;
  switch (profile.fitness_goal) {
    case 'lose_weight':
      targetCalories = tdee - 500; // Déficit calórico
      break;
    case 'gain_muscle':
      targetCalories = tdee + 300; // Superávit calórico
      break;
    default:
      targetCalories = tdee; // Manutenção
  }

  // 4. Calcular Macronutrientes
  // Proteína: 2g por kg de peso corporal
  const protein = profile.weight * 2;
  // Gordura: 25% das calorias totais
  const fat = (targetCalories * 0.25) / 9;
  // Carboidratos: O restante das calorias
  const carbs = (targetCalories - (protein * 4) - (fat * 9)) / 4;

  return {
    calories: Math.round(targetCalories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
  };
};