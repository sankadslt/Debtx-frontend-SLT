/*Purpose:
Created Date: 2025-04-02
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
import { getLoggedUserId } from "../../services/auth/authService.js";

const LOD_Creation = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const rowsPerPage = 8;
    const [LODType, setLODType] = useState("");
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // const [isCreatingTask, setIsCreatingTask] = useState(false);
    const [isFiltered, setIsFiltered] = useState(false);
    const navigate = useNavigate();
    const [activePopupLODID, setActivePopupLODID] = useState(null);
    const [activePopupLODStatus, setActivePopupLODStatus] = useState("");
    const [changeReason, setChangeReason] = useState("");

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "lod":
                return "/src/assets/images/Incidents/Incident_Open.png";
            case "finalreminder":
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

    const fetchDigitalSignatureLOD = async () => {
        try {
            // console.log("Sending filters:", filters);

            // Dummy data
            const dummyData = [
                {
                    LODID: "LOD001",
                    Status: "LOD",
                    Amount: "BRN12345",
                    CustomerTypeName: "Alpha",
                    AccountManagerCode: "1234567890",
                },
                {
                    LODID: "LOD002",
                    Status: "LOD",
                    Amount: "BRN12345",
                    CustomerTypeName: "Beta",
                    AccountManagerCode: "1234567890",
                },
                {
                    LODID: "LOD001",
                    Status: "FinalReminder",
                    Amount: "BRN12345",
                    CustomerTypeName: "Alpha",
                    AccountManagerCode: "1234567890",
                },
                {
                    LODID: "LOD001",
                    Status: "LOD",
                    Amount: "BRN12345",
                    CustomerTypeName: "Delta",
                    AccountManagerCode: "1234567890",
                },
                {
                    LODID: "LOD001",
                    Status: "FinalReminder",
                    Amount: "BRN12345",
                    CustomerTypeName: "Alpha",
                    AccountManagerCode: "1234567890",
                },
            ];

            // Simulating API response based on filters
            const filteredData = dummyData

            console.log("Response:", { status: "success", LODs: filteredData });

            return filteredData.map((LOD) => ({
                LODID: LOD.LODID,
                Status: LOD.Status,
                Amount: LOD.Amount,
                CustomerTypeName: LOD.CustomerTypeName,
                AccountManagerCode: LOD.AccountManagerCode,
            }));
        } catch (error) {
            console.error("Detailed error:", { message: error.message });
            throw "An error occurred while fetching data";
        }
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const LODs = await fetchDigitalSignatureLOD();
            setData(LODs);
            setIsFiltered(LODs.length > 0);
        } catch (error) {
            setIsFiltered(false);
            Swal.fire("Error", error.message || "No LOD is matching the criteria.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    // const handleFilter = async () => {
    //     try {
    //         const filters = {
    //             Status: LODType,
    //         };
    //         await fetchData(filters);
    //     } catch (error) {
    //         Swal.fire("Error", error.message || "No LOD is matching the criteria", "error");
    //     }
    // };

    // useEffect(() => {
    //     handleFilter();
    // }, [LODType]);


    // const HandleCreateTask = async () => {

    //     if (!isFiltered) {
    //         Swal.fire("Error", "Please apply filters that return data before creating a task.", "error");
    //         return;
    //     }

    //     const adjustToLocalISO = (date) => {
    //         const offset = date.getTimezoneOffset() * 60000;
    //         return new Date(date.getTime() - offset).toISOString();
    //     };
    //     const user_id = await getLoggedUserId();
    //     const requestData = {
    //         LOD_Action: LODType,
    //         Incident_Status: status2,
    //         Source_Type: status3,
    //         From_Date: adjustToLocalISO(fromDate),
    //         To_Date: adjustToLocalISO(toDate),
    //         Created_By: user_id
    //     };

    //     setIsCreatingTask(true);
    //     try {
    //         const response = await Task_for_Download_LODs(requestData);
    //         Swal.fire("Success", `Task created successfully! Task ID: ${response.Task_Id}`, "success");
    //     } catch (error) {
    //         Swal.fire("Error", error.message || "Failed to create task.", "error");
    //     } finally {
    //         setIsCreatingTask(false);
    //     }
    // };

    useEffect(() => {
        fetchData({});
    }, []);

    // const HandleAddIncident = () => navigate("/incident/register");

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
        String(row.AccountManagerCode).toLowerCase().includes(searchQuery.toLowerCase())
    );

    const pages = Math.ceil(filteredData.length / rowsPerPage);
    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < pages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    // const handlePopup = (LODID, status) => {
    //     setActivePopupLODID(LODID);
    //     setActivePopupLODStatus(status);
    //     setChangeReason("");
    // };

    // const closePopup = () => {
    //     setActivePopupLODID(null);
    // };

    // const handleSubmitChange = () => {
    //     if (!changeReason.trim()) {
    //         Swal.fire("Error", "Please enter a reason for the change.", "error");
    //         return;
    //     }

    //     console.log("Submitting change:", {
    //         LODID: activePopupLODID,
    //         NewStatus: activePopupLODStatus === "LOD" ? "FinalReminder" : "LOD",
    //         Reason: changeReason
    //     });

    //     // Here, you could call an API function to save the change.

    //     // Close popup after submission
    //     closePopup();
    // };


    return (
        <div className={GlobalStyle.fontPoppins}>
            <h2 className={GlobalStyle.headingLarge}>LOD</h2>

            {/* <div className="flex justify-end mt-6">
                <button onClick={HandleAddIncident} className={GlobalStyle.buttonPrimary}>
                    Add Incident
                </button>
            </div> */}

            <div className="flex justify-end mt-6">
                {/* <div className="flex">
                    <span className={GlobalStyle.miniCountBarTopic}>Mini Case count</span>
                </div> */}
                <div className={GlobalStyle.miniCountBarSubTopicContainer}>
                    <div className={GlobalStyle.miniCountBarMainBox}>
                        <span>LOD:</span>
                        <p className={GlobalStyle.miniCountBarMainTopic}>100</p>
                    </div>
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
                            <th className={GlobalStyle.tableHeader}>Account No</th>
                            <th className={GlobalStyle.tableHeader}>Amount</th>
                            <th className={GlobalStyle.tableHeader}>Source Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((log, index) => (
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
            </div>

            <div className={GlobalStyle.navButtonContainer}>
                <button className={GlobalStyle.navButton} onClick={handlePrevPage} disabled={currentPage === 0}>
                    <FaArrowLeft />
                </button>
                <span className="text-gray-700">
                    Page {currentPage + 1} of {pages}
                </span>
                <button className={GlobalStyle.navButton} onClick={handleNextPage} disabled={currentPage === pages - 1}>
                    <FaArrowRight />
                </button>
            </div>

            <div className="flex justify-end gap-4">
                <input
                    type="text"
                    placeholder="Text here"
                    className={GlobalStyle.inputText}
                />
                <button className={GlobalStyle.buttonPrimary}>
                    Create LOD List
                </button>
            </div>
        </div>
    );


};


export default LOD_Creation;