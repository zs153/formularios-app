const emausu = document.getElementById('emausu')
const telusu = document.getElementById('telusu')

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
  // document.cookie = name + "=" + (encodeURIComponent(value) || "")  + expires + "; path=/";
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
  const emausuValue = emausu.value.trim()
  const telusuValue = telusu.value.trim()
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
  return true
}