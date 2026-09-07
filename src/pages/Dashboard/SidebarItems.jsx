import { TeamOutlined, SendOutlined, HistoryOutlined, CreditCardOutlined, TransactionOutlined, DashboardOutlined, SettingOutlined, BankOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';


const sidebarItems = [
    // Customer Routes
    { key: "1", label: <Link to="/dashboard" className='text-decoration-none'>Overview</Link>, icon: <DashboardOutlined />, allowedroles: ["customer"] },
    { key: "2", label: <Link to="/dashboard/transfer" className='text-decoration-none'>Transfer Money</Link>, icon: <SendOutlined />, allowedroles: ["customer"] },
    { key: "3", label: <Link to="/dashboard/history" className='text-decoration-none'>History</Link>, icon: <HistoryOutlined />, allowedroles: ["customer"] },
    { key: "4", label: <Link to="/dashboard/card" className='text-decoration-none'>My Card</Link>, icon: <CreditCardOutlined />, allowedroles: ["customer"] },
    // Super Admin Routes
    { key: "5", label: <Link to="/dashboard/admin" className='text-decoration-none'>Overview</Link>, icon: <DashboardOutlined />, allowedroles: ["superAdmin"] },
    { key: "6", label: <Link to="/dashboard/admin/transactions" className='text-decoration-none'>Global Transactions</Link>, icon: <TransactionOutlined />, allowedroles: ["superAdmin"] },
    { key: "7", label: <Link to="/dashboard/admin/bank-reports" className='text-decoration-none'>Bank Reports</Link>, icon: <BankOutlined />, allowedroles: ["superAdmin"] },
    { key: "8", label: <Link to="/dashboard/admin/security-limits" className='text-decoration-none'>Security & Limits</Link>, icon: <SettingOutlined />, allowedroles: ["superAdmin"] },
    { key: "9", label: <Link to="/dashboard/admin/users" className='text-decoration-none'>Total Users</Link>, icon: <TeamOutlined />, allowedroles: ["superAdmin"] },
]
export default sidebarItems