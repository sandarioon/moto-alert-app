import React, { useState, useEffect } from "react";
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  isAxiosError,
} from "axios";

import { AuthContext, AuthContextValue } from "@/context/AuthContext";

axios.defaults.baseURL = "https://moto-alert.ru";

const useAxios = (axiosParams: AxiosRequestConfig) => {
  const { logout } = React.useContext(AuthContext) as AuthContextValue;
  const [response, setResponse] = useState<AxiosResponse>();
  const [error, setError] = useState<AxiosError>();
  const [isLoading, setIsLoading] = useState(
    axiosParams.method === "GET" || axiosParams.method === "get"
  );

  const fetchData = async (params: AxiosRequestConfig) => {
    try {
      const result = await axios.request(params);
      setResponse(result);
    } catch (err: any) {
      setError(err);
      if (isAxiosError(err) && err.status === 401) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sendData = () => {
    fetchData(axiosParams);
  };

  useEffect(() => {
    if (axiosParams.method === "GET" || axiosParams.method === "get") {
      fetchData(axiosParams);
    }
  }, []);

  return { response, error, isLoading, sendData };
};

export default useAxios;
