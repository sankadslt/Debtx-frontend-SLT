/*Purpose: 
Created Date: 2025-04-01
Created By: Nimesh Perera (nimeshmathew999@gmail.com)
Last Modified Date: 2025-04-01
Modified By: Nimesh Perera (nimeshmathew999@gmail.com)
Version: React v18
ui number : 4.2.1
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */

import { useEffect, useState } from "react"
import GlobalStyle from "../../assets/prototype/GlobalStyle"
import { createLitigationDocument } from "../../services/litigation/litigationService";
import { useLocation, useNavigate } from "react-router-dom";
import { getLoggedUserId } from "../../services/auth/authService";

export const Litigation_Documentation = () => {
  const location =useLocation();
  const navigate =useNavigate();
  const caseId =location.state?.case_id ||"";
  const [userId, setUserId] =useState(null);
  const [error, setError] =useState(null)

  const [rtomStatus, setRtomStatus] =useState("");
  const [rtomPages, setRtomPages] =useState("");
  const [drcStatus, setDrcStatus] =useState("");
  const [drcPages, setDrcPages] =useState("");

  const loadUser =async() => {
    const user =await getLoggedUserId();
    setUserId(user);
    console.log("User: ", user);
  }

  useEffect(() => {
    loadUser();    
  }, [])
  
  const handleSubmit =async()=>{
    const payload = {
      case_id: caseId,
      rtom_customer_file_status: rtomStatus,
      rtom_file_status_by: userId,
      rtom_pages_count: parseInt(rtomPages),
      drc_file_status: drcStatus,
      drc_file_status_by: userId,
      drc_pages_count: parseInt(drcPages),
    };

    try {
        const result =await createLitigationDocument(payload);
        console.log(result);

        //reset states
        setError('');
        setRtomPages('');
        setRtomStatus('');
        setDrcPages('');
        setDrcStatus('');

        navigate('/pages/Litigation/Litigation_List');

    } catch (error) {
        const statusCode = error.response?.status;
        if (statusCode === 400) {
            setError("Missing required fields.");
        } else if (statusCode === 404) {
            setError("Case not found. Please verify the Case ID.");
        } else if (statusCode === 500) {
            setError("Server error. Please try again later.");
        } else {
            setError("An unexpected error occurred.");
        }
        console.log(error.message);
        
    }
  }

  return (
    <div className={GlobalStyle.fontPoppins}>
        <h1 className={GlobalStyle.headingLarge}>Litigation Documentation</h1>

        <div className="flex gap-4 mt-4 justify-center">
            <div className={GlobalStyle.cardContainer}>
                <h3 className={`${GlobalStyle.headingMedium} font-semibold mb-4`}>CaseID : {caseId}</h3>
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between">
                        <span className={`${GlobalStyle.headingSmall} mb-1`}>RTOM Customer File</span>
                        <div className="flex gap-4 w-[270px]">
                            <select 
                                className={`${GlobalStyle.selectBox} w-full`}
                                value={rtomStatus}
                                onChange={(e) => setRtomStatus(e.target.value)}
                            >
                                <option value="">Select</option>
                                <option value="Requested">Requested</option>
                                <option value="Collected">Collected</option>
                                <option value="Without Agreement">Without Agreement</option>
                            </select>
                            <input 
                                type="number" 
                                className={`${GlobalStyle.inputText} w-[80px]`}
                                value={rtomPages}
                                onChange={(e) => setRtomPages(e.target.value)}
                            />      
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <span className={`${GlobalStyle.headingSmall} mb-1`}>DRC File</span>
                        <div className="flex gap-4 w-[270px]">
                            <select 
                                className={`${GlobalStyle.selectBox} w-full`}
                                value={drcStatus}
                                onChange={(e) => setDrcStatus(e.target.value)}
                            >
                                <option value="">Select</option>
                                <option value="Requested">Requested</option>
                                <option value="Collected">Collected</option>
                            </select>
                            <input 
                                type="number" 
                                className={`${GlobalStyle.inputText} w-[80px]`}
                                value={drcPages}
                                onChange={(e) => setDrcPages(e.target.value)}
                            />      
                        </div>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button 
                        className={`${GlobalStyle.buttonPrimary} mt-4`}
                        onClick={handleSubmit}
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
