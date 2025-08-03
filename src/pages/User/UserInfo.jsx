// /* Purpose: This template is used for the 17.2 - User Info .
// Created Date: 2025-06-07
// Created By: sakumini (sakuminic@gmail.com)
// Version: node 20
// ui number :17.2
// Dependencies: tailwind css
// Related Files: (routes)
// Notes:The following page conatins the code for the User Info Screen */


// import { useEffect, useState } from "react";
// import GlobalStyle from "../../assets/prototype/GlobalStyle";
// import edit from "../../assets/images/edit-info.svg";
// import add from "../../assets/images/user-add.svg";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import Swal from "sweetalert2";
// import { endUser, getUserDetailsById, updateUserDetails } from "../../services/user/user_services";
// import completeIcon from "../../assets/images/complete.png";
// import remove from "../../assets/images/remove.svg";
// import { useLocation, useNavigate } from "react-router-dom";
// import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
// import { getLoggedUserId } from "../../services/auth/authService";

// const UserInfo = () => {
//   const location = useLocation();
//   const user_id = location.state?.user_id;

//   const goBack = () => {
//         navigate(-1); 
//         };

//   const [currentPage, setCurrentPage] = useState(0);
//   const rowsPerPage = 10;

//   const [loggedUserData, setLoggedUserData] =useState("");

//   const [searchQuery, setSearchQuery] = useState("");
//   const navigate = useNavigate();
//   const [selectedRole, setSelectedRole] = useState("");
//   const [endDate, setEndDate] = useState(null);
//   const [remark, setRemark] = useState("");
//   const [isActive, setIsActive] = useState(true);
//   const [emailError, setEmailError] = useState("");
//   const [showPopup, setShowPopup] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [userInfo, setUserInfo] = useState({
//     username: "",
//     user_type: "",
//     email: "",
//     contact_num: "",
//     login_method: "",
//     role: "",
//     Created_DTM: "",
//     Created_BY: "",
//     Approved_DTM: "",
//     Approved_By: "",
//     Remark: [],
//   });

//   const [formData, setFormData] = useState({
//     userType: "",
//     userMail: "",
//     contact_num: "",
//     loginMethod: "",
//     userRole: "",
//     createdOn: "",
//     createdBy: "",
//     approvedOn: "",
//     approvedBy: "",
//   });

//   const [isEditing, setIsEditing] = useState(false);
//   const [showEndSection, setShowEndSection] = useState(false);

//   // Available roles dropdown
//   const userRoles = [
//     { value: "", label: "User Role", hidden: true },
//     { value: "GM", label: "GM" },
//     { value: "DGM", label: "DGM" },
//     { value: "legal_officer", label: "Legal Officer" },
//     { value: "manager", label: "Manager" },
//     { value: "slt_coordinator", label: "SLT Coordinator" },
//     { value: "DRC_user", label: "DRC User" },
//     { value: "recovery_staff", label: "Recovery Staff" },
//     { value: "rtom", label: "RTOM" }
//   ];


//   // get system user
//   const loadUser = async () => {
//     const user = await getLoggedUserId();
//     setLoggedUserData(user);
//   };

//   useEffect(() => {
//     const fetchUserInfoById = async () => {
//       try {
//         setLoading(true);
//         const fetchedData = await getUserDetailsById(user_id);
//         console.log(fetchedData);
        

//         if (fetchedData) {
//           setUserInfo(fetchedData.data);
//           setIsActive(fetchedData.data.user_status === "Active");
//           // Set formData for editing
//           setFormData({
//             userType: fetchedData.data.user_type || "",
//             userMail: fetchedData.data.email || "",
//             contact_num: fetchedData.data.contact_num && fetchedData.data.contact_num.length > 0
//                 ? fetchedData.data.contact_num[0].contact_number
//                 : "N/A",
//             loginMethod: fetchedData.data.login_method || "",
//             userRole: fetchedData.data.role || "",
//             createdOn: fetchedData.data.Created_DTM || "",
//             createdBy: fetchedData.data.Created_BY || "",
//             approvedOn: fetchedData.data.Approved_DTM || "",
//             approvedBy: fetchedData.data.Approved_By || "",
//           });

//           setSelectedRole(fetchedData.data.role);

//         }
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching User info:", err);
//         setError("Failed to load user information. Please try again later.")
//         setLoading(false);

//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: "Failed to load User information",
//         });
//       }
//     };

//     loadUser();
//     fetchUserInfoById();
//   }, [user_id]);

//   const toggleEdit = () => {
//     setIsEditing(!isEditing);
//     setShowEndSection(false);
//     setEmailError("");
//   };

//   const handleSave = async () => {
//     if (!remark.trim()) {
//       Swal.fire({
//         title: "Warning",
//         text: "Remark is required",
//         icon: "warning",
//         allowOutsideClick: false,
//         allowEscapeKey: false,
//       });
//       return;
//     }

//     try {
//       setLoading(true);

//       const updateData = {
//         user_id: String(user_id),
//         updated_by: loggedUserData,
//         role: selectedRole,
//         user_status: isActive ? "Active" : "Inactive",
//         remark: remark
//       };

//       const response = await updateUserDetails(updateData);

//       if (response.status === "success") {
//         const fetchedData = await getUserDetailsById(user_id);
//         if (fetchedData) {
//           setUserInfo(fetchedData.data);
//         }

//         setRemark("");
//         toggleEdit();

//         Swal.fire({
//           icon: "success",
//           title: "Success",
//           text: "User details updated successfully",
//         });
//       }
//     } catch (err) {
//       console.error("Error updating user:", err);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: err.message || "Failed to update user details",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "Not specified";

//     const date = new Date(dateString);
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");

