import axios from "axios";
import { serverAPI,puertoAPI } from '../../../config/settings'
import { estadosDocumento, tiposMovimiento } from "../../../public/js/enumeraciones";

// pag
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
      stafor: estadosDocumento.pendiente,
      limit: limit + 1,
      direction: dir,
      cursor: JSON.parse(convertCursorToNode(JSON.stringify(cursor))),
      part,
      rest,
    }
  } else {
    context = {
      stafor: estadosDocumento.pendiente,
      limit: limit + 1,
      direction: dir,
      cursor: { next: 0, prev: 0 },
      part,
      rest,
    }
  }

  try {
    await axios.post(`http://${serverAPI}:${puertoAPI}/api/formularios`, {
      context,
    }).then(result => {
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
      };
  
      res.render("user/formularios/pendientes", { user, datos });
    });
  } catch (error) {
    res.render("user/error500", {
      alerts: [{ msg: error }],
    });
  }
};
export const editPage = async (req, res) => {
  const user = req.user;

  try {
    const formulario = await axios.post(`http://${serverAPI}:${puertoAPI}/api/formulario`, {
      context: {
        IDFORM: req.params.id,
      },
    });

    if (formulario.data.stat) {
      const tipos = await axios.post(`http://${serverAPI}:${puertoAPI}/api/tipo`, {
        context: {},
      })

      if (tipos.data.stat) {
        const oficinas = await axios.post(`http://${serverAPI}:${puertoAPI}/api/oficina`, {
          context: {},
        })
    
        if (oficinas.data.stat) {
          const datos = {
            formulario: formulario.data.data,
            tipos: tipos.data.data,
            oficinas: oficinas.data.data,
          };
      
          res.render("user/formularios/pendientes/edit", { user, datos });
        } else {
          res.render("user/error400", {
            alerts: [{ msg: oficinas.data.data }],
          });
        }
      } else {
        res.render("user/error400", {
          alerts: [{ msg: tipos.data.data }],
        });
      }
    } else {
      res.render("user/error400", {
        alerts: [{ msg: formulario.data.data }],
      });
    }
  } catch (error) {
    res.render("user/error500", {
      alerts: [{ msg: error }],
    });
  }
};

// procs formulario
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
export const asignar = async (req, res) => {
  const user = req.user;

  try {
    await axios.post(`http://${serverAPI}:${puertoAPI}/api/formulario`, {
      context: {
        IDFORM: req.body.idform,
      },
    }).then(async result => {
      if (result.data.stat) {
        if (result.data.data.STAFOR === estadosDocumento.pendiente) {
          const formulario = {
            IDFORM: result.data.data.IDFORM,
            LIQFOR: user.userid,
            STAFOR: estadosDocumento.asignado,
          }
          const movimiento = {
            USUMOV: user.id,
            TIPMOV: tiposMovimiento.asignarFormulario,
          };
  
          await axios.post(`http://${serverAPI}:${puertoAPI}/api/formularios/state`, {
            formulario,
            movimiento,
          }).then(result => {
            if (result.data.stat) {
              res.redirect(`/admin/formularios/pendientes?part=${req.query.part}`);
            } else {
              res.render("admin/error400", {
                alerts: [{ msg: result.data.data }],
              });
            }
          });
        } else {
          res.render("admin/error400", {
            alerts: [{ msg: 'El documento no esta pendiente de asignación' }],
          });
        }  
      } else {
        res.render("admin/error400", {
          alerts: [{ msg: formulario.data.data }],
        });
      }
    });
  } catch (error) {
    res.render("user/error500", {
      alerts: [{ msg: error }],
    });
  }
};

// helpers
const convertNodeToCursor = (node) => {
  return new Buffer.from(node, 'binary').toString('base64')
}
const convertCursorToNode = (cursor) => {
  return new Buffer.from(cursor, 'base64').toString('binary')
}
