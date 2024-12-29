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
// import "./Orders.css";
import { API } from "../../api/api";
import { Link, useNavigate } from "react-router-dom";

const OrderList = ({ order, refetch }) => {
  const navigate = useNavigate();
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

      if (response.status == 200) {
        message.success("Order status updated successfully");
      } else {
        message.error("Failed to update order status");
      }
      refetch();
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
      render: (_, record) => `${record.total.toFixed(2)} €`,
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

  const onSelectedData = async (value) => {
    const query = new URLSearchParams({
      data: JSON.stringify(value),
    }).toString();
    navigate(`/multi-invoice?${query}`);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div className="mx-24 my-10 border-shadow">
      <Table
        rowSelection={rowSelection}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns}
      />
      <div className="text-center mt-[-40px]">
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
      </div>
    </div>
  );
};
export default OrderList;