//     return `${year}/${month}/${day}`;
//   };

//   const handleEndUser = async () => {
//     if (!endDate) {
//       Swal.fire({
//         title: "Warning",
//         text: "End date is required",
//         icon: "warning",
//         allowOutsideClick: false,
//         allowEscapeKey: false,
//       });
//       return;
//     }

//     if (!remark.trim()) {
//       Swal.fire({
//         title: "Warning",
//         text: "Remark is required",
//         icon: "warning",
//         allowOutsideClick: false,
//         allowEscapeKey: false,
//       });
//       return;
//     }

//     try {
//       const confirmResult = await Swal.fire({
//         title: "Are you sure?",
//         text: "Do you really want to terminate this user?",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#d33",
//         cancelButtonColor: "#3085d6",
//         confirmButtonText: "Yes, terminate user!",
//         cancelButtonText: "Cancel",
//       });
  
//       if (!confirmResult.isConfirmed) {
//         return;
//       }
  
//       setLoading(true);

//       Swal.fire({
//         title: "Processing...",
//         text: "Please wait while terminating user",
//         allowOutsideClick: false,
//         didOpen: () => {
//           Swal.showLoading();
//         },
//       });

//       const payload = {
//         user_id,
//         end_by: loggedUserData,
//         end_dtm: endDate.toISOString(),
//         remark,
//       };

//       const response = await endUser(payload);
//       console.log(response);
      
//       // Refresh user data if termination succeeded
//       const fetchedData = await getUserDetailsById(user_id);
//       if (fetchedData?.data) {
//         setUserInfo(fetchedData.data);
//       }

//       // Reset UI
//       setShowEndSection(false);
//       setRemark("");
//       setEndDate(null);

//       Swal.fire({
//         icon: "success",
//         title: "Success",
//         text: "User terminated successfully",
//       });
//     } catch (err) {
//       console.error("Error terminating user:", err);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: err.message || "Failed to terminate user",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter log history based on search query
//   const filteredLogHistory = userInfo.Remark?.filter((log) => {
//     const searchLower = searchQuery.toLowerCase();
//     return (
//       (log.remark && log.remark.toLowerCase().includes(searchLower)) ||
//       (log.remark_by && log.remark_by.toLowerCase().includes(searchLower)) ||
//       (log.remark_dtm && formatDate(log.remark_dtm).toLowerCase().includes(searchLower))
//     );
//   }) || [];

//   const formatRoleLabel = (value) => {
//     if (!value) return "N/A";

//     return value
//       .split("_")
//       .map(word => word[0].toUpperCase() + word.slice(1))
//       .join(" ");
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-red-500">{error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className={`${GlobalStyle.fontPoppins} px-4 sm:px-6 lg:px-8`}>
//       <div className={`${GlobalStyle.headingLarge} mb-6 sm:mb-8`}>
//         <span>{user_id} - {userInfo.username}</span>
//       </div>

//       {/* Card box */}
//       <div className="w-full flex justify-center">
//         <div className={`${GlobalStyle.cardContainer} relative  w-full max-w-4xl`}>
//           {/* Edit Mode UI */}
//           {isEditing ? (
//             <div className="space-y-4">
//               <div className="flex justify-end items-center mb-4">
//                 <div className="flex items-center">
//                   {/* Active or Inactive User */}
//                   <label className="inline-flex relative items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       className="sr-only peer"
//                       checked={isActive}
//                       onChange={() => setIsActive(!isActive)}
//                     />
//                     <div className="w-11 h-6 bg-gray-500 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
//                   </label>
//                 </div>
//               </div>

//               {/* Edit Table */}
//               <div className="overflow-x-auto">
//                 <table className="mb-6 sm:mb-8 w-full">
//                   <tbody>
//                     {/* User type */}
//                     {/* <tr className="align-middle">
//                       <td className="w-[150px] sm:w-[164px] align-middle">
//                         <p className={`${GlobalStyle.paragraph} mb-2 align-middle`}>
//                           User Type
//                         </p>
//                       </td>
//                       <td className="text-center w-4 sm:w-auto align-middle">
//                         :
//                       </td>
//                       <td className="w-2/3 sm:w-auto align-middle">
//                         <label className={`${GlobalStyle.headingSmall} align-middle`}>
//                           {formData.userType || "N/A"}
//                         </label>
//                       </td>
//                     </tr> */}

//                     <tr className="block sm:table-row">
//                       <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
//                         User type<span className="sm:hidden">:</span>
//                       </td>
//                       <td className="w-4 text-left hidden sm:table-cell">:</td>
//                       <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
//                         {userInfo.user_type ||
//                           "Not specified"}
//                       </td>
//                     </tr>

//                     {/* User Mail */}
//                     {/* <tr className="align-middle">
//                       <td className="w-1/3 sm:w-auto align-middle">
//                         <p className={`${GlobalStyle.paragraph} mb-2 align-middle`}>
//                           User Mail
//                         </p>
//                       </td>
//                       <td className="text-center w-4 sm:w-auto align-middle">
//                         :
//                       </td>
//                       <td className="w-2/3 sm:w-auto align-middle">
//                         <label className={`${GlobalStyle.headingSmall} align-middle`}>
//                           {formData.userMail || "N/A"}
//                         </label>
//                       </td>
//                     </tr> */}
                    
//                     <tr className="block sm:table-row">
//                       <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
//                         User Mail<span className="sm:hidden">:</span>
//                       </td>
//                       <td className="w-4 text-left hidden sm:table-cell">:</td>
//                       <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
//                         {userInfo.email ||
//                           "Not specified"}
//                       </td>
//                     </tr>

