import { Router } from "express"
import { 
    registerUser,
    loginuser,
    logoutuser,
    chanagePassword,
    getCurrentUser,
    updateUserDetails,
    avatarLocalPath,
    coverImageLocalPath,
    getuserChannelProfile,
    getHistorywatch,
    refreshaccessToken
} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    registerUser
)

router.route("/login").post(loginuser)
router.route("/logout").post(verifyJwt, logoutuser)
router.route("/refreshtoken").post(refreshaccessToken)
router.route("/change-password").post(verifyJwt, chanagePassword)
router.route("/current-user").get(getCurrentUser) //verifyjwt is not required here
router.route("/update-user-details").patch(verifyJwt, updateUserDetails)
router.route("/avatar").patch(verifyJwt, upload.single("avatar"), avatarLocalPath)
router.route("/coverImage").patch(verifyJwt, upload.single("coverImage"), coverImageLocalPath)
router.route("/c/:username").get(verifyJwt, getuserChannelProfile)
router.route("/history").get(verifyJwt, getHistorywatch)

export default router