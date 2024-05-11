import { BIND_OUT, NUMBER } from "oracledb";
import { simpleExecute } from '../services/database.js'

const baseQuery = "SELECT * FROM oficinas"
const insertSql = "BEGIN FORMULARIOS_PKG.INSERTOFICINA(:desofi, :codofi,:usumov,:tipmov,:idofic); END;"
const updateSql = "BEGIN FORMULARIOS_PKG.UPDATEOFICINA(:idofic,:desofi, :codofi,:usumov,:tipmov); END;"
const removeSql = "BEGIN FORMULARIOS_PKG.DELETEOFICINA(:idofic,:usumov,:tipmov ); END;"

export const find = async (context) => {
  // bind
  let query = baseQuery
  const bind = context

  if (context.IDOFIC) {
    query += " WHERE idofic = :idofic"
  } else if (context.CODOFI) {
    query += " WHERE codofi = :codofi"
  }
  
  // proc
  try {
    const result = await simpleExecute(query, bind)

    if (result.rows.length) {
      if (result.rows === 1) {
        return ({ stat: 1, data: result.rows[0] })
      }
      return ({ stat: 1, data: result.rows })
    } else {
      return ({ stat: 0, data: 'Usuario no encontrado' })
    }
  } catch (error) {
    throw new Error(error)
  }
}
export const findAll = async (context) => {
  // bind
  let query = '';
  let bind = {
    limit: context.limit,
    part: context.part,
  };

  if (context.direction === 'next') {
    bind.idofic = context.cursor.next;
    query = "WITH datos AS (SELECT * FROM oficinas WHERE desofi LIKE '%' || :part || '%' OR :part IS NULL) SELECT * FROM datos WHERE idofic > :idofic ORDER BY idofic ASC FETCH NEXT :limit ROWS ONLY"
  } else {
    bind.idofic = context.cursor.prev;
    query = "WITH datos AS (SELECT * FROM oficinas WHERE desofi LIKE '%' || :part || '%' OR :part IS NULL) SELECT * FROM datos WHERE idofic < :idofic ORDER BY idofic DESC FETCH NEXT :limit ROWS ONLY"
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
  bind.IDOFIC = {
    dir: BIND_OUT,
    type: NUMBER,
  };

  // proc
  try {
    const result = await simpleExecute(insertSql, bind)
  
    if (result) {
      bind.IDOFIC = result.outBinds.IDOFIC
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