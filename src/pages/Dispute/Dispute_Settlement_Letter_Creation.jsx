import React from 'react'
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Dispute_Settlement_Letter_Creation() {

    const navigate = useNavigate();


    return (
        <div className={GlobalStyle.fontPoppins}>
            {/* Title */}
            <h2 className={GlobalStyle.headingLarge}>Customer Dispute</h2>

            {/* Case details card */}
            <div className="flex gap-4 mt-4 justify-center">
                <div className={`${GlobalStyle.cardContainer}`}>
                    <div className="table">
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Case ID</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2"></div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Customer Ref</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2"></div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Account no</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2"></div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Arrears Amount</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">

                            </div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Last Payment Date</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">

                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <form className="w-full max-w-4xl mx-auto">
                <table className={GlobalStyle.table}>

                    <tbody>

                        <tr>
                            <td className={`${GlobalStyle.tableData} text-right`}>Signature Owner :</td>
                            <td className={GlobalStyle.tableData}>
                                <select className={`${GlobalStyle.selectBox} w-full`}>
                                    <option value="option1">Option 1</option>
                                    <option value="option2">Option 2</option>
                                    <option value="option3">Option 3</option>
                                </select>
                            </td>
                        </tr>

                        <tr>
                            <td className={`${GlobalStyle.tableData} text-right`}>Template :</td>
                            <td className={GlobalStyle.tableData}>
                                <select className={`${GlobalStyle.selectBox} w-full`}>

                                    <option value="option1">Option 1</option>
                                    <option value="option2">Option 2</option>
                                    <option value="option3">Option 3</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td className={`${GlobalStyle.tableData} text-right`}>Dispute Mode :</td>
                            <td className={GlobalStyle.tableData}>
                                <select className={`${GlobalStyle.selectBox} w-full`}>

                                    <option value="option1">Option 1</option>
                                    <option value="option2">Option 2</option>
                                    <option value="option3">Option 3</option>
                                </select>
                            </td>
                        </tr>



                        {/* Submit Row */}
                        <tr>
                            <td></td>
                            <td className={`${GlobalStyle.tableData} text-right`}>
                                <button type="submit" className={GlobalStyle.buttonPrimary}>
                                    Create Settlement
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>


            <div>
                <button
                    onClick={() => navigate(-1)}
                    className={`${GlobalStyle.buttonPrimary} `}
                >
                    <FaArrowLeft />
                </button>
            </div>

        </div>


    );
}
