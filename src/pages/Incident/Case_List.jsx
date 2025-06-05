
// /*Purpose: 
// Created Date: 2025-01-09
// Created By: Dilmith Siriwardena (jtdsiriwardena@gmail.com)
// Last Modified Date: 2025-01-09
// Modified By: Dilmith Siriwardena (jtdsiriwardena@gmail.com)
// Version: React v18
// ui number : 0.1
// Dependencies: Tailwind CSS
// Related Files: 
// Notes: This template uses Tailwind CSS */

// import { useEffect, useState } from 'react';
// import GlobalStyle from "../../assets/prototype/GlobalStyle";
// import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
// import Swal from "sweetalert2";
// import { useNavigate } from 'react-router-dom';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { GetFilteredCaseLists } from "../../services/case/CaseServices";
// import { fetchAllArrearsBands } from '../../services/case/CaseServices';
// import { List_All_Active_RTOMs } from "../../services/RTOM/Rtom";
// import { Active_DRC_Details } from '../../services/drc/Drc';
// //import { getActiveServiceDetails } from '../../services/drc/Drc';
// import { getActiveServiceDetails } from "../../services/drc/Drc.js";
// import { getLoggedUserId } from "../../services/auth/authService";

// const Case_List = () => {

//   // State Variables
//   const [rtomList, setRtomList] = useState([]);
//   const [rtom, setRtom] = useState("");

//   const [activeDRC, setActiveDRC] = useState([]);
//   const [selectedDRC, setSelectedDRC] = useState("");

//   const [arrearsBand, setArrearsBand] = useState([]); // Hold the list of arrears bands fetched from the backend API
//   const [selectedBand, setSelectedBand] = useState(""); // Currently selected arrears band in the dropdown

//   //const [caseStatus, setCaseStatus] = useState("");

//   // const [serviceType, setServiceType] = useState([]);
//   // const [serviceTypes, setServiceTypes] = useState("");

//   const [availableServiceTypes, setAvailableServiceTypes] = useState([]); // renamed from serviceType
//   const [selectedServiceType, setSelectedServiceType] = useState("");     // renamed from serviceTypes


//   const [fromDate, setFromDate] = useState(null);
//   const [toDate, setToDate] = useState(null);
//   const [searchBy, setSearchBy] = useState("case_id"); // Default search by case ID
//   const [filteredData, setFilteredData] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [caseData, setCaseData] = useState([]);

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [maxCurrentPage, setMaxCurrentPage] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);

//   const [isFilterApplied, setIsFilterApplied] = useState(false);
//   const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true); // State to track if more data is available
//   const rowsPerPage = 10; // Number of rows per page

//   const startIndex = (currentPage - 1) * rowsPerPage;
//   const endIndex = startIndex + rowsPerPage;
//   const paginatedData = filteredData.slice(startIndex, endIndex);

//   const navigate = useNavigate();


//   const handlestartdatechange = (date) => {
//     setFromDate(date);
//     //if (toDate) checkdatediffrence(date, toDate);
//   };

//   const handleenddatechange = (date) => {
//     setToDate(date);
//     //  if (fromDate) checkdatediffrence(fromDate, date);
//   };

//   // Check if toDate is greater than fromDate
//   useEffect(() => {
//     if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
//       Swal.fire({
//         title: "Warning",
//         text: "To date should be greater than or equal to From date",
//         icon: "warning",
//         allowOutsideClick: false,
//         allowEscapeKey: false
//       });
//       setToDate(null);
//       setFromDate(null);
//       return;
//     }
//   }, [fromDate, toDate]);

//   useEffect(() => {
//     // fetch RTOM
//     const fetchRTOM = async () => {
//       try {
//         const rtom = await List_All_Active_RTOMs();
//         setRtomList(rtom);
//       } catch (error) {
//         console.error("Error fetching rtom:", error);
//       }
//     };

//     // fetch Active DRCs
//     const fetchActiveDRCs = async () => {
//       try {
//         const drcs = await Active_DRC_Details();
//         setActiveDRC(drcs);
//       } catch (error) {
//         console.error("Error fetching drcs:", error);
//       }
//     };

