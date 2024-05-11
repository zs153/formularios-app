import * as DAL from '../models/referencia.model'

export const referencia = async (req, res) => {
  // context
  const context = req.body.context

  // proc
  try {
    const result = await DAL.find(context)

    res.status(200).json(result)
  } catch (err) {
    res.status(400).json({ stat: null, data: err })
  }
}
export const referencias = async (req, res) => {
  // context
  const context = req.body.context

  // proc
  try {
    const result = await DAL.findAll(context)

    res.status(200).json(result)
  } catch (err) {
    res.status(400).json({ stat: null, data: err })
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

    res.status(200).json(result)
  } catch (err) {
    res.status(400).json({ stat: null, data: err })
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

    res.status(200).json(result)
  } catch (err) {
    res.status(400).json({ stat: null, data: err })
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

    res.status(200).json(result)
  } catch (err) {
    res.status(400).json({ stat: null, data: err })
  }
}