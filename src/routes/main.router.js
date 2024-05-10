import express from "express";
import authRoutes from '../middleware/auth'
import { cleanPage, mainPage } from "../controllers/main.controller";

const mainRouter = express.Router();

// paginas
mainRouter.get("/", mainPage);
mainRouter.get('/clean', authRoutes, cleanPage)

export default mainRouter;