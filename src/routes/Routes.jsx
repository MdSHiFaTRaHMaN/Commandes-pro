import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import DashBoard from "../pages/DashBoard";
import Login from "../pages/Login";
import PrivateRoute from "./PrivateRoute";
import Products from "../pages/ProductPage/Products";
import AddNewProduct from "../pages/ProductPage/AddNewProduct";
import Categories from "../pages/ProductPage/Categories";
import AdminList from "../pages/SettingsPage/AdminList";
import Orders from "../pages/orders/Orders";
import Test from "../pages/Test";
import AdminEdit from "../pages/SettingsPage/AdminEdit";
import AdminProfile from "../pages/AdminProfile";
import EditProduct from "../pages/ProductPage/EditProduct";
import AddNewUser from "../pages/SettingsPage/AddNewUser";
import AddOrder from "../pages/orders/AddOrder";
import EditOrder from "../pages/orders/EditOrder";

import PostalCode from "../pages/SettingsPage/PostalCode";
import AddClient from "../pages/AddClient";
import OrderInvoice from "../pages/orders/OrderInvoice";
import MultiOrderInvoice from "../pages/orders/MultiOrderInvoice";
import InvoiceGenerator from "../pages/invoiceGenerator/InvoiceGenerator";
import Test2 from "../pages/Test2";

import Setting from "../pages/app/Setting";
import PageManegment from "../pages/app/PageManegment";
import Customer from "../pages/Customer";
import PageNotFound from "../components/PageNotFound";

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
        path: "/test2",
        element: <Test2 />,
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
        element: <Customer />,
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
      {
        path: "/postal-code",
        element: <PostalCode />,
      },
      {
        path: "/add-customer",
        element: <AddClient />,
      },
      {
        path: "/order-invoice/:orderId",
        element: <OrderInvoice />,
      },
      {
        path: "/update-password",
        element: <Setting />,
      },
      {
        path: "/page-manegment",
        element: <PageManegment />,
      },
      {
        path: "/multi-invoice",
        element: <MultiOrderInvoice />,
      },
      {
        path: "/invoice",
        element: <InvoiceGenerator />,
      }
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/*",
    element: <PageNotFound />,
  },
]);
