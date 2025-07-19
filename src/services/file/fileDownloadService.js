// import axios from "axios";
// import { getLoggedUserId } from "../auth/authService";

// const BASE_URL = import.meta.env.VITE_BASE_URL; 
// const FILE_DOWNLOAD_URL = `${BASE_URL}/file`;

// export const List_Download_Files_from_Download_Log = async (pages) => {
//     try {
//       const Deligate_By = await getLoggedUserId();  
//       const response = await axios.post(
//         `${FILE_DOWNLOAD_URL}/List_Download_Files_from_Download_Log`,
//         {Deligate_By,
//         pages
//         }
//       );
//       return response.data;
      
//     } catch (error) {
//         console.error(
//             "Error fetching file download logs",
//             error.response?.data || error.message
//         );
//       throw error;
//     }
// };


 

// export const downloadIncidentFile = async (fileDownloadSeq) => {
//   try {
//     const downloadBy = "abc@slt.com";

//     const response = await axios.post(
//       "https://debtx.slt.lk:6500/file/download",
//       {
//         file_download_seq: fileDownloadSeq,
//         download_by: downloadBy,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return response.data; 

//   } catch (error) {
//     console.error("Error downloading file:", error.response?.data || error.message);
//     throw error.response?.data || error;
//   }
// };


import axios from "axios";
import { getLoggedUserId } from "../auth/authService";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const FILE_DOWNLOAD_URL = `${BASE_URL}/file`;

/**
 * List download logs
 */
export const List_Download_Files_from_Download_Log = async (pages) => {
  try {
    const Deligate_By = await getLoggedUserId();
    const response = await axios.post(
      `${FILE_DOWNLOAD_URL}/List_Download_Files_from_Download_Log`,
      {
        Deligate_By,
        pages,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching file download logs:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

/**
 * Download incident file from external API and trigger browser download
 */
export const downloadIncidentFile = async (fileDownloadSeq) => {
  try {
    const downloadBy = "abc@slt.com";

    const response = await axios.post(
      "https://debtx.slt.lk:6500/file/download",
      {
        file_download_seq: fileDownloadSeq,
        download_by: downloadBy,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "blob", // ⬅️ Handle binary data properly
      }
    );

    // Extract filename from Content-Disposition header (if present)
    const contentDisposition = response.headers["content-disposition"];
    const filenameMatch = contentDisposition?.match(/filename="?(.+)"?/);
    const filename = filenameMatch?.[1] || "download.xlsx";

    // Create and trigger download link
    const blob = new Blob([response.data]);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error(
      "Error downloading file:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

