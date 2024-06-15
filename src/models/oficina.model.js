import { BIND_OUT, NUMBER } from "oracledb";
import { simpleExecute } from '../services/database.js'

const insertSql = "BEGIN FORMULARIOS_PKG.INSERTOFICINA(:desofi, :codofi,:usumov,:tipmov,:idofic); END;"
const updateSql = "BEGIN FORMULARIOS_PKG.UPDATEOFICINA(:idofic,:desofi, :codofi,:usumov,:tipmov); END;"
const removeSql = "BEGIN FORMULARIOS_PKG.DELETEOFICINA(:idofic,:usumov,:tipmov ); END;"

export const find = async (context) => {
  // bind
  let query = "SELECT * FROM oficinas"
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
}
export const findAll = async (context) => {
  // bind
  let query = "WITH datos AS (SELECT oo.idofic,oo.desofi,oo.codofi FROM oficinas oo WHERE oo.desofi LIKE '%' || :part || '%' OR oo.codofi LIKE '%' || :part || '%' OR :part IS NULL)";
  let bind = {
    limit: context.limit,
    part: context.part,
  };

  if (context.direction === 'next') {
    bind.desofi = context.cursor.next === '' ? null : context.cursor.next;
    query += "SELECT * FROM datos WHERE desofi > :desofi OR :desofi IS NULL ORDER BY desofi ASC FETCH NEXT :limit ROWS ONLY"
  } else {
    bind.desofi = context.cursor.prev === '' ? null : context.cursor.prev;
    query += "SELECT * FROM datos WHERE desofi < :desofi OR :desofi IS NULL ORDER BY desofi ASC FETCH NEXT :limit ROWS ONLY"
  }

  // proc
  try {
    const result = await simpleExecute(query, bind)
  
    console.log(result.rows);
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