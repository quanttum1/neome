import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { now } from "./utc";
import { createTaskAndDeadlineEvents } from "./factories/createEvents";
import { createTaskCompletedEvent } from "./factories/createEvents";
import { createTaskPinToggleEvent } from "./factories/createEvents";
import { produce } from "immer";

function compareEvents(a: NeomeEvent, b: NeomeEvent): number {
  if (a.time < b.time) return -1;
  if (a.time > b.time) return 1;
  return a.id.localeCompare(b.id); // tie-breaker, just in case
}

function getRelevantEventsSorted(store: NeomeStore) {
  return store.events.filter(e => e.time <= now()).sort(compareEvents);
}

function getTaskIndexById(id: TaskId, state: State) {
  return state.tasks.findIndex(t => t.id === id);
}

function getTaskById(id: TaskId, state: State) {
  return state.tasks.find(t => t.id == id);
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(n, max));
}

// Despite the name it can be used to both add and subtract the carrots
function addCarrots(delta: number, state: State) {
  // You never lose or gain more than 10 carrots per day
  const clampedDaily = clamp(state.dailyCarrots + delta, -10, 10);
  const totalCarrotsBefore = state.totalCarrots;

  // Adjust totalCarrots to match the actual clamped gain/loss
  state.totalCarrots += (clampedDaily - state.dailyCarrots);

  // totalCarrots never go below 0
  state.totalCarrots = Math.max(state.totalCarrots, 0);

  // If we floored totalCarrots, we need to adjust dailyCarrots to match the actual loss
  state.dailyCarrots += (state.totalCarrots - totalCarrotsBefore);

  // progress never descreases
  state.progress = Math.max(state.progress, state.totalCarrots);
}

function assertEventHandled(x: never): never {
  throw new Error(`Unhandled event: ${JSON.stringify(x)}`);
}

function applyEvent(event: NeomeEvent, state: State): State {
  // They told that in high-level languages like JS we don't need to think about memory
  // management. So here we go. We need to use immer's `produce` to make sure we don't
  // accidentaly change the state by reference. Nice
  return produce(state, draft => {
    switch (event.type) {
      case "NEW_TASK": {
        draft.tasks.push(event.task);
        break;
      }

      case "TASK_COMPLETED": {
        const task = getTaskById(event.taskId, draft);
        if (!task) break; // The event has already been completed

        addCarrots(task.reward, draft);
        draft.tasks = draft.tasks.filter(t => t.id !== event.taskId);
        break;
      }

      case "TASK_PIN_TOGGLE": {
        const index = getTaskIndexById(event.taskId, draft);
        if (!draft.tasks[index]) break; // Sus, but okay

        draft.tasks[index].isPinned = !draft.tasks[index].isPinned;
        break;
      }

      case "TASK_DEADLINE": {
        // TODO(2026-01-21 16:22:58): add information about the carrot loss to notifications
        // to show it to the user when the app is opened
        const task = getTaskById(event.taskId, state);
        if (!task) break; // Task has already been completed

        // We add the penalty, because it's supposed to be negative itself
        addCarrots(task.penalty, draft);
        draft.tasks = draft.tasks.filter(t => t.id !== event.taskId);
        break;
      }

      default: {
        assertEventHandled(event);
      }
    }
  });
}

function getInitialState(): State {
  return {
    totalCarrots: 0,
    dailyCarrots: 0,
    progress: 0,

    tasks: [],
  };
}

function sortTasks(state: State) {
  const newTasks = [...state.tasks];
  newTasks.sort((a, b) => {
    if (a.isPinned != b.isPinned) return Number(b.isPinned) - Number(a.isPinned);
    return a.deadline.localeCompare(b.deadline) || a.id.localeCompare(b.id);
  })

  return {...state, tasks: newTasks};
}

let updatedState = false;

const useNeomeStore = create<NeomeStore>()(
  persist(
    (set, get) => ({
      events: [],

      // Don't read the state directly outside useNeomeStore, use getState instead
      currentState: getInitialState(),

      getState: () => {
        if (!updatedState) {
          get().updateCurrentState();
          updatedState = true;
        }
        return get().currentState;
      },

      updateCurrentState: () => {
        const stateLastUpdated = get().stateLastUpdated;
        if (stateLastUpdated == undefined) return get().recomputeCurrentState();

        let state = get().currentState;

        for (const e of getRelevantEventsSorted(get())) {
          if (e.time < stateLastUpdated) continue;
          state = applyEvent(e, state);
        }

        state = sortTasks(state);
        set({ currentState: state, stateLastUpdated: now() });
      },

      recomputeCurrentState: () => {
        let state = getInitialState();

        for (const e of getRelevantEventsSorted(get())) {
          state = applyEvent(e, state);
        }

        state = sortTasks(state);
        set({ currentState: state, stateLastUpdated: now() });
      },


      addEventsAndUpdateState: (events) => {
        set({
          events: [...get().events, ...events],
        });
        get().updateCurrentState();
      },

      addTask: (task: Task) => {
        get().addEventsAndUpdateState(createTaskAndDeadlineEvents(task));
      },

      completeTask: (id) => {
        get().addEventsAndUpdateState([createTaskCompletedEvent(id)]);
      },

      taskTogglePinned: (id) => {
        get().addEventsAndUpdateState([createTaskPinToggleEvent(id)]);
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
