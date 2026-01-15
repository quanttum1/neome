import useNeomeStore from '../useNeomeStore.js'
import { Link } from 'react-router'
import Pin from '../assets/icons/pin.svg'
import PinActive from '../assets/icons/pin_active.svg'
import selectOrderedTasks from "../selectOrderedTasks";
import TaskCard from './TaskCard.jsx'

export default function Tasks() {
  const tasks = useNeomeStore(selectOrderedTasks);

  return (
    <div className="pt-2 pb-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {tasks.map((task) => (
          <TaskCard task={task} key={task.id}/>
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
