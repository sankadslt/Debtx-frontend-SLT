// /*Purpose: 
// Created Date: 2025.01.22
// Created By: Buthmi Mithara
// Last Modified Date: 2025.01.24
// Modified By:Nadali Linara
//             K.H.Lasandi Randini  
// Version: node 11
// ui number : 1.7.3
// Dependencies: tailwind css
// Related Files: 
// Notes: 
// */


// import { useState, useEffect } from "react";
// import DatePicker from "react-datepicker";
// import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";

// import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
// import Open_CPE_Collect from "../../assets/images/Open_CPE_Collect.png";
// import { List_Incidents_CPE_Collect,Forward_CPE_Collect } from "../../services/Incidents/incidentService";
// import { Create_Task,Create_Task_for_Forward_CPECollect, Open_Task_Count_Forward_CPE_Collect} from "../../services/task/taskService.js";
// import Swal from "sweetalert2";

// export default function CollectOnlyCPECollect() {
//   const [fromDate, setFromDate] = useState(null);
//   const [toDate, setToDate] = useState(null);
//   const [error, setError] = useState("");
//   const [selectAllData, setSelectAllData] = useState(false);
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(0);
//   const [selectedSource, setSelectedSource] = useState("");
//   const [tableData, setTableData] = useState([]);
//   const [isProcessing, setIsProcessing] = useState(false);
// const [openTaskCount, setOpenTaskCount] = useState(0); 

//   const rowsPerPage = 7;


//   const fetchData = async () => {
//     try {
      
//       const response = await List_Incidents_CPE_Collect();
//       setTableData(response.data);
//     } catch (err) {
//       setError(err.message || "Failed to fetch incidents.");
//     } 
   
//   };
  
//   useEffect(() => {
//     fetchData();
//     fetchOpenTaskCount();
//   }, []); 
  
//   const fetchOpenTaskCount = async () => {
//     try {
//       const data = await Open_Task_Count_Forward_CPE_Collect();
//       setOpenTaskCount(data.openTaskCount || 0);
//       console.log("Open Task Count Response:", data.openTaskCount );
//     } catch (error) {
//       console.error("Error fetching open task count:", error);
//     }
//   };

 
  
//   const handleFilterClick = () => {
//     const from = fromDate ? new Date(fromDate) : null;
//     const to = toDate ? new Date(toDate) : null;
  
//     if (!selectedSource && !from && !to) {
//       Swal.fire({
//         title: "Missing Filters",
//         text: "Please select a Source Type or provide both From Date and To Date.",
//         icon: "warning",
//         confirmButtonText: "OK",
//       });
//       return;
//     }
  
//     if ((from && !to) || (!from && to)) {
//       Swal.fire({
//         title: "Incomplete Date Range",
//         text: "Both From Date and To Date must be selected together.",
//         icon: "warning",
//         confirmButtonText: "OK",
//       });
//       return;
//     }
  
//     if (selectedSource || (from && to)) {
//       if (from && to) {
//         const monthDiff =
//           (to.getFullYear() - from.getFullYear()) * 12 +
//           (to.getMonth() - from.getMonth());
  
//         if (monthDiff > 1 || (monthDiff === 1 && to.getDate() > from.getDate())) {
//           Swal.fire({
//             title: "Long Date Range",
//             text: "The selected date range exceeds one month. Consider creating a task instead.",
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonText: "Create Task",
//             cancelButtonText: "Cancel",
//           }).then((result) => {
//             if (result.isConfirmed) {
//               handleCreateTask(); // Trigger task creation
//             }
//           });
//           return;
//         }
//       }
//       handleFilter();  // Call the existing filter function if validation passes
//     }
//   };

  
//   const handleFilter = async () => {
//     try {
//       const filters = {
//         Source_Type: selectedSource || null,
//         From_Date: fromDate ? fromDate.toISOString().split("T")[0] : null,
//         To_Date: toDate ? toDate.toISOString().split("T")[0] : null,
//       };
  
//       const response = await List_Incidents_CPE_Collect(filters);
//       setTableData(response.data); 
//       setCurrentPage(0); 
//     } catch (err) {
//       setError(err.message || "Failed to fetch filtered incidents.");
//     }
//   };
  
  
    
