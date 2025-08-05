
/* Purpose: This template is used for the 17.2 - User Info .
Created Date: 2025-06-07
Created By: sakumini (sakuminic@gmail.com)
Version: node 20
ui number :17.2
Dependencies: tailwind css
Related Files: (routes)
Notes:The following page conatins the code for the User Info Screen */

import { useEffect, useState } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import edit from "../../assets/images/edit-info.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { 
  endUser, 
  getUserDetailsById, 
  updateUserStatus, 
  updateUserRoles,
  updateUserContacts,
  updateUserProfile 
} from "../../services/user/user_services";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSearch, FaArrowLeft } from "react-icons/fa";
import { getLoggedUserId } from "../../services/auth/authService";

const UserInfo = () => {
  const location = useLocation();
  const user_id = location.state?.user_id;
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const [loggedUserData, setLoggedUserData] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [remark, setRemark] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [canEditProfile, setCanEditProfile] = useState(false);
  
  const [userInfo, setUserInfo] = useState({
    username: "",
    user_type: "",
    email: "",
    contact_numbers: [],
    can_user_login: "",
    roles: [],
    user_nic: "",
    user_designation: "",
    created_on: "",
    created_by: "",
    status_on: "",
    status_by: "",
    Remark: [],
  });

  const [editMode, setEditMode] = useState(false);
  const [showEndSection, setShowEndSection] = useState(false);
  const [userRolesList, setUserRolesList] = useState([]);
  const [contactNumbers, setContactNumbers] = useState([]);
  const [originalContactNumbers, setOriginalContactNumbers] = useState([]);
  const [editableProfileFields, setEditableProfileFields] = useState({
    username: "",
    user_nic: ""
  });

  const userRoles = [
    { value: "", label: "User Role", hidden: true },
    { value: "GM", label: "GM" },
    { value: "DGM", label: "DGM" },
    { value: "legal_officer", label: "Legal Officer" },
    { value: "manager", label: "Manager" },
    { value: "slt_coordinator", label: "SLT Coordinator" },
    { value: "DRC_user", label: "DRC User" },
    { value: "recovery_staff", label: "Recovery Staff" },
    { value: "rtom", label: "RTOM" },
    { value: "legal", label: "Legal" },
    { value: "analyst", label: "Analyst" },
  ];

  const loadUser = async () => {
    try {
      const user = await getLoggedUserId();
      setLoggedUserData(user);
    } catch (err) {
      console.error("Error fetching logged user:", err);
    }
  };

  useEffect(() => {
    if (userInfo.contact_numbers) {
      const contacts = [...userInfo.contact_numbers];
      while (contacts.length < 2) contacts.push("");
      setContactNumbers(contacts);
      setOriginalContactNumbers(contacts); 
    }
  }, [userInfo.contact_numbers]);

  const handleContactNumberChange = (index, value) => {
    const newContacts = [...contactNumbers];
    newContacts[index] = value;
    setContactNumbers(newContacts);
  };

  const checkIfProfileEditable = (createdOn) => {
    if (!createdOn) return false;
    
    const createdDate = new Date(createdOn);
    const now = new Date();
    const hoursDiff = (now - createdDate) / (1000 * 60 * 60);
    
    return hoursDiff <= 24;
  };

  useEffect(() => {
    let isMounted = true;

    const fetchUserInfoById = async () => {
      if (!user_id) {
        if (isMounted) {
          setError("No user ID provided. Please navigate from a valid source.");
          setLoading(false);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No user ID provided. Please navigate from a valid source.",
          });
        }
        return;
      }

      if (!/^\d+$/.test(user_id)) {
        if (isMounted) {
          setError("Invalid user ID format. Please provide a numeric ID.");
          setLoading(false);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Invalid user ID format. Please provide a numeric ID.",
          });
        }
        return;
      }

      try {
        setLoading(true);
        const fetchedData = await getUserDetailsById(user_id);
        
        if (isMounted && fetchedData && fetchedData.status === "Success") {
          const statusHistory = fetchedData.user_status || [];
          const latestStatus = statusHistory.length > 0 
            ? statusHistory[statusHistory.length - 1]
            : null;

          console.log("Setting initial userInfo:", {
            username: fetchedData.username || "",
            user_type: fetchedData.user_type || "",
            user_nic: fetchedData.user_nic || "",
            status_on: latestStatus ? latestStatus.status_on : "",
            status_by: latestStatus ? latestStatus.status_by : "",
          });

          const isProfileEditable = checkIfProfileEditable(fetchedData.created_on);
          setCanEditProfile(isProfileEditable);
          
          setIsActive(latestStatus ? latestStatus.status.toLowerCase() === "active" : false);

          setUserInfo({
            username: fetchedData.username || "",
            user_type: fetchedData.user_type || "",
            email: fetchedData.email || "",
            contact_numbers: fetchedData.contact_numbers || [],
            can_user_login: fetchedData.can_user_login || "",
            roles: fetchedData.roles || [],
            user_nic: fetchedData.user_nic || "",
            user_designation: fetchedData.user_designation || "",
            created_on: fetchedData.created_on || "",
            created_by: fetchedData.created_by || "",
            status_on: latestStatus ? latestStatus.status_on : "",
            status_by: latestStatus ? latestStatus.status_by : "",
            Remark: fetchedData.Remark || [],
          });

          setEditableProfileFields({
            username: fetchedData.username || "",
            user_nic: fetchedData.user_nic || ""
          });

          const contacts = [...(fetchedData.contact_numbers || [])];
          while (contacts.length < 2) contacts.push("");
          setContactNumbers(contacts);
          setOriginalContactNumbers(contacts);
        }
      } catch (err) {
        console.error("Error fetching User info:", err);
        if (isMounted) {
          setError(err.message || "Failed to load user information. Please try again later.");
          Swal.fire({
            icon: "error",
            title: "Error",
            text: err.message || "Failed to load user information",
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUser();
    fetchUserInfoById();

    return () => {
      isMounted = false;
    };
  }, [user_id]);

  const handleProfileFieldChange = (field, value) => {
    setEditableProfileFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      
      const payload = {
        user_id: Number(user_id),
        profile_payload: {
          username: editableProfileFields.username,
          user_nic: editableProfileFields.user_nic,
          email: userInfo.email,
          user_designation: userInfo.user_designation
        }
      };
      
      console.log("Payload being sent to update profile:", payload);

      const response = await updateUserProfile(payload);
      
      if (response.status === "updated" || response.status === "Success") {
        setUserInfo(prev => ({
          ...prev,
          username: editableProfileFields.username,
          user_nic: editableProfileFields.user_nic
        }));
        
        const fetchedData = await getUserDetailsById(user_id);
        if (fetchedData?.status === "Success") {
          setUserInfo(prev => ({
            ...prev,
            ...fetchedData,
            Remark: fetchedData.Remark || []
          }));
          setEditableProfileFields({
            username: fetchedData.username || "",
            user_nic: fetchedData.user_nic || ""
          });
        }
        
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Profile updated successfully",
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error updating profile:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.response?.data?.message || "Failed to update profile",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setEditableProfileFields({
      username: userInfo.username || "",
      user_nic: userInfo.user_nic || ""
    });
  }, [userInfo.username, userInfo.user_nic]);

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setShowEndSection(false);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const profileChanged = 
        editableProfileFields.username !== userInfo.username ||
        editableProfileFields.user_nic !== userInfo.user_nic;

      if (profileChanged && canEditProfile) {
        await updateProfile();
      }

      const statusHistory = userInfo.user_status || [];
      const currentStatus = statusHistory.length > 0 
        ? String(statusHistory[statusHistory.length - 1].status).toLowerCase()
        : 'inactive';
      
      const statusChanged = 
        (isActive && currentStatus !== "active") ||
        (!isActive && currentStatus === "active");

      const rolesToAdd = userRolesList.filter(role => 
        !userInfo.roles?.includes(role)
      );

      const rolesChanged = rolesToAdd.length > 0;

      const contactsChanged = 
        JSON.stringify(contactNumbers) !== JSON.stringify(originalContactNumbers);

      if (!statusChanged && !rolesChanged && !contactsChanged && !profileChanged) {
        Swal.fire({
          icon: "info",
          title: "No Changes",
          text: "No changes were made to save",
        });
        setEditMode(false);
        return;
      }

      const updatePromises = [];

      if (statusChanged) {
        updatePromises.push(updateUserStatus({
          user_id: Number(user_id),
          status_payload: {
            status: isActive ? "Active" : "Inactive", 
            status_on: new Date().toISOString(), 
            status_by: loggedUserData 
          }
        }));
      }

      if (rolesChanged) {
        updatePromises.push(updateUserRoles(
          Number(user_id),
          rolesToAdd
        ));
      }

      if (contactsChanged) {
        const contactPayload = [];
        const currentDate = new Date().toISOString();
        
        for (let i = 0; i < 2; i++) {
          const originalNumber = originalContactNumbers[i] || "";
          const currentNumber = contactNumbers[i] || "";
          
          if (currentNumber !== originalNumber) {
            if (originalNumber) {
              contactPayload.push({
                contact_number: originalNumber,
                end_dtm: currentDate
              });
            }
            
            if (currentNumber) {
              contactPayload.push({
                contact_number: currentNumber,
              });
            }
          } else if (currentNumber) {
            contactPayload.push({
              contact_number: currentNumber
            });
          }
        }

        if (contactPayload.length > 0) {
          updatePromises.push(updateUserContacts({
            user_id: Number(user_id),
            contact_payload: contactPayload
          }));
        }
      }

      await Promise.all(updatePromises);

      const fetchedData = await getUserDetailsById(user_id);
      if (fetchedData && fetchedData.status === "Success") {
        const updatedStatusHistory = fetchedData.user_status || [];
        const updatedStatus = updatedStatusHistory.length > 0 
          ? String(updatedStatusHistory[updatedStatusHistory.length - 1].status).toLowerCase()
          : 'inactive';

        setIsActive(updatedStatus === "active");
        
        setUserInfo({
          ...fetchedData,
          Remark: fetchedData.Remark || [],
          user_status: updatedStatusHistory
        });

        const updatedContacts = fetchedData.contact_numbers || [];
        while (updatedContacts.length < 2) updatedContacts.push("");
        setContactNumbers([...updatedContacts]);
        setOriginalContactNumbers([...updatedContacts]);
        setUserRolesList([]);
      }

      setEditMode(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "User updated successfully",
      });

    } catch (err) {
      console.error("Update Error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.response?.data?.message || "Failed to update user",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
  };

  const handleEndUser = async () => {
    if (!endDate) {
      Swal.fire({
        title: "Warning",
        text: "End date is required",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
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
      });
      return;
    }

    try {
      const confirmResult = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to terminate this user?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, terminate user!",
        cancelButtonText: "Cancel",
      });

      if (!confirmResult.isConfirmed) {
        return;
      }

      setLoading(true);

      Swal.fire({
        title: "Processing...",
        text: "Please wait while terminating user",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const payload = {
        user_id: Number(user_id),
        created_by: loggedUserData,
        status_reason: remark,
      };

      const response = await endUser(payload);
      console.log("endUser response:", response);

      const isSuccess = response && (
        (typeof response === 'object' && response.message && response.message.includes("terminated successfully")) ||
        (typeof response === 'string' && response.includes("terminated successfully"))
      );

      if (isSuccess) {
        const fetchedData = await getUserDetailsById(user_id);
        if (fetchedData?.status === "Success") {
          setUserInfo({
            username: fetchedData.username || "",
            user_type: fetchedData.user_type || "",
            email: fetchedData.email || "",
            contact_numbers: fetchedData.contact_numbers || [],
            can_user_login: fetchedData.can_user_login || "",
            roles: fetchedData.roles || [],
            user_nic: fetchedData.user_nic || "",
            user_designation: fetchedData.user_designation || "",
            created_on: fetchedData.created_on || "",
            created_by: fetchedData.created_by || "",
            status_on: fetchedData.user_status?.[fetchedData.user_status.length - 1]?.status_on || "",
            status_by: fetchedData.user_status?.[fetchedData.user_status.length - 1]?.status_by || "",
            Remark: fetchedData.Remark || [],
          });
        }

        setShowEndSection(false);
        setRemark("");
        setEndDate(null);

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "User terminated successfully",
        });
      } else {
        throw new Error(response?.message || response || "Failed to terminate user");
      }
    } catch (err) {
      console.error("Error terminating user:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to terminate user",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeRole = (roleToRemove) => {
    const isExistingRole = userInfo.roles?.includes(roleToRemove);
    
    if (isExistingRole) {
      Swal.fire({
        title: 'Remove Role?',
        text: `Are you sure you want to remove the ${roleToRemove} role?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, remove it!'
      }).then((result) => {
        if (result.isConfirmed) {
          setUserInfo(prev => ({
            ...prev,
            roles: prev.roles.filter(role => role !== roleToRemove)
          }));
          
          if (selectedRole === roleToRemove) {
            setSelectedRole("");
          }
        }
      });
    } else {
      setUserRolesList(userRolesList.filter(role => role !== roleToRemove));
      if (selectedRole === roleToRemove) {
        setSelectedRole("");
      }
    }
  };

  const filteredLogHistory = userInfo.Remark?.filter((log) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (log.remark?.toLowerCase().includes(searchLower)) ||
      (log.remark_by?.toLowerCase().includes(searchLower)) ||
      (log.remark_dtm && formatDate(log.remark_dtm).toLowerCase().includes(searchLower))
    );
  }) || [];

  const formatRoleLabel = (value) => {
    return value ? value.split("_").map(word => word[0].toUpperCase() + word.slice(1)).join(" ") : "N/A";
  };

  const StatusToggle = () => (
    <div className="flex justify-end items-center mb-4">
      <div className="flex items-center">
        <label className="inline-flex relative items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isActive}
            onChange={() => setIsActive(!isActive)}
          />
          <div className={`
            w-11 h-6 rounded-full 
            ${isActive ? 'bg-green-600' : 'bg-gray-500'}
            peer peer-focus:ring-4 peer-focus:ring-green-300
            relative transition-colors duration-200
          `}>
            <div className={`
              absolute top-0.5 left-[2px] bg-white border-gray-300
              border rounded-full h-5 w-5 transition-all
              ${isActive ? 'transform translate-x-5' : ''}
            `}></div>
          </div>
          <span className="ml-3 text-sm font-medium">
            {isActive ? "Active" : "Inactive"}
          </span>
        </label>
      </div>
    </div>
  );

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
    <div className={`${GlobalStyle.fontPoppins} px-4 sm:px-6 lg:px-8`}>
      <div className={`${GlobalStyle.headingLarge} mb-6 sm:mb-8`}>
        <span>{user_id} - {userInfo.username}</span>
      </div>

      <div className="w-full flex justify-center">
        <div className={`${GlobalStyle.cardContainer} relative w-full max-w-4xl`}>
          {editMode ? (
            <div className="space-y-4">
              <StatusToggle />
              
              <div>
                <h2 className={`${GlobalStyle.headingMedium} mb-4 sm:mb-4 mt-6 ml-8 underline text-left font-semibold`}>
                  User Profile
                </h2>
  
                <table className="mb-6 w-full ml-14">
                  <tbody>
                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        User Name<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                        {canEditProfile ? (
                          <input
                            type="text"
                            value={editableProfileFields.username}
                            onChange={(e) => handleProfileFieldChange('username', e.target.value)}
                            className={`${GlobalStyle.inputText} w-1/2`}
                            placeholder="Enter username"
                          />
                        ) : (
                          <div>
                            {userInfo.username || "Not specified"}
                            <p className="text-xs text-red-500 mt-1">
                              Username can only be edited within 24 hours of creation
                            </p>
                          </div>
                        )}
                      </td>
                    </tr>

                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        User Mail<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                        {userInfo.email || "Not specified"}
                      </td>
                    </tr>

                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        NIC<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                        {canEditProfile ? (
                          <input
                            type="text"
                            value={editableProfileFields.user_nic}
                            onChange={(e) => handleProfileFieldChange('user_nic', e.target.value)}
                            className={`${GlobalStyle.inputText} w-1/2`}
                            placeholder="Enter NIC"
                          />
                        ) : (
                          <div>
                            {userInfo.user_nic || "Not specified"}
                            <p className="text-xs text-red-500 mt-1">
                              NIC can only be edited within 24 hours of creation
                            </p>
                          </div>
                        )}
                      </td>
                    </tr>

                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        Designation<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                        {userInfo.user_designation || "Not specified"}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <h2 className={`${GlobalStyle.headingMedium} mb-4 sm:mb-4 mt-8 ml-8 underline text-left font-semibold`}>
                  Contact Details
                </h2>
                
                <table className="mb-6 w-full ml-14">
                  <tbody>
                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        Contact No 01<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                        <input
                          type="text"
                          value={contactNumbers[0] || ""}
                          onChange={(e) => handleContactNumberChange(0, e.target.value)}
                          className={`${GlobalStyle.inputText} w-1/2`}
                          placeholder="Enter contact number"
                        />
                      </td>
                    </tr>

                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        Contact No 02<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                        <input
                          type="text"
                          value={contactNumbers[1] || ""}
                          onChange={(e) => handleContactNumberChange(1, e.target.value)}
                          className={`${GlobalStyle.inputText} w-1/2`}
                          placeholder="Enter contact number"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table className="mb-6 w-full ml-8">
                  <tbody>
                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        User type<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                        {userInfo.user_type || "Not specified"}
                      </td>
                    </tr>

                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        Login Method<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                        {userInfo.can_user_login || "Not specified"}
                      </td>
                    </tr>

                    <tr className="block sm:table-row ">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        User Role<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-left block sm:table-cell`}>
                        <div className="flex flex-col gap-2">
                          <select
                            value={selectedRole}
                            onChange={(e) => {
                              const newRole = e.target.value;
                              if (newRole && ![...userInfo.roles, ...userRolesList].includes(newRole)) {
                                setSelectedRole(newRole);
                                setUserRolesList([...userRolesList, newRole]);
                              }
                            }}
                            className={`${GlobalStyle.selectBox} w-full sm:w-3/4`}
                            style={{ color: selectedRole === "" ? "gray" : "black" }}
                          >
                            <option value="" disabled hidden>
                              Select Role
                            </option>
                            {userRoles.map((role) => (
                              <option
                                key={role.value}
                                value={role.value}
                                hidden={role.hidden}
                                style={{ color: "black" }}
                                disabled={[...userInfo.roles, ...userRolesList].includes(role.value)}
                              >
                                {role.label}
                              </option>
                            ))}
                          </select>

                          {([...userInfo.roles, ...userRolesList].length > 0) && (
                            <div className={`${GlobalStyle.inputText} w-full sm:w-3/4 flex flex-wrap items-center gap-2 mt-4 p-2`}>
                              {userInfo.roles?.map((role, index) => (
                                <div key={`prev-${index}`} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                                  <span className="text-blue-900 mr-2">
                                    {userRoles.find(r => r.value === role)?.label || formatRoleLabel(role)}
                                  </span>
                                  <button
                                    onClick={() => removeRole(role)}
                                    className="text-blue-900 hover:text-red-600 font-bold"
                                    title="Remove role"
                                    type="button"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                              
                              {userRolesList.map((role, index) => (
                                <div key={`new-${index}`} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                                  <span className="text-blue-900 mr-2">
                                    {userRoles.find(r => r.value === role)?.label || role}
                                  </span>
                                  <button
                                    onClick={() => removeRole(role)}
                                    className="text-blue-900 hover:text-red-600 font-bold"
                                    title="Remove role"
                                    type="button"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>

                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        Created On<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                        {formatDate(userInfo.created_on) || "Not specified"}
                      </td>
                    </tr>

                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        Created By<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                        {userInfo.created_by || "Not specified"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={handleSave}
                  className={`${GlobalStyle.buttonPrimary} px-4 sm:px-6 py-2`}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => {
                    if (userInfo.user_status !== "terminate") {
                      setEditMode(true);
                    }
                  }}
                  className={`${userInfo.user_status === "terminate" ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={userInfo.user_status === "terminate"}
                >
                  <img
                    src={edit}
                    alt="Edit"
                    className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg cursor-pointer w-10 sm:w-14"
                    title="Edit"
                  />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="mb-6 sm:mb-8 w-full">
                  <tbody>
                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        User type<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                        {userInfo.user_type || "Not specified"}
                      </td>
                    </tr>

                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        User Mail<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                        {userInfo.email || "Not specified"}
                      </td>
                    </tr>

                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        Contact No.<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                        {contactNumbers[0] || "Not specified"}
                      </td>
                    </tr>

                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        Login Method<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                        {userInfo.can_user_login || "Not specified"}
                      </td>
                    </tr>

                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        User Role<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                        {userInfo.roles?.map(role => formatRoleLabel(role)).join(", ") || "Not specified"}
                      </td>
                    </tr>

                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        Created On<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                        {formatDate(userInfo.created_on) || "Not specified"}
                      </td>
                    </tr>

                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        Created By<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                        {userInfo.created_by || "Not specified"}
                      </td>
                    </tr>

                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        Status On<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                        {formatDate(userInfo.status_on) || "Not specified"}
                      </td>
                    </tr>

                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        Status By<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                        {userInfo.status_by || "Not specified"}
                      </td>
                    </tr>

                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        NIC<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                        {userInfo.user_nic || "Not specified"}
                      </td>
                    </tr>

                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        Designation<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                        {userInfo.user_designation || "Not specified"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {showEndSection && (
        <div className="w-full flex justify-center mt-6">
          <div className={`${GlobalStyle.cardContainer} relative w-full max-w-4xl px-4 sm:px-6`}>
            <table className={`${GlobalStyle.table} w-full text-left`}>
              <tbody className="space-y-4 sm:space-y-0">
                <tr className="block sm:table-row">
                  <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap hidden sm:table-cell w-1/3 sm:w-1/4`}>
                    End Date <span className="text-red-500">*</span>
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

                <tr className="block sm:table-row">
                  <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap hidden sm:table-cell w-1/3 sm:w-1/4`}>
                    Remark <span className="text-red-500">*</span>
                  </td>
                  <td className="w-4 text-left hidden sm:table-cell">:</td>
                  <td className={`${GlobalStyle.tableData} hidden sm:table-cell`}>
                    <textarea
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      rows="4"
                      className={`${GlobalStyle.inputText} w-full text-left`}
                      placeholder="Enter reason for terminating user"
                      required
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleEndUser}
                className={`${GlobalStyle.buttonPrimary} w-full sm:w-auto`}
              >
                End
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between mx-8 mt-6">
        <div className="flex flex-col items-start">
          <button
            className={`${GlobalStyle.buttonPrimary}`}
            onClick={() => setShowPopup(true)}
          >
            Log History
          </button>

          <div style={{ marginTop: '15px' }}>
            <button 
              className={`${GlobalStyle.buttonPrimary}`}
              onClick={goBack}
            >
              <FaArrowLeft />
            </button>
          </div>
        </div>
        
        <div className="flex justify-end h-fit">
          {!editMode && !showEndSection && (
            <button
              onClick={() => {
                if (userInfo.user_status !== "terminate") {
                  setShowEndSection(true);
                }
              }}
              className={`${GlobalStyle.buttonPrimary} ${
                userInfo.user_status === "terminate" 
                  ? "opacity-50 cursor-not-allowed" 
                  : ""
              }`}
              disabled={userInfo.user_status === "terminate"}
            >
              End
            </button>
          )}
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg w-3/4 max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Log History</h2>
              <button
                onClick={() => setShowPopup(false)}
                className="text-red-500 text-lg font-bold"
              >
                ×
              </button>
            </div>

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
            
            <div className="p-6 overflow-auto max-h-[70vh]">
              <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
                <table className={GlobalStyle.table}>
                  <thead className={GlobalStyle.thead}>
                    <tr>
                      <th scope="col" className={GlobalStyle.tableHeader}>Date</th>
                      <th scope="col" className={GlobalStyle.tableHeader}>Action</th>
                      <th scope="col" className={GlobalStyle.tableHeader}>Edited By</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredLogHistory.length > 0 ? (
                      filteredLogHistory.map((log, index) => (
                        <tr
                          key={index}
                          className={`${index % 2 === 0 ? GlobalStyle.tableRowEven : GlobalStyle.tableRowOdd} border-b`}
                        >
                          <td className={`${GlobalStyle.tableData} text-xs lg:text-sm`}>
                            {formatDate(log.remark_dtm) || "N/A"}
                          </td>
                          <td className={`${GlobalStyle.tableData} text-xs lg:text-sm`}>
                            {log.remark || "N/A"}
                          </td>
                          <td className={`${GlobalStyle.tableData} text-xs lg:text-sm`}>
                            {log.remark_by || "N/A"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center py-4">
                          {searchQuery ? "No matching results found" : "No results found"}
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

export default UserInfo;