import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Therapist, Admin, AuthRole } from "../domain/model/index";

type AuthSession =
  | { role: "user"; profile: User }
  | { role: "therapist"; profile: Therapist }
  | { role: "admin"; profile: Admin };

interface AuthState {
  session: AuthSession | null;

  setUser: (user: User) => void;
  setTherapist: (therapist: Therapist) => void;
  setAdmin: (admin: Admin) => void;
  logout: () => void;
}

const getRole = (session: AuthSession | null): AuthRole | null => session?.role ?? null;
const getUser = (session: AuthSession | null): User | null =>
  session?.role === "user" ? session.profile : null;
const getTherapist = (session: AuthSession | null): Therapist | null =>
  session?.role === "therapist" ? session.profile : null;
const getAdmin = (session: AuthSession | null): Admin | null =>
  session?.role === "admin" ? session.profile : null;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,

      setUser: (user) =>
        set({ session: { role: "user", profile: user } }),

      setTherapist: (therapist) =>
        set({ session: { role: "therapist", profile: therapist } }),

      setAdmin: (admin) =>
        set({ session: { role: "admin", profile: admin } }),

      logout: () => set({ session: null }),
    }),
    {
      name: "renove-auth",
      partialize: (state) => ({
        session: state.session,
      }),
    }
  )
);

export const selectAuthSession = (state: AuthState) => state.session;
export const selectAuthRole = (state: AuthState) => getRole(state.session);
export const selectIsAuthenticated = (state: AuthState) => state.session !== null;
export const selectAuthUser = (state: AuthState) => getUser(state.session);
export const selectAuthTherapist = (state: AuthState) => getTherapist(state.session);
export const selectAuthAdmin = (state: AuthState) => getAdmin(state.session);
