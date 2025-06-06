/*Purpose: This template is used for the 10.3 - DRC's info 2
Created Date: 2025-05-20
Created By: Yevin (ytheenura5@gmail.com)
ui number : 10.3
Dependencies: tailwind css
Related Files: router(Routers.jsx)
Notes: The following page contains the codes */

import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import Swal from "sweetalert2";
import Edit from "../../assets/images/edit-info.svg";
import {
  getDebtCompanyByDRCID,
  terminateCompanyByDRCID,
} from "../../services/drc/Drc";
import {  FaArrowLeft } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getLoggedUserId } from "../../services/auth/authService";

const DRCInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Check for drcId in location state first, then fallback to search params
  const drcId = location.state?.drcId || searchParams.get("drcid") || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEndFields, setShowEndFields] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const [remark, setRemark] = useState("");
  const [remarkError, setRemarkError] = useState(false);
  const [userData, setUserData] = useState(null);
  const [companyData, setCompanyData] = useState({
    drc_id: "",
    create_on: "",
    drc_name: "",
    drc_business_registration_number: "",
    drc_address: "",
    drc_contact_no: "",
    drc_email: "",
    drc_status: "",
    slt_coordinator: [],
    services: [],
    rtom: [],
    remark: [],
  });

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        const drcIdToUse = drcId;
        const data = await getDebtCompanyByDRCID(drcIdToUse);

        if (data) {
          // Format the data according to the model structure
          setCompanyData(data);
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch DRC data:", err);
        setError("Failed to load DRC information. Please try again later.");
        setLoading(false);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load DRC information",
        });
      }
    };

    fetchCompanyData();
  }, [drcId]);

  // Replace the existing handleNavigateToEdit function with this:
  const handleNavigateToEdit = () => {
    const drcIdToUse = drcId || companyData.drc_id;
    navigate(`/pages/DRC/DRCInfoEdit`, {
      state: { drcId: drcIdToUse },
    });
  };

   const goBack = () => {
        navigate(-1); 
    };

  // get system user
  const loadUser = async () => {
    const user = await getLoggedUserId();
    setUserData(user);
    console.log("User data:", user);
  };

  useEffect(() => {
    loadUser();
  }, []);

  // Replace the handleEndSubmit function with this improved version
  const handleEndSubmit = async () => {
    try {
      let remarkBy = userData
        ? userData.id || userData.userId || userData
        : "system";

      // Format the date as needed by the API
      const formattedDate =
        endDate instanceof Date ? endDate : new Date(endDate);

      if (!remark.trim()) {
        setRemarkError(true);
        return Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please enter a remark",
        });
      }

      // Reset error state
      setRemarkError(false);

      // Show loading indicator
      Swal.fire({
        title: "Processing...",
        text: "Please wait while terminating the DRC",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Call the API to terminate the company
      const response = await terminateCompanyByDRCID(
        companyData.drc_id,
        remark,
        remarkBy,
        formattedDate
      );

      // Close loading indicator
      Swal.close();

      // Success message with more details
      Swal.fire({
        icon: "success",
        title: "Termination Successful",
        text: `DRC ${
          companyData.drc_name
        } has been successfully terminated with effect from ${formattedDate.toLocaleDateString()}.`,
        confirmButtonText: "Done",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          // Reset the form fields
          setRemark("");
          setShowEndFields(false);

          // Navigate to refresh the data
          navigate(-1);
        }
      });
    } catch (err) {
      console.error("Failed to terminate DRC:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to terminate DRC",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // Get the current active coordinator (assuming the last one in the array is current)
  const currentCoordinator =
    companyData.slt_coordinator && companyData.slt_coordinator.length > 0
      ? companyData.slt_coordinator[companyData.slt_coordinator.length - 1]
      : null;

  return (
    <div
      className={`${GlobalStyle.fontPoppins} px-4 sm:px-6 md:px-8 max-w-7xl mx-auto`}
    >
      <h2
        className={`${GlobalStyle.headingLarge} text-center sm:text-left mb-4 sm:mb-6`}
      >
        {companyData.drc_id} - {companyData.drc_name}
      </h2>

      <div className="w-full flex justify-center">
        <div
          className={`${GlobalStyle.cardContainer} relative w-full max-w-4xl`}
        >
          {/* Edit button */}
          <div className="absolute top-4 right-4">
            <img
              src={Edit}
              onClick={handleNavigateToEdit}
              className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg cursor-pointer w-10 sm:w-14"
              alt="Edit"
            />
          </div>

          {/* Company Details Section */}
          <h2
            className={`${GlobalStyle.headingMedium} mb-4 sm:mb-6 mt-6 sm:mt-8 underline text-left font-semibold`}
          >
            Company Details
          </h2>

          <table className={`${GlobalStyle.table} min-w-full text-left`}>
            <tbody>
              <tr className="flex flex-col sm:table-row border-b sm:border-b-0">
                <td
                  className={`${GlobalStyle.tableData} font-medium sm:whitespace-nowrap text-left py-2 sm:py-3 sm:w-1/4`}
                >
                  Added Date
                </td>
                <td className="hidden sm:table-cell w-4 text-left">:</td>
                <td
                  className={`${GlobalStyle.tableData} text-gray-500 break-words text-left pb-4 sm:pb-0 border-b sm:border-b-0`}
                >
                  {companyData.create_on
                    ? new Date(companyData.create_on).toLocaleDateString()
                    : "Not specified"}
                </td>
              </tr>

              <tr>
                <td
                  className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-1/3 sm:w-1/4`}
                >
                  Business Reg No
                </td>
                <td className="w-4 text-left">:</td>
                <td
                  className={`${GlobalStyle.tableData} text-gray-500 text-left`}
                >
                  {companyData.drc_business_registration_number ||
                    "Not specified"}
                </td>
              </tr>
              <tr>
                <td
                  className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-1/3 sm:w-1/4`}
                >
                  Contact Number
                </td>
                <td className="w-4 text-left">:</td>
                <td
                  className={`${GlobalStyle.tableData} text-gray-500 text-left`}
                >
                  {companyData.drc_contact_no || "Not specified"}
                </td>
              </tr>
              <tr>
                <td
                  className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-1/3 sm:w-1/4`}
                >
                  Address
                </td>
                <td className="w-4 text-left">:</td>
                <td
                  className={`${GlobalStyle.tableData} text-gray-500 text-left`}
                >
                  {companyData.drc_address || "Not specified"}
                </td>
              </tr>
              <tr>
                <td
                  className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-1/3 sm:w-1/4`}
                >
                  Email
                </td>
                <td className="w-4 text-left">:</td>
                <td
                  className={`${GlobalStyle.tableData} text-gray-500 text-left`}
                >
                  {companyData.drc_email || "Not specified"}
                </td>
              </tr>
            </tbody>
          </table>

          {/* SLT Coordinator Section */}
          <h2
            className={`${GlobalStyle.headingMedium} mt-6 mb-4 sm:mt-8 sm:mb-6 underline text-left font-semibold`}
          >
            SLT Coordinator Details
          </h2>

          {currentCoordinator ? (
            <table className={`${GlobalStyle.table} min-w-full text-left`}>
              <tbody>
                <tr>
                  <td
                    className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-1/3 sm:w-1/4`}
                  >
                    Service No
                  </td>
                  <td className="w-4 text-left">:</td>
                  <td
                    className={`${GlobalStyle.tableData} text-gray-500 break-words text-left`}
                  >
                    {currentCoordinator.service_no || "Not specified"}
                  </td>
                </tr>
                <tr>
                  <td
                    className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-1/3 sm:w-1/4`}
                  >
                    Name
                  </td>
                  <td className="w-4 text-left">:</td>
                  <td
                    className={`${GlobalStyle.tableData} text-gray-500 break-words text-left`}
                  >
                    {currentCoordinator.slt_coordinator_name || "Not specified"}
                  </td>
                </tr>
                <tr>
                  <td
                    className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-1/3 sm:w-1/4`}
                  >
                    Email
                  </td>
                  <td className="w-4 text-left">:</td>
                  <td
                    className={`${GlobalStyle.tableData} text-gray-500 break-words text-left`}
                  >
                    {currentCoordinator.slt_coordinator_email ||
                      "Not specified"}
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No coordinator assigned
            </div>
          )}

          {/* Services Section */}
          <h2
            className={`${GlobalStyle.headingMedium} mt-6 mb-4 sm:mt-8 sm:mb-6 underline text-left font-semibold`}
          >
            Services
          </h2>

          <div className={`${GlobalStyle.tableContainer} overflow-x-auto -mx-4 sm:mx-0`}>
            <table className={`${GlobalStyle.table} min-w-full inline-block align-middle`}>
              <thead className={`${GlobalStyle.thead} overflow-hidden`}>
                <tr>
                  <th
                    className={`${GlobalStyle.tableHeader} whitespace-nowrap text-left`}
                  >
                    Service Type
                  </th>
                  <th
                    className={`${GlobalStyle.tableHeader} whitespace-nowrap text-left`}
                  >
                    Changed On
                  </th>
                  <th
                    className={`${GlobalStyle.tableHeader} whitespace-nowrap text-left`}
                  ></th>
                </tr>
              </thead>
                  <tbody>
                {companyData.services &&
                  companyData.services.map((service, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0
                          ? "bg-white bg-opacity-75"
                          : "bg-gray-50 bg-opacity-50"
                      } border-b`}
                    >
                      <td className={`${GlobalStyle.tableData} whitespace-normal break-words text-left`}>
                        {service.service_type}
                      </td>
                      <td className={`${GlobalStyle.tableData} whitespace-nowrap text-left`}>
                        {service.status_update_dtm
                          ? new Date(service.status_update_dtm).toLocaleDateString()
                          : "Not specified"}
                      </td>
                      <td className={`${GlobalStyle.tableData} text-left`}>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={service.service_status === "Active"}
                            readOnly
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                          after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </td>
                    </tr>
                  ))}
                {(!companyData.services || companyData.services.length === 0) && (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-500">
                      No services available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* RTOM Section */}
          <h2
            className={`${GlobalStyle.headingMedium} mt-6 mb-4 sm:mt-8 sm:mb-6 underline text-left font-semibold`}
          >
            RTOM Areas
          </h2>

          <div className={`${GlobalStyle.tableContainer} overflow-x-auto -mx-4 sm:mx-0`}>
            <table className={`${GlobalStyle.table} min-w-full inline-block align-middle`}>
              <thead className={`${GlobalStyle.thead}overflow-hidden`}>
                <tr>
                  <th
                    className={`${GlobalStyle.tableHeader} whitespace-nowrap text-left`}
                  >
                    RTOM ID
                  </th>
                  <th
                    className={`${GlobalStyle.tableHeader} whitespace-nowrap text-left`}
                  >
                    Changed On
                  </th>
                  <th
                    className={`${GlobalStyle.tableHeader} whitespace-nowrap text-left`}
                  ></th>
                </tr>
              </thead>
                
                <tbody>
              {companyData.rtom &&
                companyData.rtom.map((rtom, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0
                        ? "bg-white bg-opacity-75"
                        : "bg-gray-50 bg-opacity-50"
                    } border-b`}
                  >
                    <td className={`${GlobalStyle.tableData} whitespace-normal break-words text-left`}>
                      {rtom.rtom_id}
                    </td>
                    <td className={`${GlobalStyle.tableData} whitespace-normal text-left`}>
                      {rtom.status_update_dtm
                        ? new Date(rtom.status_update_dtm).toLocaleDateString()
                        : "Not specified"}
                    </td>
                    <td className={`${GlobalStyle.tableData} text-left`}>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={rtom.rtom_status === "Active"}
                          readOnly
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full 
                        peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border
                        after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                    </td>
                  </tr>
                ))}
              {(!companyData.rtom || companyData.rtom.length === 0) && (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    No RTOM information available
                  </td>
                </tr>
              )}
            </tbody>

            </table>
          </div>

          {/* Card Container ends here */}
        </div>
      </div>

      {/* Termination Section in its own card */}
      {showEndFields && (
        <div className="w-full flex justify-center mt-6">
          <div
            className={`${GlobalStyle.cardContainer} relative w-full max-w-4xl`}
          >
            <table className={`${GlobalStyle.table} min-w-full text-left`}>
              <tbody>
                <tr>
                  <td
                    className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-1/3 sm:w-1/4`}
                  >
                    End Date
                  </td>
                  <td className="w-4 text-left">:</td>
                  <td
                    className={`${GlobalStyle.tableData} text-gray-500 break-words text-left`}
                  >
                    <div className="flex justify-start w-full">
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="dd/MM/yyyy"
                        className={`${GlobalStyle.inputText} w-full text-left`}
                        maxDate={new Date()} // Only allow current date or earlier
                        minDate={new Date()} // Only allow current date or later
                        // This combination effectively restricts to current date only
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td
                    className={`${GlobalStyle.tableData} underline whitespace-nowrap text-left w-1/3 sm:w-1/4 font-semibold`}
                  >
                    Remark
                  </td>
                  <td className="w-4 text-left">:</td>
                  <td
                    className={`${GlobalStyle.tableData} text-gray-500 break-words text-left`}
                  >
                    <textarea
                      value={remark}
                      onChange={(e) => {
                        setRemark(e.target.value);
                        if (e.target.value.trim() && remarkError) {
                          setRemarkError(false);
                        }
                      }}
                      rows="4"
                      className={`${GlobalStyle.inputText} w-full text-left ${
                        remarkError ? "border-red-500" : ""
                      }`}
                      placeholder="Enter reason for ending DRC relationship"
                      required
                    />
                    {remarkError && (
                      <p className="text-red-500 text-sm mt-1 text-left">
                        Remark is required
                      </p>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleEndSubmit}
                className={GlobalStyle.buttonPrimary}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* End button */}
      {!showEndFields && (
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 px-4 sm:px-8">
       <button
                          className={`${GlobalStyle.buttonPrimary} flex items-center space-x-2 w-full sm:w-auto justify-center`}
                          onClick={goBack}
                        >
                          <FaArrowLeft />
                          <span>Back</span>
                        </button>

        <button
          onClick={() => setShowEndFields(true)}
          className={`${GlobalStyle.buttonPrimary} w-full sm:w-auto`}
        >
          End
        </button>
      </div>

        
      )}
    </div>
  );
};

export default DRCInfo;
