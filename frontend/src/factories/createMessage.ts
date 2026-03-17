export function createTaskDeadlineMessage(task: Task): TaskDeadlineMessage {
  return {
    id: crypto.randomUUID(),
    time: task.deadline,
    type: "TASK_DEADLINE",
    version: 1,
    carrotsLost: -task.penalty, // Penalty is negative
    taskName: task.name,
  };
}
