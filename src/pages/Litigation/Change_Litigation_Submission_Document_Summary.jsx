/*Purpose: 
Created Date: 2025-04-09
Created By: Nimesh Perera (nimeshmathew999@gmail.com)
Last Modified Date: 2025-04-09
Modified By: Nimesh Perera (nimeshmathew999@gmail.com)
Version: React v18
ui number : 4.2.3
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */

import DatePicker from "react-datepicker"
import GlobalStyle from "../../assets/prototype/GlobalStyle"

export const Change_Litigation_Submission_Document_Summary = () => {
  return (
    <div className={GlobalStyle.fontPoppins}>

        <div className="flex gap-4 mt-4 justify-center">
            <div className={GlobalStyle.cardContainer}>
                <h1 className={GlobalStyle.headingLarge}>Create HS Document</h1>
                <div className="flex flex-col gap-4 mt-8">
                    <div className="flex items-center justify-between">
                        <label className={`${GlobalStyle.headingSmall} mb-1 w-96`}>Telephone No : </label>
                        <input 
                                type="text" 
                                className={`${GlobalStyle.inputText} w-full`}
                                // onChange={}
                            />  
                    </div>
                    <div className="flex items-center justify-between">
                        <label className={`${GlobalStyle.headingSmall} mb-1 w-96`}>Customer Name : </label>
                        <input 
                                type="text" 
                                className={`${GlobalStyle.inputText} w-full`}
                                // onChange={}
                            />  
                    </div>
                    <div className="flex items-center justify-between">
                        <label className={`${GlobalStyle.headingSmall} mb-1 w-96`}>Address : </label>
                        <input 
                                type="text" 
                                className={`${GlobalStyle.inputText} w-full`}
                                // onChange={}
                            />  
                    </div>
                    <div className="flex items-center justify-between">
                        <label className={`${GlobalStyle.headingSmall} mb-1 w-96`}>Proprietorship Name : </label>
                        <input 
                                type="text" 
                                className={`${GlobalStyle.inputText} w-full`}
                                // onChange={}
                            />  
                    </div>
                    <div className="flex items-center justify-between">
                        <label className={`${GlobalStyle.headingSmall} mb-1 w-96`}>Proprietorship Address : </label>
                        <input 
                                type="text" 
                                className={`${GlobalStyle.inputText} w-full`}
                                // onChange={}
                            />  
                    </div>
                    <div className="flex items-center justify-between">
                        <label className={`${GlobalStyle.headingSmall} mb-1 w-96`}>RTOM Area : </label>
                        <input 
                                type="text" 
                                className={`${GlobalStyle.inputText} w-full`}
                                // onChange={}
                            />  
                    </div>
                    <div className="flex gap-4 items-center justify-between">
                        <label className="w-full">Agreement Date : </label>
                        <DatePicker
                            // selected={}
                            // onChange={}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="dd/mm/yyyy"
                            className={`${GlobalStyle.inputText} `}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <label className={`${GlobalStyle.headingSmall} mb-1 w-96`}>Mediation Board Area : </label>
                        <input 
                                type="text" 
                                className={`${GlobalStyle.inputText} w-full`}
                                // onChange={}
                            />  
                    </div>
                    <div className="flex gap-4 items-center justify-between">
                        <label className={GlobalStyle.dataPickerDate}>Date of Mediation Board Certificate :  </label>
                        <DatePicker
                            // selected={}
                            // onChange={}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="dd/MM/yyyy"
                            className={GlobalStyle.inputText}
                        />
                    </div>
                    <div className="flex gap-4 items-center justify-end">
                        <label>
                            <input type="radio" name="type" value="Settlement" className="mr-2"/>
                            Settlement
                        </label>
                        <label>
                            <input type="radio" name="type" value="NonSettlement" className="mr-2"/>
                            Non-Settlement                    
                        </label>
                    </div>
                    <div className="flex gap-4 items-center justify-between">
                        <label className={GlobalStyle.dataPickerDate}>Date Service Provided :  </label>
                        <DatePicker
                            // selected={}
                            // onChange={}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="dd/MM/yyyy"
                            className={GlobalStyle.inputText}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <label className={`${GlobalStyle.headingSmall} mb-1 w-96`}>Amount Outstanding : </label>
                        <input 
                                type="text" 
                                className={`${GlobalStyle.inputText} w-full`}
                                // onChange={}
                            />  
                    </div>
                    <div className="flex items-center justify-between">
                        <label className={`${GlobalStyle.headingSmall} mb-1 w-96`}>Month of Last Usage : </label>
                        <input 
                                type="text" 
                                className={`${GlobalStyle.inputText} w-full`}
                                // onChange={}
                            />  
                    </div>
                    <div className="flex items-center justify-between">
                        <label className={`${GlobalStyle.headingSmall} mb-1 w-96`}>Month of Last Payment : </label>
                        <input 
                                type="text" 
                                className={`${GlobalStyle.inputText} w-full`}
                                // onChange={}
                            />  
                    </div>
                    <div className="flex items-center justify-between">
                        <label className={`${GlobalStyle.headingSmall} mb-1 w-96`}>The Customer is a Cooperate Customer : </label>
                        <div className="flex gap-4 items-center justify-evenly w-96">
                            <label>
                                <input type="radio" name="type" value="Yes" className="mr-2"/>
                                Yes
                            </label>
                            <label>
                                <input type="radio" name="type" value="No" className="mr-2"/>
                                No                   
                            </label>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <label className={`${GlobalStyle.headingSmall} mb-1 w-96`}>IT Concern : </label>
                        <div className="flex gap-4 items-center justify-evenly w-96">
                            <label>
                                <input type="radio" name="type" value="Yes" className="mr-2"/>
                                Yes
                            </label>
                            <label>
                                <input type="radio" name="type" value="No" className="mr-2"/>
                                No                   
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 mt-4">
                        <h3 className={`${GlobalStyle.headingMedium} font-semibold`}>Form Filled By</h3>
                        <div className="flex items-center justify-between">
                            <label className={`${GlobalStyle.headingSmall} mb-1 w-96`}>Name: </label>
                            <input 
                                type="text" 
                                className={`${GlobalStyle.inputText} w-full`}
                                // onChange={}
                            />  
                        </div>
                        <div className="flex items-center justify-between">
                            <label className={`${GlobalStyle.headingSmall} mb-1 w-96`}>Signature : </label>
                            <input 
                                type="text" 
                                className={`${GlobalStyle.inputText} w-full`}
                                // onChange={}
                            />  
                        </div>
                        <div className="flex gap-4 items-center justify-between">
                            <label className={GlobalStyle.dataPickerDate}>Date :  </label>
                            <DatePicker
                                // selected={}
                                // onChange={}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="dd/MM/yyyy"
                                className={GlobalStyle.inputText}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                    <button 
                        className={`${GlobalStyle.buttonPrimary} mt-4`}
                        // onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
                </div>
            </div>
        </div>

    </div>
  )
}
