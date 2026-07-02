import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_BASE } from './env';
import useNeomeStore from './useNeomeStore';

type JwtToken = string;

interface AuthStore {
  token: JwtToken | undefined;
  setToken: (newToken: JwtToken | undefined) => void;

  username: string | undefined;
  setUsername: (newUsername: string | undefined) => void;

  lastSyncTime: UTCString | undefined;
  setLastSyncTime: (newSyncTime: string | undefined) => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: undefined,
      setToken: (newToken: JwtToken | undefined) => set({ token: newToken }),

      username: undefined,
      setUsername: (newUsername: string | undefined) => set({ username: newUsername }),

      lastSyncTime: undefined,
      setLastSyncTime: (newSyncTime: string | undefined) => set({ lastSyncTime: newSyncTime }),
    }),

    {
      name: 'login',
      version: 2,
      migrate: (state: any, oldVersion) => {
        if (oldVersion <= 1) {
          state.username = undefined;
        }

        return state as AuthStore;
      },
    }
  ),
);

const ERROR_ENDING = "If that keeps happening, please report it to the developer";

// TODO(2026-06-26 03:02:08): factor out functions `register` and `login`
// functions register and login have too much in common

export function useRegister() {
  const setToken = useAuthStore(s => s.setToken);
  const setUsername = useAuthStore(s => s.setUsername);

  // returns `undefined` on success, returns error string on failure
  return async (username: string, password: string) => {
    let result: string | undefined = "Unreachable register";

    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.status == 400) result = "Username already taken";
      else {
        if (!response.ok) result = `Server returned ${response.status}. ${ERROR_ENDING}`;

        else {
          const data = await response.json();
          setToken(data.token);
          setUsername(username);
          result = undefined;
        }
      }
    }

    catch (error) {
      result = `Failed to register: ${error}. ${ERROR_ENDING}`;
    }

    return result;
  };
}

export function useLogin() {
  const setToken = useAuthStore(s => s.setToken);
  const setUsername = useAuthStore(s => s.setUsername);

  // returns `undefined` on success, returns error string on failure
  return async (username: string, password: string) => {
    let result: string | undefined = "Unreachable register";

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.status == 401) result = "Invalid username or password";
      else {
        if (!response.ok) result = `Server returned ${response.status}. ${ERROR_ENDING}`;

        else {
          const data = await response.json();
          setToken(data.token);
          setUsername(username);
          result = undefined;
        }
      }
    }

    catch (error) {
      result = `Failed to login: ${error}. ${ERROR_ENDING}`;
    }

    return result;
  };
}

export function useLogout() {
  const setToken = useAuthStore(s => s.setToken);
  const setUsername = useAuthStore(s => s.setUsername);

  return () => {
    setToken(undefined);
    setUsername(undefined);
  };
}

// returns `undefined` if logged out
export function useUsername() {
  return useAuthStore(s => s.username);
}

export function useSync() {
  const addEvent = useNeomeStore(s => s.addEvent);
  const recomputeCurrentState = useNeomeStore(s => s.recomputeCurrentState);
  const events = useNeomeStore(s => s.events);
  const markEventSyncronised = useNeomeStore(s => s.markEventSyncronised);

  const token = useAuthStore(s => s.token);
  const lastSyncTime = useAuthStore(s => s.lastSyncTime);
  const setLastSyncTime = useAuthStore(s => s.setLastSyncTime);

  return async () => {
    // TODO(2026-07-03 00:03): lock: the fuction should return, if it's already running

    if (token == undefined) return;

    const eventsToPush = events
      .filter((e: LocalEvent) => 'isSynchronised' in e && e.isSynchronised === false)
      .map((e: any) => { // I use type `any`, 'cause TS is a bit stupid
        const { isSynchronised, ...rest } = e;
        return rest;
        isSynchronised; // Stupid JS linter
      });

    const response = await fetch(`${API_BASE}/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        lastSyncTime,
        events: eventsToPush,
      }),
    });

    if (!response.ok) return;

    const body = await response.json();
    const { newSyncTime, newEvents } = body;

    setLastSyncTime(newSyncTime);

    for (const e of eventsToPush) {
      markEventSyncronised(e.id);
    }

    for (const e of newEvents) {
      addEvent({ ...e, isSynchronised: true });
    }

    recomputeCurrentState();
  };
}
