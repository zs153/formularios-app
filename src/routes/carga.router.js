import express from "express";
import { carga, cargas, crear } from "../controllers/carga.controller";

const apiCargaRouter = express.Router();

// cargas
apiCargaRouter.post("/carga", carga);
apiCargaRouter.post("/cargas", cargas);
apiCargaRouter.post("/cargas/insert", crear);

export default apiCargaRouter;