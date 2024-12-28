import { useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, message, Modal, Space, Table } from "antd";
import Highlighter from "react-highlight-words";
import { API, useAdminList } from "../../api/api";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link } from "react-router-dom";

const AdminList = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const { adminList, refetch } = useAdminList();

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
      ...getColumnSearchProps("first_name"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Role",
      dataIndex: "role_name",
      key: "role_name",
      ...getColumnSearchProps("role_name"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (text ? "Active" : "Inactive"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space className="flex justify-center">
          <Link to={`/admin-edit/${record.id}`}>
            <Button className="text-green-600 text-xl">
              <FaEdit />
            </Button>
          </Link>
          <Link>
            <Button onClick={() => handleDelete(record.id)} type="link" className="text-red-700 text-xl" danger>
              <RiDeleteBin6Line />
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      cancelText: "Cancel",
      okType: "danger",
      onOk: async () => {
        try {
          // API call to delete the user
          const res =  await API.delete(`/admins/delete/${id}`);
console.log(res)

          message.success("User deleted successfully!");
          refetch(); // Refresh the data
        } catch (error) {
          console.error("Error deleting user:", error);
          message.error("Failed to delete the user. Please try again.");
        }
      },
      onCancel: () => {
        console.log("Deletion cancelled.");
      },
    });
  };
  

  const data = adminList.map((admin) => ({
    id: admin.id,
    name: `${admin.first_name} ${admin.last_name}`,
    first_name: admin.first_name,
    email: admin.email,
    role_name: admin.role_name,
    status: admin.status || true, // Assuming a status field
  }));

  return (
    <div>
      <h1 className="font-semibold text-3xl text-center my-7">Admin List</h1>
      <Table
        columns={columns}
        dataSource={data}
        className="w-11/12 mx-auto"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default AdminList;
