import express from 'express'
import {
  formulario,
  formularios,
  crear,
  modificar,
  borrar,
  estado,
  cerrar,
  asignar,
  desAsignar,
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

// ades
apiFormularioRouter.post('/formularios/asign', asignar)
apiFormularioRouter.post('/formularios/unasing', desAsignar)

export default apiFormularioRouter