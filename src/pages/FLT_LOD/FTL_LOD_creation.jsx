

import { useState, useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import { useNavigate } from "react-router-dom";
import { FLT_LOD_Case_Details } from "../../services/FTL_LOD/FTL_LODServices.js";

import { useParams, useLocation } from "react-router-dom";
import { Create_FLT_LOD} from "../../services/FTL_LOD/FTL_LODServices.js";

export default function FLT_LOD_Creation() {

  const { case_id } = useParams(); // Get case_id from URL parameters
  // const case_id = useParams().case_id;
  //const case_id = 1
    // const case_id = location.state?.caseid
  // State to hold case details
  const location = useLocation();
  const item = location.state?.item;

  const [caseDetails, setCaseDetails] = useState(null);


  const navigate = useNavigate();
  // Function to handle navigation to change details form
  const handleChangeDetails = () => {
    navigate("/pages/flt-lod/ftl-lod-change-details-form");
  };

 useEffect(() => {
  const fetchCaseDetails = async () => {
    try {
      console.log("Fetching case details for case_id:", case_id);
      const caseDetails = await FLT_LOD_Case_Details(case_id); // pass case_id
      console.log("Case Details:", caseDetails.data);
      setCaseDetails(caseDetails.data); // store in state
    } catch (error) {
      console.error("Error fetching case details:", error);
    }
  };

  fetchCaseDetails();
}, [case_id]);

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
        <div className={" bg-slate-100 h-[1200px] w-[750px] rounded-lg p-4 overflow-auto"}>
          <div className={"flex justify-center items-center h-full"}>
            {/* <h1 className={GlobalStyle.headingLarge}>Preview of FTL LOD</h1> */}
             <div className="p-4 bg-white rounded-lg shadow-md text-sm leading-relaxed">
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
      <div style={{ marginBottom: "20px" }}>
        <strong>Damithri Palliyaguru</strong><br />
        Attorney-at-Law - LLB<br />
        Recovery Section<br />
        CTO Ground Floor<br />
        Sri Lanka Telecom PLC<br />
        Lotus Road, Colombo 01<br />
        T.P No: 011-2341080<br />
        Email: reclegal@slt.lk<br />
        (9.00AM – 4.30PM)
      </div>

      <div style={{ marginBottom: "20px" }}>
        <strong>BY REGISTERED POST</strong><br />
          <br />
        {caseDetails?.customer_name || "………………"}<br />
      </div>
        {caseDetails?.postal_address
    ? caseDetails.address.split("\n").map((line, index) => (
        <span key={index}>
          {line}
          <br />
        </span>
      ))
    : "…………………"}
      

      <p>Dear Sir/Madam,</p>
        <div style={{ textAlign: "center", margin: "20px 0", fontWeight: "bold" }}>
          LETTER OF DEMAND AND TERMINATION
        </div>

      <div style={{ margin: "20px 0" }}>
        OUTSTANDING BALANCE: {caseDetails?.current_arrears_band || "………………"}<br />
        ACCOUNT NUMBER: {caseDetails?.account_no || "………………"}<br />
        TELEPHONE NUMBER: {caseDetails?.contact_no || "………………"}
      </div>
       <p style={{ textAlign: "justify", marginBottom: "20px" }}>
          <strong>SRI LANKA TELECOM PUBLIC LIMITED COMPANY</strong>
      </p>
      <div style={{ textAlign: "justify" }}>
      <p>
        I write on the instructions of my Client Sri Lanka Telecom PLC, which has a Regional Office at …………. and its Head Office at Lotus Road, Colombo 01 and which is the Successor to all the assets, liabilities, rights, obligations and contracts of the Corporation named Sri Lanka Telecom and of the Department of Telecommunications.
      </p><br />

      <p>
        I am instructed that, you are a Customer of my Client and that, as such, at your request, my Client installed its telephone equipment and provided a telephone service to you at your premises bearing the above stated number, subject to the terms and conditions of the Agreement entered into by and between my client and you, including the payment of all subscriptions, charges, fees and other monies.
      </p><br />

      <p>
        I am instructed that, you have benefited from and used the said facilities and services provided by my client, but you have failed and neglected to pay the monies due as aforesaid, though my client has sent you Monthly Statements setting out the sums, which are due, and payable.
      </p>

      <p>
        I am instructed that, presently there is a sum of {caseDetails?.current_arrears_band || "………………"} owing from you to my Client, on account of the subscriptions, charges, fees and other monies due from you to my Client for the installation and provision of the said telephone services. You are liable and bound and obliged to pay these monies to my Client.
      </p><br />

      <p>
        However, you have wrongfully and unlawfully failed and neglected to pay these monies to my Client and the said monies payable by you to my Client, are in arrears and in default. Therefore, my Client has instructed me to advise that the aforesaid Agreement is hereby terminated and determined.
      </p><br />

      <p>
        I am also instructed to demand and I do hereby demand payment from you to my Client, of the aforesaid monies, within 14 days of the date of receipt of this letter and advise that if you fail to make such payment, legal action will be instituted against you, for the recovery of these monies, without any further notice to you.
      </p><br /></div>

      <p>
        Yours faithfully,<br /><br />
        Attorney-at-Law
      </p>
    </div>
      </div>
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
