import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import backgroundImage from "../assets/images/loginbg.webp";
import rightPanelBg from "../assets/images/r-bg.png";
import leftPanelImg from "../assets/images/left.webp";
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
      className="fixed inset-0 flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-11/12 md:w-4/5 h-5/6 flex rounded-xl overflow-hidden shadow-2xl bg-white bg-opacity-90 backdrop-blur-sm">
        
        {/* ✅ Left Panel */}
        <div className="w-1/2 hidden md:flex items-center justify-center bg-gradient-to-b from-[#a075d2] to-[#45cbc7] p-6">
          <img
            src={leftPanelImg}
            alt="Brand visual"
            className="w-[85%] h-[85%] object-cover rounded-lg"
          />
        </div>

        {/* ✅ Right Panel with logo on top */}
        <div className="w-full md:w-1/2 relative flex flex-col items-center justify-center">
          {/* Background image layer */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${rightPanelBg})` }}
          />
          {/* White overlay for readability */}
          <div className="absolute inset-0 bg-white bg-opacity-70 backdrop-blur-sm" />

          {/* ✅ Logo at top */}
          <div className="relative z-10 mt-6">
            <img src={logo} alt="Logo" className="h-32" />
          </div>

          {/* Form Content */}
          <div className="w-full max-w-md px-5 py-8 relative z-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Welcome Back</h2>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

            <form className="space-y-4">
              <div className="flex justify-center pt-2">
                <button
                  className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  onClick={handleAzureLogin}
                  disabled={socialLoading !== ""}
                >
                  {socialLoading === "Azure" ? "Signing in..." : "Azure"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;