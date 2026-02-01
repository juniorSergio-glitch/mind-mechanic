"use client";

import React, { useState } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { CheckSquare, Trash2, BrainCircuit, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { API_URL } from '@/lib/api';

interface Task {
  id: string;
  text: string;
  isCompleted: boolean;
}

export default function ScannerPage() {
  const [inputText, setInputText] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcessThought = async () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);
    
    try {
      const response = await fetch(`${API_URL}/scanner/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error('Falha ao processar');
      }

      const data = await response.json();
      // Map snake_case from python to camelCase if needed, or update interface
      // The backend returns { id, text, is_completed }
      const newTasks = data.map((t: any) => ({
        id: t.id,
        text: t.text,
        isCompleted: t.is_completed
      }));

      setTasks(prev => [...prev, ...newTasks]);
      setInputText('');
    } catch (error) {
      console.error("Erro ao processar:", error);
      alert("Erro ao conectar com o Scanner.");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
    ));
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleProcessThought();
    }
  };

  return (
    <MobileLayout title="Scanner de Ruído">
      <div className="flex flex-col h-full space-y-4">
        
        {/* Intro / Empty State */}
        {tasks.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4 opacity-70">
            <BrainCircuit className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground">
              Sua mente está cheia? <br/>
              "Vomite" seus pensamentos aqui e vamos organizá-los.
            </p>
          </div>
        )}

        {/* Task List */}
        {tasks.length > 0 && (
          <div className="flex-1 space-y-2 overflow-y-auto pb-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Processado ({tasks.filter(t => t.isCompleted).length}/{tasks.length})
            </h3>
            {tasks.map((task) => (
              <Card key={task.id} className={cn("transition-all duration-300", task.isCompleted ? "opacity-50 bg-card/30" : "bg-card")}>
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={cn("h-6 w-6 shrink-0 rounded-full border-2", task.isCompleted ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground")}
                      onClick={() => toggleTask(task.id)}
                    >
                      {task.isCompleted && <CheckSquare className="h-3 w-3" />}
                    </Button>
                    <span className={cn("text-sm truncate", task.isCompleted && "line-through text-muted-foreground")}>
                      {task.text}
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => removeTask(task.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="mt-auto bg-card border-t border-border p-4 -mx-4 -mb-4 sticky bottom-0">
          <div className="flex space-x-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite, use vírgulas para separar..."
              className="bg-background border-input focus-visible:ring-primary"
              disabled={isProcessing}
            />
            <Button 
              onClick={handleProcessThought} 
              disabled={isProcessing || !inputText.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isProcessing ? <BrainCircuit className="h-4 w-4 animate-pulse" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>

      </div>
    </MobileLayout>
  );
}
