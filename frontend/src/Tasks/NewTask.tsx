import { useRef } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import useNeomeStore from '../useNeomeStore';
import createTask from '../factories/createTask'
import { getCreateTaskError } from '../factories/createTask'
import { isValidDate } from '../utc'
import { localInputToUTC } from '../utc'
import { now } from '../utc'

export default function NewTask() {
  const nameRef = useRef<HTMLInputElement>(null);
  const deadlineRef = useRef<HTMLInputElement>(null);
  const rewardRef = useRef<HTMLInputElement>(null);
  const penaltyRef = useRef<HTMLInputElement>(null);

  const addTask = useNeomeStore((s) => s.addTask);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  function create(): void {
    setError("");

    if (!nameRef.current) return setError("Name is not set");
    if (!deadlineRef.current) return setError("Deadline is not set");
    if (!rewardRef.current) return setError("Reward is not set");
    if (!penaltyRef.current) return setError("Penalty is not set");

    const task = {
      name: nameRef.current.value,
      deadline: deadlineRef.current.value,
      reward: Number(rewardRef.current.value),
      penalty: -Number(penaltyRef.current.value),
    };

    const error = getCreateTaskError(task);
    if (error) return setError(error);

    addTask(createTask(task));
    navigate('/tasks');
  }

  const now_ = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");

  // Format YYYY-MM-DDTHH:mm
  const localDatetime = `${now_.getFullYear()}-${pad(now_.getMonth() + 1)}-${pad(
    now_.getDate()
  )}T${pad(now_.getHours())}:${pad(now_.getMinutes())}`;

  return (
    <div>
      {/* TODO(2026-01-16 12:33:29): make a sane UI for `NewTask` */}
      Name: <input ref={nameRef} /><br />
      Reward: <input type="text" ref={rewardRef} /><br />
      Penalty: <input type="text" ref={penaltyRef} /><br />
      Deadline: <input type="datetime-local" defaultValue={localDatetime} ref={deadlineRef} /><br />

      <button onClick={create}>Create</button><br />
      {error}
    </div>
  );
}
