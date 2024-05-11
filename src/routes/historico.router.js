import express from "express";
import {
  historico,
  historicos,
  modificar,
  activar,
} from "../controllers/historico.controller";

const apiHistoricoRouter = express.Router();

// Historicos
apiHistoricoRouter.post("/historico", historico);
apiHistoricoRouter.post("/historicos", historicos);
apiHistoricoRouter.post("/historicos/update", modificar);
apiHistoricoRouter.post("/historicos/activar", activar);

export default apiHistoricoRouter;