//                     {/* User Contact */}
//                     {/* <tr className="align-middle">
//                       <td className="w-1/3 sm:w-auto align-middle">
//                         <p className={`${GlobalStyle.paragraph} mb-2 align-middle`}>
//                           Contact No.
//                         </p>
//                       </td>
//                       <td className="text-center w-4 sm:w-auto align-middle">
//                         :
//                       </td>
//                       <td className="w-2/3 sm:w-auto align-middle">
//                         <label className={`${GlobalStyle.headingSmall} align-middle`}>
//                           {formData.contact_num.contact_number || "N/A"}
//                         </label>
//                       </td>
//                     </tr> */}

//                     <tr className="block sm:table-row">
//                       <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
//                         Contact No.<span className="sm:hidden">:</span>
//                       </td>
//                       <td className="w-4 text-left hidden sm:table-cell">:</td>
//                       <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
//                           {Array.isArray(userInfo.contact_num) && userInfo.contact_num.length > 0
//                             ? userInfo.contact_num[0].contact_number
//                             : "Not specified"}
//                       </td>
//                     </tr>

//                     {/* Login Method */}
//                     {/* <tr className="align-middle">
//                       <td className="w-1/3 sm:w-auto align-middle">
//                         <p className={`${GlobalStyle.paragraph} mb-2 align-middle`}>
//                           Login Method
//                         </p>
//                       </td>
//                       <td className="text-center w-4 sm:w-auto align-middle">
//                         :
//                       </td>
//                       <td className="w-2/3 sm:w-auto align-middle">
//                         <label className={`${GlobalStyle.headingSmall} align-middle`}>
//                           {formData.loginMethod || "N/A"}
//                         </label>
//                       </td>
//                     </tr> */}

//                     <tr className="block sm:table-row">
//                       <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
//                         Login Method<span className="sm:hidden">:</span>
//                       </td>
//                       <td className="w-4 text-left hidden sm:table-cell">:</td>
//                       <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
//                         {userInfo.login_method ||
//                           "Not specified"}
//                       </td>
//                     </tr>

//                     {/* User Role */}
//                     {/* <tr className="align-middle">
//                         <td className="w-1/3 sm:w-auto align-middle">
//                           <label className={`${GlobalStyle.paragraph} mb-2 align-middle`}>
//                             User Role
//                           </label>
//                         </td>
//                         <td className="text-center align-middle w-4 sm:w-auto">
//                           :
//                         </td>
//                         <td className="w-2/3 sm:w-auto">
//                           <div className="flex items-center space-x-2 my-2">
//                             <select
//                               value={selectedRole}
//                               onChange={(e) => setSelectedRole(e.target.value)}
//                               className={`${GlobalStyle.selectBox} w-full`}
//                               style={{ color: selectedRole === "" ? "gray" : "black" }}
//                             >
//                               {userRoles.map((role) => (
//                                 <option
//                                   key={role.value}
//                                   value={role.value}
//                                   hidden={role.hidden}
//                                   style={{ color: "black" }}
//                                 >
//                                   {role.label}
//                                 </option>
//                               ))}
//                             </select>
//                           </div>
//                         </td>
//                     </tr> */}

//                     <tr className="block sm:table-row">
//                       <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
//                         User Role<span className="sm:hidden">:</span>
//                       </td>
//                       <td className="w-4 text-left hidden sm:table-cell">:</td>
//                       <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
//                         <div className="flex items-center space-x-2">
//                           <select
//                             value={selectedRole}
//                             onChange={(e) => setSelectedRole(e.target.value)}
//                             className={`${GlobalStyle.selectBox} w-full`}
//                             style={{ color: selectedRole === "" ? "gray" : "black" }}
//                           >
//                             {userRoles.map((role) => (
//                               <option
//                                 key={role.value}
//                                 value={role.value}
//                                 hidden={role.hidden}
//                                 style={{ color: "black" }}
//                               >
//                                 {role.label}
//                               </option>
//                             ))}
//                           </select>
//                         </div>
//                       </td>
//                     </tr>

//                     <tr className="h-2"></tr>

//                     {/* Created On */}
//                     {/* <tr>
//                       <td className="w-1/3 sm:w-auto">
//                         <label className={`${GlobalStyle.paragraph} mb-2`}>
//                           Created On
//                         </label>
//                       </td>
//                       <td className="text-center align-middle w-4 sm:w-auto">
//                         :
//                       </td>
//                       <td className="w-2/3 sm:w-auto">
//                         <label className={GlobalStyle.headingSmall}>
//                           {formatDate(formData.createdOn) || "N/A"}
//                         </label>
//                       </td>
//                     </tr> */}

//                     <tr className="block sm:table-row">
//                       <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
//                         Created On<span className="sm:hidden">:</span>
//                       </td>
//                       <td className="w-4 text-left hidden sm:table-cell">:</td>
//                       <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
//                         {formatDate(userInfo.Created_DTM) ||
//                           "Not specified"}
//                       </td>
//                     </tr>

//                     <tr className="h-2"></tr>

//                     {/* Created by */}
//                     {/* <tr>
//                       <td className="w-1/3 sm:w-auto">
//                         <label className={`${GlobalStyle.paragraph} mb-2`}>
//                           Created By
//                         </label>
//                       </td>
//                       <td className="text-center align-middle w-4 sm:w-auto">
//                         :
//                       </td>
//                       <td className="w-2/3 sm:w-auto">
//                         <label className={GlobalStyle.headingSmall}>
//                           {formData.createdBy || "N/A"}
//                         </label>
//                       </td>
//                     </tr> */}

