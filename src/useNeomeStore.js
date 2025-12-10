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

  addTask: (taskName) => {
    set({tasks: [...get().tasks, {
      name: taskName,
      isPinned: false,
      id: crypto.randomUUID(),
    }]});
  },

  removeTask: (taskId) => {
    set({
      tasks: get().tasks.filter((task) => task.id !== taskId)
    });
  },

  taskTogglePinned: (taskId) => {
    set({
      tasks: get().tasks.map(
        (task) => (task.id === taskId) ? {...task, isPinned: !task.isPinned} : task
      ),
    });
  }

}), {
    name: 'neome',
    version: 0.13,
    migrate: (state, oldVersion) => {
      // Don't worry, these are temporary migrations, until I make a stable version
      if (oldVersion < 0.11) {
        for (let i = 0; i < state.tasks.length; i++) {
          const e = state.tasks[i];
          state.tasks[i] = {name: e, isPinned: true};
        }
      }

      if (oldVersion < 0.12) {
        for (let i = 0; i < state.tasks.length; i++) {
          const e = state.tasks[i];
          state.tasks[i] = {name: e.name, isPinned: false};
        }
      }

      if (oldVersion < 0.13) {
        for (let i = 0; i < state.tasks.length; i++) {
          const e = state.tasks[i];
          state.tasks[i] = {...e, id: crypto.randomUUID()};
        }
      }

      return state;
    }
}));

export default useNeomeStore;
