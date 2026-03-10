import logo from './assets/logo.svg';
import { Link, Outlet, useLocation } from "react-router";
import { useState } from "react";
import Tour from "./Tour";
import useNeomeStore from "./useNeomeStore";

import homeIcon from './assets/icons/home.svg';
import tasksIcon from './assets/icons/tasks.svg';
import habitsIcon from './assets/icons/habits.svg';
// import statisticsIcon from './assets/icons/statistics.svg';
// import settingsIcon from './assets/icons/settings.svg';
import tourIcon from './assets/icons/tour.svg';

function Layout() {
  const isTourTaken = useNeomeStore(s => s.isTourTaken);
  const setIsTourTaken = useNeomeStore(s => s.setIsTourTaken);

  const [isTourOpen, setIsTourOpen] = useState(!isTourTaken);

  const pathname = useLocation().pathname;

  function openTour() {
    setIsTourOpen(true);
  }

  function closeTour() {
    setIsTourOpen(false);
    setIsTourTaken(true);
  }

  return (
    <>
      <div className="flex flex-col h-screen">
        <div className="flex w-screen h-full overflow-scroll">
          <aside className="w-79 p-8 pl-6 pb-3 border-r border-gray-700 hidden md:flex flex-col">
            <Link to="/">
              <img className="ml-2" src={logo} />
            </Link>

            {/* TODO(2026-03-10 13:22:32): make an array of links and generate the navs from it */}
            {/* because there's a lot of copy-pasta in here */}
            <nav className="mt-6 flex-1 text-[26px]">
              <ul className="flex flex-col h-full">
                {/* TODO(2026-03-03 10:20:31): make icons clickable too in this list */}

                <li className="p-2 flex">
                  <img className="pt-1 w-[2rem] h-[2rem]" src={homeIcon} />
                  <Link className="ml-2" to="/">Home</Link>
                </li>

                <li className="p-2 flex">
                  <img className="pt-1 w-[2rem] h-[2rem]" src={tasksIcon} />
                  <Link className="ml-2" to="/tasks">Tasks</Link>
                </li>

                <li className="p-2 flex">
                  <img className="pt-1 w-[2rem] h-[2rem]" src={habitsIcon} />
                  <Link className="ml-2" to="/habits">Habits</Link>
                </li>

                {/* TODO(2026-03-08 18:45:59): add Statistics */}
                {/* <li className="p-2 flex"> */}
                {/*   <img className="pt-1 w-[2rem] h-[2rem]" src={statisticsIcon} /> */}
                {/*   <Link className="ml-2" to="/statistics">Statistics</Link> */}
                {/* </li> */}

                {/* TODO(2026-03-08 18:46:25): add Settings */}
                {/* <li className="p-2 flex"> */}
                {/*   <img className="pt-1 w-[2rem] h-[2rem]" src={settingsIcon} /> */}
                {/*   <Link className="ml-2" to="/settings">Settings</Link> */}
                {/* </li> */}

                <li className="mt-auto p-2 flex">
                  <img className="pt-1 w-[2rem] h-[2rem]" src={tourIcon} />
                  <span className="ml-2 cursor-pointer" onClick={openTour}>
                    Take a tour
                  </span>
                </li>

              </ul>
            </nav>
          </aside>

          <main className="flex-1 pb-[64px] md:pb-0 overflow-auto">
            <Outlet />
          </main>

        </div>
        <nav className="md:hidden w-full bg-neome-background h-[64px] sticky bottom-0 flex border-gray-700 border-t">
          <ul className="flex flex-row w-full justify-around m-2">
            <li className={`p-2 flex rounded-full ${pathname == '/' ? 'bg-gray-700' : ''}`}>
              <Link to="/">
                <img className="pt-1 w-[2rem] h-[2rem]" src={homeIcon} />
              </Link>
            </li>

            <li className={`p-2 flex rounded-full ${pathname.startsWith('/tasks') ? 'bg-gray-700' : ''}`}>
              <Link to="/tasks">
                <img className="pt-1 w-[2rem] h-[2rem]" src={tasksIcon} />
              </Link>
            </li>

            <li className={`p-2 flex rounded-full ${pathname.startsWith('/habits') ? 'bg-gray-700' : ''}`}>
              <Link to="/habits">
                <img className="pt-1 w-[2rem] h-[2rem]" src={habitsIcon} />
              </Link>
            </li>

            {/* TODO(2026-03-08 18:45:59): add Statistics */}
            {/* <li className="p-2 flex"> */}
            {/*   <img className="pt-1 w-[2rem] h-[2rem]" src={statisticsIcon} /> */}
            {/*   <Link className="ml-2" to="/statistics">Statistics</Link> */}
            {/* </li> */}

            {/* TODO(2026-03-08 18:46:25): add Settings */}
            {/* <li className="p-2 flex"> */}
            {/*   <img className="pt-1 w-[2rem] h-[2rem]" src={settingsIcon} /> */}
            {/*   <Link className="ml-2" to="/settings">Settings</Link> */}
            {/* </li> */}

            <li className="mt-auto p-2 flex">
              <span className="cursor-pointer" onClick={openTour}>
                <img className="pt-1 w-[2rem] h-[2rem]" src={tourIcon} />
              </span>
            </li>
          </ul>
        </nav>
      </div>

      <Tour
        isOpen={isTourOpen}
        onClose={closeTour}
      />
    </>
  );
}

export default Layout;
