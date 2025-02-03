/*Purpose:
Created Date: 2025-01-09
Created By: Dilmith Siriwardena (jtdsiriwardena@gmail.com)
Last Modified Date: 2025-01-09
Modified By: Dilmith Siriwardena (jtdsiriwardena@gmail.com)
Last Modified Date: 2025-01-20
Modified By: Dilmith Siriwardena (jtdsiriwardena@gmail.com)
             Vihanga Jayawardena (vihangaeshan2002@gmail.com)
             Janendra Chamodi ( apjanendra@gmail.com)
Version: React v18
ui number : 1.1
Dependencies: Tailwind CSS, SweetAlert2
Related Files: 
Notes: This template uses Tailwind CSS */

import { useState } from "react";
import Swal from "sweetalert2";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { incidentRegisterBulkUpload } from "../../services/Incidents/incidentService.js";

const Incident_Register_Bulk_Upload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [actionType, setActionType] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleActionTypeChange = (event) => {
        setActionType(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedFile || !actionType) {
            Swal.fire({
                icon: "warning",
                title: "Missing Information",
                text: "Please select both an action type and a file.",
            });
            return;
        }

        const reader = new FileReader();
        reader.readAsText(selectedFile);
        reader.onload = async () => {
            const fileContent = reader.result;
            setLoading(true);
            

            const incidentData = {
                File_Name: selectedFile.name,
                File_Type: actionType,
                File_Content: fileContent,
                Created_By: "User123" // Replace with actual user data
            };

            try {
                const response = await incidentRegisterBulkUpload(incidentData);
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: response.message,
                });
            } catch (error) {
                console.error("Error uploading file:", error);
                Swal.fire({
                    icon: "error",
                    title: "Upload Failed",
                    text: "File upload failed! Please try again.",
                });
            } finally {
                setLoading(false);
            }
        };
        
        reader.onerror = () => {
            Swal.fire({
                icon: "error",
                title: "File Read Error",
                text: "Failed to read file content.",
            });
        };
    };

    return (
        <div className={`h-screen ${GlobalStyle.fontPoppins}`}>
            <h1 className={`${GlobalStyle.headingLarge} `}>File Upload</h1>
            <div className="h-[calc(100%-220px)] flex items-center justify-center">
                <div className={`${GlobalStyle.cardContainer} w-full max-w-2xl mx-6`}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Action Type Dropdown */}
                        <div className="flex gap-4 justify-center">
                            <select className={GlobalStyle.selectBox} onChange={handleActionTypeChange} value={actionType}>
                                <option value="">Action Type</option>
                                <option value="Incident Creation">Incident Creation</option>
                                <option value="Incident Reject">Incident Reject</option>
                                <option value="Distribute to DRC">Distribute to DRC</option>
                                <option value="Validity Period Extend">Validity Period Extend</option>
                                <option value="Hold">Hold</option>
                                <option value="Discard">Discard</option>
                            </select>
                        </div>

                        {/* File Upload Section */}
                        <div className="space-y-2">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className={`${GlobalStyle.inputText} w-full file:mr-4 file:py-2 file:px-4 
                file:rounded-full file:border-0 file:text-sm file:font-semibold
                file:bg-[#00256A] file:text-white hover:file:bg-blue-900`}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className={GlobalStyle.buttonPrimary}
                                disabled={loading}
                            >
                                {loading ? "Uploading..." : "Submit"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Incident_Register_Bulk_Upload;
