import { Router } from "express"
import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
} from "../controllers/playlist.controller.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/").post(verifyJwt, createPlaylist)
router.route("/user/:userId").get(verifyJwt, getUserPlaylists)
router.route("/:playlistId")
    .get(verifyJwt, getPlaylistById)
    .delete(verifyJwt, deletePlaylist)
    .patch(verifyJwt, updatePlaylist)
router.route("/:playlistId/:videoId")
    .patch(verifyJwt, addVideoToPlaylist)
router.route("/:playlistId/:videoId")
    .delete(verifyJwt, removeVideoFromPlaylist)

export default router