import axios from 'axios'
import { puertoAPI, serverAPI, serverWEB, puertoWEB, serverAUTH, puertoAUTH } from '../../config/settings'
import { tiposMovimiento } from '../../public/js/enumeraciones';

// page
export const mainPage = async (req, res) => {
  const user = req.user

  res.render('user', { user })
}
export const perfilPage = async (req, res) => {
  const user = req.user

  try {
    const usuario = await axios.post(`http://${serverAPI}:${puertoAPI}/api/usuario`, {
      context: {
        USERID: user.userid,
      },
    })
    const datos = {
      usuario: usuario.data.data[0],
    }

    res.render('user/perfil', { user, datos })
  } catch (error) {
    if (error.response?.status === 400) {
      res.render("user/error400", {
        alerts: [{ msg: error.response.data.data }],
      });
    } else {
      res.render("user/error500", {
        alerts: [{ msg: error }],
      });
    }
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
  res.cookie("filtro", undefined, options);
  res.cookie("filtra", undefined, options);
  res.cookie("filtrb", undefined, options);

  res.redirect('/')
}

// proc
export const updatePerfil = async (req, res) => {
  const user = req.user
  const usuario = {
    IDUSUA: user.id,
    USERID: user.userid,
    NOMUSU: req.body.nomusu.toUpperCase(),
    EMAUSU: req.body.emausu,
    TELUSU: req.body.telusu,
  }
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.modificarPerfil,
  }

  try {
    await axios.post(`http://${serverAPI}:${puertoAPI}/api/usuarios/perfil`, {
      usuario,
      movimiento,
    })

    res.redirect('/user')
  } catch (error) {
    res.redirect('/')
  }
}
export const changePassword = async (req, res) => {
  const strUrl = encodeURIComponent(`${serverWEB}:${puertoWEB}`);
  const options = {
    path: "/",
    sameSite: true,
    maxAge: 1,
    httpOnly: true,
  };

  res.clearCookie("x-access_token");
  res.cookie("auth", undefined, options);

  res.redirect(`http://${serverAUTH}:${puertoAUTH}/log/change/?valid=${strUrl}`)
}
export const updateRecurso = async (req, res) => {
  const strUrl = encodeURIComponent(`${serverWEB}:${puertoWEB}`);
  const options = {
    path: "/",
    sameSite: true,
    maxAge: 1,
    httpOnly: true,
  };

  res.clearCookie("x-access_token");
  res.cookie("auth", undefined, options);

  res.redirect(`http://${serverAUTH}:${puertoAUTH}/log/update?valid=${strUrl}`)
}