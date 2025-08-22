// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import GlobalStyle from "../../assets/prototype/GlobalStyle";
// import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
// import { List_All_RO_and_DRCuser_Details_to_SLT } from "../../services/RO/RO.js";
// import { Active_DRC_Details } from "/src/services/drc/Drc.js";
// import Swal from "sweetalert2";

// import RO_Active from "../../assets/images/status/RO_DRC_Status_Icons/RO_Active.svg";
// import RO_Inactive from "../../assets/images/status/RO_DRC_Status_Icons/RO_Inactive.svg";
// import RO_Terminate from "../../assets/images/status/RO_DRC_Status_Icons/RO_Terminate.svg";

// export default function ROList() {
//   const [data, setData] = useState([]);
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [selectedDRC, setSelectedDRC] = useState("");
//   const [drcNames, setDrcNames] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isFilterApplied, setIsFilterApplied] = useState(false);

//   const rowsPerPage = 10;
//   const navigate = useNavigate();

//   // Fetch DRC names
//   useEffect(() => {
//     const fetchDRCNames = async () => {
//       try {
//         const names = await Active_DRC_Details();
//         setDrcNames(names);
//         console.log("Fetched DRC Names:", names);
//       } catch (error) {
//         console.error("Error fetching DRC names:", error);
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: "Failed to fetch DRC names. Please try again later.",
//         });
//       }
//     };
//     fetchDRCNames();
//   }, []);

//   const handleFilter = async () => {
//     try {
//       const payload = {
//         drcUser_status: selectedStatus || null,
//         drc_id: selectedDRC || null,
//         search: searchQuery || null,
//         pages: currentPage,
//       };

//       console.log("Payload sent to API: ", payload);
//       setIsLoading(true);

//       const response = await List_All_RO_and_DRCuser_Details_to_SLT(payload).catch((error) => {
//         if (error.response?.status === 404) {
//           return null;
//         }
//         throw error;
//       });

//       setIsLoading(false);

//       if (response && response.data) {
//         const newList = response.data;
//         console.log("Valid data received:", newList);
//         setData(newList);
//         setTotalPages(Math.ceil(response.total_records / rowsPerPage));
//       } else {
//         setData([]);
//         Swal.fire({
//           icon: "info",
//           title: "No Data",
//           text: "No records found for the applied filters.",
//         });
//       }
//     } catch (error) {
//       setIsLoading(false);
//       console.error("Error during filtering: ", error);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to fetch data. Please try again later.",
//       });
//     }
//   };

//   useEffect(() => {
//     if (isFilterApplied || !selectedStatus) {
//       handleFilter();
//     }
//   }, [currentPage, isFilterApplied]);

//   const handleStatusChange = (e) => {
//     setSelectedStatus(e.target.value);
//     setIsFilterApplied(false);
//   };

//   const handleDRCChange = (e) => {
//     const selectedValue = e.target.value;
//     const selected = drcNames.find(item => item.value === selectedValue);
//     setSelectedDRC(selected ? selected.key : "");
//     setIsFilterApplied(false);
//   };

//   const handleFilterButton = () => {
//     setCurrentPage(1);
//     setIsFilterApplied(true);
//   };

//   const handleClear = () => {
//     setSelectedStatus("");
//     setSelectedDRC("");
//     setSearchQuery("");
//     setIsFilterApplied(false);
//     setCurrentPage(1);
//     setData([]);
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "Active":
//         return <img src={RO_Active} alt="RO Active" title="RO Active" className="w-6 h-6 cursor-pointer" />;
//       case "Inactive":
//         return <img src={RO_Inactive} alt="RO Inactive" title="RO Inactive" className="w-6 h-6 cursor-pointer" />;
//       case "Terminate":
//         return <img src={RO_Terminate} alt="RO Terminate" title="RO Terminate" className="w-6 h-6 cursor-pointer" />;
//       default:
//         return null;
//     }
//   };

//   const filteredDataBySearch = searchQuery
//     ? data.filter((row) =>
//         [row.ro_name, row.nic, row.drc_name]
//           .join(" ")
//           .toLowerCase()
//           .includes(searchQuery.toLowerCase())
//       )
//     : data;

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className={`${GlobalStyle.fontPoppins} px-4 sm:px-6 lg:px-8`}>
//       <h2 className={`${GlobalStyle.headingLarge} text-xl sm:text-2xl lg:text-3xl mt-8`}>RO List</h2>