//     // fetch Arrears Bands
//     const fetchArrearsBands = async () => {
//       try {
//         const bands = await fetchAllArrearsBands();
//         setArrearsBand(bands);
//       } catch (error) {
//         console.error("Error fetching arrears bands:", error);
//       }
//     };

//     // const fetchServiceTypes = async () => {
//     //   try {
//     //     const response = await getActiveServiceDetails();
//     //     setServiceType(response.data); 
//     //   } catch (error) {
//     //     console.error("Error fetching service types:", error);
//     //   }
//     // };

//     const fetchServiceTypes = async () => {
//       try {
//         const response = await getActiveServiceDetails();
//         setAvailableServiceTypes(response.data);
//       } catch (error) {
//         console.error("Error fetching service types:", error);
//       }
//     };

//     fetchRTOM();
//     fetchActiveDRCs();
//     fetchArrearsBands();
//     fetchServiceTypes();
//   }, []);

//   // Search Section
//   const filteredDataBySearch = paginatedData.filter((row) =>
//     Object.values(row)
//       .join(" ")
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase())
//   );

//   const handleFilter = async () => {
//     try {
//       // Format the date to 'YYYY-MM-DD' format
//       const formatDate = (date) => {
//         if (!date) return null;
//         const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
//         return offsetDate.toISOString().split('T')[0];
//       };

//       if (!rtom && !arrearsBand && !caseStatus && !serviceType && !fromDate && !toDate) {
//         Swal.fire({
//           title: "Warning",
//           text: "No filter is selected. Please, select a filter.",
//           icon: "warning",
//           allowOutsideClick: false,
//           allowEscapeKey: false
//         });
//         setToDate(null);
//         setFromDate(null);
//         return;
//       }

//       if ((fromDate && !toDate) || (!fromDate && toDate)) {
//         Swal.fire({
//           title: "Warning",
//           text: "Both From Date and To Date must be selected.",
//           icon: "warning",
//           allowOutsideClick: false,
//           allowEscapeKey: false
//         });
//         setToDate(null);
//         setFromDate(null);
//         return;
//       }

//       console.log(currentPage);

//       const payload = {
//         RTOM: rtom,
//         arrears_band: arrearsBand,
//         case_current_status: caseStatus,
//         drc_commision_rule: serviceType,
//         fromDate: formatDate(fromDate),
//         toDate: formatDate(toDate),
//         page: currentPage,
//       };
//       console.log("Payload sent to API: ", payload);

//       setIsLoading(true); // Set loading state to true

//       const response = await GetFilteredCaseLists(payload).catch((error) => {
//         if (error.response && error.response.status === 404) {
//           Swal.fire({
//             title: "No Results",
//             text: "No matching data found for the selected filters.",
//             icon: "warning",
//             allowOutsideClick: false,
//             allowEscapeKey: false
//           });
//           setFilteredData([]);
//           return null;
//         } else {
//           throw error;
//         }
//       });

//       // Updated response handling
//       if (response && response.data) {
//         // console.log("Valid data received:", response.data);    
//         setFilteredData(response.data);

//         if (response.data.length === 0) {
//           setIsMoreDataAvailable(false); // No more data available
//           if (currentPage === 1) {
//             Swal.fire({
//               title: "No Results",
//               text: "No matching data found for the selected filters.",
//               icon: "warning",
//               allowOutsideClick: false,
//               allowEscapeKey: false
//             });
//           }
//         } else {
//           const maxData = currentPage === 1 ? 10 : 30;
//           if (response.data.length < maxData) {
//             setIsMoreDataAvailable(false); // More data available
//           }
//         }

//       } else {
//         Swal.fire({
//           title: "Error",
//           text: "No valid Settlement data found in response.",
//           icon: "error"
//         });
//         setFilteredData([]);
//       }
//     } catch (error) {
//       console.error("Error filtering cases:", error);
//       Swal.fire({
//         title: "Error",
//         text: "Failed to fetch filtered data. Please try again.",
//         icon: "error"
//       });
//     } finally {
//       setIsLoading(false); // always reset loading
//     }
//   };

