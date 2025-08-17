// /* Purpose: This template is used for the 17.3 - User Approval .
// Created Date: 2025-06-06
// Created By: sakumini (sakuminic@gmail.com)
// Mofilfied by: Nimesh Perera (nimeshmathew999@gmail.com)
// Version: node 20
// ui number :17.3
// Dependencies: tailwind css
// Related Files: (routes)
// Notes:The following page conatins the code for the User Approvals list Screen */

// import React, { useEffect, useState, useRef } from "react";
// import GlobalStyle from "../../assets/prototype/GlobalStyle";
// import {
// 	FaSearch,
// 	FaArrowLeft,
// 	FaArrowRight,
// 	FaDownload,
// } from "react-icons/fa";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { Link } from "react-router-dom";
// import Swal from "sweetalert2";
// import { getAllUserApprovals, User_Approval, Approve_DRC_Agreement_Approval , Reject_DRC_Agreement_Approval , Download_User_Approval_List}  from "../../services/user/user_services";
// import moreImg from "../../assets/images/more.svg";
// import { Tooltip } from "react-tooltip";
// import { getLoggedUserId } from "../../services/auth/authService";

// const UserApproval = () => {
// 	// Search
// 	const [searchQuery, setSearchQuery] = useState("");

// 	// Filter States
// 	const [fromDate, setFromDate] = useState(null);
// 	const [toDate, setToDate] = useState(null);
// 	const [userType, setUserType] = useState("");
// 	const [appliedFilters, setAppliedFilters] = useState({
// 		userType: "",
// 		fromDate: null,
// 		toDate: null,
// 	});
	
// 	const [filteredData, setFilteredData] = useState([]);
// 	const [isLoading, setIsLoading] = useState(true);
// 	const [error, setError] = useState(null);

// 	// const [selectAll, setSelectAll] = useState(false);
// 	// const [selectedUsers, setSelectedUsers] = useState([]);
// 	const [isCreatingTask, setIsCreatingTask] = useState(false);
// 	// const [isFiltered, setIsFiltered] = useState(false);

// 	// Pagination state
// 	const [currentPage, setCurrentPage] = useState(1);
// 	const [maxCurrentPage, setMaxCurrentPage] = useState(0);
// 	const [totalPages, setTotalPages] = useState(0);
// 	const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true);
// 	const rowsPerPage = 10;

// 	// Variables for table
// 	const startIndex = (currentPage - 1) * rowsPerPage;
// 	const endIndex = startIndex + rowsPerPage;
// 	const paginatedData = filteredData.slice(startIndex, endIndex);
// 	const hasMounted = useRef(false);

// 	useEffect(() => {
// 		console.log("Filtered Data", filteredData);
		
// 	}, [filteredData])
	

// 	const fetchUserApprovals =async(filters) => {
// 		setIsLoading(true);
// 		setError(null);

// 		const formatDate = (date) => {
// 			return date instanceof Date ? date.toISOString().split('T')[0] : '';
// 		};
		
// 		try {
// 			const requestData = {
// 				pages : filters.page,
// 				user_type: filters.userType,
// 				from_date: formatDate(filters.fromDate),
// 				to_date: formatDate(filters.toDate),
// 			}

// 			console.log("Payload sent to API: ", requestData);

// 			const response =await getAllUserApprovals(requestData);
// 			console.log("API Response:", response);

// 			if (response && response.status === "success" && Array.isArray(response.data)) {
// 				if (response.data.length === 0) {
// 					setIsMoreDataAvailable(false);
			
// 					if (currentPage === 1) {
// 						Swal.fire({
// 						title: "No Results",
// 						text: "No matching user approvals found for the selected filters.",
// 						icon: "warning",
// 						allowOutsideClick: false,
// 						allowEscapeKey: false,
// 						confirmButtonColor: "#f1c40f",
// 						});
// 					} else if (currentPage === 2) {
// 						setCurrentPage(1); // Reset to page 1 if no data on page 2
// 					}
					
// 					setFilteredData([]); // Clear data on no results
// 				} else {
// 					const maxData = currentPage === 1 ? 10 : 30;
// 					setFilteredData((prevData) => [
// 					...prevData,
// 						...response.data.map(approval => ({
// 							approval_id: approval.user_approver_id,
// 							user_type: approval.User_Type || "",
// 							user_name: approval.user_data?.username || "",
// 							user_email: approval.user_data?.email || "",
// 							created_on: new Date(approval.created_on).toLocaleDateString("en-GB"), // YYYY-MM-DD
// 							drc_id: approval.DRC_id,
// 						})),
// 						]);
// 					console.log("Filtered Data after API call:", filteredData);
// 					// If fewer than max data returned, no more data available
// 					if (response.data.length < maxData) {
// 						setIsMoreDataAvailable(false);
// 					}
// 				}
// 			} else {
// 				Swal.fire({
// 				  title: "Error",
// 				  text: "No valid user data found in response.",
// 				  icon: "error",
// 				  confirmButtonColor: "#d33",
// 				});
// 				setFilteredData([]);
// 			}
// 		} catch (error) {
// 			console.error("Error fetching user approvals:", error);
// 			setError(error.message || "Failed to fetch user approvals");
// 			setFilteredData([]);
// 		} finally {
// 			setIsLoading(false);
// 		}
// 	}
	
