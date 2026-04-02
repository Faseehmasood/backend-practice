import { Router } from "express"
import {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
} from "../controllers/tweet.controllers.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/").post(verifyJwt, createTweet)
router.route("/user/:userId").get(verifyJwt, getUserTweets)
router.route("/:tweetId")
    .patch(verifyJwt, updateTweet)
    .delete(verifyJwt, deleteTweet)

export default router