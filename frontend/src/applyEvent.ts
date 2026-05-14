import { getWeekdayOfDate } from "./utc";
import { produce } from "immer";
import { v5 as uuidv5 } from "uuid";
import { createTaskDeadlineEvent } from "./factories/createEvents";
import { isWeekMaskDay } from "./weekMask";
import { localTime } from "./utc";
import { nextUTCDay } from "./utc";
import { createDayRolloverEvent } from "./factories/createEvents";
import { createTaskDeadlineMessage } from "./factories/createMessage";

export function getTaskById(id: TaskId, state: State) {
  return state.tasks.find(t => t.id == id);
}

// This function is needed in `./Home.tsx` but I don't think it makes sense to put it in a
// separate file
export function clamp(n: number, min: number, max: number): number {
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
        newEvents.push(createTaskDeadlineEvent(event.task));
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

        if (task.deadline != event.time) break; // The task has been rescheduled

        // We add the penalty, because it's supposed to be negative itself
        addCarrots(task.penalty, draft);
        draft.messages.push(createTaskDeadlineMessage(task));

        if (!("version" in task) || task.deleteOnDeadline) {
          draft.tasks = draft.tasks.filter(t => t.id !== event.taskId);
        } else {
          const index = getTaskIndexById(task.id, draft);
          draft.tasks[index] = { ...task, isOverdue: true };
        }

        break;
      }

      case "DAY_ROLLOVER": {
        if (!("version" in event)) break; // Deprecated
        if (event.oldDate != draft.date) break;

        draft.week.splice(0, 1);
        draft.week.push(draft.dailyCarrots);

        // TODO(2026-03-09 15:30:03): if user didn't feed Carro for 2 days this week, take away weekly progress

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
            newEvents.push(createTaskDeadlineEvent(task));
          }
        }

        newEvents.push(createDayRolloverEvent(event.newDate, draft.timezone));
        break;
      }

      case "NEW_HABIT": {
        draft.habits.push(event.habit);

        if (isWeekMaskDay(event.habit.daysOfWeek, getWeekdayOfDate(draft.date))) {
          const task = {
            id: uuidv5(`${event.habit.id} ${draft.date}`, HABIT_NAMESPACE),
            name: event.habit.name,
            reward: event.habit.reward,
            penalty: event.habit.penalty,
            deadline: localTime(nextUTCDay(draft.date), draft.timezone),
            isPinned: false,
          };

          draft.tasks.push(task);
          newEvents.push(createTaskDeadlineEvent(task));
        }

        break;
      }

      case "TASK_UPDATE": {
        const index = getTaskIndexById(event.taskId, draft);
        const task = draft.tasks[index];
        if (!task) break;

        // TODO(2026-03-01 14:03:12): maybe take some carrots away if the deadline is changed
        // do something like this:
        // const oldDeadline = new Date(oldTask.deadline).getTime();
        // const newDeadline = new Date(newTask.deadline).getTime();
        // const created = new Date(oldTask.created).getTime();
        // const deadlineChanged = new Date(event.time);
        //
        // const oldDuration = oldDeadline - created;
        // const newDuration = newDeadline - created;
        //
        // addCarrots(invLerp(created, deadlineChanged)
        //   * (newDuration / oldDuration)
        //   * oldTask.penalty); // Penalty is negative

        if (task.deadline != event.newTask.deadline) {
          newEvents.push(createTaskDeadlineEvent(event.newTask));
        }

        draft.tasks[index] = event.newTask;
        break;
      }

      case "HABIT_UPDATE": {
        const index = draft.habits.findIndex(h => h.id === event.habitId);
        draft.habits[index] = event.newHabit;
        break;
      }

      case "HABIT_REMOVE": {
        draft.habits = draft.habits.filter(h => h.id != event.habitId);
        // TODO(2026-05-14 07:37): when removing a habit also remove the task produced by this habit today if such exists
        break;
      }

      case "MESSAGES_MIGRATION": {
        draft.messages = [];
        break;
      }

      case "MESSAGES_READ": {
        draft.messages = [];
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
