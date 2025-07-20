import { useEffect, useState } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import signUpImage from "../../assets/images/User/SignUp.jpeg";
import { getAzureUserData, getLoggedUserId } from "../../services/auth/authService";
import { createUser } from "../../services/user/user_services";
import Swal from "sweetalert2";
import { Active_DRC_Details } from "../../services/drc/Drc";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate =useNavigate();
  const [userType, setUserType] = useState("");
  const [loggedUserData, setLoggedUserData] =useState("");
  const [formData, setFormData] = useState({
    serviceNo: "",
    name: "",
    nic: "",
    email: "",
    contactNo: "",
    loginMethod: "",
    role: "",
    drcId: ""
  });

  const [drcList, setDrcList] =useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Mapped User roles for drop down
  const userRoles = [
    { value: "", label: "User Role", hidden: true },
    { value: "GM", label: "GM" },
    { value: "DGM", label: "DGM" },
    { value: "legal_officer", label: "Legal Officer" },
    { value: "manager", label: "Manager" },
    { value: "slt_coordinator", label: "SLT Coordinator" },
    { value: "DRC_user", label: "DRC User" },
    { value: "recovery_staff", label: "Recovery Staff" },
    { value: "rtom", label: "RTOM" }
  ];

  //Get system user on mount
  useEffect(() => {
    const loadUser = async () => {
      const user = await getLoggedUserId();
      setLoggedUserData(user);
    }

    loadUser();
  }, []);
  

  //Reset form data on user type change
  useEffect(() => {
    clearFormData();
  }, [userType]);

  // Fetch active DRC list
  useEffect(() => {
    const fetchActiveDrcList = async () => {
      try {
        const fetchedDrcList = await Active_DRC_Details();
        console.log(fetchedDrcList);
        setDrcList(fetchedDrcList);
      } catch (error) {
        console.error("Failed to fetch DRC list:", error);
      }
    };

    fetchActiveDrcList();
  }, []);


  //Clear form data
  const clearFormData = () => {
    setFormData({
      serviceNo: "",
      name: "",
      nic: "",
      email: "",
      contactNo: "",
      loginMethod: "",
      role: "",
      drcId: ""
    });
  }
  
  //Form Input handler
  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name === "serviceNo") {
      value = value.replace(/@intranet\.slt\.com\.lk$/, "");
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //Register User
  const handleRegister = async () => {
    try {
      setLoading(true);

      if (!userType) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please select a user type.",
        });
        return;
      }

      const basePayload = {
        user_type: userType,
        role: formData.role,
        email: formData.email,
        contact_no: formData.contactNo,
        login_method: formData.loginMethod,
        username: formData.name,
        created_by: loggedUserData,
      };

      const payload =
        userType === "Slt"
          ? {
              ...basePayload,
              // user_id: formData.serviceNo,
            }
          : userType === "Drcuser"
          ? {
              ...basePayload,
              drc_id: formData.drcId,
              nic: formData.nic,
            }
          : null;

      if (!payload) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Invalid user type.",
        });
        return;
      }

      console.log("Registering with payload:", payload);

      const result = await createUser(payload);

      if (result.status === "success") {
        goBack();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "User registered successfully",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message || "Failed to register user",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      Swal.fire({
        icon: "error",
        title: "Unexpected Error",
        text: error.message || "Something went wrong during registration. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };



  const handleSearch = async () => {
    setError("");
    setLoading(true);
    try {
      // Append domain here for API call
      const fullServiceNo = formData.serviceNo + "@intranet.slt.com.lk";

      const data = await getAzureUserData(fullServiceNo);

      setFormData((prev) => ({
        ...prev,
        name: data.name,
        email: data.email,
        contactNo: data.contactNo,
        nic: data.nic,
      }));
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch user data");
    }
    setLoading(false);
  };

  const goBack = () => {
    navigate(-1); 
  };

  return (
    <div className="min-h-screen flex items-start justify-center mt-12">
      <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden w-[70%] max-w-3xl shadow-lg">
        {/* Left - Image */}
        <div className="w-full md:w-1/2 h-[650px]">
          <img
            src={signUpImage}
            alt="Sign Up Visual"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right - Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-10 bg-white text-blue-900">
          <h4
            className={`${GlobalStyle.headingLarge} mb-2`}
            style={{ fontSize: "1.5rem" }}
          >
            Sign Up
          </h4>
          <p className="mb-6">Welcome.!</p>

          {/* User Type Dropdown */}
          <div className="mb-4">
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className={`${GlobalStyle.selectBox} w-full text-blue-900 placeholder-blue-900 pl-2`}
            >
              <option value="" disabled hidden>
                User Type
              </option>
              <option value="Drcuser">DRC</option>
              <option value="Slt">SLT</option>
            </select>
          </div>

          {/* DRC Form */}
          {userType === "Drcuser" && (
            <>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={`${GlobalStyle.selectBox} w-full mb-4 text-blue-900 placeholder-blue-900 pl-2`}
              >
                <option value="" disabled hidden>
                  Role
                </option>
                {userRoles.map((role) => (
                  <option
                    key={role.value}
                    value={role.value}
                    hidden={role.hidden}
                    style={{ color: "black" }}
                  >
                    {role.label}
                  </option>
                ))}
              </select>
              <select
                name="drcId"
                value={formData.drcId}
                onChange={handleInputChange}
                className={`${GlobalStyle.selectBox} w-full mb-4 text-blue-900 placeholder-blue-900 pl-2`}
              >
                <option value="" disabled hidden>
                Select DRC
                </option>
                {drcList.map((drc) => (
                  <option key={drc.key} value={drc.id}>
                    {drc.value}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                className={`${GlobalStyle.selectBox} w-full mb-4 text-blue-900 placeholder-blue-900 pl-2`}
              />
              <input
                type="text"
                name="nic"
                placeholder="NIC"
                value={formData.nic}
                onChange={handleInputChange}
                className={`${GlobalStyle.selectBox} w-full mb-4 text-blue-900 placeholder-blue-900 pl-2`}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className={`${GlobalStyle.selectBox} w-full mb-4 text-blue-900 placeholder-blue-900 pl-2`}
              />
              <input
                type="text"
                name="contactNo"
                placeholder="Contact No"
                value={formData.contactNo}
                onChange={handleInputChange}
                className={`${GlobalStyle.selectBox} w-full mb-4 text-blue-900 placeholder-blue-900 pl-2`}
              />
              <select
                name="loginMethod"
                value={formData.loginMethod}
                onChange={handleInputChange}
                className={`${GlobalStyle.selectBox} w-full mb-4 text-blue-900 placeholder-blue-900 pl-2`}
              >
                <option value="" disabled hidden>
                  Login Method
                </option>
                <option value="gmail">Gmail</option>
                <option value="mobile">Mobile</option>
                <option value="slt">SLT</option>
              </select>
            </>
          )}

          {/* SLT Form */}
          {userType === "Slt" && (
            <>
              {/* Service No with Search */}
              <div className="flex mb-4">
                <input
                  type="text"
                  name="serviceNo"
                  placeholder="Service No"
                  value={formData.serviceNo}
                  onChange={handleInputChange}
                  className={`${GlobalStyle.selectBox} w-full text-blue-900 placeholder-blue-900 pl-2`}
                />
                <button
                  onClick={handleSearch}
                  className="ml-2 bg-blue-600 text-white px-4 rounded"
                >
                  {loading ? "Loading..." : "Search"}
                </button>
              </div>
              {error && <p className="text-red-500 mb-2">{error}</p>}

              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                className={`${GlobalStyle.selectBox} w-full mb-4 text-blue-900 placeholder-blue-900 pl-2`}
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className={`${GlobalStyle.selectBox} w-full mb-4 text-blue-900 placeholder-blue-900 pl-2`}
              />

              <input
                type="text"
                name="contactNo"
                placeholder="Contact No"
                value={formData.contactNo}
                onChange={handleInputChange}
                className={`${GlobalStyle.selectBox} w-full mb-4 text-blue-900 placeholder-blue-900 pl-2`}
              />
              <select
                name="loginMethod"
                value={formData.loginMethod}
                onChange={handleInputChange}
                className={`${GlobalStyle.selectBox} w-full mb-4 text-blue-900 placeholder-blue-900 pl-2`}
              >
                <option value="" disabled hidden>
                  Login Method
                </option>
                <option value="gmail">Gmail</option>
                <option value="mobile">Mobile</option>
                <option value="slt">SLT</option>
              </select>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={`${GlobalStyle.selectBox} w-full mb-4 text-blue-900 placeholder-blue-900 pl-2`}
              >
                <option value="" disabled hidden>
                  Roles
                </option>
                {userRoles.map((role) => (
                  <option
                    key={role.value}
                    value={role.value}
                    hidden={role.hidden}
                    style={{ color: "black" }}
                  >
                    {role.label}
                  </option>
                ))}
              </select>
              {/* {formData.role && (
                <div className={`${GlobalStyle.selectBox} w-full mb-4 pl-1 1/2`}>
                  <div className="flex items-center max-w-[100px] bg-gray-200 text-sm px-3 py-1 rounded-full">
                    <span className="truncate mr-2">{formData.role}</span>
                    <button
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, role: "" }))
                      }
                      className="text-blue-900 font-bold hover:text-red-600"
                      title="Remove role"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )} */}
            </>
          )}

          <div className="w-full">
            <button
              onClick={handleRegister}
              className={`${GlobalStyle.selectBox} ${GlobalStyle.buttonPrimary} text-blue-900 text-center mt-4 rounded-md`}
            >
              {loading ? "Registering user..." : "Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
