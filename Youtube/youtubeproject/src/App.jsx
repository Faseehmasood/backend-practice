import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import VideoPage from "./pages/VideoPage"
import ProfilePage from "./pages/ProfilePage"
import PlaylistPage from "./pages/PlaylistPage"
import Navbar from "./components/Navbar"

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/video/:videoId" element={<VideoPage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/playlists" element={<PlaylistPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App