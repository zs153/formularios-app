const hasNexts = datos.hasNexts
const hasPrevs = datos.hasPrevs
const historicos = datos.historicos
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
    cell.innerHTML = `<div class="align-items-center">
      <span class="avatar avatar-rounded bg-green-lt">
        <h6 class="m-0">${element.USERID.slice(0, 5)}</h6>
      </span>
    </div>`
    row.appendChild(cell)

    // col2
    cell = document.createElement('td')
    cell.innerHTML = `<div class="d-flex align-items-center">
        <div class="flex-fill">
          <div class="font-weight-medium">${element.NOMUSU}</div>
        </div>
      </div>
      <div class="text-muted">
        <small class="text-reset">Teléfono: ${element.TELUSU}</small>
    </div>`
    row.appendChild(cell)

    // col3
    cell = document.createElement('td')
    cell.innerHTML = `<ul class="dots-menu">
      <li class="nav-item drop-right">
        <a href="#" class="nav-link p-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-inline me-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /></svg>
        </a>
        <ul>
          <li class="nav-item">
            <a href="/admin/historicos/edit/${element.IDUSUA}?part=${getCookie('filtro')}" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-inline me-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>
              Editar
            </a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link" onclick="{document.getElementById('idusua').value ='${element.IDUSUA}', document.getElementById('msgact').innerHTML ='<p>${element.NOMUSU}</p>'}" data-bs-toggle="modal" data-bs-target="#modal-activar">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-inline me-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /><path d="M6 21v-2a4 4 0 0 1 4 -4h4" /><path d="M19 22v-6" /><path d="M22 19l-3 -3l-3 3" /></svg>
              Activar
            </a>
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
  elemA.href = "/admin/historicos?cursor=" + JSON.stringify(cursor) + "&part=" + part + "&dir=prev"
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
  elemA.href = "/admin/historicos?cursor=" + JSON.stringify(cursor) + "&part=" + part + "&dir=next"
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
const deleteCookie = () => {
  document.cookie = 'filtro=; expires=Thu, 01 Jan 1970 00:00:01 GMT; Path=/;'
}

// events
const elemBuscar = document.getElementById('buscarHistBox');
elemBuscar.onchange = (event) => {
  setCookie('filtro', event.target.value, .5) // medio dia
}
elemBuscar.value = getCookie('filtro')

// inicializacion
document.getElementById('activ').setAttribute('action', `/admin/historicos/activar?part=${getCookie('filtro')}`)

// crear tabla
buildTable(historicos)