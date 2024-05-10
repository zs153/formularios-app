// vars
const texsms = document.getElementById('texsms')
const movsms = document.getElementById('movsms')

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
  const texsmsValue = texsms.value.trim()
  const movsmsValue = movsms.value.trim()

  if (texsmsValue === '') {
    setError(texsms, 'Texto requerido')
    setTimeout(function () {
      setSuccess(texsms)
    }, 3000)
    return false
  }
  if (movsmsValue === '') {
    setError(movsms, 'Móvil requerido')
    setTimeout(function () {
      setSuccess(movsms)
    }, 3000)
    return false
  }

  return true
}
