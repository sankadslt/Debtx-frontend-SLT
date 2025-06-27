// /*Purpose:
// Created Date: 2025-06-20
// Created By: U.H.Nandali Linara (nadalilinara5@gmail.com)
// Last Modified Date: 2025-06-26
// Modified By: Buthmi Mithara Abeysena (buthmimithara1234@gmail.com)
// Version: React v18
// ui number : 10.2
// Dependencies: Tailwind CSS
// Related Files:
// Notes: This template uses Tailwind CSS */

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import edit_info from "../../assets/images/edit-info.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import {
  fetchRTOMDetailsById,
  updateRTOMDetails,
  terminateRTOM,
} from "../../services/RTOM/Rtom_services";
import { getLoggedUserId } from "../../services/auth/authService";

const RtomInfoNew = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { rtomId } = location.state || {};

  // Component state
  const [mode, setMode] = useState("view");
  const [showPopup, setShowPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isEndButtonVisible, setIsEndButtonVisible] = useState(true);
  const [endDate, setEndDate] = useState(null);
  const [remark, setRemark] = useState("");
  const [logHistory, setLogHistory] = useState([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState("");

  // Store original data for comparison
  const [originalData, setOriginalData] = useState({});

  // RTOM data from API
  const [rtomData, setRtomData] = useState({
    rtom_id: "",
    billing_center_code: "",
    rtom_name: "",
    created_on: "",
    area_code: "",
    rtom_email: "",
    rtom_mobile_no: "",
    rtom_telephone_no: "",
    rtom_status: "",
    rtom_remarks: [],
    updated_rtom: [],
  });

  // Form data for edit mode
  const [formData, setFormData] = useState({
    billingCenterCode: "",
    name: "",
    areaCode: "",
    email: "",
    mobile: "",
    telephone: "",
    status: "",
  });

  // Get current logged user
  const getCurrentUser = async () => {
    try {
      const userId = await getLoggedUserId();
      setCurrentUser(userId || "Unknown User");
      return userId || "Unknown User";
    } catch (error) {
      console.error("Error getting logged user:", error);
      setCurrentUser("Unknown User");
      return "Unknown User";
    }
  };

  // Fetch RTOM details on component mount
  useEffect(() => {
    if (rtomId) {
      getCurrentUser(); // Get current user
      fetchRTOMData();
    } else {
      Swal.fire("Error", "RTOM ID not provided", "error");
      navigate("/pages/Rtom/RtomList");
    }
  }, [rtomId]);

  // Update form data when rtomData changes
  useEffect(() => {
    const newFormData = {
      billingCenterCode: rtomData.billing_center_code || "",
      name: rtomData.rtom_name || "",
      areaCode: rtomData.area_code || "",
      email: rtomData.rtom_email || "",
      mobile: rtomData.rtom_mobile_no || "",
      telephone: rtomData.rtom_telephone_no || "",
      status: rtomData.rtom_status || "",
    };

    setFormData(newFormData);
    setOriginalData(newFormData);
    setIsEnabled(rtomData.rtom_status === "Active");
    setIsEndButtonVisible(rtomData.rtom_status !== "Terminate");

    // Process log history from backend data
    processLogHistory(rtomData);
  }, [rtomData]);

  const fetchRTOMData = async () => {
    setIsLoading(true);
    try {
      const response = await fetchRTOMDetailsById(parseInt(rtomId));
      setRtomData(response);
    } catch (error) {
      console.error("Error fetching RTOM data:", error);
      Swal.fire(
        "Error",
        error.message || "Failed to fetch RTOM details",
        "error"
      );
      navigate("/pages/Rtom/RtomList");
    } finally {
      setIsLoading(false);
    }
  };

  // Process log history from backend data
  const processLogHistory = (data) => {
    const history = [];

    // Add remarks history
    if (data.rtom_remarks && Array.isArray(data.rtom_remarks)) {
      data.rtom_remarks.forEach((remarkItem) => {
        history.push({
          editOn: remarkItem.remark_date || new Date().toISOString(),
          action: `${remarkItem.remark}`,
          editBy: remarkItem.remark_by || "Unknown",
        });
      });
    }

    // Add update history
    if (data.updated_rtom && Array.isArray(data.updated_rtom)) {
      data.updated_rtom.forEach((updateItem) => {
        history.push({
          editOn: updateItem.updated_dtm || new Date().toISOString(),
          action: "RTOM details updated",
          editBy: updateItem.updated_by || "Unknown",
        });
      });
    }

    // Sort by date (newest first)
    history.sort((a, b) => new Date(b.editOn) - new Date(a.editOn));

    setLogHistory(history);
  };

  // Add log entry function with proper user tracking
  const addLogEntry = async (action, editBy = null) => {
    const user = editBy || currentUser || (await getCurrentUser());
    const newLogEntry = {
      editOn: new Date().toISOString(),
      action: action,
      editBy: user,
    };

    setLogHistory((prev) => [newLogEntry, ...prev]);
  };

  // Generate change description
  const generateChangeDescription = (original, updated) => {
    const changes = [];

    if (original.billingCenterCode !== updated.billingCenterCode) {
      changes.push(
        `Billing Center Code: ${original.billingCenterCode} → ${updated.billingCenterCode}`
      );
    }
    if (original.name !== updated.name) {
      changes.push(`Name: ${original.name} → ${updated.name}`);
    }
    if (original.areaCode !== updated.areaCode) {
      changes.push(`Area Code: ${original.areaCode} → ${updated.areaCode}`);
    }
    if (original.email !== updated.email) {
      changes.push(`Email: ${original.email} → ${updated.email}`);
    }
    if (original.mobile !== updated.mobile) {
      changes.push(`Mobile: ${original.mobile} → ${updated.mobile}`);
    }
    if (original.telephone !== updated.telephone) {
      changes.push(`Telephone: ${original.telephone} → ${updated.telephone}`);
    }
    if (original.status !== updated.status) {
      changes.push(`Status: ${original.status} → ${updated.status}`);
    }

    return changes.length > 0
      ? `Updated: ${changes.join(", ")}`
      : "RTOM details updated";
  };

  // Check if RTOM is terminated
  const isRtomTerminated = () => {
    return rtomData.rtom_status === "Terminate";
  };

  // Navigation
  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/pages/Rtom/RtomList");
    }
  };

  const switchToEditMode = () => {
    // Prevent editing if RTOM is terminated
    if (isRtomTerminated()) {
      Swal.fire({
        title: "Cannot Edit",
        text: "This RTOM has been terminated and cannot be edited.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    setMode("edit");
  };

  const switchToViewMode = () => setMode("view");

  const switchToEndMode = () => {
    // Prevent ending if already terminated
    if (isRtomTerminated()) {
      Swal.fire({
        title: "Already Terminated",
        text: "This RTOM has already been terminated.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return;
    }
    setMode("end");
    setIsEndButtonVisible(false);
  };

  // Date validation
  const handleEndDateChange = (date) => {
    setEndDate(date);
    setError("");
  };

  // Form handlers
  const handleStatusChange = (enabled) => {
    setIsEnabled(enabled);
    setFormData((prev) => ({
      ...prev,
      status: enabled ? "Active" : "Inactive",
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEnd = async () => {
    if (!endDate) {
      setError("Please select an end date");
      return;
    }
    if (!remark) {
      setError("Please enter remarks");
      return;
    }

    setIsLoading(true);
    try {
      const user = await getCurrentUser(); // Get current user for termination

      const terminateData = {
        rtom_id: parseInt(rtomData.rtom_id),
        rtom_end_date: endDate.toISOString(),
        rtom_end_by: user,
        rtom_remarks: [
          {
            remark: remark,
            remark_date: new Date().toISOString(),
            remark_by: user,
          },
        ],
      };

      const response = await terminateRTOM(terminateData);

      if (response.message === "RTOM terminated successfully") {
        // Add log entry for termination with current user
        await addLogEntry(
          `RTOM terminated. End Date: ${formatDate(
            endDate
          )}. Remark: ${remark}`,
          user
        );

        Swal.fire("Success", "RTOM terminated successfully!", "success").then(
          () => {
            // After user clicks OK, refresh data and update UI
            fetchRTOMData();
            switchToViewMode();
            setIsEndButtonVisible(false);
            setRemark("");
            setEndDate(null);
          }
        );
      } else {
        throw new Error(response.message || "Failed to terminate RTOM");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Double check if RTOM is terminated before submitting
    if (isRtomTerminated()) {
      Swal.fire({
        title: "Cannot Update",
        text: "This RTOM has been terminated and cannot be updated.",
        icon: "error",
        confirmButtonText: "OK",
      });
      switchToViewMode();
      return;
    }

    setIsLoading(true);

    try {
      const user = await getCurrentUser(); // Get current user for update

      const updateData = {
        rtom_id: parseInt(rtomData.rtom_id),
        billing_center_code: formData.billingCenterCode,
        rtom_name: formData.name,
        area_code: formData.areaCode,
        rtom_email: formData.email,
        rtom_mobile_no: formData.mobile,
        rtom_telephone_no: formData.telephone,
        rtom_status: formData.status,
        remark: remark,
        updated_by: user,
      };

      const response = await updateRTOMDetails(updateData);

      if (response.status === "success") {
        // Generate change description and add log entry with current user
        const changeDescription = generateChangeDescription(
          originalData,
          formData
        );
        let logAction = changeDescription;

        if (remark) {
          logAction += `. Remark: ${remark}`;
        }

        await addLogEntry(logAction, user);

        Swal.fire("Success", "RTOM updated successfully!", "success");
        await fetchRTOMData();
        switchToViewMode();
        setRemark("");
      } else {
        throw new Error(response.message || "Failed to update RTOM");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Log history pagination
  const rowsPerPage = 7;
  const filteredLogHistory = logHistory.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const pages = Math.ceil(filteredLogHistory.length / rowsPerPage);
  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedLogHistory = filteredLogHistory.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < pages - 1) setCurrentPage(currentPage + 1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";

      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${month}/${day}/${year} ${hours}:${minutes}`;
    } catch (e) {
      console.error("Error formatting date:", e);
      return "N/A";
    }
  };

  // Loading state
  if (isLoading && !rtomData.rtom_id) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render View Mode
  const renderViewMode = () => (
    <div className="flex justify-center">
      <div className={`${GlobalStyle.cardContainer} p-4`}>
        <div className="flex mb-4 justify-end">
          {/* Show edit button but make it disabled/grayed if RTOM is terminated */}
          <button
            onClick={switchToEditMode}
            disabled={isRtomTerminated()}
            style={{
              opacity: isRtomTerminated() ? 0.5 : 1,
              cursor: isRtomTerminated() ? "not-allowed" : "pointer",
            }}
            title={
              isRtomTerminated() ? "Cannot edit - RTOM is terminated" : "Edit"
            }
          >
            <img
              src={edit_info}
              className="w-6 h-6"
              style={{
                filter: isRtomTerminated() ? "grayscale(100%)" : "none",
              }}
            />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="mb-8 w-full">
            <tbody>
              <tr>
                <td>
                  <label
                    className={`${GlobalStyle.headingMedium} pl-16 mb-2 block`}
                  >
                    Added Date
                  </label>
                </td>
                <td> : </td>
                <td>
                  <label>
                    {rtomData.created_on
                      ? formatDate(rtomData.created_on)
                      : "N/A"}
                  </label>
                </td>
              </tr>
              <tr>
                <td>
                  <label
                    className={`${GlobalStyle.headingMedium} pl-16 mb-2 block`}
                  >
                    Billing Center Code
                  </label>
                </td>
                <td> : </td>
                <td>
                  <label>{rtomData.billing_center_code}</label>
                </td>
              </tr>
              <tr>
                <td>
                  <label
                    className={`${GlobalStyle.headingMedium} pl-16 mb-2 block`}
                  >
                    RTOM Name
                  </label>
                </td>
                <td> : </td>
                <td>
                  <label>{rtomData.rtom_name}</label>
                </td>
              </tr>
              <tr>
                <td></td>
              </tr>
              <tr>
                <td>
                  <label
                    className={`${GlobalStyle.headingMedium} pl-16 mb-2 block`}
                  >
                    Area Code
                  </label>
                </td>
                <td> : </td>
                <td>
                  <label>{rtomData.area_code}</label>
                </td>
              </tr>
              <tr>
                <td>
                  <label className={`${GlobalStyle.headingMedium} pl-16`}>
                    Email
                  </label>
                </td>
                <td> : </td>
                <td>
                  <label>{rtomData.rtom_email || "N/A"}</label>
                </td>
              </tr>
              <tr>
                <td></td>
              </tr>
              <tr>
                <td></td>
              </tr>

              <tr>
                <td colSpan="3" className="py-2"></td>
              </tr>

              <tr>
                <td colSpan="3">
                  <label
                    className={`${GlobalStyle.headingMedium} border-b-2 border-black font-bold inline-block ml-10`}
                  >
                    Contact Details
                  </label>
                </td>
              </tr>

              <tr>
                <td colSpan="3" className="py-2"></td>
              </tr>

              <tr>
                <td>
                  <label
                    className={`${GlobalStyle.headingMedium} pl-16 mb-2 block`}
                  >
                    Mobile
                  </label>
                </td>
                <td> : </td>
                <td>
                  <label>{rtomData.rtom_mobile_no || "N/A"}</label>
                </td>
              </tr>
              <tr>
                <td>
                  <label className={`${GlobalStyle.headingMedium} pl-16`}>
                    Telephone
                  </label>
                </td>
                <td> : </td>
                <td>
                  <label>{rtomData.rtom_telephone_no || "N/A"}</label>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render Edit Mode
  const renderEditMode = () => (
    <div className="flex justify-center px-4 sm:px-8">
      <div
        className={`${GlobalStyle.cardContainer} mt-4 w-full max-w-2xl relative`}
      >
        <div className="absolute top-4 right-4 ml-8">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isEnabled}
              onChange={(e) => handleStatusChange(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
          <div className="flex flex-col sm:flex-row sm:gap-8 items-start sm:items-center">
            <h1 className="w-48">Billing Center Code</h1>
            <span className="hidden sm:block">:</span>
            <input
              name="billingCenterCode"
              type="text"
              className={`${GlobalStyle.inputText} w-full sm:w-auto`}
              value={formData.billingCenterCode}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-8 items-start sm:items-center">
            <h1 className="w-48">Name</h1>
            <span className="hidden sm:block">:</span>
            <input
              name="name"
              type="text"
              className={`${GlobalStyle.inputText} w-full sm:w-auto`}
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-8 items-start sm:items-center">
            <h1 className="w-48">Area Code</h1>
            <span className="hidden sm:block">:</span>
            <input
              name="areaCode"
              type="text"
              className={`${GlobalStyle.inputText} w-full sm:w-auto`}
              value={formData.areaCode}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-8 items-start sm:items-center">
            <h1 className="w-48">Email</h1>
            <span className="hidden sm:block">:</span>
            <input
              name="email"
              type="email"
              className={`${GlobalStyle.inputText} w-full sm:w-auto`}
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <strong className="block pt-4 underline">Contact Details</strong>

          <div className="flex flex-col sm:flex-row sm:gap-8 items-start sm:items-center">
            <h1 className="w-48">Mobile</h1>
            <span className="hidden sm:block">:</span>
            <input
              name="mobile"
              type="tel"
              className={`${GlobalStyle.inputText} w-full sm:w-auto`}
              value={formData.mobile}
              onChange={handleInputChange}
              required
              pattern="[0-9]{10}"
              title="10 digit mobile number"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-8 items-start sm:items-center">
            <h1 className="w-48">Telephone</h1>
            <span className="hidden sm:block">:</span>
            <input
              name="telephone"
              type="tel"
              className={`${GlobalStyle.inputText} w-full sm:w-auto`}
              value={formData.telephone}
              onChange={handleInputChange}
              pattern="[0-9]{10}"
              title="10 digit telephone number"
            />
          </div>

          <div className="mb-6">
            <label className={GlobalStyle.remarkTopic}>Remark</label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className={`${GlobalStyle.remark} w-full`}
              rows="5"
              placeholder="Enter reason for changes..."
            ></textarea>
          </div>

          <div className="flex justify-end mt-4 gap-4 flex-col-reverse sm:flex-row ">
            <button
              type="button"
              className={`${GlobalStyle.buttonSecondary} px-8 py-2`}
              onClick={switchToViewMode}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${GlobalStyle.buttonPrimary} px-8 py-2`}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Render End Mode
  const renderEndMode = () => (
    <div className="flex justify-center px-4 sm:px-8 md:px-16">
      <div className={`${GlobalStyle.cardContainer} p-4 w-full max-w-2xl relative`}>
        <div className="flex mb-4 justify-end">
          <button onClick={switchToViewMode}>
            <img src={edit_info} title="Cancel" className="w-6 h-6" />
          </button>
        </div>

        <table className="mb-8 w-full text-sm sm:text-base">
          <tbody>
            <tr>
              <td>
                <label
                  className={`${GlobalStyle.headingMedium} pl-4 sm:pl-8 lg:pl-16 mb-2 block`}
                >
                  Added Date
                </label>
              </td>
              <td> : </td>
              <td>
                <label>
                  {rtomData.created_on
                    ? formatDate(rtomData.created_on)
                    : "N/A"}
                </label>
              </td>
            </tr>
            <tr>
              <td>
                <label
                  className={`${GlobalStyle.headingMedium} pl-4 sm:pl-8 lg:pl-16 mb-2 block`}
                >
                  Billing Center Code
                </label>
              </td>
              <td> : </td>
              <td>
                <label>{rtomData.billing_center_code}</label>
              </td>
            </tr>
            <tr>
              <td>
                <label
                  className={`${GlobalStyle.headingMedium} pl-4 sm:pl-8 lg:pl-16 mb-2 block`}
                >
                  RTOM Name
                </label>
              </td>
              <td> : </td>
              <td>
                <label>{rtomData.rtom_name}</label>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex flex-col items-center">
          <div className={`${GlobalStyle.datePickerContainer} sm:ml-0 lg:-ml-[160px]`}>
            <label className={GlobalStyle.dataPickerDate}>End Date</label>
            <span>:</span>
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/MM/yyyy"
              className={`${GlobalStyle.inputText} w-full max-w-xs`}
              minDate={new Date()}
              maxDate={new Date()}
              filterDate={(date) => {
                const today = new Date();
                return date.toDateString() === today.toDateString();
              }}
              showDisabledMonthNavigation
            />
          </div>

          <div className="w-full mt-4 flex-col lg:flex-row lg:items-start sm:pl-8 lg:pl-16">
            <label className={`${GlobalStyle.headingMedium} block mb-2 lg:mb-0 lg:w-1/4`}>
              Remark
            </label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className={`${GlobalStyle.remark} w-full max-w-lg px-2 py-1`}
              rows="5"
              placeholder="Enter reason for termination..."
              required
            ></textarea>
          </div>

          {error && <div className="text-red-500 mt-2 pl-16">{error}</div>}

          <div className="flex justify-end w-full mt-6">
            <button
              className={`${GlobalStyle.buttonPrimary} px-6 sm:px-8 py-2`}
              onClick={handleSaveEnd}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Common UI Elements
  const renderCommonUI = () => (
    <div className="flex flex-col">
      <div className="flex flex-col items-start md:flex-row md:justify-between md:items-center mb-4 gap-2 ">
        <button
          className={`${GlobalStyle.buttonPrimary}`}
          onClick={() => setShowPopup(true)}
        >
          Log History
        </button>
        {/* Show End button but make it disabled if RTOM is terminated */}
        {mode === "view" && (
          <button
            className={`${GlobalStyle.buttonPrimary}`}
            onClick={switchToEndMode}
            disabled={isRtomTerminated()}
            style={{
              zIndex: 1,
              opacity: isRtomTerminated() ? 0.5 : 1,
              cursor: isRtomTerminated() ? "not-allowed" : "pointer",
            }}
            title={
              isRtomTerminated()
                ? "Cannot end - RTOM is already terminated"
                : "End RTOM"
            }
          >
            End
          </button>
        )}
      </div>

      <div className="flex mt-2 md:mt-0">
        <button
          className={`${GlobalStyle.buttonPrimary} flex items-center space-x-2`}
          onClick={goBack}
        >
          <FaArrowLeft />
        </button>
      </div>
    </div>
  );

  // Log History Popup
  const renderLogHistoryPopup = () =>
    showPopup && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-md shadow-lg w-3/4 max-h-[80vh] overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Log History</h2>
            <button
              className="text-red-500 text-lg font-bold"
              onClick={() => setShowPopup(false)}
            >
              ×
            </button>
          </div>
          <div>
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
                    <th className={GlobalStyle.tableHeader}>Edited On</th>
                    <th className={GlobalStyle.tableHeader}>Action</th>
                    <th className={GlobalStyle.tableHeader}>Edited By</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLogHistory.length > 0 ? (
                    paginatedLogHistory.map((row, index) => (
                      <tr
                        key={index}
                        className={`${
                          index % 2 === 0
                            ? "bg-white bg-opacity-75"
                            : "bg-gray-50 bg-opacity-50"
                        } border-b`}
                      >
                        <td className={GlobalStyle.tableData}>
                          {formatDate(row.editOn)}
                        </td>
                        <td
                          className={GlobalStyle.tableData}
                          title={row.action}
                        >
                          {row.action.length > 50
                            ? `${row.action.substring(0, 50)}...`
                            : row.action}
                        </td>
                        <td className={GlobalStyle.tableData}>{row.editBy}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-4">
                        No log history found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredLogHistory.length > rowsPerPage && (
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
          </div>
        </div>
      </div>
    );

  return (
    <div className={GlobalStyle.fontPoppins}>
      <div className={`${GlobalStyle.headingLarge} mb-8`}>
        <span>
          {rtomData.billing_center_code} - {rtomData.rtom_name} RTOM Area
        </span>
        {mode === "edit" && <span></span>}
        {mode === "end" && <span></span>}
        {isRtomTerminated() && <span className="text-red-600"></span>}
      </div>

      {mode === "edit"
        ? renderEditMode()
        : mode === "end"
        ? renderEndMode()
        : renderViewMode()}

      {renderCommonUI()}
      {renderLogHistoryPopup()}
    </div>
  );
};

export default RtomInfoNew;
