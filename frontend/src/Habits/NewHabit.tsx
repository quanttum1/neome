import { useRef } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { getCreateHabitError } from '../factories/createHabit';
import useNeomeStore from '../useNeomeStore';
import createHabit from '../factories/createHabit';
import { isWeekMaskDay, setWeekMaskDay } from '../weekMask';

function NewHabit() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const addHabit = useNeomeStore(s => s.addHabit);

  const nameRef = useRef<HTMLInputElement>(null);
  const rewardRef = useRef<HTMLInputElement>(null);
  const penaltyRef = useRef<HTMLInputElement>(null);
  const [daysOfWeek, setDaysOfWeek] = useState(0);

  function create(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!nameRef.current) return setError("Name is not set");
    if (!rewardRef.current) return setError("Reward is not set");
    if (!penaltyRef.current) return setError("Penalty is not set");

    const habit = {
      name: nameRef.current.value,
      daysOfWeek: daysOfWeek,
      reward: Number(rewardRef.current.value),
      penalty: -Number(penaltyRef.current.value),
    };

    const error = getCreateHabitError(habit);
    if (error) return setError(error);

    addHabit(createHabit(habit));
    navigate('/habits');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8">

        <form onSubmit={create} className="space-y-6">
          <div className="flex flex-col">
            <label className="text-[0.7rem] font-bold text-neome-pink mb-2 ml-1">Habit Name</label>
            <input
              ref={nameRef}
              className="bg-neome-light-grey border-2 border-neome-light-grey rounded-xl p-4 text-white focus:outline-none focus:border-neome-pink transition-all placeholder:opacity-30"
              placeholder='e.g. "Practice touchtyping"'
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
              Add habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewHabit;
