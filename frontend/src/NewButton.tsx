import { Link } from 'react-router';

{/* TODO: Maybe add a shadow coloured with `neome-dark-pink` */}
{/* TODO: Add `Shift+N` shortcut for this button */}
function NewButton() {
  return <Link
      to="new"
      className="fixed lg:bottom-6 bottom-18 lg:right-6 right-1 flex items-center gap-2 rounded-full bg-neome-pink text-black px-4 py-3 shadow-lg cursor-pointer">
      <span className="text-xl leading-none">+</span>
      <span>New</span>
    </Link>;
}

export default NewButton;
