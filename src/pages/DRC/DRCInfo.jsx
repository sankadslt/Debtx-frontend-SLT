/*Purpose: This template is used for the 10.3 - DRC's info 2
Created Date: 2025-05-20
Created By: Yevin (ytheenura5@gmail.com)
ui number : 10.3
Dependencies: tailwind css
Related Files: router(Routers.jsx)
Notes: The following page contains the codes */

import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import Edit from "../../assets/images/edit-info.svg";
import {
  getDebtCompanyByDRCID,
  terminateCompanyByDRCID,
} from "../../services/drc/Drc";
import { FaArrowLeft } from "react-icons/fa";
import { getLoggedUserId } from "../../services/auth/authService";

const DRCInfo = () => {
  // Navigation 
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Get DRC ID 
  const drcId = location.state?.drcId || searchParams.get("drcid") || "";

  // State for termination form
  const [showEndFields, setShowEndFields] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const [remark, setRemark] = useState("");
  const [remarkError, setRemarkError] = useState(false);

  // User and data state
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // DRC company data 
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

  // Fetch DRC data 
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        const drcIdToUse = drcId;
        const data = await getDebtCompanyByDRCID(drcIdToUse);

        if (data) {
          setCompanyData(data);
          console.log("Current DRC Status:", data.drc_status);
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


  // Navigation handler 
  const handleNavigateToEdit = () => {
    const drcIdToUse = drcId || companyData.drc_id;
    navigate(`/pages/DRC/DRCInfoEdit`, {
      state: { drcId: drcIdToUse },
    });
  };


  // Navigation (Back btn)
  const goBack = () => {
    navigate(-1); 
  };


  // Load current user data
  const loadUser = async () => {
    const user = await getLoggedUserId();
    setUserData(user);
    console.log("User data:", user);
  };

  
  useEffect(() => {
    loadUser();
  }, []);


  // Handle DRC End
  const handleEndSubmit = async () => {
    try {

      //  (current user or system)
      let remarkBy = userData
        ? userData.id || userData.userId || userData
        : "system";

      const formattedDate =
        endDate instanceof Date ? endDate : new Date(endDate);

      // Validate remark field
      if (!remark.trim()) {
        setRemarkError(true);
        return Swal.fire({
          icon: "error",
          title: "Remark Required",
          text: "Please enter a remark",
        });
      }

      setRemarkError(false);

      Swal.fire({
        title: "Processing...",
        text: "Please wait while terminating the DRC",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Call termination API
      const response = await terminateCompanyByDRCID(
        companyData.drc_id,
        remark,
        remarkBy,
        formattedDate
      );

      Swal.close();

      // success message
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
          setRemark("");
          setShowEndFields(false);
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

  // Get current coordinator (last one in array)
  const currentCoordinator =
    companyData.slt_coordinator && companyData.slt_coordinator.length > 0
      ? companyData.slt_coordinator[companyData.slt_coordinator.length - 1]
      : null;

  // Loading state
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

  return (
    <div className={`${GlobalStyle.fontPoppins} px-4 sm:px-6 md:px-8 max-w-7xl mx-auto`}>
      <h2 className={`${GlobalStyle.headingLarge} text-center sm:text-left mb-4 sm:mb-6`}>
        {companyData.drc_id} - {companyData.drc_name}
      </h2>

      {/* Main Content Card */}
      <div className="w-full flex justify-center">
        <div className={`${GlobalStyle.cardContainer} relative w-full max-w-4xl`}>
          
          <div className="absolute top-4 right-4">
            <img
              src={Edit}
              onClick={handleNavigateToEdit}
              className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg cursor-pointer w-10 sm:w-14"
              alt="Edit"
            />
          </div>

          {/* Company Details Section */}
          <h2 className={`${GlobalStyle.headingMedium} mb-4 sm:mb-6 mt-6 sm:mt-8 underline text-left font-semibold`}>
            Company Details
          </h2>

          <table className={`${GlobalStyle.table} w-full text-left`}>
              <tbody className="space-y-2 sm:space-y-0">
                {[
                  { 
                    label: "Added Date", 
                    value: companyData.create_on 
                      ? new Date(companyData.create_on).toLocaleDateString() 
                      : "Not specified" 
                  },
                  { 
                    label: "Business Reg No", 
                    value: companyData.drc_business_registration_number || "Not specified" 
                  },
                  { 
                    label: "Contact Number", 
                    value: companyData.drc_contact_no || "Not specified" 
                  },
                  { 
                    label: "Address", 
                    value: companyData.drc_address || "Not specified" 
                  },
                  { 
                    label: "Email", 
                    value: companyData.drc_email || "Not specified" 
                  }
                ].map((item, index) => (
                  <tr key={index} className="block sm:table-row">
                   
                    <td className={`${GlobalStyle.tableData} font-medium block sm:hidden`}>
                      {item.label}:
                    </td>
                    <td className={`${GlobalStyle.tableData} text-gray-500 block sm:hidden pl-4`}>
                      {item.value}
                    </td>
                    
                   
                    <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap hidden sm:table-cell w-1/3 sm:w-1/4`}>
                      {item.label}
                    </td>
                    <td className="w-4 text-left hidden sm:table-cell">:</td>
                    <td className={`${GlobalStyle.tableData} text-gray-500 hidden sm:table-cell`}>
                      {item.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          {/* SLT Coordinator Section */}
          <h2 className={`${GlobalStyle.headingMedium} mt-6 mb-4 sm:mt-8 sm:mb-6 underline text-left font-semibold`}>
            SLT Coordinator Details
          </h2>

          {currentCoordinator ? (
            <table className={`${GlobalStyle.table} min-w-full text-left`}>
              <tbody>
                <tr>
                  <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-1/3 sm:w-1/4`}>
                    Service No
                  </td>
                  <td className="w-4 text-left">:</td>
                  <td className={`${GlobalStyle.tableData} text-gray-500 break-words text-left`}>
                    {currentCoordinator.service_no || "Not specified"}
                  </td>
                </tr>
                <tr>
                  <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-1/3 sm:w-1/4`}>
                    Name
                  </td>
                  <td className="w-4 text-left">:</td>
                  <td className={`${GlobalStyle.tableData} text-gray-500 break-words text-left`}>
                    {currentCoordinator.slt_coordinator_name || "Not specified"}
                  </td>
                </tr>
                <tr>
                  <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-1/3 sm:w-1/4`}>
                    Email
                  </td>
                  <td className="w-4 text-left">:</td>
                  <td className={`${GlobalStyle.tableData} text-gray-500 break-words text-left`}>
                    {currentCoordinator.slt_coordinator_email || "Not specified"}
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
          <h2 className={`${GlobalStyle.headingMedium} mt-6 mb-4 sm:mt-8 sm:mb-6 underline text-left font-semibold`}>
            Services
          </h2>

          <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
            <table className={`${GlobalStyle.table} min-w-full`}>
              <thead className={GlobalStyle.thead}>
                <tr>
                  <th className={`${GlobalStyle.tableHeader} whitespace-nowrap text-left`}>
                    Service Type
                  </th>
                  <th className={`${GlobalStyle.tableHeader} whitespace-nowrap text-left`}>
                    Changed On
                  </th>
                  <th className={`${GlobalStyle.tableHeader} whitespace-nowrap text-left`}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {companyData.services && companyData.services.map((service, index) => (
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

          {/* RTOM Areas Section */}
          <h2 className={`${GlobalStyle.headingMedium} mt-6 mb-4 sm:mt-8 sm:mb-6 underline text-left font-semibold`}>
            RTOM Areas
          </h2>

          <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
            <table className={`${GlobalStyle.table} min-w-full`}>
              <thead className={GlobalStyle.thead}>
                <tr>
                  <th className={`${GlobalStyle.tableHeader} whitespace-nowrap text-left`}>
                    RTOM ID
                  </th>
                  <th className={`${GlobalStyle.tableHeader} whitespace-nowrap text-left`}>
                    Changed On
                  </th>
                  <th className={`${GlobalStyle.tableHeader} whitespace-nowrap text-left`}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {companyData.rtom && companyData.rtom.map((rtom, index) => (
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
        </div>
      </div>

      {/* Termination Form  */}
     {showEndFields && (
       <div className="w-full flex justify-center mt-6">
           <div className={`${GlobalStyle.cardContainer} relative w-full max-w-4xl px-4 sm:px-6`}>
                  <table className={`${GlobalStyle.table} w-full text-left`}>
                    <tbody className="space-y-4 sm:space-y-0">
                      {/* End Date Row */}
                      <tr className="block sm:table-row">
                      
                        <td className={`${GlobalStyle.tableData} font-medium block sm:hidden`}>
                          End Date:
                        </td>
                        <td className={`${GlobalStyle.tableData} block sm:hidden pl-4`}>
                          <div className="w-full">
                            <DatePicker
                              selected={endDate}
                              onChange={(date) => setEndDate(date)}
                              dateFormat="dd/MM/yyyy"
                              className={`${GlobalStyle.inputText} w-full text-left`}
                              maxDate={new Date()}
                              minDate={new Date()}
                            />
                          </div>
                        </td>
                        
                      
                        <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap hidden sm:table-cell w-1/3 sm:w-1/4`}>
                          End Date
                        </td>
                        <td className="w-4 text-left hidden sm:table-cell">:</td>
                        <td className={`${GlobalStyle.tableData} hidden sm:table-cell`}>
                          <div className="flex justify-start w-full">
                            <DatePicker
                              selected={endDate}
                              onChange={(date) => setEndDate(date)}
                              dateFormat="dd/MM/yyyy"
                              className={`${GlobalStyle.inputText} w-full text-left`}
                              maxDate={new Date()}
                              minDate={new Date()}
                            />
                          </div>
                        </td>
                      </tr>

                      {/* Remark Row */}
                      <tr className="block sm:table-row">
                       
                        <td className={`${GlobalStyle.tableData} font-semibold block sm:hidden`}>
                          Remark:
                        </td>
                        <td className={`${GlobalStyle.tableData} block sm:hidden pl-4`}>
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
                        
                        
                        <td className={`${GlobalStyle.tableData} font-semibold whitespace-nowrap hidden sm:table-cell w-1/3 sm:w-1/4`}>
                          Remark
                        </td>
                        <td className="w-4 text-left hidden sm:table-cell">:</td>
                        <td className={`${GlobalStyle.tableData} hidden sm:table-cell`}>
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
                      className={`${GlobalStyle.buttonPrimary} w-full sm:w-auto`}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
      {!showEndFields && (
        <div className="flex justify-between mt-4 w-full px-8">
          <button
            className={`${GlobalStyle.buttonPrimary} flex items-center space-x-2`}
            onClick={goBack}
          >
            <FaArrowLeft />
            <span>Back</span>
          </button>

          {/* End Button (Opacity-50) */}
          <button
            onClick={() => {
              if (companyData.drc_status !== "Terminate") {
                setShowEndFields(true);
              }
            }}
            className={`${GlobalStyle.buttonPrimary} ${
              companyData.drc_status === "Terminate" 
                ? "opacity-50 cursor-not-allowed" 
                : ""
            }`}
            disabled={companyData.drc_status === "Terminate"}
          >
            End
          </button>
        </div>
      )}
    </div>
  );
};

export default DRCInfo;