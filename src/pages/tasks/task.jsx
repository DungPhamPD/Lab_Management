import React, { useState, useEffect } from "react";
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
  Upload,
  Slider,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
  BarChartOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import moment from "moment";
import Navbar from "../../components/navbar/navbar";

const { Option } = Select;
const { confirm } = Modal;
const { TextArea } = Input;

const statusColor = {
  "ĐANG THỰC HIỆN": "#13c2c2",
  "ĐANG KIỂM TRA": "#faad14",
  "HOÀN THÀNH": "#52c41a",
};

const priorityColor = {
  Cao: "#ff4d4f",
  "Trung bình": "#faad14",
  Thấp: "#52c41a",
};

const statusOptions = ["ĐANG THỰC HIỆN", "ĐANG KIỂM TRA", "HOÀN THÀNH"];
const priorityOptions = ["Cao", "Trung bình", "Thấp"];
const assigneeOptions = ["Trường", "Kiên", "Dũng", "Huy"];

// Dữ liệu mẫu
const initialTasks = [
  {
    key: "1",
    name: "Phát triển module quản lý người dùng",
    description: "Tạo giao diện và API cho việc quản lý thông tin người dùng",
    assignee: "Trường",
    assigneeName: "Nguyễn Văn Trường",
    startDate: "2025-01-01",
    deadline: "2025-01-15",
    priority: "Cao",
    status: "ĐANG THỰC HIỆN",
    progress: 65,
    note: "Đã hoàn thành giao diện, đang làm API",
    attachments: ["design.pdf", "requirements.docx"],
  },
  {
    key: "2",
    name: "Thiết kế database cho hệ thống",
    description: "Thiết kế schema và relationships cho toàn bộ hệ thống",
    assignee: "Kiên",
    assigneeName: "Trần Văn Kiên",
    startDate: "2024-12-20",
    deadline: "2025-01-10",
    priority: "Cao",
    status: "HOÀN THÀNH",
    progress: 100,
    note: "Đã hoàn thành và deploy",
    attachments: ["database_schema.sql"],
  },
];

