/*
Purpose: This template is used for the 10.3 - DRC's info Edit
Created Date: 2025-05-20
Created By: Yevin (ytheenura5@gmail.com)
ui number : 10.4
Dependencies: tailwind css
Related Files: router(Routers.jsx)
Notes: The following page contains the codes */

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Remove useParams, add useLocation
import Swal from "sweetalert2";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import {
  getDebtCompanyByDRCID,
  updateDRCInfo,
  getSLTCoordinators,
  getActiveServiceDetails,
  getActiveRTOMDetails,
} from "../../services/drc/Drc";
import addIcon from "../../assets/images/add.svg";
import { getLoggedUserId } from "../../services/auth/authService";

const DRCInfoEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const drcId = location.state?.drcId;

  // Add validation in case drcId is not provided in the state
  useEffect(() => {
    if (!drcId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No DRC ID provided",
      });
      navigate(-1);
    }
  }, [drcId, navigate]);

  // Existing state variables
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCoordinator, setEditingCoordinator] = useState(false);
  const [showLogHistory, setShowLogHistory] = useState(false);
  const [userData, setUserData] = useState(null);

  // Add new state variables for service dropdown
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [serviceTypes, setServiceTypes] = useState([]);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [dropdownClicked, setDropdownClicked] = useState(false);

  // Add new state variables for RTOM dropdown
  const [selectedRTOM, setSelectedRTOM] = useState("");
  const [rtomAreas, setRtomAreas] = useState([]);
  const [rtomLoading, setRtomLoading] = useState(false);
  const [rtomDropdownClicked, setRtomDropdownClicked] = useState(false);

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

  // Fields for editing
  const [contactNo, setContactNo] = useState("");
  const [email, setEmail] = useState("");

  // Coordinator fields for editing
  const [coordinatorFields, setCoordinatorFields] = useState({
    service_no: "",
    slt_coordinator_name: "",
    slt_coordinator_email: "",
  });

  // Add a new state for service options
  const [serviceOptions, setServiceOptions] = useState([]);
  const [editingServiceIds, setEditingServiceIds] = useState([]);
  const [editingRtomIds, setEditingRtomIds] = useState([]);

  // Add a state variable for remarks
  const [remark, setRemark] = useState("");
  const [remarkHistory, setRemarkHistory] = useState([]);

  // Function to fetch active service types
  const fetchActiveServices = async () => {
    try {
      setServiceLoading(true);
      const response = await getActiveServiceDetails();
      // console.log("API Response for services:", response);

      if (response && response.data) {
        const filtered = response.data.filter(
          (service) => service.service_status === "Active"
        );

        // Map the service types and mark those that are already selected
        const formatted = filtered.map((service) => {
          const isAlreadySelected = companyData.services.some(
            (s) => s.service_type === service.service_type
          );

          return {
            id: service.service_id,
            name: service.service_type,
            selected: isAlreadySelected,
          };
        });

        setServiceTypes(formatted);
      }
    } catch (error) {
      console.error("Error loading service types:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load active service types.",
      });
    } finally {
      setServiceLoading(false);
    }
  };

  // Function to fetch RTOM data
  const fetchRTOMData = async () => {
    try {
      setRtomLoading(true);
      const response = await getActiveRTOMDetails();
      // console.log("RTOM API Response:", response);

      if (response && response.data && Array.isArray(response.data)) {
        // Map the database fields correctly
        const formattedData = response.data.map((rtom) => {
          // Check if this RTOM is already added to this DRC
          const isAlreadySelected = companyData.rtom.some(
            (r) => r.rtom_id === rtom.rtom_id
          );

          return {
            id: rtom.rtom_id || rtom._id,
            code: rtom.rtom_id?.toString() || "",
            name: rtom.rtom_name || "",
            selected: isAlreadySelected,
          };
        });

        // console.log("Formatted RTOM data:", formattedData);
        setRtomAreas(formattedData);
      }
    } catch (error) {
      console.error("Error fetching RTOM data:", error.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load RTOM areas.",
      });
    } finally {
      setRtomLoading(false);
    }
  };

  // get system user
  const loadUser = async () => {
    const user = await getLoggedUserId();
    setUserData(user);
    // console.log("User data:", user);
  };

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        const drcIdToUse = drcId;
        const data = await getDebtCompanyByDRCID(drcIdToUse);

        // Fetch SLT coordinator details for dropdown
        const coordinatorsResponse = await getSLTCoordinators();
        // console.log("Coordinator Response:", coordinatorsResponse);

        // Initialize serviceOptions array
        let options = [];

        if (coordinatorsResponse && coordinatorsResponse.data) {
          // Transform coordinator data with correct field mappings
          options = coordinatorsResponse.data.map((coordinator) => ({
            service_no: coordinator.user_id || "",
            slt_coordinator_name: coordinator.username || "",
            slt_coordinator_email: coordinator.email || "",
            user_id: coordinator.user_id || "",
          }));
          // console.log("Mapped coordinator options:", options);
        }

        // IMPORTANT: Set the serviceOptions directly from the getSLTCoordinators data
        // Don't mix with other data sources
        setServiceOptions(options);

        if (data) {
          setCompanyData(data);
          setContactNo(data.drc_contact_no || "");
          setEmail(data.drc_email || "");

          // Initialize coordinator fields from current coordinator if exists
          if (data.slt_coordinator && data.slt_coordinator.length > 0) {
            const currentCoord =
              data.slt_coordinator[data.slt_coordinator.length - 1];
            setCoordinatorFields({
              service_no: currentCoord.service_no || "",
              slt_coordinator_name: currentCoord.slt_coordinator_name || "",
              slt_coordinator_email: currentCoord.slt_coordinator_email || "",
            });
          }

          // Fix for remark - ensure it's treated as a string
          if (typeof data.remark === "string") {
            setRemark(data.remark);
          } else if (Array.isArray(data.remark)) {
            // If it's an array, convert to string or use first item if it's a string
            const remarkText =
              data.remark.length > 0 && typeof data.remark[0] === "string"
                ? data.remark[0]
                : "";
            setRemark(remarkText);
          } else {
            // Default to empty string
            setRemark("");
          }

          // Extract service numbers for dropdown
          if (data && data.services) {
            const options = data.services.map((service) => ({
              service_no: service.service_no,
              coordinator_name: service.coordinator_name || "",
              coordinator_email: service.coordinator_email || "",
            }));
            setServiceOptions(options);
          }

          // Set remark history if available
          if (Array.isArray(data.remark)) {
            setRemarkHistory(data.remark);
          } else if (typeof data.remark === "object" && data.remark !== null) {
            // If it's a single object, convert to array
            setRemarkHistory([data.remark]);
          } else {
            setRemarkHistory([]);
          }

          // Load services and RTOM options with current selections marked
          fetchActiveServices();
          fetchRTOMData();
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
    loadUser();
    fetchCompanyData();
  }, [drcId]);

  const handleDropdownClick = () => {
    if (!dropdownClicked) {
      fetchActiveServices();
      setDropdownClicked(true);
    }
  };

  const handleRtomDropdownClick = () => {
    if (!rtomDropdownClicked) {
      fetchRTOMData();
      setRtomDropdownClicked(true);
    }
  };

  const handleAddServiceType = () => {
    if (
      selectedServiceType &&
      !serviceTypes.some((t) => t.name === selectedServiceType && t.selected)
    ) {
      // Update the serviceTypes state to mark this service as selected
      const updatedTypes = serviceTypes.map((item) =>
        item.name === selectedServiceType ? { ...item, selected: true } : item
      );
      setServiceTypes(updatedTypes);

      // Add the new service to the companyData.services array
      const newService = {
        service_type: selectedServiceType,
        service_status: "Active",
        status_update_dtm: new Date().toISOString(),
      };

      setCompanyData({
        ...companyData,
        services: [...companyData.services, newService],
      });

      setSelectedServiceType("");
    }
  };

  const handleAddRTOM = () => {
    if (
      selectedRTOM &&
      !rtomAreas.some((a) => a.code === selectedRTOM && a.selected)
    ) {
      // Update the rtomAreas state to mark this RTOM as selected
      const updatedAreas = rtomAreas.map((item) =>
        item.code === selectedRTOM ? { ...item, selected: true } : item
      );
      setRtomAreas(updatedAreas);

      // Find the selected RTOM area from the list
      const selectedRtomItem = rtomAreas.find(
        (area) => area.code === selectedRTOM
      );

      if (selectedRtomItem) {
        // Add the new RTOM to the companyData.rtom array
        const newRtom = {
          rtom_id: selectedRtomItem.id,
          rtom_name: selectedRtomItem.name,
          rtom_status: "Active",
          status_update_dtm: new Date().toISOString(),
        };

        setCompanyData({
          ...companyData,
          rtom: [...companyData.rtom, newRtom],
        });
      }

      setSelectedRTOM("");
    }
  };

  const handleRemoveServiceType = (type) => {
    // Update the serviceTypes state to mark this service as not selected
    const updatedTypes = serviceTypes.map((item) =>
      item.name === type ? { ...item, selected: false } : item
    );
    setServiceTypes(updatedTypes);

    // Remove the service from companyData.services array
    const updatedServices = companyData.services.filter(
      (service) => service.service_type !== type
    );

    setCompanyData({
      ...companyData,
      services: updatedServices,
    });
  };

  const handleRemoveRTOM = (code) => {
    // Update the rtomAreas state to mark this RTOM as not selected
    const updatedAreas = rtomAreas.map((item) =>
      item.code === code ? { ...item, selected: false } : item
    );
    setRtomAreas(updatedAreas);

    // Find the ID of the RTOM to remove
    const rtomToRemove = rtomAreas.find((area) => area.code === code);

    if (rtomToRemove) {
      // Remove the RTOM from companyData.rtom array
      const updatedRtoms = companyData.rtom.filter(
        (rtom) => rtom.rtom_id !== rtomToRemove.id
      );

      setCompanyData({
        ...companyData,
        rtom: updatedRtoms,
      });
    }
  };

  // Add these validation functions after your other utility functions
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate phone number to allow formats: 011, +947, +11, 07
  const isValidPhoneNumber = (phone) => {
    // Remove any spaces from the phone number
    const cleanedPhone = phone.replace(/\s/g, "");

    // Match patterns: 011xxxxxxxx, +947xxxxxxxx, +11xxxxxxxx, or 07xxxxxxxx
    const phoneRegex = /^(011\d{7}|\+947\d{8}|\+9411\d{7}|07\d{8})$/;
    return phoneRegex.test(cleanedPhone);
  };

  // Modify the handleSave function to include drc_status
  const handleSave = async () => {
    try {
      let remarkBy = userData
        ? userData.id || userData.userId || userData
        : "system";

      // Validate contact number
      if (contactNo && !isValidPhoneNumber(contactNo)) {
        Swal.fire({
          icon: "error",
          title: "Invalid Contact Number",
          text: "Please enter a valid contact number.",
        });
        return;
      }

      // Validate email
      if (email && !isValidEmail(email)) {
        Swal.fire({
          icon: "error",
          title: "Invalid Email",
          text: "Please enter a valid email address.",
        });
        return;
      }

      // Validate remark field
      if (!remark.trim()) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please add a remark before saving",
        });
        return;
      }

      // Validate coordinator fields if in editing mode
      if (editingCoordinator) {
        if (
          !coordinatorFields.service_no ||
          !coordinatorFields.slt_coordinator_name ||
          !coordinatorFields.slt_coordinator_email
        ) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "All SLT Coordinator fields are required",
          });
          return;
        }
      }

      // Get updated services and RTOM data
      const updatedServices = companyData.services.map((service) => ({
        ...service,
        status_update_dtm: new Date().toISOString(),
      }));

      const updatedRtom = companyData.rtom.map((rtom) => ({
        ...rtom,
        status_update_dtm: new Date().toISOString(),
      }));

      // Prepare the coordinator data
      let coordinatorData = currentCoordinator;
      if (editingCoordinator) {
        coordinatorData = coordinatorFields;
      }

      // Current date for remark timestamp
      const currentDate = new Date().toISOString();

      // Call the API with all required parameters
      const response = await updateDRCInfo(
        companyData.drc_id,
        coordinatorData,
        updatedServices,
        updatedRtom,
        remark,
        remarkBy, // You may want to replace this with actual user info
        currentDate,
        contactNo, // Add contact number
        email, // Add email
        companyData.drc_status // Add DRC status to the API call
      );

      // Show enhanced success message with image and better formatting
      Swal.fire({
        icon: "success",
        title: "Success!",
        html: `
          <div class="flex flex-col items-center">
            <p class="text-lg font-bold">DRC information updated successfully</p>
            <p class="text-sm text-gray-600 mt-2">Changes have been saved to the database</p>
          </div>
        `,
        showConfirmButton: true,
        confirmButtonText: "Continue",
        confirmButtonColor: "#3B82F6",
      }).then(() => {
        // Navigate back to the info page with the drcId in state
        navigate(`/pages/DRC/DRCInfo`, {
          state: { drcId: drcId },
        });
      });

      // Reset coordinator editing state
      setEditingCoordinator(false);
    } catch (err) {
      console.error("Failed to update DRC data:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update DRC information",
      });
    }
    navigate(-1); // Navigate back to the previous page after saving
  };

  const handleCancel = () => {
    navigate(`/pages/DRC/DRCInfo`, {
      state: { drcId: drcId },
    });
  };

  const handleCoordinatorChange = (e) => {
    const { name, value } = e.target;
    setCoordinatorFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add a handler for service selection
  const handleServiceSelection = (e) => {
    const selectedUserId = e.target.value;
    // console.log("Selected User ID:", selectedUserId);
    // console.log("Available options:", serviceOptions);

    const selectedCoordinator = serviceOptions.find(
      (option) => option.user_id === selectedUserId
    );

    // console.log("Selected coordinator:", selectedCoordinator);

    if (selectedService) {
      setCoordinatorFields({
        service_no: selectedServiceNo,
        slt_coordinator_name: selectedService.coordinator_name,
        slt_coordinator_email: selectedService.coordinator_email,
      });
    } else {
      setCoordinatorFields({
        service_no: selectedServiceNo,
        slt_coordinator_name: "",
        slt_coordinator_email: "",
      });
    }
  };

  const handleSaveCoordinator = () => {
    // Validate fields
    if (
      !coordinatorFields.service_no ||
      !coordinatorFields.slt_coordinator_name ||
      !coordinatorFields.slt_coordinator_email
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "All coordinator fields are required",
      });
      return;
    }

    // Here you would implement the API call to update the coordinator
    // For now, we'll just update the state
    const updatedCoordinators = [
      ...companyData.slt_coordinator,
      coordinatorFields,
    ];

    setCompanyData({
      ...companyData,
      slt_coordinator: updatedCoordinators,
    });

    setEditingCoordinator(false);

    Swal.fire({
      icon: "success",
      title: "Success",
      text: "SLT Coordinator updated successfully",
    });
  };

  // // Add these new state variables after your existing state declarations
  // const [editingServiceIds, setEditingServiceIds] = useState([]);
  // const [editingRtomIds, setEditingRtomIds] = useState([]);

  // Add functions to handle status changes
  const handleServiceStatusToggle = (index) => {
    const updatedServices = [...companyData.services];
    updatedServices[index].service_status =
      updatedServices[index].service_status === "Active"
        ? "Inactive"
        : "Active";

    setCompanyData({
      ...companyData,
      services: updatedServices,
    });
  };

  const handleRtomStatusToggle = (index) => {
    const updatedRtom = [...companyData.rtom];
    updatedRtom[index].rtom_status =
      updatedRtom[index].rtom_status === "Active" ? "Inactive" : "Active";

    setCompanyData({
      ...companyData,
      rtom: updatedRtom,
    });
  };

  const toggleLogHistory = () => {
    setShowLogHistory(!showLogHistory);
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
      className={`${GlobalStyle.fontPoppins} px-4 sm:px-6 md:px-8 max-w-6xl mx-auto`}
    >
      <h2
        className={`${GlobalStyle.headingLarge} text-center sm:text-left mb-4 sm:mb-6`}
      >
        {companyData.drc_id} - {companyData.drc_name}
      </h2>

      <div className="w-full justify-center">
        <div
          className={`${GlobalStyle.cardContainer} relative w-full max-w-4xl`}
        >
          {/* DRC Status Toggle Button - Top Right Corner */}
          <div className="absolute top-4 right-4 flex items-center">
           
            <button
              onClick={() => {
                const newStatus =
                  companyData.drc_status === "Active" ? "Inactive" : "Active";
                setCompanyData({
                  ...companyData,
                  drc_status: newStatus,
                });

                // Show a toast notification
                Swal.fire({
                  icon: "info",
                  title: "Status Updated",
                  text: `DRC status set to ${newStatus}`,
                  toast: true,
                  position: "top-end",
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: true,
                });
              }}
              className="relative inline-flex items-center cursor-pointer"
              aria-label={
                companyData.drc_status === "Active" ? "Active" : "Inactive"
              }
            >
              <div
                className={`w-11 h-6 rounded-full transition-colors ${
                  companyData.drc_status === "Active"
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow transform transition-transform ${
                  companyData.drc_status === "Active" ? "translate-x-5" : ""
                }`}
              ></div>
              <span className="ml-3 text-sm font-medium">
                {companyData.drc_status === "Active" ? "Active" : "Inactive"}
              </span>
            </button>
          </div>

          {/* Company Details Section */}
          <h2
            className={`${GlobalStyle.headingMedium} mb-4 sm:mb-6 mt-6 sm:mt-8 underline text-left font-semibold`}
          >
            Company Details
          </h2>

          <div className={` overflow-x-auto`}>
            <table className={`${GlobalStyle.table} min-w-full text-left`}>
              <tbody>
                <tr>
                  <td
                    className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-1/3 sm:w-1/4`}
                  >
                    Added Date
                  </td>
                  <td className="w-4 text-left">:</td>
                  <td
                    className={`${GlobalStyle.tableData} text-gray-500 break-words text-left`}
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
                    Contact Number
                  </td>
                  <td className="w-4 text-left">:</td>
                  <td className={`${GlobalStyle.tableData} text-left`}>
                    <input
                      type="text"
                      value={contactNo}
                      onChange={(e) => setContactNo(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-full max-w-xs"
                    />
                  </td>
                </tr>
                <tr>
                  <td
                    className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-1/3 sm:w-1/4`}
                  >
                    Email
                  </td>
                  <td className="w-4 text-left">:</td>
                  <td className={`${GlobalStyle.tableData} text-left`}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-full max-w-xs"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* SLT Coordinator Section */}
          <div className="flex justify-between items-center">
            <h2
              className={`${GlobalStyle.headingMedium} mt-6 mb-4 sm:mt-8 sm:mb-6 underline text-left font-semibold`}
            >
              SLT Coordinator Details
            </h2>
            <button
              onClick={() => setEditingCoordinator(!editingCoordinator)}
              className={` ${GlobalStyle.buttonPrimary}px-3 py-1 `}
            >
              {editingCoordinator ? "Cancel Change" : "Change"}
            </button>
          </div>

          <div className={` overflow-x-auto`}>
            {currentCoordinator || editingCoordinator ? (
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
                      className={`${GlobalStyle.tableData} break-words text-left`}
                    >
                      {editingCoordinator ? (
                        <select
                          name="service_no"
                          value={coordinatorFields.service_no}
                          onChange={handleServiceSelection}
                          className="border border-gray-300 rounded px-2 py-1 w-full max-w-xs "
                        >
                          <option value="">Select a service</option>
                          {serviceOptions.map((option, idx) => (
                            <option key={idx} value={option.service_no}>
                              {option.service_no}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-gray-500">
                          {currentCoordinator.service_no || "Not specified"}
                        </span>
                      )}
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
                      className={`${GlobalStyle.tableData} break-words text-left`}
                    >
                      {editingCoordinator ? (
                        <input
                          type="text"
                          name="slt_coordinator_name"
                          value={coordinatorFields.slt_coordinator_name}
                          readOnly
                          className="border border-gray-200 bg-gray-100 rounded px-2 py-1 w-full max-w-xs cursor-not-allowed"
                        />
                      ) : (
                        <span className="text-gray-500">
                          {currentCoordinator.slt_coordinator_name ||
                            "Not specified"}
                        </span>
                      )}
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
                      className={`${GlobalStyle.tableData} break-words text-left`}
                    >
                      {editingCoordinator ? (
                        <input
                          type="email"
                          name="slt_coordinator_email"
                          value={coordinatorFields.slt_coordinator_email}
                          readOnly
                          className="border border-gray-200 bg-gray-100 rounded px-2 py-1 w-full max-w-xs cursor-not-allowed"
                        />
                      ) : (
                        <span className="text-gray-500">
                          {currentCoordinator.slt_coordinator_email ||
                            "Not specified"}
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No coordinator assigned
              </div>
            )}
          </div>

          {/* Services Section - With dropdown below the heading, aligned left */}
          <div>
            <h2
              className={`${GlobalStyle.headingMedium} mt-6 mb-2 sm:mt-8 sm:mb-4 underline text-left font-semibold`}
            >
              Services
            </h2>

            <div className="flex items-center mb-4 ">
              <select
                onClick={handleDropdownClick}
                value={selectedServiceType}
                onChange={(e) => setSelectedServiceType(e.target.value)}
                className={`${GlobalStyle.selectBox} mr-2`}
              >
                <option value="">Select Service Type</option>
                {serviceLoading ? (
                  <option disabled>Loading...</option>
                ) : (
                  serviceTypes
                    .filter((service) => !service.selected)
                    .map((service) => (
                      <option key={service.id} value={service.name}>
                        {service.name}
                      </option>
                    ))
                )}
              </select>
              <button
                type="button"
                onClick={handleAddServiceType}
                className={`${GlobalStyle.buttonCircle}`}
                disabled={!selectedServiceType}
              >
                <img
                  src={addIcon}
                  alt="Add"
                  style={{ width: 20, height: 20 }}
                />
              </button>
            </div>

            {serviceLoading && (
              <p className="text-gray-500 mt-1 mb-4">
                Loading service types...
              </p>
            )}

            <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
              <table className={`${GlobalStyle.table} min-w-full`}>
                <thead className={GlobalStyle.thead}>
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
                    >
                      Status
                    </th>
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
                        <td
                          className={`${GlobalStyle.tableData} whitespace-normal break-words text-left`}
                        >
                          {service.service_type}
                        </td>
                        <td
                          className={`${GlobalStyle.tableData} whitespace-nowrap text-left`}
                        >
                          {service.status_update_dtm
                            ? new Date(
                                service.status_update_dtm
                              ).toLocaleDateString()
                            : "Not specified"}
                        </td>
                        <td className={`${GlobalStyle.tableData} text-center`}>
                          <button
                            onClick={() => handleServiceStatusToggle(index)}
                            className="relative inline-flex items-center cursor-pointer"
                            aria-label={
                              service.service_status === "Active"
                                ? "Active"
                                : "Inactive"
                            }
                          >
                            <div
                              className={`w-11 h-6 rounded-full transition-colors ${
                                service.service_status === "Active"
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            ></div>
                            <div
                              className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow transform transition-transform ${
                                service.service_status === "Active"
                                  ? "translate-x-5"
                                  : ""
                              }`}
                            ></div>
                            <span className="ml-3 text-sm font-medium">
                              {service.service_status === "Active"
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  {(!companyData.services ||
                    companyData.services.length === 0) && (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center py-4 text-gray-500"
                      >
                        No services available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* RTOM Section - With dropdown below the heading, aligned left */}
          <div>
            <h2
              className={`${GlobalStyle.headingMedium} mt-6 mb-2 sm:mt-8 sm:mb-4 underline text-left font-semibold`}
            >
              RTOM Areas
            </h2>

            <div className="flex items-center mb-4">
              <select
                onClick={handleRtomDropdownClick}
                value={selectedRTOM}
                onChange={(e) => setSelectedRTOM(e.target.value)}
                className={`${GlobalStyle.selectBox} mr-2`}
              >
                <option value="">Select RTOM Area</option>
                {rtomLoading ? (
                  <option disabled>Loading...</option>
                ) : (
                  rtomAreas
                    .filter((area) => !area.selected)
                    .map((area) => (
                      <option key={area.id} value={area.code}>
                        {area.name}
                      </option>
                    ))
                )}
              </select>
              <button
                type="button"
                onClick={handleAddRTOM}
                className={`${GlobalStyle.buttonCircle}`}
                disabled={!selectedRTOM}
              >
                <img
                  src={addIcon}
                  alt="Add"
                  style={{ width: 20, height: 20 }}
                />
              </button>
            </div>

            {rtomLoading && (
              <p className="text-gray-500 mt-1 mb-4">Loading RTOM areas...</p>
            )}

            <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
              <table className={`${GlobalStyle.table} min-w-full`}>
                <thead className={GlobalStyle.thead}>
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
                    >
                      Status
                    </th>
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
                        <td
                          className={`${GlobalStyle.tableData} whitespace-normal break-words text-left`}
                        >
                          {rtom.rtom_name || rtom.rtom_id}
                        </td>
                        <td
                          className={`${GlobalStyle.tableData} whitespace-normal text-left`}
                        >
                          {rtom.status_update_dtm
                            ? new Date(
                                rtom.status_update_dtm
                              ).toLocaleDateString()
                            : "Not specified"}
                        </td>
                        <td className={`${GlobalStyle.tableData} text-center`}>
                          <button
                            onClick={() => handleRtomStatusToggle(index)}
                            className="relative inline-flex items-center cursor-pointer"
                            aria-label={
                              rtom.rtom_status === "Active"
                                ? "Active"
                                : "Inactive"
                            }
                          >
                            <div
                              className={`w-11 h-6 rounded-full transition-colors ${
                                rtom.rtom_status === "Active"
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            ></div>
                            <div
                              className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow transform transition-transform ${
                                rtom.rtom_status === "Active"
                                  ? "translate-x-5"
                                  : ""
                              }`}
                            ></div>
                            <span className="ml-3 text-sm font-medium">
                              {rtom.rtom_status === "Active"
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  {(!companyData.rtom || companyData.rtom.length === 0) && (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center py-4 text-gray-500"
                      >
                        No RTOM information available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Remark Section - Existing code */}
          <table className={`${GlobalStyle.table} min-w-full mt-4`}>
            <tbody>
              <tr>
                <td
                  className={`${GlobalStyle.tableData} underline whitespace-nowrap text-left w-1/3 sm:w-1/4 font-semibold`}
                >
                  Remark
                </td>
              </tr>
              <tr>
                <td
                  className={`${GlobalStyle.tableData} break-words text-left`}
                >
                  <textarea
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 w-full min-h-[100px] resize-y"
                    placeholder="Enter remarks here..."
                  ></textarea>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={handleSave}
              className={`${GlobalStyle.buttonPrimary} px-6 py-2 `}
            >
              Save
            </button>
          </div>
        </div>

        {/* Log history button - Existing code */}
        <div className="justify-start">
          <button
            onClick={toggleLogHistory}
            className={`${GlobalStyle.buttonPrimary} flex items-center gap-2 px-4 py-2`}
          >
            {showLogHistory ? "Close Log History" : "Log History"}
          </button>
        </div>

        {/* Log History Modal */}
        {showLogHistory && (
          <div className="my-4 bg-white rounded-lg shadow-lg w-full max-w-4xl overflow-hidden">
            <div className="p-6">
              <div className="mb-4">
                <h3 className={`${GlobalStyle.headingMedium}`}>
                  Remark History
                </h3>
              </div>

              <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
                <table className={`${GlobalStyle.table} min-w-full`}>
                  <thead className={GlobalStyle.thead}>
                    <tr>
                      <th className={`${GlobalStyle.tableHeader} text-left`}>
                        Edited On
                      </th>
                      <th className={`${GlobalStyle.tableHeader} text-left`}>
                        Action
                      </th>
                      <th className={`${GlobalStyle.tableHeader} text-left`}>
                        Edited By
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {remarkHistory && remarkHistory.length > 0 ? (
                      remarkHistory.map((log, index) => (
                        <tr
                          key={index}
                          className={`${
                            index % 2 === 0
                              ? "bg-white bg-opacity-75"
                              : "bg-gray-50 bg-opacity-50"
                          } border-b`}
                        >
                          <td
                            className={`${GlobalStyle.tableData} whitespace-nowrap`}
                          >
                            {new Date(log.remark_dtm).toLocaleString()}
                          </td>
                          <td className={`${GlobalStyle.tableData}`}>
                            {log.remark_by || "System User"}
                          </td>
                          <td
                            className={`${GlobalStyle.tableData} whitespace-normal break-words`}
                          >
                            {log.remark || "No remark provided"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="text-center py-4 text-gray-500"
                        >
                          No remark history available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DRCInfoEdit;
