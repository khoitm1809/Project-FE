/* eslint-disable no-undef */
import axios from "axios";

import {
  LOCAL_STORAGE_NAME,
  MESSAGE_TYPE,
  MESSAGE_TYPE_VCB,
  SUCCESS_CODE,
} from "../utils/constant";
import { getOpenDialogFn } from "../components/globalConfirmDialog";
import { getMessageFromCode } from "./messageHttp";

axios.defaults.timeout = 30000;
// axios.defaults.timeout = 100;
axios.defaults.timeoutErrorMessage = "timeout";

const http = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  withCredentials: false,
  headers: {
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
});

// Add a request interceptor
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LOCAL_STORAGE_NAME.TOKEN);
    const lang = localStorage.getItem(LOCAL_STORAGE_NAME.LANGUAGE);
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    // config.headers["Accept-Language"] = lang ?? LANGUAGE_CODE_VI;
    config.headers["X-Request-Source"] = 'web-app';
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

http.interceptors.response.use(
  function (res) {
    if (res?.data.errorCode == SUCCESS_CODE) {
      return res?.data;
    } else {
      const openDialog = getOpenDialogFn();
      openDialog({
        // type: MESSAGE_TYPE.ERROR,
        message: res?.data?.errorMessage,
        isHideAction: true
      });
      throw res?.data;
    }
  },
  (error) => {
    const openDialog = getOpenDialogFn();

    let status = 0;
    if (error?.status) {
      status = error?.status;
    } else if (error?.response) {
      openDialog({
        type: MESSAGE_TYPE.ERROR,
        message: getMessageFromCode(error?.response),
        isHideAction: true,
        actionCancel: () => {
          if (error?.response?.status === 401) {
            localStorage.removeItem(LOCAL_STORAGE_NAME.TOKEN);
            const message = { "msgType": "MESSAGE_TYPE_VCB.BACK" };
            window.parent.postMessage(message, '*');
          }
        },

      });
      status = error?.response.status;
      throw error?.response?.statusText;
    }
    else {
      openDialog({
        type: MESSAGE_TYPE.ERROR,
        message: "Network error. Please check your connection.",
        isHideAction: true,
      });
    }
  }
);

export default http;
