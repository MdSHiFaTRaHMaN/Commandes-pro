import React from "react";
import { Table, Input, Select } from "antd";
import { FaTrashAlt, FaEdit, FaSave } from "react-icons/fa";

const { Option } = Select;

const data = [
  {
    key: "1",
    ref: 1,
    product: "Banane 18,5KG comoe Cal P",
    purchase_price: 110,
    pr: 137.5,
    prs: 156.2,
    pg: 126.5,
    sp: 121,
    unit: "MG (€ / MG)",
    uv: 770,
    stock: 1,
    origin: "Bangladesh",
  },
  {
    key: "2",
    ref: 2,
    product: "Banane CMR BANDO Cal P2",
    purchase_price: 1,
    pr: 1.25,
    prs: 1.42,
    pg: 1.15,
    sp: 1.1,
    unit: "KG (€ / KG)",
    uv: 8,
    stock: 1,
    origin: "Belgique",
  },
];

const Products = () => {
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
      render: (text) => <Input value={text} className="border-gray-300" />,
    },
    {
      title: "PURCHASE PRICE",
      dataIndex: "purchase_price",
      key: "purchase_price",
      render: (text) => <Input value={text} className="border-gray-300" />,
    },
    {
      title: "PR",
      dataIndex: "pr",
      key: "pr",
      render: (text) => <Input value={text} className="border-gray-300" />,
    },
    {
      title: "PRS",
      dataIndex: "prs",
      key: "prs",
      render: (text) => <Input value={text} className="border-gray-300" />,
    },
    {
      title: "PG",
      dataIndex: "pg",
      key: "pg",
      render: (text) => <Input value={text} className="border-gray-300" />,
    },
    {
      title: "SP",
      dataIndex: "sp",
      key: "sp",
      render: (text) => <Input value={text} className="border-gray-300" />,
    },
    {
      title: "UNITS",
      dataIndex: "unit",
      key: "unit",
      render: (text) => (
        <Select defaultValue={text} className="w-full border-gray-300">
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
      render: (text) => <Input value={text} className="border-gray-300" />,
    },
    {
      title: "STOCK",
      dataIndex: "stock",
      key: "stock",
      render: (text) => <Input value={text} className="border-gray-300" />,
    },
    {
      title: "ORIGIN",
      dataIndex: "origin",
      key: "origin",
      render: (text) => (
        <Select defaultValue={text} className="w-full border-gray-300">
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
          <FaSave className="text-green-600 cursor-pointer hover:text-green-800" />
          <FaEdit className="text-yellow-600 cursor-pointer hover:text-yellow-800" />
          <FaTrashAlt className="text-red-600 cursor-pointer hover:text-red-800" />
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Product Table
      </h1>
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
