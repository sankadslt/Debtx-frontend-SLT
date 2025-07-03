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
import more_info from "../../assets/images/more.svg";
import Swal from "sweetalert2";

const UserApproval = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [fromDate, setFromDate] = useState(null);
	const [toDate, setToDate] = useState(null);
	const [userRole, setUserRole] = useState("");
	const [userType, setUserType] = useState("");
	const [appliedFilters, setAppliedFilters] = useState({
		userRole: "",
		userType: "",
		fromDate: null,
		toDate: null,
	});
	const [roData, setRoData] = useState([]);
	const [originalData, setOriginalData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [tooltipVisible, setTooltipVisible] = useState(null);
	const [selectAll, setSelectAll] = useState(false);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [isCreatingTask, setIsCreatingTask] = useState(false);
	const [isFiltered, setIsFiltered] = useState(false);

	// Pagination state - following Monitor Settlement pattern
	const [currentPage, setCurrentPage] = useState(1);
	const [maxCurrentPage, setMaxCurrentPage] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true);
	const [committedFilters, setCommittedFilters] = useState({
		userRole: "",
		userType: "",
		fromDate: null,
		toDate: null,
	});

	const rowsPerPage = 10;
	const hasMounted = useRef(false);

	// Variables for table - following Monitor Settlement pattern
	const startIndex = (currentPage - 1) * rowsPerPage;
	const endIndex = startIndex + rowsPerPage;
	const paginatedData = roData.slice(startIndex, endIndex);

	const handleFromDateChange = (date) => {
		if (toDate && date > toDate) {
			Swal.fire({
				title: "Warning",
				text: "From date cannot be after the To date.",
				icon: "warning",
				confirmButtonColor: "#f1c40f",
			});
		} else if (toDate) {
			// Calculate month gap
			const diffInMs = toDate - date;
			const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

			if (diffInDays > 31) {
				Swal.fire({
					title: "Warning",
					text: "The selected range is more than 1 month.",
					icon: "warning",
					confirmButtonColor: "#f1c40f",
				});

				return;
			}
			setFromDate(date);
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
		} else if (fromDate) {
			// Calculate month gap
			const diffInMs = date - fromDate;
			const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

			if (diffInDays > 31) {
				Swal.fire({
					title: "Warning",
					text: "The selected range is more than 1 month.",
					icon: "warning",
					confirmButtonColor: "#f1c40f",
				});

				return;
			}
			setToDate(date);
		} else {
			setToDate(date);
		}
	};

	// Mock API call function - following Monitor Settlement pattern
	const callAPI = async (filters) => {
		try {
			setIsLoading(true);
			
			// Mock data for Users based on the updated structure
			const mockUserData = [
				{
					user_id: "0001",
					user_type: "SLT",
					user_role: "Admin",
					user_name: "W.M. Wimalasiri",
					user_email: "wimal@example.com",
					created_on: "2024-01-15",
					login_method: "SLT",
				},
				{
					user_id: "0002",
					user_type: "DRC",
					user_role: "User",
					user_name: "R.A. Siripala",
					user_email: "siripala@example.com",
					created_on: "2024-02-10",
					login_method: "Gmail",
				},
				{
					user_id: "0003",
					user_type: "RO",
					user_role: "Moderator",
					user_name: "K.S. Fernando",
					user_email: "fernando@example.com",
					created_on: "2024-03-05",
					login_method: "Gmail",
				},
				{
					user_id: "0004",
					user_type: "SLT",
					user_role: "Admin",
					user_name: "N.S. Perera",
					user_email: "perera@example.com",
					created_on: "2024-03-22",
					login_method: "SLT",
				},
				{
					user_id: "0005",
					user_type: "DRC",
					user_role: "User",
					user_name: "M.A. Gunawardena",
					user_email: "gunawardena@example.com",
					created_on: "2024-04-01",
					login_method: "Gmail",
				},
				{
					user_id: "0006",
					user_type: "RO",
					user_role: "Moderator",
					user_name: "T.D. Jayasuriya",
					user_email: "jayasuriya@example.com",
					created_on: "2024-04-10",
					login_method: "Gmail",
				},
				{
					user_id: "0007",
					user_type: "SLT",
					user_role: "Admin",
					user_name: "K.P. Ranasinghe",
					user_email: "ranasinghe@example.com",
					created_on: "2024-05-05",
					login_method: "SLT",
				},
				{
					user_id: "0008",
					user_type: "DRC",
					user_role: "User",
					user_name: "S.H. Madushanka",
					user_email: "madushanka@example.com",
					created_on: "2024-05-20",
					login_method: "Gmail",
				},
				{
					user_id: "0009",
					user_type: "RO",
					user_role: "Moderator",
					user_name: "D.L. Bandara",
					user_email: "bandara@example.com",
					created_on: "2024-06-01",
					login_method: "Gmail",
				},
				{
					user_id: "0010",
					user_type: "SLT",
					user_role: "User",
					user_name: "P.V. Lakmal",
					user_email: "lakmal@example.com",
					created_on: "2024-06-05",
					login_method: "SLT",
				},
				{
					user_id: "0011",
					user_type: "DRC",
					user_role: "Admin",
					user_name: "R.M. De Silva",
					user_email: "desilva@example.com",
					created_on: "2024-06-06",
					login_method: "Gmail",
				},
			];

			// Apply filters
			let filteredMockData = mockUserData.filter((row) => {
				const matchesUserRole =
					filters.userRole === "" ||
					row.user_role.toLowerCase() === filters.userRole.toLowerCase();

				const matchesUserType =
					filters.userType === "" ||
					row.user_type.toLowerCase() === filters.userType.toLowerCase();

				// Date filtering
				let matchesDateRange = true;
				if (filters.fromDate && filters.toDate) {
					const itemDate = new Date(row.created_on);
					matchesDateRange = itemDate >= filters.fromDate && itemDate <= filters.toDate;
				}

				return matchesUserRole && matchesUserType && matchesDateRange;
			});

			// Simulate pagination - get data for current page
			const startIdx = (filters.page - 1) * rowsPerPage;
			const endIdx = startIdx + rowsPerPage;
			const pageData = filteredMockData.slice(startIdx, endIdx);

			// Simulate API delay
			await new Promise(resolve => setTimeout(resolve, 500));

			setIsLoading(false);

			if (pageData.length === 0) {
				setIsMoreDataAvailable(false);
				if (filters.page === 1) {
					Swal.fire({
						title: "No Results",
						text: "No matching data found for the selected filters.",
						icon: "warning",
						allowOutsideClick: false,
						allowEscapeKey: false,
						confirmButtonColor: "#f1c40f"
					});
				}
			} else {
				// Check if more data is available
				const hasMoreData = endIdx < filteredMockData.length;
				setIsMoreDataAvailable(hasMoreData);
				
				// Set data based on page
				if (filters.page === 1) {
					setRoData(pageData);
				} else {
					setRoData(prevData => [...prevData, ...pageData]);
				}
			}

		} catch (error) {
			console.error("Error filtering users:", error);
			Swal.fire({
				title: "Error",
				text: "Failed to fetch filtered data. Please try again.",
				icon: "error",
				confirmButtonColor: "#d33"
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Initialize with mock data on first load
	useEffect(() => {
		const initializeData = async () => {
			await callAPI({
				userRole: "",
				userType: "",
				fromDate: null,
				toDate: null,
				page: 1
			});
		};
		
		initializeData();
	}, []);

	// Handle pagination effect
	useEffect(() => {
		if (!hasMounted.current) {
			hasMounted.current = true;
			return;
		}

		if (isMoreDataAvailable && currentPage > maxCurrentPage) {
			setMaxCurrentPage(currentPage);
			callAPI({
				...committedFilters,
				page: currentPage
			});
		}
	}, [currentPage]);

	// Filter data by search query
	const filteredDataBySearch = paginatedData.filter((row) => {
		return Object.values(row)
			.join(" ")
			.toLowerCase()
			.includes(searchQuery.toLowerCase());
	});

	// Validate filters before calling the API
	const filterValidations = () => {
		if (!userRole && !userType && !fromDate && !toDate) {
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

	const handleFilter = () => {
		setIsMoreDataAvailable(true);
		setTotalPages(0);
		setMaxCurrentPage(0);
		
		const isValid = filterValidations();
		if (!isValid) {
			return;
		}

		setCommittedFilters({
			userRole,
			userType,
			fromDate,
			toDate,
		});
		
		setAppliedFilters({
			userRole,
			userType,
			fromDate,
			toDate,
		});
		
		setIsFiltered(true);
		setRoData([]);

		if (currentPage === 1) {
			callAPI({
				userRole,
				userType,
				fromDate,
				toDate,
				page: 1
			});
		} else {
			setCurrentPage(1);
		}
	};

	const handleClear = () => {
		setUserRole("");
		setUserType("");
		setFromDate(null);
		setToDate(null);
		setAppliedFilters({
			userRole: "",
			userType: "",
			fromDate: null,
			toDate: null,
		});
		setCommittedFilters({
			userRole: "",
			userType: "",
			fromDate: null,
			toDate: null,
		});
		setIsFiltered(false);
		setSearchQuery("");
		setTotalPages(0);
		setRoData([]);
		setMaxCurrentPage(0);
		setIsMoreDataAvailable(true);
		
		if (currentPage !== 1) {
			setCurrentPage(1);
		} else {
			setCurrentPage(0);
			setTimeout(() => setCurrentPage(1), 0);
		}
	};

	// Handle Pagination
	const handlePrevNext = (direction) => {
		if (direction === "prev" && currentPage > 1) {
			setCurrentPage(currentPage - 1);
		} else if (direction === "next") {
			if (isMoreDataAvailable) {
				setCurrentPage(currentPage + 1);
			} else {
				const totalPages = Math.ceil(roData.length / rowsPerPage);
				setTotalPages(totalPages);
				if (currentPage < totalPages) {
					setCurrentPage(currentPage + 1);
				}
			}
		}
	};

	const handleSelectAll = () => {
		const currentPageUserIds = filteredDataBySearch.map((user) => user.user_id);

		if (selectAll) {
			// Deselect only current page users
			setSelectedUsers((prev) =>
				prev.filter((id) => !currentPageUserIds.includes(id))
			);
		} else {
			// Select current page users
			setSelectedUsers((prev) => [
				...prev,
				...currentPageUserIds.filter((id) => !prev.includes(id)),
			]);
		}

		setSelectAll(!selectAll);
	};

	const handleCheckboxChange = (user_id) => {
		if (selectedUsers.includes(user_id)) {
			setSelectedUsers(selectedUsers.filter((id) => id !== user_id));
		} else {
			setSelectedUsers([...selectedUsers, user_id]);
		}
	};

	const approveSelectedUsers = () => {
		if (selectedUsers.length === 0) {
			Swal.fire(
				"No Users Selected",
				"Please select users to approve.",
				"warning"
			);
			return;
		}

		console.log("Approving Users:", selectedUsers);

		Swal.fire(
			"Users Approved",
			`Successfully approved ${selectedUsers.length} user(s).`,
			"success"
		);

		// Clear selection after approval
		setSelectedUsers([]);
		setSelectAll(false);
	};

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
		if (!isFiltered) {
			Swal.fire({
				title: "Warning",
				text: "Please apply filters that return data before creating a task.",
				icon: "warning",
				confirmButtonColor: "#f1c40f",
			});
			return;
		}
	};

	const handleUserTypeChange = (e) => {
		setUserType(e.target.value || "");
	};

	const handleUserRoleChange = (e) => {
		setUserRole(e.target.value || "");
	};

	// Display loading animation when data is loading
	if (isLoading && roData.length === 0) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	if (error) return <div>Error: {error}</div>;

	return (
		<div className={`${GlobalStyle.fontPoppins} px-4 sm:px-6 lg:px-8`}>
			{/* Header Section - Responsive */}
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
				<h1
					className={`${GlobalStyle.headingLarge} text-xl sm:text-2xl lg:text-3xl`}
				>
					User Approval
				</h1>
			</div>

			{/* Search and Filters - Responsive */}
			<div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
				{/* Search Bar */}
				<div className={GlobalStyle.searchBarContainer} >
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className={`${GlobalStyle.inputSearch} w-full`}
				/>
				<FaSearch className={GlobalStyle.searchBarIcon} />
				</div>

				{/* Filters */}
				<div className={`${GlobalStyle.cardContainer} w-full lg:w-auto`}>
					<div className="flex flex-col lg:flex-row gap-4 sm:items-start w-full">
						
						{/* User Type Filter */}
						<div className="w-full">
							<select
								value={userType}
								onChange={handleUserTypeChange}
								className={`${GlobalStyle.selectBox} w-[200px]`}
								style={{ color: userType === "" ? "gray" : "black" }}
							>
								<option value="" hidden>User Type</option>
								<option value="Slt" style={{ color: "black" }}>SLT</option>
								<option value="Drcuser" style={{ color: "black" }}>DRC User</option>
								<option value="ro" style={{ color: "black" }}>RO</option>
							</select>
						</div>
						
						<div className="flex flex-col lg:flex-row gap-2 items-center">
							<label className={GlobalStyle.dataPickerDate}>Date</label>
							<DatePicker
								selected={fromDate}
								onChange={handleFromDateChange}
								dateFormat="dd/MM/yyyy"
								placeholderText="From"
								className={`${GlobalStyle.inputText} w-full sm:w-auto`}
							/>
							<DatePicker
								selected={toDate}
								onChange={handleToDateChange}
								dateFormat="dd/MM/yyyy"
								placeholderText="To"
								className={`${GlobalStyle.inputText}  w-full sm:w-auto`}
							/>
						</div>
											
						{/* Filter Button */}
						<button
							onClick={handleFilter}
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

			{/* Table Container - Responsive */}
			<div className="overflow-x-auto -mx-4 sm:mx-0">
				<div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
					{/* Desktop Table View */}
					<table
						className={`${GlobalStyle.table} hidden md:table min-w-full overflow-x-scroll`}
					>
						<thead className={GlobalStyle.thead}>
							<tr>
								<th scope="col" className={`${GlobalStyle.tableHeader}`}>
									<input
										type="checkbox"
										checked={selectAll}
										onChange={handleSelectAll}
										className="cursor-pointer"
									/>
								</th>
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
								<th scope="col" className={`${GlobalStyle.tableHeader}`}>
									LOGIN METHOD
								</th>
								<th scope="col" className={`${GlobalStyle.tableHeader}`}>
									CREATED DATE
								</th>
							</tr>
						</thead>
						<tbody>
							{filteredDataBySearch.map((user, index) => (
								<tr
									key={user.user_id}
									className={`${
										index % 2 === 0
											? GlobalStyle.tableRowEven
											: GlobalStyle.tableRowOdd
									}`}
								>
									<td className={`${GlobalStyle.tableData} text-center`}>
										<input
											type="checkbox"
											checked={selectedUsers.includes(user.user_id)}
											className="cursor-pointer"
											onChange={() => handleCheckboxChange(user.user_id)}
										/>
									</td>
									<td className={`${GlobalStyle.tableData}`}>{user.user_id}</td>
									<td className={`${GlobalStyle.tableData}`}>
										{user.user_name}
									</td>
									<td className={`${GlobalStyle.tableData}`}>
										{user.user_type}
									</td>
									<td className={`${GlobalStyle.tableData} break-all`}>
										{user.user_email}
									</td>
									<td className={`${GlobalStyle.tableData} break-all`}>
										{user.login_method}
									</td>
									<td className={`${GlobalStyle.tableData}`}>
										{user.created_on}
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
					<div className="md:hidden space-y-4">
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
					</div>
				</div>
			</div>

			{/* Pagination - Following Monitor Settlement pattern */}
			{filteredDataBySearch.length > 0 && (
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

			{filteredDataBySearch.length > 0 && (
				<div className="flex justify-end mt-4">
					<button
						onClick={approveSelectedUsers}
						className={`${GlobalStyle.buttonPrimary} text-sm px-6 py-2`}
					>
						Approve
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