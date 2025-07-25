import React from 'react';
import { useProgress } from '@/contexts/ProgressContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Droplets, Plus, Loader2 } from 'lucide-react';

const HydrationCard = () => {
    const { hydrationToday, addWater, isLoading } = useProgress();

    if (isLoading || !hydrationToday) {
        return (
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Hidratação</CardTitle>
                    <Droplets className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    const { consumed_ml, daily_goal_ml } = hydrationToday;
    const progress = daily_goal_ml > 0 ? Math.min(Math.round((consumed_ml / daily_goal_ml) * 100), 100) : 0;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hidratação</CardTitle>
                <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-2xl font-bold">{consumed_ml}ml / {daily_goal_ml}ml</div>
                <Progress value={progress} />
                <div className="flex justify-between gap-2">
                    <Button size="sm" variant="outline" onClick={() => addWater(250)}>
                        <Plus className="h-4 w-4 mr-1" /> Copo (250ml)
                    </Button>
                     <Button size="sm" variant="outline" onClick={() => addWater(500)}>
                        <Plus className="h-4 w-4 mr-1" /> Garrafa (500ml)
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default HydrationCard;