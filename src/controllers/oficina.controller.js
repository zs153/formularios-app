import * as DAL from '../models/oficina.model'

export const oficina = async (req, res) => {
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
export const oficinas = async (req, res) => {
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
  const oficina = {
    DESOFI: req.body.oficina.DESOFI,
    CODOFI: req.body.oficina.CODOFI,
  }
  const movimiento = {
    USUMOV: req.body.movimiento.USUMOV,
    TIPMOV: req.body.movimiento.TIPMOV,
  }
  const context = Object.assign(oficina, movimiento)

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
  const oficina = {
    IDOFIC: req.body.oficina.IDOFIC,
    DESOFI: req.body.oficina.DESOFI,
    CODOFI: req.body.oficina.CODOFI,
  }
  const movimiento = {
    USUMOV: req.body.movimiento.USUMOV,
    TIPMOV: req.body.movimiento.TIPMOV,
  }
  const context = Object.assign(oficina, movimiento)

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
  const oficina = {
    IDOFIC: req.body.oficina.IDOFIC,
  }
  const movimiento = {
    USUMOV: req.body.movimiento.USUMOV,
    TIPMOV: req.body.movimiento.TIPMOV,
  }
  const context = Object.assign(oficina, movimiento)

  // proc
  try {
    const result = await DAL.remove(context)

    res.send({ stat: result.stat, data: result.data })
  } catch (error) {
    res.send({ stat: 0, data: error.message })
  }
}