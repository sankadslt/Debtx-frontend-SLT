
import { useState, useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import { useNavigate } from "react-router-dom";
import { FTL_LOD_Case_Details } from "../../services/FTL_LOD/FTL_LODServices.js";

export default function FTL_LOD_Creation() {

  
  const navigate = useNavigate();
  // Function to handle navigation to change details form
  const handleChangeDetails = () => {
    navigate("/pages/flt-lod/ftl-lod-change-details-form");
  };

  // State to hold case details
  const [caseDetails, setCaseDetails] = useState(null);
  
  useEffect(() => {
    // Fetch case details when the component mounts
    const fetchCaseDetails = async () => {
      try {
        //const case_id = "12345"; // Replace with actual case ID
        const caseDetails = await FTL_LOD_Case_Details(case_id);
        console.log("Case Details:", caseDetails);
      } catch (error) {
        console.error("Error fetching case details:", error);
      }
    };

    fetchCaseDetails();
  }, []);

  // Function to handle PDF creation
  const handleCreatePDF = () => {
    // Logic for creating PDF goes here
    console.log("Creating PDF...");
  };
  return (
    <div className={GlobalStyle.fontPoppins}>
      {/* Title */}
      <h1 className={GlobalStyle.headingLarge}>Preview of FTL LOD</h1>

      <div className="flex gap-4 items-center flex-wrap mt-10 ">
        <label className={GlobalStyle.dataPickerDate}>Template</label>
        <select className={GlobalStyle.selectBox}>
          <option value=""></option>
        </select>

        <label className={"${GlobalStyle.dataPickerDate}  ml-24"}>
          Signature Owner
        </label>
        <select className={GlobalStyle.selectBox}>
          <option value=""></option>
        </select>
      </div>

      <div className={"flex items-center justify-center mt-10"}>
        <div className={" bg-slate-100 h-[400px] w-[600px]  rounded-lg"}>
          <div className={"flex justify-center items-center h-full"}>
            <h1 className={GlobalStyle.headingLarge}>Preview of FTL LOD</h1>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-4 mt-4 mb-4">
        <button 
        onClick= {() => navigate("/pages/flt-lod/ftl-lod-change-details-form")}
        className={`${GlobalStyle.buttonPrimary}`}>
          Change Details
        </button>

        <button className={`${GlobalStyle.buttonPrimary}`}>Create PDF</button>
      </div>
    </div>
  );
}
