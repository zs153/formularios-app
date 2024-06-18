const userid = document.getElementById('userid')
const nomusu = document.getElementById('nomusu')
const emausu = document.getElementById('emausu')
const telusu = document.getElementById('telusu')
const cborol = document.getElementById('cborol')
const cboper = document.getElementById('cboper')
const cboofi = document.getElementById('cboofi')
const cboest = document.getElementById('cboest')

// proc
const setSuccess = (element) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector('.invalid-feedback');
  errorDisplay.innerText = '';
  inputControl.classList.add('is-valid');
  element.classList.remove('is-invalid');
}
const setError = (element, message) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector('.invalid-feedback');
  errorDisplay.innerText = message;
  element.classList.add('is-invalid');
  inputControl.classList.remove('is-valid');
}
const validate = () => {
  const useridValue = userid.value.trim()
  const nomusuValue = nomusu.value.trim()
  const emausuValue = emausu.value.trim()
  const telusuValue = telusu.value.trim()
  const cborolValue = cborol.value
  const cboperValue = cboper.value
  const cboofiValue = cboofi.value
  const cboestValue = cboest.value


  if (useridValue === '') {
    setError(userid, 'UserID requerido')
    setTimeout(function () {
      setSuccess(userid)
    }, 3000)
    return false
  }
  if (nomusuValue === '') {
    setError(nomusu, 'Nombre requerido')
    setTimeout(function () {
      setSuccess(nomusu)
    }, 3000)
    return false
  }
  if (cboestValue === '-1') {
    setError(cboest, 'Estado requerido')
    setTimeout(function () {
      setSuccess(cboest)
    }, 3000)
    return false
  }
  if (emausuValue === '') {
    setError(emausu, 'Email requerido')
    setTimeout(function () {
      setSuccess(emausu)
    }, 3000)
    return false
  }
  if (telusuValue === '') {
    setError(telusu, 'Teléfono requerido')
    setTimeout(function () {
      setSuccess(telusu)
    }, 3000)
    return false
  }
  if (cboofiValue === '0') {
    setError(cboofi, 'Oficina requerida')
    setTimeout(function () {
      setSuccess(cboofi)
    }, 3000)
    return false
  }
  if (cborolValue === '0') {
    setError(cborol, 'Rol requerido')
    setTimeout(function () {
      setSuccess(cborol)
    }, 3000)
    return false
  }
  if (cboperValue === '0') {
    setError(cboper, 'Perfil requerido')
    setTimeout(function () {
      setSuccess(cboper)
    }, 3000)
    return false
  }

  return true
}

// helpers
const getCookie = (key) => {
  let value = ''
  document.cookie.split(';').forEach((e) => {
    if (e.includes(key)) {
      value = e.split('=')[1]
    }
  })
  return value
}
const setCookie = (name, value, days) => {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
const deleteCookie = (key) => {
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; Path=/;`
}

// incialializar
document.getElementById('upd').setAttribute('action', `/admin/usuarios/update?part=${getCookie('filtro')}`)
document.getElementById('volver').setAttribute('href', `/admin/usuarios?part=${getCookie('filtro')}`)