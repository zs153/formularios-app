import * as DAL from "../models/gente.model";

export const gente = async (req, res) => {
  let context = {
    nifgen: req.body.NIFGEN,

  };

  if (context.nifgen.length > 9) {
    context.disgen = context.nifgen.slice(-1);
    context.nifgen = context.nifgen.slice(0, 9);
  }

  // proc
  try {
    const result = await DAL.find(context)

    res.send({ stat: result.stat, data: result.data })
  } catch (error) {
    res.send({ stat: 0, data: error.message })
  }
};