import { Input, Select, Upload, message } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";
import { MdError } from "react-icons/md";

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
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Simulate server response
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const items = [
    {
      value: "1",
      label: "Fruits",
    },
    {
      value: "2",
      label: "Vegitable",
    },
    {
      value: "3",
      label: "Device",
    },
  ];

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex gap-5">
          <div className="p-4 lg:w-1/3">
            <div className="h-full bg-white bg-opacity-75 px-8 py-4 rounded-lg overflow-hidden text-center relative shadow-md">
              <h2 className="text-2xl font-semibold my-3 text-PrimaryColor">
                Add a New Category
              </h2>

              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="avatar"
                    style={{
                      width: "100%",
                    }}
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
              <Input
                placeholder="Category Name"
                variant="filled"
                className="py-3 my-5"
              />
              <button className="w-full p-4 bg-PrimaryColor rounded text-white font-bold text-lg">
                Add to Category
              </button>
            </div>
          </div>

          <div className="p-4 lg:w-1/3">
            <div className="h-full bg-white bg-opacity-75 px-8 py-4 rounded-lg overflow-hidden text-center relative shadow-md">
              <h2 className="text-2xl font-semibold my-3 text-PrimaryColor">
                Add a Sub-Category
              </h2>

              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="avatar"
                    style={{
                      width: "100%",
                    }}
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
              <Input
                placeholder="Sub-Category Name"
                variant="filled"
                className="py-3 my-5"
              />

              <Select
                className="mb-4"
                showSearch
                style={{
                  width: 400,
                  height: 50,
                }}
                placeholder="Search to Select"
                optionFilterProp="label"
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={items}
              />

              <button className="w-full p-4 bg-PrimaryColor rounded text-white font-bold text-lg">
                Add to Category
              </button>
            </div>
          </div>

          {/* 3th Card  */}

          <div className="p-4 lg:w-1/3">
            <div className="h-full bg-white bg-opacity-75 px-8 py-4 rounded-lg overflow-hidden text-center relative shadow-md">
            <h2 className="text-2xl font-semibold my-3 text-left text-PrimaryColor ">
                All Categorics
              </h2>
              <nav className="flex flex-col sm:items-start sm:text-left text-center items-center -mb-1 space-y-2.5">
                <div></div>
                <a className="text-2xl flex items-center">
                  <span className="bg-indigo-100 mr-2 text-4xl rounded-full inline-flex items-center justify-center">
                  <MdError />
                  </span>
                  First Link
                </a>
                <a className="text-2xl flex items-center">
                  <span className="bg-indigo-100 mr-2 text-4xl rounded-full inline-flex items-center justify-center">
                  <MdError />
                  </span>
                  Second Link
                </a>
                <a className="text-2xl flex items-center">
                  <span className="bg-indigo-100 mr-2 text-4xl rounded-full inline-flex items-center justify-center">
                  <MdError />
                  </span>
                  Third Link
                </a>
                <a className="text-2xl flex items-center">
                  <span className="bg-indigo-100 mr-2 text-4xl rounded-full inline-flex items-center justify-center">
                  <MdError />
                  </span>
                  Fourth Link
                </a>
                <a className="text-2xl flex items-center">
                  <span className="bg-indigo-100 mr-2 text-4xl rounded-full inline-flex items-center justify-center">
                  <MdError />
                  </span>
                  Fifth Link
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
