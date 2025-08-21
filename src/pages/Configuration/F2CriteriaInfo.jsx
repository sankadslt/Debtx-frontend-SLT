/* Purpose: This template is used for the F2 Criteria List.
Created Date: 2025-08-21
Created By: Deshan Chinthaka
Last Modified Date: 2025-08-21
Modified By: Deshan Chinthaka
Version: node 20
ui number: CONFIG F2 Criteria (Info)
Dependencies: tailwind css, react, react-router-dom, sweetalert2, react-tooltip, axios (if API added later)*/

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import edit from "../../assets/images/edit-info.svg"; // Ensure this path matches your project
import Swal from "sweetalert2";
import { FaArrowLeft } from "react-icons/fa";

const F2CriteriaInfo = () => {
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

  const [showEndSection, setShowEndSection] = useState(false);
  const [endData, setEndData] = useState({
    endDate: "",
    remark: "",
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
      navigate("/pages/Configuration/F2CriteriaEdit", { state: { criteria_id, criteriaInfo } });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEndData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEnd = () => {
    if (criteriaInfo.status !== "Terminate") {
      setShowEndSection(true);
    }
  };

  const handleSaveEnd = async () => {
    if (!endData.endDate) {
      Swal.fire({
        title: "Warning",
        text: "End date is required",
        icon: "warning",
      });
      return;
    }
    if (!endData.remark.trim()) {
      Swal.fire({
        title: "Warning",
        text: "Remark is required",
        icon: "warning",
      });
      return;
    }

    // Simulate ending criteria (replace with actual API call)
    console.log("Ending criteria with:", { criteria_id, ...endData });
    // Example API call - replace with your service
    // const response = await endCriteria(criteria_id, endData);
    // if (response?.status === "Success") {
    Swal.fire({
      title: "Success",
      text: "F2 Criteria ended successfully!",
      icon: "success",
      confirmButtonColor: "#3085d6",
    }).then(() => {
      setCriteriaInfo((prev) => ({ ...prev, status: "Terminate" }));
      setShowEndSection(false);
      setEndData({ endDate: "", remark: "" });
    });
    // }
  };

  const handleCancelEnd = () => {
    setShowEndSection(false);
    setEndData({ endDate: "", remark: "" });
  };

  return (
    <div className="p-2 flex items-start justify-center h-screen">
      <div className={`${GlobalStyle.fontPoppins} w-full max-w-5xl`}>
        <h1 className={GlobalStyle.headingLarge}>F2 Criteria Info</h1>

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
              <span className="underline">F2 Criteria Details</span>
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

            {showEndSection && (
              <div className="mt-6">
                <h2 className={`${GlobalStyle.headingMedium} mb-4 ml-10 text-left font-bold`}>
                  <span className="underline">End Criteria Details</span>
                </h2>
                <div className="overflow-x-auto">
                  <table className="mb-6 w-full">
                    <tbody>
                      <tr className="block md:table-row">
                        <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full md:w-1/3 block md:table-cell`}>
                          End Date<span className="text-red-500">*</span><span className="md:hidden">:</span>
                        </td>
                        <td className="w-4 text-left hidden md:table-cell">:</td>
                        <td className={`${GlobalStyle.tableData} text-gray-500 text-left block md:table-cell`}>
                          <input
                            type="date"
                            name="endDate"
                            value={endData.endDate}
                            onChange={handleChange}
                            className={`${GlobalStyle.inputText} w-full`}
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </td>
                      </tr>

                      <tr className="block md:table-row">
                        <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full md:w-1/3 block md:table-cell`}>
                          Remark<span className="text-red-500">*</span><span className="md:hidden">:</span>
                        </td>
                        <td className="w-4 text-left hidden md:table-cell">:</td>
                        <td className={`${GlobalStyle.tableData} text-gray-500 text-left block md:table-cell`}>
                          <textarea
                            name="remark"
                            value={endData.remark}
                            onChange={handleChange}
                            className={`${GlobalStyle.inputText} w-full h-24 resize-none`}
                            placeholder="Enter reason for ending criteria"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="flex justify-end mt-6 w-full px-4 md:px-0">
                    <button
                      type="button"
                      onClick={handleCancelEnd}
                      className={`${GlobalStyle.buttonRemove} w-32 mr-4`}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveEnd}
                      className={`${GlobalStyle.buttonPrimary} w-32`}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-6 mx-8">
          <div>
            <button
              className={`${GlobalStyle.buttonPrimary}`}
              onClick={goBack}
            >
              <FaArrowLeft />
            </button>
          </div>
          <div>
            <button
              onClick={handleEnd}
              className={`${GlobalStyle.buttonPrimary} ${criteriaInfo.status === "Terminate" ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={criteriaInfo.status === "Terminate"}
            >
              End
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default F2CriteriaInfo;