import { useParams } from "react-router-dom";
import useNeomeStore from '../useNeomeStore';
import Page404 from '../Page404';
import { useNavigate } from "react-router-dom";

export default function OpenTask() {
  const navigate = useNavigate();
  const { taskId } = useParams();
  if (!taskId) return;

  const completeTask = useNeomeStore(s => s.completeTask);
  const task = useNeomeStore(s => s.getTaskById(taskId));
  if (!task) {
    // TODO(2026-01-18 21:09:37): nice error message
    return "Task doesn't exist";
  }

  function complete() {
    if (!taskId) return;
    if (!task) return;
    completeTask(taskId);
    navigate('../completed', {state: { reward: task.reward }});
  }

  return <div>
    <span>Name: {task.name}</span><br />
    <span>Deadline: {task.deadline}</span><br />
    <button onClick={complete}>Mark as completed</button>
  </div>;
}
