import { useState, useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import Swal from "sweetalert2";
import { createRTOM } from "../../services/RTOM/Rtom";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getLoggedUserId } from "../../services/auth/authService";
 

const AddRtom = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    billingCenterCode: "",
    name: "",
    areaCode: "",
    email: "",
    mobile: "",
    telephone: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState(null);

   // get system user 
  const loadUser = async () => {
  const user = await getLoggedUserId();
  console.log("Loaded user from getLoggedUserId():", user);
  setUserData(user);
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
    
    if (!formData.areaCode.trim()) {
      newErrors.areaCode = "Area Code is required";
    } 
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    const mobileDigits = formData.mobile.replace(/\D/g, '');
    if (!mobileDigits || mobileDigits.length !== 10) {
      newErrors.mobile = "Mobile number must be exactly 10 digits";
    }

    const telephoneDigits = formData.telephone.replace(/\D/g, '');
    if (!telephoneDigits || telephoneDigits.length !== 10) {
      newErrors.telephone = "Telephone number must be exactly 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setIsSubmitting(true);

  if (!userData) {
    Swal.fire({ icon: "error", title: "Error", text: "User data not loaded properly." });
    setIsSubmitting(false);
    return;
  }

  try {
   const rtomData = {
  billingCenterCode: formData.billingCenterCode,
  name: formData.name,
  areaCode: formData.areaCode,
  email: formData.email,
  mobile: formData.mobile ? [formData.mobile] : [],
  telephone: formData.telephone ? [formData.telephone] : [],
  created_by: userData?.user_id || "defaultUserId", // use logged in user id here

};


    console.log("RTOM Data to be sent:", rtomData);

    const response = await createRTOM(rtomData);


    Swal.fire({
      icon: "success",
      title: "Success",
      text: "RTOM created successfully!",
    }).then(() => navigate("/pages/Rtom/RtomList"));

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.message || error.message || "Failed to create RTOM",
    });
  } finally {
    setIsSubmitting(false);
  }
};


  const handleInputChange = (e) => {
  const { name, value } = e.target;
  let newValue = value;

  if (name === "mobile" || name === "telephone") {
    newValue = value.replace(/\D/g, '');  // digits only
  }

  setFormData(prev => ({
    ...prev,
    [name]: newValue
  }));
};


  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className={`p-6 ${GlobalStyle.fontPoppins}`}>
      <h1 className={GlobalStyle.headingLarge}>Register new RTOM Area</h1>
      <div className="flex justify-center">
        <div className={`${GlobalStyle.cardContainer} mt-4 w-full max-w-2xl`}>
          <form onSubmit={handleSubmit} className="space-y-4 ml-8">
            {/* Billing Center Code Field */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <div className="w-48 flex justify-between font-semibold">
                  <span>Billing Center Code</span>
                  <span>:</span>
                </div>
                <input
                  name="billingCenterCode"
                  type="text"
                  value={formData.billingCenterCode}
                  onChange={handleInputChange}
                  className={GlobalStyle.inputText}
                />
              </div>
              {errors.billingCenterCode && (
                <p className="text-red-500 text-sm ml-52">{errors.billingCenterCode}</p>
              )}
            </div>

            {/* Name Field */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <div className="w-48 flex justify-between font-semibold">
                  <span>Name</span>
                  <span>:</span>
                </div>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={GlobalStyle.inputText}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm ml-52">{errors.name}</p>
              )}
            </div>

            {/* Area Code Field */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <div className="w-48 flex justify-between font-semibold">
                  <span>Area Code</span>
                  <span>:</span>
                </div>
                <input
                  name="areaCode"
                  type="text"
                  value={formData.areaCode}
                  onChange={handleInputChange}
                  className={GlobalStyle.inputText}
                />
              </div>
              {errors.areaCode && (
                <p className="text-red-500 text-sm ml-52">{errors.areaCode}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <div className="w-48 flex justify-between font-semibold">
                  <span>Email</span>
                  <span>:</span>
                </div>
                <input
                  name="email"
                  type="text"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={GlobalStyle.inputText}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm ml-52">{errors.email}</p>
              )}
            </div>

            <div className="mb-6">
              <h2 className={`${GlobalStyle.headingMedium} inline-block`}>
                <span className="border-b-2 border-gray-800 pb-1 font-semibold">Contact Details</span>
              </h2>
            </div>

            {/* Mobile Number */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <div className="w-48 flex justify-between font-semibold">
                  <span>Mobile </span>
                  <span>:</span>
                </div>
                <input
                  name="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                  className={GlobalStyle.inputText}
                  maxLength="10"
                />
              </div>
              {errors.mobile && (
                <p className="text-red-500 text-sm ml-52">{errors.mobile}</p>
              )}
            </div>

            {/* Telephone Number */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <div className="w-48 flex justify-between font-semibold">
                  <span>Telephone </span>
                  <span>:</span>
                </div>
                <input
                  name="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                  className={GlobalStyle.inputText}
                  maxLength="10"
                />
              </div>
              {errors.telephone && (
                <p className="text-red-500 text-sm ml-52">{errors.telephone}</p>
              )}
            </div>

            <div className="pt-4 flex justify-end pr-4">
              <button 
                type="submit" 
                className={`${GlobalStyle.buttonPrimary} px-8 py-2`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div style={{ marginLeft: '70px' }}>
        <button className={GlobalStyle.navButton} onClick={goBack}>
          <FaArrowLeft />
        </button>
      </div>
    </div>
  );
};

export default AddRtom;
