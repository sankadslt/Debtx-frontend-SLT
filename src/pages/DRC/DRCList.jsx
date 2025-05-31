/*Purpose:
Created Date: 2025-05-25
Created By: Nimesha Kavindhi (nimeshakavindhi4@gmail.com)
Version: React v18
ui number : 10.1
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import editImg from "../../assets/images/more.svg";
import ListImg from "../../assets/images/ConfigurationImg/list.png";

import activeIcon from "../../assets/images/ConfigurationImg/Active.png";
import inactiveIcon from "../../assets/images/ConfigurationImg/Inactive.png";
import terminatedIcon from "../../assets/images/ConfigurationImg/Terminate.png";
import { List_All_DRC_Details } from "../../services/drc/Drc";
import { Link } from "react-router-dom";

const DRCList = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const rowsPerPage = 8;
  const [DRCStatus, setDRCStatus] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const navigate = useNavigate();

  // const getStatusIcon = (status) => {
  //     switch (status?.toLowerCase()) {
  //         case "incident open":
  //             return "/src/assets/images/incidents/Incident_Open.png";
  //         case "incident reject":
  //             return "/src/assets/images/incidents/Incident_Reject.png";
  //         case "incident inprogress":
  //             return "/src/assets/images/incidents/Incident_InProgress.png";
  //         default:
  //             return null;
  //     }
  // };

  // const renderStatusIcon = (status) => {
  //     const iconPath = getStatusIcon(status);

  //     if (!iconPath) {
  //         return <span>{status}</span>;
  //     }

  //     return (
  //         <img
  //             src={iconPath}
  //             alt={status}
  //             className="w-6 h-6"
  //             title={status}
  //         />
  //     );
  // };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return activeIcon;
      case "inactive":
        return inactiveIcon;
      case "terminate":
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
      <img src={iconPath} alt={status} className="w-6 h-6" title={status} />
    );
  };

  // Updated fetchDRCList function to use dummy data
  const fetchDRCList = async (filters) => {
    try {
      console.log("Sending filters:", filters);

      // Call the actual API endpoint with filters
      const response = await List_All_DRC_Details(filters.Status || "");

      // Map the API response to match your frontend data structure
      return response.map((drc) => ({
        DRCID: drc.id,
        Status: drc.status,
        BusinessRegNo: drc.business_registration_number,
        DRCName: drc.drc_name || drc.value,
        ContactNo: drc.teli_no || drc.tel,
        ServiceCount: drc.service_count,
        ROCount: drc.ro_count || drc.roCount || 0,
        RTOMCount: drc.rtom_count || drc.rtomCount || 0,
      }));
    } catch (error) {
      console.error("Detailed error:", error);
      throw new Error(
        error.response?.data?.error || "An error occurred while fetching data"
      );
    }
  };

  const fetchData = async (filters) => {
    setIsLoading(true);
    try {
      const DRCList = await fetchDRCList(filters);
      setData(DRCList);
      setIsFiltered(DRCList.length > 0);
    } catch (error) {
      setIsFiltered(false);
      Swal.fire(
        "Error",
        error.message || "No DRC is matching the criteria.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      const filters = {
        Status: DRCStatus,
      };
      await fetchData(filters);
    } catch (error) {
      Swal.fire(
        "Error",
        error.message || "No DRS is matching the criteria",
        "error"
      );
    }
  };

  useEffect(() => {
    fetchData({});
  }, []);

  const HandleAddDRC = () => navigate("/pages/DRC/Add_DRC");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const filteredData = data.filter(
    (row) =>
      String(row.DRCID).toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(row.Status).toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(row.BusinessRegNo)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      String(row.DRCName).toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(row.ContactNo).toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(row.ServiceCount)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      String(row.ROCount).toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(row.RTOMCount).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

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

  // Add this function to handle image click
  const handleEditClick = (drcId) => {
    navigate(`/pages/DRC/DRCInfo`, {
      state: { drcId: drcId },
    });
  };

  return (
    <div className={GlobalStyle.fontPoppins}>
      <h2 className={GlobalStyle.headingLarge}>DRC List</h2>

      <div className="flex justify-end mt-6">
        <button className={GlobalStyle.buttonPrimary} onClick={HandleAddDRC}>
          Add
        </button>
      </div>

      <div className="flex items-center justify-between w-full mb-8 mt-8">
        <div className={GlobalStyle.searchBarContainer}>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={GlobalStyle.inputSearch}
          />
          <FaSearch className={GlobalStyle.searchBarIcon} />
        </div>
        <div className="flex items-center space-x-6">
          <select
            value={DRCStatus}
            onChange={(e) => setDRCStatus(e.target.value)}
            className={GlobalStyle.selectBox}
          >
            <option value="" disabled hidden>
              Select Status
            </option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Ended">Terminated</option>
          </select>

          <button onClick={handleFilter} className={GlobalStyle.buttonPrimary}>
            Filter
          </button>
        </div>
      </div>

      <div className={GlobalStyle.tableContainer}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th className={GlobalStyle.tableHeader}>DRC ID</th>
              <th className={GlobalStyle.tableHeader}>Status</th>
              <th className={GlobalStyle.tableHeader}>Bussiness Reg. No.</th>
              <th className={GlobalStyle.tableHeader}>DRC Name</th>
              <th className={GlobalStyle.tableHeader}>Conatact No.</th>
              <th className={GlobalStyle.tableHeader}>Service Count</th>
              <th className={GlobalStyle.tableHeader}>RO Count</th>
              <th className={GlobalStyle.tableHeader}>RTOM Count</th>
              <th className={GlobalStyle.tableHeader}></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((log, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? "bg-white bg-opacity-75"
                      : "bg-gray-50 bg-opacity-50"
                  } border-b`}
                >
                  <td className={GlobalStyle.tableData}>{log.DRCID}</td>
                  <td className={GlobalStyle.tableData}>
                    {renderStatusIcon(log.Status)}
                  </td>
                  <td className={GlobalStyle.tableData}>{log.BusinessRegNo}</td>
                  <td className={GlobalStyle.tableData}>{log.DRCName}</td>
                  <td className={GlobalStyle.tableData}>{log.ContactNo}</td>
                  <td className={GlobalStyle.tableData}>
                    <Link to={`/pages/DRC/DRCDetails?drcid=${log.DRCID}&drcname=${encodeURIComponent(
                          log.DRCName
                        )}&tab=Services`}
                      >
                      {log.ServiceCount}
                    </Link>
                  </td>
                  <td className={GlobalStyle.tableData}>
                    <Link
                      to={`/pages/DRC/DRCDetails?drcid=${log.DRCID}&drcname=${encodeURIComponent(
                        log.DRCName
                      )}&tab=RO`}
                    >
                      {log.ROCount}
                    </Link>
                  </td>
                  <td className={GlobalStyle.tableData}>
                    <Link to={`/pages/DRC/DRCDetails?drcid=${log.DRCID}&drcname=${encodeURIComponent(
                          log.DRCName
                        )}&tab=RTOM`}>
                      {log.RTOMCount}
                    </Link>
                  </td>{" "}
                  <td
                    className={`${GlobalStyle.tableData} flex justify-center gap-2 w-[100px]`}
                  >
                    <img
                      src={editImg}
                      alt="Edit"
                      title="Edit"
                      className="w-6 h-6 cursor-pointer"
                      onClick={() => handleEditClick(log.DRCID)}
                    />
                    <img
                      src={ListImg}
                      alt="List"
                      title="List"
                      className="w-6 h-6"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No data matching the criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={GlobalStyle.navButtonContainer}>
        <button
          className={GlobalStyle.navButton}
          onClick={handlePrevPage}
          disabled={currentPage === 0}
        >
          <FaArrowLeft />
        </button>
        <span className="text-gray-700">
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
    </div>
  );
};

export default DRCList;
