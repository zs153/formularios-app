import * as DAL from '../models/ade.model'

export const ade = async (req, res) => {
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
export const ades = async (req, res) => {
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

    res.send({ stat: result.stat, data: result.data })
  } catch (error) {
    res.send({ stat: 0, data: error.message })
  }
}