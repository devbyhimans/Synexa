import axios from "axios";

// make the base url dynamic
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

// Hum Axios ka custom instance bana rahe ho — jo har API call me same configuration reuse karega
// Tum ek pre-configured HTTP client bana rahe ho
// Taaki baar-baar same cheeze na likhni pade

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials : true,   // send cookies with the request
}) 