//   const handleClear = () => {
//     setRtom("");
//     setSelectedDRC("");
//     setSelectedBand("");
//     //setCaseStatus("");
//     setSelectedServiceType("");
//     setFromDate(null);
//     setToDate(null);
//     setSearchQuery("");
//     setCurrentPage(0); // Reset to the first page
//     setIsFilterApplied(false); // Reset filter applied state
//     setTotalPages(0); // Reset total pages
//     setFilteredData([]); // Clear filtered data
//   };



//   useEffect(() => {
//     if (isFilterApplied && isMoreDataAvailable && currentPage > maxCurrentPage && currentPage !== 1) {
//       setMaxCurrentPage(currentPage); // Update max current page
//       handleFilter(); // Call the function whenever currentPage changes
//     }
//   }, [currentPage]);

//   // Handle Pagination
//   const handlePrevNext = (direction) => {
//     if (direction === "prev" && currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//       // console.log("Current Page:", currentPage);
//     } else if (direction === "next") {
//       if (isMoreDataAvailable) {
//         setCurrentPage(currentPage + 1);
//       } else {
//         const totalPages = Math.ceil(filteredData.length / rowsPerPage);
//         setTotalPages(totalPages);
//         if (currentPage < totalPages) {
//           setCurrentPage(currentPage + 1);
//         }
//       }
//       // console.log("Current Page:", currentPage);
//     }
//   };

//   // Handle Filter Button click
//   const handleFilterButton = () => {
//     setFilteredData([]); // Clear previous results
//     setIsMoreDataAvailable(true); // Reset more data available state
//     setMaxCurrentPage(0); // Reset max current page
//     if (currentPage === 1) {
//       handleFilter();
//     } else {
//       setCurrentPage(1);
//     }
//     setIsFilterApplied(true); // Set filter applied state to true
//   }

//   const handleCreateTask = () => {

//     console.log("Create task button clicked");
//   };

//   // display loading animation when data is loading
//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className={GlobalStyle.fontPoppins}>
//       <h1 className={GlobalStyle.headingLarge + " mb-6"}>Case List</h1>

//       <div className="flex justify-end">
//         <div className={`${GlobalStyle.cardContainer} w-full`}>
//           <div className="flex flex-wrap items-center justify-end w-full space-x-4 space-y-3">

//             {/* Filter Section */}
//             <select
//               value={rtom}
//               onChange={(e) => setRtom(e.target.value)}
//               className={`${GlobalStyle.selectBox} mt-3`}
//               style={{ color: rtom === "" ? "gray" : "black" }}
//             >
//               <option value="" hidden>RTOM</option>
//               {Object.values(rtomList).map((rtom) => (
//                 <option key={rtom.rtom_id} value={rtom.rtom} style={{ color: "black" }}>
//                   {rtom.rtom}
//                 </option>
//               ))}

//             </select>

//             <select
//               value={selectedDRC}
//               onChange={(e) => setSelectedDRC(e.target.value)}
//               className={`${GlobalStyle.selectBox} mt-3`}
//               style={{ color: selectedDRC === "" ? "gray" : "black" }}
//             >
//               <option value="" hidden>DRC</option>
//               {activeDRC.map((drc) => (
//                 <option key={drc.key} value={drc.id.toString()} style={{ color: "black" }}>
//                   {drc.value}
//                 </option>
//               ))}
//             </select>


//             <select
//               value={selectedBand}
//               onChange={(e) => setSelectedBand(e.target.value)}
//               className={`${GlobalStyle.selectBox} mt-3`}
//               style={{ color: selectedBand === "" ? "gray" : "black" }}
//             >
//               <option value="">Arrears Band</option>
//               {arrearsBand.map(({ key, value }) => (
//                 <option key={key} value={value} style={{ color: "black" }}>
//                   {value}
//                 </option>
//               ))}
//             </select>

