import express from "express";
import { borrar, crear, modificar, oficina, oficinas } from "../controllers/oficina.controller";

const apiOficinaRouter = express.Router();

// formularios
apiOficinaRouter.post("/oficina", oficina);
apiOficinaRouter.post("/oficinas", oficinas);
apiOficinaRouter.post("/oficinas/insert", crear);
apiOficinaRouter.post("/oficinas/update", modificar);
apiOficinaRouter.post("/oficinas/delete", borrar);

export default apiOficinaRouter;