import { useState, useEffect } from "react";
import { loginUser } from "../services/auth/authService";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
// import { FcGoogle } from "react-icons/fc";
// import { FaFacebookF } from "react-icons/fa";
import logo from "../assets/images/logo.png";
import axios from "axios";

import { useMsal, useIsAuthenticated } from "@azure/msal-react";

const Login = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await loginUser({ email, password });
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("user", JSON.stringify(response.user));
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

const handleAzureLogin = async () => {
  setSocialLoading("Azure");
  try {
    const loginResponse = await instance.loginPopup({
      scopes: ["openid", "profile", "email"],
    });

    const idToken = loginResponse.idToken;

    // Send the ID token to your backend to verify the user
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
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-2xl bg-opacity-70">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-20" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-4">Sign In</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-500" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Sign In
          </button>

          <div className="text-center text-gray-500">Or sign in with</div>

          <div className="flex justify-center space-x-4">
           {/* <button
              className="p-2 rounded-full bg-white border hover:bg-gray-100"
              onClick={() => console.log("Google login placeholder")}
              disabled={socialLoading !== ""}
            >
              {socialLoading === "Google" ? (
                <span>Pending...</span>
              ) : (
                <FcGoogle className="text-2xl" />
              )}
            </button> */}
            {/*<button
              className="p-2 rounded-full bg-white border hover:bg-gray-100"
              onClick={() => console.log("Facebook login placeholder")}
              disabled={socialLoading !== ""}
            >
              {socialLoading === "Facebook" ? (
                <span>Pending...</span>
              ) : (
                <FaFacebookF className="text-2xl text-blue-600" />
              )}
            </button>*/}
            <button
              className="p-2 rounded-full bg-white border hover:bg-gray-100"
              onClick={handleAzureLogin}
              disabled={socialLoading !== ""}
            >
              {socialLoading === "Azure" ? (
                <span>Pending...</span>
              ) : (
                <span className="text-blue-800 font-semibold text-sm">
                  Azure
                </span>
              )}
            </button>
          </div>

          {/* <p className="text-center text-gray-500">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Register
            </a>
          </p> */}
        </form>
      </div>
    </div>
  );
};

export default Login;