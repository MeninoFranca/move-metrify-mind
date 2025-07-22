import { supabase } from './client';

async function inspectDatabase() {
  try {
    const tables = [
      'achievements',
      'activity_history',
      'body_measurements',
      'calendar_events',
      'exercises',
      'food_items',
      'hydration_entries',
      'hydration_records',
      'meal_foods',
      'meals',
      'nutrition_plans',
      'profiles',
      'progress_photos',
      'user_achievements',
      'user_goals',
      'user_settings',
      'weight_progress',
      'workout_exercises',
      'workouts'
    ];

    for (const table of tables) {
      console.log(`\nInspecionando tabela: ${table}`);
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`Erro ao acessar tabela ${table}:`, error.message);
      } else {
        console.log(`✓ Tabela ${table} existe!`);
        if (data && data.length > 0) {
          console.log('Exemplo de registro:', data[0]);
        } else {
          console.log('Tabela está vazia');
        }

        // Buscar a estrutura da tabela
        const { data: columns, error: columnsError } = await supabase
          .rpc('get_table_columns', { table_name: table });
          
        if (!columnsError && columns) {
          console.log('Colunas:', columns);
        }
      }
    }
  } catch (error) {
    console.error('Erro ao inspecionar banco de dados:', error);
  }
}

inspectDatabase(); 