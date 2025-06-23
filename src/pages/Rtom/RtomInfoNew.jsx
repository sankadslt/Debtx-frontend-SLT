/*Purpose:
Created Date: 2025-06-20
Created By: U.H.Nandali Linara (nadalilinara5@gmail.com)
Last Modified Date: 2025-06-22
Modified By: U.H.Nandali Linara (nadalilinara5@gmail.com)
Version: React v18
ui number : 10.2
Dependencies: Tailwind CSS
Related Files:
Notes: This template uses Tailwind CSS */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import edit_info from "../../assets/images/edit-info.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const RtomInfoNew = () => {
    const navigate = useNavigate();
    
    // Component state
    const [mode, setMode] = useState('view'); 
    const [showPopup, setShowPopup] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [isEndButtonVisible, setIsEndButtonVisible] = useState(true);
    const [endDate, setEndDate] = useState(null);
    const [remark, setRemark] = useState("");
    const [logHistory, setLogHistory] = useState([]);
    const [isEnabled, setIsEnabled] = useState(true);
    const [error, setError] = useState("");

    // Mock data
    const [rtomData, setRtomData] = useState({
        billing_center_code: "BC001",
        rtom_name: "Sample RTOM",
        created_on: new Date().toISOString(),
        area_code: "AREA001",
        rtom_email: "rtom@example.com",
        rtom_mobile_no: "1234567890",
        rtom_telephone_no: "9876543210",
        status: "Active"
    });

    // Form data for edit mode
    const [formData, setFormData] = useState({
        billingCenterCode: rtomData.billing_center_code,
        name: rtomData.rtom_name,
        areaCode: rtomData.area_code,
        email: rtomData.rtom_email,
        mobile: rtomData.rtom_mobile_no,
        telephone: rtomData.rtom_telephone_no,
        status: rtomData.status
    });

    // Navigation
    const goBack = () => {
       
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            
            navigate('/rtom-list'); 
        }
    };
    const switchToEditMode = () => setMode('edit');
    const switchToViewMode = () => setMode('view');
    const switchToEndMode = () => {
        setMode('end');
        setIsEndButtonVisible(false);
    };

    // Date validation
    const handleEndDateChange = (date) => {
        setEndDate(date);
        setError("");
    };

    // Form handlers
    const handleStatusChange = (enabled) => {
        setIsEnabled(enabled);
        setFormData(prev => ({
            ...prev,
            status: enabled ? "Active" : "Inactive"
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveEnd = () => {
        if (!endDate) {
            setError("Please select an end date");
            return;
        }
        if (!remark) {
            setError("Please enter remarks");
            return;
        }
        
        // Update the RTOM status to inactive
        const updatedData = {
            ...rtomData,
            status: "Inactive"
        };
        
        setRtomData(updatedData);
        alert("RTOM ended successfully!");
        switchToViewMode();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedData = {
            ...rtomData,
            billing_center_code: formData.billingCenterCode,
            rtom_name: formData.name,
            area_code: formData.areaCode,
            rtom_email: formData.email,
            rtom_mobile_no: formData.mobile,
            rtom_telephone_no: formData.telephone,
            status: formData.status
        };
        
        setRtomData(updatedData);
        alert("Changes saved successfully!");
        switchToViewMode();
    };

    // Log history pagination
    const rowsPerPage = 7;
    const filteredLogHistory = logHistory.filter((row) =>
        Object.values(row)
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const pages = Math.ceil(filteredLogHistory.length / rowsPerPage);
    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedLogHistory = filteredLogHistory.slice(startIndex, endIndex);

    const handlePrevPage = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < pages - 1) setCurrentPage(currentPage + 1);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "Invalid date";
            
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const year = date.getFullYear();
            return `${month}/${day}/${year}`;
        } catch (e) {
            console.error("Error formatting date:", e);
            return "N/A";
        }
    };

    // Render View Mode
    const renderViewMode = () => (
        <div className="flex justify-center">
            <div className={`${GlobalStyle.cardContainer} p-4`}>
                <div className="flex mb-4 justify-end">
                    <button onClick={switchToEditMode}>
                        <img src={edit_info} title="Edit" className="w-6 h-6" />
                    </button>
                </div>

                <table className="mb-8 w-full">
                    <tbody>
                        <tr>
                            <td>
                                <label className={`${GlobalStyle.headingMedium} pl-16 mb-2 block`}>
                                    Added Date
                                </label>
                            </td>
                            <td> : </td>
                            <td>
                                <label>
                                    {rtomData.created_on ? formatDate(rtomData.created_on) : "N/A"}
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label className={`${GlobalStyle.headingMedium} pl-16 mb-2 block`}>
                                    Billing Center Code
                                </label>
                            </td>
                            <td> : </td>
                            <td>
                                <label>{rtomData.billing_center_code}</label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label className={`${GlobalStyle.headingMedium} pl-16 mb-2 block`}>
                                    RTOM Name
                                </label>
                            </td>
                            <td> : </td>
                            <td>
                                <label>{rtomData.rtom_name}</label>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                <label className={`${GlobalStyle.headingMedium} pl-16 mb-2 block`}>
                                    Area Code
                                </label>
                            </td>
                            <td> : </td>
                            <td>
                                <label>{rtomData.area_code}</label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label className={`${GlobalStyle.headingMedium} pl-16`}>
                                    Email
                                </label>
                            </td>
                            <td> : </td>
                            <td>
                                <label>{rtomData.rtom_email || "N/A"}</label>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                        </tr>

                        <tr>
                            <td colSpan="3" className="py-2"></td>
                        </tr>

                        <tr>
                            <td colSpan="3">
                                <label className={`${GlobalStyle.headingMedium} border-b-2 border-black font-bold inline-block ml-10`}>
                                    Contact Details
                                </label>
                            </td>
                        </tr>

                        <tr>
                            <td colSpan="3" className="py-2"></td>
                        </tr>
                    
                        <tr>
                            <td>
                                <label className={`${GlobalStyle.headingMedium} pl-16 mb-2 block`}>
                                    Mobile
                                </label>
                            </td>
                            <td> : </td>
                            <td>
                                <label>
                                    {rtomData.rtom_mobile_no || "N/A"}
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label className={`${GlobalStyle.headingMedium} pl-16`}>
                                    Telephone
                                </label>
                            </td>
                            <td> : </td>
                            <td>
                                <label>
                                    {rtomData.rtom_telephone_no || "N/A"}
                                </label>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );

    // Render Edit Mode
    const renderEditMode = () => (
        <div className="flex justify-center">
            <div className={`${GlobalStyle.cardContainer} mt-4 w-full max-w-2xl relative`}>
                <div className="absolute top-4 right-4 ml-8">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isEnabled}
                            onChange={(e) => handleStatusChange(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                </div>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
                    <div className="flex gap-8 items-center">
                        <h1 className="w-48">Billing Center Code</h1>
                        <span>:</span>
                        <input
                            name="billingCenterCode"
                            type="text"
                            className={GlobalStyle.inputText}
                            value={formData.billingCenterCode}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="flex gap-8 items-center">
                        <h1 className="w-48">Name</h1>
                        <span>:</span>
                        <input
                            name="name"
                            type="text"
                            className={GlobalStyle.inputText}
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="flex gap-8 items-center">
                        <h1 className="w-48">Area Code</h1>
                        <span>:</span>
                        <input
                            name="areaCode"
                            type="text"
                            className={GlobalStyle.inputText}
                            value={formData.areaCode}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="flex gap-8 items-center">
                        <h1 className="w-48">Email</h1>
                        <span>:</span>
                        <input
                            name="email"
                            type="email"
                            className={GlobalStyle.inputText}
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <strong className="block pt-4 underline">Contact Details</strong>

                    <div className="flex gap-8 items-center ml-16">
                        <select className={GlobalStyle.selectBox}>
                            <option value="mobile">Mobile</option>
                        </select>
                        <input
                            name="mobile"
                            type="tel"
                            className={GlobalStyle.inputText}
                            value={formData.mobile}
                            onChange={handleInputChange}
                            required
                            pattern="[0-9]{10}"
                            title="10 digit mobile number"
                        />
                    </div>

                    <div className="flex gap-8 items-center ml-16">
                        <select className={GlobalStyle.selectBox}>
                            <option value="telephone">Telephone</option>
                        </select>
                        <input
                            name="telephone"
                            type="tel"
                            className={GlobalStyle.inputText}
                            value={formData.telephone}
                            onChange={handleInputChange}
                            pattern="[0-9]{10}"
                            title="10 digit telephone number"
                        />
                    </div>

                    <div className="mb-6">
                        <label className={GlobalStyle.remarkTopic}>Remark</label>
                        <textarea
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            className={`${GlobalStyle.remark} w-[467px] ml-10`}
                            rows="5"
                            placeholder=" "
                        ></textarea>
                    </div>

                    <div className="flex justify-end mt-4 gap-4">
                        <button 
                            type="button" 
                            className={`${GlobalStyle.buttonSecondary} px-8 py-2`}
                            onClick={switchToViewMode}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className={`${GlobalStyle.buttonPrimary} px-8 py-2`}
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    // Render End Mode - Updated version
    const renderEndMode = () => (
        <div className="flex justify-center">
            <div className={`${GlobalStyle.cardContainer} p-4`}>
                <div className="flex mb-4 justify-end">
                    <button onClick={switchToViewMode}>
                        <img src={edit_info} title="Cancel" className="w-6 h-6" />
                    </button>
                </div>

                <table className="mb-8 w-full">
                    <tbody>
                        <tr>
                            <td>
                                <label className={`${GlobalStyle.headingMedium} pl-16 mb-2 block`}>
                                    Added Date
                                </label>
                            </td>
                            <td> : </td>
                            <td>
                                <label>
                                    {rtomData.created_on ? formatDate(rtomData.created_on) : "N/A"}
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label className={`${GlobalStyle.headingMedium} pl-16 mb-2 block`}>
                                    Billing Center Code
                                </label>
                            </td>
                            <td> : </td>
                            <td>
                                <label>{rtomData.billing_center_code}</label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label className={`${GlobalStyle.headingMedium} pl-16 mb-2 block`}>
                                    RTOM Name
                                </label>
                            </td>
                            <td> : </td>
                            <td>
                                <label>{rtomData.rtom_name}</label>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className="flex flex-col items-center">
                    <div className={`${GlobalStyle.datePickerContainer} -ml-[205px]`}>
                        <label className={GlobalStyle.dataPickerDate}>End Date</label>
                        <span>:</span>
                        <DatePicker
                            selected={endDate}
                            onChange={handleEndDateChange}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="dd/MM/yyyy"
                            className={GlobalStyle.inputText}
                        />
                    </div>

                    {/* Updated Remark section */}
                    <div className="w-full mt-4 pl-16">
                        <label className={`${GlobalStyle.headingMedium} block mb-2`}>Remark</label>
                        <textarea
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            className={`${GlobalStyle.remark} w-full`}
                            rows="5"
                        ></textarea> 
                    </div>

                    {error && <div className="text-red-500 mt-2 pl-16">{error}</div>}

                    <div className="flex justify-end w-full mt-6">
                        <button 
                            className={`${GlobalStyle.buttonPrimary} px-8 py-2`}
                            onClick={handleSaveEnd}
                        >
                            Confirm End
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Common UI Elements
    const renderCommonUI = () => (
        <div className="flex flex-col">
            {isEndButtonVisible && mode === 'view' && (
                <div className="flex justify-end mb-4">
                    <button
                        className={`${GlobalStyle.buttonPrimary}`}
                        onClick={switchToEndMode}
                        style={{ zIndex: 1 }} 
                    >
                        End
                    </button>
                </div>
            )}

            <div className="flex flex-col items-start -mt-14">
                <button
                    className={`${GlobalStyle.buttonPrimary}`}
                    onClick={() => setShowPopup(true)}
                >
                    Log History
                </button>

                <div style={{ marginTop: '12px' }}>
                    <button className={GlobalStyle.navButton} onClick={goBack}>
                        <FaArrowLeft /> Back
                    </button>
                </div>
            </div>
        </div>
    );

    // Log History Popup
    const renderLogHistoryPopup = () => (
        showPopup && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-md shadow-lg w-3/4 max-h-[80vh] overflow-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Log History</h2>
                        <button
                            className="text-red-500 text-lg font-bold"
                            onClick={() => setShowPopup(false)}
                        >
                            ×
                        </button>
                    </div>
                    <div>
                        <div className="mb-4 flex justify-start">
                            <div className={GlobalStyle.searchBarContainer}>
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={GlobalStyle.inputSearch}
                                />
                                <FaSearch className={GlobalStyle.searchBarIcon} />
                            </div>
                        </div>
                        <div className={GlobalStyle.tableContainer}>
                            <table className={GlobalStyle.table}>
                                <thead className={GlobalStyle.thead}>
                                    <tr>
                                        <th className={GlobalStyle.tableHeader}>Edited On</th>
                                        <th className={GlobalStyle.tableHeader}>Action</th>
                                        <th className={GlobalStyle.tableHeader}>Edited By</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedLogHistory.length > 0 ? (
                                        paginatedLogHistory.map((row, index) => (
                                            <tr
                                                key={index}
                                                className={`${index % 2 === 0
                                                        ? "bg-white bg-opacity-75"
                                                        : "bg-gray-50 bg-opacity-50"
                                                    } border-b`}
                                            >
                                                <td className={GlobalStyle.tableData}>{formatDate(row.editOn)}</td>
                                                <td className={GlobalStyle.tableData}>{row.action}</td>
                                                <td className={GlobalStyle.tableData}>{row.editBy}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="text-center py-4">
                                                No log history found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {filteredLogHistory.length > rowsPerPage && (
                            <div className={GlobalStyle.navButtonContainer}>
                                <button
                                    className={GlobalStyle.navButton}
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 0}
                                >
                                    <FaArrowLeft />
                                </button>
                                <span>
                                    Page {currentPage + 1} of {pages}
                                </span>
                                <button
                                    className={GlobalStyle.navButton}
                                    onClick={handleNextPage}
                                    disabled={currentPage === pages - 1}
                                >
                                    <FaArrowRight />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    );

    return (
        <div className={GlobalStyle.fontPoppins}>
            <div className={`${GlobalStyle.headingLarge} mb-8`}>
                <span>{rtomData.billing_center_code} - {rtomData.rtom_name} RTOM Area</span>
                {mode === 'edit' && <span> (Edit Mode)</span>}
                {mode === 'end' && <span> (End Mode)</span>}
            </div>

            {mode === 'edit' ? renderEditMode() : 
             mode === 'end' ? renderEndMode() : renderViewMode()}
            
            {renderCommonUI()}
            {renderLogHistoryPopup()}
        </div>
    );
};

export default RtomInfoNew;