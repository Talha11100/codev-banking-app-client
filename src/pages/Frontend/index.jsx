import { Route, Routes } from "react-router-dom"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Home from "./Home"
import PageNotFound from "@/components/Misc/PageNotFound"


const Frontend = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </>
  )
}

export default Frontend