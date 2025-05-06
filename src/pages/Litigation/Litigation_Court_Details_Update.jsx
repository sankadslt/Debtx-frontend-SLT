/*Purpose: 
Created Date: 2025-04-02
Created By: Nimesh Perera (nimeshmathew999@gmail.com)
Last Modified Date: 2025-04-28
Modified By: Nimesh Perera (nimeshmathew999@gmail.com)
Version: React v18
ui number : 4.6.1
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */

import DatePicker from "react-datepicker"
import GlobalStyle from "../../assets/prototype/GlobalStyle"
import { useEffect, useState } from "react";
import { createLegalDetails, listLitigationPhaseCaseDetails } from "../../services/litigation/litigationService";
import { useLocation, useNavigate} from "react-router-dom";
import { getLoggedUserId } from "../../services/auth/authService";

export const Litigation_Court_Details_Update = () => {
  const location =useLocation();
  const navigate =useNavigate();
  const case_id =location.state?.case_id || "";

  const [userId, setUserId] =useState(null);
  const [caseDetails, setCaseDetails] =useState(null);
  const [courtNo, setCourtNo] =useState("");
  const [caseHandlingOfficer, setCaseHandlingOfficer] =useState("");
  const [remark, setRemark] =useState("");
  const [selectedDate, setSelectedDate] =useState(null);

  const [loading, setLoading] =useState(false);
  const [error, setError] =useState(null);

//   const case_id ="1"; //For testing

  useEffect(() => {
    const loadUser =async() => {
        const user =await getLoggedUserId();
        setUserId(user);
        console.log("User: ", user);
    }

    loadUser();    
  }, []);

  useEffect(() => {
    const fetchCaseDetails =async() => {
        setLoading(true);
        const response =await listLitigationPhaseCaseDetails(case_id);
        if (response.success) {
            setCaseDetails(response.data);
            console.log("Case Details", response.data);        
        }else{
            console.error(response.message);
        }
        setLoading(false);
    }
    fetchCaseDetails();
  }, [case_id]);

  const handleSubmit =async() => {
    if (!courtNo || !selectedDate || !caseHandlingOfficer || !remark) {
        setError("Missing required fields.");
        return;
    }

    const payload = {
        case_id: case_id,
        court_no: courtNo,
        court_register_dtm: selectedDate,
        case_handling_officer: caseHandlingOfficer,
        remark: remark,
        created_by: userId,
    };

    try {
        setLoading(true);
        const result = await createLegalDetails(payload);
  
        if (result.status === "success") {
          console.log("Legal Details created successfully!");
          setError("");
          navigate("/pages/Litigation/Litigation_List");
        } else {
          console.log(result.message);
          setError(result.message || "Failed to create legal details.");
        }
      } catch (error) {
        const statusCode = error.response?.status;
        if (statusCode === 400) {
          setError("Missing required fields.");
        } else if (statusCode === 404) {
          setError("Case not found. Please check the Case ID.");
        } else if (statusCode === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError("An unexpected error occurred.");
        }
        console.error(error.message);
      } finally {
        setLoading(false);
    }
  }
  
  return (
    <div className={GlobalStyle.fontPoppins}>
        <h1 className={GlobalStyle.headingLarge}>Legal Details</h1>
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
                <div className="flex gap-2 justify-start mb-4">
                    <label className="w-56 mt-4">Legal Submission : </label>
                    <div className="flex flex-col gap-2 border-2 rounded-xl p-4 w-full">
                        <span>
                            {caseDetails?.litigation?.[0]?.legal_submission?.length > 0
                                ? caseDetails.litigation[0].legal_submission.at(-1).submission
                                : "N/A"
                            }
                        </span>
                        <span>
                            {caseDetails?.litigation?.[0]?.legal_submission?.length > 0
                                ? new Date(caseDetails.litigation[0].legal_submission.at(-1).submission_on).toLocaleDateString("en-GB")
                                : "N/A"
                            }
                        </span>
                        <span>
                            {caseDetails?.litigation?.[0]?.legal_submission?.length > 0
                                ? caseDetails.litigation[0].legal_submission.at(-1).submission_remark
                                : "N/A"
                            }
                        </span>
                    </div>
                </div>

                {/* Court NO*/}
                <div className="flex gap-4 items-center justify-start mb-4">
                    <label className="w-80">Court No : </label>
                    <input 
                        type="text"
                        value={courtNo}
                        onChange={(e) => setCourtNo(e.target.value)} 
                        className={`${GlobalStyle.inputText} w-full`}
                    />
                </div>

                {/* Court Registered Date*/}
                <div className="flex gap-4 items-center justify-between mb-4">
                    <label className="w-80">Court Registered Date : </label>
                    {/* <input type="text" className={`${GlobalStyle.inputText} w-full`}/> */}
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="dd/mm/yyyy"
                        className={`${GlobalStyle.inputText} w-full`}
                    />
                </div>

                {/* Case handling Officer*/}
                <div className="flex gap-4 items-center justify-start mb-4">
                    <label className="w-80">Case Handling Officer : </label>
                    <input 
                        type="text"
                        value={caseHandlingOfficer}
                        onChange={(e) => setCaseHandlingOfficer(e.target.value)} 
                        className={`${GlobalStyle.inputText} w-full`}
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
                        onClick={handleSubmit} 
                        className={GlobalStyle.buttonPrimary}
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