//       {/* Filters */}
//       <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mt-8 w-full">
//         <div className="w-full sm:w-fit sm:max-w-md">
//           <div className={GlobalStyle.searchBarContainer}>
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className={GlobalStyle.inputSearch}
//               aria-label="Search RO details"
//             />
//             <FaSearch className={GlobalStyle.searchBarIcon} />
//           </div>
//         </div>

//         <div className={`${GlobalStyle.cardContainer} flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-end items-stretch`}>
//           <select
//             name="drc"
//             value={drcNames.find(item => item.key === selectedDRC)?.value || ""}
//             onChange={handleDRCChange}
//             className={`${GlobalStyle.selectBox} w-full sm:w-32 md:w-40`}
//             style={{ color: selectedDRC === "" ? "gray" : "black" }}
//             aria-label="Select DRC filter"
//           >
//             <option value="" hidden>Drc</option>
//             {drcNames.map(({ key, value }) => (
//               <option key={key} value={value} style={{ color: "black" }}>
//                 {value}
//               </option>
//             ))}
//           </select>
//           <select
//             name="status"
//             value={selectedStatus}
//             onChange={handleStatusChange}
//             className={`${GlobalStyle.selectBox} w-full sm:w-32 md:w-40`}
//             aria-label="Select status filter"
//           >
//             <option value="">Select Status</option>
//             <option value="Active">Active</option>
//             <option value="Inactive">Inactive</option>
//             <option value="Terminate">Terminate</option>
//           </select>
//           <button
//             onClick={handleFilterButton}
//             className={`${GlobalStyle.buttonPrimary} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
//             disabled={isLoading}
//           >
//             {isLoading ? "Filtering..." : "Filter"}
//           </button>
//           <button
//             onClick={handleClear}
//             className={GlobalStyle.buttonRemove}
//             disabled={isLoading}
//           >
//             Clear
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className={`${GlobalStyle.tableContainer} overflow-x-auto mt-4`}>
//         <table className={`${GlobalStyle.table} table-auto w-full`} style={{ fontSize: '0.875rem' }} aria-label="RO List Table">
//           <thead className={GlobalStyle.thead}>
//             <tr>
//               <th className={`${GlobalStyle.tableHeader} min-w-[80px]`} scope="col">RO ID</th>
//               <th className={`${GlobalStyle.tableHeader} min-w-[100px]`} scope="col">DRC</th>
//               <th className={`${GlobalStyle.tableHeader} min-w-[80px]`} scope="col">Status</th>
//               <th className={`${GlobalStyle.tableHeader} min-w-[120px]`} scope="col">NIC</th>
//               <th className={`${GlobalStyle.tableHeader} min-w-[150px]`} scope="col">RO Name</th>
//               <th className={`${GlobalStyle.tableHeader} min-w-[120px]`} scope="col">Contact No.</th>
//               <th className={`${GlobalStyle.tableHeader} min-w-[120px]`} scope="col">RTOM Area count</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredDataBySearch.length > 0 ? (
//               filteredDataBySearch.map((item, index) => (
//                 <tr
//                   key={item.ro_id || index}
//                   className={`${
//                     index % 2 === 0 ? "bg-white bg-opacity-75" : "bg-gray-50 bg-opacity-50"
//                   } border-b`}
//                 >
//                   <td className={GlobalStyle.tableData}>{item.ro_id || "N/A"}</td>
//                   <td className={GlobalStyle.tableData}>{item.drc_name || "N/A"}</td>
//                   <td className={`${GlobalStyle.tableData} flex justify-center items-center`}>
//                     {getStatusIcon(item.drcUser_status) || "N/A"}
//                   </td>
//                   <td className={GlobalStyle.tableData}>{item.nic || "N/A"}</td>
//                   <td className={GlobalStyle.tableData}>{item.ro_name || "N/A"}</td>
//                   <td className={GlobalStyle.tableData}>{item.login_contact_no || "N/A"}</td>
//                   <td className={GlobalStyle.tableData}>{item.rtom_area_count || "N/A"}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={7} className="text-center py-4">No data available</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className={`${GlobalStyle.navButtonContainer} mt-4`}>
//           <button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1 || isLoading}
//             className={`${GlobalStyle.navButton} ${currentPage === 1 || isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
//             aria-label="Previous page"
//           >
//             <FaArrowLeft />
//           </button>
//           <span>Page {currentPage} of {totalPages}</span>
//           <button
//             onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//             disabled={currentPage === totalPages || isLoading}
//             className={`${GlobalStyle.navButton} ${currentPage === totalPages || isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
//             aria-label="Next page"
//           >
//             <FaArrowRight />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }




