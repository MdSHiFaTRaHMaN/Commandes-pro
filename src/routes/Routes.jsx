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
        path: "/orders",
        element: <Orders />,
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
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
