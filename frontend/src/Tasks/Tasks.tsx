import useNeomeStore from '../useNeomeStore';
import Pin from '../assets/icons/pin.svg';
import PinActive from '../assets/icons/pin_active.svg';
import TaskCard from './TaskCard';
import NewButton from '../NewButton';

export default function Tasks() {
  const tasks = useNeomeStore(s => s.getState().tasks);

  return (
    <div className="pt-2 pb-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {tasks.map((task) => (
          <TaskCard task={task} key={task.id}/>
        ))}
      </div>

    <NewButton />
    </div>
  );
}
