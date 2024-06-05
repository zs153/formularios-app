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
  table.innerHTML = ''

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
    elem.textContent='OK'
    span1 = document.createElement('span')
    span1.classList.add('avatar', 'avatar-rounded', 'bg-green-lt')
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
    div3.textContent = element.FECCAR.slice(0, 10).split("-").reverse().join("/")

    div2.append(div3)
    div1.append(div2)
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
    span2.textContent = element.DESCAR
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
    div1 = document.createElement('div')
    div1.classList.add('d-flex', 'py-1', 'align-items-center')
    div2 = document.createElement('div')
    div2.classList.add('flex-fill')
    div3 = document.createElement('div')
    div3.classList.add('font-weight-medium')
    div3.textContent = element.FICCAR

    div2.appendChild(div3)
    div1.appendChild(div2)
    cell.appendChild(div1)
    row.appendChild(cell)

    // col5
    cell = document.createElement('td')
    div1 = document.createElement('div')
    div1.classList.add('d-flex', 'py-1', 'align-items-center')
    div2 = document.createElement('div')
    div2.classList.add('flex-fill')
    div3 = document.createElement('div')
    div3.classList.add('font-weight-medium')
    div3.textContent = element.REFCAR

    div2.appendChild(div3)
    div1.appendChild(div2)
    cell.appendChild(div1)
    row.appendChild(cell)

    // col6
    cell = document.createElement('td')
    div1 = document.createElement('div')
    div1.classList.add('d-flex', 'py-1', 'align-items-center')
    div2 = document.createElement('div')
    div2.classList.add('flex-fill')
    div3 = document.createElement('div')
    div3.classList.add('font-weight-medium')
    div3.textContent = element.NUMREG

    div2.appendChild(div3)
    div1.appendChild(div2)
    cell.appendChild(div1)
    row.appendChild(cell)

    table.appendChild(row)
  })

  createPages(cursor, document.getElementById('buscarCargaBox').value)
}
const createPages = (cursor, part) => {
  let elemUl = document.createElement('ul')
  let elemLi
  let elemA

  elemLi = document.createElement('li')
  elemLi.classList.add('page-item', 'previous', 'no')
  elemA = document.createElement('a')
  elemA.classList.add('nav-link')
  elemA.href = "/admin/cargas?cursor=" + JSON.stringify(cursor) + "&part=" + part + "&dir=prev"
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
  elemA.href = "/admin/cargas?cursor=" + JSON.stringify(cursor) + "&part=" + part + "&dir=next"
  elemA.innerHTML = "Siguiente &#9654"

  elemLi.appendChild(elemA)
  
  if (!hasNexts) {
    elemA.classList.add('nav-link', 'disabled')
  }
  elemUl.appendChild(elemLi)

  document.getElementById('pagination-wrapper').appendChild(elemUl)
}

// events
const elemBuscar = document.getElementById('buscarCargaBox');
elemBuscar.onchange = (event) => {
  setCookie('filtro', event.target.value, .5) // medio dia
}
elemBuscar.value = getCookie('filtro')

// incializacion
document.getElementById('new').setAttribute('href', `/admin/cargas/add?part=${getCookie('filtro')}`)
document.getElementById('newresp').setAttribute('href', `/admin/cargas/add?part=${getCookie('filtro')}`)
