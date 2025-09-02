import axios from "axios";
import { parseCookies } from "nookies";

// Replace the URL with your actual API endpoint
const baseURL =  process.env.NEXT_PUBLIC_BASE_URL  || "http://localhost:3000/api" 
 ;
console.log(baseURL, "backend running");

const cookies = parseCookies();
const token = cookies.token; // Get the token cookie


// Create an Axios instance with the base URL
const api = axios.create({
  baseURL: `${baseURL}`,
});
console.log("authUser",api)
// Add an interceptor to include JWT in request headers if available
api.interceptors.request.use(
  (config) => {
    const jwt = token; 

    if (jwt) {
      config.headers.Authorization = `Bearer ${jwt}`;
    }

    // Add Content-Type header with a default value of 'application/json'
    config.headers["Content-Type"] = "application/json";

    // If you have a base64 image field in your form, you can include it in the request
    // For example, if your form has a field named 'image' containing the base64 data:
    // config.data = {
    //   ...config.data,
    //   image: base64ImageData,
    // };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add an interceptor to handle response errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (
        status === 401 &&
        data.message === "An error occurred - Token Expired"
      ) {
        // Token has expired, redirect to the login page
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;