/*Purpose: 
Created Date: 2025-01-09
Created By: Vihanga eshan Jayarathna (vihangaeshan2002@gmail.com)
Last Modified Date: 2025-03-27
Modified By: Vihanga eshan Jayarathna (vihangaeshan2002@gmail.com), Naduni Rabel (rabelnaduni2000@gmail.com)
Version: React v18
ui number : 1.3
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */
import { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import { FaArrowLeft, FaArrowRight, FaSearch, FaDownload } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { List_Download_Files_from_Download_Log } from "../../services/file/fileDownloadService";
import { Tooltip } from "react-tooltip";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";

const Incident_File_Download = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const rowsPerPage = 10;
  const hasMounted = useRef(false);

  // Decode token and set userRole and userId
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        refreshAccessToken().then((newToken) => {
          if (!newToken) return;
          const newDecoded = jwtDecode(newToken);
          setUserRole(newDecoded.role);
          setUserId(newDecoded.user_id || newDecoded.id);
        });
      } else {
        setUserRole(decoded.role);
        setUserId(decoded.user_id || decoded.id);
      }
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }, []);

  // Fetch data on mount and on page change
  useEffect(() => {
    if (!userId) return;
    callAPI({ page: currentPage });
  }, [currentPage, userId]);

  // Refetch data on search change (with debounce)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setCurrentPage(1);
      if (userId) callAPI({ page: 1 });
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const callAPI = async ({ page }) => {
    try {
      setIsLoading(true);

      const response = await List_Download_Files_from_Download_Log({
        Deligate_By: userId,
        search: searchQuery,
        pages: page,
      });
 
      const formattedData = response.data.map((item) => {
        const createdDate = new Date(item.Created_On?.replace(" ", "T"));
        const expireDate = new Date(item.File_Remove_On?.replace(" ", "T"));
        return {
          TaskID: item.file_download_seq || "N/A",
          GroupID: item.file_download_seq || "N/A",
          CreatedDTM: isNaN(createdDate) ? "N/A" : createdDate.toISOString(),
          ExpireDTM: isNaN(expireDate) ? "N/A" : expireDate.toISOString(),
          Filepath: item.File_Location || "N/A",
          CreatedBy: item.Deligate_By || "N/A",
        };
      });

      setFilteredData(formattedData);
      setIsMoreDataAvailable(response.hasMore);
    } catch (err) {
      console.error("Error during paginated API fetch:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (isMoreDataAvailable) setCurrentPage(currentPage + 1);
  };

  const handleDownload = (filepath) => {
    alert("Need to configure the download with the server");
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
      <h2 className={GlobalStyle.headingLarge}>File Download - Incident / Cases</h2>

      <div className="mb-8 flex justify-start mt-8">
        <div className={GlobalStyle.searchBarContainer}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={GlobalStyle.inputSearch}
            placeholder="Search..."
          />
          <FaSearch className={GlobalStyle.searchBarIcon} />
        </div>
      </div>

      <div className={`${GlobalStyle.tableContainer} overflow-x-auto w-full`}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th className={GlobalStyle.tableHeader}>Task ID</th>
              <th className={GlobalStyle.tableHeader}>Group ID</th>
              <th className={GlobalStyle.tableHeader}>Created By</th>
              <th className={GlobalStyle.tableHeader}>Created DTM</th>
              <th className={GlobalStyle.tableHeader}>Expire DTM</th>
              <th className={GlobalStyle.tableHeader}>Download</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((log, index) => (
              <tr
                key={log.TaskID}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b`}
              >
                <td className={GlobalStyle.tableData}>{log.TaskID}</td>
                <td className={GlobalStyle.tableData}>{log.GroupID}</td>
                <td className={GlobalStyle.tableData}>{log.CreatedBy}</td>
                <td className={GlobalStyle.tableData}>
                  {new Date(log.CreatedDTM).toLocaleString("en-GB")}
                </td>
                <td className={GlobalStyle.tableData}>
                  {new Date(log.ExpireDTM).toLocaleString("en-GB")}
                </td>
                <td className={GlobalStyle.tableData}>
                  {userRole && ["admin", "superadmin", "slt"].includes(userRole) && (
                    <button
                      onClick={() => handleDownload(log.Filepath)}
                      className="text-blue-600 hover:text-blue-800"
                      data-tooltip-id="download-tooltip"
                    >
                      <FaDownload />
                    </button>
                  )}
                  <Tooltip id="download-tooltip" place="bottom" content="Download file" />
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4">No records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredData.length > 0 && (
        <div className={GlobalStyle.navButtonContainer}>
          <button
            className={GlobalStyle.navButton}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <FaArrowLeft />
          </button>
          <span>Page {currentPage}</span>
          <button
            className={GlobalStyle.navButton}
            onClick={handleNextPage}
            disabled={!isMoreDataAvailable}
          >
            <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

Incident_File_Download.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      TaskID: PropTypes.string.isRequired,
      GroupID: PropTypes.string.isRequired,
      CreatedDTM: PropTypes.string.isRequired,
      ExpireDTM: PropTypes.string.isRequired,
      CreatedBy: PropTypes.string.isRequired,
    })
  ),
};

export default Incident_File_Download;
