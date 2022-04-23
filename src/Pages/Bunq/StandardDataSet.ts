export interface DataPoint {
    x: Date;
    y: number;
}

export interface StandardDataSetProps {
    color?: string | false | string[];
    label?: string;
    forceShowDataLabel?: boolean;
    datalabels?: any;
    data: DataPoint[];
    pointBackgroundColor?: string | string[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    pointRadius?: number;

    [key: string]: any;
}

export interface DataSetProps {
    [key: string]: any;
}

export default ({ datalabels, color = false, forceShowDataLabel = false, ...options }: StandardDataSetProps) => {
    if (color) {
        options.pointBackgroundColor = color;
        options.backgroundColor = color;
        options.borderColor = color;
    }

    const dataSet: DataSetProps = {
        borderWidth: 1,
        datalabels: {
            display: forceShowDataLabel ? true : "auto",
            color: "white",
            align: "end",
            anchor: "end",
            offset: 4,
            formatter: val => {
                const directValue = typeof val.y !== "undefined" ? val.y : val;
                return directValue.toLocaleString();
            }
        },
        ...options
    };
    if (datalabels === false) dataSet.datalabels = { display: false };

    return dataSet;
};
