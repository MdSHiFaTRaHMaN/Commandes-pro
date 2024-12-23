import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

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

// Products list

// food menu
export const useAllProduct = () => {
  const getProduct = async () => {
    try {
      const response = await API.get(
        "/product/all?category=&name=&subcategory=&tag="
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching All product:", error);
      throw error;
    }
  };

  const [allProduct, setAllProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllProduct = async () => {
      try {
        const menuData = await getProduct();
        setAllProduct(menuData);
      } catch (error) {
        setError("Failed to fetch all product.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProduct();
  }, []);

  return { allProduct, loading, error };
};

// All user show
export const useAllCustomers = () => {
  const getCustomer = async () => {
    try {
      const response = await API.get("/user/all?page=1&limit=10");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching AllCustomer:", error);
      throw error;
    }
  };

  const [allCustomer, setAllCustomer] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllCustomer = async () => {
      try {
        const customerData = await getCustomer();
        setAllCustomer(customerData);
      } catch (error) {
        setError("Failed to fetch all Customer.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCustomer();
  }, []);

  return { allCustomer, loading, error };
};

// Admin List
export const useAdminList = () => {
  const getAdmin = async () => {
    try {
      const response = await API.get("/admins/all");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching Admin:", error);
      throw error;
    }
  };

  const [adminList, setAdminList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllAdmin = async () => {
      try {
        const adminData = await getAdmin();
        setAdminList(adminData);
      } catch (error) {
        setError("Failed to fetch all Admin.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllAdmin();
  }, []);

  return { adminList, loading, error };
};
