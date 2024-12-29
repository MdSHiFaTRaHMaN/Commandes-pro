import { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { API } from "../api/api";

const Login = () => {
  const [loading, setLoading] = useState(false); // Loading state for login button

  const onFinish = async (values) => {
    setLoading(true); // Start loading when submitting form
    try {
      const response = await API.post("/admins/login", {
        email: values.email,
        password: values.password,
      });

      // If successful, save the token in localStorage
      localStorage.setItem("token", response.data.data.token);

      // Show success message
      message.success("Login successful!");

      // Redirect to the admin dashboard (replace with your route)
      window.location.href = "/";
    } catch (error) {
      // Show error message
      message.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false); // Stop loading after request
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error("Please input valid email and password.", errorInfo);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login
        </h1>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="space-y-4"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-500" />}
              placeholder="Email"
              className="h-12"
              name="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-500" />}
              placeholder="Password"
              className="h-12"
              name="password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 h-12 text-white rounded-md"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
            
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
