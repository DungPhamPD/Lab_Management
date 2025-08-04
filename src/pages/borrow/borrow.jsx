import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Select, DatePicker, Card, Row, Col } from "antd";
import moment from "moment";
import Navbar from "../../components/navbar/navbar";
import { Navigate } from "react-router-dom";


const { Option } = Select;

const initialData = [
  {
    key: "1",
    borrower: "Nguyễn Văn A",
    status: "Đang mượn",
    borrowDate: "2025-08-01",
    returnDate: "",
    device: "Laptop Dell",
  },
  {
    key: "2",
    borrower: "Trần Thị B",
    status: "Đã trả",
    borrowDate: "2025-07-20",
    returnDate: "2025-07-25",
    device: "Máy chiếu Epson",
  },
];

const statusOptions = ["Đang mượn", "Đã trả"];

const BorrowPage = ({ isAdmin = true, currentUser = "Nguyễn Văn A" }) => {
  const [data, setData] = useState(initialData);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [filterStatus, setFilterStatus] = useState("");
  const [filterBorrower, setFilterBorrower] = useState("");

  // Lọc dữ liệu theo quyền
  const filteredData = data.filter((item) => {
    let match = true;
    if (!isAdmin && item.borrower !== currentUser) match = false;
    if (filterStatus && item.status !== filterStatus) match = false;
    if (isAdmin && filterBorrower && item.borrower !== filterBorrower) match = false;
    return match;
  });

  // Lấy danh sách người mượn để lọc
  const borrowerList = [...new Set(data.map((item) => item.borrower))];

  const columns = [
    { title: "Tên người mượn", dataIndex: "borrower", key: "borrower" },
    { title: "Tên thiết bị", dataIndex: "device", key: "device" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    { title: "Ngày mượn", dataIndex: "borrowDate", key: "borrowDate" },
    { title: "Ngày trả", dataIndex: "returnDate", key: "returnDate" },
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
          returnDate: values.returnDate ? values.returnDate.format("YYYY-MM-DD") : "",
          device: values.device,
        },
      ]);
      setModalVisible(false);
    });
  };

  return (
    <Card
      title="Quản lý mượn trả thiết bị"
      style={{
        maxWidth: 1100,
        margin: "32px auto",
        boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        borderRadius: 16,
      }}
    >
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <Select
            allowClear
            placeholder="Lọc theo trạng thái"
            style={{ width: 160 }}
            value={filterStatus || undefined}
            onChange={setFilterStatus}
          >
            {statusOptions.map((status) => (
              <Option key={status} value={status}>
                {status}
              </Option>
            ))}
          </Select>
        </Col>
        {isAdmin && (
          <Col>
            <Select
              allowClear
              placeholder="Lọc theo người mượn"
              style={{ width: 180 }}
              value={filterBorrower || undefined}
              onChange={setFilterBorrower}
            >
              {borrowerList.map((name) => (
                <Option key={name} value={name}>
                  {name}
                </Option>
              ))}
            </Select>
          </Col>
        )}
        <Col flex="auto" />
        <Col>
          <Button type="primary" onClick={handleAdd}>
            Thêm thông tin mượn
          </Button>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 8 }}
        bordered
        style={{
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          borderRadius: 12,
        }}
      />

      <Modal
        title="Thêm thông tin mượn thiết bị"
        open={modalVisible}
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
        bodyStyle={{
          boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
          borderRadius: 12,
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên người mượn"
            name="borrower"
            rules={[{ required: true, message: "Vui lòng nhập tên người mượn" }]}
          >
            <Input placeholder="Nhập tên hoặc chọn" />
          </Form.Item>
          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Chọn trạng thái" }]}
          >
            <Select placeholder="Chọn trạng thái">
              {statusOptions.map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Ngày mượn"
            name="borrowDate"
            rules={[{ required: true, message: "Chọn ngày mượn" }]}
          >
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item label="Ngày trả" name="returnDate">
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            label="Tên thiết bị"
            name="device"
            rules={[{ required: true, message: "Nhập tên thiết bị" }]}
          >
            <Input placeholder="Nhập tên thiết bị" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default BorrowPage;