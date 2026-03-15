export interface ChartAxisConfig {
    id?: string;
    fontColor?: string;
    type?: string;
    distribution?: string;
    bounds?: string;
    position?: string;
    display?: boolean;
    ticks?: Record<string, unknown>;
    time?: Record<string, unknown>;
    gridLines?: Record<string, unknown>;
    [key: string]: unknown;
}

export interface ChartOptions {
    scales: {
        yAxes: ChartAxisConfig[];
        xAxes: ChartAxisConfig[];
    };
    [key: string]: unknown;
}

export default (tooltipMode = "label", annotations = false, customOptions = {}): ChartOptions => {
    const options: ChartOptions = {
        maintainAspectRatio: false,
        backgroundColor: "#33353f",
        scales: {
            yAxes: [
                {
                    fontColor: "white",
                    ticks: {
                        fontColor: "white",
                        beginAtZero: true,
                        callback: function(value) {
                            return (value as number).toLocaleString();
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
                label: function(tooltipItem: { yLabel: { toLocaleString(): string } }) {
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

    return { ...options, ...customOptions };
};
