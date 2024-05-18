import axios from 'axios'
import { serverAPI,puertoAPI } from '../../config/settings'
import { tiposMovimiento,arrTiposRol,arrTiposPerfil } from '../../public/js/enumeraciones'

// pages
export const mainPage = async (req, res) => {
  const user = req.user

  const dir = req.query.dir ? req.query.dir : 'next'
  const limit = req.query.limit ? req.query.limit : 10
  const part = req.query.part ? req.query.part.toUpperCase() : ''

  let cursor = req.query.cursor ? JSON.parse(req.query.cursor) : null
  let hasPrevs = cursor ? true:false
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
    await axios.post(`http://${serverAPI}:${puertoAPI}/api/historicos`, {
      context,
    }).then(result => {
      let historicos = result.data.data
      let hasNexts = historicos.length === limit +1
      let nextCursor = ''
      let prevCursor = ''
      
      if (hasNexts) {
        nextCursor = dir === 'next' ? historicos[limit - 1].NOMUSU : historicos[0].NOMUSU
        prevCursor = dir === 'next' ? historicos[0].NOMUSU : historicos[limit - 1].NOMUSU
  
        historicos.pop()
      } else {
        nextCursor = dir === 'next' ? '' : historicos[0]?.NOMUSU
        prevCursor = dir === 'next' ? historicos[0]?.NOMUSU : ''
        
        if (cursor) {
          hasNexts = nextCursor === '' ? false : true
          hasPrevs = prevCursor === '' ? false : true
        } else {
          hasNexts = false
          hasPrevs = false
        }
      }
  
      if (dir === 'prev') {
        historicos = historicos.sort((a,b) => a.NOMUSU > b.NOMUSU ? 1:-1)
      }
  
      cursor = {
        next: nextCursor,
        prev: prevCursor,
      }
      const datos = {
        historicos,
        hasNexts,
        hasPrevs,
        cursor: convertNodeToCursor(JSON.stringify(cursor)),
      }
  
      res.render('admin/historicos', { user, datos })
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
    await axios.post(`http://${serverAPI}:${puertoAPI}/api/historico`, {
      context: {
        IDUSUA: req.params.id,
      },
    }).then(async historico => {
      if (historico.data.stat) {
        await axios.post(`http://${serverAPI}:${puertoAPI}/api/oficina`, {
            context: {}
        }).then(oficinas => {
          if (oficinas.data.stat) {
            const datos = {
              historico: historico.data.data,
              oficinas: oficinas.data.data,
              filteredRol,
              arrTiposPerfil,
            }
          
            res.render('admin/historicos/edit', { user, datos })
          } else {
            res.render("admin/error400", {
              alerts: [{ msg: oficinas.data.data }],
            });
          }
        });
      } else {
        res.render("admin/error400", {
          alerts: [{ msg: historico.data.data }],
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
export const activar = async (req, res) => {
  const user = req.user
  const historico = {
    IDUSUA: req.body.idusua,
  }
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.activarHistorico,
  }
  
  try {
    await axios.post(`http://${serverAPI}:${puertoAPI}/api/historicos/activar`, {
      historico,
      movimiento,
    }).then(result => {
      if (result.data.stat) {
        res.redirect(`/admin/historicos?part=${req.query.part}`)
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
  const historico = {
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
      historico,
      movimiento,
    }).then(result => {
      if (result.data.stat) {
        res.redirect(`/admin/historicos?part=${req.query.part}`)
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
const convertNodeToCursor = (node) => {
  return new Buffer.from(node, 'binary').toString('base64')
}
const convertCursorToNode = (cursor) => {
  return new Buffer.from(cursor, 'base64').toString('binary')
}