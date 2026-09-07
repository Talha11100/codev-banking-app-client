import { useEffect, useState } from "react"
import { Form, Input, Button, message } from "antd"
import { Link } from "react-router-dom"
import axios from "axios"
import Aos from "aos"
import { BankOutlined, LockOutlined, MailOutlined, SafetyOutlined } from "@ant-design/icons"

const initialState = { email: "", otp: "", newPassword: "", confirmNewPassword: "" }

const ForgotPassword = () => {
    useEffect(() => {
        Aos.init({
            duration: 1000,
            once: true,
            easing: "ease-in-out"
        })
    }, [])

    const [isProcessing, setIsProcessing] = useState(false)
    const [state, setState] = useState(initialState)
    const [step, setStep] = useState(1) // 1 = email, 2 = verify otp, 3 = reset password

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    // Step 1 - Send OTP to email
    const handleSendEmail = () => {
        const { email } = state
        const userData = { email }
        setIsProcessing(true)

        axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, userData)
            .then((res) => {
                const { status, data } = res
                if (status === 200) {
                    message.success(data.message)
                    setStep(2)
                }
            })
            .catch((error) => {
                console.error(error)
                if (error.response) {
                    const { status, data } = error.response
                    if (status === 401 || status === 404 || status === 400) { message.error(data.message) }
                } else {
                    message.error("Something went wrong. Please try again.")
                }
            })
            .finally(() => { setIsProcessing(false) })
    }

    // Step 2 - Verify OTP
    const handleVerifyOtp = () => {
        const { email, otp } = state
        const userData = { email, otp }
        setIsProcessing(true)

        axios.post(`${import.meta.env.VITE_API_URL}/auth/verify-otp`, userData)
            .then((res) => {
                const { status, data } = res
                if (status === 200) {
                    message.success(data.message)
                    setStep(3)
                }
            })
            .catch((error) => {
                console.error(error)
                if (error.response) {
                    const { status, data } = error.response
                    if (status === 401 || status === 404 || status === 400) { message.error(data.message) }
                } else {
                    message.error("Something went wrong. Please try again.")
                }
            })
            .finally(() => { setIsProcessing(false) })
    }

    // Step 3 - Reset Password
    const handleResetPassword = () => {
        const { email, otp, newPassword, confirmNewPassword } = state
        if (newPassword !== confirmNewPassword) { return message.error("Passwords do not match") }

        const userData = { email, otp, newPassword }
        setIsProcessing(true)

        axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password`, userData)
            .then((res) => {
                const { status, data } = res
                if (status === 200) {
                    message.success(data.message)
                    setState(initialState)
                    setStep(1)
                }
            })
            .catch((error) => {
                console.error(error)
                if (error.response) {
                    const { status, data } = error.response
                    if (status === 401 || status === 404 || status === 400) { message.error(data.message) }
                } else {
                    message.error("Something went wrong. Please try again.")
                }
            })
            .finally(() => { setIsProcessing(false) })
    }

    const stepTitles = ['Verify Email', 'Enter OTP', 'Reset Password']
    const stepDescs = [
        "Enter your registered email and we'll send you a one-time OTP.",
        "Enter the 6-digit OTP we sent to your email address.",
        "Create a strong new password for your DigitalBank account.",
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
                        <h2>Account Recovery</h2>
                        <p>Regain access to your DigitalBank account securely. We'll verify your identity before allowing a password reset.</p>
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

                        {/* Step 1 - Email */}
                        {step === 1 && <>
                            <Form.Item label="Email Address" required style={{ marginBottom: '16px' }}>
                                <Input size="large" prefix={<MailOutlined style={{ color: '#475569' }} />} placeholder="Enter your registered email" name="email" value={state.email} onChange={handleChange} />
                            </Form.Item>
                            <Form.Item style={{ marginBottom: '16px' }}>
                                <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
                                    Remember your password? <Link to="/auth/login" className="forgot-link">Sign in</Link>
                                </p>
                            </Form.Item>
                            <Form.Item style={{ marginBottom: 0 }}>
                                <Button size="large" type="primary" htmlType="submit" block loading={isProcessing} onClick={handleSendEmail}>
                                    Send OTP to Email
                                </Button>
                            </Form.Item>
                        </>}

                        {/* Step 2 - Verify OTP */}
                        {step === 2 && <>
                            <Form.Item label="One-Time Password (OTP)" required style={{ marginBottom: '16px' }}>
                                <Input size="large" prefix={<SafetyOutlined style={{ color: '#475569' }} />} placeholder="Enter the 6-digit OTP" name="otp" value={state.otp} onChange={handleChange} />
                            </Form.Item>
                            <Form.Item style={{ marginBottom: '16px' }}>
                                <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
                                    Didn't receive the OTP?{' '}
                                    <span className="forgot-link" style={{ cursor: 'pointer' }}
                                        onClick={() => { setState(s => ({ ...s, otp: "" })); setStep(1) }}>
                                        Go back
                                    </span>
                                </p>
                            </Form.Item>
                            <Form.Item style={{ marginBottom: 0 }}>
                                <Button size="large" type="primary" htmlType="submit" block loading={isProcessing} onClick={handleVerifyOtp}>
                                    Verify OTP
                                </Button>
                            </Form.Item>
                        </>}

                        {/* Step 3 - Reset Password */}
                        {step === 3 && <>
                            <Form.Item label="New Password" required style={{ marginBottom: '16px' }}>
                                <Input.Password size="large" prefix={<LockOutlined style={{ color: '#475569' }} />} placeholder="Enter your new password" name="newPassword" value={state.newPassword} onChange={handleChange} />
                            </Form.Item>
                            <Form.Item label="Confirm New Password" required style={{ marginBottom: '24px' }}>
                                <Input.Password size="large" prefix={<LockOutlined style={{ color: '#475569' }} />} placeholder="Confirm your new password" name="confirmNewPassword" value={state.confirmNewPassword} onChange={handleChange} />
                            </Form.Item>
                            <Form.Item style={{ marginBottom: 0 }}>
                                <Button size="large" type="primary" htmlType="submit" block loading={isProcessing} onClick={handleResetPassword}>
                                    Reset Password
                                </Button>
                            </Form.Item>
                        </>}

                    </Form>
                </div>

            </div>
        </div>
    )
}

export default ForgotPassword


//     const [isProcessing, setIsProcessing] = useState(false)
//     const [state, setState] = useState(initialState)
//     const [step, setStep] = useState(1) // 1 = email, 2 = verify otp, 3 = reset password

//     const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

//     // Step 1 - Send OTP to email
//     const handleSendEmail = () => {
//         const { email } = state
//         const userData = { email }
//         setIsProcessing(true)

//         axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, userData)
//             .then((res) => {
//                 const { status, data } = res
//                 if (status === 200) {
//                     message.success(data.message)
//                     setStep(2)
//                 }
//             })
//             .catch((error) => {
//                 console.error(error)
//                 if (error.response) {
//                     const { status, data } = error.response
//                     if (status === 401 || status === 404 || status === 400) {
//                         message.error(data.message)
//                     }
//                 } else {
//                     message.error("Something went wrong. Please try again.")
//                 }
//             })
//             .finally(() => {
//                 setIsProcessing(false)
//             })
//     }

//     // Step 2 - Verify OTP
//     const handleVerifyOtp = () => {
//         const { email, otp } = state
//         const userData = { email, otp }
//         setIsProcessing(true)

//         axios.post(`${import.meta.env.VITE_API_URL}/auth/verify-otp`, userData)
//             .then((res) => {
//                 const { status, data } = res
//                 if (status === 200) {
//                     message.success(data.message)
//                     setStep(3)
//                 }
//             })
//             .catch((error) => {
//                 console.error(error)
//                 if (error.response) {
//                     const { status, data } = error.response
//                     if (status === 401 || status === 404 || status === 400) {
//                         message.error(data.message)
//                     }
//                 } else {
//                     message.error("Something went wrong. Please try again.")
//                 }
//             })
//             .finally(() => {
//                 setIsProcessing(false)
//             })
//     }

//     // Step 3 - Reset Password
//     const handleResetPassword = () => {
//         const { email, otp, newPassword, confirmNewPassword } = state

//         if (newPassword !== confirmNewPassword) { return message.error("Passwords do not match") }

//         const userData = { email, otp, newPassword }
//         setIsProcessing(true)

//         axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password`, userData)
//             .then((res) => {
//                 const { status, data } = res
//                 if (status === 200) {
//                     message.success(data.message)
//                     setState(initialState)
//                     setStep(1)
//                 }
//             })
//             .catch((error) => {
//                 console.error(error)
//                 if (error.response) {
//                     const { status, data } = error.response
//                     if (status === 401 || status === 404 || status === 400) {
//                         message.error(data.message)
//                     }
//                 } else {
//                     message.error("Something went wrong. Please try again.")
//                 }
//             })
//             .finally(() => {
//                 setIsProcessing(false)
//             })
//     }

