import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { now } from "./utc";
import { createNewTaskEvent } from "./factories/createEvents";
import { createTaskCompletedEvent } from "./factories/createEvents";

function compareEvents(a: NeomeEvent, b: NeomeEvent): number {
  if (a.time < b.time) return -1;
  if (a.time > b.time) return 1;
  return a.id.localeCompare(b.id); // tie-breaker, just in case
}

function getRelevantEventsSorted(store: NeomeStore) {
  return store.events.filter(e => e.time <= now()).sort(compareEvents);
}

function getTaskById(id: TaskId, state: State) {
  return state.tasks.filter(t => t.id == id)[0];
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
      const task = getTaskById(event.taskId, state);
      if (task == undefined) {
        return state; // The event has already been completed
      }

      state.dailyCarrots += task.reward;
      state.totalCarrots += task.reward;

      state.tasks = state.tasks.filter(e => e.id != event.taskId);
      return state;

    default:
      return assertEventHandled(event);
  }
}

function getInitialState(): State {
  return {
    totalCarrots: 0,
    dailyCarrots: 0,
    progress: 0,

    tasks: [],
  };
}

const useNeomeStore = create<NeomeStore>()(
  persist(
    (set, get) => ({
      events: [],

      currentState: getInitialState(),

      updateCurrentState: () => {
        // TODO(2026-01-18 20:18:40): updateCurrentState
        get().recomputeCurrentState();
      },

      recomputeCurrentState: () => {
        let state = getInitialState();

        for (const e of getRelevantEventsSorted(get())) {
          state = applyEvent(e, state);
        }

        set({ currentState: state, stateLastUpdated: now() });
      },

      addEvents: (events) => {
        set({
          events: [...get().events, ...events],
        });
        get().updateCurrentState();
      },

      addTask: (task: Task) => {
        // TODO(2026-01-18 19:38): create a future Task with deadline
        get().addEvents([createNewTaskEvent(task)]);
      },

      completeTask: (id) => {
        get().addEvents([createTaskCompletedEvent(id)]);
      },

      getSortedTasks: () => {
        // TODO(2026-01-18 20:18:31): getSortedTasks
        return get().currentState.tasks;
      },

      getTaskById: (id) => {
        return getTaskById(id, get().currentState);
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
