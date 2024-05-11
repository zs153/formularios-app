const emausu = document.getElementById('emausu')
const telusu = document.getElementById('telusu')
const cborol = document.getElementById('cborol')
const cboper = document.getElementById('cboper')
const cboofi = document.getElementById('cboofi')

// proc
const validate = () => {
  const emausuValue = emausu.value.trim()
  const telusuValue = telusu.value.trim()
  const cborolValue = cborol.value
  const cboperValue = cboper.value
  const cboofiValue = cboofi.value


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
const deleteCookie = () => {
  document.cookie = 'filtro=; expires=Thu, 01 Jan 1970 00:00:01 GMT; Path=/;'
}
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