// 	useEffect(() => {
// 		if (!hasMounted.current) {
// 			hasMounted.current = true;
// 			return;
// 		}

// 		if (isMoreDataAvailable && currentPage > maxCurrentPage) {
// 			setMaxCurrentPage(currentPage);
// 			fetchUserApprovals({
// 				...appliedFilters,
// 				page: currentPage
// 			});
// 		}
// 	}, [currentPage]);

// 	// Handle Pagination
// 	const handlePrevNext = (direction) => {
// 		if (direction === "prev" && currentPage > 1) {
// 			setCurrentPage(currentPage - 1);
// 		} else if (direction === "next") {
// 		if (isMoreDataAvailable) {
// 			setCurrentPage(currentPage + 1);
// 		} else {
// 			const totalPages = Math.ceil(filteredData.length / rowsPerPage);
// 			setTotalPages(totalPages);
// 			if (currentPage < totalPages) {
// 				setCurrentPage(currentPage + 1);
// 			}
// 		}
// 		}
// 	};

// 	const handleFilterButton = () => {
// 		setIsMoreDataAvailable(true);
// 		setTotalPages(0);
// 		setMaxCurrentPage(0);

// 		const isValid =filterValidations();
// 		console.log("Is valid: ",isValid);
		
// 		if (!isValid) {
// 			return;
// 		} else {
// 		setAppliedFilters({
// 			userType :userType,
// 			toDate :toDate,
// 			fromDate: fromDate,
// 		});
// 		setFilteredData([]);
// 		if (currentPage === 1) {
// 			fetchUserApprovals({
// 				page: 1,
// 				userType,
// 				toDate,
// 				fromDate
// 			});
// 		}else {
// 			setCurrentPage(1);
// 		}
// 		}
// 	}

// 	const handleClear = () => {
// 		// Clear both the form fields and applied filters
// 		setUserType("");
// 		setFromDate(null);
// 		setToDate(null);
		
// 		// Reset Search Query
// 		setSearchQuery("");

// 		// Reset Pagination
// 		setTotalPages(0); // Reset total pages
// 		setFilteredData([]); // Clear filtered data
// 		setMaxCurrentPage(0); // Reset max current page
// 		setIsMoreDataAvailable(true);

// 		setAppliedFilters({ 
// 			userType: "",
// 			fromDate: "",
// 			toDate: "" 
// 		});

// 		if (currentPage != 1) {
// 			setCurrentPage(1); // Reset to page 1
// 		} else {
// 			setCurrentPage(0); // Temp set to 0
// 			setTimeout(() => setCurrentPage(1), 0); // Reset to 1 after
// 		}
// 	};

// 	// Search Section
// 	const filteredDataBySearch = paginatedData.filter((row) =>
// 		Object.values(row)
// 		.join(" ")
// 		.toLowerCase()
// 		.includes(searchQuery.toLowerCase())
// 	);

// 	const handleUserTypeChange = (e) => {
// 		setUserType(e.target.value || "");
// 	};

// 	const handleFromDateChange = (date) => {
// 		if (toDate && date > toDate) {
// 			Swal.fire({
// 				title: "Warning",
// 				text: "From date cannot be after the To date.",
// 				icon: "warning",
// 				confirmButtonColor: "#f1c40f",
// 			});
// 		}
// 		else
// 		 {
// 			setFromDate(date);
// 		}
// 	};

// 	const handleToDateChange = (date) => {
// 		if (fromDate && date < fromDate) {
// 			Swal.fire({
// 				title: "Warning",
// 				text: "To date cannot be before the From date.",
// 				icon: "warning",
// 				confirmButtonColor: "#f1c40f",
// 			});
// 		} 
// 		else {
// 			setToDate(date);
// 		}
// 	};

// 	// Validate filters before calling the API
// 	const filterValidations = () => {
// 		if (!userType && !fromDate && !toDate) {
// 			Swal.fire({
// 				title: "Warning",
// 				text: "No filter is selected. Please, select a filter.",
// 				icon: "warning",
// 				allowOutsideClick: false,
// 				allowEscapeKey: false,
// 				confirmButtonColor: "#f1c40f"
// 			});
// 			return false;
// 		}

// 		if ((fromDate && !toDate) || (!fromDate && toDate)) {
// 			Swal.fire({
// 				title: "Warning",
// 				text: "Both From Date and To Date must be selected.",
// 				icon: "warning",
// 				allowOutsideClick: false,
// 				allowEscapeKey: false,
// 				confirmButtonColor: "#f1c40f"
// 			});
// 			setFromDate(null);
// 			setToDate(null);
// 			return false;
// 		}

// 		return true;
// 	};

// 	const approveSelectedUsers = async(approval_id , drc_id) => {
// 		console.log("Approving User ID:", approval_id);
// 		console.log("DRC ID:", drc_id);

		
// 		const user = await getLoggedUserId();
		
// 		//const loggedUserId = getLoggedUserId();
// 		console.log("Logged User ID:", user);

// 		if (!user) {
// 			Swal.fire({
// 				title: "Error",
// 				text: "Unable to retrieve logged user ID.",
// 				icon: "error",
// 				confirmButtonColor: "#d33",
// 			});
// 			return;
// 		}

