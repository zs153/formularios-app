import axios from 'axios'
import { serverAPI,puertoAPI } from '../../config/settings'
import { tiposMovimiento,arrTiposRol,arrTiposPerfil } from '../../public/js/enumeraciones'

// pages
export const mainPage = async (req, res) => {
  const user = req.user

  const dir = req.query.dir ? req.query.dir : 'next'
  const limit = req.query.limit ? req.query.limit : 9
  const part = req.query.part ? req.query.part.toUpperCase() : ''

  let cursor = req.query.cursor ? JSON.parse(req.query.cursor) : null
  let hasPrevs = cursor ? true : false

  try {
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/historicos`, {
      context: {
        limit: limit + 1,
        direction: dir,
        cursor: cursor ? JSON.parse(convertCursorToNode(JSON.stringify(cursor))) : {next: '' , prev: ''},
        part,
      },
    })

    let usuarios = result.data.data
    let hasNexts = usuarios.length === limit +1
    let nextCursor = ''
    let prevCursor = ''
    
    if (hasNexts) {
      nextCursor = dir === 'next' ? usuarios[limit - 1].NOMUSU : usuarios[0].NOMUSU
      prevCursor = dir === 'next' ? usuarios[0].NOMUSU : usuarios[limit - 1].NOMUSU

      usuarios.pop()
    } else {
      nextCursor = dir === 'next' ? '' : usuarios[0]?.NOMUSU
      prevCursor = dir === 'next' ? usuarios[0]?.NOMUSU : ''
      
      if (cursor) {
        hasNexts = nextCursor === '' ? false : true
        hasPrevs = prevCursor === '' ? false : true
      } else {
        hasNexts = false
        hasPrevs = false
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
      hasNexts,
      hasPrevs,
      cursor: convertNodeToCursor(JSON.stringify(cursor)),
    }

    res.render('admin/historicos', { user, datos })
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
  const filteredRol = arrTiposRol.filter(itm => itm.id <= user.rol)

  try {
    const oficinas = await axios.post(`http://${serverAPI}:${puertoAPI}/api/oficina`, {
      context: {}
    })
    const usuario = await axios.post(`http://${serverAPI}:${puertoAPI}/api/historico`, {
      context: {
        IDUSUA: req.params.id,
      },
    })
    const datos = {
      usuario: usuario.data.data[0],
      oficinas: oficinas.data.data,
      filteredRol,
      arrTiposPerfil,
    }

    res.render('admin/historicos/edit', { user, datos })
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
export const update = async (req, res) => {
  const user = req.user
  const usuario = {
    IDUSUA: req.body.idusua,
    NOMUSU: req.body.nomusu,
    OFIUSU: req.body.ofiusu,
    ROLUSU: req.body.rolusu,
    USERID: req.body.userid,
    EMAUSU: req.body.emausu,
    PERUSU: req.body.perusu,
    TELUSU: req.body.telusu,
  }
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.modificarHistorico,
  }

  try {
    await axios.post(`http://${serverAPI}:${puertoAPI}/api/historicos/update`, {
      usuario,
      movimiento,
    })

    res.redirect(`/admin/historicos?part=${req.query.part}`)
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
  const usuario = {
    IDUSUA: req.body.idusua,
  }
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.borrarHistorico,
  }

  try {
    await axios.post(`http://${serverAPI}:${puertoAPI}/api/historicos/delete`, {
      usuario,
      movimiento,
    })

    res.redirect(`/admin/historicos?part=${req.query.part}`)
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
export const activar = async (req, res) => {
  const user = req.user

  try {
    const usuario = {
      IDUSUA: req.body.idusua,
    }
    const movimiento = {
      USUMOV: user.id,
      TIPMOV: tiposMovimiento.activarHistorico,
    }

    await axios.post(`http://${serverAPI}:${puertoAPI}/api/historicos/activar`, {
      usuario,
      movimiento,
    })
    
    res.redirect(`/admin/historicos?part=${req.query.part}`)
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