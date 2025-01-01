import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Modal, Form, Input, Select, Spin, Table, message } from "antd";
import { MdDelete } from "react-icons/md";
import { FaEdit, FaPlus } from "react-icons/fa";
import "../orders/Orders.css";
import countries from "../../assets/countries.json";
import { API, useAllProduct } from "../../api/api";
import { Link } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingInlineEnd: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

const Products = () => {
  const [deletingLoading, setDeletingLoading] = useState(false);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
  });

  const { allProduct, pagination, isLoading, isError, error, refetch } =
    useAllProduct(filters);

  const handleTableChange = (pagination, tableFilters) => {
    const { current: page, pageSize: limit } = pagination;

    setFilters((prevFilters) => ({
      ...prevFilters,
      page,
      limit,
    }));
  };

  const dataSource = allProduct.map((item) => ({
    ...item,
    key: item.id,
  }));

  const handleStatusChange = async (id, status, value) => {
    try {
      const response = await API.put(`/product/update-ucs/${id}`, {
        [status]: value,
      });

      if (response.status == 200) {
        message.success("Product updated successfully");
        refetch(); // Refresh details after update
      } else {
        message.error("Failed to update product");
      }
    } catch (error) {
      message.error(`Error updating product ${error.message}`);
    }
  };

  const handleProductDelete = (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this product?",
      content: `Product Name: ${record.name}`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      confirmLoading: deletingLoading, // Add loading state here
      onOk: async () => {
        setDeletingLoading(true); // Start loading
        try {
          const response = await API.delete(`/product/delete/${record.id}`);
          if (response.status === 200) {
            message.success("Product deleted successfully");
            refetch(); // Refresh product list after deletion
          } else {
            message.error("Failed to delete the product");
          }
        } catch (error) {
          message.error(`Error deleting product: ${error.message}`);
        } finally {
          setDeletingLoading(false); // Stop loading
        }
      },
      onCancel() {
        console.log("Delete cancelled");
      },
    });
  };

  const defaultColumns = [
    {
      title: "REF",
      dataIndex: "id",
      key: "id",
    },

    {
      title: "PRODUITS",
      dataIndex: "name",
      editable: true,
      width: "100%",
    },

    {
      title: "PRIX D'ACHAT",
      dataIndex: "purchase_price",
      render: (_, record) => `${record.purchase_price.toFixed(2)}€`,
      editable: true,
    },
    {
      title: "Restauration",
      dataIndex: "regular_price",
      render: (_, record) => `${record.regular_price.toFixed(2)}€`,
      editable: true,
    },
    {
      title: "Revendeur",
      dataIndex: "selling_price",
      render: (_, record) => `${record.selling_price.toFixed(2)}€`,
      editable: true,
    },
    {
      title: "Grossiste",
      dataIndex: "whole_price",
      render: (_, record) => `${record.whole_price.toFixed(2)}€`,
      editable: true,
    },
    {
      title: "UV",
      dataIndex: "supper_marcent",
      render: (_, record) => `${record.supper_marcent.toFixed(2)}€`,
      editable: true,
    },
    {
      title: "UNITÉS",
      dataIndex: "unit",
      key: "unit",
      render: (_, record) => (
        <Select
          value={record?.unit}
          onChange={(value) => handleStatusChange(record.id, "unit", value)}
          options={[
            { value: "KG (€/KG)", label: "KG (€/KG)" },
            { value: "G (€/G)", label: "G (€/G)" },
            { value: "MG (€/MG)", label: "MG (€/MG)" },
            { value: "L (€/L)", label: "L (€/L)" },
            { value: "ML (€/ML)", label: "ML (€/ML)" },
            { value: "U (€/U)", label: "U (€/U)" },
            { value: "CM (€/CM)", label: "CM (€/CM)" },
            { value: "MM (€/MM)", label: "MM (€/MM)" },
            { value: "M (€/M)", label: "M (€/M)" },
          ]}
        />
      ),
    },
    {
      title: "STOCK",
      dataIndex: "is_stock",
      render: (_, record) => (
        <Select
          value={record?.is_stock == 1 ? "In Stock" : "Out of Stock"}
          onChange={(value) => handleStatusChange(record.id, "is_stock", value)}
          options={[
            { value: true, label: "In Stock" },
            { value: false, label: "Out of Stock" },
          ]}
        />
      ),
    },

    {
      title: "ORIGINE",
      dataIndex: "country",
      key: "country",
      render: (_, record) => (
        <Select
          showSearch
          placeholder="Select a Country"
          optionFilterProp="label"
          value={record?.country}
          onChange={(value) => handleStatusChange(record.id, "country", value)}
          options={countries.map((country) => ({
            value: country.name,
            label: country.name,
          }))}
        />
      ),
    },
    {
      title: "STATUT",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <Select
          value={record?.status}
          onChange={(value) => handleStatusChange(record.id, "status", value)}
          options={[
            { value: "active", label: "active" },
            { value: "inactive", label: "inactive" },
          ]}
        />
      ),
    },

    {
      title: "ACTIONS",
      dataIndex: "operation",

      render: (_, record) => (
        <div className="flex gap-3 text-xl">
          <Link to={`/products/edit/${record.id}`}>
            <FaEdit
              className="cursor-pointer"
              onClick={() => handleEdit(record)}
            />
          </Link>

          <MdDelete
            className="cursor-pointer"
            onClick={() => handleProductDelete(record)}
          />
        </div>
      ),
    },
  ];

  const handleSave = async (row) => {
    const id = row?.id;
    try {
      const response = await API.put(`/product/upd/${id}`, row);
      if (response.status === 200) {
        message.success(`${row.name} updated successfully!`);
      }

      console.log("response", response);

      refetch();
    } catch (error) {
      message.error(`Failed to add ${row.name}. Try again.`);
      console.log("error", error);
    }
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  if (isLoading) return <Spin size="large" className="block mx-auto my-10" />;
  if (isError)
    return (
      <div className="text-center text-red-500">
        {error.message || "Something went wrong"}
      </div>
    );

  return (
    <div className="mx-4 my-5 border-shadow">
      <div className="mx-4 my-5 border-shadow">
        <div className="flex justify-between mx-6 mb-5">
          <div className="text-3xl font-bold text-[#e24c80]">
            Liste des Produits
          </div>
          {/* Search Input */}
          <div className="relative w-72 mr-4">
            <input
              type="text"
              placeholder="Search Product"
              className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
            />
            <div className="absolute inset-y-0 left-3 flex items-center text-gray-500">
            <IoSearch />
            </div>
          </div>

          <Link to="/addtoproduct">
            <button className="bg-[#e24c80] p-3 text-white font-semibold rounded-md flex items-center gap-1">
              <FaPlus /> Add New Product
            </button>
          </Link>
        </div>

        <div className="mx-6">
          <Table
            components={components}
            rowClassName={() => "editable-row"}
            bordered
            dataSource={dataSource}
            pagination={{
              current: filters.page,
              pageSize: filters.limit,
              total: pagination.totalProducts,
            }}
            onChange={handleTableChange}
            columns={columns}
          />
        </div>
      </div>
    </div>
  );
};
export default Products;