//     const handleCreateTask = async () => {
//       const filteredParams = {
//         Source_Type: selectedSource || null,
//         From_Date: fromDate ? fromDate.toISOString().split("T")[0] : null,
//         To_Date: toDate ? toDate.toISOString().split("T")[0] : null,
//       };
    
//       if (!filteredParams.Source_Type && !filteredParams.From_Date && !filteredParams.To_Date) {
//         Swal.fire({
//           title: "Validation Error",
//           text: "Please provide at least one filter parameter to create a task.",
//           icon: "warning",
//           confirmButtonText: "OK",
//         });
//         return;
//       }
    
//       try {
//         const response = await Create_Task(filteredParams);
    
//         if (response?.Task_Id) {
//           Swal.fire({
//             title: "Task Created Successfully!",
//             text: `Task ID: ${response.Task_Id}`,
//             icon: "success",
//             confirmButtonText: "OK",
//           });
    
          
//       setFromDate(null);
//       setToDate(null);
//       setSelectedSource("");

          
//           const updatedResponse = await List_Incidents_CPE_Collect();
//           setTableData(updatedResponse.data); 
//         } else {
//           throw new Error("Task ID is missing in the response.");
//         }
//       } catch (err) {
//         Swal.fire({
//           title: "Error",
//           text: `Failed to create task. Error: ${err.message || "Unknown error"}`,
//           icon: "error",
//           confirmButtonText: "OK",
//         });
//       }
//     };
    


// // const forwardCPECollect = async () => {
// //   if (selectedRows.length === 0) {
// //     Swal.fire({
// //       title: "Warning",
// //       text: "Please select at least one incident.",
// //       icon: "warning",
// //       confirmButtonText: "OK",
// //     });
// //     return;
// //   }

// //   setIsProcessing(true); // Disable UI interactions during API call

// //   try {
// //     const latestCount = await fetchOpenTaskCount();  // Ensure this function returns a value

// //     console.log("Latest Open Task Count:", latestCount);

// //     if (latestCount > 0) {
// //       Swal.fire({
// //         title: "Task Already in Progress",
// //         text: `There are already ${latestCount} open tasks. Please wait until they are completed before proceeding.`,
// //         icon: "warning",
// //         confirmButtonText: "OK",
// //       });

// //       setIsProcessing(false);
// //       return;
// //     }

// //     if (selectedRows.length > 10) {
// //       const taskParams = {
// //         Incident_Status: "Open CPE Collect",
// //         Incident_Ids: selectedRows, // Include all selected rows
// //       };

// //       console.log("Task Params:", taskParams);

// //       const response = await Create_Task_for_Forward_CPECollect(taskParams);

// //       console.log("Response from Create_Task:", response);

// //       Swal.fire({
// //         title: "Task Created Successfully!",
// //         text: `Task created to handle ${selectedRows.length} incidents.`,
// //         icon: "success",
// //         confirmButtonText: "OK",
// //       });
// //     } else {
// //       const response = await Forward_CPE_Collect({ Incident_Ids: selectedRows });

// //       console.log("Response from Create_Case:", response);

// //       Swal.fire({
// //         title: "Cases Created Successfully!",
// //         text: `Successfully created ${response.cases.length} cases.`,
// //         icon: "success",
// //         confirmButtonText: "OK",
// //       });
// //     }

// //     setSelectedRows([]); // Clear selected rows after action
// //   } catch (error) {
// //     console.error("Error in forwardCPECollect:", error);
// //     Swal.fire({
// //       title: "Error",
// //       text: error.message || "Failed to perform the action.",
// //       icon: "error",
// //       confirmButtonText: "OK",
// //     });
// //   } finally {
// //     await fetchData(); // Refresh table data
// //     await fetchOpenTaskCount(); // 🔹 Ensure `openTaskCount` is updated again
// //     setIsProcessing(false); // Re-enable UI interactions
// //   }
// // };


// // const forwardCPECollect = async () => {
// //   if (selectedRows.length === 0) {
// //     Swal.fire({ title: "Warning", text: "Please select at least one incident.", icon: "warning", confirmButtonText: "OK" });
// //     return;
// //   }

// //   setIsProcessing(true);

// //   try {
// //     await fetchOpenTaskCount();
// //     if (openTaskCount > 0) {
// //       Swal.fire({ title: "Task in Progress", text: `There are already ${openTaskCount} open tasks.`, icon: "warning", confirmButtonText: "OK" });
// //       return;
// //     }

