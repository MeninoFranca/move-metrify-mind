import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useUser } from '@/contexts/UserContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  User, 
  Pencil, 
  Check, 
  X, 
  Camera, 
  LineChart, 
  Target, 
  History,
  Dumbbell,
  Calendar,
  Trophy,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface EditableFieldProps {
  value: string | number;
  onSave: (value: string | number) => void;
  type?: 'text' | 'number' | 'date';
  label?: string;
  className?: string;
  validation?: {
    min?: number;
    max?: number;
    required?: boolean;
    pattern?: RegExp;
  };
}

const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onSave,
  type = 'text',
  label,
  className,
  validation
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [error, setError] = useState<string>('');

  const validate = (val: string | number) => {
    if (validation) {
      if (validation.required && !val) {
        return 'Campo obrigatório';
      }
      if (type === 'number') {
        const numVal = Number(val);
        if (validation.min !== undefined && numVal < validation.min) {
          return `Valor mínimo: ${validation.min}`;
        }
        if (validation.max !== undefined && numVal > validation.max) {
          return `Valor máximo: ${validation.max}`;
        }
      }
      if (validation.pattern && !validation.pattern.test(String(val))) {
        return 'Formato inválido';
      }
    }
    return '';
  };

  const handleSave = () => {
    const validationError = validate(tempValue);
    if (validationError) {
      setError(validationError);
      return;
    }
    onSave(tempValue);
    setIsEditing(false);
    setError('');
  };

  return (
    <div className={cn("relative group", className)}>
      {label && <Label className="text-sm text-muted-foreground">{label}</Label>}
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <Input
              type={type}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className={cn("pr-20", error && "border-destructive")}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') {
                  setIsEditing(false);
                  setTempValue(value);
                  setError('');
                }
              }}
              autoFocus
            />
            <div className="absolute right-0 flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={handleSave}
                className="h-8 w-8"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setIsEditing(false);
                  setTempValue(value);
                  setError('');
                }}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <span className="py-2">{value}</span>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="opacity-0 group-hover:opacity-100 h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      {error && (
        <span className="text-xs text-destructive mt-1">{error}</span>
      )}
    </div>
  );
};

