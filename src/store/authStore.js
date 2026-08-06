import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "../services/auth";
import { clearTokens, getAccessToken, setTokens } from "../lib/tokens";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,

      isAuthenticated: () => Boolean(getAccessToken()),

      setSession({ user, accessToken, refreshToken }) {
        setTokens(accessToken, refreshToken);
        set({ user });
      },

      async sendOtp(email, phone, role) {
        set({ isLoading: true });
        try {
          await authService.sendOtp(email, phone, role);
        } finally {
          set({ isLoading: false });
        }
      },

      async verifyOTP(email, code, name, role) {
        set({ isLoading: true });
        try {
          const session = await authService.verifyOTP(email, code, name, role);
          get().setSession(session);
          return session;
        } finally {
          set({ isLoading: false });
        }
      },

      async fetchProfile() {
        try {
          const user = await authService.getProfile();
          set({ user });
          return user;
        } catch {
          return get().user;
        }
      },

      async updateProfile(data) {
        const user = await authService.updateProfile(data);
        set({ user: { ...get().user, ...user } });
        return user;
      },

      async logout() {
        await authService.logout();
        clearTokens();
        set({ user: null });
      },
    }),
    {
      name: "pikifood-auth",
      partialize: (s) => ({ user: s.user }),
    }
  )
);
