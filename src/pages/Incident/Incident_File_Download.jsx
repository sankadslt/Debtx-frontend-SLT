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

import { useState , useEffect} from "react";
import PropTypes from 'prop-types';
import { FaArrowLeft, FaArrowRight, FaSearch, FaDownload } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { List_Download_Files_from_Download_Log } from "../../services/file/fileDownloadService";
import  { Tooltip } from "react-tooltip";



const Incident_File_Download = () => {
    // State variables
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const rowsPerPage = 7;

    // Fetch data from the API
    const fetchData = async () => {
      try {      
        const response = await List_Download_Files_from_Download_Log();
        const formattedData = response.data.map((item) => { 
            const createdDateStr = typeof item.Created_On === "string" ? item.Created_On.replace(" ", "T") : item.Created_On;
            const expireDateStr = typeof item.File_Remove_On === "string" ? item.File_Remove_On.replace(" ", "T") : item.File_Remove_On;
            const createdDate = createdDateStr ? new Date(createdDateStr) : null;
            const expireDate = expireDateStr ? new Date(expireDateStr) : null;
            return {
              TaskID: item.file_download_seq || "N/A",
              GroupID: item.file_download_seq || "N/A",
              CreatedDTM: isNaN(createdDate) ? "N/A" : createdDate.toLocaleString() || "N/A",
              ExpireDTM: isNaN(expireDate) ? "N/A" : expireDate.toLocaleString() || "N/A",
              CreatedBy: item.Deligate_By
            };
          });
          setTableData(formattedData);
          setIsLoading(false);
      } catch {
          setError("Failed to fetch DRC details. Please try again later.");
          setIsLoading(false);
      }
    };

    // Fetch data when the component mounts
    useEffect(() => {
        fetchData();
      }, []);
   
    // Handle loading state and error
    const filteredData = tableData.filter((row) =>
        Object.values(row)
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );


    const pages = Math.ceil(filteredData.length / rowsPerPage);
    // Calculate the number of pages based on the filtered data length
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

    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    // Handle file download
    const handleDownload = (taskId) => {
        try {

            console.log(`Downloading file for task: ${taskId}`);
        } catch (error) {
            console.error('Download failed:', error);

        }
    };

    return (
        <div className={GlobalStyle.fontPoppins}>

            <h2 className={GlobalStyle.headingLarge}>File Download - Incident / Cases</h2>



            {/* Updated Search Bar Section */}
            <div className="mb-8 flex justify-start mt-8">
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

            {/* Table */}
            <div className={GlobalStyle.tableContainer}>
                <table className={GlobalStyle.table}>
                    <thead className={GlobalStyle.thead}>
                        <tr>
                            <th scope="col" className={GlobalStyle.tableHeader}>
                                Task ID
                            </th>
                            <th scope="col" className={GlobalStyle.tableHeader}>
                                Group ID
                            </th>
                            <th scope="col" className={GlobalStyle.tableHeader}>
                                Created By
                            </th>
                            <th scope="col" className={GlobalStyle.tableHeader}>
                                Created DTM
                            </th>
                            <th scope="col" className={GlobalStyle.tableHeader}>
                                Expire DTM
                            </th>
                            
                            <th scope="col" className={GlobalStyle.tableHeader}>
                                Download
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((log, index) => {
                            const isExpired = new Date(log.ExpireDTM).toLocaleString() < new Date().toLocaleString();
                            return(
                            <tr
                                key={log.TaskID}
                                className={`${index % 2 === 0
                                    ? "bg-white bg-opacity-75"
                                    : "bg-gray-50 bg-opacity-50"
                                    } border-b`}
                            >
                                <td className={GlobalStyle.tableData}>{log.TaskID}</td>
                                <td className={GlobalStyle.tableData}>{log.GroupID}</td>
                                <td className={GlobalStyle.tableData}>{log.CreatedBy}</td>
                                <td className={GlobalStyle.tableData}>{new Date(log.CreatedDTM).toLocaleString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                            hour12: true,
                                        })}</td>
                                <td className={GlobalStyle.tableData}>{new Date(log.ExpireDTM).toLocaleString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                            hour12: true,
                                        })}</td>
                                
                                <td className={GlobalStyle.tableData} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <button
                                        onClick={() => handleDownload(log.TaskID)}
                                        className="text-blue-600 hover:text-blue-800 " 
                                        data-tooltip-id="download-tooltip"
                                        disabled={isExpired}
                                    >
                                        <FaDownload />

                                    </button>
                                    <Tooltip id="download-tooltip" place="bottom" content={isExpired ? "Download expired" : "Download file"} />
                                </td>
                            </tr>
                          )
                        })}
                        {filteredData.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                    No records found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
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


        </div>
    );
};

// Add PropTypes validation
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
