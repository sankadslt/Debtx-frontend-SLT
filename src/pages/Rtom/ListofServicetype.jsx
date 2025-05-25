/*Purpose: List of Service Type
Created Date: 2025-04-02
Created By: Dasindu Dinsara (dinsaradasindu@gmail.com)
UI Number: 12.1 /12.2
Dependencies: Tailwind CSS
Related Files: 
Notes: This component uses Tailwind CSS for styling */

import { useState } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import activeIcon from "../../assets/images/ConfigurationImg/Active.png";
import inactiveIcon from "../../assets/images/ConfigurationImg/Inactive.png";
import terminatedIcon from "../../assets/images/ConfigurationImg/Terminate.png";

const ListofServicetype = () => {
    const [status, setStatus] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [editingId, setEditingId] = useState(null);
    const [editStatus, setEditStatus] = useState("");
    const [appliedFilters, setAppliedFilters] = useState({ status: "" });

    const rowsPerPage = 7;
    const statuses = ["Active", "Inactive"];

    const [serviceData, setServiceData] = useState([
        { id: "0001", status: "Active", type: "Peo" },
        { id: "0002", status: "Inactive", type: "Fiber" },
        { id: "0003", status: "Active", type: "Peo" },
    ]);

    const getStatusIcon = (status) => {
              switch (status?.toLowerCase()) {
                  case "active":
                      return activeIcon;
                  case "inactive":
                      return inactiveIcon;
                  case "ended":
                      return terminatedIcon;
                  default:
                      return null;
              }
          };
      
      
          const renderStatusIcon = (status) => {
              const iconPath = getStatusIcon(status);
      
              if (!iconPath) {
                  return <span>{status}</span>;
              }
      
              return (
                  <img
                      src={iconPath}
                      alt={status}
                      className="w-6 h-6"
                      title={status}
                  />
              );
          };
    

    const [formData, setFormData] = useState({
        billingCenterCode: "",
        name: ""
    });

    const filteredData = serviceData.filter((row) => {
        const matchesSearchQuery = Object.values(row)
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesStatus = !appliedFilters.status || row.status === appliedFilters.status;

        return matchesSearchQuery && matchesStatus;
    });

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

    const handleFilter = () => {
        setAppliedFilters({ status });
        setCurrentPage(0);
    };

    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return (
        <div className={`p-6 ${GlobalStyle.fontPoppins}`}>
            <h1 className={GlobalStyle.headingLarge}>Service Types List</h1>

            {/* Filter Section */}
<div className="flex justify-end mt-5 mr-8">
    <div className={`${GlobalStyle.cardContainer} w-auto h-auto py-4`}>
        <div className="flex gap-4 justify-end">
            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={GlobalStyle.selectBox}
            >
                <option value="" disabled hidden>
                    Select Status
                </option>
                {statuses.map((statusOption, index) => (
                    <option key={index} value={statusOption}>
                        {statusOption}
                    </option>
                ))}
            </select>

            <button
                onClick={handleFilter}
                className={`${GlobalStyle.buttonPrimary} flex items-center gap-2`}
            >
                Filter
            </button>

            <button
                onClick={() => {
                    setStatus("");
                    setSearchQuery("");
                    setAppliedFilters({ status: "" });
                    setCurrentPage(0);
                }}
                className={GlobalStyle.buttonRemove}
            >
                Clear
            </button>
        </div>
    </div>
</div>


            {/* Search Section */}
            <div className="mb-8 flex justify-start">
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

            {/* Service Types Table */}
            <div className="grid place-items-center">
                <div className={`${GlobalStyle.cardContainer} w-[950px]`}>
                    <div className={GlobalStyle.tableContainer}>
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
                                {paginatedData.map((service, index) => (
                                    <tr key={index} className={`${index % 2 === 0 ? "bg-white bg-opacity-75" : "bg-gray-50 bg-opacity-50"} border-b`}>
                                        <td className={GlobalStyle.tableData}>{service.id}</td>
                                        <td className={`${GlobalStyle.tableData} ${editingId === service.id ? "" : (service.status === "Active" ? "text-green-600" : "text-red-600")}`}>
                                            {editingId === service.id ? (
                                                <select
                                                    value={editStatus}
                                                    onChange={(e) => setEditStatus(e.target.value)}
                                                    className={GlobalStyle.selectBox}
                                                >
                                                    {statuses.map((statusOption) => (
                                                        <option key={statusOption} value={statusOption}>
                                                            {statusOption}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : renderStatusIcon(
                                                service.status
                                            )}
                                        </td>
                                        <td className={GlobalStyle.tableData}>{service.type}</td>
                                        <td className={GlobalStyle.tableData}>
                                            <button
                                                className={`${GlobalStyle.buttonPrimary} flex items-center gap-2`}
                                                onClick={() => {
                                                    if (editingId === service.id) {
                                                        setServiceData(prevData =>
                                                            prevData.map(item =>
                                                                item.id === service.id
                                                                    ? { ...item, status: editStatus }
                                                                    : item
                                                            )
                                                        );
                                                        setEditingId(null);
                                                    } else {
                                                        setEditingId(service.id);
                                                        setEditStatus(service.status);
                                                    }
                                                }}
                                            >
                                                {editingId === service.id ? "Save" : "Edit"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination Section */}
                {filteredData.length > rowsPerPage && (
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

                {/* Add New Service Type */}
                <div className="grid place-items-center mt-5">
                    <div className={`${GlobalStyle.cardContainer} w-[950px] h-[100px] py-8`}>
                        <div className="flex items-center justify-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-36 flex justify-between font-semibold">
                                    <span>Service Type</span>
                                    <span>:</span>
                                </div>
                                <input
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={GlobalStyle.inputText}
                                />
                            </div>
                            <button className={GlobalStyle.buttonPrimary}>Submit</button>
                        </div>
                    </div>
                </div>



            </div>
        </div>
    );
};

export default ListofServicetype;
