import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { now } from "./utc";
import { getTimezone } from "./utc";
import { createTaskUpdateEvent } from "./factories/createEvents";
import { createTaskCompletedEvent } from "./factories/createEvents";
import { createTaskPinToggleEvent } from "./factories/createEvents";
import { createNewTaskEvent } from "./factories/createEvents";
import { createNewHabitEvent } from "./factories/createEvents";
import { createHabitUpdateEvent } from "./factories/createEvents";
import { createHabitRemoveEvent } from "./factories/createEvents";
import { createMessagesReadEvent } from "./factories/createEvents";
import { createTimezoneChangeEvent } from "./factories/createEvents";
import applyEvent from "./applyEvent";
import { getTaskById } from "./applyEvent";
import { sync } from './auth';

function compareEvents(a: LocalEvent, b: LocalEvent): number {
  if (a.time < b.time) return -1;
  if (a.time > b.time) return 1;

  if ("id" in a && "id" in b) return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;

  if (a.type == "TASK_DEADLINE" && b.type == "TASK_DEADLINE")
    return a.taskId < b.taskId ? -1 : a.taskId > b.taskId ? 1 : 0;
  if (a.type == "DAY_ROLLOVER" && b.type == "DAY_ROLLOVER")
    return a.newDate < b.newDate ? -1 : a.newDate > b.newDate ? 1 : 0;

  if (a.type == b.type) throw new Error("Unknown event type");
  return a.type < b.type ? -1 : 1;
}

function getInitialState(): State {
  return {
    date: undefined,
    timezone: undefined,

    totalCarrots: 0,
    dailyCarrots: 0,
    progress: 0,
    // Need to cast it cause TS is dumb
    week: Array(6).fill(undefined) as FixedArray<number | undefined, 6>,

    messages: [],

    tasks: [],
    habits: [],
  };
}

export function compareTasks(a: Task, b: Task) {
  if (a.isPinned != b.isPinned) return Number(b.isPinned) - Number(a.isPinned);
  return a.deadline.localeCompare(b.deadline) || a.id.localeCompare(b.id);
}

function sortTasks(state: State) {
  const newTasks = [...state.tasks];
  newTasks.sort(compareTasks);

  return {...state, tasks: newTasks};
}

let updatedState = false;

