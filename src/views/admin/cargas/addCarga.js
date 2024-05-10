const descar = document.getElementById("descar");
const ficcar = document.getElementById("ficcar");
const refcar = document.getElementById("refcar");

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
  const descarValue = descar.value.trim();
  const ficcarValue = ficcar.value.trim();
  const refcarValue = refcar.value.trim();

  if (descarValue === "") {
    setError(descar, "Descripción requerida");
    setTimeout(function () {
      setSuccess(descar);
    }, 3000);
    return false;
  }
  if (ficcarValue === "") {
    setError(ficcar, "Nombre de fichero requerido");
    setTimeout(function () {
      setSuccess(ficcar);
    }, 3000);
    return false;
  }
  if (refcarValue === "") {
    setError(refcar, "Referencia requerida");
    setTimeout(function () {
      setSuccess(refcar);
    }, 3000);
    return false;
  }

  return true
}
