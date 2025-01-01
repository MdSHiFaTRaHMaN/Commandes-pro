import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Input,
  Select,
  Typography,
  Table,
  Button,
  Form,
  DatePicker,
} from "antd";
const { Title, Text } = Typography;
const { Option } = Select;
import dayjs from "dayjs";
import { useAllCustomers } from "../api/api";

function Test2() {
  const { allCustomer } = useAllCustomers();
  const { control, handleSubmit, setError, clearErrors } = useForm();

  const onSubmit = (data) => {
    console.log("Submitted Data:", data);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Select",
      dataIndex: "select",
      key: "select",
      render: (_, record) => (
        <Form.Item
          style={{ margin: 0 }}
          validateStatus={record.error ? "error" : ""}
          help={record.error}
        >
          <Controller
            name={`tableSelect-${record.key}`}
            control={control}
            defaultValue=""
            rules={{ required: "This field is required" }}
            render={({ field, fieldState }) => (
              <Select
                {...field}
                style={{ width: 120 }}
                onChange={(value) => {
                  field.onChange(value);
                  clearErrors(`tableSelect-${record.key}`);
                }}
                onBlur={() => {
                  if (!field.value) {
                    setError(`tableSelect-${record.key}`, {
                      type: "required",
                      message: "This field is required",
                    });
                  }
                }}
              >
                <Option value="">Select</Option>
                <Option value="option1">Option 1</Option>
                <Option value="option2">Option 2</Option>
              </Select>
            )}
          />
        </Form.Item>
      ),
    },
  ];

  const dataSource = [
    { key: "1", name: "John Brown" },
    { key: "2", name: "Jane Smith" },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 my-4">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg p-8">
        <Title
          level={3}
          className="text-pink-500 text-2xl font-bold mb-6 text-center"
        >
          Add an Order
        </Title>

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {/* delivery date */}
          <Controller
            name="datePickerField"
            control={control}
            defaultValue={null}
            rules={{ required: "This field is required" }}
            render={({ field, fieldState }) => (
              <Form.Item
                label="Delivery Date"
                validateStatus={fieldState.error ? "error" : ""}
                help={fieldState.error?.message}
              >
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  className="w-full h-12"
                  {...field}
                  onChange={(date) => field.onChange(date)}
                  showTime={{
                    defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                  }}
                />
              </Form.Item>
            )}
          />

          <Controller
            name="selectField"
            control={control}
            defaultValue=""
            rules={{ required: "This field is required" }}
            render={({ field, fieldState }) => (
              <Form.Item
                label="Select Customer"
                validateStatus={fieldState.error ? "error" : ""}
                help={fieldState.error?.message}
              >
                <Select showSearch {...field} style={{ width: 200 }}>
                  <Option value="">Select</Option>
                  {allCustomer.map((customer) => (
                    <Option key={customer.id} value={customer.id}>
                      {customer.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          />

          <Controller
            name="inputField"
            control={control}
            defaultValue=""
            rules={{ required: "This field is required" }}
            render={({ field, fieldState }) => (
              <Form.Item
                label="Input Field"
                validateStatus={fieldState.error ? "error" : ""}
                help={fieldState.error?.message}
              >
                <Input {...field} />
              </Form.Item>
            )}
          />

          <Table
            dataSource={dataSource.map((item) => ({
              ...item,
              error: control.getFieldState(`tableSelect-${item.key}`)?.error
                ?.message,
            }))}
            columns={columns}
            pagination={false}
            rowKey="key"
            style={{ marginBottom: "20px" }}
          />

          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Test2;
