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

import { FaGlobeAsia } from "react-icons/fa"
import GlobalStyle from "../../assets/prototype/GlobalStyle"

export const Litigation_Documentation = () => {
  return (
    <div className={GlobalStyle.fontPoppins}>
        <h1 className={GlobalStyle.headingLarge}>Litigation Documentation</h1>

        <div className="flex flex-wrap md:flex-nowrap items-center justify-center my-6 gap-1 mb-8">
            <div className="flex flex-col w-[800px] gap-6 mx-6 px-20 py-8 bg-[#E1E4F5] rounded-tr-2xl">
                <h3 className={`${GlobalStyle.headingMedium} font-semibold`}>CaseID : 001</h3>
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between">
                        <span>RTOM Customer File</span>
                        <div className="flex gap-4">
                            <select className={`${GlobalStyle.selectBox} w-[270px]`}>
                                <option value="">Select</option>
                                <option value="">Requested</option>
                                <option value="">Collected</option>
                                <option value="">Without Agreement</option>
                            </select>
                            <input type="number" className={`${GlobalStyle.inputText} w-[80px]`}/>      
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <span>DRC File</span>
                        <div className="flex gap-4">
                            <select className={`${GlobalStyle.selectBox} w-[270px]`}>
                                <option value="">Select</option>
                                <option value="">Requested</option>
                                <option value="">Collected</option>
                            </select>
                            <input type="number" className={`${GlobalStyle.inputText} w-[80px]`}/>      
                        </div>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button className={GlobalStyle.buttonPrimary}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}
