// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ element, allowedRoles }) => {
//   const token = localStorage.getItem("accessToken");

//   if (!token) {
//     return <Navigate to="/" />; // Redirect to login if no token
//   }

//   try {
//     // Decode JWT payload to get user role
//     const payload = JSON.parse(atob(token.split(".")[1]));
//     const userRole = payload.role;

//     // Check if user's role is allowed
//     if (!allowedRoles.includes(userRole)) {
//       return <Navigate to="/unauthorized" />; // Redirect to unauthorized page
//     }

//     return element; // Render the protected component
//   } catch (error) {
//     console.error("Error decoding token:", error);
//     return <Navigate to="/" />; // Redirect to login on error
//   }
// };

// export default ProtectedRoute;

import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/" />; // Redirect to login if no token
  }

  try {
    // Decode JWT payload to get user roles
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userRole = payload.role;

    // Ensure userRoles is an array
    const rolesArray = Array.isArray(userRole) ? userRole : [userRole];

    // Check if any user role is allowed
    const hasAccess = rolesArray.some((role) => allowedRoles.includes(role));

    if (!hasAccess) {
      return <Navigate to="/unauthorized" />; // Redirect to unauthorized page
    }

    return element; // Render the protected component
  } catch (error) {
    console.error("Error decoding token:", error);
    return <Navigate to="/" />; // Redirect to login on error
  }
};

export default ProtectedRoute;