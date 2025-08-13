import React, { useState, useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import { Create_Customer_Response } from "../../services/FTL_LOD/FTL_LODServices.js";
import { getLoggedUserId } from "/src/services/auth/authService.js";

export default function FTL_LOD_Cus_Response_update({
  isOpen,
  onClose,
  selectedItem,
}) {
  const [userData, setUserData] = useState(null);

  const loadUser = async () => {
    const user = await getLoggedUserId();
    setUserData(user);
    console.log("User data:", user);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const [remark, setRemark] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  if (!isOpen) return null;

  const handleRemarkChange = (event) => {
    setRemark(event.target.value);
  };

  const handleSubmit = async () => {
    const created_by =
      userData || userData?.userName || userData?.email || "Unknown User";
    const payload = {
      case_id: Number(selectedItem?.case_id),
      created_by: created_by,
      response: remark,
    };

    try {
      console.log("Payload to API:", payload);
      const response = await Create_Customer_Response(payload);
      console.log("Response from API:", response);

      //  Show success message
      setSuccessMessage("Response submitted successfully!");

      //  Clear remark field
      setRemark("");

      // Close the popup after a short delay (e.g., 2 seconds)
      setTimeout(() => {
        setSuccessMessage(""); // Clear message
        onClose(false); // Close popup
      }, 1000);
    } catch (error) {
      console.error("Submission error:", error);
      setSuccessMessage("An error occurred while submitting.");
    }
  };

  return (
    <div className={GlobalStyle.popupBoxContainer}>
      <div className={GlobalStyle.popupBoxBody}>
        <div className={GlobalStyle.popupBox}>
          <h2 className={GlobalStyle.popupBoxTitle}>Customer Response</h2>
          <button
            className={GlobalStyle.popupBoxCloseButton}
            onClick={() => onClose(false)}
          >
            ×
          </button>
        </div>

        {/*Success Message Box */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded shadow-sm">
            {successMessage}
          </div>
        )}

        <div className="mb-9">
          <label className={GlobalStyle.remarkTopic}>Response :</label>
          <textarea
            value={remark}
            onChange={handleRemarkChange}
            className={`${GlobalStyle.remark}`}
            style={{ width: "100%", maxWidth: "100%", minWidth: "300px" }}
            rows="5"
          ></textarea>
        </div>

        <div className="flex justify-end items-center w-full mt-6">
          <button
            onClick={handleSubmit}
            className={`${GlobalStyle.buttonPrimary}`}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