// 		// Call the API to approve the user

// 		 const requestData = {
// 				// drc_id: drc_id,
// 				user_approver_id: approval_id,
// 				conf_type: "accept",
// 				conf_by: user,

// 			};

// 			console.log("Payload sent to API: ", requestData);

// 		try {
// 			const response = await Approve_DRC_Agreement_Approval(requestData);
// 			console.log("API Response:", response);


// 		Swal.fire({
// 			title: "Approved",
// 			text: `User approval ${approval_id} processed successfully.`,
// 			icon: "success",
// 			 confirmButtonColor: "#28a745"
// 		});
// 			//reload the page to reflect changes
// 			window.location.reload();
		
// 			// Clear selected users after approval
// 			//setSelectedUsers([]);
// 			//setSelectAll(false);

// 		} catch (error) {
// 			console.error("Error approving user:", error);
// 			Swal.fire({
// 				title: "Error",
// 				text:  error?.response?.data?.message || "Failed to approve user.",
// 				icon: "error",
// 				confirmButtonColor: "#d33",
// 			});
// 		}
// 	};


// 	const rejectSelectedUsers = async(approval_id , drc_id) => {
// 		console.log("Rejecting User ID:", approval_id);
// 		console.log("DRC ID:", drc_id);

// 		const user = await getLoggedUserId();
// 		console.log("Logged User ID:", user);

// 		if (!user) {
// 			Swal.fire({
// 				title: "Error",
// 				text: "Unable to retrieve logged user ID.",
// 				icon: "error",
// 				confirmButtonColor: "#d33",
// 			});
// 			return;
// 		}
// 		// Call the API to reject the user
// 		const requestData = {
// 			drc_id: drc_id,
// 			user_approver_id: approval_id,
// 			approved_by: user,
// 		};
// 		console.log("Payload sent to API for reject: ", requestData);
// 		try {
// 			const response = await Reject_DRC_Agreement_Approval(requestData);
// 			console.log("API Response:", response);

// 			Swal.fire({
// 				title: "Success",
// 				text: `User approval ${approval_id} rejected successfully.`,
// 				icon: "success",
// 				confirmButtonColor: "#28a745",
// 			});
// 			//reload the page to reflect changes
// 			window.location.reload();
		
// 		}
// 		catch (error) {
// 			console.error("Error rejecting user:", error);
// 			Swal.fire({
// 				title: "Error",
// 				text: error?.response?.data?.message || "Failed to reject user.",
// 				icon: "error",
// 				confirmButtonColor: "#d33",
// 			});
// 		}


// 	}

// 	// Function to handle the creation of a task for downloading incidents
// 	const HandleCreateTask = async () => {


// 		if (!fromDate || !toDate) {
// 			Swal.fire({
// 				title: "Warning",
// 				text: "Both 'From' and 'To' dates are required.",
// 				icon: "warning",
// 				confirmButtonColor: "#f1c40f",
// 			});
// 			return;
// 		}

// 		const user = await getLoggedUserId();
// 		console.log("Logged User ID:", user);
		
// 		setIsCreatingTask(true);

// 		const requestData = {
// 			from_date: fromDate,
// 			to_date: toDate,
// 			user_type: userType,
// 			create_by: user,
// 		};
// 		console.log("Payload sent to API for task creation: ", requestData);
// 		try {
// 			const response = await Download_User_Approval_List(requestData);
// 			console.log("API Response for task creation:", response);

// 			if (response) {
// 				Swal.fire({
// 					title: "Success",
// 					text: "Task created successfully.",
// 					icon: "success",
// 					confirmButtonColor: "#28a745",
// 				});
// 			}
// 			setIsCreatingTask(false);
// 		} catch (error) {
// 			console.error("Error creating task:", error);
// 			Swal.fire({
// 				title: "Error",
// 				text: error?.response?.data?.message || "Failed to create task.",
// 				icon: "error",
// 				confirmButtonColor: "#d33",
// 			});
// 			setIsCreatingTask(false);
// 		}

// 	};

// 	// Display loading animation when data is loading
// 	if (isLoading && filteredData.length === 0) {
// 		return (
// 			<div className="flex justify-center items-center h-64">
// 				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
// 			</div>
// 		);
// 	}

// 	// if (error) return <div>Error: {error}</div>;

// 	return (
// 		<div className={`${GlobalStyle.fontPoppins} px-4 sm:px-6 lg:px-8`}>
// 			{/* Header Section - Responsive */}
// 			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
// 				<h1
// 					className={`${GlobalStyle.headingLarge}  `}
// 				>
// 					User Approval
// 				</h1>
// 			</div>

// 			{/* Search and Filters - Responsive */}
// 			<div className="flex flex-col lg:flex-row lg:justify-end lg:items-center mb-6 gap-4">
// 				{/* Search Bar */}
// 				{/* <div className={GlobalStyle.searchBarContainer} >
// 				<input
// 					type="text"
// 					value={searchQuery}
// 					onChange={(e) => setSearchQuery(e.target.value)}
// 					className={`${GlobalStyle.inputSearch} w-full`}
// 				/>
// 				<FaSearch className={GlobalStyle.searchBarIcon} />
// 				</div> */}

