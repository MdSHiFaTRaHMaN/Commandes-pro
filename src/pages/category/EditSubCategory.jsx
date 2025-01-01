import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Typography,
  InputNumber,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { API } from "../../api/api";
import axios from "axios";

const { Title } = Typography;

function EditSubCategory({ subCategoryDetails, isOpen, onClose, refetch }) {
  const { control, register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    // Reset form fields when subCategoryDetails changes
    if (subCategoryDetails) {
      reset({
        name: subCategoryDetails.name || "",
        image: subCategoryDetails.image || "",
      });
    }
  }, [subCategoryDetails, reset]);

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);

    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("pdf", data.image[0].originFileObj);

      // Make a single POST request
      const response = await axios.post(
        "https://cloudinary.allbusinesssolution.com/api/v1/files/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const categoryImageUrl = response?.data?.url || "";

      const upadteCategory = {
        name: data.name,
        image: categoryImageUrl,
      };

      try {
        const response = await API.put(
          `/subcategory/update/${subCategoryDetails.id}`,
          upadteCategory
        );

        if (response.status == 200) {
          message.success("Sub Category Updated Successfully");
        }
      } catch (error) {
        message.error("Something went wrong");
      }
    } catch (error) {
      message.error(`Failed to updated ${data.name}. Try again.`);
    } finally {
      setLoading(false);
      refetch();
      onClose();
    }
  };

  return (
    <Modal
      title={
        <Title level={3}>{subCategoryDetails?.name} Edit - Sub Category</Title>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item label="Upload Image">
          <Controller
            name="image"
            control={control}
            render={({ field: { onChange, value } }) => {
              const initialFileList = subCategoryDetails?.image
                ? [
                    {
                      uid: "-1",
                      name: "Current Image",
                      status: "done",
                      url: subCategoryDetails?.image,
                    },
                  ]
                : [];

              return (
                <Upload
                  listType="picture-card"
                  beforeUpload={() => false}
                  maxCount={1}
                  accept="image/*"
                  fileList={Array.isArray(value) ? value : initialFileList}
                  onChange={({ fileList }) => {
                    if (Array.isArray(fileList)) {
                      if (fileList[0]?.originFileObj) {
                        onChange(fileList);
                      } else if (fileList.length === 0) {
                        onChange([]);
                      }
                    }
                  }}
                  onPreview={(file) => {
                    const src =
                      file.url || URL.createObjectURL(file.originFileObj);
                    const imgWindow = window.open(src);
                    imgWindow.document.write(
                      `<img src="${src}" style="width: 100%;" />`
                    );
                  }}
                >
                  {value && value.length >= 1 ? null : (
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>Upload Image</div>
                    </div>
                  )}
                </Upload>
              );
            }}
          />
        </Form.Item>

        {/* Category Name */}
        <Form.Item label="Category Name">
          <Controller
            name="name"
            defaultValue={subCategoryDetails?.name}
            control={control}
            rules={{ required: "Category name is required" }}
            render={({ field }) => (
              <Input placeholder="Enter Category name..." {...field} />
            )}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            className="w-full p-5 bg-PrimaryColor rounded text-white font-bold text-lg"
            htmlType="submit"
            loading={loading}
            style={{ width: "100%" }}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditSubCategory;
