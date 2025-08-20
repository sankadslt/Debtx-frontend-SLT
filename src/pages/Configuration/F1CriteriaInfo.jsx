/* Purpose: This template is used for the F1 Criteria List.
Created Date: 2025-08-19
Created By: Deshan Chinthaka
Last Modified Date: 2025-08-19
Modified By: Deshan Chinthaka
Version: node 20
ui number: Unknown
Dependencies: tailwind css, react, react-router-dom, sweetalert2, react-tooltip, axios (if API added later)
Related Files: Potentially f1_criteria_services.js, GlobalStyle.js
Notes: This component is adapted from UserList.jsx to display F1 Criteria. It uses static data based on the screenshot. Filters for Key and Operator are included. Pagination and search are implemented. Actions use more_info icon for details/edit. If API is needed, replace static data with a service call similar to UserList. */

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import edit from "../../assets/images/edit-info.svg"; // Ensure this path matches your project
import { FaArrowLeft } from "react-icons/fa";

const F1CriteriaInfo = () => {
  const location = useLocation();
  const criteria_id = location.state?.criteria_id;
  const navigate = useNavigate();

  const [criteriaInfo, setCriteriaInfo] = useState({
    key: "",
    operator: "",
    value: "",
    description: "",
    status: "Active", // Placeholder status
  });

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    // Simulate fetching criteria details by ID (replace with actual API call)
    const fetchCriteriaInfo = async () => {
      if (!criteria_id) {
        console.error("No criteria ID provided.");
        return;
      }
      // Example API call - replace with your service
      // const response = await getCriteriaDetailsById(criteria_id);
      // if (response?.status === "Success") {
      //   setCriteriaInfo(response.data);
      // }
      // Placeholder data
      setCriteriaInfo({
        key: "Credit Class ID",
        operator: "=",
        value: "12345",
        description: "Sample description for criteria.",
        status: "Active", // Placeholder status
      });
    };
    fetchCriteriaInfo();
  }, [criteria_id]);

  const handleEdit = () => {
    if (criteriaInfo.status !== "Inactive" && criteriaInfo.status !== "Pending") {
      navigate("/pages/Configuration/F1CriteriaEdit", { state: { criteria_id, criteriaInfo } });
    }
  };

  return (
    <div className="p-2 flex items-start justify-center h-screen">
      <div className={`${GlobalStyle.fontPoppins} w-full max-w-5xl`}>
        <h1 className={GlobalStyle.headingLarge}>F1 Criteria Info</h1>

        <div className="w-full flex justify-center">
          <div className={`${GlobalStyle.cardContainer} mx-auto w-full md:w-[750px] lg:w-[750px]`}>
            <div className="flex justify-end mb-4">
              <button
                onClick={handleEdit}
                className={`${criteriaInfo.status === "Inactive" ? "opacity-50 cursor-not-allowed" : ""} || ${criteriaInfo.status === "Pending" ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={criteriaInfo.status === "Inactive" || criteriaInfo.status === "Pending"}
              >
                <img
                  src={edit}
                  alt="Edit"
                  className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg w-10 sm:w-14"
                  title="Edit"
                />
              </button>
            </div>

            <h2 className={`${GlobalStyle.headingMedium} mb-4 mt-4 ml-10 text-left font-bold`}>
              <span className="underline">F1 Criteria Details</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="mb-6 w-full">
                <tbody>
                  <tr className="block md:table-row">
                    <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full md:w-1/3 block md:table-cell`}>
                      Key<span className="md:hidden">:</span>
                    </td>
                    <td className="w-4 text-left hidden md:table-cell">:</td>
                    <td className={`${GlobalStyle.tableData} text-gray-500 text-left block md:table-cell`}>
                      {criteriaInfo.key || "Not specified"}
                    </td>
                  </tr>

                  <tr className="block md:table-row">
                    <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full md:w-1/3 block md:table-cell`}>
                      Operator<span className="md:hidden">:</span>
                    </td>
                    <td className="w-4 text-left hidden md:table-cell">:</td>
                    <td className={`${GlobalStyle.tableData} text-gray-500 text-left block md:table-cell`}>
                      {criteriaInfo.operator || "Not specified"}
                    </td>
                  </tr>

                  <tr className="block md:table-row">
                    <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full md:w-1/3 block md:table-cell`}>
                      Value<span className="md:hidden">:</span>
                    </td>
                    <td className="w-4 text-left hidden md:table-cell">:</td>
                    <td className={`${GlobalStyle.tableData} text-gray-500 text-left block md:table-cell`}>
                      {criteriaInfo.value || "Not specified"}
                    </td>
                  </tr>

                  <tr className="block md:table-row">
                    <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full md:w-1/3 block md:table-cell`}>
                      Description<span className="md:hidden">:</span>
                    </td>
                    <td className="w-4 text-left hidden md:table-cell">:</td>
                    <td className={`${GlobalStyle.tableData} text-gray-500 text-left block md:table-cell`}>
                      {criteriaInfo.description || "Not specified"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex justify-start mt-6 ml-8">
          <button
            className={`${GlobalStyle.buttonPrimary}`}
            onClick={goBack}
          >
            <FaArrowLeft />
          </button>
        </div>
      </div>
    </div>
  );
};

export default F1CriteriaInfo;