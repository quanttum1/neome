import useNeomeStore from '../useNeomeStore';
import NewButton from '../NewButton';
import { Link } from 'react-router';
import { isWeekMaskDay } from '../weekMask';

function Habits() {
  let habits = useNeomeStore(s => s.getState().habits);

  return (
    <div className="pt-2 pb-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {habits.map((habit) => (
          <div
            className="text-[24px] pt-2 pb-3 pl-4 pr-4 rounded-[1.5vw] bg-neome-grey flex items-center gap-2"
          >

            <Link 
              className="group flex cursor-pointer flex-col" to={`/habits/${habit.id}`}
            >
              <span className="group-hover:underline">{habit.name}</span>
              {/* TODO(2026-01-29 21:23:08): show days of week */}
              <span className="text-gray-400 text-[15px] italic">
                {habit.daysOfWeek == 255 
                  ? "Everyday" 
                  : ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].filter((label, index) => 
                    isWeekMaskDay(habit.daysOfWeek, index)).join(", ")}
              </span>
            </Link>
            <div className="ml-auto flex gap-2 text-[1.5em]">
              <span className="text-[#00FF00]">{habit.reward}</span>
              <span className="text-[#FF0000]">{habit.penalty}</span>
            </div>
          </div>
        ))}
      </div>

    <NewButton />
    </div>
  );
}

export default Habits;
