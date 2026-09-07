import { useEffect, useState } from "react"
import { Form, Input, Button, message } from "antd"
import { Link } from "react-router-dom"
import { useAuth } from "@/context/Auth"
import axios from "axios"
import Aos from "aos"
import { BankOutlined, LockOutlined, MailOutlined } from "@ant-design/icons"
import { FaShieldHalved, FaBolt, FaChartLine } from "react-icons/fa6"

const initialState = { email: "", password: "" }

const Login = () => {
  useEffect(() => {
    Aos.init(
      {
        duration: 1000,
        once: true,
        easing: "ease-in-out"
      }
    )
  }, [])

  const [isProcessing, setIsProcessing] = useState(false)
  const [state, setState] = useState(initialState)
  const { readProfile } = useAuth()

  const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

  const handleSubmit = () => {
    let { email, password } = state
    const userData = { email, password }
    setIsProcessing(true)

    axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, userData)
      .then((res) => {
        const { status, data } = res
        if (status === 201) {
          localStorage.setItem("token", data.token)
          message.success(data.message)
          readProfile(data.token)
        }
      })
      .catch((error) => {
        console.error(error)
        if (error.response) {
          const { status, data } = error.response
          if (status === 401) {
            message.error(data.message)
          }
        } else {
          message.error("Something went wrong while login")
        }
      })
      .finally(() => {
        setIsProcessing(false)
      })
  }

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
            <h2>Welcome Back to Your Financial Hub</h2>
            <p>Log in to access your accounts, send money, track spending, and manage your investments — all in one secure place.</p>
          </div>

          <div>
            <ul>
              <li>256-bit AES encryption</li>
              <li>Instant global transfers</li>
              <li>Smart portfolio analytics</li>
            </ul>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="auth-form-panel">
          <div className="form-header">
            <h1>Sign In</h1>
            <p>Don't have an account? <Link to="/auth/register">Open a free account</Link></p>
          </div>

          <Form layout="vertical">

            <Form.Item label="Email Address" required className="mb-2">
              <Input size="large" prefix={<MailOutlined style={{ color: '#475569' }} />} placeholder="Enter your email address" name="email" onChange={handleChange} />
            </Form.Item>

            <Form.Item label="Password" required className="mb-2">
              <Input.Password size="large" prefix={<LockOutlined style={{ color: '#475569' }} />} placeholder="Enter your password" name="password" onChange={handleChange} />
            </Form.Item>

            <Form.Item className="mb-2">
              <Link to="/auth/forgot-password" className="forgot-link">Forgot Password?</Link>
            </Form.Item>

            <Form.Item className="mb-0">
              <Button size="large" type="primary" htmlType="submit" block loading={isProcessing} onClick={handleSubmit}>Sign In to DigitalBank</Button>
            </Form.Item>

          </Form>
        </div>

      </div>
    </div >
  )
}

export default Login
