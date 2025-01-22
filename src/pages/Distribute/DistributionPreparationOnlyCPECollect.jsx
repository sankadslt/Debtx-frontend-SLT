/* Purpose: This template is used for the 1.C.11 - Distribution Preparation Only CPE Collection
Created Date: 07/01/2025
Created By: U.H.Nandali Linara
Last Modified Date : 
Version: node 20
ui number : 1.C.11
Dependencies: tailwind css
Related Files: (routes)
Notes:  This page includes Total and Reject count and a table*/

import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";

const DistributionPreparationOnlyCPECollect = () => {
  const navigate = useNavigate();
  const services = [
    { type: "PEO TV", count: 4500 },
    { type: "LTE", count: 4500 },
    { type: "Fiber", count: 4500 },
    { type: "Copper", count: 1000 },
    { type: "Service A", count: 500 },
    { type: "Service B", count: 4500 },
    { type: "Service A", count: 450 },
    { type: "Service B", count: 100 },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const recordsPerPage = 4;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

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
    navigate("/pages/Distribute/AssignDRCForCollectCPE", {
      state: { serviceType: service.type, count: service.count },
    });
  };

  //main
  return (
    <div className={GlobalStyle.fontPoppins}>
      <div className="flex flex-col flex-1">
        <main className="p-6">
          <div>
            <h1 className={GlobalStyle.headingLarge}>
              Open Pending Cases For CPE Collect{" "}
            </h1>
          </div>

          {/* Mini Case Count Bar */}
          <div className="flex items-center justify-center mt-10 mb-5">
            {/* Summary Cards Container */}
            <div className={GlobalStyle.miniCountBarSubTopicContainer}>
              {/* Total Count */}
              <div className={GlobalStyle.miniCountBarMainBox}>
                <span>Total:</span>
                <p className={GlobalStyle.miniCountBarMainTopic}>1259</p>
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
                    Service Type
                  </th>
                  <th scope="col" className={GlobalStyle.tableHeader}>
                    No of Count
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
                      {service.type}
                    </td>
                    <td
                      className={`${GlobalStyle.tableData} ${GlobalStyle.paragraph}`}
                    >
                      {service.count}
                    </td>
                    <td className={GlobalStyle.tableData}>
                      <button
                        onClick={() => handleIconClick(service)}
                        className={`${GlobalStyle.bold} text-2xl text-blue-500`}
                      >
                        <img
                          src="/src/assets/images/fileicon.png"
                          alt="file icon"
                          width={34}
                          height={24}
                        />
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

export default DistributionPreparationOnlyCPECollect;
