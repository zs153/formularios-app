import express from 'express'
import { verifyTokenAndAdmin,verifyTokenAndResp } from "../middleware/auth";

import * as ade from '../controllers/admin/ade.controller'
import * as carga from '../controllers/admin/carga.controller'
import * as estadistica from '../controllers/admin/estadistica.controller'
import * as formulario from '../controllers/admin/formularios/formulario.controller'
import * as historico from '../controllers/admin/historico.controller'
import * as oficina from '../controllers/admin/oficina.controller'
import * as referencia from '../controllers/admin/formularios/referencia.controller'
import * as tipo from '../controllers/admin/tipo.controller'
import * as usuario from '../controllers/admin/usuario.controller'

const adminRouter = express.Router()

//--------------- paginas
// ade
adminRouter.get("/formularios/ades", verifyTokenAndResp, ade.mainPage);
adminRouter.get("/formularios/ades/asignar/:id", verifyTokenAndResp, ade.asignarPage);
adminRouter.get("/formularios/ades/desasignar/:id", verifyTokenAndResp, ade.desAsignarPage);

// page carga
adminRouter.get('/cargas', verifyTokenAndAdmin, carga.mainPage)
adminRouter.get('/cargas/add', verifyTokenAndAdmin, carga.addPage)

// estadistica
adminRouter.get("/estadisticas", verifyTokenAndAdmin, estadistica.mainPage);

// formulario
adminRouter.get("/formularios", verifyTokenAndResp, formulario.mainPage);
adminRouter.get("/formularios/edit/:id", verifyTokenAndResp, formulario.editPage);
adminRouter.get("/formularios/resolver/:id", verifyTokenAndAdmin, formulario.resolverPage);
adminRouter.get("/formularios/resueltos", verifyTokenAndResp, formulario.resueltosPage);
adminRouter.get("/formularios/readonly/:id", verifyTokenAndResp, formulario.readonlyPage);

// historico
adminRouter.get('/historicos', verifyTokenAndAdmin, historico.mainPage)
adminRouter.get('/historicos/edit/:id', verifyTokenAndAdmin, historico.editPage)

// oficinas
adminRouter.get('/oficinas', verifyTokenAndAdmin, oficina.mainPage)
adminRouter.get('/oficinas/add', verifyTokenAndAdmin, oficina.addPage)
adminRouter.get('/oficinas/edit/:id', verifyTokenAndAdmin, oficina.editPage)

// referencia
adminRouter.get("/formularios/referencias/:id", verifyTokenAndResp, referencia.mainPage);
adminRouter.get("/formularios/referencias/add/:id", verifyTokenAndResp, referencia.addPage);
adminRouter.get("/formularios/referencias/edit/:id", verifyTokenAndResp, referencia.editPage);

// tipos
adminRouter.get('/tipos', verifyTokenAndAdmin, tipo.mainPage)
adminRouter.get('/tipos/add', verifyTokenAndAdmin, tipo.addPage)
adminRouter.get('/tipos/edit/:id', verifyTokenAndAdmin, tipo.editPage)

// usuarios
adminRouter.get('/usuarios', verifyTokenAndResp, usuario.mainPage)
adminRouter.get('/usuarios/add', verifyTokenAndResp, usuario.addPage)
adminRouter.get('/usuarios/edit/:id', verifyTokenAndResp, usuario.editPage)

//--------------- procedures
// ade
adminRouter.post("/formularios/ades/asignar", verifyTokenAndResp, ade.asignar);
adminRouter.post("/formularios/ades/desasignar", verifyTokenAndResp, ade.desAsignar);

// carga
adminRouter.post('/cargas/insert', verifyTokenAndAdmin, carga.insert)

// estadistica
adminRouter.post("/estadisticas", verifyTokenAndAdmin, estadistica.generar);

// formularios
adminRouter.post("/formularios/update", verifyTokenAndResp, formulario.update);
adminRouter.post("/formularios/delete", verifyTokenAndResp, formulario.remove);
adminRouter.post("/formularios/desasignar", verifyTokenAndResp, formulario.desasignar);
adminRouter.post("/formularios/resolver", verifyTokenAndResp, formulario.resolver);

// historico
adminRouter.post('/historicos/activar', verifyTokenAndResp, historico.activar)
adminRouter.post('/historicos/update', verifyTokenAndResp, historico.update)

// oficinas
adminRouter.post('/oficinas/insert', verifyTokenAndAdmin, oficina.insert)
adminRouter.post('/oficinas/update', verifyTokenAndAdmin, oficina.update)
adminRouter.post('/oficinas/delete', verifyTokenAndAdmin, oficina.remove)

// tipos
adminRouter.post('/tipos/insert', verifyTokenAndAdmin, tipo.insert)
adminRouter.post('/tipos/update', verifyTokenAndAdmin, tipo.update)
adminRouter.post('/tipos/delete', verifyTokenAndAdmin, tipo.remove)

// usuarios
adminRouter.post('/usuarios/insert', verifyTokenAndResp, usuario.insert)
adminRouter.post('/usuarios/update', verifyTokenAndResp, usuario.update)
adminRouter.post('/usuarios/delete', verifyTokenAndResp, usuario.remove)

export default adminRouter