import { useEffect, useState } from 'react'
import { Card, Col, Row, Typography, Switch, InputNumber, Button, Alert, Form, Select, message, Spin, Space } from 'antd'
import { SafetyCertificateOutlined, SafetyOutlined, LockOutlined, CheckCircleOutlined, SaveOutlined, ReloadOutlined } from '@ant-design/icons'
import axios from 'axios'

const { Title, Text } = Typography
const { Option } = Select

const SecurityAndLimits = () => {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [settings, setSettings] = useState({
        allowTransfers: true,
        maxDailyTransfer: 50000,
        perTransactionLimit: 50000,
        systemStatus: "High"
    })

    const fetchSecuritySettings = async () => {
        setLoading(true)
        const jwt = localStorage.getItem("token")
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/admin/security-settings`, {
                headers: { Authorization: `Bearer ${jwt}` }
            })
            if (res.status === 200 && res.data.settings) {
                setSettings(res.data.settings)
            }
        } catch (error) {
            console.error(error)
            message.error("Failed to load security settings")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSecuritySettings()
    }, [])

    const saveSettingsPayload = async (payload) => {
        setSaving(true)
        const jwt = localStorage.getItem("token")
        try {
            const res = await axios.patch(
                `${import.meta.env.VITE_API_URL}/auth/admin/security-settings`,
                payload,
                { headers: { Authorization: `Bearer ${jwt}` } }
            )
            if (res.status === 200) {
                message.success(res.data.message || "Security policy updated successfully")
                if (res.data.settings) setSettings(res.data.settings)
            }
        } catch (error) {
            console.error(error)
            message.error("Failed to update security settings")
        } finally {
            setSaving(false)
        }
    }

    const handleUpdateSettings = () => {
        saveSettingsPayload(settings)
    }

    const handleToggleAllowTransfers = (checked) => {
        const updated = { ...settings, allowTransfers: checked }
        setSettings(updated)
        saveSettingsPayload(updated)
    }

    return (
        <div className="container py-2">
            {/* Page Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <div>
                    <Title level={2} className="mb-0 fw-bold" style={{ color: '#0f172a' }}>
                        SECURITY & GUARDRAILS
                    </Title>
                    <Text type="secondary">Configure global transaction thresholds, money movement toggles, and system access controls</Text>
                </div>
                <Button icon={<ReloadOutlined />} onClick={fetchSecuritySettings} loading={loading}>
                    Refresh Policy
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <Spin size="large" description="Loading security configurations..." />
                </div>
            ) : (
                <>
                    {/* Active Protection Alert Banner */}
                    <Alert
                        title={
                            <div className="d-flex align-items-center gap-2">
                                <CheckCircleOutlined style={{ fontSize: '18px', color: '#16a34a' }} />
                                <span className="fw-bold" style={{ color: '#15803d' }}>
                                    Active Protection: System Security Status is {settings.systemStatus || 'High'}
                                </span>
                            </div>
                        }
                        description={
                            <span style={{ color: '#166534' }}>
                                All transaction guardrails are actively enforced across the network. {settings.allowTransfers ? 'Transfers & deposits are enabled.' : '⚠️ ALL TRANSFERS & DEPOSITS ARE CURRENTLY DISABLED BY ADMIN.'}
                            </span>
                        }
                        type={settings.allowTransfers ? 'success' : 'warning'}
                        showIcon={false}
                        className="mb-4 rounded-4 shadow-sm"
                        style={{ border: '1px solid #bbf7d0', padding: '16px' }}
                    />

                    <Row gutter={[20, 20]}>
                        {/* Column 1: Transaction Controls */}
                        <Col xs={24} lg={12}>
                            <Card
                                title={
                                    <div className="d-flex align-items-center gap-2">
                                        <LockOutlined style={{ color: '#0284c7' }} />
                                        <span className="fw-bold">Transaction Controls</span>
                                    </div>
                                }
                                variant={false}
                                className="shadow-sm rounded-4 h-100"
                                style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}
                            >
                                <div className="vstack gap-4">
                                    {/* Control 1: Allow Transfers & Deposits */}
                                    <div className="d-flex align-items-center justify-content-between p-3 rounded-3" style={{ background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                        <div>
                                            <div className="fw-bold text-dark mb-1">Allow Transfers & Money Additions</div>
                                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                                Enable or disable all user transfers and deposits platform-wide.
                                            </Text>
                                        </div>
                                        <Switch
                                            checked={settings.allowTransfers}
                                            onChange={handleToggleAllowTransfers}
                                            checkedChildren="ON"
                                            unCheckedChildren="OFF"
                                        />
                                    </div>

                                    {/* Control 2: System Security Protection Status */}
                                    <div className="p-3 rounded-3" style={{ background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                        <div className="fw-bold text-dark mb-1">System Security Status</div>
                                        <Text type="secondary" style={{ fontSize: '12px', display: 'block' }} className="mb-2">
                                            Adjust the active system protection profile.
                                        </Text>
                                        <Select
                                            size="large"
                                            style={{ width: '100%' }}
                                            value={settings.systemStatus}
                                            onChange={val => setSettings({ ...settings, systemStatus: val })}
                                        >
                                            <Option value="High">High Security (Standard)</Option>
                                            <Option value="Enhanced">Enhanced Protection (Strict)</Option>
                                            <Option value="Maintenance">Maintenance Mode</Option>
                                        </Select>
                                    </div>
                                </div>
                            </Card>
                        </Col>

                        {/* Column 2: Threshold Limits */}
                        <Col xs={24} lg={12}>
                            <Card
                                title={
                                    <div className="d-flex align-items-center gap-2">
                                        <SafetyOutlined style={{ color: '#0284c7' }} />
                                        <span className="fw-bold">Threshold Limits</span>
                                    </div>
                                }
                                variant={false}
                                className="shadow-sm rounded-4 h-100 d-flex flex-column justify-content-between"
                                style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}
                            >
                                <Form layout="vertical">
                                    <Form.Item label={<span className="fw-semibold">MAX DAILY TRANSFER (PKR)</span>}>
                                        <InputNumber
                                            size="large"
                                            style={{ width: '100%', borderRadius: 8 }}
                                            formatter={val => `Rs. ${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={val => val.replace(/Rs\.\s?|(,*)/g, '')}
                                            value={settings.maxDailyTransfer}
                                            onChange={val => setSettings({ ...settings, maxDailyTransfer: val || 0 })}
                                        />
                                    </Form.Item>

                                    <Form.Item label={<span className="fw-semibold">PER TRANSACTION LIMIT (PKR)</span>}>
                                        <InputNumber
                                            size="large"
                                            style={{ width: '100%', borderRadius: 8 }}
                                            formatter={val => `Rs. ${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={val => val.replace(/Rs\.\s?|(,*)/g, '')}
                                            value={settings.perTransactionLimit}
                                            onChange={val => setSettings({ ...settings, perTransactionLimit: val || 0 })}
                                        />
                                    </Form.Item>
                                </Form>

                                <div className="mt-4 pt-3 border-top">
                                    <Button
                                        type="primary"
                                        size="large"
                                        block
                                        icon={<SaveOutlined />}
                                        loading={saving}
                                        onClick={handleUpdateSettings}
                                        style={{ background: '#0284c7', borderColor: '#0284c7', borderRadius: '8px', height: '48px', fontWeight: 600 }}
                                    >
                                        UPDATE SECURITY POLICY
                                    </Button>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </div>
    )
}

export default SecurityAndLimits