//     return (
//         <div id="main">
//             <div className="card p-3 m-3" data-aos="zoom-in">
//                 <div className="my-3">
//                     <Title level={2} className="text-center mb-0">
//                         {step === 1 ? "Forgot Password" : step === 2 ? "Verify OTP" : "Reset Password"}
//                     </Title>
//                     <Paragraph className="text-center mb-0" type="secondary">
//                         Step {step} of 3 - {step === 1 ? "Enter your email" : step === 2 ? "Verify OTP" : "Reset Password"}
//                     </Paragraph>
//                 </div>
//                 <Form layout="vertical">
//                     <Row>

//                         {/* Step 1 - Email */}
//                         {step === 1 && <>
//                             <Col span={24}>
//                                 <Form.Item label="Email" required>
//                                     <Input size="large" placeholder="Enter your email address" name="email" value={state.email} onChange={handleChange} />
//                                 </Form.Item>
//                             </Col>
//                             <Col span={24}>
//                                 <Form.Item className="mb-2">
//                                     <Paragraph>Remember your password? <Link to="/auth/login" className="text-decoration-none">Login</Link></Paragraph>
//                                 </Form.Item>
//                             </Col>
//                             <Col span={24}>
//                                 <Form.Item className="mb-0">
//                                     <Button size="large" type="primary" htmlType="submit" block loading={isProcessing} onClick={handleSendEmail}>Send Email</Button>
//                                 </Form.Item>
//                             </Col>
//                         </>}

