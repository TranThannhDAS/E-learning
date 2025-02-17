import { useState, useEffect } from "react";
import axios from "axios";
import useCustomSnackbar from "./useCustomSnackbar";
import {
  getRefreshToken,
  getToken,
  setRefreshToken,
  setToken,
  signOut,
} from "@eproject4/helpers/authHelper";
import { useNavigate } from "react-router-dom";

const useAxiosWithLoading = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const { showSnackbar } = useCustomSnackbar();
  const [success, setSuccess] = useState(false);

  const request = axios.create({
    baseURL: "http://localhost:5187/api",
  });

  useEffect(() => {
    const requestInterceptor = request.interceptors.request.use(
      (config) => {
        setLoading(true);
        setSuccess(false);
        const accessToken = getToken();
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        setLoading(false);
        return Promise.reject(error);
      }
    );

    const responseInterceptor = request.interceptors.response.use(
      (response) => {
        setLoading(false);
        return response;
      },
      async (err) => {
        setLoading(false);
        if (err?.response && err?.response?.status === 401) {
          try {
            let refreshToken = getRefreshToken();
            let accessToken = getToken();
            const res = await request.post("/User/refresh", {
              accessToken,
              refreshToken,
            });
            refreshToken = res?.data?.refreshToken;
            accessToken = res?.data?.accessToken;
            setToken(accessToken);
            setRefreshToken(refreshToken);
            err.config.headers.Authorization = `Bearer ${accessToken}`;
            return request.request(err.config);
          } catch (refErr) {
            const navigate = useNavigate();

            showSnackbar("Session expired, please login again", "error");
            signOut();
            navigate("/dang-nhap");
            return Promise.reject(refErr);
          }
        }
        setError(err);
        showSnackbar(err?.response?.data?.massage || "Có lỗi xảy ra", "error");
        return Promise.reject(err);
      }
    );

    return () => {
      request.interceptors.request.eject(requestInterceptor);
      request.interceptors.response.eject(responseInterceptor);
    };
  }, [request, showSnackbar]);

  const callApi = async (
    path,
    method = "get",
    body = null,
    message = "",
    snackbar = true
  ) => {
    setError(null);
    try {
      const response = await request.request({
        url: path,
        method,
        data: body,
      });
      if (response.data) {
        snackbar && showSnackbar(message, "success");
        setSuccess(true);
        setData(response);
        return response;
      }
    } catch (err) {
      setError(err);
    }
  };

  return { callApi, loading, error, success, data };
};

export default useAxiosWithLoading;
