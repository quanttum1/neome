import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { now } from "./utc";
import { getTimezone } from "./utc";
import { startOfUTCDay } from "./utc";
import { createTaskUpdateEvent } from "./factories/createEvents";
import { createTaskCompletedEvent } from "./factories/createEvents";
import { createTaskPinToggleEvent } from "./factories/createEvents";
import { createNewTaskEvent } from "./factories/createEvents";
import { createNewHabitEvent } from "./factories/createEvents";
import { createHabitUpdateEvent } from "./factories/createEvents";
import { createDayRolloverEvent } from "./factories/createEvents";
import applyEvent from "./applyEvent";
import { getTaskById } from "./applyEvent";

function compareEvents(a: LogicalEvent, b: LogicalEvent): number {
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

function getInitialState(initialDate: UTCDateString, initialTZ: TimezoneString): State {
  return {
    date: initialDate,
    timezone: initialTZ,

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

// This function ensures old events are not affected
function mergeEvents(oldEvents: LogicalEvent[], newEvents: LogicalEvent[]) {
  let oldEventsSorted = [...oldEvents]; // To avoid changing oldEvents by reference
  oldEventsSorted.sort(compareEvents);

  let newEventsSorted = [...newEvents];
  newEventsSorted.sort(compareEvents);

  const firstNewEvent = newEventsSorted[0];
  const lastOldEvent = oldEventsSorted[oldEventsSorted.length];

  if (firstNewEvent && lastOldEvent) {
    if (firstNewEvent.time <= lastOldEvent.time) {
      throw new Error("Tried to change past events");
    }
  }

  let events = [...oldEventsSorted, ...newEventsSorted];
  return events.sort(compareEvents);
}

let updatedState = false;

const useNeomeStore = create<NeomeStore>()(
  persist(
    (set, get) => ({
      isTourTaken: false,
      setIsTourTaken: (value) => set({ isTourTaken: value }),

      initialTimezone: getTimezone(),
      initialDate: startOfUTCDay(now()),
      events: [],

      // Don't read the state directly outside useNeomeStore, use getState instead
      currentState: getInitialState(startOfUTCDay(now()), getTimezone()),

      getState: () => {
        if (!updatedState) {
          get().updateCurrentState();
          updatedState = true;
        }
        return get().currentState;
      },

      // Returns sorted events, but also adds initial DayRolloverEvent
      getLogicalEvents: () => {
        let events = [
          ...get().events,
          createDayRolloverEvent(get().initialDate, get().initialTimezone)
        ];

        return events.sort(compareEvents);
      },


      // TODO(2026-02-07 21:50:33): decide what to do with `updateCurrentState`
      // Because some events are now purely logical and are not stored this function
      // becomes useless. To avoid full recompute the state from scratch every time
      // we would need to cache logical events somewhere 🤡
      updateCurrentState: () => {
        return get().recomputeCurrentState();
        // const stateLastUpdated = get().stateLastUpdated;
        // if (stateLastUpdated == undefined) return get().recomputeCurrentState();
        // // "Time-travel" was probably involved
        // if (stateLastUpdated > now()) return get().recomputeCurrentState();
        //
        // let events: LogicalEvent[] = get().getLogicalEvents();
        // let state = get().currentState;
        //
        // for (let i = 0; i < events.length; i++) {
        //   const e = events[i];
        //   if (!e) break;
        //
        //   if (e.time > now()) break;
        //   if (e.time < stateLastUpdated) continue;
        //
        //   const [newState, newEvents] = applyEvent(e, state);
        //   state = newState;
        //
        //   events = mergeEvents(events, newEvents);
        // }
        //
        // state = sortTasks(state);
        // set({ currentState: state, stateLastUpdated: now() });
      },

      recomputeCurrentState: () => {
        let events: LogicalEvent[] = get().getLogicalEvents();
        let state = getInitialState(get().initialDate, get().initialTimezone);

        for (let i = 0; i < events.length; i++) {
          const e = events[i];
          if (!e) break;

          if (e.time > now()) break;

          const [newState, newEvents] = applyEvent(e, state);
          state = newState;

          events = mergeEvents(events, newEvents);
        }

        state = sortTasks(state);
        set({ currentState: state, stateLastUpdated: now() });
      },


      addEventAndUpdateState: (event) => {
        set({
          events: [...get().events, event],
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

      updateTask: (id, newTask) => {
        get().addEventAndUpdateState(createTaskUpdateEvent(id, newTask));
      },


      addHabit: (habit: Habit) => {
        get().addEventAndUpdateState(createNewHabitEvent(habit));
      },

      updateHabit: (id: HabitId, newHabit: Habit) => {
        get().addEventAndUpdateState(createHabitUpdateEvent(id, newHabit));
      },


      getTaskById: (id) => {
        return getTaskById(id, get().currentState);
      },
    }),
    {
      name: 'neome',
      version: 0.22,
      migrate: (state: any, oldVersion) => {

        if (oldVersion == 0.21) {
          state.isTourTaken = false;
        }

        return state as NeomeStore;
      },
    }
  )
);

export default useNeomeStore;
