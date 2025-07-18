import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  RegistroProgresso,
  MetaProgresso,
  EstatisticasProgresso,
  FotoProgresso,
  Medidas
} from '@/types/progress';

interface ProgressContextType {
  registros: RegistroProgresso[];
  metas: MetaProgresso[];
  estatisticas: EstatisticasProgresso;
  adicionarRegistro: (registro: Omit<RegistroProgresso, 'id'>) => void;
  atualizarRegistro: (id: string, registro: Partial<RegistroProgresso>) => void;
  removerRegistro: (id: string) => void;
  adicionarMeta: (meta: Omit<MetaProgresso, 'id' | 'progresso'>) => void;
  atualizarMeta: (id: string, meta: Partial<MetaProgresso>) => void;
  removerMeta: (id: string) => void;
  adicionarFoto: (foto: Omit<FotoProgresso, 'id'>, registroId: string) => void;
  removerFoto: (fotoId: string, registroId: string) => void;
  calcularIMC: (peso: number, altura: number) => number;
  calcularProgresso: (registros: RegistroProgresso[]) => EstatisticasProgresso;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress deve ser usado dentro de um ProgressProvider');
  }
  return context;
};

const calcularIMC = (peso: number, altura: number): number => {
  const alturaMetros = altura / 100;
  return peso / (alturaMetros * alturaMetros);
};

