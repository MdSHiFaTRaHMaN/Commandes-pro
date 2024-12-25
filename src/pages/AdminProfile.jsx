import { Button, Card, Descriptions } from "antd";
import { signOutAdmin, useAdminProfile } from "../api/api";

const AdminProfile = () => {
  const { admin } = useAdminProfile();
  const handleSignOut = () => {
    signOutAdmin();
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card
        className="w-3/6  shadow-lg"
        bordered={false}
        style={{ backgroundColor: "#ffffff" }}
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Admin Profile
        </h1>
        <Descriptions
          bordered
          layout="vertical"
          column={1}
          labelStyle={{ fontWeight: "bold", color: "#555" }}
          contentStyle={{ color: "#333" }}
        >
          <Descriptions.Item label="First Name">
            {admin.first_name}
          </Descriptions.Item>
          <Descriptions.Item label="Last Name">
            {admin.last_name}
          </Descriptions.Item>
          <Descriptions.Item label="Email">{admin.email}</Descriptions.Item>
          <Descriptions.Item label="Role">{admin.role_name}</Descriptions.Item>
        </Descriptions>
        <div className="flex justify-end">
        <Button type="primary" danger onClick={handleSignOut} className="py-5 mt-5 text-end">
          Log Out
        </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminProfile;
