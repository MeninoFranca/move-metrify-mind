import { supabase } from './client';

async function checkSchema() {
  console.log('Verificando estrutura das tabelas...\n');

  try {
    // Verificar estrutura da tabela profiles
    const { data: profileColumns, error: profileError } = await supabase
      .rpc('get_table_columns', { table_name: 'profiles' });

    console.log('Colunas da tabela profiles:');
    if (profileError) {
      console.error('Erro:', profileError);
    } else {
      console.log(profileColumns);
    }

    // Tentar uma inserção mínima
    const testProfile = {
      id: '00000000-0000-0000-0000-000000000000',
      email: 'test@example.com',
      full_name: 'Test User'
    };

    const { error: insertError } = await supabase
      .from('profiles')
      .insert([testProfile])
      .select()
      .single();

    console.log('\nTeste de inserção mínima:');
    if (insertError) {
      console.log('Erro:', insertError.message);
      if (insertError.details) {
        console.log('Detalhes:', insertError.details);
      }
    } else {
      console.log('Inserção bem sucedida com campos mínimos');
    }

    // Verificar estrutura da tabela user_settings
    const { data: settingsColumns, error: settingsError } = await supabase
      .rpc('get_table_columns', { table_name: 'user_settings' });

    console.log('\nColunas da tabela user_settings:');
    if (settingsError) {
      console.error('Erro:', settingsError);
    } else {
      console.log(settingsColumns);
    }

  } catch (error) {
    console.error('Erro ao verificar schema:', error);
  }
}

// Executar verificação
console.log('='.repeat(50));
console.log('Verificação de Schema do Banco de Dados');
console.log('='.repeat(50), '\n');

checkSchema().then(() => {
  console.log('\n', '='.repeat(50));
  console.log('Verificação concluída');
  console.log('='.repeat(50));
}); 