//                     <tr className="block sm:table-row">
//                       <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
//                         Created By<span className="sm:hidden">:</span>
//                       </td>
//                       <td className="w-4 text-left hidden sm:table-cell">:</td>
//                       <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
//                         {userInfo.Created_BY||
//                           "Not specified"}
//                       </td>
//                     </tr>

//                     <tr className="h-2"></tr>

//                     {/* Approved on */}
//                     {/* <tr>
//                       <td className="w-1/3 sm:w-auto">
//                         <label className={`${GlobalStyle.paragraph} mb-2`}>
//                           Approved On
//                         </label>
//                       </td>
//                       <td className="text-center align-middle w-4 sm:w-auto">
//                         :
//                       </td>
//                       <td className="w-2/3 sm:w-auto">
//                         <label className={GlobalStyle.headingSmall}>
//                           {formatDate(formData.approvedOn) || "N/A"}
//                         </label>
//                       </td>
//                     </tr> */}
//                     <tr className="block sm:table-row">
//                       <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
//                         Approved On<span className="sm:hidden">:</span>
//                       </td>
//                       <td className="w-4 text-left hidden sm:table-cell">:</td>
//                       <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
//                         {formatDate(UserInfo.Approved_DTM)||
//                           "Not specified"}
//                       </td>
//                     </tr>
                    
//                     <tr className="h-2"></tr>

//                     {/* Approved by */}
//                     {/* <tr>
//                       <td className="w-1/3 sm:w-auto">
//                         <label className={`${GlobalStyle.paragraph}`}>
//                           Approved By
//                         </label>
//                       </td>
//                       <td className="text-center align-middle w-4 sm:w-auto">
//                         :
//                       </td>
//                       <td className="w-2/3 sm:w-auto">
//                         <label className={GlobalStyle.headingSmall}>
//                           {formData.approvedBy || "N/A"}
//                         </label>
//                       </td>
//                     </tr> */}
//                     <tr className="block sm:table-row">
//                       <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
//                         Approved By<span className="sm:hidden">:</span>
//                       </td>
//                       <td className="w-4 text-left hidden sm:table-cell">:</td>
//                       <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
//                         {userInfo.Approved_By||
//                           "Not specified"}
//                       </td>
//                     </tr>

//                   </tbody>
//                 </table>

//                 {/* Remark */}
//                 {/* <div className="flex flex-col sm:flex-row sm:items-start gap-2">
//                   <label
//                     className={`${GlobalStyle.paragraph} sm:w-1/4 whitespace-nowrap`}
//                   >
//                     Remark
//                   </label>
//                   <span className="hidden sm:inline-block">:</span>
//                   <textarea
//                     className={`${GlobalStyle.inputText} w-full h-40`}
//                     value={remark}
//                     onChange={(e) => setRemark(e.target.value)}
//                     placeholder="Enter remark for this update..."
//                   />
//                 </div> */}

//                 <table className={`${GlobalStyle.table} min-w-full mt-4`}>
//                   <tbody>
//                     <tr>
//                       <td
//                         className={`${GlobalStyle.tableData} underline whitespace-nowrap text-left w-1/3 sm:w-1/4 font-semibold`}
//                       >
//                         Remark
//                       </td>
//                     </tr>
//                     <tr>
//                       <td
//                         className={`${GlobalStyle.tableData} break-words text-left`}
//                       >
//                         <textarea
//                           value={remark}
//                           onChange={(e) => setRemark(e.target.value)}
//                           className="border border-gray-300 rounded px-2 py-1 w-full min-h-[100px] resize-y"
//                           placeholder="Enter remarks here..."
//                         ></textarea>
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>


//               </div>

//               {/* Save button in edit mode */}
//               <div className="flex justify-end mt-4">
//                 <button
//                   onClick={handleSave}
//                   className={GlobalStyle.buttonPrimary}
//                   disabled={loading}
//                 >
//                   {loading ? "Saving..." : "Save"}
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <>
//               {/* View Mode UI */}
//               <div className="flex justify-end mb-4">
//                 <button
//                   onClick={() => {
//                     if (userInfo.user_status !== "Terminate") {
//                       toggleEdit();
//                     }
//                   }}
//                   className={`${
//                     userInfo.user_status === "Terminate" 
//                       ? "opacity-50 cursor-not-allowed" 
//                       : ""
//                   }`}
//                   disabled={userInfo.user_status === "Terminate"}
//                 >
//                   <img
//                     src={edit}
//                     alt="Edit"
//                     className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg cursor-pointer w-10 sm:w-14"
//                     title="Edit"
//                   />
//                 </button>
//               </div>

//               {/* View Table */}
//               <div className="overflow-x-auto">
//                 <table className="mb-6 sm:mb-8 w-full">
//                   <tbody>
//                     {/* User type */}
//                     {/* <tr>
//                       <td className="w-[170px] lg:w-[164px] align-middle">
//                         <p className={`${GlobalStyle.paragraph} mb-2`}>
//                           User Type
//                         </p>
//                       </td>
//                       <td className="text-center align-middle w-4 sm:w-auto">
//                         :
//                       </td>
//                       <td className="w-2/3 sm:w-auto">
//                         <label className={GlobalStyle.headingSmall}>
//                           {userInfo.user_type || "N/A"}
//                         </label>
//                       </td>
//                     </tr> */}

//                     <tr className="block sm:table-row">
//                       <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
//                         User type<span className="sm:hidden">:</span>
//                       </td>
//                       <td className="w-4 text-left hidden sm:table-cell">:</td>
//                       <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
//                         {userInfo.user_type ||
//                           "Not specified"}
//                       </td>
//                     </tr>

