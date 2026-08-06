import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../../lib/tokens";

export default function RequireAuth({ children }) {
  const navigate = useNavigate();
  const [ready] = useState(() => Boolean(getAccessToken()));

  useEffect(() => {
    if (!getAccessToken()) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  if (!ready) return null;
  return children;
}
