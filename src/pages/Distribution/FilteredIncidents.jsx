/*Purpose: This template is used for the 1.7 Sup - Filtered Incidents page.
Created Date: 2025-21-01
Created By: Susinidu (susinidusachinthana@gmail.com)
Last Modified Date: 2025-30-01
Modified Date: 2025-22-01
Modified By: Susinidu (susinidusachinthana@gmail.com)
              K.H.Lasandi Randini 
Version: node 22
ui number : 1.7
Dependencies: tailwind css
Related Files: 
Notes:  */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle"

const FilteredIncident = () => {
  const navigate = useNavigate();
  const cases = [
    { type: "Open for Distribution", count: 4500 },
    { type: "Reject pending Cases", count: 3000 },
    { type: "Direct OLD", count: 150 },
    { type: "Collect CPE", count: 100 },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 4;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  const currentCases = cases.slice(indexOfFirstRecord, indexOfLastRecord);

  //Navigation
  const handleIconClick = (type, count) => {
    let path = "";
  
    if (type === "Open for Distribution") {
      path = "#";
    } else if (type === "Reject pending Cases") {
      path = "#";
    } else if (type === "Direct OLD") {
      path = "#";
    } else if (type === "Collect CPE") {
      path = "#";
    }
  
    // Navigate to the appropriate path with state
    navigate(path, {
      state: { casesType: type, count: count },
    });
  };
  

  //main
  return (
    <div className={GlobalStyle.fontPoppins}>
      <div className="flex flex-col flex-1">
        <main className="p-6">
          
          <div>
            <h1 className={GlobalStyle.headingLarge}>Filtered Incidents</h1>
          </div>

          {/* Table Section */}
          <div className="flex items-center justify-center min-h-full pt-20">
            <div className={GlobalStyle.cardContainer}>
              <table className={GlobalStyle.table}>
                <thead className={GlobalStyle.thead}>
                  <tr>
                    <th scope="col" className={GlobalStyle.tableHeader}>
                      Case Type
                    </th>
                    <th scope="col" className={GlobalStyle.tableHeader}>
                      No of Count
                    </th>
                    <th scope="col" className={GlobalStyle.tableHeader}></th>
                  </tr>
                </thead>
                <tbody>
                  {currentCases.map((cases, index) => (
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
                        {cases.type}
                      </td>
                      <td
                        className={`${GlobalStyle.tableData} ${GlobalStyle.paragraph}`}
                      >
                        {cases.count.toLocaleString()}
                      </td>

                      <td className={GlobalStyle.tableData}>
                        {/* Pass the type and count for each case */}
                        <button
                          onClick={() =>
                            handleIconClick(cases.type, cases.count)
                          }
                          className={`${GlobalStyle.bold} text-2xl text-blue-500`}
                        >
                          <img src="../../../src/assets/images/Open.png" alt="Open Icon" title="Open" width={20} height={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {currentCases.length === 0 && (
                    <tr>
                      <td colSpan="3" className="py-4 text-center">
                        No results found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default FilteredIncident;
