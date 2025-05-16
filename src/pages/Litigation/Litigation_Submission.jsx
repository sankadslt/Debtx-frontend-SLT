/*Purpose: 
Created Date: 2025-04-02
Created By: Nimesh Perera (nimeshmathew999@gmail.com)
Last Modified Date: 2025-04-28
Modified By: Nimesh Perera (nimeshmathew999@gmail.com)
Version: React v18
ui number : 4.6
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */

import { useEffect, useState } from "react"
import GlobalStyle from "../../assets/prototype/GlobalStyle"
import DatePicker from "react-datepicker";
import { listLitigationPhaseCaseDetails, updateLegalSubmission } from "../../services/litigation/litigationService";
import { getLoggedUserId } from "../../services/auth/authService";
import { useLocation, useNavigate } from "react-router-dom";

export const Litigation_Submission = () => {
  const location =useLocation();
  const navigate =useNavigate();
  const case_id =location.state?.case_id || "";
     
  const [userId, setUserId] =useState(null);
  const [selectedDate, setSelectedDate] =useState(null);
  const [caseDetails, setCaseDetails] =useState(null);
  const [selectedSubmission, setSelectedSubmission] =useState("");
  const [remark, setRemark] =useState("");

  const [loading, setLoading] =useState(false);
  const [error, setError] =useState(null);

//   const case_id ="1"; //For testing

  useEffect(() => {
    const fetchCaseDetails =async() => {
        setLoading(true);
        const response =await listLitigationPhaseCaseDetails(case_id);
        if (response.success) {
            setCaseDetails(response.data);
            console.log(response.data);
            
        }else{
            console.error(response.message);
        }
        setLoading(false);
    }

    fetchCaseDetails();
  }, [case_id]);

  
  useEffect(() => {
    const loadUser =async() => {
        const user =await getLoggedUserId();
        setUserId(user);
        console.log("User: ", user);
    }

    loadUser();    
  }, []);

  const handleSubmit = async () => {
    const payload = {
      case_id: case_id,
      submission: selectedSubmission,
      submission_on: selectedDate,
      submission_by: userId,
      submission_remark: remark,
    };
  
    try {
      setLoading(true);
      const result = await updateLegalSubmission(payload);
  
      if (result.status === "success") {
        console.log("Legal Submission updated successfully");
        setError('');
        navigate('/pages/Litigation/Litigation_List');
      } else {
        console.log("API Error:", result);
  
        const errorCode = result.errors?.code;
        let errorMessage = result.message || "An unexpected error occurred.";
  
        if (errorCode === 400) {
          errorMessage = "Missing required fields.";
        } else if (errorCode === 404) {
          errorMessage = "Case not found. Please verify the Case ID.";
        } else if (errorCode === 500) {
          errorMessage = "Server error. Please try again later.";
        }
  
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Network or unexpected error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={GlobalStyle.fontPoppins}>
        <h1 className={GlobalStyle.headingLarge}>Legal Submission</h1>
        <div className="flex gap-4 mt-4 justify-center">
            <div className={GlobalStyle.cardContainer}>     
                {/* Card */}
                <div className="flex flex-col w-full items-center justify-center">
                    <div className={`${GlobalStyle.cardContainer} w-full`}>
                    {loading ? (
                        <p className="text-center">Loading...</p>
                    ) : (
                        [
                        { label: "Case ID", value: caseDetails?.case_id },
                        { label: "Customer Ref", value: caseDetails?.customer_ref },
                        { label: "Account No", value: caseDetails?.account_no },
                        { label: "Arrears Amount", value: caseDetails?.current_arrears_amount },
                        { label: "Last Payment Date", value: new Date(caseDetails?.last_payment_date).toLocaleDateString("en-GB")},
                        ].map((item, index) => (
                        <p key={index} className="mb-2 flex items-center">
                            <strong className="w-40 text-left">{item.label}</strong>
                            <span className="w-6 text-center">:</span>
                            <span className="flex-1">{item.value || "N/A"}</span>
                        </p>
                        ))
                    )}
                    </div>
                </div>

                {/* Legal Submission */}
                <div className="flex gap-4 items-center justify-start mb-4 w-full">
                    <label className="w-56">Legal Submission</label>
                    <select 
                        className={`${GlobalStyle.selectBox}`}
                        value={selectedSubmission}
                        onChange={(e) => setSelectedSubmission(e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="Legal Accepted">Legal Accepted</option>
                        <option value="Legal Rejected">Legal Rejected</option>
                    </select>
                </div>

                {/* Date */}
                <div className="flex gap-4 items-center justify-start mb-4">
                    <label className="w-56">Legal Submission Date</label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="dd/mm/yyyy"
                        className={`${GlobalStyle.inputText} w-32 md:w-40`}
                    />
                </div>
                
                {/* Remark */}
                <div className="flex flex-col gap-2 justify-start mb-4">
                    <label>Remark : </label>
                    <textarea 
                        className={`${GlobalStyle.inputText} h-40`}
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                    />
                </div>

                {/* Submit */}
                <div className="flex w-full justify-end">
                        <button 
                            className={GlobalStyle.buttonPrimary}
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            Submit
                        </button>
                </div>
                {error && (
                    <div className="mt-2 text-end">
                        <span className="text-red-500 text-sm">{error}</span>
                    </div>
                )}
            </div>
        </div>

    </div>
  )
}
