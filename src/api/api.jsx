import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const API = axios.create({
  baseURL: "https://grocary-ecommerce.vercel.app/api/v1",
  // baseURL: "http://localhost:5000/api/v1",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// get admin
export const useAdminProfile = () => {
  const getAdmin = async () => {
    const response = await API.get("/admins/me");
    return response.data;
  };

  const {
    data: admin = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin"],
    queryFn: getAdmin,
  });

  return { admin, isLoading, isError, error, refetch };
};

// sign out
export const signOutAdmin = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

// get all Orders
export const useAllOrders = ({
  page = 1,
  limit = 15,
  fromDate,
  toDate,
  status,
} = {}) => {
  const getOrders = async () => {
    const response = await API.get("/order/all", {
      params: { page, limit, fromDate, toDate, status },
    });
    return response.data;
  };

  const {
    data: response = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["order", page, limit, fromDate, toDate, status],
    queryFn: getOrders,
    keepPreviousData: true,
  });

  const { data: order = [], pagination = {} } = response;

  return { order, pagination, isLoading, isError, error, refetch };
};
