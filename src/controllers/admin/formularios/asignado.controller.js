import axios from "axios";
import { estadosDocumento, estadosSms, tiposMovimiento, tiposRol } from "../../../public/js/enumeraciones";
import { serverAPI,puertoAPI } from '../../../config/settings'

// pages formulario
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
    stafor: estadosDocumento.asignado,
    limit: limit +1,
    direction: dir,
    cursor: JSON.parse(base64ToObject(cursor)),
    part,
    rest,
  }
  try {
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/formularios`, {
      context,
    });

    let formularios = result.data.data
    let hasNexts = formularios.length === limit +1
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
        hasPrevs = prevCursor === 0 ? false : true
        hasNexts = nextCursor === 0 ? false : true
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
      estadosDocumento,
    };

    res.render("admin/formularios/asignados", { user, datos });
  } catch (error) {
    res.render("admin/error500", {
      alerts: [{ msg: error }],
    });
  }
};
export const editPage = async (req, res) => {
  const user = req.user;

  try {
    await axios.post(`http://${serverAPI}:${puertoAPI}/api/formulario`, {
      context: {
        IDFORM: req.params.id,
      },
    }).then(async formulario => {
      const tipos = await axios.post(`http://${serverAPI}:${puertoAPI}/api/tipo`, {
        context: {},
      })
      const oficinas = await axios.post(`http://${serverAPI}:${puertoAPI}/api/oficina`, {
        context: {},
      })

      formulario.data.data.FECFOR = formulario.data.data.FECFOR.slice(0,10)
      const datos = {
        formulario: formulario.data.data,
        tipos: tipos.data.data,
        oficinas: oficinas.data.data,
      };
  
      res.render("admin/formularios/asignados/edit", { user, datos });
    })

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
  
console.log(context);
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
          let hasNexts = referencias.length === limit +1
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
      
          res.render("admin/formularios/asignados/referencias", { user, datos });
        });
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
export const addReferenciaPage = async (req, res) => {
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
console.log(datos);
        res.render("admin/formularios/asignados/referencias/add", { user, datos });
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
export const editReferenciaPage = async (req, res) => {
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
        
            res.render("admin/formularios/asignados/referencias/edit", { user, datos });
          } else {
            res.render("admin/error400", {
              alerts: [{ msg: referencia.data.data }],
            });
          }
        });        
      } else {
        res.render("admin/error400", {
          alerts: [{ msg: tipos.data.data }],
        });
      }
    });
  } catch (error) {
    res.render("admin/error500", {
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

    res.redirect(`/admin/formularios/asignados?part=${req.query.part}`);
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

  try {
    await axios.post(`http://${serverAPI}:${puertoAPI}/api/formulario`, {
      context: {
        IDFORM: req.body.idform,
      }
    }).then(async result => {
      if (result.data.stat) {
        const formulario = {
          IDFORM: result.data.data.IDFORM,
        };
        const movimiento = {
          USUMOV: user.id,
          TIPMOV: tiposMovimiento.borrarFormulario,
        };

        await axios.post(`http://${serverAPI}:${puertoAPI}/api/formularios/delete`, {
          formulario,
          movimiento,
        }).then(result => {
          if (result.data.stat) {
            res.redirect(`/admin/formularios/asignados?part=${req.query.part}`);
          } else {
            res.render("admin/error400", {
              alerts: [{ msg: result.data.data }],
            });  
          }
        });
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
};
export const desasignar = async (req, res) => {
  const user = req.user;

  try {
    await axios.post(`http://${serverAPI}:${puertoAPI}/api/formulario`, {
      context : {
        IDFORM: req.body.idform,
      },
    }).then(async result => {
      if (result.data.stat) {
        const formulario = {
          IDFORM: result.data.data.IDFORM,
          LIQFOR: "PEND",
          STAFOR: estadosDocumento.pendiente,
        }
        const movimiento = {
          USUMOV: user.id,
          TIPMOV: tiposMovimiento.desasignarFormulario,
        };
        
        await axios.post(`http://${serverAPI}:${puertoAPI}/api/formularios/state`, {
          formulario,
          movimiento,
        }).then(result => {
          if (result.data.stat) {
            res.redirect(`/admin/formularios/asignados?part=${req.query.part}`);
          } else {
            res.render("admin/error400", {
              alerts: [{ msg: result.data.data }],
            });
          }
        })
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
};
export const resolver = async (req, res) => {
  const user = req.user;

  try {
    await axios.post(`http://${serverAPI}:${puertoAPI}/api/formulario`, {
      context: {
        IDFORM: req.body.idform,
      },
    }).then(async result => {
      if (result.data.stat) {
        if (result.data.data.STAFOR === estadosDocumento.asignado) {
          const formulario = {
            IDFORM: result.data.data.IDFORM,
            LIQFOR: user.userid,
            STAFOR: estadosDocumento.resuelto,
          }
          const movimiento = {
            USUMOV: user.id,
            TIPMOV: tiposMovimiento.resolverFormulario,
          };
    
          await axios.post(`http://${serverAPI}:${puertoAPI}/api/formularios/state`, {
            formulario,
            movimiento,
          }).then(result => {
            if (result.data.stat) {
              res.redirect(`/admin/formularios/asignados?part=${req.query.part}`);
            } else {
              res.render("admin/error400", {
                alerts: [{ msg: result.data.data }],
              });
            }
          });
        } else {
          res.render("admin/error400", {
            alerts: [{ msg: 'El documento no esta asignado al usuario' }],
          });
        }
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
};

// referencias
export const insertReferencia = async (req, res) => {
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
        res.redirect(`/admin/formularios/asignados/referencias/${formulario.IDFORM}?part=${req.query.part}`);
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
};
export const updateReferencia = async (req, res) => {
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
        res.redirect(`/admin/formularios/asignados/referencias/${formulario.IDFORM}?part=${req.query.part}`);
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
};
export const removeReferencia = async (req, res) => {
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
        res.redirect(`/admin/formularios/asignados/referencias/${formulario.IDFORM}?part=${req.query.part}`);
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
