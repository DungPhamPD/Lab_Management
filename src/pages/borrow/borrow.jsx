import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Card,
  Row,
  Col,
  Statistic,
  Space,
  Tag,
  message,
} from "antd";
import {
  PlusOutlined,
  UserOutlined,
  LaptopOutlined,
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import Navbar from "../../components/navbar/navbar";
import { Navigate } from "react-router-dom";

const { Option } = Select;
const { confirm } = Modal;

const initialData = [
  {
    key: "1",
    borrower: "Nguyễn Văn A",
    status: "Đã trả",
    borrowDate: "2025-06-03",
    returnDate: "2025-08-06",
    device: "PC-01",
  },
  {
    key: "2",
    borrower: "Trần Thị B",
    status: "Đang mượn",
    borrowDate: "2025-06-03",
    returnDate: "2025-06-03",
    device: "Printer-01",
  },
  {
    key: "3",
    borrower: "Lê Văn C",
    status: "Đã trả",
    borrowDate: "2025-05-01",
    returnDate: "2025-06-03",
    device: "PC-02",
  },
  {
    key: "4",
    borrower: "Phạm Thị D",
    status: "Đang mượn",
    borrowDate: "2025-04-10",
    returnDate: "2025-06-03",
    device: "Projector-01",
  },
  {
    key: "5",
    borrower: "Ngô Văn E",
    status: "Đã trả",
    borrowDate: "2025-03-01",
    returnDate: "2025-06-03",
    device: "PC-03",
  },
  {
    key: "6",
    borrower: "Vũ Thị F",
    status: "Đang mượn",
    borrowDate: "2025-02-15",
    returnDate: "2025-08-06",
    device: "Laptop-01",
  },
  {
    key: "7",
    borrower: "Đặng Văn G",
    status: "Đã trả",
    borrowDate: "2025-05-01",
    returnDate: "2025-08-06",
    device: "Tablet-01",
  },
  {
    key: "8",
    borrower: "Phan Thị H",
    status: "Đang mượn",
    borrowDate: "2025-03-15",
    returnDate: "2025-08-06",
    device: "Camera-01",
  },
  {
    key: "9",
    borrower: "Bùi Văn I",
    status: "Đã trả",
    borrowDate: "2025-02-01",
    returnDate: "2025-08-06",
    device: "Router-01",
  },
];

const statusOptions = ["Đang mượn", "Đã trả"];

const deviceOptions = [
  "PC-01",
  "PC-02",
  "PC-03",
  "Laptop-01",
  "Printer-01",
  "Projector-01",
  "Tablet-01",
  "Camera-01",
  "Router-01",
];

const BorrowPage = ({ isAdmin = true, currentUser = "Nguyễn Văn A" }) => {
  const [data, setData] = useState(initialData);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [filterStatus, setFilterStatus] = useState("");
  const [filterBorrower, setFilterBorrower] = useState("");
  const [editingRecord, setEditingRecord] = useState(null);

  // Lọc dữ liệu theo quyền
  const filteredData = data.filter((item) => {
    let match = true;
    if (!isAdmin && item.borrower !== currentUser) match = false;
    if (filterStatus && item.status !== filterStatus) match = false;
    if (isAdmin && filterBorrower && item.borrower !== filterBorrower)
      match = false;
    return match;
  });

  // Lấy danh sách người mượn để lọc
  const borrowerList = [...new Set(data.map((item) => item.borrower))];

  // Thống kê
  const totalBorrowing = data.filter(
    (item) => item.status === "Đang mượn"
  ).length;
  const totalReturned = data.filter((item) => item.status === "Đã trả").length;
  const totalDevices = [...new Set(data.map((item) => item.device))].length;
  const totalBorrowers = borrowerList.length;

  // Xử lý sửa
  const handleEdit = (record) => {
    setEditingRecord(record);
    editForm.setFieldsValue({
      borrower: record.borrower,
      device: record.device,
      status: record.status,
      borrowDate: moment(record.borrowDate),
      returnDate: record.returnDate ? moment(record.returnDate) : null,
    });
    setEditModalVisible(true);
  };

  // Xử lý xóa
  const handleDelete = (record) => {
    confirm({
      title: "Xác nhận xóa",
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa thông tin mượn thiết bị "${record.device}" của "${record.borrower}"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        setData(data.filter((item) => item.key !== record.key));
        message.success("Đã xóa thành công!");
      },
    });
  };

  const columns = [
    {
      title: "Người mượn",
      dataIndex: "borrower",
      key: "borrower",
      width: 150,
    },
    {
      title: "Tên thiết bị",
      dataIndex: "device",
      key: "device",
      width: 120,
    },
    {
      title: "Ngày mượn",
      dataIndex: "borrowDate",
      key: "borrowDate",
      width: 120,
    },
    {
      title: "Ngày trả",
      dataIndex: "returnDate",
      key: "returnDate",
      width: 120,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag
          color={status === "Đang mượn" ? "#13c2c2" : "#52c41a"}
          style={{
            borderRadius: "12px",
            padding: "4px 12px",
            fontWeight: "500",
            border: "none",
          }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            style={{ color: "#1890ff" }}
            onClick={() => handleEdit(record)}
            title="Sửa"
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            style={{ color: "#ff4d4f" }}
            onClick={() => handleDelete(record)}
            title="Xóa"
          />
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      setData([
        ...data,
        {
          key: (data.length + 1).toString(),
          borrower: values.borrower,
          status: values.status,
          borrowDate: values.borrowDate.format("YYYY-MM-DD"),
          returnDate: values.returnDate
            ? values.returnDate.format("YYYY-MM-DD")
            : "",
          device: values.device,
        },
      ]);
      setModalVisible(false);
      message.success("Thêm thông tin mượn thiết bị thành công!");
    });
  };

  const handleEditOk = () => {
    editForm.validateFields().then((values) => {
      setData(
        data.map((item) =>
          item.key === editingRecord.key
            ? {
                ...item,
                borrower: values.borrower,
                status: values.status,
                borrowDate: values.borrowDate.format("YYYY-MM-DD"),
                returnDate: values.returnDate
                  ? values.returnDate.format("YYYY-MM-DD")
                  : "",
                device: values.device,
              }
            : item
        )
      );
      setEditModalVisible(false);
      setEditingRecord(null);
      message.success("Cập nhật thông tin thành công!");
    });
  };

  return (
    <div
      style={{
        padding: "24px",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      {/* Card chính */}
      <Card
        style={{
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          border: "1px solid #d9d9d9",
          marginTop: 16,
        }}
        bodyStyle={{ padding: 0 }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: "600",
              color: "#262626",
            }}
          >
            Quản lý mượn thiết bị
          </h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            style={{
              borderRadius: 6,
              height: 32,
              fontSize: "14px",
              background: "#13c2c2",
              borderColor: "#13c2c2",
            }}
          >
            Mượn thiết bị
          </Button>
        </div>

        {/* Bảng dữ liệu */}
        <div style={{ padding: "0 24px 24px 24px" }}>
          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              showQuickJumper: false,
              showTotal: (total, range) =>
                `Trang ${Math.ceil(range[0] / 10)}/${Math.ceil(total / 10)}`,
              style: { textAlign: "center", marginTop: 16 },
            }}
            bordered={false}
            size="middle"
            style={{
              marginTop: 16,
            }}
            rowClassName={() => "custom-row"}
          />
        </div>

        {/* Modal thêm thông tin */}
        <Modal
          title="Thêm thông tin mượn thiết bị"
          open={modalVisible}
          onOk={handleOk}
          onCancel={() => setModalVisible(false)}
          okText="Lưu"
          cancelText="Hủy"
          width={600}
          okButtonProps={{
            style: {
              background: "#13c2c2",
              borderColor: "#13c2c2",
            },
          }}
        >
          <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
            <Form.Item
              label="Tên người mượn"
              name="borrower"
              rules={[
                { required: true, message: "Vui lòng nhập tên người mượn" },
              ]}
            >
              <Input placeholder="Nhập tên người mượn" />
            </Form.Item>

            <Form.Item
              label="Tên thiết bị"
              name="device"
              rules={[{ required: true, message: "Vui lòng chọn thiết bị" }]}
            >
              <Select placeholder="Chọn thiết bị" showSearch>
                {deviceOptions.map((device) => (
                  <Option key={device} value={device}>
                    {device}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: "Chọn trạng thái" }]}
            >
              <Select placeholder="Chọn trạng thái">
                {statusOptions.map((status) => (
                  <Option key={status} value={status}>
                    <Tag color={status === "Đang mượn" ? "#13c2c2" : "#52c41a"}>
                      {status}
                    </Tag>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Ngày mượn"
                  name="borrowDate"
                  rules={[{ required: true, message: "Chọn ngày mượn" }]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    placeholder="Chọn ngày mượn"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Ngày trả" name="returnDate">
                  <DatePicker
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    placeholder="Chọn ngày trả (tùy chọn)"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>

        {/* Modal sửa thông tin */}
        <Modal
          title="Sửa thông tin mượn thiết bị"
          open={editModalVisible}
          onOk={handleEditOk}
          onCancel={() => {
            setEditModalVisible(false);
            setEditingRecord(null);
          }}
          okText="Cập nhật"
          cancelText="Hủy"
          width={600}
          okButtonProps={{
            style: {
              background: "#1890ff",
              borderColor: "#1890ff",
            },
          }}
        >
          <Form form={editForm} layout="vertical" style={{ marginTop: 16 }}>
            <Form.Item
              label="Tên người mượn"
              name="borrower"
              rules={[
                { required: true, message: "Vui lòng nhập tên người mượn" },
              ]}
            >
              <Input placeholder="Nhập tên người mượn" />
            </Form.Item>

            <Form.Item
              label="Tên thiết bị"
              name="device"
              rules={[{ required: true, message: "Vui lòng chọn thiết bị" }]}
            >
              <Select placeholder="Chọn thiết bị" showSearch>
                {deviceOptions.map((device) => (
                  <Option key={device} value={device}>
                    {device}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: "Chọn trạng thái" }]}
            >
              <Select placeholder="Chọn trạng thái">
                {statusOptions.map((status) => (
                  <Option key={status} value={status}>
                    <Tag color={status === "Đang mượn" ? "#13c2c2" : "#52c41a"}>
                      {status}
                    </Tag>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Ngày mượn"
                  name="borrowDate"
                  rules={[{ required: true, message: "Chọn ngày mượn" }]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    placeholder="Chọn ngày mượn"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Ngày trả" name="returnDate">
                  <DatePicker
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    placeholder="Chọn ngày trả (tùy chọn)"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Card>

      <style jsx>{`
        .custom-row {
          border-bottom: 1px solid #f0f0f0;
        }
        .custom-row:hover {
          background-color: #fafafa;
        }
        .ant-table-thead > tr > th {
          background-color: #fafafa;
          border-bottom: 1px solid #f0f0f0;
          font-weight: 600;
          color: #262626;
        }
        .ant-pagination-item-active {
          border-color: #13c2c2;
          background-color: #13c2c2;
        }
        .ant-pagination-item-active a {
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default BorrowPage;
