import { useState } from "react";
import type { ReactNode } from "react";

import tasksIcon from "./assets/icons/tasks.svg";
import habitsIcon from "./assets/icons/habits.svg";
import tourIcon from "./assets/icons/tour.svg";

const popupClass =
  "relative z-10 w-full max-w-2xl bg-neome-background border border-gray-700 rounded-2xl shadow-2xl p-4";

type CloseButtonProps = {
  onClick: () => void;
};

function CloseButton({ onClick }: CloseButtonProps) {
  return (
    <div className="flex justify-end items-center mb-4">
      <button
        onClick={onClick}
        className="text-gray-400 hover:text-white text-xl"
      >
        ✕
      </button>
    </div>
  );
}

type NavigationProps = {
  onNext?: () => void;
  onSkip?: () => void;
  nextLabel?: string;
};

function Navigation({ onNext, onSkip, nextLabel = "Next" }: NavigationProps) {
  return (
    <div className="mt-6 flex justify-center gap-2">
      {onNext && (
        <button
          className="px-5 py-2 rounded-lg bg-neome-pink text-black cursor-pointer"
          onClick={onNext}
        >
          {nextLabel}
        </button>
      )}

      {onSkip && (
        <button
          onClick={onSkip}
          className="px-5 py-2 rounded-lg text-neome-pink border-neome-pink border cursor-pointer"
        >
          Skip
        </button>
      )}
    </div>
  );
}

type PageProps = {
  visible: boolean;
  children: ReactNode;
};

function Page({ visible, children }: PageProps) {
  return (
    <div className={visible ? popupClass : "hidden"}>
      {children}
    </div>
  );
}

export default function Tour({ isOpen, onClose }: any) {
  const [tourPage, setTourPage] = useState(0);

  if (!isOpen) return null;

  function next() {
    setTourPage(tourPage + 1);
  }

  function skip() {
    setTourPage(-1);
  }

  function close() {
    setTourPage(0); // Reset the tour so that it opens on the first page next time
    onClose();
  }

  let currentPage = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/10"
        onClick={tourPage === -1 ? close : skip}
      />

      {/* shown if the user decides to skip the tour */}
      <Page visible={tourPage === -1}>
        <CloseButton onClick={onClose} />

        <p className="text-xl">
          You can always access the tour by clicking
          <b>
            {" "}
            <img src={tourIcon} className="inline" />
            {" Take a tour "}
          </b>
          button
        </p>

        <Navigation nextLabel="Okay" onNext={close} />
      </Page>

      <Page visible={tourPage === currentPage++}>
        <CloseButton onClick={skip} />

        <div className="h-80 flex flex-col items-center">
          <h2 className="text-[2rem]">Hey, I'm Carro!</h2>

          <img
            src="/tour/greeting_carro.gif"
            className="w-auto sm:max-h-52 max-h-50 object-contain"
          />

          <h2 className="text-[2rem] mb-5">
            Want to learn how NEOME works?
          </h2>
        </div>

        <Navigation
          onNext={next}
          onSkip={skip}
          nextLabel="Yes"
        />
      </Page>

      <Page visible={tourPage === currentPage++}>
        <CloseButton onClick={skip} />

        <div className="flex flex-col gap-4">
          <img src="/tour/task_card.svg" />

          <p className="text-xl">
            <b>
              <img src={tasksIcon} className="inline" />
              {" Tasks "}
            </b>
            are the core of NEOME workflow, you can set the reward,
            penalty and deadline of a task
          </p>
        </div>

        <Navigation onNext={next} onSkip={skip} />
      </Page>

      <Page visible={tourPage === currentPage++}>
        <CloseButton onClick={skip} />

        <div className="flex flex-col gap-4">
          <img src="/tour/habit_card.svg" />

          <p className="text-xl">
            <b>
              <img src={habitsIcon} className="inline" />
              {" Habits "}
            </b>
            if you repeat something on a regular basis,
            you can create a habit which automatically
            creates tasks.
          </p>
        </div>

        <Navigation onNext={next} onSkip={skip} />
      </Page>

      <Page visible={tourPage === currentPage++}>
        <CloseButton onClick={skip} />

        <div className="flex flex-col gap-4">
          <img src="/tour/carrot_bar.gif" />

          <p className="text-xl">
            As you complete tasks, you feed Carro with carrots
          </p>
        </div>

        <Navigation onNext={next} onSkip={skip} />
      </Page>

      <Page visible={tourPage === currentPage++}>
        <CloseButton onClick={skip} />

        <div className="flex flex-col gap-4 items-center">
          <img src="/tour/carro_on_milestone.svg" className="max-h-52" />

          <p className="text-xl">
            Carro moves to the next milestones every 10 carrots. You can't
            gain or lose more than 10 carrots per day.
          </p>
        </div>

        <Navigation onNext={next} onSkip={skip} />
      </Page>

      <Page visible={tourPage === currentPage++}>
        <CloseButton onClick={skip} />

        {/* TODO(2026-03-07 21:04:54): image of carro holding a heart */}
        <p className="text-xl">
          The app is still being developed and more features are coming.
          It is 100% open-source, and anyone can contribute to it.
          {" If you want to report a bug, suggest a feature, don't hesitate to "}
          <a className="underline cursor-pointer">
            contact me
          </a>.
          {/* TODO(2026-03-07 22:06:54): make the contact link in the tour actually work */}
          {" You can also "}
          <a
            href="https://discord.gg/ejAuWq5u"
            className="underline"
            target="_blank"
          >
            join our Discord
          </a>
          {" if you want to chat with me and like-minded people."}
          <br />
          <br />
          {"Have a productive day <3"}
        </p>

        <Navigation nextLabel="End tour" onNext={skip} />
      </Page>
    </div>
  );
}
