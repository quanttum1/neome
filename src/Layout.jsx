import logo from './assets/logo.svg';
import { Link, Outlet } from "react-router";

import home_icon from './assets/icons/home.svg'
import tasks_icon from './assets/icons/tasks.svg'
import habits_icon from './assets/icons/habits.svg'
import statistics_icon from './assets/icons/statistics.svg'
import settings_icon from './assets/icons/settings.svg'

function Layout() {
  return (
    <div className="flex h-screen">
      <aside className="w-79 p-8 pl-6 pb-3 border-r border-gray-700 flex flex-col">
        <Link to="/">
          <img className="ml-2" src={logo} />
        </Link>
        <nav className="mt-6 flex-1 text-[26px]">
          <ul className="flex flex-col h-full">
            <li className="p-2 flex">
              <img className="pt-1 w-[2rem] h-[2rem]" src={home_icon} />
              <Link className="ml-2" to="/">Home</Link>
            </li>
            <li className="p-2 flex">
              <img className="pt-1 w-[2rem] h-[2rem]" src={tasks_icon} />
              <Link className="ml-2" to="/tasks">Tasks</Link>
            </li>
            <li className="p-2 flex">
              <img className="pt-1 w-[2rem] h-[2rem]" src={habits_icon} />
              <Link className="ml-2" to="/habits">Habits</Link>
            </li>
            <li className="p-2 flex">
              <img className="pt-1 w-[2rem] h-[2rem]" src={statistics_icon} />
              <Link className="ml-2" to="/statistics">Statistics</Link>
            </li>
            <li className="p-2 flex">
              <img className="pt-1 w-[2rem] h-[2rem]" src={settings_icon} />
              <Link className="ml-2" to="/settings">Settings</Link>
            </li>

            <li className="mt-auto p-2">
              <Link to="about">
                About NEOME
                <i className="text-gray-400 text-[20px] ml-2">v1.0</i>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1 overflow-auto pl-2 pr-2">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout

