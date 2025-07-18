import { Exercise, Equipment, MuscleGroup, DifficultyLevel } from '@/types/workout';

export const mockExercises: Exercise[] = [
  {
    id: '1',
    name: 'Supino Reto',
    description: 'Exercício clássico para desenvolvimento do peitoral',
    muscleGroup: 'chest',
    equipment: ['gym'],
    difficulty: 'intermediate',
    instructions: [
      'Deite-se no banco com os pés apoiados no chão',
      'Segure a barra com as mãos um pouco mais abertas que a largura dos ombros',
      'Desça a barra controladamente até tocar levemente o peito',
      'Empurre a barra para cima até estender os braços',
    ],
    sets: 4,
    reps: 12,
    restTime: 90,
    imageUrl: '/exercises/bench-press.jpg',
  },
  {
    id: '2',
    name: 'Agachamento',
    description: 'Exercício fundamental para desenvolvimento das pernas',
    muscleGroup: 'legs',
    equipment: ['gym', 'home'],
    difficulty: 'intermediate',
    instructions: [
      'Posicione os pés na largura dos ombros',
      'Mantenha as costas retas e o peito para frente',
      'Desça como se fosse sentar em uma cadeira',
      'Retorne à posição inicial empurrando através dos calcanhares',
    ],
    sets: 4,
    reps: 15,
    restTime: 90,
    imageUrl: '/exercises/squat.jpg',
  },
  {
    id: '3',
    name: 'Flexão de Braço',
    description: 'Exercício corporal para peitoral e tríceps',
    muscleGroup: 'chest',
    equipment: ['none'],
    difficulty: 'beginner',
    instructions: [
      'Apoie as mãos no chão na largura dos ombros',
      'Mantenha o corpo reto e alinhado',
      'Desça o peito em direção ao chão',
      'Empurre o corpo de volta à posição inicial',
    ],
    sets: 3,
    reps: 10,
    restTime: 60,
    imageUrl: '/exercises/push-up.jpg',
  },
  {
    id: '4',
    name: 'Corrida',
    description: 'Exercício cardiovascular básico',
    muscleGroup: 'full_body',
    equipment: ['none'],
    difficulty: 'beginner',
    instructions: [
      'Mantenha uma postura ereta',
      'Movimente os braços em sincronia com as pernas',
      'Mantenha um ritmo constante',
      'Respire de forma controlada',
    ],
    duration: 30,
    imageUrl: '/exercises/running.jpg',
  },
  {
    id: '5',
    name: 'Prancha',
    description: 'Exercício isométrico para fortalecimento do core',
    muscleGroup: 'core',
    equipment: ['none'],
    difficulty: 'beginner',
    instructions: [
      'Apoie os antebraços no chão',
      'Mantenha o corpo reto e alinhado',
      'Contraia o abdômen',
      'Mantenha a posição pelo tempo determinado',
    ],
    duration: 1,
    restTime: 60,
    imageUrl: '/exercises/plank.jpg',
  },
];

// Função auxiliar para filtrar exercícios com base nas preferências
export const filterExercises = (
  exercises: Exercise[],
  equipment: Equipment[],
  difficulty: DifficultyLevel,
  targetMuscleGroups?: MuscleGroup[]
) => {
  return exercises.filter((exercise) => {
    // Verifica se o usuário tem o equipamento necessário
    const hasEquipment = exercise.equipment.some((eq) => equipment.includes(eq));
    
    // Verifica se o exercício está no nível adequado
    const matchesDifficulty = exercise.difficulty === difficulty;
    
    // Se houver grupos musculares alvo, verifica se o exercício trabalha algum deles
    const matchesMuscleGroup = !targetMuscleGroups?.length || 
      targetMuscleGroups.includes(exercise.muscleGroup);

    return hasEquipment && matchesDifficulty && matchesMuscleGroup;
  });
}; 