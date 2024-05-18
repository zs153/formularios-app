import axios from "axios";
import { estadosDocumento, estadosSms, tiposMovimiento, tiposRol } from "../../../public/js/enumeraciones";
import { serverAPI,puertoAPI } from '../../../config/settings'

// pages formulario
export const mainPage = async (req, res) => {
  const user = req.user
  const dir = req.query.dir ? req.query.dir : 'next'
  const limit = req.query.limit ? req.query.limit : 10
  
  let cursor = req.query.cursor ? JSON.parse(req.query.cursor) : null
  let hasPrevs = cursor ? true:false
  let context = {}
  let rest = ''
  let part = ''

  if (req.query.part) {
    const parts = req.query.part.split(',')

    part = parts[0].toUpperCase()
    if (parts.length > 1) {
      rest = parts[1].toUpperCase()
    }
  }

  if (cursor) {
    context = {
      stafor: estadosDocumento.asignado,
      limit: limit + 1,
      direction: dir,
      cursor: JSON.parse(convertCursorToNode(JSON.stringify(cursor))),
      part,
      rest,
    }
  } else {
    context = {
      stafor: estadosDocumento.asignado,
      limit: limit + 1,
      direction: dir,
      cursor: { next: 0, prev: 0 },
      part,
      rest,
    }
  }

  try {
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/formularios`, {
      context,
    });

    let formularios = result.data.data
    let hasNexts = formularios.length === limit + 1
    let nextCursor = 0
    let prevCursor = 0

    if (hasNexts) {
      nextCursor = dir === 'next' ? formularios[limit - 1].IDFORM : formularios[0].IDFORM
      prevCursor = dir === 'next' ? formularios[0].IDFORM : formularios[limit - 1].IDFORM
      
      formularios.pop()
    } else {
      nextCursor = dir === 'next' ? 0 : formularios[0]?.IDFORM
      prevCursor = dir === 'next' ? formularios[0]?.IDFORM : 0
      
      if (cursor) {
        hasNexts = nextCursor === 0 ? false : true
        hasPrevs = prevCursor === 0 ? false : true
      } else {
        hasNexts = false
        hasPrevs = false
      }
    }

    if (dir === 'prev') {
      formularios = formularios.reverse()
    }

    cursor = {
      next: nextCursor,
      prev: prevCursor,
    }

    const datos = {
      formularios,
      hasNexts,
      hasPrevs,
      cursor: convertNodeToCursor(JSON.stringify(cursor)),
      estadosDocumento,
    };

    res.render("admin/formularios", { user, datos });
  } catch (error) {
    res.render("user/error500", {
      alerts: [{ msg: error }],
    });
  }
};
export const editPage = async (req, res) => {
  const user = req.user;

  try {
    const cargas = await axios.post(`http://${serverAPI}:${puertoAPI}/api/carga`, {
      context: {},
    })
    const tipos = await axios.post(`http://${serverAPI}:${puertoAPI}/api/tipo`, {
      context: {},
    })
    const oficinas = await axios.post(`http://${serverAPI}:${puertoAPI}/api/oficina`, {
      context: {},
    })
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/formulario`, {
      context: {
        IDFORM: req.params.id,
      },
    });

    let formulario = result.data.data[0]
    formulario.FECFOR = formulario.FECFOR.slice(0, 10)
    const datos = {
      formulario,
      cargas: cargas.data.data,
      tipos: tipos.data.data,
      oficinas: oficinas.data.data,
      tiposRol,
    };

    res.render("admin/formularios/edit", { user, datos });
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
};
export const referenciasPage = async (req, res) => {
  const user = req.user;

  const dir = req.query.dir ? req.query.dir : 'next'
  const limit = req.query.limit ? req.query.limit : 10
  const part = req.query.part ? req.query.part.toUpperCase() : ''

  let cursor = req.query.cursor ? JSON.parse(req.query.cursor) : null
  let hasPrevs = cursor ? true : false
  let context = {}
  
  if (cursor) {
    context = {
      idform: req.params.id,
      limit: limit + 1,
      direction: dir,
      cursor: JSON.parse(convertCursorToNode(JSON.stringify(cursor))),
      part,
    }
  } else {
    context = {
      idform: req.params.id,
      limit: limit + 1,
      direction: dir,
      cursor: { next: 0, prev: 0 },
      part,
    }
  }
  
  try {
    await axios.post(`http://${serverAPI}:${puertoAPI}/api/formulario`, {
      context: {IDFORM: req.params.id},
    }).then(async result => {
      if (result.data.stat) {
        const formulario = result.data.data

        await axios.post(`http://${serverAPI}:${puertoAPI}/api/formularios/referencias`, {
          context,
        }).then(result => {
          let referencias = result.data.data
          let hasNexts = referencias.length === limit + 1
          let nextCursor = 0
          let prevCursor = 0
      
          if (hasNexts) {
            nextCursor = dir === 'next' ? referencias[limit - 1].IDREFE : referencias[0].IDREFE
            prevCursor = dir === 'next' ? referencias[0].IDREFE : referencias[limit - 1].IDREFE
      
            referencias.pop()
          } else {
            nextCursor = dir === 'next' ? 0 : referencias[0]?.IDREFE
            prevCursor = dir === 'next' ? referencias[0]?.IDREFE : 0
      
            if (cursor) {
              hasNexts = nextCursor === 0 ? false : true
              hasPrevs = prevCursor === 0 ? false : true
            } else {
              hasNexts = false
              hasPrevs = false
            }
          }
      
          if (dir === 'prev') {
            referencias = referencias.reverse()
          }
      
          cursor = {
            next: nextCursor,
            prev: prevCursor,
          }
      
          const datos = {
            formulario,
            referencias,
            hasNexts,
            hasPrevs,
            cursor: convertNodeToCursor(JSON.stringify(cursor)),
          }
      
          res.render("user/formularios/asignados/referencias", { user, datos });
        });
      } else {
        res.render("user/error400", {
          alerts: [{ msg: result.data.data }],
        });
      }
    });
  } catch (error) {
    res.render("user/error500", {
      alerts: [{ msg: error }],
    });
  }
}

