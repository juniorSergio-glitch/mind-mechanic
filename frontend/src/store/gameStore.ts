import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
  xp: number;
  level: number;
  totalSessions: number;
  addXp: (amount: number) => void;
  incrementSessions: () => void;
  syncWithBackend: (backendData: { xp: number; level: number; total_sessions: number }) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      xp: 0,
      level: 1,
      totalSessions: 0,
      addXp: (amount) => set((state) => {
        const newXp = state.xp + amount;
        const newLevel = 1 + Math.floor(newXp / 1000);
        return { xp: newXp, level: newLevel };
      }),
      incrementSessions: () => set((state) => ({ totalSessions: state.totalSessions + 1 })),
      syncWithBackend: (data) => set({
        xp: data.xp,
        level: data.level,
        totalSessions: data.total_sessions
      }),
    }),
    {
      name: 'mecanica-mente-storage', // name of the item in the storage (must be unique)
    }
  )
);
