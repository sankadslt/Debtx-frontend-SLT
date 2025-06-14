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
import { FaSearch } from "react-icons/fa";
import editIcon from "../../assets/images/edit-info.svg";
import Swal from "sweetalert2";
import {
	changeServiceStatus,
	registerServiceType,
	getAllServices,
} from "../../services/Service/service.js";

export default function ServiceTypeList() {
	const [searchQuery, setSearchQuery] = useState("");
	const [currentStatus, setCurrentStatus] = useState("");
	const [serviceData, setServiceData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [serviceType, setServiceType] = useState("");
	const [editableRowId, setEditableRowId] = useState(null);
	const [editedStatus, setEditedStatus] = useState("");

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await getAllServices();
				// Access the array inside the correct key (here 'mongo')
				const services = response.data.mongo || [];

				// Map data to your UI-friendly format if you want, or just set directly
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

	useEffect(() => {
		const filtered = serviceData.filter((item) =>
			item.Service_id?.toString()
				.toLowerCase()
				.includes(searchQuery.toLowerCase())
		);
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
			await registerServiceType({ service_type: serviceType });
			Swal.fire({
				title: "Success",
				text: "Service type submitted successfully!",
				icon: "success",
				timer: 1500,
				showConfirmButton: false,
			});

			setServiceType("");

			const response = await getAllServices();
			setServiceData(response.data);
			setFilteredData(response.data);
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
			// Update state locally
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

			<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mt-8 w-full">
				{/* Search */}
				<div className="mt-4 sm:mt-0 w-fit sm:max-w-md">
					<div className={GlobalStyle.searchBarContainer}>
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className={GlobalStyle.inputSearch}
							placeholder="Search"
						/>
						<FaSearch className={GlobalStyle.searchBarIcon} />
					</div>
				</div>

				{/* Filter Section */}
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
						<option value="Terminate">Terminate</option>
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
							{Array.isArray(filteredData) && filteredData.length > 0 ? (
								filteredData.map((item) => (
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
													<option value="Terminate">Terminate</option>
												</select>
											) : (
												item.Status
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

			{/* Service Type Submission Form */}
			<div className="mt-10 px-4 md:px-0">
				<form
					onSubmit={handleServiceTypeSubmit}
					className="flex flex-wrap items-center gap-4 max-w-5xl mx-auto"
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
						placeholder="Enter service type"
					/>
					<button type="submit" className={GlobalStyle.buttonPrimary}>
						Submit
					</button>
				</form>
			</div>
		</div>
	);
}
