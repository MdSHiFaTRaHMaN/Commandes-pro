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
import {
  API,
  useAdminList,
  usePermissionRole,
  useSingleAdmin,
} from "../../api/api";
import { useState, useEffect } from "react";

const { Title } = Typography;

const AdminEdit = () => {
  const { id } = useParams();
  const [editLoading, setEditLoading] = useState(false);
  const { admin, isLoading, isError, error, refetch } = useSingleAdmin(id);
  const { permissionRole, loading: roleLoading } = usePermissionRole();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    if (admin) {
      const role = permissionRole.find(
        (role) => role.role_name === admin.role_name
      );
      setSelectedRole(role);
    }
  }, [admin, permissionRole]);

  const handleRoleChange = (roleId) => {
    const selected = permissionRole.find((role) => role.role_id === roleId);
    setSelectedRole(selected);
  };

  const handleSubmit = async (values) => {
    const { first_name, last_name } = values;

    // Validate if admin exists
    if (!admin) {
      notification.error({
        message: "Error",
        description: "Admin data is not available.",
      });
      return;
    }

    try {
      setEditLoading(true);
      // Make the API call to update the user's role
      const response = await API.put(`/admins/update/${id}`, values);

      if (response.status == 200) {
        // Show success notification
        notification.success({
          message: `Profile Updated: ${first_name} ${last_name}`,
          description: "Your profile has been updated successfully.",
        });
        navigate(-1);
      }

      setEditLoading(false);
    } catch (error) {
      setEditLoading(false);
      const des =
        error?.response?.data?.message ||
        "An error occurred while updating the profile.";
      // Show error notification
      notification.error({
        message: "Update Failed",
        description: des,
      });
    }
  };

  if (isLoading || roleLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (isError)
    return (
      <div className="text-center text-red-500">
        {error.message || "Something went wrong"}
      </div>
    );

  if (!admin) {
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
          email: admin?.email,
          first_name: admin?.first_name,
          last_name: admin?.last_name,
          role: admin?.role_name,
        }}
      >
        <Form.Item
          label="Email*"
          name="email"
          value="vallllll"
          rules={[{ required: true, message: "Please enter the email!" }]}
        >
          <Input
            placeholder="Enter email"
            className="rounded-md py-3"
            name="email"
          />
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
            loading={editLoading}
            disabled={editLoading}
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