//             {/* <select
//               value={caseStatus}
//               onChange={(e) => setCaseStatus(e.target.value)}
//               className={`${GlobalStyle.selectBox} `}
//               style={{ color: caseStatus === "" ? "gray" : "black" }}
//             >
//               <option value="" hidden>Status</option>
//               <option value="Incident Done" style={{ color: "black" }}>Incident Done</option>
//               <option value="Reject Pending" style={{ color: "black" }}>Reject Pending</option>
//               <option value="Incident Reject" style={{ color: "black" }}>Incident Reject</option>
//               <option value="Open No Agent" style={{ color: "black" }}>Open No Agent</option>
//               <option value="Only CPE Collect" style={{ color: "black" }}>Only CPE Collect</option>
//               <option value="Direct LOD" style={{ color: "black" }}>Direct LOD</option>
//               <option value="Pending Assign Agent" style={{ color: "black" }}>Pending Assign Agent</option>
//               <option value="Pending Assign Agent Approval" style={{ color: "black" }}>Pending Assign Agent Approval</option>
//               <option value="Open Assign Agent" style={{ color: "black" }}>Open Assign Agent</option>
//               <option value="Open With Agent" style={{ color: "black" }}>Open With Agent</option>          
//             </select> */}
//             {/* 
//             <select
//               value={selectedServiceType}
//               onChange={(e) => setSelectedServiceType(e.target.value)}
//               className={`${GlobalStyle.selectBox} mt-3`}
//               style={{ color: selectedServiceType === "" ? "gray" : "black" }}
//             >
//               <option value="" hidden>Service Type</option>
//               {serviceType.map((type) => (
//                 <option key={type._id} value={type.service_type} style={{ color: "black" }}>
//                   {type.service_type}
//                 </option>
//               ))}
//             </select>             */}


//             {/* <select
//               value={serviceType}
//               onChange={(e) => setServiceTypes(e.target.value)}
//               className={`${GlobalStyle.selectBox} mt-3`}
//               style={{ color: serviceType === "" ? "gray" : "black" }}
//             >
//               <option value="">Service Type</option>
//               {serviceTypes.map((service) => (
//                 <option key={service.key} value={service.id.toString()} style={{ color: "black" }}>
//                   {service.value}
//                 </option>
//               ))}
//             </select> */}

//             <select
//               value={selectedServiceType}
//               onChange={(e) => setSelectedServiceType(e.target.value)}
//               className={`${GlobalStyle.selectBox} mt-3`}
//               style={{ color: selectedServiceType === "" ? "gray" : "black" }}
//             >
//               <option value="">Service Type</option>
//               {availableServiceTypes.map((service) => (
//                 <option key={service.key} value={service.id.toString()} style={{ color: "black" }}>
//                   {service.value}
//                 </option>
//               ))}
//             </select>


//             {/* Date + Buttons in one row */}
//             <div className="flex flex-wrap items-center justify-end space-x-3 w-full mt-2">
//               <label className={GlobalStyle.dataPickerDate}>Date:</label>

//               <DatePicker
//                 selected={fromDate}
//                 onChange={handlestartdatechange}
//                 dateFormat="dd/MM/yyyy"
//                 placeholderText="From"
//                 className={`${GlobalStyle.inputText} w-full sm:w-auto`}
//               />

//               <DatePicker
//                 selected={toDate}
//                 onChange={handleenddatechange}
//                 dateFormat="dd/MM/yyyy"
//                 placeholderText="To"
//                 className={`${GlobalStyle.inputText} w-full sm:w-auto`}
//               />
//               {/* </div> */}

//               {/* <div className="flex space-x-2"> */}
//               <button
//                 className={`${GlobalStyle.buttonPrimary}  w-full sm:w-auto`}
//                 onClick={handleFilter}
//               >
//                 Filter
//               </button>

//               <button
//                 className={`${GlobalStyle.buttonRemove}  w-full sm:w-auto`}
//                 onClick={handleClear}
//               >
//                 Clear
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>




//       {/* <div className="flex flex-col"> */}