// 				{/* Filters */}
// 				<div className={`${GlobalStyle.cardContainer} w-full lg:w-auto`}>
// 					<div className="flex flex-col lg:flex-row gap-4 sm:items-start w-full">
						
// 						{/* User Type Filter */}
// 						<div className="w-full">
// 							<select
// 								value={userType}
// 								onChange={handleUserTypeChange}
// 								className={`${GlobalStyle.selectBox} w-auto lg:w-[150px]`}
// 								style={{ color: userType === "" ? "gray" : "black" }}
// 							>
// 								<option value="" hidden>User Type</option>
// 								<option value="drcUser" style={{ color: "black" }}>DRC User</option>
// 								<option value="RO" style={{ color: "black" }}>RO</option>
// 							</select>
// 						</div>
						
// 						<div className="flex flex-col lg:flex-row gap-2 items-center">
// 							<label className={GlobalStyle.dataPickerDate}>Date</label>
// 							<DatePicker
// 								selected={fromDate}
// 								onChange={handleFromDateChange}
// 								dateFormat="dd/MM/yyyy"
// 								placeholderText="From"
// 								className={`${GlobalStyle.inputText} lg:w-[150px] w-auto`}
// 							/>
// 							<DatePicker
// 								selected={toDate}
// 								onChange={handleToDateChange}
// 								dateFormat="dd/MM/yyyy"
// 								placeholderText="To"
// 								className={`${GlobalStyle.inputText}  lg:w-[150px] w-auto`}
// 							/>
// 						</div>
											
// 						{/* Filter Button */}
// 						<button
// 							onClick={handleFilterButton}
// 							className={`${GlobalStyle.buttonPrimary} w-full`}
// 							>
// 							Filter
// 						</button>

// 						{/* Clear Button */}
// 						<button
// 							onClick={handleClear}
// 							className={`${GlobalStyle.buttonRemove} w-full`}
// 							>
// 							Clear
// 						</button>
// 					</div>
// 				</div>
// 			</div>


// 			{/* Search Bar */}
// 			<div className="mb-4 flex justify-start mt-10">
// 				<div className={GlobalStyle.searchBarContainer} >
// 				<input
// 					type="text"
// 					value={searchQuery}
// 					onChange={(e) => setSearchQuery(e.target.value)}
// 					className={`${GlobalStyle.inputSearch} w-full`}
// 				/>
// 				<FaSearch className={GlobalStyle.searchBarIcon} />
// 				</div>
// 				</div>

// 			{/* Table Container - Responsive */}
// 			<div className="overflow-x-auto sm:mx-0">
// 				<div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
// 					{/* Desktop Table View */}
// 					<table
// 						className={`${GlobalStyle.table}  md:table min-w-full overflow-x-scroll`}
// 					>
// 						<thead className={GlobalStyle.thead}>
// 							<tr>
// 								{/* <th scope="col" className={`${GlobalStyle.tableHeader}`}>
// 									<input
// 										type="checkbox"
// 										checked={selectAll}
// 										onChange={handleSelectAll}
// 										className="cursor-pointer"
// 									/>
// 								</th> */}
// 								<th scope="col" className={`${GlobalStyle.tableHeader}`}>
// 									USER ID
// 								</th>
// 								<th scope="col" className={`${GlobalStyle.tableHeader}`}>
// 									USER NAME
// 								</th>
// 								<th scope="col" className={`${GlobalStyle.tableHeader}`}>
// 									USER TYPE
// 								</th>
// 								<th scope="col" className={`${GlobalStyle.tableHeader}`}>
// 									USER EMAIL
// 								</th>
// 								{/* <th scope="col" className={`${GlobalStyle.tableHeader}`}>
// 									LOGIN METHOD
// 								</th> */}
// 								<th scope="col" className={`${GlobalStyle.tableHeader}`}>
// 									CREATED DATE
// 								</th>
// 								<th scope="col" className={`${GlobalStyle.tableHeader}`}>
									
// 								</th>
// 								<th scope="col" className={`${GlobalStyle.tableHeader}`}>
									
// 								</th>

// 							</tr>
// 						</thead>
// 						<tbody>
// 							{filteredDataBySearch.map((approval, index) => (
// 								<tr
// 									key={approval.approval_id}
// 									className={`${
// 										index % 2 === 0
// 											? GlobalStyle.tableRowEven
// 											: GlobalStyle.tableRowOdd
// 									}`}
// 								>
// 									<td className={`${GlobalStyle.tableData}`}>{approval.approval_id}</td>
// 									<td className={`${GlobalStyle.tableData}`}>
// 										{approval.user_name}
// 									</td>
// 									<td className={`${GlobalStyle.tableData}`}>
// 										{approval.user_type}
// 									</td>
// 									<td className={`${GlobalStyle.tableData} break-all`}>
// 										{approval.user_email}
// 									</td>
// 									<td className={`${GlobalStyle.tableData}`}>
// 										{approval.created_on}
// 									</td>

// 									<td className={`${GlobalStyle.tableData} flex justify-center space-x-2`}>
//                                     <button 
//                                        // onClick={() => navigateToDRCInfo(log.DRCID)}
//                                         className="p-2  rounded flex items-center justify-center"
//                                         //title="More Info"
                                        
