import axios from "axios";
import { estadosDocumento, tiposMovimiento, estadosUsuario } from "../../../public/js/enumeraciones";
import { serverAPI } from '../../../config/settings'

// pages
export const asignadosPage = async (req, res) => {
  const user = req.user
  const dir = req.query.dir ? req.query.dir : 'next'
  const limit = req.query.limit ? req.query.limit : 10
  const part = req.query.part ? req.query.part.toUpperCase() : ''

  let cursor = req.query.cursor ? req.query.cursor : objectToBase64(JSON.stringify({next: '', prev: ''}))
  let hasPrevs = false

  const context = {
    limit: limit + 1,
    direction: dir,
    cursor: JSON.parse(base64ToObject(cursor)),
    part,
  }

  try {
    await axios.post(`http://${serverAPI}/api/usuarios`, {
      context,
    }).then(result => {
      let usuarios = result.data.data
      let hasNexts = usuarios.length === limit +1
      let nextCursor = ''
      let prevCursor = ''
      
      if (hasNexts) {
        nextCursor= dir === 'next' ? usuarios[limit - 1].NOMUSU : usuarios[0].NOMUSU
        prevCursor = dir === 'next' ? usuarios[0].NOMUSU : usuarios[limit - 1].NOMUSU
    
        if (context.cursor.prev !== '' || context.cursor.next !== '') {
          hasPrevs = true
        }

        // borrar ultimo elemento
        usuarios.pop()
      } else {
        nextCursor = dir === 'next' ? '' : usuarios[0]?.NOMUSU
        prevCursor = dir === 'next' ? usuarios[0]?.NOMUSU : ''
        
        if (context.cursor.prev !== '') {
          hasPrevs = prevCursor === '' ? false : true
          hasNexts = nextCursor === '' ? false : true
        }
      }
    
      if (dir === 'prev') {
        usuarios = usuarios.sort((a,b) => a.NOMUSU > b.NOMUSU ? 1:-1)
      }
    
      cursor = {
        next: nextCursor,
        prev: prevCursor,
      }    
      const datos = {
        usuarios,
        hasPrevs,
        hasNexts,
        cursor: objectToBase64(JSON.stringify(cursor)),
        estadosUsuario,
      }
    
      res.render('admin/formularios/asignados/ades', { user, datos })
    });
  } catch (error) {
    res.render("admin/error500", {
      alerts: [{ msg: error }],
    });
  }
}
export const pendientesPage = async (req, res) => {
  const user = req.user
  const dir = req.query.dir ? req.query.dir : 'next'
  const limit = req.query.limit ? req.query.limit : 10
  const part = req.query.part ? req.query.part.toUpperCase() : ''

  let cursor = req.query.cursor ? req.query.cursor : objectToBase64(JSON.stringify({next: '', prev: ''}))
  let hasPrevs = false

  const context = {
    limit: limit +1,
    direction: dir,
    cursor: JSON.parse(base64ToObject(cursor)),
    part,
  }

  try {
    await axios.post(`http://${serverAPI}/api/usuarios`, {
      context,
    }).then(result => {
      let usuarios = result.data.data
      let hasNexts = usuarios.length === limit +1
      let nextCursor = ''
      let prevCursor = ''
      
      if (hasNexts) {
        nextCursor= dir === 'next' ? usuarios[limit - 1].NOMUSU : usuarios[0].NOMUSU
        prevCursor = dir === 'next' ? usuarios[0].NOMUSU : usuarios[limit - 1].NOMUSU

        if (context.cursor.prev !== '' || context.cursor.next !== '') {
          hasPrevs = true
        }

        // borrar ultimo elemento
        usuarios.pop()
      } else {
        nextCursor = dir === 'next' ? '' : usuarios[0]?.NOMUSU
        prevCursor = dir === 'next' ? usuarios[0]?.NOMUSU : ''
        
        if (context.cursor.prev !== '') {
          hasNexts = nextCursor === '' ? false : true
          hasPrevs = prevCursor === '' ? false : true
        }
      }
    
      if (dir === 'prev') {
        usuarios = usuarios.sort((a,b) => a.NOMUSU > b.NOMUSU ? 1:-1)
      }
    
      cursor = {
        next: nextCursor,
        prev: prevCursor,
      }    
      const datos = {
        usuarios,
        hasPrevs,
        hasNexts,
        cursor: objectToBase64(JSON.stringify(cursor)),
        estadosUsuario,
      }
    
      res.render('admin/formularios/pendientes/ades', { user, datos })
    });
  } catch (error) {
    res.render("admin/error500", {
      alerts: [{ msg: error }],
    });
  }
}
export const asignarPage = async (req, res) => {
  const user = req.user
  const dir = 'next'
  const limit = 99

  let part = ''
  let rest = ''
  let alerts = undefined

  if (req.query.part) {
    const partes = req.query.part.split(',')

    part = partes[0].toUpperCase()
    if (partes.length > 1) {
      rest = partes[1].toUpperCase()
    }
  }

  try {
    await axios.post(`http://${serverAPI}/api/usuario`, {
      context: {
        IDUSUA: req.params.id,
      },
    }).then(async usuario => {
      if (usuario.data.stat) {
        await axios.post(`http://${serverAPI}/api/formularios`, {
          context: {
            stafor: estadosDocumento.pendiente,
            limit: limit +1,
            direction: dir,
            cursor: { next: 0 },
            part,
            rest,
          },
        }).then(result => {
          let formularios = result.data.data
          let hasNexts = formularios.length === limit +1

          if (hasNexts) {
            alerts = [{ msg: 'Se supera el límite de registros permitidos. Sólo se muestran los 100 primeros. Refine la consulta' }]
          }
      
          const datos = {
            usuario: usuario.data.data,
            formularios,
            alerts,
          };
      
          res.render("admin/formularios/pendientes/ades/asignar", { user, datos });
        });
      } else {
        res.render("admin/error400", {
          alerts: [{ msg: usuario.data.data }],
        });
      }
    });
  } catch (error) {
    res.render("admin/error500", {
      alerts: [{ msg: error }],
    });
  }
};
export const desAsignarPage = async (req, res) => {
  const user = req.user
  const dir = 'next'
  const limit = 99

  let part = ''
  let rest = ''
  let alerts = undefined

  if (req.query.part) {
    const partes = req.query.part.split(',')

    part = partes[0].toUpperCase()
    if (partes.length > 1) {
      rest = partes[1].toUpperCase()
    }
  }

  try {
    await axios.post(`http://${serverAPI}/api/usuario`, {
      context: {
        IDUSUA: req.params.id,
      },
    }).then(async usuario => {
      if (usuario.data.stat) {
        await axios.post(`http://${serverAPI}/api/formularios`, {
          context: {
            liqfor: usuario.data.data.USERID,
            stafor: estadosDocumento.asignado,
            limit: limit +1,
            direction: dir,
            cursor: { next: 0 },
            part,
            rest,
          },
        }).then(result => {
          let formularios = result.data.data
          let hasNexts = formularios.length === limit +1

          if (hasNexts) {
            alerts = [{ msg: 'Se supera el límite de registros permitidos. Sólo se muestran los 100 primeros. Refine la consulta' }]
          }
      
          const datos = {
            usuario: { IDUSUA: usuario.data.data.IDUSUA, USERID: usuario.data.data.USERID },
            formularios,
            alerts,
          };
      
          res.render('admin/formularios/asignados/ades/desasignar', { user, datos });
        });
      } else {
        res.render("admin/error400", {
          alerts: [{ msg: usuario.data.data }],
        });
      }
    });
  } catch (error) {
    res.render("admin/error500", {
      alerts: [{ msg: error }],
    });
  }
}

