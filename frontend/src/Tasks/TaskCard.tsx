import useNeomeStore from '../useNeomeStore';
import { useNavigate } from 'react-router';
import PinIcon from '../assets/icons/pin.svg';
import PinActiveIcon from '../assets/icons/pin_active.svg';
import BinIcon from '../assets/icons/bin.svg';
import CompleteIcon from '../assets/icons/complete.svg';
import { Link } from 'react-router';
import { now } from '../utc';

interface TaskCardProps {
  task: Task;
}

function TaskCard(props: TaskCardProps) {
  let task = props.task;

  const taskTogglePinned = useNeomeStore((s) => s.taskTogglePinned);
  const completeTask = useNeomeStore(s => s.completeTask);
  const navigate = useNavigate();

  function complete() {
    completeTask(task.id);
    navigate('/tasks/completed', {state: { reward: task.reward }});
  }

  const buttonClass = "hover:bg-neome-light-grey cursor-pointer rounded-[20%]";

  return (
    <div
      className="group/card text-[24px] pt-2 pb-3 pl-4 pr-4 rounded-[1.5vw] bg-neome-grey flex items-center gap-2"
    >

      <div
        className="hover:bg-neome-light-grey hover:rounded-[50%] cursor-pointer p-1"
        onClick={() => taskTogglePinned(task.id)}
      >
        <img src={task.isPinned ? PinActiveIcon : PinIcon}></img>
      </div>

      <Link 
        className="group/link flex cursor-pointer flex-col" to={`/tasks/${task.id}`}
      >
        <span className="group-hover/link:underline">{task.name}</span>
        <span className="text-gray-400 text-[15px] italic">
          {(() => {
            const ms = new Date(task.deadline).getTime() - new Date(now()).getTime();
            const minutes = ms / 1000 / 60;

            if (minutes < 1) return "less than a minute";
            const hours = minutes / 60;

            if (hours < 1) return `${minutes.toFixed()} minutes`;
            const days = hours / 24;

            if (days < 1) return `${hours.toFixed()} hours`;
            const weeks = days / 7;

            if (weeks < 1) return `${days.toFixed()} days`;

            return `${weeks.toFixed()} weeks`;
          })()} left
        </span>
      </Link>

      <div className="group-hover/card:hidden ml-auto flex gap-2 text-[1.5em]">
        <span className="text-[#00FF00]">{task.reward}</span>
        <span className="text-[#FF0000]">{task.penalty}</span>
      </div>

      <div className="hidden group-hover/card:flex ml-auto flex gap-2 text-[1.5em]">
        {/* TODO(2026-02-24 20:54:44): ask for comfirmation before completing the task */}
        <button className={buttonClass} onClick={complete}>
          <img src={CompleteIcon} />
        </button>

        {/* TODO(2026-02-24 20:53:26): add deletion button on task cards */}
        {/* <button className={buttonClass}> */}
        {/*   <img src={BinIcon} /> */}
        {/* </button> */}
      </div>

    </div>
  );
}

export default TaskCard;
