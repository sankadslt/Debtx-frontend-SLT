import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import edit_info from "../../assets/images/edit-info.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const RtomInfoEnd = () => {
    const { rtomId } = useParams();
    const [showPopup, setShowPopup] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [error, setError] = useState("");
    const [negotiation, setNegotiation] = useState("");
    const [endDate, setEndDate] = useState("");
    const [remark, setRemark] = useState("");
    const [isEndButtonVisible, setIsEndButtonVisible] = useState(true);
    

    // validation for date
    const handleFromDateChange = (date) => {
        if (toDate && date > toDate) {
            setError("The 'From' date cannot be later than the 'To' date.");
        } else {
            setError("");
            setFromDate(date);
        }
    };

    // validation for date
    const handleToDateChange = (date) => {
        if (fromDate && date < fromDate) {
            setError("The 'To' date cannot be earlier than the 'From' date.");
        } else {
            setError("");
            setToDate(date);
        }
    };


    // Mock data for UI rendering
    const rtomDetails = {
        addeddate: "2025-04-01",
        billingcentercode: "AP",
        rtomname: "Anuradhapura",
        areacode: "123",
        email: "abc@gmail.com",
        mobile: "0712345678",
        telephone: "0116578678",
    };

    const logHistory = [
        { editOn: "2025-04-01", action: "Created", editBy: "Admin" },
        { editOn: "2025-04-02", action: "Updated", editBy: "User" }
    ];

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

    const handleSaveClick = () => {
        if (negotiation && (!endDate || !remark)) {
            alert("Please provide the end date and remarks.");
            return;
        }
        alert("Form submitted successfully!");
        console.log("Data saved:", {
            endDate: negotiation ? endDate : null,
            remark,
        });
    };

    return (
        <div className={GlobalStyle.fontPoppins}>
            <div className={`${GlobalStyle.headingLarge} mb-8`}>
                <span>AP - Ampara RTOM Area {rtomDetails.areaName}</span>
            </div>

            <div className="flex justify-center">
                {/* Card Container */}
                <div className={`${GlobalStyle.cardContainer} p-4`}>
                    <div className="flex mb-4 justify-end">
                        <Link to={`/config/rtom-edit-details/${rtomId}`}>
                            <button>
                                <img src={edit_info} title="Edit" className="w-6 h-6" />
                            </button>
                        </Link>
                    </div>

                    <table className="mb-8 w-full">
                        <tbody>
                            <tr>
                                <td>
                                    <label className={`${GlobalStyle.headingMedium}`}>
                                        Added Date
                                    </label>
                                </td>
                                <td> : </td>
                                <td>
                                    <label>{rtomDetails.addeddate}</label>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label className={`${GlobalStyle.headingMedium}`}>
                                        Billing Center Code
                                    </label>
                                </td>
                                <td> : </td>
                                <td>
                                    <label>{rtomDetails.billingcentercode}</label>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label className={`${GlobalStyle.headingMedium}`}>
                                        RTOM Name
                                    </label>
                                </td>
                                <td> : </td>
                                <td>
                                    <label>{rtomDetails.rtomname}</label>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                            </tr>
                            <tr>
                                <td>
                                    <label className={`${GlobalStyle.headingMedium}`}>
                                        Area Code
                                    </label>
                                </td>
                                <td> : </td>
                                <td>
                                    <label>{rtomDetails.areacode}</label>
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
                                    <label className={`${GlobalStyle.headingMedium} font-bold`}>
                                        Contact Details
                                    </label>
                                </td>
                            </tr>

                            <tr>
                                <td colSpan="3" className="py-2"></td>
                            </tr>
                            <tr>
                                <td>
                                    <label className={`${GlobalStyle.headingMedium}`}>
                                        Mobile
                                    </label>
                                </td>
                                <td> : </td>
                                <td>
                                    <label>{rtomDetails.mobile}</label>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label className={`${GlobalStyle.headingMedium}`}>
                                        Telephone
                                    </label>
                                </td>
                                <td> : </td>
                                <td>
                                    <label>{rtomDetails.telephone}</label>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex flex-col items-center">
                    <div className={`${GlobalStyle.datePickerContainer} -ml-[205px]`}>
                        <label className={GlobalStyle.dataPickerDate}>End Date</label>
                        <span>:</span>
                        <DatePicker
                        selected={fromDate}
                        onChange={handleFromDateChange}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="dd/MM/yyyy"
                        className={GlobalStyle.inputText}
                        />
                    </div>

                    {/* Remark section  */}
                    <div className="mt-4 ml-[700px] w-full ">
                        <label className={GlobalStyle.remarkTopic}>Remark</label>
                        <textarea
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        className={GlobalStyle.remark}
                        rows="5"
                        ></textarea>
                    </div>
                    </div>


            <div className="flex flex-col">
                {/* End Button */}
                {isEndButtonVisible && (
                    <div className="flex justify-end mb-4">
                        <Link to={`/config/rtom-end/${rtomId}`}>
                            <button
                                className={`${GlobalStyle.buttonPrimary}`}
                                onClick={() => {
                                    setNegotiation("end");
                                    setIsEndButtonVisible(false); // Hide the "End" button
                                }}
                            >
                                Save
                            </button>
                        </Link>
                    </div>
                )}

                {negotiation && (
                    <>
                        {/* End Date */}
                        <div className="flex items-center mb-6">
                            <label className="block font-medium min-w-[100px] text-left">End Date :</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className={GlobalStyle.inputText}
                                placeholder="dd/MM/yyyy"
                            />
                        </div>

                       <div className="flex mb-6">
                            <label className="block font-medium min-w-[100px] text-left">Remark :</label>
                            <textarea
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="5"
                                placeholder="Type your remarks here..."
                            ></textarea>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end w-full mt-6">
                            <button
                                className={GlobalStyle.buttonPrimary}
                                onClick={handleSaveClick}
                            >
                                Save
                            </button>
                        </div>
                    </>
                )}

                {/* Log History Button */}
                <div className="flex justify-between items-center w-full mb-4">
                    <button
                        className={`${GlobalStyle.buttonPrimary}`}
                        onClick={() => setShowPopup(true)}
                    >
                        Log History
                    </button>
                </div>
            </div>

            {/* Log History Popup */}
            {showPopup && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md shadow-lg w-3/4">
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
                                        placeholder=""
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
                                            <th className={GlobalStyle.tableHeader}>Edit On</th>
                                            <th className={GlobalStyle.tableHeader}>Action</th>
                                            <th className={GlobalStyle.tableHeader}>Edit By</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedLogHistory.map((row, index) => (
                                            <tr
                                                key={index}
                                                className={`${index % 2 === 0
                                                    ? "bg-white bg-opacity-75"
                                                    : "bg-gray-50 bg-opacity-50"
                                                    } border-b`}
                                            >
                                                <td className={GlobalStyle.tableData}>{row.editOn}</td>
                                                <td className={GlobalStyle.tableData}>{row.action}</td>
                                                <td className={GlobalStyle.tableData}>{row.editBy}</td>
                                            </tr>
                                        ))}
                                        {paginatedLogHistory.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="text-center py-4">
                                                    No results found
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
            )}
        </div>
    );
};

export default RtomInfoEnd;