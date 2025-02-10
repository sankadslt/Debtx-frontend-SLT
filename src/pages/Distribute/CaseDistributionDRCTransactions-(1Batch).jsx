/*Purpose: This template is used for the 1.A.13.2 - Case Distribution For DRC Transactions - 1 Batch UI
Created Date: 2025-02-10
Created By: Chamithu (chamithujayathilaka2003@gmail.com)
Last Modified Date: 2025-02-10
Version: node 20
ui number : 1.A.13.2
Dependencies: tailwind css
Related Files: (routes)
Notes: The following page conatins the codes */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";

export default function CaseDistributionDRCTransactions1Batch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const cpeData = [
    {
      batchseq: "S1",
      DRC: "DRC1",
      RTOM: "AD",
      DRC_2: "100",
      TotalArrears: "25000",
    },
    {
      batchseq: "S2",
      DRC: "DRC2",
      RTOM: "GM",
      DRC_2: "200",
      TotalArrears: "50000",
    },
    {
      batchseq: "S3",
      DRC: "DRC3",
      RTOM: "KU",
      DRC_2: "300",
      TotalArrears: "75000",
    },
    {
      batchseq: "S4",
      DRC: "DRC4",
      RTOM: "AD",
      DRC_2: "400",
      TotalArrears: "100000",
    },
  ];

  const handleonclick = () => {
    alert("Task created successfully");
  };

  const handleoniconclick = () => {
    alert("Icon clicked");
  };

  //search function
  const filteredData = cpeData.filter((row) =>
    Object.values(row)
      .join("")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className={GlobalStyle.fontPoppins}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className={GlobalStyle.headingLarge}>Distribution Summary</h1>
      </div>

      {/* Card Section */}
      <div className="flex flex-col items-center justify-center mb-4">
        <div className={`${GlobalStyle.cardContainer}`}>
          <p className="mb-2">
            <strong>Batch ID:</strong>
          </p>

          <p className="mb-2">
            <strong>DRC Commission Rule:</strong>
          </p>
          <p className="mb-2">
            <strong>Arrears Band:</strong>
          </p>

          <p className="mb-2">
            <strong>Case Count:</strong>
          </p>
          <p className="mb-2">
            <strong>Total Arrears Amount:</strong>
          </p>
        </div>
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
                <th className={GlobalStyle.tableHeader}>RTOM</th>
                <th className={GlobalStyle.tableHeader}>DRC 1</th>
                <th className={GlobalStyle.tableHeader}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={23}
                    height={24}
                    fill="none"
                  >
                    <path
                      fill="#000"
                      fillRule="evenodd"
                      d="M11.5 23.5a11.501 11.501 0 1 0 0-23.002 11.501 11.501 0 0 0 0 23.002ZM5.111 13.278H17.89v-2.556H5.11v2.556Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </th>
                <th className={GlobalStyle.tableHeader}>DRC 2</th>
                <th className={GlobalStyle.tableHeader}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={23}
                    height={24}
                    fill="none"
                  >
                    <path
                      fill="#000"
                      d="M11.5.5C5.149.5 0 5.649 0 12s5.149 11.5 11.5 11.5S23 18.351 23 12 17.851.5 11.5.5Zm5.75 12.65h-4.6v4.6h-2.3v-4.6h-4.6v-2.3h4.6v-4.6h2.3v4.6h4.6v2.3Z"
                    />
                  </svg>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr
                  key={item.date}
                  className={
                    index % 2 === 0
                      ? GlobalStyle.tableRowEven
                      : GlobalStyle.tableRowOdd
                  }
                >
                  <td className={GlobalStyle.tableData}>{item.RTOM}</td>
                  <td className={GlobalStyle.tableData}>{item.DRC}</td>
                  <td className={GlobalStyle.tableData}>{item.batchseq}</td>

                  <td className={GlobalStyle.tableData}>{item.DRC_2}</td>
                  <td className={GlobalStyle.tableData}>{item.TotalArrears}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-between">
        {/* Button on the left */}
        <button className={` h-[35px] mt-[40px]`} onClick={handleoniconclick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={65}
            height={65}
            fill="none"
          >
            <circle
              cx={32.5}
              cy={32.5}
              r={32.45}
              fill="#B3CCE3"
              stroke="#58120E"
              strokeWidth={0.1}
              transform="rotate(-90 32.5 32.5)"
            />
            <path
              fill="#001120"
              d="m36.46 32.051 10.386-10.384-3.064-3.064-13.448 13.448L43.782 45.5l3.064-3.064L36.46 32.051Z"
            />
            <path
              fill="#001120"
              d="m23.46 32.051 10.386-10.384-3.064-3.064-13.448 13.448L30.782 45.5l3.064-3.064L23.46 32.051Z"
            />
          </svg>
        </button>

        {/* Button on the right */}
        <button
          onClick={handleonclick}
          className={`${GlobalStyle.buttonPrimary} h-[35px] mt-[30px]`}
        >
          Create task and let me know
        </button>
      </div>
    </div>
  );
}
