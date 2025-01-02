import {
  Button,
  Collapse,
  Image,
  Input,
  Modal,
  Select,
  Upload,
  message,
} from "antd";
import {
  PlusOutlined,
  LoadingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { API, useCategory, useCategoryWithSub } from "../../api/api";
import { RiDeleteBin5Fill } from "react-icons/ri";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import EditCategory from "./EditCategory";
import EditSubCategory from "./EditSubCategory";
import AddSubCategory from "./AddSubCategory";
const { Option } = Select;
const { Panel } = Collapse;

function getBase64(file, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(file);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG files!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must be smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}

const Categories = () => {
  // Separate states for category and sub-category image uploads

  const { categoryWithSub, refetch } = useCategoryWithSub();
  const [loading, setLoading] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [categoryDetails, setCategoryDetails] = useState(null);
  const [isEditSubCategoryOpen, setIsEditSubCategoryOpen] = useState(false);
  const [subCategoryDetails, setSubCategoryDetails] = useState(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
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

      const newCategory = {
        category_name: data.category_name,
        category_image: categoryImageUrl,
      };

      try {
        const response = await API.post("/category/create", newCategory);
        if (response.status == 200) {
          message.success("Category add Successfully");
          refetch();
          reset();
        }

        setLoading(false);
      } catch (error) {
        console.error(error);
        message.error("Something went wrong");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Categorty?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      cancelText: "Cancel",
      okType: "danger",
      onOk: async () => {
        try {
          // Call the API to delete the user
          await API.delete(`/category/delete/${id}`);
          message.success("User deleted successfully!");
          refetch();
          // Optionally refresh your data here
        } catch (error) {
          console.error("Error deleting user:", error);
          message.error("Failed to delete the user. Please try again.");
        }
      },
      onCancel() {
        console.log("Deletion cancelled.");
      },
    });
  };

  const handleEdit = (categoryDetails) => {
    setCategoryDetails(categoryDetails);
    setIsEditCategoryOpen(true);
  };

  const handleModalClose = () => {
    setCategoryDetails(null); // Reset the details
    setIsEditCategoryOpen(false); // Close modal
  };

  const handleSubCategoryEdit = (subCategoryDetails) => {
    setSubCategoryDetails(subCategoryDetails);
    setIsEditSubCategoryOpen(true);
  };

  const handleSubCategoryModalClose = () => {
    setSubCategoryDetails(null); // Reset the details
    setIsEditSubCategoryOpen(false); // Close modal
  };

  const handleDeleteSub = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Sub Category?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      cancelText: "Cancel",
      okType: "danger",
      onOk: async () => {
        try {
          // Call the API to delete the user
          await API.delete(`/subcategory/delete/${id}`);
          message.success("User deleted successfully!");
          refetch();
          // Optionally refresh your data here
        } catch (error) {
          console.error("Error deleting user:", error);
          message.error("Failed to delete the user. Please try again.");
        }
      },
      onCancel() {
        console.log("Deletion cancelled.");
      },
    });
  };

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex gap-5">
          {/* Add a New Category */}
          <div className="p-4 lg:w-1/3 mx-auto">
            <div className="h-full bg-white bg-opacity-75 px-8 py-4 rounded-lg overflow-hidden text-center relative shadow-md">
              <h2 className="text-2xl font-semibold my-3 text-PrimaryColor">
                Add a New Category
              </h2>

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Upload Component */}
                <div className="flex justify-center my-4">
                  <Controller
                    name="image"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Upload
                        className="avatar-uploader"
                        listType="picture-card"
                        beforeUpload={() => false} // Prevent auto-upload
                        maxCount={1}
                        accept="image/*"
                        fileList={value || []}
                        onChange={({ fileList }) => onChange(fileList)}
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
                    )}
                  />
                </div>

                {/* Input for Category Name */}
                <input
                  type="text"
                  placeholder="Category Name"
                  {...register("category_name", {
                    required: "Category Name is required",
                  })}
                  className="py-4 my-5 w-full border rounded px-3"
                />
                {errors.category_name && (
                  <p className="text-red-500">{errors.category_name.message}</p>
                )}

                {/* Submit Button */}
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full p-7 bg-PrimaryColor rounded text-white font-bold text-lg"
                  disabled={loading}
                  loading={loading}
                >
                  Add to Category
                </Button>
              </form>
            </div>
          </div>

          {/* Add a Sub-Category */}
          <div className="p-4 lg:w-1/3">
            <div className="h-full bg-white bg-opacity-75 px-8 py-4 rounded-lg overflow-hidden text-center relative shadow-md">
              <h2 className="text-2xl font-semibold my-3 text-PrimaryColor">
                Add a Sub-Category
              </h2>
              <AddSubCategory refetch={refetch} />
            </div>
          </div>

          {/* Third Card */}
          <div className="p-4 lg:w-1/3 h-[480px]">
            <div className="h-full bg-white bg-opacity-75 px-8 py-4 rounded-lg overflow-hidden overflow-y-auto text-center relative shadow-md">
              <h2 className="text-2xl font-semibold my-3 text-left text-PrimaryColor">
                All Categories
              </h2>
              <Collapse accordion>
                {categoryWithSub.map((catry, index) => (
                  <Panel
                    header={
                      <div className="flex items-center justify-between text-lg">
                        {/* Icon এবং Name */}
                        <div className="flex items-center">
                          <span className="bg-indigo-100 mr-2 text-3xl rounded-full inline-flex items-center justify-center">
                            <Image
                              width={40}
                              src={catry.image}
                              className="rounded"
                            />
                          </span>
                          {catry.name}
                        </div>

                        <div className="flex">
                          <FaEdit
                            className="cursor-pointer hover:text-blue-500 me-1"
                            onClick={() => handleEdit(catry)}
                          />

                          {/* Delete Icon */}
                          <span
                            onClick={() => handleDelete(catry.id)}
                            className="ml-auto text-end text-red-600"
                          >
                            <RiDeleteBin5Fill />
                          </span>
                        </div>
                      </div>
                    }
                    key={index}
                  >
                    <ul className="ml-7">
                      {catry.sub_categories &&
                      catry.sub_categories.length > 0 ? (
                        catry.sub_categories.map((sub, subIndex) => (
                          <li
                            key={subIndex}
                            className="text-gray-600 text-left text-md font-semibold flex justify-between gap-3 bg-gray-100 my-1"
                          >
                            <div className="flex items-center">
                              <img
                                src={sub.image}
                                width={40}
                                alt="subImage"
                                className="rounded-md me-2"
                              />
                              {sub.name}
                            </div>
                            <div className="flex items-center text-[18px]">
                              <FaEdit
                                className="cursor-pointer hover:text-blue-500 me-1"
                                onClick={() => handleSubCategoryEdit(sub)}
                              />

                              {/* Delete Icon */}
                              <span
                                onClick={() => handleDeleteSub(sub.id)}
                                className="ml-auto cursor-pointer text-end text-red-600"
                              >
                                <RiDeleteBin5Fill />
                              </span>
                            </div>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500 text-sm">
                          No sub-categories available.
                        </li>
                      )}
                    </ul>
                  </Panel>
                ))}
              </Collapse>
            </div>
          </div>
        </div>
      </div>
      <EditCategory
        categoryDetails={categoryDetails}
        isOpen={isEditCategoryOpen}
        onClose={handleModalClose}
        refetch={refetch}
      />
      <EditSubCategory
        subCategoryDetails={subCategoryDetails}
        isOpen={isEditSubCategoryOpen}
        onClose={handleSubCategoryModalClose}
        refetch={refetch}
      />
    </section>
  );
};

export default Categories;
