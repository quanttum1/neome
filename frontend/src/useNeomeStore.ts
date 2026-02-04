import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { now } from "./utc";
import { startOfUTCDay } from "./utc";
import { createTaskCompletedEvent } from "./factories/createEvents";
import { createTaskPinToggleEvent } from "./factories/createEvents";
import { createNewTaskDeadlineEvent } from "./factories/createEvents";
import { createNewTaskEvent } from "./factories/createEvents";
import { createNewHabitEvent } from "./factories/createEvents";
import { produce } from "immer";

function compareEvents(a: LogicalEvent, b: LogicalEvent): number {
  if (a.time < b.time) return -1;
  if (a.time > b.time) return 1;

  if ("id" in a && "id" in b) return a.id.localeCompare(b.id);

  if (a.type == "TASK_DEADLINE" && b.type == "TASK_DEADLINE")
    return a.taskId.localeCompare(b.taskId);
  if (a.type == "DAY_ROLLOVER" && b.type == "DAY_ROLLOVER")
    return a.newDate.localeCompare(b.newDate);

  if (a.type == b.type) throw new Error("Unknown event type");
  return a.type.localeCompare(b.type);
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

function getInitialState(initialDate: UTCDateString): State {
  return {
    date: initialDate,

    totalCarrots: 0,
    dailyCarrots: 0,
    progress: 0,

    tasks: [],
    habits: [],
  };
}

function sortTasks(state: State) {
  const newTasks = [...state.tasks];
  newTasks.sort((a, b) => {
    if (a.isPinned != b.isPinned) return Number(b.isPinned) - Number(a.isPinned);
    return a.deadline.localeCompare(b.deadline) || a.id.localeCompare(b.id);
  });

  return {...state, tasks: newTasks};
}

function applyEvent(event: LogicalEvent, state: State): [State, LogicalEvent[]] {
  function assertEventHandled(x: never): never {
    throw new Error(`Unhandled event: ${JSON.stringify(x)}`);
  }

  let newEvents: LogicalEvent[] = [];

  // They told that in high-level languages like JS we don't need to think about
  // memory management. So here we go. We need to use immer's `produce` to make sure
  // we don't accidentaly change the state by reference. Nice
  let newState: State = produce(state, draft => {
    switch (event.type) {
      case "NEW_TASK": {
        draft.tasks.push(event.task);
        newEvents.push(createNewTaskDeadlineEvent(event.task));
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
        if (!("version" in event)) break;

        const task = getTaskById(event.taskId, state);
        if (!task) break; // Task has already been completed

        // We add the penalty, because it's supposed to be negative itself
        addCarrots(task.penalty, draft);
        draft.tasks = draft.tasks.filter(t => t.id !== event.taskId);
        break;
      }

      case "DAY_ROLLOVER": {
        if (!("version" in event)) break; // Deprecated

        // TODO(2026-02-02 22:39:57): make DAY_ROLLOVER work
        // deps: (2026-02-01 20:20)
        break;
      }

      case "NEW_HABIT": {
        draft.habits.push(event.habit);
        break;
      }

      default: {
        assertEventHandled(event);
      }
    }
  });

  return [newState, newEvents];
}

let updatedState = false;

const useNeomeStore = create<NeomeStore>()(
  persist(
    (set, get) => ({
      initialDate: startOfUTCDay(now()),
      // Don't read the events directly, use getEvents instead
      events: undefined,

      // Don't read the state directly outside useNeomeStore, use getState instead
      // TODO(2026-01-22 16:49:29): maybe make it undefined by default
      currentState: getInitialState(startOfUTCDay(now())),

      getState: () => {
        if (!updatedState) {
          get().updateCurrentState();
          updatedState = true;
        }
        return get().currentState;
      },

      getEvents: () => {
        let events = get().events;

        if (events == undefined) {
          // TODO(2026-02-01 20:20): seed the timezone
          // deps: (2026-02-01 20:21)
          events = [];
          set({ events: events });
        }

        return events;
      },


      updateCurrentState: () => {
        const stateLastUpdated = get().stateLastUpdated;
        if (stateLastUpdated == undefined) return get().recomputeCurrentState();

        let events: LogicalEvent[] = get().getEvents();
        let state = get().currentState;

        for (let i = 0; i < events.length; i++) {
          const e = events[i];
          if (!e) break;

          if (e.time > now()) break;
          if (e.time < stateLastUpdated) continue;

          const [newState, newEvents] = applyEvent(e, state);
          state = newState;

          // TODO(2026-02-04 21:08): make sure we don't change the past events
          events = [...events, ...newEvents];
          events.sort(compareEvents);
        }

        state = sortTasks(state);
        set({ currentState: state, stateLastUpdated: now() });
      },

      recomputeCurrentState: () => {
        let events: LogicalEvent[] = get().getEvents();
        let state = getInitialState(get().initialDate);

        for (let i = 0; i < events.length; i++) {
          const e = events[i];
          if (!e) break;

          if (e.time > now()) break;

          const [newState, newEvents] = applyEvent(e, state);
          state = newState;

          // TODO(2026-02-04 21:08): make sure we don't change the past events
          events = [...events, ...newEvents];
          events.sort(compareEvents);
        }

        state = sortTasks(state);
        set({ currentState: state, stateLastUpdated: now() });
      },


      addEventAndUpdateState: (event) => {
        set({
          events: [...get().getEvents(), event],
        });
        get().updateCurrentState();
      },


      addTask: (task: Task) => {
        get().addEventAndUpdateState(createNewTaskEvent(task));
      },

      completeTask: (id) => {
        get().addEventAndUpdateState(createTaskCompletedEvent(id));
      },

      taskTogglePinned: (id) => {
        get().addEventAndUpdateState(createTaskPinToggleEvent(id));
      },


      addHabit: (habit: Habit) => {
        get().addEventAndUpdateState(createNewHabitEvent(habit));
      },


      getTaskById: (id) => {
        return getTaskById(id, get().currentState);
      },
    }),
    {
      name: 'neome',
      version: 0.17,
      migrate: (state, oldVersion) => {
        if (oldVersion == 0.16) {
          // Force to recomputeCurrentState
          (state as NeomeStore).stateLastUpdated = undefined;
        }
        return state as NeomeStore;
      },
    }
  )
);

export default useNeomeStore;
