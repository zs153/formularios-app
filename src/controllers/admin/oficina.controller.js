// imports
import axios from 'axios'
import { serverAPI,puertoAPI } from '../../config/settings'
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
    await axios.post(`http://${serverAPI}:${puertoAPI}/api/oficinas`, {
      context,
    }).then(result => {
      let oficinas = result.data.data
      let hasNexts = oficinas.length === limit +1
      let nextCursor = ''
      let prevCursor = ''
      
      if (hasNexts) {
        nextCursor= dir === 'next' ? oficinas[limit-1].DESOFI : oficinas[0].DESOFI
        prevCursor = dir === 'next' ? oficinas[0].DESOFI : oficinas[limit-1].DESOFI

        if (context.cursor.prev !== '' || context.cursor.next !== '') {
          hasPrevs = true
        }

        // borrar ultimo elemento
        oficinas.pop()
      } else {
        nextCursor = dir === 'next' ? '' : oficinas[0]?.DESOFI
        prevCursor = dir === 'next' ? oficinas[0]?.DESOFI : ''

        if (context.cursor.prev !== '') {
          hasNexts = nextCursor === '' ? false : true
          hasPrevs = prevCursor === '' ? false : true
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
        hasPrevs,
        hasNexts,
        cursor: objectToBase64(JSON.stringify(cursor)),
      }
    
      res.render('admin/oficinas', { user, datos })
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

  const datos = {
    filteredRol,
  }

  res.render('admin/oficinas/add', { user, datos })
}
export const editPage = async (req, res) => {
  const user = req.user
  const filteredRol = arrTiposRol.filter(itm => itm.id <= user.rol)

  try {
    await axios.post(`http://${serverAPI}:${puertoAPI}/api/oficina`, {
      context: {
        IDOFIC: req.params.id,
      },
    }).then(oficina => {
      if (oficina.data.stat) {
        const datos = {
          oficina: oficina.data.data,
          filteredRol,
        }
    
        res.render('admin/oficinas/edit', { user, datos })
      } else {
        res.render("admin/error400", {
          alerts: [{ msg: oficina.data.data }],
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
    }).then(result => {
      if (result.data.stat) {
        res.redirect(`/admin/oficinas?part=${req.query.part}`)
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
    }).then(result => {
      if (result.data.stat) {
        res.redirect(`/admin/oficinas?part=${req.query.part}`)
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
    }).then(result => {
      if (result.data.stat) {
        res.redirect(`/admin/oficinas?part=${req.query.part}`)
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
const objectToBase64 = (obj) => {
  return new Buffer.from(obj, 'binary').toString('base64')
}
const base64ToObject = (base64) => {
  return new Buffer.from(base64, 'base64').toString('binary')
}
