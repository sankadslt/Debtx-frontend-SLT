import React from 'react'
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";

export default function FTL_LOD_Change_Details_Form() {
    return (
        <>
            {/* Form */}
            <div className="flex gap-4 mt-4 justify-center">
                <div className={GlobalStyle.cardContainer}>
                    <h1 className={`${GlobalStyle.headingLarge} text-center mb-4`}>Change Details</h1>

                    <form className="flex flex-col gap-4">
                        {/* Text Input */}
                        <div className="flex flex-col">
                            <label className={`${GlobalStyle.headingSmall} mb-1`}>
                                Account No :
                            </label>
                            <input
                                type="text"
                                placeholder=""
                                className={GlobalStyle.inputText}
                            />
                        </div>

                        {/* Select Box */}
                        <div className="flex flex-col">
                            <label className={`${GlobalStyle.headingSmall} mb-1`}>
                                Select Option
                            </label>
                            <select className={GlobalStyle.selectBox}>
                                <option value="">Event Source</option>
                                <option value="option1">Option 1</option>
                                <option value="option2">Option 2</option>
                                <option value="option3">Option 3</option>
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className={`${GlobalStyle.headingSmall} mb-1`}>
                                Customer Name:
                            </label>
                            <input
                                type="text"
                                placeholder=""
                                className={GlobalStyle.inputText}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className={`${GlobalStyle.headingSmall} mb-1`}>
                                Address:
                            </label>
                            <input
                                type="text"
                                placeholder=""
                                className={GlobalStyle.inputText}
                            />
                        </div>

                        <div className="flex flex-col">

                            <input
                                type="text"
                                placeholder=""
                                className={GlobalStyle.inputText}
                            />
                        </div>

                        <div className="flex flex-col">

                            <input
                                type="text"
                                placeholder=""
                                className={GlobalStyle.inputText}
                            />
                        </div>
                        <div className="flex flex-col">

                            <input
                                type="text"
                                placeholder=""
                                className={GlobalStyle.inputText}
                            />
                        </div>
                        <div className="flex flex-col">

                            <input
                                type="text"
                                placeholder=""
                                className={GlobalStyle.inputText}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className={`${GlobalStyle.headingSmall} mb-1`}>
                                Arrears:
                            </label>
                            <input
                                type="text"
                                placeholder=""
                                className={GlobalStyle.inputText}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className={`${GlobalStyle.headingSmall} mb-1`}>
                                Billing Centre:
                            </label>
                            <input
                                type="text"
                                placeholder=""
                                className={GlobalStyle.inputText}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className={`${GlobalStyle.headingSmall} mb-1`}>
                                Customer Type:
                            </label>
                            <input
                                type="text"
                                placeholder=""
                                className={GlobalStyle.inputText}
                            />
                        </div>



                        {/* Button */}
                        <button
                            type="submit"
                            className={`${GlobalStyle.buttonPrimary} mt-4`}
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}
