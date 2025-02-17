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

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getF1FilteredIncidentsCount,
  getDistributionReadyIncidentsCount,
  getCPECollectIncidentsCount,
  getDirectLODIncidentsCount,
} from "../../services/Incidents/incidentService";
import GlobalStyle from "../../assets/prototype/GlobalStyle";

const FilteredIncident = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([
    { type: "Open for Distribution", count: 0 },
    { type: "Reject pending Cases", count: 0 },
    { type: "Direct LOD", count: 0 },
    { type: "Collect CPE", count: 0 },
  ]);

  useEffect(() => {
    const fetchIncidentCounts = async () => {
      try {
        const [
          openCount,
          rejectCount,
          directLODCount,
          collectCPECount,
        ] = await Promise.all([
          getDistributionReadyIncidentsCount(),
          getF1FilteredIncidentsCount(),
          getDirectLODIncidentsCount(),
          getCPECollectIncidentsCount(),
        ]);

        setCases([
          { type: "Open for Distribution", count: openCount || 0 },
          { type: "Reject pending Cases", count: rejectCount || 0 },
          { type: "Direct LOD", count: directLODCount || 0 },
          { type: "Collect CPE", count: collectCPECount || 0 },
        ]);
      } catch (error) {
        console.error("Error fetching incident counts:", error);
      }
    };

    fetchIncidentCounts();
  }, []);

  const recordsPerPage = 4;
  const [currentPage] = useState(1);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentCases = cases.slice(indexOfFirstRecord, indexOfLastRecord);

  const handleIconClick = (type, count) => {
    let path = "";

    if (type === "Open for Distribution") {
      path = "/Distribution/open-incident";
    } else if (type === "Reject pending Cases") {
      path = "/Distribution/reject-incident";
    } else if (type === "Direct LOD") {
      path = "/Distribution/direct-lod-sending-incident";
    } else if (type === "Collect CPE") {
      path = "/Distribution/collect-only-cpe-collect";
    }

    navigate(path, {
      state: { casesType: type, count: count },
    });
  };

  return (
    <div className={GlobalStyle.fontPoppins}>
      <div className="flex flex-col flex-1">
        <main className="p-6">
          <div>
            <h1 className={GlobalStyle.headingLarge}>Filtered Incidents</h1>
          </div>

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
                      <td className={`${GlobalStyle.tableData} ${GlobalStyle.paragraph}`}>
                        {cases.type}
                      </td>
                      <td className={`${GlobalStyle.tableData} ${GlobalStyle.paragraph}`}>
                        {cases.count.toLocaleString()}
                      </td>

                      <td className={GlobalStyle.tableData}>
                        <button
                          onClick={() => handleIconClick(cases.type, cases.count)}
                          className={`${GlobalStyle.bold} text-2xl text-blue-500`}
                        >
                          <img
                            src="../../../src/assets/images/Open.png"
                            alt="Open Icon"
                            title="Open"
                            width={20}
                            height={15}
                          />
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
