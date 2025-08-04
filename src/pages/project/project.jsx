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
  Space,
  Tag,
  Progress,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import Navbar from "../../components/navbar/navbar";

const { Option } = Select;
const { confirm } = Modal;

const statusColor = {
  "Hoàn thành": "#52c41a",
  "Đang thực hiện": "#13c2c2",
  "Tạm dừng": "#faad14",
};

const statusOptions = ["Hoàn thành", "Đang thực hiện", "Tạm dừng"];

export default function Project() {
  const [projects, setProjects] = useState([]);
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
      start: moment(record.start),
      end: moment(record.end),
      progress: record.progress,
      status: record.status,
    });
    setEditModalVisible(true);
  };

  const handleDelete = (record) => {
    confirm({
      title: "Xác nhận xóa.",
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa dự án "${record.name}"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        setProjects(projects.filter((item) => item.key !== record.key));
        message.success("Đã xóa dự án thành công!");
      },
    });
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const newProject = {
        key: (projects.length + 1).toString(),
        name: values.name,
        start: values.start.format("YYYY-MM-DD"),
        end: values.end.format("YYYY-MM-DD"),
        progress: Number(values.progress),
        status: values.status,
      };
      setProjects([...projects, newProject]);
      setModalVisible(false);
      message.success("Thêm dự án thành công!");
    });
  };

  const handleEditOk = () => {
    editForm.validateFields().then((values) => {
      setProjects(
        projects.map((item) =>
          item.key === editingRecord.key
            ? {
                ...item,
                name: values.name,
                start: values.start.format("YYYY-MM-DD"),
                end: values.end.format("YYYY-MM-DD"),
                progress: Number(values.progress),
                status: values.status,
              }
            : item
        )
      );
      setEditModalVisible(false);
      setEditingRecord(null);
      message.success("Cập nhật dự án thành công!");
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
      title: "Tên dự án",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start",
      key: "start",
      width: 120,
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end",
      key: "end",
      width: 120,
    },
    {
      title: "Tiến độ",
      dataIndex: "progress",
      key: "progress",
      width: 150,
      render: (progress) => (
        <Progress
          percent={progress}
          size="small"
          strokeColor="#13c2c2"
          style={{ margin: 0 }}
        />
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
            Quản lý dự án
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
            Thêm dự án
          </Button>
        </div>

        {/* Bảng dữ liệu */}
        <div style={{ padding: "0 24px 24px 24px" }}>
          <Table
            columns={columns}
            dataSource={projects}
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
              emptyText: "Chưa có dự án nào",
            }}
          />
        </div>

        {/* Modal thêm dự án */}
        <Modal
          title="Thêm dự án mới"
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
              label="Tên dự án"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên dự án" }]}
            >
              <Input placeholder="Nhập tên dự án" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Ngày bắt đầu"
                  name="start"
                  rules={[{ required: true, message: "Chọn ngày bắt đầu" }]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    placeholder="Chọn ngày bắt đầu"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Ngày kết thúc"
                  name="end"
                  rules={[{ required: true, message: "Chọn ngày kết thúc" }]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    placeholder="Chọn ngày kết thúc"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Tiến độ (%)"
                  name="progress"
                  rules={[{ required: true, message: "Nhập tiến độ dự án" }]}
                >
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    placeholder="0-100"
                    addonAfter="%"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Trạng thái"
                  name="status"
                  rules={[{ required: true, message: "Chọn trạng thái" }]}
                >
                  <Select placeholder="Chọn trạng thái">
                    {statusOptions.map((status) => (
                      <Option key={status} value={status}>
                        <Tag color={statusColor[status]}>{status}</Tag>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>

        {/* Modal sửa dự án */}
        <Modal
          title="Sửa thông tin dự án"
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
              label="Tên dự án"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên dự án" }]}
            >
              <Input placeholder="Nhập tên dự án" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Ngày bắt đầu"
                  name="start"
                  rules={[{ required: true, message: "Chọn ngày bắt đầu" }]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    placeholder="Chọn ngày bắt đầu"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Ngày kết thúc"
                  name="end"
                  rules={[{ required: true, message: "Chọn ngày kết thúc" }]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    placeholder="Chọn ngày kết thúc"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Tiến độ (%)"
                  name="progress"
                  rules={[{ required: true, message: "Nhập tiến độ dự án" }]}
                >
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    placeholder="0-100"
                    addonAfter="%"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Trạng thái"
                  name="status"
                  rules={[{ required: true, message: "Chọn trạng thái" }]}
                >
                  <Select placeholder="Chọn trạng thái">
                    {statusOptions.map((status) => (
                      <Option key={status} value={status}>
                        <Tag color={statusColor[status]}>{status}</Tag>
                      </Option>
                    ))}
                  </Select>
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
}
