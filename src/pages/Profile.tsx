import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { useUser } from '@/contexts/UserContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import ProfileLayout from '@/layouts/ProfileLayout';

const Profile = () => {
  const { usuario, atualizarUsuario } = useUser();
  const [editando, setEditando] = useState(false);
  const [dadosTemp, setDadosTemp] = useState(usuario);

  if (!usuario || !dadosTemp) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    atualizarUsuario(dadosTemp);
    setEditando(false);
  };

  return (
    <ProfileLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Perfil</h1>
          <Button
            onClick={() => {
              if (editando) {
                setDadosTemp(usuario);
              }
              setEditando(!editando);
            }}
            variant={editando ? "outline" : "default"}
          >
            {editando ? "Cancelar" : "Editar Perfil"}
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Informações Básicas</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={dadosTemp.nome}
                  onChange={(e) => setDadosTemp({ ...dadosTemp, nome: e.target.value })}
                  disabled={!editando}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={dadosTemp.email}
                  onChange={(e) => setDadosTemp({ ...dadosTemp, email: e.target.value })}
                  disabled={!editando}
                />
              </div>

              <div>
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  value={format(dadosTemp.dataNascimento, 'yyyy-MM-dd')}
                  onChange={(e) => setDadosTemp({
                    ...dadosTemp,
                    dataNascimento: new Date(e.target.value)
                  })}
                  disabled={!editando}
                />
              </div>

              <div>
                <Label htmlFor="genero">Gênero</Label>
                <Select
                  value={dadosTemp.genero}
                  onChange={(e) => setDadosTemp({
                    ...dadosTemp,
                    genero: e.target.value as "masculino" | "feminino" | "outro"
                  })}
                  disabled={!editando}
                >
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outro">Outro</option>
                </Select>
              </div>
            </div>
          </Card>

          {/* Medidas e Objetivos */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Medidas e Objetivos</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="altura">Altura (cm)</Label>
                  <Input
                    id="altura"
                    type="number"
                    value={dadosTemp.altura}
                    onChange={(e) => setDadosTemp({
                      ...dadosTemp,
                      altura: Number(e.target.value)
                    })}
                    disabled={!editando}
                  />
                </div>
                <div>
                  <Label htmlFor="peso">Peso (kg)</Label>
                  <Input
                    id="peso"
                    type="number"
                    step="0.1"
                    value={dadosTemp.peso}
                    onChange={(e) => setDadosTemp({
                      ...dadosTemp,
                      peso: Number(e.target.value)
                    })}
                    disabled={!editando}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="nivelAtividade">Nível de Atividade</Label>
                <Select
                  value={dadosTemp.nivelAtividade}
                  onChange={(e) => setDadosTemp({
                    ...dadosTemp,
                    nivelAtividade: e.target.value as "sedentario" | "moderado" | "ativo" | "muito_ativo"
                  })}
                  disabled={!editando}
                >
                  <option value="sedentario">Sedentário</option>
                  <option value="moderado">Moderado</option>
                  <option value="ativo">Ativo</option>
                  <option value="muito_ativo">Muito Ativo</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="objetivo">Objetivo</Label>
                <Select
                  value={dadosTemp.objetivo}
                  onChange={(e) => setDadosTemp({
                    ...dadosTemp,
                    objetivo: e.target.value as "perda_peso" | "ganho_massa" | "manutencao" | "definicao"
                  })}
                  disabled={!editando}
                >
                  <option value="perda_peso">Perda de Peso</option>
                  <option value="ganho_massa">Ganho de Massa</option>
                  <option value="manutencao">Manutenção</option>
                  <option value="definicao">Definição</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="experiencia">Experiência com Treino</Label>
                <Select
                  value={dadosTemp.experienciaTreino}
                  onChange={(e) => setDadosTemp({
                    ...dadosTemp,
                    experienciaTreino: e.target.value as "iniciante" | "intermediario" | "avancado"
                  })}
                  disabled={!editando}
                >
                  <option value="iniciante">Iniciante</option>
                  <option value="intermediario">Intermediário</option>
                  <option value="avancado">Avançado</option>
                </Select>
              </div>
            </div>
          </Card>

          {/* Preferências */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Preferências</h2>
            <div className="space-y-4">
              <div>
                <Label>Dias de Treino</Label>
                <div className="grid grid-cols-7 gap-2">
                  {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((dia, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant={dadosTemp.diasTreino.includes(index) ? "default" : "outline"}
                      className="w-full"
                      onClick={() => {
                        if (editando) {
                          const novosDias = dadosTemp.diasTreino.includes(index)
                            ? dadosTemp.diasTreino.filter(d => d !== index)
                            : [...dadosTemp.diasTreino, index];
                          setDadosTemp({ ...dadosTemp, diasTreino: novosDias });
                        }
                      }}
                      disabled={!editando}
                    >
                      {dia}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Restrições Alimentares</Label>
                <div className="flex flex-wrap gap-2">
                  {['Glúten', 'Lactose', 'Vegano', 'Vegetariano'].map((restricao) => (
                    <Button
                      key={restricao}
                      type="button"
                      variant={dadosTemp.restricoesAlimentares.includes(restricao) ? "default" : "outline"}
                      onClick={() => {
                        if (editando) {
                          const novasRestricoes = dadosTemp.restricoesAlimentares.includes(restricao)
                            ? dadosTemp.restricoesAlimentares.filter(r => r !== restricao)
                            : [...dadosTemp.restricoesAlimentares, restricao];
                          setDadosTemp({ ...dadosTemp, restricoesAlimentares: novasRestricoes });
                        }
                      }}
                      disabled={!editando}
                    >
                      {restricao}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {editando && (
            <div className="flex justify-end space-x-4">
              <Button type="submit">
                Salvar Alterações
              </Button>
            </div>
          )}
        </form>

        {/* Histórico de Atualizações */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Histórico de Login</h2>
          <p className="text-gray-500">
            Último acesso em: {format(usuario.ultimoLogin, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
          </p>
        </Card>
      </div>
    </ProfileLayout>
  );
};

export default Profile; 