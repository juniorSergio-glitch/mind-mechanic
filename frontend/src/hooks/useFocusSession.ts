import { useState } from 'react';
import { toast } from 'sonner';
import { useGameStore } from '@/store/gameStore';

const API_URL = 'http://localhost:8000';

interface FocusSession {
  id: string;
  duration_minutes: number;
  completed_at: string;
  xp_earned: number;
}

export function useFocusSession() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addXp, incrementSessions } = useGameStore();

  const saveSession = async (durationMinutes: number): Promise<FocusSession | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ duration_minutes: durationMinutes }),
      });

      if (!response.ok) {
        throw new Error('Falha ao comunicar com o servidor');
      }

      const data = await response.json();
      
      // Update local store immediately for instant feedback
      addXp(data.xp_earned);
      incrementSessions();

      toast.success(`Sessão salva! +${data.xp_earned} XP`, {
        description: "Continue acelerando!",
      });
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro de conexão';
      setError(msg);
      
      // Even if backend fails, we could opt to update local state optimistically, 
      // but for now let's just warn the user.
      toast.error("Erro ao salvar sessão", {
        description: "Verifique sua conexão. O progresso será salvo localmente (em breve).",
      });
      console.error('Erro ao salvar sessão:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { saveSession, loading, error };
}
