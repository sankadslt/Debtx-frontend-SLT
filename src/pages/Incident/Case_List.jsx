
/*Purpose: 
Created Date: 2025-01-09
Created By: Dilmith Siriwardena (jtdsiriwardena@gmail.com)
Last Modified Date: 2025-01-09
Modified By: Dilmith Siriwardena (jtdsiriwardena@gmail.com)
Version: React v18
ui number : 0.1
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */

import { useEffect, useState } from 'react';
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { GetFilteredCaseLists } from "../../services/case/CaseServices";

const Case_List = () => {

    // State Variables
    const [rtoms, setRtoms] = useState("");
    const [arrearsBand, setArrearsBand] = useState("");
    const [caseStatus, setCaseStatus] = useState("");
    const [serviceType, setServiceType] = useState("");
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [searchBy, setSearchBy] = useState("case_id"); // Default search by case ID
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [caseData, setCaseData] = useState([]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [maxCurrentPage, setMaxCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [isFilterApplied, setIsFilterApplied] = useState(false);
    const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true); // State to track if more data is available
    const rowsPerPage = 10; // Number of rows per page

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    const navigate = useNavigate();
    
    const handlestartdatechange = (date) => {
        setFromDate(date);
        //if (toDate) checkdatediffrence(date, toDate);
    };
    
    const handleenddatechange = (date) => {
        setToDate(date);
      //  if (fromDate) checkdatediffrence(fromDate, date);
    };  

    // Check if toDate is greater than fromDate
    useEffect(() => {
          if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
            Swal.fire({
              title: "Warning",
              text: "To date should be greater than or equal to From date",
              icon: "warning",
              allowOutsideClick: false,
              allowEscapeKey: false
            });
            setToDate(null);
            setFromDate(null);
            return;
          }
    }, [fromDate, toDate]);

    // Search Section
    const filteredDataBySearch = paginatedData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    );
  
    // const filteredData = data.filter((row) =>
    //     Object.values(row)
    //         .join(" ")
    //         .toLowerCase()
    //         .includes(searchQuery.toLowerCase())
    // );

     const handleFilter = async () => {
        try {
          // Format the date to 'YYYY-MM-DD' format
          const formatDate = (date) => {
            if (!date) return null;
            const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
            return offsetDate.toISOString().split('T')[0];
          };
    
          if (!rtoms && !arrearsBand && !caseStatus && !serviceType && !fromDate && !toDate) {
            Swal.fire({
              title: "Warning",
              text: "No filter is selected. Please, select a filter.",
              icon: "warning",
              allowOutsideClick: false,
              allowEscapeKey: false
            });
            setToDate(null);
            setFromDate(null);
            return;
          }
    
          if ((fromDate && !toDate) || (!fromDate && toDate)) {
            Swal.fire({
              title: "Warning",
              text: "Both From Date and To Date must be selected.",
              icon: "warning",
              allowOutsideClick: false,
              allowEscapeKey: false
            });
            setToDate(null);
            setFromDate(null);
            return;
          }
    
          console.log(currentPage);
    
          const payload = {
            rtom: rtoms,
            arrears_band: arrearsBand,
            case_current_status: caseStatus,           
            drc_commision_rule: serviceType,
            fromDate: formatDate(fromDate),
            toDate: formatDate(toDate),
            page: currentPage,
          };
          console.log("Payload sent to API: ", payload);
    
          setIsLoading(true); // Set loading state to true

          const response = await GetFilteredCaseLists(payload).catch((error) => {
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
          setIsLoading(false); // Set loading state to false
    
          // Updated response handling
          if (response && response.data) {
            // console.log("Valid data received:", response.data);
    
            setFilteredData((prevData) => [...prevData, ...response.data]);
    
            if (response.data.length === 0) {
              setIsMoreDataAvailable(false); // No more data available
              if (currentPage === 1) {
                Swal.fire({
                  title: "No Results",
                  text: "No matching data found for the selected filters.",
                  icon: "warning",
                  allowOutsideClick: false,
                  allowEscapeKey: false
                });
              }
            } else {
              const maxData = currentPage === 1 ? 10 : 30;
              if (response.data.length < maxData) {
                setIsMoreDataAvailable(false); // More data available
              }
            }
    
          } else {
            Swal.fire({
              title: "Error",
              text: "No valid Settlement data found in response.",
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

      useEffect(() => {
          if (isFilterApplied && isMoreDataAvailable && currentPage > maxCurrentPage) {
            setMaxCurrentPage(currentPage); // Update max current page
            handleFilter(); // Call the function whenever currentPage changes
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
        const totalPages = Math.ceil(filteredData.length / rowsPerPage);
        setTotalPages(totalPages);
        if (currentPage < totalPages) {
          setCurrentPage(currentPage + 1);
        }
      }
      // console.log("Current Page:", currentPage);
    }
  };

  // Handle Filter Button click
  const handleFilterButton = () => {
    setFilteredData([]); // Clear previous results
    setIsMoreDataAvailable(true); // Reset more data available state
    setMaxCurrentPage(0); // Reset max current page
    if (currentPage === 1) {
      handleFilter();
    } else {
      setCurrentPage(1);
    }
    setIsFilterApplied(true); // Set filter applied state to true
  }

    const handleCreateTask = () => {
       
        console.log("Create task button clicked");
    };

    // display loading animation when data is loading
    if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

    return (
        <div className={GlobalStyle.fontPoppins}>
            <h2 className={GlobalStyle.headingLarge}>Case List</h2>

            <div className="w-full mb-8 mt-8">
                {/* Filter Section */}
                <div className="grid grid-cols-4 gap-6 w-full">

                    {/* <select
                        value={status1}
                        onChange={(e) => setStatus1(e.target.value)}
                        className={GlobalStyle.selectBox}
                    >
                        <option value="">Select</option>
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                        <option value="Pending">Pending</option>
                    </select> */}


                    {/* <select
                        value={status2}
                        onChange={(e) => setStatus2(e.target.value)}
                        className={GlobalStyle.selectBox}
                    >
                        <option value=""></option>
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                        <option value="Pending">Pending</option>
                    </select> */}


                    <select
                        value={rtoms}
                        onChange={(e) => setRtoms(e.target.value)}
                        className={GlobalStyle.selectBox}
                    >
                        <option value="">RTOM</option>
                        <option value="MH">MH</option>
                        <option value="RTOM-1">RTOM-1</option>
                        <option value="RTOM-2">RTOM-2</option>
                        <option value="RTOM-3">RTOM-3</option>
                    </select>


                    {/* <select
                        value={status4}
                        onChange={(e) => setStatus4(e.target.value)}
                        className={GlobalStyle.selectBox}
                    >
                        <option value="">DRC</option>
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                        <option value="Pending">Pending</option>
                    </select> */}


                    <select
                        value={arrearsBand}
                        onChange={(e) => setArrearsBand(e.target.value)}
                        className={GlobalStyle.selectBox}
                    >
                        <option value="">Arrears Band</option>
                        <option value="AB-5_10">AB-5_10</option>
                        <option value="AB-10_25">AB-10_25</option>
                        <option value="AB-25_50">AB-25_50</option>
                        <option value="AB-50_100">AB-50_100</option>
                    </select>


                    <select
                        value={caseStatus}
                        onChange={(e) => setCaseStatus(e.target.value)}
                        className={GlobalStyle.selectBox}
                    >
                        <option value="">Status</option>
                        <option value="Forward to Mediation Board">Forward to Mediation Board</option>
                        <option value="Pending Write Off">Pending Write Off</option>
                        <option value="Pending Withdraw">Pending Withdraw</option>                        
                    </select>


                    <select
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                        className={GlobalStyle.selectBox}
                    >
                        <option value="">Service Type</option>
                        <option value="PEO TV">PEO TV</option>
                        <option value="CP Collect">CP Collect</option>
                    </select>


                    <label className={GlobalStyle.dataPickerDate}>Date</label>
                        {/* <div className={GlobalStyle.datePickerContainer}> */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <DatePicker
                    selected={fromDate}
                    onChange={handlestartdatechange}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="From"
                    className={`${GlobalStyle.inputText}`}
                  />
                </div>

                <div className="flex items-center">
                  <DatePicker
                    selected={toDate}
                    onChange={handleenddatechange}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="To"
                    className={`${GlobalStyle.inputText}`}
                  />
                </div>
              </div>
                </div>


                <div className="flex justify-end mt-6">
                    <button 
                        onClick={handleFilter} 
                        className={GlobalStyle.buttonPrimary}
                    >
                        Filter
                    </button>
                </div>

            </div>



            <div className="flex flex-col">

                {/* Search Bar */}
                <div className="mb-4 flex justify-start">
                    <div className={GlobalStyle.searchBarContainer}>
                        <input
                            type="text"
                            placeholder=""
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={GlobalStyle.inputSearch}
                        />
                        <FaSearch className={GlobalStyle.searchBarIcon} />
                    </div>
                </div>

                {/* Table */}
                <div className={GlobalStyle.tableContainer}>

                    <table className={GlobalStyle.table}>
                        <thead className={GlobalStyle.thead}>
                            <tr>
                                <th scope="col" className={GlobalStyle.tableHeader}>
                                    ID
                                </th>
                                <th scope="col" className={GlobalStyle.tableHeader}>
                                    Status
                                </th>
                                <th scope="col" className={GlobalStyle.tableHeader}>
                                    Account No.
                                </th>
                                <th scope="col" className={GlobalStyle.tableHeader}>
                                    Service Type
                                </th>
                                <th scope="col" className={GlobalStyle.tableHeader}>
                                    Amount
                                </th>
                                {/* <th scope="col" className={GlobalStyle.tableHeader}>
                                    Agent
                                </th> */}
                                <th scope="col" className={GlobalStyle.tableHeader}>
                                    RTOM
                                </th>
                                <th scope="col" className={GlobalStyle.tableHeader}>
                                    Created Date
                                </th>
                                <th scope="col" className={GlobalStyle.tableHeader}>
                                    Last Paid Date
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDataBySearch.length > 0 ? (
                                filteredDataBySearch.map((row, index) => (
                                    <tr
                                    key={index}
                                     className={`${
                                        index % 2 === 0 ? "bg-white bg-opacity-75" : "bg-gray-50 bg-opacity-50"
                                        } border-b`}
                                    >
                                        <td className={GlobalStyle.tableData}>{row. caseid}</td>
                                        <td className={GlobalStyle.tableData}>{row.casecurrentstatus}</td>
                                        <td className={GlobalStyle.tableData}>{row.accountno}</td>
                                        <td className={GlobalStyle.tableData}>{row.drccommisionrule}</td>
                                        <td className={GlobalStyle.tableData}>{row.currentarrearsamount}</td>
                                        {/* <td className={GlobalStyle.tableData}>{log.agent}</td> */}
                                        <td className={GlobalStyle.tableData}>{row.rtom}</td>
                                        <td className={GlobalStyle.tableData}>{row.createddtm}</td>
                                        <td className={GlobalStyle.tableData}>{row.lastpaymentdate}</td>
                                    </tr>
                                    ))
                                    ) : (
                                        <tr>
                                        <td colSpan="8" className="text-center py-4">
                                            No logs found
                                        </td>
                                        </tr>
                                    )}
                                    </tbody> 
                    </table>
                </div>
            </div>

            {/* Pagination Section */}
          <div className={GlobalStyle.navButtonContainer}>
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
              disabled={currentPage === totalPages}
              className={`${GlobalStyle.navButton} ${currentPage === totalPages ? "cursor-not-allowed" : ""}`}
            >
              <FaArrowRight />
            </button>
          </div>

            {/* Create task button */}
            <div className="flex justify-end mt-6">
                <button 
                    onClick={handleCreateTask}
                    className={GlobalStyle.buttonPrimary}
                >
                    Create task and let me know
                </button>
            </div>

        </div>
    );
};

export default Case_List;