//                     {/* User Mail */}
//                     {/* <tr>
//                       <td className="w-1/3 sm:w-auto">
//                         <p className={`${GlobalStyle.paragraph} mb-2`}>
//                           User Mail
//                         </p>
//                       </td>
//                       <td className="text-center align-middle w-4 sm:w-auto">
//                         :
//                       </td>
//                       <td className="w-2/3 sm:w-auto">
//                         <label className={GlobalStyle.headingSmall}>
//                           {userInfo.email || "N/A"}
//                         </label>
//                       </td> */}
                    
//                     <tr className="block sm:table-row">
//                       <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
//                         User Mail<span className="sm:hidden">:</span>
//                       </td>
//                       <td className="w-4 text-left hidden sm:table-cell">:</td>
//                       <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
//                         {userInfo.email ||
//                           "Not specified"}
//                       </td>
//                     </tr>

//                     {/* User Contact */}
//                     {/* <tr className="align-middle">
//                       <td className="w-1/3 sm:w-auto align-middle">
//                         <p className={`${GlobalStyle.paragraph} mb-2 align-middle`}>
//                           Contact No.
//                         </p>
//                       </td>
//                       <td className="text-center w-4 sm:w-auto align-middle">
//                         :
//                       </td>
//                       <td className="w-2/3 sm:w-auto align-middle">
//                         <label className={`${GlobalStyle.headingSmall} align-middle`}>
//                           {Array.isArray(userInfo.contact_num) && userInfo.contact_num.length > 0
//                             ? userInfo.contact_num[0].contact_number
//                             : "N/A"}
//                         </label>
//                       </td>
//                     </tr> */}

//                     <tr className="block sm:table-row">
//                       <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
//                         Contact No.<span className="sm:hidden">:</span>
//                       </td>
//                       <td className="w-4 text-left hidden sm:table-cell">:</td>
//                       <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
//                           {Array.isArray(userInfo.contact_num) && userInfo.contact_num.length > 0
//                             ? userInfo.contact_num[0].contact_number
//                             : "Not specified"}
//                       </td>
//                     </tr>

//                     {/* Login Method */}
//                     {/* <tr>
//                       <td className="w-1/3 sm:w-auto">
//                         <p className={`${GlobalStyle.paragraph} mb-2`}>
//                           Login Method
//                         </p>
//                       </td>
//                       <td className="text-center align-middle w-4 sm:w-auto">
//                         :
//                       </td>
//                       <td className="w-2/3 sm:w-auto">
//                         <label className={GlobalStyle.headingSmall}>
//                           {userInfo.login_method || "N/A"}
//                         </label>
//                       </td>
//                     </tr> */}

//                     <tr className="block sm:table-row">
//                       <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
//                         Login Method<span className="sm:hidden">:</span>
//                       </td>
//                       <td className="w-4 text-left hidden sm:table-cell">:</td>
//                       <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
//                         {userInfo.login_method ||
//                           "Not specified"}
//                       </td>
//                     </tr>


//                     {/* User Roles */}
//                     {/* <tr>
//                       <td className="w-1/3 sm:w-auto">
//                         <p className={`${GlobalStyle.paragraph} mb-2`}>
//                           User Role
//                         </p>
//                       </td>
//                       <td className="text-center align-middle w-4 sm:w-auto">
//                         :
//                       </td>
//                       <td className="w-2/3 sm:w-auto">
//                         <label className={GlobalStyle.headingSmall}>
//                           {formatRoleLabel(userInfo.role)}
//                         </label>
//                       </td>
//                     </tr> */}

//                     <tr className="block sm:table-row">
//                       <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
//                         User Role<span className="sm:hidden">:</span>
//                       </td>
//                       <td className="w-4 text-left hidden sm:table-cell">:</td>
//                       <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
//                         {formatRoleLabel(userInfo.role) ||
//                           "Not specified"}
//                       </td>
//                     </tr>

//                     {/* Created On */}
//                     {/* <tr>
//                       <td className="w-1/3 sm:w-auto">
//                         <p className={`${GlobalStyle.paragraph} mb-2`}>
//                           Created On
//                         </p>
//                       </td>
//                       <td className="text-center align-middle w-4 sm:w-auto">
//                         :
//                       </td>
//                       <td className="w-2/3 sm:w-auto">
//                         <label className={GlobalStyle.headingSmall}>
//                           {formatDate(userInfo.Created_DTM) || "N/A"}
//                         </label>
//                       </td>
//                     </tr> */}
//                     <tr className="block sm:table-row">
//                       <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
//                         Created On<span className="sm:hidden">:</span>
//                       </td>
//                       <td className="w-4 text-left hidden sm:table-cell">:</td>
//                       <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
//                         {formatDate(userInfo.Created_DTM) ||
//                           "Not specified"}
//                       </td>
//                     </tr>

//                     {/* Created by */}
//                     {/* <tr>
//                       <td className="w-1/3 sm:w-auto">
//                         <p className={`${GlobalStyle.paragraph} mb-2`}>
//                           Created By
//                         </p>
//                       </td>
//                       <td className="text-center align-middle w-4 sm:w-auto">
//                         :
//                       </td>
//                       <td className="w-2/3 sm:w-auto">
//                         <label className={GlobalStyle.headingSmall}>
//                           {userInfo.Created_BY || "N/A"}
//                         </label>
//                       </td>
//                     </tr> */}

//                     <tr className="block sm:table-row">
//                       <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
//                         Created By<span className="sm:hidden">:</span>
//                       </td>
//                       <td className="w-4 text-left hidden sm:table-cell">:</td>
//                       <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
//                         {userInfo.Created_BY||
//                           "Not specified"}
//                       </td>
//                     </tr>

