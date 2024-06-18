// vars
const nifref = document.getElementById('nifref')
const tipref = document.getElementById('cbotip')
const desref = document.getElementById('desref')

// func
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
  const nifrefValue = nifref.value.trim().toUpperCase().slice(0, 9)
  const tiprefValue = tipref.value
  const desrefValue = desref.value.trim()

  if (nifrefValue === '') {
    setError(nifref, 'NIF requerido')
    setTimeout(function () {
      setSuccess(nifref)
    }, 3000)
    return false
  } else {
    const pattern = /^([X-Y][0-9]{7}[A-Z]{1})|([0-9]{8}[A-Z]{1})$/

    if (!pattern.test(nifrefValue)) {
      setError(nifref, 'Introduzca NIF/NIE válido')
      setTimeout(function () {
        setSuccess(nifref)
      }, 3000)
      return false
    }

    const strBase = "TRWAGMYFPDXBNJZSQVHLCKET";
    const primeraPosicion = nifrefValue.slice(0, 1);
    const letraNif = nifrefValue.slice(8);
    let nuevoNif = nifrefValue;

    if (isNaN(primeraPosicion)) {
      nuevoNif = nifrefValue.slice(1);
      if (primeraPosicion === 'X') {
        nuevoNif = '0' + nuevoNif;
      } else if (primeraPosicion === "Y") {
        nuevoNif = "1" + nuevoNif;
      } else if (primeraPosicion === "Z") {
        nuevoNif = "2" + nuevoNif;
      }
    }

    const dniNumero = nuevoNif.slice(0, 8);
    const pos = parseInt(dniNumero) % 23;
    const letra = strBase.slice(pos, pos + 1);
    const isValid = letraNif === letra

    if (isValid === false) {
      setError(nifref, 'Introduzca NIF/NIE válido')
      setTimeout(function () {
        setSuccess(nifref)
      }, 3000)
      return false
    }
  }
  if (tiprefValue === '0') {
    setError(cbotip, 'Tipo requerido')
    setTimeout(function () {
      setSuccess(cbotip)
    }, 3000)
    return false
  }
  if (desrefValue === '' || desrefValue.length > 11) {
    setError(desref, 'Referencia requerida (longitud máxima 11 caracteres)')
    setTimeout(function () {
      setSuccess(desref)
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
document.getElementById('upd').setAttribute('action', `/user/formularios/asignados/referencias/update?part=${getCookie('filtra')}`)
document.getElementById('volver').setAttribute('href', `/user/formularios/asignados/referencias/${formulario.IDFORM}?part=${getCookie('filtra')}`)
