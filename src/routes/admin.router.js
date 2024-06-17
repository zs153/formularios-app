import express from 'express'
import { verifyTokenAndAdmin,verifyTokenAndResp } from "../middleware/auth";

import * as ade from '../controllers/admin/formularios/ade.controller'
import * as asignado from '../controllers/admin/formularios/asignado.controller'
import * as pendiente from '../controllers/admin/formularios/pendiente.controller'
import * as resuelto from '../controllers/admin/formularios/resuelto.controller'
import * as carga from '../controllers/admin/carga.controller'
import * as estadistica from '../controllers/admin/estadistica.controller'
import * as historico from '../controllers/admin/historico.controller'
import * as oficina from '../controllers/admin/oficina.controller'
import * as tipo from '../controllers/admin/tipo.controller'
import * as usuario from '../controllers/admin/usuario.controller'

const adminRouter = express.Router()

//--------------- paginas
// ade
adminRouter.get("/formularios/asignados/ades", verifyTokenAndResp, ade.asignadosPage);
adminRouter.get("/formularios/asignados/ades/desasignar/:id", verifyTokenAndResp, ade.desAsignarPage);
adminRouter.get("/formularios/pendientes/ades", verifyTokenAndResp, ade.pendientesPage);
adminRouter.get("/formularios/pendientes/ades/asignar/:id", verifyTokenAndResp, ade.asignarPage);

// asignar
adminRouter.get("/formularios/asignados", verifyTokenAndAdmin,asignado.mainPage);
adminRouter.get("/formularios/asignados/edit/:id", verifyTokenAndAdmin, asignado.editPage);
adminRouter.get("/formularios/asignados/referencias/:id", verifyTokenAndAdmin, asignado.referenciasPage);
adminRouter.get("/formularios/asignados/referencias/add/:id", verifyTokenAndAdmin, asignado.addReferenciaPage);
adminRouter.get("/formularios/asignados/referencias/edit/:idfor/:idref", verifyTokenAndAdmin, asignado.editReferenciaPage);

// pendiente
adminRouter.get("/formularios/pendientes", verifyTokenAndAdmin,pendiente.mainPage);
adminRouter.get("/formularios/pendientes/edit/:id", verifyTokenAndAdmin, pendiente.editPage);

// resuelto
adminRouter.get("/formularios/resueltos", verifyTokenAndAdmin, resuelto.mainPage);
adminRouter.get("/formularios/resueltos/edit/:id", verifyTokenAndAdmin, resuelto.editPage);
adminRouter.get("/formularios/resueltos/referencias/:id", verifyTokenAndAdmin, resuelto.referenciasPage);
adminRouter.get("/formularios/resueltos/referencias/edit/:idfor/:idref", verifyTokenAndResp, resuelto.editReferenciaPage);

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
adminRouter.post("/formularios/pendientes/ades/asignar", verifyTokenAndResp, ade.asignar);
adminRouter.post("/formularios/asignados/ades/desasignar", verifyTokenAndResp, ade.desAsignar);

// asignados
adminRouter.post("/formularios/asignados/update", verifyTokenAndAdmin, asignado.update);
adminRouter.post("/formularios/asignados/delete", verifyTokenAndAdmin, asignado.remove);
adminRouter.post("/formularios/asignados/desasignar", verifyTokenAndAdmin, asignado.desasignar);
adminRouter.post("/formularios/asignados/resolver", verifyTokenAndAdmin, asignado.resolver);
adminRouter.post("/formularios/asignados/referencias/insert", verifyTokenAndAdmin, asignado.insertReferencia);
adminRouter.post("/formularios/asignados/referencias/update", verifyTokenAndAdmin, asignado.updateReferencia);
adminRouter.post("/formularios/asignados/referencias/delete", verifyTokenAndAdmin, asignado.removeReferencia);

// pendientes
adminRouter.post("/formularios/pendientes/update", verifyTokenAndAdmin, pendiente.update);
adminRouter.post("/formularios/pendientes/delete", verifyTokenAndAdmin, pendiente.remove);

// resueltos
adminRouter.post("/formularios/resueltos/delete", verifyTokenAndAdmin, resuelto.remove);
adminRouter.post("/formularios/resueltos/desresolver", verifyTokenAndAdmin, resuelto.desresolver);
adminRouter.post("/formularios/resueltos/referencias/update", verifyTokenAndAdmin, resuelto.updateReferencia);
adminRouter.post("/formularios/resueltos/referencias/delete", verifyTokenAndAdmin, resuelto.removeReferencia);

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