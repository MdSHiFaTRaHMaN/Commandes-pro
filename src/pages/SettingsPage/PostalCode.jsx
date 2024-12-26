import React, { useState } from "react";
import { Button, Input, Popconfirm, Table, Spin, Alert, message, Modal } from "antd";
import "antd/dist/reset.css";
import { API, usePostalCode } from "../../api/api";
import { RiDeleteBinFill } from "react-icons/ri";
import { FaTrashAlt } from "react-icons/fa";

const PostalCode = () => {
  const { postalCode, isLoading, isError, error, refetch } = usePostalCode();
  const [newCode, setNewCode] = useState("");
  const [loading, setLoading] = useState(false);
  // Handle Delete function
  
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
          await API.delete(`/product/post-code/${id}`);
          message.success("User deleted successfully!");
          refetch();
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

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
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

  // Handle loading and error states
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert
          message="Error"
          description={error.message}
          type="error"
          showIcon
        />
      </div>
    );
  const handleSubmit = async () => {
    const code = {
      code: newCode,
    };
    
    try {
      setLoading(true);
      const response = await API.post("/product/post-code", code);
      if (response.status == 200) {
        message.success("Postal Code add Successfully");
        refetch();
      }
      console.log(response, "resposne");
      setLoading(false);
    } catch (error) {
      console.error(error);
      message.error("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-50 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-3/6">
        <h1 className="text-pink-500 text-2xl font-bold mb-6 text-center">
          Postal Code Management
        </h1>

        <div className="flex gap-4 mb-6">
          <Input
            onChange={(e) => setNewCode(e.target.value)}
            placeholder="Enter a postal code"
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          <Button
            type="primary"
            onClick={handleSubmit}
            className="bg-pink-500 font-semibold hover:bg-pink-600 border-none py-6 "
          >
            Add Postal Code
          </Button>
        </div>
        <Table
          dataSource={postalCode}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          bordered
        />
      </div>
    </div>
  );
};

export default PostalCode;
