import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '@/contexts/WorkoutContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, Pause, SkipForward, Check, RefreshCw } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useTimer } from '@/hooks/useTimer'; // <-- Importando nosso novo hook

type WorkoutState = 'exercising' | 'resting' | 'paused' | 'finished';

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const WorkoutExecution = () => {
    const navigate = useNavigate();
    const { currentGeneratedWorkout, setCurrentGeneratedWorkout } = useWorkout();
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [workoutState, setWorkoutState] = useState<WorkoutState>('paused');

    const currentExercise = currentGeneratedWorkout?.exercises[currentExerciseIndex];

    const handleNextExercise = () => {
        if (currentGeneratedWorkout && currentExerciseIndex < currentGeneratedWorkout.exercises.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1);
            setWorkoutState('paused');
        } else {
            handleWorkoutFinished();
        }
    };
    
    const handleWorkoutFinished = () => {
        setWorkoutState('finished');
        // A lógica de salvar o treino iria aqui
        alert("Treino Concluído! Parabéns!");
        setCurrentGeneratedWorkout(null);
        navigate('/dashboard');
    }

    const restTimer = useTimer(currentExercise?.restTime || 60, handleNextExercise);

    useEffect(() => {
        if (!currentGeneratedWorkout) {
            navigate('/workouts');
        }
    }, [currentGeneratedWorkout, navigate]);
    
    if (!currentGeneratedWorkout || !currentExercise) {
        return <DashboardLayout><div>Carregando treino...</div></DashboardLayout>;
    }

    const workoutProgress = ((currentExerciseIndex) / currentGeneratedWorkout.exercises.length) * 100;
    const nextExercise = currentGeneratedWorkout.exercises[currentExerciseIndex + 1];

    const handlePlayPause = () => {
        if (workoutState === 'paused') {
            setWorkoutState('exercising');
            // Aqui você poderia iniciar um timer de exercício se houvesse um
        } else if (workoutState === 'exercising') {
            setWorkoutState('paused');
        } else if(workoutState === 'resting') {
            restTimer.pause();
            setWorkoutState('paused');
        }
    };
    
    const handleFinishSet = () => {
        if(currentExercise.restTime && currentExercise.restTime > 0) {
            setWorkoutState('resting');
            restTimer.start();
        } else {
            handleNextExercise();
        }
    }

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex items-center justify-between">
                    <Button variant="ghost" onClick={() => navigate(-1)}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                    </Button>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">{currentGeneratedWorkout.name}</h1>
                        <p className="text-muted-foreground">Exercício {currentExerciseIndex + 1} de {currentGeneratedWorkout.exercises.length}</p>
                    </div>
                    <div className="w-24"></div>
                </div>

                <Progress value={workoutProgress} className="mb-8" />
                
                {/* Tela principal dependendo do estado */}
                {workoutState === 'resting' ? (
                     <Card className="mb-8 bg-blue-500/5 border-blue-500 text-center">
                        <CardHeader>
                            <CardTitle className="text-3xl text-blue-500">Descanso</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-8xl font-bold mb-4">{formatTime(restTimer.secondsLeft)}</div>
                             {nextExercise && (
                                <p className="text-muted-foreground">A seguir: <span className="font-semibold">{nextExercise.exercise.name}</span></p>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-center">
                             <Button size="lg" variant="secondary" onClick={handleNextExercise}>
                                <SkipForward className="h-6 w-6" />
                                <span className="ml-2">Pular Descanso</span>
                            </Button>
                        </CardFooter>
                    </Card>
                ) : (
                    <Card className="mb-8 bg-primary/5 border-primary">
                        <CardHeader>
                            <CardTitle className="text-3xl text-primary">{currentExercise.exercise.name}</CardTitle>
                            <CardDescription>{currentExercise.exercise.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col md:flex-row items-center gap-8">
                             <div className="w-full md:w-1/2 h-64 bg-muted rounded-lg flex items-center justify-center">
                                <p>Imagem/Vídeo Aqui</p>
                            </div>
                            <div className="space-y-4 text-center md:text-left">
                                <div className="text-6xl font-bold">{currentExercise.sets}x{currentExercise.reps}</div>
                                {currentExercise.duration && <div className="text-2xl">{currentExercise.duration} min</div>}
                            </div>
                        </CardContent>
                    </Card>
                )}
                
                {/* Controles do Player */}
                <div className="flex items-center justify-center space-x-4">
                    <Button size="lg" variant="secondary" onClick={handlePlayPause} disabled={workoutState === 'resting'}>
                        {workoutState === 'paused' ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
                        <span className="ml-2">{workoutState === 'paused' ? 'Continuar' : 'Pausar'}</span>
                    </Button>
                    <Button size="lg" variant="default" onClick={handleFinishSet} disabled={workoutState !== 'exercising'}>
                        <Check className="h-6 w-6" />
                        <span className="ml-2">Concluir Série</span>
                    </Button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default WorkoutExecution;