//                     {/* Approved on */}
//                     {/* <tr>
//                       <td className="w-1/3 sm:w-auto">
//                         <p className={`${GlobalStyle.paragraph} mb-2`}>
//                           Approved On
//                         </p>
//                       </td>
//                       <td className="text-center align-middle w-4 sm:w-auto">
//                         :
//                       </td>
//                       <td className="w-2/3 sm:w-auto">
//                         <label className={GlobalStyle.headingSmall}>
//                           {formatDate(userInfo.Approved_DTM) || "N/A"}
//                         </label>
//                       </td>
//                     </tr> */}
//                     <tr className="block sm:table-row">
//                       <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
//                         Approved On<span className="sm:hidden">:</span>
//                       </td>
//                       <td className="w-4 text-left hidden sm:table-cell">:</td>
//                       <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
//                         {formatDate(UserInfo.Approved_DTM)||
//                           "Not specified"}
//                       </td>
//                     </tr>

//                     {/* Approved by */}
//                     {/* <tr>
//                       <td className="w-1/3 sm:w-auto">
//                         <p className={`${GlobalStyle.paragraph} mb-2`}>
//                           Approved By
//                         </p>
//                       </td>
//                       <td className="text-center align-middle w-4 sm:w-auto">
//                         :
//                       </td>
//                       <td className="w-2/3 sm:w-auto">
//                         <label className={GlobalStyle.headingSmall}>
//                           {userInfo.Approved_By || "N/A"}
//                         </label>
//                       </td>
//                     </tr> */}
//                     <tr className="block sm:table-row">
//                       <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
//                         Approved By<span className="sm:hidden">:</span>
//                       </td>
//                       <td className="w-4 text-left hidden sm:table-cell">:</td>
//                       <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
//                         {userInfo.Approved_By||
//                           "Not specified"}
//                       </td>
//                     </tr>

//                   </tbody>
//                 </table>
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* End Date and Remark Section */}
//       {showEndSection && (
//       // <div className={`${GlobalStyle.flexCenter} px-2 sm:px-4 lg:px-8`}>
//       //   <div className={`${GlobalStyle.cardContainer} p-3 sm:p-4 md:p-6 lg:p-8 w-full max-w-full sm:max-w-2xl md:max-w-4xl mx-auto`}>
//       //       <div className="space-y-4">
//       //         {/* End Date Picker */}
//       //         <div className="flex flex-col sm:flex-row sm:items-center gap-2">
//       //           <label className={`${GlobalStyle.tableData} sm:w-1/4 whitespace-nowrap`}>
//       //             End date
//       //           </label>
//       //           <span className="hidden sm:inline-block">:</span>
//       //           <div className="w-full">
//       //             <DatePicker
//       //               selected={endDate}
//       //               onChange={(date) => setEndDate(date)}
//       //               dateFormat="dd/MM/yyyy"
//       //               placeholderText="dd/MM/yyyy"
//       //               className={`${GlobalStyle.inputText} w-full`}
//       //             />
//       //           </div>
//       //         </div>

//       //         {/* Remark Textarea */}
//       //         <div className="flex flex-col sm:flex-row sm:items-start gap-2">
//       //           <label className={`${GlobalStyle.paragraph} sm:w-1/4 whitespace-nowrap`}>
//       //             Remark
//       //           </label>
//       //           <span className="hidden sm:inline-block">:</span>
//       //           <textarea
//       //             className={`${GlobalStyle.inputText} w-full h-40`}
//       //             value={remark}
//       //             onChange={(e) => setRemark(e.target.value)}
//       //           />
//       //         </div>

//       //         {/* Action Buttons */}
//       //         <div className="flex justify-end mt-4 space-x-2">
//       //           <button
//       //             onClick={handleEndUser}
//       //             disabled={loading}
//       //             className={`${GlobalStyle.buttonPrimary} ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
//       //           >
//       //             {loading ? "Saving..." : "Save"}
//       //           </button>
//       //         </div>
//       //       </div>
//       //     </div>
//       //   </div>

//         <div className="w-full flex justify-center mt-6">
//           <div className={`${GlobalStyle.cardContainer} relative w-full max-w-4xl px-4 sm:px-6`}>
//             <table className={`${GlobalStyle.table} w-full text-left`}>
//               <tbody className="space-y-4 sm:space-y-0">
//                 {/* End Date Row */}
//                 <tr className="block sm:table-row">
//                   <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap hidden sm:table-cell w-1/3 sm:w-1/4`}>
//                     End Date
//                   </td>
//                   <td className="w-4 text-left hidden sm:table-cell">:</td>
//                   <td className={`${GlobalStyle.tableData} hidden sm:table-cell`}>
//                     <div className="flex justify-start w-full">
//                       <DatePicker
//                         selected={endDate}
//                         onChange={(date) => setEndDate(date)}
//                         dateFormat="dd/MM/yyyy"
//                         className={`${GlobalStyle.inputText} w-full text-left`}
//                         minDate={new Date()}
//                       />
//                     </div>
//                   </td>
//                 </tr>
      
//                 {/* Remark Row */}
//                 <tr className="block sm:table-row">
//                   <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap hidden sm:table-cell w-1/3 sm:w-1/4`}>
//                     Remark
//                   </td>
//                   <td className="w-4 text-left hidden sm:table-cell">:</td>
//                   <td className={`${GlobalStyle.tableData} hidden sm:table-cell`}>
//                     <textarea
//                       value={remark}
//                       onChange={(e) => {
//                         setRemark(e.target.value);
//                       }}
//                       rows="4"
//                       className={`${GlobalStyle.inputText} w-full text-left`}
//                       placeholder="Enter reason for terminating user"
//                       required
//                     />
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
      