// proc
export const asignar = async (req, res) => {
  const user = req.user;
  
  if (req.body.arrfor === '') {
    throw "No se han seleccionado registros para procesar."
  }

  try {
    const formulario = {
      LIQFOR: req.body.userid,
      STAFOR: estadosDocumento.asignado,
    }
    const formularios = {
      ARRFOR: JSON.parse(req.body.arrfor)
    }
    const movimiento = {
      USUMOV: user.id,
      TIPMOV: tiposMovimiento.asignarFormulario,
    }
    await axios.post(`http://${serverAPI}/api/ades/asign`, {
      formulario,
      formularios,
      movimiento,
    }).then(result => {
      if (result.data.stat) {
        res.redirect(`/admin/formularios/pendientes/ades?part=${req.query.part}`);
      } else {
        res.render("admin/error400", {
          alerts: [{ msg: result.data.data }],
        });
      }
    });
  } catch (error) {
    res.render("admin/error500", {
      alerts: [{ msg: error }],
    });
  }
}
export const desAsignar = async (req, res) => {
  const user = req.user;
  
  try {
    if (req.body.arrfor === '') {
      throw "No se han seleccionado registros para procesar."
    }

    const formulario = {
      LIQFOR: 'PEND',
      STAFOR: estadosDocumento.pendiente,
    }
    const formularios = {
      ARRFOR: JSON.parse(req.body.arrfor)
    }
    const movimiento = {
      USUMOV: user.id,
      TIPMOV: tiposMovimiento.asignarFormulario,
    }

    await axios.post(`http://${serverAPI}/api/ades/unasign`, {
      formulario,
      formularios,
      movimiento,
    }).then(result => {
      if (result.data.stat) {
        res.redirect(`/admin/formularios/asignados/ades?part=${req.query.part}`);
      } else {
        res.render("admin/error400", {
          alerts: [{ msg: result.data.data }],
        });
      }
    });
  } catch (error) {
    res.render("admin/error500", {
      alerts: [{ msg: error }],
    });
  }
}

// helpers
const objectToBase64 = (node) => {
  return new Buffer.from(node, 'binary').toString('base64')
}
const base64ToObject = (cursor) => {
  return new Buffer.from(cursor, 'base64').toString('binary')
}
