import axios from "axios";
import { estadosDocumento, estadosSms, tiposMovimiento, tiposRol, estadosUsuario } from "../../public/js/enumeraciones";
import { serverAPI,puertoAPI } from '../../config/settings'

// pages formulario
export const mainPage = async (req, res) => {
  const user = req.user

  const dir = req.query.dir ? req.query.dir : 'next'
  const limit = req.query.limit ? req.query.limit : 9

  let cursor = req.query.cursor ? JSON.parse(req.query.cursor) : null
  let hasPrevs = cursor ? true : false
  let part = ''
  let rest = ''

  if (req.query.part) {
    const partes = req.query.part.split(',')

    part = partes[0].toUpperCase()
    if (partes.length > 1) {
      rest = partes[1].toUpperCase()
    }
  }

  try {
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/formularios`, {
      context: {
        stafor: estadosDocumento.pendientesAsignados,
        limit: limit + 1,
        direction: dir,
        cursor: cursor ? JSON.parse(convertCursorToNode(JSON.stringify(cursor))) : {next: 0 , prev: 0},
        part,
        rest,        
      },
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
export const resolverPage = async (req, res) => {
  const user = req.user;

  try {
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/formulario`, {
      context: {
        IDFORM: req.params.id,
      },
    });
    const datos = {
      formulario: result.data.data[0],
    };

    res.render("admin/formularios/resolver", { user, datos });
  } catch (error) {
    if (error.response?.status === 400) {
      res.render("admin/error400", {
        alerts: [{ msg: error.response.data.msg }],
      });
    } else {
      res.render("admin/error500", {
        alerts: [{ msg: error }],
      });
    }
  }
};
export const resueltosPage = async (req, res) => {
  const user = req.user

  const dir = req.query.dir ? req.query.dir : 'next'
  const limit = req.query.limit ? req.query.limit : 9

  let cursor = req.query.cursor ? JSON.parse(req.query.cursor) : null
  let hasPrevs = cursor ? true : false
  let part = ''
  let rest = ''

  if (req.query.part) {
    const partes = req.query.part.split(',')

    part = partes[0].toUpperCase()
    if (partes.length > 1) {
      rest = partes[1].toUpperCase()
    }
  }

  try {
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/formularios`, {
      context: {
        stafor: estadosDocumento.resuelto,
        limit: limit + 1,
        direction: dir,
        cursor: cursor ? JSON.parse(convertCursorToNode(JSON.stringify(cursor))) : {next: 0 , prev: 0},
        part,
        rest,        
      },
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

    res.render("admin/formularios/resueltos", { user, datos });
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
export const readonlyPage = async (req, res) => {
  const user = req.user;

  try {
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/formulario`, {
      context: {
        IDFORM: req.params.id,
      },
    })

    let formulario = result.data.data[0]
    formulario.FECFOR = formulario.FECFOR.slice(0,10).split('-').reverse().join('/')
    const datos = {
      formulario,
    }

    res.render("admin/formularios/readonly", { user, datos });
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

// pages sms
export const smssPage = async (req, res) => {
  const user = req.user;

  const dir = req.query.dir ? req.query.dir : 'next'
  const limit = req.query.limit ? req.query.limit : 9
  const part = req.query.part ? req.query.part.toUpperCase() : ''

  let cursor = req.query.cursor ? JSON.parse(req.query.cursor) : null
  let hasPrevs = cursor ? true : false

  try {
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/formularios/smss`, {
      context: {
        formulario: req.params.id,        
        limit: limit + 1,
        direction: dir,
        cursor: cursor ? JSON.parse(convertCursorToNode(JSON.stringify(cursor))) : {next: 0 , prev: 0},
        part,
      },
    })

    let smss = result.data.data
    let hasNexts = smss.length === limit + 1
    let nextCursor = 0
    let prevCursor = 0

    if (hasNexts) {
      nextCursor = dir === 'next' ? smss[limit - 1].IDSMSS : smss[0].IDSMSS
      prevCursor = dir === 'next' ? smss[0].IDSMSS : smss[limit - 1].IDSMSS

      smss.pop()
    } else {
      nextCursor = dir === 'next' ? 0 : smss[0]?.IDSMSS
      prevCursor = dir === 'next' ? smss[0]?.IDSMSS : 0

      if (cursor) {
        hasNexts = nextCursor === 0 ? false : true
        hasPrevs = prevCursor === 0 ? false : true
      } else {
        hasNexts = false
        hasPrevs = false
      }
    }

    if (dir === 'prev') {
      smss = smss.reverse()
    }

    cursor = {
      next: nextCursor,
      prev: prevCursor,
    }

    const formulario = {
      IDFORM: req.params.id,
    };
    const datos = {
      formulario,
      smss,
      hasNexts,
      hasPrevs,
      cursor: convertNodeToCursor(JSON.stringify(cursor)),      
      estadosSms,
    }

    res.render("admin/formularios/smss", { user, datos });
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
export const smssReadonlyPage = async (req, res) => {
  const user = req.user;
  const formulario = {
    IDFORM: req.params.id,
  };

  try {
    const smss = await axios.post(`http://${serverAPI}:${puertoAPI}/api/formularios/sms`, {
      context: {
        IDFORM: req.params.id,
      },
    })

    const datos = {
      formulario,
      smss: smss.data.data,
      estadosSms,
    }

    res.render("admin/formularios/smss/readonly", { user, datos });
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

// pag referencias
export const referenciasPage = async (req, res) => {
  const user = req.user;

  const dir = req.query.dir ? req.query.dir : 'next'
  const limit = req.query.limit ? req.query.limit : 9
  const part = req.query.part ? req.query.part.toUpperCase() : ''

  let cursor = req.query.cursor ? JSON.parse(req.query.cursor) : null
  let hasPrevs = cursor ? true : false

  try {
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/formularios/referencias`, {
      context: {
        formulario: req.params.id,
        limit: limit + 1,
        direction: dir,
        cursor: cursor ? JSON.parse(convertCursorToNode(JSON.stringify(cursor))) : {next: 0 , prev: 0},
        part,
      },
    })

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

    const formulario = {
      IDFORM: req.params.id,
    };
    const datos = {
      formulario,
      referencias,
      hasNexts,
      hasPrevs,
      cursor: convertNodeToCursor(JSON.stringify(cursor)),
    }

    res.render("admin/formularios/referencias", { user, datos });
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
export const referenciasReadonlyPage = async (req, res) => {
  const user = req.user;
  const formulario = {
    IDFORM: req.params.id,
  };

  try {
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/formularios/referencia`, {
      context: {
        IDFORM: req.params.id,
      },
    })

    const datos = {
      formulario,
      referencias: result.data.data,
    }

    res.render("admin/formularios/referencias/readonly", { user, datos });
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

// ades
export const adesPage = async (req, res) => {
  const user = req.user

  const dir = req.query.dir ? req.query.dir : 'next'
  const limit = req.query.limit ? req.query.limit : 9
  const part = req.query.part ? req.query.part.toUpperCase() : ''

  let cursor = req.query.cursor ? JSON.parse(req.query.cursor) : null
  let hasPrevs = cursor ? true : false

  try {
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/usuarios`, {
      context: {
        oficina: user.rol === tiposRol.admin ? 0 : user.oficina,          
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
      nextCursor= dir === 'next' ? usuarios[limit - 1].NOMUSU : usuarios[0].NOMUSU
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
      hasPrevs,
      hasNexts,
      cursor: convertNodeToCursor(JSON.stringify(cursor)),
      estadosUsuario,
    }

    res.render('admin/formularios/ades', { user, datos })
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
export const adesAsignarPage = async (req, res) => {
  const user = req.user

  const dir = req.query.dir ? req.query.dir : 'next'
  const limit = req.query.limit ? req.query.limit : 100

  let cursor = req.query.cursor ? JSON.parse(req.query.cursor) : null
  let hasPrevs = cursor ? true : false
  let part = ''
  let rest = ''
  let alerts = undefined

  if (req.query.part) {
    const partes = req.query.part.split(',')

    part = partes[0].toUpperCase()
    if (partes.length > 1) {
      rest = partes[1].toUpperCase()
    }
  }
  
  try {
    const usuario = await axios.post(`http://${serverAPI}:${puertoAPI}/api/usuario`, {
      context: {
        IDUSUA: req.params.id,
      },
    });
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/formularios`, {
      context: {
        stafor: JSON.stringify(estadosDocumento.pendiente),
        limit: limit + 1,
        direction: dir,
        cursor: cursor ? JSON.parse(convertCursorToNode(JSON.stringify(cursor))) : {next: 0 , prev: 0},
        part,
        rest,
      },
    });

    let formularios = result.data.data
    let hasNexts = formularios.length === limit + 1
    let nextCursor = 0
    let prevCursor = 0

    if (hasNexts) {
      alerts = [{ msg: 'Se supera el límite de registros permitidos. Sólo se muestran los 100 primeros. Refine la consulta' }]      
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
      usuario: usuario.data.data[0],
      formularios,
      hasNexts,
      hasPrevs,
      cursor: convertNodeToCursor(JSON.stringify(cursor)),
    };

    res.render("admin/formularios/ades/asignar", { user, alerts, datos });
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
export const adesDesasignarPage = async (req, res) => {
  const user = req.user

  const dir = req.query.dir ? req.query.dir : 'next'
  const limit = req.query.limit ? req.query.limit : 99

  let cursor = req.query.cursor ? JSON.parse(req.query.cursor) : null
  let hasPrevs = cursor ? true : false
  let part = ''
  let rest = ''
  let alerts = undefined

  if (req.query.part) {
    const partes = req.query.part.split(',')

    part = partes[0].toUpperCase()
    if (partes.length > 1) {
      rest = partes[1].toUpperCase()
    }
  }
  
  try {
    const usuario = await axios.post(`http://${serverAPI}:${puertoAPI}/api/usuario`, {
      context: {
        IDUSUA: req.params.id,
      },
    });
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/formularios`, {
      context: {
        liqfor: usuario.data.data[0].USERID,
        stafor: estadosDocumento.asignado,
        limit: limit + 1,
        direction: dir,
        cursor: cursor ? JSON.parse(convertCursorToNode(JSON.stringify(cursor))) : {next: 0 , prev: 0},
        part,
        rest,        
      }
    });

    let formularios = result.data.data
    let hasNexts = formularios.length === limit + 1
    let nextCursor = 0
    let prevCursor = 0

    if (hasNexts) {
      alerts = [{ msg: 'Se supera el límite de registros permitidos. Sólo se muestran los 100 primeros. Refine la consulta' }]      
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
      usuario: usuario.data.data[0],
      formularios,
      hasNexts,
      hasPrevs,
      cursor: convertNodeToCursor(JSON.stringify(cursor)),
    };

    res.render("admin/formularios/ades/desasignar", { user, alerts, datos });
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

// ades
export const asignarFormularios = async (req, res) => {
  const user = req.user;

  try {
    if (req.body.arrfor === '') {
      throw "No se han seleccionado registros para procesar."
    }

    const formulario = {
      LIQFOR: req.body.userid,
      STAFOR: estadosDocumento.asignado,
    }
    const formularios = {
      ARRFOR: JSON.parse(req.body.arrfor)
    }
    const movimiento = {
      USUMOV: user.id,
      TIPMOV: tiposMovimiento.asignarFormulario,
    }
    await axios.post(`http://${serverAPI}:${puertoAPI}/api/formularios/ades/asignar`, {
      formulario,
      formularios,
      movimiento,
    });

    res.redirect(`/admin/formularios/ades?part=${req.query.part}`);
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
export const desAsignarFormularios = async (req, res) => {
  const user = req.user;
  
  try {
    if (req.body.arrfor === '') {
      throw "No se han seleccionado registros para procesar."
    }

    const formulario = {
      LIQFOR: 'PEND',
      STAFOR: estadosDocumento.pendiente,
    }
    const formularios = {
      ARRFOR: JSON.parse(req.body.arrfor)
    }
    const movimiento = {
      USUMOV: user.id,
      TIPMOV: tiposMovimiento.asignarFormulario,
    }

    await axios.post(`http://${serverAPI}:${puertoAPI}/api/formularios/ades/desasignar`, {
      formulario,
      formularios,
      movimiento,
    });
    
    res.redirect(`/admin/formularios/ades?part=${req.query.part}`);
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
