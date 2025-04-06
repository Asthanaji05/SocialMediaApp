import { Router } from "express";
import { googleLogin, googleCallback, googleLogout, verifyPassword, googleSession } from "../controllers/googleAuthController.js";

const router = Router();

router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);
router.get("/google/logout", googleLogout);
router.post("/verify-password", verifyPassword);
router.get("/google/session", googleSession);

export default router;
