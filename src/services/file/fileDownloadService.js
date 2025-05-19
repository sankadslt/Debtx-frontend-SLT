import axios from "axios";
import { getLoggedUserId } from "../auth/authService";

const BASE_URL = import.meta.env.VITE_BASE_URL; 
const FILE_DOWNLOAD_URL = `${BASE_URL}/file`;

export const List_Download_Files_from_Download_Log = async () => {
    try {
      const Deligate_By = await getLoggedUserId();  
      const response = await axios.post(
        `${FILE_DOWNLOAD_URL}/List_Download_Files_from_Download_Log`,
        {Deligate_By}
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
  