//             <div className="flex justify-end mt-4">
//               <button
//                 onClick={handleEndUser}
//                 className={`${GlobalStyle.buttonPrimary} w-full sm:w-auto`}
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Buttons */}
//       <div className="flex justify-between mx-8">
//         <div className="flex flex-col just-start">
//           {/* Log History button */}
//           <div className="flex gap-4">
//             <button
//               className={`${GlobalStyle.buttonPrimary}`}
//               onClick={() => setShowPopup(true)}
//             >
//               Log History
//             </button>
//           </div>

//           <div style={{ marginTop: '12px' }}>
//               <button className={GlobalStyle.buttonPrimary} onClick={goBack}>
//               <FaArrowLeft /> 
//               </button>
//           </div>
//         </div>
        
//         {/* End button */}
//         <div className="flex justify-end h-fit">
//           {!isEditing && !showEndSection && (
//             <button
//               onClick={() => {
//                 if (userInfo.user_status !== "Terminate") {
//                   setShowEndSection(true);
//                 }
//               }}
//               className={`${GlobalStyle.buttonPrimary} ${
//                 userInfo.user_status === "Terminate" 
//                   ? "opacity-50 cursor-not-allowed" 
//                   : ""
//               }`}
//               disabled={userInfo.user_status === "Terminate"}
//             >
//               End
//             </button>
//           )}
//         </div>

//       </div>

//       {/* Log History Section - Updated as Popup with Working Search */}
//       {showPopup && (
//         <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
//             <div className="bg-white p-6 rounded-md shadow-lg w-3/4 max-h-[80vh] overflow-auto">
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-xl font-bold">Log History</h2>
//                 <button
//                   onClick={() => setShowPopup(false)}
//                   className="text-red-500 text-lg font-bold"
//                   title="Close"
//                 >
//                 ×
//               </button>
//         </div>

