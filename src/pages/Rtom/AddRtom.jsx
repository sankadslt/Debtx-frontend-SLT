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
    telephone: ""
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
        confirmButtonColor: "#d33"
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
    
    if (!formData.areaCode.trim()) {
      newErrors.areaCode = "Area Code is required";
    } 
    
  if (formData.email.trim()) {
  if (/\s/.test(formData.email)) {
    newErrors.email = "Email must not contain spaces";
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
    newErrors.email = "Invalid email format";
  }
}


    const mobileDigits = formData.mobile.replace(/\D/g, '');
    if (!mobileDigits || mobileDigits.length !== 10) {
      newErrors.mobile = "Mobile number must be exactly 10 digits";
    }

    const telephoneDigits = formData.telephone.replace(/\D/g, '');
    if (!telephoneDigits || telephoneDigits.length !== 10) {
      newErrors.telephone = "Telephone number must be exactly 10 digits";
    }

    if (!userData) {
      newErrors.general = "User authentication required. Please refresh and try again.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        createdBy: userData
      };

      console.log("Submitting RTOM data:", rtomData); 

      const response = await createRTOM(rtomData);
      
      console.log("RTOM created successfully:", response); 
      
      Swal.fire({
        icon: "success",
        title: "Successfully Created",
        text: `RTOM registered successfully!`,
        confirmButtonColor: "#28a745"
      }).then(() => {
        navigate("/pages/Rtom/RtomList");
      });
      
    } catch (error) {
      console.error("Error in form submission:", error);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message || "Failed to create RTOM. Please try again.",
        confirmButtonColor: "#d33"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let processedValue = value;

  if (name === "billingCenterCode") {
    processedValue = value.replace(/[^a-zA-Z]/g, '');
  }

  if (name === "telephone" || name === "mobile") {
    // Allow only digits
    processedValue = value.replace(/[^0-9]/g, '');
  }
 

  // if (name === "areaCode") {
  //   processedValue = value.replace(/[^a-zA-Z]/g, '');
  // }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className={`p-4 ${GlobalStyle.fontPoppins}`} style={{ fontSize: isSmallMobile ? "14px" : "16px" }}>
      <h1 className={GlobalStyle.headingLarge} style={{ textAlign: isMobile ? "center" : "left" }}>
        Register New Billing Center Area
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
            padding: isMobile ? "1rem" : "2rem"
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4" style={{ marginLeft: isMobile ? "0" : "2rem" }}>
            {/* Form Fields */}
            {[
              { 
                label: "Billing Center Code", 
                name: "billingCenterCode", 
                type: "text", 
                validation: errors.billingCenterCode 
              },
              { 
                label: "Name", 
                name: "name", 
                type: "text", 
                validation: errors.name 
              },
              { 
                label: "Area Code", 
                name: "areaCode", 
                type: "text", 
                validation: errors.areaCode 
              },
              // { 
              //   label: "Email", 
              //   name: "email", 
              //   type: "text", 
              //   validation: errors.email 
              // }
            ].map((field) => (
              <div key={field.name} className="flex flex-col gap-2">
                <div 
                  className="flex items-center gap-4"
                  style={{
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: isMobile ? "flex-start" : "center"
                  }}
                >
                  <div 
                    className="flex justify-between font-semibold"
                    style={{
                      width: isMobile ? "100%" : "12rem"
                    }}
                  >
                     <span>
                       {field.label} <span className="text-red-500">*</span>
                    </span>
                    {!isMobile && <span>:</span>}
                  </div>
                  <input
                    name={field.name}
                    type={field.type}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    className={`${GlobalStyle.inputText} ${field.validation ? 'border-red-500' : ''}`}
                    style={{
                      width: isMobile ? "100%" : "calc(100% - 13rem)"
                    }}
                    
                    //required
                  />
                </div>
                {field.validation && (
                  <p 
                    className="text-red-500 text-sm"
                    style={{
                      marginLeft: isMobile ? "0" : "12rem"
                    }}
                  >
                    {field.validation}
                  </p>
                )}
              </div>
            ))}

            <div className="mb-6">
              <h2 className={`${GlobalStyle.headingMedium} inline-block`}>
                <span className="border-b-2 border-gray-800 pb-1 font-semibold">
                  Contact Details
                </span>
              </h2>
            </div>

            {/* Contact Number Fields */}
            {[
              { 
                label: "Email", 
                name: "email", 
                type: "text", 
                validation: errors.email 
              },
              { 
                label: "Mobile", 
                name: "mobile", 
                type: "tel", 
                placeholder: "071XXXXXXX",
                validation: errors.mobile,
                // pattern: "[0-9]{10}"
              },
              { 
                label: "Telephone", 
                name: "telephone", 
                type: "tel", 
                placeholder: "011XXXXXXX",
                validation: errors.telephone,
                //pattern: "[0-9]{10}"
              }
            ].map((field) => (
              <div key={field.name} className="flex flex-col gap-2">
                <div 
                  className="flex items-center gap-4"
                  style={{
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: isMobile ? "flex-start" : "center"
                  }}
                >
                  <div 
                    className="flex justify-between font-semibold"
                    style={{
                      width: isMobile ? "100%" : "12rem"
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
                    placeholder={field.placeholder}
                    // onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                    className={`${GlobalStyle.inputText} ${field.validation ? 'border-red-500' : ''}`}
                    maxLength="10"
                    style={{
                      width: isMobile ? "100%" : "calc(100% - 13rem)"
                    }}
                    //pattern={field.pattern}
                   // required
                  />
                </div>
                {field.validation && (
                  <p 
                    className="text-red-500 text-sm"
                    style={{
                      marginLeft: isMobile ? "0" : "12rem"
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
                paddingRight: isMobile ? "0" : "1rem"
              }}
            >
              <button 
                type="submit" 
                className={`${GlobalStyle.buttonPrimary} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{
                  padding: isSmallMobile ? "0.5rem 1rem" : "0.3rem 0.75rem"
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
          marginTop: "1rem"
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




// import { useState, useEffect } from "react";
// import GlobalStyle from "../../assets/prototype/GlobalStyle";
// import Swal from "sweetalert2";
// import { createRTOM } from "../../services/RTOM/Rtom_services";
// import { FaArrowLeft } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { getLoggedUserId } from "../../services/auth/authService";

// const AddRtom = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     billingCenterCode: "",
//     name: "",
//     areaCode: "",
//     email: "",
//     mobile: "",
//     telephone: ""
//   });
  
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [userData, setUserData] = useState(null);

//    // get system user 
//   const loadUser = async () => {
//     const user = await getLoggedUserId();
//     setUserData(user);
//     console.log("User data:", user);
//   };

//   useEffect(() => {
//     loadUser();
//   }, []);


//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.billingCenterCode.trim()) {
//       newErrors.billingCenterCode = "Billing Center Code is required";
//     } 
    
//     if (!formData.name.trim()) {
//       newErrors.name = "Name is required";
//     } 
    
//     if (!formData.areaCode.trim()) {
//       newErrors.areaCode = "Area Code is required";
//     } 
    
//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = "Invalid email format";
//     }

//     const mobileDigits = formData.mobile.replace(/\D/g, '');
//     if (!mobileDigits || mobileDigits.length !== 10) {
//       newErrors.mobile = "Mobile number must be exactly 10 digits";
//     }

//     const telephoneDigits = formData.telephone.replace(/\D/g, '');
//     if (!telephoneDigits || telephoneDigits.length !== 10) {
//       newErrors.telephone = "Telephone number must be exactly 10 digits";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) {
//       return;
//     }

//     setIsSubmitting(true);

//     // console.log(userData);
//     // console.log(userData.user_id);
    
//     try {
//       const rtomData = {
//         billingCenterCode: formData.billingCenterCode,
//         name: formData.name,
//         areaCode: formData.areaCode,
//         email: formData.email,
//         mobile: formData.mobile,
//         telephone: formData.telephone,
//         // createdBy: userData?.user_id
//         createdBy: userData
//       };

//       const response = await createRTOM(rtomData);
//       console.log("RTOM created successfully:", response);
      
//       Swal.fire({
//         icon: "success",
//         title: "Success",
//         text: "RTOM created successfully!",
//       }).then(() => {
//         navigate("/pages/Rtom/RtomList");
//       });
      
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: error.message || "Failed to create RTOM",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const goBack = () => {
//     navigate(-1);
//   };

//   return (
//     <div className={`p-6 ${GlobalStyle.fontPoppins}`}>
//       <h1 className={GlobalStyle.headingLarge}>Register new RTOM Area</h1>
//       <div className="flex justify-center">
//         <div className={`${GlobalStyle.cardContainer} mt-4 w-full max-w-2xl`}>
//           <form onSubmit={handleSubmit} className="space-y-4 ml-8">
//             {/* Billing Center Code Field */}
//             <div className="flex flex-col gap-2">
//               <div className="flex items-center gap-4">
//                 <div className="w-48 flex justify-between font-semibold">
//                   <span>Billing Center Code</span>
//                   <span>:</span>
//                 </div>
//                 <input
//                   name="billingCenterCode"
//                   type="text"
//                   value={formData.billingCenterCode}
//                   onChange={handleInputChange}
//                   className={GlobalStyle.inputText}
//                 />
//               </div>
//               {errors.billingCenterCode && (
//                 <p className="text-red-500 text-sm ml-52">{errors.billingCenterCode}</p>
//               )}
//             </div>

//             {/* Name Field */}
//             <div className="flex flex-col gap-2">
//               <div className="flex items-center gap-4">
//                 <div className="w-48 flex justify-between font-semibold">
//                   <span>Name</span>
//                   <span>:</span>
//                 </div>
//                 <input
//                   name="name"
//                   type="text"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className={GlobalStyle.inputText}
//                 />
//               </div>
//               {errors.name && (
//                 <p className="text-red-500 text-sm ml-52">{errors.name}</p>
//               )}
//             </div>

//             {/* Area Code Field */}
//             <div className="flex flex-col gap-2">
//               <div className="flex items-center gap-4">
//                 <div className="w-48 flex justify-between font-semibold">
//                   <span>Area Code</span>
//                   <span>:</span>
//                 </div>
//                 <input
//                   name="areaCode"
//                   type="text"
//                   value={formData.areaCode}
//                   onChange={handleInputChange}
//                   className={GlobalStyle.inputText}
//                 />
//               </div>
//               {errors.areaCode && (
//                 <p className="text-red-500 text-sm ml-52">{errors.areaCode}</p>
//               )}
//             </div>

//             {/* Email Field */}
//             <div className="flex flex-col gap-2">
//               <div className="flex items-center gap-4">
//                 <div className="w-48 flex justify-between font-semibold">
//                   <span>Email</span>
//                   <span>:</span>
//                 </div>
//                 <input
//                   name="email"
//                   type="text"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   className={GlobalStyle.inputText}
//                 />
//               </div>
//               {errors.email && (
//                 <p className="text-red-500 text-sm ml-52">{errors.email}</p>
//               )}
//             </div>

//             <div className="mb-6">
//               <h2 className={`${GlobalStyle.headingMedium} inline-block`}>
//                 <span className="border-b-2 border-gray-800 pb-1 font-semibold">Contact Details</span>
//               </h2>
//             </div>

//             {/* Mobile Number */}
//             <div className="flex flex-col gap-2">
//               <div className="flex items-center gap-4">
//                 <div className="w-48 flex justify-between font-semibold">
//                   <span>Mobile </span>
//                   <span>:</span>
//                 </div>
//                 <input
//                   name="mobile"
//                   type="tel"
//                   value={formData.mobile}
//                   onChange={handleInputChange}
//                   onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
//                   className={GlobalStyle.inputText}
//                   maxLength="10"
//                 />
//               </div>
//               {errors.mobile && (
//                 <p className="text-red-500 text-sm ml-52">{errors.mobile}</p>
//               )}
//             </div>

//             {/* Telephone Number */}
//             <div className="flex flex-col gap-2">
//               <div className="flex items-center gap-4">
//                 <div className="w-48 flex justify-between font-semibold">
//                   <span>Telephone </span>
//                   <span>:</span>
//                 </div>
//                 <input
//                   name="telephone"
//                   type="tel"
//                   value={formData.telephone}
//                   onChange={handleInputChange}
//                   onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
//                   className={GlobalStyle.inputText}
//                   maxLength="10"
//                 />
//               </div>
//               {errors.telephone && (
//                 <p className="text-red-500 text-sm ml-52">{errors.telephone}</p>
//               )}
//             </div>

//             <div className="pt-4 flex justify-end pr-4">
//               <button 
//                 type="submit" 
//                 className={`${GlobalStyle.buttonPrimary} px-8 py-2`}
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? "Submitting..." : "Submit"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//       <div style={{ marginLeft: '70px' }}>
//         <button className={GlobalStyle.navButton} onClick={goBack}>
//           <FaArrowLeft />  Back
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AddRtom;
