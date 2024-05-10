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

  try {
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/tipos`, {
      context: {
        limit: limit + 1,
        direction: dir,
        cursor: cursor ? JSON.parse(convertCursorToNode(JSON.stringify(cursor))) : {next: 0 , prev: 0},
        part,
      },
    });

    let tipos = result.data.data
    let hasNexts = tipos.length === limit + 1
    let nextCursor = 0
    let prevCursor = 0

    if (hasNexts) {
      nextCursor = dir === 'next' ? tipos[limit - 1].IDTIPO : tipos[0].IDTIPO
      prevCursor = dir === 'next' ? tipos[0].IDTIPO : tipos[limit - 1].IDTIPO

      tipos.pop()
    } else {
      nextCursor = dir === 'next' ? 0 : tipos[0]?.IDTIPO
      prevCursor = dir === 'next' ? tipos[0]?.IDTIPO : 0

      if (cursor) {
        hasNexts = nextCursor === 0 ? false : true
        hasPrevs = prevCursor === 0 ? false : true
      } else {
        hasNexts = false
        hasPrevs = false
      }
    }

    if (dir === 'prev') {
      tipos = tipos.reverse()
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
    res.render('admin/tipos/add', { user })
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
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/tipo`, {
      context: {
        IDTIPO: req.params.id,
      },
    })
    const tipo = result.data.data[0]
    const datos = {
      tipo,
    }

    res.render('admin/tipos/edit', { user, datos })
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
    await axios.post(`http://${serverAPI}:${puertoAPI}/api/tipos/insert`, {
      tipo,
      movimiento,
    })

    res.redirect(`/admin/tipos?part=${req.query.part}`)
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
    await axios.post(`http://${serverAPI}:${puertoAPI}/api/tipos/update`, {
      tipo,
      movimiento,
    })

    res.redirect(`/admin/tipos?part=${req.query.part}`)
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
  const tipo = {
    IDTIPO: req.body.idtipo,
  }
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.borrarTipo,
  }

  try {
    await axios.post(`http://${serverAPI}:${puertoAPI}/api/tipos/delete`, {
      tipo,
      movimiento,
    })

    res.redirect(`/admin/tipos?part=${req.query.part}`)
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