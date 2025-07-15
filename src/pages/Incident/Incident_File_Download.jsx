/*Purpose: 
Created Date: 2025-01-09
Created By: Vihanga eshan Jayarathna (vihangaeshan2002@gmail.com)
Last Modified Date: 2025-03-27
Modified By: Vihanga eshan Jayarathna (vihangaeshan2002@gmail.com), Naduni Rabel (rabelnaduni2000@gmail.com),
Last Modified Date:2025-06-30
Version: React v18
ui number : 1.3
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */
import { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaArrowRight, FaSearch, FaDownload } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { List_Download_Files_from_Download_Log } from "../../services/file/fileDownloadService";
import { Tooltip } from "react-tooltip";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";

const Incident_File_Download = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [maxCurrentPage, setMaxCurrentPage] = useState(0);
  //const [totalPages, setTotalPages] = useState(0);
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true);
  const rowsPerPage = 10;

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const hasMounted = useRef(false);

  const filteredDataBySearch = filteredData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

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

  const callAPI = async (page) => {
    try {
      setIsLoading(true);
      const response = await List_Download_Files_from_Download_Log({
        Deligate_By: userId,
        search: searchQuery,
        pages: page,
      });

      if (response && response.data) {
        if (currentPage === 1) {
          setFilteredData(response.data);
        } else {
          setFilteredData((prevData) => [...prevData, ...response.data]);
        }

        if (response.data.length === 0 || response.data.length < rowsPerPage) {
          setIsMoreDataAvailable(false);
        }
      }
    } catch (err) {
      console.error("Error during paginated API fetch:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {

    if (isMoreDataAvailable && currentPage > maxCurrentPage) {
      setMaxCurrentPage(currentPage);
      callAPI(currentPage);
    }
  }, [currentPage]);

  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (
      direction === "next" &&
      (isMoreDataAvailable || currentPage < Math.ceil(filteredData.length / rowsPerPage))
    ) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleDownload = (File_Location) => {
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

      <div className="mb-4 flex justify-start mt-8">
        <div className={GlobalStyle.searchBarContainer}>
          <input
            type="text"
            className={GlobalStyle.inputSearch}
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => {
              setCurrentPage(1); // Reset to page 1 on search
              setSearchQuery(e.target.value)
            }}
          />
          <FaSearch className={GlobalStyle.searchBarIcon} />
        </div>
      </div>

      <div className={`${GlobalStyle.tableContainer} overflow-x-auto w-full`}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th className={GlobalStyle.tableHeader}>Ref ID</th>
              <th className={GlobalStyle.tableHeader}>Created By</th>
              <th className={GlobalStyle.tableHeader}>Created DTM</th>
              <th className={GlobalStyle.tableHeader}>Expire DTM</th>
              <th className={GlobalStyle.tableHeader}>Download</th>
            </tr>
          </thead>
          <tbody>
            {filteredDataBySearch.slice(startIndex, startIndex + rowsPerPage).map((log, index) => (
              <tr
                key={log.file_download_seq}
                className={index % 2 === 0 ? "bg-white border-b" : "bg-gray-50 border-b"}
              >
                <td className={GlobalStyle.tableData}>{log.file_download_seq}</td>
                <td className={GlobalStyle.tableData}>{log.Deligate_By}</td>
                <td className={GlobalStyle.tableData}>
                  {log.Created_On
                    ? new Date(log.Created_On.replace(" ", "T")).toLocaleString("en-GB")
                    : ""}
                </td>
                <td className={GlobalStyle.tableData}>
                  {log.File_Remove_On
                    ? new Date(log.File_Remove_On.replace(" ", "T")).toLocaleString("en-GB")
                    : ""}
                </td>
                <td className={GlobalStyle.tableData}>
                  {userRole && ["admin", "superadmin", "slt"].includes(userRole) && (
                    <button
                      onClick={() => handleDownload(log.File_Location)}
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
            {filteredDataBySearch.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      {filteredDataBySearch.length > 0 && (
        <div className={GlobalStyle.navButtonContainer}>
          <button

            onClick={() => handlePrevNext("prev")}
            disabled={currentPage <= 1}
            className={`${GlobalStyle.navButton}`}
          >
            <FaArrowLeft />
          </button>
          <span className={`${GlobalStyle.pageIndicator} mx-4`}>
            Page {currentPage}
          </span>
          <button
            onClick={() => handlePrevNext("next")}
            disabled={searchQuery
              ? currentPage >= Math.ceil(filteredDataBySearch.length / rowsPerPage)
              : !isMoreDataAvailable && currentPage >= Math.ceil(filteredData.length / rowsPerPage)}
            className={`${GlobalStyle.navButton}`}
          >
            <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default Incident_File_Download;
