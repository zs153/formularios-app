// const
const desde = document.getElementById('desde')
const hasta = document.getElementById('hasta')
const cboC = document.getElementById('cbocar');

// func
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
const validate = () => {
  const desdeValue = desde.value
  const hastaValue = hasta.value
  const cbocarValue = cboC.value

  if (isNaN(Date.parse(desdeValue))) {
    setError(desde, 'Fecha requerida')
    setTimeout(function () {
      setSuccess(desde)
    }, 3000)
    return false
  }
  if (isNaN(Date.parse(hastaValue))) {
    setError(hasta, 'Fecha requerida')
    setTimeout(function () {
      setSuccess(hasta)
    }, 3000)
    return false
  }
  if (cbocarValue === '0') {
    setError(cboC, 'Carga requerida')
    setTimeout(function () {
      setSuccess(cboC)
    }, 3000)
    return false
  }

  return true
}

// eventos
cboC.addEventListener('change', (e) => {
  document.getElementById('cbocar').value = e.target.options[e.target.selectedIndex].value
})