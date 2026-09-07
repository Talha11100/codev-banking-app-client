import { useEffect, useState } from 'react'
import { Form, Input, Button, Typography, message, Spin, Alert, Card, Progress } from 'antd'
import { EyeOutlined, EyeInvisibleOutlined, UserOutlined, DollarOutlined, SendOutlined, SafetyOutlined, WarningOutlined } from '@ant-design/icons'
import axios from 'axios'
import { useAuth } from '@/context/Auth'

const { Text } = Typography

const initialState = { receiverAccountNumber: '', amount: '' }

const Transfer = () => {
  const { user, dispatch } = useAuth()
  const [state, setState] = useState(initialState)
  const [showAmount, setShowAmount] = useState(true)
  const [loadingBalance, setLoadingBalance] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentBalance, setCurrentBalance] = useState(user?.balance !== undefined ? user.balance : 10000)
  const [securityPolicy, setSecurityPolicy] = useState({
    allowTransfers: true,
    maxDailyTransfer: 50000,
    perTransactionLimit: 50000,
    dailyTransferTotal: 0,
    remainingDailyTransfer: 50000
  })

  const fetchCurrentSummary = () => {
    setLoadingBalance(true)
    const jwt = localStorage.getItem('token')
    axios.get(`${import.meta.env.VITE_API_URL}/transaction/summary`, { headers: { Authorization: `Bearer ${jwt}` } })
      .then((res) => {
        const { status, data } = res
        if (status === 200 && data.user) {
          const bal = data.user.balance
          setCurrentBalance(bal)
          dispatch({ type: 'UPDATE_USER', payload: { user: data.user } })
          if (data.securityPolicy) {
            setSecurityPolicy(data.securityPolicy)
          }
        }
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoadingBalance(false)
      })
  }

  useEffect(() => { fetchCurrentSummary() }, [])

  const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

  const handleTransfer = () => {
    if (securityPolicy.allowTransfers === false) {
      return message.error('Transfers and transactions are currently disabled platform-wide by the system administrator.')
    }

    const { receiverAccountNumber, amount } = state
    const cleanAccountNumber = receiverAccountNumber ? receiverAccountNumber.trim() : ''
    const transferAmount = Number(amount)

    if (!cleanAccountNumber) {
      return message.error('Please enter receiver Account Number.')
    }
    if (isNaN(transferAmount) || transferAmount <= 0) {
      return message.error('Please enter a valid transfer amount.')
    }
    if (transferAmount > currentBalance) {
      return message.error('Insufficient available balance for this transfer.')
    }
    if (securityPolicy.perTransactionLimit && transferAmount > securityPolicy.perTransactionLimit) {
      return message.error(`Transfer amount exceeds maximum per-transaction limit of Rs. ${securityPolicy.perTransactionLimit.toLocaleString()}`)
    }
    if (securityPolicy.maxDailyTransfer && (securityPolicy.dailyTransferTotal + transferAmount) > securityPolicy.maxDailyTransfer) {
      return message.error(`Transfer exceeds maximum daily transfer limit of Rs. ${securityPolicy.maxDailyTransfer.toLocaleString()}. Remaining allowance today: Rs. ${(securityPolicy.remainingDailyTransfer || 0).toLocaleString()}`)
    }

    setIsSubmitting(true)
    const jwt = localStorage.getItem('token')

    axios.post(`${import.meta.env.VITE_API_URL}/transaction/transfer`, { receiverAccountNumber: cleanAccountNumber, amount: transferAmount }, { headers: { Authorization: `Bearer ${jwt}` } })
      .then((res) => {
        const { status, data } = res
        if (status === 200) {
          message.success(data.message || 'Money transferred successfully!')
          const newBal = data.newBalance
          setCurrentBalance(newBal)
          fetchCurrentSummary()
          setState(initialState)
        }
      })
      .catch((err) => {
        console.error(err)
        message.error(err.response?.data?.message || 'Transfer failed. Please check details.')
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  const isTransfersDisabled = securityPolicy.allowTransfers === false

  return (
    <div className="container px-0 py-2">
      {/* Centered Transfer Card */}
      <div className="row justify-content-center my-4">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="bg-white rounded-4 p-4 p-md-5 shadow-sm border-0">
            <h3 className="fw-bold mb-4 text-dark text-center text-md-start">
              Transfer <span className="text-primary">Money</span>
            </h3>

            {/* Platform Guardrail Alert if Disabled */}
            {isTransfersDisabled && (
              <Alert
                message={<span className="fw-bold">Transactions Suspended</span>}
                description="Transfers and money additions are currently disabled platform-wide by the system administrator."
                type="error"
                showIcon
                icon={<WarningOutlined />}
                className="mb-4 rounded-3"
              />
            )}

            {/* Dark Balance Header Box */}
            <Spin spinning={loadingBalance}>
              <div
                className="p-4 rounded-4 text-white mb-4 d-flex flex-column justify-content-between"
                style={{ background: '#0d192b' }}
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isTransfersDisabled ? '#ef4444' : '#22c55e', display: 'inline-block' }}></span>
                  <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', fontWeight: '600' }}>
                    Available Amount
                  </Text>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <span style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    {showAmount ? `Rs. ${currentBalance.toLocaleString()}` : 'Rs. ••••••'}
                  </span>
                  <Button
                    type="text"
                    className="p-0 text-white opacity-75"
                    icon={showAmount ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    onClick={() => setShowAmount(!showAmount)}
                  />
                </div>
              </div>

              {/* Daily Limit Info Card */}
              <div className="p-3 mb-4 rounded-3 border" style={{ backgroundColor: '#f8fafc' }}>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="fw-bold text-dark small d-flex align-items-center gap-1">
                    <SafetyOutlined style={{ color: '#0284c7' }} /> Daily Transfer Limit Guardrail
                  </span>
                  <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                    Max: Rs. {(securityPolicy.maxDailyTransfer || 0).toLocaleString()}
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center small text-muted mb-1">
                  <span>Transferred Today: <strong>Rs. {(securityPolicy.dailyTransferTotal || 0).toLocaleString()}</strong></span>
                  <span>Remaining: <strong style={{ color: '#16a34a' }}>Rs. {(securityPolicy.remainingDailyTransfer || 0).toLocaleString()}</strong></span>
                </div>
                <Progress
                  percent={securityPolicy.maxDailyTransfer ? Math.min(100, Math.round(((securityPolicy.dailyTransferTotal || 0) / securityPolicy.maxDailyTransfer) * 100)) : 0}
                  size="small"
                  strokeColor={isTransfersDisabled ? '#ef4444' : '#0284c7'}
                  showInfo={false}
                />
              </div>
            </Spin>

            {/* Ant Design Form matching Login.jsx style */}
            <Form layout="vertical" onFinish={handleTransfer}>
              <Form.Item label="RECEIVER ACCOUNT NUMBER" required className="mb-4">
                <Input
                  size="large"
                  placeholder="e.g. PK DB3250734743"
                  prefix={<UserOutlined className="text-muted me-1" />}
                  name="receiverAccountNumber"
                  value={state.receiverAccountNumber}
                  onChange={handleChange}
                  disabled={isTransfersDisabled}
                  style={{ borderRadius: '12px', height: '48px' }}
                />
              </Form.Item>

              <Form.Item label="AMOUNT (RS.)" required className="mb-4">
                <Input
                  size="large"
                  placeholder="0.00"
                  prefix={<DollarOutlined className="text-muted me-1" />}
                  name="amount"
                  value={state.amount}
                  onChange={handleChange}
                  type="number"
                  disabled={isTransfersDisabled}
                  style={{ borderRadius: '12px', height: '48px' }}
                />
              </Form.Item>

              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={isSubmitting}
                  disabled={isTransfersDisabled}
                  className="d-flex align-items-center justify-content-center gap-2 fw-bold"
                  style={{
                    backgroundColor: isTransfersDisabled ? '#94a3b8' : '#0d192b',
                    borderColor: isTransfersDisabled ? '#94a3b8' : '#0d192b',
                    height: '50px',
                    borderRadius: '12px',
                    fontSize: '15px'
                  }}
                >
                  {isTransfersDisabled ? 'Transfers Disabled' : 'Send Money'} <SendOutlined />
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Transfer