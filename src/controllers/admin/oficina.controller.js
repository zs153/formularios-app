import axios from 'axios'
import { serverAPI,puertoAPI } from "../../config/settings";
import { arrTiposRol,tiposMovimiento } from '../../public/js/enumeraciones'

// pages
export const mainPage = async (req, res) => {
  const user = req.user

  const dir = req.query.dir ? req.query.dir : 'next'
  const limit = req.query.limit ? req.query.limit : 10
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
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/oficinas`, {
      context,
    })

    let oficinas = result.data.data
    let hasNexts = oficinas.length === limit +1
    let nextCursor = ''
    let prevCursor = ''
    
    if (hasNexts) {
      nextCursor= dir === 'next' ? oficinas[limit - 1].DESOFI : oficinas[0].DESOFI
      prevCursor = dir === 'next' ? oficinas[0].DESOFI : oficinas[limit - 1].DESOFI
  
      oficinas.pop()
    } else {
      nextCursor = dir === 'next' ? '' : oficinas[0]?.DESOFI
      prevCursor = dir === 'next' ? oficinas[0]?.DESOFI : ''
      
      if (cursor) {
        hasNextOfics = nextCursor === '' ? false : true
        hasPrevOfics = prevCursor === '' ? false : true
      } else {
        hasNextOfics = false
        hasPrevOfics = false
      }
    }

    if (dir === 'prev') {
      oficinas = oficinas.sort((a,b) => a.DESOFI > b.DESOFI ? 1:-1)
    }

    cursor = {
      next: nextCursor,
      prev: prevCursor,
    }
    const datos = {
      oficinas,
      hasNexts,
      hasPrevs,
      cursor: convertNodeToCursor(JSON.stringify(cursor)),
    }

    res.render('admin/oficinas', { user, datos })
  } catch (error) {
    res.render("admin/error500", {
      alerts: [{ msg: error }],
    });
  }
}
export const addPage = async (req, res) => {
  const user = req.user
  const filteredRol = arrTiposRol.filter(itm => itm.id <= user.rol)

  const datos = {
    filteredRol,
  }

  res.render('admin/oficinas/add', { user, datos })
}
export const editPage = async (req, res) => {
  const user = req.user
  const filteredRol = arrTiposRol.filter(itm => itm.id <= user.rol)

  try {
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/oficina`, {
      context: {
        IDOFIC: req.params.id,
      },
    })

    if (oficina.data.stat) {
      const datos = {
        oficina: oficina.data.data,
        filteredRol,
      }
  
      res.render('admin/oficinas/edit', { user, datos })
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

// proc
export const insert = async (req, res) => {
  const user = req.user
  const oficina = {
    DESOFI: req.body.desofi.toUpperCase(),
    CODOFI: req.body.codofi.toUpperCase(),
  }
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.crearOficina,
  }

  try {
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/oficinas/insert`, {
      oficina,
      movimiento,
    })

    if (result.data.stat) {
      res.redirect(`/admin/oficinas?part=${req.query.part}`)
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
  const oficina = {
    IDOFIC: req.body.idofic,
    DESOFI: req.body.desofi.toUpperCase(),
    CODOFI: req.body.codofi.toUpperCase(),
  }
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.modificarOficina,
  }

  try {
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/oficinas/update`, {
      oficina,
      movimiento,
    })

    if (result.data.stat) {
      res.redirect(`/admin/oficinas?part=${req.query.part}`)
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
  const oficina = {
    IDOFIC: req.body.idofic,
  }
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.borrarOficina,
  }

  try {
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/oficinas/delete`, {
      oficina,
      movimiento,
    })
  
    if (result.data.stat) {
      res.redirect(`/admin/oficinas?part=${req.query.part}`)
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