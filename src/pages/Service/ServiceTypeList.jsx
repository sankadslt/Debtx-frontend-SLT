import { useState, useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import editIcon from "../../assets/images/edit-info.svg";
import Swal from "sweetalert2";
import {
	changeServiceStatus,
	registerServiceType,
	getAllServices,
} from "../../services/Service/service.js";
import { jwtDecode } from "jwt-decode";
import activeIcon from "../../assets/images/Service/Active.png";
import inactiveIcon from "../../assets/images/Service/Inactive.png";

export default function ServiceTypeList() {
	const [searchQuery, setSearchQuery] = useState("");
	const [currentStatus, setCurrentStatus] = useState("");
	const [serviceData, setServiceData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [serviceType, setServiceType] = useState("");
	const [editableRowId, setEditableRowId] = useState(null);
	const [editedStatus, setEditedStatus] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	// Pagination State
	const [currentPage, setCurrentPage] = useState(1);
	const rowsPerPage = 10;
	const totalPages = Math.ceil(filteredData.length / rowsPerPage);
	const startIndex = (currentPage - 1) * rowsPerPage;
	const endIndex = startIndex + rowsPerPage;
	const paginatedData = filteredData.slice(startIndex, endIndex);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const response = await getAllServices();
				const services = response.data.mongo || [];

				const formattedServices = services.map((item) => ({
					Service_id: item.service_id,
					Status: item.service_status,
					Service_type: item.service_type,
				}));

				setServiceData(formattedServices);
				setFilteredData(formattedServices);
			} catch (error) {
				console.error("Error fetching services:", error);
				Swal.fire({
					title: "Error",
					text: "Failed to fetch services.",
					icon: "error",
				});
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		setCurrentPage(1); // Reset to first page when data changes
	}, [filteredData]);

	const handleStatusChange = (e) => {
		setCurrentStatus(e.target.value);
	};

	const handleFilterButton = () => {
		if (!currentStatus) {
			Swal.fire({
				title: "Warning",
				text: "No status selected. Please select a status to filter.",
				icon: "warning",
				allowOutsideClick: false,
				allowEscapeKey: false,
			});
			return;
		}
		const filtered = serviceData.filter((item) =>
			currentStatus ? item.Status === currentStatus : true
		);
		setFilteredData(filtered);
	};

	const handleClear = () => {
		setCurrentStatus("");
		setSearchQuery("");
		setFilteredData(serviceData);
	};

	// Searching
	useEffect(() => {
		const query = searchQuery.toLowerCase();
		const filtered = serviceData.filter((item) => {
			const idMatch = item.Service_id?.toString().toLowerCase().includes(query);
			const typeMatch = item.Service_type?.toLowerCase().includes(query);
			return idMatch || typeMatch;
		});
		setFilteredData(filtered);
	}, [searchQuery, serviceData]);

	const handleServiceTypeSubmit = async (e) => {
		e.preventDefault();
		if (!serviceType.trim()) {
			Swal.fire({
				title: "Warning",
				text: "Service type cannot be empty.",
				icon: "warning",
				allowOutsideClick: false,
				allowEscapeKey: false,
			});
			return;
		}

		try {
			const token = localStorage.getItem("accessToken");
			if (!token) throw new Error("No access token found");

			const decoded = jwtDecode(token);
			const created_by = decoded?.name || decoded?.username || "Unknown";

			console.log("Submitting:", {
				service_type: serviceType,
				create_by: created_by,
			});

			await registerServiceType({
				service_type: serviceType,
				create_by: created_by,
			});

			Swal.fire({
				title: "Success",
				text: "Service type submitted successfully!",
				icon: "success",
				timer: 1500,
				showConfirmButton: false,
			});
			setServiceType("");

			const response = await getAllServices();
			const services = response.data.mongo || [];

			const formattedServices = services.map((item) => ({
				Service_id: item.service_id,
				Status: item.service_status,
				Service_type: item.service_type,
			}));

			setServiceData(formattedServices);
			setFilteredData(formattedServices);
		} catch (error) {
			console.error("Error submitting service type:", error);
			Swal.fire({
				title: "Error",
				text: "Failed to submit service type.",
				icon: "error",
			});
		}
	};

	const handleEditClick = (item) => {
		setEditableRowId(item.Service_id);
		setEditedStatus(item.Status);
	};

	const handleSaveClick = async () => {
		try {
			await changeServiceStatus({
				service_id: editableRowId,
				service_status: editedStatus,
			});
			const updated = serviceData.map((item) =>
				item.Service_id === editableRowId
					? { ...item, Status: editedStatus }
					: item
			);
			setServiceData(updated);
			setFilteredData(updated);
			setEditableRowId(null);
			Swal.fire({
				title: "Success",
				text: "Status updated successfully!",
				icon: "success",
				timer: 1500,
				showConfirmButton: false,
			});
		} catch (error) {
			console.error("Error updating status:", error);
			Swal.fire({
				title: "Error",
				text: "Failed to update status.",
				icon: "error",
			});
		}
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
			<h2
				className={`${GlobalStyle.headingLarge} text-xl sm:text-2xl lg:text-3xl mt-8`}
			>
				Service List
			</h2>

			{/* Search and Filter */}
			<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mt-8 w-full">
				<div className="mt-4 sm:mt-0 w-fit sm:max-w-md">
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

				<div
					className={`${GlobalStyle.cardContainer} flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-end items-stretch`}
				>
					<select
						name="status"
						value={currentStatus}
						onChange={handleStatusChange}
						className={`${GlobalStyle.selectBox} w-full sm:w-32 md:w-40`}
					>
						<option value="">Select Status</option>
						<option value="Active">Active</option>
						<option value="Inactive">Inactive</option>
					</select>

					<button
						onClick={handleFilterButton}
						className={GlobalStyle.buttonPrimary}
					>
						Filter
					</button>
					<button onClick={handleClear} className={GlobalStyle.buttonRemove}>
						Clear
					</button>
				</div>
			</div>

			{/* Table */}
			<div className={`${GlobalStyle.tableContainer} overflow-x-auto`} style={{ maxWidth: '80%', margin: '0 auto', height: 'auto' }}>
				<table className={`${GlobalStyle.table} table-auto w-full`} style={{ fontSize: '0.875rem', height: 'auto' }}>
					<thead className={GlobalStyle.thead}>
						<tr>
							<th className={GlobalStyle.tableHeader} style={{  width: '20%' }}>Service ID</th>
							<th className={GlobalStyle.tableHeader} style={{  width: '20%' }}>Status</th>
							<th className={GlobalStyle.tableHeader} style={{  width: '40%' }}>Service Type</th>
							<th className={GlobalStyle.tableHeader} style={{  width: '20%' }}></th>
						</tr>
					</thead>
					<tbody>
						{paginatedData.length > 0 ? (
							paginatedData.map((item, index) => (
								<tr
									key={item.Service_id}
									className={`${
										index % 2 === 0 ? "bg-white bg-opacity-75" : "bg-gray-50 bg-opacity-50"
									} border-b`}
								>
									<td className={GlobalStyle.tableData}>{item.Service_id}</td>
									<td className={`${GlobalStyle.tableData} flex justify-center items-center`}>
										{editableRowId === item.Service_id ? (
											<select
												value={editedStatus}
												onChange={(e) => setEditedStatus(e.target.value)}
												className={`${GlobalStyle.selectBox} w-24`}
											>
												<option value="Active">Active</option>
												<option value="Inactive">Inactive</option>
											</select>
										) : (
											<div className="relative group">
												<img
													src={item.Status === "Active" ? activeIcon : inactiveIcon}
													alt={item.Status}
													className="w-6 h-6"
												/>
												<div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
													{item.Status}
													<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800"></div>
												</div>
											</div>
										)}
									</td>
									<td className={GlobalStyle.tableData}>
										{item.Service_type}
									</td>
									<td className={`${GlobalStyle.tableData} flex justify-center`}>
										{editableRowId === item.Service_id ? (
											<button
												onClick={handleSaveClick}
												className={`${GlobalStyle.buttonPrimary} text-sm px-3 py-1`}
											>
												Save
											</button>
										) : (
											<img
												src={editIcon}
												alt="edit info"
												title="Edit"
												className="w-6 h-6 cursor-pointer"
												onClick={() => handleEditClick(item)}
											/>
										)}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="4" className="text-center py-4">
									No data found.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className={GlobalStyle.navButtonContainer}>
					<button
						onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
						disabled={currentPage === 1}
						className={`${GlobalStyle.navButton} ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
					>
						<FaArrowLeft />
					</button>
					<span>Page {currentPage} </span>
					<button
						onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
						disabled={currentPage === totalPages}
						className={`${GlobalStyle.navButton} ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
					>
						<FaArrowRight />
					</button>
				</div>
			)}

			{/* Service Type Submission Form */}
			<div className="mt-10 px-4 md:px-0">
				<form
					className="flex flex-wrap items-center gap-4 max-w-lg w-full mx-auto"
				>
					<label htmlFor="serviceType" className="font-medium">
						Service Type :
					</label>
					<input
						id="serviceType"
						type="text"
						value={serviceType}
						onChange={(e) => setServiceType(e.target.value)}
						className={`${GlobalStyle.inputText} flex-1 min-w-[200px]`}
						
					/>
					<button
						type="submit"
						onClick={handleServiceTypeSubmit}
						className={GlobalStyle.buttonPrimary}
					>
						Submit
					</button>
				</form>
			</div>
		</div>
	);
}