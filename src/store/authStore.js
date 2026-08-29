import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "../services/auth";
import { subscriptionsService } from "../services/subscriptions";
import { clearTokens, getAccessToken, setTokens } from "../lib/tokens";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      subscription: null,
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

      async fetchSubscription() {
        try {
          const subscription = await subscriptionsService.getActive();
          set({ subscription });
          return subscription;
        } catch (error) {
          console.error('Failed to fetch subscription:', error);
          return null;
        }
      },

      hasFeature(featureName) {
        const { subscription } = get();
        if (!subscription || !subscription.plan) return false;
        return subscription.plan[featureName] || false;
      },

      isTrialActive() {
        const { subscription } = get();
        if (!subscription || !subscription.isTrial) return false;
        return new Date(subscription.trialEndsAt) > new Date();
      },

      isSubscriptionActive() {
        const { subscription } = get();
        if (!subscription) return false;
        
        if (subscription.isTrial) {
          return get().isTrialActive();
        }
        
        return subscription.status === 'PAID' && 
               new Date(subscription.currentPeriodEnd) > new Date();
      },

      getTrialDaysLeft() {
        const { subscription } = get();
        if (!subscription || !subscription.isTrial) return 0;
        
        const now = new Date();
        const endsAt = new Date(subscription.trialEndsAt);
        const diff = endsAt - now;
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
      },

      async logout() {
        await authService.logout();
        clearTokens();
        set({ user: null, subscription: null });
      },
    }),
    {
      name: "pikifood-auth",
      partialize: (s) => ({ user: s.user, subscription: s.subscription }),
    }
  )
);
