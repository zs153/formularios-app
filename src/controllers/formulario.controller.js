import * as DAL from '../models/formulario.model'

// formulario
export const formulario = async (req, res) => {
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
export const formularios = async (req, res) => {
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
    NIFCON: req.body.formulario.NIFCON,
    NOMCON: req.body.formulario.NOMCON,
    EMACON: req.body.formulario.EMACON,
    TELCON: req.body.formulario.TELCON,
    MOVCON: req.body.formulario.MOVCON,
    REFFOR: req.body.formulario.REFFOR,
    TIPFOR: req.body.formulario.TIPFOR,
    EJEFOR: req.body.formulario.EJEFOR,
    OFIFOR: req.body.formulario.OFIFOR,
    OBSFOR: req.body.formulario.OBSFOR,
    FUNFOR: req.body.formulario.FUNFOR,
    LIQFOR: req.body.formulario.LIQFOR,
    STAFOR: req.body.formulario.STAFOR,
  }
  const movimiento = {
    USUMOV: req.body.movimiento.USUMOV,
    TIPMOV: req.body.movimiento.TIPMOV,
  }
  const context = Object.assign(formulario, movimiento)

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
  const formulario = {
    IDFORM: req.body.formulario.IDFORM,
    NIFCON: req.body.formulario.NIFCON,
    NOMCON: req.body.formulario.NOMCON,
    EMACON: req.body.formulario.EMACON,
    TELCON: req.body.formulario.TELCON,
    MOVCON: req.body.formulario.MOVCON,
    REFFOR: req.body.formulario.REFFOR,
    TIPFOR: req.body.formulario.TIPFOR,
    EJEFOR: req.body.formulario.EJEFOR,
    OFIFOR: req.body.formulario.OFIFOR,
    OBSFOR: req.body.formulario.OBSFOR,
  }
  const movimiento = {
    USUMOV: req.body.movimiento.USUMOV,
    TIPMOV: req.body.movimiento.TIPMOV,
  }
  const context = Object.assign(formulario, movimiento)

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
  const formulario = {
    IDFORM: req.body.formulario.IDFORM,
  }
  const movimiento = {
    USUMOV: req.body.movimiento.USUMOV,
    TIPMOV: req.body.movimiento.TIPMOV,
  }
  const context = Object.assign(formulario, movimiento)

  // proc
  try {
    const result = await DAL.remove(context)

    res.send({ stat: result.stat, data: result.data })
  } catch (error) {
    res.send({ stat: 0, data: error.message })
  }
}

export const estado = async (req, res) => {
  // context
  const formulario = {
    IDFORM: req.body.formulario.IDFORM,
    LIQFOR: req.body.formulario.LIQFOR,
    STAFOR: req.body.formulario.STAFOR,
  }
  const movimiento = {
    USUMOV: req.body.movimiento.USUMOV,
    TIPMOV: req.body.movimiento.TIPMOV,
  }
  const context = Object.assign(formulario, movimiento)

  // proc
  try {
    const result = await DAL.state(context)

    res.send({ stat: result.stat, data: result.data })
  } catch (error) {
    res.send({ stat: 0, data: error.message })
  }
}
export const cerrar = async (req, res) => {
  // context
  const formulario = {
    IDFORM: req.body.formulario.IDFORM,
    LIQFOR: req.body.formulario.LIQFOR,
    STAFOR: req.body.formulario.STAFOR,
  }
  const sms = {
    TEXSMS: req.body.sms.TEXSMS,
    MOVSMS: req.body.sms.MOVSMS,
    STASMS: req.body.sms.STASMS,
    TIPSMS: req.body.sms.TIPSMS,
  }
  const movimiento = {
    USUMOV: req.body.movimiento.USUMOV,
    TIPMOV: req.body.movimiento.TIPMOV,
  }
  const context = Object.assign(formulario, sms, movimiento)

  // proc
  try {
    const result = await DAL.close(context)

    res.send({ stat: result.stat, data: result.data })
  } catch (error) {
    res.send({ stat: 0, data: error.message })
  }
}

// ades
export const asignar = async (req, res) => {
  // context
  const formulario = {
    LIQFOR: req.body.formulario.LIQFOR,
    STAFOR: req.body.formulario.STAFOR,
  }  
  const formularios = {
    ARRFOR: {
      val: req.body.formularios.ARRFOR,
    }
  }
  const movimiento = {
    USUMOV: req.body.movimiento.USUMOV,
    TIPMOV: req.body.movimiento.TIPMOV,
  }
  const context = Object.assign(formulario, formularios, movimiento)

  // proc
  try {
    const result = await DAL.asign(context)

    res.send({ stat: result.stat, data: result.data })
  } catch (error) {
    res.send({ stat: 0, data: error.message })
  }
}
export const desAsignar = async (req, res) => {
  // context
  const formulario = {
    LIQFOR: req.body.formulario.LIQFOR,
    STAFOR: req.body.formulario.STAFOR,
  }  
  const formularios = {
    ARRFOR: {
      val: req.body.formularios.ARRFOR,
    }
  }
  const movimiento = {
    USUMOV: req.body.movimiento.USUMOV,
    TIPMOV: req.body.movimiento.TIPMOV,
  }
  const context = Object.assign(formulario, formularios, movimiento)

  // proc
  try {
    const result = await DAL.unasign(context)

    res.status(200).json(result)
  } catch (err) {
    res.status(400).json({ stat: null, data: err })
  }
}