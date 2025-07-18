/* 
Purpose: This template is used for the 1.15.1 - DRC Assign Manager Approval 
Created Date: 2025-02-17
Created By: Sanjaya (sanjayaperera80@gmail.com)
Last Modified Date: 2025-02-18
Modified By:  Malindu (mhssc20@gmail.com)
Version: node 20
UI Number: 1.15.1
Dependencies: Tailwind CSS
Related Files: (routes)
Notes: The following page contains the code 
*/

import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaSearch, FaDownload } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import "react-datepicker/dist/react-datepicker.css";
import { List_All_Batch_Details, Approve_Batch_or_Batches, Create_task_for_batch_approval, Approve_Batch } from "/src/services/case/CaseServices.js";
import { getLoggedUserId } from "/src/services/auth/authService.js";
import Swal from "sweetalert2";

import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";


export default function DRCAssignManagerApproval2() {

  // State for search query and filtered data
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredData, setFilteredData] = useState([]);
  const [userRole, setUserRole] = useState(null); // Role-Based Buttons

  // Role-Based Buttons
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      let decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        refreshAccessToken().then((newToken) => {
          if (!newToken) return;
          const newDecoded = jwtDecode(newToken);
          setUserRole(newDecoded.role);
        });
      } else {
        setUserRole(decoded.role);
      }
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }, []);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 4;

  const fetchData = async () => {

    const userId = await getLoggedUserId();
    // console.log("Logged in user ID:", userId);
    const payload = {
      approved_deligated_by: userId,
    };
    // console.log("Payload:", payload);
    try {
      const response = await List_All_Batch_Details(payload);
      if (response.length > 0) {
        setFilteredData(response);
      } else {
        Swal.fire({
          icon: "warning",
          title: "No Data Found",
          text: "There are no batch details available for approval.",
          confirmButtonColor: "#f1c40f",
        })
      }
      // console.log("All batch details:", response);
    } catch (error) {
      //console.error("Error fetching all batch details:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while fetching batch details.",
        confirmButtonColor: "#d33",
      })
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  const filteredDataBySearch = searchQuery

    ? filteredData.filter((item) => {
      const batchId = item.case_distribution_details?.case_distribution_batch_id || "N/A";
      const createdDate = new Date(item.created_on).toLocaleDateString();
      const commissionRule = item.case_distribution_details?.drc_commision_rule || "N/A";
      const ruleBaseCount = item.case_distribution_details?.rulebase_count || "N/A";

      const rowString = `${batchId} ${createdDate} ${commissionRule} ${ruleBaseCount}`.toLowerCase();
      return rowString.includes(searchQuery.toLowerCase());
    })
    : filteredData;


  const currentData = filteredDataBySearch.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredDataBySearch.length / recordsPerPage);


  // Handle pagination
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };



  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set())

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      // Select all rows in the filtered data
      setSelectedRows(new Set(filteredDataBySearch.map(item => item.case_distribution_details?.case_distribution_batch_id || "N/A")));
    } else {
      // Deselect all rows
      setSelectedRows(new Set());
    }
  };
  // This function handles the selection of individual rows
  const handleRowSelect = (batchId) => {

    const newSelectedRows = new Set(selectedRows);

    if (newSelectedRows.has(batchId)) {
      newSelectedRows.delete(batchId);
    } else {
      if (newSelectedRows.size >= 1) {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "You can only select 1 record at a time.",
          confirmButtonColor: "#f1c40f",
        });
        return;
      }
      newSelectedRows.add(batchId);
    }
    setSelectedRows(newSelectedRows);

    // Automatically deselect the "Select All" checkbox if any row is deselected
    if (newSelectedRows.size !== filteredData.length) {
      setSelectAll(false);
    } else {
      setSelectAll(true);
    }
  };

  //console.log("Selected rows:", selectedRows);

  // Function to handle the approve button click
  const onapprovebuttonclick = async (IsApproved, currentRow) => {
    const userId = await getLoggedUserId();
    // const batchIds = Array.from(selectedRows);
    const batchIds = currentRow;
    // console.log("Selected batch IDs:", batchIds);
    // if (batchIds.length === 0) {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "Warning",
    //     text: "Please select at least one record to approve.",
    //     confirmButtonColor: "#f1c40f",
    //   });
    //   return;
    // }

    // Show confirmation alert before calling API
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to approve the selected record?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
    });

    if (!result.isConfirmed) {
      return;
    }

    const payload = {
      approver_reference: batchIds,
      approved_by: userId,
      IsApproved: IsApproved, // Pass the IsApproved value
    }
    //console.log("Payload:", payload);
    try {
      const response = await Approve_Batch(payload); // Use 'await' here

      if (IsApproved === "Approve") {
        Swal.fire({
          icon: "success",
          title: "Task Created Successfully",
          text: "Task ID: " + response.response.data.Task_Id,
          confirmButtonColor: "#28a745",
        }).then(() => {
          // Reset selected rows and pagination after approval
          setSelectedRows(new Set());
          setCurrentPage(1);
          setSearchQuery(""); // Clear search query
          fetchData(); // Refresh data
        });

      } else {
        Swal.fire({
          icon: "success",
          title: "Rejected",
          text: "The selected record has been rejected.",
          confirmButtonColor: "#28a745",
        }).then(() => {
          // Reset selected rows and pagination after approval
          setSelectedRows(new Set());
          setCurrentPage(1);
          setSearchQuery(""); // Clear search query
          fetchData(); // Refresh data
        });
      }

    } catch (error) {
      console.error("Error in sending the data:", error);

      const errorMessage = error?.response?.data?.message ||
        error?.message ||
        "An error occurred. Please try again.";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#d33",
      });
    }
  }

  // Function to handle the submit button click
  const onSubmit = async () => {
    const userId = await getLoggedUserId();
    // const batchIds = Array.from(selectedRows);

    // get all the batch ids from the current data
    const batchIds = currentData
      .map(item => item.case_distribution_details?.case_distribution_batch_id)
      .filter(id => id);

    if (batchIds.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please select at least one record to approve.",
        confirmButtonColor: "#f1c40f",
      });
      return;
    }
    const payload = {
      approver_references: batchIds,
      Created_By: userId,
    }
    try {
      const response = await Create_task_for_batch_approval(payload); // Use 'await' here
      //  console.log("Response:", response.response.data);
      Swal.fire({
        icon: "success",
        title: "Task Created Successfully",
        text: "Task ID: " + response.response.data.Task_Id,
        confirmButtonColor: "#28a745",
      });

      fetchData();
    } catch (error) {
      console.error("Error in sending the data:", error);

      const errorMessage = error?.response?.data?.message ||
        error?.message ||
        "An error occurred. Please try again.";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#d33",
      });
    }

  }
  return (
    <div className={GlobalStyle.fontPoppins}>
      {/* Title */}
      <h1 className={GlobalStyle.headingLarge}> DRC Assign Approval</h1>
      <div className="flex justify-between mt-16 mb-6">
        <div className="flex justify-start mb-8">
          <div className={GlobalStyle.searchBarContainer}>
            <input
              type="text"
              placeholder=""
              value={searchQuery}
              onChange={(e) => {
                setCurrentPage(1); // Reset to first page on new search
                setSearchQuery(e.target.value)
              }}
              className={GlobalStyle.inputSearch}
            />
            <FaSearch className={GlobalStyle.searchBarIcon} />
          </div>
        </div>
      </div>

      {/* Search Section */}

      {/* Table Section */}
      <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              {/* <th className={GlobalStyle.tableHeader}>

              </th> */}
              <th className={GlobalStyle.tableHeader}>Batch ID</th>

              <th className={GlobalStyle.tableHeader}>DRC Commission rule</th>
              <th className={GlobalStyle.tableHeader}>Case count</th>
              {/* <th className={GlobalStyle.tableHeader}>Total Arrears</th> */}
              <th className={GlobalStyle.tableHeader}>Created Date</th>
              <th className={GlobalStyle.tableHeader}></th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, index) => (

                <tr
                  key={`${item.drc}-${index}`}
                  className={
                    index % 2 === 0
                      ? GlobalStyle.tableRowEven
                      : GlobalStyle.tableRowOdd
                  }
                >
                  {/* <td className="text-center">
                    <input

                      type="checkbox"
                      checked={selectedRows.has(item.case_distribution_details?.case_distribution_batch_id || "N/A")}
                      onChange={() => handleRowSelect(item.case_distribution_details?.case_distribution_batch_id || "N/A")}
                      className="mx-auto"
                    />
                  </td> */}
                  <td className={GlobalStyle.tableData}>{item.case_distribution_details?.case_distribution_batch_id || "N/A"}</td>

                  <td className={GlobalStyle.tableData}> {item.case_distribution_details?.drc_commision_rule || "N/A"}</td>
                  <td className={GlobalStyle.tableData}>{item.case_distribution_details?.rulebase_count || "N/A"}</td>
                  {/* <td className={GlobalStyle.tableData}>{item.totalArrears}</td> */}
                  <td className={GlobalStyle.tableData}>{new Date(item.created_on).toLocaleDateString("en-GB")}</td>
                  <td className="text-center">
                    <div className="flex justify-center gap-2">
                      {["admin", "superadmin", "slt"].includes(userRole) && (
                        <button
                          onClick={() => onapprovebuttonclick("Approve", item.case_distribution_details?.case_distribution_batch_id)}
                          className={GlobalStyle.buttonPrimary}
                        //   disabled={selectedRows.size === 0} // Disable if no rows are selected
                        >
                          Approve
                        </button>

                      )}

                      {["admin", "superadmin", "slt"].includes(userRole) && (
                        <button
                          onClick={() => onapprovebuttonclick("Reject", item.case_distribution_details?.case_distribution_batch_id)}
                          className={GlobalStyle.buttonRemove}
                        //   disabled={selectedRows.size === 0} // Disable if no rows are selected
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className={GlobalStyle.tableData} style={{ textAlign: "center" }}>
                  No data available
                </td>
              </tr>
            )
            }
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      {currentData.length > 0 && (
        <div className={GlobalStyle.navButtonContainer}>
          <button
            onClick={() => handlePrevNext("prev")}
            disabled={currentPage === 1}
            className={`${GlobalStyle.navButton} ${currentPage === 1 ? "cursor-not-allowed" : ""
              }`}
          >
            <FaArrowLeft />
          </button>
          <span className={`${GlobalStyle.pageIndicator} mx-4`}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePrevNext("next")}
            disabled={currentPage === totalPages}
            className={`${GlobalStyle.navButton} ${currentPage === totalPages ? "cursor-not-allowed" : ""
              }`}
          >
            <FaArrowRight />
          </button>
        </div>
      )}

      {/* Select All Data Checkbox and Approve Button */}
      <div className="flex justify-end gap-4 mt-4">
        {/* Select All Data Checkbox */}
        {/* <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="rounded-lg"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          Select All Data
        </label> */}

        {/* Approve Button */}
        {/* <button
          onClick={onapprovebuttonclick}
          className={GlobalStyle.buttonPrimary}
          //   disabled={selectedRows.size === 0} // Disable if no rows are selected
        >
          Approve
        </button> */}
        {/* <div>
          {["admin", "superadmin", "slt"].includes(userRole) && (
            <button
              onClick={() => onapprovebuttonclick("Approve")}
              className={GlobalStyle.buttonPrimary}
            //   disabled={selectedRows.size === 0} // Disable if no rows are selected
            >
              Approve
            </button>

          )}
        </div> */}

        {/* <div>
          {["admin", "superadmin", "slt"].includes(userRole) && (
            <button
              onClick={() => onapprovebuttonclick("Reject")}
              className={GlobalStyle.buttonRemove}
            //   disabled={selectedRows.size === 0} // Disable if no rows are selected
            >
              Reject
            </button>

          )}
        </div> */}
      </div>
      <div>
        {currentData.length > 0 && (
          <div>
            {["admin", "superadmin", "slt"].includes(userRole) && (
              <button onClick={onSubmit} className={`${GlobalStyle.buttonPrimary} flex items-center `} >
                <FaDownload className="mr-2" />
                Create task and let me know
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}