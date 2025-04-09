/*Purpose: 
Created Date: 2025-04-02
Created By: Nimesh Perera (nimeshmathew999@gmail.com)
Last Modified Date: 2025-04-02
Modified By: Nimesh Perera (nimeshmathew999@gmail.com)
Version: React v18
ui number : 4.6.1
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */

import DatePicker from "react-datepicker"
import GlobalStyle from "../../assets/prototype/GlobalStyle"
import { useState } from "react";

export const Litigation_Court_Details_Update = () => {
  const [selectedDate, setSelectedDate] =useState(null);
  
  return (
    <div className={GlobalStyle.fontPoppins}>
        <h1 className={GlobalStyle.headingLarge}>Legal Details</h1>
        <div className="flex items-center justify-center w-full">
            <div className="flex flex-col w-[800px] bg-[#E1E4F5] py-10 px-20 my-6 rounded-tr-2xl">     
                {/* Card */}
                <div className="flex flex-col w-full items-center justify-center">
                    <div className={`${GlobalStyle.cardContainer} bg-opacity-100 w-full`}>
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

                {/* Remark */}
                <div className="flex gap-2 justify-start mb-4">
                    <label className="w-56">Handed Over : </label>
                    <textarea className={`${GlobalStyle.inputText} w-full h-40`}/>
                </div>

                {/* Court NO*/}
                <div className="flex gap-4 items-center justify-start mb-4">
                    <label className="w-80">Court No : </label>
                    <input type="text" className={`${GlobalStyle.inputText} w-full`}/>
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
                    <input type="text" className={`${GlobalStyle.inputText} w-full`}/>
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
