import { useParams } from "react-router-dom";

export default function OpenTask() {
  const { taskId } = useParams();

  return <div>
    {/* TODO */}
    {taskId}
  </div>
}
