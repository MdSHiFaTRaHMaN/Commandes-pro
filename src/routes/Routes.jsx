import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import DashBoard from "../pages/DashBoard";
import Products from "../pages/Products";
import Login from "../pages/Login";
import PrivateRoute from "./PrivateRoute";
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
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
