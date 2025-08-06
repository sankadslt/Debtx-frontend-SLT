/*Purpose:
Created Date: 2025-04-01
Created By: Janani Kumarasiri (jkktg001@gmail.com)
Last Modified Date: 
Modified By: 
Last Modified Date: 
Modified By: 
Version: React v18
ui number : 3.3
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import { FaArrowLeft, FaArrowRight, FaSearch, FaDownload, FaRetweet } from "react-icons/fa";
import Swal from "sweetalert2";
import { getLoggedUserId } from "../../services/auth/authService.js";
import { F2_selection_cases_count } from "../../services/LOD/LOD.js";
import { List_F2_Selection_Cases } from "../../services/LOD/LOD.js";
import { Create_Task_For_Downloard_All_Digital_Signature_LOD_Cases } from "../../services/LOD/LOD.js";
import { Create_Task_For_Downloard_Each_Digital_Signature_LOD_Cases } from "../../services/LOD/LOD.js";
import { Change_Document_Type } from "../../services/LOD/LOD.js";
import { Create_Task_for_Proceed_LOD_OR_Final_Reminder_List } from "../../services/LOD/LOD.js";
import { jwtDecode } from "jwt-decode";


const Digital_Signature_LOD = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [LODType, setLODType] = useState("");
    const [LODData, setLODData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreatingTask, setIsCreatingTask] = useState(false);
    const [activePopupLODID, setActivePopupLODID] = useState(null);
    const [activePopupLODStatus, setActivePopupLODStatus] = useState("");
    const [changeReason, setChangeReason] = useState("");
    const [LODCount, setLODCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [lodCount, setlodCount] = useState(0);
    const [finalReminderCount, setFinalReminderCount] = useState(0);
    const [MaxPage, setMaxPage] = useState(0);
    const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true); // Flag to check if more data is available
    const [maxTablePages, setMaxTablePages] = useState(0); // Maximum number of pages for the table
    const [maxCurrentPage, setMaxCurrentPage] = useState(0); // Maximum current page for the table
    const rowsPerPage = 10; // Number of rows per page
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null); // Role-Based Buttons

    // Role-Based Buttons
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        try {
            let decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {
                refreshAccessToken().then((newToken) => {
                    if (!newToken) return;
                    const newDecoded = jwtDecode(newToken);
                    setUserRole(newDecoded.role);
                });
            } else {
                setUserRole(decoded.role);
            }
        } catch (error) {
            console.error("Invalid token:", error);
        }
    }, []);

    // Fetch LOD, Final reminder and total counts
    const fetchLODCounts = async () => {
        try {
            const response = await F2_selection_cases_count();

            // Assign values to parameters from response
            setTotalCount(response.totalCount);
            setlodCount(response.lodCount);
            setFinalReminderCount(response.finalReminderCount);
        } catch (error) {
            console.error("Error fetching LOD counts:", error.message);
            Swal.fire({
                title: "Error",
                text: "Failed to fetch LOD counts.",
                icon: "error",
                confirmButtonColor: "#d33"
            });
        }
    }

    useEffect(() => {
        fetchLODCounts();
    }, []);

    // Function to calculate the maximum number of pages
    const calculateMaxPages = (totalCases) => {
        if (totalCases <= 10) {
            setMaxPage(1) // All cases fit on the first page
            setMaxTablePages(1); // Set max table pages to 1
        } else {
            setMaxPage(Math.ceil((totalCases - 10) / 30) + 1); // Calculate for additional pages
            setMaxTablePages(Math.ceil(totalCases / rowsPerPage)); // Set max table pages
        }
    };

    // calculating the maximum number of pages in the table, everytime the LODType, lodcount and finalreminder changes
    useEffect(() => {
        if (LODType === "LOD") {
            calculateMaxPages(lodCount); // Pass lodCount for "LOD"
        } else if (LODType === "Final Reminder") {
            calculateMaxPages(finalReminderCount); // Pass finalReminderCount for "final reminder"
        }
        console.log("Max Page:", MaxPage);
    }, [LODType, [lodCount], [finalReminderCount]]);


    // Fetch LOD data based on the selected LOD type and current page
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const LODs = await List_F2_Selection_Cases(LODType, currentPage);
            // setLODData(LODs);
            setLODData((prevData) => [...prevData, ...LODs]); // Append new data to existing data
            if (LODs.length === 0 && currentPage === 1) {
                Swal.fire({
                    title: "No Results",
                    text: "No LOD is matching the criteria.",
                    icon: "warning",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonColor: "#f1c40f"
                });
            }

            // if (LODs.length === 0) {
            //     setIsMoreDataAvailable(false); // No more data available
            //     if (currentPage === 1) {
            //         Swal.fire({
            //             title: "No Results",
            //             text: "No LOD is matching the criteria.",
            //             icon: "warning",
            //             allowOutsideClick: false,
            //             allowEscapeKey: false
            //         });
            //     }
            // } else {
            //     const maxData = currentPage === 1 ? 10 : 30;
            //     if (LODs < maxData) {
            //         setIsMoreDataAvailable(false); // No more data available
            //     }
            // }

        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.message || "No LOD is matching the criteria.",
                icon: "error",
                confirmButtonColor: "#d33",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = () => {
        if (currentPage > maxCurrentPage && currentPage <= MaxPage) {
            setMaxCurrentPage(currentPage);
            fetchData(); // Fetch next page data
        }
    }

    useEffect(() => {
        handlePageChange(); // Fetch data when currentPage changes
    }, [currentPage]);

    useEffect(() => {
        if (LODType.trim()) { // Check if LODType is not empty or just whitespace
            setLODData([]); // Clear previous data when LODType changes
            setMaxCurrentPage(0); // Reset the current page
            // setIsMoreDataAvailable(true); // Reset the flag for new data
            if (currentPage === 1) {
                fetchData();
            } else {
                setCurrentPage(1); // Reset to the first page if LODType changes
            }
        } else {
            setLODData([]); // Clear data if LODType is empty
        }
    }, [LODType]);

    // Function to handle the creation of tasks for downloading each LOD
    const HandleCreateTaskEachLOD = async () => {
        if (!LODType) {
            Swal.fire({
                title: "Error",
                text: "Please apply filter 2 befor download.",
                icon: "error",
                confirmButtonColor: "#d33",
            });
            return;
        }

        const userData = await getLoggedUserId(); // Assign user ID

        setIsCreatingTask(true);
        try {

            const payload = {
                Created_By: userData,
                current_document_type: LODType,
            }
            const response = await Create_Task_For_Downloard_Each_Digital_Signature_LOD_Cases(payload);
            console.log("Response:", response);
            if (response.status === 200) {
                Swal.fire({
                    title: `Task created successfully!`,
                    text: "Task ID: " + response.data.data.data.Task_Id,
                    icon: "success",
                    confirmButtonColor: "#28a745"
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.message || "Failed to create task.",
                icon: "error",
                confirmButtonColor: "#d33"
            });
        } finally {
            setIsCreatingTask(false);
        }
    };

    // Function to handle the creation of tasks for downloading all LODs
    const HandleCreateTaskAllLOD = async () => {
        if (LODType) {
            Swal.fire({
                title: "Error",
                text: "Please do not apply filter 2 for download all the LODs.",
                icon: "error",
                confirmButtonColor: "#d33"
            });
            return;
        }

        const userData = await getLoggedUserId(); // Assign user ID

        setIsCreatingTask(true);
        try {
            const response = await Create_Task_For_Downloard_All_Digital_Signature_LOD_Cases(userData);
            if (response.status === 200) {
                Swal.fire({
                    title: 'Task created successfully!',
                    text: "Task ID: " + response.data.data.data.Task_Id,
                    icon: "success",
                    confirmButtonColor: "#28a745"
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Failed to create task.",
                    icon: "error",
                    confirmButtonColor: "#d33"
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.message || "Failed to create task.",
                icon: "error",
                confirmButtonColor: "#d33"
            });
        } finally {
            setIsCreatingTask(false);
        }
    };

    // Function to handle the change of document type (LOD or Final Reminder)
    const ChangeDocumentType = async () => {
        if (!activePopupLODID) {
            Swal.fire({
                text: "Error",
                title: "Please select a LOD or Final Reminder.",
                icon: "error",
                confirmButtonColor: "#d33"
            });
            return;
        }

        const userData = await getLoggedUserId(); // Assign user ID

        try {
            const intLODID = parseInt(activePopupLODID, 10); // converti and store string type LOD_ID as a int
            const response = await Change_Document_Type(intLODID, activePopupLODStatus, userData, changeReason);
            if (response === "success") {
                Swal.fire({
                    title: response,
                    text: `LOD Type changed successfully!`,
                    icon: "success",
                    confirmButtonColor: "#28a745"
                }).then((result) => {
                    if (result.isConfirmed) {
                        setLODData([]); // Clear previous data when LODType changes
                        setMaxCurrentPage(0); // Reset the current page
                        if (currentPage === 1) {
                            fetchData();
                        } else {
                            setCurrentPage(1); // Reset to the first page if LODType changes
                        }
                        fetchLODCounts(); // Refresh the counts after changing the document type
                    }
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.message || "Failed to changee the LOD Type.",
                icon: "error",
                confirmButtonColor: "#d33"
            });
        }
    };

    // Function to handle the creation of LOD or Final Reminder list
    const HandleCreateLODList = async () => {
        if (LODCount <= 0) {
            Swal.fire({
                title: "Warning",
                text: "Please enter LOD Count",
                icon: "warning",
                confirmButtonColor: "#f1c40f"
            });
            return;
        }

        const userData = await getLoggedUserId(); // Assign user ID

        try {
            const intLODCount = parseInt(LODCount, 10); // convert string variable into int variable
            const response = await Create_Task_for_Proceed_LOD_OR_Final_Reminder_List(userData, intLODCount, LODType);
            if (response.status === 200) {
                Swal.fire({
                    title: `Task created successfully!`,
                    text: "Task ID: " + response.data.data.data.Task_Id,
                    icon: "success",
                    confirmButtonColor: "#28a745"
                }).then((result) => {
                    if (result.isConfirmed) {
                        if (LODType === "LOD") {
                            navigate("/pages/LOD/LODLog"); // Redirect to task list page
                        } else if (LODType === "Final Reminder") {
                            navigate("/pages/LOD/FinalReminderList"); // Redirect to task list page
                        }
                    }
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.message || "Failed to create task.",
                icon: "error",
                confirmButtonColor: "#d33"
            });
        }
    };

    // display loading animation if data is loading
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Pagination logic
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedData = LODData.slice(startIndex, startIndex + rowsPerPage);

    // Handle search bar
    const filteredData = LODData.filter((row) =>
        Object.values(row)
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    // handle change document type pop up
    const handlePopup = (LODID, status) => {
        setActivePopupLODID(LODID);
        setActivePopupLODStatus(status);
        setChangeReason("");
    };

    const closePopup = () => {
        setActivePopupLODID(null);
    };

    // handle submit button
    const handleSubmitChange = () => {
        if (!changeReason.trim()) {
            Swal.fire({
                title: "Error",
                text: "Please enter a reason for the change.",
                icon: "error",
                confirmButtonColor: "#d33"
            });
            return;
        }

        ChangeDocumentType();
        closePopup();
    };

    // handle user input count for proceed final reminder list or lod list
    const handleInputCount = (value) => {
        if (value === "" || isNaN(value)) {
            setLODCount(0);
            return;
        }

        // assigning maximum possible count based on lod type
        const maxCount = LODType === "LOD" ? lodCount : finalReminderCount;

        if (parseInt(value, 10) <= maxCount) {
            setLODCount(value);
        } else {
            Swal.fire({
                title: "Invalid Input",
                text: `Value cannot exceed ${maxCount}.`,
                icon: "warning",
                confirmButtonColor: "#f1c40f"
            });
        }
    }

    // Function to navigate to the case ID page
    const naviCaseID = (caseId) => {
        navigate("/Incident/Case_Details", { state: { CaseID: caseId } });
    }

    return (
        <div className={GlobalStyle.fontPoppins}>
            <h2 className={GlobalStyle.headingLarge}>Pending Digital Signature LOD</h2>
            <div className="flex justify-center mt-6">
                <div className={`${GlobalStyle.miniCaseCountBar}`}>
                    <div className={GlobalStyle.miniCountBarSubTopicContainer}>
                        <div className={GlobalStyle.miniCountBarMainBox}>
                            <span>Total:</span>
                            <p className={GlobalStyle.miniCountBarMainTopic}>{totalCount}</p>
                        </div>
                        <div className={GlobalStyle.miniCountBarMainBox}>
                            <span>LOD:</span>
                            <p className={GlobalStyle.miniCountBarMainTopic}>{lodCount}</p>
                        </div>
                        <div className={GlobalStyle.miniCountBarMainBox}>
                            <span>Final Reminder:</span>
                            <p className={GlobalStyle.miniCountBarMainTopic}>{finalReminderCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {["admin", "superadmin", "slt"].includes(userRole) && !LODType && (
                <div className="flex justify-end mt-6">
                    <button
                        onClick={HandleCreateTaskAllLOD}
                        className={`${GlobalStyle.buttonPrimary} ${isCreatingTask ? 'opacity-50' : ''}`}
                        style={{ display: 'flex', alignItems: 'center' }}
                        disabled={isCreatingTask}
                    >
                        {!isCreatingTask && <FaDownload style={{ marginRight: '8px' }} />}
                        {isCreatingTask ? 'Creating Tasks...' : 'Create task and let me know'}
                    </button>
                </div>
            )}

            <div className="w-full mb-8 mt-8">
                <div className="flex items-center justify-center w-full space-x-6">
                    <h1><b>LOD Type</b></h1>
                    <select
                        value={LODType}
                        onChange={(e) => {
                            setLODType(e.target.value);
                        }}
                        className={GlobalStyle.selectBox}
                        style={{ color: LODType === "" ? "gray" : "black" }}
                    >
                        <option value="" hidden>LOD Type</option>
                        <option value="LOD" style={{ color: "black" }}>LOD</option>
                        <option value="Final Reminder" style={{ color: "black" }}>Final Reminder</option>
                    </select>
                </div>
            </div>

            <div className="mb-4 flex justify-start">
                <div className={GlobalStyle.searchBarContainer}>
                    <input
                        type="text"
                        placeholder=""
                        value={searchQuery}
                        onChange={(e) => {
                            setCurrentPage(1); // Reset to the first page on search
                            setSearchQuery(e.target.value);
                        }}
                        className={GlobalStyle.inputSearch}
                    />
                    <FaSearch className={GlobalStyle.searchBarIcon} />
                </div>
            </div>

            <div className={`${GlobalStyle.tableContainer} mt-10 overflow-x-auto`}>
                <table className={GlobalStyle.table}>
                    <thead className={GlobalStyle.thead}>
                        <tr>
                            <th className={GlobalStyle.tableHeader}>Case ID</th>
                            {/* <th className={GlobalStyle.tableHeader}>Status</th> */}
                            <th className={GlobalStyle.tableHeader}>Arrears Amount (LKR)</th>
                            <th className={GlobalStyle.tableHeader}>Customer Type Name</th>
                            <th className={GlobalStyle.tableHeader}>Account Manager Code</th>
                            <th className={GlobalStyle.tableHeader}>Source Type</th>
                            <th className={GlobalStyle.tableHeader}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.slice(startIndex, startIndex + rowsPerPage).map((log, index) => (
                                <tr
                                    key={index}
                                    className={`${index % 2 === 0
                                        ? "bg-white bg-opacity-75"
                                        : "bg-gray-50 bg-opacity-50"
                                        } border-b`}
                                >
                                    <td
                                        // className={GlobalStyle.tableData}
                                        className={`${GlobalStyle.tableData}  text-black hover:underline cursor-pointer`}
                                        onClick={() => naviCaseID(log.LODID)}
                                    >
                                        {log.LODID.toString().padStart(3, '0')}
                                    </td>
                                    <td className={GlobalStyle.tableCurrency}>{log.Amount}</td>
                                    <td className={GlobalStyle.tableData}>{log.CustomerTypeName}</td>
                                    <td className={GlobalStyle.tableData}>{log.AccountManagerCode}</td>
                                    <td className={GlobalStyle.tableData}>{log.SourceType}</td>
                                    <td className={`${GlobalStyle.tableData} flex justify-center`}>
                                        <button onClick={() => handlePopup(log.LODID, log.Status)}>
                                            <FaRetweet style={{ fontSize: '24px' }} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                    No data matching the criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {activePopupLODID && (
                    <div className={GlobalStyle.popupBoxContainer}>
                        <div className={GlobalStyle.popupBoxBody}>
                            <div className={GlobalStyle.popupBox}>
                                <h2 className={GlobalStyle.popupBoxTitle}>
                                    {activePopupLODStatus === "LOD" ? "Change to Final Reminder" : "Change to LOD"}
                                </h2>
                                <button
                                    className={GlobalStyle.popupBoxCloseButton}
                                    onClick={() => closePopup()}
                                >
                                    ×
                                </button>
                            </div>
                            <div>
                                <div className="mb-6">
                                    <label className={GlobalStyle.remarkTopic}>Change Reason</label>
                                    <textarea
                                        value={changeReason}
                                        onChange={(e) => setChangeReason(e.target.value)}
                                        className={`${GlobalStyle.remark} w-full`}
                                        rows="5"
                                    ></textarea>
                                </div>
                                <div className="flex justify-end mt-4">
                                    {["admin", "superadmin", "slt"].includes(userRole) && (
                                        <button
                                            onClick={handleSubmitChange}
                                            className={`${GlobalStyle.buttonPrimary} mr-4`}
                                        >
                                            Change
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {LODType && filteredData.length > 0 && (
                <div className={GlobalStyle.navButtonContainer}>
                    <button className={GlobalStyle.navButton} onClick={handlePrevPage} disabled={currentPage === 1}>
                        <FaArrowLeft />
                    </button>
                    <span className="text-gray-700">
                        Page {currentPage} of {searchQuery
                            ? Math.ceil(filteredData.length / rowsPerPage)
                            : maxTablePages}
                    </span>
                    <button
                        className={GlobalStyle.navButton}
                        onClick={handleNextPage}
                        disabled={searchQuery
                            ? currentPage >= Math.ceil(filteredData.length / rowsPerPage)
                            : currentPage >= maxTablePages}>
                        <FaArrowRight />
                    </button>
                </div>
            )}

            {LODType && (
                <div className="flex justify-between mt-6 space-x-4">
                    {["admin", "superadmin", "slt"].includes(userRole) && (
                        <button
                            onClick={HandleCreateTaskEachLOD}
                            className={`${GlobalStyle.buttonPrimary} ${isCreatingTask ? 'opacity-50' : ''}`}
                            // className={GlobalStyle.buttonPrimary}
                            disabled={isCreatingTask}
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            {!isCreatingTask && <FaDownload style={{ marginRight: '8px' }} />}
                            {isCreatingTask ? 'Creating Tasks...' : 'Create task and let me know'}
                            {/* Create task and let me know */}
                        </button>
                    )}
                    <div className="flex justify-end gap-4">
                        <input
                            type="number"
                            className={GlobalStyle.inputText}
                            value={LODCount}
                            onChange={(e) => handleInputCount(e.target.value)}
                        />
                        {["admin", "superadmin", "slt"].includes(userRole) && (
                            <button
                                className={GlobalStyle.buttonPrimary}
                                onClick={HandleCreateLODList}
                            >
                                {LODType === "LOD" ? "Create LOD List" : "Create Final Reminder List"}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );


};


export default Digital_Signature_LOD;