import { useState, useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import Swal from "sweetalert2";
import { createRTOM } from "../../services/RTOM/Rtom_services";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getLoggedUserId } from "../../services/auth/authService";

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    listener();
    return () => media.removeListener(listener);
  }, [query]);

  return matches;
};

const AddRtom = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    billingCenterCode: "",
    name: "",
    areaCode: "",
    email: "",
    mobile: "",
    telephone: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState(null);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const isSmallMobile = useMediaQuery("(max-width: 480px)");

  const loadUser = async () => {
    try {
      const user = await getLoggedUserId();
      console.log("Loaded user:", user); // Debug logging
      setUserData(user);
    } catch (error) {
      console.error("Error loading user:", error);
      Swal.fire({
        icon: "error",
        title: "Authentication Error",
        text: "Failed to load user information. Please login again.",
        confirmButtonColor: "#d33",
      });
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.billingCenterCode.trim()) {
      newErrors.billingCenterCode = "Billing Center Code is required";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // if (!formData.areaCode.trim()) {
    //   newErrors.areaCode = "Area Code is required";
    // }

    // Email: optional but must be valid if entered
    if (formData.email.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        newErrors.email = "Invalid email format";
      }
    }

    // Mobile: optional but if entered must be 10 digits starting with 07
    const mobileDigits = formData.mobile.replace(/\D/g, "");
    if (mobileDigits) {
      if (!/^07\d{8}$/.test(mobileDigits)) {
        newErrors.mobile =
          "Mobile number must be 10 digits and start with '07'";
      }
    }

    // Telephone: optional but if entered must be 10 digits and start with valid SL area codes
    const telephoneDigits = formData.telephone.replace(/\D/g, "");
    if (telephoneDigits) {
      if (!/^0(11|21|31|41|51|61|81)\d{7}$/.test(telephoneDigits)) {
        newErrors.telephone =
          "Telephone number must be 10 digits and start with a valid area code (e.g., 011)";
      }
    }

    if (!userData) {
      newErrors.general =
        "User authentication required. Please refresh and try again.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Missing or Invalid Fields",
        text: "Please fill in all required fields and ensure valid input.",
        confirmButtonColor: "#d33",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const rtomData = {
        billingCenterCode: formData.billingCenterCode.trim(),
        name: formData.name.trim(),
        areaCode: formData.areaCode.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        telephone: formData.telephone.trim(),
        createdBy: userData,
      };

      console.log("Submitting RTOM data:", rtomData);

      const response = await createRTOM(rtomData);

      console.log("RTOM created successfully:", response);

      Swal.fire({
        icon: "success",
        title: "Successfully Created",
        text: `RTOM registered successfully!`,
        confirmButtonColor: "#28a745",
      }).then(() => {
        navigate("/pages/Rtom/RtomList");
      });
    } catch (error) {
      console.error("Error in form submission:", error);

      const status = error?.status;      
      const backendMessage =
        error?.response?.data?.message || "Failed to create RTOM. Please try again.";
      
      await Swal.fire({
        icon: status === 409 ? "warning" : "error",
        title: status === 409 ? "Duplicate Entry" : "Registration Failed",
        text: backendMessage,
        confirmButtonColor: status === 409 ? "#f39c12" : "#d33",
      });

    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let processedValue = value;

    if (name === "billingCenterCode") {
      processedValue = value.replace(/[^a-zA-Z]/g, "");
    }

    if (name === "telephone" || name === "mobile") {
      // Allow only digits
      processedValue = value.replace(/[^0-9]/g, "");
    }

    if (name === "areaCode") {
      processedValue = value.replace(/[^0-9]/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div
      className={`p-4 ${GlobalStyle.fontPoppins}`}
      style={{ fontSize: isSmallMobile ? "14px" : "16px" }}
    >
      <h1
        className={GlobalStyle.headingLarge}
        style={{ textAlign: isMobile ? "center" : "left" }}
      >
        Register new RTOM Area
      </h1>

      {errors.general && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errors.general}
        </div>
      )}

      <div className="flex justify-center">
        <div
          className={`${GlobalStyle.cardContainer} mt-4 w-full`}
          style={{
            maxWidth: isMobile ? "100%" : "700px",
            padding: isMobile ? "1rem" : "2rem",
          }}
        >
          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-4"
            style={{ marginLeft: isMobile ? "0" : "2rem" }}
          >
            {/* Form Fields */}
            {[
              {
                label: "Billing Center Code",
                name: "billingCenterCode",
                type: "text",
                validation: errors.billingCenterCode,
              },
              {
                label: "Name",
                name: "name",
                type: "text",
                validation: errors.name,
              },
              {
                label: "Area Code",
                name: "areaCode",
                type: "text",
                validation: errors.areaCode,
              },
            ].map((field) => (
              <div key={field.name} className="flex flex-col gap-2">
                <div
                  className="flex items-center gap-4"
                  style={{
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: isMobile ? "flex-start" : "center",
                  }}
                >
                  <div
                    className="flex justify-between font-semibold"
                    style={{
                      width: isMobile ? "100%" : "12rem",
                    }}
                  >
                    <span>
                      {field.label} 
                      {field.name !== "areaCode" && <span className="text-red-500">*</span>}
                    </span>
                    {!isMobile && <span>:</span>}
                  </div>
                  <input
                    name={field.name}
                    type={field.type}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    className={`${GlobalStyle.inputText} ${
                      field.validation ? "border-red-500" : ""
                    }`}
                    style={{
                      width: isMobile ? "100%" : "calc(100% - 13rem)",
                    }}
                  />
                </div>
              </div>
            ))}

            <div className="mb-6">
              <h2 className={`${GlobalStyle.headingMedium} inline-block`}>
                <span className="border-b-2 border-gray-800 pb-1 font-semibold">
                  Contact Details
                </span>
              </h2>
            </div>

            {/* Email input - no digit-only restriction */}
            <div key="email" className="flex flex-col gap-2">
              <div
                className="flex items-center gap-4"
                style={{
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: isMobile ? "flex-start" : "center",
                }}
              >
                <div
                  className="flex justify-between font-semibold"
                  style={{
                    width: isMobile ? "100%" : "12rem",
                  }}
                >
                  <span>Email</span>
                  {!isMobile && <span>:</span>}
                </div>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`${GlobalStyle.inputText} 
                  }`}
                  placeholder="abc@gmail.com"
                />
              </div>
              {errors.email && (
                <p
                  className="text-red-500 text-sm"
                  style={{
                    marginLeft: isMobile ? "0" : "12rem",
                  }}
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Contact Number Fields */}
            {[
              {
                label: "Mobile",
                name: "mobile",
                type: "tel",
                validation: errors.mobile,
                pattern: "[0-9]{10}",
                placeholder: "071XXXXXXX",
              },
              {
                label: "Telephone",
                name: "telephone",
                type: "tel",
                validation: errors.telephone,
                pattern: "[0-9]{10}",
                placeholder: "011XXXXXXX",
              },
            ].map((field) => (
              <div key={field.name} className="flex flex-col gap-2">
                <div
                  className="flex items-center gap-4"
                  style={{
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: isMobile ? "flex-start" : "center",
                  }}
                >
                  <div
                    className="flex justify-between font-semibold"
                    style={{
                      width: isMobile ? "100%" : "12rem",
                    }}
                  >
                    <span>{field.label}</span>
                    {!isMobile && <span>:</span>}
                  </div>
                  <input
                    name={field.name}
                    type={field.type}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
                    }
                    className={`${GlobalStyle.inputText} ${
                      field.validation ? "border-red-500" : ""
                    }`}
                    maxLength="10"
                    style={{
                      width: isMobile ? "100%" : "calc(100% - 13rem)",
                    }}
                    placeholder={field.placeholder}
                  />
                </div>
                {field.validation && (
                  <p
                    className="text-red-500 text-sm"
                    style={{
                      marginLeft: isMobile ? "0" : "12rem",
                    }}
                  >
                    {field.validation}
                  </p>
                )}
              </div>
            ))}

            <div
              className="pt-4 flex justify-end"
              style={{
                paddingRight: isMobile ? "0" : "1rem",
              }}
            >
              <button
                type="submit"
                className={`${GlobalStyle.buttonPrimary} ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                style={{
                  padding: isSmallMobile ? "0.5rem 1rem" : "0.75rem 1.5rem",
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div
        style={{
          marginLeft: isMobile ? "1rem" : "4.5rem",
          marginTop: "1rem",
        }}
      >
        <button
          className={`${GlobalStyle.buttonPrimary} flex items-center space-x-2`}
          onClick={goBack}
        >
          <FaArrowLeft />
        </button>
      </div>
    </div>
  );
};

export default AddRtom;