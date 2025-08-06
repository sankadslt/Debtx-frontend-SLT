
import { useState, useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import { useNavigate } from "react-router-dom";
import { Create_FTL_LOD } from "../../services/FTL_LOD/FTL_LODServices.js";

export default function FTL_LOD_creation() {
  const navigate = useNavigate();
  // Function to handle navigation to change details form
  const handleChangeDetails = () => {
    navigate("/pages/flt-lod/ftl-lod-change-details-form");
  };

  const handleCreateFTLLOD = async (payload) => {
    try {
      const response = await Create_FTL_LOD(payload);
      console.log("FTL LOD created successfully:", response);
      // Handle success (e.g., show a success message, redirect, etc.)
    } catch (error) {
      console.error("Error creating FTL LOD:", error);
      // Handle error (e.g., show an error message)
    } 
  };
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
