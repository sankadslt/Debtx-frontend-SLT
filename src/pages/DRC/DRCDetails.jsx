/*Purpose:
Created Date: 2025-05-25
Created By: Nimesha Kavindhi (nimeshakavindhi4@gmail.com)
Version: React v18
ui number : 10.1
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */

import { useState, useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import { List_RO_Details_Owen_By_DRC_ID, List_RTOM_Details_Owen_By_DRC_ID, List_Service_Details_Owen_By_DRC_ID } from "../../services/drc/Drc";
import { useSearchParams , useLocation ,useNavigate  } from "react-router-dom";
import activeIcon from "../../assets/images/ConfigurationImg/Active.png";
import inactiveIcon from "../../assets/images/ConfigurationImg/Inactive.png";
import terminatedIcon from "../../assets/images/ConfigurationImg/Terminate.png";

const DRCDetails = () => {
  const [activeTab, setActiveTab] = useState("RO");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [status, setStatus] = useState("");
  const [rtomFilter, setRtomFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({ status: "", rtom: "", service: "" });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

const location = useLocation();
const { state } = location;
const drcId = state?.drcId;

  const rowsPerPage = 7;
  const statuses = ["Active", "Inactive"];
  const rtomNames = ["RTOM 1", "RTOM 2", "RTOM 3", "RTOM 4"];
  const serviceTypes = ["PEO", "LTE", "FTTH", "DSL"];

  const [roListData, setRoListData] = useState([]);
  const [rtomListData, setRtomListData] = useState([]);
  const [servicesListData, setServicesListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

     const getStatusIcon = (status) => {
          switch (status?.toLowerCase()) {
              case "active":
                  return activeIcon;
              case "inactive":
                  return inactiveIcon;
              case "ended":
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
              <img
                  src={iconPath}
                  alt={status}
                  className="w-6 h-6"
                  title={status}
              />
          );
      };

      const goBack = () => {
        navigate(-1); 
    };

  const fetchROList = async () => {
    const res = await List_RO_Details_Owen_By_DRC_ID(drcId);
    return res.map((ro) => ({
      name: ro.ro_name,
      status: ro.status,
      enableDate: (ro.ro_end_date || "").split("T")[0],
      contact: ro.ro_contact_no,
    }));
  };

  const fetchRtomList = async () => {
    const res = await List_RTOM_Details_Owen_By_DRC_ID(drcId);
    return res.map((rtom) => ({
      name: rtom.area_name,
      abbreviation: rtom.rtom_abbreviation,
      enableDate: (rtom.created_dtm || "").split("T")[0],
      rtom_contact_number: rtom.rtom_mobile_no
    ?.map(item => item.mobile_number)
    .join(", "), // Join mobile numbers as comma-separated string
      roCount: rtom.ro_count,
    }));
  };

  const fetchServicesList = async () => {
    const res = await List_Service_Details_Owen_By_DRC_ID(drcId);
    return res.map((svc) => ({
      type: svc.service_type,
      enableDate: (svc.enable_date || "").split("T")[0],
      status: svc.status,
    }));
  };

  const fetchAllLists = async () => {
    setIsLoading(true);
    try {
      const [ro, rtom, svc] = await Promise.all([
        fetchROList(),
        fetchRtomList(),
        fetchServicesList(),
      ]);
      setRoListData(ro);
      setRtomListData(rtom);
      setServicesListData(svc);
    } catch (err) {
      console.error("Error fetching DRC details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllLists();
  }, []);

  const filteredData =
    activeTab === "RO"
      ? roListData.filter((row) => {
        const matchesSearchQuery = Object.values(row).join(" ").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = !appliedFilters.status || row.status === appliedFilters.status;
        return matchesSearchQuery && matchesStatus;
      })
      : activeTab === "RTOM"
        ? rtomListData.filter((row) => {
          const matchesSearchQuery = Object.values(row).join(" ").toLowerCase().includes(searchQuery.toLowerCase());
          const matchesRtom = !appliedFilters.rtom || row.name === appliedFilters.rtom;
          return matchesSearchQuery && matchesRtom;
        })
        : activeTab === "Services"
          ? servicesListData.filter((row) => {
            const matchesSearchQuery = Object.values(row).join(" ").toLowerCase().includes(searchQuery.toLowerCase());
            const matchesService = !appliedFilters.service || row.type === appliedFilters.service;
            const matchesStatus = !appliedFilters.status || row.status === appliedFilters.status;
            return matchesSearchQuery && matchesService && matchesStatus;
          })
          : [];

  const pages = Math.ceil(filteredData.length / rowsPerPage);
  const handlePrevPage = () => currentPage > 0 && setCurrentPage(currentPage - 1);
  const handleNextPage = () => currentPage < pages - 1 && setCurrentPage(currentPage + 1);
  const handleFilter = () => {
    setAppliedFilters({ status, rtom: rtomFilter, service: serviceFilter });
    setCurrentPage(0);
  };

  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return (
    <div className={GlobalStyle.fontPoppins}>
      <div className="flex justify-between items-center mb-8">
        <h1 className={GlobalStyle.headingLarge}>Sensus - Sensus BPO Services (Pvt) Ltd</h1>
      </div>

      {/* Filter Section */}
      <div className="grid justify-end mb-10">
        <div className={`${GlobalStyle.cardContainer} w-auto h-auto py-4 px-6`}>
          <div className="flex justify-end items-center gap-4">

            {/* RO Tab Filters */}
            {activeTab === "RO" && (
              <>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={GlobalStyle.selectBox}
                >
                  <option value="" disabled hidden>
                    Select Status
                  </option>
                  {statuses.map((statusOption, index) => (
                    <option key={index} value={statusOption}>
                      {statusOption}
                    </option>
                  ))}
                </select>

                <select
                  value={rtomFilter}
                  onChange={(e) => setRtomFilter(e.target.value)}
                  className={GlobalStyle.selectBox}
                >
                  <option value="" disabled hidden>
                    Select RTOM
                  </option>
                  {rtomNames.map((rtomOption, index) => (
                    <option key={index} value={rtomOption}>
                      {rtomOption}
                    </option>
                  ))}
                </select>
              </>
            )}

            {/* RTOM Tab Filter */}
            {activeTab === "RTOM" && (
              <select
                value={rtomFilter}
                onChange={(e) => setRtomFilter(e.target.value)}
                className={GlobalStyle.selectBox}
              >
                <option value="" disabled hidden>
                  Select RTOM
                </option>
                {rtomNames.map((rtomOption, index) => (
                  <option key={index} value={rtomOption}>
                    {rtomOption}
                  </option>
                ))}
              </select>
            )}

            {/* Services Tab Filter */}
            {activeTab === "Services" && (
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={GlobalStyle.selectBox}
              >
                <option value="" disabled hidden>
                  Select Status
                </option>
                {statuses.map((statusOption, index) => (
                  <option key={index} value={statusOption}>
                    {statusOption}
                  </option>
                ))}
              </select>
            )}

            {/* Filter Button */}
            <button onClick={handleFilter} className={GlobalStyle.buttonPrimary}>
              Filter
            </button>

            {/* Clear Button */}
            <button
              onClick={() => {
                setStatus("");
                setRtomFilter("");
                setSearchQuery?.(""); // optional chaining if exists
                setAppliedFilters({ status: "", rtom: "" });
                setCurrentPage?.(0); // optional chaining if exists
              }}
              className={GlobalStyle.buttonRemove}
            >
              Clear
            </button>

          </div>
        </div>
      </div>



      {/* Search Section */}
      <div className="mb-4 flex justify-start">
        <div className={GlobalStyle.searchBarContainer}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={GlobalStyle.inputSearch}
          />
          <FaSearch className={GlobalStyle.searchBarIcon} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-4">
        {["RO", "RTOM", "Services"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-2 ${activeTab === tab
              ? "border-b-2 border-blue-500 font-bold"
              : "text-gray-500"
              }`}
          >
            {tab} List
          </button>
        ))}
      </div>

      {/* Table */}
      <div className={GlobalStyle.tableContainer}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              {activeTab === "RO" && (
                <>
                  <th className={GlobalStyle.tableHeader}>RO Name</th>
                  <th className={GlobalStyle.tableHeader}>Status</th>
                  <th className={GlobalStyle.tableHeader}>Enable Date</th>
                  <th className={GlobalStyle.tableHeader}>Contact Number</th>
                </>
              )}
              {activeTab === "RTOM" && (
                <>
                  <th className={GlobalStyle.tableHeader}>RTOM Name</th>
                  <th className={GlobalStyle.tableHeader}>Abbreviation</th>
                  <th className={GlobalStyle.tableHeader}>Enable Date</th>
                  <th className={GlobalStyle.tableHeader}>Contact</th>
                  <th className={GlobalStyle.tableHeader}>RO Count</th>
                </>
              )}
              {activeTab === "Services" && (
                <>
                  <th className={GlobalStyle.tableHeader}>SERVICE TYPE</th>
                  <th className={GlobalStyle.tableHeader}>ENABLE DATE</th>
                  <th className={GlobalStyle.tableHeader}>STATUS</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr
                key={index}
                className={
                  index % 2 === 0
                    ? GlobalStyle.tableRowEven
                    : GlobalStyle.tableRowOdd
                }
              >
                {activeTab === "RO" && (
                  <>
                    <td className={GlobalStyle.tableData}>{row.name}</td>
                    <td className={GlobalStyle.tableData}>{renderStatusIcon(row.status)}</td>
                    <td className={GlobalStyle.tableData}>{row.enableDate}</td>
                    <td className={GlobalStyle.tableData}>{row.contact}</td>
                  </>
                )}
                {activeTab === "RTOM" && (
                  <>
                    <td className={GlobalStyle.tableData}>{row.name}</td>
                    <td className={GlobalStyle.tableData}>{row.abbreviation}</td>
                    <td className={GlobalStyle.tableData}>{row.enableDate}</td>
                     <td className={GlobalStyle.tableData}>{row.rtom_contact_number}</td> 
                     
                    {/* Services Tab Filter <td className={GlobalStyle.tableData}>
                      {row.rtom_mobile_no?.map((item) => item.contact).join(", ")}
                    </td> */}

                    
                    <td className={GlobalStyle.tableData}>{row.roCount}</td>
                  </>
                )}
                {activeTab === "Services" && (
                  <>
                    <td className={GlobalStyle.tableData}>{row.type}</td>
                    <td className={GlobalStyle.tableData}>{row.enableDate}</td>
                    <td className={GlobalStyle.tableData}>{renderStatusIcon(row.status)}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        
        
      </div>

      {/* Pagination */}
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
      <button
              className={`${GlobalStyle.buttonPrimary} flex items-center space-x-2 mt-8`}
                 onClick={goBack}
                   >
             <FaArrowLeft />
              <span>Back</span>
       </button>
    </div>
  );
};

export default DRCDetails;   