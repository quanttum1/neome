import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useNeomeStore = create(persist((set, get) => ({
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
      progress: Math.max(newTotal, get().progress)
    });
  },

  loseCarrots: (n) => {
    const newTotal = Math.max(0, get().daily - n);

    set({
      total: newTotal,
      daily: get().daily - (get().total - newTotal),
    })
  },

  tasks: [],

  addTask: (task) => {
    set({tasks: [...get().tasks, task]});
  },

  removeTask: (taskIndex) => {
    const newTasks = get().tasks;
    newTasks.splice(taskIndex, 1);
    set({tasks: newTasks})
  }
}), { name: 'neome' }));

export default useNeomeStore;
