import { useRef } from 'react'
import useNeomeStore from '../useNeomeStore.js'
import { useNavigate } from "react-router";

export default function NewTask() {
  const inputRef = useRef();
  const addTask = useNeomeStore((s) => s.addTask);
  const navigate = useNavigate();

  function createTask() {
    addTask(inputRef.current.value);
    navigate("/tasks");
  }

  return (
    <div>
      <input ref={inputRef} />
      <button onClick={createTask}>Create</button>
    </div>
  );
}
