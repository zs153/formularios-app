import axios from 'axios'
import { serverAPI,puertoAPI } from "../../config/settings";
import { tiposRol,tiposMovimiento } from '../../public/js/enumeraciones'

export const mainPage = async (req, res) => {
  const user = req.user

  const dir = req.query.dir ? req.query.dir : 'next'
  const limit = req.query.limit ? req.query.limit : 9
  const part = req.query.part ? req.query.part.toUpperCase() : ''

  let cursor = req.query.cursor ? JSON.parse(req.query.cursor) : null
  let hasPrevs = cursor ? true : false

  try {
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/oficinas`, {
      context: {
        limit: limit + 1,
        direction: dir,
        cursor: cursor ? JSON.parse(convertCursorToNode(JSON.stringify(cursor))) : {next: 0 , prev: 0},
        part,
      },
    })

    let oficinas = result.data.data
    let hasNexts = oficinas.length === limit +1
    let nextCursor = 0
    let prevCursor = 0
    
    if (hasNexts) {
      nextCursor = dir === 'next' ? oficinas[limit - 1].IDOFIC : oficinas[0].IDOFIC
      prevCursor = dir === 'next' ? oficinas[0].IDOFIC : oficinas[limit - 1].IDOFIC

      oficinas.pop()
    } else {
      nextCursor = dir === 'next' ? 0 : oficinas[0]?.IDOFIC
      prevCursor = dir === 'next' ? oficinas[0]?.IDOFIC : 0
      
      if (cursor) {
        hasNexts = nextCursor === 0 ? false : true
        hasPrevs = prevCursor === 0 ? false : true
      } else {
        hasNexts = false
        hasPrevs = false
      }
    }

    if (dir === 'prev') {
      oficinas = oficinas.reverse()
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
export const addPage = async (req, res) => {
  const user = req.user

  try {
    res.render('admin/oficinas/add', { user })
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
export const editPage = async (req, res) => {
  const user = req.user
  try {
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/oficina`, {
      context: {
        IDOFIC: req.params.id,
      },
    })
    const datos = {
      oficina: result.data.data[0],
      tiposRol,
    }

    res.render('admin/oficinas/edit', { user, datos })
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
    await axios.post(`http://${serverAPI}:${puertoAPI}/api/oficinas/insert`, {
      oficina,
      movimiento,
    })

    res.redirect(`/admin/oficinas?part=${req.query.part}`)
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
    await axios.post(`http://${serverAPI}:${puertoAPI}/api/oficinas/update`, {
      oficina,
      movimiento,
    })

    res.redirect(`/admin/oficinas?part=${req.query.part}`)
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
    await axios.post(`http://${serverAPI}:${puertoAPI}/api/oficinas/delete`, {
      oficina,
      movimiento,
    })

    res.redirect(`/admin/oficinas?part=${req.query.part}`)
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
const convertNodeToCursor = (node) => {
  return new Buffer.from(node, 'binary').toString('base64')
}
const convertCursorToNode = (cursor) => {
  return new Buffer.from(cursor, 'base64').toString('binary')
}