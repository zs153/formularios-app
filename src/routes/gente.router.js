import express from "express";
import { gente } from "../controllers/gente.controller";

const apiGenteRouter = express.Router();

// smss
apiGenteRouter.post("/gente", gente);

export default apiGenteRouter;