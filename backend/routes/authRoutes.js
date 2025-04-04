import { Router } from "express";
import { googleLogin, googleCallback, googleLogout, verifyPassword } from "../controllers/googleAuthController.js";

const router = Router();

router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);
router.get("/google/logout", googleLogout);
router.post("/verify-password", verifyPassword);
router.get("/session", (req, res) => {
    res.json({
        session: req.session,
        user: req.user || null,
    });
});

export default router;
