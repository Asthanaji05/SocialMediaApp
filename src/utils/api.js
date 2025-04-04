import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,  // Ensure cookies/sessions work properly
});

// Correcting fetchData function to use axios
export const fetchData = async () => {
  try {
    const response = await API.get("/auth/test"); // Use axios instance here
    console.log("API Response:", response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export default API;
