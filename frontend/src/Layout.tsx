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
  const [tourPage, setTourPage] = useState(0);

  function openTour() {
    setIsTourOpen(true);
    setTourPage(0);
  }

  function closeTour() {
    setIsTourOpen(false);
  }

  function skipTour() {
    setTourPage(-1);
  }

  const tourPopupClass = "relative z-10 w-full max-w-2xl bg-neome-background border border-gray-700 rounded-2xl shadow-2xl p-4";

  function nextTourPage() {
    setTourPage(tourPage + 1);
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
          {/* TODO(2026-03-04 12:52:42): close the pop-up when the skip tour popup is open */}
          <div
            className="absolute inset-0 bg-black/10 "
            onClick={skipTour}
          />

          <div className={tourPage == -1 ? tourPopupClass : "hidden"}>

            <div className="flex justify-end items-center mb-4">
              <button
                onClick={closeTour}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <p>
              You can always access the tour by clicking
              <b>
                &nbsp;
                <img src={tourIcon} className="inline"/>
                &nbsp;Take a tour&nbsp;
              </b>
              button
            </p>

            <div className="mt-6 flex justify-center gap-2">
              <button
                className="px-5 py-2 rounded-lg bg-neome-pink text-black cursor-pointer"
                onClick={closeTour}
              >
                Okay
              </button>

            </div>
          </div>

          <div className={tourPage == 0 ? tourPopupClass : "hidden"}>

            <div className="flex justify-end items-center mb-4">
              <button
                onClick={skipTour}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <div className="h-80 flex flex-col items-center">
              <h2 className="text-[2rem]">
                Hey, I'm Carro!
              </h2>
              <img src="/tour/greeting_carro.gif" className="w-auto sm:max-h-52 max-h-50 object-contain"></img>
              <h2 className="text-[2rem] mb-5">
                Want to learn how NEOME works?
              </h2>
            </div>

            <div className=" flex justify-center gap-2">
              <button
                className="px-5 py-2 rounded-lg bg-neome-pink text-black cursor-pointer"
                onClick={nextTourPage}
              >
                Yes
              </button>

              <button
                onClick={skipTour}
                className="px-5 py-2 rounded-lg text-neome-pink border-neome-pink border cursor-pointer"
              >
                Skip
              </button>

            </div>
          </div>

          <div className={tourPage == 1 ? tourPopupClass : "hidden"}>
            <div className="flex justify-end items-center mb-4">
              <button
                onClick={skipTour}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <span>TODO: image of a task card</span>

            <p className="text-xl">
              <b>
                <img src={tasksIcon} className="inline" />
                &nbsp;Tasks&nbsp;
              </b>
              are the core of NEOME workflow, you can set the reward, penalty and deadline of a task
            </p>

            <div className="mt-6 flex justify-center gap-2">
              <button
                className="px-5 py-2 rounded-lg bg-neome-pink text-black cursor-pointer"
                onClick={nextTourPage}
              >
                Next
              </button>

              <button
                onClick={skipTour}
                className="px-5 py-2 rounded-lg text-neome-pink border-neome-pink border cursor-pointer"
              >
                Skip
              </button>

            </div>
          </div>

          <div className={tourPage == 2 ? tourPopupClass : "hidden"}>
            <div className="flex justify-end items-center mb-4">
              <button
                onClick={skipTour}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <span>TODO: image of a habit card</span>

            <p className="text-xl">
              <b>
                <img src={habitsIcon} className="inline" />
                &nbsp;Habits:&nbsp;
              </b>
              if you repeat something on a regular basis, you can create a habit, which will automatically create the task as often as you need
            </p>

            <div className="mt-6 flex justify-center gap-2">
              <button
                className="px-5 py-2 rounded-lg bg-neome-pink text-black cursor-pointer"
                onClick={nextTourPage}
              >
                Next
              </button>

              <button
                onClick={skipTour}
                className="px-5 py-2 rounded-lg text-neome-pink border-neome-pink border cursor-pointer"
              >
                Skip
              </button>

            </div>
          </div>

          <div className={tourPage == 3 ? tourPopupClass : "hidden"}>
            <div className="flex justify-end items-center mb-4">
              <button
                onClick={skipTour}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <span>
              TODO: gif of increasing carrot counter, increasing from -2 to 2
            </span>

            <p className="text-xl">
              As you complete tasks, you feed Carro with carrots
            </p>

            <div className="mt-6 flex justify-center gap-2">
              <button
                className="px-5 py-2 rounded-lg bg-neome-pink text-black cursor-pointer"
                onClick={nextTourPage}
              >
                Next
              </button>

              <button
                onClick={skipTour}
                className="px-5 py-2 rounded-lg text-neome-pink border-neome-pink border cursor-pointer"
              >
                Skip
              </button>

            </div>
          </div>

          <div className={tourPage == 4 ? tourPopupClass : "hidden"}>
            <div className="flex justify-end items-center mb-4">
              <button
                onClick={skipTour}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <span>
              TODO: image of the carro on a milestone
            </span>

            <p className="text-xl">
              Carro moves to the next milestones every 10 carrots. you can't gain or lose more than 10 carrots per day.
            </p>

            <div className="mt-6 flex justify-center gap-2">
              <button
                className="px-5 py-2 rounded-lg bg-neome-pink text-black cursor-pointer"
                onClick={nextTourPage}
              >
                Next
              </button>

              <button
                onClick={skipTour}
                className="px-5 py-2 rounded-lg text-neome-pink border-neome-pink border cursor-pointer"
              >
                Skip
              </button>

            </div>
          </div>

          <div className={tourPage == 5 ? tourPopupClass : "hidden"}>
            <div className="flex justify-end items-center mb-4">
              <button
                onClick={skipTour}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <span>
              TODO: image of carro holding a heart
            </span>

            <p className="text-xl">
              The app is still being developed and more features are coming.
              It is 100% open-source, and anyone can contribute to it.
              If you want to report a bug, suggest a feature, don't hesitate to&nbsp;
              <a href="https://example.com" className="underline">
                contact me
              </a>.
              You can also&nbsp;
              <a href="https://example.com" className="underline">
                join our discord
              </a>
              &nbsp;if you want to chat with me and like-minded people.
              <br /><br />
              Have a productive day &lt;3
            </p>

            <div className="mt-6 flex justify-center gap-2">
              <button
                className="px-5 py-2 rounded-lg bg-neome-pink text-black cursor-pointer"
                onClick={skipTour}
              >
                End tour
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Layout;

