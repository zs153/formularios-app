import express from 'express'
import authRoutes from '../middleware/auth'
import * as asignado from '../controllers/user/formularios/asignado.controller'
import * as pendiente from '../controllers/user/formularios/pendiente.controller'
import * as referencia from '../controllers/user/formularios/referencia.controller'
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

// pendientes
userRouter.get("/formularios", authRoutes,pendiente.mainPage);
userRouter.get("/formularios/add", authRoutes, pendiente.addPage);
userRouter.get("/formularios/edit/:id", authRoutes, pendiente.editPage);

// referencia
userRouter.get("/formularios/referencias/:id", authRoutes, referencia.mainPage);
userRouter.get("/formularios/referencias/add/:id", authRoutes, referencia.addPage);
userRouter.get("/formularios/referencias/edit/:idfor/:idref", authRoutes, referencia.editPage);

// resueltos
userRouter.get("/formularios/resueltos", authRoutes, resuelto.mainPage);
userRouter.get("/formularios/resueltos/edit/:id", authRoutes, resuelto.editPage);

// inicio
userRouter.get('/', authRoutes, inicio.mainPage)
userRouter.get('/perfil', authRoutes, inicio.perfilPage)
userRouter.get("/logout", authRoutes, inicio.logoutPage)

//--------------- procedures
// asignar
userRouter.post("/formularios/asignar/insert", authRoutes, asignado.insert);
userRouter.post("/formularios/asignar/update", authRoutes, asignado.update);
userRouter.post("/formularios/asignar/delete", authRoutes, asignado.remove);
userRouter.post("/formularios/asignar/desasignar", authRoutes, asignado.desasignar);
userRouter.post("/formularios/asignar/resolver", authRoutes, asignado.resolver);

// pendiente
userRouter.post("/formularios/pendientes/insert", authRoutes, pendiente.insert);
userRouter.post("/formularios/pendientes/update", authRoutes, pendiente.update);
userRouter.post("/formularios/pendientes/delete", authRoutes, pendiente.remove);
userRouter.post("/formularios/pendientes/desasignar", authRoutes, pendiente.asignar);

// referencias
userRouter.post("/formularios/referencias/insert", authRoutes, referencia.insert);
userRouter.post("/formularios/referencias/update", authRoutes, referencia.update);
userRouter.post("/formularios/referencias/delete", authRoutes, referencia.remove);

// resuelto
userRouter.post("/formularios/resueltos/delete", authRoutes, resuelto.remove);
userRouter.post("/formularios/resueltos/desasignar", authRoutes, resuelto.desasignar);

// inicio
userRouter.post("/cambio", authRoutes, inicio.changePassword)
userRouter.post("/perfil/update", authRoutes, inicio.updatePerfil)

export default userRouter