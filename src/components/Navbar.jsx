import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, Space } from "antd";
import { Link } from "react-router-dom";

const Navbar = () => {
  const items = [
    {
      label: (
        <Link
          to="/products"
          className="text-md font-bold text-red-700 hover:text-blue-800"
        >
          PRODUCTS
        </Link>
      ),
      key: "0",
    },
    {
      label: (
        <Link
          to="/addtoproduct"
          className="text-md font-bold text-red-700 hover:text-red-800"
        >
          ADD NEW PRODUCT
        </Link>
      ),
      key: "1",
    },
    {
      label: (
        <Link
          to="/categorics"
          className="text-md font-bold text-red-700 hover:text-blue-800"
        >
          CATEGORICS
        </Link>
      ),
      key: "2",
    },
  ];

  const settingNav = [
    {
      label: (
        <Link
          to="admin-list"
          className="text-lg font-semibold text-red-700 hover:text-blue-800"
        >
          Users list
        </Link>
      ),
      key: "0",
    },
    {
      label: (
        <Link
          to="/add-new-user"
          className="text-lg font-semibold text-red-700 hover:text-red-800"
        >
          Add New User
        </Link>
      ),
      key: "1",
    },
    {
      label: (
        <a className="text-lg font-semibold text-red-700 hover:text-blue-800">
          App
        </a>
      ),
      key: "2",
    },
    {
      label: (
        <Link
          to="/postal-code"
          className="text-lg font-semibold text-red-700 hover:text-blue-800"
        >
          Postal Code
        </Link>
      ),
      key: "3",
    },
  ];
  return (
    <nav className="bg-[#e24c80] shadow ">
      <div className="container px-6 py-4 mx-auto">
        <div className="lg:flex lg:items-center">
          <div className="flex items-center justify-between">
            <div className="flex lg:hidden">
              <button
                type="button"
                className="text-white  focus:outline-none "
                aria-label="toggle menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4 8h16M4 16h16" />
                </svg>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="absolute inset-x-0 z-20 flex-1 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white  lg:mt-0 lg:p-0 lg:top-0 lg:relative lg:bg-transparent lg:w-auto lg:opacity-100 lg:translate-x-0 lg:flex lg:items-center lg:justify-between">
            <div className="flex flex-col text-white text-lg font-semibold capitalize lg:flex lg:px-16 lg:-mx-4 lg:flex-row lg:items-center">
              <Link
                to="/"
                className="mt-2 transition-colors duration-300 transform lg:mt-0 lg:mx-4 hover:text-gray-900"
              >
                Dashboard
              </Link>

              <Dropdown
                menu={{
                  items,
                }}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    Products
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>

              <Link
                to="/orders"
                className="mt-2 transition-colors duration-300 transform lg:mt-0 lg:mx-4 hover:text-gray-900"
              >
                Orders
              </Link>
              <a
                href="#"
                className="mt-2 transition-colors duration-300 transform lg:mt-0 lg:mx-4 hover:text-gray-900"
              >
                Invoices
              </a>
              <a
                href="#"
                className="mt-2 transition-colors duration-300 transform lg:mt-0 lg:mx-4 hover:text-gray-900"
              >
                Credits
              </a>
              <Link
                to="/customers"
                className="mt-2 transition-colors duration-300 transform lg:mt-0 lg:mx-4 hover:text-gray-900"
              >
                Customers
              </Link>
              <Dropdown
                menu={{
                  items: settingNav,
                }}
              >
                <a>
                  <Space>
                    Settings
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
            </div>

            <div className="flex justify-center gap-3 mt-6 lg:flex lg:mt-0 lg:-mx-2">
              <Button
                color="danger"
                variant="outlined"
                className="text-md font-semibold py-5"
              >
                AJOUTER UNE CMD
              </Button>
              <Link to="/add-customer">
                <Button
                  color="danger"
                  variant="outlined"
                  className="text-md font-semibold py-5"
                >
                  AJOUTER UN CLIENT
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
