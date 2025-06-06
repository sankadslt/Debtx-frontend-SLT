

/*Purpose: 
Created Date: 2025-01-09
Created By: Dilmith Siriwardena (jtdsiriwardena@gmail.com)
Last Modified Date: 2025-01-09
Modified By: Dilmith Siriwardena (jtdsiriwardena@gmail.com)
Version: React v18
ui number : 0.1
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */

import { useEffect, useState } from 'react';
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { GetFilteredCaseLists } from "../../services/case/CaseServices";
import { fetchAllArrearsBands } from '../../services/case/CaseServices';
import { List_All_Active_RTOMs } from "../../services/RTOM/Rtom";
import { Active_DRC_Details } from '../../services/drc/Drc';
import { getActiveServiceDetails } from "../../services/drc/Drc";

const Case_List = () => {
  // State Variables
  const [rtomList, setRtomList] = useState([]);
  const [rtom, setRtom] = useState("");
  const [activeDRC, setActiveDRC] = useState([]);
  const [selectedDRC, setSelectedDRC] = useState("");
  const [arrearsBand, setArrearsBand] = useState([]);
  const [selectedBand, setSelectedBand] = useState("");
  const [serviceTypes, setServiceTypes] = useState([]);
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [searchBy, setSearchBy] = useState("case_id");
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [maxCurrentPage, setMaxCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true);
  const rowsPerPage = 10;

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const navigate = useNavigate();

  const handlestartdatechange = (date) => {
    setFromDate(date);
  };

  const handleenddatechange = (date) => {
    setToDate(date);
  };

  useEffect(() => {
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      Swal.fire({
        title: "Warning",
        text: "To date should be greater than or equal to From date",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      setToDate(null);
      setFromDate(null);
      return;
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    const fetchRTOM = async () => {
      try {
        const rtom = await List_All_Active_RTOMs();
        setRtomList(rtom);
      } catch (error) {
        console.error("Error fetching rtom:", error);
      }
    };

    const fetchActiveDRCs = async () => {
      try {
        const drcs = await Active_DRC_Details();
        setActiveDRC(drcs);
      } catch (error) {
        console.error("Error fetching drcs:", error);
      }
    };

    const fetchArrearsBands = async () => {
      try {
        const bands = await fetchAllArrearsBands();
        setArrearsBand(bands);
      } catch (error) {
        console.error("Error fetching arrears bands:", error);
      }
    };

    const fetchServiceTypes = async () => {
      try {
        const response = await getActiveServiceDetails();
        setServiceTypes(response.data || []);
      } catch (error) {
        console.error("Error fetching service types:", error);
        setServiceTypes([]);
      }
    };

    fetchRTOM();
    fetchActiveDRCs();
    fetchArrearsBands();
    fetchServiceTypes();
  }, []);

  const filteredDataBySearch = paginatedData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleFilter = async () => {
    try {
      if (!rtom && !selectedBand && !selectedDRC && !selectedServiceType && !fromDate && !toDate) {
        Swal.fire({
          title: "Warning",
          text: "No filter is selected. Please, select a filter.",
          icon: "warning",
          allowOutsideClick: false,
          allowEscapeKey: false
        });
        setToDate(null);
        setFromDate(null);
        return;
      }

      if ((fromDate && !toDate) || (!fromDate && toDate)) {
        Swal.fire({
          title: "Warning",
          text: "Both From Date and To Date must be selected.",
          icon: "warning",
          allowOutsideClick: false,
          allowEscapeKey: false
        });
        setToDate(null);
        setFromDate(null);
        return;
      }

      const payload = {
        case_status: "", // or whatever status you want to filter by
        From_DAT: fromDate ? fromDate.toISOString().split('T')[0] : null,
        TO_DAT: toDate ? toDate.toISOString().split('T')[0] : null,
        RTOM: rtom,
        DRC: selectedDRC,
        current_arrears_band: selectedBand,
        service_type: selectedServiceType,
        pages: currentPage
      };

      setIsLoading(true);

      const response = await GetFilteredCaseLists(payload).catch((error) => {
        if (error.response && error.response.status === 404) {
          Swal.fire({
            title: "No Results",
            text: "No matching data found for the selected filters.",
            icon: "warning",
            allowOutsideClick: false,
            allowEscapeKey: false
          });
          //setFilteredData([]);
          return null;
        } else {
          throw error;
        }
      });

      if (response && response.data) {
        setFilteredData(response.data);
        setTotalPages(Math.ceil(response.data.length / rowsPerPage));

        if (response.data.length === 0) {
          setIsMoreDataAvailable(false);
          if (currentPage === 1) {
            Swal.fire({
              title: "No Results",
              text: "No matching data found for the selected filters.",
              icon: "warning",
              allowOutsideClick: false,
              allowEscapeKey: false
            });
          }
        } else {
          const maxData = currentPage === 1 ? 10 : 30;
          setIsMoreDataAvailable(response.data.length === maxData);
        }
      } else {
        Swal.fire({
          title: "Error",
          text: "No valid case data found in response.",
          icon: "error"
        });
        //setFilteredData([]);
      }
    } catch (error) {
      console.error("Error filtering cases:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to fetch filtered data. Please try again.",
        icon: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setRtom("");
    setSelectedDRC("");
    setSelectedBand("");
    setSelectedServiceType("");
    setFromDate(null);
    setToDate(null);
    setSearchQuery("");
    setCurrentPage(1);
    setIsFilterApplied(false);
    setTotalPages(0);
    //setFilteredData([]);
  };

  useEffect(() => {
  // Only run this if there’s no real data yet
  if (filteredData.length === 0) {
    const dummy = [];
    for (let i = 1; i <= 100; i++) {
      dummy.push({
        case_id: `CASE${i}`,
        rtom: `RTOM ${i % 5}`,
        drc: `DRC ${i % 3}`,
        band: `Band ${i % 4}`,
        service: `Service ${i % 2}`,
        createdAt: `2025-06-${(i % 30) + 1}`
      });
    }
    setFilteredData(dummy);
    setTotalPages(Math.ceil(dummy.length / rowsPerPage));
  }
}, []);


  useEffect(() => {
    if (isFilterApplied && isMoreDataAvailable && currentPage > maxCurrentPage && currentPage !== 1) {
      setMaxCurrentPage(currentPage);
      //handleFilter();
    }
  }, [currentPage]);

  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next") {
      if (isMoreDataAvailable || currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    }
  };

  const handleFilterButton = () => {
    //setFilteredData([]);
    setIsMoreDataAvailable(true);
    setMaxCurrentPage(0);
    if (currentPage === 1) {
      //handleFilter();
    } else {
      setCurrentPage(1);
    }
    setIsFilterApplied(true);
  }

  const handleCreateTask = () => {
    console.log("Create task button clicked");
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
      <h1 className={GlobalStyle.headingLarge + " mb-6"}>Case List</h1>

      <div className="flex justify-end">
        <div className={`${GlobalStyle.cardContainer} w-full`}>
          <div className="flex flex-wrap items-center justify-end w-full space-x-4 space-y-3">
            <select
              value={rtom}
              onChange={(e) => setRtom(e.target.value)}
              className={`${GlobalStyle.selectBox} mt-3`}
              style={{ color: rtom === "" ? "gray" : "black" }}
            >
              <option value="" hidden>RTOM</option>
              {Object.values(rtomList).map((rtom) => (
                <option key={rtom.rtom_id} value={rtom.rtom} style={{ color: "black" }}>
                  {rtom.rtom}
                </option>
              ))}
            </select>

            <select
              value={selectedDRC}
              onChange={(e) => setSelectedDRC(e.target.value)}
              className={`${GlobalStyle.selectBox} mt-3`}
              style={{ color: selectedDRC === "" ? "gray" : "black" }}
            >
              <option value="" hidden>DRC</option>
              {activeDRC.map((drc) => (
                <option key={drc.key} value={drc.id.toString()} style={{ color: "black" }}>
                  {drc.value}
                </option>
              ))}
            </select>

            <select
              value={selectedBand}
              onChange={(e) => setSelectedBand(e.target.value)}
              className={`${GlobalStyle.selectBox} mt-3`}
              style={{ color: selectedBand === "" ? "gray" : "black" }}
            >
              <option value="">Arrears Band</option>
              {arrearsBand.map(({ key, value }) => (
                <option key={key} value={value} style={{ color: "black" }}>
                  {value}
                </option>
              ))}
            </select>

            <select
              value={selectedServiceType}
              onChange={(e) => setSelectedServiceType(e.target.value)}
              className={`${GlobalStyle.selectBox} mt-3`}
              style={{ color: selectedServiceType === "" ? "gray" : "black" }}
            >
              <option value="">Service Type</option>
              {serviceTypes.map((service) => (
                <option key={service.key} value={service.id.toString()} style={{ color: "black" }}>
                  {service.value}
                </option>
              ))}
            </select>

            <div className="flex flex-wrap items-center justify-end space-x-3 w-full mt-2">
              <label className={GlobalStyle.dataPickerDate}>Date:</label>

              <DatePicker
                selected={fromDate}
                onChange={handlestartdatechange}
                dateFormat="dd/MM/yyyy"
                placeholderText="From"
                className={`${GlobalStyle.inputText} w-full sm:w-auto`}
              />

              <DatePicker
                selected={toDate}
                onChange={handleenddatechange}
                dateFormat="dd/MM/yyyy"
                placeholderText="To"
                className={`${GlobalStyle.inputText} w-full sm:w-auto`}
              />

              <button
                className={`${GlobalStyle.buttonPrimary} w-full sm:w-auto`}
                onClick={handleFilterButton}
              >
                Filter
              </button>

              <button
                className={`${GlobalStyle.buttonRemove} w-full sm:w-auto`}
                onClick={handleClear}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center">
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

      <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
        {/* <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th scope="col" className={GlobalStyle.tableHeader}>
                ID
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Status
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Account No.
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Service Type
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Amount
              </th>

              <th scope="col" className={GlobalStyle.tableHeader}>
                Agent
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                RTOM
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Created Date
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Last Paid Date
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredDataBySearch.length > 0 ? (
              filteredDataBySearch.map((row, index) => {
                const createdDate = row.createddtm
                  ? new Date(row.createddtm).toLocaleDateString()
                  : '';

                const lastPaidDate = row.lastpaymentdate
                  ? new Date(row.lastpaymentdate).toLocaleDateString()
                  : '';

                return (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? "bg-white bg-opacity-75" : "bg-gray-50 bg-opacity-50"} border-b`}
                  >
                    <td className={GlobalStyle.tableData}>{row.caseid}</td>
                    <td className={GlobalStyle.tableData}>{row.casecurrentstatus}</td>
                    <td className={GlobalStyle.tableData}>{row.accountno}</td>
                    <td className={GlobalStyle.tableData}>{row.servicetype}</td>
                    <td className={GlobalStyle.tableCurrency}>
                                        {row.amount?.toLocaleString("en-LK", {
                                          style: "currency",
                                          currency: "LKR",
                                        })}
                    <td className={GlobalStyle.tableData}>{row.Agent}</td>
                    <td className={GlobalStyle.tableData}>{row.rtom}</td>
                    
                    
                      <td className={GlobalStyle.tableData}>{createdDate}</td>
                      <td className={GlobalStyle.tableData}>{lastPaidDate}</td>
                    
                    
                    
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No cases found
                </td>
              </tr>
            )}
          </tbody>
        </table> */}
        <table className="w-full mt-4 text-left border">
  <thead>
    <tr>
      <th className="border p-2">Case ID</th>
      <th className="border p-2">RTOM</th>
      <th className="border p-2">DRC</th>
      <th className="border p-2">Band</th>
      <th className="border p-2">Service</th>
      <th className="border p-2">Created At</th>
    </tr>
  </thead>
  <tbody>
    {paginatedData.map((item, index) => (
      <tr key={index}>
        <td className="border p-2">{item.case_id}</td>
        <td className="border p-2">{item.rtom}</td>
        <td className="border p-2">{item.drc}</td>
        <td className="border p-2">{item.band}</td>
        <td className="border p-2">{item.service}</td>
        <td className="border p-2">{item.createdAt}</td>
      </tr>
    ))}
  </tbody>
</table>

      </div>

      {filteredData.length !== 0 && (
        <div className={GlobalStyle.navButtonContainer}>
          <button
            onClick={() => handlePrevNext("prev")}
            disabled={currentPage <= 1}
            className={`${GlobalStyle.navButton} ${currentPage <= 1 ? "cursor-not-allowed" : ""}`}
          >
            <FaArrowLeft />
          </button>
          <span className={`${GlobalStyle.pageIndicator} mx-4`}>
            Page {currentPage}
          </span>
          <button
            onClick={() => handlePrevNext("next")}
            disabled={currentPage === totalPages}
            className={`${GlobalStyle.navButton} ${currentPage === totalPages ? "cursor-not-allowed" : ""}`}
          >
            <FaArrowRight />
          </button>
        </div>
      )}

      <div className="flex justify-end mt-6">
        <button
          onClick={handleCreateTask}
          className={GlobalStyle.buttonPrimary}
        >
          Create task and let me know
        </button>
      </div>
    </div>
  );
};

export default Case_List;