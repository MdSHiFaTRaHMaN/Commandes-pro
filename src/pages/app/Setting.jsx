import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, notification } from "antd";
import { API, signOutAdmin } from "../../api/api";
import { BiLogOut } from "react-icons/bi";

const Setting = () => {
  const { control, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    // Add your password update logic here
    try {
      await API.put("/admins/update/password", data);

      // Show success notification
      notification.success({
        message: "Password Change",
        description: "Password change has been updated successfully.",
      });
    } catch (error) {
      console.error("Profile update failed", error);

      // Show error notification
      notification.error({
        message: "Profile Update Failed",
        description:
          "An error occurred while updating Password change. Please try again later.",
      });
    }
    reset(); // Reset form fields after submission
  };
  const handleSignOut = () => {
    signOutAdmin();
  };

  return (
    <div className="mt-7 w-8/12 mx-auto bg-white p-8 shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Update Password
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Old Password Field */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Old Password
          </label>
          <Controller
            name="old_password"
            control={control}
            rules={{
              required: "Old password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            }}
            render={({ field }) => (
              <Input.Password
                className="py-3"
                placeholder="Enter your old password"
                {...field}
              />
            )}
          />
        </div>

        {/* New Password Field */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            New Password
          </label>
          <Controller
            name="new_password"
            control={control}
            rules={{
              required: "New password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            }}
            render={({ field }) => (
              <Input.Password
                className="py-3"
                placeholder="Enter your new password"
                {...field}
              />
            )}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="primary"
          htmlType="submit"
          className="w-full py-6 bg-PrimaryColor text-white font-semibold text-lg rounded"
        >
          Update Password
        </Button>
      </form>
      <Button
        type="primary"
        onClick={handleSignOut}
        className="py-6 bg-red-600 border text-white shadow-lg font-semibold text-lg rounded mt-3"
      >
        <BiLogOut /> Logout
      </Button>
    </div>
  );
};

export default Setting;
