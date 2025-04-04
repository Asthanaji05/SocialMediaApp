import express from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser,loginUser, getUserProfile } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js'; // Import the verifyToken middleware
// import { isAuthenticated } from '../middleware/authMiddleware.js'; // Import the isAuthenticated middleware
const router = express.Router();
// User Profile Route
router.get("/profile", verifyToken, getUserProfile);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
// Login Route
router.post("/login", loginUser);

export default router;
