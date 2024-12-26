import { Input, Select, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { AiOutlineSave } from "react-icons/ai";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API, useCategory, useSubCategory } from "../../api/api";
import { RiDeleteBinFill } from "react-icons/ri";
import country from "../../assets/countries.json";
import axios from "axios";

const { TextArea } = Input;
const { Option } = Select;

const AddNewProduct = () => {
  const { category } = useCategory();
  const [selectCategoryID, setSelectCategoryID] = useState(0);
  const { subCategory } = useSubCategory(selectCategoryID);
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [selectedSubCategoriesId, setSelectedSubCategoriesId] = useState([]);

  const [purchasePrice, setPurchasePrice] = useState();
  const [resellerPrice, setResellerPrice] = useState();
  const [prixRestaurants, setPrixRestaurants] = useState();
  const [prixGrossistes, setPrixGrossistes] = useState();
  const [prixSupermarché, setPrixSupermarché] = useState();

  const [packaging, setPackaging] = useState("");
  const [productUnit, setProductUnit] = useState("");
  const [origin, setOrigin] = useState("");
  const [vat, setVat] = useState("");

  const [inStock, setInStock] = useState(0);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [weigthVolumeUnit, setWeigthVolumeUnit] = useState(0);
  const [inDiscount, setInDiscount] = useState(0);
  const [productUploading, setProductUploading] = useState(false);

  const handlePurchasePriceChange = (e) => {
    const price = parseFloat(e.target.value) || 0;
    setPurchasePrice(price);
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
  const onSearch = (value) => {
    console.log("search:", value);
  };

  const handleSaveProudct = async () => {
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
        name: productName || "",
        category_id: selectCategoryID,
        product_type: "physical",
        unit: productUnit || "",
        long_description: productDescription || "",
        tax: vat || 0,
        country: origin || "",
        purchase_price: purchasePrice || 0,
        regular_price: prixRestaurants || 0,
        selling_price: resellerPrice || 0,

        whole_price: prixGrossistes || 0,
        discount_price: inDiscount || 0,
        supper_marcent: prixSupermarché || 0,
        subcategories: selectedSubCategoriesId,
        images: response.data.urls || [],

        is_Stock: inStock || "",
        packaging: packaging || "",
        weightVolumeUnit: weigthVolumeUnit || "",
      };

      try {
        setProductUploading(true);
        const response = await API.post("/product/create", productData);
        if (response.status == 200) {
          message.success("Product Added Successfully");
        }
        console.log(response, "resposne");
        setProductUploading(false);
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
    <div className="p-6 min-h-screen bg-gray-50">
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
              <div>
                <label className="block text-gray-700 mb-1">Product Name</label>
                <Input
                  placeholder="Product Name"
                  className="py-3"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Packaging</label>

                <Select
                  placeholder="Select Packaging"
                  className="w-full h-12"
                  onChange={(value) => setPackaging(value)}
                >
                  <Option value="lekillo">Le Kilo</Option>
                  <Option value="LaPièce">La Pièce</Option>
                  <Option value="Le Litre">Le Litre</Option>
                  <Option value="Le Colis">Le Colis</Option>
                  <Option value="La Palette">La Palette</Option>
                  <Option value="---------">---------</Option>
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
              </div>
              <div className="col-span-2">
                <label className="block text-gray-700 mb-1">
                  Product Description
                </label>
                <TextArea
                  placeholder="A detailed description of your product (Min 200 characters)"
                  rows={4}
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">
                  Weight/Volume/Unit
                </label>
                <Input
                  placeholder="Unit"
                  className="py-3"
                  onChange={(e) => setWeigthVolumeUnit(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Product Unit</label>
                <Select
                  placeholder="Product Unit"
                  className="w-full h-12"
                  onChange={(value) => setProductUnit(value)}
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
              </div>
              <div>
                <label className="block text-gray-700 mb-1">In Stock</label>
                <Input
                  placeholder="1"
                  type="number"
                  className="py-3"
                  onChange={(e) => setInStock(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Origin</label>
                <Select
                  placeholder="Origin"
                  className="w-full h-12"
                  onSearch={onSearch}
                  showSearch
                  onChange={(value) => setOrigin(value)}
                >
                  {country.map((countrys, index) => (
                    <Option key={index} value={countrys.name}>
                      {countrys.name}
                    </Option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">VAT (%)</label>
                <Select
                  placeholder="Select VAT%"
                  className="w-full h-12"
                  onChange={(value) => setVat(value)}
                >
                  <Option value="0">0</Option>
                  <Option value="5">5</Option>
                  <Option value="10">10</Option>
                  <Option value="15">15</Option>
                  <Option value="20">20</Option>
                </Select>
              </div>
            </div>
            {/* Product Image Upload */}
            <div className="mt-6">
              <label className="block text-gray-700 mb-1">Product Images</label>

              <Upload
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
            </div>
          </div>

          {/* Pricing Section */}
          <div className="w-1/2 bg-gray-100 p-6 rounded-md shadow-md">
            <h3 className="text-xl font-semibold text-pink-600 mb-4">
              Pricing
            </h3>
            <div className="my-3">
              <label className="block text-gray-700 mb-1">
                Purchase Price (excl. tax)
              </label>
              <Input
                placeholder="Purchase Price (excl. tax)"
                type="number"
                className="py-3"
                value={purchasePrice}
                onChange={handlePurchasePriceChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">
                  Prix Revendeurs (+25%)
                </label>
                <Input
                  readOnly
                  placeholder="Prix Revendeurs"
                  type="number"
                  className="py-3"
                  value={resellerPrice}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Prix Restaurants (+20%)
                </label>
                <Input
                  readOnly
                  placeholder="Prix Restaurants"
                  type="number"
                  className="py-3"
                  value={prixRestaurants}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Prix Grossistes (+15%)
                </label>
                <Input
                  readOnly
                  placeholder="Prix Grossistes"
                  type="number"
                  className="py-3"
                  value={prixGrossistes}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Prix Supermarché (+10%)
                </label>
                <Input
                  readOnly
                  placeholder="Prix Supermarché"
                  type="number"
                  className="py-3"
                  value={prixSupermarché}
                />
              </div>
            </div>
            <div className="my-3">
              <label className="block text-gray-700 mb-1">Discount (%)</label>
              <Input
                placeholder="Discount (%)"
                type="number"
                className="py-3"
                onChange={(e) => setInDiscount(Number(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">
                  Select Category
                </label>
                <Select
                  placeholder="LÉGUMES"
                  className="w-full h-12"
                  onChange={handleCategorySelect}
                >
                  {category.map((ctry) => (
                    <Option key={ctry.id} value={ctry.id}>
                      {ctry.category_name}
                    </Option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Sub Category</label>
                <Select
                  placeholder="Select Main Sub Categories"
                  className="w-full h-12"
                  onChange={(value) => handleSelect(JSON.parse(value))}
                >
                  {subCategory.map((sub) => (
                    <Option
                      key={sub.id}
                      value={JSON.stringify({ id: sub.id, name: sub.name })}
                    >
                      {sub.name}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
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
            onClick={handleSaveProudct}
            loading={productUploading}
            disabled={productUploading}
            className="bg-pink-600 hover:bg-pink-700 p-5"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddNewProduct;
