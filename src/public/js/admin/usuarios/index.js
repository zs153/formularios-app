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

  let cell
  let div1
  let div2
  let div3
  let span1
  let span2
  let elem

  state.map(element => {
    // row
    const row = document.createElement('tr')
    
    // col1
    cell = document.createElement('td')
    div1 = document.createElement('div')
    elem = document.createElement('h6')
    elem.classList.add('m-0')
    elem.textContent = element.USERID
    span1 = document.createElement('span')

    if (element.STAUSU === estados.activo) {
      span1.classList.add('avatar', 'avatar-rounded', 'bg-green-lt')
    } else {
      span1.classList.add('avatar', 'avatar-rounded', 'bg-red-lt')
    }
    span1.append(elem)
    div1.classList.add('align-items-center')
    div1.appendChild(span1)

    cell.appendChild(div1)
    row.appendChild(cell)

    // col2
    cell = document.createElement('td')
    div1 = document.createElement('div')
    div1.classList.add('d-flex', 'py-1', 'align-items-center')
    div2 = document.createElement('div')
    div2.classList.add('flex-fill')
    div3 = document.createElement('div')
    div3.classList.add('font-weight-medium')
    span2 = document.createElement('span')
    span2.classList.add('text-overflow-dynamic-ellipsis')
    span2.textContent = element.NOMUSU
    span1 = document.createElement('span')
    span1.classList.add('text-overflow-dynamic-container')
    span1.appendChild(span2)

    div3.appendChild(span1)
    div2.appendChild(div3)
    div1.appendChild(div2)
    cell.appendChild(div1)
    row.appendChild(cell)

    // col3
    cell = document.createElement('td')
    div1 = document.createElement('div')
    div1.classList.add('d-flex', 'py-1', 'align-items-center')
    div2 = document.createElement('div')
    div2.classList.add('flex-fill')
    div3 = document.createElement('div')
    div3.classList.add('font-weight-medium')
    span2 = document.createElement('span')
    span2.classList.add('text-overflow-dynamic-ellipsis')
    span2.textContent = element.DESOFI
    span1 = document.createElement('span')
    span1.classList.add('text-overflow-dynamic-container')
    span1.appendChild(span2)

    div3.appendChild(span1)
    div2.appendChild(div3)
    div1.appendChild(div2)
    cell.appendChild(div1)
    row.appendChild(cell)

    // col4
    cell = document.createElement('td')
    cell.innerHTML = `<ul class="dots-menu">
    <li class="nav-item drop-right">
      <a href="#" class="nav-link p-0">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-inline me-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /></svg>
      </a>
      <ul>
        <li class="nav-item">
          <a href="/admin/usuarios/edit/${element.IDUSUA}?part=${getCookie('filtro')}" class="nav-link">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-inline me-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>
            Editar
          </a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link" onclick="{document.getElementById('idusua').value ='${element.IDUSUA}', document.getElementById('msgbor').innerHTML ='<p>${element.USERID}</p><p>${element.NOMUSU}</p>'}" data-bs-toggle="modal" data-bs-target="#modal-borrar">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-inline me-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
            Borrar
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
  elemA.href = "/admin/usuarios?cursor=" + JSON.stringify(cursor) + "&part=" + part + "&dir=prev"
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
  elemA.href = "/admin/usuarios?cursor=" + JSON.stringify(cursor) + "&part=" + part + "&dir=next"
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
const elemBuscar = document.getElementById('buscarUserBox');
elemBuscar.onchange = (event) => {
  setCookie('filtro', event.target.value, .5) // medio dia
}
elemBuscar.value = getCookie('filtro')

// inicializacion
document.getElementById('new').setAttribute('href', `/admin/usuarios/add?part=${getCookie('filtro')}`)
document.getElementById('resp').setAttribute('href', `/admin/usuarios/add?part=${getCookie('filtro')}`)
document.getElementById('delet').setAttribute('action', `/admin/usuarios/delete?part=${getCookie('filtro')}`)

// crear tabla
buildTable(usuarios)