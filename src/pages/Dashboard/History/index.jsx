import { useEffect, useState } from 'react'
import { Button, Tag, Modal, Typography, Popconfirm, message, Spin, Empty } from 'antd'
import { HistoryOutlined, DownloadOutlined, EyeOutlined, DeleteOutlined, ThunderboltOutlined, ArrowUpOutlined, ArrowDownOutlined, PrinterOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import axios from 'axios'
import { useAuth } from '@/context/Auth'

const { Text } = Typography

const History = () => {
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState(null)

  const fetchTransactions = () => {
    setLoading(true)
    const jwt = localStorage.getItem('token')
    axios
      .get(`${import.meta.env.VITE_API_URL}/transaction/transactions`, {
        headers: { Authorization: `Bearer ${jwt}` }
      })
      .then((res) => {
        if (res.status === 200) {
          setTransactions(res.data.transactions || [])
        }
      })
      .catch((err) => {
        console.error(err)
        message.error('Failed to load transaction history.')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const handleOpenReceipt = (tx) => {
    setSelectedReceipt(tx)
    setIsModalOpen(true)
  }

  const handleDeleteTransaction = (id) => {
    const jwt = localStorage.getItem('token')
    axios
      .delete(`${import.meta.env.VITE_API_URL}/transaction/transactions/${id}`, {
        headers: { Authorization: `Bearer ${jwt}` }
      })
      .then((res) => {
        if (res.status === 200) {
          message.success('Transaction removed from history.')
          setTransactions((prev) => prev.filter((t) => t._id !== id))
        }
      })
      .catch((err) => {
        console.error(err)
        message.error('Failed to remove transaction.')
      })
  }

  const handleDownloadStatement = () => {
    if (transactions.length === 0) {
      return message.info('No transactions to download.')
    }
    const lines = [
      'TRANSACTION STATEMENT',
      `Account Holder: ${user?.fullName}`,
      `Generated At: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
      '-------------------------------------------------------',
      'Ref ID | Date | Type | Title | Amount | Status'
    ]

    transactions.forEach((tx) => {
      const isDebit = tx.senderUid === user?.uid && tx.type === 'transfer'
      const prefix = isDebit ? '-Rs. ' : '+Rs. '
      lines.push(
        `${tx.refId} | ${dayjs(tx.createdAt).format('DD-MMM-YYYY HH:mm')} | ${tx.type} | ${tx.title} | ${prefix}${tx.amount} | ${tx.status}`
      )
    })

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Statement_${dayjs().format('YYYYMMDD')}.txt`
    link.click()
    URL.revokeObjectURL(url)
    message.success('Statement downloaded successfully!')
  }

  const handlePrintReceipt = () => {
    window.print()
  }

  return (
    <Spin spinning={loading}>
      <div className="container px-0 py-2">
        {/* Transaction Count Stat Card */}
        <div className="row mb-4">
          <div className="col-12 col-md-5 col-lg-4">
            <div className="bg-white rounded-4 p-4 shadow-sm border-0">
              <Text className="text-muted small text-uppercase fw-semibold d-block mb-1" style={{ letterSpacing: '0.5px' }}>
                TRANSACTION COUNT
              </Text>
              <h2 className="fw-bold text-dark m-0">{transactions.length}</h2>
            </div>
          </div>
        </div>

        {/* History Header & Action */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <HistoryOutlined style={{ fontSize: '22px', color: '#1e293b' }} />
            <h5 className="fw-bold m-0 text-dark">History</h5>
          </div>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            style={{ backgroundColor: '#2563eb', borderRadius: '8px' }}
            className="fw-semibold"
            onClick={handleDownloadStatement}
          >
            Download Statement
          </Button>
        </div>

        {/* History Table Container */}
        <div className="bg-white rounded-4 shadow-sm border-0 p-4 mb-4">
          {transactions.length === 0 ? (
            <Empty tip="No transaction history found" />
          ) : (
            <div className="table-responsive">
              <table className="table table-borderless align-middle mb-0">
                <thead>
                  <tr className="border-bottom">
                    <th className="text-muted small text-uppercase fw-semibold pb-3" style={{ fontSize: '11px', letterSpacing: '0.5px', width: '45%' }}>TRANSACTION</th>
                    <th className="text-muted small text-uppercase fw-semibold pb-3" style={{ fontSize: '11px', letterSpacing: '0.5px', width: '30%' }}>AMOUNT</th>
                    <th className="text-muted small text-uppercase fw-semibold pb-3 text-end" style={{ fontSize: '11px', letterSpacing: '0.5px', width: '25%' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => {
                    const isDebit = tx.senderUid === user?.uid && tx.type === 'transfer'
                    const amountText = isDebit ? `-Rs. ${tx.amount.toLocaleString()}` : `+Rs. ${tx.amount.toLocaleString()}`
                    const amountColor = isDebit ? '#ef4444' : '#10b981'

                    return (
                      <tr key={tx._id} className="border-bottom">
                        <td className="py-3">
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="rounded-3 p-2 d-flex align-items-center justify-content-center"
                              style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: isDebit ? '#fee2e2' : '#dcfce7'
                              }}
                            >
                              {isDebit ? (
                                <ArrowUpOutlined style={{ color: '#ef4444', fontSize: '18px' }} />
                              ) : (
                                <ThunderboltOutlined style={{ color: '#10b981', fontSize: '18px' }} />
                              )}
                            </div>
                            <div>
                              <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>{tx.title}</div>
                              <div className="text-muted small">{dayjs(tx.createdAt).format('M/D/YYYY, h:mm A')}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="fw-bold" style={{ fontSize: '14px', color: amountColor }}>
                            {amountText}
                          </span>
                        </td>
                        <td className="py-3 text-end">
                          <div className="d-inline-flex gap-2 align-items-center">
                            <Button
                              size="small"
                              icon={<EyeOutlined />}
                              onClick={() => handleOpenReceipt(tx)}
                              className="d-flex align-items-center gap-1 border-primary-subtle text-primary bg-primary-subtle"
                              style={{ borderRadius: '6px' }}
                            >
                              View
                            </Button>
                            <Popconfirm
                              title="Delete Transaction"
                              tip="Remove this transaction from your history?"
                              onConfirm={() => handleDeleteTransaction(tx._id)}
                              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Button
                                size="small"
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                              />
                            </Popconfirm>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Digital Receipt Modal */}
        <Modal
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          centered
          width={420}
          styles={{ body: { padding: '24px' } }}
        >
          {selectedReceipt && (() => {
            const isDebit = selectedReceipt.senderUid === user?.uid && selectedReceipt.type === 'transfer'
            const headerColor = isDebit ? '#ef4444' : '#10b981'
            const headerBg = isDebit ? '#fee2e2' : '#dcfce7'

            return (
              <>
                <div style={{ height: '4px', backgroundColor: headerColor, marginTop: '-24px', marginHorizontal: '-24px', marginBottom: '20px', borderRadius: '4px 4px 0 0' }}></div>

                {/* Modal Top Info Header */}
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '44px', height: '44px', backgroundColor: headerBg }}>
                    {isDebit ? (
                      <ArrowUpOutlined style={{ color: '#ef4444', fontSize: '18px' }} />
                    ) : (
                      <ArrowDownOutlined style={{ color: '#10b981', fontSize: '18px' }} />
                    )}
                  </div>
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-bold fs-6 text-dark">{selectedReceipt.title}</span>
                      <Tag color="success" className="border-0 rounded-pill px-2 py-0 small">Completed</Tag>
                    </div>
                  </div>
                </div>

                <div className="text-center my-3">
                  <Text className="text-muted small text-uppercase fw-semibold d-block" style={{ fontSize: '10px', letterSpacing: '1px' }}>DIGITAL RECEIPT</Text>
                  <h5 className="fw-bold text-dark m-0">Transaction Info</h5>
                </div>

                {/* Total Amount Box */}
                <div className="rounded-3 p-3 text-center my-3" style={{ backgroundColor: isDebit ? '#fdf2f8' : '#f0fdf4' }}>
                  <Text className="text-muted small text-uppercase fw-semibold d-block mb-1" style={{ fontSize: '10px' }}>TOTAL AMOUNT</Text>
                  <h3 className="fw-bold m-0" style={{ color: isDebit ? '#e11d48' : '#16a34a' }}>
                    Rs. {selectedReceipt.amount?.toLocaleString()}
                  </h3>
                </div>

                {/* Details List */}
                <div className="py-2">
                  <div className="d-flex justify-content-between py-2 border-bottom">
                    <Text className="text-muted small text-uppercase fw-semibold">METHOD</Text>
                    <Text className="fw-bold text-success small">{selectedReceipt.type === 'deposit' ? 'Wallet Deposit' : 'Bank Transfer'}</Text>
                  </div>
                  {selectedReceipt.type === 'transfer' && (
                    <>
                      <div className="d-flex justify-content-between py-2 border-bottom">
                        <Text className="text-muted small text-uppercase fw-semibold">SENDER</Text>
                        <Text className="fw-semibold text-dark small">{selectedReceipt.senderName}</Text>
                      </div>
                      <div className="d-flex justify-content-between py-2 border-bottom">
                        <Text className="text-muted small text-uppercase fw-semibold">RECEIVER</Text>
                        <Text className="fw-semibold text-dark small">{selectedReceipt.receiverName}</Text>
                      </div>
                    </>
                  )}
                  <div className="d-flex justify-content-between py-2 border-bottom">
                    <Text className="text-muted small text-uppercase fw-semibold">DATE</Text>
                    <Text className="fw-bold text-dark small">{dayjs(selectedReceipt.createdAt).format('M/D/YYYY, h:mm:ss A')}</Text>
                  </div>
                  <div className="d-flex justify-content-between py-2">
                    <Text className="text-muted small text-uppercase fw-semibold">REFERENCE ID</Text>
                    <Text className="fw-semibold text-primary small" style={{ fontSize: '11px', fontFamily: 'monospace' }}>
                      {selectedReceipt.refId}
                    </Text>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="d-flex gap-2 mt-4">
                  <Button
                    block
                    icon={<PrinterOutlined />}
                    style={{ borderRadius: '8px', height: '40px' }}
                    className="fw-semibold"
                    onClick={handlePrintReceipt}
                  >
                    Print
                  </Button>
                  <Button
                    type="primary"
                    block
                    icon={<DownloadOutlined />}
                    style={{ backgroundColor: '#2563eb', borderRadius: '8px', height: '40px' }}
                    className="fw-semibold"
                    onClick={handleDownloadStatement}
                  >
                    Save PNG / File
                  </Button>
                </div>
              </>
            )
          })()}
        </Modal>
      </div>
    </Spin>
  )
}

export default History