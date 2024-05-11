// imports
import express from "express";
import { mainPage, dispat,portalPage } from "../controllers/main/main.controller";

const mainRouter = express.Router();

// pages
// main
mainRouter.get("/", mainPage);
mainRouter.get("/portal", portalPage);

// proc
mainRouter.get("/dispat", dispat);

// exports
export default mainRouter;