const Profile = () => {
  const { usuario, atualizarUsuario } = useUser();
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  if (!usuario) return null;

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploadingAvatar(true);
      // Simular upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setTimeout(() => {
          atualizarUsuario({
            foto: reader.result as string
          });
          setIsUploadingAvatar(false);
        }, 1000);
      };
      reader.readAsDataURL(file);
    }
  };

  const calcularIdade = (dataNascimento: Date) => {
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const m = hoje.getMonth() - dataNascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < dataNascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header do Perfil */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative group">
            <Avatar className="h-24 w-24">
              {usuario.foto ? (
                <AvatarImage src={usuario.foto} alt={usuario.nome} />
              ) : (
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              )}
            </Avatar>
            <label
              htmlFor="avatar-upload"
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
            >
              <Camera className="h-8 w-8 text-white" />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={isUploadingAvatar}
            />
          </div>
          <div className="flex-1">
            <EditableField
              value={usuario.nome}
              onSave={(valor) => atualizarUsuario({ nome: String(valor) })}
              className="mb-2"
              validation={{
                required: true,
                pattern: /^[a-zA-ZÀ-ÿ\s]{2,50}$/
              }}
            />
            <p className="text-sm text-muted-foreground">
              {usuario.email} • Membro desde {format(usuario.ultimoLogin, 'MMMM yyyy', { locale: ptBR })}
            </p>
          </div>
        </div>

        {/* Tabs de Conteúdo */}
        <Tabs defaultValue="dados" className="space-y-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="dados" className="flex gap-2">
              <User className="h-4 w-4" />
              Dados Pessoais
            </TabsTrigger>
            <TabsTrigger value="objetivos" className="flex gap-2">
              <Target className="h-4 w-4" />
              Objetivos
            </TabsTrigger>
            <TabsTrigger value="historico" className="flex gap-2">
              <History className="h-4 w-4" />
              Histórico
            </TabsTrigger>
          </TabsList>

          {/* Tab: Dados Pessoais */}
          <TabsContent value="dados">
            <Card className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Label>Data de Nascimento</Label>
                  <EditableField
                    value={format(usuario.dataNascimento, 'yyyy-MM-dd')}
                    type="date"
                    onSave={(valor) => {
                      const data = new Date(String(valor));
                      const idade = calcularIdade(data);
                      if (idade < 13 || idade > 100) {
                        return;
                      }
                      atualizarUsuario({ dataNascimento: data });
                    }}
                  />
                </div>

                <div>
                  <Label>Gênero</Label>
                  <Select
                    value={usuario.genero}
                    onValueChange={(valor: "masculino" | "feminino" | "outro") => 
                      atualizarUsuario({ genero: valor })
                    }
                  >
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="outro">Outro</option>
                  </Select>
                </div>

                <div>
                  <Label>Peso (kg)</Label>
                  <EditableField
                    value={usuario.peso}
                    type="number"
                    onSave={(valor) => atualizarUsuario({ peso: Number(valor) })}
                    validation={{
                      required: true,
                      min: 30,
                      max: 300
                    }}
                  />
                </div>

                <div>
                  <Label>Altura (cm)</Label>
                  <EditableField
                    value={usuario.altura}
                    type="number"
                    onSave={(valor) => atualizarUsuario({ altura: Number(valor) })}
                    validation={{
                      required: true,
                      min: 120,
                      max: 250
                    }}
                  />
                </div>

                <div>
                  <Label>Nível de Atividade</Label>
                  <Select
                    value={usuario.nivelAtividade}
                    onValueChange={(valor: "sedentario" | "moderado" | "ativo" | "muito_ativo") => 
                      atualizarUsuario({ nivelAtividade: valor })
                    }
                  >
                    <option value="sedentario">Sedentário</option>
                    <option value="moderado">Moderado</option>
                    <option value="ativo">Ativo</option>
                    <option value="muito_ativo">Muito Ativo</option>
                  </Select>
                </div>

                <div>
                  <Label>Experiência com Treino</Label>
                  <Select
                    value={usuario.experienciaTreino}
                    onValueChange={(valor: "iniciante" | "intermediario" | "avancado") => 
                      atualizarUsuario({ experienciaTreino: valor })
                    }
                  >
                    <option value="iniciante">Iniciante</option>
                    <option value="intermediario">Intermediário</option>
                    <option value="avancado">Avançado</option>
                  </Select>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Tab: Objetivos */}
          <TabsContent value="objetivos">
            <Card className="p-6">
              <div className="grid gap-6">
                <div>
                  <Label>Objetivo Principal</Label>
                  <Select
                    value={usuario.objetivo}
                    onValueChange={(valor: "perda_peso" | "ganho_massa" | "manutencao" | "definicao") => 
                      atualizarUsuario({ objetivo: valor })
                    }
                  >
                    <option value="perda_peso">Perda de Peso</option>
                    <option value="ganho_massa">Ganho de Massa</option>
                    <option value="manutencao">Manutenção</option>
                    <option value="definicao">Definição</option>
                  </Select>
                </div>

                <div>
                  <Label>Equipamentos Disponíveis</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['academia', 'casa', 'elásticos', 'halteres', 'nenhum'].map((equip) => (
                      <Button
                        key={equip}
                        variant={usuario.equipamentosDisponiveis.includes(equip) ? "default" : "outline"}
                        onClick={() => {
                          const novosEquipamentos = usuario.equipamentosDisponiveis.includes(equip)
                            ? usuario.equipamentosDisponiveis.filter(e => e !== equip)
                            : [...usuario.equipamentosDisponiveis, equip];
                          atualizarUsuario({ equipamentosDisponiveis: novosEquipamentos });
                        }}
                        className="capitalize"
                      >
                        {equip}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Dias de Treino</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia, index) => (
                      <Button
                        key={dia}
                        variant={usuario.diasTreino.includes(index) ? "default" : "outline"}
                        onClick={() => {
                          const novosDias = usuario.diasTreino.includes(index)
                            ? usuario.diasTreino.filter(d => d !== index)
                            : [...usuario.diasTreino, index];
                          atualizarUsuario({ diasTreino: novosDias });
                        }}
                      >
                        {dia}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Restrições Alimentares</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['Glúten', 'Lactose', 'Vegano', 'Vegetariano'].map((restricao) => (
                      <Button
                        key={restricao}
                        variant={usuario.restricoesAlimentares.includes(restricao) ? "default" : "outline"}
                        onClick={() => {
                          const novasRestricoes = usuario.restricoesAlimentares.includes(restricao)
                            ? usuario.restricoesAlimentares.filter(r => r !== restricao)
                            : [...usuario.restricoesAlimentares, restricao];
                          atualizarUsuario({ restricoesAlimentares: novasRestricoes });
                        }}
                      >
                        {restricao}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Tab: Histórico */}
          <TabsContent value="historico">
            <div className="grid gap-6">
              {/* Cards de Estatísticas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Dumbbell className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total de Treinos</p>
                      <p className="text-2xl font-bold">48</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Dias Consecutivos</p>
                      <p className="text-2xl font-bold">7</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Trophy className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Conquistas</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Gráfico de Evolução */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Evolução de Peso</h3>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Gráfico será implementado aqui
                </div>
              </Card>

              {/* Últimas Atividades */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Últimas Atividades</h3>
                <div className="space-y-4">
                  {[
                    { data: '2024-03-15', tipo: 'treino', desc: 'Completou treino de força' },
                    { data: '2024-03-14', tipo: 'peso', desc: 'Registrou novo peso: 75kg' },
                    { data: '2024-03-13', tipo: 'meta', desc: 'Atingiu meta de hidratação' }
                  ].map((atividade, i) => (
                    <div key={i} className="flex items-center gap-4 py-2 border-b last:border-0">
                      <div className="p-2 bg-muted rounded-full">
                        <Activity className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{atividade.desc}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(atividade.data), "dd 'de' MMMM", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Profile; 