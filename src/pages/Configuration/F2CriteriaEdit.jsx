/* Purpose: This template is used for the F2 Criteria Edit.
Created Date: 2025-08-21
Created By: Deshan Chinthaka
Last Modified Date: 2025-08-21
Modified By: Deshan Chinthaka
Version: node 20
ui number: CONFIG F2 Criteria (Edit)
Dependencies: tailwind css, react, react-router-dom, sweetalert2, react-tooltip*/


import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import Swal from "sweetalert2";
import { FaArrowLeft } from "react-icons/fa";

const F2CriteriaEdit = () => {
  const location = useLocation();
  const { criteria_id, criteriaInfo } = location.state || {};
  const navigate = useNavigate();

  const [editData, setEditData] = useState({
    key: "",
    operator: "",
    value: "",
    description: "",
  });

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    // Initialize with existing data if available
    if (criteriaInfo) {
      setEditData(criteriaInfo);
    }
  }, [criteriaInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // Simulate saving changes (replace with actual API call)
    console.log("Saving updated criteria:", editData);
    // Example API call - replace with your service
    // const response = await updateCriteria(criteria_id, editData);
    // if (response?.status === "Success") {
    Swal.fire({
      title: "Success",
      text: "F2 Criteria updated successfully!",
      icon: "success",
      confirmButtonColor: "#3085d6",
    }).then(() => {
      navigate("/pages/Configuration/F2CriteriaInfo", { state: { criteria_id } });
    });
    // }
  };

  return (
    <div className="p-2 flex items-start justify-center h-screen">
      <div className={`${GlobalStyle.fontPoppins} w-full max-w-5xl`}>
        <h1 className={GlobalStyle.headingLarge}>Edit F2 Criteria</h1>

        <div className="w-full flex justify-center">
          <div className={`${GlobalStyle.cardContainer} mx-auto w-full md:w-[750px] lg:w-[750px]`}>
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
                      <input
                        type="text"
                        name="key"
                        value={editData.key}
                        onChange={handleChange}
                        className={`${GlobalStyle.inputText} w-full`}
                      />
                    </td>
                  </tr>

                  <tr className="block md:table-row">
                    <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full md:w-1/3 block md:table-cell`}>
                      Operator<span className="md:hidden">:</span>
                    </td>
                    <td className="w-4 text-left hidden md:table-cell">:</td>
                    <td className={`${GlobalStyle.tableData} text-gray-500 text-left block md:table-cell`}>
                      <input
                        type="text"
                        name="operator"
                        value={editData.operator}
                        onChange={handleChange}
                        className={`${GlobalStyle.inputText} w-full`}
                      />
                    </td>
                  </tr>

                  <tr className="block md:table-row">
                    <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full md:w-1/3 block md:table-cell`}>
                      Value<span className="md:hidden">:</span>
                    </td>
                    <td className="w-4 text-left hidden md:table-cell">:</td>
                    <td className={`${GlobalStyle.tableData} text-gray-500 text-left block md:table-cell`}>
                      <input
                        type="text"
                        name="value"
                        value={editData.value}
                        onChange={handleChange}
                        className={`${GlobalStyle.inputText} w-full`}
                      />
                    </td>
                  </tr>

                  <tr className="block md:table-row">
                    <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full md:w-1/3 block md:table-cell`}>
                      Description<span className="md:hidden">:</span>
                    </td>
                    <td className="w-4 text-left hidden md:table-cell">:</td>
                    <td className={`${GlobalStyle.tableData} text-gray-500 text-left block md:table-cell`}>
                      <textarea
                        name="description"
                        value={editData.description}
                        onChange={handleChange}
                        className={`${GlobalStyle.inputText} w-full h-24 resize-none`}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-end mt-6 w-full px-4 md:px-0">
                <button
                  type="button"
                  onClick={handleSave}
                  className={`${GlobalStyle.buttonPrimary} w-32`}
                >
                  Save
                </button>
              </div>
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

export default F2CriteriaEdit;