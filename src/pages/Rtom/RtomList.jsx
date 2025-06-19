import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { fetchRTOMs } from "../../services/RTOM/Rtom_services";
import Swal from "sweetalert2";

import ActiveIcon from "../../assets/images/rtom/ROTM_Active.png";
import InactiveIcon from "../../assets/images/rtom/ROTM_Inactive.png";
import TerminateIcon from "../../assets/images/rtom/ROTM_Terminate.png";
import MoreIcon from "../../assets/images/more.svg";

const RtomList = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSearchQuery, setTempSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [appliedStatus, setAppliedStatus] = useState("");
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [allData, setAllData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetchedBackendPage, setLastFetchedBackendPage] = useState(1);
  const hasMoreData = useRef(true);
  const rowsPerPage = 10;

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active":
        return ActiveIcon;
      case "Inactive":
        return InactiveIcon;
      case "Terminate":
        return TerminateIcon;
      default:
        return ActiveIcon;
    }
  };

  // Fetch RTOMs from the backend
  const callRTOMAPI = async (pageNo) => {
    setIsLoading(true);
    try {
      const rtoms = await fetchRTOMs({
        rtom_status: filtersApplied ? appliedStatus : "",
        pages: pageNo,
      });

      if (rtoms.length === 0) {
        hasMoreData.current = false;

        // status filter warning message
        if (pageNo === 1) {
          Swal.fire({
            icon: filtersApplied ? "info" : "warning",
            iconColor: filtersApplied ? "#ff6b6b" : "#ff9999",
            title: filtersApplied ? "No Records Found" : "No Data Available",
            text: filtersApplied
              ? "No applicable records available for the selected filter."
              : "There are currently no RTOM records available.",
          });
        }
      } else {
        setAllData((prev) => {
          const newData = rtoms.filter(
            (item) => !prev.some((p) => p.rtom_id === item.rtom_id)
          );
          return [...prev, ...newData];
        });
        setLastFetchedBackendPage(pageNo);
      }
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to fetch RTOMs", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setAllData([]);
    setCurrentPage(1);
    hasMoreData.current = true;
    callRTOMAPI(1);
  }, [filtersApplied, appliedStatus]);

  // handle filter
  const handleFilter = () => {
    setAppliedStatus(statusFilter);
    setFiltersApplied(true);
  };

  // handle clear
  const handleClear = () => {
    setSearchQuery("");
    setTempSearchQuery("");
    setStatusFilter("");
    setAppliedStatus("");
    setFiltersApplied(false);
    setCurrentPage(1);
    hasMoreData.current = true;
    setAllData([]);
    callRTOMAPI(1);
  };

  // handle search change
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setTempSearchQuery(val);
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleAdd = () => {
    navigate("/pages/Rtom/AddRtom");
  };

  const handleRowClick = (rtomId) => {
    navigate("/pages/Rtom/RtomInfo", { state: { rtomId } });
  };

  // Filter data based on search query and status filter
  const filteredData = allData.filter((row) => {
    const matchesSearch =
      searchQuery === "" ||
      Object.values(row)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesStatus =
      !filtersApplied ||
      appliedStatus === "" ||
      row.rtom_status === appliedStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentRows = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handle previous page
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Handle next page
  const handleNextPage = () => {
    const nextPage = currentPage + 1;

    const needMoreData = nextPage > totalPages && hasMoreData.current;
    if (needMoreData) {
      callRTOMAPI(lastFetchedBackendPage + 1);
    }

    if (nextPage <= totalPages || hasMoreData.current) {
      setCurrentPage(nextPage);
    }
  };

  if (isLoading && allData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={GlobalStyle.fontPoppins}>
      <h2 className={GlobalStyle.headingLarge}> RTOM List </h2>
      <div className="flex justify-end mt-2">
        <button onClick={handleAdd} className={GlobalStyle.buttonPrimary}>
          Add
        </button>
      </div>

      <div className="w-full mb-2 mt-4">
        <div className="flex flex-wrap justify-between items-center w-full space-y-4 md:space-y-0">
          <div className={`${GlobalStyle.searchBarContainer} md:w-auto `}>
            <div className="flex items-center md:w-auto">
              <input
                type="text"
                placeholder=" "
                value={tempSearchQuery}
                onChange={handleSearchChange}
                className={`w-full md:w-auto${GlobalStyle.inputSearch}`}
              />
              <FaSearch className={GlobalStyle.searchBarIcon} />
            </div>
          </div>

          <div className={`${GlobalStyle.cardContainer} w-full md:w-auto`}>
            <div className="flex flex-wrap justify-end items-center space-x-4 md:space-x-4 w-full ">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`${GlobalStyle.selectBox} w-full md:w-auto`}
              >
                <option value="" disabled hidden>
                  All Status
                </option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Terminate">Terminate</option>
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

      <div className="flex flex-col">
        <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
          <table className={GlobalStyle.table}>
            <thead className={GlobalStyle.thead}>
              <tr>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  RTOM Id
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Status
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Billing Center Code
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Name
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Telephone No
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((rtom, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? "bg-white bg-opacity-75"
                      : "bg-gray-50 bg-opacity-50"
                  } border-b`}
                >
                  <td className={GlobalStyle.tableData}>{rtom.rtom_id}</td>
                  <td
                    className={`${GlobalStyle.tableData} flex justify-center items-center`}
                  >
                    <div className="relative group">
                      <img
                        src={getStatusIcon(rtom.rtom_status)}
                        alt={rtom.rtom_status}
                        className="w-6 h-6"
                      />
                      {/* Tooltip */}
                      <div className="absolute top-full right-0 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                        {rtom.rtom_status}
                        {/* Tooltip arrow */}
                        <div className="absolute bottom-full right-2 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800"></div>
                      </div>
                    </div>
                  </td>

                  <td className={GlobalStyle.tableData}>
                    {rtom.billing_center_code}
                  </td>
                  <td className={GlobalStyle.tableData}>{rtom.rtom_name}</td>
                  <td className={GlobalStyle.tableData}>
                    {rtom.rtom_mobile_no}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    <button
                      onClick={() => handleRowClick(rtom.rtom_id)}
                      className="w-6 h-6 cursor-pointer"
                    >
                      <img
                        src={MoreIcon}
                        alt="View Details"
                        className="w-full h-full"
                      />
                    </button>
                  </td>
                </tr>
              ))}
              {currentRows.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredData.length > 0 && (
        <div className={GlobalStyle.navButtonContainer}>
          <button
            className={`${GlobalStyle.navButton} ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <FaArrowLeft />
          </button>

          <span>Page {currentPage}</span>

          <button
            className={`${GlobalStyle.navButton} ${
              (!hasMoreData.current && currentPage === totalPages) ||
              currentRows.length < rowsPerPage
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={handleNextPage}
            disabled={
              (!hasMoreData.current && currentPage === totalPages) ||
              currentRows.length < rowsPerPage
            }
          >
            <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default RtomList;
