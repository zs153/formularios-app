import axios from 'axios'
import { puertoAPI, serverAPI } from '../../config/settings'

// pages
export const mainPage = async (req, res) => {
  const user = req.user
  const fecha = new Date()
  const currentYear = fecha.getFullYear()
  const currentMonth = fecha.getMonth() + 1
  const lastDayMonth = new Date(currentYear, currentMonth, 0).getDate()

  const desde = yearMonthDayToUTCString(currentYear, currentMonth, 1)
  const hasta = yearMonthDayToUTCString(currentYear, currentMonth, lastDayMonth)
 
  const datos = {
    desde,
    hasta,
  }

  res.render('admin/estadisticas', { user, datos })
}

// proc
export const generar = async (req, res) => {
  const user = req.user
  const periodo = {
    DESDE: req.body.desde,
    HASTA: req.body.hasta,
  }
  const formulario = {
    REFFOR: req.body.refcar,
  }
  let serieR = []
  let contadores = []
  let ratios = {}
  let userWork = []

  try {
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
    await axios.post(`http://${serverAPI}:${puertoAPI}/api/estadisticas/usuarios`, {
      context: {
        REFFOR: req.body.refcar,
      }
    }).then(usuarios => {
      usuarios.data.data.map(itm => {
        if (itm.TOT > 0) {
          userWork.push({
            USERID: itm.USERID,
            ADJ: itm.ADJ,
            PORADJ: Math.round(itm.ADJ *100  / itm.TOT * 100) / 100,
            RES: itm.RES,
            PORRES: Math.round(itm.RES* 100 / itm.TOT * 100) / 100,
          })
        } else {
          userWork.push({
            USERID: itm.USERID,
            ADJ: itm.ADJ,
            PORADJ: 0,
            RES: itm.RES,
            PORRES: 0,
          })
        }
      })
    })

    if (actuacion.data.stat) {
      actuacion.data.data.map(itm => {
        serieR.push([fechaToUTCString(itm.FECHA), itm.RES])
      })
    }
    
    if (oficinas.data.stat) {
      contadores = oficinas.data.data.pop()
      ratios = {
        PEN: Math.round((contadores.PEN * 100 / contadores.TOT) * 100) / 100.0,
        ADJ: Math.round((contadores.ADJ * 100 / contadores.TOT) * 100) / 100.0,
        RES: Math.round((contadores.RES * 100 / contadores.TOT) * 100) / 100.0,      
      }
    }

    const datos = {
      periodo,
      formulario,
      oficinas: oficinas.data.data,
      usuarios: userWork,
      contadores,
      ratios,
      serieR: JSON.stringify(serieR),
    }

    res.render('admin/estadisticas/resultado', { user, datos })
  } catch (error) {
    res.render("admin/error500", {
      alerts: [{ msg: error }],
    });
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