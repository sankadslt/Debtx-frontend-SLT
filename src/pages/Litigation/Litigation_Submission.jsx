/*Purpose: 
Created Date: 2025-04-02
Created By: Nimesh Perera (nimeshmathew999@gmail.com)
Last Modified Date: 2025-04-02
Modified By: Nimesh Perera (nimeshmathew999@gmail.com)
Version: React v18
ui number : 4.6
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */

import { useState } from "react"
import GlobalStyle from "../../assets/prototype/GlobalStyle"
import DatePicker from "react-datepicker";

export const Litigation_Submission = () => {
  const [selectedDate, setSelectedDate] =useState(null);
  return (
    <div className={GlobalStyle.fontPoppins}>
        <h1 className={GlobalStyle.headingLarge}>Legal Submission</h1>
        <div className="flex gap-4 mt-4 justify-center">
            <div className={GlobalStyle.cardContainer}>     
                {/* Card */}
                <div className="flex flex-col w-full items-center justify-center">
                    <div className={`${GlobalStyle.cardContainer} w-full`}>
                        {[
                            { label: "Case ID", value: "" },
                            { label: "Customer Red", value: "" },
                            { label: "Account No", value: "" },
                            { label: "Arrears Amount", value: "" },
                            { label: "Last Payment Date", value: "" },
                        ].map((item, idx) => (
                            <p key={idx} className="mb-2 flex items-center">
                                <strong className="w-40 text-left">{item.label}</strong>
                                <span className="w-6 text-center">:</span>
                                <span className="flex-1">{item.value || "N/A"}</span>
                            </p>
                        ))}
                    </div>
                </div>

                {/* Legal Submission */}
                <div className="flex gap-4 items-center justify-start mb-4 w-full">
                    <label className="w-56">Legal Submission</label>
                    <select className={`${GlobalStyle.selectBox}`}>
                        <option value="">Select</option>
                        <option value="Legal_Accepted">Legal Accepted</option>
                        <option value="Legal_Rejected">Legal Rejected</option>
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
                    <textarea className={`${GlobalStyle.inputText} h-40`}/>
                </div>

                {/* Submit */}
                <div className="flex w-full justify-end">
                        <button className={GlobalStyle.buttonPrimary}>
                            Submit
                        </button>
                </div>
            </div>
        </div>

    </div>
  )
}
