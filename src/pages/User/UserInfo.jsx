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
// import add from "../../assets/images/add.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { getUserDetailsById } from "../../services/user/user_services";
import completeIcon from "../../assets/images/complete.png";


const UserInfo = () => {
  const location = useLocation();
  const user_id = location.state?.user_id;

  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10;

  const [selectedRole, setSelectedRole] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [remark, setRemark] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [emailError, setEmailError] = useState("");

  const [loading, setLoading] =useState(false);
  const [error, setError] =useState("");
  const [userInfo, setUserInfo] =useState({
    user_name: "",
    user_type: "",
    user_mail: "",
    login_method: "",
    user_roles: [],
    created_dtm: "",
    created_by: "",
    approved_dtm: "",
    approved_by: "",
    remark: []
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showEndSection, setShowEndSection] = useState(false);
  const [showLogHistory, setShowLogHistory] = useState(false);


  useEffect(() => {
    const fetchUserInfoById = async () => {
      try {
        setLoading(true);
        const fetchedData = await getUserDetailsById(user_id);
        // console.log("Fetched User Info: ", fetchedData);

        if (fetchedData) {
          setUserInfo(fetchedData.data);
        }
        setLoading(false);
        
    
      } catch (err) {
        console.error("Error fetching User info:", err);
        setError("Failed to load user information. Please try again later.")
        setLoading(false);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load User information",
        });
      }
    };

    fetchUserInfoById();
  }, [user_id]);

  const toggleEdit = () => {
    // setIsEditing(!isEditing);
    // setEmailError("");
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));

  //   if (name === "userMail") {
  //     setEmailError("");
  //   }
  // };

  // const isValidEmail = (email) => {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return emailRegex.test(email);
  // };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // const handleSave = () => {
  //   if (!formData.userMail.trim()) {
  //     setEmailError("User Mail is required");
  //     return;
  //   } else if (!isValidEmail(formData.userMail)) {
  //     setEmailError("Please enter a valid email address");
  //     return;
  //   }

  //   toggleEdit();
  // };

  // const addUserRole = () => {
  //   if (
  //     selectedRole &&
  //     !userRolesData.some((item) => item.roleName === selectedRole)
  //   ) {
  //     setUserRolesData([
  //       ...userRolesData,
  //       { roleName: selectedRole, active: false },
  //     ]);
  //     setSelectedRole("");
  //   }
  // };

  // const startIndex = currentPage * rowsPerPage;
  // const endIndex = startIndex + rowsPerPage;
  // const paginatedData = userRolesData.slice(startIndex, endIndex);

  // const toggleUserRole = (index) => {
  //   const updatedData = [...userRolesData];
  //   updatedData[index].active = !updatedData[index].active;
  //   setUserRolesData(updatedData);
  // };

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
        <span>{user_id} - {userInfo.user_name}</span>
      </div>

      {/* Card box */}
      <div className={GlobalStyle.flexCenter}>
        <div className={`${GlobalStyle.cardContainer} p-4`}>
          {/* Edit Mode UI */}
          {isEditing ? (
            <div className="space-y-4">
             
            </div>
          ) : (
            <>
              {/* View Mode UI */}
              <div className="flex justify-end">
                <img
                  src={edit}
                  alt="Edit"
                  className="w-6 h-6 sm:w-8 sm:h-8 mb-4 cursor-pointer"
                  onClick={toggleEdit}
                  title="Edit"
                />
              </div>

              {/* View Table */}
              <div className="overflow-x-auto">
                <table className="mb-6 sm:mb-8 w-full">
                  <tbody>

                    {/* User type */}
                    <tr>
                      <td className="w-1/3 sm:w-auto">
                        <p className={`${GlobalStyle.paragraph} mb-2`}>
                          User Type
                        </p>
                      </td>
                      <td className="text-center align-middle w-4 sm:w-auto">
                        :
                      </td>
                      <td className="w-2/3 sm:w-auto">
                        <label className={GlobalStyle.headingSmall}>
                          {userInfo.user_type || "N/A"}
                        </label>
                      </td>
                    </tr>

                    {/* User Mail */}
                    <tr>
                      <td className="w-1/3 sm:w-auto">
                        <p className={`${GlobalStyle.paragraph} mb-2`}>
                          User Mail
                        </p>
                      </td>
                      <td className="text-center align-middle w-4 sm:w-auto">
                        :
                      </td>
                      <td className="w-2/3 sm:w-auto">
                        <label className={GlobalStyle.headingSmall}>
                          {userInfo.user_mail || "N/A"}
                        </label>
                      </td>
                    </tr>

                    {/* Login Method */}
                    <tr>
                      <td className="w-1/3 sm:w-auto">
                        <p className={`${GlobalStyle.paragraph} mb-2`}>
                          Login Method
                        </p>
                      </td>
                      <td className="text-center align-middle w-4 sm:w-auto">
                        :
                      </td>
                      <td className="w-2/3 sm:w-auto">
                        <label className={GlobalStyle.headingSmall}>
                          {userInfo.login_method || "N/A"}
                        </label>
                      </td>
                    </tr>

                    {/* User Roles */}
                    <tr>
                      <td className="w-1/3 sm:w-auto">
                        <p className={`${GlobalStyle.paragraph} mb-2`}>
                          User Roles
                        </p>
                      </td>
                      <td className="text-center align-middle w-4 sm:w-auto">
                        :
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3">
                        <div className="mb-4">
                          {/* User Roles Table */}
                          <div
                            className={`${GlobalStyle.tableContainer} overflow-x-auto`}
                          >
                            <table className={GlobalStyle.table}>
                              <thead className={GlobalStyle.thead}>
                                <tr>
                                  <th
                                    scope="col"
                                    className={GlobalStyle.tableHeader}
                                  >
                                    User Roles
                                  </th>
                                  <th
                                    scope="col"
                                    className={GlobalStyle.tableHeader}
                                  ></th>
                                </tr>
                              </thead>
                              <tbody>
                                {userInfo.user_roles.length > 0 ? (
                                  userInfo.user_roles.map((role, index) => (
                                    <tr
                                      key={index}
                                      className={`${
                                        index % 2 === 0
                                          ? GlobalStyle.tableRowEven
                                          : GlobalStyle.tableRowOdd
                                      } border-b`}
                                    >
                                      <td
                                        className={`${GlobalStyle.tableData} flex justify-center items-center`}
                                      >
                                        <span>{role}</span>
                                      </td>
                                      <td className={GlobalStyle.tableData}>
                                        <div className="flex justify-center items-center">
                                          {/* <label className="inline-flex relative items-center cursor-pointer">
                                            <input
                                              type="checkbox"
                                              className="sr-only peer"
                                              checked={role.status}
                                              readOnly
                                              disabled
                                            />
                                            <div className="w-11 h-6 bg-gray-500 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                          </label> */}
                                          <img 
                                            src={completeIcon} 
                                            alt="Active" 
                                            className="h-5 w-5 lg:h-6 lg:w-6"
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td
                                      colSpan="2"
                                      className="text-center py-4"
                                    >
                                      No results found
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>

                    {/* Created On */}
                    <tr>
                      <td className="w-1/3 sm:w-auto">
                        <p className={`${GlobalStyle.paragraph} mb-2`}>
                          Created On
                        </p>
                      </td>
                      <td className="text-center align-middle w-4 sm:w-auto">
                        :
                      </td>
                      <td className="w-2/3 sm:w-auto">
                        <label className={GlobalStyle.headingSmall}>
                          {formatDate(userInfo.created_dtm) || "N/A"}
                        </label>
                      </td>
                    </tr>                   

                    {/* Created by */}
                    <tr>
                      <td className="w-1/3 sm:w-auto">
                        <p className={`${GlobalStyle.paragraph} mb-2`}>
                          Created By
                        </p>
                      </td>
                      <td className="text-center align-middle w-4 sm:w-auto">
                        :
                      </td>
                      <td className="w-2/3 sm:w-auto">
                        <label className={GlobalStyle.headingSmall}>
                          {userInfo.created_by || "N/A"}
                        </label>
                      </td>
                    </tr>

                    {/* Approved on */}
                    <tr>
                      <td className="w-1/3 sm:w-auto">
                        <p className={`${GlobalStyle.paragraph} mb-2`}>
                          Approved On
                        </p>
                      </td>
                      <td className="text-center align-middle w-4 sm:w-auto">
                        :
                      </td>
                      <td className="w-2/3 sm:w-auto">
                        <label className={GlobalStyle.headingSmall}>
                          {formatDate(userInfo.approved_dtm) || "N/A"}
                        </label>
                      </td>
                    </tr>

                    {/* Approved by */}
                    <tr>
                      <td className="w-1/3 sm:w-auto">
                        <p className={`${GlobalStyle.paragraph} mb-2`}>
                          Approved By
                        </p>
                      </td>
                      <td className="text-center align-middle w-4 sm:w-auto">
                        :
                      </td>
                      <td className="w-2/3 sm:w-auto">
                        <label className={GlobalStyle.headingSmall}>
                          {userInfo.approved_by || "N/A"}
                        </label>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* End button */}
      <div className="flex justify-end pr-0 sm:pr-40 mt-4">
        {!isEditing && !showEndSection && (
          <button
            className={GlobalStyle.buttonPrimary}
            onClick={() => setShowEndSection(true)}
          >
            End
          </button>
        )}
      </div>

      {/* End Date and Remark Section */}
      {showEndSection && (
        <div className={GlobalStyle.flexCenter}>
          <div className={`${GlobalStyle.cardContainer} p-4 w-full max-w-2xl`}>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label
                  className={`${GlobalStyle.headingMedium} sm:w-1/4 whitespace-nowrap`}
                >
                  End date
                </label>
                <span className="hidden sm:inline-block">:</span>
                <div className="w-full">
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/MM/yyyy"
                    className={`${GlobalStyle.inputText} w-full`}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                <label
                  className={`${GlobalStyle.headingMedium} sm:w-1/4 whitespace-nowrap`}
                >
                  Remark
                </label>
                <span className="hidden sm:inline-block">:</span>
                <textarea
                  className={`${GlobalStyle.inputText} w-full h-40`}
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </div>

              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => {
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

                    setShowEndSection(false);
                  }}
                  className={GlobalStyle.buttonPrimary}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log History button */}
      <div className="flex gap-4 pl-0 sm:pl-20 my-4">
        <button
          className={GlobalStyle.buttonPrimary}
          onClick={() => setShowLogHistory(!showLogHistory)}
        >
          Log History
        </button>
      </div>

      {/* Log History Section */}
      {showLogHistory && (
        <div className={GlobalStyle.flexCenter}>
          <div className={`${GlobalStyle.cardContainer} p-4 w-full max-w-4xl`}>
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
                  {userInfo.remark?.length > 0 ? (
                    userInfo.remark?.map((log, index) => (
                      <tr
                        key={index}
                        className={`${
                          index % 2 === 0
                            ? GlobalStyle.tableRowEven
                            : GlobalStyle.tableRowOdd
                        } border-b`}
                      >
                        <td className={`${GlobalStyle.tableData} text-xs lg:text-sm`}>{formatDate(log.remark_dtm) || "N/A"}</td>
                        <td className={`${GlobalStyle.tableData} text-xs lg:text-sm`}>{log.remark  || "N/A"}</td>
                        <td className={`${GlobalStyle.tableData} text-xs lg:text-sm`}>{log.remark_by  || "N/A"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-4">
                        No results found
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
  );
};

export default UserInfo;
