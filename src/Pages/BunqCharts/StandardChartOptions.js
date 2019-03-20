export default {
    scales: {
        yAxes: [
            {
                fontColor: "white",
                ticks: {
                    fontColor: "white",
                    beginAtZero: true,
                    callback: function(value, index, values) {
                        return value.toLocaleString();
                    }
                }
            }
        ],
        xAxes: [
            {
                fontColor: "white",
                offset:true,
                ticks: {
                    fontColor: "white"
                }
            }
        ]
    },
    tooltips: {
        mode: "label",
        label: "mylabel",
        callbacks: {
            label: function(tooltipItem, data) {
                return tooltipItem.yLabel.toLocaleString();
            }
        }
    },
    legend: {
        labels: {
            fontColor: "white"
        }
    }
};
