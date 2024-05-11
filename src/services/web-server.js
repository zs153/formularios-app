import http from 'http'
import logger from 'morgan'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { puertoAPI } from '../config/settings'
// routes
import apiOficinaRouter from '../routes/oficina.router'
import apiUsuarioRouter from '../routes/usuario.router'
import apiHistoricoRouter from '../routes/historico.router'
import apiGenteRouter from '../routes/gente.router'
import apiFormularioRouter from '../routes/formulario.router'
import apiTipoRouter from '../routes/tipo.router'
import apiCargaRouter from '../routes/carga.router'
import apiEstadisticaRouter from '../routes/estadistica.router'

/**
 * Normalize a port into a number, string, or false.
 */
const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
};

let httpServer

function initialize() {
  return new Promise((resolve, reject) => {
    const app = express()
    httpServer = http.createServer(app)

    // middleware
    app.use(logger('dev'))
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cookieParser())
    app.use(cors())

    // routes
    app.use('/api', apiOficinaRouter)
    app.use('/api', apiUsuarioRouter)
    app.use('/api', apiHistoricoRouter)
    app.use('/api', apiGenteRouter)
    app.use('/api', apiFormularioRouter)
    app.use('/api', apiTipoRouter)
    app.use('/api', apiCargaRouter)
    app.use('/api', apiEstadisticaRouter)

    const port = normalizePort(puertoAPI || "8000");

    // server
    httpServer
      .listen(port)
      .on('listening', () => {
        console.log(`Web server listening on conexion: port:${port} `)

        resolve()
      })
      .on('error', (err) => {
        reject(err)
      })
  })
}
module.exports.initialize = initialize

function close() {
  return new Promise((resolve, reject) => {
    httpServer.close((err) => {
      if (err) {
        reject(err)
        return
      }

      resolve()
    })
  })
}
module.exports.close = close