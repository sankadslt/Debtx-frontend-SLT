import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import editImg from "../../assets/images/more.svg";  
import ListImg from "../../assets/images/ConfigurationImg/list.png";  
import activeIcon from "../../assets/images/ConfigurationImg/Active.png"; 
import inactiveIcon from "../../assets/images/ConfigurationImg/Inactive.png";
import terminatedIcon from "../../assets/images/ConfigurationImg/Terminate.png";
import { listAllDRCDetails } from "../../services/drc/Drc";  

const DRCList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [appliedStatus, setAppliedStatus] = useState("");
    const [allData, setAllData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filtersApplied, setFiltersApplied] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [itemsPerPage] = useState(10); // Fixed items per page
    const [currentDisplayPage, setCurrentDisplayPage] = useState(1); // For client-side pagination
    const navigate = useNavigate();

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "active":
                return activeIcon;
            case "inactive":
                return inactiveIcon;
            case "terminate":
                return terminatedIcon;
            default:
                return null;
        }
    };

    const renderStatusIcon = (status) => {
        const iconPath = getStatusIcon(status);
    
        if (!iconPath) {
            return <span className="capitalize">{status}</span>;
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

    const fetchDRCList = async (filters) => {
        try {
            const response = await listAllDRCDetails({
                status: filters.status || "",
                pages: filters.page || 1
            });
            
            setHasMoreData(response.length === 10);
            
            return response.map(drc => ({
                DRCID: drc.drc_id,
                Status: drc.drc_status,
                BusinessRegNo: drc.drc_business_registration_number,
                DRCName: drc.drc_name,
                ContactNo: drc.drc_contact_no,
                ServiceCount: drc.service_count,
                ROCount: drc.ro_count,
                RTOMCount: drc.rtom_count
            }));
            
        } catch (error) {
            console.error("Error fetching DRC list:", error);
            throw new Error(error.message || "Failed to load DRC data");
        }
    };

    const applyFilters = useCallback((data) => {
        let result = [...data];
        
        // Apply status filter 
        if (appliedStatus) {
            result = result.filter(item => 
                item.Status.toLowerCase() === appliedStatus.toLowerCase()
            );
        }
        
        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(item =>
                item.DRCName.toLowerCase().includes(query) ||
                item.BusinessRegNo.toLowerCase().includes(query) ||
                item.ContactNo.toLowerCase().includes(query)
            );
        }
        
        return result;
    }, [appliedStatus, searchQuery]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const DRCList = await fetchDRCList({
                status: filtersApplied ? appliedStatus : "",
                page: currentPage
            });
            
            setAllData(DRCList);
            
            const filtered = applyFilters(DRCList);
            setFilteredData(filtered);
            
        } catch (error) {
            Swal.fire("Error", error.message || "Failed to load DRCs", "error");
            setAllData([]);
            setFilteredData([]);
            setHasMoreData(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilter = () => {
        setFiltersApplied(true);
        setAppliedStatus(statusFilter);
        setCurrentPage(1);
        setCurrentDisplayPage(1); // Reset display pagination
        
        const filtered = applyFilters(allData);
        setFilteredData(filtered);
    };

    const handleClear = () => {
        setFiltersApplied(false);
        setAppliedStatus("");
        setStatusFilter("");
        setSearchQuery("");
        setCurrentPage(1);
        setCurrentDisplayPage(1); // Reset display pagination
        setHasMoreData(true);
        setFilteredData(allData); 
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        setCurrentDisplayPage(1); // Reset to first page when searching
        
        const filtered = applyFilters(allData);
        setFilteredData(filtered);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (hasMoreData) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Client-side pagination handlers
    const handleDisplayPrevPage = () => {
        if (currentDisplayPage > 1) {
            setCurrentDisplayPage(currentDisplayPage - 1);
        }
    };

    const handleDisplayNextPage = () => {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        if (currentDisplayPage < totalPages) {
            setCurrentDisplayPage(currentDisplayPage + 1);
        }
    };

    // Get current page data for display
    const getCurrentPageData = () => {
        const startIndex = (currentDisplayPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredData.slice(startIndex, endIndex);
    };

    const getTotalPages = () => Math.ceil(filteredData.length / itemsPerPage);
    
    useEffect(() => {
        fetchData();
    }, [currentPage, appliedStatus, filtersApplied]);

    useEffect(() => {
        const filtered = applyFilters(allData);
        setFilteredData(filtered);
        setCurrentDisplayPage(1); // Reset display pagination when data changes
    }, [searchQuery, allData, applyFilters]);

    const HandleAddDRC = () => navigate("/pages/DRC/Add_DRC");

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className={`${GlobalStyle.fontPoppins} px-2 sm:px-4 lg:px-6`}>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                <h2 className={`${GlobalStyle.headingLarge} mb-4 sm:mb-0`}>DRC List</h2>
                <button 
                    className={`${GlobalStyle.buttonPrimary} w-full sm:w-auto`} 
                    onClick={HandleAddDRC}
                >
                    Add
                </button>
            </div>

            {/* Search and Filter Section */}
            <div className="w-full mb-4">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                    {/* Search Bar */}
                    <div className={`${GlobalStyle.searchBarContainer} w-full lg:w-auto lg:min-w-[300px]`}>
                        <input
                            type="text"
                            placeholder="Search DRC..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className={GlobalStyle.inputSearch}
                        />
                        <FaSearch className={GlobalStyle.searchBarIcon} />
                    </div>

                    {/* Filter Controls */}
                    <div className={`${GlobalStyle.cardContainer} w-full lg:w-auto`}>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className={`${GlobalStyle.selectBox} w-full sm:w-auto`}
                            >
                                <option value="" disabled hidden>All Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Terminate">Terminated</option>
                            </select>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleFilter}
                                    className={`${GlobalStyle.buttonPrimary} flex-1 sm:flex-none`}
                                >
                                    Filter
                                </button>

                                <button
                                    className={`${GlobalStyle.buttonRemove} flex-1 sm:flex-none`}
                                    onClick={handleClear}
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block">
                <div className={GlobalStyle.tableContainer}>
                    <table className={GlobalStyle.table}>
                        <thead className={GlobalStyle.thead}>
                            <tr>
                                <th className={GlobalStyle.tableHeader}>DRC ID</th>
                                <th className={GlobalStyle.tableHeader}>Status</th>
                                <th className={GlobalStyle.tableHeader}>Business Reg. No.</th>
                                <th className={GlobalStyle.tableHeader}>DRC Name</th>
                                <th className={GlobalStyle.tableHeader}>Contact No.</th>
                                <th className={GlobalStyle.tableHeader}>Service Count</th>
                                <th className={GlobalStyle.tableHeader}>RO Count</th>
                                <th className={GlobalStyle.tableHeader}>RTOM Count</th>
                                <th className={GlobalStyle.tableHeader}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getCurrentPageData().length > 0 ? (
                                getCurrentPageData().map((log, index) => (
                                    <tr
                                        key={index}
                                        className={`${index % 2 === 0
                                            ? "bg-white bg-opacity-75"
                                            : "bg-gray-50 bg-opacity-50"
                                            } border-b`}
                                    >
                                        <td className={GlobalStyle.tableData}>{log.DRCID}</td>
                                        <td className={GlobalStyle.tableData}>{renderStatusIcon(log.Status)}</td>
                                        <td className={GlobalStyle.tableData}>{log.BusinessRegNo}</td>
                                        <td className={GlobalStyle.tableData}>{log.DRCName}</td>
                                        <td className={GlobalStyle.tableData}>{log.ContactNo}</td>
                                        <td className={GlobalStyle.tableData}>{log.ServiceCount}</td>
                                        <td className={GlobalStyle.tableData}>{log.ROCount}</td>
                                        <td className={GlobalStyle.tableData}>{log.RTOMCount}</td>
                                        <td className={`${GlobalStyle.tableData} flex justify-center gap-2 w-[100px]`}>
                                            <button 
                                                onClick={() => navigate(`/pages/DRC/DRCInfo`, { state: { drcId: log.DRCID } })}
                                                className="p-1 hover:bg-gray-100 rounded"
                                            >
                                                <img src={editImg} alt="Edit" title="Edit" className="w-6 h-6" />
                                            </button>
                                           <button 
                                                onClick={() => navigate(`/pages/DRC/DRCDetails`, { 
                                                    state: { drcId: log.DRCID } 
                                                })}
                                                className="p-1 hover:bg-gray-100 rounded"
                                            >
                                                <img src={ListImg} alt="Details" title="Details" className="w-6 h-6" />
                                            </button>
                                        </td> 
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center py-4">
                                        {filtersApplied || searchQuery 
                                            ? "No matching DRCs found" 
                                            : "No DRCs available"}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden space-y-4">
                {getCurrentPageData().length > 0 ? (
                    getCurrentPageData().map((log, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-md border border-gray-200 p-4"
                        >
                            {/* Header with DRC Name and Status */}
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                                        {log.DRCName}
                                    </h3>
                                    <p className="text-sm text-gray-600">ID: {log.DRCID}</p>
                                </div>
                                <div className="ml-2">
                                    {renderStatusIcon(log.Status)}
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Business Reg. No.</p>
                                    <p className="text-sm font-medium text-gray-900">{log.BusinessRegNo}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Contact No.</p>
                                    <p className="text-sm font-medium text-gray-900">{log.ContactNo}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Service Count</p>
                                    <p className="text-sm font-medium text-gray-900">{log.ServiceCount}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">RO Count</p>
                                    <p className="text-sm font-medium text-gray-900">{log.ROCount}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">RTOM Count</p>
                                    <p className="text-sm font-medium text-gray-900">{log.RTOMCount}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                                <button 
                                    onClick={() => navigate(`/pages/DRC/DRCInfo`, { state: { drcId: log.DRCID } })}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <img src={editImg} alt="Edit" className="w-5 h-5" />
                                </button>
                               <button 
                                    onClick={() => navigate(`/pages/DRC/DRCDetails`, { 
                                        state: { drcId: log.DRCID } 
                                    })}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Details"
                                >
                                    <img src={ListImg} alt="Details" className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
                        <p className="text-gray-500">
                            {filtersApplied || searchQuery 
                                ? "No matching DRCs found" 
                                : "No DRCs available"}
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className={`${GlobalStyle.navButtonContainer} flex-col sm:flex-row gap-4 sm:gap-0 mt-6`}>
                {/* Server-side pagination (for fetching more data) */}
                {filteredData.length === 0 || getCurrentPageData().length === 0 ? null : (
                    <>
                        {/* Display pagination controls */}
                        <button
                            className={`${GlobalStyle.navButton} w-full sm:w-auto ${currentDisplayPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleDisplayPrevPage}
                            disabled={currentDisplayPage === 1}
                        >
                            <FaArrowLeft className="mr-2 sm:mr-0" />
                            <span className="sm:hidden">Previous</span>
                        </button>

                        <span className="text-center">
                            Page {currentDisplayPage} of {getTotalPages()} 
                            <span className="text-sm text-gray-500 ml-2">
                                ({filteredData.length} total items)
                            </span>
                        </span>

                        <button
                            className={`${GlobalStyle.navButton} w-full sm:w-auto ${currentDisplayPage >= getTotalPages() ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleDisplayNextPage}
                            disabled={currentDisplayPage >= getTotalPages()}
                        >
                            <span className="sm:hidden">Next</span>
                            <FaArrowRight className="ml-2 sm:ml-0" />
                        </button>
                    </>
                )}

                {/* Server-side pagination for loading more data */}
                {hasMoreData && filteredData.length > 0 && currentDisplayPage >= getTotalPages() && (
                    <div className="mt-4 flex justify-center">
                        <button
                            className={`${GlobalStyle.buttonPrimary} w-full sm:w-auto`}
                            onClick={handleNextPage}
                        >
                            Load More Data (Page {currentPage + 1})
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DRCList; 