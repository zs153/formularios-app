import { simpleExecute } from "../services/database.js";

const baseSql = "SELECT hh.* FROM historicos hh";
const updateSql = "BEGIN OPORRAK_PKG.UPDATEHISTORICO(:idusua,:nomusu,:ofiusu,:rolusu,:userid,:emausu,:perusu,:telusu,:usumov,:tipmov); END;";
const activarSql = "BEGIN OPORRAK_PKG.ACTIVARHISTORICO(:idusua,:usumov,:tipmov); END;";

export const find = async (context) => {
  // bind
  let query = baseSql;
  const bind = context

  if (context.IDUSUA) {
    query += " WHERE hh.idusua = :idusua";
  } else if (context.USERID) {
    query += " WHERE hh.userid = :userid";
  } 

  // proc
  try {
    const ret = await simpleExecute(query, bind)
    
    if (ret.rows.length) {
      return ({ stat: 1, data: ret.rows[0] })
    } else {
      return ({ stat: 0, data: 'Histórico no encontrado' })
    }    
  } catch (error) {
    throw new Error(error)
  }
};
export const findAll = async (context) => {
  // bind
  let query = "WITH datos AS (SELECT hh.idusua,hh.userid,hh.nomusu,hh.telusu FROM historicos hh WHERE hh.nomusu LIKE '%' || :part || '%' OR :part IS NULL)";
  let bind = {
    limit: context.limit,
    part: context.part,
  };

  if (context.direction === 'next') {
    bind.nomusu = context.cursor.next === '' ? null : context.cursor.next;
    query += "SELECT * FROM datos WHERE nomusu > :nomusu OR :nomusu IS NULL ORDER BY nomusu ASC FETCH NEXT :limit ROWS ONLY"
  } else {
    bind.nomusu = context.cursor.prev === '' ? null : context.cursor.prev;
    query += "SELECT * FROM datos WHERE nomusu < :nomusu OR :nomusu IS NULL ORDER BY nomusu DESC FETCH NEXT :limit ROWS ONLY"
  }

  // proc
  try {
    const ret = await simpleExecute(query, bind)
  
    if (ret) {
      return ({ stat: ret.rows.length, data: ret.rows })
    } else {
      return ({ stat: 0, data: [] })
    }    
  } catch (error) {
    throw new Error(error)
  }
};
export const update = async (context) => {
  // bind
  let bind = context

  // proc
  try {
    const ret = await simpleExecute(updateSql, bind)
  
    if (ret) {
      return ({ stat: 1, data: bind })
    } else {
      return ({ stat: 0, data: ret })
    }    
  } catch (error) {
    throw new Error(error)
  }
};
export const activar = async (context) => {
  // bind
  const bind = context
  
  // proc
  try {
    const ret = await simpleExecute(activarSql, bind)
  
    if (ret) {
      return ({ stat: 1, data: bind })
    } else {
      return ({ stat: 0, data: ret })
    }    
  } catch (error) {
    throw new Error(error)
  }
}