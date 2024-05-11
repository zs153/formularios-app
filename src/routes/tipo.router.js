import express from "express";
import { tipo, tipos, crear, modificar, borrar } from "../controllers/tipo.controller";

const apiTipoRouter = express.Router();

// tipos
apiTipoRouter.post("/tipo", tipo);
apiTipoRouter.post("/tipos", tipos);
apiTipoRouter.post("/tipos/insert", crear);
apiTipoRouter.post("/tipos/update", modificar);
apiTipoRouter.post("/tipos/delete", borrar);

export default apiTipoRouter;