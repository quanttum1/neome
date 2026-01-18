import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { now } from "./utc";
import { createNewTaskEvent } from "./factories/createEvents";

function compareEvents(a: NeomeEvent, b: NeomeEvent): number {
  if (a.time < b.time) return -1;
  if (a.time > b.time) return 1;
  return a.id.localeCompare(b.id); // tie-breaker, just in case
}

function getRelevantEventsSorted(store: NeomeStore) {
  return store.events.filter(e => e.time < now()).sort(compareEvents);
}

function assertEventHandled(x: never): never {
  throw new Error(`Unhandled event: ${JSON.stringify(x)}`);
}

function applyEvent(event: NeomeEvent, state: State): State {
  switch (event.type) {
    case "NEW_TASK":
      state.tasks.push(event.task);
      return state;

    case "TASK_COMPLETED":
      state.tasks = state.tasks.filter(e => e.id != event.taskId);
      return state;

    default:
      return assertEventHandled(event);
  }
}

const initialState: State = {
  totalCarrots: 0,
  dailyCarrots: 0,
  progress: 0,

  tasks: [],
};

const useNeomeStore = create<NeomeStore>()(
  persist(
    (set, get) => ({
      events: [],

      currentState: initialState,

      updateCurrentState: () => {
        // TODO(2026-01-18 20:18:40): updateCurrentState
        get().recomputeCurrentState();
      },

      recomputeCurrentState: () => {
        let state = initialState;

        for (const e of getRelevantEventsSorted(get())) {
          state = applyEvent(e, state);
        }

        set({ currentState: state, stateLastUpdated: now() });
      },

      addTask: (task: Task) => {
        set({
          // TODO(2026-01-18 19:38): create a future Task with deadline
          events: [...get().events, createNewTaskEvent(task)],
        });
        get().updateCurrentState();
      },

      getSortedTasks: () => {
        // TODO(2026-01-18 20:18:31): getSortedTasks
        return get().currentState.tasks;
      },

      getTaskById: (id) => {
        return get().currentState.tasks.filter(t => t.id == id)[0];
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
