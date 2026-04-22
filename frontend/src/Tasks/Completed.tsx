import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Completed() {
  const navigate = useNavigate();
  const location = useLocation();
  const { reward } = location.state;

  if (reward == undefined) navigate('/');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">

      <img
        src="/excited_carros/0.gif"
        alt="Excited Carro"
        className="w-48 sm:w-64 mb-8 select-none pointer-events-none"
      />

      <h1 className="text-3xl text-neome-pink sm:text-4xl font-semibold mb-8">
        You got <span className="text-neome-orange font-bold">{reward}</span> carrots!
      </h1>

      <button
        autoFocus
        onClick={() => navigate("/")}
        className="p-3 bg-neome-pink text-black rounded-2xl cursor-pointer"
      >
        Go home
      </button>

    </div>
  );
}

export default Completed;
