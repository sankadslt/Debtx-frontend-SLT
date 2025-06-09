import axios from "axios";

//Base URL for for case-related API
const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL = `${BASE_URL}/RTOM`;

export const RTOM_Details = async () => {
    try {
        const response = await axios.get(`${URL}/RTOM_Details`);

        // Extract and return the drc_name for all active DRCs
        if (response.status === 200) {
            const rtom = response.data.data.map((rtom) => ({
                rtom_id: rtom.rtom_id,
                rtom: rtom.rtom_abbreviation,
            }));
            return rtom;
        } else {
            throw new Error("Failed to fetch RTOM details");
        }
    } catch (error) {
        console.error(
            "Error fetching RTOM details:",
            error.response?.data || error.message
        );
        throw error;
    }
};

export const List_All_Active_RTOMs = async () => {
    try {
        const response = await axios.get(`${URL}/List_All_Active_RTOMs`);

        // Extract and return the drc_name for all active DRCs
        if (response.status === 200) {
            const rtom = response.data.data.map((rtom) => ({
                rtom_id: rtom.rtom_id,
                rtom: rtom.rtom_name,
            }));
            return rtom;
        } else {
            throw new Error("Failed to fetch RTOM details");
        }
    } catch (error) {
        console.error(
            "Error fetching RTOM details:",
            error.response?.data || error.message
        );
        throw error;
    }
};