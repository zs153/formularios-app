import * as DAL from '../models/historico.model'

export const historico = async (req, res) => {
  // context
  const context = req.body.context

  // proc
  try {
    const result = await DAL.find(context)

    res.send({ stat: result.stat, data: result.data })
  } catch (error) {
    res.send({ stat: 0, data: error.message })
  }
}
export const historicos = async (req, res) => {
  // context
  const context = req.body.context

  // proc
  try {
    const result = await DAL.findAll(context)

    res.send({ stat: result.stat, data: result.data })
  } catch (error) {
    res.send({ stat: 0, data: error.message })
  }
}
export const modificar = async (req, res) => {
  // context
  const historico = {
    IDUSUA: req.body.historico.IDUSUA,
    NOMUSU: req.body.historico.NOMUSU,
    OFIUSU: req.body.historico.OFIUSU,
    ROLUSU: req.body.historico.ROLUSU,
    USERID: req.body.historico.USERID,
    EMAUSU: req.body.historico.EMAUSU,
    PERUSU: req.body.historico.PERUSU,
    TELUSU: req.body.historico.TELUSU,
  }
  const movimiento = {
    USUMOV: req.body.movimiento.USUMOV,
    TIPMOV: req.body.movimiento.TIPMOV,
  }
  const context = Object.assign(historico, movimiento)

  // proc
  try {
    const result = await DAL.update(context)

    res.send({ stat: result.stat, data: result.data })
  } catch (error) {
    res.send({ stat: 0, data: error.message })
  }
}
export const activar = async (req, res) => {
  // context
  const historico = {
    IDUSUA: req.body.historico.IDUSUA,
  }
  const movimiento = {
    USUMOV: req.body.movimiento.USUMOV,
    TIPMOV: req.body.movimiento.TIPMOV,
  }
  const context = Object.assign(historico, movimiento)

  // proc
  try {
    const result = await DAL.activar(context)

    res.send({ stat: result.stat, data: result.data })
  } catch (error) {
    res.send({ stat: 0, data: error.message })
  }
}