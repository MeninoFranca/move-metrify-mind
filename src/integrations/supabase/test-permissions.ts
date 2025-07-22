import { supabase } from './client';

async function testPermissions() {
  console.log('Testando permissões do Supabase...');

  // Criar um usuário de teste com um email mais realista
  const timestamp = Date.now();
  const testEmail = `user.test.${timestamp}@gmail.com`;
  
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: testEmail,
    password: 'Test123!@#',
    options: {
      data: {
        full_name: 'Usuário Teste',
      }
    }
  });

  if (authError) {
    console.error('Erro ao criar usuário de teste:', authError);
    return;
  }

  if (!authData.user) {
    console.error('Usuário de teste não foi criado');
    return;
  }

  const userId = authData.user.id;
  console.log('Usuário de teste criado:', userId);

  // Dados de teste para cada tabela
  const testData = {
    profiles: {
      user_id: userId,
      email: testEmail,
      full_name: 'Usuário Teste',
      gender: 'masculino',
      birth_date: '1990-01-01',
      height: 175,
      weight: 70,
      fitness_goal: 'saude'
    },
    user_settings: {
      user_id: userId,
      language: 'pt-BR',
      theme: 'light',
      notifications_enabled: true,
      measurement_unit: 'metric',
      timezone: 'America/Sao_Paulo',
      reminder_frequency: 'daily'
    },
    user_goals: {
      user_id: userId,
      goal_type: 'weight',
      target_value: 65,
      current_value: 70,
      status: 'active'
    }
  };

  // Testar inserção nas tabelas principais
  for (const [table, data] of Object.entries(testData)) {
    console.log(`\nTestando tabela: ${table}`);
    
    // Teste de inserção
    const { error: insertError } = await supabase
      .from(table)
      .insert([data]);

    console.log(`Inserção ${table}:`, insertError ? 'Erro ❌' : 'OK ✅');
    if (insertError) {
      console.error('Erro de inserção:', insertError.message);
      console.error('Detalhes:', insertError);
    }

    // Teste de leitura
    const { data: readData, error: readError } = await supabase
      .from(table)
      .select('*')
      .eq('user_id', userId)
      .single();

    console.log(`Leitura ${table}:`, readError ? 'Erro ❌' : 'OK ✅');
    if (readError) {
      console.error('Erro de leitura:', readError.message);
    } else {
      console.log('Dados lidos:', readData);
    }
  }
}

testPermissions(); 