// //     if (selectedRows.length > 10) {
// //       const taskParams = { Incident_Status: "Open CPE Collect", Incident_Ids: selectedRows };
// //       await Create_Task_for_Forward_CPECollect(taskParams);
// //       Swal.fire({ title: "Task Created!", text: `Task created for ${selectedRows.length} incidents.`, icon: "success", confirmButtonText: "OK" });
// //     } else {
// //       await Forward_CPE_Collect({ Incident_Ids: selectedRows });
// //       Swal.fire({ title: "Success", text: "Incidents forwarded successfully.", icon: "success", confirmButtonText: "OK" });
// //     }
// //     setSelectedRows([]);
// //   } catch (error) {
// //     Swal.fire({ title: "Error", text: error.message || "Failed to perform the action.", icon: "error", confirmButtonText: "OK" });
// //   } finally {
// //     await fetchData();
// //     await fetchOpenTaskCount();
// //     setIsProcessing(false);
// //   }
// // };

// const forwardCPECollect = async () => {
//   if (selectedRows.length === 0) {
//     Swal.fire({
//       title: "Warning",
//       text: "Please select at least one incident.",
//       icon: "warning",
//       confirmButtonText: "OK",
//     });
//     return;
//   }

//   setIsProcessing(true);

//   try {
//     await fetchOpenTaskCount();
//     if (openTaskCount > 0) {
//       Swal.fire({
//         title: "Task in Progress",
//         text: `There are already ${openTaskCount} open tasks.`,
//         icon: "warning",
//         confirmButtonText: "OK",
//       });
//       setIsProcessing(false);
//       return;
//     }

//     let response;
//     if (selectedRows.length > 10) {
//       const taskParams = { Incident_Status: "Open CPE Collect", Incident_Ids: selectedRows };
//       response = await Create_Task_for_Forward_CPECollect(taskParams);
//       console.log("Response from Create_Task:", response);

//       Swal.fire({
//         title: "Task Created Successfully!",
//         text: `Task created to handle ${selectedRows.length} incidents.`,
//         icon: "success",
//         confirmButtonText: "OK",
//       });
//     } else {
//       response = await Forward_CPE_Collect({ Incident_Ids: selectedRows });
//       console.log("Response from Forward_CPE_Collect:", response);

//       if (response && response.cases) {
//         Swal.fire({
//           title: "Cases Created Successfully!",
//           text: `Successfully created ${response.cases.length} cases.`,
//           icon: "success",
//           confirmButtonText: "OK",
//         });
//       } else {
//         Swal.fire({
//           title: "Success",
//           text: "Incidents forwarded successfully.",
//           icon: "success",
//           confirmButtonText: "OK",
//         });
//       }
//     }

//     setSelectedRows([]); // Clear selected rows after action
//   } catch (error) {
//     console.error("Error in forwardCPECollect:", error);
//     Swal.fire({
//       title: "Error",
//       text: error.message || "Failed to perform the action.",
//       icon: "error",
//       confirmButtonText: "OK",
//     });
//   } finally {
//     await fetchData();
//     await fetchOpenTaskCount();
//     setIsProcessing(false);
//   }
// };

//   const filteredData = tableData.filter((row) =>
//     Object.values(row)
//       .join(" ")
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase())
//   );

//   const pages = Math.ceil(filteredData.length / rowsPerPage);

//   const handlePrevPage = () => {
//     if (currentPage > 0) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const handleNextPage = () => {
//     if (currentPage < pages - 1) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const startIndex = currentPage * rowsPerPage;
//   const endIndex = startIndex + rowsPerPage;
//   const paginatedData = filteredData.slice(startIndex, endIndex);

//   const handleRowCheckboxChange = (Incident_Id) => {
//     if (selectedRows.includes(Incident_Id)) {
//       setSelectedRows(selectedRows.filter((id) => id !== Incident_Id));
//     } else {
//       setSelectedRows([...selectedRows, Incident_Id]);
//     }
//   };

