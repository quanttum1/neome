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

  const addTask = useNeomeStore((s: NeomeStore) => s.addTask);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const now_ = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");

  // Format YYYY-MM-DDTHH:mm
  const localDatetime = `${now_.getFullYear()}-${pad(now_.getMonth() + 1)}-${pad(
    now_.getDate()
  )}T${pad(now_.getHours())}:${pad(now_.getMinutes())}`;

   function create(e: React.FormEvent): void {
    e.preventDefault();
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

  return (
    <div className="task-container">
      <h3>Create new task</h3>
      <form onSubmit={create}>
        <div className="field">
          <label>Назва</label>
          <input ref={nameRef} type="text" placeholder="What you need to do?" />
        </div>

        <div className="row">
          <div className="field">
            <label>Prize</label>
            <input ref={rewardRef} type="number" defaultValue="0" />
          </div>
          <div className="field">
            <label>Fine</label>
            <input ref={penaltyRef} type="number" defaultValue="0" />
          </div>
        </div>

        <div className="field">
          <label>Deadline</label>
          <input
            ref={deadlineRef}
            type="datetime-local"
            defaultValue={localDatetime}
          />
        </div>

        {error && <p className="error">{error}</p>}

        <div className="form-footer">
          <button type="button" onClick={() => navigate('/tasks')}>Cancel</button>
          <button type="submit" className="submit-btn">Add task</button>
        </div>
      </form>
    </div>
  );
}
