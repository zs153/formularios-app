import ApexCharts from '../../apexcharts.esm.js'

const element = document.querySelector('#chart-pendientes');
const element1 = document.querySelector('#chart-asignadas');
const element2 = document.querySelector('#chart-resueltas');
const options = {
  colors: ['#8F00FF', '#F76707', '#74B816'],
  chart: {
    locales: [{
      "name": "es",
      "options": {
        "months": [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre"
        ],
        "shortMonths": [
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Sep",
          "Oct",
          "Nov",
          "Dic"
        ],
        "days": [
          "Domingo",
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado"
        ],
        "shortDays": ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
        "toolbar": {
          "exportToSVG": "Descargar SVG",
          "exportToPNG": "Descargar PNG",
          "exportToCSV": "Descargar CSV",
          "menu": "Menu",
          "selection": "Seleccionar",
          "selectionZoom": "Seleccionar Zoom",
          "zoomIn": "Aumentar",
          "zoomOut": "Disminuir",
          "pan": "Navegación",
          "reset": "Reiniciar Zoom"
        }
      }
    }],
    defaultLocale: "es",
    type: 'bar',
    height: '460',
    stacked: true,
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false
  },
  series: [
    {
      name: 'Resuelto',
      data: serieR,
    },
  ],
  xaxis: {
    type: 'datetime',
  }
}
const chartPendientes = new EasyPieChart(element, {
  size: '75',
  easing: 'easeOutElastic',
  delay: 3000,
  barColor: '#4263eb',
  trackColor: '#f2f3f4',
  scaleColor: false,
  lineWidth: 3,
  trackWidth: 1,
  lineCap: 'butt',
  onStep: function (from, to, percent) {
    this.el.children[0].innerHTML = Math.round(percent * 100) / 100;
  }
});
const chartAdjudicadas = new EasyPieChart(element1, {
  size: '75',
  easing: 'easeOutElastic',
  delay: 3000,
  barColor: '#F76707',
  trackColor: '#f2f3f4',
  scaleColor: false,
  lineWidth: 3,
  trackWidth: 1,
  lineCap: 'butt',
  onStep: function (from, to, percent) {
    this.el.children[0].innerHTML = Math.round(percent * 100) / 100;
  }
});
const chartResueltas = new EasyPieChart(element2, {
  size: '75',
  easing: 'easeOutElastic',
  delay: 3000,
  barColor: '#74B816',
  trackColor: '#f2f3f4',
  scaleColor: false,
  lineWidth: 3,
  trackWidth: 1,
  lineCap: 'butt',
  onStep: function (from, to, percent) {
    this.el.children[0].innerHTML = Math.round(percent * 100) / 100;
  }
});

const chart = new ApexCharts(document.querySelector("#chart-actuac"), options);
chart.render();

// events
