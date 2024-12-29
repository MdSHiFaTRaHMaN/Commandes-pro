import {
  Form,
  Input,
  Select,
  Button,
  Typography,
  Spin,
  notification,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { API, useAdminList, usePermissionRole } from "../../api/api";
import { useState, useEffect } from "react";

const { Title } = Typography;

const AdminEdit = () => {
  const { id } = useParams();
  const { adminList, loading: adminLoading } = useAdminList();
  const { permissionRole, loading: roleLoading } = usePermissionRole();
  const navigate = useNavigate()

  console.log("permissionRole", permissionRole)
  // Safely find admin data based on the `id` parameter
  const adminData = adminList?.find((admin) => admin.id === parseInt(id, 10));

  // Debugging adminData to confirm its value
  useEffect(() => {
    console.log("Admin Data:", adminData);
  }, [adminData]);

  const [selectedRole, setSelectedRole] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    if (adminData) {
      const role = permissionRole.find(
        (role) => role.role_name === adminData.role_name
      );
      setSelectedRole(role);
    }
  }, [adminData, permissionRole]);

  const handleRoleChange = (roleId) => {
    const selected = permissionRole.find((role) => role.role_id === roleId);
    setSelectedRole(selected);
  };

  const handleSubmit = async (values) => {
    const { first_name, last_name, role } = values;

    const changeRole = {
      role_id: role, // Ensure role_id is derived correctly
    };

    console.log("Selected Role:", role);

    // Validate if adminData exists
    if (!adminData) {
      notification.error({
        message: "Error",
        description: "Admin data is not available.",
      });
      return;
    }

    const adminId = adminData.id;

    try {
      // Make the API call to update the user's role
      await API.put(`/admins/update/role/${adminId}`, changeRole);
       
      // Show success notification
      notification.success({
        message: `Profile Updated: ${first_name} ${last_name}`,
        description: "Your profile has been updated successfully.",
      });
      navigate(-1)
    } catch (error) {
      console.error("Error updating the user role:", error);

      // Show error notification
      notification.error({
        message: "Update Failed",
        description: "An error occurred while updating the profile.",
      });
    }
  };

  if (adminLoading || roleLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No admin found with the specified ID.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md w-8/12 mx-auto mt-3">
      <Title level={4} className="text-pink-600 text-center mb-4">
        Edit User
      </Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-4"
        initialValues={{
          email: adminData.email,
          first_name: adminData.first_name,
          last_name: adminData.last_name,
          role: adminData.role_name,
        }}
      >
        <Form.Item
          label="Email (Username)*"
          name="email"
          rules={[{ required: true, message: "Please enter the email!" }]}
        >
          <Input placeholder="Enter email" className="rounded-md py-3" readOnly/>
        </Form.Item>

        <Form.Item
          label="First Name*"
          name="first_name"
          rules={[{ required: true, message: "Please enter the first name!" }]}
        >
          <Input placeholder="Enter first name" className="rounded-md py-3" />
        </Form.Item>

        <Form.Item
          label="Last Name*"
          name="last_name"
          rules={[{ required: true, message: "Please enter the last name!" }]}
        >
          <Input placeholder="Enter last name" className="rounded-md py-3" />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please select a role!" }]}
        >
          <Select
            className="rounded-md h-11"
            onChange={handleRoleChange}
            placeholder="Select a role"
          >
            {permissionRole.map((role) => (
              <Select.Option key={role.role_id} value={role.role_id}>
                {role.role_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <div className="text-pink-600 font-semibold">Access Rights</div>
        {selectedRole && selectedRole.permissions.length > 0 ? (
          <div className="permissions">
            {selectedRole.permissions.map((permission, index) => (
              <div key={index} className="mb-4">
                <h2 className="font-bold text-lg">{permission.section}</h2>
                <ul className="list-disc ml-6">
                  {permission.name.map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p>No permissions available for this role.</p>
        )}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-pink-500 hover:bg-pink-600 text-white w-full rounded-md"
          >
            Edit User
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminEdit;
