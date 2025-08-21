

import { useState, useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import { useNavigate } from "react-router-dom";
import { FLT_LOD_Case_Details } from "../../services/FTL_LOD/FTL_LODServices.js";

import { useParams, useLocation } from "react-router-dom";
import { Create_FLT_LOD} from "../../services/FTL_LOD/FTL_LODServices.js";
import {Fetch_Letter} from "../../services/FTL_LOD/LetterServices.js";

export default function FLT_LOD_Creation() {

  const { case_id } = useParams(); // Get case_id from URL parameters
  // const case_id = useParams().case_id;
  //const case_id = 1
    // const case_id = location.state?.caseid
  // State to hold case details
  const location = useLocation();
  const item = location.state?.item;

  const [caseDetails, setCaseDetails] = useState(null);
  const [language, setLanguage] = useState("English");
  const [templateType, setTemplateType] = useState(""); 
  const [letterData, setLetterData] = useState(null);



  const navigate = useNavigate();
  
 useEffect(() => {
  const fetchCaseDetails = async () => {
    try {
      console.log("Fetching case details for case_id:", item.case_id);
      const caseDetails = await FLT_LOD_Case_Details(item.case_id); // pass case_id
      console.log("Case Details:", caseDetails.data);
      setCaseDetails(caseDetails.data); // store in state
    } catch (error) {
      console.error("Error fetching case details:", error);
    }
  };

  fetchCaseDetails();
}, [case_id]);

// Fetch letter when template type or language changes
const handleFetchLetter = async (typeId) => {
  try {
    const response = await Fetch_Letter({
      case_id: item?.case_id || case_id,
      language,
      letter_template_type_id: typeId,
    });

    setLetterData(response.data); // save letter content in state
  } catch (error) {
    console.error("Error fetching letter:", error);
  }
};

// Function to handle PDF creation
const handleCreatePDF = async () => {
  try {
    const currentCaseId = item?.case_id || case_id; // fallback to either one

    if (!currentCaseId) {
      console.error("Case ID is missing!");
      return;
    }

    console.log("Creating PDF for case_id:", currentCaseId);

    const response = await Create_FLT_LOD(currentCaseId); // ✅ use correct case_id
    console.log("PDF Created:", response.data);

    // If the API returns a file blob for download
    if (response.data && response.data.pdfBase64) {
      const link = document.createElement("a");
      link.href = `data:application/pdf;base64,${response.data.pdfBase64}`;
      link.download = `FTL_LOD_${currentCaseId}.pdf`;
      link.click();
    } else if (response.data && response.data.pdfUrl) {
      // If the API returns a file URL
      window.open(response.data.pdfUrl, "_blank");
    } else {
      alert("PDF created successfully.");
    }
  } catch (error) {
    console.error("Error creating PDF:", error);
    alert("Failed to create PDF. Please try again.");
  }
};

const [signatureOwner, setSignatureOwner] = useState("");

  return (
    <div className={GlobalStyle.fontPoppins}>
      {/* Title */}
      <h1 className={GlobalStyle.headingLarge}>Preview of FTL LOD</h1>

      <div className="flex gap-2 items-center flex-wrap mt-8 w-full justify-end md:justify-start ">
        <label className={GlobalStyle.dataPickerDate}>Template</label>
        <select className={GlobalStyle.selectBox}
        value={templateType}
        onChange={(e) => {
          setTemplateType(e.target.value);
          handleFetchLetter(e.target.value); // fetch on selection
        }}>
          <option value="">Select Template...</option>
          <option value="1">Letter of Demand and Termination</option>
          <option value="2">Reminder Letter</option>
        </select>

        <label className={`${GlobalStyle.dataPickerDate} ml-24`}>
          Signature Owner
        </label>
        <select
          className={GlobalStyle.selectBox}
          value={signatureOwner}
          onChange={(e) => setSignatureOwner(e.target.value)}
        >
          <option value="">Select...</option>
          <option value="Attorney-at-Law">Attorney-at-Law</option>
          <option value="Legal Advisor">Legal Advisor</option>
          <option value="Senior Attorney">Senior Attorney</option>
          <option value="Legal Department Head">Legal Department Head</option>
          
        </select>
      </div>


      <div className="flex items-center justify-center mt-10 px-2">
  <div className="bg-slate-100 max-w-[750px] w-full rounded-lg p-4 overflow-auto max-h-screen">
    <div className="flex justify-center items-center">
      <div className="p-4 bg-white rounded-lg shadow-md text-sm leading-relaxed w-full">
        {letterData ? (
        <div
          style={{
            padding: "20px",
            fontFamily: "'Times New Roman', Times, serif",
            fontSize: "14px",
            lineHeight: "1.6",
            backgroundColor: "#ffffff",
            color: "#000000",
          }}
        >
          
      
        {/* Sender */}
        <div style={{ marginBottom: "20px" }}>
          <strong>{letterData.senders_address}</strong>
        </div>

        {/* Sending Mode */}
        <div style={{ marginBottom: "20px" }}>
          <strong>{letterData.sending_mode}</strong><br />
          <strong>{letterData.reciepients_address}</strong>
        </div>

        {/* Greetings */}
        <p>{letterData.greetings}</p>

        {/* Title */}
        <div style={{ textAlign: "center", margin: "20px 0", fontWeight: "bold" }}>
          {letterData.title}
        </div>

        {/* Body */}
        <div style={{ textAlign: "justify" }}>
          <p>{letterData.Body}</p>
        </div>
          
          <p>
            Yours faithfully,<br /><br />
             {signatureOwner || "[Your Name]"}
          </p>
        </div>
        ) : (
          <p>Please select a template to preview the letter.</p>
        )}

      </div>
    </div>
  </div>
</div>

      <div className="flex items-center justify-end gap-4 mt-4 mb-4">
        <button 
        onClick={() =>
            navigate("/pages/flt-lod/ftl-lod-change-details-form", {
            state: { item: item }, // 👈 pass along the case details
  })
}
        className={`${GlobalStyle.buttonPrimary}`}>
          Change Details
        </button>

        <button 
          onClick={handleCreatePDF} 
          className={`${GlobalStyle.buttonPrimary}`}
          >Create PDF
        </button>

      </div>
    </div>
  );
}
