import { ConfigProvider } from 'antd'
import './App.scss'
import ScreenLoader from './components/Misc/ScreenLoader'
import { useAuth } from './context/Auth'
import Routes from "./pages/Routes"

const App = () => {
  const { isAppLoading } = useAuth()
  return (
    <>
      <ConfigProvider theme={{ token: { colorPrimary: "#1d3557", controlOutline: 0 } }}>
        {/* Comments added */}
        {!isAppLoading
          ? <Routes />
          : <ScreenLoader />
        }
      </ConfigProvider>
    </>
  )
}

export default App