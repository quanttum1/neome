import { useRef } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import useNeomeStore from '../useNeomeStore';
import createTask from '../factories/createTask'
import { isUTCString } from '../utc'

export default function NewTask() {
  const nameRef = useRef<HTMLInputElement>(null);
  const deadlineRef = useRef<HTMLInputElement>(null);
  const rewardRef = useRef<HTMLInputElement>(null);
  const penaltyRef = useRef<HTMLInputElement>(null);

  // TODO(2026-01-16 14:31:13): actually add tasks
  const addTask = useNeomeStore((s) => s.addTask);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  function create(): void {
    setError("");

    if (!nameRef.current) return setError("Name is not set");
    if (!deadlineRef.current) return setError("Deadline is not set");
    if (!rewardRef.current) return setError("Reward is not set");
    if (!penaltyRef.current) return setError("Penalty is not set");

    const reward = Number(rewardRef.current.value);
    const penalty = Number(penaltyRef.current.value);

    if (Number.isNaN(reward)) return setError("Reward is not a number");
    if (Number.isNaN(penalty)) return setError("Penalty is not a number");

    if (!isUTCString(deadlineRef.current.value)) return setError("Invalid deadline");

    addTask(createTask({
      name: nameRef.current.value,
      deadline: deadlineRef.current.value,
      reward: reward,
      penalty: -penalty,
    }));
    navigate('/tasks');
  }

  return (
    <div>
      {/* TODO(2026-01-16 12:33:29): make a sane UI for `NewTask` */}
      Name: <input ref={nameRef} />
      Reward: <input type="number" ref={rewardRef} />
      Penalty: <input type="number" ref={penaltyRef} />
      Deadline: <input type="datetime-local" ref={deadlineRef} />

      <button onClick={create}>Create</button>
      {error}
    </div>
  );
}
