/* Purpose: This template is used for the 1.A.11 - Distribution Preparation (Bulk Upload) page.
Created Date: 2025-01-07
Created By: Geeth (eshaneperera@gmail.com)
Last Modified Date : 2025 - 01 - 07
Modified By: Geeth(eshaneperera@gmail.com)
Version: node 20
ui number : 1.A.11
Dependencies: tailwind css
Related Files: (routes)
Notes:  This page includes Total and Reject count and a table*/

import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { List_count_by_drc_commision_rule } from '/src/services/case/CaseServices.js';
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";

const DistributionPreparationBulkUpload = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalRules, setTotalRules] = useState(0)
  const recordsPerPage = 4;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await List_count_by_drc_commision_rule();
        
        const data = response.data || []; // Extract the "data" array from the response
        setServices(data); 
        const totalCount = data.reduce((sum, item) => sum + item.case_count, 0);
        setTotalRules(totalCount);
        
      } catch (error) {
        console.error(
          "Error fetching case count by DRC commission rule:",
          error.response?.data || error.message
        );
      }
    };
    fetchData();
  }, []);

  //Search Filter logic
  const filteredData = services.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const currentServices = filteredData.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  //Navigation
  const handleIconClick = (service) => {
    navigate("/pages/Distribute/AssignDRC", {
      state: { serviceType: service.drc_commision_rule, count: service.count },
    });
  };

  //main
  return (
    <div className={GlobalStyle.fontPoppins}>
      <div className="flex flex-col flex-1">
        <main className="p-6">
          <div>
            <h1 className={GlobalStyle.headingLarge}>Open Pending Cases</h1>
          </div>

                  {/* Mini Case Count Bar */}
              <div className="flex items-center justify-center mt-10 mb-5">
                  {/* Summary Cards Container */}
             <div className={GlobalStyle.miniCountBarSubTopicContainer}>
                  {/* Total Count */}
                <h2 className={GlobalStyle.headingMedium}>Total Case Count:</h2>
             <div className={GlobalStyle.miniCountBarMainBox}>
                    <p className={GlobalStyle.miniCountBarMainTopic}>{totalRules}</p>
             </div>
               </div>
              </div>

          {/* Search Bar */}
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

          {/* Table Section */}
          <div className={GlobalStyle.tableContainer}>
            <table className={GlobalStyle.table}>
              <thead className={GlobalStyle.thead}>
                <tr>
                  <th scope="col" className={GlobalStyle.tableHeader}>
                    Rule Base
                  </th>
                  <th scope="col" className={GlobalStyle.tableHeader}>
                    No of count
                  </th>
                  <th scope="col" className={GlobalStyle.tableHeader}></th>
                </tr>
              </thead>
              <tbody>
                {currentServices.map((service, index) => (
                  <tr
                    key={index}
                    className={
                      index % 2 === 0
                        ? GlobalStyle.tableRowEven
                        : GlobalStyle.tableRowOdd
                    }
                  >
                    <td
                      className={`${GlobalStyle.tableData} ${GlobalStyle.paragraph}`}
                    >
                      {service.drc_commision_rule}
                    </td>
                    <td
                      className={`${GlobalStyle.tableData} ${GlobalStyle.paragraph}`}
                    >
                      {service.case_count}
                    </td>
                    <td className={GlobalStyle.tableData}>
                      <button
                        onClick={() => handleIconClick(service)}
                        className={`${GlobalStyle.bold} text-2xl text-blue-500`}
                      >
                        <img src="/src/assets/images/fileicon.png" 
                                alt="file icon" 
                                width={34} 
                                 height={24}  />
                      </button>
                    </td>
                  </tr>
                ))}
                {currentServices.length === 0 && (
                  <tr>
                    <td colSpan="3" className="py-4 text-center">
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className={GlobalStyle.navButtonContainer}>
           <button
               onClick={() => handlePrevNext("prev")}
               disabled={currentPage === 1}
               className={`${GlobalStyle.navButton} ${
               currentPage === 1 ? "cursor-not-allowed" : ""
            }`}
             >
          <FaArrowLeft />
          </button>
          <span className={`${GlobalStyle.pageIndicator} mx-4`}>
            Page {currentPage} of {totalPages}
          </span>
          <button
           onClick={() => handlePrevNext("next")}
           disabled={currentPage === totalPages}
           className={`${GlobalStyle.navButton} ${
           currentPage === totalPages ? "cursor-not-allowed" : ""
           }`}
           >
        <FaArrowRight />
         </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DistributionPreparationBulkUpload;