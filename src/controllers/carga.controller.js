import * as DAL from "../models/carga.model";

// proc
export const carga = async (req, res) => {
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
export const cargas = async (req, res) => {
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
  const carga = {
    DESCAR: req.body.carga.DESCAR,
    FICCAR: req.body.carga.FICCAR,
    REFCAR: req.body.carga.REFCAR,
    STACAR: req.body.carga.STACAR,
  };
  const movimiento = {
    USUMOV: req.body.movimiento.USUMOV,
    TIPMOV: req.body.movimiento.TIPMOV,
  };

  const context = Object.assign(carga, movimiento);

  // proc
  try {
    const result = await DAL.insert(context)

    res.send({ stat: result.stat, data: result.data })
  } catch (error) {
    res.send({ stat: 0, data: error.message })
  }
}