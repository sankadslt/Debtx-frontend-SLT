/*Purpose:
Created Date: 2025-05-25
Created By: Nimesha Kavindhi (nimeshakavindhi4@gmail.com)
Version: React v18
ui number : 10.1
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */

import { useState, useEffect, useRef } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import { List_RO_Details_Owen_By_DRC_ID, List_RTOM_Details_Owen_By_DRC_ID, List_Service_Details_Owen_By_DRC_ID } from "../../services/drc/Drc";
import { useLocation, useSearchParams } from "react-router-dom";
import activeIcon from "../../assets/images/ConfigurationImg/Active.png";
import inactiveIcon from "../../assets/images/ConfigurationImg/Inactive.png";
import terminatedIcon from "../../assets/images/ConfigurationImg/Terminate.png";
import Swal from "sweetalert2";

const DRCDetails = () => {
  const location =useLocation();
  const queryParams = new URLSearchParams(location.search);

  const drcId = queryParams.get("drcid");
  const drcName = queryParams.get("drcname");
  const initialTab = queryParams.get("tab") || "RO";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({ 
    status: "", 
    rtom: "", 
    service: "" 
  });
    
  // Filter States
  const [status, setStatus] = useState("");
  const [rtomFilter, setRtomFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");

  const statuses = ["Active", "Inactive"];
  const rtomNames = ["RTOM 1", "RTOM 2", "RTOM 3", "RTOM 4"];
  const serviceTypes = ["PEO", "LTE", "FTTH", "DSL"];

  // Status Icons
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return activeIcon;
      case "inactive":
        return inactiveIcon;
      case "ended":
        return terminatedIcon;
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

 const handleFilter = () => {
    const newFilters = {
      status: status,
      rtom: rtomFilter,
      service: serviceFilter,
      search: searchQuery
    };
    
    setAppliedFilters(newFilters);
  };

  const handleClearFilters = () => {
    setStatus("");
    setRtomFilter("");
    setServiceFilter("");
    setSearchQuery("");
    setAppliedFilters({ 
      status: "", 
      rtom: "", 
      service: "",
      search: "" 
    });
  };

  // Handle search when Enter key is pressed
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleFilter();
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "RO":
        return (
          <ROList
            drcId={drcId}
            renderStatusIcon={renderStatusIcon}
            filters={appliedFilters}
            searchQuery={searchQuery}
          />
        );
      case "RTOM":
        return (
          <RTOMList
            drcId={drcId}
            renderStatusIcon={renderStatusIcon}
            filters={appliedFilters}
            searchQuery={searchQuery}

          />
        );
      case "Services":
        return (
          <ServicesList
            drcId={drcId}
            renderStatusIcon={renderStatusIcon}
            filters={appliedFilters}
            searchQuery={searchQuery}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={GlobalStyle.fontPoppins}>
      <div className="flex justify-between items-center mb-8">
        <h1 className={GlobalStyle.headingLarge}>{drcName}</h1>
      </div>

      {/* Filter Section */}
      <div className="grid justify-end mb-4">
        <div className={`${GlobalStyle.cardContainer} w-auto h-auto py-4 px-6`}>
          <div className="flex justify-end items-center gap-4">

            {/* Status Filter (shown for RO and Services tabs) */}
            {(activeTab === "RO" || activeTab === "Services") && (
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={GlobalStyle.selectBox}
              >
                <option value="" disabled hidden>
                  Select Status
                </option>
                {statuses.map((statusOption, index) => (
                  <option key={index} value={statusOption}>
                    {statusOption}
                  </option>
                ))}
              </select>
            )}

            {/* RTOM Filter (shown for RO and RTOM tabs) */}
            {(activeTab === "RO" || activeTab === "RTOM") && (
              <select
                value={rtomFilter}
                onChange={(e) => setRtomFilter(e.target.value)}
                className={GlobalStyle.selectBox}
              >
                <option value="" disabled hidden>
                  Select RTOM
                </option>
                {rtomNames.map((rtomOption, index) => (
                  <option key={index} value={rtomOption}>
                    {rtomOption}
                  </option>
                ))}
              </select>
            )}

            {/* Service Filter (shown for Services tab) */}
            {activeTab === "Services" && (
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className={GlobalStyle.selectBox}
              >
                <option value="" disabled hidden>
                  Select Service
                </option>
                {serviceTypes.map((serviceOption, index) => (
                  <option key={index} value={serviceOption}>
                    {serviceOption}
                  </option>
                ))}
              </select>
            )}

            {/* Filter Button */}
            <button 
              onClick={handleFilter} 
              className={GlobalStyle.buttonPrimary}
            >
              Filter
            </button>

            {/* Clear Button */}
            <button
              onClick={handleClearFilters}
              className={GlobalStyle.buttonRemove}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="mb-4 flex justify-start">
        <div className={GlobalStyle.searchBarContainer}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            className={GlobalStyle.inputSearch}
            placeholder="Search..."
          />
          <FaSearch 
            className={GlobalStyle.searchBarIcon} 
            onClick={handleFilter}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-4">
        {["RO", "RTOM", "Services"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              handleClearFilters(); // Clear filters when switching tabs
            }}
            className={`px-8 py-2 ${
              activeTab === tab
                ? "border-b-2 border-blue-500 font-bold"
                : "text-gray-500"
            }`}
          >
            {tab} List
          </button>
        ))}
      </div>

      {/* Table */}
      <div>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default DRCDetails;   

