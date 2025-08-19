/* Purpose: This template is used for the 3.1 - FTL LOD Case List .
Created Date: 2025-03-31
Created By: Chamath (chamathjayasanka20@gmail.com)
Version: node 20
ui number : 3.1
Dependencies: tailwind css
Related Files: (routes)
Notes: The following page conatins the code for the FTL LOD Case List Screen */

import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import FTL_LOD_Cus_Response_update from "./FTL_LOD_Cus_Response_update.jsx";
import { fetchAllArrearsBands } from "../../services/case/CaseServices.js";
import { getLoggedUserId } from "../../services/auth/authService.js";
import { List_FTL_LOD_Cases } from "../../services/FTL_LOD/FTL_LODServices.js";
import {FLT_LOD_Case_Details} from "../../services/FTL_LOD/FTL_LODServices.js";
//Status Icons

import Pending_FTL_LOD from "../../assets/images/FTL_LOD/Pending_FTL_LOD.svg";
import Initial_FTL_LOD from "../../assets/images/FTL_LOD/Initial_FTL_LOD.svg";
import FTL_LOD_Settle_Pending from "../../assets/images/FTL_LOD/FTL_LOD_Settle_Pending.svg";
import FTL_LOD_Settle_Open_Pending from "../../assets/images/FTL_LOD/FTL_LOD_Settle_Open_Pending.svg";
import FTL_LOD_Settle_Active from "../../assets/images/FTL_LOD/FTL_LOD_Settle_Active.svg";

//button icons
import CreateFtlIcon from "../../assets/images/FTL_LOD/3.1- FLT_LOD/Create_FTL_LOD.png";
import CreateSettlementIcon from "../../assets/images/FTL_LOD/3.1- FLT_LOD/Create_Settlement.png";
import ViewDetailsIcon from "../../assets/images/FTL_LOD/3.1- FLT_LOD/View_Details.png";
import CustomerResponseIcon from "../../assets/images/FTL_LOD/3.1- FLT_LOD/Customer_Response.png";

import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService.js";
import { use } from "react";


