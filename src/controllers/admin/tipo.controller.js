// imports
import axios from 'axios'
import { serverAPI } from '../../config/settings'
import { arrTiposRol,tiposMovimiento } from '../../public/js/enumeraciones'

// pages
export const mainPage = async (req, res) => {
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
    await axios.post(`http://${serverAPI}/api/tipos`, {
      context,
    }).then(result => {
      let tipos = result.data.data
      let hasNexts = tipos.length === limit +1
      let nextCursor = ''
      let prevCursor = ''
      
      if (hasNexts) {
        nextCursor= dir === 'next' ? tipos[limit - 1].DESTIP : tipos[0].DESTIP
        prevCursor = dir === 'next' ? tipos[0].DESTIP : tipos[limit - 1].DESTIP

        if (context.cursor.prev !== '' || context.cursor.next !== '') {
          hasPrevs = true
        }

        // borrar ultimo elemento
        tipos.pop()
      } else {
        nextCursor = dir === 'next' ? '' : tipos[0]?.DESTIP
        prevCursor = dir === 'next' ? tipos[0]?.DESTIP : ''
        
        if (context.cursor.prev !== '') {
          hasNexts = nextCursor === '' ? false : true
          hasPrevs = prevCursor === '' ? false : true
        }
      }
    
      if (dir === 'prev') {
        tipos = tipos.sort((a,b) => a.DESTIP > b.DESTIP ? 1:-1)
      }
    
      cursor = {
        next: nextCursor,
        prev: prevCursor,
      }    
      const datos = {
        tipos,
        hasPrevs,
        hasNexts,
        cursor: objectToBase64(JSON.stringify(cursor)),
      }
    
      res.render('admin/tipos', { user, datos })    
    });
  } catch (error) {
    res.render("admin/error500", {
      alerts: [{ msg: error }],
    });
  }
}
export const addPage = async (req, res) => {
  const user = req.user

  res.render('admin/tipos/add', { user })
}
export const editPage = async (req, res) => {
  const user = req.user
  const filteredRol = arrTiposRol.filter(itm => itm.id <= user.rol)

  try {
    await axios.post(`http://${serverAPI}/api/tipo`, {
      context: {
        IDTIPO: req.params.id,
      },
    }).then(tipo => {
      if (tipo.data.stat) {
        const datos = {
          tipo: tipo.data.data,
          filteredRol,
        }
    
        res.render('admin/tipos/edit', { user, datos })
      } else {
        res.render("admin/error400", {
          alerts: [{ msg: tipo.data.data }],
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
export const insert = async (req, res) => {
  const user = req.user

  const tipo = {
    DESTIP: req.body.destip.toUpperCase(),
    AYUTIP: req.body.ayutip,
  }
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.crearTipo,
  }

  try {
    await axios.post(`http://${serverAPI}/api/tipos/insert`, {
      tipo,
      movimiento,
    }).then(result => {
      if (result.data.stat) {
        res.redirect(`/admin/tipos?part=${req.query.part}`)
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
export const update = async (req, res) => {
  const user = req.user
  const tipo = {
    IDTIPO: req.body.idtipo,
    DESTIP: req.body.destip.toUpperCase(),
    AYUTIP: req.body.ayutip,
  }
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.modificarTipo,
  }

  try {
    await axios.post(`http://${serverAPI}/api/tipos/update`, {
      tipo,
      movimiento,
    }).then(result => {
      if (result.data.stat) {
        res.redirect(`/admin/tipos?part=${req.query.part}`)
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
export const remove = async (req, res) => {
  const user = req.user
  const tipo = {
    IDTIPO: req.body.idtipo,
  }
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.borrarTipo,
  }

  try {
    await axios.post(`http://${serverAPI}/api/tipos/delete`, {
      tipo,
      movimiento,
    }).then(result => {
      if (result.data.stat) {
        res.redirect(`/admin/tipos?part=${req.query.part}`)
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
