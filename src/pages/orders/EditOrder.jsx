import { useEffect, useState } from "react";
import {
  Input,
  Select,
  Button,
  Typography,
  DatePicker,
  Table,
  message,
  Spin,
} from "antd";
import {
  API,
  useAllCustomers,
  useCustomerAddress,
  useDeliveryAddress,
  useProductName,
  useSingleOrder,
} from "../../api/api";
import dayjs from "dayjs";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

const EditOrder = () => {
  const { orderId } = useParams();
  const { singleOrder, isLoading, isError, error, refetch } =
    useSingleOrder(orderId);

  const { allCustomer } = useAllCustomers();
  const { deliveryAddress } = useDeliveryAddress();
  const [selectedCustomer, setSelectedCustomer] = useState(0);
  const [selectedCustomerName, setSelectedCustomerName] = useState();
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [selectedAddressName, setSelectedAddressName] = useState();
  const [deliveryDate, setDeliveryDate] = useState(null);
  const { customerAddress } = useCustomerAddress(selectedCustomer);
  const [subtotalExcludingVAT, setSubtotalExcludingVAT] = useState(0);
  const [totalIncludingVAT, setTotalIncludingVAT] = useState(0);
  const [productUploading, setOrderUploading] = useState(false);
  const [accountType, setAccountType] = useState("");
  const [totalTaxAmount, setTotalTaxAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (singleOrder) {
      setDeliveryDate(singleOrder.delivery_date);
      setSelectedCustomer(singleOrder.created_by);
      setSelectedAddress(singleOrder.user_delivery_address_id);
    }
  }, [singleOrder]);

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
      quantity: 0,
      comment: "",
      unitPrice: "",
      vat: "",
      total: "",
    },
  ]);

  useEffect(() => {
    if (singleOrder && singleOrder.products) {
      const formattedData = singleOrder.products.map((product, index) => ({
        key: index + 1,
        productId: product.product_id,
        quantity: product.quantity,
        unitPrice: product.price,
        vat: product.tax || 0, // Assuming tax field exists or set to 0
        total: (product.quantity * product.price).toFixed(2), // Calculate total
      }));
      setData(formattedData);
    }
  }, [singleOrder]);

  //  new use effect
  useEffect(() => {
    if (singleOrder && customerAddress?.length > 0) {
      const address = customerAddress.find(
        (addr) => addr.id === singleOrder.user_delivery_address_id
      );
      if (address) {
        setSelectedAddress(address.id);
        setSelectedAddressName(address.address);
      }
    }
  }, [singleOrder, customerAddress]);

  useEffect(() => {
    const subtotal = data.reduce(
      (acc, item) =>
        acc + (parseFloat(item.unitPrice) * parseFloat(item.quantity) || 0),
      0
    );
    setSubtotalExcludingVAT(subtotal);

    const vat20 = subtotal * 0.2;
    const vat5_5 = subtotal * 0.055;
    setTotalIncludingVAT(subtotal + vat20 + vat5_5);
  }, [data]);

  const columns = [
    {
      title: "Nom du produit",
      dataIndex: "productId",
      key: "productId",
      width: 200,
      render: (id, record) => {
        const product = productId?.find((item) => item.value === id);
        return (
          <Select
            showSearch
            className="h-12"
            placeholder="Select a product"
            optionFilterProp="label"
            options={productId}
            value={product ? product.label : null}
            onChange={(value) =>
              handleInputChange(record.key, "productId", value)
            }
          />
        );
      },
    },

    {
      title: "Quantité",
      dataIndex: "quantity",
      key: "quantity",
      render: (text, record) => (
        <Input
          placeholder="Enter quantity"
          type="number"
          className="py-3"
          value={record.quantity}
          onChange={(e) =>
            handleInputChange(record.key, "quantity", e.target.value)
          }
        />
      ),
    },

    {
      title: "Prix unitaire hors TVA",
      dataIndex: "unitPrice",
      width: 200,
      key: "unitPrice",

      render: (text, record) => {
        const product = productId?.find(
          (item) => item.value == record.productId
        );

        const price =
          accountType == "Restauration"
            ? product?.regular_price
            : accountType == "Revendeur"
            ? product?.selling_price
            : accountType == "Grossiste"
            ? product?.whole_price
            : accountType == "Supper Marcent"
            ? product?.supper_marcent
            : product?.purchase_price;

        return (
          <Input
            placeholder="Enter price"
            type="number"
            className="py-3"
            value={record.unitPrice || price || 0}
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
        const product = productId?.find(
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
      title: "Prix incluant la TVA",
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

    setData([...data, newProduct]);
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
    disabledHours: () => Array.from({ length: 24 }, (_, i) => i < 8 || i > 20),
    disabledMinutes: () => Array.from({ length: 60 }, (_, i) => i % 15 !== 0),
  });

  const handleInputChange = (key, field, value) => {
    const newData = data.map((item) => {
      if (item.key === key) {
        const updatedItem = { ...item, [field]: value };

        if (field === "productId") {
          const product = productId?.find((prod) => prod.value === value);
          const price =
            accountType == "Restauration"
              ? product.regular_price
              : accountType == "Revendeur"
              ? product.selling_price
              : accountType == "Grossiste"
              ? product.whole_price
              : accountType == "Supper Marcent"
              ? product.supper_marcent
              : product.purchase_price;

          if (product) {
            updatedItem.unitPrice = price;
            updatedItem.vat = product.tax;
          }
        }

        const quantity = parseFloat(updatedItem.quantity) || 0;
        const unitPrice = parseFloat(updatedItem.unitPrice) || 0;
        const vat = parseFloat(updatedItem.vat) || 0;

        const vatExcludingTotal = quantity * unitPrice;
        const vatIncludingTotal = vatExcludingTotal * (1 + vat / 100);

        updatedItem.total = vatIncludingTotal.toFixed(2);

        return updatedItem;
      }
      return item;
    });

    setData(newData);

    const totalAmount = newData.reduce(
      (acc, item) => acc + (parseFloat(item.total) || 0),
      0
    );

    const subtotalExcludingVAT = newData.reduce(
      (acc, item) => acc + (item.unitPrice * item.quantity || 0),
      0
    );

    const tax = totalAmount - subtotalExcludingVAT;
    setSubtotalExcludingVAT(subtotalExcludingVAT);
    setTotalIncludingVAT(totalAmount);
    setTotalTaxAmount(tax);
  };

  const userData = allCustomer?.find((cust) => cust.id == selectedCustomer);

  useEffect(() => {
    if (userData) {
      setAccountType(userData.account_type);
      setSelectedCustomerName(userData.name);
    }
  }, [userData]);

  useEffect(() => {
    if (subtotalExcludingVAT && totalIncludingVAT) {
      setTotalTaxAmount(totalIncludingVAT - subtotalExcludingVAT);
    }
  }, [subtotalExcludingVAT, totalIncludingVAT]);

  const userDeliveryAdd = deliveryAddress?.find(
    (deliAdd) => deliAdd.id == selectedAddress
  );

  useEffect(() => {
    if (userDeliveryAdd) {
      setSelectedAddress(userDeliveryAdd.id);
      setSelectedAddressName(userDeliveryAdd.address);
    }
  }, [userDeliveryAdd]);

  const handleSaveOrder = async () => {
    const filteredData = data.filter((item) => item.productId && item.quantity);

    const orderData = {
      company: userData.company,
      delivery_date: deliveryDate,
      payment_method: "credit_card",
      sub_total: subtotalExcludingVAT,
      tax: subtotalExcludingVAT * 0.055,
      tax_amount: subtotalExcludingVAT * 0.2,
      delivery_fee: 5.0,
      total: totalIncludingVAT,
      user_delivery_address_id: selectedAddress,
      products: filteredData.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
        price: item.unitPrice,
      })),
    };

    try {
      setOrderUploading(true);
      const response = await API.put(
        `/order/update-price/${orderId}`,
        orderData
      );

      if (response.status == 200) {
        message.success("Order Update Successfully");
        refetch();
      }
      setOrderUploading(false);
    } catch (error) {
      console.error(error);
      message.error("Something went wrong");
      setOrderUploading(false);
    }
  };

  if (isLoading) return <Spin size="large" className="block mx-auto my-10" />;
  if (isError)
    return (
      <div className="text-center text-red-500">
        {error.message || "Something went wrong"}
      </div>
    );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 my-4">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg p-8">
        <Title level={3} className="text-pink-500 text-center mb-6">
          Modifier la Commande
        </Title>
        <div className="hidden">
          <Text className="block mb-2 font-medium">Order number:</Text>
          <Input
            placeholder="Enter Your Order number"
            className="w-full h-12"
            defaultValue={singleOrder?.id}
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
            value={dayjs(`${deliveryDate} 00:00:00`, "YYYY-MM-DD HH:mm:ss")}
            showTime={{
              defaultValue: dayjs("00:00:00", "HH:mm:ss"),
            }}
          />
        </div>

        <h1 className="text-2xl font-semibold my-3">Customer</h1>
        <div>
          <Text className="block mb-2 font-medium">Select Customer</Text>

          <Select
            placeholder="Select a customer"
            className="w-full h-12"
            value={selectedCustomerName}
            onChange={(value) => setSelectedCustomer(value)}
          >
            {allCustomer.map((cust) => (
              <Option key={cust.id} value={cust.id}>
                {cust.name}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <Text className="block mb-2 font-medium">
            Select Delivery Address
          </Text>

          <Select
            placeholder="Select an address"
            className="w-full h-12"
            value={selectedAddressName || selectedAddress || undefined}
            onChange={(value) => {
              setSelectedAddress(value);
              const address = customerAddress.find((addr) => addr.id === value);
              setSelectedAddressName(address?.address || "");
            }}
          >
            {customerAddress.map((address) => (
              <Option key={address.id} value={address.id}>
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

        {/* <div className="my-3">
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
        </div> */}

        <div>
          <Text className="block">Sous-total hors TVA:</Text>
          <Input
            value={`${subtotalExcludingVAT.toFixed(2)} €`}
            readOnly
            className="py-3"
          />
        </div>
        <div className="mt-2">
          <Text className="block">Montant total de la taxe:</Text>
          <Input
            value={`${totalTaxAmount.toFixed(2)} €`}
            readOnly
            className="py-3"
          />
        </div>

        <div className="my-3">
          <Text className="block font-semibold">
            Le prix total inclut la TVA:
          </Text>
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

export default EditOrder;
