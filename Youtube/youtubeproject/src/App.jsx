import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setCredentials, logout } from "./features/auth/authSlice"
import { useGetCurrentUserQuery } from "./features/api/userApiSlice"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import VideoPage from "./pages/VideoPage"
import ProfilePage from "./pages/ProfilePage"
import PlaylistPage from "./pages/PlaylistPage"
import UploadVideoPage from "./pages/UploadVideoPage"

// Auth Check Component
const AuthCheck = () => {
    const dispatch = useDispatch()
    const { data, isError } = useGetCurrentUserQuery()

    useEffect(() => {
        if(data?.data){
            dispatch(setCredentials(data.data))
        }
        if(isError){
            dispatch(logout())
        }
    }, [data, isError])

    return null
}

const AppLayout = () => {
    const location = useLocation()
    const hideNavbar = ["/login", "/register"].includes(location.pathname)

    return (
        <>
            <AuthCheck />
            {!hideNavbar && <Navbar />}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/video/:videoId" element={<VideoPage />} />
                <Route path="/profile/:userId" element={<ProfilePage />} />
                <Route path="/playlists" element={<PlaylistPage />} />
                <Route path="/upload" element={<UploadVideoPage />} />
            </Routes>
        </>
    )
}

function App() {
    return (
        <BrowserRouter>
            <Toaster position="top-right" />
            <AppLayout />
        </BrowserRouter>
    )
}

export default App