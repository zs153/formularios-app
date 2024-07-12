// imports
import axios from 'axios'
import { serverAPI } from '../../config/settings'
import { estadosUsuario, arrEstadosUsuario, arrTiposPerfil, tiposRol, arrTiposRol,tiposMovimiento } from '../../public/js/enumeraciones'

// pages
export const mainPage = async (req, res) => {
  const user = req.user
  const dir = req.query.dir ? req.query.dir : 'next'
  const limit = req.query.limit ? req.query.limit : 10
  const part = req.query.part ? req.query.part.toUpperCase() : ''

  let cursor = req.query.cursor ? req.query.cursor : objectToBase64(JSON.stringify({next: '', prev: ''}))
  let hasPrevs = false

  const context = {
    oficina: user.rol === tiposRol.admin ? null : user.oficina,
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
    
      res.render('admin/usuarios', { user, datos })
    });
  } catch (error) {
    res.render("admin/error500", {
      alerts: [{ msg: error }],
    });
  }
}
export const addPage = async (req, res) => {
  const user = req.user
  const filteredRol = arrTiposRol.filter(itm => itm.id <= user.rol)

  try {
    await axios.post(`http://${serverAPI}/api/oficina`, {
      context: {},
    }).then(oficinas => {
      if (oficinas.data.stat) {
        const datos = {
          filteredRol,
          oficinas: oficinas.data.data,
          arrTiposPerfil,
          arrEstadosUsuario,
        }
      
        res.render('admin/usuarios/add', { user, datos })  
      } else {
        res.render("admin/error400", {
          alerts: [{ msg: oficinas.data.data }],
        });
      }
    });
  } catch (error) {
    res.render("admin/error500", {
      alerts: [{ msg: error }],
    });
  }
}
export const editPage = async (req, res) => {
  const user = req.user
  const filteredRol = arrTiposRol.filter(itm => itm.id <= user.rol)

  try {
    await axios.post(`http://${serverAPI}/api/usuario`, {
      context: {
        IDUSUA: req.params.id,
      },
    }).then(async usuario => {
      if (usuario.data.stat) {
        await axios.post(`http://${serverAPI}/api/oficina`, {
          context: {},
        }).then(oficinas => {
          const datos = {
            usuario: usuario.data.data,
            oficinas: oficinas.data.data,
            filteredRol,
            arrTiposPerfil,
            arrEstadosUsuario,
          }
      
          res.render('admin/usuarios/edit', { user, datos })
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
export const insert = async (req, res) => {
  const user = req.user
  const usuario = {
    NOMUSU: req.body.nomusu.toUpperCase(),
    OFIUSU: req.body.ofiusu,
    ROLUSU: req.body.rolusu,
    USERID: req.body.userid.toLowerCase(),
    EMAUSU: req.body.emausu,
    PERUSU: req.body.perusu,
    TELUSU: req.body.telusu,
    STAUSU: req.body.stausu,
  }
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.crearUsuario,
  }

  try {
    await axios.post(`http://${serverAPI}/api/usuarios/insert`, {
      usuario,
      movimiento,
    }).then(result => {
      if (result.data.stat) {
        res.redirect(`/admin/usuarios?part=${req.query.part}`)
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
  const usuario = {
    IDUSUA: req.body.idusua,
    NOMUSU: req.body.nomusu.toUpperCase(),
    OFIUSU: req.body.ofiusu,
    ROLUSU: req.body.rolusu,
    EMAUSU: req.body.emausu,
    PERUSU: req.body.perusu,
    TELUSU: req.body.telusu,
    STAUSU: req.body.stausu,
  }
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.modificarUsuario,
  }

  try {
    await axios.post(`http://${serverAPI}/api/usuarios/update`, {
      usuario,
      movimiento,
    }).then(result => {
      if (result.data.stat) {
        res.redirect(`/admin/usuarios?part=${req.query.part}`)
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
  const usuario = {
    IDUSUA: req.body.idusua,
  }
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.borrarUsuario,
  }

  try {
    await axios.post(`http://${serverAPI}/api/usuarios/delete`, {
      usuario,
      movimiento,
    }).then(result => {
      if (result.data.stat) {
        res.redirect(`/admin/usuarios?part=${req.query.part}`)
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