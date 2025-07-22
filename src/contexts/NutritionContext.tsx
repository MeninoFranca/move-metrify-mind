import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PreferenciasNutricionais,
  PlanoAlimentar,
  RegistroAlimentar,
  ListaCompras,
  TrackingNutricional
} from '@/types/nutrition';
import {
  calcularNecessidadeCalorica,
  calcularMacronutrientes,
  distribuirRefeicoes,
  calcularNecessidadeAgua
} from '@/services/nutritionService';
import {
  buscarAlimentos,
  calcularMacrosRefeicao,
  calcularCaloriasRefeicao,
  gerarRefeicao,
  gerarListaCompras
} from '@/services/foodService';
import { useToast } from '@/hooks/use-toast';

interface NutritionContextType {
  preferencias: PreferenciasNutricionais | null;
  planoAtual: PlanoAlimentar | null;
  tracking: TrackingNutricional | null;
  listaCompras: ListaCompras | null;
  registros: RegistroAlimentar[];
  salvarPreferencias: (prefs: PreferenciasNutricionais) => void;
  gerarPlanoAlimentar: () => void;
  registrarRefeicao: (registro: Omit<RegistroAlimentar, 'id'>) => void;
  atualizarListaCompras: () => void;
  marcarItemComprado: (itemId: string) => void;
  compartilharListaCompras: () => void;
  exportarDados: () => void;
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
  const [preferencias, setPreferencias] = useState<PreferenciasNutricionais | null>(null);
  const [planoAtual, setPlanoAtual] = useState<PlanoAlimentar | null>(null);
  const [tracking, setTracking] = useState<TrackingNutricional | null>(null);
  const [listaCompras, setListaCompras] = useState<ListaCompras | null>(null);
  const [registros, setRegistros] = useState<RegistroAlimentar[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Carregar dados salvos do localStorage
    const prefsStorage = localStorage.getItem('nutricionPreferencias');
    const planoStorage = localStorage.getItem('planoAlimentar');
    const trackingStorage = localStorage.getItem('trackingNutricional');
    const listaComprasStorage = localStorage.getItem('listaCompras');
    const registrosStorage = localStorage.getItem('registrosAlimentares');

    if (prefsStorage) {
      setPreferencias(JSON.parse(prefsStorage));
    }
    if (planoStorage) {
      setPlanoAtual(JSON.parse(planoStorage));
    }
    if (trackingStorage) {
      setTracking(JSON.parse(trackingStorage));
    }
    if (listaComprasStorage) {
      setListaCompras(JSON.parse(listaComprasStorage));
    }
    if (registrosStorage) {
      setRegistros(JSON.parse(registrosStorage));
    }
  }, []);

  const salvarPreferencias = (prefs: PreferenciasNutricionais) => {
    setPreferencias(prefs);
    localStorage.setItem('nutricionPreferencias', JSON.stringify(prefs));
    toast({
      title: "Preferências salvas",
      description: "Suas preferências nutricionais foram atualizadas.",
    });
  };

  const gerarPlanoAlimentar = () => {
    if (!preferencias) return;

    // Calcula necessidades calóricas e macronutrientes
    const caloriasAlvo = calcularNecessidadeCalorica(preferencias);
    const macrosAlvo = calcularMacronutrientes(preferencias, caloriasAlvo);

    // Distribui as calorias e macros pelas refeições
    const distribuicao = distribuirRefeicoes(caloriasAlvo, macrosAlvo, preferencias.numeroRefeicoes);

    // Gera as refeições baseadas na distribuição
    const refeicoes = [];
    const tiposRefeicao = ['cafe-da-manha', 'lanche-manha', 'almoco', 'lanche-tarde', 'jantar', 'ceia'];

    for (let i = 0; i < preferencias.numeroRefeicoes; i++) {
      const refeicao = gerarRefeicao(
        tiposRefeicao[i],
        distribuicao[i].calorias,
        distribuicao[i].macros
      );
      refeicoes.push(refeicao);
    }

    // Cria o novo plano alimentar
    const novoPlano: PlanoAlimentar = {
      id: Date.now().toString(),
      userId: 'user123', // Temporário
      data: new Date(),
      objetivo: preferencias.objetivo,
      caloriasAlvo,
      macrosAlvo,
      refeicoes
    };

    setPlanoAtual(novoPlano);
    localStorage.setItem('planoAlimentar', JSON.stringify(novoPlano));

    // Gera lista de compras
    atualizarListaCompras();

    // Inicializa tracking
    const novoTracking: TrackingNutricional = {
      id: Date.now().toString(),
      userId: 'user123', // Temporário
      data: new Date(),
      registros: [],
      caloriasTotal: 0,
      macrosTotal: { proteinas: 0, carboidratos: 0, gorduras: 0 },
      agua: 0,
      meta: {
        calorias: caloriasAlvo,
        macros: macrosAlvo,
        agua: calcularNecessidadeAgua(preferencias.peso, preferencias.nivelAtividade)
      }
    };

    setTracking(novoTracking);
    localStorage.setItem('trackingNutricional', JSON.stringify(novoTracking));

    toast({
      title: "Plano alimentar gerado",
      description: "Seu novo plano alimentar está pronto!",
    });
  };

  const registrarRefeicao = (registro: Omit<RegistroAlimentar, 'id'>) => {
    if (!tracking) return;

    const novoRegistro: RegistroAlimentar = {
      ...registro,
      id: Date.now().toString()
    };

    // Atualiza registros
    const novosRegistros = [...registros, novoRegistro];
    setRegistros(novosRegistros);
    localStorage.setItem('registrosAlimentares', JSON.stringify(novosRegistros));

    // Atualiza tracking
    const caloriasRefeicao = calcularCaloriasRefeicao(registro.refeicao.alimentos);
    const macrosRefeicao = calcularMacrosRefeicao(registro.refeicao.alimentos);

    const novoTracking: TrackingNutricional = {
      ...tracking,
      caloriasTotal: tracking.caloriasTotal + caloriasRefeicao,
      macrosTotal: {
        proteinas: tracking.macrosTotal.proteinas + macrosRefeicao.proteinas,
        carboidratos: tracking.macrosTotal.carboidratos + macrosRefeicao.carboidratos,
        gorduras: tracking.macrosTotal.gorduras + macrosRefeicao.gorduras
      }
    };

    setTracking(novoTracking);
    localStorage.setItem('trackingNutricional', JSON.stringify(novoTracking));

    toast({
      title: "Refeição registrada",
      description: "Seu consumo foi atualizado com sucesso.",
    });
  };

  const atualizarListaCompras = () => {
    if (!planoAtual) return;

    const novaLista: ListaCompras = {
      id: Date.now().toString(),
      userId: 'user123', // Temporário
      dataGeracao: new Date(),
      itens: gerarListaCompras(planoAtual.refeicoes).map(item => ({
        ...item,
        comprado: false
      }))
    };

    setListaCompras(novaLista);
    localStorage.setItem('listaCompras', JSON.stringify(novaLista));

    toast({
      title: "Lista de compras atualizada",
      description: "Sua lista de compras foi gerada com sucesso.",
    });
  };

  const marcarItemComprado = (itemId: string) => {
    if (!listaCompras) return;

    const novaLista: ListaCompras = {
      ...listaCompras,
      itens: listaCompras.itens.map(item => 
        item.alimento.id === itemId ? { ...item, comprado: !item.comprado } : item
      )
    };

    setListaCompras(novaLista);
    localStorage.setItem('listaCompras', JSON.stringify(novaLista));
  };

  const compartilharListaCompras = () => {
    if (!listaCompras) return;

    const texto = listaCompras.itens
      .map(item => `${item.comprado ? '✓' : '□'} ${item.alimento.nome}: ${item.quantidade}${item.alimento.unidade}`)
      .join('\n');

    if (navigator.share) {
      navigator.share({
        title: 'Lista de Compras - MetrifyMind',
        text: texto
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(texto).then(() => {
        toast({
          title: "Lista copiada",
          description: "A lista de compras foi copiada para a área de transferência.",
        });
      });
    }
  };

  const exportarDados = () => {
    const dados = {
      preferencias,
      planoAtual,
      tracking,
      registros,
      listaCompras,
      dataExportacao: new Date()
    };

    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nutricao_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Dados exportados",
      description: "Seus dados nutricionais foram exportados com sucesso.",
    });
  };

  return (
    <NutritionContext.Provider value={{
      preferencias,
      planoAtual,
      tracking,
      listaCompras,
      registros,
      salvarPreferencias,
      gerarPlanoAlimentar,
      registrarRefeicao,
      atualizarListaCompras,
      marcarItemComprado,
      compartilharListaCompras,
      exportarDados
    }}>
      {children}
    </NutritionContext.Provider>
  );
}; 