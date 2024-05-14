import axios from "axios";
import { serverAPI,puertoAPI } from '../../config/settings'

// pages
export const mainPage = async (req, res) => {
  const user = req.user;

  const dir = req.query.dir ? req.query.dir : 'next'
  const limit = req.query.limit ? req.query.limit : 9
  const part = req.query.part ? req.query.part.toUpperCase() : ''

  let cursor = req.query.cursor ? JSON.parse(req.query.cursor) : null
  let hasPrevs = cursor ? true : false

  try {
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/formularios/referencias`, {
      context: {
        formulario: req.params.id,
        limit: limit + 1,
        direction: dir,
        cursor: cursor ? JSON.parse(convertCursorToNode(JSON.stringify(cursor))) : {next: 0 , prev: 0},
        part,
      },
    })

    let referencias = result.data.data
    let hasNexts = referencias.length === limit + 1
    let nextCursor = 0
    let prevCursor = 0

    if (hasNexts) {
      nextCursor = dir === 'next' ? referencias[limit - 1].IDREFE : referencias[0].IDREFE
      prevCursor = dir === 'next' ? referencias[0].IDREFE : referencias[limit - 1].IDREFE

      referencias.pop()
    } else {
      nextCursor = dir === 'next' ? 0 : referencias[0]?.IDREFE
      prevCursor = dir === 'next' ? referencias[0]?.IDREFE : 0

      if (cursor) {
        hasNexts = nextCursor === 0 ? false : true
        hasPrevs = prevCursor === 0 ? false : true
      } else {
        hasNexts = false
        hasPrevs = false
      }
    }

    if (dir === 'prev') {
      referencias = referencias.reverse()
    }

    cursor = {
      next: nextCursor,
      prev: prevCursor,
    }

    const formulario = {
      IDFORM: req.params.id,
    };
    const datos = {
      formulario,
      referencias,
      hasNexts,
      hasPrevs,
      cursor: convertNodeToCursor(JSON.stringify(cursor)),
    }

    res.render("admin/formularios/referencias", { user, datos });
  } catch (error) {
    if (error.response?.status === 400) {
      res.render("admin/error400", {
        alerts: [{ msg: error.response.data.data }],
      });
    } else {
      res.render("admin/error500", {
        alerts: [{ msg: error }],
      });
    }
  }
}
export const readonlyPage = async (req, res) => {
  const user = req.user;
  const formulario = {
    IDFORM: req.params.id,
  };

  try {
    const result = await axios.post(`http://${serverAPI}:${puertoAPI}/api/formularios/referencia`, {
      context: {
        IDFORM: req.params.id,
      },
    })

    const datos = {
      formulario,
      referencias: result.data.data,
    }

    res.render("admin/formularios/referencias/readonly", { user, datos });
  } catch (error) {
    if (error.response?.status === 400) {
      res.render("admin/error400", {
        alerts: [{ msg: error.response.data.data }],
      });
    } else {
      res.render("admin/error500", {
        alerts: [{ msg: error }],
      });
    }
  }
}

// proc