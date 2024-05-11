import { BIND_OUT, NUMBER } from "oracledb";
import { simpleExecute } from "../services/database.js";

const insertReferenciaSql = "BEGIN FORMULARIOS_PKG.INSERTREFERENCIA(:idform,:nifref,:desref,:tipref,:usumov,:tipmov,:idrefe); END;"
const updateReferenciaSql = "BEGIN FORMULARIOS_PKG.UPDATEREFERENCIA(:idrefe,:nifref,:desref,:tipref,:usumov,:tipmov); END;"
const removeReferenciaSql = "BEGIN FORMULARIOS_PKG.DELETEREFERENCIA(:idrefe,:usumov,:tipmov ); END;"

// proc referencia
export const find = async (context) => {
  // bind
  let query = "SELECT rr.*,tt.destip FROM referencias rr INNER JOIN tipos tt ON tt.idtipo = rr.tipref"
  const bind = context

  if (context.IDFORM) {
    query += " INNER JOIN referenciasformulario rf ON rf.idrefe = rr.idrefe WHERE rf.idform = :idform"
  } 
  if (context.IDREFE) {
    query += " WHERE rr.idrefe = :idrefe"
  }

  // proc
  const ret = await simpleExecute(query, bind)

  if (ret) {
    return ({ stat: ret.rows.length, data: ret.rows })
  } else {
    return ({ stat: 0, data: [] })
  }
}
export const findAll = async (context) => {
  // bind
  let query = ""
  let bind = {
    idform: context.formulario,
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
  const ret = await simpleExecute(query, bind)

  if (ret) {
    return ({ stat: ret.rows.length, data: ret.rows })
  } else {
    return ({ stat: 0, data: [] })
  }
};
export const insert = async (context) => {
  // bind
  let bind = context
  bind.idrefe = {
    dir: BIND_OUT,
    type: NUMBER,
  }

  // proc
  const ret = await simpleExecute(insertReferenciaSql, bind)
  
  if (ret) {
    bind.idrefe = ret.outBinds.idrefe
    return ({ stat: 1, data: bind })
  } else {
    return ({ stat: 0, data: [] })
  }
}
export const update = async (context) => {
  // bind
  const bind = context
  // proc
  const ret = await simpleExecute(updateReferenciaSql, bind)

  if (ret) {
    return ({ stat: 1, data: bind })
  } else {
    return ({ stat: 0, data: [] })
  }
}
export const remove = async (context) => {
  // bind
  const bind = context
  // proc
  const ret = await simpleExecute(removeReferenciaSql, bind)

  if (ret) {
    return ({ stat: 1, data: bind })
  } else {
    return ({ stat: 0, data: [] })
  }
}
