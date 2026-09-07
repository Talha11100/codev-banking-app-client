import { useEffect, useState } from 'react'
import { Card, Col, Row, Typography, Table, Input, Tag, Button, Dropdown, Modal, Form, Select, message, Spin, Space, Tooltip } from 'antd'
import { UserOutlined, BankOutlined, TransactionOutlined, SafetyCertificateOutlined, SearchOutlined, CheckCircleOutlined, EditOutlined, DeleteOutlined, MoreOutlined, QuestionCircleOutlined, ReloadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import axios from 'axios'

const { Title, Text } = Typography
const { Option } = Select

const AdminOverview = () => {
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        pendingUsers: 0,
        inactiveUsers: 0,
        totalLiquidity: 0,
        totalTransactions: 0,
        totalVolume: 0
    })
    const [users, setUsers] = useState([])
    const [recentTransactions, setRecentTransactions] = useState([])
    const [searchText, setSearchText] = useState('')
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)

    const fetchOverviewData = async () => {
        setLoading(true)
        const jwt = localStorage.getItem("token")
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/admin/overview-stats`, {
                headers: { Authorization: `Bearer ${jwt}` }
            })
            if (res.status === 200) {
                setStats(res.data.stats)
                setUsers(res.data.recentUsers || [])
                setRecentTransactions(res.data.recentTransactions || [])
            }
        } catch (error) {
            console.error(error)
            message.error("Failed to load overview data")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOverviewData()
    }, [])

    // Quick user status update
    const handleStatusUpdate = async (userId, newStatus, role = selectedUser?.role) => {
        const jwt = localStorage.getItem("token")
        setIsProcessing(true)
        try {
            const res = await axios.patch(
                `${import.meta.env.VITE_API_URL}/auth/update-user-by-admin/${userId}`,
                { status: newStatus, role },
                { headers: { Authorization: `Bearer ${jwt}` } }
            )
            if (res.status === 200) {
                message.success(`User status updated to ${newStatus}`)
                fetchOverviewData()
                setIsEditModalOpen(false)
            }
        } catch (err) {
            console.error(err)
            message.error("Failed to update user status")
        } finally {
            setIsProcessing(false)
        }
    }

    const filteredUsers = users.filter(user =>
        user.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.accountNumber?.toLowerCase().includes(searchText.toLowerCase())
    )

    const userColumns = [
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (text, record) => (
                <Space orientation="vertical" size={0}>
                    <Text strong>{text}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{record.email}</Text>
                </Space>
            )
        },
        {
            title: 'Account #',
            dataIndex: 'accountNumber',
            key: 'accountNumber',
            render: text => <Text code>{text || 'N/A'}</Text>
        },
        {
            title: 'Balance',
            dataIndex: 'balance',
            key: 'balance',
            render: val => <Text strong style={{ color: '#0284c7' }}>Rs. {(val || 0).toLocaleString()}</Text>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: text => {
                const color = text === 'active' ? 'green' : text === 'pending' ? 'orange' : 'red'
                return <Tag color={color} className="text-uppercase fw-semibold">{text}</Tag>
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space>
                    {record.status === 'pending' && (
                        <Button
                            type="primary"
                            size="small"
                            icon={<CheckCircleOutlined />}
                            onClick={() => handleStatusUpdate(record._id, 'active', record.role)}
                        >
                            Approve
                        </Button>
                    )}
                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setSelectedUser(record)
                            setIsEditModalOpen(true)
                        }}
                    />
                </Space>
            )
        }
    ]

    return (
        <div className="container py-2">
            {/* Header & Search */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <div>
                    <Title level={2} className="mb-0 fw-bold" style={{ color: '#0f172a' }}>
                        Admin Overview
                    </Title>
                    <Text type="secondary">Centralized superAdmin command & monitoring dashboard</Text>
                </div>
                <div className="d-flex align-items-center gap-3 mt-3 mt-md-0">
                    <Input
                        placeholder="Global Search users or accounts..."
                        prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        style={{ width: 280, borderRadius: 8 }}
                        allowClear
                    />
                    <Button icon={<ReloadOutlined />} onClick={fetchOverviewData} loading={loading}>
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Metrics Overview Cards */}
            <Row gutter={[16, 16]} className="mb-4">
                <Col xs={24} sm={12} lg={6}>
                    <Card variant={false} className="shadow-sm rounded-4 h-100" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                            <Text type="secondary" className="fw-semibold text-uppercase style-letter-spacing" style={{ fontSize: '12px' }}>
                                TOTAL USERS
                            </Text>
                            <div className="p-2 rounded-3" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                                <UserOutlined style={{ fontSize: '20px' }} />
                            </div>
                        </div>
                        <Title level={2} className="my-1 fw-bold" style={{ color: '#0f172a' }}>
                            {stats.totalUsers}
                        </Title>
                        <div className="d-flex gap-1 mt-2">
                            <Tag color="green" style={{ fontSize: '11px' }}>{stats.activeUsers} Active</Tag>
                            {stats.pendingUsers > 0 && <Tag color="orange" style={{ fontSize: '11px' }}>{stats.pendingUsers} Pending</Tag>}
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card variant={false} className="shadow-sm rounded-4 h-100" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                            <Text type="secondary" className="fw-semibold text-uppercase" style={{ fontSize: '12px' }}>
                                LIQUIDITY
                            </Text>
                            <div className="p-2 rounded-3" style={{ background: '#dcfce7', color: '#16a34a' }}>
                                <BankOutlined style={{ fontSize: '20px' }} />
                            </div>
                        </div>
                        <Title level={2} className="my-1 fw-bold" style={{ color: '#0f172a' }}>
                            {stats.totalLiquidity >= 1000000
                                ? `Rs. ${(stats.totalLiquidity / 1000000).toFixed(2)}M`
                                : stats.totalLiquidity >= 100000
                                    ? `Rs. ${(stats.totalLiquidity / 100000).toFixed(1)}L`
                                    : `Rs. ${stats.totalLiquidity.toLocaleString()}`}
                        </Title>
                        <Text type="secondary" style={{ fontSize: '12px' }}>Total bank deposits across accounts</Text>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card variant={false} className="shadow-sm rounded-4 h-100" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                            <Text type="secondary" className="fw-semibold text-uppercase" style={{ fontSize: '12px' }}>
                                TOTAL VOLUME
                            </Text>
                            <div className="p-2 rounded-3" style={{ background: '#fef3c7', color: '#d97706' }}>
                                <TransactionOutlined style={{ fontSize: '20px' }} />
                            </div>
                        </div>
                        <Title level={2} className="my-1 fw-bold" style={{ color: '#0f172a' }}>
                            {stats.totalVolume >= 1000000
                                ? `Rs. ${(stats.totalVolume / 1000000).toFixed(2)}M`
                                : `Rs. ${(stats.totalVolume || 0).toLocaleString()}`}
                        </Title>
                        <Text type="secondary" style={{ fontSize: '12px' }}>Total transfer & deposit volume</Text>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card variant={false} className="shadow-sm rounded-4 h-100" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                            <Text type="secondary" className="fw-semibold text-uppercase" style={{ fontSize: '12px' }}>
                                SYSTEM STATUS
                            </Text>
                            <div className="p-2 rounded-3" style={{ background: '#f1f5f9', color: '#0f172a' }}>
                                <SafetyCertificateOutlined style={{ fontSize: '20px' }} />
                            </div>
                        </div>
                        <div className="my-2">
                            <Tag color="cyan" style={{ fontSize: '14px', padding: '4px 10px', fontWeight: 600 }}>
                                HIGH PROTECTION
                            </Tag>
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>{stats.totalTransactions} Total Transactions logged</Text>
                    </Card>
                </Col>
            </Row>

            {/* Quick User Management Table */}
            <Row gutter={[16, 16]} className="mb-4">
                <Col span={24}>
                    <Card
                        title={
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="fw-bold fs-5">Quick User Management</span>
                                <Text type="secondary" style={{ fontSize: '13px' }}>
                                    Showing {filteredUsers.length} users
                                </Text>
                            </div>
                        }
                        variant={false}
                        className="shadow-sm rounded-4"
                        style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}
                    >
                        <Table
                            columns={userColumns}
                            dataSource={filteredUsers}
                            rowKey="_id"
                            loading={loading}
                            pagination={{ pageSize: 5 }}
                            scroll={{ x: 'max-content' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Recent Activity Card */}
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card
                        title={<span className="fw-bold fs-5">Recent Global Activity</span>}
                        variant={false}
                        className="shadow-sm rounded-4"
                        style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}
                    >
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Reference ID</th>
                                        <th>Sender</th>
                                        <th>Receiver</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTransactions.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-3 text-muted">No recent transactions recorded</td>
                                        </tr>
                                    ) : (
                                        recentTransactions.map(tx => (
                                            <tr key={tx._id || tx.refId}>
                                                <td><Text code style={{ color: '#0284c7' }}>#{tx.refId || 'N/A'}</Text></td>
                                                <td><Text strong>{tx.senderName || tx.senderUid}</Text></td>
                                                <td><Text strong>{tx.receiverName || tx.receiverUid}</Text></td>
                                                <td><Text strong style={{ color: '#16a34a' }}>Rs. {(tx.amount || 0).toLocaleString()}</Text></td>
                                                <td>{dayjs(tx.createdAt).format('DD/MM/YYYY hh:mm A')}</td>
                                                <td><Tag color="green" className="text-uppercase">Completed</Tag></td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Edit User Modal */}
            <Modal
                title="Update User Record"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
                centered
            >
                {selectedUser && (
                    <Form layout="vertical" className="pt-2">
                        <Form.Item label="Full Name">
                            <Input value={selectedUser.fullName} disabled />
                        </Form.Item>
                        <Form.Item label="Email">
                            <Input value={selectedUser.email} disabled />
                        </Form.Item>
                        <Form.Item label="Account Status" required>
                            <Select
                                value={selectedUser.status}
                                onChange={val => setSelectedUser({ ...selectedUser, status: val })}
                            >
                                <Option value="active">Active</Option>
                                <Option value="pending">Pending</Option>
                                <Option value="inactive">Inactive</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Role" required>
                            <Select
                                value={selectedUser.role}
                                onChange={val => setSelectedUser({ ...selectedUser, role: val })}
                            >
                                <Option value="customer">Customer</Option>
                                <Option value="superAdmin">Super Admin</Option>
                            </Select>
                        </Form.Item>
                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                            <Button
                                type="primary"
                                loading={isProcessing}
                                onClick={() => handleStatusUpdate(selectedUser._id, selectedUser.status, selectedUser.role)}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </Form>
                )}
            </Modal>
        </div>
    )
}

export default AdminOverview