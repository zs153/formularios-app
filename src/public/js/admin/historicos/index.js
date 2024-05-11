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
const buildTable = (state,cursor) => {
  const table = document.getElementById('table-body')
  const myList = state
  table.innerHTML = ''

  myList.map(element => {
    const row = document.createElement('tr')
    // col1
    let cell = document.createElement('td')
    cell.classList.add("w-4")
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
    cell.classList.add("w-5")
    cell.innerHTML = `<ul class="dots-menu">
      <li class="nav-item drop-right p-0">
        <a href="#" class="nav-link">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-inline me-2" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke-width="1" fill="none" d="M12 18.7q-.4 0-.688-.287-.287-.288-.287-.688 0-.4.287-.687.288-.288.688-.288.4 0 .688.288.287.287.287.687 0 .4-.287.688-.288.287-.688.287Zm0-5.725q-.4 0-.688-.287-.287-.288-.287-.688 0-.4.287-.688.288-.287.688-.287.4 0 .688.287.287.288.287.688 0 .4-.287.688-.288.287-.688.287Zm0-5.725q-.4 0-.688-.287-.287-.288-.287-.688 0-.4.287-.687Q11.6 5.3 12 5.3q.4 0 .688.288.287.287.287.687 0 .4-.287.688-.288.287-.688.287Z"/>
          </svg>
        </a>
        <ul>
          <li class="nav-item">
            <a href="/admin/historicos/edit/${element.IDUSUA}?part=${getCookie('filtro')}" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-inline me-2" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke-width=".4" fill="none" d="M6.85 20.575q-.6 0-1.012-.412-.413-.413-.413-1.013V4.85q0-.6.413-1.013.412-.412 1.012-.412h7.825L18.6 7.35v3.4h-.65V7.675h-3.6V4.05h-7.5q-.3 0-.55.25-.25.25-.25.55v14.275q0 .3.25.55.25.25.55.25h4.25v.65Zm-.8-.65V4.05 19.925ZM17.025 14.6l.45.425-3.75 3.75v1.1h1.1l3.775-3.75.45.45-3.95 3.95h-2v-2Zm2.025 1.975L17.025 14.6l1.05-1.05q.225-.2.525-.2.3 0 .475.2l1 1q.2.2.2.487 0 .288-.2.538Z"/></svg>
              </svg>
              Editar
            </a>
          </li>
          <li class="nav-item">
          <a href="#" class="nav-link" onclick="{document.getElementById('idusua').value ='${element.IDUSUA}', document.getElementById('msgact').innerHTML ='<p>${element.NOMUSU}</p>'}" data-bs-toggle="modal" data-bs-target="#modal-activar">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon me-2" height="24" width="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke-width="1" fill="none" d="M4.85 18.575q-.6 0-1.012-.412-.413-.413-.413-1.013v-2.175h.625v2.175q0 .3.25.55.25.25.55.25h2.175v.625Zm4.8-3.375 1.075-5.45-3.375 1.425v3.15h-.625V10.75L10.7 9.1q.55-.2.825-.288.275-.087.475-.087.35 0 .638.175.287.175.487.5l.675 1.075q-.025.025-.025.013 0-.013.025-.013-1.025.85-1.625 2.062-.6 1.213-.6 2.663Zm3.85-8.075q-.675 0-1.125-.45-.45-.45-.45-1.125 0-.65.45-1.113.45-.462 1.125-.462.65 0 1.113.462.462.463.462 1.113 0 .675-.462 1.125-.463.45-1.113.45Zm-10.075-2.1V2.85q0-.6.413-1.025Q4.25 1.4 4.85 1.4h2.175v.65H4.85q-.3 0-.55.25-.25.25-.25.55v2.175Zm16.525 0V2.85q0-.3-.25-.55-.25-.25-.55-.25h-2.175V1.4h2.175q.6 0 1.025.425.425.425.425 1.025v2.175Zm-2.25 13.75q-1.525 0-2.575-1.05-1.05-1.05-1.05-2.575 0-1.5 1.05-2.55 1.05-1.05 2.575-1.05 1.5 0 2.55 1.05 1.05 1.05 1.05 2.55 0 1.525-1.05 2.575-1.05 1.05-2.55 1.05Zm-.35-3.15h.675V13h-.675Zm.35 1.775q.2 0 .325-.125t.125-.325q0-.2-.125-.325T17.7 16.5q-.2 0-.325.125t-.125.325q0 .2.125.325t.325.125Z"/></svg>
            Activar
          </a>
          </li>
        </ul>
      </li>
    </ul>`
    row.appendChild(cell)

    table.appendChild(row)
  })

  createPages(cursor)
}
const createPages = (cursor) => {
  let str = "<ul>";

  if (hasPrevs) {
    str += "<li class='page-item previous no'><a href='/admin/historicos?cursor=" + JSON.stringify(cursor) + "&part=" + document.getElementById('buscarHistBox').value + "&dir=prev' class='nav-link'>&#9664 Anterior</a>";
  } else {
    str += "<li><a href='#' class='nav-link disabled'>&#9664 Anterior</a>";
  }

  if (hasNexts) {
    str += "<li class='page-item next no'><a href='/admin/historicos?cursor=" + JSON.stringify(cursor) + "&part=" + document.getElementById('buscarHistBox').value + "&dir=next' class='nav-link'>Siguiente &#9654</a>";
  } else {
    str += "<li><a href='#' class='nav-link disabled'>Siguiente &#9654</a>";
  }
  str += "</ul>";

  document.getElementById('pagination-wrapper').innerHTML = str;
}

// events
const elemBuscar = document.getElementById('buscarHistBox');
elemBuscar.onchange = (event) => {
  setCookie('filtro', event.target.value, .5) // medio dia
}
elemBuscar.value = getCookie('filtro')

// inicializacion
const elemActivar = document.getElementById('activ')
elemActivar.setAttribute('action', `/admin/historicos/activar?part=${getCookie('filtro')}`)
