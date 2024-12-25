import { Button, Card, Descriptions, Modal, Input, notification } from "antd";
import { API, signOutAdmin, useAdminProfile } from "../api/api";
import { FaEdit } from "react-icons/fa";
import { useState } from "react";

const AdminProfile = () => {
  const { admin } = useAdminProfile(); // Assuming this returns the admin's data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [firstName, setFirstName] = useState(admin.first_name);
  const [lastName, setLastName] = useState(admin.last_name);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {

    const fullName = {
        first_name : firstName,
        last_name : lastName
    }
    try {
      await API.put("/admins/update", fullName);

      // Show success notification
      notification.success({
        message: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Profile update failed", error);

      // Show error notification
      notification.error({
        message: "Profile Update Failed",
        description:
          "An error occurred while updating your profile. Please try again later.",
      });
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    // Reset changes if canceled
    setFirstName(admin.first_name);
    setLastName(admin.last_name);
    setIsModalOpen(false);
  };

  const handleSignOut = () => {
    signOutAdmin();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card
        className="w-3/6 shadow-lg"
        bordered={false}
        style={{ backgroundColor: "#ffffff" }}
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Admin Profile
        </h1>
        <span
          onClick={showModal}
          className="flex text-end justify-end text-2xl m-3 text-green-600 cursor-pointer"
        >
          <FaEdit />
        </span>
        <Descriptions
          bordered
          layout="vertical"
          column={1}
          labelStyle={{ fontWeight: "bold", color: "#555" }}
          contentStyle={{ color: "#333" }}
        >
          <Descriptions.Item label="First Name">{firstName}</Descriptions.Item>
          <Descriptions.Item label="Last Name">{lastName}</Descriptions.Item>
          <Descriptions.Item label="Email">{admin.email}</Descriptions.Item>
          <Descriptions.Item label="Role">{admin.role_name}</Descriptions.Item>
        </Descriptions>
        <div className="flex justify-end">
          <Button
            type="primary"
            danger
            onClick={handleSignOut}
            className="py-5 mt-5 text-end"
          >
            Log Out
          </Button>
        </div>
      </Card>
      <Modal
        title="Edit Your User Name"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Save"
        cancelText="Cancel"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              First Name
            </label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Last Name
            </label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter last name"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminProfile;
