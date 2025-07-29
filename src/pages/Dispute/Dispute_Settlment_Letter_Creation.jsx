import React, { useState } from 'react';
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Dispute_Settlement_Letter_Creation() {
    const navigate = useNavigate();

    // State for form fields including case details
    const [formData, setFormData] = useState({
        caseId: '',
        customerRef: '',
        accountNo: '',
        arrearsAmount: '',
        lastPaymentDate: '',
        signatureOwner: '',
        template: '',
        disputeMode: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Settlement form submitted:', formData);
        // Add your form submission logic here
    };

    return (
        <div className={GlobalStyle.fontPoppins}>
            {/* Title */}
            <h2 className={GlobalStyle.headingLarge}>Dispute Settlement Letter Creation</h2>

            {/* Case details card - Now with input fields */}
            <div className="flex gap-4 mt-4 justify-center mb-6">
                <div className={GlobalStyle.cardContainer}>
                    <div className="table w-full">
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Case ID</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">
                                <input
                                    type="text"
                                    name="caseId"
                                    value={formData.caseId}
                                    onChange={handleInputChange}
                                    className={`${GlobalStyle.inputBox} ${GlobalStyle.blueBackground} ${GlobalStyle.darkBlueText} w-full`}
                                    placeholder=""
                                />
                            </div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Customer Ref</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">
                                <input
                                    type="text"
                                    name="customerRef"
                                    value={formData.customerRef}
                                    onChange={handleInputChange}
                                    className={`${GlobalStyle.inputBox} ${GlobalStyle.blueBackground} ${GlobalStyle.darkBlueText} w-full`}
                                    placeholder=""
                                />
                            </div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Account no</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">
                                <input
                                    type="text"
                                    name="accountNo"
                                    value={formData.accountNo}
                                    onChange={handleInputChange}
                                    className={`${GlobalStyle.inputBox} ${GlobalStyle.blueBackground} ${GlobalStyle.darkBlueText} w-full`}
                                    placeholder=""
                                />
                            </div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Arrears Amount</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">
                                <input
                                    type="number"
                                    name="arrearsAmount"
                                    value={formData.arrearsAmount}
                                    onChange={handleInputChange}
                                    className={`${GlobalStyle.inputBox} ${GlobalStyle.blueBackground} ${GlobalStyle.darkBlueText} w-full`}
                                    placeholder=""
                                />
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

            {/* Form section */}
            <div className="flex justify-center">
                <div className={GlobalStyle.cardContainer}>
                    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
                        <table className={`${GlobalStyle.table} w-full`}>
                            <tbody>
                                <tr>
                                    <td className={`${GlobalStyle.tableData} text-right pr-4`}>Signature Owner :</td>
                                    <td className={GlobalStyle.tableData}>
                                        <select 
                                            name="signatureOwner"
                                            value={formData.signatureOwner}
                                            onChange={handleInputChange}
                                            className={`${GlobalStyle.selectBox} w-full`}
                                            style={{ color: formData.signatureOwner === '' ? 'gray' : 'black' }}
                                        >
                                            <option value="" hidden>Select Signature Owner</option>
                                            <option value="owner1">Manager - John Doe</option>
                                            <option value="owner2">Supervisor - Jane Smith</option>
                                            <option value="owner3">Director - Mike Johnson</option>
                                        </select>
                                    </td>
                                </tr>

                                <tr>
                                    <td className={`${GlobalStyle.tableData} text-right pr-4`}>Template :</td>
                                    <td className={GlobalStyle.tableData}>
                                        <select 
                                            name="template"
                                            value={formData.template}
                                            onChange={handleInputChange}
                                            className={`${GlobalStyle.selectBox} w-full`}
                                            style={{ color: formData.template === '' ? 'gray' : 'black' }}
                                        >
                                            <option value="" hidden>Select Template</option>
                                            <option value="template1">Settlement Letter Template 1</option>
                                            <option value="template2">Settlement Letter Template 2</option>
                                            <option value="template3">Settlement Letter Template 3</option>
                                        </select>
                                    </td>
                                </tr>

                                <tr>
                                    <td className={`${GlobalStyle.tableData} text-right pr-4`}>Dispute Mode :</td>
                                    <td className={GlobalStyle.tableData}>
                                        <select 
                                            name="disputeMode"
                                            value={formData.disputeMode}
                                            onChange={handleInputChange}
                                            className={`${GlobalStyle.selectBox} w-full`}
                                            style={{ color: formData.disputeMode === '' ? 'gray' : 'black' }}
                                        >
                                            <option value="" hidden>Select Dispute Mode</option>
                                            <option value="mode1">Full Settlement</option>
                                            <option value="mode2">Partial Settlement</option>
                                            <option value="mode3">Payment Plan</option>
                                        </select>
                                    </td>
                                </tr>

                                {/* Submit Row */}
                                <tr>
                                    <td></td>
                                    <td className={`${GlobalStyle.tableData} text-right pt-6 pr-2`}>
                                        <button 
                                            type="submit" 
                                            className={GlobalStyle.buttonPrimary}
                                            style={{ minWidth: '180px', marginRight: '20px' }}
                                        >
                                            Create Settlement Letter
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
            </div>

            {/* Back button */}
            <div className="mt-6 relative z-10">
                <button
                    onClick={() => navigate(-1)}
                    className={`${GlobalStyle.buttonPrimary} w-12 h-12 rounded-full flex items-center justify-center p-0`}
                >
                    <FaArrowLeft />
                </button>
            </div>
        </div>
    );
}
