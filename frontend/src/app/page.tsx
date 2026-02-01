"use client";

import React, { useEffect } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Zap, Activity, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { xp, level, syncWithBackend } = useGameStore();
  
  const currentLevelBaseXp = (level - 1) * 1000;
  const xpInCurrentLevel = xp - currentLevelBaseXp;
  const xpNeededForNextLevel = 1000;
  const xpPercentage = (xpInCurrentLevel / xpNeededForNextLevel) * 100;

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/user/status`);
        if (res.ok) {
          const data = await res.json();
          syncWithBackend(data);
        }
      } catch (error) {
        console.error("Failed to sync with backend, using local data", error);
      }
    };
    fetchStatus();
  }, [syncWithBackend]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <MobileLayout title="Painel de Controle">
      <motion.div 
        className="space-y-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Driver Status Card */}
        <motion.div variants={item}>
          <Card className="border-primary/20 bg-card/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest flex items-center justify-between">
                <span>Status do Motorista</span>
                <Trophy className="text-primary h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end mb-2">
                <h2 className="text-2xl font-bold text-foreground">Nível {level}</h2>
                <span className="text-xs text-muted-foreground">{xpInCurrentLevel} / {xpNeededForNextLevel} XP</span>
              </div>
              <Progress value={xpPercentage} className="h-2 bg-muted" />
              <p className="text-xs text-muted-foreground mt-2">
                {level < 5 ? "Aprendiz da Mente" : level < 10 ? "Piloto Focado" : "Mestre da Mente"}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 gap-4">
          <motion.h3 
            variants={item}
            className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1"
          >
            Ferramentas de Ajuste
          </motion.h3>
          
          <motion.div variants={item}>
            <Link href="/turbo" className="block">
              <Button 
                variant="outline" 
                asChild
                className="w-full h-32 flex flex-col items-center justify-center space-y-2 border-primary/50 hover:bg-primary/10 hover:border-primary transition-all group p-0"
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full h-full flex flex-col items-center justify-center">
                  <Zap className="h-10 w-10 text-primary group-hover:scale-110 transition-transform mb-2" />
                  <div className="text-center">
                    <span className="block text-lg font-bold text-foreground">Modo Turbo</span>
                    <span className="text-xs text-muted-foreground">Foco Intenso (Pomodoro)</span>
                  </div>
                </motion.div>
              </Button>
            </Link>
          </motion.div>

          <motion.div variants={item}>
            <Link href="/scanner" className="block">
              <Button 
                variant="outline" 
                asChild
                className="w-full h-32 flex flex-col items-center justify-center space-y-2 border-primary/50 hover:bg-primary/10 hover:border-primary transition-all group p-0"
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full h-full flex flex-col items-center justify-center">
                  <Activity className="h-10 w-10 text-primary group-hover:scale-110 transition-transform mb-2" />
                  <div className="text-center">
                    <span className="block text-lg font-bold text-foreground">Scanner de Ruído</span>
                    <span className="text-xs text-muted-foreground">Dump Mental & Organização</span>
                  </div>
                </motion.div>
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Quick Stats or Tips */}
        <motion.div variants={item}>
          <Card className="border-border/50 bg-card/30">
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <p className="text-xs text-muted-foreground">
                Sistema operando nominalmente. Nenhuma anomalia detectada.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </MobileLayout>
  );
}
