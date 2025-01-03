import { Button, Dropdown, Space } from "antd";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";

const Navbar = () => {
  const items = [
    {
      label: (
        <Link
          to="/products"
          className="text-md font-bold"
        >
          <span className="text-PrimaryColor">PRODUCTS</span>
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
          <span className="text-PrimaryColor">ADD NEW PRODUCT</span>
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
          <span className="text-PrimaryColor">CATEGORICS</span>
        </Link>
      ),
      key: "2",
    },
  ];

  const settingNav = [
    {
      label: (
        <Link to="admin-list">
          <span className="text-md font-bold text-PrimaryColor">
            ADMIN LIST
          </span>
        </Link>
      ),
      key: "0",
    },
    {
      label: (
        <Link to="/add-new-user">
          <span className="text-md font-bold text-PrimaryColor">
            ADD NEW USER
          </span>
        </Link>
      ),
      key: "1",
    },
    {
      label: (
        <Link to="/postal-code">
          <span className="text-md font-bold text-PrimaryColor">
            POSTAL CODE
          </span>
        </Link>
      ),
      key: "2",
    },
  ];
  const app = [
    {
      label: (
        <Link to="page-manegment">
          <span className="text-md font-bold text-PrimaryColor">
            PAGE MANEGMENT
          </span>
        </Link>
      ),
      key: "0",
    },
    {
      label: (
        <Link to="/update-password">
          <span className="text-md font-bold text-PrimaryColor">SETTING</span>
        </Link>
      ),
      key: "1",
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
                    <IoIosArrowDown />
                  </Space>
                </a>
              </Dropdown>

              <Link
                to="/orders"
                className="mt-2 transition-colors duration-300 transform lg:mt-0 lg:mx-4 hover:text-gray-900"
              >
                Orders
              </Link>
              <Link
                to="/invoice"
                className="mt-2 transition-colors duration-300 transform lg:mt-0 lg:mx-4 hover:text-gray-900"
              >
                Invoices
              </Link>

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
                    <IoIosArrowDown />
                  </Space>
                </a>
              </Dropdown>
              <Dropdown
                className="ml-4"
                menu={{
                  items: app,
                }}
              >
                <a>
                  <Space>
                    APP
                    <IoIosArrowDown />
                  </Space>
                </a>
              </Dropdown>
            </div>

            <div className="flex justify-center gap-3 mt-6 lg:flex lg:mt-0 lg:-mx-2">
              <Link to="/add-order">
                <Button
                  color="danger"
                  variant="outlined"
                  className="text-md font-semibold py-5"
                >
                  AJOUTER UNE CMD
                </Button>
              </Link>

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
