import { Route, Routes } from "react-router-dom"
import ProtectedRoute from "@/components/Misc/ProtectedRoute"
import Overview from "./Overview"
import Transfer from "./Transfer"
import History from "./History"
import MyCard from "./Card"
import AdminOverview from "./AdminOverview"
import GlobalTransactions from "./GlobalTransactions"
import Users from "./TotalUsers"
import PageNotFound from "@/components/Misc/PageNotFound"
import SecurityAndLimits from "./Security&Limits"
import BankReports from "./BankReports"

const Index = () => {
    return (
        <>
            <Routes>
                {/* Customer Routes */}
                <Route path="/*" element={<ProtectedRoute allowedroles={['customer']} Component={Overview} />} />
                <Route path="/transfer/*" element={<ProtectedRoute allowedroles={['customer']} Component={Transfer} />} />
                <Route path="/history/*" element={<ProtectedRoute allowedroles={['customer']} Component={History} />} />
                <Route path="/card/*" element={<ProtectedRoute allowedroles={['customer']} Component={MyCard} />} />
                {/* Super Admin Routes */}
                <Route path="/admin/security-limits/*" element={<ProtectedRoute allowedroles={['superAdmin']} Component={SecurityAndLimits} />} />
                <Route path="/admin/bank-reports/*" element={<ProtectedRoute allowedroles={['superAdmin']} Component={BankReports} />} />
                <Route path="/admin/*" element={<ProtectedRoute allowedroles={['superAdmin']} Component={AdminOverview} />} />
                <Route path="/admin/transactions/*" element={<ProtectedRoute allowedroles={['superAdmin']} Component={GlobalTransactions} />} />
                <Route path="/admin/users/*" element={<ProtectedRoute allowedroles={["superAdmin"]} Component={Users} />} />
                {/* Page Not Found */}
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </>
    )
}

export default Index