// procs
export const update = async (req, res) => {
  const user = req.user;
  const formulario = {
    IDFORM: req.body.idform,
    FECFOR: req.body.fecfor,
    NIFCON: req.body.nifcon.toUpperCase(),
    NOMCON: req.body.nomcon.toUpperCase(),
    EMACON: req.body.emacon,
    TELCON: req.body.telcon,
    MOVCON: req.body.movcon,
    REFFOR: req.body.reffor,
    TIPFOR: req.body.tipfor,
    EJEFOR: req.body.ejefor,
    OFIFOR: req.body.ofifor,
    OBSFOR: req.body.obsfor,
  };
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.modificarFormulario,
  };

  try {
    await axios.post(`http://${serverAPI}:${puertoAPI}/api/formularios/update`, {
      formulario,
      movimiento,
    });

    res.redirect(`/admin/formularios?part=${req.query.part}`);
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
};
export const remove = async (req, res) => { 
  const user = req.user;
  const formulario = {
    IDFORM: req.body.idform,
  };
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.borrarFormulario,
  };

  try {
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/formulario`, {
      context: {
        IDFORM: req.body.idform,
      }
    });

    if (result.data.stat) {
      if (result.data.data[0].FUNFOR === user.userid) {
        await axios.post(`http://${serverAPI}:${puertoAPI}/api/formularios/delete`, {
          formulario,
          movimiento,
        });
    
        res.redirect(`/admin/formularios?part=${req.query.part}`);
      } else {
        throw "El documento no puede ser borrado."
      }
    } else {
      throw "El documento no existe."
    }
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
};
export const desasignar = async (req, res) => {
  const user = req.user;

  try {
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/formulario`, {
      context : {
        IDFORM: req.body.idform,
      },
    });
    
    let formulario = result.data.data[0]
    if (formulario.STAFOR === estadosDocumento.asignado) {
      formulario.LIQFOR = "PEND"
      formulario.STAFOR = estadosDocumento.pendiente
      
      const movimiento = {
        USUMOV: user.id,
        TIPMOV: tiposMovimiento.desasignarFormulario,
      };
      
      await axios.post(`http://${serverAPI}:${puertoAPI}/api/formularios/unasign`, {
        formulario,
        movimiento,
      });
    }

    res.redirect(`/admin/formularios?part=${req.query.part}`);
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
};
export const resolver = async (req, res) => {
  const user = req.user;

  try {
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/formulario`, {
      context: {
        IDFORM: req.body.idform,
      },
    });

    let formulario = result.data.data[0]
    if (formulario.STAFOR === estadosDocumento.asignado) {
      formulario.LIQFOR = user.userid
      formulario.STAFOR = estadosDocumento.resuelto      
      const movimiento = {
        USUMOV: user.id,
        TIPMOV: tiposMovimiento.resolverFormulario,
      };
      let sms = { 
        TEXSMS: null,
        MOVSMS: null,
        STASMS: null,
        TIPSMS: 0,
      }

      if (req.body.chkenv === 'true') {
        sms.TEXSMS = req.body.texsms
        sms.MOVSMS = req.body.movsms
        sms.STASMS = estadosSms.pendiente
        sms.TIPSMS = tiposMovimiento.envioSmsDesdeCierre
      }

      await axios.post(`http://${serverAPI}:${puertoAPI}/api/formularios/cierre`, {
        formulario,
        sms,
        movimiento,
      });
    }

    res.redirect(`/admin/formularios?part=${req.query.part}`);
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
};

// helpers
const convertNodeToCursor = (node) => {
  return new Buffer.from(node, 'binary').toString('base64')
}
const convertCursorToNode = (cursor) => {
  return new Buffer.from(cursor, 'base64').toString('binary')
}
