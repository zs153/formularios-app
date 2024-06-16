const hasNexts = datos.hasNexts
const hasPrevs = datos.hasPrevs
const usuarios = datos.usuarios
const estados = datos.estadosUsuario
const cursor = datos.cursor

// inicializa sort
document.querySelectorAll(".sortable th").forEach(headerCell => {
  headerCell.addEventListener("click", () => {
    const tableElement = headerCell.parentElement.parentElement.parentElement;
    const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
    const currentIsAscending = headerCell.classList.contains("th-sort-asc");

    sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
  });
});

// funcs
const sortTableByColumn = (table, column, asc = true) => {
  const dirModifier = asc ? 1 : -1;
  const tBody = table.tBodies[0];
  const rows = Array.from(tBody.querySelectorAll("tr"));

  const sortedRows = rows.sort((a, b) => {
    const aColText = a.cells[column].textContent;
    const bColText = b.cells[column].textContent;

    return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
  });

  for (let row of sortedRows) {
    tBody.appendChild(row);
  }

  table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
  table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-asc", asc);
  table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-desc", !asc);
}
const buildTable = (state) => {
  const table = document.getElementById('table-body')
  table.innerHTML = ''

  state.map(element => {
    const row = document.createElement('tr')
    // col1
    let cell = document.createElement('td')
    if (element.STAUSU === estados.activo) {
      cell.innerHTML = `<div class="align-items-center">
        <span class="avatar avatar-rounded bg-green-lt">
          <h6 class="m-0">${element.USERID.slice(0, 5)}</h6>
        </span>
      </div>`
    } else {
      cell.innerHTML = `<div class="align-items-center">
        <span class="avatar avatar-rounded bg-red-lt">
          <h6 class="m-0">${element.USERID.slice(0, 5)}</h6>
        </span>
      </div>`
    }
    row.appendChild(cell)

    // col2
    cell = document.createElement('td')
    cell.innerHTML = `<div class="d-flex align-items-center">
      <div class="flex-fill">
        <div class="font-weight-medium"><span class="text-overflow-dynamic-container"><span class="text-overflow-dynamic-ellipsis">${element.NOMUSU}</span></span></div>
      </div>
    </div>`
    row.appendChild(cell)

    // col3
    cell = document.createElement('td')
    cell.innerHTML = `<div class="d-flex align-items-center">
      <div class="flex-fill">
        <div class="font-weight-medium"><span class="text-overflow-dynamic-container"><span class="text-overflow-dynamic-ellipsis">${element.DESOFI}</span></span></div>
      </div>
    </div>`
    row.appendChild(cell)

    // col4
    cell = document.createElement('td')
    cell.innerHTML = `<ul class="dots-menu">
      <li class="nav-item drop-right">
        <a href="#" class="nav-link p-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-inline me-2" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke-width="1" fill="none" d="M12 18.7q-.4 0-.688-.287-.287-.288-.287-.688 0-.4.287-.687.288-.288.688-.288.4 0 .688.288.287.287.287.687 0 .4-.287.688-.288.287-.688.287Zm0-5.725q-.4 0-.688-.287-.287-.288-.287-.688 0-.4.287-.688.288-.287.688-.287.4 0 .688.287.287.288.287.688 0 .4-.287.688-.288.287-.688.287Zm0-5.725q-.4 0-.688-.287-.287-.288-.287-.688 0-.4.287-.687Q11.6 5.3 12 5.3q.4 0 .688.288.287.287.287.687 0 .4-.287.688-.288.287-.688.287Z"/>
          </svg>
        </a>
        <ul>
          <li class="nav-item">
          </li>
          <li class="nav-item">
            <a href="/admin/formularios/asignados/ades/desasignar/${element.IDUSUA}" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-inline me-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" /><path d="M12 6l-2 4l4 3l-2 4v3" /></svg>
              Desasignar
            </a>
          </li>
          <li class="nav-item">
          </li>
        </ul>
      </li>
    </ul>`
    
    row.appendChild(cell)
    table.appendChild(row)
  })

  createPages()
}
const createPages = () => {
  const part = elemBuscar.value

  let elemUl = document.createElement('ul')
  let elemLi
  let elemA

  elemLi = document.createElement('li')
  elemLi.classList.add('page-item', 'previous', 'no')
  elemA = document.createElement('a')
  elemA.classList.add('nav-link')
  elemA.href = "/admin/formularios/asignados/ades?cursor=" + JSON.stringify(cursor) + "&part=" + part + "&dir=prev"
  elemA.innerHTML = "&#9664 Anterior"

  elemLi.appendChild(elemA)

  if (!hasPrevs) {
    elemA.classList.add('disabled')
  }
  elemUl.appendChild(elemLi)

  elemLi = document.createElement('li')
  elemLi.classList.add('page-item', 'next', 'no')
  elemA = document.createElement('a')
  elemA.classList.add('nav-link')
  elemA.href = "/admin/formularios/asignados/ades?cursor=" + JSON.stringify(cursor) + "&part=" + part + "&dir=next"
  elemA.innerHTML = "Siguiente &#9654"

  elemLi.appendChild(elemA)
  
  if (!hasNexts) {
    elemA.classList.add('nav-link', 'disabled')
  }
  elemUl.appendChild(elemLi)

  document.getElementById('pagination-wrapper').appendChild(elemUl)
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

// events
const elemBuscar = document.getElementById('buscarUserBox');
elemBuscar.onchange = (event) => {
  setCookie('filtrb', event.target.value, .5) // medio dia
}
elemBuscar.value = getCookie('filtrb')

// inicializacion
document.getElementById('volver').setAttribute('href', `/admin/formularios/asignados?part=${getCookie('filtro')}`)

// crear tabla
buildTable(usuarios)