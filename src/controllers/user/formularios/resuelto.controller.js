import axios from "axios";
import { serverAPI,puertoAPI } from '../../../config/settings'
import { estadosDocumento, tiposMovimiento } from "../../../public/js/enumeraciones";

// formulario
export const mainPage = async (req, res) => {
  const user = req.user
  const dir = req.query.dir ? req.query.dir : 'next'
  const limit = req.query.limit ? req.query.limit : 10
  
  let rest = ''
  let part = ''

  if (req.query.part) {
    const parts = req.query.part.split(',')

    part = parts[0].toUpperCase()
    if (parts.length > 1) {
      rest = parts[1].toUpperCase()
    }
  }

  let cursor = req.query.cursor ? req.query.cursor : objectToBase64(JSON.stringify({next: 0, prev: 0}))
  let hasPrevs = false

  const context = {
    liqfor: user.userid,
    stafor: estadosDocumento.resuelto,
    limit: limit +1,
    direction: dir,
    cursor: JSON.parse(base64ToObject(cursor)),
    part,
    rest,
  }

  try {
    await axios.post(`http://${serverAPI}/api/formularios`, {
      context,
    }).then(result => {
      let formularios = result.data.data
      let hasNexts = formularios.length === limit + 1
      let nextCursor = 0
      let prevCursor = 0
  
      if (hasNexts) {
        nextCursor = dir === 'next' ? formularios[limit - 1].IDFORM : formularios[0].IDFORM
        prevCursor = dir === 'next' ? formularios[0].IDFORM : formularios[limit - 1].IDFORM

        if (context.cursor.prev !== 0 || context.cursor.next !== 0) {
          hasPrevs = true
        }

        // borrar ultimo elemento
        formularios.pop()
      } else {
        nextCursor = dir === 'next' ? 0 : formularios[0]?.IDFORM
        prevCursor = dir === 'next' ? formularios[0]?.IDFORM : 0
        
        if (context.cursor.prev !== 0) {
          hasNexts = nextCursor === 0 ? false : true
          hasPrevs = prevCursor === 0 ? false : true
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
        cursor: objectToBase64(JSON.stringify(cursor)),
      };
  
      res.render("user/formularios/resueltos", { user, datos });
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
    const formulario = await axios.post(`http://${serverAPI}/api/formulario`, {
      context: {
        IDFORM: req.params.id,
      },
    });

    if (formulario.data.stat) {
      const tipos = await axios.post(`http://${serverAPI}/api/tipo`, {
        context: {},
      })

      if (tipos.data.stat) {
        const oficinas = await axios.post(`http://${serverAPI}/api/oficina`, {
          context: {},
        })
    
        if (oficinas.data.stat) {
          const datos = {
            formulario: formulario.data.data,
            tipos: tipos.data.data,
            oficinas: oficinas.data.data,
          };
      
          res.render("user/formularios/resueltos/edit", { user, datos });
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

// referencias
export const referenciasPage = async (req, res) => {
  const user = req.user;
  const dir = req.query.dir ? req.query.dir : 'next'
  const limit = req.query.limit ? req.query.limit : 10
  const part = req.query.part ? req.query.part.toUpperCase() : ''

  let cursor = req.query.cursor ? req.query.cursor : objectToBase64(JSON.stringify({next: 0, prev: 0}))
  let hasPrevs = false

  const context = {
    idform: req.params.id,
    limit: limit +1,
    direction: dir,
    cursor: JSON.parse(base64ToObject(cursor)),
    part,
  }
  
  try {
    await axios.post(`http://${serverAPI}/api/formulario`, {
      context: {IDFORM: req.params.id},
    }).then(async result => {
      if (result.data.stat) {
        const formulario = result.data.data

        await axios.post(`http://${serverAPI}/api/formularios/referencias`, {
          context,
        }).then(result => {
          let referencias = result.data.data
          let hasNexts = referencias.length === limit + 1
          let nextCursor = 0
          let prevCursor = 0
      
          if (hasNexts) {
            nextCursor = dir === 'next' ? referencias[limit - 1].IDREFE : referencias[0].IDREFE
            prevCursor = dir === 'next' ? referencias[0].IDREFE : referencias[limit - 1].IDREFE

            if (context.cursor.prev !== 0 || context.cursor.next !== 0) {
              hasPrevs = true
            }
    
            // borrar ultimo elemento
            referencias.pop()
          } else {
            nextCursor = dir === 'next' ? 0 : referencias[0]?.IDREFE
            prevCursor = dir === 'next' ? referencias[0]?.IDREFE : 0
      
            if (context.cursor.prev !== 0) {
              hasPrevs = prevCursor === 0 ? false : true
              hasNexts = nextCursor === 0 ? false : true  
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
            cursor: objectToBase64(JSON.stringify(cursor)),
          }
      
          res.render("user/formularios/resueltos/referencias", { user, datos });
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
export const editReferenciaPage = async (req, res) => {
  const user = req.user;
  const formulario = {
    IDFORM: req.params.idfor,
  }

  try {
    await axios.post(`http://${serverAPI}/api/tipo`, {
      context: {},
    }).then(async tipos => {
      if (tipos.data.stat) {
        await axios.post(`http://${serverAPI}/api/formularios/referencia`, {
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
        
            res.render("user/formularios/resueltos/referencias/edit", { user, datos });
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

// proc 
export const desresolver = async (req, res) => {
  const user = req.user;

  try {
    await axios.post(`http://${serverAPI}/api/formulario`, {
      context : {
        IDFORM: req.body.idform,
      },
    }).then(async result => {
      if (result.data.stat) {
        if (result.data.data.LIQFOR === user.userid) {
          const formulario = {
            IDFORM: result.data.data.IDFORM,
            LIQFOR: result.data.data.LIQFOR,
            STAFOR: estadosDocumento.asignado,
          }
          const movimiento = {
            USUMOV: user.id,
            TIPMOV: tiposMovimiento.desasignarFormulario,
          };
          
          await axios.post(`http://${serverAPI}/api/formularios/state`, {
            formulario,
            movimiento,
          }).then(result => {
            if (result.data.stat) {
              res.redirect(`/user/formularios/resueltos?part=${req.query.part}`);
            } else {
              res.render("user/error400", {
                alerts: [{ msg: result.data.data }],
              });
            }
          })
        } else {
          res.render("user/error400", {
            alerts: [{ msg: 'El documento no esta asignado al usuario' }],
          });
        }
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

// helpers
const objectToBase64 = (node) => {
  return new Buffer.from(node, 'binary').toString('base64')
}
const base64ToObject = (cursor) => {
  return new Buffer.from(cursor, 'base64').toString('binary')
}
