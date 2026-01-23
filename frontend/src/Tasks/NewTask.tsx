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
        <div className="min-h-screen bg-[#11080b] flex items-center justify-center p-4 font-sans text-[#f0ced4]">
            <div className="w-full max-w-md bg-[#1e0f12] border-4 border-[#411a21] rounded-[2rem] p-8 shadow-2xl">

                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-black text-[#ff6b81] tracking-widest uppercase">📜 New Quest</h1>
                    <p className="text-sm opacity-60 mt-2">Map out your next milestone on the path</p>
                </header>

                <form onSubmit={create} className="space-y-6">
                    <div className="flex flex-col">
                        <label className="text-[0.7rem] font-bold text-[#e2d12e] uppercase mb-2 ml-1">Quest Name</label>
                        <input
                            ref={nameRef}
                            className="bg-[#2d161b] border-2 border-[#411a21] rounded-xl p-4 text-white focus:outline-none focus:border-[#00d232] transition-all placeholder:opacity-30"
                            placeholder="What is your next challenge?"
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-[0.7rem] font-bold text-[#e2d12e] uppercase mb-2 ml-1">Reward 🥕</label>
                            <input
                                ref={rewardRef}
                                type="number"
                                defaultValue="5"
                                className="bg-[#2d161b] border-2 border-[#411a21] rounded-xl p-4 text-white focus:outline-none focus:border-[#00d232]"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-[0.7rem] font-bold text-[#e2d12e] uppercase mb-2 ml-1">Penalty ☁️</label>
                            <input
                                ref={penaltyRef}
                                type="number"
                                defaultValue="2"
                                className="bg-[#2d161b] border-2 border-[#411a21] rounded-xl p-4 text-white focus:outline-none focus:border-[#00d232]"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-[0.7rem] font-bold text-[#e2d12e] uppercase mb-2 ml-1">Time Limit</label>
                        <input
                            ref={deadlineRef}
                            type="datetime-local"
                            defaultValue={localDatetime}
                            className="bg-[#2d161b] border-2 border-[#411a21] rounded-xl p-4 text-white focus:outline-none focus:border-[#00d232] [color-scheme:dark]"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-[#ff6b81] p-3 rounded-xl text-sm animate-pulse">
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/tasks')}
                            className="flex-1 bg-[#411a21] text-white font-bold py-4 rounded-2xl hover:bg-[#5a252d] transition-colors uppercase text-sm"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-[#00d232] text-black font-black py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all uppercase text-sm shadow-[0_0_15px_rgba(0,210,50,0.4)]"
                        >
                            Forge Quest
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}