import axios from 'axios'
import { serverAPI, puertoAPI } from '../../config/settings'
import { tiposMovimiento, arrEstadosHito } from '../../public/js/enumeraciones'

// pages
export const mainPage = async (req, res) => {
  const user = req.user
  const dir = req.query.dir ? req.query.dir : 'next'
  const limit = req.query.limit ? req.query.limit : 9
  const part = req.query.part ? req.query.part.toUpperCase() : ''

  let cursor = req.query.cursor ? JSON.parse(req.query.cursor) : null
  let hasPrevs = cursor ? true : false
  let context = {}

  if (cursor) {
    context = {
      limit: limit + 1,
      direction: dir,
      cursor: JSON.parse(convertCursorToNode(JSON.stringify(cursor))),
      part,
    }
  } else {
    context = {
      limit: limit + 1,
      direction: dir,
      cursor: {
        next: '',
        prev: '',
      },
      part,
    }
  }

  try {
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/tipos`, {
      context,
    });

    let tipos = result.data.data
    let hasNexts = tipos.length === limit + 1
    let nextCursor = ''
    let prevCursor = ''

    if (hasNexts) {
      nextCursor= dir === 'next' ? tipos[limit - 1].DESTIP : tipos[0].DESTIP
      prevCursor = dir === 'next' ? tipos[0].DESTIP : tipos[limit - 1].DESTIP
  
      tipos.pop()
    } else {
      nextCursor = dir === 'next' ? '' : tipos[0]?.DESTIP
      prevCursor = dir === 'next' ? tipos[0]?.DESTIP : ''
      
      if (cursor) {
        hasNextOfics = nextCursor === '' ? false : true
        hasPrevOfics = prevCursor === '' ? false : true
      } else {
        hasNextOfics = false
        hasPrevOfics = false
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
      hasNexts,
      hasPrevs,
      cursor: convertNodeToCursor(JSON.stringify(cursor)),
    };

    res.render("admin/tipos", { user, datos });
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

  try {
    const tipo = await axios.post(`http://${serverAPI}:${puertoAPI}/api/tipo`, {
      context: {
        IDTIPO: req.params.id,
      },
    })
    if (tipo.data.stat) {
      const datos = {
        tipo: tipo.data.data,
      }
  
      res.render('admin/tipos/edit', { user, datos })
    } else {
      res.render("admin/error400", {
        alerts: [{ msg: result.data.data }],
      });
    }

  } catch (error) {
    res.render("admin/error500", {
      alerts: [{ msg: error }],
    });
  }
}

// func
export const insert = async (req, res) => {
  const user = req.user
  const tipo = {
    DESTIP: req.body.destip.toUpperCase(),
    AYUTIP: null,
  }
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.crearTipo,
  }

  try {
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/tipos/insert`, {
      tipo,
      movimiento,
    })

    if (result.data.stat) {
      res.redirect(`/admin/tipos?part=${req.query.part}`)
    } else {
      res.render("admin/error400", {
        alerts: [{ msg: result.data.data }],
      });
    }  
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
    AYUTIP: null,
  }
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.modificarTipo,
  }

  try {
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/tipos/update`, {
      tipo,
      movimiento,
    })

    if (result.data.stat) {
      res.redirect(`/admin/tipos?part=${req.query.part}`)
    } else {
      res.render("admin/error400", {
        alerts: [{ msg: result.data.data }],
      });
    } 
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
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/tipos/delete`, {
      tipo,
      movimiento,
    })

    if (result.data.stat) {
      res.redirect(`/admin/tipos?part=${req.query.part}`)
    } else {
      res.render("admin/error400", {
        alerts: [{ msg: result.data.data }],
      });
    }
  } catch (error) {
    res.render("admin/error500", {
      alerts: [{ msg: error }],
    });
  }
}

// helpers
const convertNodeToCursor = (node) => {
  return new Buffer.from(node, 'binary').toString('base64')
}
const convertCursorToNode = (cursor) => {
  return new Buffer.from(cursor, 'base64').toString('binary')
}