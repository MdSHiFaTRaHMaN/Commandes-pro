import { Table, Input, Select, Spin } from "antd";
import { FaTrashAlt, FaEdit, FaPlus } from "react-icons/fa";
import { API, useAllProduct } from "../../api/api";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Search from "antd/es/transfer/search";

const { Option } = Select;

const Products = () => {
  const { allProduct, loading, error } = useAllProduct();
  const [data, setData] = useState([]);
  const [editedData, setEditedData] = useState([]);

  useEffect(() => {
    if (allProduct) {
      const processedData = allProduct.map((item, index) => ({
        key: index + 1, // Unique key for each row
        id: item.id, // Adding id to match with the backend
        ref: item.ref || index + 1,
        name: item.name || "Unknown Product",
        purchase_price: item.purchase_price || 0,
        selling_price: item.selling_price || 0,
        regular_price: item.regular_price || 0,
        whole_price: item.whole_price || 0,
        supper_marcent: item.supper_marcent || 0,
        product_type: item.product_type || "N/A",
        unit: item.unit || 0,
        is_stock: item.is_stock || 0,
        country: item.country || "Unknown",
      }));
      setData(processedData);
    }
  }, [allProduct]);

  const handleInputChange = async (key, field, value) => {
    const updatedData = data.map((item) =>
      item.key === key ? { ...item, [field]: value } : item
    );
    setData(updatedData);

    const updatedEditedData = updatedData.filter((item) =>
      item.key === key
        ? { ...item, [field]: value }
        : editedData.find((edited) => edited.key === item.key)
    );
    setEditedData(updatedEditedData);

    console.log("Edited Data:", updatedEditedData);
  };

  const columns = [
    {
      title: "REF",
      dataIndex: "ref",
      key: "ref",
      align: "center",
      width: 50,
    },
    {
      title: "PRODUCTS",
      dataIndex: "product",
      key: "product",
      render: (text, record) => (
        <Input
          value={record.name}
          className="border-gray-300"
          onChange={(e) =>
            handleInputChange(record.key, "name", e.target.value)
          }
        />
      ),
    },
    {
      title: "PURCHASE PRICE",
      dataIndex: "purchase_price",
      key: "purchase_price",
      render: (text, record) => (
        <Input
          value={record.purchase_price}
          className="border-gray-300"
          onChange={(e) =>
            handleInputChange(record.key, "purchase_price", e.target.value)
          }
        />
      ),
    },
    {
      title: "PR",
      dataIndex: "pr",
      key: "pr",
      render: (text, record) => (
        <span className="border px-4 py-2 rounded bg-white">
          {record.selling_price}
        </span>
      ),
    },
    {
      title: "PRS",
      dataIndex: "prs",
      key: "prs",
      render: (text, record) => (
        <span className="border px-4 py-2 rounded bg-white">
          {record.regular_price}
        </span>
      ),
    },
    {
      title: "PG",
      dataIndex: "pg",
      key: "pg",
      render: (text, record) => (
        <span className="border px-4 py-2 rounded bg-white">
          {record.whole_price}
        </span>
      ),
    },
    {
      title: "SP",
      dataIndex: "sp",
      key: "sp",
      render: (text, record) => (
        <span className="border px-4 py-2 rounded bg-white">
          {record.whole_price}
        </span>
      ),
    },
    {
      title: "UNITS",
      dataIndex: "unit",
      key: "unit",
      width: 150,
      render: (text, record) => (
        <Select
          value={record.unit}
          className="w-full border-gray-300"
          onChange={(value) => handleInputChange(record.key, "unit", value)}
        >
          <Option value="KG (€ / KG)">KG (€ / KG)</Option>
          <Option value="G (€ / G)">G (€ / G)</Option>
          <Option value="MG (€ / MG)">MG (€ / MG)</Option>
          <Option value="L (€ / L)">L (€ / L)</Option>
          <Option value="ML (€ / ML)">ML (€ / ML)</Option>
          <Option value="U (€ / U)">U (€ / U)</Option>
          <Option value="CM (€ / CM)">CM (€ / CM)</Option>
          <Option value="MM (€ / MM)">MM (€ / MM)</Option>
          <Option value="M (€ / M)">M (€ / M)</Option>
        </Select>
      ),
    },
    {
      title: "UV",
      dataIndex: "uv",
      key: "uv",
      render: (text, record) => (
        <Input
          value={record.supper_marcent}
          className="border-gray-300"
          onChange={(e) =>
            handleInputChange(record.key, "supper_marcent", e.target.value)
          }
        />
      ),
    },
    {
      title: "STOCK",
      dataIndex: "stock",
      key: "stock",
      render: (text, record) => (
        <Input
          value={record.is_stock}
          className="border-gray-300"
          onChange={(e) =>
            handleInputChange(record.key, "is_stock", e.target.value)
          }
        />
      ),
    },
    {
      title: "ORIGIN",
      dataIndex: "origin",
      key: "origin",
      render: (text, record) => (
        <Select
          value={record.country}
          className="w-full border-gray-300"
          onChange={(value) => handleInputChange(record.key, "country", value)}
        >
          <Option value="Bangladesh">Bangladesh</Option>
          <Option value="Belgique">Belgique</Option>
          <Option value="Espagne">Espagne</Option>
        </Select>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: () => (
        <div className="flex gap-2 justify-center">
          <FaEdit className="text-yellow-600 cursor-pointer hover:text-yellow-800" />
          <FaTrashAlt className="text-red-600 cursor-pointer hover:text-red-800" />
        </div>
      ),
    },
  ];

  const contentStyle = {
    padding: 50,
    background: "rgba(0, 0, 0, 0.05)",
    borderRadius: 4,
  };
  const content = <div style={contentStyle} />;
  // loading
  if (loading)
    return (
      <Spin tip="Loading" size="large">
        {content}
      </Spin>
    );
  if (error) return <div>Error loading products</div>;
  // search funsion
  const onSearch = (value, _e, info) => console.log(info?.source, value);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="flex justify-between">
        <div className="flex gap-3">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            Product Table
          </h1>
          <Link to="/addtoproduct">
            <button className="bg-[#e24c80] p-3 text-white font-semibold rounded-md flex items-center gap-1">
             <FaPlus/> Add New Product
            </button>
          </Link>
        </div>
        <div>
          <Search
            placeholder="Search by Order ID"
            allowClear
            enterButton="Search"
            size="large"
            onSearch={onSearch}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        bordered
        pagination={{ pageSize: 10 }}
        rowClassName={(record, index) =>
          index % 2 === 0 ? "bg-white" : "bg-gray-200"
        }
      />
    </div>
  );
};

export default Products;