//   // const handleRowCheckboxChange = (Incident_Id) => {
//   //   if (isLocked) return;  // Prevent selection if locked
//   //   if (selectedRows.includes(Incident_Id)) {
//   //     setSelectedRows(selectedRows.filter((id) => id !== Incident_Id));
//   //   } else {
//   //     setSelectedRows([...selectedRows, Incident_Id]);
//   //   }
//   // };
  
//   const handleSelectAllDataChange = () => {
//     if (selectAllData) {
//       setSelectedRows([]);
//     } else {
//       setSelectedRows(tableData.map((row) => row.Incident_Id));
//     }
//     setSelectAllData(!selectAllData);
//   };

//   const handleFromDateChange = (date) => {
//     if (toDate && date > toDate) {
//       setError("The 'From' date cannot be later than the 'To' date.");
//     } else {
//       setError("");
//       setFromDate(date);
//     }
//   };

//   const handleToDateChange = (date) => {
//     if (fromDate && date < fromDate) {
//       setError("The 'To' date cannot be earlier than the 'From' date.");
//     } else {
//       setError("");
//       setToDate(date);
//     }
//   };

 
//   return (
//     <div className={GlobalStyle.fontPoppins}>
//       <div className="flex justify-between items-center w-full gap-4">
//       <h1 className={`${GlobalStyle.headingLarge} m-0 pr-4`}>
//           Incidents Ready for Distribute to Collect Only CPE
//         </h1>
//         <button
//           className={`${GlobalStyle.buttonPrimary} pr-4`}
//          onClick={handleCreateTask}
       
//         >
//           Create task and let me know
//         </button>
//       </div>

     
//       <div className="flex justify-end gap-10 my-12 items-center">
      
//         <div className="flex items-center gap-4">
//           <label>Source:</label>
//           <select
//             className={GlobalStyle.inputText}
//             value={selectedSource}
//             onChange={(e) => setSelectedSource(e.target.value)}
//           >
//             <option value="">Select</option>
//             <option value="Pilot Suspended">Pilot Suspended</option>
//             <option value="Special">Special</option>
//             <option value="Product Terminate">Product Terminate</option>
//           </select>
//         </div>

       
//         <div className="flex items-center gap-4">
//           <label>Date:</label>
//           <DatePicker
//             selected={fromDate}
//             onChange={handleFromDateChange}
//             dateFormat="dd/MM/yyyy"
//             placeholderText="dd/MM/yyyy"
//             className={GlobalStyle.inputText}
//           />
//           <DatePicker
//             selected={toDate}
//             onChange={handleToDateChange}
//             dateFormat="dd/MM/yyyy"
//             placeholderText="dd/MM/yyyy"
//             className={GlobalStyle.inputText}
//           />
//           {error && <span className={GlobalStyle.errorText}>{error}</span>}
//         </div>

       
//         {/* <button
//           className={`${GlobalStyle.buttonPrimary} h-[35px]`}
//           onClick={handleFilter}
//         >
//           Filter
//         </button> */}
//         <button
//   className={`${GlobalStyle.buttonPrimary} h-[35px]`}
//   onClick={handleFilterClick}   // Use handleFilterClick here
// >
//   Filter
// </button>
//       </div>

     
//       <div className="flex flex-col">
        
