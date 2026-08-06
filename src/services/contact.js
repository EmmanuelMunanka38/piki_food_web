import { api } from "../lib/api";

export const contactService = {
  async sendMessage({ name, email, subject, message }) {
    const res = await api.post("/contact", { name, email, subject, message });
    return res;
  },
};
