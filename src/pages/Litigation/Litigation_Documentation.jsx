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

import GlobalStyle from "../../assets/prototype/GlobalStyle"

export const Litigation_Documentation = () => {
  return (
    <div className={GlobalStyle.fontPoppins}>
        <h1 className={GlobalStyle.headingLarge}>Litigation Documentation</h1>

        <div className="flex gap-4 mt-4 justify-center">
            <div className={GlobalStyle.cardContainer}>
                <h3 className={`${GlobalStyle.headingMedium} font-semibold mb-4`}>CaseID : 001</h3>
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between">
                        <span className={`${GlobalStyle.headingSmall} mb-1`}>RTOM Customer File</span>
                        <div className="flex gap-4 w-[270px]">
                            <select className={`${GlobalStyle.selectBox} w-full`}>
                                <option value="">Select</option>
                                <option value="">Requested</option>
                                <option value="">Collected</option>
                                <option value="">Without Agreement</option>
                            </select>
                            <input type="number" className={`${GlobalStyle.inputText} w-[80px]`}/>      
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <span className={`${GlobalStyle.headingSmall} mb-1`}>DRC File</span>
                        <div className="flex gap-4 w-[270px]">
                            <select className={`${GlobalStyle.selectBox} w-full`}>
                                <option value="">Select</option>
                                <option value="">Requested</option>
                                <option value="">Collected</option>
                            </select>
                            <input type="number" className={`${GlobalStyle.inputText} w-[80px]`}/>      
                        </div>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button className={`${GlobalStyle.buttonPrimary} mt-4`}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}
