export function createTaskDeadlineMessage(task: Task): TaskDeadlineMessage {
  let carrotsLost;
  if ("version" in task && task.version == 3) carrotsLost = 1;
  else carrotsLost = -task.penalty;

  return {
    id: crypto.randomUUID(),
    time: task.deadline,
    type: "TASK_DEADLINE",
    version: 1,
    carrotsLost: carrotsLost, // Penalty is negative
    taskName: task.name,
  };
}
