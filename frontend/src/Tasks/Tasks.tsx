import useNeomeStore from '../useNeomeStore';
import Pin from '../assets/icons/pin.svg';
import PinActive from '../assets/icons/pin_active.svg';
import TaskCard from './TaskCard';
import NewButton from '../NewButton';
import CarrotCounter from '../CarrotCounter';

import carrotIcon from '../assets/carrots/carrot.svg';

export default function Tasks() {
  const tasks = useNeomeStore(s => s.getState().tasks);
  const totalCarrots = useNeomeStore(s => s.getState().totalCarrots);
  const weeklyCarrots = useNeomeStore(s => s.getWeeklyCarrots());

  return (
    <div className="p-2">

      <div className="lg:flex hidden pb-2 flex-row gap-4">
        {/* Takes all remaining space */}
        <div className="grid grid-cols-2 flex-1 min-w-0 gap-4">
          <div className="flex">
            <CarrotCounter />
          </div>

          <div>
            <input
              className="w-full bg-neome-light-grey border-2 border-neome-light-grey rounded-xl p-4 text-white focus:outline-none focus:border-neome-pink transition-all placeholder:opacity-30"
              placeholder="Search"
              autoFocus
            />
          </div>
        </div>

        {/* Takes only the width needed by the labels */}
        <div className="flex flex-row shrink-0 whitespace-nowrap gap-4">
          <div className="flex text-[1.5rem] md:text-[2.1rem] items-center">
            This Week: {weeklyCarrots.toFixed(1)}
            <img src={carrotIcon} className="h-[2.8rem]" />
          </div>

          <div className="flex text-[1.5rem] md:text-[2.1rem] items-center">
            Total: {totalCarrots.toFixed(1)}
            <img src={carrotIcon} className="h-[2.8rem]" />
          </div>
        </div>
      </div>

      <div className="lg:hidden block pb-2">
        <div className="flex justify-between">
          <div className="flex text-[1.5rem] md:text-[2.1rem] items-center">
            This Week: {weeklyCarrots.toFixed(1)}
            <img src={carrotIcon} className="h-[2.8rem]" />
          </div>
          <div className="flex text-[1.5rem] md:text-[2.1rem] items-center">
            Total: {totalCarrots.toFixed(1)}
            <img src={carrotIcon} className="h-[2.8rem]" />
          </div>
        </div>

        <div className="pt-0 flex">
          <CarrotCounter />
        </div>
      </div>

      {tasks.length != 0 ?
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {tasks.map((task) => (
            <TaskCard task={task} key={task.id}/>
          ))}
        </div>
        :
        <div className="flex text-[1.5rem] text-center justify-center">
          <p>There are no tasks right now. Create one by clicking the "New" button</p>
        </div>
      }

    <NewButton />
    </div>
  );
}
