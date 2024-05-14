import express from 'express'
import authRoutes from '../middleware/auth'
import * as formulario from '../controllers/user/formularios/formulario.controller'
import * as inicio from '../controllers/user/inicio.controller'
import * as referencia from '../controllers/user/formularios/referencias/referencia.controller'

const userRouter = express.Router()

//--------------- paginas
// main
userRouter.get('/', authRoutes, inicio.mainPage)
userRouter.get('/perfil', authRoutes, inicio.perfilPage)
userRouter.get("/logout", authRoutes, inicio.logoutPage)

// formulario
userRouter.get("/formularios", authRoutes,formulario.mainPage);
userRouter.get("/formularios/add", authRoutes, formulario.addPage);
userRouter.get("/formularios/edit/:id", authRoutes, formulario.editPage);
userRouter.get("/formularios/pendientes", authRoutes, formulario.pendientesPage);
userRouter.get("/formularios/resolver/:id", authRoutes, formulario.resolverPage);
userRouter.get("/formularios/resueltos", authRoutes, formulario.resueltosPage);
userRouter.get("/formularios/resueltos/readonly/:id", authRoutes, formulario.readonlyPage);

// inicio
userRouter.get('/', authRoutes, inicio.mainPage)
userRouter.get('/perfil', authRoutes, inicio.perfilPage)
userRouter.get("/logout", authRoutes, inicio.logoutPage)

// referencia
userRouter.get("/formularios/referencias/:id", authRoutes, referencia.mainPage);
userRouter.get("/formularios/referencias/add/:id", authRoutes, referencia.addPage);
userRouter.get("/formularios/referencias/edit/:idfor/:idref", authRoutes, referencia.editPage);
userRouter.get("/formularios/referencias/readonly/:id", authRoutes, referencia.readonlyPage);

//--------------- procedures
// inicio
userRouter.post("/cambio", authRoutes, inicio.changePassword)
userRouter.post("/perfil/update", authRoutes, inicio.updatePerfil)

// formulario
userRouter.post("/formularios/insert", authRoutes, formulario.insert);
userRouter.post("/formularios/update", authRoutes, formulario.update);
userRouter.post("/formularios/delete", authRoutes, formulario.remove);
userRouter.post("/formularios/asignar", authRoutes, formulario.asignar);
userRouter.post("/formularios/desasignar", authRoutes, formulario.desasignar);
userRouter.post("/formularios/resolver", authRoutes, formulario.resolver);

// inicio
userRouter.post("/perfil/update", authRoutes, inicio.updatePerfil)
userRouter.post("/cambio", authRoutes, inicio.changePassword)

// referencias
userRouter.post("/formularios/referencias/insert", authRoutes, referencia.insert);
userRouter.post("/formularios/referencias/update", authRoutes, referencia.update);
userRouter.post("/formularios/referencias/delete", authRoutes, referencia.remove);

export default userRouter