import { BIND_OUT, NUMBER } from "oracledb";
import { simpleExecute } from '../services/database.js';

// formulario
const insertSql = "BEGIN FORMULARIOS_PKG.INSERTFORMULARIO(:nifcon,:nomcon,:emacon,:telcon,:movcon,:reffor,:tipfor,:ejefor,:ofifor,:obsfor,:funfor,:liqfor,:stafor,:usumov,:tipmov,:idform); END;"
const updateSql = "BEGIN FORMULARIOS_PKG.UPDATEFORMULARIO(:idform,:nifcon,:nomcon,:emacon,:telcon,:movcon,:reffor,:tipfor,:ejefor,:ofifor,:obsfor,:usumov,:tipmov); END;"
const removeSql = "BEGIN FORMULARIOS_PKG.DELETEFORMULARIO(:idform,:usumov,:tipmov ); END;"
const stateSql = "BEGIN FORMULARIOS_PKG.CAMBIOESTADOFORMULARIO(:idform,:liqfor,:stafor,:usumov,:tipmov ); END;"
const cierreSql = "BEGIN FORMULARIOS_PKG.CIERREFORMULARIO(:idform,:liqfor,:stafor,:texsms,:movsms,:stasms,:tipsms,:usumov,:tipmov ); END;"

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
  try {
    const result = await simpleExecute(query, bind)
  
    if (result.rows.length) {
      if (result.rows.length === 1) {
        return ({ stat: result.rows.length, data: result.rows[0] })
      }
      return ({ stat: result.rows.length, data: result.rows })
    } else {
      return ({ stat: 0, data: [] })
    }
  } catch (error) {
    throw new Error(error)
  }
}
export const findAll = async (context) => {
  // bind
  let query = "WITH datos AS (SELECT ff.*,oo.desofi,tt.destip FROM formularios ff INNER JOIN oficinas oo ON oo.idofic = ff.ofifor INNER JOIN tipos tt ON tt.idtipo = ff.tipfor"
  let bind = {
    limit: context.limit,
    stafor: context.stafor,
  };
  
  if (context.part) {
    bind.part = context.part
    query += " AND (ff.nifcon LIKE '%' || :part || '%' OR ff.nomcon LIKE '%' || :part || '%' OR ff.ejefor LIKE '%' || :part || '%' OR ff.reffor LIKE '%' || :part || '%' OR ff.liqfor LIKE '%' || LOWER(:part) || '%' OR tt.destip LIKE '%' || :part || '%' OR oo.desofi LIKE '%' || :part || '%')"
  }
  if (context.rest) {
    bind.rest = context.rest
    query += " AND (ff.nifcon LIKE '%' || :rest || '%' OR ff.nomcon LIKE '%' || :rest || '%' OR ff.ejefor LIKE '%' || :rest || '%' OR ff.reffor LIKE '%' || :rest || '%' OR ff.liqfor LIKE '%' || LOWER(:rest) || '%' OR tt.destip LIKE '%' || :rest || '%' OR oo.desofi LIKE '%' || :rest || '%')"
  }

  if (context.stafor === 0) {
    query += " WHERE ff.stafor = :stafor"
  } else if (context.stafor === 1) {
    query += " WHERE ff.stafor = :stafor"
  } else if (context.stafor === 2) {
    query += " WHERE BITAND(ff.stafor, 2) = 0"
  } else {
    query += " WHERE ff.stafor = :stafor"
  }
  
  if (context.liqfor) {
    bind.liqfor = context.liqfor
    query += " AND ff.liqfor = :liqfor"
  }

  if (context.direction === 'next') {
    bind.idform = context.cursor.next;
    query += ")SELECT * FROM datos WHERE idform > :idform ORDER BY idform ASC FETCH NEXT :limit ROWS ONLY"
  } else {
    bind.idform = context.cursor.prev;
    query += ")SELECT * FROM datos WHERE idform < :idform ORDER BY idform DESC FETCH NEXT :limit ROWS ONLY"
  }

  try {
    const result = await simpleExecute(query, bind)
  
    if (result) {
      return ({ stat: result.rows.length, data: result.rows })
    } else {
      return ({ stat: 0, data: [] })
    }    
  } catch (error) {
    throw new Error(error)
  }
}
export const insert = async (context) => {
  // bind
  let bind = context
  bind.IDFORM = {
    dir: BIND_OUT,
    type: NUMBER,
  };

  // proc
  try {
    const result = await simpleExecute(insertSql, bind)
    
    if (result) {
      bind.IDFORM = result.outBinds.IDFORM
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

export const state = async (context) => {
  // bind
  const bind = context

  // proc
  try {
    const result = await simpleExecute(stateSql, bind)
  
    if (result) {
      return ({ stat: 1, data: bind })
    } else {
      return ({ stat: 0, data: result })
    }
  } catch (error) {
    throw new Error(error)
  }
}
export const close = async (context) => {
  // bind
  const bind = context

  // proc
  try {
    const result = await simpleExecute(cierreSql, bind)
  
    if (result) {
      return ({ stat: 1, data: bind })
    } else {
      return ({ stat: 0, data: result })
    }
  } catch (error) {
    throw new Error(error)
  }
}
