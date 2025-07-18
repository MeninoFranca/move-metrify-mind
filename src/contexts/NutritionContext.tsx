import React, { createContext, useContext, useState, useEffect } from 'react';
import { PlanoAlimentar, PreferenciasNutricionais, Refeicao } from '@/types/nutrition';
import { alimentosMock, calcularCalorias, calcularMacros } from '@/data/mockAlimentos';

interface NutritionContextType {
  planoAtual: PlanoAlimentar | null;
  preferencias: PreferenciasNutricionais | null;
  salvarPreferencias: (prefs: PreferenciasNutricionais) => void;
  gerarPlanoAlimentar: () => void;
  adicionarRefeicao: (refeicao: Refeicao) => void;
  removerRefeicao: (refeicaoId: string) => void;
  atualizarRefeicao: (refeicaoId: string, refeicao: Refeicao) => void;
}

const NutritionContext = createContext<NutritionContextType | undefined>(undefined);

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (!context) {
    throw new Error('useNutrition deve ser usado dentro de um NutritionProvider');
  }
  return context;
};

export const NutritionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [planoAtual, setPlanoAtual] = useState<PlanoAlimentar | null>(null);
  const [preferencias, setPreferencias] = useState<PreferenciasNutricionais | null>(null);

  useEffect(() => {
    // Carregar dados salvos do localStorage
    const prefsStorage = localStorage.getItem('nutricionPreferencias');
    const planoStorage = localStorage.getItem('planoAlimentar');

    if (prefsStorage) {
      setPreferencias(JSON.parse(prefsStorage));
    }
    if (planoStorage) {
      setPlanoAtual(JSON.parse(planoStorage));
    }
  }, []);

  const salvarPreferencias = (prefs: PreferenciasNutricionais) => {
    setPreferencias(prefs);
    localStorage.setItem('nutricionPreferencias', JSON.stringify(prefs));
  };

  const calcularNecessidadesCalorias = (prefs: PreferenciasNutricionais) => {
    // Fórmula de Harris-Benedict para cálculo do TMB
    const tmb = prefs.genero === 'masculino'
      ? 88.362 + (13.397 * prefs.peso) + (4.799 * prefs.altura) - (5.677 * prefs.idade)
      : 447.593 + (9.247 * prefs.peso) + (3.098 * prefs.altura) - (4.330 * prefs.idade);

    // Fator de atividade
    const fatores = {
      sedentario: 1.2,
      moderado: 1.375,
      ativo: 1.55,
      muito_ativo: 1.725
    };

    const caloriasBase = tmb * fatores[prefs.nivelAtividade];

    // Ajuste baseado no objetivo
    switch (prefs.objetivo) {
      case 'perda_peso':
        return caloriasBase - 500;
      case 'ganho_massa':
        return caloriasBase + 500;
      default:
        return caloriasBase;
    }
  };

  const gerarPlanoAlimentar = () => {
    if (!preferencias) return;

    const caloriasAlvo = calcularNecessidadesCalorias(preferencias);
    
    // Distribuição de macros baseada no objetivo
    let distribuicaoMacros = {
      proteinas: 0,
      carboidratos: 0,
      gorduras: 0
    };

    switch (preferencias.objetivo) {
      case 'ganho_massa':
        distribuicaoMacros = {
          proteinas: 0.3,
          carboidratos: 0.5,
          gorduras: 0.2
        };
        break;
      case 'perda_peso':
        distribuicaoMacros = {
          proteinas: 0.4,
          carboidratos: 0.3,
          gorduras: 0.3
        };
        break;
      default:
        distribuicaoMacros = {
          proteinas: 0.35,
          carboidratos: 0.45,
          gorduras: 0.2
        };
    }

    const novoPlano: PlanoAlimentar = {
      id: Date.now().toString(),
      userId: 'user123', // Temporário - será integrado com autenticação
      objetivo: preferencias.objetivo,
      caloriasAlvo,
      macrosAlvo: {
        proteinas: (caloriasAlvo * distribuicaoMacros.proteinas) / 4,
        carboidratos: (caloriasAlvo * distribuicaoMacros.carboidratos) / 4,
        gorduras: (caloriasAlvo * distribuicaoMacros.gorduras) / 9
      },
      refeicoes: [],
      dataCriacao: new Date()
    };

    setPlanoAtual(novoPlano);
    localStorage.setItem('planoAlimentar', JSON.stringify(novoPlano));
  };

  const adicionarRefeicao = (refeicao: Refeicao) => {
    if (!planoAtual) return;

    const novoPlano = {
      ...planoAtual,
      refeicoes: [...planoAtual.refeicoes, refeicao]
    };

    setPlanoAtual(novoPlano);
    localStorage.setItem('planoAlimentar', JSON.stringify(novoPlano));
  };

  const removerRefeicao = (refeicaoId: string) => {
    if (!planoAtual) return;

    const novoPlano = {
      ...planoAtual,
      refeicoes: planoAtual.refeicoes.filter(r => r.id !== refeicaoId)
    };

    setPlanoAtual(novoPlano);
    localStorage.setItem('planoAlimentar', JSON.stringify(novoPlano));
  };

  const atualizarRefeicao = (refeicaoId: string, refeicao: Refeicao) => {
    if (!planoAtual) return;

    const novoPlano = {
      ...planoAtual,
      refeicoes: planoAtual.refeicoes.map(r => 
        r.id === refeicaoId ? refeicao : r
      )
    };

    setPlanoAtual(novoPlano);
    localStorage.setItem('planoAlimentar', JSON.stringify(novoPlano));
  };

  return (
    <NutritionContext.Provider value={{
      planoAtual,
      preferencias,
      salvarPreferencias,
      gerarPlanoAlimentar,
      adicionarRefeicao,
      removerRefeicao,
      atualizarRefeicao
    }}>
      {children}
    </NutritionContext.Provider>
  );
}; 