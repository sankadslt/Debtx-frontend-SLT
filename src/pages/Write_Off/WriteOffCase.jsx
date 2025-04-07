/* Purpose: This template is used for the 9.2 - Write Off case .
Created Date: 2025-04-06
Created By: Buthmi mithara (buthmimithara1234@gmail.com)
Version: node 20
ui number : 9.2
Dependencies: tailwind css
Related Files: (routes)
Notes:The following page conatins the code for the  Write Off case Screen */

import React, { useState } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";

const WriteOffCase = () => {
  const [caseId, setCaseId] = useState("");
  const [remark, setRemark] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      "Write-Off submitted with Case ID:",
      caseId,
      "and Remark:",
      remark
    );
    // Add your submission logic here
  };

  return (
    <div className={GlobalStyle.fontPoppins}>
      <div className="flex gap-4 mt-10 justify-center">
        <div className={GlobalStyle.cardContainer}>
          <h1 className={`${GlobalStyle.headingLarge} text-center mb-4`}>
            Write-Off Case
          </h1>

          <form className="flex flex-col gap-4">
            {/* Case ID Input */}
            <div className="flex flex-col">
              <label className={`${GlobalStyle.headingSmall} mb-1`}>
                Case ID :
              </label>
              <input
                type="text"
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                className={GlobalStyle.inputText}
              />
            </div>

            {/* Remark Input */}
            <div className="flex flex-col">
              <label className={`${GlobalStyle.headingSmall} mb-1`}>
                Remark :
              </label>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className={GlobalStyle.inputText}
                rows={4}
              />
            </div>

            {/* Write-Off Button */}
            <div className="flex justify-end mt-8">
              <button
                type="button"
                onClick={handleSubmit}
                className={GlobalStyle.buttonRemove}
              >
                Write-Off
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WriteOffCase;
