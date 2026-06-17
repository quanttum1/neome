import useLoginStore from './useLoginStore';
import { useRef, useState, useEffect } from 'react';
import { API_BASE } from './env';

export default function Settings() {
  const token = useLoginStore(s => s.token);
  const setToken = useLoginStore(s => s.setToken);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>("");

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
        if (!response.ok) setError(`Server returned ${response.status}. If it keeps happening, please report it to the developer`);
        else response.json()
          .then(data => setToken(data.token))
          .catch(error => setError(`Failed to set token: "${error.toString()}". If it keeps happening, please report it to the developer`));
      })
      .catch(error => setError(`Failed to get a response: "${error.toString()}". If it keeps happening, please report it to the developer`));
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
          .catch(error => setError(`Failed to set token: "${error.toString()}". If it keeps happening, please report it to the developer`));
      })
      .catch(error => setError(`Failed to get a response: "${error.toString()}". If it keeps happening, please report it to the developer`));
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
        .then((response) => response.json())
        .then((data) => setUsername(data.username))
        .catch((error) => console.error(error));
    } else {
      setUsername(undefined);
    }

  }, [token]);

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
