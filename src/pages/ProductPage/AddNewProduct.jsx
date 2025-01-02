import { Input, Select, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { AiOutlineSave } from "react-icons/ai";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form"; // React Hook Form
import country from "../../assets/countries.json";
import { API, useCategory, useSubCategory } from "../../api/api";
import { RiDeleteBinFill } from "react-icons/ri";
import axios from "axios";

const { TextArea } = Input;
const { Option } = Select;

const AddNewProduct = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();
  const navigate = useNavigate();
  const { category } = useCategory();
  const [selectCategoryID, setSelectCategoryID] = useState(0);
  const { subCategory } = useSubCategory(selectCategoryID);

  const [fileList, setFileList] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [selectedSubCategoriesId, setSelectedSubCategoriesId] = useState([]);
  const [resellerPrice, setResellerPrice] = useState();
  const [prixRestaurants, setPrixRestaurants] = useState();
  const [prixGrossistes, setPrixGrossistes] = useState();
  const [prixSupermarché, setPrixSupermarché] = useState();
  const [productUploading, setProductUploading] = useState();

  const handlePurchasePriceChange = (e, field) => {
    const price = parseFloat(e.target.value) || 0;
    field.onChange(price); // Update react-hook-form state
    setResellerPrice(parseFloat((price + price * 0.25).toFixed(2)));
    setPrixRestaurants(parseFloat((price + price * 0.2).toFixed(2)));
    setPrixGrossistes(parseFloat((price + price * 0.15).toFixed(2)));
    setPrixSupermarché(parseFloat((price + price * 0.1).toFixed(2)));
  };
  //  sub category add funsion
  const handleCategorySelect = (value) => {
    setSelectCategoryID(value);
  };

  //  sub category add funsion
  const handleSelect = (selected) => {
    const { id, name } = selected;

    // Avoid adding duplicates
    if (!selectedSubCategories.includes(name)) {
      setSelectedSubCategories([...selectedSubCategories, name]);
      setSelectedSubCategoriesId([...selectedSubCategoriesId, id]);
    }
  };
  const handleDelete = (subCategory) => {
    // Remove the selected subcategory
    setSelectedSubCategories(
      selectedSubCategories.filter((sub) => sub !== subCategory)
    );
  };

  const onSearch = (value) => {
    console.log("search:", value);
  };

  // image add funsion
  const handleImageUpload = async ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handlePreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  // Handle the form submission
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("pdfs", file.originFileObj);
      });

      // Make a single POST request
      const response = await axios.post(
        "https://cloudinary.allbusinesssolution.com/api/v1/files/uploads",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const productData = {
        name: data.productName || "",
        category_id: selectCategoryID,
        product_type: "physical",
        unit: data.productUnit || "",
        long_description: data.productDescription || "",
        packaging: data.packaging,
        uvw: data.weightVolumeUnit,
        in_stock: data.inStock,
        tax: data.vat || 0,
        country: data.origin || "",
        purchase_price: data.purchasePrice || 0,
        regular_price: prixRestaurants || 0,
        selling_price: resellerPrice || 0,

        whole_price: prixGrossistes || 0,
        discount_price: data.discount || 0,
        supper_marcent: prixSupermarché || 0,
        subcategories: selectedSubCategoriesId,
        images: response.data.urls || [],

        is_Stock: data.inStock || "",
        packaging: data.packaging || "",
        weightVolumeUnit: data.weightVolumeUnit || "",
      };

      try {
        setProductUploading(true);
        const response = await API.post("/product/create", productData);
        if (response.status == 200) {
          message.success("Product Added Successfully");
        }
        setProductUploading(false);
        navigate("/products");
      } catch (error) {
        console.error(error);
        message.error("Something went wrong");
        setProductUploading(false);
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to upload files.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 min-h-screen bg-gray-50"
    >
      <div className="w-11/12 mx-auto bg-white p-8 shadow rounded-md">
        <h2 className="text-2xl flex items-center gap-2 font-semibold text-black mb-6">
          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer hover:bg-gray-200 p-3 rounded-full"
          >
            <FaArrowLeftLong />
          </button>
          Add Product
        </h2>

        <div className="flex gap-6">
          {/* Product Details Section */}
          <div className="w-1/2 bg-gray-100 p-6 rounded-md shadow-md">
            <h2 className="text-xl font-semibold text-pink-600 mb-4">
              Product Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {/* product name  */}
              <div>
                <label className="block text-gray-700 mb-1">Product Name</label>
                <Controller
                  name="productName"
                  control={control}
                  rules={{
                    required: "Product name is required",
                  }}
                  render={({ field }) => (
                    <>
                      <Input
                        {...field}
                        placeholder="Product Name"
                        className={`py-3 w-full ${
                          errors.productName ? "border-red-500" : ""
                        }`}
                      />
                      {errors.productName && (
                        <span className="text-red-500 text-sm">
                          {errors.productName.message}
                        </span>
                      )}
                    </>
                  )}
                />
              </div>
              {/* Packaging  */}
              <div>
                <label className="block text-gray-700 mb-1">Packaging</label>
                <Controller
                  name="packaging"
                  control={control}
                  rules={{ required: "Packaging is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <Select
                        {...field}
                        placeholder="Select Packaging"
                        className={`w-full h-12 ${
                          error ? "border-red-500" : ""
                        }`}
                      >
                        <Option value="lekillo">Le Kilo</Option>
                        <Option value="LaPièce">La Pièce</Option>
                        <Option value="Le Litre">Le Litre</Option>
                        <Option value="Le Colis">Le Colis</Option>
                        <Option value="La Palette">La Palette</Option>
                        <Option value="La Barquette">La Barquette</Option>
                        <Option value="Le Bocal">Le Bocal</Option>
                        <Option value="La Bouteille">La Bouteille</Option>
                        <Option value="Le Filet">Le Filet</Option>
                        <Option value="Le Lot">Le Lot</Option>
                        <Option value="Le Pack">Le Pack</Option>
                        <Option value="Le Paquet">Le Paquet</Option>
                        <Option value="La Portion">La Portion</Option>
                        <Option value="Le Sac">Le Sac</Option>
                        <Option value="Le Sachet">Le Sachet</Option>
                      </Select>
                      {error && (
                        <span className="text-red-500 text-sm mt-1">
                          {error.message}
                        </span>
                      )}
                    </div>
                  )}
                />
              </div>
              {/* Product Description */}
              <div className="col-span-2">
                <label className="block text-gray-700 mb-1">
                  Product Description
                </label>
                <Controller
                  name="productDescription"
                  control={control}
                  rules={{
                    required: "Product description is required",
                  }}
                  render={({ field }) => (
                    <>
                      <TextArea
                        {...field}
                        placeholder="A detailed description of your product"
                        rows={4}
                        className={`${
                          errors.productDescription ? "border-red-500" : ""
                        }`}
                      />
                      {errors.productDescription && (
                        <span className="text-red-500 text-sm">
                          {errors.productDescription.message}
                        </span>
                      )}
                    </>
                  )}
                />
              </div>
              {/* Weight/Volume/Unit */}
              <div>
                <label className="block text-gray-700 mb-1">
                  Weight/Volume/Unit
                </label>
                <Controller
                  name="weightVolumeUnit"
                  control={control}
                  rules={{
                    required: "This field is required",
                  }}
                  render={({ field }) => (
                    <>
                      <Input
                        {...field}
                        placeholder="Unit"
                        className={`py-3 ${
                          errors.weightVolumeUnit ? "border-red-500" : ""
                        }`}
                      />
                      {errors.weightVolumeUnit && (
                        <span className="text-red-500 text-sm">
                          {errors.weightVolumeUnit.message}
                        </span>
                      )}
                    </>
                  )}
                />
              </div>
              {/* Product Unit */}
              <div>
                <label className="block text-gray-700 mb-1">Product Unit</label>
                <Controller
                  name="productUnit"
                  control={control} // react-hook-form এর control
                  rules={{ required: "Product Unit is required" }} // Validation rules
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Select
                        {...field}
                        placeholder="Product Unit"
                        className={`w-full h-12 ${
                          error ? "border-red-500" : ""
                        }`}
                      >
                        <Option value="KG (€ / KG)">KG (€ / KG)</Option>
                        <Option value="G (€ / G)">G (€ / G)</Option>
                        <Option value="MG (€ / MG)">MG (€ / MG)</Option>
                        <Option value="L (€ / L)">L (€ / L)</Option>
                        <Option value="ML (€ / ML)">ML (€ / ML)</Option>
                        <Option value="U (€ / U)">U (€ / U)</Option>
                        <Option value="CM (€ / CM)">CM (€ / CM)</Option>
                        <Option value="MM (€ / MM)">MM (€ / MM)</Option>
                        <Option value="M (€ / M)">M (€ / M)</Option>
                      </Select>
                      {error && (
                        <span className="text-red-500 text-sm mt-1">
                          {error.message}
                        </span>
                      )}
                    </>
                  )}
                />
              </div>
              {/* In Stock  */}
              <div>
                <label className="block text-gray-700 mb-1">In Stock</label>
                <Controller
                  name="inStock"
                  control={control}
                  rules={{
                    required: "Stock quantity is required",
                    min: {
                      value: 1,
                      message: "The minimum quantity must be 1",
                    },
                  }}
                  render={({ field }) => (
                    <>
                      <Input
                        {...field}
                        placeholder="1"
                        type="number"
                        className={`py-3 ${
                          errors.inStock ? "border-red-500" : ""
                        }`}
                      />
                      {errors.inStock && (
                        <span className="text-red-500 text-sm">
                          {errors.inStock.message}
                        </span>
                      )}
                    </>
                  )}
                />
              </div>
              {/* Origin  */}
              <div>
                <label className="block text-gray-700 mb-1">Origin</label>
                <Controller
                  name="origin"
                  control={control}
                  rules={{ required: "Origin is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <Select
                        {...field}
                        placeholder="Origin"
                        className={`w-full h-12 ${
                          error ? "border-red-500" : ""
                        }`}
                        onSearch={onSearch}
                        showSearch
                      >
                        {country.map((countrys, index) => (
                          <Option key={index} value={countrys.name}>
                            {countrys.name}
                          </Option>
                        ))}
                      </Select>
                      {error && (
                        <span className="text-red-500 text-sm mt-1">
                          {error.message}
                        </span>
                      )}
                    </div>
                  )}
                />
              </div>
              {/* VAT (%)  */}
              <div>
                <label className="block text-gray-700 mb-1">VAT (%)</label>
                <Controller
                  name="vat"
                  control={control}
                  rules={{ required: "VAT is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <Select
                        {...field}
                        placeholder="Select VAT%"
                        className={`w-full h-12 ${
                          error ? "border-red-500" : ""
                        }`}
                      >
                        <Option value="0">0</Option>
                        <Option value="5.5">5.5</Option>
                        <Option value="10">10</Option>
                        <Option value="20">20</Option>
                      </Select>
                      {error && (
                        <span className="text-red-500 text-sm mt-1">
                          {error.message}
                        </span>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>
            {/* Product Image Upload */}
            <div className="mt-6">
              <label className="block text-gray-700 mb-1">Product Images</label>
              <Controller
                name="productImages"
                control={control}
                rules={{
                  validate: () => fileList.length > 0 || "Image Required",
                }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Upload
                      {...field}
                      listType="picture-card"
                      fileList={fileList}
                      onChange={handleImageUpload}
                      onPreview={handlePreview}
                      multiple
                    >
                      {fileList.length >= 5 ? null : (
                        <span className="font-semibold">
                          <UploadOutlined />
                          Upload
                        </span>
                      )}
                    </Upload>
                    {error && (
                      <span className="text-red-500 text-sm mt-1">
                        {error.message}{" "}
                      </span>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          {/* Pricing Section */}
          <div className="w-1/2 bg-gray-100 p-6 rounded-md shadow-md">
            <h3 className="text-xl font-semibold text-pink-600 mb-4">
              Pricing
            </h3>
            {/* Purchase Price */}
            <div>
              <label className="block text-gray-700 mb-3">Purchase Price</label>
              <Controller
                name="purchasePrice"
                control={control}
                rules={{
                  required: "Purchase price is required",
                  min: {
                    value: 0,
                    message:
                      "Purchase price must be greater than or equal to 0",
                  },
                }}
                render={({ field }) => (
                  <div>
                    <Input
                      {...field}
                      placeholder="Purchase Price"
                      type="number"
                      value={field.value} // Use field.value from react-hook-form
                      onChange={(e) => handlePurchasePriceChange(e, field)} // Pass field to update react-hook-form
                      className={`py-3 my-2 ${
                        errors.purchasePrice ? "border-red-500" : ""
                      }`}
                    />
                    {errors.purchasePrice && (
                      <span className="text-red-500 text-sm">
                        {errors.purchasePrice.message}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 gap-y-5">
              <div>
                <label className="block text-gray-700 mb-1">
                  Reseller Price (+25%)
                </label>
                <Input
                  readOnly
                  placeholder="Reseller Price"
                  type="number"
                  className="py-3"
                  value={resellerPrice}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Restaurant Price (+20%)
                </label>
                <Input
                  readOnly
                  placeholder="Restaurant Price"
                  type="number"
                  className="py-3"
                  value={prixRestaurants}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Wholesale Price (+15%)
                </label>
                <Input
                  readOnly
                  placeholder="Wholesale Price"
                  type="number"
                  className="py-3"
                  value={prixGrossistes}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Supermarket Price (+10%)
                </label>
                <Input
                  readOnly
                  placeholder="Supermarket Price"
                  type="number"
                  className="py-3"
                  value={prixSupermarché}
                />
              </div>
            </div>
            <div className="my-3">
              <label className="block text-gray-700 mb-1">Discount (%)</label>
              <Controller
                name="discount"
                control={control}
                rules={{
                  required: "Discount percentage is required",
                  min: {
                    value: 0,
                    message: "Discount must be a positive value",
                  },
                  max: {
                    value: 100,
                    message: "Discount cannot exceed 100%",
                  },
                }}
                render={({ field }) => (
                  <>
                    <Input
                      {...field}
                      placeholder="Discount (%)"
                      type="number"
                      className={`py-3 ${
                        errors.discount ? "border-red-500" : ""
                      }`}
                    />
                    {errors.discount && (
                      <span className="text-red-500 text-sm">
                        {errors.discount.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>
            {/* Select Category  */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">
                  Select Category
                </label>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Category is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Select
                        {...field}
                        placeholder="Select Category"
                        className={`w-full h-12 ${
                          error ? "border-red-500" : ""
                        }`}
                        onChange={(value) => {
                          field.onChange(value);
                          handleCategorySelect(value); // Pass selected value to parent function
                        }}
                      >
                        {category.map((ctry) => (
                          <Option key={ctry.id} value={ctry.id}>
                            {ctry.category_name}
                          </Option>
                        ))}
                      </Select>
                      {error && (
                        <span className="text-red-500 text-sm mt-1">
                          {error.message}
                        </span>
                      )}
                    </>
                  )}
                />
              </div>
              {/* Sub Category  */}
              <div>
                <label className="block text-gray-700 mb-1">Sub Category</label>
                <Controller
                  name="subCategory"
                  control={control}
                  rules={{ required: "Sub Category is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Select
                        {...field}
                        placeholder="Select Main Sub Categories"
                        className={`w-full h-12 ${
                          error ? "border-red-500" : ""
                        }`}
                        onChange={(value) => {
                          field.onChange(value);
                          handleSelect(JSON.parse(value)); // Pass the selected value to parent function
                        }}
                      >
                        {subCategory.map((sub) => (
                          <Option
                            key={sub.id}
                            value={JSON.stringify({
                              id: sub.id,
                              name: sub.name,
                            })}
                          >
                            {sub.name}
                          </Option>
                        ))}
                      </Select>
                      {error && (
                        <span className="text-red-500 text-sm mt-1">
                          {error.message}
                        </span>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
            {/* show category  */}
            <div className="mt-4">
              <div className="mt-2">
                {selectedSubCategories.map((sub) => (
                  <div
                    key={sub}
                    className="flex items-center justify-between bg-gray-200 p-2 rounded mb-2"
                  >
                    <span>{sub}</span>
                    <button
                      onClick={() => handleDelete(sub)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <RiDeleteBinFill />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Save Button */}
        <div className="text-center mt-6">
          <Button
            type="primary"
            icon={<AiOutlineSave />}
            htmlType="submit"
            loading={productUploading}
            disabled={productUploading}
            className="bg-pink-600 hover:bg-pink-700 p-5"
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddNewProduct;
