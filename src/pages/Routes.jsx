import { Navigate, Route, Routes } from "react-router-dom"
import Frontend from "./Frontend"
import Auth from "./Auth"
import Dashboard from "./Dashboard"
import { useAuth } from "@/context/Auth"
import ProtectedRoute from "@/components/Misc/ProtectedRoute"

const Index = () => {
    const { isAuth } = useAuth()
    return (
        <>
            <Routes>
                <Route path="/*" element={<Frontend />} />
                <Route path="/auth/*" element={!isAuth ? <Auth /> : <Navigate to="/" />} />
                <Route path="/dashboard/*" element={<ProtectedRoute Component={Dashboard}/>} />
            </Routes>
        </>
    )
}

export default Index