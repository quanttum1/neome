import { useRef } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { getCreateHabitError } from '../factories/createHabit';
import useNeomeStore from '../useNeomeStore';
import { isWeekMaskDay, setWeekMaskDay } from '../weekMask';

export default function OpenHabit() {
  const { habitId } = useParams();
  if (!habitId) return;

  const habit = useNeomeStore(s => s.getState().habits.find(h => h.id == habitId));
  // TODO(2026-03-01 20:57:20): nice error message if habit doesn't exist in OpenHabit
  if (!habit) return "Habit doesn't exist";

  const updateHabit = useNeomeStore(s => s.updateHabit);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const nameRef = useRef<HTMLInputElement>(null);
  const rewardRef = useRef<HTMLInputElement>(null);
  const penaltyRef = useRef<HTMLInputElement>(null);
  const [daysOfWeek, setDaysOfWeek] = useState(habit.daysOfWeek);

  function update(e: React.FormEvent) {
    if (!habitId || !habit) throw new Error("Unreachable");

    e.preventDefault();
    setError("");

    if (!nameRef.current) return setError("Name is not set");
    if (!rewardRef.current) return setError("Reward is not set");
    if (!penaltyRef.current) return setError("Penalty is not set");

    const newHabit = {
      name: nameRef.current.value,
      daysOfWeek: daysOfWeek,
      reward: Number(rewardRef.current.value),
      penalty: -Number(penaltyRef.current.value),
    };

    const error = getCreateHabitError(newHabit);
    if (error) return setError(error);

    updateHabit(habitId, {
      ...habit, ...newHabit
    });

    navigate('/habits');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8">

        <form onSubmit={update} className="space-y-6">
          <div className="flex flex-col">
            <label className="text-[0.7rem] font-bold text-neome-pink mb-2 ml-1">
              Habit Name
            </label>

            <input
              ref={nameRef}
              className="bg-neome-light-grey border-2 border-neome-light-grey rounded-xl p-4 text-white focus:outline-none focus:border-neome-pink transition-all placeholder:opacity-30"
              placeholder='e.g. "Practice touchtyping"'
              autoFocus
              defaultValue={habit.name}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-[0.7rem] font-bold text-neome-pink mb-2 ml-1">Reward</label>
              <input
                ref={rewardRef}
                type="number"
                step="0.1"
                className="bg-neome-light-grey border-2 border-neome-light-grey rounded-xl p-4 text-white focus:outline-none focus:border-neome-pink"
                defaultValue={habit.reward}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[0.7rem] font-bold text-neome-pink mb-2 ml-1">Penalty</label>
              <input
                ref={penaltyRef}
                type="number"
                step="0.1"
                className="bg-neome-light-grey border-2 border-neome-light-grey rounded-xl p-4 text-white focus:outline-none focus:border-neome-pink"
                defaultValue={habit.penalty}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[0.7rem] font-bold text-neome-pink ml-1">
                Days of week
              </label>

              <button
                type="button"
                onClick={() => setDaysOfWeek(daysOfWeek ? 0 : 0b1111111)}
                className="text-[0.65rem] font-medium text-neome-pink cursor-pointer"
              >
                {daysOfWeek ? "Clear" : "Everyday"}
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 w-full">
              {(["M","T","W","T","F","S","S"] as const).map((label, i) => {
                const checked = isWeekMaskDay(daysOfWeek, i);

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() =>
                      setDaysOfWeek(setWeekMaskDay(daysOfWeek, i, !checked))
                    }
                    className={[
                      "aspect-square w-full rounded-xl text-sm font-medium",
                      "border transition flex items-center justify-center",
                      checked
                        ? "bg-neome-pink text-white border-neome-pink"
                        : "bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-500"
                    ].join(" ")}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-[#ff6b81] p-3 rounded-xl text-sm">
              ⚠️ {error}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/habits')}
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
        </form>
      </div>
    </div>
  );
}
