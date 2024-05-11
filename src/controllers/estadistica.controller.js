import * as DAL from '../models/estadistica.model'

export const usuarios = async (req, res) => {
  // context
  const context = req.body.context

  // proc
  try {
    const result = await DAL.usuarios(context)

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
    const result = await DAL.oficinas(context)

    res.send({ stat: result.stat, data: result.data })
  } catch (error) {
    res.send({ stat: 0, data: error.message })
  }
}
export const actuacion = async (req, res) => {
  // context
  const context = req.body.context

  // proc
  // proc
  try {
    const result = await DAL.actuacion(context)

    res.send({ stat: result.stat, data: result.data })
  } catch (error) {
    res.send({ stat: 0, data: error.message })
  }
}