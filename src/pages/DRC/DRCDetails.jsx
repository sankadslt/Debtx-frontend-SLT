/*Purpose:
Created Date: 2025-05-25
Created By: Nimesha Kavindhi (nimeshakavindhi4@gmail.com)
Modified By: Dasindu Dinsara (dinsaradasindu@gmail.com)
Version: React v18
ui number : 10.1
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */

import { useState, useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import { List_RO_Details_Owen_By_DRC_ID, List_RTOM_Details_Owen_By_DRC_ID, List_Service_Details_Owen_By_DRC_ID, Service_detais_of_the_DRC, Rtom_detais_of_the_DRC, Ro_detais_of_the_DRC } from "../../services/drc/Drc";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import activeIcon from "../../assets/images/ConfigurationImg/Active.png";
import inactiveIcon from "../../assets/images/ConfigurationImg/Inactive.png";
import terminatedIcon from "../../assets/images/ConfigurationImg/Terminate.png";
import Swal from "sweetalert2";
import { Tooltip } from "react-tooltip";

const DRCDetails = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage1, setCurrentPage1] = useState(0);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [status, setStatus] = useState("");
  const [rtomFilter, setRtomFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    status: "",
    rtom: "",
    service: ""
  });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [apiData, setApiData] = useState([]);
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [maxCurrentPage, setMaxCurrentPage] = useState(0);

  const location = useLocation();
  const { state } = location;
  const drcId = state?.drcId;
  //const drcId = 1;

  const initialTab = state?.activeTab || "RO";
  //const [currentPage, setCurrentPage] = useState(0);

  // Reset page to 0 whenever activeTab changes


  const [activeTab, setActiveTab] = useState(initialTab);

  const rowsPerPage = 10;
  const statuses = ["Active", "Inactive"];
  const handlingtype = ["Arrears", "CPE", "All-Type"];
  const status1 = ["Active", "Inactive", "Terminated"];

  const [roListData, setRoListData] = useState([]);
  const [rtomListData, setRtomListData] = useState([]);
  const [servicesListData, setServicesListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Icons for status
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

  // Function to render status icon
  const renderStatusIcon = (status) => {
    const iconPath = getStatusIcon(status);

    if (!iconPath) {
      return <span className="capitalize">{status}</span>;
    }

    return (
      <img
        src={iconPath}
        alt={status}
        className="w-6 h-6 mx-auto"
        //title={status}
         data-tooltip-id={`status-tooltip-${status}`}
        data-tooltip-content={status}
      />
    );
  };

  // Function to go back to the previous page
  const goBack = () => {
    navigate(-1);
  };

  // Update active tab from location state if it exists
  useEffect(() => {
    if (state?.activeTab && state.activeTab !== activeTab) {
      setActiveTab(state.activeTab);
    }
  }, [location.state]);

  // Reset current page when active tab changes
  useEffect(() => {
    setStatus("");
    setRtomFilter("");
    setServiceFilter("");
    setSearchQuery("");
    setAppliedFilters({
      status: "",
      rtom: "",
      service: ""
    });
    setApiData([]); // Clear previous data
    if (currentPage === 1) {
      callAPI({
        pages: 1,
        status: "",
        rtom: "",
        service: ""
      })
    } else {
      setCurrentPage(1);
    }
    console.log(currentPage);
  }, [activeTab]);

  const callAPI = async (filters) => {
    try {
      let formattedEntries = [];
      setIsLoading(true);
      console.log("filters: ", filters); 

      if (activeTab === "RO") {
        const res = await Ro_detais_of_the_DRC(drcId, filters.pages, filters.service);
        console.log("Raw RO Entries:", res.data);

        formattedEntries = (res.data ?? []).map((ro) => {
          const enableDate = ro.create_on
            ? new Intl.DateTimeFormat('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            }).format(new Date(ro.create_on))
            : "";
          return {
            name: ro.ro_name || "",
            status: ro.drcUser_status,
            enableDate,
            contact: ro.login_contact_no || "",
          };
        });
      } else if (activeTab === "Billing Center") {
        const res = await Rtom_detais_of_the_DRC(drcId, filters.pages, filters.rtom);
        console.log("Billing Center: ", res.data);

        formattedEntries = (res.data ?? []).map((rtom) => {
          const enableDate = rtom.created_dtm
            ? new Intl.DateTimeFormat('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            }).format(new Date(rtom.created_dtm))
            : "N/A";

          return {
            name: rtom.rtom_name || "",
            billing_center_Code: rtom.rtom_billing_center_code || "",
            handlingType: rtom.handling_type || "",
            enableDate,
            rtom_contact_number: "",
            roCount: "",

          };
        });
      } else if (activeTab === "Services") {
        const res = await Service_detais_of_the_DRC(drcId, filters.pages, filters.status);
        console.log("Raw Service Entries:", res.data);

        formattedEntries = (res.data ?? []).map(({ service }) => {
          const enableDate = service?.status_update_dtm
            ? new Intl.DateTimeFormat('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            }).format(new Date(service.status_update_dtm))
            : "";

          return {
            type: service?.service_type || "",
            enableDate,
            status: service?.service_status || "",
          };
        });
      }
      console.log("formatted Entries: ", formattedEntries)

      if (currentPage === 1) {
        setApiData(formattedEntries);
      } else {
        setApiData((prevData) => [...prevData, ...formattedEntries]);
      }

      if (formattedEntries.length === 0) {
        setIsMoreDataAvailable(false); // No more data available
        if (currentPage === 1) {
          Swal.fire({
            title: "No Results",
            text: "No matching data found for the selected filters.",
            icon: "warning",
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonColor: "#f1c40f"
          });
        } else if (currentPage === 2) {
          setCurrentPage(1); // Reset to page 1 if no data found on page 2
        }
      } else {
        const maxData = currentPage === 1 ? 10 : 30;
        if (formattedEntries.length < maxData) {
          setIsMoreDataAvailable(false); // More data available
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error filtering cases:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch filtered data. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33"
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Fetching RO, RTOM, and Services data based on DRC ID
  // useEffect(() => {
  //   const fetchServicesList = async () => {
  //     try {
  //       const res = await Service_detais_of_the_DRC(drcId);
  //       const serviceEntries = res.data || [];
  //       console.log("Raw Service Entries:", serviceEntries);
  //       const formattedEntries = serviceEntries.map(({ service }) => {
  //         const enableDate = service?.status_update_dtm
  //           ? new Intl.DateTimeFormat('en-GB', {
  //             day: '2-digit',
  //             month: '2-digit',
  //             year: 'numeric',
  //           }).format(new Date(service.status_update_dtm))
  //           : "N/A";

  //         return {
  //           type: service?.service_type || "N/A",
  //           enableDate,
  //           status: service?.service_status || "N/A",
  //         };
  //       });

  //       setServicesListData(formattedEntries);
  //       console.log("Formatted Service Entries:", formattedEntries);
  //     } catch (error) {
  //       console.error("Error fetching services list:", error);

  //       setServicesListData([]); // Set to empty array on error
  //     }
  //   };

  //   fetchServicesList();
  // }, [drcId]);

  // useEffect(() => {
  //   const fetchRtomList = async () => {
  //     try {
  //       const res = await Rtom_detais_of_the_DRC(drcId);
  //       const rtomEntries = res.data || [];
  //       console.log("Raw RTOM Entries:", rtomEntries);

  //       const formattedEntries = rtomEntries.map((rtom) => {
  //         const enableDate = rtom.created_dtm
  //           ? new Intl.DateTimeFormat('en-GB', {
  //             day: '2-digit',
  //             month: '2-digit',
  //             year: 'numeric',
  //           }).format(new Date(rtom.created_dtm))
  //           : "N/A";

  //         return {
  //           name: rtom.rtom_name || "N/A",
  //           billing_center_Code: rtom.rtom_billing_center_code || "N/A",
  //           handlingType: rtom.handling_type || "N/A",
  //           enableDate,

  //           rtom_contact_number: "",
  //           roCount: "",

  //         };
  //       });
  //       setRtomListData(formattedEntries);
  //       console.log("Formatted RTOM Entries:", formattedEntries);
  //     } catch (error) {
  //       console.error("Error fetching RTOM list:", error);
  //       setRtomListData([]); // Set to empty array on error
  //     }
  //   };
  //   fetchRtomList();
  // }, [drcId]);

  // useEffect(() => {
  //   const fetchRoList = async () => {
  //     try {
  //       const res = await Ro_detais_of_the_DRC(drcId);
  //       const roEntries = res.data || [];
  //       console.log("Raw RO Entries:", roEntries);
  //       const formattedEntries = roEntries.map((ro) => {
  //         const enableDate = ro.create_on
  //           ? new Intl.DateTimeFormat('en-GB', {
  //             day: '2-digit',
  //             month: '2-digit',
  //             year: 'numeric',
  //           }).format(new Date(ro.create_on))
  //           : "N/A";
  //         return {
  //           name: ro.drc_name || "N/A",
  //           status: "",
  //           enableDate,
  //           contact: ro.drc_contact_no || "N/A",
  //         };
  //       });

  //       setRoListData(formattedEntries);
  //       console.log("Formatted RO Entries:", formattedEntries);
  //     } catch (error) {
  //       console.error("Error fetching RO list:", error);
  //       setRoListData([]); // Set to empty array on error
  //     }
  //   };
  //   fetchRoList();
  // }, [drcId]);



  //   const fetchROList = async () => {
  //     const res = await List_RO_Details_Owen_By_DRC_ID(drcId);
  //     return res.map((ro) => ({
  //       name: ro.ro_name,
  //       status: ro.status,
  //       enableDate: (ro.ro_end_date || "").split("T")[0],
  //       contact: ro.ro_contact_no,
  //     }));
  //   };

  //   const fetchRtomList = async () => {
  //     const res = await List_RTOM_Details_Owen_By_DRC_ID(drcId);
  //     return res.map((rtom) => ({
  //       name: rtom.area_name,
  //       billing_center_Code: rtom.billing_center_Code,
  //       handlingType: rtom.handling_type,
  //       enableDate: (rtom.created_dtm || "").split("T")[0],
  //       rtom_contact_number: rtom.rtom_mobile_no
  //     ?.map(item => item.mobile_number)
  //     .join(", "), // Join mobile numbers as comma-separated string
  //       roCount: rtom.ro_count,
  //     }));
  //   };

  //   const fetchServicesList = async () => {
  //     const res = await Service_detais_of_the_DRC(drcId);

  //     const serviceEntries = res.data || [];
  //   console.log("Raw Service Entries:", serviceEntries);

  //   return serviceEntries.map(({ service }) => ({
  //     type: service?.service_type || "N/A",
  //     enableDate: (service?.status_update_dtm || "").split("T")[0],
  //     status: service?.service_status || "N/A",
  //   }));
  // };



  //   const fetchAllLists = async () => {
  //     setIsLoading(true);
  //     try {
  //       const [ro, rtom, item] = await Promise.all([
  //         fetchROList(),
  //         fetchRtomList(),
  //         fetchServicesList(),
  //       ]);
  //       setRoListData(ro);
  //       setRtomListData(rtom);
  //       setServicesListData(item);

  //     } catch (err) {
  //       console.error("Error fetching DRC details:", err);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchAllLists();
  //   }, []);

  // const filteredData =
  //   activeTab === "RO"
  //     ? roListData.filter((row) => {
  //       const matchesSearchQuery = Object.values(row).join(" ").toLowerCase().includes(searchQuery.toLowerCase());
  //       const matchesStatus = !appliedFilters.status || row.status === appliedFilters.status;
  //       return matchesSearchQuery && matchesStatus;
  //     })
  //     : activeTab === "Billing Center"
  //       ? rtomListData.filter((row) => {
  //         const matchesSearchQuery = Object.values(row).join(" ").toLowerCase().includes(searchQuery.toLowerCase());
  //         const matchesRtom = !appliedFilters.rtom || row.name === appliedFilters.rtom;
  //         return matchesSearchQuery && matchesRtom;
  //       })
  //       : activeTab === "Services"
  //         ? servicesListData.filter((row) => {
  //           const matchesSearchQuery = Object.values(row).join(" ").toLowerCase().includes(searchQuery.toLowerCase());
  //           //const matchesService = !appliedFilters.service || row.type === appliedFilters.service;
  //           //const matchesStatus = !appliedFilters.status || row.status === appliedFilters.status;
  //           return matchesSearchQuery;
  //         })
  //         : [];

  // Handle Search Bar
  const filteredData = apiData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Handle Previous page action
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle Next page action
  const handleNextPage = () => {
    if (isMoreDataAvailable || currentPage < Math.ceil(filteredData.length / rowsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    if (isMoreDataAvailable && currentPage > maxCurrentPage) {
      setMaxCurrentPage(currentPage); // Update max current page
      callAPI({
        ...appliedFilters,
        pages: currentPage
      });
    }
  }, [currentPage]);

  // Handle filter action
  const handleFilter = () => {
    setIsMoreDataAvailable(true); // Reset more data available state
    setMaxCurrentPage(0); // Reset max current page

    setAppliedFilters({
      status,
      rtom: rtomFilter,
      service: serviceFilter
    });
    setApiData([]); // Clear previous data
    if (currentPage === 1) {
      callAPI({
        pages: 1,
        status: status || "",
        rtom: rtomFilter || "",
        service: serviceFilter || ""
      })
    } else {
      setCurrentPage(1); // Reset to page 1 if filters are applied
    }
  };

  const handleClear = () => {
    setStatus("");
    setRtomFilter("");
    setServiceFilter("");
    setSearchQuery("");
    setAppliedFilters({
      status: "",
      rtom: "",
      service: ""
    });
    setApiData([]); // Clear previous data
    setIsMoreDataAvailable(true); // Reset more data available state
    setMaxCurrentPage(0); // Reset max current page
    if (currentPage != 1) {
      setCurrentPage(1); // Reset to page 1
    } else {
      setCurrentPage(0); // Temp set to 0
      setTimeout(() => setCurrentPage(1), 0); // Reset to 1 after
    }
  }

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
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  className={GlobalStyle.selectBox}
                >
                  <option value="" disabled hidden>
                    Select Status
                  </option>
                  {status1.map((statusOption, index) => (
                    <option key={index} value={statusOption}>
                      {statusOption}
                    </option>
                  ))}
                </select>

                {/* <select
                  value={rtomFilter}
                  onChange={(e) => setRtomFilter(e.target.value)}
                  className={GlobalStyle.selectBox}
                >
                  <option value="" disabled hidden>
                    Select Billing Center
                  </option>
                  {rtomNames.map((rtomOption, index) => (
                    <option key={index} value={rtomOption}>
                      {rtomOption}
                    </option>
                  ))}
                </select> */}
              </>
            )}

            {/* RTOM Tab Filter */}
            {activeTab === "Billing Center" && (
              <select
                value={rtomFilter}
                onChange={(e) => setRtomFilter(e.target.value)}
                className={GlobalStyle.selectBox}
              >
                <option value="" disabled hidden>
                  Select Handeling Type
                </option>
                {handlingtype.map((rtomOption, index) => (
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
              onClick={handleClear}
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
        {["RO", "Billing Center", "Services"].map((tab) => (
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
                  <th className={GlobalStyle.tableHeader}>Created Date</th>
                  <th className={GlobalStyle.tableHeader}>Contact Number</th>
                </>
              )}
              {activeTab === "Billing Center" && (
                <>
                  <th className={GlobalStyle.tableHeader}>Billing Center Name</th>
                  <th className={GlobalStyle.tableHeader}>Billing Center Code</th>
                  <th className={GlobalStyle.tableHeader}>Handling Type</th>
                  <th className={GlobalStyle.tableHeader}>Created Date</th>
                  <th className={GlobalStyle.tableHeader}>Contact Number</th>
                  <th className={GlobalStyle.tableHeader}>RO Count</th>
                </>
              )}
              {activeTab === "Services" && (
                <>
                  <th className={GlobalStyle.tableHeader}>Service Type</th>
                  <th className={GlobalStyle.tableHeader}>Created Date</th>
                  <th className={GlobalStyle.tableHeader}>Status</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>

                <td colSpan={activeTab === "RO" ? 4 : activeTab === "Billing Center" ? 6 : 3} className={GlobalStyle.tableData}
                  style={{ textAlign: "center" }}
                >
                  {isLoading ? "Loading..." : "No data found"}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
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
                      <td className={GlobalStyle.tableData}>{renderStatusIcon(row.status)}

                        <Tooltip
                          id={`status-tooltip-${row.status}`}
                          place="bottom"
                          content={row.status}
                        />

                      </td>
                      <td className={GlobalStyle.tableData}>{row.enableDate}</td>
                      <td className={GlobalStyle.tableData}>{row.contact}</td>
                    </>
                  )}
                  {activeTab === "Billing Center" && (
                    <>
                      <td className={GlobalStyle.tableData}>{row.name}</td>
                      <td className={GlobalStyle.tableData}>{row.billing_center_Code}</td>
                      <td className={GlobalStyle.tableData}>{row.handlingType}</td>
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
                      <td className={GlobalStyle.tableData}>{renderStatusIcon(row.status)}
                        <Tooltip
                          id={`status-tooltip-${row.status}`}
                          place="bottom"
                          content={row.status}
                        />
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredData.length > 0 && (
        <div className={GlobalStyle.navButtonContainer}>
          <button
            className={GlobalStyle.navButton}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <FaArrowLeft />
          </button>
          <span>
            Page {currentPage}
          </span>
          <button
            className={GlobalStyle.navButton}
            onClick={handleNextPage}
            disabled={!isMoreDataAvailable && currentPage >= Math.ceil(filteredData.length / rowsPerPage)}
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
      </button>
    </div>
  );
};

export default DRCDetails;   