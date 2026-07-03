import TaskCard from './Tasks/TaskCard';
import Map from './Map';
import useNeomeStore from './useNeomeStore';
import { Link } from 'react-router';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import CarrotCounter from './CarrotCounter';

import carrotIcon from './assets/carrots/carrot.svg';

export function carrotsToString(carrots: number) {
  let base = carrots.toFixed(1);
  if (base.endsWith(".0")) base = base.slice(0, base.length - 2);
  return base;
}

function Home() {
  const tasks = useNeomeStore(s => s.getState().tasks);
  const totalCarrots = useNeomeStore(s => s.getState().totalCarrots);
  const weeklyCarrots = useNeomeStore(s => s.getWeeklyCarrots());

  // Sometimes it's useful for debugging
  // window.recomputeCurrentState = useNeomeStore(s => s.recomputeCurrentState);
  // window.events = useNeomeStore(s => s.events);
  // const sync = useSync();
  // window.sync = sync;

  const navigate = useNavigate();
  useEffect(() => {
    const redirectPath = new URLSearchParams(location.search).get("redirect");
    if (redirectPath) navigate(redirectPath + location.hash);
  }, []);

  const carrotsInfo =
    <>
      <div>
        <div className="flex justify-between">
          <div className="flex text-[1.5rem] md:text-[2.1rem] items-center">
            This Week: {carrotsToString(weeklyCarrots)}
            <img src={carrotIcon} className="h-[2.8rem]" />
          </div>
          <div className="flex text-[1.5rem] md:text-[2.1rem] items-center">
            Total: {carrotsToString(totalCarrots)}
            <img src={carrotIcon} className="h-[2.8rem]" />
          </div>
        </div>

        <div className="flex w-full">
          <CarrotCounter />
        </div>
      </div>
    </>;

  return (
    <div className="flex w-full">
      <div className="lg:w-1/2 flex relative flex-col items-center w-full">
        <div className="lg:hidden p-2 border-b border-gray-700">{carrotsInfo}</div>
        <Map />
      </div>

      <div className="w-1/2 hidden lg:block pl-1">
        <div className="pt-2 pb-2 pr-2">
          <div className="grid grid-cols-1 gap-3">

            {carrotsInfo}

            {tasks.length != 0 ?
              tasks.map((task) => (
                <TaskCard task={task} key={task.id}/>
              ))
              :
              <div className="flex justify-center text-center text-[2rem]">
                <p>There are no tasks right now. <Link className="underline" to="/tasks/new">Create one</Link>?</p>
              </div>
            }

          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
