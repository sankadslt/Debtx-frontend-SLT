/*Purpose: 
Created Date: 2025-04-02
Created By: Nimesh Perera (nimeshmathew999@gmail.com)
Last Modified Date: 2025-04-02
Modified By: Nimesh Perera (nimeshmathew999@gmail.com)
Version: React v18
ui number : 4.2.2
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */

import { useNavigate } from "react-router-dom"
import GlobalStyle from "../../assets/prototype/GlobalStyle"

export const Litigation_Submission_Document_Summary = () => {
  const navigate =useNavigate();
  return (
    <div className={GlobalStyle.fontPoppins}>
        <h1 className={GlobalStyle.headingLarge}>Create HS Document</h1>

        <div className="flex flex-col w-full items-center justify-center my-6 gap-4 mb-8">
            <div className="w-[800px] h-fit">
                <div className="flex w-full h-[400px] items-center justify-center gap-6 px-20 py-8 bg-[#D9D9D999] rounded-2xl">
                    <span className={GlobalStyle.headingMedium}>Preview of HS Document</span>
                </div>
                <div className="flex w-full justify-end gap-4 mt-4">
                    <button 
                        className={GlobalStyle.buttonPrimary}
                        onClick={() => navigate('/pages/Litigation/Change_Litigation_Submission_Document_Summary')}
                    >
                        Change Details
                    </button>
                    <button className={GlobalStyle.buttonPrimary}>
                        Create PDF
                    </button>
                </div>
            </div>
        </div>

    </div>
  )
}