//                                     >
//                                         <img src={moreImg} alt="More Info" className="h-auto w-5 max-w-[24px]" data-tooltip-id="more-info-tooltip" />
//                                         <Tooltip
//                                             id="more-info-tooltip"
//                                             place="bottom"
//                                             content="More Info"
//                                         />
//                                     </button>
// 									</td>
									
// 									<td className="text-center">
// 										<div className="flex justify-center gap-2">
// 											<button
// 												// onClick={() => approveSelectedUsers(approval.approval_id , approval.drc_id)}
// 												className={GlobalStyle.buttonPrimary}
// 											>
// 										Approve
// 										</button>

// 										<button
// 											onClick={() => rejectSelectedUsers(approval.approval_id , approval.drc_id)}
// 											className={GlobalStyle.buttonRemove}
											
// 										>
// 											Reject
// 										</button>

// 									</div>
// 								</td>


// 								</tr>
// 							))}
// 							{filteredDataBySearch.length === 0 && (
// 								<tr>
// 									<td colSpan="7" className="text-center py-4 text-sm">
// 										No results found
// 									</td>
// 								</tr>
// 							)}
// 						</tbody>
// 					</table>

// 					{/* Mobile Card View */}
// 					{/* <div className="md:hidden space-y-4">
// 						{filteredDataBySearch.map((user, index) => (
// 							<div
// 								key={user.user_id}
// 								className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
// 							>
// 								<div className="flex justify-between items-start mb-3">
// 									<div className="flex items-center gap-3">
// 										<span className="text-sm font-semibold text-gray-900">
// 											#{user.user_id}
// 										</span>
// 									</div>
// 									<Link to={`/config/user-details/${user.user_id}`}>
// 										<img src={more_info} alt="More Info" className="h-5 w-5" />
// 									</Link>
// 								</div>

// 								<div className="space-y-2">
// 									<div className="flex justify-between">
// 										<span className="text-xs text-gray-500">Name:</span>
// 										<span className="text-sm font-medium text-gray-900">
// 											{user.user_name}
// 										</span>
// 									</div>
// 									<div className="flex justify-between">
// 										<span className="text-xs text-gray-500">Email:</span>
// 										<span className="text-sm text-gray-700 break-all">
// 											{user.user_email}
// 										</span>
// 									</div>
// 									<div className="flex justify-between">
// 										<span className="text-xs text-gray-500">Type:</span>
// 										<span className="text-sm text-gray-700">
// 											{user.user_type}
// 										</span>
// 									</div>
// 									<div className="flex justify-between">
// 										<span className="text-xs text-gray-500">Created:</span>
// 										<span className="text-sm text-gray-700">
// 											{user.created_on}
// 										</span>
// 									</div>
// 								</div>
// 							</div>
// 						))}

// 						{filteredDataBySearch.length === 0 && (
// 							<div className="text-center py-8 text-gray-500">
// 								No results found
// 							</div>
// 						)}
// 					</div> */}
// 				</div>
// 			</div>

// 			{/* Pagination Section */}
// 			{filteredDataBySearch.length > 0 && (
// 				<div className={GlobalStyle.navButtonContainer}>
// 				<button
// 					onClick={() => handlePrevNext("prev")}
// 					disabled={currentPage <= 1}
// 					className={`${GlobalStyle.navButton} ${currentPage <= 1 ? "cursor-not-allowed" : ""}`}
// 				>
// 					<FaArrowLeft />
// 				</button>
// 				<span className={`${GlobalStyle.pageIndicator} mx-4 my-auto`}>
// 					Page {currentPage}
// 				</span>
// 				<button
// 					onClick={() => handlePrevNext("next")}
// 					disabled={currentPage === totalPages}
// 					className={`${GlobalStyle.navButton} ${currentPage === totalPages ? "cursor-not-allowed" : ""}`}
// 				>
// 					<FaArrowRight />
// 				</button>
// 				</div>
// 			)}

// 			{/* {filteredDataBySearch.length > 0 && (
// 				<div className="flex justify-end mt-4">
// 					<button
// 						onClick={approveSelectedUsers}
// 						className={`${GlobalStyle.buttonPrimary} text-sm px-6 py-2`}
// 					>
// 						Approve
// 					</button>
// 				</div>
// 			)} */}

// 			{/* Create Task Button */}
// 			<div className="flex justify mt-4">
// 				{filteredDataBySearch.length > 0 && (
// 					<div>
// 						<button
// 							onClick={HandleCreateTask}
// 							className={`${GlobalStyle.buttonPrimary} flex items-center ${
// 								isCreatingTask ? "opacity-50" : ""
// 							}`}
// 							disabled={isCreatingTask}
// 						>
// 							<FaDownload className="mr-2" />
// 							{isCreatingTask
// 								? "Creating Tasks..."
// 								: "Create task and let me know"}
// 						</button>
// 					</div>
// 				)}
// 			</div>
// 		</div>
// 	);
// };

// export default UserApproval;


