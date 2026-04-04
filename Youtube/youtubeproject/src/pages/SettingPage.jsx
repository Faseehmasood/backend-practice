import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useDispatch } from "react-redux"
import { setCredentials } from "../features/auth/authSlice"
import { 
    useUpdateUserDetailsMutation,
    useChangePasswordMutation,
    useUpdateAvatarMutation,
    useUpdateCoverImageMutation
} from "../features/api/userApiSlice"
import toast from "react-hot-toast"

// Schemas
const detailsSchema = z.object({
    fullName: z.string().min(3, "Min 3 characters"),
    email: z.string().email("Invalid email"),
})

const passwordSchema = z.object({
    oldPassword: z.string().min(6, "Min 6 characters"),
    newPassword: z.string().min(6, "Min 6 characters"),
})

const SettingsPage = () => {
    const dispatch = useDispatch()
    const [activeTab, setActiveTab] = useState("details")

    const [updateDetails, { isLoading: detailsLoading }] = useUpdateUserDetailsMutation()
    const [changePassword, { isLoading: passwordLoading }] = useChangePasswordMutation()
    const [updateAvatar, { isLoading: avatarLoading }] = useUpdateAvatarMutation()
    const [updateCoverImage, { isLoading: coverLoading }] = useUpdateCoverImageMutation()

    // Details Form
    const { register: detailsRegister, handleSubmit: handleDetails, formState: { errors: detailsErrors } } = useForm({
        resolver: zodResolver(detailsSchema)
    })

    // Password Form
    const { register: passwordRegister, handleSubmit: handlePassword, formState: { errors: passwordErrors } } = useForm({
        resolver: zodResolver(passwordSchema)
    })

    const onUpdateDetails = async (data) => {
        try {
            const result = await updateDetails(data).unwrap()
            dispatch(setCredentials(result.data))
            toast.success("Details Updated!")
        } catch (error) {
            toast.error(error?.data?.message || "Failed!")
        }
    }

    const onChangePassword = async (data) => {
        try {
            await changePassword(data).unwrap()
            toast.success("Password Changed!")
        } catch (error) {
            toast.error(error?.data?.message || "Failed!")
        }
    }

    const onUpdateAvatar = async (e) => {
        const formData = new FormData()
        formData.append("avatar", e.target.files[0])
        try {
            const result = await updateAvatar(formData).unwrap()
            dispatch(setCredentials(result.data))
            toast.success("Avatar Updated!")
        } catch (error) {
            toast.error("Failed!")
        }
    }

    const onUpdateCoverImage = async (e) => {
        const formData = new FormData()
        formData.append("coverImage", e.target.files[0])
        try {
            const result = await updateCoverImage(formData).unwrap()
            dispatch(setCredentials(result.data))
            toast.success("Cover Image Updated!")
        } catch (error) {
            toast.error("Failed!")
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 p-6">
            <div className="max-w-2xl mx-auto">

                <h1 className="text-white text-2xl font-bold mb-6">Settings</h1>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-gray-800 mb-6">
                    {["details", "password", "avatar", "cover"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 font-semibold capitalize transition-colors ${
                                activeTab === tab
                                ? "text-white border-b-2 border-red-500"
                                : "text-gray-400 hover:text-white"
                            }`}
                        >
                            {tab === "cover" ? "Cover Image" : tab}
                        </button>
                    ))}
                </div>

                {/* Update Details */}
                {activeTab === "details" && (
                    <form onSubmit={handleDetails(onUpdateDetails)} className="space-y-4">
                        <div>
                            <label className="text-gray-400 text-sm mb-1 block">Full Name</label>
                            <input
                                {...detailsRegister("fullName")}
                                placeholder="Enter full name"
                                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                            />
                            {detailsErrors.fullName && <p className="text-red-500 text-sm mt-1">{detailsErrors.fullName.message}</p>}
                        </div>
                        <div>
                            <label className="text-gray-400 text-sm mb-1 block">Email</label>
                            <input
                                {...detailsRegister("email")}
                                type="email"
                                placeholder="Enter email"
                                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                            />
                            {detailsErrors.email && <p className="text-red-500 text-sm mt-1">{detailsErrors.email.message}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={detailsLoading}
                            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                        >
                            {detailsLoading ? "Updating..." : "Update Details"}
                        </button>
                    </form>
                )}

                {/* Change Password */}
                {activeTab === "password" && (
                    <form onSubmit={handlePassword(onChangePassword)} className="space-y-4">
                        <div>
                            <label className="text-gray-400 text-sm mb-1 block">Old Password</label>
                            <input
                                {...passwordRegister("oldPassword")}
                                type="password"
                                placeholder="Enter old password"
                                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                            />
                            {passwordErrors.oldPassword && <p className="text-red-500 text-sm mt-1">{passwordErrors.oldPassword.message}</p>}
                        </div>
                        <div>
                            <label className="text-gray-400 text-sm mb-1 block">New Password</label>
                            <input
                                {...passwordRegister("newPassword")}
                                type="password"
                                placeholder="Enter new password"
                                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                            />
                            {passwordErrors.newPassword && <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword.message}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={passwordLoading}
                            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                        >
                            {passwordLoading ? "Changing..." : "Change Password"}
                        </button>
                    </form>
                )}

                {/* Update Avatar */}
                {activeTab === "avatar" && (
                    <div className="space-y-4">
                        <label className="text-gray-400 text-sm mb-1 block">Select New Avatar</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onUpdateAvatar}
                            disabled={avatarLoading}
                            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                        />
                        {avatarLoading && <p className="text-gray-400">Uploading...</p>}
                    </div>
                )}

                {/* Update Cover Image */}
                {activeTab === "cover" && (
                    <div className="space-y-4">
                        <label className="text-gray-400 text-sm mb-1 block">Select New Cover Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onUpdateCoverImage}
                            disabled={coverLoading}
                            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                        />
                        {coverLoading && <p className="text-gray-400">Uploading...</p>}
                    </div>
                )}

            </div>
        </div>
    )
}

export default SettingsPage