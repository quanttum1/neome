import { useRef } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import useNeomeStore from '../useNeomeStore';
import createTask from '../factories/createTask'
import { getCreateTaskError } from '../factories/createTask'
import { isValidDate } from '../utc'
import { localInputToUTC } from '../utc'
import { now } from '../utc'

export default function NewTask() {
  const nameRef = useRef<HTMLInputElement>(null);
  const deadlineRef = useRef<HTMLInputElement>(null);
  const rewardRef = useRef<HTMLInputElement>(null);
  const penaltyRef = useRef<HTMLInputElement>(null);

  const addTask = useNeomeStore((s: NeomeStore) => s.addTask);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const now_ = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");

  // Format YYYY-MM-DDTHH:mm
  const localDatetime = `${now_.getFullYear()}-${pad(now_.getMonth() + 1)}-${pad(
    now_.getDate()
  )}T${pad(now_.getHours())}:${pad(now_.getMinutes())}`;

   function create(e: React.FormEvent): void {
    e.preventDefault();
    setError("");

    if (!nameRef.current) return setError("Name is not set");
    if (!deadlineRef.current) return setError("Deadline is not set");
    if (!rewardRef.current) return setError("Reward is not set");
    if (!penaltyRef.current) return setError("Penalty is not set");

    const task = {
      name: nameRef.current.value,
      deadline: deadlineRef.current.value,
      reward: Number(rewardRef.current.value),
      penalty: -Number(penaltyRef.current.value),
    };

    const error = getCreateTaskError(task);
    if (error) return setError(error);

    addTask(createTask(task));
    navigate('/tasks');
  }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md p-8">

                <form onSubmit={create} className="space-y-6">
                    <div className="flex flex-col">
                        <label className="text-[0.7rem] font-bold text-neome-pink mb-2 ml-1">Task Name</label>
                        <input
                            ref={nameRef}
                            className="bg-neome-light-grey border-2 border-neome-light-grey rounded-xl p-4 text-white focus:outline-none focus:border-neome-pink transition-all placeholder:opacity-30"
                            placeholder='e.g. "Finish homework"'
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-[0.7rem] font-bold text-neome-pink mb-2 ml-1">Reward</label>
                            <input
                                ref={rewardRef}
                                type="number"
                                defaultValue="0"
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
                                defaultValue="0"
                                className="bg-neome-light-grey border-2 border-neome-light-grey rounded-xl p-4 text-white focus:outline-none focus:border-neome-pink"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-[0.7rem] font-bold text-neome-pink mb-2 ml-1">Deadline</label>
                        <input
                            ref={deadlineRef}
                            type="datetime-local"
                            defaultValue={localDatetime}
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
                            Add task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
