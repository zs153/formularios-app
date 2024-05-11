// imports
import axios from 'axios'
import { serverAPI,puertoAPI,serverWEB,puertoWEB,serverAUTH,puertoAUTH } from '../../config/settings'
import { tiposMovimiento } from '../../public/js/enumeraciones';

// pages
export const mainPage = async (req, res) => {
  const user = req.user

  try {
    const usuario = await axios.post(`http://${serverAPI}:${puertoAPI}/api/usuario`, {
      context: {
        IDUSUA: user.id,
      }
    })

    if (usuario.data.stat) {
      const datos = {
        usuario: usuario.data.data,
      }
      
      res.render('user/index', { user, datos })
    } else {
      res.render("user/error400", {
        alerts: [{ msg: usuario.data.data }],
      });
    }
  } catch (error) {
    res.render('user/error500', {
      alerts: [{ msg: error }],
    })
  }
}
export const perfilPage = async (req, res) => {
  const user = req.user

  try {
    const usuario = await axios.post(`http://${serverAPI}:${puertoAPI}/api/usuario`, {
      context: {
        USERID: user.userid,
      },
    })
  
    if (usuario.data.stat) {
      const datos = {
        usuario: usuario.data.data,
      }
  
      res.render('user/perfil', { user, datos })
    } else {
      res.render('user/error400', {
        alerts: [{ msg: usuario.data.data }],
      })
    }    
  } catch (error) {
    res.render('user/error500', {
      alerts: [{ msg: error }],
    })
  }
}
export const logoutPage = async (req, res) => {
  const options = {
    path: "/",
    sameSite: true,
    maxAge: 1,
    httpOnly: true,
  };

  res.clearCookie("x-access_token");
  res.cookie("auth", undefined, options);
  res.cookie("verPan", undefined, options);
  res.cookie("filtro", undefined, options);

  res.render('user/logout')
}

// proc
export const updatePerfil = async (req, res) => {
  const user = req.user
  const usuario = {
    IDUSUA: user.id,
    NOMUSU: req.body.nomusu.toUpperCase(),
    OFIUSU: user.oficina,
    ROLUSU: user.rol,
    EMAUSU: req.body.emausu,
    PERUSU: req.body.perusu,
    TELUSU: req.body.telusu,
    STAUSU: req.body.stausu,
  }
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.modificarPerfil,
  }

  try {
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/usuarios/update`, {
      usuario,
      movimiento,
    })

    if (result.data.stat) {
      res.redirect('/user')
    } else {
      res.render("user/error400", {
        alerts: [{ msg: result.data.data }],
      });
    }
  } catch (error) {
    res.render("admin/error500", {
      alerts: [{ msg: error }],
    });
  }

}
export const changePassword = async (req, res) => {
  const user = req.user
  const strUrl = encodeURIComponent(`${serverWEB}:${puertoWEB}`);
  const options = {
    path: "/",
    sameSite: true,
    maxAge: 1,
    httpOnly: true,
  };

  res.clearCookie("x-access_token");
  res.cookie("auth", undefined, options);

  res.redirect(`http://${serverAUTH}:${puertoAUTH}/change/?user=${user.userid}&valid=${strUrl}`)
}

// helpers