const useNeomeStore = create<NeomeStore>()(
  persist(
    (set, get) => ({
      version: 1,
      isTourTaken: false,
      setIsTourTaken: (value) => set({ isTourTaken: value }),

      events: [],

      // Don't read the state directly outside useNeomeStore, use getState instead
      currentState: getInitialState(),

      markEventSyncronised: (id: EventId) => {
        let events = get().events;
        events = events.map((e: LocalEvent) => e.id != id ? e : { ...e, isSynchronised: true });
        set({ events });
      },

      getWeeklyCarrots: () => {
        let result = 0;

        for (let i of get().getState().week) {
          result += i == undefined ? 0 : i;
        }

        return result + get().getState().dailyCarrots;
      },

      getState: () => {
        if (!updatedState) {
          get().updateCurrentState();
          updatedState = true;
        }
        return get().currentState;
      },


      ensureEventsNotEmpty: () => {
        const events = get().events;
        if (!events.length) {
          set({ events });
          events.push(createTimezoneChangeEvent(getTimezone(), now()));
        }
      },

      addEvent: (event) => {
        const events = get().events;

        get().ensureEventsNotEmpty();

        const index = events.findIndex(e => e.id == event.id);
        if (index != -1) return index;

        let low = 0;
        let high = events.length;

        while (low < high) {
          const mid = (low + high) >>> 1;

          if (compareEvents(events[mid]!, event) < 0) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }

        events.splice(low, 0, event);
        set({ events: events });
        return low;
      },

      addEventAndUpdateState: (event) => {
        get().addEvent(event);
        get().updateCurrentState();
        sync();
      },


      updateCurrentState: () => {
        get().ensureEventsNotEmpty();
        // TODO(2026-06-22 23:27): make updateCurrentState work again
        return get().recomputeCurrentState();
      },

      recomputeCurrentState: () => {
        get().ensureEventsNotEmpty();
        set({ events: get().events.filter(e => 'isSynchronised' in e) });
        let state = getInitialState();

        for (let i = 0; i < get().events.length; i++) {
          const e = get().events[i];
          if (!e) break;

          if (e.time > now()) break;

          const [newState, newEvents] = applyEvent(e, state);
          state = newState;

          for (const e of newEvents) {
            if (get().addEvent(e) <= i) i++;
          }
        }

        state = sortTasks(state);
        set({ currentState: state, stateLastUpdated: now() });
      },


      addTask: (task: Task) => {
        get().ensureEventsNotEmpty();
        get().addEventAndUpdateState(createNewTaskEvent(task));
      },

      completeTask: (id) => {
        get().addEventAndUpdateState(createTaskCompletedEvent(id));
      },

      taskTogglePinned: (id) => {
        get().addEventAndUpdateState(createTaskPinToggleEvent(id));
      },

      updateTask: (id, newTask) => {
        get().addEventAndUpdateState(createTaskUpdateEvent(id, newTask));
      },


      addHabit: (habit: Habit) => {
        get().ensureEventsNotEmpty();
        get().addEventAndUpdateState(createNewHabitEvent(habit));
      },

      updateHabit: (id: HabitId, newHabit: Habit) => {
        get().addEventAndUpdateState(createHabitUpdateEvent(id, newHabit));
      },

      removeHabit: (id: HabitId) => {
        get().addEventAndUpdateState(createHabitRemoveEvent(id));
      },


      markMessagesRead: () => {
        get().ensureEventsNotEmpty();
        get().addEventAndUpdateState(createMessagesReadEvent());
        sync();
      },


      getTaskById: (id) => {
        return getTaskById(id, get().currentState);
      },
    }),
    {
      name: 'neome',
      version: 1.2,
      migrate: (state: any, oldVersion) => {

        if (oldVersion <= 0.21) {
          state.isTourTaken = false;
        }

        if (oldVersion <= 0.22) {
          // at the time I wrote this migration, it was of type StoredEvent, now it's LocalEvent just to suppress
          // typescript errors, nothing else changed
          let e: LocalEvent = {
            id: crypto.randomUUID(),
            time: now(),
            type: "MESSAGES_MIGRATION",
            version: "INITIAL",
          };
          state.events.push(e);
        }

        if (oldVersion <= 0.23) {
          for (let i = 0; i < state.events.length; i++) {
            if (state.events[i].type == "MESSAGES_MIGRATION") continue; // it's now considered a local event
            if ('id' in state.events[i]) state.events[i].isSynchronised = false;
          }

          for (let i = 0; i < state.events.length; i++) {
            if (!('id' in state.events[i])) state.events.splice(i--, 1);
          }

          state.version = 1;
          state.stateLastUpdated = undefined;
        }

        if (oldVersion <= 1) {
          state.events.splice(0, 0, createTimezoneChangeEvent(state.initialTimezone, state.initialDate));
        }

        if (oldVersion <= 1.1) {
          const { initialDate, initialTimezone, ...newState } = state;
          state = newState;
          initialTimezone; initialDate;
        }

        // if you decide to make a big change in NeomeStore, consider to change version to 2,
        // copy the previous one as NeomeStoreV1, and make NeomeStoreAny, a union of the old one
        // and the new one. at this point in the code, reinterpret state as NeomeStoreAny, and switch on its
        // version. this allows typescript to actually do some typechecking
        // if you want to do just make `state.stateLastUpdated = undefined;`, make a version 1.1 or something
        // like that and make it work that way

        return state as NeomeStore;
      },
    }
  )
);

export default useNeomeStore;
