import useNeomeStore from '../useNeomeStore';
import Pin from '../assets/icons/pin.svg';
import PinActive from '../assets/icons/pin_active.svg';
import TaskCard from './TaskCard';
import NewButton from '../NewButton';

export default function Tasks() {
  const tasks = useNeomeStore(s => s.getState().tasks);

  return (
    <div className="p-2">
      {tasks.length != 0 ?
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {tasks.map((task) => (
            <TaskCard task={task} key={task.id}/>
          ))}
        </div>
        :
        <div className="flex text-[1.5rem] text-center justify-center">
          <p>There are no tasks for you. Joking, I know you've got some, so go ahead and click that "New" button</p>
        </div>
      }

    <NewButton />
    </div>
  );
}
