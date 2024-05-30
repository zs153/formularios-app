const desde = document.getElementById('desde')
const hasta = document.getElementById('hasta')
const refcar = document.getElementById("refcar");
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
  const desdeValue = desde.value.trim()
  const hastaValue = hasta.value.trim()
  const refcarValue = refcar.value.trim()

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
  if (refcarValue === "") {
    setError(refcar, "Referencia requerida");
    setTimeout(function () {
      setSuccess(refcar);
    }, 3000);
    return false;
  }

  return true
}
