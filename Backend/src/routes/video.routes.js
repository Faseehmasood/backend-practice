import { Router } from "express"
import {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
} from "../controllers/video.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/").get(getAllVideos)
router.route("/upload").post(verifyJwt, upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
]), publishAVideo)
router.route("/:videoId")
    .get(getVideoById)
    .patch(verifyJwt, upload.single("thumbnail"), updateVideo)
    .delete(verifyJwt, deleteVideo)
router.route("/toggle/:videoId").patch(verifyJwt, togglePublishStatus)

export default router