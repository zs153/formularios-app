import express from 'express'
import {
  formulario,
  formularios,
  crear,
  modificar,
  borrar,
  estado,
  cerrar,
} from '../controllers/formulario.controller'

const apiFormularioRouter = express.Router()

// formularios
apiFormularioRouter.post('/formulario', formulario)
apiFormularioRouter.post('/formularios', formularios)
apiFormularioRouter.post('/formularios/insert', crear)
apiFormularioRouter.post('/formularios/update', modificar)
apiFormularioRouter.post('/formularios/delete', borrar)
apiFormularioRouter.post('/formularios/state', estado)
apiFormularioRouter.post('/formularios/close', cerrar)

export default apiFormularioRouter