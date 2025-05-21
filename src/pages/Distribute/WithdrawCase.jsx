import { useState } from "react";
import Swal from "sweetalert2";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaArrowLeft } from "react-icons/fa";
import { updateCaseRemark } from "../../services/case/CaseServices.js";

const WithdrawCase = () => {
  const [caseId, setCaseId] = useState("");
  const [remark, setRemark] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleWithdraw = async () => {
    // Validate inputs
    if (!caseId || !remark) {
      setError("Case ID and remark are required.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await updateCaseRemark(caseId, remark);

      if (response.success) {
        console.log("Remark updated successfully:", response);
        setRemark(""); // Clear input
 
        // ✅ Show success SweetAlert
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Case remark updated successfully!",
          confirmButtonColor: "#3085d6",
        });
      } else {
        setError(response.message || "An error occurred while updating the remark.");
      }
    } catch (error) {
      console.error("Error during API call:", error);
      setError("Failed to connect to the server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex justify-center pt-10 ${GlobalStyle.fontPoppins}`}>
      <div className="w-full max-w-md p-6">
        <h1 className={`${GlobalStyle.headingLarge} text-center mb-6`}>Withdraw Case</h1>

        {/* Case ID Input */}
        <div className="mb-10">
          <label className={`${GlobalStyle.headingSmall} block mb-1`}>Case ID:</label>
          <input
            type="text"
            value={caseId}
            onChange={(e) => setCaseId(e.target.value)}
            className={GlobalStyle.inputText}
          />
        </div>

        {/* Remark Input */}
        <div className="mb-6">
          <label className={`${GlobalStyle.headingSmall} block mb-1`}>Remark:</label>
          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            className={`${GlobalStyle.remark} text-lg py-4 px-4 w-full`}
            rows={6}
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {/* Withdraw Button */}
        <div className="text-right">
          <button
            className={`${GlobalStyle.buttonPrimary} px-6 py-2`}
            onClick={handleWithdraw}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Withdraw"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawCase;
