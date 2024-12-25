import {
  Form,
  Input,
  Select,
  Button,
  Typography,
  Spin,
  notification,
} from "antd";
import { useParams } from "react-router-dom";
import { API, useAdminList } from "../../api/api";

const { Title } = Typography;

const AdminEdit = () => {
  const { id } = useParams(); // Get id from URL
  const { adminList, loading } = useAdminList(); // Fetch admin list
  const adminData = adminList?.find((admin) => admin.id === parseInt(id));

  const [form] = Form.useForm();

  // Handle form submission
  const handleSubmit = async (values) => {
    const { first_name, last_name } = values;

    const nameEdit = { first_name, last_name };
    notification.success({
      message: `Profile Updated by${first_name} ${last_name} `,
      description: "Your profile has been updated successfully.",
    });
  };

  if (!adminList) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
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
          <Input placeholder="Enter email" className="rounded-md" />
        </Form.Item>

        <Form.Item
          label="First Name*"
          name="first_name"
          rules={[{ required: true, message: "Please enter the first name!" }]}
        >
          <Input placeholder="Enter first name" className="rounded-md" />
        </Form.Item>

        <Form.Item
          label="Last Name*"
          name="last_name"
          rules={[{ required: true, message: "Please enter the last name!" }]}
        >
          <Input placeholder="Enter last name" className="rounded-md" />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please select a role!" }]}
        >
          <Select className="rounded-md">
            <Select.Option value="SuperAdmin">Super Admin</Select.Option>
            <Select.Option value="Admin">Admin</Select.Option>
            <Select.Option value="User">User</Select.Option>
          </Select>
        </Form.Item>

        <div className="text-pink-600 font-semibold">Access Rights</div>

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