// RO List
function ROList({ drcId, renderStatusIcon, filters, searchQuery }) {
  const fetchedPages = useRef(new Set());
  const initialLoad = useRef(true);

  //data states
  const [filterdData, setFilteredData] =useState([]);
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true);

  //Pagination
  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [isLoading, setIsLoading] =useState(false);
  // const totalPages = Math.ceil(data.length / rowsPerPage);

  // variables need for table
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filterdData.slice(startIndex, endIndex);

  useEffect(()=>{
    console.log("Filterd Data: ", filterdData);
    
  }, [filterdData])

  useEffect(() => {
    console.log("total pages", totalPages);
    console.log("Current Page", currentPage);
    console.log("is MOre data available", isMoreDataAvailable);

  },[currentPage])

  // Effect to handle filter changes and initial load
  useEffect(() => {
    console.log("Filters", filters);
    
    console.log("Filters use Effect Called");
    
    // Reset everything when filters change
    fetchedPages.current.clear();
    setFilteredData([]);
    setCurrentPage(1);
    setIsMoreDataAvailable(true);
    
    // Only fetch if it's not the initial load or if filters changed
    if (!initialLoad.current || Object.keys(filters).length > 0) {
      fetchROList(1, filters);
    }
    
    initialLoad.current = false;
  }, [filters]);
  
  useEffect(() => {
    if (
      currentPage === 1 || 
      fetchedPages.current.has(currentPage) ||
      (!isMoreDataAvailable && currentPage <= Math.ceil(filterdData.length / rowsPerPage))
    ) {
      return;
    }

    fetchedPages.current.add(currentPage);
    fetchROList(currentPage, filters);
    console.log("Pagination use Effect Called");

  }, [currentPage]);

  // Function to handle searching through current results
  const getFilteredResults = () => {
    if (!searchQuery) return paginatedData;
    
    return paginatedData.filter(item => {
      const searchLower = searchQuery.toLowerCase();
      return (
        (item.ro_name && item.ro_name.toString().toLowerCase().includes(searchLower)) ||
        (item.status && item.status.toLowerCase().includes(searchLower)) ||
        (item.ro_contact_no && item.ro_contact_no.toString().toLowerCase().includes(searchLower))
      );
    });
  };

  const filteredDataBySearch = getFilteredResults();

  const fetchROList = async (page, filtersOverride = {}) => {
    try {
      const payload = {
        drc_id: drcId,
        pages: page,
        ...filtersOverride,
      };

      setIsLoading(true);
      const response = await List_RO_Details_Owen_By_DRC_ID(payload).catch((error) => {
        if (error.response && error.response.status === 404) {
          Swal.fire({
            title: "No Results",
            text: "No matching data found for the selected filters.",
            icon: "warning",
            allowOutsideClick: false,
            allowEscapeKey: false
          });
          setFilteredData([]);
          return null;
        } else {
          throw error;
        }
      });
      setIsLoading(false);

      if (response?.roList) {
        setFilteredData(prevData => 
          page === 1 ? response.roList : [...prevData, ...response.roList]
        );
        
        // Update pagination states
        const totalItems = page === 1 ? response.roList.length : filterdData.length + response.roList.length;
        setTotalPages(Math.ceil(totalItems / rowsPerPage));
        
        // Check if more data is available
        const maxData = page === 1 ? 10 : 30;
        setIsMoreDataAvailable(response.roList.length === maxData);
        
        if (response.roList.length === 0 && page === 1) {
          Swal.fire({
            title: "No Results",
            text: "No matching data found for the selected filters.",
            icon: "warning",
            allowOutsideClick: false,
            allowEscapeKey: false
          });
        }
      } else {
        Swal.fire({
          title: "Error",
          text: "No valid data found in response.",
          icon: "error"
        });
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error filtering cases:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch filtered data. Please try again.",
        icon: "error"
      });
    }
  };

  // Handle Pagination
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next") {
      const calculatedTotalPages = Math.ceil(filterdData.length / rowsPerPage);
      if (currentPage < calculatedTotalPages || isMoreDataAvailable) {
        setCurrentPage(currentPage + 1);
      }
    }
  };

  return (
    <>
      <div className={GlobalStyle.tableContainer}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th className={GlobalStyle.tableHeader}>RO Name</th>
              <th className={GlobalStyle.tableHeader}>Status</th>
              <th className={GlobalStyle.tableHeader}>Enable Date</th>
              <th className={GlobalStyle.tableHeader}>Contact Number</th>
            </tr>
          </thead>
          <tbody>
            {filteredDataBySearch.map((row, index) => (
              <tr
                key={index}
                className={
                  index % 2 === 0
                    ? GlobalStyle.tableRowEven
                    : GlobalStyle.tableRowOdd
                }
              >
                <td className={GlobalStyle.tableData}>{row.ro_name || "N/A"}</td>
                <td className={GlobalStyle.tableData}>
                  {renderStatusIcon(row.status)}
                </td>
                <td className={GlobalStyle.tableData}>{row.ro_end_date || "N/A"}</td>
                <td className={GlobalStyle.tableData}>{row.ro_contact_no || "N/A"}</td>
              </tr>
            ))}
            {isLoading && (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            )}
            {!isLoading && filteredDataBySearch.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Section */}
      <div className={GlobalStyle.navButtonContainer}>
        <button
          onClick={() => handlePrevNext("prev")}
          disabled={currentPage <= 1 || isLoading}
          className={`${GlobalStyle.navButton} ${
            currentPage <= 1 || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          <FaArrowLeft />
        </button>
        
        <span className={`${GlobalStyle.pageIndicator} mx-4`}>
          Page {currentPage}
        </span>
        
        <button
          onClick={() => handlePrevNext("next")}
          disabled={
            (!isMoreDataAvailable && currentPage >= Math.ceil(filterdData.length / rowsPerPage)) || 
            isLoading
          }
          className={`${GlobalStyle.navButton} ${
            (!isMoreDataAvailable && currentPage >= Math.ceil(filterdData.length / rowsPerPage)) || isLoading 
              ? "cursor-not-allowed opacity-50" 
              : ""
          }`}
        >
          <FaArrowRight />
        </button>
      </div>
    </>
  );
}

// RTOM List
function RTOMList({ drcId, filters, searchQuery }) {
  const fetchedPages = useRef(new Set());
  const initialLoad = useRef(true);

  //data states
  const [filterdData, setFilteredData] =useState([]);
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true);

  //Pagination
  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [isLoading, setIsLoading] =useState(false);

  // variables need for table
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filterdData.slice(startIndex, endIndex);
  
  useEffect(()=>{
    console.log("Filterd Data: ", filterdData);
    
  }, [filterdData])

  useEffect(() => {
    console.log("total pages", totalPages);
    console.log("Current Page", currentPage);
    console.log("is MOre data available", isMoreDataAvailable);

  },[currentPage])

  // Effect to handle filter changes and initial load
  useEffect(() => {
    console.log("Filters", filters);
    
    console.log("Filters use Effect Called");
    
    // Reset everything when filters change
    fetchedPages.current.clear();
    setFilteredData([]);
    setCurrentPage(1);
    setIsMoreDataAvailable(true);
    
    // Only fetch if it's not the initial load or if filters changed
    if (!initialLoad.current || Object.keys(filters).length > 0) {
      fetchRTOMList(1, filters);
    }
    
    initialLoad.current = false;
  }, [filters]);

  // Effect to handle pagination
  useEffect(() => {
    if (
      currentPage === 1 || 
      fetchedPages.current.has(currentPage) ||
      (!isMoreDataAvailable && currentPage <= Math.ceil(filterdData.length / rowsPerPage))
    ) {
      return;
    }

    fetchedPages.current.add(currentPage);
    fetchRTOMList(currentPage, filters);
    console.log("Pagination use Effect Called");

  }, [currentPage]);

  // Function to handle searching through current results
  const getFilteredResults = () => {
    if (!searchQuery) return paginatedData;
    
    return paginatedData.filter(item => {
      const searchLower = searchQuery.toLowerCase();
      return (
        (item.area_name && item.area_name.toString().toLowerCase().includes(searchLower)) ||
        (item.rtom_abbreviation && item.rtom_abbreviation.toLowerCase().includes(searchLower))
      );
    });
  };

  const filteredDataBySearch = getFilteredResults();


  const fetchRTOMList = async (page, filtersOverride = {}) => {
    try {
      const payload = {
        drc_id: drcId,
        pages: page,
        ...filtersOverride,
      };

      setIsLoading(true);
      const response = await List_RTOM_Details_Owen_By_DRC_ID(payload).catch((error) => {
      
        if (error.response && error.response.status === 404) {
        Swal.fire({
          title: "No Results",
          text: "No matching data found for the selected filters.",
          icon: "warning",
          allowOutsideClick: false,
          allowEscapeKey: false
        });
          setFilteredData([]);
          return null;
        } else {
          throw error;
        }
      });
      setIsLoading(false);

      console.log("RTOM response: ", response);

      if (response?.rtomList) {
        setFilteredData(prevData => 
          page === 1 ? response.rtomList : [...prevData, ...response.rtomList]
        );
        
        // Update pagination states
        const totalItems = page === 1 ? response.rtomList.length : filterdData.length + response.rtomList.length;
        setTotalPages(Math.ceil(totalItems / rowsPerPage));
        
        // Check if more data is available
        const maxData = page === 1 ? 10 : 30;
        setIsMoreDataAvailable(response.rtomList.length === maxData);
        
        if (response.rtomList.length === 0 && page === 1) {
          Swal.fire({
            title: "No Results",
            text: "No matching data found for the selected filters.",
            icon: "warning",
            allowOutsideClick: false,
            allowEscapeKey: false
          });
        }
      } else {
        Swal.fire({
          title: "Error",
          text: "No valid data found in response.",
          icon: "error"
        });
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error filtering cases:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch filtered data. Please try again.",
        icon: "error"
      });
    }
  };

  // Handle Pagination
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next") {
      const calculatedTotalPages = Math.ceil(filterdData.length / rowsPerPage);
      if (currentPage < calculatedTotalPages || isMoreDataAvailable) {
        setCurrentPage(currentPage + 1);
      }
    }
  };

  return (
    <>
      <div className={GlobalStyle.tableContainer}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th className={GlobalStyle.tableHeader}>RTOM Name</th>
              <th className={GlobalStyle.tableHeader}>Abbreviation</th>
              <th className={GlobalStyle.tableHeader}>Enable Date</th>
              <th className={GlobalStyle.tableHeader}>Contact</th>
              <th className={GlobalStyle.tableHeader}>RO Count</th>
            </tr>
          </thead>
          <tbody>
            {filteredDataBySearch.map((row, index) => (
              <tr
                key={index}
                className={
                  index % 2 === 0
                    ? GlobalStyle.tableRowEven
                    : GlobalStyle.tableRowOdd
                }
              >
                <td className={GlobalStyle.tableData}>{row.area_name || "N/A"}</td>
                <td className={GlobalStyle.tableData}>{row.rtom_abbreviation || "N/A"}</td>
                <td className={GlobalStyle.tableData}>{row.created_dtm ? new Date(row.created_dtm).toLocaleDateString() : "N/A"}</td>
                <td className={GlobalStyle.tableData}>{row.rtom_contact_number?.[0]?.mobile_number || "N/A"}</td>
                <td className={GlobalStyle.tableData}>{row.ro_count || "N/A"}</td>
              </tr>
            ))}
            {isLoading && (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            )}
            {!isLoading && filteredDataBySearch.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className={GlobalStyle.navButtonContainer}>
        <button
          onClick={() => handlePrevNext("prev")}
          disabled={currentPage <= 1 || isLoading}
          className={`${GlobalStyle.navButton} ${
            currentPage <= 1 || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          <FaArrowLeft />
        </button>
        
        <span className={`${GlobalStyle.pageIndicator} mx-4`}>
          Page {currentPage}
        </span>
        
        <button
          onClick={() => handlePrevNext("next")}
          disabled={
            (!isMoreDataAvailable && currentPage >= Math.ceil(filterdData.length / rowsPerPage)) || 
            isLoading
          }
          className={`${GlobalStyle.navButton} ${
            (!isMoreDataAvailable && currentPage >= Math.ceil(filterdData.length / rowsPerPage)) || isLoading 
              ? "cursor-not-allowed opacity-50" 
              : ""
          }`}
        >
          <FaArrowRight />
        </button>
      </div>
    </>
   
  );
}

// Services List
function ServicesList({ drcId, renderStatusIcon, filters, searchQuery }) {
  const fetchedPages = useRef(new Set());
  const initialLoad = useRef(true);

  //data states
  const [filterdData, setFilteredData] =useState([]);
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true);

  //Pagination
  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [isLoading, setIsLoading] =useState(false);
  // const totalPages = Math.ceil(data.length / rowsPerPage);

  // variables need for table
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filterdData.slice(startIndex, endIndex);

  useEffect(()=>{
    console.log("Filterd Data: ", filterdData);
    
  }, [filterdData])

  useEffect(() => {
    console.log("total pages", totalPages);
    console.log("Current Page", currentPage);
    console.log("is MOre data available", isMoreDataAvailable);

  },[currentPage])

  // Effect to handle filter changes and initial load
  useEffect(() => {
    console.log("Filters", filters);
    
    console.log("Filters use Effect Called");
    
    // Reset everything when filters change
    fetchedPages.current.clear();
    setFilteredData([]);
    setCurrentPage(1);
    setIsMoreDataAvailable(true);
    
    // Only fetch if it's not the initial load or if filters changed
    if (!initialLoad.current || Object.keys(filters).length > 0) {
      fetchServicesList(1, filters);
    }
    
    initialLoad.current = false;
  }, [filters]);

  // Effect to handle pagination
  useEffect(() => {
    if (
      currentPage === 1 || 
      fetchedPages.current.has(currentPage) ||
      (!isMoreDataAvailable && currentPage <= Math.ceil(filterdData.length / rowsPerPage))
    ) {
      return;
    }

    fetchedPages.current.add(currentPage);
    fetchServicesList(currentPage, filters);
    console.log("Pagination use Effect Called");

  }, [currentPage]);

    // Function to handle searching through current results
  const getFilteredResults = () => {
    if (!searchQuery) return paginatedData;
    
    return paginatedData.filter(item => {
      const searchLower = searchQuery.toLowerCase();
      return (
        (item.service_type && item.service_type.toString().toLowerCase().includes(searchLower)) ||
        (item.status && item.status.toLowerCase().includes(searchLower))
      );
    });
  };

    const filteredDataBySearch = getFilteredResults();


  const fetchServicesList = async (page, filtersOverride = {}) => {
    try {
      const payload = {
        drc_id: drcId,
        pages: page,
        ...filtersOverride,
      };

      setIsLoading(true);
      const response = await List_Service_Details_Owen_By_DRC_ID(payload).catch((error) => {
        if (error.response && error.response.status === 404) {
          Swal.fire({
            title: "No Results",
            text: "No matching data found for the selected filters.",
            icon: "warning",
            allowOutsideClick: false,
            allowEscapeKey: false
          });
          setFilteredData([]);
          return null;
        } else {
          throw error;
        }
      });
      setIsLoading(false);

      if (response?.servicesList) {
        setFilteredData(prevData => 
          page === 1 ? response.servicesList : [...prevData, ...response.servicesList]
        );
        
        // Update pagination states
        const totalItems = page === 1 ? response.servicesList.length : filterdData.length + response.servicesList.length;
        setTotalPages(Math.ceil(totalItems / rowsPerPage));
        
        // Check if more data is available
        const maxData = page === 1 ? 10 : 30;
        setIsMoreDataAvailable(response.servicesList.length === maxData);
        
        if (response.servicesList.length === 0 && page === 1) {
          Swal.fire({
            title: "No Results",
            text: "No matching data found for the selected filters.",
            icon: "warning",
            allowOutsideClick: false,
            allowEscapeKey: false
          });
        }
      } else {
        Swal.fire({
          title: "Error",
          text: "No valid data found in response.",
          icon: "error"
        });
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error filtering cases:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch filtered data. Please try again.",
        icon: "error"
      });
    }
  };

  // Handle Pagination
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next") {
      const calculatedTotalPages = Math.ceil(filterdData.length / rowsPerPage);
      if (currentPage < calculatedTotalPages || isMoreDataAvailable) {
        setCurrentPage(currentPage + 1);
      }
    }
  };

  return (
    <>
      <div className={GlobalStyle.tableContainer}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th className={GlobalStyle.tableHeader}>SERVICE TYPE</th>
              <th className={GlobalStyle.tableHeader}>ENABLE DATE</th>
              <th className={GlobalStyle.tableHeader}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filteredDataBySearch.map((row, index) => (
              <tr
                key={index}
                className={
                  index % 2 === 0
                    ? GlobalStyle.tableRowEven
                    : GlobalStyle.tableRowOdd
                }
              >
                <td className={GlobalStyle.tableData}>{row.service_type || "N/A"}</td>
                <td className={GlobalStyle.tableData}>{row.enable_date ? new Date(row.enable_date).toLocaleDateString() : "N/A"}</td>
                <td className={GlobalStyle.tableData}>
                  {renderStatusIcon(row.status)}
                </td>
              </tr>
            ))}
            {isLoading && (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            )}
            {!isLoading && filteredDataBySearch.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className={GlobalStyle.navButtonContainer}>
        <button
          onClick={() => handlePrevNext("prev")}
          disabled={currentPage <= 1 || isLoading}
          className={`${GlobalStyle.navButton} ${
            currentPage <= 1 || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          <FaArrowLeft />
        </button>
        
        <span className={`${GlobalStyle.pageIndicator} mx-4`}>
          Page {currentPage}
        </span>
        
        <button
          onClick={() => handlePrevNext("next")}
          disabled={
            (!isMoreDataAvailable && currentPage >= Math.ceil(filterdData.length / rowsPerPage)) || 
            isLoading
          }
          className={`${GlobalStyle.navButton} ${
            (!isMoreDataAvailable && currentPage >= Math.ceil(filterdData.length / rowsPerPage)) || isLoading 
              ? "cursor-not-allowed opacity-50" 
              : ""
          }`}
        >
          <FaArrowRight />
        </button>
      </div>
    </>
    
  );
}

