import * as DAL from '../models/sms.model'

export const sms = async (req, res) => {
  // context
  const context = req.body.context

  // proc
  try {
    const result = await DAL.sms(context)

    res.status(200).json(result)
  } catch (err) {
    res.status(400).json({ stat: null, data: err })
  }
}
export const smss = async (req, res) => {
  // context
  const context = req.body.context

  // proc
  try {
    const result = await DAL.smss(context)

    res.status(200).json(result)
  } catch (err) {
    res.status(400).json({ stat: null, data: err })
  }
}
export const crearSms = async (req, res) => {
  // context
  const formulario = {
    IDFORM: req.body.formulario.IDFORM,
  }
  const sms = {
    TEXSMS: req.body.sms.TEXSMS,
    MOVSMS: req.body.sms.MOVSMS,
    STASMS: req.body.sms.STASMS,
  }
  const movimiento = {
    USUMOV: req.body.movimiento.USUMOV,
    TIPMOV: req.body.movimiento.TIPMOV,
  }
  const context = Object.assign(formulario, sms, movimiento)

  // proc
  try {
    const result = await DAL.insertSms(context)

    res.status(200).json(result)
  } catch (err) {
    res.status(400).json({ stat: null, data: err })
  }
}
export const modificarSms = async (req, res) => {
  // context
  const sms = {
    IDSMSS: req.body.sms.IDSMSS,
    TEXSMS: req.body.sms.TEXSMS,
    MOVSMS: req.body.sms.MOVSMS,
  }
  const movimiento = {
    USUMOV: req.body.movimiento.USUMOV,
    TIPMOV: req.body.movimiento.TIPMOV,
  }
  const context = Object.assign(sms, movimiento)

  // proc
  try {
    const result = await DAL.updateSms(context)

    res.status(200).json(result)
  } catch (err) {
    res.status(400).json({ stat: null, data: err })
  }
}
export const borrarSms = async (req, res) => {
  // context
  const sms = {
    IDSMSS: req.body.sms.IDSMSS,
  }
  const movimiento = {
    USUMOV: req.body.movimiento.USUMOV,
    TIPMOV: req.body.movimiento.TIPMOV,
  }
  const context = Object.assign(sms, movimiento)

  // proc
  try {
    const result = await DAL.removeSms(context)

    res.status(200).json(result)
  } catch (err) {
    res.status(400).json({ stat: null, data: err })
  }
}