import React, { useState } from "react";
import { Button, Input, Select, Upload, message } from "antd";
import { API, useCategory } from "../../api/api";
import axios from "axios";

const { Option } = Select;

function AddSubCategory({ refetch }) {
  const { category } = useCategory();
  const [mainCatId, setMainCatId] = useState(null);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [subCategoryImage, setSubCategoryImage] = useState(null);
  const [errors, setErrors] = useState({}); // To track validation errors
  const [subLoading, setSubLoading] = useState(false);

  // Validation Function
  const validateFields = () => {
    const newErrors = {};
    if (!mainCatId) newErrors.mainCatId = "Main Category is required!";
    if (!subCategoryName)
      newErrors.subCategoryName = "Sub-Category Name is required!";
    if (!subCategoryImage) newErrors.subCategoryImage = "Image is required!";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Save Sub Category
  const handleSubSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Validate Fields
    if (!validateFields()) {
      message.error("Please fill all required fields!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("pdf", subCategoryImage);

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

      console.log("response", response);

      const subcategoryImageUrl = response.data.url || "";

      // Prepare sub-category data
      const subCategoryData = {
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
          setErrors({}); // Clear errors
        }

        setSubLoading(false); // Hide loading state
      } catch (error) {
        console.error(error);
        message.error("Something went wrong");
        setSubLoading(false); // Hide loading state
      }
    } catch (error) {
      console.error(error);
      message.error("Something went wrong!");
    }
  };

  return (
    <form onSubmit={handleSubSubmit}>
      {/* Image Upload */}
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={(file) => {
          setSubCategoryImage(file);
          setErrors((prev) => ({ ...prev, subCategoryImage: null })); // Clear error
          return false;
        }}
      >
        {subCategoryImage ? (
          <img
            src={URL.createObjectURL(subCategoryImage)}
            alt="avatar"
            style={{ width: "100%" }}
          />
        ) : (
          <div>Upload Image</div>
        )}
      </Upload>
      {errors.subCategoryImage && (
        <p style={{ color: "red" }}>{errors.subCategoryImage}</p>
      )}

      {/* Sub-Category Name */}
      <Input
        placeholder="Sub-Category Name"
        value={subCategoryName}
        onChange={(e) => {
          setSubCategoryName(e.target.value);
          setErrors((prev) => ({ ...prev, subCategoryName: null })); // Clear error
        }}
        className="py-3 my-2"
      />
      {errors.subCategoryName && (
        <p style={{ color: "red" }}>{errors.subCategoryName}</p>
      )}

      {/* Main Category Select */}
      <Select
        className="mb-4"
        showSearch
        style={{
          width: "100%",
        }}
        placeholder="Search to Select"
        value={mainCatId}
        onChange={(value) => {
          setMainCatId(value);
          setErrors((prev) => ({ ...prev, mainCatId: null })); // Clear error
        }}
      >
        {category.map((catgyName) => (
          <Option key={catgyName.id} value={catgyName.id}>
            {catgyName.category_name}
          </Option>
        ))}
      </Select>
      {errors.mainCatId && <p style={{ color: "red" }}>{errors.mainCatId}</p>}

      {/* Submit Button */}
      <Button
        type="primary"
        htmlType="submit"
        loading={subLoading}
        className="w-full p-4 py-7 bg-PrimaryColor rounded text-white font-bold text-lg"
      >
        Add to Sub-Category
      </Button>
    </form>
  );
}

export default AddSubCategory;
