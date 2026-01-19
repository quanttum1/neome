import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Completed() {
  const navigate = useNavigate();
  const location = useLocation();
  const { reward } = location.state;

  if (reward == undefined) navigate('/');

  // TODO(2026-01-18 22:26:21): make nice `Completed.tsx`
  return <div>
    You got {reward} carrots!
    <Link to="/">Go home</Link>
  </div>
}

export default Completed;
