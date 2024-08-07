// imports
import axios from 'axios'
import { createPublicKey, createSecretKey } from 'crypto'
import { V4, V3 } from 'paseto'
import { serverAUTH,serverWEB,serverAPI,secretoKey,publicKey } from '../../config/settings'

// pages
export const mainPage = async (req, res) => {
  const strUrl = encodeURIComponent(`${serverWEB}`);
  res.redirect(`http://${serverAUTH}/?valid=${strUrl}`)
}
export const portalPage = async (req, res) => {
  res.redirect(`/user`)
}

// proc
export const dispat = async (req, res) => {
  const token = req.query.valid
  const keyPub = createPublicKey({
    'key': publicKey,
    'format': 'pem',
    'type': 'spki',
    'passphrase': secretoKey
  })
  const datos = {
    serverWEB,
  }

  await V4.verify(token, keyPub, {
    clockTolerance: '1 min',
  }).then(async ret => {
    const context = {
      USERID: ret.userid,
    }
    
    const usuario = await axios.post(`http://${serverAPI}/api/usuario`, {
      context,
    })
    
    if (usuario.data.stat) {
      const secretKey = createSecretKey(new Buffer.from(secretoKey, 'hex'));
      const user = {
        id: usuario.data.data.IDUSUA,
        userid: usuario.data.data.USERID,
        oficina: usuario.data.data.OFIUSU,
        rol: usuario.data.data.ROLUSU,
      }
      
      await V3.encrypt(user, secretKey, {
        expiresIn: '6 hours'
      }).then(async ret => {
        const options = {
          path: "/",
          maxAge: 1000 * 60 * 60 * 6, // 6 horas
          sameSite: true,
          httpOnly: true,
        }
    
        res.cookie('auth', ret, options)
        res.render('user/portal', { datos })
      }).catch(err => {
        res.render('user/error500', {
          alerts: [{ msg: err }],
        })
      })
    } else {
      res.render('user/noregister', {datos})
    }
  }).catch(err => {
    res.render("user/forbidden", {
      alerts: [{msg: err}]
    });
  })
}

// helpers