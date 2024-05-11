import { BIND_OUT, NUMBER } from "oracledb";
import { simpleExecute } from "../services/database.js";

const insertSmsSql = "BEGIN FORMULARIOS_PKG.INSERTSMSFORMULARIO(:idform,:texsms,:movsms,:stasms,:usumov,:tipmov,:idsmss); END;"
const updateSmsSql = "BEGIN FORMULARIOS_PKG.UPDATESMS(:idsmss,:texsms,:movsms,:usumov,:tipmov); END;"
const removeSmsSql = "BEGIN FORMULARIOS_PKG.DELETESMSFORMULARIO(:idsmss,:usumov,:tipmov ); END;"

export const sms = async (context) => {
  // bind
  let query = "SELECT ss.* FROM smss ss"
  const bind = context

  if (context.IDFORM) {
    query += " INNER JOIN smssformulario sf ON sf.idsmss = ss.idsmss WHERE sf.idform = :idform"
  } else if (context.IDSMSS) {
    query += " WHERE ss.idsmss = :idsmss"
  }

  // proc
  const ret = await simpleExecute(query, bind)

  if (ret) {
    return ({ stat: ret.rows.length, data: ret.rows })
  } else {
    return ({ stat: 0, data: [] })
  }
}
export const smss = async (context) => {
  // bind
  let query = ""
  let bind = {
    idform: context.formulario,
    limit: context.limit,
    part: context.part,
  };

  if (context.direction === 'next') {
    bind.idsmss = context.cursor.next;
    query = "SELECT ss.*,sf.idform FROM smss ss INNER JOIN smssformulario sf ON sf.idsmss = ss.idsmss AND sf.idform = :idform WHERE ss.idsmss > :idsmss AND (ss.movsms LIKE '%' || :part OR ss.fecsms LIKE '%' || :part || '%' OR :part IS NULL) ORDER BY ss.idsmss ASC FETCH NEXT :limit ROWS ONLY"
  } else {
    bind.idsmss = context.cursor.prev;
    query = "SELECT ss.*,sf.idform FROM smss ss INNER JOIN smssformulario sf ON sf.idsmss = ss.idsmss AND sf.idform = :idform WHERE ss.idsmss < :idsmss AND (ss.movsms LIKE '%' || :part OR ss.fecsms LIKE '%' || :part || '%' OR :part IS NULL) ORDER BY ss.idsmss DESC FETCH NEXT :limit ROWS ONLY"
  }

  // proc
  const ret = await simpleExecute(query, bind)

  if (ret) {
    return ({ stat: ret.rows.length, data: ret.rows })
  } else {
    return ({ stat: 0, data: [] })
  }
};
export const insertSms = async (context) => {
  // bind
  let bind = context
  bind.idsmss = {
    dir: BIND_OUT,
    type: NUMBER,
  }


  // proc
  const ret = await simpleExecute(insertSmsSql, bind)

  if (ret) {
    bind.idsmss = ret.outBinds.idsmss
    return ({ stat: 1, data: bind })
  } else {
    return ({ stat: 0, data: [] })
  }
}
export const updateSms = async (context) => {
  // bind
  const bind = context
  // proc
  const ret = await simpleExecute(updateSmsSql, bind)

  if (ret) {
    return ({ stat: 1, data: bind })
  } else {
    return ({ stat: 0, data: [] })
  }
}
export const removeSms = async (context) => {
  // bind
  const bind = context
  // proc
  const ret = await simpleExecute(removeSmsSql, bind)

  if (ret) {
    return ({ stat: 1, data: bind })
  } else {
    return ({ stat: 0, data: [] })
  }
}