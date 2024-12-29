import { Button, Input, Modal, Form, message } from "antd";
import { useState } from "react";
import { BiLocationPlus } from "react-icons/bi";
import { API } from "../../api/api";

const AddAddressModel = ({ selectCustomer, refetch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);

  // open modal
  const showModal = () => {
    setIsModalOpen(true);
  };

  // close modal function
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // form handle submit
  const handleSubmit = async (values) => {
    try {
      setAddressLoading(true);
      const response = await API.post(
        `/delivery-addresss/create/${selectCustomer}`,
        values
      );
      if (response.status == 200) {
        message.success("Address Added Successfully");
      }
      refetch();
      setAddressLoading(false);
    } catch (error) {
      console.error(error);
      message.error("Something went wrong");
      setAddressLoading(false);
    }

    setIsModalOpen(false);
  };

  return (
    <div>
      <span
        className="flex items-center gap-1 font-semibold"
        onClick={showModal}
      >
        <BiLocationPlus /> Add Delivery Address
      </span>
      <Modal
        title="Enter Address Details"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form name="addressForm" layout="vertical" onFinish={handleSubmit}>
          {/* Phone Number */}
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please enter your phone number!" },
            ]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          {/* Contact */}
          <Form.Item
            label="Contact"
            name="contact"
            rules={[{ required: true, message: "Please enter your contact!" }]}
          >
            <Input placeholder="Enter contact name" />
          </Form.Item>

          {/* Address */}
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please enter your address!" }]}
          >
            <Input placeholder="Enter address" />
          </Form.Item>

          {/* Address Type */}
          <Form.Item
            label="Address Type"
            name="address_type"
            rules={[{ required: true, message: "Please enter address type!" }]}
          >
            <Input placeholder="Enter address type" />
          </Form.Item>

          {/* City */}
          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: "Please enter city!" }]}
          >
            <Input placeholder="Enter city" />
          </Form.Item>

          {/* Post Code */}
          <Form.Item
            label="Post Code"
            name="post_code"
            rules={[{ required: true, message: "Please enter post code!" }]}
          >
            <Input placeholder="Enter post code" />
          </Form.Item>

          {/* Message */}
          <Form.Item
            label="Message"
            name="message"
            rules={[{ required: true, message: "Please enter a message!" }]}
          >
            <Input.TextArea placeholder="Enter message" rows={4} />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              loading={addressLoading}
              disabled={addressLoading}
              htmlType="submit"
              className="w-full"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddAddressModel;
