import express from 'express'
import { verifyTokenAndAdmin,verifyTokenAndResp } from "../middleware/auth";

import * as ade from '../controllers/admin/formularios/ade.controller'
import * as asignado from '../controllers/admin/formularios/asignado.controller'
import * as pendiente from '../controllers/admin/formularios/pendiente.controller'
import * as resuelto from '../controllers/admin/formularios/resuelto.controller'
import * as referencia from '../controllers/admin/formularios/referencia.controller'
import * as carga from '../controllers/admin/carga.controller'
import * as estadistica from '../controllers/admin/estadistica.controller'
import * as historico from '../controllers/admin/historico.controller'
import * as oficina from '../controllers/admin/oficina.controller'
import * as tipo from '../controllers/admin/tipo.controller'
import * as usuario from '../controllers/admin/usuario.controller'

const adminRouter = express.Router()

//--------------- paginas
// ade
adminRouter.get("/formularios/ades", verifyTokenAndResp, ade.mainPage);
adminRouter.get("/formularios/ades/asignar/:id", verifyTokenAndResp, ade.asignarPage);
adminRouter.get("/formularios/ades/desasignar/:id", verifyTokenAndResp, ade.desAsignarPage);

// asignar
adminRouter.get("/formularios/asignados", verifyTokenAndResp, asignado.mainPage);
adminRouter.get("/formularios/asignados/edit/:id", verifyTokenAndResp, asignado.editPage);
adminRouter.get("/formularios/asignados/referencias/:id", verifyTokenAndAdmin, asignado.referenciasPage);

// pendiente
adminRouter.get('/formularios/pendientes', verifyTokenAndAdmin, carga.mainPage)
adminRouter.get('/formularios/pendientes/edit/:id', verifyTokenAndAdmin, carga.addPage)

// referencia
adminRouter.get("/formularios/referencias/:id", verifyTokenAndResp, referencia.mainPage);
adminRouter.get("/formularios/referencias/add/:id", verifyTokenAndResp, referencia.addPage);
adminRouter.get("/formularios/referencias/edit/:id", verifyTokenAndResp, referencia.editPage);

// resuelto
adminRouter.get("/formularios/asignados", verifyTokenAndResp, resuelto.mainPage);
adminRouter.get("/formularios/asignados/edit/:id", verifyTokenAndResp, resuelto.editPage);
adminRouter.get("/formularios/asignados/referencias/:id", verifyTokenAndAdmin, resuelto.referenciasPage);

// carga
adminRouter.get('/cargas', verifyTokenAndAdmin, carga.mainPage)
adminRouter.get('/cargas/add', verifyTokenAndAdmin, carga.addPage)

// estadistica
adminRouter.get("/estadisticas", verifyTokenAndAdmin, estadistica.mainPage);

// historico
adminRouter.get('/historicos', verifyTokenAndAdmin, historico.mainPage)
adminRouter.get('/historicos/edit/:id', verifyTokenAndAdmin, historico.editPage)

// oficinas
adminRouter.get('/oficinas', verifyTokenAndAdmin, oficina.mainPage)
adminRouter.get('/oficinas/add', verifyTokenAndAdmin, oficina.addPage)
adminRouter.get('/oficinas/edit/:id', verifyTokenAndAdmin, oficina.editPage)


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

// asignados
adminRouter.post("/formularios/asignados/update", verifyTokenAndResp, asignado.update);
adminRouter.post("/formularios/asignados/delete", verifyTokenAndResp, asignado.remove);
adminRouter.post("/formularios/asignados/desasignar", verifyTokenAndResp, asignado.desasignar);
adminRouter.post("/formularios/asignados/resolver", verifyTokenAndResp, asignado.resolver);

// pendientes
adminRouter.post("/formularios/pendientes/update", verifyTokenAndResp, pendiente.update);
adminRouter.post("/formularios/pendientes/delete", verifyTokenAndResp, pendiente.remove);
adminRouter.post("/formularios/pendientes/desasignar", verifyTokenAndResp, pendiente.asignar);

// referencias
adminRouter.post('/formularios/referencias/insert', verifyTokenAndAdmin, oficina.insert)
adminRouter.post('/formularios/referencias/update', verifyTokenAndAdmin, oficina.update)
adminRouter.post('/formularios/referencias/delete', verifyTokenAndAdmin, oficina.remove)

// resueltos
adminRouter.post("/formularios/resueltos/delete", verifyTokenAndResp, resuelto.remove);
adminRouter.post("/formularios/resueltos/desasignar", verifyTokenAndResp, resuelto.desasignar);

// carga
adminRouter.post('/cargas/insert', verifyTokenAndAdmin, carga.insert)

// estadistica
adminRouter.post("/estadisticas", verifyTokenAndAdmin, estadistica.generar);

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