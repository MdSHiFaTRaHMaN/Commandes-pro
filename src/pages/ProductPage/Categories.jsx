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
  const { category } = useCategory();
  const { categoryWithSub, refetch } = useCategoryWithSub();

  const [subCategoryLoading, setSubCategoryLoading] = useState(false);
  const [subCategoryImage, setSubCategoryImage] = useState();
  const [subImage, setSubImage] = useState();
  const [loading, setLoading] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [mainCatId, setMainCatId] = useState(null);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [subCategorySerial, setSubCategorySerial] = useState();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleSubCategoryChange = (info) => {
    if (info.file.status === "uploading") {
      setSubCategoryLoading(true);
      return;
    }

    setSubImage(info.file.originFileObj);
    if (info.file.originFileObj) {
      // Display the image locally without server upload
      getBase64(info.file.originFileObj, (url) => {
        setSubCategoryLoading(false);
        setSubCategoryImage(url);
      });
    }
  };

  const uploadButton = (loading) => (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

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
        sn_number: data.serial_number,
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

  // save sub category
  const handleSubSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Validation for required fields
    if (!mainCatId || !subCategoryName || !subCategoryImage) {
      message.error("Please fill all fields!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("pdf", subImage);

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

      const subcategoryImageUrl = response.data.url || "";

      // Prepare sub-category data
      const subCategoryData = {
        sn_number: subCategorySerial, // Dynamic serial number
        main_cat_id: mainCatId,
        name: subCategoryName,
        image: subcategoryImageUrl,
      };

      try {
        setSubLoading(true); // Show loading state

        // API call to create sub-category
        const response = await API.post("/subcategory/create", subCategoryData);

        if (response.status === 200) {
          message.success("Sub-category added successfully!");
          refetch(); // Refresh category data (assuming `refetch` reloads categories)
          // Reset form fields
          setMainCatId(null);
          setSubCategoryName("");
          setSubCategoryImage(null);
          setSubCategorySerial(null);
        }

        setSubLoading(false); // Hide loading state
      } catch (error) {
        console.error(error);
        message.error("Something went wrong");
        setSubLoading(false); // Hide loading state
      }

      // const categoryImageUrl = response?.data?.url || "";
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

                <input
                  type="number"
                  placeholder="Serial Number"
                  {...register("serial_number", {
                    required: "Serial Number is required",
                  })}
                  className="py-4 mt-2 w-full border rounded px-3"
                />

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
              <form onSubmit={handleSubSubmit}>
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                  beforeUpload={beforeUpload}
                  onChange={handleSubCategoryChange}
                >
                  {subCategoryImage ? (
                    <img
                      src={subCategoryImage}
                      alt="avatar"
                      style={{
                        width: "100%",
                      }}
                    />
                  ) : (
                    uploadButton(subCategoryLoading)
                  )}
                </Upload>

                <Input
                  placeholder="Serial Number"
                  value={subCategorySerial}
                  onChange={(e) => setSubCategorySerial(e.target.value)}
                  className="py-3 mt-2"
                />

                {/* সাব-ক্যাটাগরি নাম */}
                <Input
                  placeholder="Sub-Category Name"
                  value={subCategoryName}
                  onChange={(e) => setSubCategoryName(e.target.value)}
                  className="py-3 my-2"
                />

                {/* মেইন ক্যাটাগরি সিলেক্ট */}
                <Select
                  className="mb-4"
                  showSearch
                  style={{
                    width: 400,
                    height: 50,
                  }}
                  placeholder="Search to Select"
                  optionFilterProp="children"
                  value={mainCatId}
                  onChange={(value) => setMainCatId(value)}
                >
                  {categoryWithSub.map((catgyName) => (
                    <Option key={catgyName.id} value={catgyName.id}>
                      {catgyName.name}
                    </Option>
                  ))}
                </Select>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={subLoading}
                  disabled={subLoading}
                  className="w-full p-4 py-7 bg-PrimaryColor rounded text-white font-bold text-lg"
                >
                  Add to Sub-Category
                </Button>
              </form>
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

                        {/* Delete Icon */}
                        <span
                          onClick={() => handleDelete(catry.id)}
                          className="ml-auto text-end text-red-600"
                        >
                          <RiDeleteBin5Fill />
                        </span>
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
                            className="text-gray-600 text-left text-md font-semibold flex items-center gap-3 bg-gray-100 my-1"
                          >
                            <img
                              src={sub.image}
                              width={40}
                              alt="subImage"
                              className="rounded-md"
                            />{" "}
                            {sub.name}
                            <span
                              onClick={() => handleDeleteSub(sub.id)}
                              className="ml-auto mr-2 text-red-500 cursor-pointer"
                            >
                              <RiDeleteBin5Fill />
                            </span>
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
    </section>
  );
};

export default Categories;
