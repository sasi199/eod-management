import axios from "axios";

const apiInstance = axios.create({
  baseURL: "http://localhost:8010",
});

apiInstance.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem("authToken");
    console.log("Token attached to header:", authToken);

    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
console.log(config);
    }
    return config;
  },
  (error) => {
    console.error("Request Error Interceptor:", error);
    return Promise.reject(error);
  }
);

// apiInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       console.error("Unauthorized access - logging out...");
//       localStorage.removeItem("userToken");
//       window.location.href = "/sidebar/staffs";
//     }
//     return Promise.reject(error);
//   }
// );

export default apiInstance;
