// Monolyth.js for web analytics with websockets


var option_active = "db"; // dashboard is active by defualt...
var c_screen = "dashboard" // currently open screen

// switched Options
// db..
document.getElementById('db').addEventListener('click', function() {
   document.getElementById(option_active).className = "";
   document.getElementById(c_screen).style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  c_screen = "dashboard";
   this.className = "active";
    option_active = this.id;
});

// user
document.getElementById('user').addEventListener('click', function() {
   document.getElementById(option_active).className = "";
   document.getElementById(c_screen).style.display = "none";
   document.getElementById("screen2").style.display = "block";
   c_screen = "screen2";
   this.className = "active";
    option_active = this.id;
});

//update
document.getElementById('update').addEventListener('click', function() {
   document.getElementById(option_active).className = "";
    document.getElementById(c_screen).style.display = "none";
   document.getElementById("screen3").style.display = "block";
   c_screen = "screen3";
   this.className = "active";
       option_active = this.id;
});

//table
document.getElementById('table').addEventListener('click', function() {
   document.getElementById(option_active).className = "";
    document.getElementById(c_screen).style.display = "none";
   document.getElementById("screen4").style.display = "block";
   c_screen = "screen4";
   this.className = "active";
       option_active = this.id;
});








// for live traffic charts
var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var config = {
    type: 'line',
    data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            label: "My First dataset",
            backgroundColor: window.chartColors.red,
            borderColor: window.chartColors.red,
            data: [
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor()
            ],
            fill: false,
        }, {
            label: "My Second dataset",
            fill: false,
            backgroundColor: window.chartColors.blue,
            borderColor: window.chartColors.blue,
            data: [
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor()
            ],
        }]
    },
    options: {
        responsive: true,
        title:{
            display:true,
            text:'User Traffic Chart'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Month'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Number of Users'
                }
            }]
        }
    }
};

window.onload = function() {
    var ctx = document.getElementById("canvas").getContext("2d");
    window.myLine = new Chart(ctx, config);
};

document.getElementById('randomizeData').addEventListener('click', function() {
    config.data.datasets.forEach(function(dataset) {
        dataset.data = dataset.data.map(function() {
            return randomScalingFactor();
        });

    });

    window.myLine.update();
});

var colorNames = Object.keys(window.chartColors);
document.getElementById('addDataset').addEventListener('click', function() {
    var colorName = colorNames[config.data.datasets.length % colorNames.length];
    var newColor = window.chartColors[colorName];
    var newDataset = {
        label: 'Dataset ' + config.data.datasets.length,
        backgroundColor: newColor,
        borderColor: newColor,
        data: [],
        fill: false
    };

    for (var index = 0; index < config.data.labels.length; ++index) {
        newDataset.data.push(randomScalingFactor());
    }

    config.data.datasets.push(newDataset);
    window.myLine.update();
});

document.getElementById('addData').addEventListener('click', function() {
    if (config.data.datasets.length > 0) {
        var month = MONTHS[config.data.labels.length % MONTHS.length];
        config.data.labels.push(month);

        config.data.datasets.forEach(function(dataset) {
          // get delta current users..
          var current_delta = document.getElementById("delta").innerHTML;
          var current_users = current_delta.replace(' <i class="pe-7s-users"></i>','');
            dataset.data.push(Number(current_users)+1);
        });

        window.myLine.update();
    }
});

// called by socket.io
function chartrs() {
 if (config.data.datasets.length > 0) {
    var month = MONTHS[config.data.labels.length % MONTHS.length];
    config.data.labels.push(month);

    config.data.datasets.forEach(function(dataset) {
        dataset.data.push(randomScalingFactor());
    });

    window.myLine.update();
}
}

document.getElementById('removeDataset').addEventListener('click', function() {
    config.data.datasets.splice(0, 1);
    window.myLine.update();
});

document.getElementById('removeData').addEventListener('click', function() {
    config.data.labels.splice(-1, 1); // remove the label first

    config.data.datasets.forEach(function(dataset, datasetIndex) {
        dataset.data.pop();
    });

    window.myLine.update();
});


// generate code
function generateCode(url,passphrase){
    document.getElementById('code-loader').style.display = 'block';
     $('#code-loader').delay(1000).fadeOut('slow',function(){
          $(this).remove();
       document.getElementById('code_bank').style.display = 'block';
    });

}
