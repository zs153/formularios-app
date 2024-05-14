import axios from "axios";
import { serverAPI,puertoAPI } from '../../../../config/settings'
import { tiposMovimiento } from "../../../../public/js/enumeraciones";

// pag referencias
export const mainPage = async (req, res) => {
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
      
          res.render("user/formularios/referencias", { user, datos });
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
export const addPage = async (req, res) => {
  const user = req.user;

  try {
    await axios.post(`http://${serverAPI}:${puertoAPI}/api/tipo`, {
      context: {},
    }).then(result => {
      if (result.data.stat) {
        const datos = {
          tipos: result.data.data,
          formulario: { IDFORM: req.params.id },
        };
    
        res.render("user/formularios/referencias/add", { user, datos });
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
export const editPage = async (req, res) => {
  const user = req.user;
  const formulario = {
    IDFORM: req.params.idfor,
  }

  try {
    await axios.post(`http://${serverAPI}:${puertoAPI}/api/tipo`, {
      context: {},
    }).then(async tipos => {
      if (tipos.data.stat) {
        await axios.post(`http://${serverAPI}:${puertoAPI}/api/formularios/referencia`, {
          context: {
            IDREFE: req.params.idref,
          },
        }).then(referencia => {
          if (referencia.data.stat) {
            const datos = {
              formulario,
              tipos: tipos.data.data,
              referencia: referencia.data.data,
            };
        
            res.render("user/formularios/referencias/edit", { user, datos });
          } else {
            res.render("user/error400", {
              alerts: [{ msg: referencia.data.data }],
            });
          }
        });        
      } else {
        res.render("user/error400", {
          alerts: [{ msg: tipos.data.data }],
        });
      }
    });
  } catch (error) {
    res.render("user/error500", {
      alerts: [{ msg: error }],
    });
  }
}
export const readonlyPage = async (req, res) => {
  const user = req.user;
  const formulario = {
    IDFORM: req.params.id,
  };

  try {
    await axios.post(`http://${serverAPI}:${puertoAPI}/api/formularios/referencia`, {
      context: {
        IDFORM: req.params.id,
      },
    }).then(referencias => {
      console.log(referencias.data);
      if (referencias.data.stat) {
        const datos = {
          formulario,
          referencias: referencias.data.data,
        }
    
        console.log(datos);
        res.render("user/formularios/referencias/readonly", { user, datos });
      } else {
        res.render("user/error400", {
          alerts: [{ msg: referencias.data.data }],
        });
      }
    });
  } catch (error) {
    res.render("user/error500", {
      alerts: [{ msg: error }],
    });
  }
}

// proc 
export const insert = async (req, res) => {
  const user = req.user;
  const formulario = {
    IDFORM: req.body.idform,
  }
  const referencia = {
    NIFREF: req.body.nifref.toUpperCase(),
    DESREF: req.body.desref,
    TIPREF: req.body.tipref,
  };
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.crearReferencia,
  };

  try {
    axios.post(`http://${serverAPI}:${puertoAPI}/api/formularios/referencias/insert`, {
      formulario,
      referencia,
      movimiento,
    }).then(result => {
      if (result.data.stat) {
        res.redirect(`/user/formularios/referencias/${formulario.IDFORM}`);
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
};
export const update = async (req, res) => {
  const user = req.user;
  const formulario = {
    IDFORM: req.body.idform,
  };
  const referencia = {
    IDREFE: req.body.idrefe,
    NIFREF: req.body.nifref.toUpperCase(),
    DESREF: req.body.desref,
    TIPREF: req.body.tipref,
  };
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.modificarReferencia,
  };

  try {
    await axios.post(`http://${serverAPI}:${puertoAPI}/api/formularios/referencias/update`, {
      referencia,
      movimiento,
    }).then(result => {
      if (result.data.stat) {
        res.redirect(`/user/formularios/referencias/${formulario.IDFORM}`);
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
};
export const remove = async (req, res) => {
  const user = req.user;
  const formulario = {
    IDFORM: req.body.idform,
  }
  const referencia = {
    IDREFE: req.body.idrefe,
  };
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.borrarReferencia,
  };

  try {
    await axios.post(`http://${serverAPI}:${puertoAPI}/api/formularios/referencias/delete`, {
      formulario,
      referencia,
      movimiento,
    }).then(result => {
      if (result) {
        res.redirect(`/user/formularios/referencias/${formulario.IDFORM}`);
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

// helpers
const convertNodeToCursor = (node) => {
  return new Buffer.from(node, 'binary').toString('base64')
}
const convertCursorToNode = (cursor) => {
  return new Buffer.from(cursor, 'base64').toString('binary')
}
