import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  EventoCalendario,
  ConfiguracoesCalendario,
  EstatisticasCalendario,
  TipoEvento
} from '@/types/calendar';

interface CalendarContextType {
  eventos: EventoCalendario[];
  configuracoes: ConfiguracoesCalendario;
  estatisticas: EstatisticasCalendario;
  adicionarEvento: (evento: Omit<EventoCalendario, 'id'>) => void;
  atualizarEvento: (id: string, evento: Partial<EventoCalendario>) => void;
  removerEvento: (id: string) => void;
  marcarConcluido: (id: string) => void;
  marcarPendente: (id: string) => void;
  atualizarConfiguracoes: (config: Partial<ConfiguracoesCalendario>) => void;
  filtrarEventos: (inicio: Date, fim: Date, tipos?: TipoEvento[]) => EventoCalendario[];
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar deve ser usado dentro de um CalendarProvider');
  }
  return context;
};

const configuracoesIniciais: ConfiguracoesCalendario = {
  visualizacao: "mes",
  mostrarConcluidos: true,
  filtroTipos: ["treino", "refeicao", "medida", "meta", "descanso"],
  horaInicio: "06:00",
  horaFim: "22:00"
};

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [eventos, setEventos] = useState<EventoCalendario[]>([]);
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesCalendario>(configuracoesIniciais);
  const [estatisticas, setEstatisticas] = useState<EstatisticasCalendario>({
    eventosPlanejados: 0,
    eventosConcluidos: 0,
    treinosSemanais: 0,
    diasConsecutivos: 0
  });

  useEffect(() => {
    // Carregar dados do localStorage
    const eventosStorage = localStorage.getItem('eventos');
    const configStorage = localStorage.getItem('calendarConfig');

    if (eventosStorage) {
      const eventosCarregados = JSON.parse(eventosStorage);
      setEventos(eventosCarregados);
      atualizarEstatisticas(eventosCarregados);
    }
    if (configStorage) {
      setConfiguracoes(JSON.parse(configStorage));
    }
  }, []);

  const salvarEventos = (novosEventos: EventoCalendario[]) => {
    setEventos(novosEventos);
    localStorage.setItem('eventos', JSON.stringify(novosEventos));
    atualizarEstatisticas(novosEventos);
  };

  const salvarConfiguracoes = (novasConfigs: ConfiguracoesCalendario) => {
    setConfiguracoes(novasConfigs);
    localStorage.setItem('calendarConfig', JSON.stringify(novasConfigs));
  };

  const atualizarEstatisticas = (eventosAtuais: EventoCalendario[]) => {
    const agora = new Date();
    const inicioSemana = new Date(agora);
    inicioSemana.setDate(agora.getDate() - agora.getDay());
    inicioSemana.setHours(0, 0, 0, 0);

    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(fimSemana.getDate() + 7);

    const eventosSemana = eventosAtuais.filter(e => {
      const dataEvento = new Date(e.dataInicio);
      return dataEvento >= inicioSemana && dataEvento < fimSemana;
    });

    const treinosSemana = eventosSemana.filter(e => e.tipo === "treino");

    // Calcular dias consecutivos
    const diasTreino = new Set(
      eventosAtuais
        .filter(e => e.tipo === "treino" && e.concluido)
        .map(e => new Date(e.dataInicio).toDateString())
    );

    let diasConsecutivos = 0;
    let dataAtual = new Date(agora);
    dataAtual.setDate(dataAtual.getDate() - 1); // Começar do dia anterior

    while (diasTreino.has(dataAtual.toDateString())) {
      diasConsecutivos++;
      dataAtual.setDate(dataAtual.getDate() - 1);
    }

    // Encontrar próximo evento
    const proximosEventos = eventosAtuais
      .filter(e => new Date(e.dataInicio) > agora)
      .sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime());

    setEstatisticas({
      eventosPlanejados: eventosAtuais.length,
      eventosConcluidos: eventosAtuais.filter(e => e.concluido).length,
      treinosSemanais: treinosSemana.length,
      diasConsecutivos,
      proximoEvento: proximosEventos[0]
    });
  };

  const adicionarEvento = (evento: Omit<EventoCalendario, 'id'>) => {
    const novoEvento: EventoCalendario = {
      ...evento,
      id: Date.now().toString()
    };

    const novosEventos = [...eventos, novoEvento];
    salvarEventos(novosEventos);
  };

  const atualizarEvento = (id: string, atualizacao: Partial<EventoCalendario>) => {
    const novosEventos = eventos.map(e =>
      e.id === id ? { ...e, ...atualizacao } : e
    );
    salvarEventos(novosEventos);
  };

  const removerEvento = (id: string) => {
    const novosEventos = eventos.filter(e => e.id !== id);
    salvarEventos(novosEventos);
  };

  const marcarConcluido = (id: string) => {
    atualizarEvento(id, { concluido: true });
  };

  const marcarPendente = (id: string) => {
    atualizarEvento(id, { concluido: false });
  };

  const atualizarConfiguracoes = (config: Partial<ConfiguracoesCalendario>) => {
    const novasConfigs = {
      ...configuracoes,
      ...config
    };
    salvarConfiguracoes(novasConfigs);
  };

  const filtrarEventos = (inicio: Date, fim: Date, tipos?: TipoEvento[]): EventoCalendario[] => {
    return eventos.filter(evento => {
      const dataEvento = new Date(evento.dataInicio);
      const dentroPeriodo = dataEvento >= inicio && dataEvento <= fim;
      const tipoCorreto = !tipos || tipos.includes(evento.tipo);
      const mostrarConcluido = configuracoes.mostrarConcluidos || !evento.concluido;

      return dentroPeriodo && tipoCorreto && mostrarConcluido;
    });
  };

  return (
    <CalendarContext.Provider value={{
      eventos,
      configuracoes,
      estatisticas,
      adicionarEvento,
      atualizarEvento,
      removerEvento,
      marcarConcluido,
      marcarPendente,
      atualizarConfiguracoes,
      filtrarEventos
    }}>
      {children}
    </CalendarContext.Provider>
  );
}; 