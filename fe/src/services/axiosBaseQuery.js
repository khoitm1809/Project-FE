// src/services/axiosBaseQuery.js
import http from "./https";

export const axiosBaseQuery = () => async ({ url, method = "GET", data, params }) => {
  try {
    const result = await http({ url, method, data, params });
    return { data: result.data }; // bây giờ result lại là res đầy đủ
  } catch (err) {
    return {
      error: {
        status: err?.response?.status || 500,
        data: err?.response?.data || err.message || "Unknown error",
      }
    };
  }

};
