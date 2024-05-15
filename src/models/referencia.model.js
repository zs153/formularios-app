import { BIND_OUT, NUMBER } from "oracledb";
import { simpleExecute } from "../services/database.js";

const insertSql = "BEGIN FORMULARIOS_PKG.INSERTREFERENCIA(:idform,:nifref,:desref,:tipref,:usumov,:tipmov,:idrefe); END;"
const updateSql = "BEGIN FORMULARIOS_PKG.UPDATEREFERENCIA(:idrefe,:nifref,:desref,:tipref,:usumov,:tipmov); END;"
const removeSql = "BEGIN FORMULARIOS_PKG.DELETEREFERENCIA(:idrefe,:usumov,:tipmov ); END;"

// proc referencia
export const find = async (context) => {
  // bind
  let query = "SELECT rr.*,tt.destip FROM referencias rr INNER JOIN tipos tt ON tt.idtipo = rr.tipref"
  const bind = context

  if (context.IDFORM) {
    query += " INNER JOIN referenciasformulario rf ON rf.idrefe = rr.idrefe WHERE rf.idform = :idform"
  } else if (context.IDREFE) {
    query += " WHERE rr.idrefe = :idrefe"
  }

  // proc
  try {
    const result = await simpleExecute(query, bind)

    if (result.rows.length) {
      if (result.rows.length === 1) {
        return ({ stat: result.rows.length, data: result.rows[0] })
      }
      return ({ stat: result.rows.length, data: result.rows })
    } else {
      return ({ stat: 0, data: result })
    }
  } catch (error) {
    throw new Error(error)
  }
}
export const findAll = async (context) => {
  // bind
  let query = ""
  let bind = {
    idform: context.idform,
    limit: context.limit,
    part: context.part,
  };

  if (context.direction === 'next') {
    bind.idrefe = context.cursor.next;
    query = "SELECT rr.*,rf.idform,tt.destip FROM referencias rr INNER JOIN referenciasformulario rf ON rf.idrefe = rr.idrefe AND rf.idform = :idform INNER JOIN tipos tt ON tt.idtipo = rr.tipref WHERE rr.idrefe > :idrefe AND (rr.nifref LIKE '%' || :part || '%' OR rr.desref LIKE '%' || :part || '%' OR :part IS NULL) ORDER BY rr.idrefe ASC FETCH NEXT :limit ROWS ONLY"
  } else {
    bind.idrefe = context.cursor.prev;
    query = "SELECT rr.*,rf.idform,tt.destip FROM referencias rr INNER JOIN referenciasformulario rf ON rf.idrefe = rr.idrefe AND rf.idform = :idform INNER JOIN tipos tt ON tt.idtipo = rr.tipref WHERE rr.idrefe < :idrefe AND (rr.nifref LIKE '%' || :part || '%' OR rr.desref LIKE '%' || :part || '%' OR :part IS NULL) ORDER BY rr.idrefe DESC FETCH NEXT :limit ROWS ONLY"
  }

  // proc
  try {
    const result = await simpleExecute(query, bind)
  
    if (result.rows.length) {
      return ({ stat: result.rows.length, data: result.rows })
    } else {
      return ({ stat: 0, data: [] })
    }    
  } catch (error) {
    throw new Error(error)
  }
};
export const insert = async (context) => {
  // bind
  let bind = context
  bind.IDREFE = {
    dir: BIND_OUT,
    type: NUMBER,
  }

  // proc
  try {
    const result = await simpleExecute(insertSql, bind)
  
    if (result) {
      bind.IDREF = result.outBinds.IDREFE
      return ({ stat: 1, data: bind })
    } else {
      return ({ stat: 0, data: result })
    }    
  } catch (error) {
    throw new Error(error)
  }
}
export const update = async (context) => {
  // bind
  const bind = context

  // proc
  try {
    const result = await simpleExecute(updateSql, bind)
  
    if (result) {
      return ({ stat: 1, data: bind })
    } else {
      return ({ stat: 0, data: result })
    }    
  } catch (error) {
    throw new Error(error)
  }
}
export const remove = async (context) => {
  // bind
  const bind = context

  // proc
  try {
    const result = await simpleExecute(removeSql, bind)
    if (result) {
      return ({ stat: 1, data: bind })
    } else {
      return ({ stat: 0, data: result })
    }
  } catch (error) {
    throw new Error(error)
  }
}
