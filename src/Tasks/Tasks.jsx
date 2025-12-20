import useNeomeStore from '../useNeomeStore.js'
import { Link } from 'react-router'
import Pin from '../assets/icons/pin.svg'
import PinActive from '../assets/icons/pin_active.svg'
import selectOrderedTasks from "../selectOrderedTasks.js";

export default function Tasks() {
  const tasks = useNeomeStore(selectOrderedTasks);
  window.addTask = useNeomeStore((s) => s.addTask); // TODO: delete this
  window.removeTask = useNeomeStore((s) => s.removeTask);
  const removeTask = useNeomeStore((s) => s.removeTask);
  const taskTogglePinned = useNeomeStore((s) => s.taskTogglePinned);

  return (
    <div className="pt-2 pb-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
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

            <Link className="group flex cursor-pointer flex-col" to={task.id}>
              <span className="group-hover:underline">{task.name}</span>
              <span className="text-gray-400 text-[15px] italic">until {task.deadline}</span>
            </Link>
          </div>
        ))}
      </div>


      {/* TODO: Maybe add a shadow coloured with `neome-dark-pink` */}
      {/* TODO: Add `Shift+N` shortcut for this button */}
      {/* TODO: Make a separate component out of it? */}
      <Link
        to="new"
        className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-neome-pink text-black px-4 py-3 shadow-lg cursor-pointer">
        <span className="text-xl leading-none">+</span>
        <span>New</span>
      </Link>
    </div>
  );
}
