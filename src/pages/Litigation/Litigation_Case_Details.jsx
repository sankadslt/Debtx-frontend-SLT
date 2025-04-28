/*Purpose: 
Created Date: 2025-04-02
Created By: Nimesh Perera (nimeshmathew999@gmail.com)
Last Modified Date: 2025-04-28
Modified By: Nimesh Perera (nimeshmathew999@gmail.com)
Version: React v18
ui number : 4.6.2
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */

import DatePicker from "react-datepicker"
import GlobalStyle from "../../assets/prototype/GlobalStyle"
import { useState } from "react";

export const Litigation_Case_Details = () => {
  const [selectedDate, setSelectedDate] =useState(null);
    
  return (
    <div className={GlobalStyle.fontPoppins}>
        <h1 className={GlobalStyle.headingLarge}>Litigation Case Details</h1>
        <div className="flex flex-col items-center justify-center w-full">
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

                {/* Handed Over */}
                <div className="flex gap-2 justify-start mb-4">
                    <label className="w-56">Handed Over : </label>
                    <textarea className={`${GlobalStyle.inputText} w-full h-40`}/>
                </div>

                {/* Court Details */}
                <div className="flex gap-2 justify-start mb-4">
                    <label className="w-56">Court Details : </label>
                    <textarea className={`${GlobalStyle.inputText} w-full h-40`}/>
                </div>
                

               
            </div>
            <div className="flex flex-col gap-10 w-full">
                {/* Response History */}
                <div className="flex flex-col w-full gap-2">
                    <h1 className={`${GlobalStyle.headingMedium} font-semibold`}>Response History</h1>
                    <div className={GlobalStyle.tableContainer}>
                        <table className={GlobalStyle.table}>
                            <thead className={GlobalStyle.thead}>
                                <tr>
                                    <th className={GlobalStyle.tableHeader}>DTM</th>
                                    <th className={GlobalStyle.tableHeader}>Response</th>
                                    <th className={GlobalStyle.tableHeader}>Remark</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className={GlobalStyle.tableData}>2025/04/02</td>
                                    <td className={GlobalStyle.tableData}>Status</td>
                                    <td className={GlobalStyle.tableData}>Remark</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Settlement Plan */}
                <div className="flex flex-col w-full gap-2">
                    <h1 className={`${GlobalStyle.headingMedium} font-semibold`}>Settlement Plan</h1>
                    {/* Court Registered Date*/}
                    <div className="flex gap-4 items-center">
                        <label>Last Monitoring DTM : </label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="dd/mm/yyyy"
                            className={`${GlobalStyle.inputText} w-full`}
                        />
                    </div>
                    <div className={GlobalStyle.tableContainer}>
                        <table className={GlobalStyle.table}>
                            <thead className={GlobalStyle.thead}>
                                <tr>
                                    <th className={GlobalStyle.tableHeader}>Seq No</th>
                                    <th className={GlobalStyle.tableHeader}>Installment Settle Amount</th>
                                    <th className={GlobalStyle.tableHeader}>Plan Date</th>
                                    <th className={GlobalStyle.tableHeader}>Installment Paid Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className={GlobalStyle.tableData}>001</td>
                                    <td className={GlobalStyle.tableData}>25000</td>
                                    <td className={GlobalStyle.tableData}>2025/04/02</td>
                                    <td className={GlobalStyle.tableData}>15000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Payment Details */}
                <div className="flex flex-col w-full gap-2">
                    <h1 className={`${GlobalStyle.headingMedium} font-semibold`}>Response History</h1>
                    <div className={GlobalStyle.tableContainer}>
                        <table className={GlobalStyle.table}>
                            <thead className={GlobalStyle.thead}>
                                <tr>
                                    <th className={GlobalStyle.tableHeader}>Date</th>
                                    <th className={GlobalStyle.tableHeader}>Paid Amount</th>
                                    <th className={GlobalStyle.tableHeader}>Settled Balance</th>
                                    <th className={GlobalStyle.tableHeader}>Installment Sequence</th>
                                    <th className={GlobalStyle.tableHeader}>Transaction Type</th>
                                    <th className={GlobalStyle.tableHeader}>Transaction Amount</th>
                                    <th className={GlobalStyle.tableHeader}>Transaction DTM</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className={GlobalStyle.tableData}>2025/04/02</td>
                                    <td className={GlobalStyle.tableData}>25000</td>
                                    <td className={GlobalStyle.tableData}>15000</td>
                                    <td className={GlobalStyle.tableData}>002</td>
                                    <td className={GlobalStyle.tableData}>Type</td>
                                    <td className={GlobalStyle.tableData}>10000</td>
                                    <td className={GlobalStyle.tableData}>2025/04/02</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
