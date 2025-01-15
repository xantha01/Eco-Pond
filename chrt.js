var options = {
    chart: {
        type: 'line',
        height: 400,
        width: '100%',
        toolbar: {
            show: true, // This enables the toolbar for export buttons
            tools: {
                download: true // This enables the download button
            }
        }
    },
    series: [
        {
            name: 'Turbidity',
            data: [5, 6, 7, 4, 6, 8, 5]
        },
        {
            name: 'Temperature',
            data: [28, 30, 32, 34, 35, 36, 29]
        },
        {
            name: 'TDS',
            data: [250, 270, 290, 300, 310, 320, 330]
        }
    ],
    xaxis: {
        categories: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        labels: {
            style: {
                colors: 'var(--black)', // Change x-axis labels color
                fontSize: '12px'
            }
        }
    },
    yaxis: [
        {
            title: {
                text: 'Turbidity',
                style: {
                    color: 'var(--black)', // Change y-axis title text color
                    fontSize: '14px',
                    fontWeight: 'bold',
                }
            },
            labels: {
                style: {
                    colors: 'var(--black)', // Change y-axis labels color
                    fontSize: '12px'
                }
            },
            opposite: true
        },
        {
            title: {
                text: 'Temperature',
                style: {
                    color: 'var(--black)',
                    fontSize: '14px',
                    fontWeight: 'bold',
                }
            },
            labels: {
                style: {
                    colors: 'var(--black)',
                    fontSize: '12px'
                }
            },
            opposite: true
        },
        {
            title: {
                text: 'TDS',
                style: {
                    color: 'var(--black)',
                    fontSize: '14px',
                    fontWeight: 'bold',
                }
            },
            labels: {
                style: {
                    colors: 'var(--black)',
                    fontSize: '12px'
                }
            },
            opposite: true
        }
    ],
    colors: ['#ff5733', '#33ff57', '#3357ff'], // Bright colors for lines
    legend: {
        position: 'top',
        labels: {
            colors: 'var(--black)', // Change legend text color
            useSeriesColors: false,
        }
    },
    tooltip: {
        shared: true,
        intersect: false
    },
    stroke: {
        width: 3,  // Makes the lines more prominent
        curve: 'smooth'  // Smooth lines
    },
    fill: {
        type: 'solid',
        colors: ['#ff5733', '#33ff57', '#3357ff']  // Color for the area fill under each series
    },
    grid: {
        borderColor: '#444', // Change grid line color (optional for better contrast)
    },
    plotOptions: {
        area: {
            fillTo: 'end' // This will ensure the area fills to the end of the chart
        }
    }
};

var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();


document.getElementById("export-png").addEventListener("click", function () {
    chart.dataURI().then(({ imgURI }) => {
      const link = document.createElement("a");
      link.href = imgURI;
      link.download = "chart.png";
      link.click();
    });
  });
  
  
document.getElementById("export-svg").addEventListener("click", function () {
    chart.dataURI().then(({ svgURI }) => {
        const link = document.createElement("a");
        link.href = svgURI;
        link.download = "chart.svg";
        link.click();
    });
});

document.getElementById("export-csv").addEventListener("click", function () {
    chart.dataURI().then(({ csv }) => {
        // Create a temporary link to download the CSV file
        const blob = new Blob([csv], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'chart-data.csv';
        link.click();
    });
});
