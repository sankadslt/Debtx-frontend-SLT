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
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
// import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
// import { fetchLODs } from "../../services/LODs/LODservice.js";
// import { Task_for_Download_LODs } from "../../services/task/taskService.js";
// import { getLoggedUserId } from "../../services/auth/authService.js";
import { fetchCaseCounts } from "../../services/LOD/LOD.js";
import { fetchF2SelectionCases } from "../../services/LOD/LOD.js";
import { getUserData } from "../../services/auth/authService.js";
import { Create_Task_For_Downloard_All_Digital_Signature_LOD_Cases } from "../../services/LOD/LOD.js";
import { Create_Task_For_Downloard_Each_Digital_Signature_LOD_Cases } from "../../services/LOD/LOD.js";
import { Change_Document_Type } from "../../services/LOD/LOD.js";
import { Create_LOD_List } from "../../services/LOD/LOD.js";

const Digital_Signature_LOD = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const rowsPerPage = 8;
    const [LODType, setLODType] = useState("");
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreatingTask, setIsCreatingTask] = useState(false);
    const [isFiltered, setIsFiltered] = useState(false);
    const navigate = useNavigate();
    const [activePopupLODID, setActivePopupLODID] = useState(null);
    const [activePopupLODStatus, setActivePopupLODStatus] = useState("");
    const [changeReason, setChangeReason] = useState("");
    const [LODCount, setLODCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [lodCount, setlodCount] = useState(0);
    const [finalReminderCount, setFinalReminderCount] = useState(0);

    // const displayUserData = async () => {
    //     try {
    //         const userData = await getUserData();
    //         console.log("User Data:", userData.username); // Log the user data to the console
    //     } catch (error) {
    //         console.error("Error fetching user data:", error.message || error);
    //     }
    // };

    // useEffect(() => {
    //     displayUserData();
    // }, [])

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "lod":
                return "/src/assets/images/Incidents/Incident_Open.png";
            case "final reminder":
                return "/src/assets/images/Incidents/Incident_Reject.png";
            default:
                return null;
        }
    };

    const renderStatusIcon = (status) => {
        const iconPath = getStatusIcon(status);

        if (!iconPath) {
            return <span>{status}</span>;
        }

        return (
            <img
                src={iconPath}
                alt={status}
                className="w-6 h-6"
                title={status}
            />
        );
    };

    const fetchLODCounts = async () => {
        try {
            const { totalCount, lodCount, finalReminderCount } = await fetchCaseCounts();
            setTotalCount(totalCount);
            setlodCount(lodCount);
            setFinalReminderCount(finalReminderCount);
        } catch (error) {
            console.error("Error fetching LOD counts:", error.message);
            Swal.fire("Error", "Failed to fetch LOD counts.", "error");
        }
    }

    useEffect(() => {
        fetchLODCounts();
    }, []);


    const fetchData = async (LODType, currentPage) => {
        setIsLoading(true);
        try {
            const LODs = await fetchF2SelectionCases(LODType, currentPage + 1);
            setData(LODs);
            setIsFiltered(LODs.length > 0);
        } catch (error) {
            setIsFiltered(false);
            Swal.fire("Error", error.message || "No LOD is matching the criteria.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (LODType.trim()) { // Check if LODType is not empty or just whitespace
            fetchData(LODType, currentPage);
        } else {
            setData([]); // Clear data if LODType is empty
        }
    }, [LODType, currentPage]);

    const HandleCreateTaskEachLOD = async () => {
        if (!LODType) {
            Swal.fire("Error", "Please apply filter 2 befor download.", "error");
            return;
        }

        const userData = await getUserData();

        setIsCreatingTask(true);
        try {
            const response = await Create_Task_For_Downloard_Each_Digital_Signature_LOD_Cases(userData.username, LODType);
            console.log("Task created successfully:", response);
            Swal.fire("Success", `Task created successfully!`, "success");
        } catch (error) {
            Swal.fire("Error", error.message || "Failed to create task.", "error");
        } finally {
            setIsCreatingTask(false);
        }
    };

    const HandleCreateTaskAllLOD = async () => {
        if (LODType) {
            Swal.fire("Error", "Please do not apply filter 2 for download all the LODs.", "error");
            return;
        }

        const userData = await getUserData();

        setIsCreatingTask(true);
        try {
            const response = await Create_Task_For_Downloard_All_Digital_Signature_LOD_Cases(userData.username);
            console.log("Task created successfully:", response);
            Swal.fire("Success", `Task created successfully!`, "success");
        } catch (error) {
            Swal.fire("Error", error.message || "Failed to create task.", "error");
        } finally {
            setIsCreatingTask(false);
        }
    };

    const ChangeDocumentType = async () => {
        if (!activePopupLODID) {
            Swal.fire("Error", "Please select a LOD or Final Reminder.", "error");
            return;
        }

        const userData = await getUserData();

        try {
            const response = await Change_Document_Type(userData.username, activePopupLODID, activePopupLODStatus, changeReason);
            console.log("LOD Type changed successfully:", response);
            Swal.fire("Success", `LOD Type changed successfully!`, "success");
        } catch (error) {
            Swal.fire("Error", error.message || "Failed to changee the LOD Type.", "error");
        } 
    };

    const HandleCreateLODList = async () => {
        if (LODCount <= 0) {
            Swal.fire("Error", "Please enter LOD Count", "error");
            return;
        }

        const userData = await getUserData();

        setIsCreatingTask(true);
        try {
            const response = await Create_LOD_List(userData.username, LODCount, LODType);
            console.log("Task created successfully:", response);
            Swal.fire("Success", `Task created successfully!`, "success");
        } catch (error) {
            Swal.fire("Error", error.message || "Failed to create task.", "error");
        } finally {
            setIsCreatingTask(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const filteredData = data.filter((row) =>
        String(row.LODID).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(row.Status).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(row.Amount).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(row.CustomerTypeName).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(row.AccountManagerCode).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(row.SourceType).toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const handlePopup = (LODID, status) => {
        setActivePopupLODID(LODID);
        setActivePopupLODStatus(status);
        setChangeReason("");
    };

    const closePopup = () => {
        setActivePopupLODID(null);
    };

    const handleSubmitChange = () => {
        if (!changeReason.trim()) {
            Swal.fire("Error", "Please enter a reason for the change.", "error");
            return;
        }

        console.log("Submitting change:", {
            LODID: activePopupLODID,
            NewStatus: activePopupLODStatus === "LOD" ? "FinalReminder" : "LOD",
            Reason: changeReason
        });
        ChangeDocumentType();
        closePopup();
    };

    const handleInputCount = (value) => {
        setLODCount(value);
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

            {!LODType && (
                <div className="flex justify-end mt-6">
                    <button
                        onClick={HandleCreateTaskAllLOD}
                        className={`${GlobalStyle.buttonPrimary} ${isCreatingTask ? 'opacity-50' : ''}`}
                        disabled={isCreatingTask}
                    >
                        {/* {isCreatingTask ? 'Creating Tasks...' : 'Create task and let me know'} */}
                        Create task and let me know
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
                    >
                        <option value="">LOD Type</option>
                        {/* <option value="All">All</option> */}
                        <option value="LOD">LOD</option>
                        <option value="Final Reminder">Final Reminder</option>
                    </select>
                </div>
            </div>

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
                            <th className={GlobalStyle.tableHeader}>Case ID</th>
                            <th className={GlobalStyle.tableHeader}>Status</th>
                            <th className={GlobalStyle.tableHeader}>Amount</th>
                            <th className={GlobalStyle.tableHeader}>Customer Type Name</th>
                            <th className={GlobalStyle.tableHeader}>Account Manager Code</th>
                            <th className={GlobalStyle.tableHeader}>Source Type</th>
                            <th className={GlobalStyle.tableHeader}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((log, index) => (
                                <tr
                                    key={index}
                                    className={`${index % 2 === 0
                                        ? "bg-white bg-opacity-75"
                                        : "bg-gray-50 bg-opacity-50"
                                        } border-b`}
                                >
                                    <td className={GlobalStyle.tableData}>{log.LODID}</td>
                                    <td className={`${GlobalStyle.tableData} flex justify-center mt-2`}>
                                        {renderStatusIcon(log.Status)}
                                    </td>
                                    <td className={GlobalStyle.tableData}>{log.Amount}</td>
                                    <td className={GlobalStyle.tableData}>{log.CustomerTypeName}</td>
                                    <td className={GlobalStyle.tableData}>{log.AccountManagerCode}</td>
                                    <td className={GlobalStyle.tableData}>{log.SourceType}</td>
                                    <td className={GlobalStyle.tableData}>
                                        <button onClick={() => handlePopup(log.LODID, log.Status)}>
                                            <img
                                                src="/src/assets/images/amend.png"
                                                className="w-8 h-8"
                                            />
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
                                    <button
                                        onClick={handleSubmitChange}
                                        className={`${GlobalStyle.buttonPrimary} mr-4`}
                                    >
                                        Change
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className={GlobalStyle.navButtonContainer}>
                <button className={GlobalStyle.navButton} onClick={handlePrevPage} disabled={currentPage === 0}>
                    <FaArrowLeft />
                </button>
                <span className="text-gray-700">
                    Page {currentPage + 1}
                </span>
                <button className={GlobalStyle.navButton} onClick={handleNextPage}>
                    <FaArrowRight />
                </button>
            </div>

            {LODType && (
                <div className="flex justify-between mt-6 space-x-4">
                    <button
                        onClick={HandleCreateTaskEachLOD}
                        className={`${GlobalStyle.buttonPrimary} ${isCreatingTask ? 'opacity-50' : ''}`}
                        // className={GlobalStyle.buttonPrimary}
                        disabled={isCreatingTask}
                    >
                        {/* {isCreatingTask ? 'Creating Tasks...' : 'Create task and let me know'} */}
                        Create task and let me know
                    </button>
                    <div className="flex justify-end gap-4">
                        <input
                            type="text"
                            placeholder="Text here"
                            className={GlobalStyle.inputText}
                            value={LODCount}
                            onChange={(e) => handleInputCount(e.target.value)}
                        />
                        <button
                            className={GlobalStyle.buttonPrimary}
                            // onClick={HandleCreateLODList}
                        >
                            Create LOD List
                        </button>
                    </div>
                </div>
            )}
        </div>
    );


};


export default Digital_Signature_LOD;