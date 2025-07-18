import axios from "axios";
import { getLoggedUserId } from "../auth/authService";

const BASE_URL = import.meta.env.VITE_BASE_URL; 
const FILE_DOWNLOAD_URL = `${BASE_URL}/file`;

export const List_Download_Files_from_Download_Log = async (pages) => {
    try {
      const Deligate_By = await getLoggedUserId();  
      const response = await axios.post(
        `${FILE_DOWNLOAD_URL}/List_Download_Files_from_Download_Log`,
        {Deligate_By,
        pages
        }
      );
    
      return response.data;
      
    } catch (error) {
        console.error(
            "Error fetching file download logs",
            error.response?.data || error.message
        );
      throw error;
    }
};


 

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
      }
    );

    return response.data; 

  } catch (error) {
    console.error("Error downloading file:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
