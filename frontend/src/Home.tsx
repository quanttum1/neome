import TaskCard from './Tasks/TaskCard';
import Map from './Map';
import useNeomeStore from './useNeomeStore';
import { clamp } from './applyEvent';
import { Link } from 'react-router';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

import carrotGrey from './assets/carrots/carrot-grey.svg';
import carrotIcon from './assets/carrots/carrot.svg';
import carrotNegative from './assets/carrots/carrot-negative.svg';

function Home() {
  const tasks = useNeomeStore(s => s.getState().tasks);
  const totalCarrots = useNeomeStore(s => s.getState().totalCarrots);
  const dailyCarrots = useNeomeStore(s => s.getState().dailyCarrots);
  const weeklyCarrots = useNeomeStore(s => s.getWeeklyCarrots());

  // Sometimes it's useful for debugging
  // window.recomputeCurrentState = useNeomeStore(s => s.recomputeCurrentState);
  // window.events = useNeomeStore(s => s.events);

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
            This Week: {weeklyCarrots.toFixed(1)}
            <img src={carrotIcon} className="h-[2.8rem]" />
          </div>
          <div className="flex text-[1.5rem] md:text-[2.1rem] items-center">
            Total: {totalCarrots.toFixed(1)}
            <img src={carrotIcon} className="h-[2.8rem]" />
          </div>
        </div>

        <div className="flex w-full">
          {[...Array(10).keys()].map(n => {
            // Fraction of this slot that should be filled (0 … 1)
            const fillFraction = clamp((dailyCarrots >= 0 ? 0 : 10) + dailyCarrots - n, 0, 1);
            // Convert to a CSS percentage for the clip‑path
            const clipPercent = `${(1 - fillFraction) * 100}%`;
            carrotNegative;

            return (
              <div key={n} className="flex-1 relative carrot-wrapper">
                {/* Grey carrot – always shown */}
                <img src={carrotGrey} alt="" className="carrot-grey" />

                {/* Coloured carrot – clipped to the exact fraction */}
                <img
                  src={dailyCarrots > 0 ? carrotIcon : carrotNegative}
                  alt=""
                  className="carrot-fill"
                  style={{ clipPath: `inset(0 ${clipPercent} 0 0)` }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>;

  return (
    <div className="flex w-full">
      <div className="lg:w-1/2 flex relative flex-col items-center w-full">
        <div className="lg:hidden border-b border-gray-700">{carrotsInfo}</div>
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
