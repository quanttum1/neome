import { useRef, useState } from 'react';
import { useRegister, useLogin, useLogout, useUsername } from './auth';

export default function Settings() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>("");

  const login = useLogin();
  const register = useRegister();
  const logout = useLogout();
  const username = useUsername();

  function registerCallback(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!usernameRef.current) return setError("Username is not provided");
    if (!passwordRef.current) return setError("Password is not provided");

    register(usernameRef.current.value, passwordRef.current.value).then(error => error && setError(error));
  }

  function loginCallback(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!usernameRef.current) return setError("Username is not provided");
    if (!passwordRef.current) return setError("Password is not provided");

    login(usernameRef.current.value, passwordRef.current.value).then(error => error && setError(error));
  }

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
          onClick={loginCallback}
          className="flex-1 bg-neome-pink text-black rounded-2xl cursor-pointer p-3"
        >
          Login
        </button>
        <button
          onClick={registerCallback}
          className="flex-1 bg-neome-pink text-black rounded-2xl cursor-pointer"
        >
          Register
        </button>
      </div>
    </form>
  );

  return (<div className="min-h-screen flex justify-center p-4">
    <div className="w-full max-w-md p-8">
      {username === undefined ?
        loginOrRegisterForm :
        <div className="flex flex-col gap-3">
          <p className="text-neome-pink text-[1.4rem]">You're logged in as <b>{username}</b></p>
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
  </div>);
}
