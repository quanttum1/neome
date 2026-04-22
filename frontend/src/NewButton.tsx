import { Link, useNavigate } from 'react-router';
import { useEffect } from 'react';

{/* TODO: Maybe add a shadow coloured with `neome-dark-pink` */}
function NewButton() {
  const navigate = useNavigate();
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.code != "KeyN") return;
      if (!e.altKey) return;
      if (!e.ctrlKey) return;
      navigate("new");
      e.preventDefault();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });
  return <Link
      to="new"
      className="fixed lg:bottom-6 bottom-18 lg:right-6 right-1 flex items-center gap-2 rounded-full bg-neome-pink text-black px-4 py-3 shadow-lg cursor-pointer">
      <span className="text-xl leading-none">+</span>
      <span className="block md:hidden">New</span>
      <span className="hidden md:block">New (Ctrl+Alt+N)</span>
    </Link>;
}

export default NewButton;
