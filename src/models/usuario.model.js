import { BIND_OUT, NUMBER } from "oracledb";
import { simpleExecute } from "../services/database.js";

const insertSql = "BEGIN FORMULARIOS_PKG.INSERTUSUARIO(:nomusu,:ofiusu,:rolusu,:userid,:emausu,:perusu,:telusu,:stausu,:usumov,:tipmov,:idusua); END;";
const updateSql = "BEGIN FORMULARIOS_PKG.UPDATEUSUARIO(:idusua,:nomusu,:ofiusu,:rolusu,:emausu,:perusu,:telusu,:stausu,:usumov,:tipmov); END;";
const removeSql = "BEGIN FORMULARIOS_PKG.DELETEUSUARIO(:idusua,:usumov,:tipmov); END;";
const stateSql = "BEGIN FORMULARIOS_PKG.STATEUSUARIO(:idusua,:stausu,:usumov,:tipmov); END;";

export const find = async (context) => {
  // bind
  let query = "SELECT uu.*,oo.desofi FROM usuarios uu INNER JOIN oficinas oo ON oo.idofic = uu.ofiusu";
  const bind = context

  if (context.IDUSUA) {
    query += " WHERE uu.idusua = :idusua";
  } else if (context.USERID) {
    query += " WHERE uu.userid = :userid";
  } else if (context.EMAUSU) {
    query += " WHERE uu.emausu = :emausu";
  } else if (context.OFIUSU) {
    query += " WHERE uu.ofiusu = :ofiusu";
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
};
export const findAll = async (context) => {
  // bind
  let query = '';
  let bind = {
    limit: context.limit,
    part: context.part,
  };

  if (context.oficina) {
    bind.ofiusu = context.oficina
    query = "WITH datos AS (SELECT uu.idusua,uu.userid,uu.nomusu,uu.telusu,uu.stausu,oo.desofi FROM usuarios uu INNER JOIN oficinas oo ON oo.idofic = uu.ofiusu WHERE uu.ofiusu = :ofiusu AND (uu.nomusu LIKE '%' || :part || '%' OR oo.desofi LIKE '%' || :part || '%' OR uu.userid LIKE '%' || LOWER(:part) || '%' OR :part IS NULL))"
  } else {
    query = "WITH datos AS (SELECT uu.idusua,uu.userid,uu.nomusu,uu.telusu,uu.stausu,oo.desofi FROM usuarios uu INNER JOIN oficinas oo ON oo.idofic = uu.ofiusu WHERE uu.nomusu LIKE '%' || :part || '%' OR oo.desofi LIKE '%' || :part || '%' OR uu.userid LIKE '%' || LOWER(:part) || '%' OR :part IS NULL)"
  }

  if (context.direction === 'next') {
    bind.nomusu = context.cursor.next === '' ? null : context.cursor.next;
    query += "SELECT * FROM datos WHERE nomusu > :nomusu OR :nomusu IS NULL ORDER BY nomusu ASC FETCH NEXT :limit ROWS ONLY"
  } else {
    bind.nomusu = context.cursor.prev === '' ? null : context.cursor.prev;
    query += "SELECT * FROM datos WHERE nomusu < :nomusu OR :nomusu IS NULL ORDER BY nomusu DESC FETCH NEXT :limit ROWS ONLY"
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
  bind.IDUSUA = {
    dir: BIND_OUT,
    type: NUMBER,
  };

  // proc
  try {
    const result = await simpleExecute(insertSql, bind)
  
    if (result) {
      bind.IDUSUA = result.outBinds.IDUSUA
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
};
