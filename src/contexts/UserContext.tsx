import React, { createContext, useContext, useState, useEffect } from 'react';
import { Usuario, ConfiguracoesUsuario, AtualizacaoUsuario } from '@/types/user';

interface UserContextType {
  usuario: Usuario | null;
  configuracoes: ConfiguracoesUsuario | null;
  atualizacoes: AtualizacaoUsuario[];
  atualizarUsuario: (dados: Partial<Usuario>) => void;
  atualizarConfiguracoes: (config: Partial<ConfiguracoesUsuario>) => void;
  fazerBackup: () => void;
  restaurarBackup: () => void;
  exportarDados: () => void;
  apagarConta: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
};

const configuracoesIniciais: ConfiguracoesUsuario = {
  notificacoes: {
    email: true,
    push: true,
    lembretes: true,
    atualizacoes: true,
    marketing: false
  },
  privacidade: {
    perfilPublico: false,
    compartilharProgresso: false,
    mostrarEstatisticas: true,
    permitirMencoes: false
  },
  preferencias: {
    tema: "sistema",
    unidadeMedida: "metrico",
    formatoData: "dd/MM/yyyy",
    formatoHora: "24h",
    idioma: "pt-BR"
  },
  backup: {
    automatico: true,
    frequencia: "semanal"
  }
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesUsuario>(configuracoesIniciais);
  const [atualizacoes, setAtualizacoes] = useState<AtualizacaoUsuario[]>([]);

  useEffect(() => {
    // Carregar dados do localStorage
    const usuarioStorage = localStorage.getItem('usuario');
    const configStorage = localStorage.getItem('userConfig');
    const atualizacoesStorage = localStorage.getItem('userUpdates');

    if (usuarioStorage) {
      const usuarioData = JSON.parse(usuarioStorage);
      setUsuario({
        ...usuarioData,
        dataNascimento: new Date(usuarioData.dataNascimento),
        ultimoLogin: new Date(usuarioData.ultimoLogin)
      });
    }
    if (configStorage) {
      setConfiguracoes(JSON.parse(configStorage));
    }
    if (atualizacoesStorage) {
      setAtualizacoes(JSON.parse(atualizacoesStorage).map((a: any) => ({
        ...a,
        data: new Date(a.data)
      })));
    }
  }, []);

  const salvarUsuario = (novoUsuario: Usuario) => {
    setUsuario(novoUsuario);
    localStorage.setItem('usuario', JSON.stringify(novoUsuario));
  };

  const salvarConfiguracoes = (novasConfigs: ConfiguracoesUsuario) => {
    setConfiguracoes(novasConfigs);
    localStorage.setItem('userConfig', JSON.stringify(novasConfigs));
  };

  const salvarAtualizacao = (atualizacao: AtualizacaoUsuario) => {
    const novasAtualizacoes = [atualizacao, ...atualizacoes].slice(0, 50); // Manter apenas as últimas 50 atualizações
    setAtualizacoes(novasAtualizacoes);
    localStorage.setItem('userUpdates', JSON.stringify(novasAtualizacoes));
  };

  const atualizarUsuario = (dados: Partial<Usuario>) => {
    if (!usuario) return;

    // Registrar atualizações
    Object.entries(dados).forEach(([campo, valor]) => {
      if (usuario[campo as keyof Usuario] !== valor) {
        salvarAtualizacao({
          campo: campo as keyof Usuario,
          valorAntigo: usuario[campo as keyof Usuario],
          valorNovo: valor,
          data: new Date()
        });
      }
    });

    const novoUsuario = {
      ...usuario,
      ...dados,
      ultimoLogin: new Date()
    };

    salvarUsuario(novoUsuario);
  };

  const atualizarConfiguracoes = (config: Partial<ConfiguracoesUsuario>) => {
    const novasConfigs = {
      ...configuracoes,
      ...config
    };
    salvarConfiguracoes(novasConfigs);
  };

  const fazerBackup = () => {
    const dados = {
      usuario,
      configuracoes,
      atualizacoes,
      timestamp: new Date()
    };

    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (configuracoes.backup.automatico) {
      atualizarConfiguracoes({
        backup: {
          ...configuracoes.backup,
          ultimoBackup: new Date()
        }
      });
    }
  };

  const restaurarBackup = () => {
    // Implementar lógica de restauração de backup
    // Esta é uma funcionalidade que requer UI específica para upload de arquivo
    console.log('Funcionalidade de restauração a ser implementada');
  };

  const exportarDados = () => {
    const dados = {
      usuario,
      configuracoes,
      atualizacoes
    };

    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dados_usuario_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const apagarConta = () => {
    // Limpar todos os dados do usuário
    localStorage.clear();
    setUsuario(null);
    setConfiguracoes(configuracoesIniciais);
    setAtualizacoes([]);
    // Aqui você redirecionaria o usuário para a página inicial
    // e implementaria a lógica de logout
  };

  return (
    <UserContext.Provider value={{
      usuario,
      configuracoes,
      atualizacoes,
      atualizarUsuario,
      atualizarConfiguracoes,
      fazerBackup,
      restaurarBackup,
      exportarDados,
      apagarConta
    }}>
      {children}
    </UserContext.Provider>
  );
}; 