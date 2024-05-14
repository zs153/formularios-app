import axios from "axios";
import { serverAPI,puertoAPI } from '../../../config/settings'
import { estadosDocumento, estadosSms, tiposMovimiento } from "../../../public/js/enumeraciones";

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
      liqfor: user.userid,
      stafor: estadosDocumento.asignado,
      limit: limit + 1,
      direction: dir,
      cursor: JSON.parse(convertCursorToNode(JSON.stringify(cursor))),
      part,
      rest,
    }
  } else {
    context = {
      liqfor: user.userid,
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

    res.render("user/formularios", { user, datos });
  } catch (error) {
    res.render("user/error500", {
      alerts: [{ msg: error }],
    });
  }
};
export const addPage = async (req, res) => {
  const user = req.user;
  const formulario = {
    EJEFOR: new Date().getFullYear() - 1,
    OFIFOR: user.oficina,
    FUNFOR: user.userid,
  };

  try {
    const tipos = await axios.post(`http://${serverAPI}:${puertoAPI}/api/tipo`, {
      context: {},
    })
    if (tipos.data.stat) {
      const oficinas = await axios.post(`http://${serverAPI}:${puertoAPI}/api/oficina`, {
        context: {},
      })
  
      if (oficinas.data.stat) {
        const datos = {
          formulario,
          tipos: tipos.data.data,
          oficinas: oficinas.data.data,
        };
    
        res.render("user/formularios/add", { user, datos });
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
      
          res.render("user/formularios/edit", { user, datos });
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
export const resolverPage = async (req, res) => {
  const user = req.user;

  try {
    const formulario = await axios.post(`http://${serverAPI}:${puertoAPI}/api/formulario`, {
      context: {
        IDFORM: req.params.id,
      },
    });

    if (formulario.data.stat) {
      const datos = {
        formulario: formulario.data.data,
      };
  
      res.render("user/formularios/resolver", { user, datos });
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
export const pendientesPage = async (req, res) => {
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
export const resueltosPage = async (req, res) => {
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
      liqfor: user.userid,
      stafor: estadosDocumento.resuelto,
      limit: limit + 1,
      direction: dir,
      cursor: JSON.parse(convertCursorToNode(JSON.stringify(cursor))),
      part,
      rest,
    }
  } else {
    context = {
      liqfor: user.userid,
      stafor: estadosDocumento.resuelto,
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
        estadosDocumento,
      };
  
      res.render("user/formularios/resueltos", { user, datos });
    });
  } catch (error) {
    res.render("user/error500", {
      alerts: [{ msg: error }],
    });
  }
};
export const readonlyPage = async (req, res) => {
  const user = req.user;

  try {
    await axios.post(`http://${serverAPI}:${puertoAPI}/api/formulario`, {
      context: {
        IDFORM: req.params.id,
      },
    }).then(formulario => {
      if (formulario.data.stat) {
        formulario.data.data.FECFOR = formulario.data.data.FECFOR.slice(0,10).split('-').reverse().join('/')
        const datos = {
          formulario: formulario.data.data,
        }
    
        res.render("user/formularios/resueltos/readonly", { user, datos });
      } else {
        res.render("user/error400", {
          alerts: [{ msg: formulario.data.data }],
        });
      }

    });

  } catch (error) {
    res.render("user/error500", {
      alerts: [{ msg: error }],
    });
  }
}

// procs formulario
export const insert = async (req, res) => {
  const user = req.user;
  const formulario = {
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
    FUNFOR: req.body.funfor,
    LIQFOR: user.userid,
    STAFOR: estadosDocumento.asignado,
  };
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.crearFormulario,
  };

  try {
    await axios.post(`http://${serverAPI}:${puertoAPI}/api/formularios/insert`, {
      formulario,
      movimiento,
    }).then(result => {
      if (result.data.stat) {
        res.redirect(`/user/formularios?part=${req.query.part}`);
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

  console.log(formulario);
  try {
    await axios.post(`http://${serverAPI}:${puertoAPI}/api/formularios/update`, {
      formulario,
      movimiento,
    }).then(result => {
      if (result.data.stat) {
        res.redirect(`/user/formularios?part=${req.query.part}`);
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

  try {
    const formulario = await axios.post(`http://${serverAPI}:${puertoAPI}/api/formulario`, {
      context: {
        IDFORM: req.body.idform,
      }
    }).then(async result => {
      if (result.data.stat) {
        if (result.data.data.FUNFOR === user.userid) {
          const formulario = {
            IDFORM: formulario.data.data.IDFORM,
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
              res.redirect(`/user/formularios?part=${req.query.part}`);
            } else {
              res.render("user/error400", {
                alerts: [{ msg: result.data.data }],
              });  
            }
          });
        } else {
          res.render("user/error400", {
            alerts: [{ msg: 'El documento no esta asignado al usuario' }],
          });
        }
      } else {
        res.render("user/error400", {
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
              res.redirect(`/user/formularios?part=${req.query.part}`);
            } else {
              res.render("user/error400", {
                alerts: [{ msg: result.data.data }],
              });
            }
          });
        } else {
          res.render("user/error400", {
            alerts: [{ msg: 'El documento no esta pendiente de asignación' }],
          });
        }  
      } else {
        res.render("user/error400", {
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
export const desasignar = async (req, res) => {
  const user = req.user;

  try {
    await axios.post(`http://${serverAPI}:${puertoAPI}/api/formulario`, {
      context : {
        IDFORM: req.body.idform,
      },
    }).then(async result => {
      if (result.data.stat) {
        if (result.data.data.STAFOR === estadosDocumento.asignado && result.data.data.LIQFOR === user.userid) {
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
              res.redirect(`/user/formularios?part=${req.query.part}`);
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
              res.redirect(`/user/formularios?part=${req.query.part}`);
            } else {
              res.render("user/error400", {
                alerts: [{ msg: result.data.data }],
              });
            }
          });
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
const convertNodeToCursor = (node) => {
  return new Buffer.from(node, 'binary').toString('base64')
}
const convertCursorToNode = (cursor) => {
  return new Buffer.from(cursor, 'base64').toString('binary')
}
