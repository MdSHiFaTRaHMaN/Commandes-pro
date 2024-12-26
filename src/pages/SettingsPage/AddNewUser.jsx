import React from "react";
import { Input, Select, Button, Typography } from "antd";
import {  useUserRole } from "../../api/api";

const { Title, Text } = Typography;
const { Option } = Select;

const AddNewUser = () => {
  const { userRole } = useUserRole();

  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-3/6 bg-white shadow-lg rounded-lg p-8">
        <Title level={3} className="text-pink-500 text-center mb-6">
          Edit User
        </Title>
        <form>
          <div className="mb-4">
            <Text className="block mb-2 font-medium">Email(Username)*</Text>
            <Input placeholder="Email" className="py-2" />
          </div>
          <div className="mb-4">
            <Text className="block mb-2 font-medium">Password*</Text>
            <Input.Password placeholder="Password" className="py-2" />
          </div>
          <div className="mb-4">
            <Text className="block mb-2 font-medium">First Name*</Text>
            <Input placeholder="First Name" className="py-2" />
          </div>
          <div className="mb-4">
            <Text className="block mb-2 font-medium">Last Name*</Text>
            <Input placeholder="Last Name" className="py-2" />
          </div>
          <div className="mb-4">
            <Text className="block mb-2 font-medium">Role</Text>
            <Select className="w-full" placeholder="Select a role">
              {userRole.map((role) => (
                <Option key={role.id} value={role.id}>
                  {role.name}
                </Option>
              ))}
            </Select>
          </div>
          <div className="mb-4">
            <Text className="block text-pink-500 font-semibold">
              Access Rights
            </Text>
          </div>
          <Button
            type="primary"
            className="w-full bg-pink-500 hover:bg-pink-600 border-none py-3"
          >
            Add User
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddNewUser;
