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
const buildTable = (state, cursor) => {
  const table = document.getElementById('table-body')
  const myList = state
  table.innerHTML = ''

  myList.map(element => {
    const row = document.createElement('tr')

    // col1
    let cell = document.createElement('td')
    // cell.classList.add("w-4")
    cell.innerHTML = `<div class="align-items-center ">
      <span class="avatar avatar-rounded bg-red-lt">
        <h6 class="m-0">${element.LIQFOR}</h6>
      </span>
    </div>`
    row.appendChild(cell)

    // col2
    cell = document.createElement('td')
    // cell.classList.add("w-7")
    cell.innerHTML = `<div class="d-flex align-items-center">
      <div class="flex-fill">
        <div class="font-weight-medium">${element.DESOFI}</div>
      </div>
    </div>`
    row.appendChild(cell)

    // col3
    cell = document.createElement('td')
    // cell.classList.add("w-5")
    cell.innerHTML = `<div class="d-flex align-items-center">
      <div class="flex-fill">
        <div class="font-weight-medium">${element.EJEFOR}</div>
      </div>
    </div>`
    row.appendChild(cell)

    // col4
    cell = document.createElement('td')
    // cell.classList.add("w-7")
    cell.innerHTML = `<div class="d-flex align-items-center">
      <div class="flex-fill">
        <div class="font-weight-medium">${element.REFFOR}</div>
      </div>
    </div>`
    row.appendChild(cell)
    
    // col5
    cell = document.createElement('td')
    // cell.classList.add("w-7")
    cell.innerHTML = `<div class="d-flex align-items-center">
      <div class="flex-fill">
        <div class="font-weight-medium">${element.NIFCON}</div>
      </div>
    </div>`
    row.appendChild(cell)

    // col6
    cell = document.createElement('td')
    // cell.classList.add("w-25")
    cell.innerHTML = `<div class="d-flex align-items-center">
      <div class="flex-fill">
        <div class="font-weight-medium"><span class="text-overflow-dynamic-container"><span class="text-overflow-dynamic-ellipsis">${element.NOMCON}</span></span></div>
      </div>
    </div>`
    row.appendChild(cell)

    // col7
    cell = document.createElement('td')
    // cell.classList.add("w-15")
    cell.innerHTML = `<div class="d-flex align-items-center">
      <div class="flex-fill">
        <div class="font-weight-medium"><span class="text-overflow-dynamic-container"><span class="text-overflow-dynamic-ellipsis">${element.DESTIP}</span></span></div>
      </div>
    </div>`
    row.appendChild(cell)

    // col8
    cell = document.createElement('td')
    // cell.classList.add("w-25")
    if (element.OBSFOR !== null) {
      cell.innerHTML = `<div class="d-flex align-items-center">
        <div class="flex-fill">
          <div class="font-weight-medium"><span class="text-overflow-dynamic-container"><span class="text-overflow-dynamic-ellipsis">${element.OBSFOR}</span></span></div>
        </div>
      </div>`
    }
    row.appendChild(cell)

    // col9
    cell = document.createElement('td')
    // cell.classList.add("w-5")
    cell.innerHTML = `<ul class="dots-menu">
      <li class="nav-item drop-right">
        <a href="#" class="nav-link p-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke-width="1" fill="none" d="M12 18.7q-.4 0-.688-.287-.287-.288-.287-.688 0-.4.287-.687.288-.288.688-.288.4 0 .688.288.287.287.287.687 0 .4-.287.688-.288.287-.688.287Zm0-5.725q-.4 0-.688-.287-.287-.288-.287-.688 0-.4.287-.688.288-.287.688-.287.4 0 .688.287.287.288.287.688 0 .4-.287.688-.288.287-.688.287Zm0-5.725q-.4 0-.688-.287-.287-.288-.287-.688 0-.4.287-.687Q11.6 5.3 12 5.3q.4 0 .688.288.287.287.287.687 0 .4-.287.688-.288.287-.688.287Z"/>
          </svg>
        </a>
        <ul>
          <li class="nav-item"></li>
          <li class="nav-item">
            <a href="#" class="nav-link" onclick="{document.getElementById('idasig').value ='${element.IDFORM}', document.getElementById('msgasi').innerHTML ='<p>Ejercicio ${element.EJEFOR}</p><p>${element.NIFCON} ${element.NOMCON}</p>'}" data-bs-toggle="modal" data-bs-target="#modal-asignar">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke-width=".4" fill="none" d="m12 19.1-.5-.45q-2.4-2.2-3.975-3.763-1.575-1.562-2.488-2.737-.912-1.175-1.262-2.113-.35-.937-.35-1.887 0-1.725 1.188-2.913Q5.8 4.05 7.55 4.05q1.3 0 2.438.712Q11.125 5.475 12 6.85q.9-1.375 2.025-2.088 1.125-.712 2.45-.712 1.725 0 2.913 1.187 1.187 1.188 1.187 2.913 0 .95-.35 1.887-.35.938-1.263 2.113-.912 1.175-2.474 2.737-1.563 1.563-3.988 3.763Zm0-.85q2.375-2.175 3.912-3.7 1.538-1.525 2.438-2.663.9-1.137 1.25-2.012t.35-1.7q0-1.5-1-2.5t-2.475-1q-1.2 0-2.213.687-1.012.688-1.937 2.188H11.7q-.975-1.525-1.962-2.2-.988-.675-2.213-.675-1.45 0-2.45 1-1 1-1 2.5 0 .85.35 1.712.35.863 1.238 1.988Q6.55 13 8.088 14.537 9.625 16.075 12 18.25Zm0-6.8Z"/>
              </svg>
              Asignar
            </a>
          </li>
          <li class="nav-item"></li>
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
    str += "<li class='page-item previous no'><a href='/user/formularios/pendientes?cursor=" + JSON.stringify(cursor) + "&part=" + document.getElementById('buscarFormBox').value + "&dir=prev' class='nav-link'>&#9664 Anterior</a>";
  } else {
    str += "<li><a href='#' class='nav-link disabled'>&#9664 Anterior</a>";
  }

  if (hasNexts) {
    str += "<li class='page-item next no'><a href='/user/formularios/pendientes?cursor=" + JSON.stringify(cursor) + "&part=" + document.getElementById('buscarFormBox').value + "&dir=next' class='nav-link'>Siguiente &#9654</a>";
  } else {
    str += "<li><a href='#' class='nav-link disabled'>Siguiente &#9654</a>";
  }
  str += "</ul>";

  document.getElementById('pagination-wrapper').innerHTML = str;
}

// events
const elemBuscar = document.getElementById('buscarFormBox');
elemBuscar.onchange = (event) => {
  setCookie('filtro', event.target.value, .5) // medio dia
}
elemBuscar.value = getCookie('filtro')

// incializacion
const elemAsigdos = document.getElementById('asigdos');
elemAsigdos.setAttribute('href', `/user/formularios?part=${getCookie('filtro')}`)

const elemAsig = document.getElementById('asig');
elemAsig.setAttribute('action', `/user/formularios/asignar?part=${getCookie('filtro')}`)

