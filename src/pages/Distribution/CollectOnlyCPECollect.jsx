
/*
Purpose: 
Created Date: 2025.01.22
Created By: Buthmi Mithara
Last Modified Date: 2025.01.24
Modified By:Nadali Linara
Version: node 11
ui number : 1.7.3
Dependencies: tailwind css
Related Files: 
Notes: 

*/



import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import Open_CPE_Collect from "../../assets/images/Open_CPE_Collect.png";
import { List_Incidents_CPE_Collect } from "../../services/Incidents/incidentService";

export default function CollectOnlyCPECollect() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [selectAllData, setSelectAllData] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const rowsPerPage = 7;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await List_Incidents_CPE_Collect();
        setIncidents(result.data);
      } catch (err) {
        setError(err.message || "Failed to fetch incidents.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading incidents...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleFromDateChange = (date) => {
    if (toDate && date > toDate) {
      setError("The 'From' date cannot be later than the 'To' date.");
    } else {
      setError(null);
      setFromDate(date);
    }
  };

  const handleToDateChange = (date) => {
    if (fromDate && date < fromDate) {
      setError("The 'To' date cannot be earlier than the 'From' date.");
    } else {
      setError(null);
      setToDate(date);
    }
  };

  const filteredData = incidents.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const pages = Math.ceil(filteredData.length / rowsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < pages - 1) setCurrentPage(currentPage + 1);
  };

  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleRowCheckboxChange = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAllDataChange = () => {
    if (selectAllData) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map((row) => row.Incident_Id));
    }
    setSelectAllData(!selectAllData);
  };

  return (
    <div className={GlobalStyle.fontPoppins}>
      <div className="flex justify-between items-center w-full gap-4">
        <h1 className={`${GlobalStyle.headingLarge} m-0 pr-4`}>
          Incidents Ready for Distribute to Collect Only CPE
        </h1>
        <Link
          className={`${GlobalStyle.buttonPrimary}pr-4 `}
          to="/lod/ftllod/ftllod/downloadcreateftllod"
        >
          Create task and let me know
        </Link>
      </div>

      {/* Filter Section */}
      <div className="flex justify-end gap-10 my-12 items-center">
        {/* Source Dropdown */}
        <div className="flex items-center gap-4">
          <label>Source:</label>
          <select
            className={GlobalStyle.inputText}
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
          >
            <option value="">Select</option>
            <option value="Pilot - Suspended">Pilot - Suspended</option>
            <option value="Special">Special</option>
            <option value="Product Terminate">Product Terminate</option>
          </select>
        </div>

        {/* Date Picker Section */}
        <div className="flex items-center gap-4">
          <label>Date:</label>
          <DatePicker
            selected={fromDate}
            onChange={handleFromDateChange}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/MM/yyyy"
            className={GlobalStyle.inputText}
          />
          <DatePicker
            selected={toDate}
            onChange={handleToDateChange}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/MM/yyyy"
            className={GlobalStyle.inputText}
          />
          {error && <span className={GlobalStyle.errorText}>{error}</span>}
        </div>

        {/* Filter Button */}
        <button
          className={`${GlobalStyle.buttonPrimary} h-[35px]`}
          onClick={() => {}}
        >
          Filter
        </button>
      </div>

      {/* Table Section */}
      <div className="flex flex-col">
        {/* Search Bar Section */}
        <div className="mb-4 flex justify-start">
          <div className={GlobalStyle.searchBarContainer}>
            <input
              type="text"
              placeholder=""
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={GlobalStyle.inputSearch}
            />
            <FaSearch className={GlobalStyle.searchBarIcon} />
          </div>
        </div>
        <div className={GlobalStyle.tableContainer}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th>Select</th>
              <th>ID</th>
              <th>Status</th>
              <th>Account No.</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr key={row.Incident_Id} className="border-b">
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row.Incident_Id)}
                    onChange={() => handleRowCheckboxChange(row.Incident_Id)}
                  />
                </td>
                <td>
                  <a href={`#${row.Incident_Id}`} className="hover:underline">
                    {row.Incident_Id}
                  </a>
                </td>
                <td>
                  {row.Incident_Status?.toLowerCase() === "open cpe collect" ? (
                    <img
                      src={Open_CPE_Collect}
                      alt="Open CPE Collect"
                      className="w-5 h-5"
                    />
                  ) : (
                    <span>No Status Icon</span>
                  )}
                </td>
                <td>{row.Account_Num || "N/A"}</td>
                <td>
                  <button
                    className={`${GlobalStyle.buttonPrimary} mx-auto`}
                    onClick={() =>
                      console.log("Action triggered for", row.Incident_Id)
                    }
                  >
                    Proceed
                  </button>
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Navigation Buttons */}
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

      <div className="flex justify-end items-center w-full mt-6">
        {/* Select All Data Checkbox */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="rounded-lg"
            checked={
              selectAllData ||
              filteredData.every((row) => selectedRows.includes(row.id))
            } // Reflect selection state
            onChange={handleSelectAllDataChange}
          />
          Select All Data
        </label>

        <Link
          className={`${GlobalStyle.buttonPrimary} ml-4`}
          to="/lod/ftllod/ftllod/downloadcreateftllod"
        >
          Proceed
        </Link>
      </div>
    </div>
  );
}
