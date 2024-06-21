import { BIND_OUT, NUMBER } from "oracledb";
import { simpleExecute } from "../services/database.js";

const insertSql = "BEGIN FORMULARIOS_PKG.INSERTCARGA(:descar,:ficcar,:refcar,:stacar,:usumov,:tipmov,:idcarg); END;";

export const find = async (context) => {
  // bind
  let query = "SELECT * FROM cargas"
  const bind = context

  if (context.IDCARG) {
    query += " WHERE idcarg = :idcarg"
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
  let query = '';
  let bind = {
    limit: context.limit,
    part: context.part,
  };

  if (context.direction === 'next') {
    bind.idcarg = context.cursor.next;
    query = "WITH datos AS (SELECT * FROM cargas WHERE descar LIKE '%' || :part || '%' OR refcar LIKE '%' || :part || '%' OR :part IS NULL) SELECT * FROM datos WHERE idcarg > :idcarg ORDER BY idcarg ASC FETCH NEXT :limit ROWS ONLY"
  } else {
    bind.idcarg = context.cursor.prev;
    query = "WITH datos AS (SELECT * FROM cargas WHERE descar LIKE '%' || :part || '%' OR refcar LIKE '%' || :part || '%' OR :part IS NULL) SELECT * FROM datos WHERE idcarg < :idcarg ORDER BY idcarg DESC FETCH NEXT :limit ROWS ONLY"
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
  bind.idcarg = {
    dir: BIND_OUT,
    type: NUMBER,
  };

  // proc
  try {
    const result = await simpleExecute(insertSql, bind)
  
    if (result) {
      bind.IDCARG = result.outBinds.IDCARG
      return ({ stat: 1, data: bind })
    } else {
      return ({ stat: 0, data: result })
    }    
  } catch (error) {
    throw new Error(error)
  } 
};