export default (tooltipMode = "label", annotations = false) => {
    const options = {
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
                    type: "time",
                    distribution: "series",
                    bounds: "ticks",
                    ticks: {
                        fontColor: "white"
                    },
                    time: {
                        unit: "month"
                    }
                }
            ]
        },
        tooltips: {
            mode: tooltipMode,
            intersect: false,
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

    if (tooltipMode !== "label") {
        options.hover = {
            mode: tooltipMode
        };
    }

    if (annotations) {
        options.annotation = {
            annotations: annotations
        };
    }

    return options;
};
