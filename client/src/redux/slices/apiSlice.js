import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "./authSlice";

const API_BASE_URL =
  import.meta.env.VITE_APP_BASE_URL || "http://localhost:8800";
const API_URL = `${API_BASE_URL}/api`;

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    // 1. Try to get user info from Redux State
    // Most GitHub projects store it in state.auth.user or state.auth.userInfo
    const user = getState().auth?.user || JSON.parse(localStorage.getItem("userInfo"));
    const token = user?.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
  // This is important for cookies/sessions
  credentials: "include", 
});

const baseQueryWithAuth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    api.dispatch(logout());

    if (window.location.pathname !== "/log-in") {
      window.location.replace("/log-in");
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Users", "Tasks", "Notifications"],
  endpoints: (builder) => ({}),
});
