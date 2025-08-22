import { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaSearch, FaArrowLeft, FaArrowRight, FaDownload } from "react-icons/fa";
import Swal from "sweetalert2";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";
import { Tooltip } from "react-tooltip";
import { listAllWriteOffCases } from '../../services/Abnormal/AbnormalServices';
import Write_Off from "/src/assets/images/Stop/Write-Off.png";
import Pending_Write_Off from "/src/assets/images/Stop/Pending Write-Off.png";

const Write_Off_Log = () => {
    // State Variables
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [accountNo, setAccountNo] = useState("");
    const [writOffStatus, setWritOffStatus] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreatingTask, setIsCreatingTask] = useState(false);
    const [userRole, setUserRole] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [maxCurrentPage, setMaxCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true);
    const rowsPerPage = 10;
    const navigate = useNavigate();

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    const hasMounted = useRef(false);

    const [committedFilters, setCommittedFilters] = useState({
        accountNo: "",
        writOffStatus: "",
        fromDate: null,
        toDate: null,
    });

    // Role-Based Access
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

    const getStatusIcon = (status) => {
        switch (status) {
            case "Write-Off":
                return Write_Off;
            case "Pending Write-Off":
                return Pending_Write_Off;
        }
    }

    const renderStatusIcon = (status, index) => {
        const iconPath = getStatusIcon(status);

        if (!iconPath) {
            return <span>{status}</span>;
        }

        const tooltipId = `tooltip-${status.replace(/\s+/g, "-")}-${index}`;

        return (
            <div className="flex items-center gap-2">
                <img
                    src={iconPath}
                    alt={status}
                    className="w-6 h-6"
                    data-tooltip-id={tooltipId}
                />
                <Tooltip id={tooltipId} place="bottom" effect="solid">
                    {status}
                </Tooltip>
            </div>
        );
    };

    const handlestartdatechange = (date) => {
        setFromDate(date);

    };

    const handleenddatechange = (date) => {
        setToDate(date);

    };

    useEffect(() => {
        if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
            Swal.fire({
                title: "Warning",
                text: "To date should be greater than or equal to From date",
                icon: "warning",
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonColor: "#f1c40f"
            });
            setToDate(null);
            setFromDate(null);
            return;
        }
    }, [fromDate, toDate]);

    const filteredDataBySearch = filteredData.filter((row) =>
        Object.values(row)
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const filterValidations = () => {
        if (!accountNo && !writOffStatus && !fromDate && !toDate) {
            Swal.fire({
                title: "Warning",
                text: "No filter is selected. Please, select a filter.",
                icon: "warning",
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonColor: "#f1c40f"
            });
            setToDate(null);
            setFromDate(null);
            return false;
        }

        if ((fromDate && !toDate) || (!fromDate && toDate)) {
            Swal.fire({
                title: "Warning",
                text: "Both From Date and To Date must be selected.",
                icon: "warning",
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonColor: "#f1c40f"
            });
            setToDate(null);
            setFromDate(null);
            return false;
        }
        return true;
    };

    const callAPI = async (filters) => {
        try {
            console.log(currentPage);

            const payload = {
                accountNumber: filters.accountNo,
                status: filters.writOffStatus,
                fromDate: filters.fromDate,
                toDate: filters.toDate,
                page: filters.page,
            };

            setIsLoading(true);
            const response = await listAllWriteOffCases(payload);
            setIsLoading(false);

            if (response) {

                if (response.status === 200 && response.data && response.data.data && response.data.data.length > 0) {
                    if (currentPage === 1) {
                        setFilteredData(response.data.data)
                    } else {
                        setFilteredData((prevData) => [...prevData, ...response.data.data]);
                    }
                }

                if (response.status === 204) {
                    setIsMoreDataAvailable(false);
                    if (currentPage === 1) {
                        Swal.fire({
                            title: "No Results",
                            text: "No matching data found for the selected filters.",
                            icon: "warning",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            confirmButtonColor: "#f1c40f"
                        });
                    } else if (currentPage === 2) {
                        setCurrentPage(1);
                    }
                } else {
                    const maxData = currentPage === 1 ? 10 : 30;
                    if (response.data.data.length < maxData) {
                        setIsMoreDataAvailable(false);
                    }
                }

            } else {
                Swal.fire({
                    title: "Error",
                    text: "No valid case data found in response.",
                    icon: "error",
                    confirmButtonColor: "#d33"
                });
                setFilteredData([]);
            }

        } catch (error) {
            console.error("Error filtering cases:", error);
            Swal.fire({
                title: "Error",
                text: "Failed to fetch filtered data. Please try again.",
                icon: "error",
                confirmButtonColor: "#d33"
            });
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (isMoreDataAvailable && currentPage > maxCurrentPage) {
            setMaxCurrentPage(currentPage);

            callAPI({
                ...committedFilters,
                page: currentPage
            });
        }
    }, [currentPage]);

    // Handle Pagination
    const handlePrevNext = (direction) => {
        if (direction === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
            // console.log("Current Page:", currentPage);
        } else if (direction === "next") {
            if (isMoreDataAvailable) {
                setCurrentPage(currentPage + 1);
            } else {
                if (currentPage < Math.ceil(filteredData.length / rowsPerPage)) {
                    setCurrentPage(currentPage + 1);
                }
            }

        }
    };

    const handleFilterButton = () => {
        setIsMoreDataAvailable(true);
        setTotalPages(0);
        setMaxCurrentPage(0);
        const isValid = filterValidations();
        if (!isValid) {
            return;
        } else {
            setCommittedFilters({
                accountNo,
                writOffStatus,
                fromDate,
                toDate
            });
            setFilteredData([]);

            if (currentPage === 1) {
                callAPI({
                    accountNo,
                    writOffStatus,
                    fromDate,
                    toDate,
                    page: 1
                });
            } else {
                setCurrentPage(1);
            }
        }
    };

    const handleClearButton = () => {
        setAccountNo("");
        setWritOffStatus("")
        setFromDate(null);
        setToDate(null);
        setSearchQuery("");
        setTotalPages(0);
        setFilteredData([]);
        setMaxCurrentPage(0);
        setIsMoreDataAvailable(true);
        setCommittedFilters({
            accountNo: "",
            writOffStatus: "",
            fromDate: null,
            toDate: null
        });
        if (currentPage != 1) {
            setCurrentPage(1);
        } else {
            setCurrentPage(0);
            setTimeout(() => setCurrentPage(1), 0);
        }
    };

    const HandleCreateTaskDownloadWriteOff = () => {
        // if (!fromDate || !toDate) {
        //     Swal.fire({
        //         title: "Warning",
        //         text: "Please select From Date and To Date.",
        //         icon: "warning",
        //         allowOutsideClick: false,
        //         allowEscapeKey: false,
        //         confirmButtonColor: "#f1c40f"
        //     });
        //     return;
        // }
        // setIsCreatingTask(true);

        // try {
        //     const userData = await getLoggedUserId();
        //     const response = await Create_Task_for_Download_Write_Off_Cases(
        //         accountNo,
        //         writOffStatus,
        //         fromDate,
        //         toDate,
        //         userData
        //     );
        //     if (response?.message === "Task created successfully") {
        //         Swal.fire({
        //             title: "Success",
        //             text: "Task created successfully!",
        //             icon: "success",
        //             confirmButtonColor: "#28a745",
        //         });
        //     }
        // } catch (error) {
        //     Swal.fire({
        //         title: "Error",
        //         text: error.message || "Failed to create task.",
        //         icon: "error",
        //         confirmButtonColor: "#d33"
        //     });
        // } finally {
        //     setIsCreatingTask(false);
        // }        
    };

    // useEffect(() => {
    //     setAccountNo("");
    //     setCaseId("");
    // }, [searchBy]);

    // display loading animation when data is loading
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
            <div className="flex flex-col flex-1">
                <main className="p-6">
                    <h1 className={GlobalStyle.headingLarge}>Write-Off Case List</h1>

                    {/* Filters Section */}
                    <div className={`${GlobalStyle.cardContainer} w-full mt-6`}>
                        <div className="flex flex-wrap items-center justify-end w-full gap-3">

                            <div className="flex items-center">
                                <input
                                    type="text"
                                    value={accountNo}
                                    onChange={(e) => setAccountNo(e.target.value)}
                                    placeholder="Account Number"
                                    className={`${GlobalStyle.inputText} w-full sm:w-auto`}
                                    style={{ minWidth: "150px" }}
                                />
                            </div>

                            <div className="flex items-center">

                            </div>

                            <div className="flex items-center">
                                <select
                                    value={writOffStatus}
                                    onChange={(e) => setWritOffStatus(e.target.value)}
                                    className={`${GlobalStyle.selectBox}`}
                                    style={{ color: writOffStatus === "" ? "gray" : "black" }}
                                >
                                    <option value="" hidden>Status</option>
                                    <option value="Ready for Write-Off" style={{ color: "black" }}>Ready for Write-Off</option>
                                    <option value="Pending Write-Off" style={{ color: "black" }}>Pending Write-Off</option>
                                    <option value="Write-Off" style={{ color: "black" }}>Write-Off</option>
                                </select>
                            </div>

                            <label className={GlobalStyle.dataPickerDate}>Date</label>

                            <DatePicker
                                selected={fromDate}
                                onChange={handlestartdatechange}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="From"
                                className={`${GlobalStyle.inputText} w-full sm:w-auto`}
                            />

                            <DatePicker
                                selected={toDate}
                                onChange={handleenddatechange}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="To"
                                className={`${GlobalStyle.inputText} w-full sm:w-auto`}
                            />


                            {["admin", "superadmin", "slt"].includes(userRole) && (
                                <button
                                    className={`${GlobalStyle.buttonPrimary}  w-full sm:w-auto`}
                                    onClick={handleFilterButton}
                                >
                                    Filter
                                </button>
                            )}
                            {["admin", "superadmin", "slt"].includes(userRole) && (
                                <button
                                    className={`${GlobalStyle.buttonRemove}  w-full sm:w-auto`}
                                    onClick={handleClearButton}
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-4 flex justify-start mt-10">
                        <div className={GlobalStyle.searchBarContainer}>
                            <input
                                type="text"
                                className={GlobalStyle.inputSearch}
                                value={searchQuery}
                                onChange={(e) => {
                                    setCurrentPage(1); // Reset to page 1 on search
                                    setSearchQuery(e.target.value)
                                }}
                            />
                            <FaSearch className={GlobalStyle.searchBarIcon} />
                        </div>
                    </div>

                    {/* Table */}
                    <div className={`${GlobalStyle.tableContainer} mt-10 overflow-x-auto`}>
                        <table className={GlobalStyle.table}>
                            <thead className={GlobalStyle.thead}>
                                <tr>
                                    <th className={GlobalStyle.tableHeader}>Case ID</th>
                                    <th className={GlobalStyle.tableHeader}>Status</th>
                                    <th className={GlobalStyle.tableHeader}>Account No</th>
                                    <th className={GlobalStyle.tableHeader}>Customer Ref</th>
                                    <th className={GlobalStyle.tableHeader}>Amount</th>
                                    <th className={GlobalStyle.tableHeader}>Customer Segment</th>
                                    <th className={GlobalStyle.tableHeader}>Phase</th>
                                    <th className={GlobalStyle.tableHeader}>Write Off On</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredDataBySearch && filteredDataBySearch.length > 0 ? (
                                    filteredDataBySearch.slice(startIndex, endIndex).map((item, index) => (
                                        <tr
                                            key={index}
                                            className={
                                                index % 2 === 0
                                                    ? GlobalStyle.tableRowEven
                                                    : GlobalStyle.tableRowOdd
                                            }
                                        >
                                            {/* <td
                                                className={`${GlobalStyle.tableData} text-black hover:underline cursor-pointer`}
                                                onClick={() => naviCaseID(item.case_id)}
                                            > */}
                                            {/* {item.case_id || ""}
                                            </td> */}
                                            <td className={GlobalStyle.tableData}>{item.caseId || ""}</td>
                                            <td className={`${GlobalStyle.tableData} flex items-center justify-center`}>
                                                {renderStatusIcon(item.status || "", index)}
                                            </td>
                                            <td className={GlobalStyle.tableData}> {item.accountNo || ""} </td>
                                            <td className={GlobalStyle.tableData}>{item.customerRef || ""}</td>
                                            <td className={GlobalStyle.tableCurrency}>{typeof item.amount === 'number'
                                                ? item.amount.toLocaleString("en-LK", {
                                                    style: "currency",
                                                    currency: "LKR",
                                                })
                                                : ""}</td>
                                            <td className={GlobalStyle.tableData}>{item.customerSegment || ""}</td>
                                            {/* <td className={GlobalStyle.tableData}>{item.phase || ""}</td> */}
                                            {/* <td className={GlobalStyle.tableData}>{item.writeOffOn ? new Date(item.writeOffOn).toLocaleDateString("en-GB") : ""}</td> */}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={9} className={`${GlobalStyle.tableData} text-center`}>No cases available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Section */}
                    {filteredDataBySearch.length > 0 && (<div className={GlobalStyle.navButtonContainer}>
                        <button
                            onClick={() => handlePrevNext("prev")}
                            disabled={currentPage <= 1}
                            className={`${GlobalStyle.navButton} ${currentPage <= 1 ? "cursor-not-allowed" : ""}`}
                        >
                            <FaArrowLeft />
                        </button>
                        <span className={`${GlobalStyle.pageIndicator} mx-4`}>
                            Page {currentPage}
                        </span>
                        <button
                            onClick={() => handlePrevNext("next")}
                            disabled={
                                searchQuery
                                    ? currentPage >= Math.ceil(filteredDataBySearch.length / rowsPerPage)
                                    : !isMoreDataAvailable && currentPage >= Math.ceil(filteredData.length / rowsPerPage
                                    )}
                            className={`${GlobalStyle.navButton} ${(searchQuery
                                ? currentPage >= Math.ceil(filteredDataBySearch.length / rowsPerPage)
                                : !isMoreDataAvailable && currentPage >= Math.ceil(filteredData.length / rowsPerPage))
                                ? "cursor-not-allowed"
                                : ""
                                }`}
                        >
                            <FaArrowRight />
                        </button>
                    </div>)}

                    {/* Create task button */}
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={HandleCreateTaskDownloadWriteOff}
                            className={`${GlobalStyle.buttonPrimary} ${isCreatingTask ? 'opacity-50' : ''}`}
                            disabled={isCreatingTask}
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            {!isCreatingTask && <FaDownload style={{ marginRight: '8px' }} />}
                            {isCreatingTask ? 'Creating Tasks...' : 'Create task and let me know'}
                        </button>
                    </div>

                    {/* {["admin", "superadmin", "slt"].includes(userRole) && filteredDataBySearch.length > 0 && (
            <button
              onClick={HandleCreateTaskDownloadWriteOff}
              className={`${GlobalStyle.buttonPrimary} ${isCreatingTask ? 'opacity-50' : ''}`}
              disabled={isCreatingTask}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              {!isCreatingTask && <FaDownload style={{ marginRight: '8px' }} />}
              {isCreatingTask ? 'Creating Tasks...' : 'Create task and let me know'}
            </button>
          )} */}


                </main>
            </div>
        </div>

    );

};

export default Write_Off_Log;