//       {/* Search Bar */}
//       <div className="mb-4 flex items-center">
//         <div className={GlobalStyle.searchBarContainer}>
//           <input
//             type="text"
//             placeholder=""
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className={GlobalStyle.inputSearch}
//           />
//           <FaSearch className={GlobalStyle.searchBarIcon} />
//         </div>
//       </div>

//       {/* Table */}
//       <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>

//         <table className={GlobalStyle.table}>
//           <thead className={GlobalStyle.thead}>
//             <tr>
//               <th scope="col" className={GlobalStyle.tableHeader}>
//                 ID
//               </th>
//               <th scope="col" className={GlobalStyle.tableHeader}>
//                 Status
//               </th>
//               <th scope="col" className={GlobalStyle.tableHeader}>
//                 Account No.
//               </th>
//               <th scope="col" className={GlobalStyle.tableHeader}>
//                 Service Type
//               </th>
//               <th scope="col" className={GlobalStyle.tableHeader}>
//                 Amount
//               </th>
//               {/* <th scope="col" className={GlobalStyle.tableHeader}>
//                                     Agent
//                                 </th> */}
//               <th scope="col" className={GlobalStyle.tableHeader}>
//                 RTOM
//               </th>
//               <th scope="col" className={GlobalStyle.tableHeader}>
//                 Created Date
//               </th>
//               <th scope="col" className={GlobalStyle.tableHeader}>
//                 Last Paid Date
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredDataBySearch.length > 0 ? (
//               filteredDataBySearch.map((row, index) => {
//                 // Format created date
//                 const createdDate = row.createddtm
//                   ? new Date(row.createddtm).toISOString().split('T')[0]
//                   : '';

//                 // Format last paid date
//                 const lastPaidDate = row.lastpaymentdate
//                   ? new Date(row.lastpaymentdate).toISOString().split('T')[0]
//                   : '';

//                 return (
//                   <tr
//                     key={index}
//                     className={`${index % 2 === 0 ? "bg-white bg-opacity-75" : "bg-gray-50 bg-opacity-50"
//                       } border-b`}
//                   >
//                     <td className={GlobalStyle.tableData}>{row.caseid}</td>
//                     <td className={GlobalStyle.tableData}>{row.casecurrentstatus}</td>
//                     <td className={GlobalStyle.tableData}>{row.accountno}</td>
//                     <td className={GlobalStyle.tableData}>{row.drccommisionrule}</td>
//                     <td className={GlobalStyle.tableData}>{row.currentarrearsamount}</td>
//                     <td className={GlobalStyle.tableData}>{row.rtom}</td>
//                     <td className={GlobalStyle.tableData}>{createdDate}</td>
//                     <td className={GlobalStyle.tableData}>{lastPaidDate}</td>
//                   </tr>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td colSpan="8" className="text-center py-4">
//                   No logs found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//       {/* </div> */}

//       {/* Pagination Section */}
//       {
//         filteredData.length != 0 && (
//           <div className={GlobalStyle.navButtonContainer}>
//             <button
//               onClick={() => handlePrevNext("prev")}
//               disabled={currentPage <= 1}
//               className={`${GlobalStyle.navButton} ${currentPage <= 1 ? "cursor-not-allowed" : ""}`}
//             >
//               <FaArrowLeft />
//             </button>
//             <span className={`${GlobalStyle.pageIndicator} mx-4`}>
//               Page {currentPage}
//             </span>
//             <button
//               onClick={() => handlePrevNext("next")}
//               disabled={currentPage === totalPages}
//               className={`${GlobalStyle.navButton} ${currentPage === totalPages ? "cursor-not-allowed" : ""}`}
//             >
//               <FaArrowRight />
//             </button>
//           </div>
//         )
//       }

//       {/* Create task button */}
//       <div className="flex justify-end mt-6">
//         <button
//           onClick={handleCreateTask}
//           className={GlobalStyle.buttonPrimary}
//         >
//           Create task and let me know
//         </button>
//       </div>


//     </div>
//   );
// };

// export default Case_List;

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
import { fetchAllArrearsBands } from '../../services/case/CaseServices';
import { List_All_Active_RTOMs } from "../../services/RTOM/Rtom";
import { Active_DRC_Details } from '../../services/drc/Drc';
import { getActiveServiceDetails } from "../../services/drc/Drc";
import { getLoggedUserId } from "../../services/auth/authService";

const Case_List = () => {
  // State Variables
  const [rtomList, setRtomList] = useState([]);
  const [rtom, setRtom] = useState("");

  const [activeDRC, setActiveDRC] = useState([]);
  const [selectedDRC, setSelectedDRC] = useState("");

  const [arrearsBand, setArrearsBand] = useState([]);
  const [selectedBand, setSelectedBand] = useState("");

  const [serviceTypes, setServiceTypes] = useState([]);
  const [selectedServiceType, setSelectedServiceType] = useState("");

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [searchBy, setSearchBy] = useState("case_id");
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [caseData, setCaseData] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [maxCurrentPage, setMaxCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true);
  const rowsPerPage = 10;

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const navigate = useNavigate();

  const handlestartdatechange = (date) => {
    setFromDate(date);
  };

  const handleenddatechange = (date) => {
    setToDate(date);
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

  useEffect(() => {
    // fetch RTOM
    const fetchRTOM = async () => {
      try {
        const rtom = await List_All_Active_RTOMs();
        setRtomList(rtom);
      } catch (error) {
        console.error("Error fetching rtom:", error);
      }
    };

    // fetch Active DRCs
    const fetchActiveDRCs = async () => {
      try {
        const drcs = await Active_DRC_Details();
        setActiveDRC(drcs);
      } catch (error) {
        console.error("Error fetching drcs:", error);
      }
    };

    // fetch Arrears Bands
    const fetchArrearsBands = async () => {
      try {
        const bands = await fetchAllArrearsBands();
        setArrearsBand(bands);
      } catch (error) {
        console.error("Error fetching arrears bands:", error);
      }
    };

    // fetch Service Types
    const fetchServiceTypes = async () => {
      try {
        const response = await getActiveServiceDetails();
        setServiceTypes(response.data || []);
      } catch (error) {
        console.error("Error fetching service types:", error);
        setServiceTypes([]);
      }
    };

    fetchRTOM();
    fetchActiveDRCs();
    fetchArrearsBands();
    fetchServiceTypes();
  }, []);

  // Search Section
  const filteredDataBySearch = paginatedData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleFilter = async () => {
    try {
      // Format the date to 'YYYY-MM-DD' format
      const formatDate = (date) => {
        if (!date) return null;
        const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return offsetDate.toISOString().split('T')[0];
      };

      if (!rtom && !selectedBand && !selectedDRC && !selectedServiceType && !fromDate && !toDate) {
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

      const payload = {
        RTOM: rtom,
        arrears_band: selectedBand,
        drc_commision_rule: selectedServiceType,
        fromDate: formatDate(fromDate),
        toDate: formatDate(toDate),
        page: currentPage,
      };

      setIsLoading(true);

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

      if (response && response.data) {
        setFilteredData(response.data);

        if (response.data.length === 0) {
          setIsMoreDataAvailable(false);
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
            setIsMoreDataAvailable(false);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setRtom("");
    setSelectedDRC("");
    setSelectedBand("");
    setSelectedServiceType("");
    setFromDate(null);
    setToDate(null);
    setSearchQuery("");
    setCurrentPage(1);
    setIsFilterApplied(false);
    setTotalPages(0);
    setFilteredData([]);
  };

  useEffect(() => {
    if (isFilterApplied && isMoreDataAvailable && currentPage > maxCurrentPage && currentPage !== 1) {
      setMaxCurrentPage(currentPage);
      handleFilter();
    }
  }, [currentPage]);

  // Handle Pagination
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
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
    }
  };

  const handleFilterButton = () => {
    setFilteredData([]);
    setIsMoreDataAvailable(true);
    setMaxCurrentPage(0);
    if (currentPage === 1) {
      handleFilter();
    } else {
      setCurrentPage(1);
    }
    setIsFilterApplied(true);
  }

  const handleCreateTask = () => {
    console.log("Create task button clicked");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={GlobalStyle.fontPoppins}>
      <h1 className={GlobalStyle.headingLarge + " mb-6"}>Case List</h1>

      <div className="flex justify-end">
        <div className={`${GlobalStyle.cardContainer} w-full`}>
          <div className="flex flex-wrap items-center justify-end w-full space-x-4 space-y-3">

            {/* Filter Section */}
            <select
              value={rtom}
              onChange={(e) => setRtom(e.target.value)}
              className={`${GlobalStyle.selectBox} mt-3`}
              style={{ color: rtom === "" ? "gray" : "black" }}
            >
              <option value="" hidden>RTOM</option>
              {Object.values(rtomList).map((rtom) => (
                <option key={rtom.rtom_id} value={rtom.rtom} style={{ color: "black" }}>
                  {rtom.rtom}
                </option>
              ))}
            </select>

            <select
              value={selectedDRC}
              onChange={(e) => setSelectedDRC(e.target.value)}
              className={`${GlobalStyle.selectBox} mt-3`}
              style={{ color: selectedDRC === "" ? "gray" : "black" }}
            >
              <option value="" hidden>DRC</option>
              {activeDRC.map((drc) => (
                <option key={drc.key} value={drc.id.toString()} style={{ color: "black" }}>
                  {drc.value}
                </option>
              ))}
            </select>

            <select
              value={selectedBand}
              onChange={(e) => setSelectedBand(e.target.value)}
              className={`${GlobalStyle.selectBox} mt-3`}
              style={{ color: selectedBand === "" ? "gray" : "black" }}
            >
              <option value="">Arrears Band</option>
              {arrearsBand.map(({ key, value }) => (
                <option key={key} value={value} style={{ color: "black" }}>
                  {value}
                </option>
              ))}
            </select>

            <select
              value={selectedServiceType}
              onChange={(e) => setSelectedServiceType(e.target.value)}
              className={`${GlobalStyle.selectBox} mt-3`}
              style={{ color: selectedServiceType === "" ? "gray" : "black" }}
            >
              <option value="">Service Type</option>
              {serviceTypes.map((service) => (
                <option key={service.key} value={service.id.toString()} style={{ color: "black" }}>
                  {service.value}
                </option>
              ))}
            </select>

            {/* Date + Buttons in one row */}
            <div className="flex flex-wrap items-center justify-end space-x-3 w-full mt-2">
              <label className={GlobalStyle.dataPickerDate}>Date:</label>

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
                className={`${GlobalStyle.inputText} w-full sm:w-auto`}
              />

              <button
                className={`${GlobalStyle.buttonPrimary} w-full sm:w-auto`}
                onClick={handleFilterButton}
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

      {/* Search Bar */}
      <div className="mb-4 flex items-center">
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
      <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
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
              filteredDataBySearch.map((row, index) => {
                const createdDate = row.createddtm
                  ? new Date(row.createddtm).toISOString().split('T')[0]
                  : '';

                const lastPaidDate = row.lastpaymentdate
                  ? new Date(row.lastpaymentdate).toISOString().split('T')[0]
                  : '';

                return (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? "bg-white bg-opacity-75" : "bg-gray-50 bg-opacity-50"} border-b`}
                  >
                    <td className={GlobalStyle.tableData}>{row.caseid}</td>
                    <td className={GlobalStyle.tableData}>{row.casecurrentstatus}</td>
                    <td className={GlobalStyle.tableData}>{row.accountno}</td>
                    <td className={GlobalStyle.tableData}>{row.drccommisionrule}</td>
                    <td className={GlobalStyle.tableData}>{row.currentarrearsamount}</td>
                    <td className={GlobalStyle.tableData}>{row.rtom}</td>
                    <td className={GlobalStyle.tableData}>{createdDate}</td>
                    <td className={GlobalStyle.tableData}>{lastPaidDate}</td>
                  </tr>
                );
              })
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

      {/* Pagination Section */}
      {filteredData.length !== 0 && (
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
      )}

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