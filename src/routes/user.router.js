import express from 'express'
import authRoutes from '../middleware/auth'
import * as formulario from '../controllers/user/formulario.controller'
import * as inicio from '../controllers/user/inicio.controller'

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
userRouter.get("/formularios/resueltos", authRoutes, formulario.resueltosPage);
userRouter.get("/formularios/readonly/:id", authRoutes, formulario.readonlyPage);

// referencias
userRouter.get("/formularios/referencias/:id", authRoutes, formulario.referenciasPage);
userRouter.get("/formularios/referencias/add/:id", authRoutes, formulario.referenciasAddPage);
userRouter.get("/formularios/referencias/edit/:idfor/:idref", authRoutes, formulario.referenciasEditPage);
userRouter.get("/formularios/resolver/:id", authRoutes, formulario.resolverPage);
userRouter.get("/formularios/referencias/readonly/:id", authRoutes, formulario.referenciasReadonlyPage);

// smss
userRouter.get("/formularios/smss/:id", authRoutes, formulario.smssPage);
userRouter.get("/formularios/smss/add/:id", authRoutes, formulario.smssAddPage);
userRouter.get("/formularios/smss/edit/:idfor/:idsms", authRoutes, formulario.smssEditPage);
userRouter.get("/formularios/smss/readonly/:id", authRoutes, formulario.smssReadonlyPage);

//--------------- procedures
// inicio
userRouter.post("/cambio", authRoutes, inicio.changePassword)
userRouter.post("/perfil/update", authRoutes, inicio.updatePerfil)

// actualizar recurso
// TODO
//userRouter.post('/actualizar', authRoutes, usuario.updateRecurso)

// formularios
userRouter.post("/formularios/insert", authRoutes, formulario.insert);
userRouter.post("/formularios/update", authRoutes, formulario.update);
userRouter.post("/formularios/delete", authRoutes, formulario.remove);
userRouter.post("/formularios/asignar", authRoutes, formulario.asignar);
userRouter.post("/formularios/desasignar", authRoutes, formulario.desasignar);
userRouter.post("/formularios/resolver", authRoutes, formulario.resolver);

// referencias
userRouter.post("/formularios/referencias/insert", authRoutes, formulario.insertReferencia);
userRouter.post("/formularios/referencias/update", authRoutes, formulario.updateReferencia);
userRouter.post("/formularios/referencias/delete", authRoutes, formulario.removeReferencia);

// sms
userRouter.post("/formularios/smss/insert", authRoutes, formulario.insertSms);
userRouter.post("/formularios/smss/update", authRoutes, formulario.updateSms);
userRouter.post("/formularios/smss/delete", authRoutes, formulario.removeSms);

export default userRouter