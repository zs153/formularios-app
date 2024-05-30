export const tiposMovimiento = {
  crearFormulario: 0,
  modificarFormulario: 1,
  borrarFormulario: 2,
  crearUsuario: 3,
  modificarUsuario: 4,
  borrarUsuario: 5,
  crearOficina: 6,
  modificarOficina: 7,
  borrarOficina: 8,
  crearTipo: 9,
  modificarTipo: 10,
  borrarTipo: 11,
  crearReferencia: 12,
  modificarReferencia: 13,
  borrarReferencia: 14,
  asignarFormulario: 15,
  resolverFormulario: 16,
  remitirFormulario: 17,
  desasignarFormulario: 18,
  crearSms: 19,
  modificarSms: 20,
  borrarSms: 21,
  actualizarPerfil: 22,
  crearEjercicio: 26,
  crearRelacionado: 27,
  modificarRelacionado: 28,
  borrarRelacionado: 29,
  modificarPerfil: 36,
  crearCarga: 41,
  modificarCarga: 42,
  borrarCarga: 43,
  cambioPassword: 60,
  olvidoPassword: 61,
  restablecerPassword: 62,
  registroUsuario: 63,
  modificarHistorico: 64,
  borrarHistorico: 65,
  activarHistorico: 66,
  envioSmsDesdeCierre: 67,
};
export const tiposPerfil = {
  general: 1,
  informador: 3,
  liquidador: 8,
};
export const tiposRol = {
  usuario: 1,
  responsable: 2,
  admin: 3,
};
export const estadosUsuario = {
  reserva: 0,
  activo: 1,
};
export const estadosDocumento = {
  pendiente: 0,
  asignado: 1,
  resuelto: 3,
};
export const estadosCarga = {
  pendiente: 0,
  procesado: 1,
};
export const estadosSms = {
  pendiente: 0,
  enviado: 1,
};

/* arrays */
export const arrTiposRol = [
  { id: 1, des: "USUARIO" },
  { id: 2, des: "RESPONSABLE" },
  { id: 3, des: "ADMINISTRADOR" },
];
export const arrTiposPerfil = [
  { id: 1, des: "GENERAL" },
  { id: 3, des: "INFORMADOR" },
  { id: 8, des: "LIQUIDADOR" },
];
export const arrEstadosUsuario = [
  { id: 0, des: "RESERVA" },
  { id: 1, des: "ACTIVO" },
];
export const arrEstadosSms = [
  { id: 0, des: "PENDIENTE" },
  { id: 1, des: "ENVIADO" },
];
export const arrEstadosFormulario = [
  { ID: 0, DES: "PENDIENTE", LIT: "PEN" },
  { ID: 1, DES: "ASIGNADO", LIT: "ASI" },
  { ID: 3, DES: "RESUELTO", LIT: "RES" },
];
