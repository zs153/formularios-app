import express from "express";
import { sms, smss, crear, modificar, borrar } from '../models/sms.model'

const apiSmsRouter = express.Router();

// sms
apiSmsRouter.post('/formularios/sms', sms)
apiSmsRouter.post('/formularios/smss', smss)
apiSmsRouter.post('/formularios/smss/insert', crear)
apiSmsRouter.post('/formularios/smss/update', modificar)
apiSmsRouter.post('/formularios/smss/delete', borrar)

export default apiSmsRouter;