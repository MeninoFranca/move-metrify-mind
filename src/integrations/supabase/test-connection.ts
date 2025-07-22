import { supabase } from './client';

async function testConnection() {
  console.log('🔍 Testando conexão com Supabase...\n');

  try {
    // 1. Teste de conexão básica
    const { data: versionData, error: versionError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    console.log('1. Teste de conexão básica:');
    if (versionError) {
      console.error('❌ Erro na conexão:', versionError.message);
    } else {
      console.log('✅ Conexão estabelecida com sucesso');
    }

    // 2. Teste de autenticação anônima
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    console.log('\n2. Teste de autenticação anônima:');
    if (authError) {
      console.error('❌ Erro na autenticação:', authError.message);
    } else {
      console.log('✅ Autenticação anônima funcionando');
      console.log('Sessão:', authData);
    }

    // 3. Listar todas as tabelas e suas permissões
    console.log('\n3. Verificando tabelas:');
    const tables = [
      'profiles',
      'user_settings',
      'user_goals',
      'workouts',
      'exercises',
      'nutrition_plans',
      'meals'
    ];

    for (const table of tables) {
      console.log(`\nTestando tabela: ${table}`);
      
      // Teste de leitura
      const { error: readError } = await supabase
        .from(table)
        .select('count')
        .limit(1);

      console.log(`- Leitura: ${readError ? '❌' : '✅'}`);
      if (readError) console.log('  Erro:', readError.message);

      // Teste de inserção com dados mínimos
      const { error: insertError } = await supabase
        .from(table)
        .insert([{ id: 'test' }])
        .select()
        .single();

      console.log(`- Inserção: ${insertError ? '❌' : '✅'}`);
      if (insertError) {
        console.log('  Erro:', insertError.message);
        if (insertError.details) console.log('  Detalhes:', insertError.details);
      }
    }

    // 4. Verificar RLS (Row Level Security)
    console.log('\n4. Verificando RLS:');
    const { data: rlsData, error: rlsError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (rlsError?.message?.includes('row-level security')) {
      console.log('✅ RLS está ativo');
    } else {
      console.log('⚠️ RLS pode estar desativado');
    }

  } catch (error) {
    console.error('\n❌ Erro geral no teste:', error);
  }
}

// Executar teste
console.log('='.repeat(50));
console.log('Iniciando testes de conexão com Supabase');
console.log('='.repeat(50), '\n');

testConnection().then(() => {
  console.log('\n', '='.repeat(50));
  console.log('Testes concluídos');
  console.log('='.repeat(50));
}); 