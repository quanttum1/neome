import { now } from "../utc";
import { nextUTCDay } from "../utc";
import { localMidnightOf } from "../utc";

export function createTaskAndDeadlineEvents(task: Task): NeomeEvent[] {
  const taskEvent: NewTaskEvent = {
    id: crypto.randomUUID(),
    time: now(),
    type: "NEW_TASK",
    task: task,
  };

  const deadlineEvent: TaskDeadlineEvent = {
    id: crypto.randomUUID(),
    time: task.deadline,
    type: "TASK_DEADLINE",
    taskId: task.id,
  }

  return [taskEvent, deadlineEvent];
}

export function createTaskPinToggleEvent(taskId: TaskId): TaskPinToggleEvent {
  return {
    id: crypto.randomUUID(),
    time: now(),
    type: "TASK_PIN_TOGGLE",
    taskId: taskId,
  };
}

export function createTaskCompletedEvent(taskId: TaskId): TaskCompletedEvent {
  return {
    id: crypto.randomUUID(),
    time: now(),
    type: "TASK_COMPLETED",
    taskId: taskId,
  };
}

export function createDayRolloverEvent(oldDate: UTCDateString): DayRolloverEvent {
  const newDate = nextUTCDay(oldDate);

  return {
    id: crypto.randomUUID(),
    time: localMidnightOf(newDate),
    type: "DAY_ROLLOVER",
    oldDate: oldDate,
    newDate: newDate,
  };
}

export function createNewHabitEvent(habit: Habit): NewHabitEvent {
  return {
    id: crypto.randomUUID(),
    time: now(),
    type: "NEW_HABIT",
    habit: habit
  };
}