const FTLLODCaseList = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  // State Variables
  const [arrearsBandList, setArrearsBandList] = useState([]);

  //User and Authentication
  //const [userData, setUserData] = useState(null);

  const [status, setStatus] = useState("");
  const [arrearsBand, setArrearsBand] = useState("");
  const [arrearsAmount, setArrearsAmount] = useState("");
  const [account_no, setAccountNo] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  //const [filterParams, setFilterParams] = useState([]);

  /* useEffect(() => {
        const updatedParams = [
            { key: "status", value: status },
            { key: "arrearsAmount", value: arrearsAmount },
            { key: "fromDate", value: fromDate },
            { key: "toDate", value: toDate }
        ];

        setFilterParams(updatedParams);
        console.log("Updated filterParams:", updatedParams);
    }, [status, arrearsAmount, fromDate, toDate]); */
  const [searchBy, setSearchBy] = useState("case_id");
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  //const [error, setError] = useState("");
  const [caseId, setCaseId] = useState("");
  //const [searchBy, setSearchBy] = useState("case_id"); // Default search by case ID

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [maxCurrentPage, setMaxCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  //const [totalAPIPages, setTotalAPIPages] = useState(1);
  //const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true);
  const [totalAPIPages, setTotalAPIPages] = useState(1);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const rowsPerPage = 10; // Number of rows per page
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  
  const [committedFilters, setCommittedFilters] = useState({
    caseId: "",
    status: "",
    arrearsBand: "",
    arrearsAmount: "",
    account_no: "",
    fromDate: null,
    toDate: null
  });

  //const currentData = filteredCases.slice(indexOfFirstRecord, indexOfLastRecord);
  //const totalPages = Math.ceil(filteredCases.length / rowsPerPage);
  //const indexOfLastRecord = currentPage * rowsPerPage;
  //const indexOfFirstRecord = indexOfLastRecord - rowsPerPage;

  // Filter state for Amount, Case ID, Status, and Date
  //const [filterCaseId, setFilterCaseId] = useState("");
  const [userData, setUserData] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Role-Based Button
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try{
      let decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Current time in seconds
      if (decode.exp < currentTime) {
        refreshAccessToken().then((newToken) => {
          if (!newToken) return;
          const newDecoded = jwtDecode(newToken);
          setUserRole(newDecoded.role);
        });
      } else {
        setUserRole(decoded.role);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  const loadUser = async () => {
    const user = await getLoggedUserId();
    setUserData(user);
    console.log("User data:", user);
  };

  useEffect(() => {
    loadUser();
  }, []);
  
// Function to get the status icon based on the case status
  // This function returns the appropriate icon based on the case status
  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending FTL LOD":
        return (
          <img
            src={Pending_FTL_LOD}
            alt="Pending FTL LOD"
            title="Pending FTL LOD"
            className="w-6 h-6"
          />
        );
      case "Initial FTL LOD":
        return (
          <img
            src={Initial_FTL_LOD}
            alt="Initial FTL LOD"
            title="Initial FTL LOD"
            className="w-6 h-6"
          />
        );
      case "FTL LOD Settle Pending":
        return (
          <img
            src={FTL_LOD_Settle_Pending}
            alt="FTL LOD Settle Pending"
            title="FTL LOD Settle Pending"
            className="w-6 h-6"
          />
        );
      case "FTL LOD Settle Open-Pending":
        return (
          <img
            src={FTL_LOD_Settle_Open_Pending}
            alt="FTL LOD Settle Open-Pending"
            title="FTL LOD Settle Open-Pending"
            className="w-6 h-6"
          />
        );
      case "FTL LOD Settle Active":
        return (
          <img
            src={FTL_LOD_Settle_Active}
            alt="FTL LOD Settle Active"
            title="FTL LOD Settle Active"
            className="w-6 h-6"
          />
        );

      default:
        return <span className="text-gray-500"></span>;
    }
  };

  const getActionIcons = (status, item) => {
    const icons = [];

    const pushIcon = (src, alt, onClickHandler, title) => {
      icons.push(
        <img
          key={alt}
          src={src}
          alt={alt}
          title={alt}
          className="w-6 h-6  cursor-pointer"
          onClick={() => onClickHandler(item)}
        />
      );
    };

    switch (status) {
      case "Pending FTL LOD":
        pushIcon(CreateFtlIcon, "Create FTL", handleCreateFtl);
        break;
      case "Initial FTL LOD":
        pushIcon(
          CreateSettlementIcon, "Create Settlement", handleCreateSettlement);
        pushIcon(
          CustomerResponseIcon, "Customer Response", handleCustomerResponse);
        pushIcon(
          ViewDetailsIcon, "View Details", handleViewDetails);
        break;
      case "FTL LOD Settle Pending":
        pushIcon(ViewDetailsIcon, "View Details", handleViewDetails);
        break;
      case "FTL LOD Settle Open-Pending":
        pushIcon(CreateSettlementIcon,"Create Settlement", handleCreateSettlement);
        pushIcon(CustomerResponseIcon, "Customer Response", handleCustomerResponse);
        pushIcon(ViewDetailsIcon, "View Details", handleViewDetails);
        break;
      case "FTL LOD Settle Active":
        pushIcon(CreateSettlementIcon, "Create Settlement", handleCreateSettlement);
        pushIcon(CustomerResponseIcon,"Customer Response",handleCustomerResponse);
        pushIcon(ViewDetailsIcon, "View Details", handleViewDetails);
        break;
      default:
        return null;
    }

    return icons;
  };

  const handleCreateFtl = (item) => {
    navigate("/pages/flt-lod/ftl-lod-creation(preview-of-ftl-lod)", {
      state: {item},
    });
    console.log("Create FTL for:", item);
  };

  const handleCreateSettlement = (item) => {
    navigate("/pages/CreateSettlement/CreateSettlementPlan", {
      state: { item },
    });
    console.log("Create Settlement for:", item);
  };

  const handleCustomerResponse = (item) => {
    setSelectedItem(item);
    setIsPopupOpen(true);
    console.log("Customer Response for:", item);
  };

  const handleViewDetails = (item) => {
    navigate("/pages/flt-lod/ftl-lod-case-details", {
      state: { item }, // pass the full object or just case_id
    });
    console.log("View Details for:", item);
  };



  useEffect(() => {
    const fetchArrearsBands = async () => {
      try {
        if (userData) {
          // Make sure to convert to number if needed
          const arrearsBandList = await fetchAllArrearsBands();
          setArrearsBandList(arrearsBandList);
          console.log("Arrears Bands:", arrearsBandList);
        }
      } catch (error) {
        console.error("Error fetching ArrearsBands:", error);
      }
    };

    fetchArrearsBands();
  }, [userData]);

  const handlestartdatechange = (date) => {
    // Case: User clears the "From Date"
    if (!date) {
      setFromDate(null);
      return;
    }

    // Case: To Date is set and From Date is after it
    if (toDate && date > toDate) {
      Swal.fire({
        title: "Warning",
        text: "The 'From' date cannot be later than the 'To' date.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      setFromDate(null);
      return;
    }

    // All good: update From Date
    setFromDate(date);

    // Optional: if toDate exists, call custom logic
    /* if (toDate) {
            checkdatediffrence(date, toDate);
        } */
  };

  const handleenddatechange = (date) => {
    // Case: User clears the "To Date"
    if (!date) {
      setToDate(null);
      return;
    }

    // Case: From Date is set and To Date is before it
    if (fromDate && date < fromDate) {
      Swal.fire({
        title: "Warning",
        text: "The 'To' date cannot be earlier than the 'From' date.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      setToDate(null);
      return;
    }

    // All good: update To Date
    setToDate(date);

    // Optional: if fromDate exists, call custom logic
    /* if (fromDate) {
            checkdatediffrence(fromDate, date);
        } */
  };


  // Handle api calling only when the currentPage incriment more that before
  const handlePageChange = () => {
    // console.log("Page changed to:", currentPage);
    if (currentPage > maxCurrentPage && currentPage <= totalAPIPages) {
      setMaxCurrentPage(currentPage);
      handleFilter(); // Call the filter function only after the page incrimet
    }
  };

  useEffect(() => {
    if (isFilterApplied) {
      handlePageChange(); // Call the function whenever currentPage changes
    }
  }, [currentPage]);

  // Check if toDate is greater than fromDate
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

  // Search Section
  const filteredDataBySearch = paginatedData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Filter validation
  const filterValidations = () => {
    if (!caseId && !arrearsBand && !arrearsAmount && !status && !fromDate && !toDate) {
      Swal.fire({
        title: "Warning",
        text: "At least one filter must be selected.",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
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
    
        return true; // All validations passed
  };

  const handleFilter = async (filters) => {
    try {
      // setFilteredData([]); // Clear previous results

      // Format the date to 'YYYY-MM-DD' format
      const formatDate = (date) => {
        if (!date) return null;
        const offsetDate = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        );
        return offsetDate.toISOString().split("T")[0];
      };
      console.log(currentPage);

      // if (!arrearsAmount && !status && !fromDate && !toDate) {
      //   Swal.fire({
      //     title: "Warning",
      //     text: "No filter is selected. Please, select a filter.",
      //     icon: "warning",
      //     allowOutsideClick: false,
      //     allowEscapeKey: false,
      //   });
      //   setToDate(null);
      //   setFromDate(null);
      //   return;
      // }

      const payload = {
        case_current_status: filters.status,
        current_arrears_band: filters.arrearsBand,
        current_arrears_amount: filters.arrearsAmount,
        date_from: formatDate(filters.fromDate) ,
        date_to: formatDate(filters.toDate),
        pages: filters.page ,
      };

      console.log("Payload sent to API: ", payload);

      setIsLoading(true); // Set loading state to true
      const response = await List_FTL_LOD_Cases(payload);
      setIsLoading(false); // Set loading state to false

       // Updated response handling
      if (response && response.data && response.data.cases) { 
        if (currentPage === 1) {
        setFilteredData(response.data.cases)}
        else {
        setFilteredData((prevData) => [...prevData, ...response.data.cases]);
      }

      if (response.data.length === 0) {
        setIsMoreDataAvailable(false);
        if (currentPage === 1) {
          Swal.fire({
            title: "No Results",
            text: "No matching data found for the selected filters.",
            icon: "warning",
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonColor:"#f1c40f"
          });
        } else if (currentPage === 2) {
          setCurrentPage(1);
        }
      }
    } else {
      const maxData = currentPage === 1 ? 10 : 30;
      if (response.data.cases.length < maxData) {
        setIsMoreDataAvailable(false);
      }
    }
  //   } else {
  //     Swal.fire({
  //       title: "Error",
  //       text: "No valid data found in response.",
  //       icon: "error",
  //       confirmButtonColor: "#d33"
  //     });
  //     setFilteredData([]);
  //   }
  // } catch (error) {
  //     console.error("Error filtering cases:", error);
  //     Swal.fire({
  //       title: "Error",
  //       text: "Failed to fetch filtered data. Please try again.",
  //       icon: "error",
  //       confirmButtonColor: "#d33"
  //     });
  } finally {
    setIsLoading(false); // Ensure loading state is reset
  }
  };


      // setIsLoading(true); // Set loading state to true
      // const response = await List_FTL_LOD_Cases(payload).catch((error) => {
      //   if (error.response && error.response.status === 404) {
      //     Swal.fire({
      //       title: "No Results",
      //       text: "No matching data found for the selected filters.",
      //       icon: "warning",
      //       allowOutsideClick: false,
      //       allowEscapeKey: false,
      //     });
      //     setFilteredData([]);
      //     return null;
      //   } else {
      //     throw error;
      //   }
      // });
      // console.log("Response from API:", response);
      // setIsLoading(false); // Set loading state to false

  //       const cases = response.data.cases;
  //       console.log("Valid data received:", cases);

  //       const totalPages = Math.ceil(
  //         response.data.pagination.total / rowsPerPage
  //       );
  //       setTotalPages(totalPages);
  //       setTotalAPIPages(response.data.pagination.pages);

  //       setFilteredData((prevData) => [...prevData, ...cases]);
  //     } else {
  //       console.error(
  //         "No valid FTL LOD case data found in response:",
  //         response
  //       );
  //       setFilteredData([]);
  //     }
  //   } catch (error) {
  //     console.error("Error filtering cases:", error);
  //     Swal.fire({
  //       title: "Error",
  //       text: "Failed to fetch filtered data. Please try again.",
  //       icon: "error",
  //     });
  //   }
  // };
  

  useEffect(() => {
    if (isMoreDataAvailable && currentPage > maxCurrentPage) {
     setMaxCurrentPage(currentPage);
      handleFilter({
        ...committedFilters,
        page: currentPage
      }); // Call the filter function only after the page increment
    }
  }, [currentPage]);


  // Handle pagination
  // const handlePrevNext = (direction) => {
  //   if (direction === "prev" && currentPage > 1) {
  //     setCurrentPage(currentPage - 1);
  //   } else if (direction === "next" && currentPage < totalPages) {
  //     setCurrentPage(currentPage + 1);
  //   }
  // };
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
      // console.log("Current Page:", currentPage);
    }
  };

  const handleFilterButton = () => {
    // Reset to the first page
    setIsMoreDataAvailable(true); // Reset more data available state
    setTotalPages(0); // Reset total pages
    setMaxCurrentPage(0); // Reset max current page
   
   const isValid = filterValidations(); // Validate filters before applying
    if (!isValid) {
      return; // If validation fails, do not proceed
    } else {
      setCommittedFilters({
        caseId,
        account_no,
        status,
        fromDate,
        toDate
      });
      setFilteredData([]); // Clear previous results
      if (currentPage === 1) {
        // callAPI();
        handleFilter({
          caseId,
          arrearsBand,
          arrearsAmount,
          status,
          fromDate,
          toDate,
          page: 1
        });
      } else {
        setCurrentPage(1);
      }
    }
  }

  const handleClear = () => {
    setCaseId("");
    setArrearsBand("");
    setArrearsAmount("");
    setStatus("");
    setFromDate(null);
    setToDate(null);
    setSearchQuery("");
    setIsFilterApplied(false); // Reset filter applied state
    setIsMoreDataAvailable(true); // Reset more data available state
    setMaxCurrentPage(0); // Reset max current page
    setTotalPages(0); // Reset total pages
    setFilteredData([]); // Clear filtered data
    // setTotalAPIPages(1); // Reset total API pages

    setCommittedFilters({
      caseId: "",
      status: "",
      arrearsBand: "",
      arrearsAmount: "",
      account_no: "",
      fromDate: null,
      toDate: null
    }); 
    if (currentPage != 1) {
      setCurrentPage(1); // Reset to page 1
    } else {
      setCurrentPage(0); // Temp set to 0
      setTimeout(() => setCurrentPage(1), 0); // Reset to 1 after
    } 
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
    <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
      <div className={"flex flex-col flex-1 " }>
        
        {/* Title */}
        <h1 className={GlobalStyle.headingLarge + " mb-6"}>FTL LOD List </h1>

        <div className = "flex justify-end">
          <div className={`${GlobalStyle.cardContainer} w-full mt-6`}>
            <div className="flex flex-wrap items-center justify-end w-full space-x-4 space-y-3">
              {/* Status Select Dropdown */}
              <select
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`${GlobalStyle.selectBox} mt-3 `}
              >
                <option value="" disabled>
                  Status
                </option>
                <option value="Pending FTL LOD">Pending FTL LOD</option>
                <option value="Initial FTL LOD">Initial FTL LOD</option>
                <option value="FTL LOD Settle Pending">FTL LOD Settle Pending</option>
                <option value="FTL LOD Settle Open-Pending">FTL LOD Settle Open-Pending</option>
                <option value="FTL LOD Settle Active">FTL LOD Settle Active</option>
              </select>

              <select
                className={`${GlobalStyle.selectBox} mt-3`}
                value={arrearsBand}
                onChange={(e) => setArrearsBand(e.target.value)}
              >
              <option value="" disabled>
                Arrears band
              </option>
              {Array.isArray(arrearsBandList) && arrearsBandList.length > 0 ? (
                  arrearsBandList.map(({ key, value }) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))
                ) : (
                    <option disabled>No arrears bands available</option>
                )}
              </select>
            
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
                    className={`${GlobalStyle.inputText} w-full  sm:w-auto`}
                  />
              </div>

              {/* <button
                onClick={handleFilterButton}
                className={`${GlobalStyle.buttonPrimary}  w-full sm:w-auto`}
              >
                Filter
              </button>
              <button
                className={`${GlobalStyle.buttonRemove}  w-full sm:w-auto`}
                onClick={handleClear} >
                  Clear
              </button> */}
              <div className="flex flex-col sm:flex-row justify-end sm:space-x-4 space-y-2 sm:space-y-0 mt-4 w-full">
                  <button
                    onClick={handleFilterButton}
                    className={`${GlobalStyle.buttonPrimary} w-full sm:w-auto`}
                   >
                    Filter
                  </button>
                  <button
                    className={`${GlobalStyle.buttonRemove} w-full sm:w-auto`}
                    onClick={handleClear}
                  >
                      Clear
                  </button>
              </div>
              
            </div>
          </div>
        </div>
        

          {/* Search Section */}
          <div className="flex justify-start mt-10 mb-4">
            <div className={GlobalStyle.searchBarContainer}>
              <input
                type="text"
                placeholder=""
                value={searchQuery}
                onChange={(e) => {setCurrentPage(1); setSearchQuery(e.target.value)}}
                className={GlobalStyle.inputSearch}
              />
              <FaSearch className={GlobalStyle.searchBarIcon} />
            </div>
          </div>
        

        {/* Table Section */}
        <div className={`${GlobalStyle.tableContainer} mt-10 overflow-x-auto`}>
          <table className={GlobalStyle.table}>
            <thead className={GlobalStyle.thead}>
              <tr>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Case ID
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Status
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Account No
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Amount
                </th>

                <th scope="col" className={GlobalStyle.tableHeader}>
                  Expire Date
                </th>

              <th scope="col" className={GlobalStyle.tableHeader}></th>
            </tr>
          </thead>
          <tbody>
            {filteredDataBySearch && filteredDataBySearch.length > 0 ? (
              filteredDataBySearch.map((item, index) => (
                <tr
                  key={item.case_id || index}
                  className={
                    index % 2 === 0
                      ? GlobalStyle.tableRowEven
                      : GlobalStyle.tableRowOdd
                  }
                >
                  <td
                    className={`${GlobalStyle.tableData} text-black hover:underline cursor-pointer`}
                    onClick={() =>
                      navigate(`/pages/flt-lod/ftl-lod-case-details`, {
                        state: { item },
                      })
                    } // Pass the full object or just case_id
                    title="Click to view details"
                  >
                    {item.case_id || null}
                  </td>

                  <td
                    className={`${GlobalStyle.tableData} flex justify-center items-center pt-6`}
                  >
                    {getStatusIcon(item.case_current_status) || null}
                  </td>

                  <td className={`${GlobalStyle.tableData} `}>
                    {item.account_no || null}
                  </td>

                  <td className={GlobalStyle.tableCurrency}>
                    {item?.current_arrears_amount
                      ? item.current_arrears_amount.toLocaleString("en-LK", {
                          style: "currency",
                          currency: "LKR",
                        })
                      : null}
                  </td>

                  <td className={`${GlobalStyle.tableData} `}>
                    {item.ftl_lod &&
                    item.ftl_lod.length > 0 &&
                    item.ftl_lod[0].expire_date
                      ? new Date(
                          item.ftl_lod[0].expire_date
                        ).toLocaleDateString("en-GB")
                      : null}
                  </td>

                  <td className={`${GlobalStyle.tableData} text-center`}>
                    <div className="flex items-center gap-2 justify-center space-x-10">
                      {getActionIcons(item.case_current_status, item)}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className={GlobalStyle.tableData + " text-center"}>
                  No cases available
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      
          {/* Pagination Section */}
          {/* <div className={GlobalStyle.navButtonContainer}>
            <button
              onClick={() => handlePrevNext("prev")}
              disabled={currentPage === 1}
              className={`${GlobalStyle.navButton} ${
              currentPage === 1 ? "cursor-not-allowed" : ""
            }`}
          >
          <FaArrowLeft />
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePrevNext("next")}
              disabled={currentPage === totalPages}
              className={`${GlobalStyle.navButton} ${
              currentPage === totalPages ? "cursor-not-allowed" : ""
              }`}
          >
              <FaArrowRight />
              </button>
          </div> */}
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

                <button
                  onClick={() => navigate(-1)}
                  className={`${GlobalStyle.buttonPrimary} `}
                >
                  <FaArrowLeft />
                </button>

            {/* Render the popup when needed */}
              {isPopupOpen && selectedItem && (
                <FTL_LOD_Cus_Response_update
                  isOpen={isPopupOpen}
                  onClose={() => setIsPopupOpen(false)}
                  selectedItem={selectedItem}
                />
              )}
        </div>
      
   

  );
};
export default FTLLODCaseList;
