import express from 'express'
import {
  ade,
  ades,
  asignar,
  desAsignar,
} from '../controllers/ade.controller'

const apiAdeRouter = express.Router()

apiAdeRouter.post('/ade', ade)
apiAdeRouter.post('/ades', ades)
apiAdeRouter.post('/ades/asign', asignar)
apiAdeRouter.post('/ades/unasign', desAsignar)

export default apiAdeRouter