import express from 'express'
import authRoutes from '../middleware/auth'
import * as usuario from '../controllers/user/usuario.controller'
import * as formulario from '../controllers/user/formulario.controller'

const userRouter = express.Router()

//--------------- paginas
// main
userRouter.get('/', authRoutes, usuario.mainPage)
userRouter.get("/logout", usuario.logoutPage)

// perfil
userRouter.get('/perfil/:userid', authRoutes, usuario.perfilPage)

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
// perfil
userRouter.post('/perfil', authRoutes, usuario.updatePerfil)

// cambio password
userRouter.post('/cambio', authRoutes, usuario.changePassword)

// actualizar recurso
userRouter.post('/actualizar', authRoutes, usuario.updateRecurso)

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