// 

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import { List_All_RO_and_DRCuser_Details_to_SLT } from "../../services/RO/RO.js";
import { Active_DRC_Details } from "/src/services/drc/Drc.js";
import Swal from "sweetalert2";
import { Tooltip } from "react-tooltip";

import RO_Active from "../../assets/images/status/RO_DRC_Status_Icons/RO_Active.svg";
import RO_Inactive from "../../assets/images/status/RO_DRC_Status_Icons/RO_Inactive.svg";
import RO_Terminate from "../../assets/images/status/RO_DRC_Status_Icons/RO_Terminate.svg";
import RO_Pending_Approval from "../../assets/images/status/RO_DRC_Status_Icons/RO_Pending_Approval.png";

export default function ROList() {
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [drcFilter, setDrcFilter] = useState("");
  const [drcNames, setDrcNames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const rowsPerPage = 10;
  const navigate = useNavigate();

  const [committedFilters, setCommittedFilters] = useState({
    status: "",
    drc_id: ""
  });

  useEffect(() => {
    const fetchDRCNames = async () => {
      try {
        const names = await Active_DRC_Details();
        setDrcNames(names);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch DRC names. Please try again later.",
        });
      }
    };
    fetchDRCNames();
  }, []);

  const getStatusIcon = (status) => {
    const statusStr = String(status || "").toLowerCase();
    switch (statusStr) {
      case "active":
        return <img src={RO_Active} alt="Active" title="Active" className="w-6 h-6" />;
      case "inactive":
        return <img src={RO_Inactive} alt="Inactive" title="Inactive" className="w-6 h-6" />;
      case "terminate":
        return <img src={RO_Terminate} alt="Terminated" title="Terminated" className="w-6 h-6" />;
      case "pending_approval":
        return <img src={RO_Pending_Approval} alt="Pending Approval" title="Pending Approval" className="w-6 h-6" />;
      default:
        return <span className="capitalize">{statusStr || "N/A"}</span>;
    }
  };

  const showNoDataMessage = (status = "", drc = "") => {
    let message = "No ROs available";
    if (status || drc) {
      message = `No ${status ? status.replace("_", " ") + " " : ""}${drc ? "DRC " : ""}ROs found`;
    }

    Swal.fire({
      title: "No Results",
      text: message,
      icon: "info",
      confirmButtonColor: "#3085d6"
    });
  };

  const callAPI = useCallback(async (filters) => {
    try {
      setIsLoading(true);
      const payload = {
        drcUser_status: filters.status || "",
        drc_id: filters.drc_id || "",
        pages: filters.page || 1
      };

      const response = await List_All_RO_and_DRCuser_Details_to_SLT(payload);

      if (response?.status === "success" && response.data?.length > 0) {
        const roData = response.data.map(item => ({
          ro_id: item.ro_id,
          drcUser_status: item.drcUser_status,
          drc_name: item.drc_name,
          nic: item.nic,
          ro_name: item.ro_name,
          login_contact_no: item.login_contact_no,
          rtom_area_count: item.rtom_area_count
        }));

        setFilteredData(roData);
        setHasMoreData(response.data.length === rowsPerPage);
      } else {
        setFilteredData([]);
        showNoDataMessage(filters.status, filters.drc_id);
      }
    } catch (error) {
      console.error("Error fetching RO list:", error);
      Swal.fire({
        // title: "Error",
        // text: "Failed to fetch RO data. Please try again.",
        title: "Not available any data.",
        text: "Please choose a different DRC with available data.",
        icon: "error"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    callAPI({
      status: committedFilters.status,
      drc_id: committedFilters.drc_id,
      page: currentPage
    });
  }, [currentPage, committedFilters, callAPI]);

  const handleFilterButton = () => {
    setCommittedFilters({
      status: statusFilter,
      drc_id: drcFilter
    });
    setCurrentPage(1);
  };

  const handleClear = () => {
    setStatusFilter("");
    setDrcFilter("");
    setSearchQuery("");
    setCommittedFilters({ status: "", drc_id: "" });
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (hasMoreData) setCurrentPage(currentPage + 1);
  };

  const filteredDataBySearch = filteredData.filter((row) =>
    [row.ro_name, row.nic, row.drc_name].join(" ").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`${GlobalStyle.fontPoppins} px-4 sm:px-6 lg:px-8`}>
      <h2 className={`${GlobalStyle.headingLarge} text-xl sm:text-2xl lg:text-3xl mt-8`}>RO List</h2>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mt-8 w-full">
        <div className="w-full sm:w-fit sm:max-w-md">
          <div className={GlobalStyle.searchBarContainer}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={GlobalStyle.inputSearch}
              placeholder=" "
              aria-label="Search RO details"
            />
            <FaSearch className={GlobalStyle.searchBarIcon} />
          </div>
        </div>

        <div className={`${GlobalStyle.cardContainer} flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-end items-stretch`}>
          <select
            name="drc"
            value={drcFilter}
            onChange={(e) => setDrcFilter(e.target.value)}
            className={`${GlobalStyle.selectBox} w-full sm:w-32 md:w-40`}
            style={{ color: drcFilter === "" ? "gray" : "black" }}
            aria-label="Select DRC filter"
          >
            <option value="" hidden>DRC</option>
            {drcNames.map(({ key, value }) => (
              <option key={key} value={key} style={{ color: "black" }}>
                {value}
              </option>
            ))}
          </select>

          <select
            name="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`${GlobalStyle.selectBox} w-full sm:w-32 md:w-40`}
            style={{ color: statusFilter === "" ? "gray" : "black" }}
            aria-label="Select status filter"
          >
            <option value="" hidden>All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Terminate">Terminated</option>
            <option value="Pending_approval">Pending Approval</option>
          </select>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleFilterButton}
              className={`${GlobalStyle.buttonPrimary} w-full sm:w-auto ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isLoading}
            >
              Filter
            </button>
            <button
              onClick={handleClear}
              className={`${GlobalStyle.buttonRemove} w-full sm:w-auto`}
              disabled={isLoading}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className={`${GlobalStyle.tableContainer} overflow-x-auto mt-4`}>
        <table className={`${GlobalStyle.table} table-auto w-full`} style={{ fontSize: '0.875rem' }} aria-label="RO List Table">
          <thead className={GlobalStyle.thead}>
            <tr>
              <th className={GlobalStyle.tableHeader}>Status</th>
              <th className={GlobalStyle.tableHeader}>DRC</th>
              <th className={GlobalStyle.tableHeader}>NIC</th>
              <th className={GlobalStyle.tableHeader}>RO Name</th>
              <th className={GlobalStyle.tableHeader}>Contact No. 1</th>
              <th className={GlobalStyle.tableHeader}>Contact No. 2</th>
              <th className={GlobalStyle.tableHeader}>Billing Center Area count</th>
            </tr>
          </thead>
          <tbody>
            {filteredDataBySearch.length > 0 ? (
              filteredDataBySearch.map((item, index) => (
                <tr
                  key={item.ro_id || index}
                  className={index % 2 === 0 ? "bg-white bg-opacity-75" : "bg-gray-50 bg-opacity-50"}
                >
                  <td className={`${GlobalStyle.tableData} flex justify-center items-center`}>
                    {getStatusIcon(item.drcUser_status)}
                  </td>
                  <td className={GlobalStyle.tableData}>{item.drc_name || "N/A"}</td>
                  <td className={GlobalStyle.tableData}>{item.nic || "N/A"}</td>
                  <td className={GlobalStyle.tableData}>{item.ro_name || "N/A"}</td>
                  <td className={GlobalStyle.tableData}>{item.login_contact_no || "N/A"}</td>
                  <td className={GlobalStyle.tableData}>{item.login_contact_no || "N/A"}</td>
                  <td className={GlobalStyle.tableData}>{item.rtom_area_count || "0"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  {searchQuery || statusFilter || drcFilter
                    ? "No matching ROs found"
                    : "No ROs available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredDataBySearch.length > 0 && (
        <div className={`${GlobalStyle.navButtonContainer} mt-4`}>
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1 || isLoading}
            className={`${GlobalStyle.navButton} ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-label="Previous page"
          >
            <FaArrowLeft />
          </button>
          <span>Page {currentPage}</span>
          <button
            onClick={handleNextPage}
            disabled={!hasMoreData || isLoading}
            className={`${GlobalStyle.navButton} ${!hasMoreData ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-label="Next page"
          >
            <FaArrowRight />
          </button>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}
