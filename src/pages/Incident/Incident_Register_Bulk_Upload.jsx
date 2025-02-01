import { useState } from "react";
import axios from "axios";
import GlobalStyle from "../../assets/prototype/GlobalStyle";

const Incident_Register_Bulk_Upload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [actionType, setActionType] = useState("");

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
            alert("Please select both an action type and a file");
            return;
        }

        const formData = new FormData();
        formData.append("File_Name", selectedFile.name);
        formData.append("File_Type", actionType);
        formData.append("File_Content", selectedFile);
        formData.append("Created_By", "User123"); // Replace with actual user data

        try {
            const response = await axios.post(
                "http://localhost:5000/api/incident/upload_drs_file", 
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            alert(response.data.message);
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("File upload failed!");
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
                            <select className={GlobalStyle.selectBox} onChange={handleActionTypeChange}>
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
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Incident_Register_Bulk_Upload;
