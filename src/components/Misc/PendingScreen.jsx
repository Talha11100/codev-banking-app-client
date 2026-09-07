import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/Auth"
import Aos from "aos"
import { BankOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons"

const PendingScreen = () => {
    const { isAuth, user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        Aos.init({ duration: 1000, once: true, easing: "ease-in-out" })
    }, [])

    useEffect(() => {
        // If user is logged in and account is active, redirect to dashboard
        if (isAuth && user?.status === "active") { navigate("/dashboard", { replace: true }) }
        // If user is logged in and account is inactive, redirect to login
        if (isAuth && user?.status === "inactive") { navigate("/auth/login", { replace: true }) }
    }, [isAuth, user, navigate])

    return (
        <div id="main">
            <div className="pending-screen" data-aos="zoom-in">

                <div className="pending-glow" />

                <div className="pending-icon-wrap">
                    <div className="pending-icon-ring">
                        <ClockCircleOutlined className="pending-clock-icon" />
                    </div>
                </div>

                <h1 className="pending-title">Application Submitted!</h1>
                <p className="pending-subtitle">
                    Your DigitalBank account registration has been received successfully.
                </p>

                <div className="pending-steps">
                    <div className="ps-item ps-done">
                        <CheckCircleOutlined className="ps-icon" />
                        <div className="ps-text">
                            <strong>Application Received</strong>
                            <span>We've received your registration details.</span>
                        </div>
                    </div>
                    <div className="ps-connector" />
                    <div className="ps-item ps-active">
                        <ClockCircleOutlined className="ps-icon ps-pulse" />
                        <div className="ps-text">
                            <strong>Under Review</strong>
                            <span>Our compliance team is verifying your information.</span>
                        </div>
                    </div>
                    <div className="ps-connector ps-connector-dim" />
                    <div className="ps-item ps-pending">
                        <BankOutlined className="ps-icon" />
                        <div className="ps-text">
                            <strong>Account Activation</strong>
                            <span>Your account will be activated after approval.</span>
                        </div>
                    </div>
                </div>

                <div className="pending-info-box">
                    <span>📧</span>
                    <p>A confirmation email has been sent to your registered email address. You'll be notified once your account is approved by an administrator.</p>
                </div>

                <p className="pending-footer">
                    Already approved? <Link to="/auth/login" className="forgot-link">Sign in here</Link>
                </p>

            </div>
        </div>
    )
}

export default PendingScreen