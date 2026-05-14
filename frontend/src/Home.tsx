import TaskCard from './Tasks/TaskCard';
import Map from './Map';
import useNeomeStore from './useNeomeStore';
import { clamp } from './applyEvent';
import { Link } from 'react-router';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

const carrotIcon = "/carrots/carrot-1.0.svg";

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
            let isNeg = dailyCarrots < 0;
            let prefix = `/carrots/carrot-${isNeg ? "negative-" : ""}`;
            let number = clamp(dailyCarrots-n + +isNeg*10, 0, 1).toFixed(1);

            return <img
              src={`${prefix}${number}.svg`}
              alt=""
              className="w-1/10 h-auto"
            />;

          // TODO(2026-02-12 19:36:05): maybe make daily carrots partially filled
          // using CSS instead of having 10 SVGs, i tried doing it, but i really
          // don't understand how to make the icon full width:
          // <div key={n} className="flex-1 relative">
          //   <img
          //     src={CarrotGrey}
          //     alt=""
          //     className="w-full h-auto"
          //   />
          // 
          //   <div
          //     className="absolute top-0 left-0 h-full overflow-hidden"
          //     style={{ width: `${clamp(dailyCarrots - n, 0, 1)* 100}%` }}
          //   >
          //     <img
          //       src={CarrotIcon}
          //       alt=""
          //       className="absolute top-0 left-0 w-full h-auto"
          //     />
          //   </div>
          // </div>
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
