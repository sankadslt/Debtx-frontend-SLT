/* Purpose: This template is used for the 18.1 Sup - WRIT List page.
   Created Date: 2025-08-20
   Created By: Sadinsa
   Version: node 22
   ui number : 18.1
   Dependencies: tailwind css
*/

import { useEffect, useMemo, useRef, useState } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaSearch, FaArrowLeft, FaArrowRight, FaDownload } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import Swal from "sweetalert2";

// Status icons
// import Open from "/src/assets/images/settlement_status/Open .png";
// import Open_Pending from "/src/assets/images/settlement_status/Open_Pending .png";
// import Compleate from "/src/assets/images/settlement_status/Compleate .png";
// import Active from "/src/assets/images/settlement_status/Active .png";
// import Abandaned from "/src/assets/images/settlement_status/Abandaned .png";
// import Withdraw from "/src/assets/images/settlement_status/Withdraw.png";
// import more from "/src/assets/images/imagefor1.a.13(one).png";

// Auth helpers
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken, getLoggedUserId } from "../../services/auth/authService";

// Services (wire these to your backend)
// TODO: implement these in ../../services/settlement/SettlementServices

//import { listWritCases } from "../../services/settlement/SettlementServices";
//import {  createTaskForDownloadWritList } from "../../services/settlement/SettlementServices";

export default function WRITList() {
  const navigate = useNavigate();

  // Filters
  const [selectFilter, setSelectFilter] = useState(""); // e.g., DRC or any dropdown
  const [caseId, setCaseId] = useState("");
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // Data & UI state
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true);

  // Pagination (infinite-load by API + local page slice)
  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [maxRequestedPage, setMaxRequestedPage] = useState(0);
  const committedFiltersRef = useRef({ selectFilter: "", caseId: "", status: "", fromDate: null, toDate: null });

  // Decode role
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    try {
      let decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp < now) {
        refreshAccessToken().then((newToken) => {
          if (!newToken) return;
          setUserRole(jwtDecode(newToken).role);
        });
      } else {
        setUserRole(decoded.role);
      }
    } catch (e) {
      console.error("Invalid token", e);
    }
  }, []);

  // Status icon
