import React from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import { FLT_LOD_Case_Details } from "../../services/FTL_LOD/FTL_LODServices.js";
import { Create_FLT_LOD} from "../../services/FTL_LOD/FTL_LODServices.js";

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // <-- Add this


export default function FLT_LOD_Change_Details_Form() {

  const { case_id } = useParams(); // Get case_id from URL parameters
  // const case_id = location.state?.caseid// Get case_id from URL parameters
  const navigate = useNavigate();
  // const case_id = 1649



  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
         console.log("Case Details:", case_id);
        // Replace 'case_id' with the actual case ID variable or prop
        const caseDetails = await FLT_LOD_Case_Details(case_id);
        console.log("Fetched Case Details:", caseDetails);
      } catch (error) {
        console.error("Error fetching case details:", error);
      }
    };
    fetchCaseDetails();
  }, []);
  

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const payload = {
      account_no: formData.post("account_no"),
      event_source: formData.post("event_source"),
      customer_name: formData.post("customer_name"),
      address: formData.post("address"),
      additional_fields: [
        formData.post("additional_field_1"),
        formData.post("additional_field_2"),
        formData.post("additional_field_3"),
        formData.post("additional_field_4"),
      ],
      current_arrears_band: formData.post("current_arrears_band"),
      billing_centre: formData.post("rtom"),
      customer_type_name: formData.post("customer_type_name"),
    }


    try {
      const response = await Create_FLT_LOD(payload);
      console.log("FLT LOD created successfully:", response);
      // Handle success (e.g., show a success message, redirect, etc.)
    } catch (error) {
      console.error("Error creating FTL LOD:", error);
      // Handle error (e.g., show an error message)
    }

  }


  return (
    <div className={GlobalStyle.fontPoppins}> 
    
      {/* Form */}
      <div className="flex gap-4 mt-4 justify-center">
        <div className={GlobalStyle.cardContainer}>
          <h1 className={`${GlobalStyle.headingLarge} text-center mb-4`}>
            Change Details
          </h1>

          <form className="w-full max-w-4xl mx-auto" onSubmit={handleSubmit}>
            <table className={GlobalStyle.table}>
              <tbody>
                {/* Field Rows */}
                <tr>
                  <td className={GlobalStyle.tableData}>Account No :</td>
                  <td className={GlobalStyle.tableData}>
                    <input
                      type="text"
                      name="account_no"
                      className={`${GlobalStyle.inputText} w-full`}
                    />
                  </td>
                </tr>

                <tr>
                  <td className={GlobalStyle.tableData}>Select Option :</td>
                  <td className={GlobalStyle.tableData}>
                    <select name="event_source" className={`${GlobalStyle.selectBox} w-full`}>
                      <option value="">Event Source</option>
                      <option value="option1">Option 1</option>
                      <option value="option2">Option 2</option>
                      <option value="option3">Option 3</option>
                    </select>
                  </td>
                </tr>

                <tr>
                  <td className={GlobalStyle.tableData}>Customer Name :</td>
                  <td className={GlobalStyle.tableData}>
                    <input
                      type="text"
                      name="customer_name"
                      className={`${GlobalStyle.inputText} w-full`}
                    />
                  </td>
                </tr>

                <tr>
                  <td className={GlobalStyle.tableData}>Address :</td>
                  <td className={GlobalStyle.tableData}>
                    <input
                      type="text"
                      name="address"
                      className={`${GlobalStyle.inputText} w-full`}
                    />
                  </td>
                </tr>

                {/* Dynamic Additional Fields */}
                {["", "", "", ""].map((label, index) => (
                  <tr key={index}>
                    <td className={GlobalStyle.tableData}>{label}</td>
                    <td className={GlobalStyle.tableData}>
                      <input
                        type="text"
                        name={`additional_field_${index + 1}`}
                        className={`${GlobalStyle.inputText} w-full`}
                      />
                    </td>
                  </tr>
                ))}

                <tr>
                  <td className={GlobalStyle.tableData}>Arrears :</td>
                  <td className={GlobalStyle.tableData}>
                    <input
                      type="text"
                      name="current_arrears_band"
                      className={`${GlobalStyle.inputText} w-full`}
                    />
                  </td>
                </tr>

                <tr>
                  <td className={GlobalStyle.tableData}>Billing Centre :</td>
                  <td className={GlobalStyle.tableData}>
                    <input
                      type="text"
                      name="rtom"
                      className={`${GlobalStyle.inputText} w-full`}
                    />
                  </td>
                </tr>

                <tr>
                  <td className={GlobalStyle.tableData}>Customer Type :</td>
                  <td className={GlobalStyle.tableData}>
                    <input
                      type="text"
                      name="customer_type_name"
                      className={`${GlobalStyle.inputText} w-full`}
                    />
                  </td>
                </tr>

                {/* Submit Row */}
                <tr>
                  <td></td>
                  <td className={`${GlobalStyle.tableData} text-right`}>
                    <button type="submit" className={GlobalStyle.buttonPrimary}>
                      Save
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      </div>
    </div>
  );
}
