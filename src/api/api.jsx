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
export const useAllProduct = ({ page = 1, limit = 10 } = {}) => {
  const getAllProduct = async () => {
    const response = await API.get("/product/all", {
      params: { page, limit },
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
    queryKey: ["allProduct", page, limit],
    queryFn: getAllProduct,
    keepPreviousData: true,
  });

  const { data: allProduct = [], pagination = {} } = response;

  return { allProduct, pagination, isLoading, isError, error, refetch };
};

// get single product
export const useSingleProduct = (productID) => {
  const getSingleProduct = async () => {
    const response = await API.get(`/product/${productID}`);
    return response.data.data;
  };

  const {
    data: singleProduct = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["singleProduct", productID],
    queryFn: getSingleProduct,
  });

  return { singleProduct, isLoading, isError, error, refetch };
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

// get category
export const useCategory = () => {
  const getCategory = async () => {
    const response = await API.get("/category/all");
    return response.data.data;
  };

  const {
    data: category = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["category"],
    queryFn: getCategory,
  });

  return { category, isLoading, isError, error, refetch };
};

// get sub category
export const useSubCategory = (categoryId) => {
  const getSubCategory = async () => {
    const response = await API.get(`/subcategory/all/${categoryId}`);
    return response.data.data;
  };

  const {
    data: subCategory = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["subCategory", categoryId],
    queryFn: getSubCategory,
  });

  return { subCategory, isLoading, isError, error, refetch };
};
// get single order

export const useSingleOrder = (orderId) => {
  const getSingleOrder = async () => {
    console.log(orderId);
    const response = await API.get(`/order/${orderId}`);
    return response.data.order;
  };

  const {
    data: singleOrder = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["singleOrder", orderId],
    queryFn: getSingleOrder,
  });

  return { singleOrder, isLoading, isError, error, refetch };
};
