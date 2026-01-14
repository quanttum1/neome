import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useNeomeStore = create<NeomeStore>()(
  persist(
    (set, get) => ({
      // Should it be renamed to totalCarrots and dailyCarrots?
      total: 0,
      daily: 0,
      progress: 0, // The same as total, but it doesn't decrease when you lose carrots

      resetDaily: () => set({ daily: 0 }),

      addCarrots: (n) => {
        const newDaily = Math.min(10, get().daily + n);
        const newTotal = get().total + (newDaily - get().daily);

        set({
          total: newTotal,
          daily: newDaily,
          progress: Math.max(newTotal, get().progress),
        });
      },

      loseCarrots: (n) => {
        const newTotal = Math.max(0, get().daily - n);

        set({
          total: newTotal,
          daily: get().daily - (get().total - newTotal),
        });
      },

      tasks: [],

      addTask: (task) => {
        set({
          tasks: [
            ...get().tasks,
            task,
          ],
        });
      },

      removeTask: (taskId) => {
        set({
          tasks: get().tasks.filter((task) => task.id !== taskId),
        });
      },

      taskTogglePinned: (taskId) => {
        set({
          tasks: get().tasks.map((task) =>
            task.id === taskId
              ? { ...task, isPinned: !task.isPinned }
              : task
          ),
        });
      },
    }),
    {
      name: 'neome',
      version: 0.16,
      migrate: (state, oldVersion) => {
        return state as NeomeStore;
      },
    }
  )
);

export default useNeomeStore;
