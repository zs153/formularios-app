import express from 'express'
import { verifyTokenAndAdmin,verifyTokenAndResp } from "../middleware/auth";

import * as oficina from '../controllers/admin/oficina.controller'
import * as usuario from '../controllers/admin/usuario.controller'
import * as historico from '../controllers/admin/historico.controller'
import * as tipo from '../controllers/admin/tipo.controller'
import * as formulario from '../controllers/admin/formulario.controller'
import * as carga from '../controllers/admin/carga.controller'
import * as estadistica from '../controllers/admin/estadistica.controller'

const adminRouter = express.Router()

//--------------- paginas
// oficinas
adminRouter.get('/oficinas', verifyTokenAndAdmin, oficina.mainPage)
adminRouter.get('/oficinas/add', verifyTokenAndAdmin, oficina.addPage)
adminRouter.get('/oficinas/edit/:id', verifyTokenAndAdmin, oficina.editPage)

// historico
adminRouter.get('/historicos', verifyTokenAndAdmin, historico.mainPage)
adminRouter.get('/historicos/edit/:id', verifyTokenAndAdmin, historico.editPage)

// usuarios
adminRouter.get('/usuarios', verifyTokenAndResp, usuario.mainPage)
adminRouter.get('/usuarios/add', verifyTokenAndResp, usuario.addPage)
adminRouter.get('/usuarios/edit/:id', verifyTokenAndResp, usuario.editPage)

// tipos
adminRouter.get('/tipos', verifyTokenAndAdmin, tipo.mainPage)
adminRouter.get('/tipos/add', verifyTokenAndAdmin, tipo.addPage)
adminRouter.get('/tipos/edit/:id', verifyTokenAndAdmin, tipo.editPage)

// formulario
adminRouter.get("/formularios", verifyTokenAndResp, formulario.mainPage);
adminRouter.get("/formularios/edit/:id", verifyTokenAndResp, formulario.editPage);
adminRouter.get("/formularios/resueltos", verifyTokenAndResp, formulario.resueltosPage);
adminRouter.get("/formularios/resolver/:id", verifyTokenAndAdmin, formulario.resolverPage);
adminRouter.get("/formularios/readonly/:id", verifyTokenAndResp, formulario.readonlyPage);

// referencia
adminRouter.get("/formularios/referencias/:id", verifyTokenAndResp, formulario.referenciasPage);
adminRouter.get("/formularios/referencias/readonly/:id", verifyTokenAndResp, formulario.referenciasReadonlyPage);

// smss
adminRouter.get("/formularios/smss/:id", verifyTokenAndResp, formulario.smssPage);
adminRouter.get("/formularios/smss/readonly/:id", verifyTokenAndResp, formulario.smssReadonlyPage);

// ades
adminRouter.get("/formularios/ades", verifyTokenAndResp, formulario.adesPage);
adminRouter.get("/formularios/ades/asignar/:id", verifyTokenAndResp, formulario.adesAsignarPage);
adminRouter.get("/formularios/ades/desasignar/:id", verifyTokenAndResp, formulario.adesDesasignarPage);

// page carga
adminRouter.get('/cargas', verifyTokenAndAdmin, carga.mainPage)
adminRouter.get('/cargas/add', verifyTokenAndAdmin, carga.addPage)

// estadistica
adminRouter.get("/estadisticas", verifyTokenAndAdmin, estadistica.mainPage);

//--------------- procedures
// oficinas
adminRouter.post('/oficinas/insert', verifyTokenAndAdmin, oficina.insert)
adminRouter.post('/oficinas/update', verifyTokenAndAdmin, oficina.update)
adminRouter.post('/oficinas/delete', verifyTokenAndAdmin, oficina.remove)

// historico
adminRouter.post('/historicos/activar', verifyTokenAndResp, historico.activar)
adminRouter.post('/historicos/update', verifyTokenAndResp, historico.update)
adminRouter.post('/historicos/delete', verifyTokenAndResp, historico.remove)

// usuarios
adminRouter.post('/usuarios/insert', verifyTokenAndResp, usuario.insert)
adminRouter.post('/usuarios/update', verifyTokenAndResp, usuario.update)
adminRouter.post('/usuarios/delete', verifyTokenAndResp, usuario.remove)

// tipos
adminRouter.post('/tipos/insert', verifyTokenAndAdmin, tipo.insert)
adminRouter.post('/tipos/update', verifyTokenAndAdmin, tipo.update)
adminRouter.post('/tipos/delete', verifyTokenAndAdmin, tipo.remove)

// formularios
adminRouter.post("/formularios/update", verifyTokenAndResp, formulario.update);
adminRouter.post("/formularios/delete", verifyTokenAndResp, formulario.remove);
adminRouter.post("/formularios/desasignar", verifyTokenAndResp, formulario.desasignar);
adminRouter.post("/formularios/resolver", verifyTokenAndResp, formulario.resolver);

// ades
adminRouter.post("/formularios/ades/asignar", verifyTokenAndResp, formulario.asignarFormularios);
adminRouter.post("/formularios/ades/desasignar", verifyTokenAndResp, formulario.desAsignarFormularios);

// carga
adminRouter.post('/cargas/insert', verifyTokenAndAdmin, carga.insert)

// estadistica
adminRouter.post("/estadisticas", verifyTokenAndAdmin, estadistica.generarEstadistica);

export default adminRouter