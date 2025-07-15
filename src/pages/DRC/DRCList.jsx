import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Swal from "sweetalert2";
import moreImg from "../../assets/images/more.svg";
import ListImg from "../../assets/images/ConfigurationImg/list.png";
import pendingIcon from "../../assets/images/ConfigurationImg/checklist.png";
import activeIcon from "../../assets/images/ConfigurationImg/Active.png";
import inactiveIcon from "../../assets/images/ConfigurationImg/Inactive.png";
import terminatedIcon from "../../assets/images/ConfigurationImg/Terminate.png";
import agreementIcon from "../../assets/images/ConfigurationImg/Agreement_Details.png";
import { listAllDRCDetails } from "../../services/drc/Drc";
import { Tooltip } from "react-tooltip";

const DRCList = () => {
    // State Variables
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [allData, setAllData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const navigate = useNavigate();

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [maxCurrentPage, setMaxCurrentPage] = useState(0);
    const rowsPerPage = 10;

    // Variables for table
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    const hasMounted = useRef(false);
    const [committedFilters, setCommittedFilters] = useState({
        status: ""
    });

    // Status icons 
   const getStatusIcon = (status) => {
    const statusStr = String(status || '').toLowerCase();
    
    switch (statusStr) {
        case "active":
            return activeIcon;
        case "inactive":
            return inactiveIcon;
        case "terminate":
            return terminatedIcon;
        case "pending":
            return pendingIcon;
        default:
            return null;
    }
};

    const renderStatusIcon = (status) => {
        if (status === undefined || status === null) {
            return <span className="capitalize">Unknown</span>;
        }

        const iconPath = getStatusIcon(status);

        if (!iconPath) {
            return <span className="capitalize">{String(status)}</span>;
        }

        return (
            <img
                src={iconPath}
                alt={String(status)}
                className="w-6 h-6 mx-auto"
                data-tooltip-id={`status-tooltip-${status}`}
                data-tooltip-content={status}
                //title={status}
            />
        );
    };

   
const callAPI = useCallback(async (filters) => {
  try {
    setIsLoading(true);
    const response = await listAllDRCDetails({
      status: filters.status || "",
      page: filters.page || 1
    });

    // Process the data
    const drcData = response?.data?.map(drc => ({
      DRCID: drc.drc_id,
      Status: drc.status,
      BusinessRegNo: drc.drc_business_registration_number,
      DRCName: drc.drc_name,
      ContactNo: drc.drc_contact_no,
      ServiceCount: drc.service_count,
      ROCount: drc.ro_count,
      BillingCenterCount: drc.rtom_count
    })) || [];

    // Update state
    if (filters.page === 1) {
      setAllData(drcData);
      setFilteredData(drcData);
      
      // Show message if no data found
      if (drcData.length === 0) {
        if (filters.status) {
          showNoDataMessage(filters.status);
        } else if (response?.message) {
          showNoDataMessage();
        }
      }
    } else {
      setFilteredData(prev => [...prev, ...drcData]);
    }

   
    setHasMoreData(drcData.length === (filters.page === 1 ? 10 : 30));
    
  } catch (error) {
    console.error("Error fetching DRC list:", error);
    Swal.fire({
      title: "Error",
      text: error.message,
      icon: "error",
      confirmButtonColor: "#d33"
    });
    setFilteredData([]);
    setHasMoreData(false);
  } finally {
    setIsLoading(false);
  }
}, []);

// Update the showNoDataMessage function
const showNoDataMessage = (status = "") => {
  let message = "No DRCs available";
  if (status) {
    message = `No ${status} DRCs found`;
    if (status === "Terminate") {
      message = "No Terminated DRCs found";
    }
  }

  Swal.fire({
    title: "No Records Found",
    text: message,
    icon: "info",
    iconColor:"#ff9999",
    confirmButtonColor: "#ff9999",
    allowOutsideClick: false,
    allowEscapeKey: false
  });
};


    // Handle pagination
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (hasMoreData || currentPage < Math.ceil(filteredData.length / rowsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Handle filter button 
    const handleFilterButton = () => {
        if (!statusFilter) {
            // If no status selected, just refresh the data
            setCurrentPage(1);
            callAPI({ status: "", page: 1 });
            return;
        }

        setHasMoreData(true);
        setMaxCurrentPage(0);
        setCommittedFilters({ status: statusFilter });
        setFilteredData([]);
        
        if (currentPage === 1) {
            callAPI({ 
                status: statusFilter, 
                page: 1 
            });
        } else {
            setCurrentPage(1);
        }
    };

    // Handle clear 
    const handleClear = () => {
        setStatusFilter("");
        setSearchQuery("");
        setMaxCurrentPage(0);
        setCommittedFilters({ status: "" });
        
        if (currentPage !== 1) {
            setCurrentPage(1);
        } else {
            callAPI({ status: "", page: 1 });
        }
    };

    // Navigation 
    const handleAddDRC = () => navigate("/pages/DRC/Add_DRC");
    const navigateToDRCInfo = (drcId) => navigate(`/pages/DRC/DRCInfo`, { state: { drcId } });

    // Effect for API calls
    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            callAPI({ status: "", page: 1 });
            return;
        }

        if (hasMoreData && currentPage > maxCurrentPage) {
            setMaxCurrentPage(currentPage);
            callAPI({
                ...committedFilters,
                page: currentPage
            });
        }
    }, [currentPage, committedFilters, callAPI, hasMoreData, maxCurrentPage]);

    // Filter data (search query) 
    const filteredDataBySearch = filteredData.filter((row) =>
        Object.values(row)
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    // Loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className={GlobalStyle.fontPoppins}>
            <h2 className={GlobalStyle.headingLarge}>DRC List</h2>

            <div className="flex justify-end mt-2 sm:mt-0">
                <button 
                    className={GlobalStyle.buttonPrimary} 
                    onClick={handleAddDRC}
                >
                    Add
                </button>
            </div>

            <div className="w-full mb-2 mt-4">
                <div className="flex justify-between items-center w-full mb-2">
                    <div className={GlobalStyle.searchBarContainer}>
                        <input
                            type="text"
                            placeholder=" "
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={GlobalStyle.inputSearch}
                        />
                        <FaSearch className={GlobalStyle.searchBarIcon} />
                    </div>

                    <div className={`${GlobalStyle.cardContainer} w-auto`}>
                        <div className="flex flex-col md:flex-row justify-end items-end md:items-center space-y-2 md:space-y-0 md:space-x-4 relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className={GlobalStyle.selectBox}
                            >
                                <option value="" disabled hidden>All Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Terminate">Terminated</option>
                            </select>

                            <div className="hidden md:flex space-x-4">
                                <button
                                    onClick={handleFilterButton}
                                    className={GlobalStyle.buttonPrimary}
                                >
                                    Filter
                                </button>

                                <button
                                    className={GlobalStyle.buttonRemove}
                                    onClick={handleClear}
                                >
                                    Clear
                                </button>
                            </div>

                            <div className="md:hidden w-full bg-white shadow-md rounded-md mt-1 py-2 px-3 space-y-2">
                                <button
                                    onClick={handleFilterButton}
                                    className={`${GlobalStyle.buttonPrimary} w-full`}
                                >
                                    Filter
                                </button>

                                <button
                                    className={`${GlobalStyle.buttonRemove} w-full`}
                                    onClick={handleClear}
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

           <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
                <table className={`${GlobalStyle.table} w-full`}>
                    <thead className={`${GlobalStyle.thead} sticky top-0`}>
                        <tr>
                            <th className={GlobalStyle.tableHeader}>DRC ID</th>
                            <th className={GlobalStyle.tableHeader}>Status</th>
                            <th className={GlobalStyle.tableHeader}>Bussiness Reg. No.</th>
                            <th className={GlobalStyle.tableHeader}>DRC Name</th>
                            <th className={GlobalStyle.tableHeader}>Contact No.</th>
                            <th className={GlobalStyle.tableHeader}>Service Count</th>
                            <th className={GlobalStyle.tableHeader}>RO Count</th>
                            <th className={GlobalStyle.tableHeader}>Billing Center Count</th>
                            <th className={GlobalStyle.tableHeader}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDataBySearch.length > 0 ? (
                            filteredDataBySearch.slice(startIndex, endIndex).map((log, index) => (
                                <tr
                                    key={index}
                                    className={`${index % 2 === 0
                                        ? "bg-white bg-opacity-75"
                                        : "bg-gray-50 bg-opacity-50"
                                        } border-b`}
                                >
                                    <td className={GlobalStyle.tableData}>{log.DRCID}</td>
                                    <td className={GlobalStyle.tableData}>{renderStatusIcon(log.Status)}

                                        <Tooltip
                                            id={`status-tooltip-${log.Status}`}
                                            place="bottom"
                                            content={log.Status}
                                        />
                                    </td>
                                    <td className={GlobalStyle.tableData}>{log.BusinessRegNo}</td>
                                    <td className={GlobalStyle.tableData}>{log.DRCName}</td>
                                    <td className={GlobalStyle.tableData}>{log.ContactNo}</td>

                                    <td className={`${GlobalStyle.tableData} cursor-pointer text-center `} 
                                     onClick={() => navigate('/pages/DRC/DRCDetails', { state: { drcId: log.DRCID, activeTab: "Services" } })}>
                                                {log.ServiceCount}
                                    </td>


                                    <td className={`${GlobalStyle.tableData} cursor-pointer  text-center`} 
                                        onClick={() => navigate('/pages/DRC/DRCDetails', { state: { drcId: log.DRCID, activeTab: "RO" } })}>
                                               {log.ROCount}
                                    </td>


                                    <td className={`${GlobalStyle.tableData} cursor-pointer  text-center`} 
                                        onClick={() => navigate('/pages/DRC/DRCDetails', { state: { drcId: log.DRCID, activeTab: "Billing Center" } })}>
                                                 {log.BillingCenterCount}
                                    </td>


                                  <td className={`${GlobalStyle.tableData} flex justify-center space-x-2`}>
                                    <button 
                                        onClick={() => navigateToDRCInfo(log.DRCID)}
                                        className="p-2 hover:bg-gray-100 rounded flex items-center justify-center"
                                        //title="More Info"
                                        
                                    >
                                        <img src={moreImg} alt="More Info" className="h-auto w-5 max-w-[24px]" data-tooltip-id="more-info-tooltip" />
                                        <Tooltip
                                            id="more-info-tooltip"
                                            place="bottom"
                                            content="More Info"
                                        />
                                    </button>

                                    <button 
                                         onClick={() => navigate('/pages/DRC/DrcAgreement', { state: { drcId: log.DRCID , drcname: log.DRCName } })}
                                        className="p-2 hover:bg-gray-100 rounded flex items-center justify-center"
                                        //title="Agreement Details"
                                        disabled={log.Status === "Terminate"}
                                    >
                                        <img src={agreementIcon} alt="Agreement Details" className="h-auto w-5 max-w-[24px]" data-tooltip-id="agreement-tooltip" />
                                        <Tooltip
                                            id="agreement-tooltip"
                                            place="bottom"
                                            content="Agreement"
                                        />
                                    </button>

                                    <button
                                            //onClick={() => navigate('/pages/Distribute/AssignDRCCaseList', { state: { drc_id: log.DRCID } })}
                                            className="p-1 hover:bg-gray-100 rounded"
                                        >
                                            <img src={ListImg} alt="Case List" className="h-auto w-5 max-w-[24px]" data-tooltip-id={`case-list-tooltip`} />
                                            <Tooltip id={`case-list-tooltip`} place="bottom" content="Case List" />
                                        </button>

                                    {/* <button 
                                        className="p-2 hover:bg-gray-100 rounded flex items-center justify-center"
                                        title="Details"
                                    >
                                        <img src={ListImg} alt="Details" className="h-auto w-5 max-w-[24px]" />
                                    </button> */}

                                    
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center py-4">
                                    {statusFilter || searchQuery 
                                        ? "No matching DRCs found" 
                                        : "No DRCs available"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {filteredDataBySearch.length > 0 && (
                <div className={GlobalStyle.navButtonContainer}>
                    <button
                        className={`${GlobalStyle.navButton} ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                    >
                        <FaArrowLeft />
                    </button>

                    <span>Page {currentPage}</span>

                    <button
                        className={`${GlobalStyle.navButton} ${
                            !hasMoreData && currentPage >= Math.ceil(filteredData.length / rowsPerPage) 
                                ? 'opacity-50 cursor-not-allowed' 
                                : ''
                        }`}
                        onClick={handleNextPage}
                        disabled={!hasMoreData && currentPage >= Math.ceil(filteredData.length / rowsPerPage)}
                    >
                        <FaArrowRight />
                    </button>
                </div>
            )}
        </div>
    );
};

export default DRCList;