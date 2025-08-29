/* Purpose: This template is used for the 17.3 - User Approval .
Created Date: 2025-06-06
Created By: sakumini (sakuminic@gmail.com)
Modified by: Nimesh Perera (nimeshmathew999@gmail.com), sasindusrinayaka (sasindusrinayaka@gmail.com)
Version: node 20
ui number :17.3
Dependencies: tailwind css
Related Files: (routes)
Notes:The following page contains the code for the User Approvals list Screen */

import React, { useEffect, useState, useRef } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import {
  FaSearch,
  FaArrowLeft,
  FaArrowRight,
  FaDownload,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import {
  getAllUserApprovals,
  User_Approval,
  Download_User_Approval_List,
} from "../../services/user/user_services";
import moreImg from "../../assets/images/more.svg";
import { Tooltip } from "react-tooltip";
import { getLoggedUserId } from "../../services/auth/authService";

const UserApproval = () => {
  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // Filter States
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [userType, setUserType] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    userType: "",
    fromDate: null,
    toDate: null,
  });

  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true);
  const rowsPerPage = 10;

  // Variables for table
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Prevent double API calls (React StrictMode)
  const hasFetched = useRef(false);

  const fetchUserApprovals = async (filters) => {
    setIsLoading(true);
    setError(null);

    const formatDate = (date) =>
      date instanceof Date ? date.toISOString().split("T")[0] : "";

    try {
      const requestData = {
        pages: filters.page,
        user_type: filters.userType,
        from_date: formatDate(filters.fromDate),
        to_date: formatDate(filters.toDate),
      };

      console.log("Payload sent to API: ", requestData);

      const response = await getAllUserApprovals(requestData);
      console.log("API Response:", response);

      if (response && response.status === "success" && Array.isArray(response.data)) {
        if (response.data.length === 0) {
          setIsMoreDataAvailable(false);

          if (filters.page === 1) {
            Swal.fire({
              title: "No Results",
              text: "No matching user approvals found for the selected filters.",
              icon: "warning",
              confirmButtonColor: "#f1c40f",
            });
            setFilteredData([]);
          }
        } else {
          setFilteredData((prevData) => {
            const mappedData = response.data.map((approval) => ({
              approval_id: approval.user_approver_id,
              user_type: approval.User_Type || "",
              user_name: approval.Parameters?.username || "N/A",
              user_email: "N/A", // Email not available in API response
              created_on: new Date(approval.created_on).toLocaleDateString("en-GB"),
              drc_id: approval.DRC_id,
              parameters_user_id: Number(approval.Parameters?.user_id) || null, // Ensure number or null
            }));
            if (filters.page === 1) {
              // Replace on first page
              return response.data.map((approval) => ({
                approval_id: approval.user_approver_id,
                user_type: approval.User_Type || "",
                user_name: approval.user_data?.username || "",
                user_email: approval.user_data?.email || "",
                created_on: new Date(approval.created_on).toLocaleDateString("en-GB"),
                drc_id: approval.DRC_id,
              }));
            }
            // Append for subsequent pages
            return [
              ...prevData,
              ...response.data.map((approval) => ({
                approval_id: approval.user_approver_id,
                user_type: approval.User_Type || "",
                user_name: approval.user_data?.username || "",
                user_email: approval.user_data?.email || "",
                created_on: new Date(approval.created_on).toLocaleDateString("en-GB"),
                drc_id: approval.DRC_id,
              })),
            ];
          });

          if (response.data.length < rowsPerPage) {
            setIsMoreDataAvailable(false);
          }

          setTotalPages(Math.ceil((filteredData.length + response.data.length) / rowsPerPage));
        }
      } else {
        Swal.fire({
          title: "Error",
          text: "No valid user data found in response.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error fetching user approvals:", error);
      setError(error.message || "Failed to fetch user approvals");
      setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when currentPage changes
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true; // block double initial call
      fetchUserApprovals({ ...appliedFilters, page: 1 });
      return;
    }

    if (isMoreDataAvailable) {
      fetchUserApprovals({ ...appliedFilters, page: currentPage });
    }
  }, [currentPage]);

  // Handle Pagination
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && isMoreDataAvailable) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFilterButton = () => {
    if (!filterValidations()) return;

    setIsMoreDataAvailable(true);
    setTotalPages(0);

    setAppliedFilters({
      userType,
      toDate,
      fromDate,
    });

    setCurrentPage(1);
    fetchUserApprovals({
      page: 1,
      userType,
      toDate,
      fromDate,
    });
  };

  const handleClear = () => {
    setUserType("");
    setFromDate(null);
    setToDate(null);
    setSearchQuery("");
    setTotalPages(0);
    setFilteredData([]);
    setIsMoreDataAvailable(true);

    setAppliedFilters({
      userType: "",
      fromDate: null,
      toDate: null,
    });

    setCurrentPage(1);
    fetchUserApprovals({ page: 1, userType: "", fromDate: null, toDate: null });
  };

  // Search
  const filteredDataBySearch = paginatedData.filter((row) =>
    Object.values(row).join(" ").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserTypeChange = (e) => setUserType(e.target.value || "");

  const handleFromDateChange = (date) => {
    if (toDate && date > toDate) {
      Swal.fire({
        title: "Warning",
        text: "From date cannot be after the To date.",
        icon: "warning",
        confirmButtonColor: "#f1c40f",
      });
    } else {
      setFromDate(date);
    }
  };

  const handleToDateChange = (date) => {
    if (fromDate && date < fromDate) {
      Swal.fire({
        title: "Warning",
        text: "To date cannot be before the From date.",
        icon: "warning",
        confirmButtonColor: "#f1c40f",
      });
    } else {
      setToDate(date);
    }
  };

  const filterValidations = () => {
    if (!userType && !fromDate && !toDate) {
      Swal.fire({
        title: "Warning",
        text: "No filter is selected. Please, select a filter.",
        icon: "warning",
        confirmButtonColor: "#f1c40f",
      });
      return false;
    }
    if ((fromDate && !toDate) || (!fromDate && toDate)) {
      Swal.fire({
        title: "Warning",
        text: "Both From Date and To Date must be selected.",
        icon: "warning",
        confirmButtonColor: "#f1c40f",
      });
      setFromDate(null);
      setToDate(null);
      return false;
    }
    return true;
  };

  // Approve / Reject
  const approveSelectedUsers = async (userId, drcId) => {
    console.log("Approving user with userId:", userId, "type:", typeof userId, "drcId:", drcId); // Enhanced debug
    const confBy = await getLoggedUserId();
    console.log("Logged user ID (confBy):", confBy, "type:", typeof confBy); // Enhanced debug

    if (!confBy) {
      Swal.fire({
        title: "Error",
        text: "Unable to retrieve logged user ID.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
      return;
    }

    const validUserId = Number(userId);
    const validConfBy = Number(confBy);

    if (isNaN(validUserId) || validUserId <= 0) {
      Swal.fire({
        title: "Error",
        text: "Invalid user ID for approval.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
      return;
    }

    if (isNaN(validConfBy) || validConfBy <= 0) {
      Swal.fire({
        title: "Error",
        text: "Invalid confirmer ID.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
      return;
    }

    try {
      const response = await User_Approval({
        user_id: validUserId,
        conf_type: "accept",
        conf_by: validConfBy,
      });

      console.log("API Response:", response);
      Swal.fire({
        title: "Approved",
        text: `User approval processed successfully for user ID ${validUserId}.`,
        icon: "success",
        confirmButtonColor: "#28a745",
      });
      window.location.reload();
    } catch (error) {
      console.error("Error approving user:", error.response?.data || error.message);
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.message || "Failed to approve user.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  const rejectSelectedUsers = async (userId, drcId) => {
    console.log("Rejecting user with userId:", userId, "type:", typeof userId, "drcId:", drcId); // Enhanced debug
    const confBy = await getLoggedUserId();
    console.log("Logged user ID (confBy):", confBy, "type:", typeof confBy); // Enhanced debug

    if (!confBy) {
      Swal.fire({
        title: "Error",
        text: "Unable to retrieve logged user ID.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
      return;
    }

    const validUserId = Number(userId);
    const validConfBy = Number(confBy);

    if (isNaN(validUserId) || validUserId <= 0) {
      Swal.fire({
        title: "Error",
        text: "Invalid user ID for rejection.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
      return;
    }

    if (isNaN(validConfBy) || validConfBy <= 0) {
      Swal.fire({
        title: "Error",
        text: "Invalid confirmer ID.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
      return;
    }

    try {
      const response = await User_Approval({
        user_id: validUserId,
        conf_type: "reject",
        conf_by: validConfBy,
      });

      console.log("API Response:", response);
      Swal.fire({
        title: "Success",
        text: `User approval rejected successfully for user ID ${validUserId}.`,
        icon: "success",
        confirmButtonColor: "#28a745",
      });
      window.location.reload();
    } catch (error) {
      console.error("Error rejecting user:", error.response?.data || error.message);
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.message || "Failed to reject user.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  // Create Task
  const HandleCreateTask = async () => {
    if (!fromDate || !toDate) {
      Swal.fire({
        title: "Warning",
        text: "Both 'From' and 'To' dates are required.",
        icon: "warning",
        confirmButtonColor: "#f1c40f",
      });
      return;
    }

    const user = await getLoggedUserId();
    setIsCreatingTask(true);

    try {
      const response = await Download_User_Approval_List({
        from_date: fromDate,
        to_date: toDate,
        user_type: userType,
        create_by: user,
      });

      console.log("API Response for task creation:", response);
      Swal.fire({
        title: "Success",
        text: "Task created successfully.",
        icon: "success",
        confirmButtonColor: "#28a745",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.message || "Failed to create task.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsCreatingTask(false);
    }
  };

  if (isLoading && filteredData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`${GlobalStyle.fontPoppins} px-4 sm:px-6 lg:px-8`}>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
        <h1 className={`${GlobalStyle.headingLarge}`}>User Approval</h1>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col lg:flex-row lg:justify-end lg:items-center mb-6 gap-4">
        <div className={`${GlobalStyle.cardContainer} w-full lg:w-auto`}>
          <div className="flex flex-col lg:flex-row gap-4 sm:items-start w-full">
            {/* User Type Filter */}
            <div className="w-full">
              <select
                value={userType}
                onChange={handleUserTypeChange}
                className={`${GlobalStyle.selectBox} w-auto lg:w-[150px]`}
                style={{ color: userType === "" ? "gray" : "black" }}
              >
                <option value="" hidden>
                  User Type
                </option>
                <option value="drcUser">DRC User</option>
                <option value="RO">RO</option>
              </select>
            </div>

            {/* Dates */}
            <div className="flex flex-col lg:flex-row gap-2 items-center">
              <label className={GlobalStyle.dataPickerDate}>Date</label>
              <DatePicker
                selected={fromDate}
                onChange={handleFromDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="From"
                className={`${GlobalStyle.inputText} lg:w-[150px] w-auto`}
              />
              <DatePicker
                selected={toDate}
                onChange={handleToDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="To"
                className={`${GlobalStyle.inputText} lg:w-[150px] w-auto`}
              />
            </div>

            {/* Buttons */}
            <button
              onClick={handleFilterButton}
              className={`${GlobalStyle.buttonPrimary} w-full`}
            >
              Filter
            </button>
            <button
              onClick={handleClear}
              className={`${GlobalStyle.buttonRemove} w-full`}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 flex justify-start mt-10">
        <div className={GlobalStyle.searchBarContainer}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${GlobalStyle.inputSearch} w-full`}
          />
          <FaSearch className={GlobalStyle.searchBarIcon} />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto sm:mx-0">
        <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
          <table className={`${GlobalStyle.table} min-w-full`}>
            <thead className={GlobalStyle.thead}>
              <tr>
                <th className={GlobalStyle.tableHeader}>USER ID</th>
                <th className={GlobalStyle.tableHeader}>USER NAME</th>
                <th className={GlobalStyle.tableHeader}>USER TYPE</th>
                <th className={GlobalStyle.tableHeader}>USER EMAIL</th>
                <th className={GlobalStyle.tableHeader}>CREATED DATE</th>
                <th className={GlobalStyle.tableHeader}></th>
                <th className={GlobalStyle.tableHeader}></th>
              </tr>
            </thead>
            <tbody>
              {filteredDataBySearch.map((approval, index) => (
                <tr
                  key={approval.approval_id}
                  className={
                    index % 2 === 0
                      ? GlobalStyle.tableRowEven
                      : GlobalStyle.tableRowOdd
                  }
                >
                  <td className={GlobalStyle.tableData}>
                    {approval.approval_id}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    {approval.user_name}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    {approval.user_type}
                  </td>
                  <td className={`${GlobalStyle.tableData} break-all`}>
                    {approval.user_email}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    {approval.created_on}
                  </td>
                  <td className={`${GlobalStyle.tableData} flex justify-center`}>
                    <button className="p-2 rounded flex items-center justify-center">
                      <img
                        src={moreImg}
                        alt="More Info"
                        className="h-auto w-5 max-w-[24px]"
                        data-tooltip-id="more-info-tooltip"
                      />
                      <Tooltip
                        id="more-info-tooltip"
                        place="bottom"
                        content="More Info"
                      />
                    </button>
                  </td>
                  <td className="text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() =>
                          approveSelectedUsers(
                            approval.parameters_user_id,
                            approval.drc_id,
                          )
                        }
                        className={GlobalStyle.buttonPrimary}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          rejectSelectedUsers(
                            approval.parameters_user_id,
                            approval.drc_id
                          )
                        }
                        className={GlobalStyle.buttonRemove}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredDataBySearch.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-sm">
                    No results found
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
					onClick={() => handlePrevNext("prev")}
					disabled={currentPage <= 1}
					className={`${GlobalStyle.navButton} ${currentPage <= 1 ? "cursor-not-allowed" : ""}`}
					style={{ opacity: currentPage <= 1 ? 0.5 : 1 }}
				>
					<FaArrowLeft />
				</button>
				<span className={`${GlobalStyle.pageIndicator} mx-4 my-auto`}>
					Page {currentPage}
				</span>
				<button
					onClick={() => handlePrevNext("next")}
					disabled={currentPage === totalPages}
					className={`${GlobalStyle.navButton} ${currentPage === totalPages ? "cursor-not-allowed" : ""}`}
					style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
				>
					<FaArrowRight />
				</button>
				</div>
			)}

			{/* Create Task Button */}
			<div className="flex justify mt-4">
				{filteredDataBySearch.length > 0 && (
					<div>
						<button
							onClick={HandleCreateTask}
							className={`${GlobalStyle.buttonPrimary} flex items-center ${
								isCreatingTask ? "opacity-50" : ""
							}`}
							disabled={isCreatingTask}
						>
							<FaDownload className="mr-2" />
							{isCreatingTask
								? "Creating Tasks..."
								: "Create task and let me know"}
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default UserApproval;