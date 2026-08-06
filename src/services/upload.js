import { API_ORIGIN, BASE_URL } from "../lib/api";
import { getAccessToken } from "../lib/tokens";

export const uploadService = {
  async uploadImage(file, type = "profile") {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", type);

    const res = await fetch(`${BASE_URL}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
      body: formData,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(json?.message || "Upload failed");
    }
    const { url } = json.data || {};
    if (url && url.startsWith("/")) {
      return `${API_ORIGIN}${url}`;
    }
    return url;
  },
};
