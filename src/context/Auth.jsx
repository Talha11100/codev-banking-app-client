import { message } from "antd"
import axios from "axios"
import { createContext, useContext, useEffect, useReducer, useState } from "react"

const AuthContext = createContext()

const initialState = { isAuth: false, user: {} }

const reducer = (state, { type, payload }) => {

    switch (type) {
        case "SET_LOGIN":
            return { isAuth: true, user: payload.user }
        case "UPDATE_USER":
            return { ...state, user: { ...state.user, ...payload.user } }
        case "SET_LOGOUT":
            return initialState
        default:
            return state
    }
}

const Auth = ({ children }) => {
    const [isAppLoading, setIsAppLoading] = useState(true)
    const [state, dispatch] = useReducer(reducer, initialState)


    const readProfile = (token) => {
        const jwt = token || localStorage.getItem("token")
        if (!jwt) {
            setTimeout(() => {
                setIsAppLoading(false)
            }, 2000);
            return
        }

        axios.get(`${import.meta.env.VITE_API_URL}/auth/user`, { headers: { Authorization: `Bearer ${jwt}` } })
            .then((res) => {
                const { status, data } = res
                if (status === 200) {
                    dispatch({ type: "SET_LOGIN", payload: { user: data.user } })
                }
            })
            .catch((error) => {
                console.error(error)
                message.error("Something went wrong while fetching user")
            })
        setTimeout(() => {
            setIsAppLoading(false)
        }, 2000)
    }

    useEffect(() => { readProfile() }, [])

    const handleLogout = () => {
        localStorage.removeItem("token")
        dispatch({ type: "SET_LOGOUT" })
        message.success("Logout successful")
    }

    return (
        <AuthContext.Provider value={{ ...state, isAppLoading, dispatch, readProfile, handleLogout }}>
            {children}
        </AuthContext.Provider >
    )
}

export default Auth

export const useAuth = () => { return useContext(AuthContext) }