export default function Task() {
  const [tasks, setTasks] = useState(initialTasks);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [progressModalVisible, setProgressModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [progressForm] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState(null);
  const [progressRecord, setProgressRecord] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterAssignee, setFilterAssignee] = useState("");

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    if (storedTasks.length > 0) {
      setTasks(storedTasks);
    }
  }, []);

  const saveToStorage = (newTasks) => {
    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  };

  const handleAdd = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    editForm.setFieldsValue({
      name: record.name,
      description: record.description,
      assignee: record.assignee,
      assigneeName: record.assigneeName,
      startDate: record.startDate ? moment(record.startDate) : null,
      deadline: moment(record.deadline),
      priority: record.priority,
    });
    setEditModalVisible(true);
  };

  const handleProgress = (record) => {
    setProgressRecord(record);
    progressForm.setFieldsValue({
      status: record.status,
      progress: record.progress,
      note: record.note || "",
    });
    setProgressModalVisible(true);
  };

  const handleDelete = (record) => {
    confirm({
      title: "Xác nhận xóa",
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa nhiệm vụ "${record.name}"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        const newTasks = tasks.filter((item) => item.key !== record.key);
        saveToStorage(newTasks);
        message.success("Đã xóa nhiệm vụ thành công!");
      },
    });
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const newTask = {
        key: (tasks.length + 1).toString(),
        name: values.name,
        description: values.description || "",
        assignee: values.assignee,
        assigneeName: values.assigneeName || "",
        startDate: values.startDate
          ? values.startDate.format("YYYY-MM-DD")
          : "",
        deadline: values.deadline.format("YYYY-MM-DD"),
        priority: values.priority,
        status: "ĐANG THỰC HIỆN",
        progress: 0,
        note: "",
        attachments: [],
      };
      const newTasks = [newTask, ...tasks];
      saveToStorage(newTasks);
      setModalVisible(false);
      message.success("Thêm nhiệm vụ thành công!");
    });
  };

  const handleEditOk = () => {
    editForm.validateFields().then((values) => {
      const newTasks = tasks.map((item) =>
        item.key === editingRecord.key
          ? {
              ...item,
              name: values.name,
              description: values.description || "",
              assignee: values.assignee,
              assigneeName: values.assigneeName || "",
              startDate: values.startDate
                ? values.startDate.format("YYYY-MM-DD")
                : "",
              deadline: values.deadline.format("YYYY-MM-DD"),
              priority: values.priority,
            }
          : item
      );
      saveToStorage(newTasks);
      setEditModalVisible(false);
      setEditingRecord(null);
      message.success("Cập nhật nhiệm vụ thành công!");
    });
  };

  const handleProgressOk = () => {
    progressForm.validateFields().then((values) => {
      const newTasks = tasks.map((item) =>
        item.key === progressRecord.key
          ? {
              ...item,
              status: values.status,
              progress: values.progress,
              note: values.note || "",
            }
          : item
      );
      saveToStorage(newTasks);
      setProgressModalVisible(false);
      setProgressRecord(null);
      message.success("Cập nhật tiến độ thành công!");
    });
  };

  // Lọc dữ liệu
  const filteredData = tasks.filter((item) => {
    let match = true;
    if (filterStatus && item.status !== filterStatus) match = false;
    if (filterAssignee && item.assignee !== filterAssignee) match = false;
    return match;
  });

  const getProgressColor = (progress) => {
    if (progress <= 40) return "#ff4d4f";
    if (progress <= 80) return "#faad14";
    return "#52c41a";
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên nhiệm vụ",
      dataIndex: "name",
      key: "name",
      width: 250,
      render: (name, record) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{name}</div>
          <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
            {record.description?.substring(0, 50)}...
          </div>
        </div>
      ),
    },
    {
      title: "Người phụ trách",
      key: "assignee",
      width: 150,
      render: (_, record) => (
        <Space>
          <UserOutlined style={{ color: "#8c8c8c" }} />
          <div>
            <div style={{ fontWeight: 500 }}>{record.assignee}</div>
            {record.assigneeName && (
              <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                {record.assigneeName}
              </div>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      width: 120,
      render: (deadline) => (
        <Space>
          <CalendarOutlined style={{ color: "#8c8c8c" }} />
          {deadline}
        </Space>
      ),
    },
    {
      title: "Độ ưu tiên",
      dataIndex: "priority",
      key: "priority",
      width: 120,
      render: (priority) => (
        <Tag
          color={priorityColor[priority]}
          style={{
            borderRadius: "12px",
            padding: "4px 12px",
            fontWeight: "500",
            border: "none",
          }}
        >
          {priority}
        </Tag>
      ),
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
          strokeColor={getProgressColor(progress)}
          style={{ margin: 0 }}
        />
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
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
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<BarChartOutlined />}
            style={{ color: "#13c2c2" }}
            onClick={() => handleProgress(record)}
            title="Tiến độ"
          />
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
            Quản lý nhiệm vụ
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
            Tạo nhiệm vụ mới
          </Button>
        </div>

        {/* Bộ lọc */}
        <div
          style={{ padding: "16px 24px", borderBottom: "1px solid #f0f0f0" }}
        >
          <Row gutter={16}>
            <Col span={6}>
              <Select
                placeholder="Lọc theo trạng thái"
                style={{ width: "100%" }}
                allowClear
                value={filterStatus}
                onChange={setFilterStatus}
              >
                {statusOptions.map((status) => (
                  <Option key={status} value={status}>
                    <Tag color={statusColor[status]}>{status}</Tag>
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={6}>
              <Select
                placeholder="Lọc theo người phụ trách"
                style={{ width: "100%" }}
                allowClear
                value={filterAssignee}
                onChange={setFilterAssignee}
              >
                {assigneeOptions.map((assignee) => (
                  <Option key={assignee} value={assignee}>
                    {assignee}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
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
            locale={{
              emptyText: "Chưa có nhiệm vụ nào",
            }}
          />
        </div>

        {/* Modal thêm nhiệm vụ */}
        <Modal
          title="Tạo nhiệm vụ mới"
          open={modalVisible}
          onOk={handleOk}
          onCancel={() => setModalVisible(false)}
          okText="Lưu"
          cancelText="Hủy"
          width={700}
          okButtonProps={{
            style: {
              background: "#13c2c2",
              borderColor: "#13c2c2",
            },
          }}
        >
          <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
            <Form.Item
              label="Tên nhiệm vụ"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên nhiệm vụ" },
              ]}
            >
              <Input placeholder="Nhập tên nhiệm vụ" />
            </Form.Item>

            <Form.Item label="Mô tả chi tiết" name="description">
              <TextArea rows={3} placeholder="Nhập mô tả chi tiết" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Người phụ trách"
                  name="assignee"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn người phụ trách",
                    },
                  ]}
                >
                  <Select placeholder="Chọn người phụ trách">
                    {assigneeOptions.map((assignee) => (
                      <Option key={assignee} value={assignee}>
                        {assignee}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Tên người phụ trách" name="assigneeName">
                  <Input placeholder="Nhập tên đầy đủ" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Ngày bắt đầu" name="startDate">
                  <DatePicker
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    placeholder="Chọn ngày bắt đầu"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Deadline"
                  name="deadline"
                  rules={[
                    { required: true, message: "Vui lòng chọn deadline" },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    placeholder="Chọn deadline"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Độ ưu tiên"
              name="priority"
              initialValue="Trung bình"
            >
              <Select>
                {priorityOptions.map((priority) => (
                  <Option key={priority} value={priority}>
                    <Tag color={priorityColor[priority]}>{priority}</Tag>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal sửa nhiệm vụ */}
        <Modal
          title="Sửa thông tin nhiệm vụ"
          open={editModalVisible}
          onOk={handleEditOk}
          onCancel={() => {
            setEditModalVisible(false);
            setEditingRecord(null);
          }}
          okText="Cập nhật"
          cancelText="Hủy"
          width={700}
          okButtonProps={{
            style: {
              background: "#1890ff",
              borderColor: "#1890ff",
            },
          }}
        >
          <Form form={editForm} layout="vertical" style={{ marginTop: 16 }}>
            <Form.Item
              label="Tên nhiệm vụ"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên nhiệm vụ" },
              ]}
            >
              <Input placeholder="Nhập tên nhiệm vụ" />
            </Form.Item>

            <Form.Item label="Mô tả chi tiết" name="description">
              <TextArea rows={3} placeholder="Nhập mô tả chi tiết" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Người phụ trách"
                  name="assignee"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn người phụ trách",
                    },
                  ]}
                >
                  <Select placeholder="Chọn người phụ trách">
                    {assigneeOptions.map((assignee) => (
                      <Option key={assignee} value={assignee}>
                        {assignee}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Tên người phụ trách" name="assigneeName">
                  <Input placeholder="Nhập tên đầy đủ" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Ngày bắt đầu" name="startDate">
                  <DatePicker
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    placeholder="Chọn ngày bắt đầu"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Deadline"
                  name="deadline"
                  rules={[
                    { required: true, message: "Vui lòng chọn deadline" },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    placeholder="Chọn deadline"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Độ ưu tiên" name="priority">
              <Select>
                {priorityOptions.map((priority) => (
                  <Option key={priority} value={priority}>
                    <Tag color={priorityColor[priority]}>{priority}</Tag>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal cập nhật tiến độ */}
        <Modal
          title="Cập nhật tiến độ nhiệm vụ"
          open={progressModalVisible}
          onOk={handleProgressOk}
          onCancel={() => {
            setProgressModalVisible(false);
            setProgressRecord(null);
          }}
          okText="Cập nhật"
          cancelText="Hủy"
          width={600}
          okButtonProps={{
            style: {
              background: "#13c2c2",
              borderColor: "#13c2c2",
            },
          }}
        >
          <Form form={progressForm} layout="vertical" style={{ marginTop: 16 }}>
            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select>
                {statusOptions.map((status) => (
                  <Option key={status} value={status}>
                    <Tag color={statusColor[status]}>{status}</Tag>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Tiến độ (%)"
              name="progress"
              rules={[{ required: true, message: "Vui lòng chọn tiến độ" }]}
            >
              <Slider
                min={0}
                max={100}
                marks={{
                  0: "0%",
                  25: "25%",
                  50: "50%",
                  75: "75%",
                  100: "100%",
                }}
                tooltip={{
                  formatter: (value) => `${value}%`,
                }}
              />
            </Form.Item>

            <Form.Item label="Ghi chú tiến độ" name="note">
              <TextArea
                rows={4}
                placeholder="Nhập ghi chú về tiến độ công việc"
              />
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
