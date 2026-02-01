"use client";

import React, { useState, useEffect } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFocusSession } from '@/hooks/useFocusSession';
import { playBeep } from '@/lib/sounds';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function TurboPage() {
  const router = useRouter();
  const { saveSession } = useFocusSession();
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState<'focus' | 'break'>('focus');
  const [progress, setProgress] = useState(100);

  const totalTime = sessionType === 'focus' ? 25 * 60 : 5 * 60;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          setProgress((newTime / totalTime) * 100);
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      handleSessionComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, totalTime]);

  const handleSessionComplete = async () => {
    playBeep();
    if (sessionType === 'focus') {
      const duration = 25; 
      const result = await saveSession(duration);
      if (result) {
        setTimeout(() => {
           router.push('/');
        }, 1500); // Wait a bit for the user to hear the sound and see toast
      }
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(totalTime);
    setProgress(100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <MobileLayout title="Modo Turbo">
      <motion.div 
        className="flex flex-col items-center justify-center h-full space-y-8 py-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        
        {/* Status Indicator */}
        <div className="text-center space-y-2">
          <h2 className={cn(
            "text-3xl font-bold uppercase tracking-widest",
            sessionType === 'focus' ? "text-primary" : "text-blue-400"
          )}>
            {sessionType === 'focus' ? 'Foco Total' : 'Pausa Rápida'}
          </h2>
          <p className="text-muted-foreground text-sm">
            {isActive ? 'Mantenha o ritmo...' : 'Pronto para iniciar?'}
          </p>
        </div>

        {/* Circular Progress Timer */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg className="absolute w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-muted/20"
            />
            <motion.circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * ((100 - progress) / 100)}
              className={cn(
                sessionType === 'focus' ? "text-primary drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]" : "text-blue-400"
              )}
              strokeLinecap="round"
              initial={{ strokeDashoffset: 2 * Math.PI * 120 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 120 * ((100 - progress) / 100) }}
              transition={{ duration: 1, ease: "linear" }} // Smooth 1s update
            />
          </svg>
          
          <div className="text-6xl font-mono font-bold tracking-tighter text-foreground z-10">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-6">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="outline"
              size="icon"
              className="h-16 w-16 rounded-full border-2 border-muted hover:border-destructive hover:text-destructive hover:bg-destructive/10 transition-all"
              onClick={resetTimer}
            >
              <RotateCcw className="h-6 w-6" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant={isActive ? "secondary" : "default"}
              size="icon"
              className={cn(
                "h-24 w-24 rounded-full shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all",
                isActive ? "bg-muted text-foreground hover:bg-muted/80" : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
              onClick={toggleTimer}
            >
              {isActive ? <Pause className="h-10 w-10 fill-current" /> : <Play className="h-10 w-10 fill-current ml-1" />}
            </Button>
          </motion.div>
        </div>

      </motion.div>
    </MobileLayout>
  );
}
