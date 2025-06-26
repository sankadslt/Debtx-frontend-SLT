import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import backgroundImage from "../assets/images/loginbg.jpg";
// import rightPanelBg from "../assets/images/r-bg.png";
// import leftPanelImg from "../assets/images/left.webp";
import axios from "axios";
import { useMsal } from "@azure/msal-react";

const Login = () => {
  const { instance } = useMsal();
  const [error, setError] = useState("");
  const [socialLoading, setSocialLoading] = useState("");
  const navigate = useNavigate();

  const handleAzureLogin = async () => {
    setSocialLoading("Azure");
    try {
      const loginResponse = await instance.loginPopup({
        scopes: ["openid", "profile", "email"],
      });
      const idToken = loginResponse.idToken;

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/azure`, {
        code: idToken,
      });
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard");
    } catch (err) {
      console.error("Azure login failed:", err);
      setError("Azure login failed. Please contact support.");
    } finally {
      setSocialLoading("");
    }
  };

  return (
<div
      className="fixed inset-0 flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-11/12 md:w-4/5 h-5/6 flex rounded-xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-md border border-white/30">
        {/* Left Panel */}
        <div className="w-1/2 hidden md:flex items-center justify-center bg-white/10 backdrop-blur-sm">
          <img
            src={logo}
            alt="App illustration"
            className="w-[50%] h-[50%] object-contain rounded-lg drop-shadow-[0_0_12px_#ffffff]"
          />
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-6 py-10 bg-white/10 backdrop-blur-xl border-l border-white/30">
          {/* Logo */}
          {/* <img src={logo} alt="Logo" className="h-24 mb-4" /> */}

          {/* Form */}
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-semibold text-white mb-6 text-center drop-shadow">
              Welcome Back
            </h2>

            {error && <p className="text-red-400 text-center mb-4">{error}</p>}

            <form className="space-y-5">
              <button
                type="button"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-all duration-200 disabled:opacity-50"
                onClick={handleAzureLogin}
                disabled={socialLoading !== ""}
              >
                {socialLoading === "Azure"
                  ? "Signing in..."
                  : "Sign in with Azure"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Login;