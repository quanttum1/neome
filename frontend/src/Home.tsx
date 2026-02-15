import forest_location from './assets/map-locations/0001-forest.svg';
import CarrotIcon from './assets/icons/carrot.svg';
import CarrotGrey from './assets/icons/carrot_grey.svg';
import TaskCard from './Tasks/TaskCard';
import useNeomeStore from './useNeomeStore';
import { clamp } from './applyEvent';

function Home() {
  const tasks = useNeomeStore(s => s.getState().tasks);
  const totalCarrots = useNeomeStore(s => s.getState().totalCarrots);
  const dailyCarrots = useNeomeStore(s => s.getState().dailyCarrots);

  // Sometimes it's useful for debugging
  // window.recomputeCurrentState = useNeomeStore(s => s.recomputeCurrentState);
  // window.events = useNeomeStore(s => s.events);

  return (
    <div className="flex w-full">
      <div className="lg:w-1/2 flex flex-col items-center w-full pr-1">
        {/* TODO(2026-02-15 10:50:07): add Carro and different locations */}
        <img src={forest_location} className="w-auto h-screen object-cover" />
      </div>

      <div className="w-1/2 hidden lg:block pl-1">
        <div className="pt-2 pb-2">
          <div className="grid grid-cols-1 gap-3">

            <div>
              <div className="flex justify-between">
                <div className="flex text-[2.1rem] items-center">
                  {/* TODO(2026-02-08 15:29:43): show weekly carrots */}
                  This Week: TODO
                  <img src={CarrotIcon} className="h-[2.8rem]" />
                </div>
                <div className="flex text-[2.1rem] items-center">
                  Total: {totalCarrots.toFixed(1)}
                  <img src={CarrotIcon} className="h-[2.8rem]" />
                </div>
              </div>

              <div className="flex ">
                {[...Array(10).keys()].map(n => (
                    <img
                      src={`/carrots/carrot-${clamp(dailyCarrots - n, 0, 1).toFixed(1)}.svg`}
                      alt=""
                      className="w-full h-auto"
                    />

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
                ))}
              </div>
            </div>

            {tasks.map((task) => (
              <TaskCard task={task} key={task.id}/>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
