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

const { Search } = Input;

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
  const [nameSearch, setNameSearch] = useState("");

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    name: nameSearch,
  });

  const { allProduct, pagination, isLoading, isError, error, refetch } =
    useAllProduct(filters);

  useEffect(() => {
    if (nameSearch) {
      setFilters({
        page: filters.page,
        limit: filters.limit,
        name: nameSearch,
      });
    }
  }, [nameSearch]);

  const handleTableChange = (pagination, tableFilters) => {
    const { current: page, pageSize: limit } = pagination;

    setFilters((prevFilters) => ({
      ...prevFilters,
      page,
      limit,
    }));
  };

  const onSearch = (value) => setNameSearch(value);

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
      width: "10%",
      // fixed: "left",
    },

    {
      title: "PRIX D'ACHAT",
      dataIndex: "purchase_price",
      // fixed: "left",
      render: (_, record) => `${record.purchase_price.toFixed(2)}€`,
      editable: true,
    },
    {
      title: "Restauration",
      dataIndex: "regular_price",
      render: (_, record) => `${record.regular_price.toFixed(2)}€`,
    },
    {
      title: "Revendeur",
      dataIndex: "selling_price",
      render: (_, record) => `${record.selling_price.toFixed(2)}€`,
    },
    {
      title: "Grossiste",
      dataIndex: "whole_price",
      render: (_, record) => `${record.whole_price.toFixed(2)}€`,
    },
    {
      title: "Supper Marcent",
      dataIndex: "supper_marcent",
      render: (_, record) => `${record.supper_marcent.toFixed(2)}€`,
    },
    {
      title: "UV",
      dataIndex: "uvw",
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
      dataIndex: "in_stock",
      editable: true,
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
      // fixed: "right",
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

    const purchase_price = parseFloat(row.purchase_price);
    const regular_price = parseFloat(
      (purchase_price + purchase_price * 0.2).toFixed(0)
    );
    const selling_price = parseFloat(
      (purchase_price + purchase_price * 0.25).toFixed(0)
    );
    const whole_price = parseFloat(
      (purchase_price + purchase_price * 0.15).toFixed(0)
    );
    const supper_marcent = parseFloat(
      (purchase_price + purchase_price * 0.1).toFixed(0)
    );

    const formData = {
      name: row.name,
      product_type: row.product_type,
      unit: row.unit,
      tax: row.tax,
      packaging: row.packaging,
      uvw: row.uvw,
      in_stock: row.in_stock,
      country: row.country,
      purchase_price: purchase_price,
      regular_price: regular_price,
      selling_price: selling_price,
      whole_price: whole_price,
      supper_marcent: supper_marcent,
      discount_price: row.discount_price,
    };

    try {
      const response = await API.put(`/product/upd/${id}`, formData);
      if (response.status === 200) {
        message.success(`${row.name} updated successfully!`);
      }
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

  return (
    <div className="mx-4 my-5 border-shadow">
      <div className="mx-4 my-5 border-shadow">
        <div className="flex justify-between mx-6 mb-5">
          <div className="text-3xl font-bold text-[#e24c80]">
            Liste des Produits
          </div>
          {/* Search Input */}
          <Search
            placeholder="Search for anything..."
            className="w-[350px] transition-all duration-300 ease-in-out transform hover:scale-105 focus:shadow-lg rounded-lg border border-gray-300"
            onSearch={onSearch}
            size="large"
            style={{
              backgroundColor: "white",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          />

          <Link to="/addtoproduct">
            <button className="bg-[#e24c80] p-3 text-white font-semibold rounded-md flex items-center gap-1">
              <FaPlus /> Add New Product
            </button>
          </Link>
        </div>

        <div className="mx-6">
          {isLoading ? (
            <Spin size="large" className="block mx-auto my-10" />
          ) : (
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
              scroll={{
                x: "max-content",
              }}
              onChange={handleTableChange}
              columns={columns}
            />
          )}

          {isError && (
            <div className="text-center text-red-500">
              {error.message || "Something went wrong"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Products;