/* Purpose: This template is used for the 17.3 - User Approval .
Created Date: 2025-06-06
Created By: sakumini (sakuminic@gmail.com)
Mofilfied by: Nimesh Perera (nimeshmathew999@gmail.com)
Version: node 20
ui number :17.3
Dependencies: tailwind css
Related Files: (routes)
Notes:The following page conatins the code for the User Approvals list Screen */

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
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { getAllUserApprovals, User_Approval, Approve_DRC_Agreement_Approval , Reject_DRC_Agreement_Approval , Download_User_Approval_List}  from "../../services/user/user_services";
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
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	// const [selectAll, setSelectAll] = useState(false);
	// const [selectedUsers, setSelectedUsers] = useState([]);
	const [isCreatingTask, setIsCreatingTask] = useState(false);
	// const [isFiltered, setIsFiltered] = useState(false);

	// Pagination state
	const [currentPage, setCurrentPage] = useState(1);
	const [maxCurrentPage, setMaxCurrentPage] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true);
	const rowsPerPage = 10;

	// Variables for table
	const startIndex = (currentPage - 1) * rowsPerPage;
	const endIndex = startIndex + rowsPerPage;
	const paginatedData = filteredData.slice(startIndex, endIndex);
	const hasMounted = useRef(false);

	useEffect(() => {
		console.log("Filtered Data", filteredData);
		
	}, [filteredData])
	

	const fetchUserApprovals =async(filters) => {
		setIsLoading(true);
		setError(null);

		const formatDate = (date) => {
			return date instanceof Date ? date.toISOString().split('T')[0] : '';
		};
		
		try {
			const requestData = {
				pages : filters.page,
				user_type: filters.userType,
				from_date: formatDate(filters.fromDate),
				to_date: formatDate(filters.toDate),
			}

			console.log("Payload sent to API: ", requestData);

			const response =await getAllUserApprovals(requestData);
			console.log("API Response:", response);

			if (response && response.status === "success" && Array.isArray(response.data)) {
				if (response.data.length === 0) {
					setIsMoreDataAvailable(false);
			
					if (currentPage === 1) {
						Swal.fire({
						title: "No Results",
						text: "No matching user approvals found for the selected filters.",
						icon: "warning",
						allowOutsideClick: false,
						allowEscapeKey: false,
						confirmButtonColor: "#f1c40f",
						});
					} else if (currentPage === 2) {
						setCurrentPage(1); // Reset to page 1 if no data on page 2
					}
					
					setFilteredData([]); // Clear data on no results
				} else {
					const maxData = currentPage === 1 ? 10 : 30;
					setFilteredData((prevData) => [
					...prevData,
						...response.data.map(approval => ({
							approval_id: approval.user_approver_id,
							user_type: approval.User_Type || "",
							user_name: approval.user_data?.username || "",
							user_email: approval.user_data?.email || "",
							created_on: new Date(approval.created_on).toLocaleDateString("en-GB"), // YYYY-MM-DD
							drc_id: approval.DRC_id,
						})),
						]);
					console.log("Filtered Data after API call:", filteredData);
					// If fewer than max data returned, no more data available
					if (response.data.length < maxData) {
						setIsMoreDataAvailable(false);
					}
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
	}
	
	useEffect(() => {
		if (!hasMounted.current) {
			hasMounted.current = true;
			return;
		}

		if (isMoreDataAvailable && currentPage > maxCurrentPage) {
			setMaxCurrentPage(currentPage);
			fetchUserApprovals({
				...appliedFilters,
				page: currentPage
			});
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
		setIsMoreDataAvailable(true);
		setTotalPages(0);
		setMaxCurrentPage(0);

		const isValid =filterValidations();
		console.log("Is valid: ",isValid);
		
		if (!isValid) {
			return;
		} else {
		setAppliedFilters({
			userType :userType,
			toDate :toDate,
			fromDate: fromDate,
		});
		setFilteredData([]);
		if (currentPage === 1) {
			fetchUserApprovals({
				page: 1,
				userType,
				toDate,
				fromDate
			});
		}else {
			setCurrentPage(1);
		}
		}
	}

	const handleClear = () => {
		// Clear both the form fields and applied filters
		setUserType("");
		setFromDate(null);
		setToDate(null);
		
		// Reset Search Query
		setSearchQuery("");

		// Reset Pagination
		setTotalPages(0); // Reset total pages
		setFilteredData([]); // Clear filtered data
		setMaxCurrentPage(0); // Reset max current page
		setIsMoreDataAvailable(true);

		setAppliedFilters({ 
			userType: "",
			fromDate: "",
			toDate: "" 
		});

		if (currentPage != 1) {
			setCurrentPage(1); // Reset to page 1
		} else {
			setCurrentPage(0); // Temp set to 0
			setTimeout(() => setCurrentPage(1), 0); // Reset to 1 after
		}
	};

	// Search Section
	const filteredDataBySearch = paginatedData.filter((row) =>
		Object.values(row)
		.join(" ")
		.toLowerCase()
		.includes(searchQuery.toLowerCase())
	);

	const handleUserTypeChange = (e) => {
		setUserType(e.target.value || "");
	};

	const handleFromDateChange = (date) => {
		if (toDate && date > toDate) {
			Swal.fire({
				title: "Warning",
				text: "From date cannot be after the To date.",
				icon: "warning",
				confirmButtonColor: "#f1c40f",
			});
		}
		else
		 {
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
		} 
		else {
			setToDate(date);
		}
	};

	// Validate filters before calling the API
	const filterValidations = () => {
		if (!userType && !fromDate && !toDate) {
			Swal.fire({
				title: "Warning",
				text: "No filter is selected. Please, select a filter.",
				icon: "warning",
				allowOutsideClick: false,
				allowEscapeKey: false,
				confirmButtonColor: "#f1c40f"
			});
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
			setFromDate(null);
			setToDate(null);
			return false;
		}

		return true;
	};

	const approveSelectedUsers = async(approval_id , drc_id) => {
		console.log("Approving User ID:", approval_id);
		console.log("DRC ID:", drc_id);

		
		const user = await getLoggedUserId();
		
		//const loggedUserId = getLoggedUserId();
		console.log("Logged User ID:", user);

		if (!user) {
			Swal.fire({
				title: "Error",
				text: "Unable to retrieve logged user ID.",
				icon: "error",
				confirmButtonColor: "#d33",
			});
			return;
		}

		// Call the API to approve the user

		 const requestData = {
				user_id: approval_id,
				conf_type: "accept",
				conf_by: user,

			};

			console.log("Payload sent to API: ", requestData);

		try {
			const response = await User_Approval(requestData);
			console.log("API Response:", response);


		Swal.fire({
			title: "Approved",
			text: `User approval ${approval_id} processed successfully.`,
			icon: "success",
			 confirmButtonColor: "#28a745"
		});
			//reload the page to reflect changes
			window.location.reload();
		
			// Clear selected users after approval
			//setSelectedUsers([]);
			//setSelectAll(false);

		} catch (error) {
			console.error("Error approving user:", error);
			Swal.fire({
				title: "Error",
				text:  error?.response?.data?.message || "Failed to approve user.",
				icon: "error",
				confirmButtonColor: "#d33",
			});
		}
	};


	const rejectSelectedUsers = async(approval_id , drc_id) => {
		console.log("Rejecting User ID:", approval_id);
		console.log("DRC ID:", drc_id);

		const user = await getLoggedUserId();
		console.log("Logged User ID:", user);

		if (!user) {
			Swal.fire({
				title: "Error",
				text: "Unable to retrieve logged user ID.",
				icon: "error",
				confirmButtonColor: "#d33",
			});
			return;
		}
		// Call the API to reject the user
		const requestData = {
			user_id: approval_id,
			conf_type: "reject",
			conf_by: user,
		};
		console.log("Payload sent to API for reject: ", requestData);
		try {
			const response = await User_Approval(requestData);
			console.log("API Response:", response);

			Swal.fire({
				title: "Success",
				text: `User approval ${approval_id} rejected successfully.`,
				icon: "success",
				confirmButtonColor: "#28a745",
			});
			//reload the page to reflect changes
			window.location.reload();
		
		}
		catch (error) {
			console.error("Error rejecting user:", error);
			Swal.fire({
				title: "Error",
				text: error?.response?.data?.message || "Failed to reject user.",
				icon: "error",
				confirmButtonColor: "#d33",
			});
		}


	}

	// Function to handle the creation of a task for downloading incidents
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
		console.log("Logged User ID:", user);
		
		setIsCreatingTask(true);

		const requestData = {
			from_date: fromDate,
			to_date: toDate,
			user_type: userType,
			create_by: user,
		};
		console.log("Payload sent to API for task creation: ", requestData);
		try {
			const response = await Download_User_Approval_List(requestData);
			console.log("API Response for task creation:", response);

			if (response) {
				Swal.fire({
					title: "Success",
					text: "Task created successfully.",
					icon: "success",
					confirmButtonColor: "#28a745",
				});
			}
			setIsCreatingTask(false);
		} catch (error) {
			console.error("Error creating task:", error);
			Swal.fire({
				title: "Error",
				text: error?.response?.data?.message || "Failed to create task.",
				icon: "error",
				confirmButtonColor: "#d33",
			});
			setIsCreatingTask(false);
		}

	};

	// Display loading animation when data is loading
	if (isLoading && filteredData.length === 0) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	// if (error) return <div>Error: {error}</div>;

	return (
		<div className={`${GlobalStyle.fontPoppins} px-4 sm:px-6 lg:px-8`}>
			{/* Header Section - Responsive */}
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
				<h1
					className={`${GlobalStyle.headingLarge}  `}
				>
					User Approval
				</h1>
			</div>

			{/* Search and Filters - Responsive */}
			<div className="flex flex-col lg:flex-row lg:justify-end lg:items-center mb-6 gap-4">
				{/* Search Bar */}
				{/* <div className={GlobalStyle.searchBarContainer} >
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className={`${GlobalStyle.inputSearch} w-full`}
				/>
				<FaSearch className={GlobalStyle.searchBarIcon} />
				</div> */}

				{/* Filters */}
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
								<option value="" hidden>User Type</option>
								<option value="drcUser" style={{ color: "black" }}>DRC User</option>
								<option value="RO" style={{ color: "black" }}>RO</option>
							</select>
						</div>
						
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
								className={`${GlobalStyle.inputText}  lg:w-[150px] w-auto`}
							/>
						</div>
											
						{/* Filter Button */}
						<button
							onClick={handleFilterButton}
							className={`${GlobalStyle.buttonPrimary} w-full`}
							>
							Filter
						</button>

						{/* Clear Button */}
						<button
							onClick={handleClear}
							className={`${GlobalStyle.buttonRemove} w-full`}
							>
							Clear
						</button>
					</div>
				</div>
			</div>


			{/* Search Bar */}
			<div className="mb-4 flex justify-start mt-10">
				<div className={GlobalStyle.searchBarContainer} >
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className={`${GlobalStyle.inputSearch} w-full`}
				/>
				<FaSearch className={GlobalStyle.searchBarIcon} />
				</div>
				</div>

			{/* Table Container - Responsive */}
			<div className="overflow-x-auto sm:mx-0">
				<div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
					{/* Desktop Table View */}
					<table
						className={`${GlobalStyle.table}  md:table min-w-full overflow-x-scroll`}
					>
						<thead className={GlobalStyle.thead}>
							<tr>
								{/* <th scope="col" className={`${GlobalStyle.tableHeader}`}>
									<input
										type="checkbox"
										checked={selectAll}
										onChange={handleSelectAll}
										className="cursor-pointer"
									/>
								</th> */}
								<th scope="col" className={`${GlobalStyle.tableHeader}`}>
									USER ID
								</th>
								<th scope="col" className={`${GlobalStyle.tableHeader}`}>
									USER NAME
								</th>
								<th scope="col" className={`${GlobalStyle.tableHeader}`}>
									USER TYPE
								</th>
								<th scope="col" className={`${GlobalStyle.tableHeader}`}>
									USER EMAIL
								</th>
								{/* <th scope="col" className={`${GlobalStyle.tableHeader}`}>
									LOGIN METHOD
								</th> */}
								<th scope="col" className={`${GlobalStyle.tableHeader}`}>
									CREATED DATE
								</th>
								<th scope="col" className={`${GlobalStyle.tableHeader}`}>
									
								</th>
								<th scope="col" className={`${GlobalStyle.tableHeader}`}>
									
								</th>

							</tr>
						</thead>
						<tbody>
							{filteredDataBySearch.map((approval, index) => (
								<tr
									key={approval.approval_id}
									className={`${
										index % 2 === 0
											? GlobalStyle.tableRowEven
											: GlobalStyle.tableRowOdd
									}`}
								>
									<td className={`${GlobalStyle.tableData}`}>{approval.approval_id}</td>
									<td className={`${GlobalStyle.tableData}`}>
										{approval.user_name}
									</td>
									<td className={`${GlobalStyle.tableData}`}>
										{approval.user_type}
									</td>
									<td className={`${GlobalStyle.tableData} break-all`}>
										{approval.user_email}
									</td>
									<td className={`${GlobalStyle.tableData}`}>
										{approval.created_on}
									</td>

									<td className={`${GlobalStyle.tableData} flex justify-center space-x-2`}>
                                    <button 
                                       // onClick={() => navigateToDRCInfo(log.DRCID)}
                                        className="p-2  rounded flex items-center justify-center"
                                        //title="More Info"
                                        
                                    >
                                        <img src={moreImg} alt="More Info" className="h-auto w-5 max-w-[24px]" data-tooltip-id="more-info-tooltip" />
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
												onClick={() => approveSelectedUsers(approval.approval_id , approval.drc_id)}
												className={GlobalStyle.buttonPrimary}
											>
										Approve
										</button>

										<button
											onClick={() => rejectSelectedUsers(approval.approval_id , approval.drc_id)}
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

					{/* Mobile Card View */}
					{/* <div className="md:hidden space-y-4">
						{filteredDataBySearch.map((user, index) => (
							<div
								key={user.user_id}
								className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
							>
								<div className="flex justify-between items-start mb-3">
									<div className="flex items-center gap-3">
										<span className="text-sm font-semibold text-gray-900">
											#{user.user_id}
										</span>
									</div>
									<Link to={`/config/user-details/${user.user_id}`}>
										<img src={more_info} alt="More Info" className="h-5 w-5" />
									</Link>
								</div>

								<div className="space-y-2">
									<div className="flex justify-between">
										<span className="text-xs text-gray-500">Name:</span>
										<span className="text-sm font-medium text-gray-900">
											{user.user_name}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-xs text-gray-500">Email:</span>
										<span className="text-sm text-gray-700 break-all">
											{user.user_email}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-xs text-gray-500">Type:</span>
										<span className="text-sm text-gray-700">
											{user.user_type}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-xs text-gray-500">Created:</span>
										<span className="text-sm text-gray-700">
											{user.created_on}
										</span>
									</div>
								</div>
							</div>
						))}

						{filteredDataBySearch.length === 0 && (
							<div className="text-center py-8 text-gray-500">
								No results found
							</div>
						)}
					</div> */}
				</div>
			</div>

			{/* Pagination Section */}
			{filteredDataBySearch.length > 0 && (
				<div className={GlobalStyle.navButtonContainer}>
				<button
					onClick={() => handlePrevNext("prev")}
					disabled={currentPage <= 1}
					className={`${GlobalStyle.navButton} ${currentPage <= 1 ? "cursor-not-allowed" : ""}`}
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
				>
					<FaArrowRight />
				</button>
				</div>
			)}

			{/* {filteredDataBySearch.length > 0 && (
				<div className="flex justify-end mt-4">
					<button
						onClick={approveSelectedUsers}
						className={`${GlobalStyle.buttonPrimary} text-sm px-6 py-2`}
					>
						Approve
					</button>
				</div>
			)} */}

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