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
        
        const filtered = applyFilters(allData);
        setFilteredData(filtered);
    };

    const handleClear = () => {
        setFiltersApplied(false);
        setAppliedStatus("");
        setStatusFilter("");
        setSearchQuery("");
        setCurrentPage(1);
        setHasMoreData(true);
        setFilteredData(allData); 
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        
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
    
    useEffect(() => {
        fetchData();
    }, [currentPage, appliedStatus, filtersApplied]);

    useEffect(() => {
        const filtered = applyFilters(allData);
        setFilteredData(filtered);
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
        <div className={GlobalStyle.fontPoppins}>
            <h2 className={GlobalStyle.headingLarge}>DRC List</h2>

            <div className="flex justify-end mt-2">
                <button 
                    className={GlobalStyle.buttonPrimary} 
                    onClick={HandleAddDRC}
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
                            onChange={handleSearchChange}
                            className={GlobalStyle.inputSearch}
                        />
                        <FaSearch className={GlobalStyle.searchBarIcon} />
                    </div>

                    <div className={`${GlobalStyle.cardContainer} w-auto`}>
                        <div className="flex justify-end items-center space-x-4">
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

                            <button
                                onClick={handleFilter}
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
                    </div>
                </div>
            </div>

            <div className={GlobalStyle.tableContainer}>
                <table className={GlobalStyle.table}>
                    <thead className={GlobalStyle.thead}>
                        <tr>
                            <th className={GlobalStyle.tableHeader}>DRC ID</th>
                            <th className={GlobalStyle.tableHeader}>Status</th>
                            <th className={GlobalStyle.tableHeader}>Bussiness Reg. No.</th>
                            <th className={GlobalStyle.tableHeader}>DRC Name</th>
                            <th className={GlobalStyle.tableHeader}>Contact No.</th>
                            <th className={GlobalStyle.tableHeader}>Service Count</th>
                            <th className={GlobalStyle.tableHeader}>RO Count</th>
                            <th className={GlobalStyle.tableHeader}>RTOM Count</th>
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
                                            onClick={() => navigate(`/pages/Distribute/Edit_DRC/${log.DRCID}`)}
                                            className="p-1 hover:bg-gray-100 rounded"
                                        >
                                            <img src={editImg} alt="Edit" title="Edit" className="w-6 h-6" />
                                        </button>
                                        <button 
                                            onClick={() => navigate(`/pages/Distribute/DRC_Details/${log.DRCID}`)}
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

            <div className={GlobalStyle.navButtonContainer}>
                <button
                    className={GlobalStyle.navButton}
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                >
                    <FaArrowLeft />
                </button>

                <span>Page {currentPage}</span>

                {hasMoreData && filteredData.length > 0 && (
                    <button
                        className={GlobalStyle.navButton}
                        onClick={handleNextPage}
                    >
                        <FaArrowRight />
                    </button>
                )}
            </div>
        </div>
    );
};

export default DRCList;