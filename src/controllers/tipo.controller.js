import * as DAL from "../models/tipo.model";

export const tipo = async (req, res) => {
  const context = req.body.context;

  // proc
  try {
    const result = await DAL.find(context)

    res.send({ stat: result.stat, data: result.data })
  } catch (error) {
    res.send({ stat: 0, data: error.message })
  }
};
export const tipos = async (req, res) => {
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
  const tipo = {
    DESTIP: req.body.tipo.DESTIP,
    AYUTIP: req.body.tipo.AYUTIP,
  };
  const movimiento = {
    USUMOV: req.body.movimiento.USUMOV,
    TIPMOV: req.body.movimiento.TIPMOV,
  };
  const context = Object.assign(tipo, movimiento)

  // proc
  try {
    const result = await DAL.insert(context)

    res.send({ stat: result.stat, data: result.data })
  } catch (error) {
    res.send({ stat: 0, data: error.message })
  }
};
export const modificar = async (req, res) => {
  // context
  const tipo = {
    IDTIPO: req.body.tipo.IDTIPO,
    DESTIP: req.body.tipo.DESTIP,
    AYUTIP: req.body.tipo.AYUTIP,
  };
  const movimiento = {
    USUMOV: req.body.movimiento.USUMOV,
    TIPMOV: req.body.movimiento.TIPMOV,
  };
  const context = Object.assign(tipo, movimiento)

  // proc
  try {
    const result = await DAL.update(context)

    res.send({ stat: result.stat, data: result.data })
  } catch (error) {
    res.send({ stat: 0, data: error.message })
  }
};
export const borrar = async (req, res) => {
  // context
  const tipo = {
    IDTIPO: req.body.tipo.IDTIPO,
  };
  const movimiento = {
    USUMOV: req.body.movimiento.USUMOV,
    TIPMOV: req.body.movimiento.TIPMOV,
  };
  const context = Object.assign(tipo, movimiento)

  // proc
  try {
    const result = await DAL.remove(context)

    res.send({ stat: result.stat, data: result.data })
  } catch (error) {
    res.send({ stat: 0, data: error.message })
  }
};
