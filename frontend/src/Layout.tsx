import logo from './assets/logo.svg';
import { Link, Outlet } from "react-router";
import { useState } from "react";

import homeIcon from './assets/icons/home.svg';
import tasksIcon from './assets/icons/tasks.svg';
import habitsIcon from './assets/icons/habits.svg';
import statisticsIcon from './assets/icons/statistics.svg';
import settingsIcon from './assets/icons/settings.svg';
import tourIcon from './assets/icons/tour.svg';

function Layout() {
  const [isTourOpen, setIsTourOpen] = useState(false);

  function openTour() {
    setIsTourOpen(true);
  }

  function closeTour() {
    setIsTourOpen(false);
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
                <span className="ml-2 cursor-pointer" onClick={openTour}>Take a tour</span>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="flex-1 overflow-auto pl-2 pr-2">
          <Outlet />
        </main>
      </div>

      {isTourOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/10 "
              onClick={closeTour}
            />

            <div className="relative z-10 w-full max-w-2xl bg-neome-background border border-gray-700 rounded-2xl shadow-2xl p-4">

              <div className="flex justify-end items-center mb-4">
                <button
                  onClick={closeTour}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="h-80 flex flex-col items-center">
                <h2 className="text-[2rem]">
                  Hey, I'm Carro!
                </h2>
                <img src="/tour/greeting_carro.gif" className="w-auto h-full object-contain"></img>
                <h2 className="text-[2rem] mb-5">
                  Want to learn how NEOME works?
                </h2>
              </div>

              <div className=" flex justify-center gap-2">
                <button
                  className="px-5 py-2 rounded-lg bg-neome-pink text-black cursor-pointer"
                >
                  Yes
                </button>

                <button
                  onClick={closeTour}
                  className="px-5 py-2 rounded-lg text-neome-pink border-neome-pink border cursor-pointer"
                >
                  Skip
                </button>

              </div>

            </div>
          </div>
        )}
    </>
  );
}

export default Layout;

