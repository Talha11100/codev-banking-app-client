import { useState } from 'react'
import { Avatar, Dropdown, Layout, Menu, theme, Typography } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Routes from "./Routes"
import sidebarItems from "./SidebarItems"
import { useAuth } from '@/context/Auth'

const { Header, Content, Footer, Sider } = Layout;
const layoutStyle = { position: 'relative', minHeight: 360 }
const siderStyle = { position: 'absolute', top: 0, bottom: 0, insetInlineStart: 0, zIndex: 10 }



const Dashboard = () => {

  const { user, handleLogout } = useAuth()

  const [collapsed, setCollapsed] = useState(true);
  const { token: { colorBgContainer } } = theme.useToken();
  const currentYear = new Date().getFullYear();

  const navigate = useNavigate()
  const location = useLocation()

  const getSelectedKey = () => {
    if (user.role === "superAdmin") {
      if (location.pathname.includes("/dashboard/admin/transactions")) return "6";
      if (location.pathname.includes("/dashboard/admin/users")) return "9";
      if (location.pathname.includes("/dashboard/admin/bank-reports")) return "7";
      if (location.pathname.includes("/dashboard/admin/security-limits")) return "8";
      if (location.pathname.includes("/dashboard/admin")) return "5";
    }
    else {
      if (location.pathname.includes("/dashboard/transfer")) return "2";
      if (location.pathname.includes("/dashboard/history")) return "3";
      if (location.pathname.includes("/dashboard/card")) return "4";
      if (location.pathname.includes("/dashboard")) return "1";
    }
  }

  const items = [
    { key: '0', label: user.email },
    { key: '2', label: 'Home', icon: <HomeOutlined />, onClick: () => navigate("/") },
    { type: 'divider' },
    { key: '3', label: 'Logout', icon: <LogoutOutlined />, danger: true, onClick: handleLogout }
  ]

  return (
    <Layout style={layoutStyle}>
      <Sider collapsible collapsed={collapsed} collapsedWidth="0" style={siderStyle} trigger={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onCollapse={setCollapsed}>
        <div className='py-3'>
          <Typography.Title level={3} className='text-center mb-0'><Link to="/" className='text-decoration-none text-white'>Banking App</Link></Typography.Title>
        </div>
        <Menu onClick={() => setCollapsed(true)} theme="dark" mode="inline" selectedKeys={[getSelectedKey()]} items={sidebarItems.filter(item => !item.allowedroles || item.allowedroles.includes(user.role))} />
      </Sider>
      {/* Overlay for blur and fade effect */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 9,
          opacity: collapsed ? 0 : 1,
          pointerEvents: collapsed ? 'none' : 'auto',
          transition: 'all 0.2s ease-in-out'
        }}
        onClick={() => setCollapsed(true)}
      />
      <Layout>
        <Header style={{ background: colorBgContainer }}>
          <div className='text-end'>
            <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
              <Avatar size={48} style={{ cursor: "pointer" }} icon={<UserOutlined />} />
              {/* <Avatar style={{ cursor: "pointer", backgroundColor: "#fdf0d5", color: "black" }}>{user.fullName[0]}</Avatar> */}
              {/* <Avatar size={48} style={{ cursor: "pointer" }} src={<img draggable={false} src="https://umairahmad.net/img/testimonial-1.jpg" alt="avatar" />} /> */}
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <Routes />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          © Copyright {currentYear}. All Rights Reserved.
        </Footer>
      </Layout>
    </Layout>
  )
}

export default Dashboard