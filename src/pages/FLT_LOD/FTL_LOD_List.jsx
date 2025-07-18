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

export default function FTLLODCaseList() {
  const navigate = useNavigate(); // Initialize the navigate function

  // State Variables
  const [arrearsBandList, setArrearsBandList] = useState([]);

  const [status, setStatus] = useState("");
  const [arrearsAmount, setArrearsAmount] = useState("");
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

  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  //const [error, setError] = useState("");
  //const [caseId, setCaseId] = useState("");
  //const [searchBy, setSearchBy] = useState("case_id"); // Default search by case ID

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [maxCurrentPage, setMaxCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAPIPages, setTotalAPIPages] = useState(1);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const rowsPerPage = 10; // Number of rows per page
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  //const currentData = filteredCases.slice(indexOfFirstRecord, indexOfLastRecord);
  //const totalPages = Math.ceil(filteredCases.length / rowsPerPage);
  //const indexOfLastRecord = currentPage * rowsPerPage;
  //const indexOfFirstRecord = indexOfLastRecord - rowsPerPage;

  // Filter state for Amount, Case ID, Status, and Date
  //const [filterCaseId, setFilterCaseId] = useState("");
  const [userData, setUserData] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // const loadUser = async () => {
  //     let token = localStorage.getItem("accessToken");
  //     if (!token) {
  //       setUserData(null);
  //       return;
  //     }

  //     try {
  //       let decoded = jwtDecode(token);
  //       const currentTime = Date.now() / 1000;
  //       if (decoded.exp < currentTime) {
  //         token = await refreshAccessToken();
  //         if (!token) return;
  //         decoded = jwtDecode(token);
  //       }

  //       setUserData({
  //         id: decoded.user_id,
  //         role: decoded.role,
  //         drc_id: decoded.drc_id,
  //         ro_id: decoded.ro_id,
  //       });
  //     } catch (error) {
  //       console.error("Invalid token:", error);
  //     }
  //   };

  //   useEffect(() => {
  //     loadUser();
  //   }, [localStorage.getItem("accessToken")]);

  const loadUser = async () => {
    const user = await getLoggedUserId();
    setUserData(user);
    console.log("User data:", user);
  };

  useEffect(() => {
    loadUser();
  }, []);

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

  /* const checkdatediffrence = (startDate, endDate) => {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        const diffInMs = end - start;
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        const diffInMonths = diffInDays / 30;

        if (diffInMonths > 1) {
            Swal.fire({
                title: "Date Range Exceeded",
                text: "The selected dates shouldn't have more than a 1-month gap.",
                icon: "warning",
                // allowOutsideClick: false,
                // allowEscapeKey: false,
                // showCancelButton: true,
                // confirmButtonText: "Yes",
                // confirmButtonColor: "#28a745",
                // cancelButtonText: "No",
                // cancelButtonColor: "#d33",
            })
            setToDate(null);
            setFromDate(null);
            return;
        }
    }; */

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

  /* const handlestartdatechange = (date) => {
        // Case: User clears the "From Date"
        if (!date) {
            setFilters({ ...filters, fromDate: null });
            return;
        }

        // Case: To Date is set and From Date is after it
        if (filters.toDate && date > filters.toDate) {
            Swal.fire({
                title: "Warning",
                text: "The 'From' date cannot be later than the 'To' date.",
                icon: "warning",
                confirmButtonText: "OK",
            });
            setFilters({ ...filters, fromDate: null });
            return;
        }

        // All good: update From Date
        setFilters({ ...filters, fromDate: date });
    };
 */
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

  /* const handleenddatechange = (date) => {

        // Helper function to check if the year is valid (4 digits)
        const isValidYear = (date) => {
            const year = date.getFullYear();
            return year >= 1000 && year <= 9999;
        };


        // Case: User clears the "To Date"
        if (!isValidYear(date)) {
            setFilters({ ...filters, toDate: null });
            return;
        }

        console.log("From Date:", filters.fromDate);

        console.log("To Date:", date);


        // Case: From Date is set and To Date is before it
        if (filters.fromDate) {
            if (date < filters.fromDate) {
                Swal.fire({
                    title: "Warning",
                    text: "The 'To' date cannot be before the 'From' date.",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                setFilters({ ...filters, toDate: null });
                return;
            }
        }

        // All good: update To Date
        setFilters({ ...filters, toDate: date });
    };
 */

  /* 
        const checkdatediffrence = (startDate, endDate) => {
            const start = new Date(startDate).getTime();
            const end = new Date(endDate).getTime();
            const diffInMs = end - start;
            const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
            const diffInMonths = diffInDays / 30;
    
            if (diffInMonths > 1) {
                Swal.fire({
                    title: "Date Range Exceeded",
                    text: "The selected dates have more than a 1-month gap.",
                    icon: "warning",
                    confirmButtonText: "OK",
                }).then((result) => {
                    if (result.isConfirmed) {
                        setToDate(null);
                        console.log("Dates cleared");
                    }
                }
                );
            };
        }; */

  // Search Section
  const filteredDataBySearch = paginatedData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleFilter = async () => {
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

      if (!arrearsAmount && !status && !fromDate && !toDate) {
        Swal.fire({
          title: "Warning",
          text: "No filter is selected. Please, select a filter.",
          icon: "warning",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        setToDate(null);
        setFromDate(null);
        return;
      }

      // if (searchBy === "case_id" && !/^\d*$/.test(caseId)) {
      //   Swal.fire({
      //     title: "Warning",
      //     text: "Invalid input. Only numbers are allowed for Case ID.",
      //     icon: "warning",
      //     allowOutsideClick: false,
      //     allowEscapeKey: false,
      //   });
      //   setCaseId(""); // Clear the invalid input
      //   return;
      // }

      if ((fromDate && !toDate) || (!fromDate && toDate)) {
        Swal.fire({
          title: "Warning",
          text: "Both From Date and To Date must be selected.",
          icon: "warning",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        setToDate(null);
        setFromDate(null);
        return;
      }

      if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
        Swal.fire({
          title: "Warning",
          text: "To date should be greater than or equal to From date",
          icon: "warning",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        setToDate(null);
        setFromDate(null);
        return;
      }

      console.log(currentPage);

      const payload = {
        case_current_status: status || "",
        current_arrears_band: arrearsAmount || "",
        date_from: fromDate ? formatDate(fromDate) : null,
        date_to: toDate ? formatDate(toDate) : null,
        pages: currentPage,
      };

      console.log("Payload sent to API: ", payload);

      setIsLoading(true); // Set loading state to true
      const response = await List_FTL_LOD_Cases(payload).catch((error) => {
        if (error.response && error.response.status === 404) {
          Swal.fire({
            title: "No Results",
            text: "No matching data found for the selected filters.",
            icon: "warning",
            allowOutsideClick: false,
            allowEscapeKey: false,
          });
          setFilteredData([]);
          return null;
        } else {
          throw error;
        }
      });
      console.log("Response from API:", response);
      setIsLoading(false); // Set loading state to false

      // Updated response handling
      if (response && response.data && response.data.cases) {
        const cases = response.data.cases;
        console.log("Valid data received:", cases);

        const totalPages = Math.ceil(
          response.data.pagination.total / rowsPerPage
        );
        setTotalPages(totalPages);
        setTotalAPIPages(response.data.pagination.pages);

        setFilteredData((prevData) => [...prevData, ...cases]);
      } else {
        console.error(
          "No valid FTL LOD case data found in response:",
          response
        );
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error filtering cases:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch filtered data. Please try again.",
        icon: "error",
      });
    }
  };
  const handleFilterButton = () => {
    // Reset to the first page
    setFilteredData([]); // Clear previous results
    setMaxCurrentPage(0); // Reset max current page
    setTotalAPIPages(1); // Reset total API pages
    if (currentPage === 1) {
      handleFilter();
    } else {
      setCurrentPage(1);
    }
    setIsFilterApplied(true); // Set filter applied state to true
  };

  /* const handleFilter = async () => {
        console.log("Filters applied:", filters);
        console.log("Filters applied:", filters.arrearsAmount, filters.status, filters.fromDate, filters.toDate);

        try {
            setFilteredCases([]);

            const formatDate = (date) => {
                if (!date) return null;
                const d = new Date(date);

                const year = d.getFullYear();
                const month = (d.getMonth() + 1).toString().padStart(2, '0');
                const day = d.getDate().toString().padStart(2, '0');

                return `${year}-${month}-${day}`;
            };

            console.log("Formatted From Date:", formatDate(filters.fromDate));
            console.log("Formatted To Date:", formatDate(filters.toDate));

            if (!filters.arrearsAmount && !filters.status && !filters.fromDate && !filters.toDate) {
                Swal.fire({
                    title: "Missing Filters",
                    text: "Please select at least one filter.",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                return;
            }

            if ((filters.fromDate && !filters.toDate) || (!filters.fromDate && filters.toDate)) {
                Swal.fire({
                    title: "Incomplete Date Range",
                    text: "Both From Date and To Date must be selected together.",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                return;
            }

            if (filters.fromDate && filters.toDate && filters.fromDate > filters.toDate) {
                Swal.fire({
                    title: "Invalid Date Range",
                    text: "To Date should be greater than or equal to From Date.",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                return;
            }

            const payload = {
                case_current_status: filters.status || "",
                current_arrears_band: filters.arrearsAmount || "",
                date_from: filters.fromDate ? formatDate(filters.fromDate) : null,
                date_to: filters.toDate ? formatDate(filters.toDate) : null,
                pages: currentPage,
            };

            console.log("Payload sent to API: ", payload);

            const response = await List_FTL_LOD_Cases(payload);

            console.log("Response from API:", response);

            if (Array.isArray(response.data)) {
                console.log("Filtered Cases:", response.data);
                setFilteredCases(response.data);
            } else {
                console.error("Expected an array but got:", response.data);
            }
        } catch (error) {
            console.error("Error filtering cases:", error);
            Swal.fire({
                title: "Error",
                text: "Failed to fetch filtered data. Please try again.",
                icon: "error"
            });
        }
    }; */

  /*  // Search Section
     const filteredDataBySearch = currentData.filter((row) =>
         Object.values(row)
             .join(" ")
             .toLowerCase()
             .includes(searchQuery.toLowerCase())
     );
     console.log("Filtered Data by Search:", filteredDataBySearch); */

  const handleClear = () => {
    setArrearsAmount("");
    setStatus("");
    setFromDate(null);
    setToDate(null);
    setSearchQuery("");
    setCurrentPage(1); // Reset to the first page
    setIsFilterApplied(false); // Reset filter applied state
    setTotalPages(1); // Reset total pages
    setFilteredData([]); // Clear filtered data
    setTotalAPIPages(1); // Reset total API pages
  };

  /* const handleFilter = async () => {
        try {
            setFilteredData([]); // Clear previous results

            // Format the date to 'YYYY-MM-DD' format
            const formatDate = (date) => {
                if (!date) return null;
                const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
                return offsetDate.toISOString().split('T')[0];
            };

            if (!selectedArrearsBand && !selectedRTOM && !fromDate && !toDate) {
                Swal.fire({
                    title: "Warning",
                    text: "No filter data is selected. Please, select data.",
                    icon: "warning",
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });
                setToDate(null);
                setFromDate(null);
                return;
            };

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

            if (new Date(fromDate) > new Date(toDate)) {
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
            };

            const payload = {
                drc_id: Number(userData?.drc_id), // Convert drc_id to number
                rtom: selectedRTOM,
                arrears_band: selectedArrearsBand,
                from_date: formatDate(fromDate),
                to_date: formatDate(toDate),
            };
            console.log('Sending filter payload:', payload); // Log the payload before sending for debugging
            // Fetch filtered data from the API using the payload
            const AssignedRoCaseLogs = await listHandlingCasesByDRC(payload);


            if (Array.isArray(AssignedRoCaseLogs)) {
                setFilteredlogData(AssignedRoCaseLogs.data);
            } else {
                console.error("No valid cases data found in response.");
            }


            // Log the response
            console.log('Response from API:', AssignedRoCaseLogs); //for debugging

            // Set the filtered data (assuming setFilteredData updates the state or UI)
            setFilteredlogData(AssignedRoCaseLogs);


            console.log("Filtered data updated:", filteredlogData); //for debugging

            const endDate = AssignedROcaselog.expire_dtm;
            const currentDate = new Date();
            const isPastDate = endDate < currentDate;
        } catch (error) {
            console.error("Error filtering cases:", error);
            Swal.fire({
                title: "Error",
                text: "Failed to fetch filtered data. Please try again.",
                icon: "error"
            });
        }
    }; */

  // Handle pagination
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Filter handlers
  /*  const handleFilterChange = (e) => {
         const { name, value } = e.target;
         setFilters((prev) => ({
             ...prev,
             [name]: value,
         }));
         setError("");
     }; */

  /* 
        // Filtering the data based on filter values
        const filterData = () => {
            let tempData = data;
            if (filterType && filterValue) {
                if (filterType === "Account No") {
                    tempData = tempData.filter((item) =>
                        item.accountNo.includes(filterValue)
                    );
                } else if (filterType === "Case ID") {
                    tempData = tempData.filter((item) => item.caseId.includes(filterValue));
                }
            }
    
            if (fromDate) {
                tempData = tempData.filter((item) => {
                    const itemDate = new Date(item.date);
                    return itemDate >= toDate;
                });
            }
    
            if (toDate) {
                tempData = tempData.filter((item) => {
                    const itemDate = new Date(item.date);
                    return itemDate <= toDate;
                });
            }
            // Apply filters
            if (filterAccountNo) {
                tempData = tempData.filter((item) =>
                    item.accountNo.includes(filterAccountNo)
                );
            }
            if (filterCaseId) {
                tempData = tempData.filter((item) => item.caseId.includes(filterCaseId));
            }
            if (filterStatus) {
                tempData = tempData.filter((item) => item.status.includes(filterStatus));
            }
            if (selectedArrearsAmount) {
                tempData = tempData.filter((item) => {
                    const amount = parseInt(item.amount.replace(/,/g, "")); // Remove commas and parse as integer
                    if (selectedArrearsAmount === "5-10") {
                        return amount >= 5000 && amount <= 10000;
                    } else if (selectedArrearsAmount === "10-25") {
                        return amount >= 10000 && amount <= 25000;
                    } else if (selectedArrearsAmount === "25-50") {
                        return amount >= 25000 && amount <= 50000;
                    } else if (selectedArrearsAmount === "50-100") {
                        return amount >= 50000 && amount <= 100000;
                    } else if (selectedArrearsAmount === "100+") {
                        return amount > 100000;
                    }
                    return true; // Return true if no filter is applied
                });
            }
            setFilteredData(tempData);
            setCurrentPage(1); // Reset pagination when filter changes
        }; */

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
          CreateSettlementIcon,
          "Create Settlement",
          handleCreateSettlement
        );
        pushIcon(
          CustomerResponseIcon,
          "Customer Response",
          handleCustomerResponse
        );
        pushIcon(ViewDetailsIcon, "View Details", handleViewDetails);
        break;
      case "FTL LOD Settle Pending":
        pushIcon(ViewDetailsIcon, "View Details", handleViewDetails);
        break;
      case "FTL LOD Settle Open-Pending":
        pushIcon(
          CreateSettlementIcon,
          "Create Settlement",
          handleCreateSettlement
        );
        pushIcon(
          CustomerResponseIcon,
          "Customer Response",
          handleCustomerResponse
        );
        pushIcon(ViewDetailsIcon, "View Details", handleViewDetails);
        break;
      case "FTL LOD Settle Active":
        pushIcon(
          CreateSettlementIcon,
          "Create Settlement",
          handleCreateSettlement
        );
        pushIcon(
          CustomerResponseIcon,
          "Customer Response",
          handleCustomerResponse
        );
        pushIcon(ViewDetailsIcon, "View Details", handleViewDetails);
        break;
      default:
        return null;
    }

    return icons;
  };

  const handleCreateFtl = (item) => {
    console.log("Create FTL for:", item);
  };

  const handleCreateSettlement = (item) => {
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
      {/* Title */}
      <h1 className={GlobalStyle.headingLarge}>FTL LOD List </h1>

      <div className={`${GlobalStyle.cardContainer} w-full mb-8 mt-8`}>
        <div className="flex items-center justify-end w-full space-x-6">
          {/* Status Select Dropdown */}
          <select
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={`${GlobalStyle.selectBox} w-32 md:w-40`}
          >
            <option value="" disabled>
              Status
            </option>
            <option value="Pending FTL LOD">Pending FTL LOD</option>
            <option value="Initial FTL LOD">Initial FTL LOD</option>
            <option value="FTL LOD Settle Pending">
              FTL LOD Settle Pending
            </option>
            <option value="FTL LOD Settle Open-Pending">
              FTL LOD Settle Open-Pending
            </option>
            <option value="FTL LOD Settle Active">FTL LOD Settle Active</option>
          </select>

          <select
            className={GlobalStyle.selectBox}
            value={arrearsAmount}
            onChange={(e) => setArrearsAmount(e.target.value)}
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

          <div className={GlobalStyle.datePickerContainer}>
            <label className={GlobalStyle.dataPickerDate}>Date</label>
            <DatePicker
              selected={fromDate}
              onChange={handlestartdatechange}
              dateFormat="dd/MM/yyyy"
              placeholderText="From"
              className={GlobalStyle.inputText}
            />
            <DatePicker
              selected={toDate}
              onChange={handleenddatechange}
              dateFormat="dd/MM/yyyy"
              placeholderText="To"
              className={GlobalStyle.inputText}
            />
          </div>

          <button
            onClick={handleFilterButton}
            className={`${GlobalStyle.buttonPrimary}`}
          >
            Filter
          </button>
          <button onClick={handleClear} className={GlobalStyle.buttonRemove}>
            Clear
          </button>
        </div>
      </div>

      {/* Search Section */}
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

      {/* Table Section */}
      <div className={GlobalStyle.tableContainer}>
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
                    {item.case_id || "N/A"}
                  </td>

                  <td
                    className={`${GlobalStyle.tableData} flex justify-center items-center pt-6`}
                  >
                    {getStatusIcon(item.case_current_status) || "N/A"}
                  </td>

                  <td className={`${GlobalStyle.tableData} `}>
                    {item.account_no || "N/A"}
                  </td>

                  <td className={GlobalStyle.tableCurrency}>
                    {item?.current_arrears_amount
                      ? item.current_arrears_amount.toLocaleString("en-LK", {
                          style: "currency",
                          currency: "LKR",
                        })
                      : "N/A"}
                  </td>

                  <td className={`${GlobalStyle.tableData} `}>
                    {item.ftl_lod &&
                    item.ftl_lod.length > 0 &&
                    item.ftl_lod[0].expire_date
                      ? new Date(
                          item.ftl_lod[0].expire_date
                        ).toLocaleDateString("en-GB")
                      : "N/A"}
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
                <td colSpan={6} className="text-center">
                  No cases available
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
      </div>

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
}
