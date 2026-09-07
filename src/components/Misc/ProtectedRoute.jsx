import { useAuth } from "@/context/Auth"
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ allowedroles, Component }) => {
  const { isAuth, user } = useAuth()

  if (!isAuth) { return <Navigate to="/auth/login" replace /> }

  if (allowedroles && !allowedroles.includes(user.role)) { return <Navigate to="/dashboard" replace /> }

  return (
    <Component />
  )
}

export default ProtectedRoute