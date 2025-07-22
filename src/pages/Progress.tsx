// src/pages/Progress.tsx
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProgress } from '@/contexts/ProgressContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Scale, Target, Activity, Trophy, Calendar, ChevronRight } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';

type WeightFormInput = {
    weight_kg: number;
    recorded_date: string;
};

const Progress = () => {
    const { registros, metas, estatisticas, isLoading, adicionarRegistro } = useProgress();
    const { register, handleSubmit, reset } = useForm<WeightFormInput>();

    const dadosGrafico = registros.map(registro => ({
        // Formata a data para melhor visualização no gráfico
        data: new Date(registro.recorded_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
        peso: registro.weight_kg,
    }));

    const onAddWeight: SubmitHandler<WeightFormInput> = async (data) => {
        await adicionarRegistro({
            weight_kg: Number(data.weight_kg),
            recorded_date: new Date(data.recorded_date).toISOString(),
            notes: null // ou adicione um campo de notas
        });
        reset(); // Limpa o formulário após o envio
    };
    
    if (isLoading) {
        return <DashboardLayout><div>Carregando progresso...</div></DashboardLayout>
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Seu Progresso</h2>

                {/* Cards de Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* ... os cards de estatísticas podem ser mantidos como estão ... */}
                    <Card><CardHeader><CardTitle className="flex items-center gap-2"><Scale className="h-5 w-5" />Média de Peso</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{estatisticas.mediaPeso?.toFixed(1) ?? 0} kg</p></CardContent></Card>
                    <Card><CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" />Dias Treinados</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{estatisticas.diasTreinados ?? 0}</p></CardContent></Card>
                    <Card><CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5" />Metas Concluídas</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{estatisticas.metasConcluidas ?? 0}</p></CardContent></Card>
                    <Card><CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />Metas Ativas</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{estatisticas.metasEmAndamento ?? 0}</p></CardContent></Card>
                </div>
                
                {/* Gráfico e Adição de Registro */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                        <CardHeader><CardTitle>Evolução de Peso</CardTitle></CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                {registros.length > 0 ? (
                                    <LineChart data={dadosGrafico} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="data" />
                                        <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="peso" stroke="#8884d8" name="Peso (kg)" activeDot={{ r: 8 }} />
                                    </LineChart>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                        Adicione seu primeiro registro de peso para ver o gráfico.
                                    </div>
                                )}
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Adicionar Novo Peso</CardTitle></CardHeader>
                        <form onSubmit={handleSubmit(onAddWeight)}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="weight_kg">Peso (kg)</Label>
                                    <Input id="weight_kg" type="number" step="0.1" required {...register("weight_kg")} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="recorded_date">Data</Label>
                                    <Input id="recorded_date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} {...register("recorded_date")} />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" className="w-full">Salvar Registro</Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>

                {/* Metas Ativas */}
                <Card>
                    <CardHeader><CardTitle>Metas Ativas</CardTitle></CardHeader>
                    <CardContent>
                        {metas.length > 0 ? (
                            <div className="space-y-4">
                                {metas.filter(meta => !meta.is_active || meta.current_value < meta.target_value).map((meta) => (
                                    <div key={meta.id} className="p-4 rounded-lg border">
                                        {/* ... Renderização da meta ... */}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">Você ainda não tem metas ativas.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default Progress;