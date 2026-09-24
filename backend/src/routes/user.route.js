import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { 
  getRecommendedUsers, 
  getMyFriends, 
  sendFriendRequest, 
  acceptFriendRequest, 
  getFriendRequest,
  getOutgoingFriendReqs
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protectRoute, getRecommendedUsers);
router.get("/friends", protectRoute, getMyFriends);

router.post("/friend-request/:id", protectRoute, sendFriendRequest);

router.put("/friend-request/:id/accept", protectRoute, acceptFriendRequest);

router.get("/friend-requests", protectRoute, getFriendRequest);

router.get("/outgoing-friend-request", protectRoute, getOutgoingFriendReqs);

export default router;