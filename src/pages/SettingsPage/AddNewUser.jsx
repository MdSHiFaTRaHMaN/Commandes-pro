import { useState } from "react";
import { Input, Select, Button, Typography, message } from "antd";
import { API, usePermissionRole } from "../../api/api";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

const AddNewUser = () => {
  const { permissionRole, refetch } = usePermissionRole();
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState();
  const navigate = useNavigate();
  const handleRoleChange = (roleId) => {
    const selected = permissionRole.find((role) => role.role_id === roleId);
    setSelectedRole(selected);
  };

  const handleNewUser = async (e) => {
    e.preventDefault();

    // Get form data
    const form = new FormData(e.currentTarget);

    const email = form.get("email");
    const password = form.get("password");
    const first_name = form.get("first_name");
    const last_name = form.get("last_name");
    const role_id = selectedRole.role_id;

    const newUser = { email, password, first_name, last_name, role_id };

    // You can now send the data to your API
    try {
      setLoading(true);
      const response = await API.post("/admins/signup", newUser);
      if (response.status == 200) {
        message.success("Added User Successfully");
        refetch();
        navigate("/admin-list");
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      message.error("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-3/6 bg-white shadow-lg rounded-lg p-8">
        <Title level={3} className="text-pink-500 text-center mb-6">
          Add New User
        </Title>
        <form onSubmit={handleNewUser}>
          <div className="mb-4">
            <Text className="block mb-2 font-medium">Email*</Text>
            <Input placeholder="Email" name="email" className="py-2" required />
          </div>
          <div className="mb-4">
            <Text className="block mb-2 font-medium">Password*</Text>
            <Input.Password
              placeholder="Password"
              name="password"
              className="py-2"
              required
            />
          </div>
          <div className="mb-4">
            <Text className="block mb-2 font-medium">First Name*</Text>
            <Input
              placeholder="First Name"
              name="first_name"
              className="py-2"
              required
            />
          </div>
          <div className="mb-4">
            <Text className="block mb-2 font-medium">Last Name*</Text>
            <Input
              placeholder="Last Name"
              name="last_name"
              className="py-2"
              required
            />
          </div>
          <div className="mb-4">
            <Text className="block mb-2 font-medium">Role</Text>
            <Select
              className="w-full"
              onChange={handleRoleChange}
              placeholder="Select a role"
              required
            >
              {permissionRole.map((role) => (
                <Select.Option key={role.role_id} value={role.role_id}>
                  {role.role_name}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="mb-4">
            <Text className="block text-pink-500 font-semibold">
              Access Rights
            </Text>
            {selectedRole && selectedRole.permissions.length > 0 ? (
              <div className="permissions">
                {selectedRole.permissions.map((permission, index) => (
                  <div key={index} className="mb-4">
                    <h2 className="font-bold text-lg">{permission.section}</h2>
                    <ul className="list-disc ml-6">
                      {permission.name.map((action, i) => (
                        <li className="font-semibold" key={i}>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p>No permissions available for this role.</p>
            )}
          </div>
          <Button
            type="primary"
            loading={loading}
            disabled={loading}
            htmlType="submit"
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
