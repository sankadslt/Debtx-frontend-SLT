import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import axios from "axios";

export default function Callback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { instance } = useMsal();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get("code");

    if (code) {
      axios
        .post(`${import.meta.env.VITE_BASE_URL}/auth/azure`, { code })
        .then((res) => {
          localStorage.setItem("token", res.data.token);
          navigate("/dashboard");
        })
        .catch((err) => {
          console.error("Unauthorized or login failed:", err);
          instance.logoutRedirect();
          navigate("/unauthorized");
        });
    }
  }, [location, navigate, instance]);

  return <p>Logging in...</p>;
}
