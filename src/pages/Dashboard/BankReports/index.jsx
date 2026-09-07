import { useEffect, useState } from 'react'
import { Card, Col, Row, Typography, Button, Modal, Table, Select, Tag, Spin, message } from 'antd'
import { PrinterOutlined, UserOutlined, FileTextOutlined, SearchOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import axios from 'axios'

const { Title, Text } = Typography
const { Option } = Select

const BankReports = () => {
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState([])
    const [totalLiquidity, setTotalLiquidity] = useState(0)

    // Modal States
    const [isAccountsModalOpen, setIsAccountsModalOpen] = useState(false)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
    const [isStatementModalOpen, setIsStatementModalOpen] = useState(false)

    // Statement Generator State
    const [selectedUserUid, setSelectedUserUid] = useState(null)
    const [statementData, setStatementData] = useState(null)
    const [loadingStatement, setLoadingStatement] = useState(false)

    const fetchReportData = async () => {
        setLoading(true)
        const jwt = localStorage.getItem("token")
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/transaction/admin/bank-reports/accounts`, {
                headers: { Authorization: `Bearer ${jwt}` }
            })
            if (res.status === 200) {
                setUsers(res.data.users || [])
                setTotalLiquidity(res.data.totalLiquidity || 0)
                if (res.data.users && res.data.users.length > 0) {
                    setSelectedUserUid(res.data.users[0].uid)
                }
            }
        } catch (error) {
            console.error(error)
            message.error("Failed to load bank report data")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReportData()
    }, [])

    const handleGenerateStatement = async (uid) => {
        if (!uid) return
        setLoadingStatement(true)
        const jwt = localStorage.getItem("token")
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/transaction/admin/bank-reports/user-statement/${uid}`, {
                headers: { Authorization: `Bearer ${jwt}` }
            })
            if (res.status === 200) {
                setStatementData(res.data)
            }
        } catch (error) {
            console.error(error)
            message.error("Failed to fetch statement history")
        } finally {
            setLoadingStatement(false)
        }
    }

    const handlePrint = () => {
        window.print()
    }

    const accountsColumns = [
        { title: 'Full Name', dataIndex: 'fullName', key: 'fullName', render: text => <Text strong>{text}</Text> },
        { title: 'Account #', dataIndex: 'accountNumber', key: 'accountNumber', render: text => <Text code>{text || 'N/A'}</Text> },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Balance', dataIndex: 'balance', key: 'balance', render: val => <Text strong style={{ color: '#0284c7' }}>Rs. {(val || 0).toLocaleString()}</Text> },
        {
            title: 'Status', dataIndex: 'status', key: 'status', render: text => (
                <Tag color={text === 'active' ? 'green' : text === 'pending' ? 'orange' : 'red'} className="text-uppercase">
                    {text}
                </Tag>
            )
        }
    ]

    return (
        <div className="container py-2">
            {/* Page Header */}
            <div className="mb-4 pb-2 border-bottom">
                <Title level={2} className="mb-0 fw-bold" style={{ color: '#0f172a' }}>
                    BANK REPORTS & LEDGER
                </Title>
                <Text type="secondary">Centralized management for all banking records, account ledgers, and official customer statements</Text>
            </div>

            {/* 3 Main Action Cards */}
            <Row gutter={[20, 20]} className="mb-5">
                {/* Card 1: PRINT ALL ACCOUNTS */}
                <Col xs={24} md={8}>
                    <Card
                        variant={false}
                        className="shadow-sm rounded-4 h-100 p-2"
                        style={{ background: '#ffffff', border: '1px solid #e2e8f0', cursor: 'pointer' }}
                        onClick={() => setIsAccountsModalOpen(true)}
                    >
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <div className="p-3 rounded-4" style={{ background: '#f1f5f9', color: '#0f172a' }}>
                                <PrinterOutlined style={{ fontSize: '32px' }} />
                            </div>
                        </div>
                        <Title level={4} className="fw-bold mb-2" style={{ color: '#0f172a' }}>
                            PRINT ALL ACCOUNTS
                        </Title>
                        <Text type="secondary" style={{ fontSize: '13px', display: 'block' }} className="mb-4">
                            Generate a comprehensive list of all registered bank accounts with balances and status.
                        </Text>
                        <Button
                            type="primary"
                            block
                            size="large"
                            icon={<PrinterOutlined />}
                            style={{ background: '#0284c7', borderColor: '#0284c7', borderRadius: '8px' }}
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsAccountsModalOpen(true)
                            }}
                        >
                            PRINT ACCOUNTS
                        </Button>
                    </Card>
                </Col>

                {/* Card 2: ACCOUNT DETAILS */}
                <Col xs={24} md={8}>
                    <Card
                        variant={false}
                        className="shadow-sm rounded-4 h-100 p-2"
                        style={{ background: '#ffffff', border: '1px solid #e2e8f0', cursor: 'pointer' }}
                        onClick={() => setIsDetailsModalOpen(true)}
                    >
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <div className="p-3 rounded-4" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                                <UserOutlined style={{ fontSize: '32px' }} />
                            </div>
                        </div>
                        <Title level={4} className="fw-bold mb-2" style={{ color: '#0f172a' }}>
                            ACCOUNT DETAILS
                        </Title>
                        <Text type="secondary" style={{ fontSize: '13px', display: 'block' }} className="mb-4">
                            View detailed information including phone, email, card status, and verification status of users.
                        </Text>
                        <Button
                            type="primary"
                            block
                            size="large"
                            icon={<SearchOutlined />}
                            style={{ background: '#0284c7', borderColor: '#0284c7', borderRadius: '8px' }}
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsDetailsModalOpen(true)
                            }}
                        >
                            VIEW ALL DETAILS
                        </Button>
                    </Card>
                </Col>

                {/* Card 3: USER STATEMENTS */}
                <Col xs={24} md={8}>
                    <Card
                        variant={false}
                        className="shadow-sm rounded-4 h-100 p-2"
                        style={{ background: '#ffffff', border: '1px solid #e2e8f0', cursor: 'pointer' }}
                        onClick={() => {
                            setIsStatementModalOpen(true)
                            if (selectedUserUid) handleGenerateStatement(selectedUserUid)
                        }}
                    >
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <div className="p-3 rounded-4" style={{ background: '#dcfce7', color: '#16a34a' }}>
                                <FileTextOutlined style={{ fontSize: '32px' }} />
                            </div>
                        </div>
                        <Title level={4} className="fw-bold mb-2" style={{ color: '#0f172a' }}>
                            USER STATEMENTS
                        </Title>
                        <Text type="secondary" style={{ fontSize: '13px', display: 'block' }} className="mb-4">
                            Generate and print professional transaction statements for individual bank customers.
                        </Text>
                        <Button
                            type="primary"
                            block
                            size="large"
                            icon={<FileTextOutlined />}
                            style={{ background: '#0284c7', borderColor: '#0284c7', borderRadius: '8px' }}
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsStatementModalOpen(true)
                                if (selectedUserUid) handleGenerateStatement(selectedUserUid)
                            }}
                        >
                            GENERATE STATEMENTS
                        </Button>
                    </Card>
                </Col>
            </Row>

            {/* Modal 1: PRINT ALL ACCOUNTS MODAL */}
            <Modal
                title="Master Registered Bank Accounts Report"
                open={isAccountsModalOpen}
                onCancel={() => setIsAccountsModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsAccountsModalOpen(false)}>Close</Button>,
                    <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
                        Print Report
                    </Button>
                ]}
                width={800}
                centered
            >
                <div className="printable-area p-2">
                    <div className="text-center mb-4">
                        <Title level={3} className="mb-0 fw-bold">DigitalBank Master Account Ledger</Title>
                        <Text type="secondary">Generated on {dayjs().format('DD MMMM YYYY, hh:mm A')}</Text>
                    </div>
                    <Table
                        columns={accountsColumns}
                        dataSource={users}
                        rowKey="_id"
                        pagination={false}
                        scroll={{ x: 'max-content' }}
                    />
                    <div className="d-flex justify-content-between mt-4 pt-3 border-top fw-bold">
                        <span>TOTAL ACCOUNTS: {users.length}</span>
                        <span>TOTAL SYSTEM LIQUIDITY: Rs. {totalLiquidity.toLocaleString()}</span>
                    </div>
                </div>
            </Modal>

            {/* Modal 2: ACCOUNT DETAILS INSPECTION MODAL */}
            <Modal
                title="Detailed Bank Account Registry"
                open={isDetailsModalOpen}
                onCancel={() => setIsDetailsModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsDetailsModalOpen(false)}>Close</Button>
                ]}
                width={900}
                centered
            >
                <Table
                    columns={[
                        { title: 'Name', dataIndex: 'fullName', key: 'fullName', render: text => <Text strong>{text}</Text> },
                        { title: 'Email', dataIndex: 'email', key: 'email' },
                        { title: 'Account Number', dataIndex: 'accountNumber', key: 'accountNumber', render: text => <Text code>{text}</Text> },
                        {
                            title: 'Debit Card #', dataIndex: 'card', key: 'card', render: card => (
                                <div>
                                    <Text code style={{ fontSize: '11px' }}>{card?.cardNumber || 'N/A'}</Text>
                                    <div><Tag color={card?.isActive ? 'green' : 'red'}>{card?.isActive ? 'ACTIVE CARD' : 'FROZEN'}</Tag></div>
                                </div>
                            )
                        },
                        { title: 'Balance', dataIndex: 'balance', key: 'balance', render: val => <Text strong style={{ color: '#0284c7' }}>Rs. {(val || 0).toLocaleString()}</Text> },
                        { title: 'Status', dataIndex: 'status', key: 'status', render: text => <Tag color={text === 'active' ? 'green' : 'red'} className="text-uppercase">{text}</Tag> }
                    ]}
                    dataSource={users}
                    rowKey="_id"
                    pagination={{ pageSize: 5 }}
                    scroll={{ x: 'max-content' }}
                />
            </Modal>

            {/* Modal 3: USER STATEMENTS GENERATOR MODAL */}
            <Modal
                title="Customer Account Statement Generator"
                open={isStatementModalOpen}
                onCancel={() => setIsStatementModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsStatementModalOpen(false)}>Close</Button>,
                    <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
                        Print Statement
                    </Button>
                ]}
                width={850}
                centered
            >
                <div className="mb-4 no-print">
                    <Text strong className="d-block mb-2">Select Customer Account:</Text>
                    <Select
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Search by user name or account number..."
                        value={selectedUserUid}
                        onChange={(uid) => {
                            setSelectedUserUid(uid)
                            handleGenerateStatement(uid)
                        }}
                    >
                        {users.map(u => (
                            <Option key={u.uid} value={u.uid}>
                                {u.fullName} ({u.accountNumber}) - Rs. {(u.balance || 0).toLocaleString()}
                            </Option>
                        ))}
                    </Select>
                </div>

                {loadingStatement ? (
                    <div className="text-center py-5">
                        <Spin size="large" tipcription="Generating official bank statement..." />
                    </div>
                ) : statementData ? (
                    <div className="printable-area p-3 border rounded-3 style-bg-white">
                        {/* Statement Header */}
                        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                            <div>
                                <Title level={3} className="my-0 fw-bold" style={{ color: '#0f172a' }}>DigitalBank</Title>
                                <Text type="secondary">Official Account Statement</Text>
                            </div>
                            <div className="text-end">
                                <Text type="secondary" style={{ fontSize: '12px' }}>Date Issued:</Text>
                                <div className="fw-bold">{dayjs().format('DD/MM/YYYY')}</div>
                            </div>
                        </div>

                        {/* Customer & Account Overview Box */}
                        <Row gutter={[16, 16]} className="mb-4 p-3 rounded-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                            <Col span={12}>
                                <Text type="secondary" style={{ fontSize: '11px', textTransform: 'uppercase' }}>ACCOUNT HOLDER</Text>
                                <div className="fw-bold fs-6">{statementData.user.fullName}</div>
                                <div style={{ fontSize: '12px', color: '#64748b' }}>{statementData.user.email}</div>
                            </Col>
                            <Col span={12} className="text-end">
                                <Text type="secondary" style={{ fontSize: '11px', textTransform: 'uppercase' }}>ACCOUNT NUMBER</Text>
                                <div className="fw-bold fs-6" style={{ fontFamily: 'monospace' }}>{statementData.user.accountNumber}</div>
                                <div className="fw-bold mt-1" style={{ color: '#0284c7' }}>
                                    CURRENT BALANCE: Rs. {(statementData.summary.currentBalance || 0).toLocaleString()}
                                </div>
                            </Col>
                        </Row>

                        {/* Statement Table */}
                        <Title level={5} className="mb-2 fw-bold">Transaction History Ledger</Title>
                        <div className="table-responsive">
                            <table className="table table-variant align-middle style-font-sm">
                                <thead className="table-light">
                                    <tr>
                                        <th>Date</th>
                                        <th>Ref ID</th>
                                        <th>Description</th>
                                        <th>Type</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {statementData.transactions.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-3 text-muted">No transaction logs recorded for this account</td>
                                        </tr>
                                    ) : (
                                        statementData.transactions.map(tx => (
                                            <tr key={tx._id}>
                                                <td>{dayjs(tx.createdAt).format('DD/MM/YYYY')}</td>
                                                <td><Text code>#{tx.refId}</Text></td>
                                                <td>{tx.title || 'Bank Transfer'}</td>
                                                <td>
                                                    <Tag color={tx.type === 'deposit' ? 'green' : 'blue'} className="text-uppercase">
                                                        {tx.type}
                                                    </Tag>
                                                </td>
                                                <td>
                                                    <Text strong style={{ color: tx.type === 'deposit' ? '#16a34a' : '#0284c7' }}>
                                                        Rs. {(tx.amount || 0).toLocaleString()}
                                                    </Text>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Statement Summary Footer */}
                        <div className="d-flex justify-content-between p-3 mt-3 rounded-3" style={{ background: '#f1f5f9' }}>
                            <div>Total Sent / Transferred: <strong>Rs. {(statementData.summary.totalSent || 0).toLocaleString()}</strong></div>
                            <div>Total Received / Deposited: <strong>Rs. {(statementData.summary.totalReceived || 0).toLocaleString()}</strong></div>
                        </div>
                    </div>
                ) : null}
            </Modal>
        </div>
    )
}

export default BankReports