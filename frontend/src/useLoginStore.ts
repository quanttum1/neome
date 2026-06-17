import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useLoginStore = create<LoginStore>()(
  persist(
    (set) => ({
      token: undefined,
      setToken: (newToken: JwtToken | undefined) => set({ token: newToken }),
    }),
    {
      name: 'login',
      version: 1,
    }
  ),
);

export default useLoginStore;
