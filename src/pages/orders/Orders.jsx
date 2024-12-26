import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Spin,
  Table,
  message,
} from "antd";
import dayjs from "dayjs";
const dateFormat = "YYYY-MM-DD";
import { FaEdit, FaPlus } from "react-icons/fa";
import { IoPrint } from "react-icons/io5";
import "./Orders.css";
import { API, useAllOrders } from "../../api/api";
import { Link, useNavigate } from "react-router-dom";
import MultiOrderInvoice from "./MultiOrderInvoice";
const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingInlineEnd: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};
const Orders = () => {
  const { order, pagination, isLoading, isError, error, refetch } =
    useAllOrders();

  const dataSource = order.map((item) => ({
    ...item,
    key: item.id,
  }));

  const handleStatusChange = async (id, value) => {
    try {
      const response = await API.put(`/order/status/update/${id}`, {
        order_status: value,
      });

      if (response.status == 200) {
        message.success("Order status updated successfully");
        refetch(); // Refresh order details after update
      } else {
        message.error("Failed to update order status");
      }
    } catch (error) {
      message.error(`Error updating status ${error.message}`);
    }
  };

  const handlePrint = (value) => {
    console.log("handlePrint", value);
  };

  const onDateChange = async (id, date, dateString) => {
    try {
      const response = await API.put(`/order/update-price/${id}`, {
        delivery_date: dateString,
      });

      console.log(response, "reso");

      if (response.status == 200) {
        message.success("Order status updated successfully");
        refetch(); // Refresh order details after update
      } else {
        message.error("Failed to update order status");
      }
    } catch (error) {
      console.log(error, "mess");
      message.error(`Error updating status ${error.message}`);
    }
  };

  const defaultColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "DATE ET HEURE DE LIVRAISON",
      dataIndex: "delivery_date",
      render: (_, record) => (
        <div>
          <DatePicker
            defaultValue={dayjs(record.delivery_date, dateFormat)}
            format={dateFormat}
            onChange={(date, dateString) =>
              onDateChange(record.id, date, dateString)
            }
          />
        </div>
      ),
    },
    {
      title: "CLIENT",
      dataIndex: "company",
      editable: true,
    },
    {
      title: "STATUT",
      dataIndex: "order_status",
      key: "order_status",
      width: "15%",
      render: (_, record) => (
        <Select
          value={record?.order_status}
          onChange={(value) => handleStatusChange(record.id, value)}
          style={{ width: 200 }}
          options={[
            { value: "Reçue en Attente", label: "Reçue en Attente" },
            { value: "En Préparation", label: "En Préparation" },
            { value: "Prête pour Dispatch", label: "Prête pour Dispatch" },
            { value: "En cours de Livraison", label: "En cours de Livraison" },
            { value: "Livré", label: "Livré" },
            { value: "À régler", label: "À régler" },
            { value: "Terminé", label: "Terminé" },
            { value: "Annulé", label: "Annulé" },
          ]}
        />
      ),
    },
    {
      title: "DATE DE COMMANDE",
      dataIndex: "created_at",
      key: "created_at",
      render: (_, record) => (
        <p>{new Date(record.created_at).toLocaleDateString()}</p>
      ),
    },
    {
      title: "TOTAL TTC",
      dataIndex: "total",
      render: (_, record) => `${record.total} €`,
      editable: true,
    },
    {
      title: "ACTIONS",
      dataIndex: "operation",

      render: (_, record) => (
        <div className="flex gap-3 text-xl">
        <Link to={`/order-invoice/${record.id}`}>
            <IoPrint
              className="cursor-pointer"
              onClick={() => handlePrint(record)}
            />
          </Link>
     
<Link to={`/orders/edit/${record.id}`}>
            <FaEdit className="cursor-pointer" />
          </Link>
        </div>
      ),
    },
  ];

  const handleSave = async (row) => {
    const id = row?.id;
    try {
      const response = await API.put(`/order/update-price/${id}`, row);
      if (response.status === 200) {
        message.success(`${row.company} updated successfully!`);
      }

      refetch();
    } catch (error) {
      message.error(`Failed to add ${row.company}. Try again.`);
      console.log("error", error);
    }
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState();

  const onSelectedData = (value) => {
    setLoading(true);
    setInvoice(value);
    console.log("hello Data", value);

    setLoading(false);
  };
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  if (isLoading) return <Spin size="large" className="block mx-auto my-10" />;
  if (isError)
    return (
      <div className="text-center text-red-500">
        {error.message || "Something went wrong"}
      </div>
    );

  return (
    <div className="mx-32 my-5 border-shadow">
      <div className="flex justify-between mx-6 mb-5">
        <div className="text-3xl font-bold text-[#e24c80]">
          Liste des commandes
        </div>
        <Link to="/add-order">
          <button className="bg-PrimaryColor p-3 text-white rounded flex items-center gap-1">
            <FaPlus /> Add Order
          </button>
        </Link>
      </div>

      <div className="mx-6">
        <Table
          rowSelection={rowSelection}
          components={components}
          rowClassName={() => "editable-row"}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
        <div className="text-center mt-[-40px]">
          {console.log("invoice", invoice)}
          <Link to="/multi-invoice">
            <Button
              onClick={() => onSelectedData(selectedRowKeys)}
              loading={loading}
              disabled={!hasSelected}
              type="primary"
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#f54080")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#e24c80")}
              className="bg-[#e24c80] text-white font-semibold hover:bg-[#f83f80] py-6 px-6"
            >
              Bon de Préparation
            </Button>
          </Link>
        </div>
      </div>
      <div className="hidden">
        <MultiOrderInvoice multiOrder={invoice} />
      </div>
    </div>
  );
};
export default Orders;
