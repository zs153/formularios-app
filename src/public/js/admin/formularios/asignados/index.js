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
    cell.innerHTML = `<div class="align-items-center ">
      <span class="avatar avatar-rounded bg-blue-lt">
        <h6 class="m-0">${element.LIQFOR}</h6>
      </span>
    </div>`
    row.appendChild(cell)

    // col2
    cell = document.createElement('td')
    cell.innerHTML = `<div class="d-flex align-items-center">
      <div class="flex-fill">
        <div class="font-weight-medium">${element.DESOFI}</div>
      </div>
    </div>`
    row.appendChild(cell)

    // col3
    cell = document.createElement('td')
    cell.innerHTML = `<div class="d-flex align-items-center">
      <div class="flex-fill">
        <div class="font-weight-medium">${element.EJEFOR}</div>
      </div>
    </div>`
    row.appendChild(cell)

    // col4
    cell = document.createElement('td')
    cell.innerHTML = `<div class="d-flex align-items-center">
      <div class="flex-fill">
        <div class="font-weight-medium">${element.REFFOR}</div>
      </div>
    </div>`
    row.appendChild(cell)
    
    // col5
    cell = document.createElement('td')
    cell.innerHTML = `<div class="d-flex align-items-center">
      <div class="flex-fill">
        <div class="font-weight-medium">${element.NIFCON}</div>
      </div>
    </div>`
    row.appendChild(cell)

    // col6
    cell = document.createElement('td')
    cell.innerHTML = `<div class="d-flex align-items-center">
      <div class="flex-fill">
        <div class="font-weight-medium"><span class="text-overflow-dynamic-container"><span class="text-overflow-dynamic-ellipsis">${element.NOMCON}</span></span></div>
      </div>
    </div>`
    row.appendChild(cell)

    // col7
    cell = document.createElement('td')
    cell.innerHTML = `<div class="d-flex align-items-center">
      <div class="flex-fill">
        <div class="font-weight-medium"><span class="text-overflow-dynamic-container"><span class="text-overflow-dynamic-ellipsis">${element.DESTIP}</span></span></div>
      </div>
    </div>`
    row.appendChild(cell)

    // col8
    cell = document.createElement('td')
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
    cell.innerHTML = `<ul class="dots-menu">
      <li class="nav-item drop-right">
        <a href="#" class="nav-link p-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke-width="1" fill="none" d="M12 18.7q-.4 0-.688-.287-.287-.288-.287-.688 0-.4.287-.687.288-.288.688-.288.4 0 .688.288.287.287.287.687 0 .4-.287.688-.288.287-.688.287Zm0-5.725q-.4 0-.688-.287-.287-.288-.287-.688 0-.4.287-.688.288-.287.688-.287.4 0 .688.287.287.288.287.688 0 .4-.287.688-.288.287-.688.287Zm0-5.725q-.4 0-.688-.287-.287-.288-.287-.688 0-.4.287-.687Q11.6 5.3 12 5.3q.4 0 .688.288.287.287.287.687 0 .4-.287.688-.288.287-.688.287Z"/>
          </svg>
        </a>
        <ul>
          <li class="nav-item">
            <a href="/admin/formularios/asignados/edit/${element.IDFORM}" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke-width=".4" fill="none" d="M6.85 20.575q-.6 0-1.012-.412-.413-.413-.413-1.013V4.85q0-.6.413-1.013.412-.412 1.012-.412h7.825L18.6 7.35v3.4h-.65V7.675h-3.6V4.05h-7.5q-.3 0-.55.25-.25.25-.25.55v14.275q0 .3.25.55.25.25.55.25h4.25v.65Zm-.8-.65V4.05 19.925ZM17.025 14.6l.45.425-3.75 3.75v1.1h1.1l3.775-3.75.45.45-3.95 3.95h-2v-2Zm2.025 1.975L17.025 14.6l1.05-1.05q.225-.2.525-.2.3 0 .475.2l1 1q.2.2.2.487 0 .288-.2.538Z"/>
              </svg>
              Editar
            </a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link" onclick="{document.getElementById('idreso').value ='${element.IDFORM}', document.getElementById('msgres').innerHTML ='<p>Ejercicio ${element.EJEFOR}</p><p>${element.NIFCON} ${element.NOMCON}</p>'}" data-bs-toggle="modal" data-bs-target="#modal-resolver">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke-width=".4" fill="none" d="M9.575 17.025 4.9 12.35l.475-.45 4.2 4.2 9.075-9.075.45.45Z"/>
              </svg>
              Resolver
            </a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link" onclick="{document.getElementById('iddesa').value ='${element.IDFORM}', document.getElementById('msgdes').innerHTML ='<p>Ejercicio ${element.EJEFOR}</p><p>${element.NIFCON} ${element.NOMCON}</p>'}" data-bs-toggle="modal" data-bs-target="#modal-desasignar">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke-width=".4" fill="none" d="M12.025 20.175q-2.475-2.45-4.137-4.212-1.663-1.763-2.65-3.088-.988-1.325-1.413-2.363Q3.4 9.475 3.4 8.5q0-2.025 1.4-3.425t3.4-1.4q.9 0 1.75.3t1.525.85L9.8 10.675h3.1l-.75 7.875 3.1-10.25H12.2l1.375-4.125q.5-.25 1.038-.375.537-.125 1.112-.125 2.025 0 3.438 1.4 1.412 1.4 1.412 3.425 0 1-.475 2.075-.475 1.075-1.5 2.437-1.025 1.363-2.65 3.113t-3.925 4.05ZM11.55 18.8l.7-7.5h-3.3l1.8-6.25q-.6-.3-1.238-.525Q8.875 4.3 8.225 4.3q-1.75 0-2.962 1.225Q4.05 6.75 4.05 8.5q0 .825.35 1.712.35.888 1.225 2.075.875 1.188 2.325 2.763 1.45 1.575 3.6 3.75Zm1.15-.175q4.025-4.15 5.625-6.338 1.6-2.187 1.6-3.787 0-1.75-1.225-2.975T15.75 4.3q-.45 0-.862.112-.413.113-.788.238l-1 3.025h2.925Zm3.325-10.95ZM8.95 11.3Z"/></svg>
              Desasignar
            </a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link" onclick="{document.getElementById('idborr').value ='${element.IDFORM}', document.getElementById('msgbor').innerHTML ='<p>Ejercicio ${element.EJEFOR}</p><p>${element.NIFCON} ${element.NOMCON}</p>'}" data-bs-toggle="modal" data-bs-target="#modal-borrar">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke-width=".4" fill="none" d="M7.85 19.575q-.6 0-1.025-.425-.425-.425-.425-1.025v-12.1h-.975V5.4h3.6v-.675H15V5.4h3.6v.625h-.975V18.15q0 .6-.425 1.013-.425.412-1.025.412Zm9.125-13.55H7.05v12.1q0 .35.225.575.225.225.575.225h8.325q.3 0 .55-.25.25-.25.25-.55Zm-6.85 10.925h.625V8h-.625Zm3.15 0h.625V8h-.625ZM7.05 6.025V18.925 18.125Z"/>
              </svg>
              Borrar
            </a>
          </li>            
          <li class="nav-item list-divider"></li>
          <li class="nav-item">
            <a href="/admin/formularios/asignados/referencias/${element.IDFORM}" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke-width=".4" fill="none" d="M11.025 19.575q-1.575 0-2.963-.6-1.387-.6-2.412-1.625t-1.625-2.412q-.6-1.388-.6-2.938 0-1.6.6-2.975t1.625-2.4Q6.675 5.6 8.062 5q1.388-.6 2.963-.6.525 0 1.025.062.5.063 1 .188v.675q-.5-.15-1-.225-.5-.075-1.05-.075-2.85 0-4.887 2.037Q4.075 9.1 4.075 11.975q0 2.875 2.038 4.912 2.037 2.038 4.912 2.038t4.913-2.038q2.037-2.037 2.037-4.912 0-.275-.025-.6-.025-.325-.1-.6h.625q.05.225.087.575.038.35.038.65 0 1.55-.6 2.938-.6 1.387-1.625 2.412t-2.4 1.625q-1.375.6-2.95.6Zm3.25-3.9-3.575-3.55v-5.1h.625v4.825l3.4 3.375Zm3.7-6.825V5.875H15v-.65h2.975V2.25h.625v2.975h2.975v.65H18.6V8.85Z"/>
              </svg>
              Referencias
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
    str += "<li class='page-item previous no'><a href='/admin/formularios/asignados?cursor=" + JSON.stringify(cursor) + "&part=" + document.getElementById('buscarFormBox').value + "&dir=prev' class='nav-link'>&#9664 Anterior</a>";
  } else {
    str += "<li><a href='#' class='nav-link disabled'>&#9664 Anterior</a>";
  }

  if (hasNexts) {
    str += "<li class='page-item next no'><a href='/admin/formularios/asignados?cursor=" + JSON.stringify(cursor) + "&part=" + document.getElementById('buscarFormBox').value + "&dir=next' class='nav-link'>Siguiente &#9654</a>";
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
document.getElementById('rsltos').setAttribute('href', `/admin/formularios/resueltos?part=${getCookie('filtra')}`)
document.getElementById('pdntes').setAttribute('href', `/admin/formularios/pendientes?part=${getCookie('filtra')}`)

document.getElementById('delet').setAttribute('action', `/admin/formularios/asignados/delete?part=${getCookie('filtro')}`)
document.getElementById('desag').setAttribute('action', `/admin/formularios/asignados/desasignar?part=${getCookie('filtro')}`)
document.getElementById('resol').setAttribute('action', `/admin/formularios/asignados/resolver?part=${getCookie('filtro')}`)
