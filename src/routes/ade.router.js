import express from 'express'
import {
  formulario,
  formularios,
  asignar,
  desAsignar,
} from '../controllers/ade.controller'

const apiAdeRouter = express.Router()

apiAdeRouter.post('/formulario', formulario)
apiAdeRouter.post('/formularios', formularios)
apiAdeRouter.post('/formularios/asign', asignar)
apiAdeRouter.post('/formularios/unasing', desAsignar)

export default apiAdeRouter