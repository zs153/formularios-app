import { serverWEB, puertoWEB, serverAUTH, puertoAUTH } from '../config/settings'

export const mainPage = async (req, res) => {
  const strUrl = encodeURIComponent(`${serverWEB}:${puertoWEB}`);

  res.redirect(`http://${serverAUTH}:${puertoAUTH}/log/login/?valid=${strUrl}`)
};
export const cleanPage = async (req, res) => {
  const user = req.user
  const datos = {
    serverWEB,
    puertoWEB,
  }

  res.render('clean', { user, datos })
}