import axios from "axios";
import { serverAPI } from "../../config/settings";
import { tiposMovimiento, estadosCarga } from "../../public/js/enumeraciones";

// pages
export const mainPage = async (req, res) => {
  const user = req.user
  const dir = req.query.dir ? req.query.dir : 'next'
  const limit = req.query.limit ? req.query.limit : 10
  const part = req.query.part ? req.query.part.toUpperCase() : ''

  let cursor = req.query.cursor ? req.query.cursor : objectToBase64(JSON.stringify({next: 0, prev: 0}))
  let hasPrevs = false

  const context = {
    limit: limit +1,
    direction: dir,
    cursor: JSON.parse(base64ToObject(cursor)),
    part,
  }

  try {
    await axios.post(`http://${serverAPI}/api/cargas`, {
      context,
    }).then(result => {
      let cargas = result.data.data
      let hasNexts = cargas.length === limit + 1
      let nextCursor = 0
      let prevCursor = 0
  
      if (hasNexts) {
        nextCursor = dir === 'next' ? cargas[limit - 1].IDCARG : cargas[0].IDCARG
        prevCursor = dir === 'next' ? cargas[0].IDCARG : cargas[limit - 1].IDCARG

        if (context.cursor.prev !== 0 || context.cursor.next !== 0) {
          hasPrevs = true
        }

        // borrar ultimo elemento
        cargas.pop()
      } else {
        nextCursor = dir === 'next' ? 0 : cargas[0]?.IDCARG
        prevCursor = dir === 'next' ? cargas[0]?.IDCARG : 0
  
        if (context.cursor.prev !== 0) {
          hasPrevs = prevCursor === 0 ? false : true
          hasNexts = nextCursor === 0 ? false : true  
        }
      }
  
      if (dir === 'prev') {
        cargas = cargas.reverse()
      }
  
      cursor = {
        next: nextCursor,
        prev: prevCursor,
      }
      const datos = {
        cargas,
        hasNexts,
        hasPrevs,
        cursor: objectToBase64(JSON.stringify(cursor)),
      }
  
      res.render('admin/cargas', { user, datos })
    });

  } catch (error) {
    res.render("admin/error500", {
      alerts: [{ msg: error }],
    });
  }
};
export const addPage = async (req, res) => {
  const user = req.user;

  res.render("admin/cargas/add", { user });
};

// proc
export const insert = async (req, res) => {
  const user = req.user;
  const carga = {
    DESCAR: req.body.descar.toUpperCase(),
    FICCAR: req.body.ficcar,
    REFCAR: req.body.refcar.toUpperCase(),
    STACAR: estadosCarga.procesado,
  };
  const movimiento = {
    USUMOV: user.id,
    TIPMOV: tiposMovimiento.crearCarga,
  };

  try {
    await axios.post(`http://${serverAPI}/api/cargas/insert`, {
      carga,
      movimiento,
    }).then(result => {
      if (result.data.stat) {
        res.redirect(`/admin/cargas`);
      } else {
        res.render("admin/error400", {
          alerts: [{ msg: result.data.data }],
        });
      }
    });
  } catch (error) {
    res.render("admin/error500", {
      alerts: [{ msg: error }],
    });
  }
};

// helpers
const objectToBase64 = (node) => {
  return new Buffer.from(node, 'binary').toString('base64')
}
const base64ToObject = (cursor) => {
  return new Buffer.from(cursor, 'base64').toString('binary')
}