const calcularProgresso = (registros: RegistroProgresso[]): EstatisticasProgresso => {
  if (registros.length === 0) {
    return {
      mediaPeso: 0,
      variacaoPeso: 0,
      diasTreinados: 0,
      metasConcluidas: 0,
      metasEmAndamento: 0,
      diasConsecutivos: 0,
      melhorSequencia: 0
    };
  }

  const pesos = registros.map(r => r.peso);
  const mediaPeso = pesos.reduce((a, b) => a + b, 0) / pesos.length;
  const variacaoPeso = Math.max(...pesos) - Math.min(...pesos);

  // Calcular dias consecutivos
  const datasOrdenadas = registros
    .map(r => r.data)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  let diasConsecutivos = 1;
  let melhorSequencia = 1;
  let sequenciaAtual = 1;

  for (let i = 1; i < datasOrdenadas.length; i++) {
    const dataAtual = new Date(datasOrdenadas[i]);
    const dataAnterior = new Date(datasOrdenadas[i - 1]);
    const diffDias = Math.floor(
      (dataAnterior.getTime() - dataAtual.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDias === 1) {
      sequenciaAtual++;
      if (i === 1) diasConsecutivos = sequenciaAtual;
      if (sequenciaAtual > melhorSequencia) {
        melhorSequencia = sequenciaAtual;
      }
    } else {
      sequenciaAtual = 1;
    }
  }

  return {
    mediaPeso,
    variacaoPeso,
    diasTreinados: registros.length,
    metasConcluidas: 0, // Será atualizado pelo estado de metas
    metasEmAndamento: 0, // Será atualizado pelo estado de metas
    diasConsecutivos,
    melhorSequencia
  };
};

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [registros, setRegistros] = useState<RegistroProgresso[]>([]);
  const [metas, setMetas] = useState<MetaProgresso[]>([]);
  const [estatisticas, setEstatisticas] = useState<EstatisticasProgresso>({
    mediaPeso: 0,
    variacaoPeso: 0,
    diasTreinados: 0,
    metasConcluidas: 0,
    metasEmAndamento: 0,
    diasConsecutivos: 0,
    melhorSequencia: 0
  });

  useEffect(() => {
    // Carregar dados do localStorage
    const registrosStorage = localStorage.getItem('registrosProgresso');
    const metasStorage = localStorage.getItem('metasProgresso');

    if (registrosStorage) {
      const registrosCarregados = JSON.parse(registrosStorage);
      setRegistros(registrosCarregados);
      setEstatisticas(calcularProgresso(registrosCarregados));
    }
    if (metasStorage) {
      setMetas(JSON.parse(metasStorage));
    }
  }, []);

  const salvarRegistros = (novosRegistros: RegistroProgresso[]) => {
    setRegistros(novosRegistros);
    localStorage.setItem('registrosProgresso', JSON.stringify(novosRegistros));
    setEstatisticas(calcularProgresso(novosRegistros));
  };

  const salvarMetas = (novasMetas: MetaProgresso[]) => {
    setMetas(novasMetas);
    localStorage.setItem('metasProgresso', JSON.stringify(novasMetas));
    setEstatisticas(prev => ({
      ...prev,
      metasConcluidas: novasMetas.filter(m => m.concluida).length,
      metasEmAndamento: novasMetas.filter(m => !m.concluida).length
    }));
  };

  const adicionarRegistro = (registro: Omit<RegistroProgresso, 'id'>) => {
    const novoRegistro: RegistroProgresso = {
      ...registro,
      id: Date.now().toString()
    };

    const novosRegistros = [...registros, novoRegistro];
    salvarRegistros(novosRegistros);
  };

  const atualizarRegistro = (id: string, atualizacao: Partial<RegistroProgresso>) => {
    const novosRegistros = registros.map(r =>
      r.id === id ? { ...r, ...atualizacao } : r
    );
    salvarRegistros(novosRegistros);
  };

  const removerRegistro = (id: string) => {
    const novosRegistros = registros.filter(r => r.id !== id);
    salvarRegistros(novosRegistros);
  };

  const adicionarMeta = (meta: Omit<MetaProgresso, 'id' | 'progresso'>) => {
    const novaMeta: MetaProgresso = {
      ...meta,
      id: Date.now().toString(),
      progresso: 0,
      concluida: false
    };

    const novasMetas = [...metas, novaMeta];
    salvarMetas(novasMetas);
  };

  const atualizarMeta = (id: string, atualizacao: Partial<MetaProgresso>) => {
    const novasMetas = metas.map(m => {
      if (m.id === id) {
        const metaAtualizada = { ...m, ...atualizacao };
        // Recalcular progresso
        const progresso = ((metaAtualizada.valorAtual - metaAtualizada.valorInicial) /
          (metaAtualizada.valorAlvo - metaAtualizada.valorInicial)) * 100;
        return {
          ...metaAtualizada,
          progresso: Math.min(Math.max(progresso, 0), 100),
          concluida: progresso >= 100
        };
      }
      return m;
    });
    salvarMetas(novasMetas);
  };

  const removerMeta = (id: string) => {
    const novasMetas = metas.filter(m => m.id !== id);
    salvarMetas(novasMetas);
  };

  const adicionarFoto = (foto: Omit<FotoProgresso, 'id'>, registroId: string) => {
    const novaFoto: FotoProgresso = {
      ...foto,
      id: Date.now().toString()
    };

    const novosRegistros = registros.map(r => {
      if (r.id === registroId) {
        return {
          ...r,
          fotos: [...(r.fotos || []), novaFoto]
        };
      }
      return r;
    });

    salvarRegistros(novosRegistros);
  };

  const removerFoto = (fotoId: string, registroId: string) => {
    const novosRegistros = registros.map(r => {
      if (r.id === registroId && r.fotos) {
        return {
          ...r,
          fotos: r.fotos.filter(f => f.id !== fotoId)
        };
      }
      return r;
    });

    salvarRegistros(novosRegistros);
  };

  return (
    <ProgressContext.Provider value={{
      registros,
      metas,
      estatisticas,
      adicionarRegistro,
      atualizarRegistro,
      removerRegistro,
      adicionarMeta,
      atualizarMeta,
      removerMeta,
      adicionarFoto,
      removerFoto,
      calcularIMC,
      calcularProgresso
    }}>
      {children}
    </ProgressContext.Provider>
  );
}; 