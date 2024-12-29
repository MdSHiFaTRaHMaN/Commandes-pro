import React from "react";
import { Input, Button, Spin, notification } from "antd";
import { API, usePageManegment } from "../../api/api";

const PageManegment = () => {
  const { pageManegment, isLoading, refetch } = usePageManegment();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }
  const handleSubmit = async(e) => {
    e.preventDefault();

    // Get form data
    const form = new FormData(e.currentTarget);

    const privacy = form.get("privacy");
    const terms = form.get("terms");
    const about_us = form.get("about_us");
    const legal = form.get("legal");
    const page = {privacy, terms, about_us, legal}

    console.log("privacy", page);

    try {
        await API.put("/settings/privacy", page);
  
        // Show success notification
        notification.success({
          message: "Page Manegment Update",
          description: "Your page has been updated successfully.",
        });
        refetch();
      } catch (error) {
        console.error("Page update failed", error);
  
        // Show error notification
        notification.error({
          message: "Page Update Failed",
          description:
            "An error occurred while updating your page. Please try again later.",
        });
      }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Page Management
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-8">
            {/* Privacy Policy */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Privacy Policy *
              </label>
              <Input.TextArea
                rows={10}
                defaultValue={pageManegment?.privacy || ""}
                placeholder="Enter the privacy policy here"
                className="w-full"
                name="privacy"
              />
            </div>

            {/* Terms Condition */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Terms Condition *
              </label>
              <Input.TextArea
                rows={10}
                defaultValue={pageManegment?.terms || ""}
                placeholder="Enter terms and conditions here"
                className="w-full"
                name="terms"
              />
            </div>

            {/* About Us */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                About Us *
              </label>
              <Input.TextArea
                rows={10}
                defaultValue={pageManegment?.about_us || ""}
                placeholder="Write about us content here"
                className="w-full"
                name="about_us"
              />
            </div>

            {/* Legal */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Legal *
              </label>
              <Input.TextArea
                rows={10}
                defaultValue={pageManegment?.legal || ""}
                placeholder="Enter legal information here"
                className="w-full"
                name="legal"
              />
            </div>
          </div>
            {/* Save Button */}
            <div className="mt-8 text-center">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold px-12 py-6 text-lg rounded-lg"
              >
                Save
              </Button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default PageManegment;
