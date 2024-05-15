import { BIND_OUT, NUMBER } from "oracledb";
import { simpleExecute } from "../services/database.js";

const insertSql = "BEGIN FORMULARIOS_PKG.INSERTTIPO(:destip,:ayutip,:usumov,:tipmov,:idtipo); END;";
const updateSql = "BEGIN FORMULARIOS_PKG.UPDATETIPO(:idtipo,:destip,:ayutip,:usumov,:tipmov); END;";
const removeSql = "BEGIN FORMULARIOS_PKG.DELETETIPO(:idtipo,:usumov,:tipmov ); END;";

export const find = async (context) => {
  // bind
  const bind = context;
  let query = "SELECT * FROM tipos";

  if (context.IDTIPO) {
    query += " WHERE idtipo = :idtipo";
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
export const findAll = async (context) => {
  // bind
  let query = "WITH datos AS (SELECT tt.* FROM tipos tt WHERE tt.destip LIKE '%' || :part || '%' OR :part IS NULL)";
  let bind = {
    limit: context.limit,
    part: context.part,
  };

  if (context.direction === 'next') {
    bind.destip = context.cursor.next === '' ? null : context.cursor.next;
    query += "SELECT * FROM datos WHERE destip > :destip OR :destip IS NULL ORDER BY destip ASC FETCH NEXT :limit ROWS ONLY"
  } else {
    bind.destip = context.cursor.prev === '' ? null : context.cursor.prev;
    query += "SELECT * FROM datos WHERE destip < :destip OR :destip IS NULL ORDER BY destip ASC FETCH NEXT :limit ROWS ONLY"
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
  bind.IDTIPO = {
    dir: BIND_OUT,
    type: NUMBER,
  };

  // proc
  try {
    const result = await simpleExecute(insertSql, bind)
  
    if (result) {
      bind.ITIPO = result.outBinds.IDTIPO
      return ({ stat: 1, data: bind })
    } else {
      return ({ stat: 0, data: result })
    }    
  } catch (error) {
    throw new Error(error)
  }
};
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
};
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
};
