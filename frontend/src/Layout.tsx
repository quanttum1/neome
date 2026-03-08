import logo from './assets/logo.svg';
import { Link, Outlet } from "react-router";
import { useState } from "react";
import Tour from "./Tour";
import useNeomeStore from "./useNeomeStore";

import homeIcon from './assets/icons/home.svg';
import tasksIcon from './assets/icons/tasks.svg';
import habitsIcon from './assets/icons/habits.svg';
import statisticsIcon from './assets/icons/statistics.svg';
import settingsIcon from './assets/icons/settings.svg';
import tourIcon from './assets/icons/tour.svg';

function Layout() {
  const isTourTaken = useNeomeStore(s => s.isTourTaken);
  const setIsTourTaken = useNeomeStore(s => s.setIsTourTaken);

  const [isTourOpen, setIsTourOpen] = useState(!isTourTaken);

  function openTour() {
    setIsTourOpen(true);
  }

  function closeTour() {
    setIsTourOpen(false);
    setIsTourTaken(true);
  }

  return (
    <>
      <div className="flex h-screen">
        <aside className="w-79 p-8 pl-6 pb-3 border-r border-gray-700 flex flex-col">
          <Link to="/">
            <img className="ml-2" src={logo} />
          </Link>

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

              <li className="p-2 flex">
                <img className="pt-1 w-[2rem] h-[2rem]" src={statisticsIcon} />
                <Link className="ml-2" to="/statistics">Statistics</Link>
              </li>

              <li className="p-2 flex">
                <img className="pt-1 w-[2rem] h-[2rem]" src={settingsIcon} />
                <Link className="ml-2" to="/settings">Settings</Link>
              </li>

              <li className="mt-auto p-2 flex">
                <img className="pt-1 w-[2rem] h-[2rem]" src={tourIcon} />
                <span className="ml-2 cursor-pointer" onClick={openTour}>
                  Take a tour
                </span>
              </li>

            </ul>
          </nav>
        </aside>

        <main className="flex-1 overflow-auto pl-2 pr-2">
          <Outlet />
        </main>
      </div>

      <Tour
        isOpen={isTourOpen}
        onClose={closeTour}
      />
    </>
  );
}

export default Layout;
