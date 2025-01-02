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
  user_id,
} = {}) => {
  const getOrders = async () => {
    const response = await API.get("/order/getOrders", {
      params: { page, limit, fromDate, toDate, status, user_id },
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
    queryKey: ["order", page, limit, fromDate, toDate, status, user_id],
    queryFn: getOrders,
    keepPreviousData: true,
  });

  const { data: order = [], pagination = {} } = response;

  return { order, pagination, isLoading, isError, error, refetch };
};

// Products list
export const useAllProduct = ({ page = 1, limit = 10, name } = {}) => {
  const getAllProduct = async () => {
    const response = await API.get("/product/getProducts", {
      params: { page, limit, name },
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
    queryKey: ["allProduct", page, limit, name],
    queryFn: getAllProduct,
    keepPreviousData: true,
  });

  const { data: allProduct = [], pagination = {} } = response;

  return { allProduct, pagination, isLoading, isError, error, refetch };
};

// all customer list
export const useAllCustomers = () => {
  const getAllCustomer = async () => {
    const response = await API.get("/user/all?page=1&limit=10");
    return response.data.data;
  };

  const {
    data: allCustomer = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allCustomer"],
    queryFn: getAllCustomer,
  });

  return { allCustomer, isLoading, isError, error, refetch };
};

// Admin List
export const useAdminList = () => {
  const getAdminList = async () => {
    const response = await API.get("/admins/all");
    return response.data.data;
  };

  const {
    data: adminList = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["adminList"],
    queryFn: getAdminList,
  });

  return { adminList, isLoading, isError, error, refetch };
};

// Single Admin
export const useSingleAdmin = (id) => {
  const getSingleAdmin = async () => {
    const response = await API.get(`/admins/${id}`);
    return response.data;
  };

  const {
    data: admin = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin", id],
    queryFn: getSingleAdmin,
  });

  return { admin, isLoading, isError, error, refetch };
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
// get category
export const useSingleCategory = (handleId) => {
  const getSingleCategory = async () => {
    const response = await API.get(`/category/${handleId}`);
    return response.data.data;
  };

  const {
    data: singleCategory = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["singleCategory", handleId],
    queryFn: getSingleCategory,
  });

  return { singleCategory, isLoading, isError, error, refetch };
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
// get user roll
export const useUserRole = () => {
  const getUserRole = async () => {
    const response = await API.get("/admins/role");
    return response.data.data;
  };

  const {
    data: userRole = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["UserRole"],
    queryFn: getUserRole,
  });

  return { userRole, isLoading, isError, error, refetch };
};
// get user role with permition
export const useRolePermission = () => {
  const getRolePermission = async () => {
    const response = await API.get(`/admins/role/2`);
    console.log(response);
    return response.data.data;
  };

  const {
    data: rolePermission = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["rolePermission"],
    queryFn: getRolePermission,
  });

  return { rolePermission, isLoading, isError, error, refetch };
};

// get customer address
export const useCustomerAddress = (selectedCustomer) => {
  const getCustomerAddress = async () => {
    const response = await API.get(`/delivery-addresss/${selectedCustomer}`);
    return response.data.data;
  };

  const {
    data: customerAddress = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["customerAddress", selectedCustomer],
    queryFn: getCustomerAddress,
  });

  return { customerAddress, isLoading, isError, error, refetch };
};

// get product name
export const useProductName = () => {
  const getProduct = async () => {
    const response = await API.get("/product");
    return response.data.data;
  };

  const {
    data: product = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["product"],
    queryFn: getProduct,
  });

  return { product, isLoading, isError, error, refetch };
};

export const useDeliveryAddress = (orderId) => {
  const getSingleOrder = async () => {
    const response = await API.get("");
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

// Postal Code list
export const usePostalCode = () => {
  const getPostalCode = async () => {
    const response = await API.get("/product/post-code");
    return response.data.data;
  };

  const {
    data: postalCode = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["postalCode"],
    queryFn: getPostalCode,
  });

  return { postalCode, isLoading, isError, error, refetch };
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

// get Permition
export const usePermissionRole = () => {
  const getPermissionRole = async () => {
    const response = await API.get("/admins/rolewithpermission");
    return response.data.data;
  };

  const {
    data: permissionRole = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["permissionRole"],
    queryFn: getPermissionRole,
  });

  return { permissionRole, isLoading, isError, error, refetch };
};

// get multiple order
export const useMultipleOrder = (data) => {
  const getMultipleOrder = async () => {
    const response = await API.get("/order/array", {
      params: { ordersID: data },
    });
    return response.data;
  };
  const {
    data: multipleOrder = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["multipleOrder", data],
    queryFn: getMultipleOrder,
  });
  return { multipleOrder, isLoading, isError, error, refetch };
};