//       <div className="mb-4 flex justify-start">
//         <div className={GlobalStyle.searchBarContainer}>
//           <input
//             type="text"
//             placeholder="Search..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className={GlobalStyle.inputSearch}
//           />
//           <FaSearch className={GlobalStyle.searchBarIcon} />
//         </div>
//       </div>
//         <div className={GlobalStyle.tableContainer}>
//           <table className={GlobalStyle.table}>
//             <thead className={GlobalStyle.thead}>
//               <tr>
//                 <th scope="col" className={GlobalStyle.tableHeader}></th>
//                 <th scope="col" className={GlobalStyle.tableHeader}>
//                   ID
//                 </th>
//                 <th scope="col" className={GlobalStyle.tableHeader}>
//                   Status
//                 </th>
//                 <th scope="col" className={GlobalStyle.tableHeader}>
//                   Account No.
//                 </th>
//                 <th scope="col" className={GlobalStyle.tableHeader}>
//                   Action
//                 </th>
//                 <th scope="col" className={GlobalStyle.tableHeader}>
//                   Source Type
//                 </th>
//                 <th scope="col" className={GlobalStyle.tableHeader}></th>
//               </tr>
//             </thead>
//             <tbody>
//               {paginatedData?.map((row, index) => (
//                 <tr
//                   key={index}
//                   className={`${
//                     index % 2 === 0
//                       ? "bg-white bg-opacity-75"
//                       : "bg-gray-50 bg-opacity-50"
//                   } border-b`}
//                 >
//                   <td className={GlobalStyle.tableData}>
//                     <input
//                       type="checkbox"
//                       className={"rounded-lg"}
//                       checked={selectedRows.includes(row.Incident_Id)}
//                       onChange={() => handleRowCheckboxChange(row.Incident_Id)}
//                     />
//                   </td>
//                   <td className={GlobalStyle.tableData}>
//                     <a href={`#${row.Incident_Id}`} className="hover:underline">
//                       {row.Incident_Id}
//                     </a>
//                   </td>
//                   <td className={GlobalStyle.tableData}>
//                     <div className="flex justify-center items-center h-full">
//                       {row.Incident_Status === "Open CPE Collect" && (
//                         <div
//                           title="Open CPE Collect"
//                           aria-label="Open CPE Collect"
//                         >
//                           <img
//                             src={Open_CPE_Collect}
//                             alt="Open CPE Collect"
//                             className="w-5 h-5"
//                           />
//                         </div>
//                       )}
//                     </div>
//                   </td>

//                   <td className={GlobalStyle.tableData}>{row.Account_Num}</td>
                 
//                   <td className={GlobalStyle.tableData}>{row.Action}</td>
//                   <td className={GlobalStyle.tableData}>{row.Source_Type}</td>
//                   <td
//                     className={`${GlobalStyle.tableData} text-center px-6 py-4`}
//                   >
//                     {/* <button
//                       className={`${GlobalStyle.buttonPrimary} mx-auto`}
//                       onClick={forwardCPECollect}
//                     >
//                       Proceed
//                     </button> */}
//                     {/* <button
//   className={`${GlobalStyle.buttonPrimary} ml-4`}
//   onClick={forwardCPECollect}
//   disabled={isProcessing || selectedRows.length === 0 || isLocked}
// >
//   Proceed
// </button> */}
// <button
//   className={`${GlobalStyle.buttonPrimary} ml-4`}
//   onClick={forwardCPECollect}
//   disabled={isProcessing || selectedRows.length === 0 || openTaskCount > 0}
// >
//   Proceed
// </button>
//                   </td>
//                 </tr>
//               ))}
//               {paginatedData.length === 0 && (
//                 <tr>
//                   <td colSpan="6" className="text-center py-4">
//                     No results found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

     
//       {tableData.length > rowsPerPage && (
//         <div className={GlobalStyle.navButtonContainer}>
//           <button
//             className={GlobalStyle.navButton}
//             onClick={handlePrevPage}
//             disabled={currentPage === 0}
//           >
//             <FaArrowLeft />
//           </button>
//           <span>
//             Page {currentPage + 1} of {pages}
//           </span>
//           <button
//             className={GlobalStyle.navButton}
//             onClick={handleNextPage}
//             disabled={currentPage === pages - 1}
//           >
//             <FaArrowRight />
//           </button>
//         </div>
//       )}

//       <div className="flex justify-end items-center w-full mt-6">
        
//         <label className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             className="rounded-lg"
//             checked={
//               selectAllData ||
//               tableData.every((row) =>
//                 selectedRows.includes(row.Incident_Id)
//               )
//             }
//             onChange={handleSelectAllDataChange}
//           />
//           Select All Data
//         </label>
// {/*     
//         <button
//   className={`${GlobalStyle.buttonPrimary} ml-4`}
//   onClick={forwardCPECollect}
//   disabled={isProcessing || selectedRows.length === 0 || isLocked}
// >
//   Proceed
// </button> */}
// <button
//   className={`${GlobalStyle.buttonPrimary} ml-4`}
//   onClick={forwardCPECollect}
//   disabled={isProcessing || selectedRows.length === 0 || openTaskCount > 0}
// >
//   Proceed
// </button>
//       </div>
//     </div>
//   );
// }

/*Purpose: 
Created Date: 2025.01.22
Created By: Buthmi Mithara
Last Modified Date: 2025.01.24
Modified By:Nadali Linara
            K.H.Lasandi Randini  
Version: node 11
ui number : 1.7.3
Dependencies: tailwind css
Related Files: 
Notes: 
*/


