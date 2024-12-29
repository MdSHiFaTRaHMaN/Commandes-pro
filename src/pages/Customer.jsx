import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal, Form, Input, Select, Spin, Table, message } from "antd";
import { FaPlus } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { API, useAllCustomers } from "../api/api";
import { Link } from "react-router-dom";
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

const Customer = () => {
  const { allCustomer, isLoading, error, refetch } = useAllCustomers();

  const dataSource = allCustomer.map((item) => ({
    ...item,
    key: item.id,
  }));

  const handleChange = async (id, type, value) => {
    try {
      const response = await API.put(`/user/status/${id}`, {
        [type]: value,
      });

      console.log(response, "response");

      if (response.status == 200) {
        message.success(`User ${type} updated successfully`);
        refetch(); // Refresh order details after update
      } else {
        message.error(`Failed to update ${type} User`);
      }
    } catch (error) {
      console.error(error);
      message.error(`Error updating  ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      cancelText: "Cancel",
      okType: "danger",
      onOk: async () => {
        try {
          // Call the API to delete the user
          await API.delete(`/user/delete/${id}`);
          message.success("User deleted successfully!");
          refetch();
        } catch (error) {
          console.error("Error deleting user:", error);
          message.error("Failed to delete the user. Please try again.");
        }
      },
      onCancel() {
        console.log("Deletion cancelled.");
      },
    });
  };

  const defaultColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name Sign",
      dataIndex: "name",
      editable: true,
    },

    {
      title: "Kind",
      dataIndex: "account_type",
      key: "account_type",
      width: "15%",
      render: (_, record) => (
        <Select
          value={record?.account_type}
          onChange={(value) => handleChange(record.id, "account_type", value)}
          style={{ width: 200 }}
          options={[
            { value: "Restauration", label: "Restauration" },
            { value: "Revendeur", label: "Revendeur" },
            { value: "Grossiste", label: "Grossiste" },
            { value: "Supper Marcent", label: "Supper Marcent" },
          ]}
        />
      ),
    },

    {
      title: "Phone",
      dataIndex: "account_phone",
      editable: true,
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Postal Code",
      dataIndex: "post_code",
      editable: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (_, record) => (
        <Select
          value={record?.status}
          onChange={(value) => handleChange(record.id, "status", value)}
          style={{ width: 200 }}
          options={[
            { value: "Active", label: "Active" },
            { value: "Deactivate", label: "Deactivate" },
            { value: "Blocked", label: "Blocked" },
          ]}
        />
      ),
    },

    {
      title: "Actions",
      dataIndex: "operation",

      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <FaTrashAlt
            onClick={() => handleDelete(record.id)}
            className="text-red-600 cursor-pointer hover:text-red-800"
          />
        </div>
      ),
    },
  ];

  const handleSave = async (row) => {
    const id = row?.id;
    try {
      const response = await API.put(`/user/update/${id}`, row);
      if (response.status === 200) {
        message.success(`${row.company} updated successfully!`);
      }

      refetch();
    } catch (error) {
      message.error(`Failed to add ${row.company}. Try again.`);
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
  if (error)
    return (
      <div className="text-center text-red-500">
        {error.message || "Something went wrong"}
      </div>
    );

  return (
    <div className="mx-32 my-5 border-shadow">
      <div className="flex justify-between mx-6 mb-5">
        <div className="text-3xl font-bold text-[#e24c80]">
          List of Customers
        </div>
        <Link to="/add-customer">
          <button className="bg-PrimaryColor p-3 text-white rounded flex items-center gap-1">
            <FaPlus /> Add Customer
          </button>
        </Link>
      </div>

      <div className="mx-6">
        <Table
          components={components}
          rowClassName={() => "editable-row"}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    </div>
  );
};
export default Customer;
