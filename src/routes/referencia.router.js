import express from 'express'
import {
  referencia,
  referencias,
  crear,
  modificar,
  borrar,
} from '../controllers/referencia.controller'

const apiReferenciaRouter = express.Router();

// referencias
apiReferenciaRouter.post('/formularios/referencia', referencia)
apiReferenciaRouter.post('/formularios/referencias', referencias)
apiReferenciaRouter.post('/formularios/referencias/insert', crear)
apiReferenciaRouter.post('/formularios/referencias/update', modificar)
apiReferenciaRouter.post('/formularios/referencias/delete', borrar)

export default apiReferenciaRouter;