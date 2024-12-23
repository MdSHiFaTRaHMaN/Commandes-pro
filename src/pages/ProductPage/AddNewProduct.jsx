import { Input, Select, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { AiOutlineSave } from "react-icons/ai";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const { TextArea } = Input;
const { Option } = Select;

const AddNewProduct = () => {
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);

  const handleChange = ({ fileList: newFileList }) => {
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
                <Input placeholder="Product Name" className="py-3" />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Packaging</label>
                <Select placeholder="Select Packaging" className="w-full h-12">
                  <Option value="box">Box</Option>
                  <Option value="bag">Bag</Option>
                  <Option value="wrap">Wrap</Option>
                </Select>
              </div>

              <div className="col-span-2">
                <label className="block text-gray-700 mb-1">
                  Product Description
                </label>
                <TextArea
                  placeholder="A detailed description of your product (Min 200 characters)"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Weight/Volume/Unit
                </label>
                <Input placeholder="Unit" className="py-3" />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Product Unit</label>
                <Select placeholder="Product Unit" className="w-full h-12">
                  <Option value="kg">Kg</Option>
                  <Option value="litre">Litre</Option>
                  <Option value="piece">Piece</Option>
                </Select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">In Stock</label>
                <Input placeholder="1" type="number" className="py-3" />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Origin</label>
                <Select placeholder="Origin" className="w-full h-12">
                  <Option value="local">Local</Option>
                  <Option value="imported">Imported</Option>
                </Select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">VAT (%)</label>
                <Select placeholder="Select VAT%" className="w-full h-12">
                  <Option value="5">5%</Option>
                  <Option value="10">10%</Option>
                  <Option value="15">15%</Option>
                </Select>
              </div>
            </div>
            {/* Product Image Upload */}
            <div className="mt-6">
              <label className="block text-gray-700 mb-1">Product Images</label>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleChange}
                onPreview={handlePreview}
                multiple 
              >
                {fileList.length >= 5 ? null : (
                  <span className="font-semibold" ><UploadOutlined />Upload</span>
                )}
              </Upload>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="w-1/2 bg-gray-100 p-6 rounded-md shadow-md">
            <h3 className="text-xl font-semibold text-pink-600 mb-4">
              Pricing
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">
                  Purchase Price (excl. tax)
                </label>
                <Input
                  placeholder="Purchase Price (excl. tax)"
                  type="number"
                  className="py-3"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Prix Revendeurs (+25%)
                </label>
                <Input
                  placeholder="Prix Revendeurs"
                  type="number"
                  className="py-3"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Prix Restaurants (+42%)
                </label>
                <Input
                  placeholder="Prix Restaurants"
                  type="number"
                  className="py-3"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Prix Grossistes (+15%)
                </label>
                <Input
                  placeholder="Prix Grossistes"
                  type="number"
                  className="py-3"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Prix Supermarché (+10%)
                </label>
                <Input
                  placeholder="Prix Supermarché"
                  type="number"
                  className="py-3"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Discount (%)</label>
                <Input
                  placeholder="Discount (%)"
                  type="number"
                  className="py-3"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Select Category
                </label>
                <Select placeholder="LÉGUMES" className="w-full h-12">
                  <Option value="vegetables">Vegetables</Option>
                  <Option value="fruits">Fruits</Option>
                </Select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Main Sub Category
                </label>
                <Select
                  placeholder="Select Main Sub Category"
                  className="w-full h-12"
                >
                  <Option value="leafy">Leafy</Option>
                  <Option value="root">Root</Option>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center mt-6">
          <Button
            type="primary"
            icon={<AiOutlineSave />}
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
