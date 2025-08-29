import React, { useState, useEffect } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { PDFDocument, StandardFonts } from "pdf-lib";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import { useNavigate } from "react-router-dom";
import { FLT_LOD_Case_Details } from "../../services/FTL_LOD/FTL_LODServices.js";
import axios from "axios";
import { getLoggedUserId } from "../../services/auth/authService.js";
import Swal from "sweetalert2";
import { Create_FTL_LOD } from "../../services/FTL_LOD/FTL_LODServices.js";
// Import CSS for PDF viewer
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { useLocation } from 'react-router-dom';
import { Fetch_Letter } from "../../services/Letter_template/Letter_FTL_LOD.js";

const FTL_LOD_Creation = () => {
  const navigate = useNavigate();





  // State to hold case details
  const [caseDetails, setCaseDetails] = useState(null);

  const [template, setTemplate] = useState("Default");
  const [signatureOwner, setSignatureOwner] = useState("Attorney-at-Law");
  const [pdfUrl, setPdfUrl] = useState("");
  const [letterTemplate, setLetterTemplate] = useState(null);

    const { state } = useLocation(); // Get the state from navigation
  const item = state?.item; // Access the item from state
  const case_id = item?.case_id; // Extract case_id from the item
  console.log("Case ID:", case_id);

    // Function to handle navigation to change details form
  const handleChangeDetails = () => {
    navigate("/pages/flt-lod/ftl-lod-change-details-form", {
      state: {item},
    });
  };


  // Create default layout plugin
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  // useEffect(() => {
  //   // Fetch case details when the component mounts
  //   const fetchCaseDetails = async () => {
  //     try {
  //       // const case_id = "12345"; // Replace with actual case ID
  //       const details = await FLT_LOD_Case_Details(case_id);
  //       // const details = {
  //       //   outstanding_balance: "Rs. 25,000.00",
  //       //   account_number: "12345678",
  //       //   telephone_number: "011-1234567"
  //       // }; // Sample data for testing
  //       setCaseDetails(details);
  //       console.log("Case Details:", details);
  //     } catch (error) {
  //       console.error("Error fetching case details:", error);
  //     }
  //   };
  //   fetchCaseDetails();
  // }, []);
 const fetchCaseDetails = async () => {
    try {
      console.log("Fetching details for case_id:", case_id);
      const details = await FLT_LOD_Case_Details(case_id);
      
      if (details) {
        setCaseDetails(details);
        console.log("Case Details:", details);
      } else {
        throw new Error("No data received from API");
      }
    } catch (error) {
      console.error("Error fetching case details:", error);
      // Fallback to sample data on error
      const fallbackDetails = {
        outstanding_balance: "Rs. 25,000.00",
        account_number: "12345678",
        telephone_number: "011-1234567"
      };
      setCaseDetails(fallbackDetails);
    }
  };
  // Generate PDF when case details change


    // Fetch letter template
  const fetchLetterTemplate = async () => {
    try {
      const payload = {
        case_id,
        language: "English",
        letter_template_type_id: 1,
      };
      const response = await Fetch_Letter(payload);
      setLetterTemplate(response);
      console.log("Letter Template:", response);
    } catch (error) {
      console.error("Error fetching letter template:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to fetch letter template",
        confirmButtonColor: "#d33",
      });
    }
  };


  // Fetch case details and letter template when case_id is available
  useEffect(() => {
    if (!case_id) {
      console.log("Waiting for case_id...");
      return;
    }
    fetchCaseDetails();
    fetchLetterTemplate();
  }, [case_id]);

  
  // Add case_id as dependency so it re-runs when case_id changes
  useEffect(() => {
    if (caseDetails) {
      generatePDF();
    }
  }, [caseDetails, signatureOwner, template]);


  // Function to generate PDF using pdf-lib
  const generatePDF = async () => {
    try {
      const pdfDoc = await PDFDocument.create();
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

      const page = pdfDoc.addPage([595.28, 841.89]); // A4 size in points
      const { width, height } = page.getSize();
      const fontSize = 10;
      const margin = 40;
      

      let y = height - margin;

      // Helper function to add text
      const addText = (text, x, yPos, options = {}) => {
        page.drawText(text, {
          x,
          y: yPos,
          size: options.size || fontSize,
          font: options.bold ? timesRomanBoldFont : timesRomanFont,
          ...options
        });
        return yPos - (options.lineHeight || 20);
      };

 // Sender's address
      const senderAddress =  typeof letterTemplate.senders_address === "string"
          ? letterTemplate.senders_address.split("\n").map(item => item.trim())
          : Array.isArray(letterTemplate.senders_address)
            ? letterTemplate.senders_address.map(item => item.trim())
            : []
        
      senderAddress.forEach((text) => {
        if (typeof text === "string" && text) {
          page.drawText(text, {
            x: margin + 420,
            y: y,
            size: fontSize,
            font: timesRomanFont,
          });
          y -= 12;
        }
      });
     

      // // BY REGISTERED POST - right aligned
      // page.drawText("BY REGISTERED POST", {
      //   x: width - 200,
      //   y: y,
      //   size: fontSize,
      //   font: timesRomanFont
      // });

      

    // Address placeholder
      y = addText(letterTemplate?.sending_mode, margin, y);

      

     // Recipient's address
      const recipientAddressTexts = (() => {
        if (letterTemplate?.reciepients_address) {
          if (typeof letterTemplate.reciepients_address === "string") {
            return letterTemplate.reciepients_address.split(",").map((item) => item.trim());
          } else if (Array.isArray(letterTemplate.reciepients_address)) {
            // If array, check if first element is a comma-separated string
            if (letterTemplate.reciepients_address.length > 0 && typeof letterTemplate.reciepients_address[0] === "string") {
              return letterTemplate.reciepients_address[0].split(",").map((item) => item.trim());
            }
            return letterTemplate.reciepients_address.map((item) => String(item).trim());
          }
        }
        if (caseDetails?.full_address) {
          if (typeof caseDetails.full_address === "string") {
            return caseDetails.full_address.split(",").map((item) => item.trim());
          } else if (Array.isArray(caseDetails.full_address)) {
            return caseDetails.full_address.map((item) => String(item).trim());
          }
        }
        return [];
      })();
      console.log("Recipient Address Texts:", recipientAddressTexts); // Debug log
      if (recipientAddressTexts.length === 0) {
        console.warn("No recipient address available");
        y = addText("No Address Provided", margin, y, { lineHeight: 12 });
      } else {
        recipientAddressTexts.forEach((text) => {
          if (typeof text === "string" && text) {
            y = addText(text, margin, y, { lineHeight: 12 });
          }
        });
      }


      // Salutation
    y = addText(letterTemplate?.greetings, margin, y);

      // y -= 30;
     // Title
      const title = letterTemplate?.title ;
      const titleWidth = timesRomanBoldFont.widthOfTextAtSize(title, fontSize);
      page.drawText(title, {
        x: (width - titleWidth) / 2,
        y: y,
        size: fontSize,
        font: timesRomanBoldFont,
      });
      page.drawLine({
        start: { x: (width - titleWidth) / 2, y: y - 5 },
        end: { x: (width + titleWidth) / 2, y: y - 5 },
        thickness: 1,
      });
      y -= 40;

 

        // Case details
      y = addText(
        `${letterTemplate?.bodyParameters}`,
        margin,
        y,
        { lineHeight: 12 }
      );
    y -= 30;
  y = addText(`${letterTemplate?.body_title}`,margin, y, { bold: true });
      y -= 5;
      // Letter content paragraphs
     // Letter body
      const paragraphs = typeof letterTemplate.Body === "string"
          ? letterTemplate.Body.split("\n").map(item => item.trim())
          : Array.isArray(letterTemplate.Body)
            ? letterTemplate.Body.map(item => String(item).trim())
            : []
        
      paragraphs.forEach((paragraph) => {
        const words = paragraph.split(" ");
        let lines = [];
        let currentLine = "";

        // Break text into lines
        words.forEach((word) => {
          const testLine = currentLine + word + " ";
          const testWidth = timesRomanFont.widthOfTextAtSize(testLine, fontSize);
          if (testWidth > width - margin * 2 && currentLine !== "") {
            lines.push(currentLine.trim());
            currentLine = word + " ";
          } else {
            currentLine = testLine;
          }
        });
        if (currentLine.trim() !== "") {
          lines.push(currentLine.trim());
        }

        // Draw lines with justification
        lines.forEach((line, lineIndex) => {
          if (lineIndex === lines.length - 1 || lines.length === 1) {
            y = addText(line, margin, y);
          } else {
            const lineWords = line.split(" ");
            if (lineWords.length > 1) {
              const totalTextWidth = lineWords.reduce(
                (total, word) => total + timesRomanFont.widthOfTextAtSize(word, fontSize),
                0
              );
              const availableWidth = width - margin * 2;
              const totalSpaceWidth = availableWidth - totalTextWidth;
              const spaceWidth = totalSpaceWidth / (lineWords.length - 1);
              let xPos = margin;
              lineWords.forEach((word, wordIndex) => {
                page.drawText(word, {
                  x: xPos,
                  y: y,
                  size: fontSize,
                  font: timesRomanFont,
                });
                xPos += timesRomanFont.widthOfTextAtSize(word, fontSize);
                if (wordIndex < lineWords.length - 1) {
                  xPos += spaceWidth;
                }
              });
              y -= 10;
            } else {
              y = addText(line, margin, y);
            }
          }
        });
        y -= 5;
      });

      // Add paragraphs with text wrapping
      // paragraphs.forEach(paragraph => {
      //   const words = paragraph.split(' ');
      //   let line = '';
        
      //   words.forEach(word => {
      //     const testLine = line + word + ' ';
      //     const testWidth = timesRomanFont.widthOfTextAtSize(testLine, fontSize);
          
      //     if (testWidth > width - (margin * 2) && line !== '') {
      //       y = addText(line.trim(), margin, y);
      //       line = word + ' ';
      //     } else {
      //       line = testLine;
      //     }
      //   });
        
      //   if (line.trim() !== '') {
      //     y = addText(line.trim(), margin, y);
      //   }
        
      //   y -= 10; // Paragraph spacing
      // });

      // Add paragraphs with text wrapping and justification


  
 


      y -= 5;

      // Closing
      y = addText("Yours faithfully,", margin, y);
      y -= 20;
      y = addText("Amal Perera", margin, y);
      y = addText(signatureOwner, margin, y);

      // Convert PDF to blob and create URL
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);

    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

   const handleDownloadPDF = async (e) => {
          e.preventDefault();
        
  
          const userDataID = await getLoggedUserId();
          console.log("User Data ID:", userDataID);
          let payload = {
              
              case_id: Number(case_id),
              pdf_by: userDataID,
              signed_by: userDataID,
              customer_name: caseDetails.data.customer_name,
              created_by: userDataID,
              postal_address: caseDetails.data.full_address,
              event_source: "Hard coded test",
              
          };
  
          // Check for changes
          
          // if (accountNo !== caseDetails.accountNo) payload.edited_account_no = accountNo;
          // if (selectOption) payload.edited_event_source = selectOption;
          // if (customerName !== caseDetails.customerName) payload.edited_customer_name = customerName;
          // if (address !== caseDetails.address) payload.edited_address = address;
          // if (arrears !== caseDetails.arrears) payload.edited_arrears = Number(arrears);
          // if (billingCentre !== caseDetails.billingCentre) payload.edited_billing_centre = billingCentre;
          // if (customerType !== caseDetails.customerType) payload.edited_customer_type = customerType;
  
          // if (Object.keys(payload).length <= 2) { // Only case_id, edited_by
          //     Swal.fire({
          //         icon: 'warning',
          //         title: 'No Changes Detected',
          //         text: 'No changes were made to the form.',
          //         confirmButtonColor: "#f1c40f",
          //     });
          //     return;
          // }
  
          // setIsEdited(true);
  
          Swal.fire({
              title: "Confirm Submission",
              text: "Are you sure you want to proceed ?",
              icon: "question",
              showCancelButton: true,
              confirmButtonColor: "#28a745",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes",
          }).then(async (result) => {
              if (result.isConfirmed) {
                  try {
                      console.log("Submitting payload:", payload);
                      const response = await Create_FTL_LOD(payload);
                      console.log("Response from Create_FTL_LOD:", response);
                      if (response.message === "FTL LOD entry and case status updated successfully") {
                          Swal.fire({
                              icon: 'success',
                              title: 'Success',
                              text: 'Data submitted successfully!',
                              confirmButtonColor: "#28a745",
                          });
                          // setRemark("");
                          if (pdfUrl) {
                            const link = document.createElement('a');
                            link.href = pdfUrl;
                            link.download = 'FTL_LOD.pdf';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            } 
                          fetchCaseDetails();
                      } else {
                          Swal.fire({
                              icon: 'error',
                              title: 'Error',
                              text: 'Failed to submit data. Please try again.',
                              confirmButtonColor: "#d33",
                          });
                      }
                  } catch (error) {
                      console.error("Error submitting data:", error);
                      const errorMessage = error.response?.data?.error || 'Failed to submit data. Please try again.';
                      Swal.fire({
                          icon: 'error',
                          title: 'Error',
                          text: errorMessage,
                          confirmButtonColor: "#d33",
                      });
                  }
              }
          });
      };
 
  // Add this before the return statement
if (!case_id) {
  return (
    <div className="min-h-screen bg-gray-50 p-8 font-[Poppins] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h2>
        <p className="text-gray-600">Waiting for case information...</p>

      </div>
    </div>
  );
}

  return (
    <>
      {/* <GlobalStyle /> */}
      {/* <div className="min-h-screen bg-gray-50 p-8 font-[Poppins]"> */}
        {/* Title */}
                <h1 className={GlobalStyle.headingLarge + " mb-6"}>Preview of FTL LOD </h1>

                <div
                    className={`${GlobalStyle.tableContainer}  bg-white bg-opacity-50 p-8 max-w-4xl mx-auto `}
                >
        
        <div className="flex flex-wrap gap-4 items-center mb-8">
          <label className="text-lg font-medium text-gray-700">Template</label>
          <select
            className="border border-gray-300 rounded-md p-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
          >
            <option value="Default">Default</option>
            <option value="Custom">Custom</option>
          </select>
          
          <label className="text-lg font-medium text-gray-700 ml-6">Signature Owner</label>
          <select
            className="border border-gray-300 rounded-md p-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={signatureOwner}
            onChange={(e) => setSignatureOwner(e.target.value)}
          >
            <option value="Attorney-at-Law">Attorney-at-Law</option>
            <option value="Legal Officer">Legal Officer</option>
          </select>
        </div>

           {/* PDF Viewer */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-white shadow-lg h-[800px] w-[900px] rounded-lg border border-gray-200 overflow-hidden">
            {pdfUrl ? (
              <Worker workerUrl={`${window.location.origin}/node_modules/pdfjs-dist/build/pdf.worker.min.js`}>
                <div style={{ height: '100%' }}>
                  <Viewer
                    fileUrl={pdfUrl}
                    plugins={[defaultLayoutPluginInstance]}
                  />
                </div>
              </Worker>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Loading PDF preview...</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <button
            onClick={handleChangeDetails}
            className={`${GlobalStyle.buttonPrimary} w-full sm:w-auto`}
          >
            Change Details
          </button>
          <button
            onClick={handleDownloadPDF}
            className={`${GlobalStyle.buttonPrimary} w-full sm:w-auto`}
            disabled={!pdfUrl}
          >
            Download PDF
          </button>
        </div>
      </div>
    </>
  );
};

export default FTL_LOD_Creation;