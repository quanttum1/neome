import forest_location from './assets/map-locations/0001-forest.svg'
import useNeomeStore from './useNeomeStore.js'
import selectOrderedTasks from "./selectOrderedTasks.js";
import Pin from './assets/icons/pin.svg'
import PinActive from './assets/icons/pin_active.svg'
import { Link } from 'react-router'

function Home() {
  const tasks = useNeomeStore(selectOrderedTasks);
  const taskTogglePinned = useNeomeStore((s) => s.taskTogglePinned);

  return (
    <div className="flex w-full">
      <div className="lg:w-1/2 w-full pr-1">
        <img src={forest_location} className="w-auto h-screen object-cover" />
      </div>

      <div className="w-1/2 pl-1">
        <div className="pt-2 lg hidden lg:block pb-2">
          <div className="grid grid-cols-1 gap-3">
            {tasks.map((task) => (
              <div
                className="text-[24px] pt-2 pb-3 pl-4 rounded-[1.5vw] bg-neome-grey flex items-center gap-2"
                key={task.id}
              >

                <div
                  className="hover:bg-neome-light-grey hover:rounded-[50%] cursor-pointer p-1"
                  onClick={() => taskTogglePinned(task.id)}
                >
                  {task.isPinned ? <img src={PinActive}></img>
                  : <img src={Pin}></img>}
                </div>

                <Link 
                  className="group flex cursor-pointer flex-col" to={`tasks/${task.id}`}
                >
                  <span className="group-hover:underline">{task.name}</span>
                  <span className="text-gray-400 text-[15px] italic">until {task.deadline}</span>
                </Link>
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
