import { Alimento, Refeicao, Macronutrientes } from '@/types/nutrition';

// Banco de dados de alimentos
const alimentosDB: Alimento[] = [
  // Proteínas
  {
    id: 'frango-peito',
    nome: 'Peito de Frango',
    porcao: 100,
    unidade: 'g',
    calorias: 165,
    macros: { proteinas: 31, carboidratos: 0, gorduras: 3.6 },
    categoria: 'proteinas'
  },
  {
    id: 'ovo',
    nome: 'Ovo',
    porcao: 50,
    unidade: 'g',
    calorias: 72,
    macros: { proteinas: 6.3, carboidratos: 0.4, gorduras: 4.8 },
    categoria: 'proteinas'
  },
  {
    id: 'carne-patinho',
    nome: 'Carne Patinho',
    porcao: 100,
    unidade: 'g',
    calorias: 148,
    macros: { proteinas: 27, carboidratos: 0, gorduras: 4.1 },
    categoria: 'proteinas'
  },

  // Carboidratos
  {
    id: 'arroz-branco',
    nome: 'Arroz Branco',
    porcao: 100,
    unidade: 'g',
    calorias: 130,
    macros: { proteinas: 2.7, carboidratos: 28.2, gorduras: 0.3 },
    categoria: 'carboidratos'
  },
  {
    id: 'batata-doce',
    nome: 'Batata Doce',
    porcao: 100,
    unidade: 'g',
    calorias: 86,
    macros: { proteinas: 1.6, carboidratos: 20.1, gorduras: 0.1 },
    categoria: 'carboidratos'
  },
  {
    id: 'pao-integral',
    nome: 'Pão Integral',
    porcao: 50,
    unidade: 'g',
    calorias: 120,
    macros: { proteinas: 4, carboidratos: 23, gorduras: 1.5 },
    categoria: 'carboidratos'
  },

  // Gorduras Boas
  {
    id: 'azeite',
    nome: 'Azeite de Oliva',
    porcao: 13,
    unidade: 'ml',
    calorias: 120,
    macros: { proteinas: 0, carboidratos: 0, gorduras: 13.5 },
    categoria: 'gorduras'
  },
  {
    id: 'abacate',
    nome: 'Abacate',
    porcao: 100,
    unidade: 'g',
    calorias: 160,
    macros: { proteinas: 2, carboidratos: 8.5, gorduras: 14.7 },
    categoria: 'gorduras'
  },
  {
    id: 'castanha',
    nome: 'Castanha do Pará',
    porcao: 30,
    unidade: 'g',
    calorias: 186,
    macros: { proteinas: 4.1, carboidratos: 3.3, gorduras: 18.6 },
    categoria: 'gorduras'
  },

  // Vegetais
  {
    id: 'brocolis',
    nome: 'Brócolis',
    porcao: 100,
    unidade: 'g',
    calorias: 34,
    macros: { proteinas: 2.8, carboidratos: 7, gorduras: 0.4 },
    categoria: 'vegetais'
  },
  {
    id: 'espinafre',
    nome: 'Espinafre',
    porcao: 100,
    unidade: 'g',
    calorias: 23,
    macros: { proteinas: 2.9, carboidratos: 3.6, gorduras: 0.4 },
    categoria: 'vegetais'
  },
  {
    id: 'cenoura',
    nome: 'Cenoura',
    porcao: 100,
    unidade: 'g',
    calorias: 41,
    macros: { proteinas: 0.9, carboidratos: 9.6, gorduras: 0.2 },
    categoria: 'vegetais'
  },

  // Frutas
  {
    id: 'banana',
    nome: 'Banana',
    porcao: 100,
    unidade: 'g',
    calorias: 89,
    macros: { proteinas: 1.1, carboidratos: 22.8, gorduras: 0.3 },
    categoria: 'frutas'
  },
  {
    id: 'maca',
    nome: 'Maçã',
    porcao: 100,
    unidade: 'g',
    calorias: 52,
    macros: { proteinas: 0.3, carboidratos: 13.8, gorduras: 0.2 },
    categoria: 'frutas'
  },
  {
    id: 'laranja',
    nome: 'Laranja',
    porcao: 100,
    unidade: 'g',
    calorias: 47,
    macros: { proteinas: 0.9, carboidratos: 11.8, gorduras: 0.1 },
    categoria: 'frutas'
  }
];