// get category with sub
export const useCategoryWithSub = () => {
  const getCategoryWithSub = async () => {
    const response = await API.get("/category");
    return response.data.data;
  };

  const {
    data: categoryWithSub = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["categoryWithSub"],
    queryFn: getCategoryWithSub,
  });

  return { categoryWithSub, isLoading, isError, error, refetch };
};
// get category with sub
export const usePageManegment = () => {
  const getPageManegment = async () => {
    const response = await API.get("/settings/privacy");
    return response.data.data;
  };

  const {
    data: pageManegment = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["PageManegment"],
    queryFn: getPageManegment,
  });

  return { pageManegment, isLoading, isError, error, refetch };
};

export const useTodayOrder = () => {
  const getTodayOrder = async () => {
    const today = new Date().toISOString().split("T")[0];

    const response = await API.get(
      `/order/all?fromDate=${today}&toDate=${today}`
    );
    return response.data.data; // Adjust based on actual response
  };

  const {
    data: todayOrder = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["todayOrder", new Date().toISOString().split("T")[0]],
    queryFn: getTodayOrder,
    onError: (error) => console.error("Query Error:", error),
    onSuccess: (data) => console.log("Query Success:", data),
  });

  return { todayOrder, isLoading, isError, error, refetch };
};

export const useWeekOrder = () => {
  const getWeekOrder = async () => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const fromDate = sevenDaysAgo.toISOString().split("T")[0];
    const toDate = today.toISOString().split("T")[0];

    const response = await API.get(
      `/order/all?fromDate=${fromDate}&toDate=${toDate}`
    );
    return response.data.data;
  };

  const {
    data: weekOrder = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["weekOrder", new Date().toISOString().split("T")[0]], // কুইরির জন্য ডাইনামিক কী
    queryFn: getWeekOrder,
    onError: (error) => console.error("Query Error:", error),
    onSuccess: (data) => console.log("Query Success:", data),
  });

  return { weekOrder, isLoading, isError, error, refetch };
};

export const useMonthlyOrder = () => {
  const getMonthlyOrder = async () => {
    const today = new Date();

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );

    const fromDate = firstDayOfMonth.toISOString().split("T")[0]; // চলতি মাসের প্রথম দিন
    const toDate = lastDayOfMonth.toISOString().split("T")[0]; // চলতি মাসের শেষ দিন

    const response = await API.get(
      `/order/all?fromDate=${fromDate}&toDate=${toDate}`
    );
    return response.data.data;
  };

  const {
    data: monthlyOrder = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["monthlyOrder", new Date().toISOString().split("T")[0]], // কুইরি কী
    queryFn: getMonthlyOrder,
    onError: (error) => console.error("Query Error:", error),
    onSuccess: (data) => console.log("Query Success:", data),
  });

  return { monthlyOrder, isLoading, isError, error, refetch };
};

export const useYearOrder = () => {
  const getYearOrder = async () => {
    const today = new Date();

    // চলতি বছরের শুরু এবং শেষ তারিখ বের করা
    const currentYear = today.getFullYear();
    const fromDate = `${currentYear}-01-01`;
    const toDate = today.toISOString().split("T")[0];

    // API থেকে ডেটা ফেচ করা
    const response = await API.get(
      `/order/all?fromDate=${fromDate}&toDate=${toDate}`
    );
    return response.data.data;
  };

  const {
    data: yearOrder = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["yearOrder", new Date().toISOString().split("T")[0]], // ডাইনামিক কুইরি কী
    queryFn: getYearOrder,
    onError: (error) => console.error("Query Error:", error),
    onSuccess: (data) => console.log("Query Success:", data),
  });

  return { yearOrder, isLoading, isError, error, refetch };
};
