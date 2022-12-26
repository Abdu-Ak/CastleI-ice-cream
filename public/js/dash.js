// Chart.js scripts
// -- Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// -- Bar Chart Example
var ctx = document.getElementById("myBarChart");
let placed = document.getElementById("placed").value;
let shipped = document.getElementById("shipped").value;
let delivered = document.getElementById("delivered").value;
let cancelled = document.getElementById("cancelled").value;

var myLineChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ["Placed", "Shipped", "Deliverd", "Cancelled", ],
    datasets: [{
      label: "orders",
      backgroundColor: ["rgb(93, 93, 139)", "rgb(167, 167, 89)", "rgb(74, 127, 74)", "rgb(115, 67, 67)"],
      borderColor: "rgba(2,117,216,1)",
      data: [placed, shipped, delivered, cancelled],
    }],
  },
  options: {
    scales: {
      xAxes: [{
        time: {
          unit: 'month'
        },
        gridLines: {
          display: false
        },
       
      }],
      yAxes: [{
        gridLines: {
          display: true
        }
      }],
    },
    legend: {
      display: false
    }
  }
});
// -- Pie Chart Example
var ctx = document.getElementById("myPieChart");
let cod =document.getElementById('cod').value;
let online = document.getElementById('online').value;
var myPieChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: [ "COD", "Online", ],
    datasets: [{
      data: [cod, online],
      backgroundColor: ['rgb(93, 93, 139)', 'rgb(74, 127, 74)',],
    }],
  },
});

$(document).ready(function() {
  $('Table').DataTable();
});


 

