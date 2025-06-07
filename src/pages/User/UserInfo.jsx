/* Purpose: This template is used for the 17.2 - User Info .
Created Date: 2025-06-07
Created By: sakumini (sakuminic@gmail.com)
Version: node 20
ui number :17.2
Dependencies: tailwind css
Related Files: (routes)
Notes:The following page conatins the code for the User Info Screen */

import React, { useEffect, useState } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import edit from "../../assets/images/edit-info.svg";
import add from "../../assets/images/add.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from "react-router-dom";

const UserInfo = () => {
  const location = useLocation();
  const user_id = location.state?.userId;

  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10;

  const [selectedRole, setSelectedRole] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [remark, setRemark] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [showEndSection, setShowEndSection] = useState(false);
  const [showLogHistory, setShowLogHistory] = useState(false);

  const [formData, setFormData] = useState({
    userType: "",
    userMail: "",
    loginMethod: "",
    userRoles: [],
    createdOn: "",
    createdBy: "",
    approvedOn: "",
    approvedBy: "",
  });

  // Dummy data for View table - User Roles
  const [userRolesData, setUserRolesData] = useState([
    {
      roleName: "GM",
      active: true,
    },
    {
      roleName: "DGM",
      active: true,
    },
    {
      roleName: "Legal Officer",
      active: true,
    },
  ]);

  // Dropdown data for User Roles
  const availableRoles = [
    { role_name: "GM" },
    { role_name: "DGM" },
    { role_name: "Legal Officer" },
    { role_name: "Manager" },
    { role_name: "Assistant Manager" },
    { role_name: "Officer" },
    { role_name: "Executive" },
    { role_name: "Senior Executive" },
  ];

  // Log history data
  const logHistoryData = [
    {
      editedOn: "mm/dd/yyyy",
      action: "Sensus BPO Services (Pvt) Ltd....",
      editedBy: "Damithri",
    },
    {
      editedOn: "mm/dd/yyyy",
      action: "Central Management Services (Pvt) Ltd",
      editedBy: "Saniru",
    },
  ];

  useEffect(() => {
    // Simulating API call - replace with actual API call
    const getUserInfo = async () => {
      try {
        // Dummy mock data for demonstration
        const mockData = {
          user_type: "Admin",
          user_mail: "user@example.com",
          login_method: "Email",
          user_roles: [
            { name: "GM", status: true },
            { name: "DGM", status: true },
            { name: "Legal Officer", status: false },
          ],
          created_on: "2024-06-06",
          created_by: "System",
          approved_on: "2024-06-07",
          approved_by: "Admin",
        };
        setFormData({
          userType: mockData?.user_type || "",
          userMail: mockData?.user_mail || "",
          loginMethod: mockData?.login_method || "",
          userRoles: mockData?.user_roles || [],
          createdOn: mockData?.created_on || "",
          createdBy: mockData?.created_by || "",
          approvedOn: mockData?.approved_on || "",
          approvedBy: mockData?.approved_by || "",
        });
      } catch (err) {
        console.error("Error fetching User info:", err);
      }
    };

    getUserInfo();
  }, [user_id]);

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Handle input changes for edit mode
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle save
  const handleSave = () => {
    toggleEdit();
  };

  // Add selected role to the table
  const addUserRole = () => {
    if (selectedRole && !userRolesData.some((item) => item.roleName === selectedRole)) {
      setUserRolesData([...userRolesData, { roleName: selectedRole, active: false }]);
      setSelectedRole(""); // Reset dropdown
    }
  };

  // Paginate data
  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = userRolesData.slice(startIndex, endIndex);

  // Toggle the active state for a specific row
  const toggleUserRole = (index) => {
    const updatedData = [...userRolesData];
    updatedData[index].active = !updatedData[index].active;
    setUserRolesData(updatedData);
  };

  return (
    <div className={GlobalStyle.fontPoppins}>
      <div className={`${GlobalStyle.headingLarge} mb-8`}>
        <span>User ID - User Name</span>
      </div>

      {/* Card box */}
      <div className={GlobalStyle.flexCenter}>
        <div className={`${GlobalStyle.cardContainer} p-4`}>
          {/* Edit Mode UI */}
          {isEditing ? (
            <div className="space-y-4">
              <div className="flex justify-end items-center mb-4">
                <div className="flex items-center">
                  {/* Active or Inactive User */}
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

              {/* Edit Table */}
              <table className="mb-8 w-full">
                <tbody>
                  <tr>
                    <td>
                      <label className={GlobalStyle.headingMedium}>
                        User Type
                      </label>
                    </td>
                    <td className="text-center align-middle">:</td>
                    <td>
                      <label className={GlobalStyle.headingSmall}>
                        {formData.userType}
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label className={GlobalStyle.headingMedium}>
                        User Mail
                      </label>
                    </td>
                    <td>:</td>
                    <td>
                      <input
                        type="email"
                        name="userMail"
                        value={formData.userMail}
                        onChange={handleInputChange}
                        placeholder="Enter email"
                        className={GlobalStyle.inputText}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label className={GlobalStyle.headingMedium}>
                        Login Method
                      </label>
                    </td>
                    <td>:</td>
                    <td>
                      <label className={GlobalStyle.headingSmall}>
                        {formData.loginMethod}
                      </label>
                    </td>
                  </tr>

                    {/* User Role Dropdown with Add Button */}
                  <tr>
                    <td>
                      <label className={GlobalStyle.headingMedium}>
                        User Role
                      </label>
                    </td>
                    <td>:</td>
                    <td className="flex items-center space-x-2">
                      <select
                        className={GlobalStyle.selectBox}
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                      >
                        <option value="">Select User Role</option>
                        {availableRoles.map((role, index) => (
                          <option key={index} value={role.role_name}>
                            {role.role_name}
                          </option>
                        ))}
                      </select>
                      <button
                        className="bg-white rounded-full p-1 border border-gray-300"
                        onClick={addUserRole}
                        title="Add User Role"
                        disabled={!selectedRole}
                      >
                        <img src={add} alt="Add" className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3">
                      <div className="mt-4">
                        {/* User Roles Table */}
                        <div className={GlobalStyle.tableContainer}>
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
                              {paginatedData.map((row, index) => (
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
                                    <span>{row.roleName}</span>
                                  </td>
                                  <td className={GlobalStyle.tableData}>
                                    <div className="flex justify-center items-center">
                                      <label className="inline-flex relative items-center cursor-pointer">
                                        <input
                                          type="checkbox"
                                          className="sr-only peer"
                                          checked={row.active}
                                          onChange={() => toggleUserRole(index)}
                                        />
                                        <div className="w-11 h-6 bg-gray-500 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                      </label>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className="h-4"></tr>
                  <tr>
                    <td>
                      <label className={GlobalStyle.headingMedium}>
                        Created On
                      </label>
                    </td>
                    <td>:</td>
                    <td>
                      <label className={GlobalStyle.headingSmall}>
                        {formData.createdOn}
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label className={GlobalStyle.headingMedium}>
                        Created By
                      </label>
                    </td>
                    <td>:</td>
                    <td>
                      <label className={GlobalStyle.headingSmall}>
                        {formData.createdBy}
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label className={GlobalStyle.headingMedium}>
                        Approved on
                      </label>
                    </td>
                    <td>:</td>
                    <td>
                      <label className={GlobalStyle.headingSmall}>
                        {formData.approvedOn}
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label className={GlobalStyle.headingMedium}>
                        Approved by
                      </label>
                    </td>
                    <td>:</td>
                    <td>
                      <label className={GlobalStyle.headingSmall}>
                        {formData.approvedBy}
                      </label>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Save button in edit mode */}
              <div className="flex justify-end mt-auto">
                <button
                  onClick={handleSave}
                  className={GlobalStyle.buttonPrimary}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* View Mode UI */}
              {/* Edit icon */}
              <div className="flex justify-end">
                <img
                  src={edit}
                  alt="Edit"
                  className="w-8 h-8 mb-4 cursor-pointer"
                  onClick={toggleEdit}
                  title="Edit"
                />
              </div>

              {/* View Table */}
              <table className="mb-8 w-full">
                <tbody>
                  <tr>
                    <td>
                      <p className={`${GlobalStyle.paragraph} mb-2`}>User Type</p>
                    </td>
                    <td className="text-center align-middle">:</td>
                    <td>
                      <label className={GlobalStyle.headingSmall}>
                        {formData.userType}
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p className={`${GlobalStyle.paragraph} mb-2`}>User Mail</p>
                    </td>
                    <td>:</td>
                    <td>
                      <label className={GlobalStyle.headingSmall}>
                        {formData.userMail}
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p className={`${GlobalStyle.paragraph} mb-2`}>Login Method</p>
                    </td>
                    <td>:</td>
                    <td>
                      <label className={GlobalStyle.headingSmall}>
                        {formData.loginMethod}
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p className={`${GlobalStyle.paragraph} mb-2`}>
                        <strong>User Roles</strong>
                      </p>
                    </td>
                    <td>:</td>
                  </tr>
                  <tr>
                    <td colSpan="3">
                      <div className="mt-4">
                        {/* User Roles Table */}
                        <div className={GlobalStyle.tableContainer}>
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
                              {formData.userRoles.length > 0 ? (
                                formData.userRoles.map((role, index) => (
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
                                      <span>{role.name}</span>
                                    </td>
                                    <td className={GlobalStyle.tableData}>
                                      <div className="flex justify-center items-center">
                                        <label className="inline-flex relative items-center cursor-pointer">
                                          <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={role.status}
                                            readOnly
                                            disabled
                                          />
                                          <div className="w-11 h-6 bg-gray-500 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                        </label>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="2" className="text-center py-4">
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
                  <tr>
                    <td>
                      <p className={`${GlobalStyle.paragraph} mb-2`}>Created On</p>
                    </td>
                    <td>:</td>
                    <td>
                      <label className={GlobalStyle.headingSmall}>
                        {formData.createdOn}
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p className={`${GlobalStyle.paragraph} mb-2`}>Created By</p>
                    </td>
                    <td>:</td>
                    <td>
                      <label className={GlobalStyle.headingSmall}>
                        {formData.createdBy}
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p className={`${GlobalStyle.paragraph} mb-2`}>Approved on</p>
                    </td>
                    <td>:</td>
                    <td>
                      <label className={GlobalStyle.headingSmall}>
                        {formData.approvedOn}
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p className={`${GlobalStyle.paragraph} mb-2`}>Approved by</p>
                    </td>
                    <td>:</td>
                    <td>
                      <label className={GlobalStyle.headingSmall}>
                        {formData.approvedBy}
                      </label>
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>

      {/* End button */}
      <div className="flex justify-end pr-40 mt-4">
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
              <div className="flex items-start">
                <label className={GlobalStyle.headingMedium}>
                  End date
                </label>
                <span className="mx-2">:</span>

                <div className={GlobalStyle.datePickerContainer}>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/MM/yyyy"
                    className={GlobalStyle.inputText}
                  />
                </div>
              </div>

              <div className="flex items-start">
                <label className={GlobalStyle.headingMedium}>
                  Remark
                </label>
                <span className="mx-2">:</span>
                <textarea
                  className={`${GlobalStyle.inputText} flex-1 h-40`}
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </div>

              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => {
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
      <div className="flex gap-4 pl-20">
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
            <div className={GlobalStyle.tableContainer}>
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
                  {logHistoryData.map((log, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0
                          ? GlobalStyle.tableRowEven
                          : GlobalStyle.tableRowOdd
                      } border-b`}
                    >
                      <td className={GlobalStyle.tableData}>{log.editedOn}</td>
                      <td className={GlobalStyle.tableData}>{log.action}</td>
                      <td className={GlobalStyle.tableData}>{log.editedBy}</td>
                    </tr>
                  ))}
                  {logHistoryData.length === 0 && (
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


