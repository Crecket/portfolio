import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import "chartjs-plugin-annotation";
import Link from "react-router-dom/Link";
import Typography from "@material-ui/core/Typography";

import DefaultSwitch from "../../../Components/DefaultSwitch";

import StandardChartOptions from "../StandardChartOptions";
import StandardDataSet from "../StandardDataSet";

import MovingAverage from "../../../Functions/MovingAverage";

import { combinedEventList, eventsToAnnotations } from "../StandardAnnotations";
const annotationList = eventsToAnnotations(combinedEventList);

export default ({ together }) => {
    const [showAnnotations, setShowAnnotations] = useState(false);
    const [movingAverage, setMovingAverage] = useState(true);

    let previousChange = 0;
    const togetherChartDelta = [];
    const togetherChartDeltaColors = [];
    const togetherChartData = [];

    // map together list to x/y values
    let previousId = together[0].id;
    const mappedTogetherXY = together.map(togetherUser => {
        const nextItem = {
            x: new Date(togetherUser.date),
            y: togetherUser.id - previousId
        };
        previousId = togetherUser.id;

        return nextItem;
    });

    // calculate moving average
    const movingAverageChartData = MovingAverage(mappedTogetherXY, 2, true);

    // wich dataset to use
    const togetherList = movingAverage ? movingAverageChartData : mappedTogetherXY;

    togetherList.forEach(together => {
        const togetherIdChange = together.y;

        // skip no change events
        if (togetherIdChange === 0) return;

        // calculate difference in new togethers between now and last month
        const changeVsLastMonth = togetherIdChange - previousChange;
        const color = changeVsLastMonth < 0 ? "#ff171f" : "#67ff4d";
        togetherChartDelta.push({
            x: together.x,
            y: changeVsLastMonth
        });
        togetherChartDeltaColors.push(color);

        previousChange = togetherIdChange;
        togetherChartData.push({
            x: together.x,
            y: togetherIdChange
        });
    });

    // first month always 0
    togetherChartDelta[0].y = 0;

    const options = StandardChartOptions("label", showAnnotations ? annotationList : []);
    const dataSets = [
        StandardDataSet({
            label: "New together users",
            data: togetherChartData,
            backgroundColor: "#0d61e8"
        }),
        StandardDataSet({
            label: "Delta",
            data: togetherChartDelta,
            backgroundColor: togetherChartDeltaColors,
            datalabels: false
        })
    ];

    return (
        <div>
            <Typography variant="body1" className="chart-description">
                Amount of new Together users for each month. Blue is the estimated amount of new Together users compared
                to the previous period and NOT the amount of current users.
            </Typography>
            <div className="chart-content">
                <DefaultSwitch label="Use 5 month moving average" checked={movingAverage} onChange={setMovingAverage} />
                <DefaultSwitch label="Show annotations" checked={showAnnotations} onChange={setShowAnnotations} />
            </div>
            <Bar
                className="chart"
                options={options}
                data={{
                    datasets: dataSets
                }}
            />
        </div>
    );
};
