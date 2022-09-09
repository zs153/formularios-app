import axios from "axios";
import { tiposMovimiento, estadosCarga } from "../public/js/enumeraciones";

export const mainPage = async (req, res) => {
  const user = req.user;

  try {
    const result = await axios.post("http://localhost:8100/api/cargas");
    const datos = {
      cargas: JSON.stringify(result.data),
      estadosCarga,
    };

    res.render("admin/cargas", { user, datos });
  } catch (error) {
    const msg = "No se ha podido acceder a los datos de la aplicación.";

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
};
export const addPage = async (req, res) => {
  const user = req.user;

  try {
    res.render("admin/cargas/add", { user });
  } catch (error) {
    const msg = "No se ha podido acceder a los datos de la aplicación.";

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
};
export const editPage = async (req, res) => {
  const user = req.user;
  const carga = {
    idcarg: req.params.id,
  };

  try {
    const result = await axios.post("http://localhost:8100/api/carga", {
      carga,
    });
    const datos = {
      carga: result.data,
    };

    res.render("admin/cargas/edit", { user, datos });
  } catch (error) {
    const msg = "No se ha podido acceder a los datos de la aplicación.";

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
};

export const insert = async (req, res) => {
  const user = req.user;
  const carga = {
    descar: req.body.descar.toUpperCase(),
    ficcar: req.body.ficcar,
    refcar: req.body.refcar,
    stacar: estadosCarga.procesado,
  };
  const movimiento = {
    usumov: user.id,
    tipmov: tiposMovimiento.crearCarga,
  };

  try {
    await axios.post("http://localhost:8100/api/cargas/insert", {
      carga,
      movimiento,
    });

    res.redirect(`/admin/cargas`);
  } catch (error) {
    let msg = "No se ha podido crear la carga.";

    if (error.response.data.errorNum === 20100) {
      msg = "La carga ya existe.";
    }

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
};
export const update = async (req, res) => {
  const user = req.user;
  const carga = {
    idcarg: req.body.idcarg,
    descar: req.body.descar.toUpperCase(),
    stacar: req.body.stacar,
  };
  const movimiento = {
    usumov: user.id,
    tipmov: tiposMovimiento.modificarCarga,
  };

  try {
    axios.post("http://localhost:8100/api/cargas/update", {
      carga,
      movimiento,
    });

    res.redirect(`/admin/cargas`);
  } catch (error) {
    let msg =
      "No se ha podido actualizar la carga. Verifique los datos introducidos";

    if (error.response.data.errorNum === 20100) {
      msg = "La carga ya existe";
    }

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
};
export const remove = async (req, res) => {
  const user = req.user;
  const carga = {
    idcarg: req.body.idcarg,
  };
  const movimiento = {
    usumov: user.id,
    tipmov: tiposMovimiento.borrarCarga,
  };

  try {
    await axios.post("http://localhost:8100/api/cargas/delete", {
      carga,
      movimiento,
    });

    res.redirect(`/admin/cargas`);
  } catch (error) {
    const msg = "No se ha podido elminar la carga.";

    res.render("admin/error400", {
      alerts: [{ msg }],
    });
  }
};
