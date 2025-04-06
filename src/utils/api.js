import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,  // Ensure cookies/sessions work properly
});



export default API;
