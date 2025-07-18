import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useUser } from '@/contexts/UserContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import ProfileLayout from '@/layouts/ProfileLayout';

const Settings = () => {
  const {
    configuracoes,
    atualizarConfiguracoes,
    fazerBackup,
    restaurarBackup,
    exportarDados,
    apagarConta
  } = useUser();

  if (!configuracoes) return null;

  return (
    <ProfileLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Configurações</h1>

        {/* Notificações */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Notificações</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotif">Notificações por Email</Label>
              <Switch
                id="emailNotif"
                checked={configuracoes.notificacoes.email}
                onCheckedChange={(checked) => atualizarConfiguracoes({
                  notificacoes: { ...configuracoes.notificacoes, email: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="pushNotif">Notificações Push</Label>
              <Switch
                id="pushNotif"
                checked={configuracoes.notificacoes.push}
                onCheckedChange={(checked) => atualizarConfiguracoes({
                  notificacoes: { ...configuracoes.notificacoes, push: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="reminderNotif">Lembretes</Label>
              <Switch
                id="reminderNotif"
                checked={configuracoes.notificacoes.lembretes}
                onCheckedChange={(checked) => atualizarConfiguracoes({
                  notificacoes: { ...configuracoes.notificacoes, lembretes: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="updateNotif">Atualizações do App</Label>
              <Switch
                id="updateNotif"
                checked={configuracoes.notificacoes.atualizacoes}
                onCheckedChange={(checked) => atualizarConfiguracoes({
                  notificacoes: { ...configuracoes.notificacoes, atualizacoes: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="marketingNotif">Marketing</Label>
              <Switch
                id="marketingNotif"
                checked={configuracoes.notificacoes.marketing}
                onCheckedChange={(checked) => atualizarConfiguracoes({
                  notificacoes: { ...configuracoes.notificacoes, marketing: checked }
                })}
              />
            </div>
          </div>
        </Card>

        {/* Privacidade */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Privacidade</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="publicProfile">Perfil Público</Label>
              <Switch
                id="publicProfile"
                checked={configuracoes.privacidade.perfilPublico}
                onCheckedChange={(checked) => atualizarConfiguracoes({
                  privacidade: { ...configuracoes.privacidade, perfilPublico: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="shareProgress">Compartilhar Progresso</Label>
              <Switch
                id="shareProgress"
                checked={configuracoes.privacidade.compartilharProgresso}
                onCheckedChange={(checked) => atualizarConfiguracoes({
                  privacidade: { ...configuracoes.privacidade, compartilharProgresso: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="showStats">Mostrar Estatísticas</Label>
              <Switch
                id="showStats"
                checked={configuracoes.privacidade.mostrarEstatisticas}
                onCheckedChange={(checked) => atualizarConfiguracoes({
                  privacidade: { ...configuracoes.privacidade, mostrarEstatisticas: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="allowMentions">Permitir Menções</Label>
              <Switch
                id="allowMentions"
                checked={configuracoes.privacidade.permitirMencoes}
                onCheckedChange={(checked) => atualizarConfiguracoes({
                  privacidade: { ...configuracoes.privacidade, permitirMencoes: checked }
                })}
              />
            </div>
          </div>
        </Card>

        {/* Preferências */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Preferências</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="theme">Tema</Label>
              <Select
                value={configuracoes.preferencias.tema}
                onChange={(e) => atualizarConfiguracoes({
                  preferencias: { ...configuracoes.preferencias, tema: e.target.value as "claro" | "escuro" | "sistema" }
                })}
              >
                <option value="claro">Claro</option>
                <option value="escuro">Escuro</option>
                <option value="sistema">Sistema</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="units">Unidade de Medida</Label>
              <Select
                value={configuracoes.preferencias.unidadeMedida}
                onChange={(e) => atualizarConfiguracoes({
                  preferencias: { ...configuracoes.preferencias, unidadeMedida: e.target.value as "metrico" | "imperial" }
                })}
              >
                <option value="metrico">Métrico (kg, cm)</option>
                <option value="imperial">Imperial (lb, in)</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="dateFormat">Formato de Data</Label>
              <Select
                value={configuracoes.preferencias.formatoData}
                onChange={(e) => atualizarConfiguracoes({
                  preferencias: { ...configuracoes.preferencias, formatoData: e.target.value as "dd/MM/yyyy" | "MM/dd/yyyy" }
                })}
              >
                <option value="dd/MM/yyyy">DD/MM/AAAA</option>
                <option value="MM/dd/yyyy">MM/DD/AAAA</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="timeFormat">Formato de Hora</Label>
              <Select
                value={configuracoes.preferencias.formatoHora}
                onChange={(e) => atualizarConfiguracoes({
                  preferencias: { ...configuracoes.preferencias, formatoHora: e.target.value as "12h" | "24h" }
                })}
              >
                <option value="12h">12 horas (AM/PM)</option>
                <option value="24h">24 horas</option>
              </Select>
            </div>
          </div>
        </Card>

        {/* Backup e Dados */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Backup e Dados</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="autoBackup">Backup Automático</Label>
              <Switch
                id="autoBackup"
                checked={configuracoes.backup.automatico}
                onCheckedChange={(checked) => atualizarConfiguracoes({
                  backup: { ...configuracoes.backup, automatico: checked }
                })}
              />
            </div>

            <div>
              <Label htmlFor="backupFreq">Frequência de Backup</Label>
              <Select
                value={configuracoes.backup.frequencia}
                onChange={(e) => atualizarConfiguracoes({
                  backup: { ...configuracoes.backup, frequencia: e.target.value as "diario" | "semanal" | "mensal" }
                })}
              >
                <option value="diario">Diário</option>
                <option value="semanal">Semanal</option>
                <option value="mensal">Mensal</option>
              </Select>
            </div>

            <div className="pt-4 space-y-2">
              <Button onClick={fazerBackup} className="w-full">
                Fazer Backup Manual
              </Button>

              <Button onClick={restaurarBackup} variant="outline" className="w-full">
                Restaurar Backup
              </Button>

              <Button onClick={exportarDados} variant="outline" className="w-full">
                Exportar Dados
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    Apagar Conta
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso irá apagar permanentemente sua conta
                      e remover seus dados de nossos servidores.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={apagarConta}>
                      Apagar Conta
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </Card>
      </div>
    </ProfileLayout>
  );
};

export default Settings; 