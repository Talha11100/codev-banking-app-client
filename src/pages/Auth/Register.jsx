import { useEffect, useState } from "react"
import { Form, Input, Button, message, Select } from "antd"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Aos from "aos"
import { BankOutlined, LockOutlined, MailOutlined, UserOutlined, PhoneOutlined, HomeOutlined, IdcardOutlined, EnvironmentOutlined } from "@ant-design/icons"

const { Option } = Select

const initialState = {
    fullName: "", email: "", dateOfBirth: "",
    cnic: "", mobileNo: "",
    address: "", city: "", province: "", country: "",
    password: "", confirmPassword: ""
}

const Register = () => {
    useEffect(() => {
        Aos.init({ duration: 1000, once: true, easing: "ease-in-out" })
    }, [])

    const [isProcessing, setIsProcessing] = useState(false)
    const [state, setState] = useState(initialState)
    const [step, setStep] = useState(1) // 1 = personal info, 2 = identity & address, 3 = security
    const navigate = useNavigate()

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))
    const handleSelect = (field, value) => setState(s => ({ ...s, [field]: value }))

    // Step 1 - Validate personal info
    const handleStep1 = () => {
        const { fullName, email, dateOfBirth } = state
        if (fullName.trim().length < 3) { return message.error("Please enter your full name (min. 3 characters)") }
        if (!email) { return message.error("Please enter your email address") }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) { return message.error("Please enter a valid email address") }
        if (!dateOfBirth) { return message.error("Please enter your date of birth") }
        setStep(2)
    }

    // Step 2 - Validate identity & address
    const handleStep2 = () => {
        const { cnic, mobileNo, address, city, country } = state
        const cnicRegex = /^\d{5}-\d{7}-\d{1}$/
        if (!cnicRegex.test(cnic)) { return message.error("CNIC must be in format: 00000-0000000-0") }
        const phoneRegex = /^(\+92|0)?3\d{9}$/
        if (!phoneRegex.test(mobileNo.replace(/\s/g, ""))) { return message.error("Enter a valid mobile number (e.g. 03001234567)") }
        if (address.trim().length < 5) { return message.error("Please enter your full address") }
        if (!city.trim()) { return message.error("Please enter your city") }
        if (!country) { return message.error("Please select your country") }
        setStep(3)
    }

    // Step 3 - Submit registration
    const handleRegister = () => {
        const { password, confirmPassword } = state
        if (password.length < 6) { return message.error("Password must be at least 6 characters") }
        if (password !== confirmPassword) { return message.error("Passwords do not match") }

        const formData = {
            fullName: state.fullName.trim(), email: state.email, dateOfBirth: state.dateOfBirth,
            cnic: state.cnic, mobileNo: state.mobileNo,
            address: state.address.trim(), city: state.city.trim(), province: state.province.trim(), country: state.country,
            password: state.password
        }
        setIsProcessing(true)

        axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, formData)
            .then((res) => {
                const { status, data } = res
                if (status === 201) {
                    message.success(data.message)
                    navigate("/auth/pending")
                }
            })
            .catch((error) => {
                console.error(error)
                if (error.response) {
                    const { status, data } = error.response
                    if (status === 401 || status === 400 || status === 409) { message.error(data.message) }
                } else {
                    message.error("Something went wrong. Please try again.")
                }
            })
            .finally(() => { setIsProcessing(false) })
    }

    const stepTitles = ['Personal Info', 'Identity & Address', 'Set Password']
    const stepDescs = [
        "Tell us your basic personal details to get started.",
        "Verify your identity and provide your residential address.",
        "Secure your DigitalBank account with a strong password.",
    ]

    return (
        <div id="main">
            <div className="auth-container" data-aos="zoom-in">

                {/* Left Branding Panel */}
                <div className="auth-brand-panel">
                    <div className="brand-logo">
                        <div className="brand-icon"><BankOutlined /></div>
                        DigitalBank
                    </div>

                    <div className="brand-content">
                        <h2>Start Your Financial Journey Today</h2>
                        <p>Join over 1 million customers who trust DigitalBank for secure savings, instant transfers, and intelligent investing.</p>
                    </div>

                    {/* Step indicators */}
                    <div className="brand-features">
                        {stepTitles.map((t, i) => (
                            <div key={t} className="feature-item" style={{ opacity: step > i ? 1 : 0.4 }}>
                                <span className="feature-dot" style={{ background: step > i ? '#10B981' : '#334155' }} />
                                <span style={{ color: step === i + 1 ? '#10B981' : 'inherit' }}>
                                    Step {i + 1}: {t}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Form Panel */}
                <div className="auth-form-panel">
                    <div className="form-header">
                        <h1>{stepTitles[step - 1]}</h1>
                        <p>{stepDescs[step - 1]}</p>
                    </div>

                    <Form layout="vertical">

                        {/* Step 1 - Personal Info */}
                        {step === 1 && <>
                            <Form.Item label="Full Name" required style={{ marginBottom: '16px' }}>
                                <Input size="large" prefix={<UserOutlined style={{ color: '#475569' }} />} placeholder="Enter your full name" name="fullName" value={state.fullName} onChange={handleChange} />
                            </Form.Item>
                            <Form.Item label="Email Address" required style={{ marginBottom: '16px' }}>
                                <Input size="large" prefix={<MailOutlined style={{ color: '#475569' }} />} placeholder="Enter your email address" name="email" value={state.email} onChange={handleChange} />
                            </Form.Item>
                            <Form.Item label="Date of Birth" required style={{ marginBottom: '16px' }}>
                                <Input size="large" type="date" prefix={<IdcardOutlined style={{ color: '#475569' }} />} name="dateOfBirth" value={state.dateOfBirth} onChange={handleChange} className="date-input" />
                            </Form.Item>
                            <Form.Item style={{ marginBottom: '16px' }}>
                                <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
                                    Already have an account? <Link to="/auth/login" className="forgot-link">Sign in</Link>
                                </p>
                            </Form.Item>
                            <Form.Item style={{ marginBottom: 0 }}>
                                <Button size="large" type="primary" block onClick={handleStep1}>
                                    Continue
                                </Button>
                            </Form.Item>
                        </>}

                        {/* Step 2 - Identity & Address */}
                        {step === 2 && <>
                            <Form.Item label="CNIC Number" required style={{ marginBottom: '16px' }}>
                                <Input size="large" prefix={<IdcardOutlined style={{ color: '#475569' }} />} placeholder="e.g. 42101-1234567-8" name="cnic" value={state.cnic} onChange={handleChange} maxLength={15} />
                            </Form.Item>
                            <Form.Item label="Mobile Number" required style={{ marginBottom: '16px' }}>
                                <Input size="large" prefix={<PhoneOutlined style={{ color: '#475569' }} />} placeholder="e.g. 03001234567" name="mobileNo" value={state.mobileNo} onChange={handleChange} maxLength={13} />
                            </Form.Item>
                            <Form.Item label="Residential Address" required style={{ marginBottom: '16px' }}>
                                <Input size="large" prefix={<HomeOutlined style={{ color: '#475569' }} />} placeholder="House No., Street, Area" name="address" value={state.address} onChange={handleChange} />
                            </Form.Item>
                            <Form.Item label="City" required style={{ marginBottom: '16px' }}>
                                <Input size="large" prefix={<EnvironmentOutlined style={{ color: '#475569' }} />} placeholder="Enter your city" name="city" value={state.city} onChange={handleChange} />
                            </Form.Item>
                            <Form.Item label="Province / State" style={{ marginBottom: '16px' }}>
                                <Input size="large" prefix={<EnvironmentOutlined style={{ color: '#475569' }} />} placeholder="e.g. Punjab, Sindh" name="province" value={state.province} onChange={handleChange} />
                            </Form.Item>
                            <Form.Item label="Country" required style={{ marginBottom: '16px' }}>
                                <Input size="large" prefix={<EnvironmentOutlined style={{ color: '#475569' }} />} placeholder="Enter your country" name="country" value={state.country} onChange={handleChange} />
                            </Form.Item>
                            <Form.Item style={{ marginBottom: '16px' }}>
                                <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
                                    <span className="forgot-link" style={{ cursor: 'pointer' }} onClick={() => setStep(1)}>← Go back</span>
                                </p>
                            </Form.Item>
                            <Form.Item style={{ marginBottom: 0 }}>
                                <Button size="large" type="primary" block onClick={handleStep2}>
                                    Continue
                                </Button>
                            </Form.Item>
                        </>}

                        {/* Step 3 - Security */}
                        {step === 3 && <>
                            <Form.Item label="Password" required style={{ marginBottom: '16px' }}>
                                <Input.Password size="large" prefix={<LockOutlined style={{ color: '#475569' }} />} placeholder="Create a password (min. 6 characters)" name="password" value={state.password} onChange={handleChange} />
                            </Form.Item>
                            <Form.Item label="Confirm Password" required style={{ marginBottom: '16px' }}>
                                <Input.Password size="large" prefix={<LockOutlined style={{ color: '#475569' }} />} placeholder="Confirm your password" name="confirmPassword" value={state.confirmPassword} onChange={handleChange} />
                            </Form.Item>
                            <Form.Item style={{ marginBottom: '16px' }}>
                                <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
                                    <span className="forgot-link" style={{ cursor: 'pointer' }} onClick={() => setStep(2)}>← Go back</span>
                                </p>
                            </Form.Item>
                            <Form.Item style={{ marginBottom: 0 }}>
                                <Button size="large" type="primary" htmlType="submit" block loading={isProcessing} onClick={handleRegister}>
                                    Open My Account
                                </Button>
                            </Form.Item>
                        </>}

                    </Form>
                </div>

            </div>
        </div>
    )
}

export default Register
