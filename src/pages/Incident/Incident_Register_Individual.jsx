/*Purpose: 
Created Date: 2025-01-09
Created By: Vihanga eshan Jayarathna (vihangaeshan2002@gmail.com)
Last Modified Date: 2025-01-09
Modified By: Vihanga eshan Jayarathna (vihangaeshan2002@gmail.com)
             Janendra Chamodi ( apjanendra@gmail.com )
Version: React v18
ui number : 1.1.1
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */


import { useState, useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import Swal from "sweetalert2";
import { createIncident } from "../../services/Incidents/incidentService.js";
import { getLoggedUserId } from "../../services/auth/authService";
import { FaArrowLeft, FaArrowRight, FaSearch, FaDownload } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";


const Incident_Register_Individual = () => {
  const [accountNo, setAccountNo] = useState(""); // Account number state
  const [actionType, setActionType] = useState(""); // Action type state
  const [sourceType, setSourceType] = useState("");
  const [reason, setreason] = useState("")
  const [calendarMonth, setCalendarMonth] = useState(3); // Calendar month state (default to 3)
  const [contactNumber, setContactNumber] = useState("");  // Contact number state (only for "collect CPE" action type)

  const [errors, setErrors] = useState({}); // Validation errors state
  const [errors1, setErrors1] = useState({}); // Additional validation errors state

  const [userRole, setUserRole] = useState(null); // Role-Based Buttons


  // Role-Based Buttons 
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      let decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        refreshAccessToken().then((newToken) => {
          if (!newToken) return;
          const newDecoded = jwtDecode(newToken);
          setUserRole(newDecoded.role);
        });
      } else {
        setUserRole(decoded.role);
      }
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }, []);

  // Validation function to check if the form is filled correctly
  const validateForm = () => {
    const newErrors = {};
    const newErrors1 = {};

    if (!accountNo.trim()) {
      newErrors.accountNo = "*";
    } else if (accountNo.length > 10) {
      newErrors1.accountNo = "Account number must be  10 characters or fewer.";
    }
    if (!actionType) newErrors.actionType = "*";
    if (!sourceType) newErrors.sourceType = "*";
    if (calendarMonth < 1 || calendarMonth > 3)
      newErrors1.calendarMonth = "Calendar month must be between 1 and 3.";

    // if (actionType === "collect CPE" && !contactNumber) {
    //   newErrors.contactNumber = "*";
    // } 
    if (contactNumber) {
      if (!/^\d+$/.test(contactNumber)) { // Check if contact number contains only digits
        newErrors1.contactNumber = "Contact number must contain only digits.";
      } else if (contactNumber.length !== 10) { // Check if contact number is less than 10 digits
        newErrors1.contactNumber = "Contact number must be exactly 10 digits.";
      }
    }

    setErrors(newErrors);
    setErrors1(newErrors1);
    return Object.keys(newErrors).length === 0 && Object.keys(newErrors1).length === 0;


  };

  // Function to get the current logged-in user ID
  const getCurrentUser = async () => {
    try {
      const user_id = await getLoggedUserId();
      if (!user_id) {
        throw new Error("Username not found in user data");
      }
      return user_id;
    } catch (error) {
      console.error("Error getting user data:", error);
      throw new Error("Failed to get user information");
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill in all required fields and ensure valid input.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    try {
      const user_id = await getCurrentUser();

      const incidentData = {
        Account_Num: accountNo.trim(),
        DRC_Action: actionType,
        Monitor_Months: calendarMonth,
        Source_Type: sourceType,
        // Incident_Required_Reason: reason.trim(),
        Created_By: user_id,
        ...(actionType === "collect CPE" && { Contact_Number: contactNumber }),
      };

      const response = await createIncident(incidentData);
      console.log("Incident created successfully:", response.data);
      Swal.fire({
        icon: "success",
        title: "Account Created",
        text: `Incident Log ID: ${response.data.Incident_Log_Id} created successfully.`,
        confirmButtonColor: "#28a745",
      });

      // Reset form
      setAccountNo("");
      setActionType("");
      setSourceType("");
      setreason("");
      setCalendarMonth(3);
      setContactNumber("");
      setErrors({});
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to create account.",
        confirmButtonColor: "#d33",
      });
    }
  };
  // Function to handle back button click
  const handlebackbuttonClick = () => {
    window.history.back(); // Go back to the previous page
  }

  return (
    <div className={`p-6 ${GlobalStyle.fontPoppins}`}>

      <div className="flex flex-wrap justify-center sm:px-6 lg:px-8 overflow-auto">
        <div className={`${GlobalStyle.cardContainer} mt-4 `}>
          <h1 className={`${GlobalStyle.headingLarge} mb-4 flex justify-center items-center`}>Account Register</h1>
          <h2 className={`${GlobalStyle.headingMedium} mb-6 flex justify-center items-center`}>Account Details</h2>
          {/* <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-4 justify-center items-center ">
              <label htmlFor="accountNo" className="w-[150px]">Account No </label>
              {errors.accountNo && <p className="text-red-500">{errors.accountNo}</p>}
              <div className="flex flex-col items-center gap-2">
              <input id="accountNo" type="text" value={accountNo} onChange={(e) => setAccountNo(e.target.value)} className={`${GlobalStyle.inputText} w-[159px] px-2 py-1 text-sm`} />

              {errors1.accountNo && <p className="text-red-500 text-xs text-center break-words w-full">
                {errors1.accountNo.split("\n").map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span> 
                ))}
                </p>}
              </div>
    
            </div>
            
            

            <div className="flex gap-4 justify-center items-center">
              <label htmlFor="actionType" className="w-[150px]">Action</label>
              {errors.actionType && <p className="text-red-500">{errors.actionType}</p>}
              <select id="actionType" value={actionType} onChange={(e) => setActionType(e.target.value)} className={`${GlobalStyle.selectBox}w-[159px] px-2 py-1 text-sm`}>
                <option value=""  hidden  ></option>
                <option value="collect arrears">Collect Arrears</option>
                <option value="collect arrears and CPE">Collect Arrears and CPE</option>
                <option value="collect CPE">Collect CPE</option>
              </select>
            </div>
            

            {actionType === "collect CPE" && (
              <div className="flex gap-4 justify-center items-center">
                <label htmlFor="contactNumber" className="w-[150px]">Contact Number</label>
                {errors.contactNumber && <p className="text-red-500">{errors.contactNumber}</p>}
                <input id="contactNumber" type="text" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className={`${GlobalStyle.inputText} w-[160px] px-2 py-1 text-sm`} />
              </div>
              
            ) }
            

            <div className="flex gap-4 justify-center items-center">
              <label htmlFor="sourceType" className="w-[150px]">Source Type</label>
              {errors.sourceType && <p className="text-red-500">{errors.sourceType}</p>}
              <select id="sourceType" value={sourceType} onChange={(e) => setSourceType(e.target.value)} className={`${GlobalStyle.selectBox} w-[160px] text-sm`}>
                <option value="" hidden></option>
                <option value="Pilot Suspended">Pilot Suspended</option>
                <option value="Product Terminate">Product Terminate</option>
                <option value="Special">Special</option>
              </select>
            </div>
            

            <div className="flex items-center gap-4 mb-4 justify-center">
              <label className="whitespace-nowrap w-[150px]">Calendar Month</label>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setCalendarMonth((prev) => Math.max(1, prev - 1))} className={GlobalStyle.buttonPrimary}>-</button>
                <span className="w-8 text-center">{calendarMonth}</span>
                <button type="button" onClick={() => setCalendarMonth((prev) => Math.min(3, prev + 1))} className={GlobalStyle.buttonPrimary}>+</button>
              </div> 
            </div>
            {errors1.calendarMonth && <p className="text-red-500 flex justify-center items-center">{errors1.calendarMonth}</p>}

            <div className="pt-4 flex justify-end">
              <button type="submit" className={GlobalStyle.buttonPrimary}>Submit</button>
            </div>
          </form> */}

          {/* Form for incident registration */}
          <div className="flex items-center justify-center ">
            <form onSubmit={handleSubmit} className="space-y-6  w-full  ">
              <div className="overflow-x-auto w-full">
                <table className=" text-sm" >
                  <tbody>
                    {/* Account No */}
                    <tr className="align-center">
                      <td className="w-[180px] py-2">
                        <label htmlFor="accountNo">Account No
                          <span className="text-red-500"> *</span>
                        </label>
                      </td>
                      <td className="py-2">
                        <div className="flex items-center gap-1">
                          {/* {errors.accountNo && (
                          <p className=" text-red-500 text-xs" >{errors.accountNo}</p>
                        )} */}
                          <span className={`text-red-500 text-xs w-3 ${errors.accountNo ? "" : "invisible"}`}>
                            {errors.accountNo}
                          </span>
                          <input
                            id="accountNo"
                            type="text"
                            value={accountNo}
                            onChange={(e) => setAccountNo(e.target.value)}
                            className={`${GlobalStyle.inputText} w-full px-2 py-1`}
                          />
                        </div>
                        {/* {errors.accountNo && (
                        <p className=" text-red-500 text-xs" >{errors.accountNo}</p>
                      )} */}
                        {/* {errors1.accountNo && (
                        <p className="text-red-500 text-xs break-words">
                          {errors1.accountNo.split("\n").map((line, index) => (
                            <span key={index}>{line}<br /></span>
                          ))}
                        </p>
                      )} */}

                        {errors1.accountNo && (
                          <p className="text-red-500 text-xs mt-1">{errors1.accountNo}</p>
                        )}
                      </td>
                    </tr>

                    {/* Action Type */}
                    <tr className="align-center">
                      <td className="py-2">
                        <label htmlFor="actionType">Action
                          <span className="text-red-500">*</span>
                        </label>
                      </td>
                      <td className="py-2">
                        <div className="flex items-center gap-1">
                          {/* {errors.actionType && (
                        <p className="text-red-500 text-xs">{errors.actionType}</p>
                      )} */}
                          <span className={`text-red-500 text-xs w-3 ${errors.actionType ? "" : "invisible"}`}>
                            {errors.actionType}
                          </span>
                          <select
                            id="actionType"
                            value={actionType}
                            onChange={(e) => setActionType(e.target.value)}
                            className={`${GlobalStyle.selectBox} w-full px-2 py-1`}
                          >
                            <option value="" hidden></option>
                            <option value="collect arrears">Collect Arrears</option>
                            <option value="collect arrears and CPE">Collect Arrears and CPE</option>
                            <option value="collect CPE">Collect CPE</option>
                          </select>

                        </div>

                      </td>
                    </tr>

                    {/* Contact Number (Conditional) */}
                    {actionType === "collect CPE" && (
                      <tr className="align-center">
                        <td className="py-2">
                          <label htmlFor="contactNumber">Contact Number</label>
                        </td>
                        <td className="py-2">
                          <div className="flex items-center gap-1">
                            {/* {errors.contactNumber && (
                          <p className="text-red-500 text-xs">{errors.contactNumber}</p>
                        )} */}
                            <span className={`text-red-500 text-xs w-3 ${errors.contactNumber ? "" : "invisible"}`}>
                              {errors.contactNumber}
                            </span>
                            <input
                              id="contactNumber"
                              type="text"
                              value={contactNumber}
                              onChange={(e) => setContactNumber(e.target.value)}
                              className={`${GlobalStyle.inputText} w-full px-2 py-1`}
                            />
                          </div>
                          {errors1.contactNumber && (
                            <p className="text-red-500 text-xs mt-1">{errors1.contactNumber}</p>
                          )}
                        </td>
                      </tr>
                    )}

                    {/* Source Type */}
                    <tr className="align-center">
                      <td className="py-2">
                        <label htmlFor="sourceType">Source Type

                          <span className="text-red-500"> *</span>
                        </label>
                      </td>
                      <td className="py-2">
                        <div className="flex items-center gap-1">
                          {/* {errors.sourceType && (
                        <p className="text-red-500 text-xs">{errors.sourceType}</p>
                      )} */}

                          <span className={`text-red-500 text-xs w-3 ${errors.sourceType ? "" : "invisible"}`}>
                            {errors.sourceType}
                          </span>
                          <select
                            id="sourceType"
                            value={sourceType}
                            onChange={(e) => setSourceType(e.target.value)}
                            className={`${GlobalStyle.selectBox} w-full px-2 py-1`}
                          >
                            <option value="" hidden></option>
                            <option value="Pilot Suspended">Pilot Suspended</option>
                            <option value="Product Terminate">Product Terminate</option>
                            <option value="Special">Special</option>
                          </select>
                        </div>

                      </td>

                    </tr>
                    {/* <tr className="align-center">
                      <td className="py-2">
                        <label htmlFor="reason" >
                          Incident Required Reason
                        </label>
                      </td>

                      <td className="py-2">
                        <textarea
                          id="reason"
                          name="reason"
                          value={reason}
                          onChange={(e) => setreason(e.target.value)}
                          className={`${GlobalStyle.remark}  w-full px-2 py-1`}
                          rows="3"

                        ></textarea>
                      </td>
                    </tr> */}

                    {/* Calendar Month */}
                    <tr className="align-center">
                      <td className="py-2">Calendar Month</td>
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <span className="w-3 invisible">*</span>
                          <button
                            type="button"
                            onClick={() => setCalendarMonth((prev) => Math.max(1, prev - 1))}
                            className={GlobalStyle.buttonPrimary}
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{calendarMonth}</span>
                          <button
                            type="button"
                            onClick={() => setCalendarMonth((prev) => Math.min(3, prev + 1))}
                            className={GlobalStyle.buttonPrimary}
                          >
                            +
                          </button>
                        </div>
                        {errors1.calendarMonth && (
                          <p className="text-red-500 text-xs mt-1">{errors1.calendarMonth}</p>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex justify-end">
                <div>
                  {["admin", "superadmin", "slt"].includes(userRole) && (
                    <button type="submit" className={GlobalStyle.buttonPrimary}>Submit</button>
                  )}
                </div>
                {/* <button type="submit" className={GlobalStyle.buttonPrimary}>Submit</button> */}
              </div>
            </form>
          </div>

        </div>
      </div>
      {/* Back Button */}
      <div className="flex justify-start items-center w-full  ">
        <button
          className={`${GlobalStyle.buttonPrimary} `}
          onClick={handlebackbuttonClick}
        >
          <FaArrowLeft className="mr-2" />

        </button>
      </div>
    </div>
  );
};

export default Incident_Register_Individual;


