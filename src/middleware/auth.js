import axios from 'axios'
import { createPublicKey, createSecretKey } from 'crypto'
import { V4, V3 } from 'paseto'
import { tiposRol } from '../public/js/enumeraciones'
import { publicKey, puertoAPI, secreto, serverAPI } from '../config/settings'

const authRoutes = async (req, res, next) => {
  let tokenHeader = req.cookies.auth

  try {
    const localKey = createSecretKey(new Buffer.from(secreto, 'hex'));
    
    if (typeof tokenHeader === 'undefined') {
      tokenHeader = ''
      const token = req.query.valid === 'undefined' ? '' : req.query.valid
      
      const key = createPublicKey({
        'key': publicKey,
        'format': 'pem',
        'type': 'spki',
        'passphrase': secreto
      })
      
      await V4.verify(token, key, {
        audience: 'urn:client:claim',
        issuer: 'http://localhost:4000',
        clockTolerance: '1 min',
      }).then(async ret => {
        const context = {
          USERID: ret.userid,
        }
        
        const usuario = await axios.post(`http://${serverAPI}:${puertoAPI}/api/usuario`, {
          context,
        })
        const payload = {
          id: usuario.data.data[0].IDUSUA,
          userid: usuario.data.data[0].USERID,
          rol: usuario.data.data[0].ROLUSU,
          oficina: usuario.data.data[0].OFIUSU,
        }

        await V3.encrypt(payload, localKey, {
          audience: 'urn:example:client',
          issuer: 'http://localhost:4000',
          expiresIn: '6 hours'
        }).then(localToken => {
          tokenHeader = localToken
          const options = {
            path: "/",
            sameSite: true,
            maxAge: 1000 * 60 * 60 * 6, // 6 horas
            httpOnly: true,
          }

          res.cookie('auth', localToken, options)
        }).catch(err => {
          throw new Error(err)
        })
      }).catch(err => {
        throw new Error(err)
      })
    }

    await V3.decrypt(tokenHeader, localKey, {
      audience: 'urn:example:client',
      issuer: 'http://localhost:4000',
      clockTolerance: '1 min',
    }).then(ret => {
      req.user = {
        id: ret.id,
        userid: ret.userid,
        rol: ret.rol,
        oficina: ret.oficina,
      }

      next()
    }).catch(err => {
      throw new Error(err)
    })
  } catch (err) {
    return res.redirect('/')
  }
}
export const verifyTokenAndAdmin = (req, res, next) => {
  authRoutes(req, res, () => {
    if (req.user.rol === tiposRol.admin) {
      next()
    } else {
      res.status(410).json('No tienes autorización')
    }
  })
}
export const verifyTokenAndResp = (req, res, next) => {
  authRoutes(req, res, () => {
    if (req.user.rol === tiposRol.responsable || req.user.rol === tiposRol.admin) {
      next()
    } else {
      res.status(410).json('No tienes autorización')
    }
  })
}

export default authRoutes