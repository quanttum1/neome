import useLoginStore from './useLoginStore';
import { useRef, useState, useEffect } from 'react';
import { API_BASE } from './env';

export default function Settings() {
  const token = useLoginStore(s => s.token);
  const setToken = useLoginStore(s => s.setToken);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>("");

  const errorEnding = "If that keeps happening, please report it to the developer";
  function register(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!usernameRef.current) return setError("Username is not provided");
    if (!passwordRef.current) return setError("Password is not provided");

    fetch("http://localhost:5221/register", {
      method: "POST",
      headers: {
        "Accept": "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      }),
    })
      .then(response => {
        if (response.status == 400) setError("Username already taken");
        else if (!response.ok) setError(`Server returned ${response.status}. ${errorEnding}`);
        else response.json()
          .then(data => setToken(data.token))
          .catch(error => setError(`Failed to set token during registration: "${error.toString()}". ${errorEnding}`));
      })
      .catch(error => setError(`Failed to get a response during registration: "${error.toString()}". ${errorEnding}`));
  }

  function login(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!usernameRef.current) return setError("Username is not provided");
    if (!passwordRef.current) return setError("Password is not provided");

    fetch("http://localhost:5221/login", {
      method: "POST",
      headers: {
        "Accept": "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      }),
    })
      .then(response => {
        if (response.status == 401) setError("Invalid username or password");
        else response.json()
          .then(data => setToken(data.token))
          .catch(error => setError(`Failed to set token during login: "${error.toString()}". ${errorEnding}`));
      })
      .catch(error => setError(`Failed to get a response during login: "${error.toString()}". ${errorEnding}`));
  }

  function logout(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setToken(undefined);
  }

  const [username, setUsername] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (token) {
      fetch("http://localhost:5221/me", {
        method: "GET",
        headers: {
          "Accept": "*/*",
          "Authorization": `Bearer ${token}`,
        },
      })
        .then((response) => response.status === 401 ?
          setToken(undefined) : // if we got 401, the token is expired or something like that
          response.json()
            .then((data) => setUsername(data.username))
            .catch((error) => setError(`Failed to get username: "${error.toString()}". Try logging out and in again. ${errorEnding}`)));
    } else {
      setUsername(undefined);
    }

  }, [token]);

  const loginOrRegisterForm = (
    <form className="space-y-6">
      <input
        ref={usernameRef}
        placeholder="Username"
        autoFocus
        className="bg-neome-light-grey border-2 border-neome-light-grey rounded-xl p-4 text-white focus:outline-none focus:border-neome-pink w-full"
      />

      <input
        type="password"
        ref={passwordRef}
        placeholder="Password"
        className="bg-neome-light-grey border-2 border-neome-light-grey rounded-xl p-4 text-white focus:outline-none focus:border-neome-pink w-full"
      />

      <div className="flex gap-4 pt-4">
        <button
          onClick={login}
          className="flex-1 bg-neome-pink text-black rounded-2xl cursor-pointer p-3"
        >
          Login
        </button>
        <button
          onClick={register}
          className="flex-1 bg-neome-pink text-black rounded-2xl cursor-pointer"
        >
          Register
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen flex justify-center p-4">
      <div className="w-full max-w-md p-8">
        {token === undefined ?
          loginOrRegisterForm :
          <div className="flex flex-col gap-3">
            {username === undefined ? 
              <p className="text-neome-pink text-[1.4rem]">Loading username...</p>
              :
              <p className="text-neome-pink text-[1.4rem]">You're logged in as <b>{username}</b></p>} 
            <button
              onClick={logout}
              className="flex-1 bg-neome-pink text-black rounded-2xl cursor-pointer p-3"
            >
              Logout
            </button>
          </div>
        }
        {error &&
          <div className="bg-red-500/10 border border-red-500 text-[#ff6b81] p-3 rounded-xl text-sm mt-8">
            ⚠️ {error}
          </div>
        }
      </div>
    </div>
  );

  return <div>
    {username === undefined ?
      "not logged in" :
      username
    }
    <br />
    <form onSubmit={register}>
      <input ref={usernameRef} placeholder="Username" autoFocus />
      <input ref={passwordRef} placeholder="Password" />
      <button type="submit">Register</button>
    </form>
    <form onSubmit={login}>
      <button type="submit">Login</button>
    </form>
    <form onSubmit={logout}>
      <button type="submit">Logout</button>
    </form>
    {error}
  </div>;
}