//                         {/* Step 2 - Verify OTP */}
//                         {step === 2 && <>
//                             <Col span={24}>
//                                 <Form.Item label="OTP" required>
//                                     <Input size="large" placeholder="Enter the OTP sent to your email" name="otp" value={state.otp} onChange={handleChange} />
//                                 </Form.Item>
//                             </Col>
//                             <Col span={24}>
//                                 <Form.Item className="mb-2">
//                                     <Paragraph>Didn't receive the OTP? <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => { setState(s => ({ ...s, otp: "" })); setStep(1) }}>Go back</span></Paragraph>
//                                 </Form.Item>
//                             </Col>
//                             <Col span={24}>
//                                 <Form.Item className="mb-0">
//                                     <Button size="large" type="primary" htmlType="submit" block loading={isProcessing} onClick={handleVerifyOtp}>Verify OTP</Button>
//                                 </Form.Item>
//                             </Col>
//                         </>}

//                         {/* Step 3 - Reset Password */}
//                         {step === 3 && <>
//                             <Col span={24}>
//                                 <Form.Item label="New Password" required>
//                                     <Input.Password size="large" placeholder="Enter your new password" name="newPassword" value={state.newPassword} onChange={handleChange} />
//                                 </Form.Item>
//                             </Col>
//                             <Col span={24}>
//                                 <Form.Item label="Confirm New Password" required>
//                                     <Input.Password size="large" placeholder="Confirm your new password" name="confirmNewPassword" value={state.confirmNewPassword} onChange={handleChange} />
//                                 </Form.Item>
//                             </Col>
//                             <Col span={24}>
//                                 <Form.Item className="mb-0">
//                                     <Button size="large" type="primary" htmlType="submit" block loading={isProcessing} onClick={handleResetPassword}>Reset Password</Button>
//                                 </Form.Item>
//                             </Col>
//                         </>}

//                     </Row>
//                 </Form>
//             </div>
//         </div>
//     )
// }

// export default ForgotPassword