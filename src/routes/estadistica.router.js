import express from 'express'
import { actuacion, oficinas, usuarios } from '../controllers/estadistica.controller'

const apiEstadisticaRouter = express.Router()

apiEstadisticaRouter.post('/estadisticas/usuarios', usuarios)
apiEstadisticaRouter.post('/estadisticas/oficinas', oficinas)
apiEstadisticaRouter.post('/estadisticas/actuacion', actuacion)

export default apiEstadisticaRouter
