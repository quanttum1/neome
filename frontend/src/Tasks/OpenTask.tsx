import { useParams } from "react-router-dom";
import useNeomeStore from '../useNeomeStore';
import Page404 from '../Page404';

export default function OpenTask() {
  const { taskId } = useParams();
  if (taskId == undefined) return <Page404 />;

  const task = useNeomeStore(s => s.getTaskById(taskId));
  if (task == undefined) {
    // TODO(2026-01-18 21:09:37): nice error message
    return "Task doesn't exist";
  }

  return <div>
    <span>Name: {task.name}</span><br />
    <span>Deadline: {task.deadline}</span><br />
  </div>
}
