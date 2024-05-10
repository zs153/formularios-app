import axios from 'axios'
import { puertoAPI, serverAPI } from '../../config/settings'

// pages
export const mainPage = async (req, res) => {
  const user = req.user
  const fecha = new Date()
  const currentYear = fecha.getFullYear()
  const currentMonth = fecha.getMonth() + 1
  const lastDayMonth = new Date(currentYear, currentMonth, 0).getDate()

  let desde = new Date(yearMonthDayToUTCString(currentYear, currentMonth, 1)).toISOString().slice(0, 10)
  let hasta = new Date(yearMonthDayToUTCString(currentYear, currentMonth, lastDayMonth)).toISOString().slice(0, 10)

  try {
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/carga`, {
      context: {},
    })
    const cargas = result.data.data
    const datos = {
      desde,
      hasta,
      cargas,
    }

    res.render('admin/estadisticas', { user, datos })
  } catch (error) {
    if (error.response?.status === 400) {
      res.render("admin/error400", {
        alerts: [{ msg: error.response.data.data }],
      });
    } else {
      res.render("admin/error500", {
        alerts: [{ msg: error }],
      });
    }
  }
}

// proc
export const generarEstadistica = async (req, res) => {
  const user = req.user
  const periodo = {
    DESDE: req.body.desde,
    HASTA: req.body.hasta,
  }
  const formulario = {
    REFFOR: req.body.refcar,
  }
  const serieR = []

  try {
    const cargas = await axios.post(`http://${serverAPI}:${puertoAPI}/api/carga`, {
      context: {},
    })
    const actuacion = await axios.post(`http://${serverAPI}:${puertoAPI}/api/estadisticas/actuacion`, {
      context: {
        REFFOR: req.body.refcar,
        DESDE: periodo.DESDE,
        HASTA: periodo.HASTA,
      }
    })
    const oficinas = await axios.post(`http://${serverAPI}:${puertoAPI}/api/estadisticas/oficinas`, {
      context: {
        REFFOR: req.body.refcar,
      },
    })
    const usuarios = await axios.post(`http://${serverAPI}:${puertoAPI}/api/estadisticas/usuarios`, {
      context: {
        REFFOR: req.body.refcar,
      }
    })

    actuacion.data.data.map(itm => {
      serieR.push([fechaToUTCString(itm.FECHA), itm.RES])
    })
    
    const contadores = oficinas.data.data.pop()
    const ratios = {
      PEN: Math.round((contadores.PEN * 100 / contadores.TOT) * 100) / 100.0,
      ADJ: Math.round((contadores.ADJ * 100 / contadores.TOT) * 100) / 100.0,
      RES: Math.round((contadores.RES * 100 / contadores.TOT) * 100) / 100.0,      
    }
    const datos = {
      periodo,
      formulario,
      cargas: cargas.data.data,
      oficinas: oficinas.data.data,
      usuarios: usuarios.data.data,
      contadores,
      ratios,
      serieR: JSON.stringify(serieR),
    }

    res.render('admin/estadisticas/resultado', { user, datos })
  } catch (error) {
    if (error.response?.status === 400) {
      res.render("admin/error400", {
        alerts: [{ msg: error.response.data.data }],
      });
    } else {
      res.render("admin/error500", {
        alerts: [{ msg: error }],
      });
    }
  }
}

// helpers
const yearMonthDayToUTCString = (year, month, day) => {
  const yearCDM = ('000' + year).slice(-4)
  const monthCDM = ('0' + month).slice(-2)
  const dayCDM = ('0' + day).slice(-2)

  const fecha = new Date(`${yearCDM}-${monthCDM}-${dayCDM}T00:00:00`)
  const userTimezoneOffset = fecha.getTimezoneOffset() * 60000

  return new Date(fecha.getTime() - userTimezoneOffset).toISOString().slice(0, 10)
}
const fechaToUTCString = (date) => {
  const fecha = new Date(date)
  const userTimezoneOffset = fecha.getTimezoneOffset() * 60000

  return new Date(fecha.getTime() - userTimezoneOffset).toISOString().slice(0, 10)
}