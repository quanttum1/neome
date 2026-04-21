import logo from './assets/logo.svg';
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import Tour from "./Tour";
import useNeomeStore from "./useNeomeStore";

import homeIcon from './assets/icons/home.svg';
import tasksIcon from './assets/icons/tasks.svg';
import habitsIcon from './assets/icons/habits.svg';
// import statisticsIcon from './assets/icons/statistics.svg';
// import settingsIcon from './assets/icons/settings.svg';
import tourIcon from './assets/icons/tour.svg';

function Message({ message }: { message: Message }) {
  // For future use (see comment below)
  // function assertUnreachable(_: never) {
  //   throw new Error("Unknown message type");
  //   _; // To shut up stupid JSLint
  // }

  switch (message.type) {
    case "TASK_DEADLINE":
      let tn = message.taskName;
      if (tn) tn = tn[0]?.toLowerCase() + tn.slice(1);
      return <>
        You lost {message.carrotsLost} carrots, because you didn't <b>{tn}</b> on time
      </>;

    // I will uncomment this when i have more types of messages, because TS is stupid enough not to understand it's
    // unreachable if i only have one type of message
    //
    // default:
    //   assertUnreachable(message);
  }
}

function Layout() {
  const isTourTaken = useNeomeStore(s => s.isTourTaken);
  const setIsTourTaken = useNeomeStore(s => s.setIsTourTaken);
  const [isTourOpen, setIsTourOpen] = useState(!isTourTaken);

  const messages = useNeomeStore(s => s.getState().messages);
  const markMessagesRead = useNeomeStore(s => s.markMessagesRead);

  const pathname = useLocation().pathname;

  const [isCtrlShiftDown, setIsCtrlShiftDown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log(e);
      if (e.ctrlKey && e.shiftKey) {
        setIsCtrlShiftDown(true);

        // TODO(2026-04-21 10:34:36): use array implemented in (2026-03-10 13:22:32) in here
        // to be able to modify the code in one place to change everything i may need
        // deps: (2026-03-10 13:22:32)
        if (e.code == "Digit1") navigate("/");
        if (e.code == "Digit2") navigate("/tasks");
        if (e.code == "Digit3") navigate("/habits");
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!(e.ctrlKey && e.shiftKey)) {
        setIsCtrlShiftDown(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [setIsCtrlShiftDown]);

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
                  <span className={`ml-auto text-gray-500 ${isCtrlShiftDown ? "" : "hidden"}`}>1</span>
                </li>

                <li className="p-2 flex">
                  <img className="pt-1 w-[2rem] h-[2rem]" src={tasksIcon} />
                  <Link className="ml-2" to="/tasks">Tasks</Link>
                  <span className={`ml-auto text-gray-500 ${isCtrlShiftDown ? "" : "hidden"}`}>2</span>
                </li>

                <li className="p-2 flex">
                  <img className="pt-1 w-[2rem] h-[2rem]" src={habitsIcon} />
                  <Link className="ml-2" to="/habits">Habits</Link>
                  <span className={`ml-auto text-gray-500 ${isCtrlShiftDown ? "" : "hidden"}`}>3</span>
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

      {isTourOpen || !messages.length ? ""
      :
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/10"
            onClick={markMessagesRead}
          />

          <div className="relative z-10 w-full max-w-2xl bg-neome-background border border-gray-700 rounded-2xl shadow-2xl p-4">
            <div className="flex justify-end items-center">
              <button
                onClick={markMessagesRead}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <h2 className="text-3xl mb-4 text-center">What you missed</h2>

            <div className="gap-2 flex flex-col">
              {messages.map(m =>
                <p className="p-1 pl-3 bg-neome-grey rounded-full text-[1.2rem]">
                  <Message message={m} />
                </p>
              )}
            </div>

    <div className="mt-6 flex justify-center gap-2">
      <button
        className="px-5 py-2 rounded-lg bg-neome-pink text-black cursor-pointer"
        onClick={markMessagesRead}
      >
        Okie
      </button>
    </div>
          </div>
        </div>
      }
    </>
  );
}

export default Layout;
