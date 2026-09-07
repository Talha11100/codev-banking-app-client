import { useAuth } from "@/context/Auth"
import { BankOutlined, DashboardOutlined, LoginOutlined, LogoutOutlined, UserAddOutlined } from "@ant-design/icons"
import { Link } from "react-router-dom"

const Navbar = () => {
    const { isAuth, handleLogout, user } = useAuth()

    return (
        <header style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
            <nav className="navbar navbar-expand-lg navbar-dark" style={{
                background: 'rgba(10, 22, 40, 0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                padding: '12px 0',
            }}>
                <div className="container">
                    {/* Brand */}
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                        <div style={{
                            width: '38px', height: '38px',
                            background: 'linear-gradient(135deg, #10B981, #059669)',
                            borderRadius: '10px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontSize: '18px',
                            boxShadow: '0 4px 12px rgba(16,185,129,0.4)',
                            flexShrink: 0,
                        }}>
                            <BankOutlined />
                        </div>
                        <span style={{
                            fontFamily: "'Outfit', 'Inter', sans-serif",
                            fontWeight: 700, fontSize: '22px',
                            color: '#F1F5F9', letterSpacing: '-0.5px',
                        }}>
                            Digital<span style={{ color: '#10B981' }}>Bank</span>
                        </span>
                    </Link>


                    {/* Toggler */}
                    <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation" style={{ outline: 'none', boxShadow: 'none' }}>
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Collapsible Content */}
                    <div className="collapse navbar-collapse" id="navbarContent">
                        <div className="navbar-nav ms-auto align-items-lg-center gap-2 mt-3 mt-lg-0">

                            <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2 ms-0 ms-lg-2">
                                {!isAuth
                                    ? <>
                                        <Link to="/auth/login" className="btn btn-primary text-white"><LoginOutlined /> Login</Link>
                                        <Link to="/auth/register" className="btn btn-success text-white"><UserAddOutlined /> Open Account</Link>
                                    </>
                                    : <>
                                        {user.role === "superAdmin"
                                            ? <Link to="/dashboard/admin" className="btn btn-info text-white"><DashboardOutlined /> Admin Dashboard</Link>
                                            : <Link to="/dashboard" className="btn btn-info text-white"><DashboardOutlined /> Dashboard</Link>
                                        }
                                        <button className="btn btn-danger text-white" onClick={handleLogout} style={{ cursor: 'pointer', border: 'none' }}><LogoutOutlined /> Logout</button>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Navbar
