import useNeomeStore from '../useNeomeStore'
import NewButton from '../NewButton'

function Habits() {
  let habits = useNeomeStore(s => s.getState().habits);
  window.habits = habits;

  return <div>
    {/* TODO(2026-01-25 21:24:41): show habits the sane way */}
    {habits.map(i => {
      return JSON.stringify(i);
    })} 

    <NewButton />
  </div>;
}

export default Habits;
