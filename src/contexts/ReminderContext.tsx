import React, { createContext, useContext, useState, useEffect } from 'react';
import { Lembrete, ConfiguracoesLembrete, TipoLembrete, HorarioLembrete } from '@/types/reminder';
import { toast } from 'sonner';

interface ReminderContextType {
  lembretes: Lembrete[];
  configuracoes: ConfiguracoesLembrete;
  adicionarLembrete: (lembrete: Omit<Lembrete, 'id'>) => void;
  removerLembrete: (id: string) => void;
  atualizarLembrete: (id: string, lembrete: Partial<Lembrete>) => void;
  atualizarConfiguracoes: (novasConfigs: Partial<ConfiguracoesLembrete>) => void;
  ativarLembrete: (id: string) => void;
  desativarLembrete: (id: string) => void;
}

const ReminderContext = createContext<ReminderContextType | undefined>(undefined);

export const useReminder = () => {
  const context = useContext(ReminderContext);
  if (!context) {
    throw new Error('useReminder deve ser usado dentro de um ReminderProvider');
  }
  return context;
};

const configuracoesIniciais: ConfiguracoesLembrete = {
  hidratacao: {
    intervalo: 60,
    periodoInicio: "08:00",
    periodoFim: "22:00",
    diasSemana: [0, 1, 2, 3, 4, 5, 6],
    meta: 2000
  },
  treino: {
    antecedencia: 30,
    lembreteRecorrente: true
  },
  refeicao: {
    antecedencia: 15,
    lembretePreparacao: true
  }
};

export const ReminderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lembretes, setLembretes] = useState<Lembrete[]>([]);
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesLembrete>(configuracoesIniciais);

  useEffect(() => {
    // Carregar dados do localStorage
    const lembretesStorage = localStorage.getItem('lembretes');
    const configsStorage = localStorage.getItem('reminderConfigs');

    if (lembretesStorage) {
      setLembretes(JSON.parse(lembretesStorage));
    }
    if (configsStorage) {
      setConfiguracoes(JSON.parse(configsStorage));
    }

    // Iniciar verificação de lembretes
    const interval = setInterval(verificarLembretes, 60000); // Verifica a cada minuto
    return () => clearInterval(interval);
  }, []);

  const salvarLembretes = (novosLembretes: Lembrete[]) => {
    setLembretes(novosLembretes);
    localStorage.setItem('lembretes', JSON.stringify(novosLembretes));
  };

  const salvarConfiguracoes = (novasConfigs: ConfiguracoesLembrete) => {
    setConfiguracoes(novasConfigs);
    localStorage.setItem('reminderConfigs', JSON.stringify(novasConfigs));
  };

  const verificarLembretes = () => {
    const agora = new Date();
    
    lembretes.forEach(lembrete => {
      if (!lembrete.ativo) return;

      const proximaNotificacao = lembrete.proximaNotificacao 
        ? new Date(lembrete.proximaNotificacao) 
        : null;

      if (!proximaNotificacao) return;

      if (proximaNotificacao <= agora) {
        // Mostrar notificação
        toast.info(lembrete.titulo, {
          description: lembrete.descricao,
          duration: 5000
        });

        // Atualizar próxima notificação
        const novaProximaNotificacao = calcularProximaNotificacao(lembrete);
        atualizarLembrete(lembrete.id, {
          ultimaNotificacao: agora,
          proximaNotificacao: novaProximaNotificacao
        });
      }
    });
  };

  const calcularProximaNotificacao = (lembrete: Lembrete): Date => {
    const agora = new Date();
    let proximaData = new Date();

    switch (lembrete.frequencia) {
      case 'diaria':
        // Próximo horário hoje ou amanhã
        const horarioHoje = lembrete.horarios[0];
        proximaData.setHours(horarioHoje.hora, horarioHoje.minuto, 0, 0);
        if (proximaData <= agora) {
          proximaData.setDate(proximaData.getDate() + 1);
        }
        break;

      case 'semanal':
        // Próximo dia da semana configurado
        const diasSemana = lembrete.horarios[0].diasSemana || [];
        let encontrado = false;
        let diasAdicionados = 0;

        while (!encontrado && diasAdicionados < 7) {
          const diaSemana = proximaData.getDay();
          if (diasSemana.includes(diaSemana)) {
            const horario = lembrete.horarios[0];
            proximaData.setHours(horario.hora, horario.minuto, 0, 0);
            if (proximaData > agora) {
              encontrado = true;
            }
          }
          if (!encontrado) {
            proximaData.setDate(proximaData.getDate() + 1);
            diasAdicionados++;
          }
        }
        break;

      case 'personalizada':
        // Próximo horário disponível
        proximaData = new Date(Math.max(
          ...lembrete.horarios.map(h => {
            const data = new Date();
            data.setHours(h.hora, h.minuto, 0, 0);
            if (data <= agora) {
              data.setDate(data.getDate() + 1);
            }
            return data.getTime();
          })
        ));
        break;
    }

    return proximaData;
  };

  const adicionarLembrete = (lembrete: Omit<Lembrete, 'id'>) => {
    const novoLembrete: Lembrete = {
      ...lembrete,
      id: Date.now().toString(),
      proximaNotificacao: calcularProximaNotificacao({
        ...lembrete,
        id: Date.now().toString()
      } as Lembrete)
    };

    const novosLembretes = [...lembretes, novoLembrete];
    salvarLembretes(novosLembretes);
  };

  const removerLembrete = (id: string) => {
    const novosLembretes = lembretes.filter(l => l.id !== id);
    salvarLembretes(novosLembretes);
  };

  const atualizarLembrete = (id: string, atualizacao: Partial<Lembrete>) => {
    const novosLembretes = lembretes.map(l => 
      l.id === id ? { ...l, ...atualizacao } : l
    );
    salvarLembretes(novosLembretes);
  };

  const atualizarConfiguracoes = (novasConfigs: Partial<ConfiguracoesLembrete>) => {
    const configsAtualizadas = {
      ...configuracoes,
      ...novasConfigs
    };
    salvarConfiguracoes(configsAtualizadas);
  };

  const ativarLembrete = (id: string) => {
    const lembrete = lembretes.find(l => l.id === id);
    if (lembrete) {
      atualizarLembrete(id, {
        ativo: true,
        proximaNotificacao: calcularProximaNotificacao(lembrete)
      });
    }
  };

  const desativarLembrete = (id: string) => {
    atualizarLembrete(id, {
      ativo: false,
      proximaNotificacao: undefined
    });
  };

  return (
    <ReminderContext.Provider value={{
      lembretes,
      configuracoes,
      adicionarLembrete,
      removerLembrete,
      atualizarLembrete,
      atualizarConfiguracoes,
      ativarLembrete,
      desativarLembrete
    }}>
      {children}
    </ReminderContext.Provider>
  );
}; 