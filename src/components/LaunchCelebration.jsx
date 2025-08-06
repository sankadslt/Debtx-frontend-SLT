// components/LaunchCelebration.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";

const LaunchCelebration = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 9000);
    return () => clearTimeout(timer);
  }, [onFinish]);

return (
  <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
    <Confetti width={window.innerWidth} height={window.innerHeight} />
    <div className="text-4xl font-bold text-blue-600 mb-4 animate-bounce">
      🎉 Welcome to DebtX 🎉
    </div>
    <p className="text-gray-700 text-lg">
      We're live today! Thank you for being part of the journey.
    </p>
    <p className="mt-4 text-sm text-gray-500 animate-pulse">
      Redirecting to your dashboard...
    </p>
    <p className="mt-2 text-xs text-gray-400 italic">
      Powered by Digital Platform
    </p>
  </div>
);

};

export default LaunchCelebration;
