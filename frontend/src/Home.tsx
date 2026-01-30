import forest_location from './assets/map-locations/0001-forest.svg';
import CarrotIcon from './assets/icons/carrot.svg';
import TaskCard from './Tasks/TaskCard';
import useNeomeStore from './useNeomeStore';

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
        <img src={forest_location} className="w-auto h-screen object-cover" />
      </div>

      {/* TODO(2025-12-17 21:20:34): show the carrots earned today the nice way */}
      {/* deps: (2025-12-17 21:19:28) */}
      <div className="w-1/2 hidden lg:block pl-1">
        <div className="pt-2 pb-2">
          <div className="grid grid-cols-1 gap-3">

            <div>
              <div className="flex justify-between">
                <div className="flex text-[2.1rem] items-center">
                  This Week {32}
                  <img src={CarrotIcon} className="h-[2.8rem]" />
                </div>
                <div className="flex text-[2.1rem] items-center">
                  Total: {totalCarrots}
                  <img src={CarrotIcon} className="h-[2.8rem]" />
                </div>
              </div>

              <div className="text-[2.1rem] ">
                Carrots today: {dailyCarrots}
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
