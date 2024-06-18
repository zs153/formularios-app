const destip = document.getElementById('destip')
const ayutip = document.getElementById('ayutip')

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
  const destipValue = destip.value.trim()
  const ayutipValue = ayutip.value.trim()

  if (destipValue === '') {
    setError(destip, 'Descripción requerida')
    setTimeout(function () {
      setSuccess(destip)
    }, 3000)
    return false
  }
  if (ayutipValue === '') {
    setError(ayutip, 'Ayuda requerida')
    setTimeout(function () {
      setSuccess(ayutip)
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
document.getElementById('upd').setAttribute('action', `/admin/tipos/update?part=${getCookie('filtro')}`)
document.getElementById('volver').setAttribute('href', `/admin/tipos?part=${getCookie('filtro')}`)