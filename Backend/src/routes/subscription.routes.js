import { Router } from "express"
import {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
} from "../controllers/subscription.controller.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/:channelId")
    .patch(verifyJwt, toggleSubscription)
    .get(verifyJwt, getUserChannelSubscribers)

router.route("/s/:subscriberId").get(verifyJwt, getSubscribedChannels)

export default router