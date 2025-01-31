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
const Incident_Register_Individual = () => {
  const [accountNo, setAccountNo] = useState("");
  const [actionType, setActionType] = useState("");
  const [sourceType, setSourceType] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(3); // Default value is 3
  const [loggedInUser] = useState("Admin"); // Replace with dynamic user retrieval logic
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};



    // Account number validation
    if (!accountNo) {
        newErrors.accountNo = "Account number is required.";
      } else if (accountNo.length > 10) {
        newErrors.accountNo = "Account number must be 10 characters or fewer.";
      }
    if (!accountNo) newErrors.accountNo = "Account number is required.";
    if (!actionType) newErrors.actionType = "Action type is required.";
    if (!sourceType) newErrors.sourceType = "Source type is required.";
    if (calendarMonth < 1 || calendarMonth > 3)
        newErrors.calendarMonth = "Calendar month must be between 1 and 3.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMonthChange = (increment) => {
    setCalendarMonth((prev) => {
      const newValue = Math.min(3, Math.max(1, prev + (increment ? 1 : -1))); // Ensure range is 1-3
      return newValue;
    });
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

    const incidentData = {
      Account_Num: accountNo,
      DRC_Action: actionType,
      Monitor_Months: calendarMonth, // Ensure the value is within 1-3
      Created_By: loggedInUser, // Dynamically set logged-in user
      Source_Type: sourceType,
    };

    try {
      const response = await createIncident(incidentData);
      Swal.fire({
        icon: "success",
        title: "Incident Created",
        text: `Incident ID: ${response.data.Incident_Id} created successfully.`,
      });

      // Clear form
      setAccountNo("");
      setActionType("");
      setSourceType("");
      setCalendarMonth(3); // Reset to default value
      setErrors({});
    } catch (error) {
        console.log("Error response:", error);  // Log full error for debugging
        
        const errorCode = error.code;  // Access directly from error object
        const errorMessage = error.message;  // Access directly from error object
      
        // Show specific error for duplicate account numbers
        if (errorCode === "DUPLICATE_ACCOUNT") {
          Swal.fire({
            icon: "error",
            title: "Duplicate Account",
            text: errorMessage || "The account number is already associated with an incident.",
          });
        } else {
          // Show generic error
          Swal.fire({
            icon: "error",
            title: "Error",
            text: errorMessage || "Failed to create incident.",
          });
        }
      }
  };

  return (
    <div className={`p-6 ${GlobalStyle.fontPoppins}`}>
      <h1 className={GlobalStyle.headingLarge}>Incident Register</h1>
      <div className="flex justify-center">
        <div className={`${GlobalStyle.cardContainer} mt-4`}>
          <h2 className={`${GlobalStyle.headingMedium} mb-6 font-semibold`}>Incident Details</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Number */}
            <div className="flex gap-4">
              <label htmlFor="accountNo" className="w-[150px]">Account No</label>
              <input
                id="accountNo"
                type="text"
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
                className={GlobalStyle.inputText}
              />
            </div>
            {errors.accountNo && <p className="text-red-500">{errors.accountNo}</p>}

            {/* Action Type */}
            <div className="flex gap-4">
              <label htmlFor="actionType" className="w-[150px]">Action</label>
              <select
                id="actionType"
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
                className={GlobalStyle.selectBox}
              >
<<<<<<< HEAD
                <option value="">Action Type</option>
=======
                <option value="">Action</option>
>>>>>>> 48902a12f272506efa20dcc1918126f0b210cfa9
                <option value="collect arrears">Collect Arrears</option>
                <option value="collect arrears and CPE">Collect Arrears and CPE</option>
                <option value="collect CPE">Collect CPE</option>
              </select>
            </div>
            {errors.actionType && <p className="text-red-500">{errors.actionType}</p>}

            {/* Telephone Number */}
            <div className="flex gap-4">
              <label htmlFor="accountNo" className="w-[150px]">Telephone No</label>
              <input
                // id="accountNo"
                // type="text"
                // value={accountNo}
                // onChange={(e) => setAccountNo(e.target.value)}
                className={GlobalStyle.inputText}
              />
            </div>
            {errors.accountNo && <p className="text-red-500">{errors.accountNo}</p>}


            {/* Source Type */}
            <div className="flex gap-4">
              <label htmlFor="sourceType" className="w-[150px]">Source Type</label>
              <select
                id="sourceType"
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value)}
                className={GlobalStyle.selectBox}
              >
<<<<<<< HEAD
                <option value="">Source Type</option>
=======
                <option value="">Source type</option>
>>>>>>> 48902a12f272506efa20dcc1918126f0b210cfa9
                <option value="Pilot Suspended">Pilot Suspended</option>
                <option value="Product Terminate">Product Terminate</option>
                <option value="Special">Special</option>
              </select>
            </div>
            {errors.sourceType && <p className="text-red-500">{errors.sourceType}</p>}

            {/* Calendar Month */}
            <div className="flex items-center gap-4 mb-4">
              <label className="whitespace-nowrap w-[150px]">Calendar Month</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleMonthChange(false)}
                  className={GlobalStyle.buttonPrimary}
                >
                  -
                </button>
                <span className="w-8 text-center">{calendarMonth}</span>
                <button
                  type="button"
                  onClick={() => handleMonthChange(true)}
                  className={GlobalStyle.buttonPrimary}
                >
                  +
                </button>
              </div>
            </div>
            {errors.calendarMonth && <p className="text-red-500">{errors.calendarMonth}</p>}

            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
              <button type="submit" className={GlobalStyle.buttonPrimary}>
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Incident_Register_Individual;
