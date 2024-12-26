import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import DashBoard from "../pages/DashBoard";
import Login from "../pages/Login";
import PrivateRoute from "./PrivateRoute";
import Products from "../pages/ProductPage/Products";
import AddNewProduct from "../pages/ProductPage/AddNewProduct";
import Categories from "../pages/ProductPage/Categories";
import Customers from "../pages/Customers";
import AdminList from "../pages/SettingsPage/AdminList";
import Orders from "../pages/orders/Orders";
import Test from "../pages/Test";
import AdminEdit from "../pages/SettingsPage/AdminEdit";
import AdminProfile from "../pages/AdminProfile";
import EditProduct from "../pages/ProductPage/EditProduct";
import InvoiceOrder from "../pages/orders/InvoiceOrder";
import AddNewUser from "../pages/SettingsPage/AddNewUser";
import AddOrder from "../pages/orders/AddOrder";
import EditOrder from "../pages/orders/EditOrder";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Main />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/",
        element: <DashBoard />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/products/edit/:productID",
        element: <EditProduct />,
      },
      {
        path: "/orders",
        element: <Orders />,
      },
      {
        path: "/orders/edit/:orderId",
        element: <EditOrder />,
      },
      {
        path: "/test",
        element: <Test />,
      },
      {
        path: "/addtoproduct",
        element: <AddNewProduct />,
      },
      {
        path: "/categorics",
        element: <Categories />,
      },
      {
        path: "/customers",
        element: <Customers />,
      },
      {
        path: "/admin-list",
        element: <AdminList />,
      },
      {
        path: "/admin-edit/:id",
        element: <AdminEdit />,
      },
      {
        path: "/admin-profile",
        element: <AdminProfile />,
      },
      {
        path: "/add-new-user",
        element: <AddNewUser />,
      },
      {
        path: "/add-order",
        element: <AddOrder />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
