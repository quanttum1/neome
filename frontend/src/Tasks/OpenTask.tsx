import { useParams } from 'react-router-dom';
import { useRef } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import useNeomeStore from '../useNeomeStore';
import { getCreateTaskError } from '../factories/createTask';
import { UTCToLocalInput } from '../utc';

export default function OpenTask() {
  const { taskId } = useParams();
  if (!taskId) return;
  const task = useNeomeStore(s => s.getTaskById(taskId));
  const updateTask = useNeomeStore(s => s.updateTask);

  if (!task) {
    // TODO(2026-01-18 21:09:37): nice error message if task doesn't exist in OpenTask
    return "Task doesn't exist";
  }

  const nameRef = useRef<HTMLInputElement>(null);
  const deadlineRef = useRef<HTMLInputElement>(null);
  const rewardRef = useRef<HTMLInputElement>(null);
  const penaltyRef = useRef<HTMLInputElement>(null);
  const deleteOnDeadlineRef = useRef<HTMLInputElement>(null);

  const completeTask = useNeomeStore(s => s.completeTask);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  function update(e: React.FormEvent): void {
    if (!taskId || !task) throw new Error("Unreachable");
    e.preventDefault();
    setError("");

    if (!nameRef.current) return setError("Name is not set");
    if (!deadlineRef.current) return setError("Deadline is not set");
    if (!rewardRef.current) return setError("Reward is not set");
    if (!penaltyRef.current) return setError("Penalty is not set");
    if (!deleteOnDeadlineRef.current) return setError("Delete on deadline checkbox is not set");

    const newTask = {
      name: nameRef.current.value,
      deadline: deadlineRef.current.value,
      reward: Number(rewardRef.current.value),
      penalty: -Number(penaltyRef.current.value),
      deleteOnDeadline: deleteOnDeadlineRef.current.checked,
    };

    const error = getCreateTaskError(newTask);
    if (error) return setError(error);

    updateTask(taskId, {
      ...task,...newTask,
      id: taskId,
      isPinned: task.isPinned,
    });

    navigate(-1);
  }

  function complete() {
    if (!taskId) return;
    if (!task) return;
    completeTask(taskId);
    navigate('../completed', {state: { reward: task.reward }});
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8">

        <form onSubmit={update} className="space-y-6">
          <div className="flex flex-col">
            <label className="text-[0.7rem] font-bold text-neome-pink mb-2 ml-1">Task Name</label>
            <input
              ref={nameRef}
              className="bg-neome-light-grey border-2 border-neome-light-grey rounded-xl p-4 text-white focus:outline-none focus:border-neome-pink transition-all placeholder:opacity-30"
              placeholder='e.g. "Finish homework"'
              defaultValue={task.name}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-[0.7rem] font-bold text-neome-pink mb-2 ml-1">Reward</label>
              <input
                ref={rewardRef}
                type="number"
                defaultValue={task.reward}
                step="0.1"
                className="bg-neome-light-grey border-2 border-neome-light-grey rounded-xl p-4 text-white focus:outline-none focus:border-neome-pink"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[0.7rem] font-bold text-neome-pink mb-2 ml-1">Penalty</label>
              <input
                ref={penaltyRef}
                type="number"
                step="0.1"
                defaultValue={-task.penalty}
                className="bg-neome-light-grey border-2 border-neome-light-grey rounded-xl p-4 text-white focus:outline-none focus:border-neome-pink"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[0.7rem] font-bold text-neome-pink mb-2 ml-1">Deadline</label>
            <input
              ref={deadlineRef}
              type="datetime-local"
              defaultValue={UTCToLocalInput(task.deadline)}
              className="bg-neome-light-grey border-2 border-neome-light-grey rounded-xl p-4 text-white focus:outline-none focus:border-neome-pink"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-[#ff6b81] p-3 rounded-xl text-sm">
              ⚠️ {error}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="flex-1 bg-neome-dark-red text-white py-4 rounded-2xl cursor-pointer text-sm"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 bg-neome-pink text-black rounded-2xl cursor-pointer"
            >
              Update
            </button>
          </div>

          <div className="flex pt-0">
            <button
              type="button"
              onClick={() => complete()}
              className="flex-1 text-sm bg-neome-pink py-4 text-black rounded-2xl cursor-pointer"
            >
              Mark as completed
            </button>
          </div>
          </form>
      </div>
    </div>
  );
}
