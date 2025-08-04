import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Card,
  Row,
  Col,
  Space,
  Tag,
  message,
  Avatar,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import Navbar from "../../components/navbar/navbar";

const { Option } = Select;
const { confirm } = Modal;

const roleColor = {
  Admin: "#ff4d4f",
  "Quản lý": "#faad14",
  "Nhân viên": "#13c2c2",
  "Thực tập sinh": "#52c41a",
};

const statusColor = {
  "Hoạt động": "#52c41a",
  "Tạm dừng": "#faad14",
  "Ngừng hoạt động": "#ff4d4f",
};

const roleOptions = ["Admin", "Quản lý", "Nhân viên", "Thực tập sinh"];
const statusOptions = ["Hoạt động", "Tạm dừng", "Ngừng hoạt động"];

// Dữ liệu mẫu
const initialUsers = [
  {
    key: "1",
    name: "Nguyễn Văn A",
    email: "nguyenvana@company.com",
    phone: "0901234567",
    role: "Admin",
    status: "Hoạt động",
    department: "IT",
  },
  {
    key: "2",
    name: "Trần Thị B",
    email: "tranthib@company.com",
    phone: "0912345678",
    role: "Quản lý",
    status: "Hoạt động",
    department: "Nhân sự",
  },
  {
    key: "3",
    name: "Lê Văn C",
    email: "levanc@company.com",
    phone: "0923456789",
    role: "Nhân viên",
    status: "Tạm dừng",
    department: "Kế toán",
  },
];

export default function Users() {
  const [users, setUsers] = useState(initialUsers);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState(null);

  const handleAdd = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    editForm.setFieldsValue({
      name: record.name,
      email: record.email,
      phone: record.phone,
      role: record.role,
      status: record.status,
      department: record.department,
    });
    setEditModalVisible(true);
  };

  const handleDelete = (record) => {
    confirm({
      title: "Xác nhận xóa",
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa người dùng "${record.name}"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        setUsers(users.filter((item) => item.key !== record.key));
        message.success("Đã xóa người dùng thành công!");
      },
    });
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const newUser = {
        key: (users.length + 1).toString(),
        name: values.name,
        email: values.email,
        phone: values.phone,
        role: values.role,
        status: values.status,
        department: values.department,
      };
      setUsers([...users, newUser]);
      setModalVisible(false);
      message.success("Thêm người dùng thành công!");
    });
  };

  const handleEditOk = () => {
    editForm.validateFields().then((values) => {
      setUsers(
        users.map((item) =>
          item.key === editingRecord.key
            ? {
                ...item,
                name: values.name,
                email: values.email,
                phone: values.phone,
                role: values.role,
                status: values.status,
                department: values.department,
              }
            : item
        )
      );
      setEditModalVisible(false);
      setEditingRecord(null);
      message.success("Cập nhật thông tin người dùng thành công!");
    });
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Người dùng",
      key: "user",
      width: 200,
      render: (_, record) => (
        <Space>
          <Avatar
            icon={<UserOutlined />}
            style={{ backgroundColor: "#13c2c2" }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
              {record.department}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      render: (email) => (
        <Space>
          <MailOutlined style={{ color: "#8c8c8c" }} />
          {email}
        </Space>
      ),
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 120,
      render: (phone) => (
        <Space>
          <PhoneOutlined style={{ color: "#8c8c8c" }} />
          {phone}
        </Space>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (role) => (
        <Tag
          color={roleColor[role]}
          style={{
            borderRadius: "12px",
            padding: "4px 12px",
            fontWeight: "500",
            border: "none",
          }}
        >
          {role}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag
          color={statusColor[status]}
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
            Quản lý người dùng
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
            Thêm người dùng
          </Button>
        </div>

        {/* Bảng dữ liệu */}
        <div style={{ padding: "0 24px 24px 24px" }}>
          <Table
            columns={columns}
            dataSource={users}
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
            locale={{
              emptyText: "Chưa có người dùng nào",
            }}
          />
        </div>

        {/* Modal thêm người dùng */}
        <Modal
          title="Thêm người dùng mới"
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
              label="Họ và tên"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
            >
              <Input placeholder="Nhập họ và tên" prefix={<UserOutlined />} />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email" },
                    { type: "email", message: "Email không hợp lệ" },
                  ]}
                >
                  <Input placeholder="Nhập email" prefix={<MailOutlined />} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                  ]}
                >
                  <Input
                    placeholder="Nhập số điện thoại"
                    prefix={<PhoneOutlined />}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Phòng ban"
                  name="department"
                  rules={[
                    { required: true, message: "Vui lòng nhập phòng ban" },
                  ]}
                >
                  <Input placeholder="Nhập phòng ban" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Vai trò"
                  name="role"
                  rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
                >
                  <Select placeholder="Chọn vai trò">
                    {roleOptions.map((role) => (
                      <Option key={role} value={role}>
                        <Tag color={roleColor[role]}>{role}</Tag>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select placeholder="Chọn trạng thái">
                {statusOptions.map((status) => (
                  <Option key={status} value={status}>
                    <Tag color={statusColor[status]}>{status}</Tag>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal sửa người dùng */}
        <Modal
          title="Sửa thông tin người dùng"
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
              label="Họ và tên"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
            >
              <Input placeholder="Nhập họ và tên" prefix={<UserOutlined />} />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email" },
                    { type: "email", message: "Email không hợp lệ" },
                  ]}
                >
                  <Input placeholder="Nhập email" prefix={<MailOutlined />} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                  ]}
                >
                  <Input
                    placeholder="Nhập số điện thoại"
                    prefix={<PhoneOutlined />}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Phòng ban"
                  name="department"
                  rules={[
                    { required: true, message: "Vui lòng nhập phòng ban" },
                  ]}
                >
                  <Input placeholder="Nhập phòng ban" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Vai trò"
                  name="role"
                  rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
                >
                  <Select placeholder="Chọn vai trò">
                    {roleOptions.map((role) => (
                      <Option key={role} value={role}>
                        <Tag color={roleColor[role]}>{role}</Tag>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select placeholder="Chọn trạng thái">
                {statusOptions.map((status) => (
                  <Option key={status} value={status}>
                    <Tag color={statusColor[status]}>{status}</Tag>
                  </Option>
                ))}
              </Select>
            </Form.Item>
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
}
