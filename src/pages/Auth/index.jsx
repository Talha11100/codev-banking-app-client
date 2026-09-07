import { Route, Routes } from "react-router-dom"
import Register from "./Register"
import Login from "./Login"
import PageNotFound from "@/components/Misc/PageNotFound"
import ForgotPassword from "./ForgotPassword"
import PendingScreen from "@/components/Misc/PendingScreen"

const Auth = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pending" element={<PendingScreen />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  )
}

export default Auth