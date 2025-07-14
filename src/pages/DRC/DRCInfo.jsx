/*Purpose: This template is used for the 10.3 - DRC's info with edit functionality
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
import addIcon from "../../assets/images/add.svg";
import { FaArrowLeft, FaSearch, FaArrowRight } from "react-icons/fa";
import ActiveStatus from "../../assets/images/complete.png";
import InactiveStatus from "../../assets/images/Cross.png";
import {
  getDebtCompanyByDRCID,
  terminateCompanyByDRCID,
  updateDRCInfo,
  getSLTCoordinators,
  getActiveServiceDetails,
  getActiveRTOMDetails,
  
} from "../../services/drc/Drc";
import { getLoggedUserId } from "../../services/auth/authService";
import { getUserDetailsById } from "../../services/user/user_services";

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
  const [terminationRemark, setTerminationRemark] = useState("");
  const [terminationRemarkError, setTerminationRemarkError] = useState(false);
  
  // Edit mode state
  const [editMode, setEditMode] = useState(false);

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
    drc_agreement_details: [],
    services: [],
    rtom: [],
    remark: [],
  });

  // Edit mode fields
  const [contactNo, setContactNo] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [editingCoordinator, setEditingCoordinator] = useState(false);
  const [showLogHistory, setShowLogHistory] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [serviceTypes, setServiceTypes] = useState([]);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [dropdownClicked, setDropdownClicked] = useState(false);
  const [selectedRTOM, setSelectedRTOM] = useState("");
  const [rtomAreas, setRtomAreas] = useState([]);
  const [rtomLoading, setRtomLoading] = useState(false);
  const [rtomDropdownClicked, setRtomDropdownClicked] = useState(false);
  const [coordinatorFields, setCoordinatorFields] = useState({
    service_no: "",
    slt_coordinator_name: "",
    slt_coordinator_email: "",
  });
  // const [currentAgreement, setCurrentAgreement] = useState({
  //   agreement_start_dtm: "",
  //   agreement_end_dtm: "",
  // });
  const [serviceOptions, setServiceOptions] = useState([]);
  const [editingServiceIds, setEditingServiceIds] = useState([]);
  const [editingRtomIds, setEditingRtomIds] = useState([]);
  const [selectedhandlingtype, Setselectedhandlingtype] = useState("");
  const [remark, setRemark] = useState("");
  const [remarkHistory, setRemarkHistory] = useState([]);
  const [ServiceNo, setServiceNo] = useState("");
  const [C_Name, setCName] = useState("");
  const [C_Email, setCEmail] = useState("");
  const [errors, setErrors] = useState({});

  //loghistory
  const [showPopup, setShowPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 5;

   //drc_coordinator pagination
    const [currentCoordinatorPage, setCurrentCoordinatorPage] = useState(0);
    const coordinatorsPerPage = 5;
    
    // Billing center pagination
      const [currentRtomPage, setCurrentRtomPage] = useState(0);
      const rtomPerPage = 5; 

  //loghistory function
 const filteredLogHistory = remarkHistory
  .sort((a, b) => new Date(b.remark_dtm) - new Date(a.remark_dtm)) // Newest first
  .filter((log) =>
    (log.remark || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (log.remark_by || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pages = Math.ceil(filteredLogHistory.length / rowsPerPage);
  const paginatedLogHistory = filteredLogHistory.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  //prev page
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

    const handleSearchUsers = async (e) => {
      e.preventDefault();
      
      if (!ServiceNo || ServiceNo.trim() === "") {
        Swal.fire("Error", "Please provide a valid service number.", "error");
        return;
      }
  
      try {
  
        // Fetch user details
        const response = await getUserDetailsById(ServiceNo);
        
        // Handle different response structures:
        const userData = response.data || response; // Check for nested data
        
        // Extract name - try multiple possible fields
        const userName = userData.username || userData.name || userData.fullName || "";
        
        // Extract email
        const userEmail = userData.email || "";
        setCName(userName);
        setCEmail(userEmail);
  
      } catch (error) {
        Swal.close();
        Swal.fire("Error", "Coordinator not found", error);
        setCName("");
        setCEmail("");
      }
    };

  //next page
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, pages - 1));
  };

 
  // Add this calculation before your return statement
  const coordinatorPages = companyData.drc_coordinator 
    ? Math.ceil(companyData.drc_coordinator.length / coordinatorsPerPage)
    : 0;

  const paginatedCoordinators = companyData.drc_coordinator 
    ? companyData.drc_coordinator.slice(
        currentCoordinatorPage * coordinatorsPerPage,
        (currentCoordinatorPage + 1) * coordinatorsPerPage
      )
    : [];

      const handlePrevCoordinatorPage = () => {
        setCurrentCoordinatorPage(prev => Math.max(prev - 1, 0));
      };

      const handleNextCoordinatorPage = () => {
        setCurrentCoordinatorPage(prev => Math.min(prev + 1, coordinatorPages - 1));
      };


      // Billing center pagination
      const rtomPages = companyData.rtom 
        ? Math.ceil(companyData.rtom.length / rtomPerPage)
        : 0;

      const paginatedRtom = companyData.rtom 
        ? companyData.rtom.slice(
            currentRtomPage * rtomPerPage,
            (currentRtomPage + 1) * rtomPerPage
          )
        : [];



   // billing center prev & next 
    const handlePrevRtomPage = () => {
      setCurrentRtomPage(prev => Math.max(prev - 1, 0));
    };

    const handleNextRtomPage = () => {
      setCurrentRtomPage(prev => Math.min(prev + 1, rtomPages - 1));
    };


  // Fetch DRC data 
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        const drcIdToUse = drcId;
        const data = await getDebtCompanyByDRCID(drcIdToUse);

        // Fetch SLT coordinator details for dropdown
        const coordinatorsResponse = await getSLTCoordinators();

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
        }

        setServiceOptions(options);

        if (data) {
          setCompanyData(data);
          setContactNo(data.drc_contact_no || "");
          setAddress(data.drc_address || "");
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

          if (Array.isArray(data.remark)) {
            const validRemarks = data.remark.filter(r => r && (r.remark || r.remark_by || r.remark_dtm));
            setRemarkHistory(validRemarks);
          } else if (data.remark && typeof data.remark === 'object') {
            setRemarkHistory([data.remark]);
          } else {
            setRemarkHistory([]);
          }

          // Set remark history if available
          if (Array.isArray(data.remark)) {
            setRemarkHistory(data.remark);
          } else if (typeof data.remark === "object" && data.remark !== null) {
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

    if (drcId) {
      fetchCompanyData();
    }
  }, [drcId]);


  // Fetch active service types from the API
  const fetchActiveServices = async () => {
  try {
    setLoading(true);
    const response = await getActiveServiceDetails();
    console.log("API Response:", response);

    if (response && Array.isArray(response)) {
      const formatted = response.map((service) => ({
        id: service.service_id,
        code: service.service_id.toString(),
        name: service.service_type,
        selected: companyData.services?.some(s => s.service_type === service.service_type),
      }));

      setServiceTypes(formatted);
    } else {
      console.error("Unexpected API response format:", response);
      setServiceTypes([]);
    }
  } catch (error) {
    console.error("Error loading service types:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to load active service types.",
    });
    setServiceTypes([]);
  } finally {
    setLoading(false);
  }
};

  // Function to fetch RTOM data
  const fetchRTOMData = async () => {
    try {
      setRtomLoading(true);
      const response = await getActiveRTOMDetails();

      if (response && response.data && Array.isArray(response.data)) {
        const formattedData = response.data.map((rtom) => {
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
  };

  useEffect(() => {
    loadUser();
  }, []);

  // Navigation handler 
  const handleNavigateToEdit = () => {
    setEditMode(true);
  };

  // Navigation (Back btn)
  const goBack = () => {
    if (editMode) {
      setEditMode(false);
    } else {
      navigate(-1);
    }
  };

  // Handle DRC End
  const handleEndSubmit = async () => {
  try {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to terminate this DRC?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, terminate it!",
      cancelButtonText: "Cancel",
    });

    if (!confirmResult.isConfirmed) {
      return;
    }

    // Validate remark field
    if (!terminationRemark.trim()) {
      setTerminationRemarkError(true);
      return Swal.fire({
        icon: "error",
        title: "Remark Required",
        text: "Please enter a remark",
      });
    }

    setTerminationRemarkError(false);

    Swal.fire({
      title: "Processing...",
      text: "Please wait while terminating the DRC",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Get the user who is terminating
    const terminate_by = userData
      ? userData.id || userData.userId || userData
      : "system";

    // Call termination API with corrected field names
    const response = await terminateCompanyByDRCID(
      companyData.drc_id,
      terminationRemark,
      terminate_by,
      endDate
    );

    Swal.close();

    Swal.fire({
      icon: "success",
      title: "Termination Successful",
      text: `DRC ${companyData.drc_name} has been successfully terminated with effect from ${endDate.toLocaleDateString()}.`,
      confirmButtonText: "Done",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        setTerminationRemark("");
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
      const updatedTypes = serviceTypes.map((item) =>
        item.name === selectedServiceType ? { ...item, selected: true } : item
      );
      setServiceTypes(updatedTypes);

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
    const updatedAreas = rtomAreas.map((item) =>
      item.code === selectedRTOM ? { ...item, selected: true } : item
    );
    setRtomAreas(updatedAreas);

    const selectedRtomItem = rtomAreas.find(
      (area) => area.code === selectedRTOM
    );

    if (selectedRtomItem) {
      const newRtom = {
        rtom_id: selectedRtomItem.id,
         rtom_billing_center_code: selectedRtomItem.code,
        rtom_name: selectedRtomItem.name,
        rtom_status: "Active",
        handling_type: selectedhandlingtype, // Add handling type here
        last_update_dtm: new Date().toISOString(),
      };

      setCompanyData({
        ...companyData,
        rtom: [...companyData.rtom, newRtom],
      });
    }

    setSelectedRTOM("");
    Setselectedhandlingtype(""); // Reset handling type selection
  }
};


  const handleRemoveServiceType = (type) => {
    const updatedTypes = serviceTypes.map((item) =>
      item.name === type ? { ...item, selected: false } : item
    );
    setServiceTypes(updatedTypes);

    const updatedServices = companyData.services.filter(
      (service) => service.service_type !== type
    );

    setCompanyData({
      ...companyData,
      services: updatedServices,
    });
  };

  const handleRemoveRTOM = (code) => {
    const updatedAreas = rtomAreas.map((item) =>
      item.code === code ? { ...item, selected: false } : item
    );
    setRtomAreas(updatedAreas);

    const rtomToRemove = rtomAreas.find((area) => area.code === code);

    if (rtomToRemove) {
      const updatedRtoms = companyData.rtom.filter(
        (rtom) => rtom.rtom_id !== rtomToRemove.id
      );

      setCompanyData({
        ...companyData,
        rtom: updatedRtoms,
      });
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phone) => {
    const cleanedPhone = phone.replace(/\s/g, "");
    const phoneRegex = /^(011\d{7}|\+947\d{8}|\+9411\d{7}|07\d{8})$/;
    return phoneRegex.test(cleanedPhone);
  };

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
       let coordinatorData = [];
      if (editingCoordinator) {
        if (!ServiceNo || !C_Name || !C_Email) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "All SLT Coordinator fields are required",
          });
          return;
        }
        
        coordinatorData = [{
          service_no: ServiceNo,
          slt_coordinator_name: C_Name,
          slt_coordinator_email: C_Email
        }];
      }

      // Get updated services and RTOM data
     const updatedServices = companyData.services.map((service) => {
      const matchedService = serviceTypes.find(st => st.name === service.service_type);
      return {
        service_id: matchedService?.id || service.service_id, // Include service_id
        service_type: service.service_type,
        service_status: service.service_status,
        status_update_dtm: new Date().toISOString(),
      };
    });

      const updatedRtom = companyData.rtom.map((rtom) => ({
        ...rtom,
        status_update_dtm: new Date().toISOString(),
      }));

      // Prepare the coordinator data
     

      // Current date for remark timestamp
      const currentDate = new Date().toISOString();

      const response = await updateDRCInfo(
        companyData.drc_id,
        coordinatorData,
        updatedServices,
        updatedRtom,
        remark,
        remarkBy,
        currentDate,
        address,
        contactNo,
        email,
        companyData.status
      );

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
        setEditMode(false);
        // Refresh the data
        const fetchCompanyData = async () => {
          try {
            setLoading(true);
            const drcIdToUse = drcId;
            const data = await getDebtCompanyByDRCID(drcIdToUse);
            if (data) {
              setCompanyData(data);
            }
            setLoading(false);
          } catch (err) {
            console.error("Failed to fetch DRC data:", err);
            setLoading(false);
          }
        };
        fetchCompanyData();
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
  };

  const handleCoordinatorChange = (e) => {
    const { name, value } = e.target;
    setCoordinatorFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServiceSelection = (e) => {
    const selectedUserId = e.target.value;
    const selectedCoordinator = serviceOptions.find(
      (option) => option.user_id === selectedUserId
    );

    if (selectedCoordinator) {
      setCoordinatorFields({
        service_no: selectedCoordinator.service_no,
        slt_coordinator_name: selectedCoordinator.slt_coordinator_name,
        slt_coordinator_email: selectedCoordinator.slt_coordinator_email,
      });
    } else {
      setCoordinatorFields({
        service_no: "",
        slt_coordinator_name: "",
        slt_coordinator_email: "",
      });
    }
  };

  const handleSaveCoordinator = () => {
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
  console.log("Log History Data:", remarkHistory);




  // Get current coordinator (last one in array)
  const currentCoordinator =
    companyData.slt_coordinator && companyData.slt_coordinator.length > 0
      ? companyData.slt_coordinator[companyData.slt_coordinator.length - 1]
      : null;

  // Add this above both return statements to get current agreement
  const currentAgreement = companyData.drc_agreement_details && 
                          companyData.drc_agreement_details.length > 0
    ? companyData.drc_agreement_details[
        companyData.drc_agreement_details.length - 1
      ]
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

  console.log("ShowPOPUp:", showPopup);


  const currentStatus = companyData.drc_status?.length > 0 
  ? companyData.drc_status[companyData.drc_status.length - 1].drc_status
  : "Inactive";

console.log("DRC Status Data:", {
  currentStatus: currentStatus,

 });

console.log("latest Status History:", companyData.status || []);

console.log("Service Details with IDs:");
if (companyData.services && Array.isArray(companyData.services)) {
  companyData.services.forEach((service, index) => {
    // Find the matching service in serviceTypes to get the ID
    const matchedService = serviceTypes.find(st => st.name === service.service_type);
    
    console.log(`Service ${index + 1}:`, {
      id: matchedService?.id || 'Unknown ID',
      type: service.service_type || 'Unknown Type',
      status: service.service_status || 'Unknown Status',
      // Include the raw service object for debugging
      rawService: service
    });
  });
} else {
  console.log("No services found or services is not an array");
}


console.log("Company RTOM data:", {
  rawRtomData: companyData.rtom,
  mappedData: companyData.rtom?.map(r => ({
    id: r.rtom_id,
    code: r.rtom_billing_center_code,
    name: r.rtom_name,
    status: r.rtom_status,
    handling_type: r.handling_type
  }))
});


  if (!editMode) {
    // View mode
    return (
      <div className={`${GlobalStyle.fontPoppins} px-4 sm:px-6 md:px-8 max-w-7xl mx-auto`}>
        <h2 className={`${GlobalStyle.headingLarge} text-center sm:text-left mb-4 sm:mb-6`}>
          {companyData.drc_name}
        </h2>

        {/* Main Content Card */}
        <div className="w-full flex justify-center">
          <div className={`${GlobalStyle.cardContainer} relative w-full max-w-4xl`}>

            <div className="absolute top-4 right-4">
            <img
              src={Edit}
              onClick={() => {
                if (companyData.status !== "Terminate") {  
                  handleNavigateToEdit();
                }
              }}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg w-10 sm:w-14 ${
                companyData.status === "Terminate"  
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
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
                    label: "Created Date",
                    value: companyData.drc_create_dtm
                      ? new Date(companyData.drc_create_dtm).toLocaleDateString()
                      : companyData.createdAt
                      ? new Date(companyData.createdAt).toLocaleDateString()
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
                  }, 
                    companyData.status === "Terminate" && {
                      label: "Terminate Date",
                      value: companyData.drc_terminate_dtm
                        ? new Date(companyData.drc_terminate_dtm).toLocaleDateString() : "Not specified"
                    }
                ].map((item, index) => (
                  <tr key={index} className="block sm:table-row">
                    {/* <td className={`${GlobalStyle.tableData} font-medium block sm:hidden`}>
                      {item.label}:
                    </td>
                    <td className={`${GlobalStyle.tableData} text-gray-500 block sm:hidden pl-4`}>
                      {item.value}
                    </td> */}
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

            {/* Current Agreement Section */}
            <h2 className={`${GlobalStyle.headingMedium} mt-6 mb-4 sm:mt-8 sm:mb-6 underline text-left font-semibold`}>
              Current Agreement Details
            </h2>

            <div className={`${GlobalStyle} overflow-x-auto`}>
              <table className={`${GlobalStyle.table} min-w-full text-left`}>
                <tbody>
                  {currentAgreement ? (
                    <>
                      <tr>
                        <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-1/3 sm:w-1/4`}>
                          Start Date
                        </td>
                        <td className="w-4 text-left">:</td>
                        <td className={`${GlobalStyle.tableData} text-gray-500 break-words text-left`}>
                          {currentAgreement.agreement_start_dtm
                            ? new Date(currentAgreement.agreement_start_dtm).toLocaleDateString()
                            : "Not specified"}
                        </td>
                      </tr>
                      <tr>
                        <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-1/3 sm:w-1/4`}>
                          End Date
                        </td>
                        <td className="w-4 text-left">:</td>
                        <td className={`${GlobalStyle.tableData} text-gray-500 break-words text-left`}>
                          {currentAgreement.agreement_end_dtm
                            ? new Date(currentAgreement.agreement_end_dtm).toLocaleDateString()
                            : "Not specified"}
                        </td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-4 text-gray-500">
                        No agreement details available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            
            {/* SLT Coordinator Section */}

            <h2 className={`${GlobalStyle.headingMedium} mt-6 mb-4 sm:mt-8 sm:mb-6 underline text-left font-semibold`}>
              SLT Coordinator Details
            </h2>

            <div className={`${GlobalStyle} overflow-x-auto`}>
                <table className={`${GlobalStyle.table} min-w-full text-left`}>
                  <tbody>
                    {currentCoordinator ? (
                      <>
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
                      </>
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center py-4 text-gray-500">
                          No coordinator assigned
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* DRC Coordinator Section */}

            <h2 className={`${GlobalStyle.headingMedium} mt-6 mb-4 sm:mt-8 sm:mb-6 underline text-left font-semibold`}>
              DRC Coordinator Details
            </h2>

            <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
              <table className={`${GlobalStyle.table} min-w-full`}>
                <thead className={GlobalStyle.thead}>
                  <tr>
                    <th className={`${GlobalStyle.tableHeader} whitespace-nowrap text-left`}>
                      Name
                    </th>
                    <th className={`${GlobalStyle.tableHeader} whitespace-nowrap text-left`}>
                      NIC
                    </th>
                    <th className={`${GlobalStyle.tableHeader} whitespace-nowrap text-left`}>
                      Email
                    </th>
                    <th className={`${GlobalStyle.tableHeader} whitespace-nowrap text-left`}>
                      Contact No
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCoordinators.length > 0 ? (
                    paginatedCoordinators.map((coordinator, index) => (
                      <tr
                        key={index}
                        className={`${
                          index % 2 === 0
                            ? "bg-white bg-opacity-75"
                            : "bg-gray-50 bg-opacity-50"
                        } border-b`}
                      >
                        <td className={`${GlobalStyle.tableData} whitespace-normal break-words text-left`}>
                          {coordinator.user_name || "N/A"}
                        </td>
                        <td className={`${GlobalStyle.tableData} whitespace-normal break-words text-left`}>
                          {coordinator.user_nic || "N/A"}
                        </td>
                        <td className={`${GlobalStyle.tableData} whitespace-normal break-words text-left`}>
                          {coordinator.user_email || "N/A"}
                        </td>
                        <td className={`${GlobalStyle.tableData} whitespace-normal break-words text-left`}>
                          {coordinator.user_contact_no?.[0]?.contact_number || "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-gray-500">
                        No DRC Coordinators found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              </div>

            {/* Add pagination controls */}

              {companyData.drc_coordinator && companyData.drc_coordinator.length > coordinatorsPerPage && (
                <div className={GlobalStyle.navButtonContainer}>
                  <button
                    className={`${GlobalStyle.navButton} ${currentCoordinatorPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handlePrevCoordinatorPage}
                    disabled={currentCoordinatorPage === 0}
                  >
                    <FaArrowLeft />
                  </button>

                  <span>Page {currentCoordinatorPage + 1} of {coordinatorPages}</span>

                  <button
                    className={`${GlobalStyle.navButton} ${currentCoordinatorPage === coordinatorPages - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleNextCoordinatorPage}
                    disabled={currentCoordinatorPage === coordinatorPages - 1}
                  >
                    <FaArrowRight />
                  </button>
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
                      Status
                    </th>
                    <th className={`${GlobalStyle.tableHeader} whitespace-nowrap text-left`}>
                      Changed On
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {companyData.services && companyData.services.map((service, index) => (
                    <tr
                      key={index}
                      className={`${index % 2 === 0
                        ? "bg-white bg-opacity-75"
                        : "bg-gray-50 bg-opacity-50"
                        } border-b`}
                    >
                      <td className={`${GlobalStyle.tableData} whitespace-normal break-words text-left`}>
                        {service.service_type}
                      </td>
                      <td className={`${GlobalStyle.tableData} text-center`}>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <img
                              src={service.service_status === "Active" ? ActiveStatus : InactiveStatus}
                              alt={service.service_status === "Active" ? "Active" : "Inactive"}
                              title={service.service_status === "Active" ? "Active" : "Inactive"}
                              className="w-6 h-6 mx-auto"
                              onClick={() => handleServiceStatusToggle(index)}
                            />
                          </label>
                      </td>
                      <td className={`${GlobalStyle.tableData} whitespace-nowrap text-left`}>
                        {service.status_update_dtm
                          ? new Date(service.status_update_dtm).toLocaleDateString()
                          : ""}
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
              Billing Center Areas
            </h2>

            <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
              <table className={`${GlobalStyle.table} min-w-full`}>
                <thead className={GlobalStyle.thead}>
                  <tr>
                    <th className={`${GlobalStyle.tableHeader} whitespace-nowrap text-left`}>
                      Billing center Code
                    </th>
                    <th className={`${GlobalStyle.tableHeader} whitespace-nowrap text-left`}>
                      Handling Type
                    </th>
                    <th className={`${GlobalStyle.tableHeader} whitespace-nowrap text-left`}>
                      Status
                    </th>
                    <th className={`${GlobalStyle.tableHeader} whitespace-nowrap text-left`}>
                      Changed On
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRtom.length > 0 ? (
                    paginatedRtom.map((rtom, index) => (
                      <tr
                        key={index}
                        className={`${
                          index % 2 === 0
                            ? "bg-white bg-opacity-75"
                            : "bg-gray-50 bg-opacity-50"
                        } border-b`}
                      >
                        <td className={`${GlobalStyle.tableData} whitespace-normal break-words text-left`}>
                          {rtom.rtom_name}
                        </td>
                        <td className={`${GlobalStyle.tableData} whitespace-normal break-words text-left`}>
                          {rtom.handling_type}
                        </td>
                        <td className={`${GlobalStyle.tableData} text-center`}>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <img
                              src={rtom.rtom_status === "Active" ? ActiveStatus : InactiveStatus}
                              alt={rtom.rtom_status === "Active" ? "Active" : "Inactive"}
                              title={rtom.rtom_status === "Active" ? "Active" : "Inactive"}
                              className="w-6 h-6 mx-auto"
                            />
                          </label>
                        </td>
                        <td className={`${GlobalStyle.tableData} whitespace-normal text-left`}>
                          {rtom.last_update_dtm
                            ? new Date(rtom.last_update_dtm).toLocaleDateString()
                            : ""}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-gray-500">
                        No Billing Center information available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              </div>

          {/* Add pagination controls */}
          {companyData.rtom && companyData.rtom.length > rtomPerPage && (
            <div className={GlobalStyle.navButtonContainer}>
              <button
                className={`${GlobalStyle.navButton} ${currentRtomPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handlePrevRtomPage}
                disabled={currentRtomPage === 0}
              >
                <FaArrowLeft />
              </button>

              <span>Page {currentRtomPage + 1} of {rtomPages}</span>

              <button
                className={`${GlobalStyle.navButton} ${currentRtomPage === rtomPages - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleNextRtomPage}
                disabled={currentRtomPage === rtomPages - 1}
              >
                <FaArrowRight />
              </button>
            </div>
          )}
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

                    {/* <td className={`${GlobalStyle.tableData} font-medium block sm:hidden`}>
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
                    </td> */}


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
                          minDate={new Date()}
                        />
                      </div>
                    </td>
                  </tr>

                  {/* Remark Row */}
                  <tr className="block sm:table-row">

                    {/* <td className={`${GlobalStyle.tableData} font-semibold block sm:hidden`}>
                      Remark:
                    </td>
                    <td className={`${GlobalStyle.tableData} block sm:hidden pl-4`}>
                      <textarea
                        value={terminationRemark}
                        onChange={(e) => {
                          setTerminationRemark(e.target.value);
                          if (e.target.value.trim() && terminationRemarkError) {
                            setTerminationRemarkError(false);
                          }
                        }}
                        rows="4"
                        className={`${GlobalStyle.inputText} w-full text-left ${terminationRemarkError ? "border-red-500" : ""
                          }`}
                        placeholder="Enter reason for ending DRC relationship"
                        required
                      />
                      {terminationRemarkError && (
                        <p className="text-red-500 text-sm mt-1 text-left">
                          Remark is required
                        </p>
                      )}
                    </td> */}


                    <td className={`${GlobalStyle.tableData} font-semibold whitespace-nowrap hidden sm:table-cell w-1/3 sm:w-1/4`}>
                      Remark
                    </td>
                    <td className="w-4 text-left hidden sm:table-cell">:</td>
                    <td className={`${GlobalStyle.tableData} hidden sm:table-cell`}>
                      <textarea
                        value={terminationRemark}
                        onChange={(e) => {
                          setTerminationRemark(e.target.value);
                          if (e.target.value.trim() && terminationRemarkError) {
                            setTerminationRemarkError(false);
                          }
                        }}
                        rows="4"
                        className={`${GlobalStyle.inputText} w-full text-left ${terminationRemarkError ? "border-red-500" : ""
                          }`}
                        placeholder="Enter reason for ending DRC relationship"
                        required
                      />
                      {terminationRemarkError && (
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
        {showEndFields ? (
          <div className="flex justify-between mt-4 w-full px-8">
            <div className="flex flex-col items-start">
              <button
                className={`${GlobalStyle.buttonPrimary}`}
                onClick={() => setShowPopup(true)}
              >
                Log History
              </button>
              <div style={{ marginTop: '15px' }}>
                <button
                  className={`${GlobalStyle.buttonPrimary} flex items-center space-x-2`}
                  onClick={goBack}
                >
                  <FaArrowLeft />
                </button>
              </div>
            </div>


          </div>
        ) : (
          <div className="flex justify-between mt-4 w-full px-8">
            <div className="flex flex-col items-start">
              <button
                className={`${GlobalStyle.buttonPrimary}`}
                onClick={() => setShowPopup(true)}
              >
                Log History
              </button>
              <div style={{ marginTop: '15px' }}>
                <button
                  className={`${GlobalStyle.buttonPrimary} flex items-center space-x-2`}
                  onClick={goBack}
                >
                  <FaArrowLeft />
                </button>
              </div>
            </div>
            <div>
              <button
                onClick={() => {
                  if (companyData.status !== "Terminate") {  
                    setShowEndFields(true);
                  }
                }}
                className={`${GlobalStyle.buttonPrimary} ${
                  companyData.status === "Terminate" 
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={companyData.status === "Terminate"}  
              >
                End
              </button>
            </div>
          </div>
        )}

        {/* Log History Modal */}
        {showPopup && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
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
                      placeholder="  "
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(0);
                      }}
                      className={GlobalStyle.inputSearch}
                    />
                    <FaSearch className={GlobalStyle.searchBarIcon} />
                  </div>
                </div>
                <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
                  <table className={`${GlobalStyle.table} w-full`}>
                    <thead className={GlobalStyle.thead}>
                      <tr>
                        <th className={`${GlobalStyle.tableHeader} min-w-[120px]`}>Edited On</th>
                        <th className={`${GlobalStyle.tableHeader} min-w-[150px]`}>Action</th>
                        <th className={`${GlobalStyle.tableHeader} min-w-[150px]`}>Edited By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLogHistory.length > 0 ? (
                        paginatedLogHistory.map((log, index) => (
                          <tr
                            key={index}
                            className={`${index % 2 === 0
                              ? "bg-white bg-opacity-75"
                              : "bg-gray-50 bg-opacity-50"
                              } border-b`}
                          >
                           <td className={`${GlobalStyle.tableData} whitespace-nowrap`}>
                              {log.remark_dtm
                                ? new Date(log.remark_dtm).toLocaleDateString('en-GB')
                                : "N/A"}
                            </td>
                            <td className={GlobalStyle.tableData}>
                              {log.remark || "No remark provided"}
                            </td>
                            <td className={`${GlobalStyle.tableData} whitespace-normal break-words`}>
                              {log.remark_by || "System User"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center py-4 text-gray-500">
                            {searchQuery ? "No matching results found" : "No Log history available"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {filteredLogHistory.length > rowsPerPage && (
                  <div className={GlobalStyle.navButtonContainer}>
                    <button
                      className={`${GlobalStyle.navButton} ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={handlePrevPage}
                      disabled={currentPage === 0}
                    >
                      <FaArrowLeft />
                    </button>

                    <span>Page {currentPage + 1} of {pages}</span>

                    <button
                      className={`${GlobalStyle.navButton} ${currentPage === pages - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
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
        )}
      </div>
    );
  };
  return (
    <div
      className={`${GlobalStyle.fontPoppins} px-4 sm:px-6 md:px-8 max-w-6xl mx-auto`}
    >
      <h2
        className={`${GlobalStyle.headingLarge} text-center sm:text-left mb-4 sm:mb-6`}
      >
        {companyData.drc_name}
      </h2>

      <div className="w-full justify-center">
        <div
          className={`${GlobalStyle.cardContainer} relative w-full max-w-4xl`}
        >
          {/* DRC Status Toggle Button - Top Right Corner */}
         <div className="absolute top-4 right-4 flex items-center">
          <button
            onClick={() => {
              const newStatus = companyData.status === "Active" ? "Inactive" : "Active";
              setCompanyData((prev) => ({
                ...prev,
                status: newStatus,
              }));
            }}
            className="relative inline-flex items-center cursor-pointer"
            aria-label={companyData.status === "Active" ? "Active" : "Inactive"}
          >
            <div
              className={`w-11 h-6 rounded-full transition-colors ${
                companyData.status === "Active" ? "bg-green-500" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow transform transition-transform ${
                companyData.status === "Active" ? "translate-x-5" : ""
              }`}
            ></div>
            <span className="ml-3 text-sm font-medium">
              {companyData.status === "Active" ? "Active" : "Inactive"}
            </span>
          </button>
        </div>


          {/* Company Details Section */}
          <h2 className={`${GlobalStyle.headingMedium} mb-4 sm:mb-6 mt-6 sm:mt-8 underline text-left font-semibold`}>
            Company Details
          </h2>

          <div className={`overflow-x-auto`}>
            <table className={`${GlobalStyle.table} min-w-full text-left`}>
              <tbody>
                <tr className="block sm:table-row">
                  <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 sm:w-1/4 block sm:table-cell`}>
                    Added Date<span className="sm:hidden">:</span>
                  </td>
                  <td className="w-4 text-left hidden sm:table-cell">:</td>

                  <td className={`${GlobalStyle.tableData} text-gray-500 break-words text-left block sm:table-cell`}>
                    {companyData.createdAt
                        ? new Date(companyData.createdAt).toLocaleDateString()
                        : companyData.create_on
                        ? new Date(companyData.create_on).toLocaleDateString()
                        : "Not specified"}
                  </td>
                </tr>

                <tr className="block sm:table-row">
                  <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 sm:w-1/4 block sm:table-cell`}>
                    Business Reg No<span className="sm:hidden">:</span>
                  </td>
                  <td className="w-4 text-left hidden sm:table-cell">:</td>
                  <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                    {companyData.drc_business_registration_number ||
                      "Not specified"}
                  </td>
                </tr>

                <tr className="block sm:table-row">
                  <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 sm:w-1/4 block sm:table-cell`}>
                    Address<span className="sm:hidden">:</span>
                  </td>
                  <td className="w-4 text-left hidden sm:table-cell">:</td>
                  <td className={`${GlobalStyle.tableData} text-left block sm:table-cell`}>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-full max-w-xs"
                    />
                  </td>
                </tr>

                <tr className="block sm:table-row">
                  <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 sm:w-1/4 block sm:table-cell`}>
                    Contact Number<span className="sm:hidden">:</span>
                  </td>
                  <td className="w-4 text-left hidden sm:table-cell">:</td>
                  <td className={`${GlobalStyle.tableData} text-left block sm:table-cell`}>
                    <input
                      type="text"
                      value={contactNo}
                      onChange={(e) => setContactNo(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-full max-w-xs"
                    />
                  </td>
                </tr>

                <tr className="block sm:table-row">
                  <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 sm:w-1/4 block sm:table-cell`}>
                    Email<span className="sm:hidden">:</span>
                  </td>
                  <td className="w-4 text-left hidden sm:table-cell">:</td>
                  <td className={`${GlobalStyle.tableData} text-left block sm:table-cell`}>
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

          {/* Current Agreement Section */}
          <h2 className={`${GlobalStyle.headingMedium} mt-6 mb-4 sm:mt-8 sm:mb-6 underline text-left font-semibold`}>
            Current Agreement Details
          </h2>

          <div className={`overflow-x-auto`}>
            <table className={`${GlobalStyle.table} min-w-full text-left`}>
              <tbody>
                {currentAgreement ? (
                  <>
                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 sm:w-1/4 block sm:table-cell`}>
                        Start Date<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 break-words text-left block sm:table-cell`}>
                        {currentAgreement.agreement_start_dtm
                          ? new Date(currentAgreement.agreement_start_dtm).toLocaleDateString()
                          : "Not specified"}
                      </td>
                    </tr>
                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 sm:w-1/4 block sm:table-cell`}>
                        End Date<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 break-words text-left block sm:table-cell`}>
                        {currentAgreement.agreement_end_dtm
                          ? new Date(currentAgreement.agreement_end_dtm).toLocaleDateString()
                          : "Not specified"}
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-500">
                      No agreement details available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>


          {/* SLT Coordinator Section */}
      <div className="flex flex-col sm:flex-row justify-between underline items-start sm:items-center">
        <h2 className={`${GlobalStyle.headingMedium} mt-6 mb-4 sm:mt-8 sm:mb-6 text-left font-semibold`}>
          SLT Coordinator Details
        </h2>
        <div className="w-full flex justify-end sm:block sm:w-auto">
          <button
            onClick={() => {
              setEditingCoordinator(!editingCoordinator);
              if (!editingCoordinator) {
                setServiceNo(currentCoordinator?.service_no || "");
                setCName(currentCoordinator?.slt_coordinator_name || "");
                setCEmail(currentCoordinator?.slt_coordinator_email || "");
              }
            }}
            className={`${GlobalStyle.buttonPrimary} px-3 py-1 mb-4 sm:mb-0`}
          >
            {editingCoordinator ? "Cancel" : "Change"}
          </button>
        </div>
      </div>

        <div className={`overflow-x-auto`}>
          {currentCoordinator || editingCoordinator ? (
            <table className={`${GlobalStyle.table} min-w-full text-left`}>
              <tbody>
                <tr className="block sm:table-row">
                  <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 sm:w-1/4 block sm:table-cell`}>
                    Service No<span className="sm:hidden">:</span>
                  </td>
                  <td className="w-4 text-left hidden sm:table-cell">:</td>
                          <td className={`${GlobalStyle.tableData} break-words text-left block sm:table-cell`}>

                    {editingCoordinator ? (
                      <>
                      
                        <input
                          type="text"
                          value={ServiceNo}
                          onChange={(e) => {
                            setServiceNo(e.target.value);
                            // Clear other fields when service number changes
                            if (e.target.value !== currentCoordinator?.service_no) {
                              setCName("");
                              setCEmail("");
                            }
                          }}
                          className={`${GlobalStyle.inputText} w-100`}
                        />
                        <button
                          type="button"
                          onClick={handleSearchUsers}
                          className={`${GlobalStyle.buttonCircle} md:ml-2 self-end md:self-auto`}
                        >
                          <FaSearch style={{ width: 20, height: 20 }} />
                        </button>
                        {errors.ServiceNo && (
                          <p className="text-red-500">{errors.ServiceNo}</p>
                        )}
                      </>
                    ) : (
                      <span className="text-gray-500">
                        {currentCoordinator?.service_no || "Not specified"}
                      </span>
                    )}
                  </td>
                </tr>
                <tr className="block sm:table-row">
                  <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 sm:w-1/4 block sm:table-cell`}>
                    Name<span className="sm:hidden">:</span>
                  </td>
                  <td className="w-4 text-left hidden sm:table-cell">:</td>
                  <td className={`${GlobalStyle.tableData} break-words text-left block sm:table-cell`}>
                    {editingCoordinator ? (
                      <input
                        type="text"
                        value={C_Name}
                         readOnly
                        onFocus={(e) => e.target.blur()}
                        className={`${GlobalStyle.inputText} w-2/4 cursor-not-allowed `}
                      />
                    ) : (
                      <span className="text-gray-500">
                        {currentCoordinator?.slt_coordinator_name || "Not specified"}
                      </span>
                    )}
                  </td>
                </tr>
                <tr className="block sm:table-row">
                  <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 sm:w-1/4 block sm:table-cell`}>
                    Email<span className="sm:hidden">:</span>
                  </td>
                  <td className="w-4 text-left hidden sm:table-cell">:</td>
                  <td className={`${GlobalStyle.tableData} break-words text-left block sm:table-cell`}>
                    {editingCoordinator ? (
                      <input
                        type="email"
                        value={C_Email}
                        readOnly
                        onFocus={(e) => e.target.blur()}
                        className={`${GlobalStyle.inputText} w-2/4 bg-gray-100 cursor-not-allowed`}
                      />
                    ) : (
                      <span className="text-gray-500">
                        {currentCoordinator?.slt_coordinator_email || "Not specified"}
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


          {/*DRC coordinator*/}

           <div>
            <h2
              className={`${GlobalStyle.headingMedium} mt-6 mb-2 sm:mt-8 sm:mb-4 underline text-left font-semibold`}
            >
             DRC coordinator Details
            </h2>


           <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
              <table className={`${GlobalStyle.table} min-w-full`}>
                <thead className={GlobalStyle.thead}>
                  <tr>
                    <th className={`${GlobalStyle.tableHeader} whitespace-nowrap text-left`}>
                      Name
                    </th>
                    <th className={`${GlobalStyle.tableHeader} whitespace-nowrap text-left`}>
                      NIC
                    </th>
                    <th className={`${GlobalStyle.tableHeader} whitespace-nowrap text-left`}>
                      Email
                    </th>
                    <th className={`${GlobalStyle.tableHeader} whitespace-nowrap text-left`}>
                      Contact No
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCoordinators.length > 0 ? (
                    paginatedCoordinators.map((coordinator, index) => (
                      <tr
                        key={index}
                        className={`${
                          index % 2 === 0
                            ? "bg-white bg-opacity-75"
                            : "bg-gray-50 bg-opacity-50"
                        } border-b`}
                      >
                        <td className={`${GlobalStyle.tableData} whitespace-normal break-words text-left`}>
                          {coordinator.user_name || "N/A"}
                        </td>
                        <td className={`${GlobalStyle.tableData} whitespace-normal break-words text-left`}>
                          {coordinator.user_nic || "N/A"}
                        </td>
                        <td className={`${GlobalStyle.tableData} whitespace-normal break-words text-left`}>
                          {coordinator.user_email || "N/A"}
                        </td>
                        <td className={`${GlobalStyle.tableData} whitespace-normal break-words text-left`}>
                          {coordinator.user_contact_no?.[0]?.contact_number || "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-gray-500">
                        No DRC Coordinators found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              </div>
              </div>

          {/* Services Section  */}

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
                      Status
                    </th>
                    <th
                      className={`${GlobalStyle.tableHeader} whitespace-nowrap text-left`}
                    >
                      Changed On
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {companyData.services &&
                    companyData.services.map((service, index) => (
                      <tr
                        key={index}
                        className={`${index % 2 === 0
                          ? "bg-white bg-opacity-75"
                          : "bg-gray-50 bg-opacity-50"
                          } border-b`}
                      >
                        <td
                          className={`${GlobalStyle.tableData} whitespace-normal break-words text-left`}
                        >
                          {service.service_type}
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
                              className={`w-11 h-6 rounded-full transition-colors ${service.service_status === "Active"
                                ? "bg-green-500"
                                : "bg-gray-300"
                                }`}
                            ></div>
                            <div
                              className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow transform transition-transform ${service.service_status === "Active"
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
                        <td
                          className={`${GlobalStyle.tableData} whitespace-nowrap text-left`}
                        >
                          {service.status_update_dtm
                            ? new Date(
                              service.status_update_dtm
                            ).toLocaleDateString()
                            : ""}
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


          

          {/* Billing center Section - With dropdown below the heading, aligned left */}
          <div>
            <h2
              className={`${GlobalStyle.headingMedium} mt-6 mb-2 sm:mt-8 sm:mb-4 underline text-left font-semibold`}
            >
              Billing Center Areas
            </h2>

            <div className="flex items-center gap-2 mb-4">
              <select
                onClick={handleRtomDropdownClick}
                value={selectedRTOM}
                onChange={(e) => setSelectedRTOM(e.target.value)}
                className={`${GlobalStyle.selectBox} mr-2`}
              >
                <option value="">Select Billing Center Area</option>
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
              <select
                value={selectedhandlingtype}
                onChange={(e) => Setselectedhandlingtype(e.target.value)}
                className={`${GlobalStyle.selectBox} w-full sm:flex-1`}
              >
                    <option value="">Select Handling Type</option>
                    <option value="CPE">CPE</option>
                    <option value="Arrears">Arrears</option>
                    <option value="All-Type">All Type</option>
                  </select>


              <div className="flex justify-end sm:justify-start w-full sm:w-auto mt-2 sm:mt-0 sm:ml-2">
                 <button
                      type="button"
                      onClick={handleAddRTOM}
                      className={`${GlobalStyle.buttonCircle}`}
                      disabled={!selectedRTOM || !selectedhandlingtype}
                    >
                      <img src={addIcon} alt="Add" style={{ width: 20, height: 20 }} />
                </button>
              </div>
            </div>

            {rtomLoading && (
              <p className="text-gray-500 mt-1 mb-4">Loading Billing Center areas...</p>
            )}

            <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
              <table className={`${GlobalStyle.table} min-w-full`}>
                <thead className={GlobalStyle.thead}>
                  <tr>
                    <th
                      className={`${GlobalStyle.tableHeader} whitespace-nowrap text-left`}
                    >
                      Billing Center Name
                    </th>
                    <th
                      className={`${GlobalStyle.tableHeader} whitespace-nowrap text-left`}
                    >
                      Handling Type
                    </th>
                    <th
                      className={`${GlobalStyle.tableHeader} whitespace-nowrap text-left`}
                    >
                      Status
                    </th>
                    <th
                      className={`${GlobalStyle.tableHeader} whitespace-nowrap text-left`}
                    >
                      Changed On
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {companyData.rtom &&
                    companyData.rtom.map((rtom, index) => (
                      <tr
                        key={index}
                        className={`${index % 2 === 0
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
                          className={`${GlobalStyle.tableData} whitespace-normal break-words text-left`}
                        >
                          {rtom.handling_type}
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
                              className={`w-11 h-6 rounded-full transition-colors ${rtom.rtom_status === "Active"
                                ? "bg-green-500"
                                : "bg-gray-300"
                                }`}
                            ></div>
                            <div
                              className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow transform transition-transform ${rtom.rtom_status === "Active"
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
                        <td
                          className={`${GlobalStyle.tableData} whitespace-normal text-left`}
                        >
                          {rtom.last_update_dtm
                            ? new Date(
                              rtom.last_update_dtm
                            ).toLocaleDateString()
                            : ""}
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


          <div className="flex justify-end gap-4 mt-8 flex-wrap">
            <button
              onClick={handleSave}
              className={`${GlobalStyle.buttonPrimary} px-4 sm:px-6 py-2 w-full sm:w-auto`}
            >
              Save
            </button>
          </div>
        </div>

        {/* Log history button - Existing code */}
        <div className="flex flex-col items-start mt-8 ">
          <button
            className={`${GlobalStyle.buttonPrimary}`}
            onClick={() => setShowPopup(true)}
          >
            Log History
          </button>

          <div style={{ marginTop: '15px' }}>
            <button
              className={`${GlobalStyle.buttonPrimary} flex items-center space-x-2`}
              onClick={goBack}
            >
              <FaArrowLeft />

            </button>

          </div>
        </div>

        {/* Log History Modal */}
        {showPopup && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
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
                      placeholder="  "
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(0);
                      }}
                      className={GlobalStyle.inputSearch}
                    />
                    <FaSearch className={GlobalStyle.searchBarIcon} />
                  </div>
                </div>
                <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
                  <table className={`${GlobalStyle.table} w-full`}>
                    <thead className={GlobalStyle.thead}>
                      <tr>
                        <th className={`${GlobalStyle.tableHeader} min-w-[120px]`}>Edited On</th>
                        <th className={`${GlobalStyle.tableHeader} min-w-[150px]`}>Action</th>
                        <th className={`${GlobalStyle.tableHeader} min-w-[150px]`}>Edited By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLogHistory.length > 0 ? (
                        paginatedLogHistory.map((log, index) => (
                          <tr
                            key={index}
                            className={`${index % 2 === 0
                              ? "bg-white bg-opacity-75"
                              : "bg-gray-50 bg-opacity-50"
                              } border-b`}
                          >
                            <td className={`${GlobalStyle.tableData} whitespace-nowrap`}>
                              {log.remark_dtm
                                ? new Date(log.remark_dtm).toLocaleDateString('en-GB')
                                : ""}
                            </td>
                            <td className={GlobalStyle.tableData}>
                              {log.remark || "No remark provided"}
                            </td>
                            <td className={`${GlobalStyle.tableData} whitespace-normal break-words`}>
                              {log.remark_by || "System User"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center py-4 text-gray-500">
                            {searchQuery ? "No matching results found" : "No Log history available"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {filteredLogHistory.length > rowsPerPage && (
                  <div className={GlobalStyle.navButtonContainer}>
                    <button
                      className={`${GlobalStyle.navButton} ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={handlePrevPage}
                      disabled={currentPage === 0}
                    >
                      <FaArrowLeft />
                    </button>

                    <span>Page {currentPage + 1} of {pages}</span>

                    <button
                      className={`${GlobalStyle.navButton} ${currentPage === pages - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
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
        )}
      </div>
    </div>
  );
}
export default DRCInfo;