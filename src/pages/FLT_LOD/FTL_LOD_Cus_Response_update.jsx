import React, { useState } from 'react';
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";

export default function FTL_LOD_Cus_Response_update({ isOpen, onClose }) {
  if (!isOpen) return null; // Don't render if not open

  // State to store the textarea value
  const [remark, setRemark] = useState("");

  // Handle the change in textarea
  const handleRemarkChange = (event) => {
    setRemark(event.target.value); // Update state with the new value
  };
  return (

    <div className={GlobalStyle.popupBoxContainer}>
      <div className={GlobalStyle.popupBoxBody}>
        <div className={GlobalStyle.popupBox}>
          <h2 className={GlobalStyle.popupBoxTitle}>
            Customer Response
          </h2>

          <button
            className={GlobalStyle.popupBoxCloseButton}
            onClick={() => onClose(false)}
          >
            ×
          </button>
        </div>
        <div >
          <div className="mb-9 ">
            <label className={GlobalStyle.remarkTopic}>Remark :</label>
            <textarea
              value={remark}
              onChange={handleRemarkChange}
              className={`${GlobalStyle.remark}`}
              style={{ width: "100%", maxWidth: "100%", minWidth: "300px" }}
              rows="5"
            ></textarea>
          </div>
        </div>
        <div className="flex justify-end items-center w-full mt-6">



          <button

            className={`${GlobalStyle.buttonPrimary}`}
          >
            Submit
          </button>
        </div>
      </div>
    </div>


  )


  {/* <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Enter Details</h2>
        
        <input 
          type="text" 
          placeholder="Enter text" 
          className="border p-2 w-full mb-3"
        />
        
        <div className="flex justify-end space-x-2">
          <button 
            className="bg-gray-500 text-white px-4 py-2 rounded" 
            onClick={onClose}
          >
            Close
          </button>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div> */}

} 
