import useNeomeStore from '../useNeomeStore.js'
import { Link } from 'react-router'

export default function Tasks() {
  const store = useNeomeStore();
  window.addTask = useNeomeStore((s) => s.addTask);
  window.removeTask = useNeomeStore((s) => s.removeTask);
  const removeTask = useNeomeStore((s) => s.removeTask);

  return (
    <div>
      { /* TODO: Finish it */ }
      <ul>
        {store.tasks.map((task, i) => (
          <li key={i}>
            <p className="cursor-pointer hover:underline" onClick={() => removeTask(i)}>{task}</p>
          </li>
        ))}
      </ul>


      {/* TODO: Maybe add a shadow coloured with `bg-neome-dark-pink` */}
      {/* TODO: Add `Shift+N` shortcut for this button */}
      {/* TODO: Make a separate class out of it */}
      <Link
        to="new"
        className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-neome-pink text-black px-4 py-3 shadow-lg cursor-pointer">
        <span class="text-xl leading-none">+</span>
        <span>New</span>
      </Link>
    </div>
  );
}
