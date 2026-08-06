import { api } from "../lib/api";

export const authService = {
  async sendOtp(email, phone, role) {
    const res = await api.post("/auth/send-otp", { email, phone, role });
    return res;
  },

  async verifyOTP(email, code, name, role) {
    const body = { email, code };
    if (name) body.name = name;
    if (role) body.role = role;
    const res = await api.post("/auth/verify-otp", body);
    return res.data;
  },

  async getProfile() {
    const res = await api.get("/auth/profile");
    return res.data;
  },

  async updateProfile(data) {
    const res = await api.put("/auth/profile", data);
    return res.data;
  },

  async logout() {
    try {
      await api.post("/auth/logout");
    } catch {
      // non-critical
    }
  },
};
