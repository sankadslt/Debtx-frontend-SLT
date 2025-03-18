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


import { useState } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import Swal from "sweetalert2";
import { createIncident } from "../../services/Incidents/incidentService.js";
import { getLoggedUserId } from "../../services/auth/authService";

const Incident_Register_Individual = () => {
  const [accountNo, setAccountNo] = useState("");
  const [actionType, setActionType] = useState("");
  const [sourceType, setSourceType] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(3);
  const [contactNumber, setContactNumber] = useState(""); 
  
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!accountNo) {
      newErrors.accountNo = "Account number is required.";
    } else if (accountNo.length > 10) {
      newErrors.accountNo = "Account number must be 10 characters or fewer.";
    }
    if (!actionType) newErrors.actionType = "Action type is required.";
    if (!sourceType) newErrors.sourceType = "Source type is required.";
    if (calendarMonth < 1 || calendarMonth > 3)
      newErrors.calendarMonth = "Calendar month must be between 1 and 3.";
    
    if (actionType === "collect CPE" && !contactNumber) {
      newErrors.contactNumber = "Contact number is required when collecting CPE.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) {
    Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "Please fill in all required fields and ensure valid input.",
    });
    return;
  }

  try {
    const user_id = await getCurrentUser();

    const incidentData = {
      Account_Num: accountNo,
      DRC_Action: actionType,
      Monitor_Months: calendarMonth,
      Source_Type: sourceType,
      Created_By: user_id,  
      ...(actionType === "collect CPE" && { Contact_Number: contactNumber }),
    };

    const response = await createIncident(incidentData);
    Swal.fire({
      icon: "success",
      title: "Incident Created",
      text: `Incident ID: ${response.data.Incident_Id} created successfully.`,
    });

    // Reset form
    setAccountNo("");
    setActionType("");
    setSourceType("");
    setCalendarMonth(3);
    setContactNumber("");
    setErrors({});
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message || "Failed to create incident.",
    });
  }
};

  return (
    <div className={`p-6 ${GlobalStyle.fontPoppins}`}>
      <h1 className={GlobalStyle.headingLarge}>Incident Register</h1>
      <div className="flex justify-center">
        <div className={`${GlobalStyle.cardContainer} mt-4`}>
          <h2 className={`${GlobalStyle.headingMedium} mb-6`}>Incident Details</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-4">
              <label htmlFor="accountNo" className="w-[150px]">Account No</label>
              <input id="accountNo" type="text" value={accountNo} onChange={(e) => setAccountNo(e.target.value)} className={GlobalStyle.inputText} />
            </div>
            {errors.accountNo && <p className="text-red-500">{errors.accountNo}</p>}

            <div className="flex gap-4">
              <label htmlFor="actionType" className="w-[150px]">Action</label>
              <select id="actionType" value={actionType} onChange={(e) => setActionType(e.target.value)} className={GlobalStyle.selectBox}>
                <option value="">Action</option>
                <option value="collect arrears">Collect Arrears</option>
                <option value="collect arrears and CPE">Collect Arrears and CPE</option>
                <option value="collect CPE">Collect CPE</option>
              </select>
            </div>
            {errors.actionType && <p className="text-red-500">{errors.actionType}</p>}

            {actionType === "collect CPE" && (
              <div className="flex gap-4">
                <label htmlFor="contactNumber" className="w-[150px]">Contact Number</label>
                <input id="contactNumber" type="text" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className={GlobalStyle.inputText} />
              </div>
            )}
            {errors.contactNumber && <p className="text-red-500">{errors.contactNumber}</p>}

            <div className="flex gap-4">
              <label htmlFor="sourceType" className="w-[150px]">Source Type</label>
              <select id="sourceType" value={sourceType} onChange={(e) => setSourceType(e.target.value)} className={GlobalStyle.selectBox}>
                <option value="">Source type</option>
                <option value="Pilot Suspended">Pilot Suspended</option>
                <option value="Product Terminate">Product Terminate</option>
                <option value="Special">Special</option>
              </select>
            </div>
            {errors.sourceType && <p className="text-red-500">{errors.sourceType}</p>}

            <div className="flex items-center gap-4 mb-4">
              <label className="whitespace-nowrap w-[150px]">Calendar Month</label>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setCalendarMonth((prev) => Math.max(1, prev - 1))} className={GlobalStyle.buttonPrimary}>-</button>
                <span className="w-8 text-center">{calendarMonth}</span>
                <button type="button" onClick={() => setCalendarMonth((prev) => Math.min(3, prev + 1))} className={GlobalStyle.buttonPrimary}>+</button>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button type="submit" className={GlobalStyle.buttonPrimary}>Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Incident_Register_Individual;