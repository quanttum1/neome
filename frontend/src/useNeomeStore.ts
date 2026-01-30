import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { now } from "./utc";
import { startOfUTCDay } from "./utc";
import { nextUTCDay } from "./utc";
import { getWeekdayOfDate } from "./utc";
import { createTaskAndDeadlineEvents } from "./factories/createEvents";
import { createTaskCompletedEvent } from "./factories/createEvents";
import { createTaskPinToggleEvent } from "./factories/createEvents";
import { createDayRolloverEvent } from "./factories/createEvents";
import { createNewHabitEvent } from "./factories/createEvents";
import { produce } from "immer";
import { isWeekMaskDay } from "./weekMask";

function compareEvents(a: NeomeEvent, b: NeomeEvent): number {
  if (a.time < b.time) return -1;
  if (a.time > b.time) return 1;
  return a.id.localeCompare(b.id); // tie-breaker, just in case
}

function getNextRelevantEvent
(store: NeomeStore, lastEventId: string | undefined): NeomeEvent | undefined {
  let relevantEvents = store.getEvents().filter(e => e.time <= now()).sort(compareEvents);

  if (lastEventId == undefined) {
    return relevantEvents[0];
  }

  for (const [index, event] of relevantEvents.entries()) {
    if (event.id == lastEventId) {
      return relevantEvents[index + 1];
    }
  }

  throw new Error("Event with this id doesn't exist");
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
          // Bootstrap the day rollover event
          events = [createDayRolloverEvent(startOfUTCDay(now()))];
          set({ events: events });
        }

        return events;
      },

      applyEvent: (event: NeomeEvent, state: State): State => {
        // They told that in high-level languages like JS we don't need to think about
        // memory management. So here we go. We need to use immer's `produce` to make sure
        // we don't accidentaly change the state by reference. Nice
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
              // TODO(2026-01-21 16:22:58): add info about carrot loss to notifications
              // to show it to the user when the app is opened
              const task = getTaskById(event.taskId, state);
              if (!task) break; // Task has already been completed

              // We add the penalty, because it's supposed to be negative itself
              addCarrots(task.penalty, draft);
              draft.tasks = draft.tasks.filter(t => t.id !== event.taskId);
              break;
            }

            case "DAY_ROLLOVER": {
              if (startOfUTCDay(event.oldDate) != startOfUTCDay(draft.date)) 
                break;

              draft.date = event.newDate;
              draft.dailyCarrots = 0;

              const dayOfWeek = getWeekdayOfDate(event.newDate);
              for (const habit of draft.habits) {
                if (isWeekMaskDay(habit.daysOfWeek, dayOfWeek)) {
                  const taskId = crypto.randomUUID();

                  // We don't use `./factories/createTask.ts` because it takes local time
                  draft.tasks.push({
                    id: taskId,
                    name: habit.name,
                    reward: habit.reward,
                    penalty: habit.penalty,
                    deadline: nextUTCDay(event.newDate),
                    isPinned: false,
                  });

                  // TODO(2026-01-30 20:41:52): Check if the event already been added
                  set({events: [
                    ...get().getEvents(),
                    {
                      id: crypto.randomUUID(),
                      time: nextUTCDay(event.newDate),
                      type: "TASK_DEADLINE",
                      taskId: taskId,
                    }
                  ]});
                }
              }

              // TODO(2026-01-30 20:41:52): Check if the event already been added
              set({
                events: [...get().getEvents(), createDayRolloverEvent(event.newDate)]
              });
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
      },

      updateCurrentState: () => {
        const stateLastUpdated = get().stateLastUpdated;
        if (stateLastUpdated == undefined) return get().recomputeCurrentState();

        let state = get().currentState;
        let lastEventId: string | undefined;

        while (true) {
          const e = getNextRelevantEvent(get(), lastEventId);

          if (!e) break;
          if (e.time < stateLastUpdated) {
            lastEventId = e.id;
            continue;
          }

          state = get().applyEvent(e, state);
          lastEventId = e.id;
        }

        state = sortTasks(state);
        set({ currentState: state, stateLastUpdated: now() });
      },

      recomputeCurrentState: () => {
        let state = getInitialState(get().initialDate);
        let lastEventId: string | undefined;

        while (true) {
          const e = getNextRelevantEvent(get(), lastEventId);
          if (!e) break;

          state = get().applyEvent(e, state);
          lastEventId = e.id;
        }

        state = sortTasks(state);
        set({ currentState: state, stateLastUpdated: now() });
      },


      addEventsAndUpdateState: (events) => {
        set({
          events: [...get().getEvents(), ...events],
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


      addHabit: (habit: Habit) => {
        get().addEventsAndUpdateState([createNewHabitEvent(habit)]);
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
