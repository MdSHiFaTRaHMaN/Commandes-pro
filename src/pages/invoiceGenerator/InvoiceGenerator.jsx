import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, DatePicker, message, Select } from "antd";
import { API, useAllCustomers, useAllOrders } from "../../api/api";
import OrderList from "./OrderList";

const { RangePicker } = DatePicker;

function InvoiceGenerator() {
  const [orderQuery, setOrderQuery] = useState({
    order_status: "",
    fromDate: "",
    toDate: "",
    user_id: 0,
  });
  const { allCustomer } = useAllCustomers();
  const { order, isLoading, isError, error, refetch } =
    useAllOrders(orderQuery);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const formData = {
      order_status: data.invoiceStatus,
      fromDate: data.dateRange[0],
      toDate: data.dateRange[1],
      user_id: data.client,
    };
    setOrderQuery(formData);
  };

  return (
    <div>
      <h2 className="text-4xl text-center my-5 font-semibold text-PrimaryColor">
        Générateur de Factures
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex mx-24 ">
        <div>
          <h5>Dates de début et de fin</h5>
          <Controller
            name="dateRange"
            control={control}
            rules={{ required: "Please select a date range" }}
            render={({ field }) => (
              <RangePicker
                onChange={(dates, dateStrings) => {
                  field.onChange(dateStrings);
                }}
              />
            )}
          />
          {errors.dateRange && (
            <p className="text-red-500">{errors.dateRange.message}</p>
          )}
        </div>

        <div className="mx-5">
          <h5>Client</h5>
          <Controller
            name="client"
            control={control}
            rules={{ required: "Please select a client" }}
            render={({ field }) => (
              <Select
                {...field}
                showSearch
                className="w-[200px]"
                placeholder="Select a client"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={allCustomer.map((customer) => ({
                  value: customer.id,
                  label: customer.name,
                }))}
              />
            )}
          />
          {errors.client && (
            <p className="text-red-500">{errors.client.message}</p>
          )}
        </div>

        <div className="me-5">
          <h5>Statut de la facture</h5>
          <Controller
            name="invoiceStatus"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                style={{ width: 200 }}
                placeholder="Sélectionner un statut"
                options={[
                  { value: "Reçue en Attente", label: "Reçue en Attente" },
                  { value: "En Préparation", label: "En Préparation" },
                  {
                    value: "Prête pour Dispatch",
                    label: "Prête pour Dispatch",
                  },
                  {
                    value: "En cours de Livraison",
                    label: "En cours de Livraison",
                  },
                  { value: "Livré", label: "Livré" },
                  { value: "À régler", label: "À régler" },
                  { value: "Terminé", label: "Terminé" },
                  { value: "Annulé", label: "Annulé" },
                ]}
              />
            )}
          />
        </div>

        <Button
          type="primary"
          htmlType="submit"
          className="mt-3 p-5 bg-PrimaryColor text-white font-semibold"
        >
          Générer une facture
        </Button>
      </form>

      <div>
        <OrderList order={order} refetch={refetch} />
      </div>
    </div>
  );
}

export default InvoiceGenerator;
