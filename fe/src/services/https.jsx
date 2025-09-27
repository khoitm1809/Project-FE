/* eslint-disable no-undef */
import axios from "axios";
import {
  LOCAL_STORAGE_NAME,
  SUCCESS_CODE,
} from "../utils/constant";

axios.defaults.timeout = 30000;
axios.defaults.timeoutErrorMessage = "timeout";

const http = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  // withCredentials: false,
  // headers: {
  //   "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  // },
});

// Add a request interceptor
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LOCAL_STORAGE_NAME.TOKEN);
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    config.headers["X-Request-Source"] = "web-app";
    return config;
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (res) => res, // luôn trả về nguyên res, để xử lý ở axiosBaseQuery
  (error) => Promise.reject(error) // giữ nguyên AxiosError
);

export default http;
