import forest_location from './assets/map-locations/0001-forest.svg'
import useNeomeStore from './useNeomeStore.js'

function Home() {
  const store = useNeomeStore();
  const arr = ["foo", "bar", "baz"];

  return (
    <div className="flex w-full">
      <div className="w-1/2 pr-1">
        <img src={forest_location} className="w-auto h-screen object-cover" />
      </div>
      <div className="w-1/2 pl-1">
        todo list tasks
      </div>
    </div>
  );
}

export default Home;
