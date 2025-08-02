/* 
Purpose: This template is used for the 17.4 - User Registration Form.
Created Date: 2025-07-31 
last Updated: 2025-08-01
Created By: Tharindu Darshana (tharindu.drubasinge@gmail.com)
Version: React v18 
ui number: 17.4 / 17.4.1 / 17.4.2 
Dependencies: Tailwind CSS, React Icons Related 
Files: GlobalStyle.js 
Notes: The following page contains the code for the User Registration Form for SLT and DRC officers. */

import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle";

const AddUser = () => {
  const [userType, setUserType] = useState("");
  const [formData, setFormData] = useState({
    serviceNo: "",
    name: "",
    nic: "",
    email: "",
    contactNo: "",
    role: [],
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'role') {
      if (!formData.role.includes(value)) {
        setFormData((prev) => ({
          ...prev,
          role: [...prev.role, value]
        }));
      }
      e.target.value = ''; // Reset select after choosing
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveRole = (roleToRemove) => {
    setFormData((prev) => ({
      ...prev,
      role: prev.role.filter(role => role !== roleToRemove)
    }));
  };

  const handleRegister = () => {
    if (!userType) {
      alert("Please select a user type.");
      return;
    }

    const payload = {
      userType,
      ...(userType === "SLT" ? { serviceNo: formData.serviceNo } : {}),
      name: formData.name,
      ...(userType === "DRC Officer" ? { nic: formData.nic } : {}),
      email: formData.email,
      contactNo: formData.contactNo,
      role: formData.role,
    };

    console.log("Registering with payload:", payload);
  };

  const handleSearch = async () => {
    setError("");
    setLoading(true);
    try {
      const fullServiceNo = formData.serviceNo + "@intranet.slt.com.lk";
      const data = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              name: "Test Name",
              email: "test@slt.com.lk",
              contactNo: "1234567890",
              nic: "123456789V",
            }),
          1000
        )
      );

      setFormData((prev) => ({
        ...prev,
        name: data.name,
        email: data.email,
        contactNo: data.contactNo,
        ...(userType === "DRC Officer" ? { nic: data.nic } : {}),
      }));
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch user data");
    }
    setLoading(false);
  };

  return (
    <div className="min-screen  flex items-center justify-center">
      <div className={`${GlobalStyle.fontPoppins} w-full max-w-5xl`}>
        {" "}
        <h1 className={GlobalStyle.headingLarge}>
          Register User
        </h1>
        <div className={`${GlobalStyle.cardContainer} mx-auto w-full md:w-[750px] lg:w-[750px]`}>
          <table className="w-full">
            <tbody className="block md:table-row-group">
              <tr className="block md:table-row mb-2">
                <td className="block md:table-cell md:w-1/3 text-right pr-2 mt-5 whitespace-nowrap">
                  <span className="inline-block min-w-[180px] text-left">User Type<span className="text-red-500">*</span></span> :
                </td>
                <td className="block md:table-cell md:w-2/3 pb-2">
                  <select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    className={`${GlobalStyle.inputText} w-3/4`}
                  >
                    <option value="" disabled hidden>
                      Select
                    </option>
                    <option value="SLT">SLT</option>
                    <option value="DRC Officer">DRC Officer</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>

        {/* SLT Form */}
        {userType === "SLT" && (
          <>
            <h2 className={`${GlobalStyle.headingMedium} mb-4 mt-8 ml-10 text-left font-bold`}>
              <span className="underline">User Details</span>
            </h2>
            <table className="w-full">
              <tbody className="block md:table-row-group">
                <tr className="block md:table-row mb-2">
                  <td className="block md:table-cell md:w-1/3 text-right pr-2 mt-5 whitespace-nowrap">
                    <span className="inline-block min-w-[180px] text-left">Service No<span className="text-red-500">*</span></span> :
                  </td>
                  <td className="block md:table-cell md:w-2/3 pb-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        name="serviceNo"
                        value={formData.serviceNo}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSearch();
                        }}
                        className={`${GlobalStyle.inputText} w-3/4`}
                      />
                      <button
                        type="button"
                        onClick={handleSearch}
                        className={`${GlobalStyle.buttonCircle}`}
                      >
                        <FaSearch className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>

                <tr className="block md:table-row mb-2">
                  <td className="block md:table-cell md:w-1/3 text-right pr-2 mt-5 whitespace-nowrap">
                    <span className="inline-block min-w-[180px] text-left">Name<span className="text-red-500">*</span></span> :
                  </td>
                  <td className="block md:table-cell md:w-2/3 pb-2">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`${GlobalStyle.inputText} w-3/4`}
                    />
                  </td>
                </tr>

                <tr className="block md:table-row mb-2">
                  <td className="block md:table-cell md:w-1/3 text-right pr-2 mt-5 whitespace-nowrap">
                    <span className="inline-block min-w-[180px] text-left">Email<span className="text-red-500">*</span></span> :
                  </td>
                  <td className="block md:table-cell md:w-2/3 pb-2">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`${GlobalStyle.inputText} w-3/4`}
                    />
                  </td>
                </tr>

                <tr className="block md:table-row mb-2">
                  <td className="block md:table-cell md:w-1/3 text-right pr-2 mt-5 whitespace-nowrap">
                    <span className="inline-block min-w-[180px] text-left">Contact No<span className="text-red-500">*</span></span> :
                  </td>
                  <td className="block md:table-cell md:w-2/3 pb-2">
                    <input
                      type="text"
                      name="contactNo"
                      value={formData.contactNo}
                      onChange={handleInputChange}
                      className={`${GlobalStyle.inputText} w-3/4`}
                    />
                  </td>
                </tr>

                <tr className="block md:table-row mb-2">
                  <td className="block md:table-cell md:w-1/3 text-right pr-2 mt-5 whitespace-nowrap">
                    <span className="inline-block min-w-[180px] text-left">Role<span className="text-red-500">*</span></span> :
                  </td>
                  <td className="block md:table-cell md:w-2/3 pb-2">
                    <select
                      name="role"
                      value=""
                      onChange={handleInputChange}
                      className={`${GlobalStyle.inputText} w-3/4`}
                    >
                      <option value="" disabled hidden>Select Role</option>
                      <option value="DGM">DGM</option>
                      <option value="Manager">Manager</option>
                      <option value="Clerk">Clerk</option>
                      <option value="Field Officer">Field Officer</option>
                    </select>
                  </td>
                </tr>
                {formData.role.length > 0 && (
                <tr className="block md:table-row mb-2">
                  <td className="block md:table-cell md:w-1/3"></td>
                  <td className="block md:table-cell md:w-2/3 pb-2">
                    <div className={`${GlobalStyle.inputText} w-3/4 flex flex-wrap items-center gap-2`}>
                      {formData.role.map((role, index) => (
                        <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                          <span className="text-blue-900 mr-2">{role}</span>
                          <button
                            onClick={() => handleRemoveRole(role)}
                            className="text-blue-900 hover:text-red-600 font-bold"
                            title="Remove role"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
                )}
              </tbody>
            </table>
          </>
        )}

        {/* DRC Form */}
        {userType === "DRC Officer" && (
          <>
            <h2 className={`${GlobalStyle.headingMedium} mb-4 mt-8 ml-10 text-left font-bold`}>
              <span className="underline">DRC Officer Details</span>
            </h2>
            <table className="w-full">
              <tbody className="block md:table-row-group">
                <tr className="block md:table-row mb-2">
                  <td className="block md:table-cell md:w-1/3 text-right pr-2 mt-5 whitespace-nowrap">
                    <span className="inline-block min-w-[180px] text-left">Select DRC<span className="text-red-500">*</span></span> :
                  </td>
                  <td className="block md:table-cell md:w-2/3 pb-2">
                    <select
                      name="nic"
                      value={formData.nic}
                      onChange={handleInputChange}
                      className={`${GlobalStyle.inputText} w-3/4`}
                    >
                      <option value="" disabled hidden>Select DRC</option>
                      <option value="123456789V">DRC 1 (123456789V)</option>
                      <option value="987654321V">DRC 2 (987654321V)</option>
                      <option value="456789123V">DRC 3 (456789123V)</option>
                    </select>
                  </td>
                </tr>

                <tr className="block md:table-row mb-2">
                  <td className="block md:table-cell md:w-1/3 text-right pr-2 mt-5 whitespace-nowrap">
                    <span className="inline-block min-w-[180px] text-left">Name<span className="text-red-500">*</span></span> :
                  </td>
                  <td className="block md:table-cell md:w-2/3 pb-2">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`${GlobalStyle.inputText} w-3/4`}
                    />
                  </td>
                </tr>

                <tr className="block md:table-row mb-2">
                  <td className="block md:table-cell md:w-1/3 text-right pr-2 mt-5 whitespace-nowrap">
                    <span className="inline-block min-w-[180px] text-left">NIC<span className="text-red-500">*</span></span> :
                  </td>
                  <td className="block md:table-cell md:w-2/3 pb-2">
                    <input
                      type="text"
                      name="nic"
                      value={formData.drc}
                      onChange={handleInputChange}
                      className={`${GlobalStyle.inputText} w-3/4`}
                    />
                  </td>
                </tr>

                <tr className="block md:table-row mb-2">
                  <td className="block md:table-cell md:w-1/3 text-right pr-2 mt-5 whitespace-nowrap">
                    <span className="inline-block min-w-[180px] text-left">Email<span className="text-red-500">*</span></span> :
                  </td>
                  <td className="block md:table-cell md:w-2/3 pb-2">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`${GlobalStyle.inputText} w-3/4`}
                    />
                  </td>
                </tr>

                <tr className="block md:table-row mb-2">
                  <td className="block md:table-cell md:w-1/3 text-right pr-2 mt-5 whitespace-nowrap">
                    <span className="inline-block min-w-[180px] text-left">Contact No<span className="text-red-500">*</span></span> :
                  </td>
                  <td className="block md:table-cell md:w-2/3 pb-2">
                    <input
                      type="text"
                      name="contactNo"
                      value={formData.contactNo}
                      onChange={handleInputChange}
                      className={`${GlobalStyle.inputText} w-3/4`}
                    />
                  </td>
                </tr>

                <tr className="block md:table-row mb-2">
                  <td className="block md:table-cell md:w-1/3 text-right pr-2 mt-5 whitespace-nowrap">
                    <span className="inline-block min-w-[180px] text-left">Role<span className="text-red-500">*</span></span> :
                  </td>
                  <td className="block md:table-cell md:w-2/3 pb-2">
                    <select
                      name="role"
                      value=""
                      onChange={handleInputChange}
                      className={`${GlobalStyle.inputText} w-3/4`}
                    >
                      <option value="" disabled hidden>
                        Select Role
                      </option>
                      <option value="DGM">DGM</option>
                      <option value="Manager">Manager</option>
                      <option value="Clerk">Clerk</option>
                      <option value="Field Officer">Field Officer</option>
                    </select>
                  </td>
                </tr>
                {formData.role.length > 0 && (
                <tr className="block md:table-row mb-2">
                  <td className="block md:table-cell md:w-1/3"></td>
                  <td className="block md:table-cell md:w-2/3 pb-2">
                    <div className={`${GlobalStyle.inputText} l flex flex-wrap items-center gap-2`}>
                      {formData.role.map((role, index) => (
                        <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                          <span className="text-blue-900 mr-2">{role}</span>
                          <button
                            onClick={() => handleRemoveRole(role)}
                            className="text-blue-900 hover:text-red-600 font-bold"
                            title="Remove role"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
                )}
              </tbody>
            </table>
          </>
        )}

        {error && (
          <div className="mt-4">
            <p className={`${GlobalStyle.errorText} text-center`}>
              {error}
            </p>
          </div>
        )}

        <div className="flex justify-center mt-6 w-full px-4 md:px-0">
          <button
            onClick={handleRegister}
            className={`${GlobalStyle.buttonPrimary} w-full md:w-auto`}
          >
            Register
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;