import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";

import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import Open_CPE_Collect from "../../assets/images/Open_CPE_Collect.png";
import { List_Incidents_CPE_Collect,Forward_CPE_Collect } from "../../services/Incidents/incidentService";
import { Create_Task,Create_Task_for_Forward_CPECollect, Open_Task_Count_Forward_CPE_Collect} from "../../services/task/taskService.js";
import Swal from "sweetalert2";

export default function CollectOnlyCPECollect() {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [error, setError] = useState("");
  const [selectAllData, setSelectAllData] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedSource, setSelectedSource] = useState("");
  const [tableData, setTableData] = useState([]);
const [isloading, setIsLoading] = useState(true);
  const [filteredData, setFilteredData] = useState(tableData);
  const rowsPerPage = 7;

  const fetchData = async () => {
      try {
        const filters= {
          Source_Type:selectedSource,
          FromDate:fromDate,
          ToDate:toDate
        }
  
        const response = await List_Incidents_CPE_Collect(filters);
        const formattedData = response?.data.map((item) => {
          
          const createdDateStr = typeof item.Created_Dtm === "string" ? item.Created_Dtm.replace(" ", "T") : item.Created_Dtm;
          const createdDate = createdDateStr ? new Date(createdDateStr) : null;
          
          return {
            id: item.Incident_Id || "N/A",
            status: item.Incident_Status || "N/A",
            account_num: item.Account_Num || "N/A",
          action: item.Action || "N/A",
            source_type: item?.Source_Type || "N/A",
            created_dtm: isNaN(createdDate) ? "N/A" : createdDate.toLocaleString() || "N/A"
          };
        });
        setTableData(formattedData);
        setIsLoading(false);
      } catch (error){
        console.log(error)
       
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, []);

  const handleCreateTaskForDownload = async({source_type, fromDate, toDate}) => {
 
     if(!source_type && !fromDate && !toDate){
       Swal.fire({
         title: 'Warning',
         text: 'Missing Parameters',
         icon: 'warning',
         confirmButtonText: 'OK'
       });
     }
     else if ((fromDate && !toDate) || (!fromDate && toDate)) {
       Swal.fire({
         title: "Incomplete Date Range",
         text: "Both From Date and To Date must be selected together.",
         icon: "warning",
         confirmButtonText: "OK",
       });
       return;
     } else{
     try{
       const filteredParams = {
         Source_Type:source_type,
         FromDate:fromDate,
         ToDate:toDate
       }
       const response = await Create_Task(filteredParams);
       if(response.status===201){
         Swal.fire({ 
           title: 'Success',
           text: 'Task successfully created',
           icon: 'success',
           confirmButtonText: 'OK'
         });
       }
     }catch{
       Swal.fire({
         title: 'Error',
         text: 'Error creating task',
         icon: 'error',
         confirmButtonText: 'OK'
       });
     }
     }
   };
 
    const handleProceed = async (Incident_Id) => {
       if (!selectedRows.includes(Incident_Id)) {
         Swal.fire({
           title: "Warning",
           text: "Row not selected",
           icon: "warning",
           confirmButtonText: "OK",
         });
         return;
       }
       try {
         const openTaskCount = await Open_Task_Count_Forward_CPE_Collect();
         if (openTaskCount > 0) {
           Swal.fire({
             title: "Warning",
             text: "A task is already in progress.",
             icon: "warning",
             confirmButtonText: "OK",
           });
           return;
         }
         const response = await Forward_CPE_Collect(Incident_Id);
         if (response.status === 201) {
           Swal.fire({
             title: "Success",
             text: response.data.message,
             icon: "success",
             confirmButtonText: "OK",
           });
           fetchData();
         }
       } catch (error) {
         Swal.fire({
           title: "Error",
           text: error.message,
           icon: "error",
           confirmButtonText: "OK",
         });
       }
     };
     
   
     const handleCreate = async () => {
       try {
         if (filteredData.length === 0) {
           Swal.fire({
             title: "Warning",
             text: "No data.",
             icon: "warning",
             confirmButtonText: "OK",
           });
           return;
         }
         const openTaskCount = await Open_Task_Count_Forward_CPE_Collect();
         if (openTaskCount > 0) {
           Swal.fire({
             title: "Warning",
             text: "A task is already in progress.",
             icon: "warning",
             confirmButtonText: "OK",
           });
           return;
         }
         if (filteredData.length > 10) {
           const parameters = {
             Status: "Direct LOD",
             Inncident_Ids: selectedRows,
           };
     
           const response = await Create_Task_for_Forward_CPECollect(parameters);
           if (response.status === 201) {
             Swal.fire({
               title: "Success",
               text: "Successfully created task to forward the direct LOD incidents",
               icon: "success",
               confirmButtonText: "OK",
             });
           }
         } else {
           for (const row of selectedRows) {
             await Forward_CPE_Collect(row);
           }
           Swal.fire({
             title: "Success",
             text: "Successfully forwarded the direct LOD incidents",
             icon: "success",
             confirmButtonText: "OK",
           });
     
           fetchData();
         }
       } catch {
         Swal.fire({
           title: "Error",
           text: "Internal server error",
           icon: "error",
           confirmButtonText: "OK",
         });
       }
     };
  
     // validation for date
  const handleFromDateChange = (date) => {
    if (toDate && date > toDate) {
      setError("The 'From' date cannot be later than the 'To' date.");
    } else {
      setError("");
      setFromDate(date);
    }
  };

  // validation for date
  const handleToDateChange = (date) => {
    if (fromDate && date < fromDate) {
      setError("The 'To' date cannot be earlier than the 'From' date.");
    } else {
      setError("");
      setToDate(date);
    }
  };

  //search fuction
    useEffect(() => {
      setFilteredData(
        tableData.filter((row) =>
          Object.values(row)
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      );
    }, [searchQuery, tableData]);
  
    // Calculate total pages
    const pages = Math.ceil(filteredData.length / rowsPerPage);
  
    const handlePrevPage = () => {
      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    };
  
    const handleNextPage = () => {
      if (currentPage < pages - 1) {
        setCurrentPage(currentPage + 1);
      }
    };
  
    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);
  
    const handleRowCheckboxChange = (id) => {
      if (selectedRows.includes(id)) {
        setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
      } else {
        setSelectedRows([...selectedRows, id]);
      }
    };
  
    const handleSelectAllDataChange = () => {
      if (selectAllData) {
        setSelectedRows([]); // Clear all selections
      } else {
        setSelectedRows(filteredData.map((row) => row.id)); // Select all visible rows
      }
      setSelectAllData(!selectAllData);
    };
  
    const handleFilterClick = () => {
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
      
      if (!selectedSource && !from && !to) {
        Swal.fire({
          title: "Missing Filters",
          text: "Please select a Source Type or provide both From Date and To Date.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }
    
      if ((from && !to) || (!from && to)) {
        Swal.fire({
          title: "Incomplete Date Range",
          text: "Both From Date and To Date must be selected together.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }
    
      if (selectedSource || (from && to)) {
        if (from && to) {
          const monthDiff = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
    
          if (monthDiff > 1 || (monthDiff === 1 && to.getDate() > from.getDate())) {
            Swal.fire({
              title: "Long Date Range",
              text: "The selected date range exceeds one month. Consider creating a task instead.",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Create Task",
              cancelButtonText: "Cancel",
            }).then((result) => {
              if (result.isConfirmed) {
                handleCreateTaskForDownload({
                  source_type: selectedSource, 
                  fromDate: fromDate, 
                  toDate: toDate
                })
              } 
            });
            return;
          }
        }
        fetchData(); 
      }
    };

 
  return (
    <div className={GlobalStyle.fontPoppins}>
       {isloading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
      <div className={GlobalStyle.fontPoppins}>
        <div className="flex justify-between items-center w-full">
          <h1 className={`${GlobalStyle.headingLarge} m-0`}>
          Incidents for Distribute to Collect Only CPE
          </h1>
          <button
            className={`${GlobalStyle.buttonPrimary}`}
            onClick={()=>{handleCreateTaskForDownload({
              source_type: selectedSource, 
              fromDate: fromDate, 
              toDate: toDate
            })}}
          >
            Create task and let me know
          </button>
        </div>
     
      <div className="flex justify-end gap-10 my-12 items-center">
      
        <div className="flex items-center gap-4">
          <label>Source:</label>
          <select
            className={GlobalStyle.inputText}
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
          >
            <option value="">Select</option>
            <option value="Pilot Suspended">Pilot Suspended</option>
            <option value="Special">Special</option>
            <option value="Product Terminate">Product Terminate</option>
          </select>
        </div>

       
        <div className="flex items-center gap-4">
            <label>Date:</label>
            <DatePicker
              selected={fromDate}
              onChange={handleFromDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/MM/yyyy"
              className={GlobalStyle.inputText}
            />
            <DatePicker
              selected={toDate}
              onChange={handleToDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/MM/yyyy"
              className={GlobalStyle.inputText}
            />
            {error && <span className={GlobalStyle.errorText}>{error}</span>}
          </div>

       
        {/* <button
          className={`${GlobalStyle.buttonPrimary} h-[35px]`}
          onClick={handleFilter}
        >
          Filter
        </button> */}
        <button
  className={`${GlobalStyle.buttonPrimary} h-[35px]`}
  onClick={handleFilterClick}   // Use handleFilterClick here
>
  Filter
</button>
      </div>

     
      <div className="flex flex-col">
        
      <div className="mb-4 flex justify-start">
        <div className={GlobalStyle.searchBarContainer}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={GlobalStyle.inputSearch}
          />
          <FaSearch className={GlobalStyle.searchBarIcon} />
        </div>
      </div>
        <div className={GlobalStyle.tableContainer}>
          <table className={GlobalStyle.table}>
            <thead className={GlobalStyle.thead}>
              <tr>
                <th scope="col" className={GlobalStyle.tableHeader}></th>
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
                  Action
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Source Type
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}></th>
              </tr>
            </thead>
            <tbody>
              {paginatedData?.map((row, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? "bg-white bg-opacity-75"
                      : "bg-gray-50 bg-opacity-50"
                  } border-b`}
                >
                  <td className={GlobalStyle.tableData}>
                    <input
                      type="checkbox"
                      className={"rounded-lg"}
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleRowCheckboxChange(row.id)}
                    />
                  </td>
                  <td className={GlobalStyle.tableData}>
                    <a href={`#${row.id}`} className="hover:underline">
                      {row.id}
                    </a>
                  </td>
                  <td className={GlobalStyle.tableData}>
                    <div className="flex justify-center items-center h-full">
                      {row.status === "Open CPE Collect" && (
                        <div
                          title="Open CPE Collect"
                          aria-label="Open CPE Collect"
                        >
                          <img
                            src={Open_CPE_Collect}
                            alt="Open CPE Collect"
                            className="w-5 h-5"
                          />
                        </div>
                      )}
                    </div>
                  </td>

                  <td className={GlobalStyle.tableData}>{row.account_num}</td>
                 
                  <td className={GlobalStyle.tableData}>{row.action}</td>
                  <td className={GlobalStyle.tableData}>{row.source_type}</td>
                  <td
                    className={`${GlobalStyle.tableData} text-center px-6 py-4`}
                  >
                   
            
<button
                        className={`${GlobalStyle.buttonPrimary} mx-auto`}
                        onClick={()=>{handleProceed(row.id)}}
                      >
                        Proceed
                      </button>
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

     
      {tableData.length > rowsPerPage && (
        <div className={GlobalStyle.navButtonContainer}>
          <button
            className={GlobalStyle.navButton}
            onClick={handlePrevPage}
            disabled={currentPage === 0}
          >
            <FaArrowLeft />
          </button>
          <span>
            Page {currentPage + 1} of {pages}
          </span>
          <button
            className={GlobalStyle.navButton}
            onClick={handleNextPage}
            disabled={currentPage === pages - 1}
          >
            <FaArrowRight />
          </button>
        </div>
      )}

      <div className="flex justify-end items-center w-full mt-6">
        
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="rounded-lg"
            checked={
              selectAllData ||
              tableData.every((row) =>
                selectedRows.includes(row.id)
              )
            }
            onChange={handleSelectAllDataChange}
          />
          Select All Data
        </label>

        <button
            className={`${GlobalStyle.buttonPrimary} ml-4`}
            onClick={handleCreate}
          >
           Proceed
          </button>

      </div>
      </div>
      )}
    </div>
  );
}