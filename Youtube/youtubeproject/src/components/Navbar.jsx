import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"
import { useLogoutMutation } from "../features/auth/authApiSlice"
import { logout } from "../features/auth/authSlice"
import toast from "react-hot-toast"
import { FiSearch, FiUpload, FiLogOut, FiUser } from "react-icons/fi"

const Navbar = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [searchQuery, setSearchQuery] = useState("")
    const { user, isAuthenticated } = useSelector((state) => state.auth)
    const [logoutApi, { isLoading }] = useLogoutMutation()

    const handleLogout = async () => {
        try {
            await logoutApi().unwrap()
            dispatch(logout())
            toast.success("Logged out!")
            navigate("/login")
        } catch (error) {
            toast.error("Logout Failed!")
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if(searchQuery.trim()){
            navigate(`/?search=${searchQuery}`)
        }
    }

    return (
        <nav className="bg-gray-900 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
            
            {/* Logo */}
            <Link to="/" className="text-red-500 text-2xl font-bold">
                ▶ KidsTube
            </Link>

            {/* Search Bar */}
            <form 
                onSubmit={handleSearch}
                className="flex items-center bg-gray-800 rounded-full px-4 py-2 w-96"
            >
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search videos..."
                    className="bg-transparent text-white outline-none w-full"
                />
                <button type="submit">
                    <FiSearch className="text-gray-400 text-xl cursor-pointer hover:text-white" />
                </button>
            </form>

            {/* Right Side */}
            <div className="flex items-center gap-4">
                
                {isAuthenticated ? (
                    <>
                        {/* Upload Button */}
                        <button
                            onClick={() => navigate("/upload")}
                            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors"
                        >
                            <FiUpload />
                            Upload
                        </button>

                        {/* Playlists */}
                        <Link
                            to="/playlists"
                            className="text-gray-400 hover:text-white transition-colors text-sm"
                        >
                            Playlists
                        </Link>

                        {/* Profile */}
                        <Link to={`/profile/${user?._id}`}>
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt="avatar"
                                    className="w-9 h-9 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center">
                                    <FiUser className="text-white" />
                                </div>
                            )}
                        </Link>

                      {/* Profile ke baad */}
                        <Link
                            to="/settings"
                            className="text-gray-400 hover:text-white transition-colors text-sm"
                        >
                            Settings
                        </Link>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            disabled={isLoading}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <FiLogOut className="text-xl" />
                        </button>
                    </>
                ) : (
                    <Link
                        to="/login"
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors"
                    >
                        Sign In
                    </Link>
                )}

            </div>
        </nav>
    )
}

export default Navbar
