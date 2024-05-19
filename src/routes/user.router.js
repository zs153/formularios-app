import express from 'express'
import authRoutes from '../middleware/auth'
import * as asignado from '../controllers/user/formularios/asignado.controller'
import * as pendiente from '../controllers/user/formularios/pendiente.controller'
import * as resuelto from '../controllers/user/formularios/resuelto.controller'
import * as inicio from '../controllers/user/inicio.controller'

const userRouter = express.Router()

//--------------- paginas
// main
userRouter.get('/', authRoutes, inicio.mainPage)
userRouter.get('/perfil', authRoutes, inicio.perfilPage)
userRouter.get("/logout", authRoutes, inicio.logoutPage)

// asignado
userRouter.get("/formularios/asignados", authRoutes,asignado.mainPage);
userRouter.get("/formularios/asignados/add", authRoutes, asignado.addPage);
userRouter.get("/formularios/asignados/edit/:id", authRoutes, asignado.editPage);
userRouter.get("/formularios/asignados/referencias/:id", authRoutes, asignado.referenciasPage);
userRouter.get("/formularios/asignados/referencias/add/:id", authRoutes, asignado.addReferenciaPage);
userRouter.get("/formularios/asignados/referencias/edit/:idfor/:idref", authRoutes, asignado.editReferenciaPage);

// pendientes
userRouter.get("/formularios/pendientes", authRoutes,pendiente.mainPage);
userRouter.get("/formularios/pendientes/add", authRoutes, pendiente.addPage);
userRouter.get("/formularios/pendientes/edit/:id", authRoutes, pendiente.editPage);

// resueltos
userRouter.get("/formularios/resueltos", authRoutes, resuelto.mainPage);
userRouter.get("/formularios/resueltos/edit/:id", authRoutes, resuelto.editPage);
userRouter.get("/formularios/resueltos/referencias/:id", authRoutes, resuelto.referenciasPage);
userRouter.get("/formularios/resueltos/referencias/edit/:idfor/:idref", authRoutes, resuelto.editReferenciaPage);


// inicio
userRouter.get('/', authRoutes, inicio.mainPage)
userRouter.get('/perfil', authRoutes, inicio.perfilPage)
userRouter.get("/logout", authRoutes, inicio.logoutPage)

//--------------- procedures
// asignar
userRouter.post("/formularios/asignados/insert", authRoutes, asignado.insert);
userRouter.post("/formularios/asignados/update", authRoutes, asignado.update);
userRouter.post("/formularios/asignados/delete", authRoutes, asignado.remove);
userRouter.post("/formularios/asignados/desasignar", authRoutes, asignado.desasignar);
userRouter.post("/formularios/asignados/resolver", authRoutes, asignado.resolver);
userRouter.post("/formularios/asignados/referencias/insert", authRoutes, asignado.insertReferencia);
userRouter.post("/formularios/asignados/referencias/update", authRoutes, asignado.updateReferencia);
userRouter.post("/formularios/asignados/referencias/delete", authRoutes, asignado.removeReferencia);

// pendiente
userRouter.post("/formularios/pendientes/insert", authRoutes, pendiente.insert);
userRouter.post("/formularios/pendientes/update", authRoutes, pendiente.update);
userRouter.post("/formularios/pendientes/delete", authRoutes, pendiente.remove);
userRouter.post("/formularios/pendientes/asignar", authRoutes, pendiente.asignar);

// resuelto
userRouter.post("/formularios/resueltos/desresolver", authRoutes, resuelto.desresolver);

// inicio
userRouter.post("/cambio", authRoutes, inicio.changePassword)
userRouter.post("/perfil/update", authRoutes, inicio.updatePerfil)

export default userRouter