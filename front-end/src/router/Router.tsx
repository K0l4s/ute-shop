
import { Route, Routes } from 'react-router-dom'
import Navbar from '../components/navbar/Navbar'
import Homepage from '../pages/homepage/Homepage'


const Router = () => {
  return (
    <>
    <Navbar />
        <Routes>
            <Route path="/" element={<Homepage />} />
        </Routes>
    </>
  )
}

export default Router