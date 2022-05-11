import axios from 'axios'
import { tiposMovimiento } from '../public/js/enumeraciones'

export const mainPage = async (req, res) => {
  const user = req.user
  let tipo = {
    idtipo: req.params.id,
  }

  try {
    const result = await axios.post('http://localhost:8000/api/subtipos/tipo', {
      tipo,
    })
    tipo.destip = req.params.des
    const datos = {
      subtipos: result.data,
      tipo,
    }

    res.render('admin/subtipos', { user, datos })
  } catch (error) {
    const msg = 'No se ha podido acceder a los datos de la aplicación.'

    res.render('admin/error400', {
      alerts: [{ msg }],
    })
  }
}
export const addPage = async (req, res) => {
  const user = req.user
  const tipo = {
    idtipo: req.params.id,
  }
  const documento = {
    idsubt: 0,
    dessub: '',
  }

  try {
    const datos = {
      tipo,
      documento,
    }

    res.render('admin/subtipos/add', { user, datos })
  } catch (error) {
    const msg = 'No se ha podido acceder a los datos de la aplicación.'

    res.render('admin/error400', {
      alerts: [{ msg }],
    })
  }
}
export const editPage = async (req, res) => {
  const user = req.user
  const subtipo = {
    idsubt: req.params.id,
  }

  try {
    const result = await axios.post('http://localhost:8000/api/subtipo', {
      subtipo,
    })
    const documento = {
      idsubt: result.data.IDSUBT,
      dessub: result.data.DESSUB,
      idtipo: result.data.IDTIPO,
    }
    const datos = {
      documento,
    }

    res.render('admin/subtipos/edit', { user, datos })
  } catch (error) {
    const msg = 'No se ha podido acceder a los datos de la aplicación.'

    res.render('admin/error400', {
      alerts: [{ msg }],
    })
  }
}
export const insertSubtipo = async (req, res) => {
  const user = req.user
  const tipo = {
    idtipo: req.body.idtipo,
  }
  const subtipo = {
    dessub: req.body.dessub,
    idtipo: req.body.idtipo,
  }
  const movimiento = {
    usumov: user.id,
    tipmov: tiposMovimiento.crearSubtipo,
  }

  try {
    await axios.post('http://localhost:8000/api/subtipos/insert', {
      tipo,
      subtipo,
      movimiento,
    })

    res.redirect(`/admin/subtipos/${tipo.idtipo}/`)
  } catch (error) {
    let msg = 'No se ha podido crear el subtipo.'

    if (error.response.data.errorNum === 20100) {
      msg = 'El subtipo ya existe.'
    }

    res.render('admin/error400', {
      alerts: [{ msg }],
    })
  }
}
export const updateSubtipo = async (req, res) => {
  const user = req.user
  const subtipo = {
    idsubt: req.body.idsubt,
    dessub: req.body.dessub,
    idtipo: req.body.idtipo,
  }
  const movimiento = {
    usumov: user.id,
    tipmov: tiposMovimiento.modificarSubtipo,
  }

  try {
    await axios.post('http://localhost:8000/api/subtipos/update', {
      subtipo,
      movimiento,
    })

    res.redirect('/admin/subtipos')
  } catch (error) {
    let msg =
      'No se han podido modificar los datos del subtipo. Verifique los datos introducidos'

    if (error.response.data.errorNum === 20100) {
      msg = 'El subtipo ya existe'
    }

    res.render('admin/error400', {
      alerts: [{ msg }],
    })
  }
}
export const deleteSubtipo = async (req, res) => {
  const user = req.user
  const subtipo = {
    idsubt: req.body.idsubt,
  }
  const movimiento = {
    usumov: user.id,
    tipmov: tiposMovimiento.borrarSubtipo,
  }

  try {
    await axios.post('http://localhost:8000/api/subtipos/delete', {
      subtipo,
      movimiento,
    })

    res.redirect('/admin/subtipos')
  } catch (error) {
    const msg = 'No se ha podido elminar el subtipo.'

    res.render('admin/error400', {
      alerts: [{ msg }],
    })
  }
}
