import { useEffect, useState } from 'react'
import { Switch, Button, Typography, Modal, Input, message, Spin, Form } from 'antd'
import { CheckCircleOutlined, EyeOutlined, LockOutlined, EditOutlined, WifiOutlined, DollarOutlined, CloseCircleOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import axios from 'axios'
import { useAuth } from '@/context/Auth'

const { Text } = Typography

const MyCard = () => {
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [cardData, setCardData] = useState({
    card: { cardNumber: '', expiry: '08/32', cvv: '342', isActive: true, dailyLimit: 50000 },
    fullName: user?.fullName || '',
    accountNumber: ''
  })
  const [showSecurityInfo, setShowSecurityInfo] = useState(false)
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false)
  const [newLimit, setNewLimit] = useState('')
  const [isUpdatingLimit, setIsUpdatingLimit] = useState(false)

  const fetchCardData = () => {
    setLoading(true)
    const jwt = localStorage.getItem('token')
    axios
      .get(`${import.meta.env.VITE_API_URL}/transaction/card`, {
        headers: { Authorization: `Bearer ${jwt}` }
      })
      .then((res) => {
        if (res.status === 200) {
          setCardData(res.data)
        }
      })
      .catch((err) => {
        console.error(err)
        message.error('Failed to load card information.')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchCardData()
  }, [])

  // Handle Card Status Switch Toggle
  const handleToggleCardStatus = (checked) => {
    const jwt = localStorage.getItem('token')
    axios.patch(`${import.meta.env.VITE_API_URL}/transaction/card/status`, { isActive: checked }, { headers: { Authorization: `Bearer ${jwt}` } })
      .then((res) => {
        if (res.status === 200) {
          message.success(res.data.message || `Card ${checked ? 'activated' : 'deactivated'}`)
          setCardData((prev) => ({
            ...prev,
            card: res.data.card
          }))
        }
      })
      .catch((err) => {
        console.error(err)
        message.error('Failed to update card status.')
      })
  }

  // Handle Daily Limit Update
  const handleUpdateLimit = () => {
    const limitNum = Number(newLimit)
    if (isNaN(limitNum) || limitNum < 0) {
      return message.error('Please enter a valid limit amount.')
    }

    setIsUpdatingLimit(true)
    const jwt = localStorage.getItem('token')
    axios
      .patch(
        `${import.meta.env.VITE_API_URL}/transaction/card/limit`,
        { dailyLimit: limitNum },
        { headers: { Authorization: `Bearer ${jwt}` } }
      )
      .then((res) => {
        if (res.status === 200) {
          message.success(res.data.message || 'Daily limit updated!')
          setCardData((prev) => ({
            ...prev,
            card: res.data.card
          }))
          setIsLimitModalOpen(false)
          setNewLimit('')
        }
      })
      .catch((err) => {
        console.error(err)
        message.error('Failed to update daily limit.')
      })
      .finally(() => {
        setIsUpdatingLimit(false)
      })
  }

  const { card, fullName } = cardData
  const userName = fullName || user?.fullName || 'TALHA IFTIKHAR'
  const cardNumberStr = card?.cardNumber || '4743 8812 9012 0700'
  const maskedCardNumber = showSecurityInfo
    ? cardNumberStr
    : `**** **** **** ${cardNumberStr.slice(-4)}`

  return (
    <Spin spinning={loading}>
      <div className="container px-0 py-2">
        {/* Header Title */}
        <div className="mb-4">
          <h4 className="fw-bold fst-italic text-uppercase m-0 text-dark" style={{ letterSpacing: '1px' }}>
            MY VIRTUAL CARD
          </h4>
        </div>

        <div className="row g-4 align-items-stretch">
          {/* Left Column: Virtual Credit Card */}
          <div className="col-12 col-lg-6">
            <div
              className="p-4 p-md-5 rounded-4 text-white shadow-lg d-flex flex-column justify-content-between h-100"
              style={{
                background: card?.isActive
                  ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
                  : 'linear-gradient(135deg, #475569 0%, #334155 100%)',
                minHeight: '260px',
                position: 'relative',
                overflow: 'hidden',
                opacity: card?.isActive ? 1 : 0.8
              }}
            >
              {/* Top row */}
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h5 className="fw-bold m-0 text-white text-uppercase" style={{ letterSpacing: '1.5px' }}>
                    BANK DIGITAL
                  </h5>
                  <span className="small text-uppercase opacity-75" style={{ fontSize: '10px', letterSpacing: '2px' }}>
                    {card?.isActive ? 'PREMIUM ACTIVE' : 'FROZEN / INACTIVE'}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <WifiOutlined style={{ fontSize: '20px', transform: 'rotate(90deg)', opacity: 0.8 }} />
                  {/* Chip graphic */}
                  <div
                    style={{
                      width: '42px',
                      height: '30px',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      borderRadius: '6px',
                      border: '1px solid #b45309'
                    }}
                  ></div>
                </div>
              </div>

              {/* Card Number */}
              <div className="my-3 text-center text-md-start">
                <span className="fw-bold" style={{ fontSize: '22px', letterSpacing: '4px', fontFamily: 'monospace' }}>
                  {maskedCardNumber}
                </span>
              </div>

              {/* Bottom Card details */}
              <div className="d-flex justify-content-between align-items-end mt-3">
                <div className="d-flex gap-4">
                  <div>
                    <Text className="text-white-50 d-block text-uppercase" style={{ fontSize: '9px', letterSpacing: '0.5px' }}>CARD HOLDER</Text>
                    <span className="fw-bold text-uppercase" style={{ fontSize: '13px', letterSpacing: '1px' }}>
                      {userName}
                    </span>
                  </div>
                  <div>
                    <Text className="text-white-50 d-block text-uppercase" style={{ fontSize: '9px', letterSpacing: '0.5px' }}>EXPIRES</Text>
                    <span className="fw-bold" style={{ fontSize: '13px', fontFamily: 'monospace' }}>
                      {card?.expiry || '08/32'}
                    </span>
                  </div>
                  {showSecurityInfo && (
                    <div>
                      <Text className="text-white-50 d-block text-uppercase" style={{ fontSize: '9px', letterSpacing: '0.5px' }}>CVV</Text>
                      <span className="fw-bold text-warning" style={{ fontSize: '13px', fontFamily: 'monospace' }}>
                        {card?.cvv || '342'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Mastercard Logo */}
                <div className="d-flex align-items-center">
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#EB001B', opacity: 0.9 }}></div>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#F79E1B', marginLeft: '-10px', opacity: 0.9 }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Management Options */}
          <div className="col-12 col-lg-6">
            <div className="bg-white rounded-4 p-4 shadow-sm border-0 h-100 d-flex flex-column justify-content-between">
              <div>
                {/* Management Header */}
                <div className="d-flex align-items-center gap-2 mb-4">
                  <div style={{ width: '4px', height: '18px', backgroundColor: '#2563eb', borderRadius: '2px' }}></div>
                  <h6 className="fw-bold text-dark m-0 text-uppercase" style={{ letterSpacing: '0.5px' }}>
                    MANAGEMENT
                  </h6>
                </div>

                {/* Management Option List */}
                <div className="d-flex flex-column gap-3 mb-4">
                  {/* Item 1: Card Status */}
                  <div className="p-3 rounded-4 d-flex align-items-center justify-content-between" style={{ backgroundColor: '#f8fafc' }}>
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="rounded-3 p-2 d-flex align-items-center justify-content-center"
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: card?.isActive ? '#dcfce7' : '#fee2e2'
                        }}
                      >
                        {card?.isActive ? (
                          <CheckCircleOutlined style={{ color: '#10b981', fontSize: '20px' }} />
                        ) : (
                          <CloseCircleOutlined style={{ color: '#ef4444', fontSize: '20px' }} />
                        )}
                      </div>
                      <div>
                        <div className="fw-bold text-dark" style={{ fontSize: '13px' }}>CARD STATUS</div>
                        <div className="text-muted small" style={{ fontSize: '11px' }}>
                          {card?.isActive ? 'Active & Ready' : 'Frozen / Disabled'}
                        </div>
                      </div>
                    </div>
                    <Switch checked={card?.isActive} onChange={handleToggleCardStatus} />
                  </div>

                  {/* Item 2: Security Info */}
                  <div className="p-3 rounded-4 d-flex align-items-center justify-content-between" style={{ backgroundColor: '#f8fafc' }}>
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-3 p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: '#dbeafe' }}>
                        {showSecurityInfo ? (
                          <EyeInvisibleOutlined style={{ color: '#3b82f6', fontSize: '20px' }} />
                        ) : (
                          <EyeOutlined style={{ color: '#3b82f6', fontSize: '20px' }} />
                        )}
                      </div>
                      <div>
                        <div className="fw-bold text-dark" style={{ fontSize: '13px' }}>SECURITY INFO</div>
                        <div className="text-muted small" style={{ fontSize: '11px' }}>
                          {showSecurityInfo ? `CVV: ${card?.cvv || '342'}` : 'Reveal CVV & Full Number'}
                        </div>
                      </div>
                    </div>
                    <Button
                      type="link"
                      className="fw-bold text-primary text-uppercase p-0 small"
                      onClick={() => setShowSecurityInfo(!showSecurityInfo)}
                    >
                      {showSecurityInfo ? 'HIDE' : 'SHOW'}
                    </Button>
                  </div>

                  {/* Item 3: Daily Limit */}
                  <div className="p-3 rounded-4 d-flex align-items-center justify-content-between" style={{ backgroundColor: '#f8fafc' }}>
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-3 p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: '#f3e8ff' }}>
                        <LockOutlined style={{ color: '#8b5cf6', fontSize: '20px' }} />
                      </div>
                      <div>
                        <div className="fw-bold text-dark" style={{ fontSize: '13px' }}>DAILY LIMIT</div>
                        <div className="text-muted small" style={{ fontSize: '11px' }}>
                          Rs. {(card?.dailyLimit || 50000).toLocaleString()} / day
                        </div>
                      </div>
                    </div>
                    <Button
                      type="text"
                      icon={<EditOutlined style={{ color: '#64748b' }} />}
                      onClick={() => {
                        setNewLimit(card?.dailyLimit || 50000)
                        setIsLimitModalOpen(true)
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Button */}
              <Button
                type="primary"
                size="large"
                block
                className="fw-bold"
                onClick={() => message.success('Digital Card protection and 256-bit encryption are active.')}
                style={{
                  backgroundColor: '#0f172a',
                  borderColor: '#0f172a',
                  height: '48px',
                  borderRadius: '12px'
                }}
              >
                Secure Digital Banking
              </Button>
            </div>
          </div>
        </div>

        {/* Update Limit Modal */}
        <Modal
          title={<span className="fw-bold fs-5">Update Daily Spending Limit</span>}
          open={isLimitModalOpen}
          onCancel={() => setIsLimitModalOpen(false)}
          onOk={handleUpdateLimit}
          confirmLoading={isUpdatingLimit}
          okText="Save Limit"
          centered
        >
          <Form layout="vertical" onFinish={handleUpdateLimit} className="pt-3">
            <Form.Item label="NEW DAILY LIMIT (RS.)" required>
              <Input
                size="large"
                placeholder="e.g. 50000"
                prefix={<DollarOutlined className="text-muted me-1" />}
                name="dailyLimit"
                value={newLimit}
                onChange={(e) => setNewLimit(e.target.value)}
                type="number"
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Spin>
  )
}

export default MyCard