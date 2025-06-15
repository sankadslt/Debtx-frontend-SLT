import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import { List_All_RO_and_DRCuser_Details_to_SLT } from "../../services/RO/RO.js";
import Swal from 'sweetalert2';

import RO_Active from "../../assets/images/status/RO_DRC_Status_Icons/RO_Active.svg";
import RO_Inactive from "../../assets/images/status/RO_DRC_Status_Icons/RO_Inactive.svg";
import RO_Terminate from "../../assets/images/status/RO_DRC_Status_Icons/RO_Terminate.svg";

export default function ROList() {
    const [data, setData] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFilterApplied, setIsFilterApplied] = useState(false);

    const rowsPerPage = 10;
    const navigate = useNavigate();

    const handleFilter = async () => {
        try {
            const payload = {
                drcUser_status: selectedStatus || "",
                pages: currentPage,
            };

            console.log("Payload sent to API: ", payload);
            setIsLoading(true);

            const response = await List_All_RO_and_DRCuser_Details_to_SLT(payload).catch((error) => {
                if (error.response && error.response.status === 404) {
                   
                    return null;
                } else {
                    throw error;
                }
            });

            setIsLoading(false);

            if (response && response.data) {
                const newList = response.data;
                console.log("Valid data received:", newList);
                setData(newList); // Set fresh data
                setTotalPages(Math.ceil(response.total_records / rowsPerPage));
            } else {
                console.error("No valid data found in response:", response);
                setData([]);
            }
        } catch (error) {
            
           
        }
    };

    useEffect(() => {
        handleFilter();
    }, [currentPage]);

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    const handleFilterButton = () => {
        setCurrentPage(1);
        setIsFilterApplied(true);
        handleFilter();
    };

    const handleClear = () => {
        setSelectedStatus("");
        setData([]);
        setCurrentPage(1);
        setTotalPages(1);
        setIsFilterApplied(false);
        handleFilter();
    };

    const handlePrevNext = (direction) => {
        if (direction === "prev" && currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        } else if (direction === "next" && currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Active":
                return <img src={RO_Active} alt="RO Active" title="RO Active" className="w-6 h-6 cursor-pointer" />;
            case "Inactive":
                return <img src={RO_Inactive} alt="RO Inactive" title="RO Inactive" className="w-6 h-6 cursor-pointer" />;
            case "Terminate":
                return <img src={RO_Terminate} alt="RO Terminate" title="RO Terminate" className="w-6 h-6 cursor-pointer" />;
            default:
                return null;
        }
    };

    const filteredDataBySearch = data.filter((row) =>
        Object.values(row).join(" ").toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className={GlobalStyle.fontPoppins}>
            <h2 className={GlobalStyle.headingLarge}>RO List</h2>

            {/* Filters */}
            <div className="w-full mb-2 mt-4">
                <div className="flex justify-between items-center w-full mb-2">
                    <div className="flex justify-start mt-10 mb-4">
                        <div className={GlobalStyle.searchBarContainer}>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={GlobalStyle.inputSearch}
                            />
                            <FaSearch className={GlobalStyle.searchBarIcon} />
                        </div>
                    </div>

                    <div className={`${GlobalStyle.cardContainer} w-auto`}>
                        <div className="flex justify-end items-center space-x-4">
                            <select
                                name="status"
                                value={selectedStatus}
                                onChange={handleStatusChange}
                                className={`${GlobalStyle.selectBox} w-32 md:w-40`}
                            >
                                <option disabled value="">Select Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Terminate">Terminate</option>
                            </select>
                            <button onClick={handleFilterButton} className={GlobalStyle.buttonPrimary}>Filter</button>
                            <button onClick={handleClear} className={GlobalStyle.buttonRemove}>Clear</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className={GlobalStyle.tableContainer}>
                <table className={GlobalStyle.table}>
                    <thead className={GlobalStyle.thead}>
                        <tr>
                            <th className={GlobalStyle.tableHeader}>RO ID</th>
                            <th className={GlobalStyle.tableHeader}>DRC</th>
                            <th className={GlobalStyle.tableHeader}>Status</th>
                            <th className={GlobalStyle.tableHeader}>NIC</th>
                            <th className={GlobalStyle.tableHeader}>RO Name</th>
                            <th className={GlobalStyle.tableHeader}>Contact No.</th>
                            <th className={GlobalStyle.tableHeader}>RTOM Area count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDataBySearch.length > 0 ? (
                            filteredDataBySearch.map((item, index) => (
                                <tr
                                    key={item.ro_id || index}
                                    className={index % 2 === 0 ? GlobalStyle.tableRowEven : GlobalStyle.tableRowOdd}
                                >
                                    <td className={GlobalStyle.tableData}>{item.ro_id || "N/A"}</td>
                                    <td className={GlobalStyle.tableData}>{item.drc_name || "N/A"}</td>
                                    <td className={`${GlobalStyle.tableData} flex justify-center items-center pt-6`}>
                                        {getStatusIcon(item.drcUser_status) || "N/A"}
                                    </td>
                                    <td className={GlobalStyle.tableData}>{item.nic || "N/A"}</td>
                                    <td className={GlobalStyle.tableData}>{item.ro_name || "N/A"}</td>
                                    <td className={GlobalStyle.tableData}>{item.login_contact_no || "N/A"}</td>
                                    <td className={GlobalStyle.tableData}>{item.rtom_area_count || "N/A"}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center py-4">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className={GlobalStyle.navButtonContainer}>
                <button
                    onClick={() => handlePrevNext("prev")}
                    disabled={currentPage === 1}
                    className={`${GlobalStyle.navButton} ${currentPage === 1 ? "cursor-not-allowed" : ""}`}
                >
                    <FaArrowLeft />
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => handlePrevNext("next")}
                    disabled={currentPage === totalPages}
                    className={`${GlobalStyle.navButton} ${currentPage === totalPages ? "cursor-not-allowed" : ""}`}
                >
                    <FaArrowRight />
                </button>
            </div>

            <button onClick={() => navigate(-1)} className={GlobalStyle.buttonPrimary}>
                <FaArrowLeft />
            </button>
        </div>
    );
}
