import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL = `${BASE_URL}/Service`;

//Register a new service type
export const registerServiceType = async (payload) => {
	try {
		const response = await axios.post(`${URL}/Register_Service_Type`, payload);
		return response.data;
	} catch (error) {
		console.error("Error registering service type:", error);
		throw error?.response?.data || { message: "Something went wrong" };
	}
};

//Change the status of a service
export const changeServiceStatus = async ({ service_id, service_status }) => {
	try {
		const response = await axios.patch(`${URL}/Change_Service_Status`, {
			service_id,
			service_status,
		});
		return response.data;
	} catch (error) {
		console.error("Error changing service status:", error);
		throw error?.response?.data || { message: "Something went wrong" };
	}
};

//Get all services
export const getAllServices = async () => {
	try {
		const response = await axios.get(`${URL}/Service_Details`);
		return response.data;
	} catch (error) {
		console.error("Error fetching all services:", error);
		throw error?.response?.data || { message: "Something went wrong" };
	}
};

//Get service by ID (via POST)
export const getServiceDetailsById = async (service_id) => {
	try {
		const response = await axios.post(`${URL}/Service_Details_By_Id`, {
			service_id,
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching service by ID:", error);
		throw error?.response?.data || { message: "Something went wrong" };
	}
};

//Get all active services
export const getActiveServices = async () => {
	try {
		const response = await axios.get(`${URL}/Active_Service_Details`);
		return response.data;
	} catch (error) {
		console.error("Error fetching active services:", error);
		throw error?.response?.data || { message: "Something went wrong" };
	}
};
