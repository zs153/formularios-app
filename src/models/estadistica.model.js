import { simpleExecute } from '../services/database.js'

const usuariosSql = "SELECT p1.*,s1.* FROM (SELECT uu.userid,SUM(CASE WHEN ff.stafor = 1 THEN 1 ELSE 0 END) ADJ,SUM(CASE WHEN ff.stafor = 3 THEN 1 ELSE 0 END) RES FROM usuarios uu LEFT JOIN formularios ff ON ff.liqfor = uu.userid AND ff.reffor = :reffor GROUP BY uu.userid) p1,(SELECT COUNT(*) TOT FROM formularios WHERE reffor = :reffor) s1"
const oficinasSql = "SELECT oo.desofi,SUM(p1.pen) PEN,SUM(p1.adj) ADJ,SUM(p1.res) RES,SUM(p1.pen + p1.adj + p1.res) TOT FROM oficinas oo LEFT JOIN (SELECT ff.ofifor,SUM(CASE WHEN ff.stafor = 0 THEN 1 ELSE 0 END) PEN,SUM(CASE WHEN ff.stafor = 1 THEN 1 ELSE 0 END) ADJ,SUM(CASE WHEN ff.stafor = 3 THEN 1 ELSE 0 END) RES FROM formularios ff WHERE ff.reffor = :reffor GROUP BY ff.ofifor) p1 ON p1.ofifor = oo.idofic GROUP BY CUBE(desofi) ORDER BY desofi"
const actuacionSql = "WITH vDates AS (SELECT TO_DATE(:desde,'YYYY-MM-DD') + ROWNUM - 1 AS fecha FROM dual CONNECT BY rownum <= TO_DATE(:hasta,'YYYY-MM-DD') - TO_DATE(:desde,'YYYY-MM-DD') + 1)SELECT v.fecha,count(cc.idform) RES FROM vDates v LEFT JOIN cierres cc ON TRUNC(cc.feccie) = v.fecha LEFT JOIN formularios ff ON ff.idform= cc.idform AND ff.reffor = :reffor GROUP BY v.fecha"

export const usuarios = async (context) => {
  // bind
  const query = usuariosSql
  const bind = context

  // proc
  try {
    const result = await simpleExecute(query, bind)

    if (result.rows.length) {
      return ({ stat: 1, data: result.rows })
    } else {
      return ({ stat: 0, data: 'No hay resultado para la consulta solicitada' })
    }
  } catch (error) {
    throw new Error(error)
  }
}
export const oficinas = async (context) => {
  // bind
  const query = oficinasSql
  const bind = context

  // proc
  try {
    const result = await simpleExecute(query, bind)

    if (result.rows.length) {
      return ({ stat: 1, data: result.rows })
    } else {
      return ({ stat: 0, data: 'No hay resultado para la consulta solicitada' })
    }
  } catch (error) {
    throw new Error(error)
  }
}
export const actuacion = async (context) => {
  // bind
  const query = actuacionSql
  const bind = context

  console.log(query,bind);
  // proc
  try {
    const result = await simpleExecute(query, bind)

    if (result.rows.length) {
      return ({ stat: 1, data: result.rows })
    } else {
      return ({ stat: 0, data: 'No hay resultado para la consulta solicitada' })
    }
  } catch (error) {
    throw new Error(error)
  }
}
