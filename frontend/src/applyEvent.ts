import { getWeekdayOfDate } from "./utc";
import { produce } from "immer";
import { v5 as uuidv5 } from "uuid";
import { createNewTaskDeadlineEvent } from "./factories/createEvents";
import { isWeekMaskDay } from "./weekMask";
import { localTime } from "./utc";
import { nextUTCDay } from "./utc";
import { createDayRolloverEvent } from "./factories/createEvents";

export function getTaskById(id: TaskId, state: State) {
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

function getTaskIndexById(id: TaskId, state: State) {
  return state.tasks.findIndex(t => t.id === id);
}

function applyEvent(event: LogicalEvent, state: State): [State, LogicalEvent[]] {
  const HABIT_NAMESPACE = "bbd04581-46ed-4e61-96d6-6b7dc7b044e3";

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
        if (event.oldDate != draft.date) break;

        draft.date = event.newDate;
        draft.dailyCarrots = 0;

        for (const habit of draft.habits) {
          if (isWeekMaskDay(habit.daysOfWeek, getWeekdayOfDate(event.newDate))) {
            const task = {
              id: uuidv5(`${habit.id} ${event.newDate}`, HABIT_NAMESPACE),
              name: habit.name,
              reward: habit.reward,
              penalty: habit.penalty,
              deadline: localTime(nextUTCDay(event.newDate), draft.timezone),
              isPinned: false,
            };

            draft.tasks.push(task);
            newEvents.push(createNewTaskDeadlineEvent(task));
          }
        }

        newEvents.push(createDayRolloverEvent(event.newDate, draft.timezone));
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

export default applyEvent;
