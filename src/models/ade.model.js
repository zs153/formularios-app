import { simpleExecute } from '../services/database.js';

// sql
const asignSql = "BEGIN FORMULARIOS_PKG.ASIGNARFORMULARIOSUSUARIO(:liqfor,:stafor,:arrfor,:usumov,:tipmov); END;"
const unAsignSql = "BEGIN FORMULARIOS_PKG.DESASIGNARFORMULARIOSUSUARIO(:liqfor,:stafor,:arrfor,:usumov,:tipmov); END;"

export const asign = async (context) => {
  // bind
  let bind = context

  // proc
  try {
    const result = await simpleExecute(asignSql, bind)
  
    if (result) {
      return ({ stat: 1, data: bind })
    } else {
      return ({ stat: 0, data: result })
    }    
  } catch (error) {
    throw new Error(error)
  }
}
export const unasign = async (context) => {
  // bind
  let bind = context
  
  // proc
  try {
    const result = await simpleExecute(unAsignSql, bind)
  
    if (result) {
      return ({ stat: 1, data: bind })
    } else {
      return ({ stat: 0, data: result })
    }    
  } catch (error) {
    throw new Error(error)
  }
}