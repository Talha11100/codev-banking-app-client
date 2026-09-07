import { useEffect, useState } from 'react'
import { Card, Col, Row, Typography, Table, Input, Tag, Button, Modal, Select } from 'antd'
import { SearchOutlined, DownloadOutlined, PrinterOutlined, CheckCircleOutlined, ReloadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import axios from 'axios'

const { Title, Text } = Typography
const { Option } = Select

const GlobalTransactions = () => {
    const [loading, setLoading] = useState(true)
    const [transactions, setTransactions] = useState([])
    const [totalVolume, setTotalVolume] = useState(0)
    const [searchText, setSearchText] = useState('')
    const [typeFilter, setTypeFilter] = useState('all')
    const [selectedReceipt, setSelectedReceipt] = useState(null)
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false)

    const fetchGlobalTransactions = async () => {
        setLoading(true)
        const jwt = localStorage.getItem("token")
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/transaction/admin/global-transactions`, {
                headers: { Authorization: `Bearer ${jwt}` }
            })
            if (res.status === 200) {
                setTransactions(res.data.transactions || [])
                setTotalVolume(res.data.totalVolume || 0)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchGlobalTransactions()
    }, [])

    // Search and filter logic
    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch =
            tx.refId?.toLowerCase().includes(searchText.toLowerCase()) ||
            tx.senderName?.toLowerCase().includes(searchText.toLowerCase()) ||
            tx.receiverName?.toLowerCase().includes(searchText.toLowerCase()) ||
            tx.senderAccountNumber?.toLowerCase().includes(searchText.toLowerCase()) ||
            tx.receiverAccountNumber?.toLowerCase().includes(searchText.toLowerCase())

        const matchesType = typeFilter === 'all' || tx.type === typeFilter
        return matchesSearch && matchesType
    })

    const handleOpenReceipt = (record) => {
        setSelectedReceipt(record)
        setIsReceiptModalOpen(true)
    }

    const handlePrintReceipt = () => {
        window.print()
    }

    const columns = [
        {
            title: 'REFERENCE ID',
            dataIndex: 'refId',
            key: 'refId',
            render: text => (
                <Text code style={{ color: '#0284c7', fontWeight: 600 }}>
                    #{text || 'N/A'}
                </Text>
            )
        },
        {
            title: 'SENDER',
            dataIndex: 'senderName',
            key: 'senderName',
            render: (text, record) => (
                <div>
                    <Text strong>{text || 'Digital Wallet'}</Text>
                    {record.senderAccountNumber && (
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{record.senderAccountNumber}</div>
                    )}
                </div>
            )
        },
        {
            title: 'RECEIVER',
            dataIndex: 'receiverName',
            key: 'receiverName',
            render: (text, record) => (
                <div>
                    <Text strong>{text || 'Customer Wallet'}</Text>
                    {record.receiverAccountNumber && (
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{record.receiverAccountNumber}</div>
                    )}
                </div>
            )
        },
        {
            title: 'AMOUNT',
            dataIndex: 'amount',
            key: 'amount',
            render: (val, record) => (
                <Text strong style={{ color: record.type === 'deposit' ? '#16a34a' : '#0284c7', fontSize: '15px' }}>
                    Rs. {(val || 0).toLocaleString()}
                </Text>
            )
        },
        {
            title: 'TYPE',
            dataIndex: 'type',
            key: 'type',
            render: text => (
                <Tag color={text === 'deposit' ? 'green' : 'blue'} className="text-uppercase fw-semibold">
                    {text || 'transfer'}
                </Tag>
            )
        },
        {
            title: 'DATE',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: text => dayjs(text).format('DD/MM/YYYY hh:mm A')
        },
        {
            title: 'ACTION',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="primary"
                    size="small"
                    style={{ background: '#1e293b', borderColor: '#1e293b', borderRadius: '6px' }}
                    icon={<DownloadOutlined />}
                    onClick={() => handleOpenReceipt(record)}
                >
                    Receipt PNG
                </Button>
            )
        }
    ]

    return (
        <div className="container py-2">
            {/* Header Banner */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <div>
                    <Title level={2} className="mb-0 fw-bold" style={{ color: '#0f172a' }}>
                        Global Activity
                    </Title>
                    <Text type="secondary">Monitor all platform transactions, receipts and total transaction volume</Text>
                </div>
                <div className="d-flex align-items-center gap-3 mt-3 mt-md-0">
                    <Input
                        placeholder="Search Reference ID, Sender, Receiver..."
                        prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        style={{ width: 280, borderRadius: 8 }}
                        allowClear
                    />
                    <Select
                        value={typeFilter}
                        onChange={val => setTypeFilter(val)}
                        style={{ width: 140 }}
                    >
                        <Option value="all">All Types</Option>
                        <Option value="transfer">Transfers</Option>
                        <Option value="deposit">Deposits</Option>
                    </Select>
                    <Button icon={<ReloadOutlined />} onClick={fetchGlobalTransactions} loading={loading}>
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Total Volume & Stats Bar */}
            <Row gutter={[16, 16]} className="mb-4">
                <Col xs={24} sm={12} lg={8}>
                    <Card variant={false} className="shadow-sm rounded-4" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff' }}>
                        <Text style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
                            TOTAL SYSTEM VOLUME
                        </Text>
                        <Title level={2} className="my-1 fw-bold" style={{ color: '#10b981' }}>
                            Rs. {totalVolume.toLocaleString()}
                        </Title>
                        <Text style={{ color: '#cbd5e1', fontSize: '12px' }}>Total money transferred & deposited</Text>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={8}>
                    <Card variant={false} className="shadow-sm rounded-4" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
                        <Text type="secondary" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
                            TOTAL TRANSACTIONS
                        </Text>
                        <Title level={2} className="my-1 fw-bold" style={{ color: '#0f172a' }}>
                            {transactions.length} Logs
                        </Title>
                        <Text type="secondary" style={{ fontSize: '12px' }}>Real-time transaction history count</Text>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={8}>
                    <Card variant={false} className="shadow-sm rounded-4" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
                        <Text type="secondary" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
                            SYSTEM SETTLEMENT STATUS
                        </Text>
                        <div className="my-2">
                            <Tag color="green" style={{ fontSize: '14px', padding: '4px 10px' }}>
                                <CheckCircleOutlined /> 100% SETTLED
                            </Tag>
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>Instant ledger reconciliation active</Text>
                    </Card>
                </Col>
            </Row>

            {/* Transactions Table Card */}
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card
                        title={<span className="fw-bold fs-5">All Transactions ({filteredTransactions.length})</span>}
                        variant={false}
                        className="shadow-sm rounded-4"
                        style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}
                    >
                        <Table
                            columns={columns}
                            dataSource={filteredTransactions}
                            rowKey="_id"
                            loading={loading}
                            pagination={{ pageSize: 10, showSizeChanger: true }}
                            scroll={{ x: 'max-content' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Digital Receipt Slip Modal */}
            <Modal
                title={null}
                open={isReceiptModalOpen}
                onCancel={() => setIsReceiptModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsReceiptModalOpen(false)}>Close</Button>,
                    <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrintReceipt}>
                        Print Receipt / Slip
                    </Button>
                ]}
                width={500}
                centered
            >
                {selectedReceipt && (
                    <div className="p-3 printable-area">
                        <div className="receipt-card">
                            <div className="receipt-stamp">SUCCESSFUL</div>
                            <div className="text-center mb-3">
                                <Title level={3} className="mb-0 fw-bold" style={{ color: '#0f172a' }}>DigitalBank</Title>
                                <Text type="secondary" style={{ fontSize: '12px' }}>OFFICIAL TRANSACTION RECEIPT</Text>
                            </div>

                            <div className="my-3 py-2 text-center" style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>TRANSFER AMOUNT</Text>
                                <Title level={2} className="my-0 fw-bold" style={{ color: '#0284c7' }}>
                                    Rs. {(selectedReceipt.amount || 0).toLocaleString()}
                                </Title>
                            </div>

                            <div className="vstack gap-2 my-3" style={{ fontSize: '13px' }}>
                                <div className="d-flex justify-content-between">
                                    <Text type="secondary">Reference ID:</Text>
                                    <Text code strong>#{selectedReceipt.refId}</Text>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <Text type="secondary">Transaction Type:</Text>
                                    <Tag color="blue" className="text-uppercase mb-0">{selectedReceipt.type || 'Transfer'}</Tag>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <Text type="secondary">Date & Time:</Text>
                                    <Text strong>{dayjs(selectedReceipt.createdAt).format('DD MMM YYYY, hh:mm A')}</Text>
                                </div>
                                <hr className="my-2" />
                                <div className="d-flex justify-content-between">
                                    <Text type="secondary">Sender:</Text>
                                    <Text strong>{selectedReceipt.senderName || 'Digital Wallet'}</Text>
                                </div>
                                {selectedReceipt.senderAccountNumber && (
                                    <div className="d-flex justify-content-between">
                                        <Text type="secondary">Sender Account:</Text>
                                        <Text code style={{ fontSize: '11px' }}>{selectedReceipt.senderAccountNumber}</Text>
                                    </div>
                                )}
                                <div className="d-flex justify-content-between mt-2">
                                    <Text type="secondary">Receiver:</Text>
                                    <Text strong>{selectedReceipt.receiverName || 'Customer Wallet'}</Text>
                                </div>
                                {selectedReceipt.receiverAccountNumber && (
                                    <div className="d-flex justify-content-between">
                                        <Text type="secondary">Receiver Account:</Text>
                                        <Text code style={{ fontSize: '11px' }}>{selectedReceipt.receiverAccountNumber}</Text>
                                    </div>
                                )}
                            </div>

                            <div className="text-center mt-4 pt-3 border-top" style={{ fontSize: '11px', color: '#94a3b8' }}>
                                Thank you for banking with DigitalBank. This is a computer generated receipt.
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default GlobalTransactions