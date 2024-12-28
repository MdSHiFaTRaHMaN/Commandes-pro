import { Table, Input, Select, Spin, Modal, message, notification } from "antd";
import { FaTrashAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import { API, useAllCustomers } from "../api/api";

const { Option } = Select;

const Customers = () => {
  const { allCustomer, isLoading, error, refetch } = useAllCustomers();

  const [data, setData] = useState([]);
  const [editedData, setEditedData] = useState([]);


  const handleAccountType = (value, id) =>{
    console.log("id",id)
    console.log("value",value)

    // ------Need api to update account type------- 
  }

  const handleStatusChange = async (value, id) => {

    const status = id;
    const updateStatus = { status };
    const selectID = value;

    try {
      // API call
      await API.put(`/user/status/${selectID}`, updateStatus);

      // Success notification
      notification.success({
        message: "Status Updated",
        description: "Your status has been updated successfully.",
      });

      // Optionally refetch the data
      refetch();
    } catch (error) {
      console.error("Status update failed", error);

      // Error notification
      notification.error({
        message: "Status Update Failed",
        description:
          "An error occurred while updating the status. Please try again later.",
      });
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
          // Optionally refresh your data here
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
  useEffect(() => {
    if (allCustomer) {
      const processedData = allCustomer.map((item, index) => ({
        key: index + 1, // Unique key for each row
        id: item.id, // Adding id to match with the backend
        ref: item.ref || index + 1,
        name: item.name || "Unknown Product",
        account_type: item.account_type || "N/A",
        account_phone: item.account_phone || 0,
        email: item.email || "N/A",
        post_code: item.post_code || 0,
        status: item.status || "N/A",
      }));
      setData(processedData);
    }
  }, [allCustomer]);

  const handleInputChange = async (key, field, value) => {
    const updatedData = data.map((item) =>
      item.key === key ? { ...item, [field]: value } : item
    );
    setData(updatedData);
    refetch();

    const updatedEditedData = updatedData.filter((item) =>
      item.key === key
        ? { ...item, [field]: value }
        : editedData.find((edited) => edited.key === item.key)
    );
    setEditedData(updatedEditedData);

    console.log("Edited Data:", updatedEditedData.id);
  };

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: 50,
      render: (text, record) => (
        <span className="border px-4 py-2 rounded bg-white">{record.id}</span>
      ),
    },
    {
      title: "Name Sign",
      dataIndex: "name",
      key: "name",
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
      title: "Kind",
      dataIndex: "kind",
      key: "purchase_price",
      render: (text, record) => (
        <Select
          value={record.account_type}
          className="w-full border-gray-300"
          onChange={(value) =>
            handleAccountType(record.id, value)
          }
        >
          <Option value="Restauration">Restauration</Option>
          <Option value="Revendeur">Revendeur</Option>
          <Option value="Grossiste">Grossiste</Option>
          <Option value="Supper Marcent">Supper Marcent</Option>
        </Select>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "pr",
      render: (text, record) => (
        <span className="border px-4 py-2 rounded bg-white">
          {record.account_phone}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "prs",
      render: (text, record) => (
        <span className="border px-4 py-2 rounded bg-white">
          {record.email}
        </span>
      ),
    },
    {
      title: "Postal Code",
      dataIndex: "postalcode",
      key: "postalcode",
      render: (text, record) => (
        <span className="border px-4 py-2 rounded bg-white">
          {record.post_code}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (id, record) => (
        <Select
          value={record.status}
          className="w-full border-gray-300"
          onChange={(value) => handleStatusChange(record.id, value)} // Correctly passing ID and new status value
        >
          <Option value="Active">Active</Option>
          <Option value="In Active">In Active</Option>
          <Option value="Blocklist">Blocklist</Option>
        </Select>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <div className="flex gap-2 justify-center">
          <FaTrashAlt
            onClick={() => handleDelete(record.id)}
            className="text-red-600 cursor-pointer hover:text-red-800"
          />
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
  if (isLoading)
    return (
      <Spin tip="Loading" size="large">
        {content}
      </Spin>
    );
  if (error) return <div>Error loading Customers</div>;

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="flex justify-between">
        <div className="flex gap-3">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            Customer Table
          </h1>
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

export default Customers;
