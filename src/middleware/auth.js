// imports
import { createSecretKey } from 'crypto'
import { V3 } from 'paseto'
import { tiposRol } from '../public/js/enumeraciones'
import { secreto } from '../config/settings'

// proc
const authRoutes = async (req, res, next) => {
  const tokenHeader = req.cookies.auth
  const localKey = createSecretKey(new Buffer.from(secreto, 'hex'));

  try {    
    await V3.decrypt(tokenHeader, localKey, {
      clockTolerance: '1 min',
    }).then(ret => {
      req.user = {
        id: ret.id,
        userid: ret.userid,
        oficina: ret.oficina,
        rol: ret.rol,
      }

      next()
    }).catch(err => {
      throw new Error(err)
    })
  } catch (err) {
    const options = {
      path: "/",
      sameSite: true,
      maxAge: 1,
      httpOnly: true,
    };
  
    res.clearCookie("x-access_token");
    res.cookie("auth", undefined, options);
    res.render('user/forbidden')
  }
}
export const verifyTokenAndAdmin = (req, res, next) => {
  authRoutes(req, res, () => {
    if (req.user.rol === tiposRol.admin) {
      next()
    } else {
      const options = {
        path: "/",
        sameSite: true,
        maxAge: 1,
        httpOnly: true,
      };
    
      res.clearCookie("x-access_token");
      res.cookie("auth", undefined, options);
      res.render('main/forbidden')
    }
  })
}
export const verifyTokenAndResp = (req, res, next) => {
  authRoutes(req, res, () => {
    if (req.user.rol === tiposRol.responsable || req.user.rol === tiposRol.admin) {
      next()
    } else {
      const options = {
        path: "/",
        sameSite: true,
        maxAge: 1,
        httpOnly: true,
      };
    
      res.clearCookie("x-access_token");
      res.cookie("auth", undefined, options);
      res.render('user/forbidden')
    }
  })
}

// exports
export default authRoutes
