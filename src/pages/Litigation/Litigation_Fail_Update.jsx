/*Purpose: 
Created Date: 2025-04-02
Created By: Nimesh Perera (nimeshmathew999@gmail.com)
Last Modified Date: 2025-04-02
Modified By: Nimesh Perera (nimeshmathew999@gmail.com)
Version: React v18
ui number : 4.6.2
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */

import { useEffect, useState } from "react"
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { createLegalFail } from "../../services/litigation/litigationService";
import { getLoggedUserId } from "../../services/auth/authService";

export const Litigation_Fail_Update = ({case_id}) => {    
    // const case_id ="1";

    const [remark, setRemark] = useState("");
    const [created_by, setCreatedBy] =useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const loadUser =async() => {
       const user =await getLoggedUserId();
       setCreatedBy(user);
       console.log("User: ", user);
    }
    
    useEffect(() => {
      loadUser();    
    }, [])

    const handleSubmit = async () => {
        if (!remark.trim()) {
          setError("Remark is required.");
          return;
        }
    
        if (!case_id || !remark || !created_by) {
          setError("Something went wrong. Please try again.");
          return;
        }
    
        setLoading(true);
        setError(null);
    
        const result = await createLegalFail({ 
            case_id : case_id, 
            remark : remark, 
            created_by: created_by, 
        });
    
        setLoading(false);
    
        if (result.success) {
            console.log("Legal fail submitted successfully!");
            setSuccess('Case Updated Successfully.')
        } else {
          setError(result.error?.message || "Something went wrong, Please try again.");
        }
    };

    return (
        <div className="">
            <div className="flex flex-col">

                {/* Remark */}
                <div className="flex flex-col gap-2 justify-start mb-4 mt-8">
                    <label className="w-full text-start">Remark : </label>
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
                        {loading ? "Submitting..." : "Write Off"}
                    </button>
                </div>
                {error && <p className="flex justify-end text-red-500 text-sm mt-2">{error}</p>}
                {success && <p className="flex justify-end text-green-500 text-sm mt-2">{success}</p>}
            </div>
        </div>
    )
}
