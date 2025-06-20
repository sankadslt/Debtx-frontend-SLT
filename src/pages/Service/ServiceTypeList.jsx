/* Purpose: This template is used for the 12.1 & 12.2 - Service Type List .
Created Date: 2025-06-11
Created By: Sehan (ravishanhenadeera@gmail.com)
Edited By: Lishan (lishanweerasuriya@gmail.com)
Version: node 20
UI number :12.1 & 12.2
Dependencies: tailwind css
Related Files: (routes and service.js)
Notes:The following page conatins the code for the Service Type List Screen */

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
import { getLoggedUserId } from "../../services/auth/authService.js";
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
	const [currentPage, setCurrentPage] = useState(0);
	const rowsPerPage = 10;
	const pages = Math.ceil(filteredData.length / rowsPerPage);
	const startIndex = currentPage * rowsPerPage;
	const endIndex = startIndex + rowsPerPage;
	const paginatedData = filteredData.slice(startIndex, endIndex);

	useEffect(() => {
		const fetchData = async () => {
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
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		setCurrentPage(0); // reset to first page when data changes
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
		} catch (error) {
			console.error("Error updating status:", error);
		}
	};

	return (
		<div className={GlobalStyle.fontPoppins}>
			<h2
				className={`${GlobalStyle.headingLarge} text-xl sm:text-2xl lg:text-3xl mt-8`}
			>
				Service Type List
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
							placeholder="Search by Service ID or Type"
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
			<div>
				<div className={`${GlobalStyle.tableContainer} overflow-x-auto w-full`}>
					<table className={GlobalStyle.table}>
						<thead className={GlobalStyle.thead}>
							<tr>
								<th className={GlobalStyle.tableHeader}>Service ID</th>
								<th className={GlobalStyle.tableHeader}>Status</th>
								<th className={GlobalStyle.tableHeader}>Service Type</th>
								<th className={GlobalStyle.tableHeader}></th>
							</tr>
						</thead>
						<tbody>
							{paginatedData.length > 0 ? (
								paginatedData.map((item) => (
									<tr
										key={item.Service_id}
										className={GlobalStyle.tableRowEven}
									>
										<td className={GlobalStyle.tableData}>{item.Service_id}</td>
										<td className={GlobalStyle.tableData}>
											{editableRowId === item.Service_id ? (
												<select
													value={editedStatus}
													onChange={(e) => setEditedStatus(e.target.value)}
													className={GlobalStyle.selectBox}
												>
													<option value="Active">Active</option>
													<option value="Inactive">Inactive</option>
												</select>
											) : (
												<div className="flex items-center gap-2">
													{item.Status === "Active" && (
														<img
															src={activeIcon}
															alt="Active"
															className="w-5 h-5"
														/>
													)}
													{item.Status === "Inactive" && (
														<img
															src={inactiveIcon}
															alt="Inactive"
															className="w-5 h-5"
														/>
													)}
												</div>
											)}
										</td>
										<td className={GlobalStyle.tableData}>
											{item.Service_type}
										</td>
										<td
											className={`${GlobalStyle.tableData} flex justify-center`}
										>
											{editableRowId === item.Service_id ? (
												<button
													onClick={handleSaveClick}
													className={GlobalStyle.buttonPrimary}
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
			</div>

			{/* Pagination */}
			{pages > 1 && (
				<div className="flex justify-center items-center gap-4 mt-6">
					<button
						onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
						disabled={currentPage === 0}
						className={`${GlobalStyle.navButton} disabled:opacity-50`}
					>
						<FaArrowLeft />
					</button>
					<span className="text-sm">
						Page {currentPage + 1} of {pages}
					</span>
					<button
						onClick={() =>
							setCurrentPage((prev) => Math.min(prev + 1, pages - 1))
						}
						disabled={currentPage === pages - 1}
						className={`${GlobalStyle.navButton} disabled:opacity-50`}
					>
						<FaArrowRight />
					</button>
				</div>
			)}

			{/* Service Type Submission Form */}
			<div className="mt-10 px-4 md:px-0">
				<form
					// onSubmit={handleServiceTypeSubmit}
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
						placeholder="Enter Service Type"
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
