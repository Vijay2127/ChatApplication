import express from 'express';
import { checkAuth, login, logout, signup, updateProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const routes=express.Router();

routes.post("/signup",signup);

routes.post("/login",login);

routes.post("/logout",logout);

routes.put("/update-profile",protectRoute,updateProfile);

routes.get("/check",protectRoute,checkAuth);


export default routes;