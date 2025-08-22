/* Purpose: This template is used for the F2 Criteria List.
Created Date: 2025-08-21
Created By: Deshan Chinthaka
Last Modified Date: 2025-08-21
Modified By: Deshan Chinthaka
Version: node 20
ui number: CONFIG (F2 Criteria)
Dependencies: tailwind css, react, react-router-dom, sweetalert2, react-tooltip, axios (if API added later)
Related Files: Potentially GlobalStyle.js
*/

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import more_info from "../../assets/images/more.svg";
import Swal from "sweetalert2";
import { Tooltip } from "react-tooltip";

const F2Criteria = () => {
  const navigate = useNavigate();

  // State Variables
  const [searchQuery, setSearchQuery] = useState("");
  const [keyFilter, setKeyFilter] = useState("");
  const [operatorFilter, setOperatorFilter] = useState("");
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Variables for table
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const hasMounted = useRef(false);

  const keys = [
    { value: "", label: "Key", hidden: true },
    { value: "Account Manager Type", label: "Account Manager Type" },
    { value: "Customer Type Name", label: "Customer Type Name" },
  ];

  const operators = [
    { value: "", label: "Operator", hidden: true },
    { value: "=", label: "=" },
  ];

  // Load static data
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      const staticData = [
        {
          id: 1,
          key: "Account Manager Type",
          operator: "=",
          value: "CS1_GOV",
          description: "xxxxxxxxxx",
          created_dtm: "2024-11-05",
          end_dtm: "",
        },
        {
          id: 2,
          key: "Account Manager Type",
          operator: "=",
          value: "CS1_VLB",
          description: "xxxxxxxxxx",
          created_dtm: "2024-11-05",
          end_dtm: "",
        },
        {
          id: 3,
          key: "Account Manager Type",
          operator: "=",
          value: "CS2_CM1",
          description: "xxxxxxxxxx",
          created_dtm: "2024-11-05",
          end_dtm: "",
        },
        {
          id: 4,
          key: "Account Manager Type",
          operator: "=",
          value: "CS2_CM2",
          description: "xxxxxxxxxx",
          created_dtm: "2024-11-05",
          end_dtm: "",
        },
        {
          id: 5,
          key: "Customer Type Name",
          operator: "=",
          value: "Diplomats & Delegates",
          description: "xxxxxxxxxx",
          created_dtm: "2024-11-05",
          end_dtm: "",
        },
        {
          id: 6,
          key: "Customer Type Name",
          operator: "=",
          value: "Government Organizations",
          description: "xxxxxxxxxx",
          created_dtm: "2024-11-05",
          end_dtm: "",
        },
      ];
      setAllData(staticData);
      setFilteredData(staticData);
    }
  }, []);

  // Show no data message
  const showNoDataMessage = (key = "", operator = "") => {
    let message = "No criteria available";
    
    if (key || operator) {
      const filters = [];
      if (key) filters.push(`Key: ${key}`);
      if (operator) filters.push(`Operator: ${operator}`);
      message = `No criteria found with ${filters.join(', ')} filters`;
    }

    Swal.fire({
      title: "No Records Found",
      text: message,
      icon: "info",
      iconColor: "#ff9999",
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
    if (currentPage < Math.ceil(filteredData.length / rowsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle filter button
  const handleFilterButton = () => {
    if (!keyFilter && !operatorFilter) {
      Swal.fire({
        title: "Warning",
        text: "No filter is selected. Please, select a filter.",
        icon: "warning",
        confirmButtonColor: "#f1c40f"
      });
      return;
    }

    let filtered = allData;
    if (keyFilter) {
      filtered = filtered.filter((item) => item.key === keyFilter);
    }
    if (operatorFilter) {
      filtered = filtered.filter((item) => item.operator === operatorFilter);
    }

    setFilteredData(filtered);
    setCurrentPage(1);

    if (filtered.length === 0) {
      showNoDataMessage(keyFilter, operatorFilter);
    }
  };

  // Handle clear
  const handleClear = () => {
    setKeyFilter("");
    setOperatorFilter("");
    setSearchQuery("");
    setFilteredData(allData);
    setCurrentPage(1);
  };

  const handleAddNew = () => navigate("/pages/Configuration/AddF2Criteria");

  // Filter data by search query
  const filteredDataBySearch = searchQuery 
    ? paginatedData.filter((row) =>
        Object.values(row)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : paginatedData;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`${GlobalStyle.fontPoppins} px-4 sm:px-6 lg:px-8`}>
      <h2 className={GlobalStyle.headingLarge}>F2 Criteria</h2>

      <div className="flex justify-end mt-2 sm:mt-0">
        <button 
          className={GlobalStyle.buttonPrimary} 
          onClick={handleAddNew}
        >
          Add New
        </button>
      </div>

      {/* Search and Filters - Responsive */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 mt-4 gap-4 lg:gap-0">
        {/* Search Bar */}
        <div className={GlobalStyle.searchBarContainer}>
          <input
            type="text"
            placeholder=" "
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${GlobalStyle.inputSearch} w-full`}
          />
          <FaSearch className={GlobalStyle.searchBarIcon} />
        </div>

        {/* Filters */}
        <div className={`${GlobalStyle.cardContainer} w-full lg:w-auto`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 items-center">
            {/* Key Filter */}
            <div className="w-full">
              <select
                value={keyFilter}
                onChange={(e) => setKeyFilter(e.target.value)}
                className={`${GlobalStyle.selectBox} w-full`}
                style={{ color: keyFilter === "" ? "gray" : "black" }}
              >
                {keys.map((k) => (
                  <option
                    key={k.value}
                    value={k.value}
                    hidden={k.hidden}
                    style={{ color: "black" }}
                  >
                    {k.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Operator Filter */}
            <div className="w-full">
              <select
                value={operatorFilter}
                onChange={(e) => setOperatorFilter(e.target.value)}
                className={`${GlobalStyle.selectBox} w-full`}
                style={{ color: operatorFilter === "" ? "gray" : "black" }}
              >
                {operators.map((op) => (
                  <option
                    key={op.value}
                    value={op.value}
                    hidden={op.hidden}
                    style={{ color: "black" }}
                  >
                    {op.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Filter Button */}
            <button
              onClick={handleFilterButton}
              className={`${GlobalStyle.buttonPrimary} w-full`}
            >
              Filter
            </button>

            {/* Clear Button */}
            <button
              onClick={handleClear}
              className={`${GlobalStyle.buttonRemove} w-full`}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Table Container - Responsive */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
          {/* Desktop Table View */}
          <table className={`${GlobalStyle.table} md:table min-w-full`}>
            <thead className={GlobalStyle.thead}>
              <tr>
                <th scope="col" className={`${GlobalStyle.tableHeader}`}>ID</th>
                <th scope="col" className={`${GlobalStyle.tableHeader}`}>Key (Criteria)</th>
                <th scope="col" className={`${GlobalStyle.tableHeader}`}>Operator</th>
                <th scope="col" className={`${GlobalStyle.tableHeader}`}>Value</th>
                <th scope="col" className={`${GlobalStyle.tableHeader}`}>Description</th>
                <th scope="col" className={`${GlobalStyle.tableHeader}`}>Created DTM</th>
                <th scope="col" className={`${GlobalStyle.tableHeader}`}>End DTM</th>
                <th scope="col" className={`${GlobalStyle.tableHeader}`}></th>
              </tr>
            </thead>
            <tbody>
              {filteredDataBySearch.length > 0 ? (
                filteredDataBySearch.map((criteria, index) => (
                  <tr key={criteria.id} 
                    className={`${
                      index % 2 === 0
                        ? "bg-white bg-opacity-75"
                        : "bg-gray-50 bg-opacity-50"
                    } border-b`}
                  >
                    <td
                      className={`${GlobalStyle.tableData} w-[100px] max-w-[100px] truncate`}
                      title={criteria.id}
                    >
                      {criteria.id}
                    </td>
                    <td className={`${GlobalStyle.tableData}`}>{criteria.key}</td>
                    <td className={`${GlobalStyle.tableData}`}>{criteria.operator}</td>
                    <td className={`${GlobalStyle.tableData}`}>{criteria.value}</td>
                    <td className={`${GlobalStyle.tableData}`}>{criteria.description}</td>
                    <td className={`${GlobalStyle.tableData}`}>{criteria.created_dtm}</td>
                    <td className={`${GlobalStyle.tableData}`}>{criteria.end_dtm}</td>
                    <td className={`${GlobalStyle.tableData}`}>
                      <div className="flex justify-center">
                        <Link to="/pages/Configuration/F2CriteriaInfo" state={{ id: criteria.id }}>
                          <img src={more_info} alt="More Info" className="h-5 w-5 lg:h-6 lg:w-6" data-tooltip-id={`more-info-tooltip-${criteria.id}`} />
                        </Link>
                        <Tooltip id={`more-info-tooltip-${criteria.id}`} place="bottom" content="More Info" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    {keyFilter || operatorFilter || searchQuery 
                      ? "No matching criteria found" 
                      : "No criteria available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div> 

      {/* Pagination Section */}
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
              currentPage >= Math.ceil(filteredData.length / rowsPerPage) 
                ? 'opacity-50 cursor-not-allowed' 
                : ''
            }`}
            onClick={handleNextPage}
            disabled={currentPage >= Math.ceil(filteredData.length / rowsPerPage)}
          >
            <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default F2Criteria;