//         <div className="mb-4 flex justify-start">
//           <div className={GlobalStyle.searchBarContainer}>
//             <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className={GlobalStyle.inputSearch}
//             />
//             <FaSearch className={GlobalStyle.searchBarIcon} />
//           </div>
//           </div>
//             {/* Modal Body */}
//             <div className="p-6 overflow-auto max-h-[70vh]">
//               <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
//                 <table className={GlobalStyle.table}>
//                   <thead className={GlobalStyle.thead}>
//                     <tr>
//                       <th scope="col" className={GlobalStyle.tableHeader}>
//                         Date
//                       </th>
//                       <th scope="col" className={GlobalStyle.tableHeader}>
//                         Action
//                       </th>
//                       <th scope="col" className={GlobalStyle.tableHeader}>
//                         Edited By
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {filteredLogHistory.length > 0 ? (
//                       filteredLogHistory.map((log, index) => (
//                         <tr
//                           key={index}
//                           className={`${
//                             index % 2 === 0
//                               ? GlobalStyle.tableRowEven
//                               : GlobalStyle.tableRowOdd
//                           } border-b`}
//                         >
//                           <td className={`${GlobalStyle.tableData} text-xs lg:text-sm`}>
//                             {formatDate(log.remark_dtm) || "N/A"}
//                           </td>
//                           <td className={`${GlobalStyle.tableData} text-xs lg:text-sm`}>
//                             {log.remark || "N/A"}
//                           </td>
//                           <td className={`${GlobalStyle.tableData} text-xs lg:text-sm`}>
//                             {log.remark_by || "N/A"}
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="3" className="text-center py-4">
//                           {searchQuery ? "No matching results found" : "No results found"}
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserInfo;



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
import add from "../../assets/images/user-add.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { endUser, getUserDetailsById, updateUserDetails } from "../../services/user/user_services";
import completeIcon from "../../assets/images/complete.png";
import remove from "../../assets/images/remove.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { getLoggedUserId } from "../../services/auth/authService";

const UserInfo = () => {
  const location = useLocation();
  const user_id = location.state?.user_id;
  console.log("user_id from location.state:", user_id);

  const goBack = () => {
    navigate(-1);
  };

  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10;

  const [loggedUserData, setLoggedUserData] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [remark, setRemark] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  const [formData, setFormData] = useState({
    user_type: "",
    email: "",
    contact_numbers: "",
    can_user_login: "",
    roles: "",
    created_on: "",
    created_by: "",
    status_on: "",
    status_by: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showEndSection, setShowEndSection] = useState(false);

  // Available roles dropdown
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

  // Get system user
  const loadUser = async () => {
    try {
      const user = await getLoggedUserId();
      setLoggedUserData(user);
    } catch (err) {
      console.error("Error fetching logged user:", err);
    }
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

      // Validate user_id is numeric
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
        console.log("Fetched user data:", fetchedData);

        if (isMounted && fetchedData && fetchedData.status === "Success") {
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
            status_on: fetchedData.user_status?.status_on || "",
            status_by: fetchedData.user_status?.status_by || "",
            Remark: fetchedData.Remark || [],
          });
          setIsActive(fetchedData.user_status?.status === "active");
          setFormData({
            user_type: fetchedData.user_type || "",
            email: fetchedData.email || "",
            contact_numbers:
              fetchedData.contact_numbers && fetchedData.contact_numbers.length > 0
                ? fetchedData.contact_numbers[0]
                : "N/A",
            can_user_login: fetchedData.can_user_login || "",
            roles: fetchedData.roles && fetchedData.roles.length > 0 ? fetchedData.roles[0] : "",
            created_on: fetchedData.created_on || "",
            created_by: fetchedData.created_by || "",
            status_on: fetchedData.user_status?.status_on || "",
            status_by: fetchedData.user_status?.status_by || "",
          });
          setSelectedRole(fetchedData.roles && fetchedData.roles.length > 0 ? fetchedData.roles[0] : "");
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

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setShowEndSection(false);
    setEmailError("");
  };

  const handleSave = async () => {
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
      setLoading(true);

      const updateData = {
        user_id: String(user_id),
        updated_by: loggedUserData,
        roles: [selectedRole],
        user_status: isActive ? "active" : "inactive",
        remark: remark,
      };

      const response = await updateUserDetails(updateData);

      if (response.status === "success") {
        const fetchedData = await getUserDetailsById(user_id);
        if (fetchedData && fetchedData.status === "Success") {
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
            status_on: fetchedData.user_status?.status_on || "",
            status_by: fetchedData.user_status?.status_by || "",
            Remark: fetchedData.Remark || [],
          });
        }

        setRemark("");
        toggleEdit();

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "User details updated successfully",
        });
      }
    } catch (err) {
      console.error("Error updating user:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to update user details",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}/${month}/${day}`;
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
      };

      const response = await endUser(payload);
      console.log("endUser response:", response);

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
          status_on: fetchedData.user_status?.status_on || "",
          status_by: fetchedData.user_status?.status_by || "",
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

  const filteredLogHistory = userInfo.Remark?.filter((log) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (log.remark && log.remark.toLowerCase().includes(searchLower)) ||
      (log.remark_by && log.remark_by.toLowerCase().includes(searchLower)) ||
      (log.remark_dtm && formatDate(log.remark_dtm).toLowerCase().includes(searchLower))
    );
  }) || [];

  const formatRoleLabel = (value) => {
    if (!value) return "N/A";

    return value
      .split("_")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
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

  return (
    <div className={`${GlobalStyle.fontPoppins} px-4 sm:px-6 lg:px-8`}>
      <div className={`${GlobalStyle.headingLarge} mb-6 sm:mb-8`}>
        <span>
          {user_id} - {userInfo.username}
        </span>
      </div>

      <div className="w-full flex justify-center">
        <div className={`${GlobalStyle.cardContainer} relative w-full max-w-4xl`}>
          {isEditing ? (
            <div className="space-y-4">
              <div className="flex justify-end items-center mb-4">
                <div className="flex items-center">
                  <label className="inline-flex relative items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isActive}
                      onChange={() => setIsActive(!isActive)}
                    />
                    <div className="w-11 h-6 bg-gray-500 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="mb-6 sm:mb-8 w-full">
                  <tbody>
                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        User Type<span className="sm:hidden">:</span>
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
                        {Array.isArray(userInfo.contact_numbers) && userInfo.contact_numbers.length > 0
                          ? userInfo.contact_numbers[0]
                          : "Not specified"}
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
                        <div className="flex items-center space-x-2">
                          <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className={`${GlobalStyle.selectBox} w-full`}
                            style={{ color: selectedRole === "" ? "gray" : "black" }}
                          >
                            {userRoles.map((role) => (
                              <option
                                key={role.value}
                                value={role.value}
                                hidden={role.hidden}
                                style={{ color: "black" }}
                              >
                                {role.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>

                    <tr className="h-2"></tr>

                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        Created On<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                        {formatDate(userInfo.created_on) || "Not specified"}
                      </td>
                    </tr>

                    <tr className="h-2"></tr>

                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        Created By<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                        {userInfo.created_by || "Not specified"}
                      </td>
                    </tr>

                    <tr className="h-2"></tr>

                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        Status On<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                        {formatDate(userInfo.status_on) || "Not specified"}
                      </td>
                    </tr>

                    <tr className="h-2"></tr>

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

                <table className={`${GlobalStyle.table} min-w-full mt-4`}>
                  <tbody>
                    <tr>
                      <td className={`${GlobalStyle.tableData} underline whitespace-nowrap text-left w-1/3 sm:w-1/4 font-semibold`}>
                        Remark
                      </td>
                    </tr>
                    <tr>
                      <td className={`${GlobalStyle.tableData} break-words text-left`}>
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
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSave}
                  className={GlobalStyle.buttonPrimary}
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
                      toggleEdit();
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
                        User Type<span className="sm:hidden">:</span>
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
                        {Array.isArray(userInfo.contact_numbers) && userInfo.contact_numbers.length > 0
                          ? userInfo.contact_numbers[0]
                          : "Not specified"}
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
                        {userInfo.roles && userInfo.roles.length > 0
                          ? userInfo.roles.map((role) => formatRoleLabel(role)).join(", ")
                          : "Not specified"}
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

                <tr className="block sm:table-row">
                  <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap hidden sm:table-cell w-1/3 sm:w-1/4`}>
                    Remark
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
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between mx-8">
        <div className="flex flex-col just-start">
          <div className="flex gap-4">
            <button
              className={`${GlobalStyle.buttonPrimary}`}
              onClick={() => setShowPopup(true)}
            >
              Log History
            </button>
          </div>

          <div style={{ marginTop: "12px" }}>
            <button className={GlobalStyle.buttonPrimary} onClick={goBack}>
              <FaArrowLeft />
            </button>
          </div>
        </div>

        <div className="flex justify-end h-fit">
          {!isEditing && !showEndSection && (
            <button
              onClick={() => {
                if (userInfo.user_status !== "terminate") {
                  setShowEndSection(true);
                }
              }}
              className={`${GlobalStyle.buttonPrimary} ${userInfo.user_status === "terminate" ? "opacity-50 cursor-not-allowed" : ""}`}
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
                title="Close"
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
                      <th scope="col" className={GlobalStyle.tableHeader}>
                        Date
                      </th>
                      <th scope="col" className={GlobalStyle.tableHeader}>
                        Action
                      </th>
                      <th scope="col" className={GlobalStyle.tableHeader}>
                        Edited By
                      </th>
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