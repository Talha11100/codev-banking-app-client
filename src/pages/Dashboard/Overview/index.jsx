import { useEffect, useState } from 'react'
import { Tag, Progress, Typography, Button, Modal, Input, message, Spin, Form, Alert } from 'antd'
import { EyeOutlined, EyeInvisibleOutlined, PlusOutlined, SendOutlined, CreditCardOutlined, HistoryOutlined, WalletOutlined, ArrowUpOutlined, ThunderboltOutlined, SafetyOutlined, DollarOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/Auth'
import axios from 'axios'

const { Text } = Typography

const Overview = () => {
  const { user, dispatch } = useAuth()
  const navigate = useNavigate()

  const [showBalance, setShowBalance] = useState(true)
  const [loading, setLoading] = useState(true)
  const [summaryData, setSummaryData] = useState({
    user: {},
    stats: { totalExpense: 0, totalCredits: 0, transactionCount: 0 }
  })

  // Deposit modal state
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [isSubmittingDeposit, setIsSubmittingDeposit] = useState(false)

  const fetchSummary = () => {
    setLoading(true)
    const jwt = localStorage.getItem('token')
    axios
      .get(`${import.meta.env.VITE_API_URL}/transaction/summary`, {
        headers: { Authorization: `Bearer ${jwt}` }
      })
      .then((res) => {
        const { status, data } = res
        if (status === 200) {
          setSummaryData(data)
          if (data.user?.balance !== undefined) {
            dispatch({ type: 'UPDATE_USER', payload: { user: data.user } })
          }
        }
      })
      .catch((err) => {
        console.error(err)
        message.error('Failed to load dashboard summary.')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => { fetchSummary() }, [])

  const handleDeposit = () => {
    const amountNum = Number(depositAmount)
    if (isNaN(amountNum) || amountNum <= 0) {
      return message.error('Please enter a valid deposit amount.')
    }

    setIsSubmittingDeposit(true)
    const jwt = localStorage.getItem('token')
    axios.post(`${import.meta.env.VITE_API_URL}/transaction/deposit`, { amount: amountNum }, { headers: { Authorization: `Bearer ${jwt}` } })
      .then((res) => {
        const { status, data } = res
        if (status === 200) {
          message.success(data.message || 'Deposit successful!')
          setIsDepositModalOpen(false)
          setDepositAmount('')
          fetchSummary()
        }
      })
      .catch((err) => {
        console.error(err)
        message.error(err.response?.data?.message || 'Deposit failed.')
      })
      .finally(() => {
        setIsSubmittingDeposit(false)
      })
  }

  const currentUser = summaryData.user?.balance !== undefined ? summaryData.user : user
  const userName = currentUser?.fullName || 'Customer'
  const balance = currentUser?.balance !== undefined ? currentUser.balance : 10000
  const accountNumber = currentUser?.accountNumber || 'PK DB3250734743'
  const cardNumber = currentUser?.card?.cardNumber || '4743 8812 9012 0700'
  const maskedCardNumber = `**** **** **** ${cardNumber.slice(-4)}`

  const totalExpense = summaryData.stats?.totalExpense || 0
  const totalFlow = balance + totalExpense
  const expensePercent = totalFlow > 0 ? Math.min(100, Math.round((totalExpense / totalFlow) * 100)) : 0

  return (
    <>
      <Spin spinning={loading}>
        <div className="container px-0 py-2">
          {/* Top Cards Row */}
          <div className="row g-4 mb-4">
            {/* Left Card - Virtual Bank Card */}
            <div className="col-12 col-lg-7">
              <div
                className="p-4 rounded-4 text-white d-flex flex-column justify-content-between shadow-sm"
                style={{
                  background: 'linear-gradient(135deg, #2D142C 0%, #150918 100%)',
                  minHeight: '210px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        TOTAL BALANCE
                      </Text>
                      <div className="d-flex align-items-center gap-2 mt-1">
                        <span style={{ fontSize: '26px', fontWeight: 'bold' }}>
                          {showBalance ? `Rs. ${balance.toLocaleString()}` : 'Rs. ••••••'}
                        </span>
                        <Button
                          type="text"
                          className="p-0 text-white"
                          icon={showBalance ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                          onClick={() => setShowBalance(!showBalance)}
                        />
                      </div>
                    </div>

                    {/* Mastercard Logo */}
                    <div className="d-flex align-items-center">
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#EB001B', opacity: 0.9 }}></div>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#F79E1B', marginLeft: '-10px', opacity: 0.9 }}></div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-end mt-4">
                  <div>
                    <div style={{ fontSize: '14px', letterSpacing: '2px', opacity: 0.85, fontFamily: 'monospace' }} className="mb-2">
                      {maskedCardNumber}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {userName}
                    </div>
                  </div>
                  <div
                    className="bg-white rounded-3 p-2 d-flex align-items-center justify-content-center shadow-sm"
                    style={{ width: '36px', height: '36px', cursor: 'pointer' }}
                    onClick={() => navigate('/dashboard/transfer')}
                  >
                    <SendOutlined style={{ color: '#2D142C', fontSize: '16px' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card - Account Info */}
            <div className="col-12 col-lg-5">
              <div className="bg-white rounded-4 p-4 shadow-sm h-100 d-flex flex-column justify-content-between">
                <div>
                  <Text className="text-muted small text-uppercase fw-semibold d-block mb-1" style={{ letterSpacing: '0.5px' }}>
                    ACCOUNT HOLDER
                  </Text>
                  <div className="mb-3">
                    <div className="fw-bold text-dark fs-5">{userName}</div>
                    <Tag color="processing" className="border-0 rounded-pill px-2 py-0 text-primary small mt-1">
                      Verified Account
                    </Tag>
                  </div>
                </div>

                <div className="pt-3 border-top">
                  <Text className="text-muted small text-uppercase fw-semibold d-block mb-1" style={{ letterSpacing: '0.5px' }}>
                    ACCOUNT NUMBER
                  </Text>
                  <span className="fw-bold text-dark fs-6" style={{ fontFamily: 'monospace' }}>
                    {accountNumber}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Icons Row */}
          <div className="row g-3 mb-4">
            {[
              {
                label: 'ADD MONEY',
                icon: <PlusOutlined style={{ fontSize: '20px', color: '#f97316' }} />,
                color: '#fff7ed',
                onClick: () => setIsDepositModalOpen(true)
              },
              {
                label: 'SEND',
                icon: <SendOutlined style={{ fontSize: '20px', color: '#2563eb' }} />,
                color: '#eff6ff',
                onClick: () => navigate('/dashboard/transfer')
              },
              {
                label: 'CARDS',
                icon: <CreditCardOutlined style={{ fontSize: '20px', color: '#9333ea' }} />,
                color: '#faf5ff',
                onClick: () => navigate('/dashboard/card')
              },
              {
                label: 'HISTORY',
                icon: <HistoryOutlined style={{ fontSize: '20px', color: '#0d9488' }} />,
                color: '#f0fdfa',
                onClick: () => navigate('/dashboard/history')
              },
              {
                label: 'WALLET',
                icon: <WalletOutlined style={{ fontSize: '20px', color: '#ea580c' }} />,
                color: '#fff7ed',
                onClick: () => message.info(`Current Wallet Balance: Rs. ${balance.toLocaleString()}`)
              }
            ].map((action, idx) => (
              <div className="col" key={idx}>
                <div
                  className="bg-white rounded-4 p-3 text-center shadow-sm h-100 d-flex flex-column align-items-center justify-content-center"
                  style={{ cursor: 'pointer' }}
                  onClick={action.onClick}
                >
                  <div className="rounded-circle d-flex align-items-center justify-content-center mb-2" style={{ width: '48px', height: '48px', backgroundColor: action.color }}>
                    {action.icon}
                  </div>
                  <span className="fw-bold text-secondary" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                    {action.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Account Insights Section */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold m-0 text-dark">Account Insights</h6>
              <Button type="link" className="p-0 text-primary small" onClick={() => navigate('/dashboard/history')}>View Reports</Button>
            </div>

            <div className="row g-4">
              {/* Card 1: Debit / Expense */}
              <div className="col-12 col-md-4">
                <div className="bg-white rounded-4 p-4 shadow-sm h-100">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="bg-danger-subtle rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                      <ArrowUpOutlined className="text-danger" />
                    </div>
                    <Tag color="error" className="m-0 border-0 fw-semibold px-2">EXPENSE</Tag>
                  </div>
                  <Text className="text-muted small d-block">Debit</Text>
                  <h4 className="fw-bold text-dark my-1">Rs. {totalExpense.toLocaleString()}</h4>
                  <Progress percent={expensePercent} showInfo={false} strokeColor="#ef4444" size="small" className="my-2" />
                  <Text className="text-muted small fw-semibold" style={{ fontSize: '10px' }}>{expensePercent}% OF TOTAL CASH FLOW</Text>
                </div>
              </div>

              {/* Card 2: Available Credit / Savings */}
              <div className="col-12 col-md-4">
                <div className="bg-white rounded-4 p-4 shadow-sm h-100">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="bg-success-subtle rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                      <ThunderboltOutlined className="text-success" />
                    </div>
                    <Tag color="success" className="m-0 border-0 fw-semibold px-2">SAVINGS</Tag>
                  </div>
                  <Text className="text-muted small d-block">Available Credit</Text>
                  <h4 className="fw-bold text-dark my-1">Rs. {balance.toLocaleString()}</h4>
                  <Progress percent={100 - expensePercent} showInfo={false} strokeColor="#10b981" size="small" className="my-2" />
                  <Text className="text-muted small fw-semibold" style={{ fontSize: '10px' }}>{100 - expensePercent}% AVAILABLE FOR USE</Text>
                </div>
              </div>

              {/* Card 3: Security Level */}
              <div className="col-12 col-md-4">
                <div className="rounded-4 p-4 text-white h-100 shadow-sm d-flex flex-column justify-content-between" style={{ background: 'linear-gradient(135deg, #0242a5 0%, #002b75 100%)' }}>
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="bg-white bg-opacity-20 rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                        <SafetyOutlined className="text-white" />
                      </div>
                      <div className="d-flex gap-1">
                        <span className="bg-white rounded-pill" style={{ width: '4px', height: '12px', opacity: 0.8 }}></span>
                        <span className="bg-white rounded-pill" style={{ width: '4px', height: '12px', opacity: 0.8 }}></span>
                        <span className="bg-white rounded-pill" style={{ width: '4px', height: '12px', opacity: 0.8 }}></span>
                      </div>
                    </div>
                    <Text className="text-white-50 small d-block text-uppercase fw-semibold" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>SECURITY LEVEL</Text>
                    <h4 className="fw-bold text-white my-1">Excellent</h4>
                  </div>
                  <Text className="text-white-50 small fw-bold text-uppercase mt-3" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>2FA & ENCRYPTION ACTIVE</Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Spin>

      {/* Add Money Modal */}
      <Modal
        title={<span className="fw-bold fs-5">Add Money to Wallet</span>}
        open={isDepositModalOpen}
        onCancel={() => {
          setIsDepositModalOpen(false)
          setDepositAmount('')
        }}
        onOk={handleDeposit}
        confirmLoading={isSubmittingDeposit}
        okText="Add Money"
        okButtonProps={{
          disabled: summaryData.securityPolicy?.allowTransfers === false,
          style: {
            backgroundColor: summaryData.securityPolicy?.allowTransfers === false ? '#94a3b8' : '#f97316',
            borderColor: summaryData.securityPolicy?.allowTransfers === false ? '#94a3b8' : '#f97316'
          }
        }}
        centered
      >
        <Form layout="vertical" onFinish={handleDeposit} className="pt-3">
          {summaryData.securityPolicy?.allowTransfers === false && (
            <Alert
              message={<span className="fw-bold">Money Additions Suspended</span>}
              description="Transfers and money additions are currently disabled platform-wide by the system administrator."
              type="error"
              showIcon
              className="mb-3 rounded-3"
            />
          )}
          <Form.Item label="AMOUNT (RS.)" required>
            <Input
              size="large"
              placeholder="e.g. 5000"
              prefix={<DollarOutlined className="text-muted me-1" />}
              name="amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              type="number"
              disabled={summaryData.securityPolicy?.allowTransfers === false}
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default Overview