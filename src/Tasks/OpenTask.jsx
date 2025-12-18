import { useParams } from "react-router-dom";

export default function OpenTask() {
  const { taskId } = useParams();

  return <div>
    {/* TODO(2025-12-17 23:15:34): implement OpenTask */}
    {taskId}
  </div>
}
