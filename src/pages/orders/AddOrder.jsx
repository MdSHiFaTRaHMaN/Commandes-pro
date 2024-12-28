import { useState } from "react";
import {
  Input,
  Select,
  Button,
  Typography,
  DatePicker,
  Table,
  message,
} from "antd";
import {
  API,
  useAllCustomers,
  useCustomerAddress,
  useProductName,
} from "../../api/api";
import dayjs from "dayjs";
import { RiDeleteBin5Fill } from "react-icons/ri";
import AddAddressModel from "./AddAddressModel";

const { Title, Text } = Typography;
const { Option } = Select;

const AddOrder = () => {
  const { allCustomer } = useAllCustomers();
  const [selectedCustomer, setSelectedCustomer] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const { customerAddress,refetch } = useCustomerAddress(selectedCustomer);
  const [subtotalExcludingVAT, setSubtotalExcludingVAT] = useState(0);
  const [totalIncludingVAT, setTotalIncludingVAT] = useState(0);
  const [productUploading, setOrderUploading] = useState(false);
  const { product } = useProductName();

  const productId = product.map((prdt) => ({
    value: prdt.id,
    label: prdt.name,
    discount_price: prdt.discount_price,
    id: prdt.id,
    name: prdt.name,
    purchase_price: prdt.purchase_price,
    regular_price: prdt.regular_price,
    selling_price: prdt.selling_price,
    supper_marcent: prdt.supper_marcent,
    tax: prdt.tax,
    whole_price: prdt.whole_price,
  }));

  const [data, setData] = useState([
    {
      key: "1",
      id: 0,
      productId: "",
      quantity: 1,
      comment: "",
      unitPrice: "",
      vat: "",
      total: "",
    },
  ]);

  console.log("selectedCustomer" , selectedCustomer)

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productId",
      key: "productId",
      width: 200,
      render: (id, record) => (
        <Select
          showSearch
          className="h-12"
          placeholder="Select a product"
          optionFilterProp="label"
          options={productId}
          onChange={(value) =>
            handleInputChange(record.key, "productId", value)
          }
        />
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (text, record) => (
        <Input
          placeholder="Enter quantity"
          type="number"
          className="py-3"
          defaultValue={1}
          onChange={(e) =>
            handleInputChange(record.key, "quantity", e.target.value)
          }
        />
      ),
    },

    {
      title: "Unit Price excluding VAT",
      dataIndex: "unitPrice",
      width: 200,
      key: "unitPrice",

      render: (text, record) => {
        const product = productId.find(
          (item) => item.value == record.productId
        );
        return (
          <Input
            placeholder="Enter price"
            type="number"
            className="py-3"
            value={record.unitPrice || product?.purchase_price || 0}
            onChange={(e) =>
              handleInputChange(record.key, "unitPrice", e.target.value)
            }
          />
        );
      },
    },
    {
      title: "VAT (%)",
      dataIndex: "vat",
      key: "vat",

      render: (text, record) => {
        const product = productId.find(
          (item) => item.value == record.productId
        );
        return (
          <Input
            placeholder="Enter VAT"
            type="number"
            className="py-3"
            value={record.vat || product?.tax || 0}
            onChange={(e) =>
              handleInputChange(record.key, "vat", e.target.value)
            }
          />
        );
      },
    },
    {
      title: "Total excluding VAT",
      dataIndex: "total",
      key: "total",
      width: 200,
      render: (text, record) => (
        <Input
          value={record.total}
          placeholder="Total"
          readOnly
          className="py-3"
        />
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          danger
          className="text-xl"
          onClick={() => handleDelete(record.key)}
        >
          <RiDeleteBin5Fill />
        </Button>
      ),
    },
  ];

  const handleAddProduct = () => {
    const newProduct = {
      key: data.length + 1,
      id: 0,
      name: `Product name null`,
      quantity: 1,
      price: 0,
    };

    setData([...data, newProduct]); // Add new product to table
  };

  // Handle delete product
  const handleDelete = (key) => {
    const newData = data.filter((item) => item.key !== key); // Remove row by key
    setData(newData);
  };

  const disabledDate = (current) => {
    // Disable past dates
    return current && current < dayjs().endOf("day");
  };

  // Example of disabled time logic
  const disabledDateTime = () => ({
    disabledHours: () => Array.from({ length: 24 }, (_, i) => i < 8 || i > 20), // Disable hours outside 8 AM - 8 PM
    disabledMinutes: () => Array.from({ length: 60 }, (_, i) => i % 15 !== 0), // Only allow every 15 minutes
  });

  const handleInputChange = (key, field, value) => {
    const newData = data.map((item) => {
      if (item.key === key) {
        const updatedItem = { ...item, [field]: value };

        if (field === "productId") {
          const product = productId.find((prod) => prod.value === value);
          if (product) {
            updatedItem.unitPrice = product.purchase_price;
            updatedItem.vat = product.tax;
          }
        }

        // গণনা: Quantity, Unit Price এবং VAT যাচাই করে Total হিসাব করা
        const quantity = parseFloat(updatedItem.quantity) || 0;
        const unitPrice = parseFloat(updatedItem.unitPrice) || 0;
        const vat = parseFloat(updatedItem.vat) || 0;

        updatedItem.total = (quantity * unitPrice * (1 + vat / 100)).toFixed(2);

        return updatedItem;
      }
      return item;
    });

    setData(newData);

    // Subtotal এবং Total এর জন্য গণনা
    const subtotal = newData.reduce(
      (acc, item) => acc + (parseFloat(item.total) || 0),
      0
    );
    setSubtotalExcludingVAT(subtotal);

    const vatAmount = subtotal * 0.2; // VAT 20%
    setTotalIncludingVAT(subtotal + vatAmount);
  };

  const userData = allCustomer.find((cust) => cust.id == selectedCustomer);

  const handleSaveOrder = async () => {
    const orderData = {
      company: userData.company,
      created_by: selectedCustomer,
      delivery_date: deliveryDate,
      payment_method: "credit_card",
      sub_total: subtotalExcludingVAT,
      tax: subtotalExcludingVAT * 0.055,
      tax_amount: subtotalExcludingVAT * 0.2,
      delivery_fee: 5.0,
      total: totalIncludingVAT,
      user_delivery_address_id: selectedAddress,
      products: data.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
        price: item.unitPrice,
      })),
    };

    try {
      setOrderUploading(true);
      const response = await API.post("/order/create", orderData);
      if (response.status == 200) {
        message.success("Order Added Successfully");
      }
      console.log(response, "resposne");
      setOrderUploading(false);
    } catch (error) {
      console.error(error);
      message.error("Something went wrong");
      setOrderUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 my-4">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg p-8">
        <Title level={3} className="text-pink-500 text-center mb-6">
          Add an Order
        </Title>
        <div>
          <Text className="block mb-2 font-medium">Order number:</Text>
          <Input
            placeholder="Enter Your Order number"
            className="w-full h-12"
          />
        </div>
        <div className="my-3">
          <Text className="block mb-2 font-medium">Delivery Date</Text>
          <DatePicker
            format="YYYY-MM-DD HH:mm:ss"
            className="w-full h-12"
            disabledDate={disabledDate}
            disabledTime={disabledDateTime}
            onChange={(date) => setDeliveryDate(date)}
            showTime={{
              defaultValue: dayjs("00:00:00", "HH:mm:ss"),
            }}
          />
        </div>
        <div className="my-3">
          <Text className="block mb-2 font-medium">Order Status</Text>
          <Select placeholder="Select Order Status" className="w-full h-12">
            <Option value="active">Active</Option>
            <Option value="deactive">Deactive</Option>
            <Option value="cancel">Cancelled</Option>
          </Select>
        </div>
        <h1 className="text-2xl font-semibold my-3">Customer</h1>
        <div>
          <Text className="block mb-2 font-medium">Select Customer</Text>
          <Select
            placeholder="Select a customer"
            className="w-full h-12"
            onChange={(value) => setSelectedCustomer(value)}
          >
            {allCustomer.map((name) => (
              <Option key={name.id} value={name.id}>
                {name.name}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <div className="flex justify-between items-center my-2">
            <Text className="block mb-2 font-medium">
              Select Delivery Address
            </Text>
            <AddAddressModel selectCustomer={selectedCustomer} refetch={refetch} />
          </div>

          <Select
            placeholder="Select an address"
            className="w-full h-12"
            onChange={(value) => setSelectedAddress(value)}
          >
            {customerAddress.map((address) => (
              <Option key={address.map} value={address.id}>
                {address.address}
              </Option>
            ))}
          </Select>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          bordered
          className="my-6"
        />
        <div className="mb-2">
          <Button
            type="primary"
            className="bg-pink-500 hover:bg-pink-600 py-5"
            onClick={handleAddProduct}
          >
            Add Product
          </Button>
        </div>
        <div>
          <Text className="block">Subtotal excluding VAT:</Text>
          <Input
            value={`${subtotalExcludingVAT.toFixed(2)} €`}
            readOnly
            className="py-3"
          />
        </div>

        <div className="my-3">
          <Text className="block">VAT (20%)</Text>
          <Input
            value={`${(subtotalExcludingVAT * 0.2).toFixed(2)} €`}
            readOnly
            className="py-3"
          />
        </div>

        <div>
          <Text className="block">VAT (5.5%):</Text>
          <Input
            value={`${(subtotalExcludingVAT * 0.055).toFixed(2)} €`}
            readOnly
            className="py-3"
          />
        </div>

        <div className="my-3">
          <Text className="block font-semibold">Total including VAT:</Text>
          <Input
            value={`${totalIncludingVAT.toFixed(2)} €`}
            readOnly
            className="py-3"
          />
        </div>

        <div className="mt-6">
          <Button
            type="primary"
            loading={productUploading}
            disabled={productUploading}
            onClick={handleSaveOrder}
            className="bg-pink-500 hover:bg-pink-600 py-3 px-6"
          >
            Save Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddOrder;
