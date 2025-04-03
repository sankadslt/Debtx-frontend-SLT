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
ui number : 1.2.1
Dependencies: Tailwind CSS, SweetAlert2
Related Files: 
Notes: This template uses Tailwind CSS */



import { useState } from "react";
import Swal from "sweetalert2";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { incidentRegisterBulkUpload } from "../../services/Incidents/incidentService.js";
import { getLoggedUserId } from "../../services/auth/authService";

const Incident_Register_Bulk_Upload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [actionType, setActionType] = useState("");
    const [loading, setLoading] = useState(false);

    // const handleFileChange = (event) => {
    //     const file = event.target.files[0];
    //     setSelectedFile(file);
    // };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
    
        if (!file) return;
    
        // Allowed file types: CSV and Excel
        const allowedExtensions = [".csv", ".xls", ".xlsx"];
        const fileExtension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    
        if (!allowedExtensions.includes(fileExtension)) {
            Swal.fire({
                icon: "error",
                title: "Invalid File Type",
                text: "Only CSV and Excel files are allowed.",
                confirmButtonColor: "#d33",
            });
            setSelectedFile(null);
            return;
        }
    
        setSelectedFile(file);
    };
    
    const handleActionTypeChange = (event) => {
        setActionType(event.target.value);
    };

    const getCurrentUser = async () => {
        try {
              const user_id = await getLoggedUserId();
            
            if (!user_id) {
                throw new Error("Username not found in user data");
            }
            return user_id;
        } catch (error) {
            console.error("Error getting user data:", error);
            throw new Error("Failed to get user information");
        }
    };

    

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!selectedFile || !actionType) {
            Swal.fire({
                icon: "warning",
                title: "Missing Information",
                text: "Please select both an action type and a file.",
                confirmButtonColor: "#f1c40f",
            });
            return;
        }
    
        try {
            const user_id = await getCurrentUser();
            const reader = new FileReader();
           
            reader.readAsText(selectedFile);
            reader.onload = async () => {
                const fileContent = reader.result;
                setLoading(true);
                console.log("userb",user_id); 
                const incidentData = {
                    File_Name: selectedFile.name,
                    File_Type: actionType,
                    File_Content: fileContent,
                    Created_By: user_id,
                    
                };
        
                try {
                    const response = await incidentRegisterBulkUpload(incidentData);
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: response.message,
                        confirmButtonColor: "#28a745",
                    });
                   
                } catch (error) {
                    console.error("Error uploading file:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Upload Failed",
                        text: error.message || "File upload failed! Please try again.",
                        confirmButtonColor: "#d33",
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
                    confirmButtonColor: "#d33",
                });
            };

        } catch (error) {
            console.error("Authentication error:", error);
            Swal.fire({
                icon: "error",
                title: "Authentication Error",
                text: error.message || "Please log in again to continue.",
                confirmButtonColor: "#d33",
            });
        }
    };

    return (
        <div className={`h-screen ${GlobalStyle.fontPoppins}`}>
            <h1 className={`${GlobalStyle.headingLarge} `}>File Upload</h1>
            <div className="h-[calc(100%-220px)] flex items-center justify-center">
                <div className={`${GlobalStyle.cardContainer} w-full max-w-2xl mx-6`}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Action Type Dropdown */}
                        <div className="flex gap-4 justify-center">
                            <select className={GlobalStyle.selectBox} onChange={handleActionTypeChange}  value={actionType} style={{ color: actionType === "" ? "gray" : "black" }}>
                                <option value="" hidden>Action Type</option>
                                <option value="Incident Creation" style={{ color: "black" }}>Incident Creation</option>
                                <option value="Incident Reject" style={{ color: "black" }}>Incident Reject</option>
                                <option value="Distribute to DRC" style={{ color: "black" }}>Distribute to DRC</option>
                                <option value="Validity Period Extend" style={{ color: "black" }}>Validity Period Extend</option>
                                <option value="Hold" style={{ color: "black" }}>Hold</option>
                                <option value="Discard" style={{ color: "black" }}>Discard</option>
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