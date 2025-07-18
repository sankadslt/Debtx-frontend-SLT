import React, { useState } from 'react';
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Dispute_Settlement_Letter_Preview() {
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
            <h2 className={GlobalStyle.headingLarge}>Dispute Settlement Letter Preview</h2>

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




        {/* Case details card - Now with input fields */}
            <div className="flex gap-4 mt-4 justify-center mb-6">
                <div className={GlobalStyle.cardContainer}>
                    <div className="table w-full">
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Settlment ID</div>
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
                            <div className="table-cell px-4 py-2 font-bold">Inisial Amount</div>
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
                            <div className="table-cell px-4 py-2 font-bold">Slab Count</div>
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
                            <div className="table-cell px-4 py-2 font-bold">Slab 1</div>
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
                            <div className="table-cell px-4 py-2 font-bold">Slab 2</div>
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
                            <div className="table-cell px-4 py-2 font-bold">Slab 3</div>
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
                    </div>
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
