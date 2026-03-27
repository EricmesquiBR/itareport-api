import * as userController from "../controllers/userController.js";
import express from "express";

const router = express.Router();

router.post("/user", userController.createUser);
router.post("/user/login", userController.checkUserCredentials);
// router.get("/users", userController.findAllUsers);
router.get("/user/:id", userController.findUser);
router.put("/user/:id", userController.updateUser);
router.delete("/user/:id", userController.deleteUser);

export default router;
