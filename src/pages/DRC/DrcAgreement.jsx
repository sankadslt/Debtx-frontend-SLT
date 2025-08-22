import { useEffect, useState } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import edit from "../../assets/images/edit-info.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { getLoggedUserId } from "../../services/auth/authService";
import approved from "../../assets/images/Agreement/Agreement_Approved.png";
import expire from "../../assets/images/Agreement/Agreement_Expire.png";
import pending from "../../assets/images/Agreement/Agreement_Pending.png";
import reject from "../../assets/images/Agreement/Agreement_Reject.png";
import terminate from "../../assets/images/Agreement/Agreement_Terminate.png";
import { Tooltip } from "react-tooltip";
import { DRC_Agreement_details_list, Assign_DRC_To_Agreement } from "../../services/drc/Drc";


const DrcAgreement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const drcId = location.state?.drcId;
  const companyname = location.state?.drcname;

  const goBack = () => {
    navigate(-1);
  };

  const [loggedUserData, setLoggedUserData] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form data states
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [remark, setRemark] = useState("");

  // Agreement history data
  // const [agreementHistory, setAgreementHistory] = useState([
  //   {
  //     start_date: "2024-01-01",
  //     end_date: "2024-12-31",
  //     remark: "agreement updated",
  //     updated_by: "Damithri"
  //   },
  //   {
  //     start_date: "2023-01-01",
  //     end_date: "2023-12-31",
  //     remark: "agreement updated",
  //     updated_by: "Saniru"
  //   }
  // ]);

  // // Current agreement data
  // const [currentAgreement, setCurrentAgreement] = useState({
  //   start_date: "2024-01-01",
  //   end_date: "2024-12-31"
  // });

  const [agreementHistory, setAgreementHistory] = useState([]);
  const [currentAgreement, setCurrentAgreement] = useState({
    start_date: "",
    end_date: ""
  });

  const [isRenewDisabled, setIsRenewDisabled] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("Renew Agreement");



  // Fetch agreement details from API
  const fetchAgreementDetails = async () => {
    try {

      //setLoading(true);
      console.log("Fetching agreement details for DRC ID:", drcId);
      const response = await DRC_Agreement_details_list(drcId);
      console.log("Fetched Data:", response.data);
      if (response.data) {
        const agreements = response.data// Assuming the first item contains the agreements array
        console.log("Agreements:", agreements);

        if (agreements && agreements.length > 0) {
          const current = agreements[agreements.length - 1];


          setCurrentAgreement({
            start_date: current.agreement_start_dtm.split("T")[0], // extract date part only
            end_date: current.agreement_end_dtm.split("T")[0],
          });
          console.log("Current Agreement:", current);

          const history = agreements.map(agreement => ({
            start_date: agreement.agreement_start_dtm.split("T")[0],
            end_date: agreement.agreement_end_dtm.split("T")[0],
            remark: agreement.agreement_remark,
            updated_by: agreement.agreement_update_by,
            status: agreement.agreement_status
          }));

          setAgreementHistory(history.reverse()); // reverse to show latest first if needed

          const latestEndDate = new Date(current.agreement_end_dtm.split("T")[0]);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const disabled = latestEndDate >= today;
          setIsRenewDisabled(disabled);
          setButtonLabel("Renew Agreement");

        } else {

          console.log("No agreements found for this DRC ID");
          setAgreementHistory([]);
          setIsRenewDisabled(false);
          setButtonLabel("Add Agreement");
        }
      }
    } catch (err) {
      console.error("Error fetching agreement details:", err);
      setError("Failed to load agreement details");
    }
  };

  useEffect(() => {
    fetchAgreementDetails();
  }, [drcId]);

  // Load agreement history




  const getStatusIcon = (status) => {
    const statusStr = String(status || '').toLowerCase();

    switch (statusStr) {
      case "approved":
        return approved;
      case "expired":
        return expire;
      case "pending":
        return pending;
      case "rejected":
        return reject;
      case "terminated":
        return terminate;
      default:
        return null; // Return null if no matching status found


    }
  };




  const renderStatusIcon = (status) => {
    if (status === undefined || status === null) {
      return <span className="flex justify-center items-center">Unknown</span>;
    }

    const iconPath = getStatusIcon(status);

    if (!iconPath) {
      return <span className="capitalize">{String(status)}</span>;
    }

    return (
      <img
        src={iconPath}
        alt={String(status)}
        className="w-6 h-6 mx-auto"
        data-tooltip-id={`status-tooltip-${status}`}
        data-tooltip-content={status}
      //title={status}
      />
    );
  };






  // Get system user
  const loadUser = async () => {
    try {
      const user = await getLoggedUserId();
      setLoggedUserData(user);
    } catch (err) {
      console.error("Error loading user:", err);
    }
  };



  useEffect(() => {
    loadUser();
    // Initialize dates from current agreement
    if (currentAgreement.start_date) {
      setStartDate(new Date(currentAgreement.start_date));
    }
    if (currentAgreement.end_date) {
      setEndDate(new Date(currentAgreement.end_date));
    }
  }, []);

  const toggleEdit = () => {
    if (!isEditing) {
      // Reset form when entering edit mode
      setStartDate(currentAgreement.start_date ? new Date(currentAgreement.start_date) : null);
      setEndDate(currentAgreement.end_date ? new Date(currentAgreement.end_date) : null);
      setRemark("");
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    // Validation
    if (!startDate) {
      Swal.fire({
        title: "Warning",
        text: "Start date is required",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor: "#f1c40f"
      });
      return;
    }

    if (!endDate) {
      Swal.fire({
        title: "Warning",
        text: "End date is required",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor: "#f1c40f"
      });
      return;
    }

    if (!remark.trim()) {
      Swal.fire({
        title: "Warning",
        text: "Remark is required",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor: "#f1c40f"
      });
      return;
    }

    if (startDate >= endDate) {
      Swal.fire({
        title: "Warning",
        text: "End date must be after start date",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor: "#f1c40f"
      });
      return;
    }


    try {
      setLoading(true);

      const formatDateLocal = (date) => {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, "0");
        const day = `${date.getDate()}`.padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      // Simulate API call
      const updateData = {
        drc_id: drcId,
        drc_name: companyname,
        start_date: formatDateLocal(startDate),
        end_date: formatDateLocal(endDate),
        remark: remark,
        assigned_by: loggedUserData
      };
      console.log("Update Data:", updateData);

      // Call API to update agreement
      const response = await Assign_DRC_To_Agreement(updateData);
      console.log("API Response:", response);


      // Update current agreement
      // setCurrentAgreement({
      //   start_date: updateData.start_date,
      //   end_date: updateData.end_date
      // });

      // Add to history
      // setAgreementHistory(prev => [
      //   {
      //     start_date: updateData.start_date,
      //     end_date: updateData.end_date,
      //     remark: updateData.remark,
      //     updated_by: updateData.updated_by
      //   },
      //   ...prev
      // ]);

      // Reset form
      setRemark("");
      setIsEditing(false);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Agreement details updated successfully",
        confirmButtonColor: "#28a745"
      });

      // Refresh agreement history
      await fetchAgreementDetails();
    } catch (err) {
      console.error("Error updating agreement:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.description ||
        err.message ||
        "Failed to update agreement details";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#d33"
      });
    } finally {
      setLoading(false);
      // Refresh agreement history
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "dd/mm/yyyy";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "mm/dd/yyyy";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Filter agreement history based on search query
  const filteredAgreementHistory = agreementHistory.filter((agreement) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (agreement.remark && agreement.remark.toLowerCase().includes(searchLower)) ||
      (agreement.updated_by && agreement.updated_by.toLowerCase().includes(searchLower)) ||
      (agreement.start_date && formatDateForDisplay(agreement.start_date).toLowerCase().includes(searchLower)) ||
      (agreement.end_date && formatDateForDisplay(agreement.end_date).toLowerCase().includes(searchLower))
    );
  });

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
        <div className={GlobalStyle.errorText}>{error}</div>
      </div>
    );
  }

  return (
    <div className={`${GlobalStyle.fontPoppins} px-4 sm:px-6 md:px-8 max-w-7xl mx-auto`}>
      {/* Header */}
      <h2 className={`${GlobalStyle.headingLarge} text-center sm:text-left mb-4 sm:mb-6`}>
        <span className="font-semibold">{companyname}</span>
      </h2>

      {/* Main Content */}
      <div className="w-full flex justify-center">
        <div className="w-full ">
          {/* Agreement Details Card */}

          <div className=" flex justify-end " >
            {!isEditing && (
              // <img
              //   src={edit}
              //   onClick={toggleEdit}
              //   className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg cursor-pointer w-10 sm:w-14"
              //   alt="Edit"
              //   data-tooltip-id="edit-agreement-tooltip"
              //   title="Edit Agreement"
              // />
              <button
                onClick={toggleEdit}
                className={`${GlobalStyle.buttonPrimary} ${isRenewDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
                disabled={isRenewDisabled}
              >
                {buttonLabel}
              </button>
            )}
            {/* <Tooltip id="edit-agreement-tooltip" place="bottom" content="Edit Agreement" /> */}
          </div>
          {/* { isEditing && (
            <h2 className={`${GlobalStyle.headingMedium} mb-4 sm:mb-6 mt-6 sm:mt-8 underline text-center font-semibold c`}>
              Company's Agreement Details
            </h2>
              )} */}

          {!isEditing && (
            <h1 className={`${GlobalStyle.headingMedium} mb-4 sm:mb-6 mt-6 sm:mt-8 underline text-center font-semibold c`}>
              Agreement History
            </h1>
          )}

          {isEditing ? (
            /* Edit Mode */
            <div className="w-full">
              {/* Centered Card Container with max width */}
              <div className="flex justify-center">
                <div className={`${GlobalStyle.cardContainer} w-full max-w-4xl`}>
                  <h2 className={`${GlobalStyle.headingMedium} mb-4 sm:mb-6 mt-6 sm:mt-8 underline text-center font-semibold`}>
                    Company's Agreement Details
                  </h2>

                  {/* Form Table */}
                  <div className="space-y-6">
                    <table className={`${GlobalStyle.table} w-full text-left`}>
                      <tbody>
                        {/* Start Date */}
                        <tr className="block sm:table-row">
                          <td className={`${GlobalStyle.tableData} font-medium block sm:hidden`}>
                            Start Date:
                          </td>
                          <td className={`${GlobalStyle.tableData} block sm:hidden pl-4`}>
                            <div className="w-full">
                              <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="dd/mm/yyyy"
                                className={`${GlobalStyle.inputText} w-full text-left`}
                                showYearDropdown
                                scrollableYearDropdown
                              />
                            </div>
                          </td>
                          <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap hidden sm:table-cell w-1/3 sm:w-1/4`}>
                            Start Date<span className="text-red-500 ml-1">*</span>
                          </td>
                          <td className="w-4 text-left hidden sm:table-cell">:</td>
                          <td className={`${GlobalStyle.tableData} hidden sm:table-cell`}>
                            <div className="flex justify-start w-full">
                              <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="dd/mm/yyyy"
                                className={`${GlobalStyle.inputText} w-full text-left`}
                                showYearDropdown
                                scrollableYearDropdown
                              />
                            </div>
                          </td>
                        </tr>

                        {/* End Date */}
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
                                placeholderText="dd/mm/yyyy"
                                className={`${GlobalStyle.inputText} w-full text-left`}
                                showYearDropdown
                                scrollableYearDropdown
                              />
                            </div>
                          </td>
                          <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap hidden sm:table-cell w-1/3 sm:w-1/4`}>
                            End Date <span className="text-red-500 ml-1">*</span>
                          </td>
                          <td className="w-4 text-left hidden sm:table-cell">:</td>
                          <td className={`${GlobalStyle.tableData} hidden sm:table-cell`}>
                            <div className="flex justify-start w-full">
                              <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="dd/mm/yyyy"
                                className={`${GlobalStyle.inputText} w-full text-left`}
                                showYearDropdown
                                scrollableYearDropdown
                              />
                            </div>
                          </td>
                        </tr>

                        {/* Remark */}
                        <tr className="block sm:table-row">
                          <td className={`${GlobalStyle.tableData} font-semibold block sm:hidden`}>
                            Remark:
                          </td>
                          <td className={`${GlobalStyle.tableData} block sm:hidden pl-4`}>
                            <textarea
                              className={`${GlobalStyle.inputText} w-full text-left h-32 resize-none`}
                              value={remark}
                              onChange={(e) => setRemark(e.target.value)}
                              placeholder="Enter remark for this update..."
                              rows="5"
                            />
                          </td>
                          <td className={`${GlobalStyle.tableData} font-semibold whitespace-nowrap hidden sm:table-cell w-1/3 sm:w-1/4`}>
                            Remark<span className="text-red-500 ml-1">*</span>
                          </td>
                          <td className="w-4 text-left hidden sm:table-cell">:</td>
                          <td className={`${GlobalStyle.tableData} hidden sm:table-cell`}>
                            <textarea
                              className={`${GlobalStyle.inputText} w-full text-left h-32 resize-none`}
                              value={remark}
                              onChange={(e) => setRemark(e.target.value)}
                              placeholder="Enter remark for this update..."
                              rows="5"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Save Button */}
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className={`${GlobalStyle.buttonPrimary} w-full sm:w-auto ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                      >
                        {loading ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full-width Agreement History Table */}
              <div className="w-full mt-8 px-4 sm:px-8">
                <h1 className={`${GlobalStyle.headingMedium} mb-4 sm:mb-6 mt-6 sm:mt-8 underline text-center font-semibold`}>
                  Agreement History
                </h1>
                <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
                  <table className={GlobalStyle.table}>
                    <thead className={GlobalStyle.thead}>
                      <tr>
                        <th className={`${GlobalStyle.tableHeader} text-left`}>Start Date</th>
                        <th className={`${GlobalStyle.tableHeader} text-left`}>End Date</th>
                        <th className={`${GlobalStyle.tableHeader} text-left`}>Status</th>
                        <th className={`${GlobalStyle.tableHeader} text-left`}>Remark</th>
                        <th className={`${GlobalStyle.tableHeader} text-left`}>Updated By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAgreementHistory.length > 0 ? (
                        filteredAgreementHistory.map((agreement, index) => (
                          <tr
                            key={index}
                            className={`${index % 2 === 0
                              ? GlobalStyle.tableRowEven
                              : GlobalStyle.tableRowOdd
                              } hover:bg-gray-50 transition-colors border-b`}
                          >
                            <td className={`${GlobalStyle.tableData} text-left text-xs lg:text-sm`}>
                              {formatDateForDisplay(agreement.start_date)}
                            </td>
                            <td className={`${GlobalStyle.tableData} text-left text-xs lg:text-sm`}>
                              {formatDateForDisplay(agreement.end_date)}
                            </td>
                            <td className={`${GlobalStyle.tableData} text-left text-xs lg:text-sm`}>
                              {renderStatusIcon(agreement.status)}

                              <Tooltip
                                id={`status-tooltip-${agreement.status}`}
                                place="bottom"
                                content={agreement.status}
                              />
                            </td>
                            <td className={`${GlobalStyle.tableData} text-left text-xs lg:text-sm`}>
                              {agreement.remark}
                            </td>
                            <td className={`${GlobalStyle.tableData} text-left text-xs lg:text-sm`}>
                              {agreement.updated_by}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className={`${GlobalStyle.tableData} `} style={{ textAlign: 'center' }}>
                            {searchQuery ? "No matching results found" : "No agreement history found"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>


          ) : (
            /* View Mode */
            // <div className="space-y-6">
            //   <table className={`${GlobalStyle.table} w-full text-left`}>
            //     <tbody>
            //       {[
            //         { 
            //           label: "Start Date", 
            //           value: formatDate(currentAgreement.start_date)
            //         },
            //         { 
            //           label: "End Date", 
            //           value: formatDate(currentAgreement.end_date)
            //         }
            //       ].map((item, index) => (
            //         <tr key={index} className="block sm:table-row">
            //           <td className={`${GlobalStyle.tableData} font-medium block sm:hidden`}>
            //             {item.label}:
            //           </td>
            //           <td className={`${GlobalStyle.tableData} text-gray-500 block sm:hidden pl-4`}>
            //             {item.value}
            //           </td>

            //           <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap hidden sm:table-cell w-1/3 sm:w-1/4`}>
            //             {item.label}
            //           </td>
            //           <td className="w-4 text-left hidden sm:table-cell">:</td>
            //           <td className={`${GlobalStyle.tableData} text-gray-500 hidden sm:table-cell`}>
            //             {item.value}
            //           </td>
            //         </tr>
            //       ))}
            //     </tbody>
            //   </table>
            // </div>

            <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
              <table className={GlobalStyle.table}>
                <thead className={GlobalStyle.thead}>
                  <tr>
                    <th className={`${GlobalStyle.tableHeader} text-left`}>
                      Start Date
                    </th>
                    <th className={`${GlobalStyle.tableHeader} text-left`}>
                      End Date
                    </th>
                    <th className={`${GlobalStyle.tableHeader} text-left`}>
                      Status
                    </th>
                    <th className={`${GlobalStyle.tableHeader} text-left`}>
                      Remark
                    </th>
                    <th className={`${GlobalStyle.tableHeader} text-left`}>
                      Updated By
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAgreementHistory.length > 0 ? (
                    filteredAgreementHistory.map((agreement, index) => (
                      <tr
                        key={index}
                        className={`${index % 2 === 0
                          ? GlobalStyle.tableRowEven
                          : GlobalStyle.tableRowOdd
                          } hover:bg-gray-50 transition-colors border-b`}
                      >
                        <td className={`${GlobalStyle.tableData} text-left text-xs lg:text-sm`}>
                          {formatDateForDisplay(agreement.start_date)}
                        </td>
                        <td className={`${GlobalStyle.tableData} text-left text-xs lg:text-sm`}>
                          {formatDateForDisplay(agreement.end_date)}
                        </td>
                        <td className={`${GlobalStyle.tableData} text-left text-xs lg:text-sm`}>
                          {renderStatusIcon(agreement.status)}

                          <Tooltip
                            id={`status-tooltip-${agreement.status}`}
                            place="bottom"
                            content={agreement.status}
                          />
                        </td>

                        <td className={`${GlobalStyle.tableData} text-left text-xs lg:text-sm`}>
                          {agreement.remark}
                        </td>
                        <td className={`${GlobalStyle.tableData} text-left text-xs lg:text-sm`}>
                          {agreement.updated_by}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className={`${GlobalStyle.tableData} `} style={{ textAlign: 'center' }}>
                        {searchQuery ? "No matching results found" : "No agreement history found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}


          {/* Agreement History Button */}
          {/* Agreement History Button - shown only in Edit Mode */}
          {/* {isEditing && (
            <div className="flex justify-start mt-6">
              <button
                className={GlobalStyle.buttonPrimary}
                onClick={() => setShowPopup(true)}
              >
                Agreement History
              </button>
            </div>
          )} */}

          {/* Back Button - Updated to match UserInfo style */}
          <div style={{ marginTop: '12px' }}>
            <button className={GlobalStyle.buttonPrimary} onClick={goBack}>
              <FaArrowLeft />
            </button>
          </div>
        </div>
      </div>

      {/* Agreement History Popup */}
      {showPopup && (
        <div className={GlobalStyle.popupBoxContainer}>
          <div className={GlobalStyle.popupBoxBody}>
            <div className={GlobalStyle.popupBox}>
              <h2 className={GlobalStyle.popupBoxTitle}>Agreement History</h2>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                title="Close"
              >
                ×
              </button>
            </div>

            <div className="mb-4 flex justify-start">
              {/* <div className={GlobalStyle.searchBarContainer}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={GlobalStyle.inputSearch}
            
                />
                <FaSearch className={GlobalStyle.searchBarIcon} />
              </div> */}
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-auto max-h-[70vh]">
              <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
                <table className={GlobalStyle.table}>
                  <thead className={GlobalStyle.thead}>
                    <tr>
                      <th className={`${GlobalStyle.tableHeader} text-left`}>
                        Start Date
                      </th>
                      <th className={`${GlobalStyle.tableHeader} text-left`}>
                        End Date
                      </th>
                      <th className={`${GlobalStyle.tableHeader} text-left`}>
                        Remark
                      </th>
                      <th className={`${GlobalStyle.tableHeader} text-left`}>
                        Updated By
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAgreementHistory.length > 0 ? (
                      filteredAgreementHistory.map((agreement, index) => (
                        <tr
                          key={index}
                          className={`${index % 2 === 0
                            ? GlobalStyle.tableRowEven
                            : GlobalStyle.tableRowOdd
                            } hover:bg-gray-50 transition-colors border-b`}
                        >
                          <td className={`${GlobalStyle.tableData} text-left text-xs lg:text-sm`}>
                            {formatDateForDisplay(agreement.start_date)}
                          </td>
                          <td className={`${GlobalStyle.tableData} text-left text-xs lg:text-sm`}>
                            {formatDateForDisplay(agreement.end_date)}
                          </td>
                          <td className={`${GlobalStyle.tableData} text-left text-xs lg:text-sm`}>
                            {agreement.remark}
                          </td>
                          <td className={`${GlobalStyle.tableData} text-left text-xs lg:text-sm`}>
                            {agreement.updated_by}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-8 text-gray-500">
                          {searchQuery ? "No matching results found" : "No agreement history found"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrcAgreement;








