import { BIND_OUT, NUMBER } from "oracledb";
import { simpleExecute } from '../services/database.js';

// formulario
const insertSql = "BEGIN FORMULARIOS_PKG.INSERTFORMULARIO(:nifcon,:nomcon,:emacon,:telcon,:movcon,:reffor,:tipfor,:ejefor,:ofifor,:obsfor,:funfor,:liqfor,:stafor,:usumov,:tipmov,:idform); END;"
const updateSql = "BEGIN FORMULARIOS_PKG.UPDATEFORMULARIO(:idform,:nifcon,:nomcon,:emacon,:telcon,:movcon,:reffor,:tipfor,:ejefor,:ofifor,:obsfor,:usumov,:tipmov); END;"
const removeSql = "BEGIN FORMULARIOS_PKG.DELETEFORMULARIO(:idform,:usumov,:tipmov ); END;"
const stateSql = "BEGIN FORMULARIOS_PKG.CAMBIOESTADOFORMULARIO(:idform,:liqfor,:stafor,:usumov,:tipmov ); END;"
const cierreSql = "BEGIN FORMULARIOS_PKG.CIERREFORMULARIO(:idform,:liqfor,:stafor,:texsms,:movsms,:stasms,:tipsms,:usumov,:tipmov ); END;"
// ades
const asignSql = "BEGIN FORMULARIOS_PKG.ASIGNARFORMULARIOSUSUARIO(:liqfor,:stafor,:arrfor,:usumov,:tipmov); END;"
const unAsignSql = "BEGIN FORMULARIOS_PKG.DESASIGNARFORMULARIOSUSUARIO(:liqfor,:stafor,:arrfor,:usumov,:tipmov); END;"

// proc formulario
export const find = async (context) => {
  let query = "SELECT ff.*,oo.desofi,tt.destip FROM formularios ff INNER JOIN tipos tt ON tt.idtipo = ff.tipfor INNER JOIN oficinas oo ON oo.idofic = ff.ofifor"
  let bind = context

  if (context.IDFORM) {
    query += " WHERE ff.idform = :idform"
  } else if (context.REFFOR) {
    query += " WHERE ff.reffor = :reffor"
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
  let query = "WITH datos AS (SELECT ff.*,oo.desofi,tt.destip FROM formularios ff INNER JOIN oficinas oo ON oo.idofic = ff.ofifor INNER JOIN tipos tt ON tt.idtipo = ff.tipfor"
  let bind = {
    limit: context.limit,
  };
  
  if (context.part) {
    bind.part = context.part
    query += " AND (ff.nifcon LIKE '%' || :part || '%' OR ff.nomcon LIKE '%' || :part || '%' OR ff.ejefor LIKE '%' || :part || '%' OR ff.reffor LIKE '%' || :part || '%' OR ff.liqfor LIKE '%' || LOWER(:part) || '%' OR tt.destip LIKE '%' || :part || '%' OR oo.desofi LIKE '%' || :part || '%')"
  }
  if (context.rest) {
    bind.rest = context.rest
    query += " AND (ff.nifcon LIKE '%' || :rest || '%' OR ff.nomcon LIKE '%' || :rest || '%' OR ff.ejefor LIKE '%' || :rest || '%' OR ff.reffor LIKE '%' || :rest || '%' OR ff.liqfor LIKE '%' || LOWER(:rest) || '%' OR tt.destip LIKE '%' || :rest || '%' OR oo.desofi LIKE '%' || :rest || '%')"
  }
  if (context.stafor) {
    if (context.stafor === 2) {
      query += " WHERE BITAND(ff.stafor, 2) = 0"
    } else {
      bind.stafor = context.stafor
      query += " WHERE BITAND(ff.stafor, 3) = :stafor"
    }
  } 
  if (context.liqfor) {
    bind.liqfor = context.liqfor
    if (context.stafor) {
      query += " AND (ff.liqfor = :liqfor OR ff.stafor = 0)"
    } else {
      query += " WHERE ff.liqfor = :liqfor OR ff.stafor = 0"
    }
  }
  if (context.direction === 'next') {
    bind.idform = context.cursor.next;
    query += ")SELECT * FROM datos WHERE idform > :idform ORDER BY idform ASC FETCH NEXT :limit ROWS ONLY"
  } else {
    bind.idform = context.cursor.prev;
    query += ")SELECT * FROM datos WHERE idform < :idform ORDER BY idform DESC FETCH NEXT :limit ROWS ONLY"
  }
  //
  const ret = await simpleExecute(query, bind)

  if (ret) {
    return ({ stat: ret.rows.length, data: ret.rows })
  } else {
    return ({ stat: 0, data: [] })
  }
}
export const insert = async (context) => {
  // bind
  let bind = context
  bind.idform = {
    dir: BIND_OUT,
    type: NUMBER,
  };

  // proc
  const ret = await simpleExecute(insertSql, bind)

  if (ret) {
    bind.idform = ret.outBinds.idform
    return ({ stat: 1, data: bind })
  } else {
    return ({ stat: 0, data: [] })
  }
}
export const update = async (context) => {
  // bind
  const bind = context
  // proc
  const ret = await simpleExecute(updateSql, bind)

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
  const ret = await simpleExecute(removeSql, bind)

  if (ret) {
    return ({ stat: 1, data: bind })
  } else {
    return ({ stat: 0, data: [] })
  }
}

export const state = async (context) => {
  // bind
  const bind = context
  // proc
  const ret = await simpleExecute(stateSql, bind)

  if (ret) {
    return ({ stat: 1, data: bind })
  } else {
    return ({ stat: 0, data: [] })
  }
}
export const close = async (context) => {
  // bind
  const bind = context
  // proc
  const ret = await simpleExecute(cierreSql, bind)

  if (ret) {
    return ({ stat: 1, data: bind })
  } else {
    return ({ stat: 0, data: [] })
  }
}

export const asign = async (context) => {
  // bind
  let bind = context
  // proc
  const ret = await simpleExecute(asignSql, bind)

  if (ret) {
    return ({ stat: 1, data: bind })
  } else {
    return ({ stat: 0, data: [] })
  }
}
export const unasign = async (context) => {
  // bind
  let bind = context
  // proc
  const ret = await simpleExecute(unAsignSql, bind)

  if (ret) {
    return ({ stat: 1, data: bind })
  } else {
    return ({ stat: 0, data: [] })
  }
}