// Modelos de refeições por categoria
const modelosRefeicoes: Record<string, Partial<Refeicao>[]> = {
  'cafe-da-manha': [
    {
      nome: 'Café da Manhã Proteico',
      horario: '07:00',
      alimentos: [
        { alimento: alimentosDB.find(a => a.id === 'ovo')!, quantidade: 100 },
        { alimento: alimentosDB.find(a => a.id === 'pao-integral')!, quantidade: 50 },
        { alimento: alimentosDB.find(a => a.id === 'abacate')!, quantidade: 50 }
      ]
    },
    {
      nome: 'Café da Manhã Energético',
      horario: '07:00',
      alimentos: [
        { alimento: alimentosDB.find(a => a.id === 'banana')!, quantidade: 100 },
        { alimento: alimentosDB.find(a => a.id === 'pao-integral')!, quantidade: 50 },
        { alimento: alimentosDB.find(a => a.id === 'castanha')!, quantidade: 30 }
      ]
    }
  ],
  'lanche-manha': [
    {
      nome: 'Lanche da Manhã Leve',
      horario: '10:00',
      alimentos: [
        { alimento: alimentosDB.find(a => a.id === 'maca')!, quantidade: 100 },
        { alimento: alimentosDB.find(a => a.id === 'castanha')!, quantidade: 15 }
      ]
    }
  ],
  'almoco': [
    {
      nome: 'Almoço Tradicional',
      horario: '13:00',
      alimentos: [
        { alimento: alimentosDB.find(a => a.id === 'frango-peito')!, quantidade: 150 },
        { alimento: alimentosDB.find(a => a.id === 'arroz-branco')!, quantidade: 100 },
        { alimento: alimentosDB.find(a => a.id === 'brocolis')!, quantidade: 100 },
        { alimento: alimentosDB.find(a => a.id === 'azeite')!, quantidade: 13 }
      ]
    }
  ],
  'lanche-tarde': [
    {
      nome: 'Lanche da Tarde Nutritivo',
      horario: '16:00',
      alimentos: [
        { alimento: alimentosDB.find(a => a.id === 'banana')!, quantidade: 100 },
        { alimento: alimentosDB.find(a => a.id === 'castanha')!, quantidade: 15 }
      ]
    }
  ],
  'jantar': [
    {
      nome: 'Jantar Leve',
      horario: '20:00',
      alimentos: [
        { alimento: alimentosDB.find(a => a.id === 'frango-peito')!, quantidade: 100 },
        { alimento: alimentosDB.find(a => a.id === 'batata-doce')!, quantidade: 100 },
        { alimento: alimentosDB.find(a => a.id === 'espinafre')!, quantidade: 100 },
        { alimento: alimentosDB.find(a => a.id === 'azeite')!, quantidade: 13 }
      ]
    }
  ],
  'ceia': [
    {
      nome: 'Ceia Proteica',
      horario: '22:00',
      alimentos: [
        { alimento: alimentosDB.find(a => a.id === 'ovo')!, quantidade: 50 }
      ]
    }
  ]
};

// Busca alimentos por nome ou categoria
export const buscarAlimentos = (termo: string, categoria?: string): Alimento[] => {
  const termoBusca = termo.toLowerCase();
  return alimentosDB.filter(alimento => {
    const matchNome = alimento.nome.toLowerCase().includes(termoBusca);
    const matchCategoria = !categoria || alimento.categoria === categoria;
    return matchNome && matchCategoria;
  });
};

// Calcula os macronutrientes totais de uma refeição
export const calcularMacrosRefeicao = (alimentos: { alimento: Alimento; quantidade: number }[]): Macronutrientes => {
  return alimentos.reduce((total, { alimento, quantidade }) => {
    const fator = quantidade / alimento.porcao;
    return {
      proteinas: total.proteinas + alimento.macros.proteinas * fator,
      carboidratos: total.carboidratos + alimento.macros.carboidratos * fator,
      gorduras: total.gorduras + alimento.macros.gorduras * fator
    };
  }, { proteinas: 0, carboidratos: 0, gorduras: 0 });
};

// Calcula as calorias totais de uma refeição
export const calcularCaloriasRefeicao = (alimentos: { alimento: Alimento; quantidade: number }[]): number => {
  return alimentos.reduce((total, { alimento, quantidade }) => {
    const fator = quantidade / alimento.porcao;
    return total + alimento.calorias * fator;
  }, 0);
};

// Gera uma refeição baseada nos macronutrientes alvo
export const gerarRefeicao = (
  tipo: string,
  caloriasAlvo: number,
  macrosAlvo: Macronutrientes
): Refeicao => {
  // Seleciona um modelo de refeição aleatório para o tipo
  const modelos = modelosRefeicoes[tipo];
  const modeloBase = modelos[Math.floor(Math.random() * modelos.length)];

  // Ajusta as quantidades para atingir os macros alvo
  const refeicao: Refeicao = {
    id: `${tipo}-${Date.now()}`,
    nome: modeloBase.nome!,
    horario: modeloBase.horario!,
    alimentos: modeloBase.alimentos!,
    calorias: 0,
    macros: { proteinas: 0, carboidratos: 0, gorduras: 0 }
  };

  // Calcula os macros e calorias da refeição
  refeicao.macros = calcularMacrosRefeicao(refeicao.alimentos);
  refeicao.calorias = calcularCaloriasRefeicao(refeicao.alimentos);

  return refeicao;
};

// Gera uma lista de compras baseada nas refeições
export const gerarListaCompras = (refeicoes: Refeicao[]): { alimento: Alimento; quantidade: number }[] => {
  const listaCompras: Map<string, number> = new Map();

  // Soma as quantidades de cada alimento
  refeicoes.forEach(refeicao => {
    refeicao.alimentos.forEach(({ alimento, quantidade }) => {
      const quantidadeAtual = listaCompras.get(alimento.id) || 0;
      listaCompras.set(alimento.id, quantidadeAtual + quantidade);
    });
  });

  // Converte o Map em array de objetos
  return Array.from(listaCompras.entries()).map(([id, quantidade]) => ({
    alimento: alimentosDB.find(a => a.id === id)!,
    quantidade
  }));
}; 