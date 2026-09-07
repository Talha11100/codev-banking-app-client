import { useEffect, useState } from "react"
import { Col, Row, Typography, Table, Dropdown, Button, Modal, Form, Input, Select, message, Tag, Popconfirm, Card, Space, Avatar } from "antd"
import { DeleteOutlined, EditOutlined, MoreOutlined, QuestionCircleOutlined, UserOutlined, TeamOutlined, CheckCircleOutlined, ClockCircleOutlined, StopOutlined } from "@ant-design/icons"
import dayjs from "dayjs"
import axios from "axios"

const { Title, Text } = Typography
const { Option } = Select

const initialState = { fullName: "", role: "", status: "" }

const Users = () => {

  const [documents, setDocuments] = useState([])
  const [state, setState] = useState(initialState)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

  // Get All Users
  useEffect(() => {
    setIsProcessing(true)
    const jwt = localStorage.getItem("token")

    axios.get(`${import.meta.env.VITE_API_URL}/auth/users`, { headers: { Authorization: `Bearer ${jwt}` } })
      .then((res) => {
        const { status, data } = res
        if (status === 200) {
          setDocuments(data.users)
        }
      })
      .catch((err) => {
        console.log(err)
        message.error("Something went wrong while fetching users")
      })
      .finally(() => {
        setIsProcessing(false)
      })

  }, [])

  // Show Modal or Open Modal Button
  const showModal = (_id) => {
    setIsModalOpen(true);
    const jwt = localStorage.getItem("token")

    axios.get(`${import.meta.env.VITE_API_URL}/auth/single/user/${_id}`, { headers: { Authorization: `Bearer ${jwt}` } })
      .then((res) => {
        const { status, data } = res
        if (status === 200) {
          message.success(data.message)
          setState(data.singleUser)
        }
      })
      .catch((err) => {
        console.log(err)
      })

  }

  // Handle Ok Button
  const handleOk = () => {
    setIsModalOpen(false);

    let { fullName, role, status } = state

    if (fullName === "" || role === "" || status === "") { return message.error("All fields are required") }

    const formData = { fullName, role, status }

    const jwt = localStorage.getItem("token")

    axios.patch(`${import.meta.env.VITE_API_URL}/auth/update-user-by-admin/${state._id}`, formData, { headers: { Authorization: `Bearer ${jwt}` } })
      .then((res) => {
        const { status, data } = res
        if (status === 200) {
          message.success(data.message)
          setDocuments(prevUser => prevUser.map(user => user.uid === state.uid ? data.updatedUser : user))
        }
      })
      .catch((err) => {
        console.log(err)
        message.error("Something went wrong while updating a user")
      })

  };

  // Handle Cancel Button
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Delete User Button
  const deleteUser = (_id) => {

    const jwt = localStorage.getItem("token")

    axios.delete(`${import.meta.env.VITE_API_URL}/auth/delete-user-by-admin/${_id}`, { headers: { Authorization: `Bearer ${jwt}` } })
      .then((res) => {
        const { status, data } = res
        if (status === 200) {
          message.success(data.message)
          const filteredDocuments = documents.filter(item => item._id !== _id)
          setDocuments(filteredDocuments)
        }
      })
      .catch((err) => {
        console.log(err)
        message.error("Something went wrong while deleteing a user")
      })

  }

  const activeCount = documents.filter(u => u.status === 'active').length
  const pendingCount = documents.filter(u => u.status === 'pending').length
  const inactiveCount = documents.filter(u => u.status === 'inactive').length

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => (
        <Space size="middle">
          <Avatar style={{ backgroundColor: record.role === 'superAdmin' ? '#f59e0b' : '#0284c7' }} icon={<UserOutlined />}>
            {text ? text[0].toUpperCase() : 'U'}
          </Avatar>
          <div>
            <Text strong style={{ fontSize: '14px', color: '#0f172a' }}>{text}</Text>
            {record.accountNumber && (
              <div style={{ fontSize: '11px', color: '#64748b' }}>{record.accountNumber}</div>
            )}
          </div>
        </Space>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: text => <Text type="secondary" style={{ fontSize: '13px' }}>{text}</Text>
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: text => (
        <Tag color={text === 'customer' ? 'blue' : 'gold'} className="text-uppercase fw-semibold px-2 py-1" style={{ borderRadius: '6px' }}>
          {text === 'superAdmin' ? 'Super Admin' : 'Customer'}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: text => {
        const color = text === 'active' ? 'green' : text === 'inactive' ? 'orange' : 'red'
        const icon = text === 'active' ? <CheckCircleOutlined /> : text === 'pending' ? <ClockCircleOutlined /> : <StopOutlined />
        return (
          <Tag color={color} icon={icon} className="text-uppercase fw-semibold px-2 py-1" style={{ borderRadius: '6px' }}>
            {text}
          </Tag>
        )
      }
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: text => <Text type="secondary" style={{ fontSize: '12px' }}>{dayjs(text).format("DD-MMM-YYYY, hh:mm A")}</Text>
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Dropdown menu={{
          items: [
            { label: "Edit User", key: "edit", icon: <EditOutlined />, onClick: () => { showModal(record._id) } },
            { label: <Popconfirm title="Delete User" tip="Are you sure to delete this user?" onConfirm={() => deleteUser(record._id)} icon={<QuestionCircleOutlined />}>Delete User</Popconfirm>, key: "delete", icon: <DeleteOutlined />, danger: true }
          ]
        }} trigger={['click']}>
          <Button className="border-0 shadow-none" icon={<MoreOutlined style={{ fontSize: '18px' }} />} />
        </Dropdown>
      ),
    },
  ]

  return (
    <>
      <div className="container py-2">
        {/* Page Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
          <div>
            <Title level={2} className="mb-0 fw-bold" style={{ color: '#0f172a' }}>
              User Directory & Permissions
            </Title>
            <Text type="secondary">Manage and monitor all registered accounts, roles, and administrative statuses</Text>
          </div>
        </div>

        {/* Quick User Summary Cards */}
        <Row gutter={[16, 16]} className="mb-4">
          <Col xs={24} sm={8}>
            <Card variant={false} className="shadow-sm rounded-4" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <Text type="secondary" className="fw-semibold text-uppercase" style={{ fontSize: '11px' }}>TOTAL USERS</Text>
                  <Title level={2} className="my-1 fw-bold" style={{ color: '#0f172a' }}>{documents.length}</Title>
                </div>
                <div className="p-3 rounded-3" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                  <TeamOutlined style={{ fontSize: '24px' }} />
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={8}>
            <Card variant={false} className="shadow-sm rounded-4" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <Text type="secondary" className="fw-semibold text-uppercase" style={{ fontSize: '11px' }}>ACTIVE ACCOUNTS</Text>
                  <Title level={2} className="my-1 fw-bold" style={{ color: '#16a34a' }}>{activeCount}</Title>
                </div>
                <div className="p-3 rounded-3" style={{ background: '#dcfce7', color: '#16a34a' }}>
                  <CheckCircleOutlined style={{ fontSize: '24px' }} />
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={8}>
            <Card variant={false} className="shadow-sm rounded-4" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <Text type="secondary" className="fw-semibold text-uppercase" style={{ fontSize: '11px' }}>PENDING / INACTIVE</Text>
                  <Title level={2} className="my-1 fw-bold" style={{ color: '#d97706' }}>{pendingCount + inactiveCount}</Title>
                </div>
                <div className="p-3 rounded-3" style={{ background: '#fef3c7', color: '#d97706' }}>
                  <ClockCircleOutlined style={{ fontSize: '24px' }} />
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Main Users Table Card */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card
              title={<span className="fw-bold fs-5">All Registered Users ({documents.length})</span>}
              variant={false}
              className="shadow-sm rounded-4"
              style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}
            >
              <Table
                scroll={{ x: 'max-content' }}
                columns={columns}
                dataSource={documents}
                rowKey={(record) => record.uid}
                loading={isProcessing}
                pagination={{ pageSize: 10, showSizeChanger: true }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Edit User Modal */}
      <Modal
        title={<span className="fw-bold fs-5">Edit User Details</span>}
        closable={{ 'aria-label': 'Custom Close Button' }}
        confirmLoading={isProcessing}
        loading={false}
        centered={true}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        mask={{ enabled: true, blur: true }}
      >
        <Form layout="vertical" className="pt-2">
          <Row gutter={[12, 12]}>
            <Col span={24}>
              <Form.Item label={<span className="fw-semibold">Full Name</span>}>
                <Input size="large" value={state.fullName} name="fullName" onChange={handleChange} disabled style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label={<span className="fw-semibold">Role</span>} required>
                <Select size="large" value={state.role} onChange={(value) => { setState({ ...state, role: value }) }} style={{ borderRadius: 8 }}>
                  <Option value="customer">Customer</Option>
                  <Option value="superAdmin">Super Admin</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label={<span className="fw-semibold">Status</span>} required>
                <Select size="large" value={state.status} onChange={(value) => { setState({ ...state, status: value }) }} style={{ borderRadius: 8 }}>
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                  <Option value="pending">Pending</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal >
    </>
  )
}

export default Users