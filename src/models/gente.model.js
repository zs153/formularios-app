import { simpleExecute } from "../services/database.js";

const baseQuery = "SELECT gg.* FROM gentes gg WHERE gg.nifgen = :nifgen";
export const find = async (context) => {
  let query = baseQuery;
  let bind = {};

  if (context.DISGEN) {
    query += "AND gg.disgen = :disgen";
  }

  // proc
  try {
    const result = await simpleExecute(query, bind)

    if (result.rows.length) {
      if (result.rows.length === 1) {
        return ({ stat: 1, data: result.rows[0] })
      }
      return ({ stat: 1, data: result.rows })
    } else {
      return ({ stat: 0, data: 'No hay resultado para la consulta solicitada' })
    }
  } catch (error) {
    throw new Error(error)
  }  
};