//   const statusIcon = (value) => {
//     switch ((value || "").toLowerCase()) {
//       case "open":
//         return Open;
//       case "open_pending":
//         return Open_Pending;
//       case "active":
//         return Active;
//       case "withdraw":
//         return Withdraw;
//       case "completed":
//         return Compleate;
//       case "abondant":
//       case "abandon":
//       case "abandant":
//         return Abandaned;
//       default:
//         return null;
//     }
//   };

  // Simple validation
  const validate = () => {
    if (!selectFilter && !caseId && !status && !fromDate && !toDate) {
      Swal.fire({ title: "Warning", text: "Please select at least one filter.", icon: "warning", confirmButtonColor: "#f1c40f" });
      return false;
    }
    if ((fromDate && !toDate) || (!fromDate && toDate)) {
      Swal.fire({ title: "Warning", text: "Please select both From and To dates.", icon: "warning", confirmButtonColor: "#f1c40f" });
      return false;
    }
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      Swal.fire({ title: "Warning", text: "To date should be greater than or equal to From date.", icon: "warning", confirmButtonColor: "#f1c40f" });
      return false;
    }
    if (caseId && !/^\w+$/.test(caseId)) {
      Swal.fire({ title: "Warning", text: "Invalid Case ID.", icon: "warning", confirmButtonColor: "#f1c40f" });
      return false;
    }
    return true;
  };

  // API caller
  const fetchPage = async (page) => {
    setIsLoading(true);
    try {
      const payload = {
        select: committedFiltersRef.current.selectFilter || undefined,
        case_id: committedFiltersRef.current.caseId || undefined,
        status: committedFiltersRef.current.status || undefined,
        from_date: committedFiltersRef.current.fromDate || undefined,
        to_date: committedFiltersRef.current.toDate || undefined,
        pages: page,
      };
      const res = await listWritCases(payload);
      if (!res) throw new Error("No response");

      if (res.status === 200 && res.data?.data?.length) {
        const newRows = res.data.data;
        setRows((prev) => (page === 1 ? newRows : [...prev, ...newRows]));
        setIsMoreDataAvailable(true);
      } else if (res.status === 204 || !res.data?.data?.length) {
        if (page === 1) setRows([]);
        setIsMoreDataAvailable(false);
      } else {
        // If less than expected, stop infinite load
        if (!res.data?.data?.length || res.data.data.length < rowsPerPage) setIsMoreDataAvailable(false);
      }
    } catch (e) {
      console.error(e);
      Swal.fire({ title: "Error", text: "Failed to fetch WRIT data.", icon: "error", confirmButtonColor: "#d33" });
    } finally {
      setIsLoading(false);
    }
  };

  // When currentPage advances beyond any fetched page, request more
  useEffect(() => {
    if (isMoreDataAvailable && currentPage > maxRequestedPage) {
      setMaxRequestedPage(currentPage);
      fetchPage(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Filter button
  const handleFilterButton = () => {
    if (!validate()) return;
    committedFiltersRef.current = { selectFilter, caseId, status, fromDate, toDate };
    setRows([]);
    setIsMoreDataAvailable(true);
    setMaxRequestedPage(0);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSelectFilter("");
    setCaseId("");
    setStatus("");
    setFromDate(null);
    setToDate(null);
    setSearchQuery("");
    committedFiltersRef.current = { selectFilter: "", caseId: "", status: "", fromDate: null, toDate: null };
    setRows([]);
    setIsMoreDataAvailable(true);
    setMaxRequestedPage(0);
    setCurrentPage(1);
  };

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => Object.values(r).join(" ").toLowerCase().includes(q));
  }, [rows, searchQuery]);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const handlePrevNext = (dir) => {
    if (dir === "prev" && currentPage > 1) setCurrentPage((p) => p - 1);
    if (dir === "next") {
      if (searchQuery) {
        const cap = Math.ceil(filteredRows.length / rowsPerPage);
        if (currentPage < cap) setCurrentPage((p) => p + 1);
      } else if (isMoreDataAvailable || currentPage < Math.ceil(rows.length / rowsPerPage)) {
        setCurrentPage((p) => p + 1);
      }
    }
  };

  const naviCaseID = (cid) => navigate("/Incident/Case_Details", { state: { CaseID: cid } });
  const naviPreview = (caseId, settlementID) => navigate("/lod/ftl-log/preview", { state: { caseId, settlementID } });

  const handleCreateTask = async () => {
    if (!fromDate || !toDate) {
      Swal.fire({ title: "Warning", text: "Please select From and To dates.", icon: "warning", confirmButtonColor: "#f1c40f" });
      return;
    }
    setIsCreatingTask(true);
    try {
      const user = await getLoggedUserId();
      const res = await createTaskForDownloadWritList(user, status, fromDate, toDate, caseId);
      if (res?.status === 200) {
        Swal.fire({ title: "Task created successfully!", text: `Task ID: ${res.data?.data?.data?.Task_Id || "N/A"}`, icon: "success", confirmButtonColor: "#28a745" });
      }
    } catch (e) {
      Swal.fire({ title: "Error", text: e.message || "Failed to create task.", icon: "error", confirmButtonColor: "#d33" });
    } finally {
      setIsCreatingTask(false);
    }
  };

  return (
    <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
      <div className="flex flex-col flex-1">
        <main className="p-6">
          <h1 className={GlobalStyle.headingLarge}>WRIT List</h1>

          {/* Filters Row  */}
          <div className={`${GlobalStyle.cardContainer} w-full mt-6`}>
            <div className="flex flex-wrap items-center justify-start gap-3">
              <div className="flex items-center">  
                <select
                    value={selectFilter}
                    onChange={(e) => setSelectFilter(e.target.value)}
                    className={`${GlobalStyle.selectBox} w-40`}
                    style={{ color: selectFilter === "" ? "gray" : "black" }}
                >
                    <option value="" hidden>
                    Select
                    </option>
                    <option value="All">All</option>
                    <option value="DRC">DRC</option>
                    <option value="My" >My Cases</option>
                </select>
              </div>

              <div className="flex items-center">  

                <input
                    type="text"
                    value={caseId}
                    onChange={(e) => setCaseId(e.target.value)}
                    className={`${GlobalStyle.inputText} w-44`}
                    placeholder="Enter Case ID"
                />
              </div> 

              <div className="flex items-center">  

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className={`${GlobalStyle.selectBox} w-40`}
                    style={{ color: status === "" ? "gray" : "black" }}
                >
                    <option value="" hidden>
                    Status
                    </option>
                    <option value="Open">Open</option>
                    <option value="Open_Pending">Open Pending</option>
                    <option value="Active">Active</option>
                    <option value="WithDraw">WithDraw</option>
                    <option value="Completed">Completed</option>
                    <option value="Abandant">Abandant</option>
                </select>
              </div>

              <span className={GlobalStyle.dataPickerDate}>Date </span>
              <DatePicker
                selected={fromDate}
                onChange={setFromDate}
                dateFormat="dd/MM/yyyy"
                placeholderText="From "
                className={`${GlobalStyle.inputText} w-40`}
              />
              <span className={GlobalStyle.dataPickerDate}></span>
              <DatePicker
                selected={toDate}
                onChange={setToDate}
                dateFormat="dd/MM/yyyy"
                placeholderText="To"
                className={`${GlobalStyle.inputText} w-40`}
              />

              {(["admin", "superadmin", "slt"].includes(userRole)) && (
                <button className={`${GlobalStyle.buttonPrimary}`} onClick={handleFilterButton}>
                  Filter
                </button>
              )}
              {(["admin", "superadmin", "slt"].includes(userRole)) && (
                <button className={`${GlobalStyle.buttonRemove}`} onClick={handleClear}>
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-4 flex justify-start mt-6">
            <div className={GlobalStyle.searchBarContainer}>
              <input
                type="text"
                className={GlobalStyle.inputSearch}
                value={searchQuery}
                onChange={(e) => {
                  setCurrentPage(1);
                  setSearchQuery(e.target.value);
                }}
              />
              <FaSearch className={GlobalStyle.searchBarIcon} />
            </div>
          </div>

          {/* Table */}
          <div className={`${GlobalStyle.tableContainer} mt-4 overflow-x-auto`}>
            <table className={GlobalStyle.table}>
              <thead className={GlobalStyle.thead}>
                <tr>
                  <th className={GlobalStyle.tableHeader}>Case ID</th>
                  <th className={GlobalStyle.tableHeader}>Status</th>
                  <th className={GlobalStyle.tableHeader}>Created DTM</th>
                  <th className={GlobalStyle.tableHeader}>Settlement ID</th>
                  <th className={GlobalStyle.tableHeader}>Settlement Phase</th>
                  <th className={GlobalStyle.tableHeader}></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className={`${GlobalStyle.tableData} text-center`}>
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto" />
                    </td>
                  </tr>
                ) : filteredRows.length ? (
                  filteredRows.slice(startIndex, endIndex).map((row, i) => {
                    const icon = statusIcon(row.settlement_status);
                    const tipId = `tip-${startIndex + i}`;
                    return (
                      <tr
                        key={row.settlement_id || `${row.case_id}-${i}`}
                        className={(i % 2 === 0) ? GlobalStyle.tableRowEven : GlobalStyle.tableRowOdd}
                      >
                        <td className={`${GlobalStyle.tableData} text-black hover:underline cursor-pointer`} onClick={() => naviCaseID(row.case_id)}>
                          {row.case_id || "N/A"}
                        </td>
                        <td className={`${GlobalStyle.tableData}`}>
                          {icon ? (
                            <div className="flex items-center justify-center">
                              <img src={icon} alt={row.settlement_status} className="w-7 h-7" data-tooltip-id={tipId} />
                              <Tooltip id={tipId} place="bottom" effect="solid">{row.settlement_status}</Tooltip>
                            </div>
                          ) : (
                            row.settlement_status || ""
                          )}
                        </td>
                        <td className={GlobalStyle.tableData}>
                          {row.created_dtm ? new Date(row.created_dtm).toLocaleDateString("en-GB") : ""}
                        </td>
                        <td className={GlobalStyle.tableData}>{row.settlement_id || ""}</td>
                        <td className={GlobalStyle.tableData}>{row.settlement_phase || ""}</td>
                        <td className={GlobalStyle.tableData}>
                          <img
                            src={more}
                            className="w-5 h-5 cursor-pointer"
                            onClick={() => naviPreview(row.case_id, row.settlement_id)}
                            data-tooltip-id={`more-${i}`}
                          />
                          <Tooltip id={`more-${i}`} place="bottom" effect="solid">More Details</Tooltip>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className={`${GlobalStyle.tableData} text-center`}>No cases available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredRows.length > 0 && (
            <div className={GlobalStyle.navButtonContainer}>
              <button
                onClick={() => handlePrevNext("prev")}
                disabled={currentPage <= 1}
                className={`${GlobalStyle.navButton} ${currentPage <= 1 ? "cursor-not-allowed" : ""}`}
              >
                <FaArrowLeft />
              </button>
              <span className={`${GlobalStyle.pageIndicator} mx-4`}>Page {currentPage}</span>
              <button
                onClick={() => handlePrevNext("next")}
                disabled={searchQuery ? currentPage >= Math.ceil(filteredRows.length / rowsPerPage) : (!isMoreDataAvailable && currentPage >= Math.ceil(rows.length / rowsPerPage))}
                className={`${GlobalStyle.navButton} ${searchQuery ? (currentPage >= Math.ceil(filteredRows.length / rowsPerPage) ? "cursor-not-allowed" : "") : (!isMoreDataAvailable && currentPage >= Math.ceil(rows.length / rowsPerPage) ? "cursor-not-allowed" : "")}`}
              >
                <FaArrowRight />
              </button>
            </div>
          )}

          {/* Create Task button */}
          {(["admin", "superadmin", "slt"].includes(userRole)) && filteredRows.length > 0 && (
            <button
              onClick={handleCreateTask}
              className={`${GlobalStyle.buttonPrimary} ${isCreatingTask ? "opacity-50" : ""}`}
              disabled={isCreatingTask}
              style={{ display: "flex", alignItems: "center" }}
            >
              {!isCreatingTask && <FaDownload style={{ marginRight: 8 }} />}
              {isCreatingTask ? "Creating Tasks..." : "Create task and let me know"}
            </button>
          )}
        </main>
      </div>
    </div>
  );
}
