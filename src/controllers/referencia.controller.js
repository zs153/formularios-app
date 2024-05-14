import * as DAL from '../models/referencia.model'

export const referencia = async (req, res) => {
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
export const referencias = async (req, res) => {
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
export const crear = async (req, res) => {
  // context
  const formulario = {
    IDFORM: req.body.formulario.IDFORM,
  }
  const referencia = {
    NIFREF: req.body.referencia.NIFREF,
    DESREF: req.body.referencia.DESREF,
    TIPREF: req.body.referencia.TIPREF,
  }
  const movimiento = {
    USUMOV: req.body.movimiento.USUMOV,
    TIPMOV: req.body.movimiento.TIPMOV,
  }
  const context = Object.assign(formulario, referencia, movimiento)

  // proc
  try {
    const result = await DAL.insert(context)

    res.send({ stat: result.stat, data: result.data })
  } catch (error) {
    res.send({ stat: 0, data: error.message })
  }
}
export const modificar = async (req, res) => {
  // context
  const referencia = {
    IDREFE: req.body.referencia.IDREFE,
    NIFREF: req.body.referencia.NIFREF,
    DESREF: req.body.referencia.DESREF,
    TIPREF: req.body.referencia.TIPREF,
  }
  const movimiento = {
    USUMOV: req.body.movimiento.USUMOV,
    TIPMOV: req.body.movimiento.TIPMOV,
  }
  const context = Object.assign(referencia, movimiento)

  // proc
  try {
    const result = await DAL.update(context)

    res.send({ stat: result.stat, data: result.data })
  } catch (error) {
    res.send({ stat: 0, data: error.message })
  } 
}
export const borrar = async (req, res) => {
  // context
  const referencia = {
    IDREFE: req.body.referencia.IDREFE,
  }
  const movimiento = {
    USUMOV: req.body.movimiento.USUMOV,
    TIPMOV: req.body.movimiento.TIPMOV,
  }
  const context = Object.assign(referencia, movimiento)

  // proc
  try {
    const result = await DAL.remove(context)

    res.send({ stat: result.stat, data: result.data })
  } catch (error) {
    res.send({ stat: 0, data: error.message })
  }
}