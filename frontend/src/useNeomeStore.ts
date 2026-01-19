import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { now } from "./utc";
import { createNewTaskEvent } from "./factories/createEvents";
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
        if (!task) {
          // The event has already been completed
          break;
        }

        draft.dailyCarrots += task.reward;
        draft.totalCarrots += task.reward;

        draft.tasks = draft.tasks.filter(t => t.id !== event.taskId);
        break;
      }

      case "TASK_PIN_TOGGLE": {
        const index = getTaskIndexById(event.taskId, draft);
        if (!draft.tasks[index]) break; // Sus, but okay

        draft.tasks[index].isPinned = !draft.tasks[index].isPinned;
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
        // TODO(2026-01-18 19:38): create a future Task with deadline
        get().addEventsAndUpdateState([createNewTaskEvent(task)]);
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
