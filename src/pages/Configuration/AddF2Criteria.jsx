/* Purpose: This template is used for adding a new F2 Criteria.
Created Date: 2025-08-21
Created By: Deshan Chinthaka
Last Modified Date: 2025-08-21
Modified By: Deshan Chinthaka 
Version: node 20
ui number: Unknown
Dependencies: tailwind css, react, react-router-dom, sweetalert2
Related Files: F2Criteria.jsx, GlobalStyle.js
Notes: This component provides a form to add a new F2 Criteria entry. It includes fields for Key, Operator, Value, Description. Upon submission, it simulates a success message (replace with API call if needed). The form resets after submission. */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import Swal from "sweetalert2";
import { FaArrowLeft } from "react-icons/fa";

const AddF2Criteria = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    key: "",
    operator: "",
    value: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call or data saving
    console.log("Form Data Submitted:", formData);
    Swal.fire({
      title: "Success",
      text: "F1 Criteria added successfully!",
      icon: "success",
      confirmButtonColor: "#3085d6",
    }).then(() => {
      // Reset form
      setFormData({
        key: "",
        operator: "",
        value: "",
        description: "",
      });
      navigate("/pages/Configuration/F2Criteria"); // Redirect to F1 Criteria list
    });
  };

  const handleCancel = () => {
    navigate("/pages/Configuration/F2Criteria"); // Redirect back to F1 Criteria list
  };

  const goBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div className="p-2 flex items-start justify-center h-screen">
      <div className={`${GlobalStyle.fontPoppins} w-full max-w-5xl`}>
        <h1 className={GlobalStyle.headingLarge}>Add New F1 Criteria</h1>

        <form onSubmit={handleSubmit} className="w-full">
          <div className={`${GlobalStyle.cardContainer} mx-auto w-full md:w-[750px] lg:w-[750px]`}>
            <h2 className={`${GlobalStyle.headingMedium} mb-5 mt-6 ml-16 text-left font-bold`}>
              <span className="underline">F1 Criteria Details</span>
            </h2>

            <table className="w-full">
              <tbody className="block md:table-row-group">
                {/* Key Field */}
                <tr className="block md:table-row mb-2">
                  <td className="block md:table-cell md:w-1/3 text-right pr-2 whitespace-nowrap align-top">
                    <span className="inline-block min-w-[180px] text-left align-top">Key (Criteria)<span className="text-red-500">*</span></span> :
                  </td>
                  <td className="block md:table-cell md:w-2/3 pb-2">
                    <select
                      name="key"
                      value={formData.key}
                      onChange={handleChange}
                      className={`${GlobalStyle.selectBox} w-full`}
                      style={{ color: formData.key === "" ? "gray" : "black" }}
                      required
                    >
                      <option value="" hidden>
                        Select Key
                      </option>
                      <option value="Account Manager Type">Account Manager Type</option>
                      <option value="Customer Type">Customer Type</option>
                    </select>
                  </td>
                </tr>

                {/* Operator Field */}
                <tr className="block md:table-row">
                  <td className="block md:table-cell md:w-1/3 text-right pr-2 whitespace-nowrap align-top">
                    <span className="inline-block min-w-[180px] text-left align-top">Operator<span className="text-red-500">*</span></span> :
                  </td>
                  <td className="block md:table-cell md:w-2/3 pb-2">
                    <select
                      name="operator"
                      value={formData.operator}
                      onChange={handleChange}
                      className={`${GlobalStyle.selectBox} w-full`}
                      style={{ color: formData.operator === "" ? "gray" : "black" }}
                      required
                    >
                      <option value="" hidden>
                        Select Operator
                      </option>
                      <option value="=">=</option>
                    </select>
                  </td>
                </tr>

                {/* Value Field */}
                <tr className="block md:table-row">
                  <td className="block md:table-cell md:w-1/3 text-right pr-2 whitespace-nowrap align-top">
                    <span className="inline-block min-w-[180px] text-left align-top">Value<span className="text-red-500">*</span></span> :
                  </td>
                  <td className="block md:table-cell md:w-2/3 pb-2">
                    <input
                      type="text"
                      name="value"
                      value={formData.value}
                      onChange={handleChange}
                      className={`${GlobalStyle.inputText} w-full`}
                      placeholder="Enter Value"
                      required
                    />
                  </td>
                </tr>

                {/* Description Field */}
                <tr className="block md:table-row">
                  <td className="block md:table-cell md:w-1/3 text-right pr-2 whitespace-nowrap align-top">
                    <span className="inline-block min-w-[180px] text-left align-top">Description<span className="text-red-500">*</span></span> :
                  </td>
                  <td className="block md:table-cell md:w-2/3 pb-2">
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className={`${GlobalStyle.inputText} w-full h-24 resize-none`}
                      placeholder="Enter Description"
                      required
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-end mt-6 w-full px-4 md:px-0">
              <button
                type="button"
                onClick={handleCancel}
                className={`${GlobalStyle.buttonRemove} w-full md:w-auto`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`${GlobalStyle.buttonPrimary} w-full md:w-auto ml-4`}
              >
                Add
              </button>
            </div>
          </div>
        </form>

        <button
          className={`${GlobalStyle.buttonPrimary} flex items-center space-x-2 mt-4`}
          onClick={goBack}
        >
          <FaArrowLeft />
        </button>
      </div>
    </div>
  );
};

export default AddF2Criteria;