import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import "chartjs-plugin-annotation";
import Link from "react-router-dom/Link";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import DefaultSwitch from "../../../Components/DefaultSwitch";
import MovingAverage from "../../../Functions/MovingAverage";
import useBunqCanvasPattern from "../../../Hooks/useBunqCanvasPattern";

import StandardChartOptions from "../StandardChartOptions";
import StandardPlugins from "../StandardPlugins";
import StandardDataSet from "../StandardDataSet";
import { combinedEventList, eventsToAnnotations } from "../StandardAnnotations";
import { standardBlue, standardGreen, standardRed } from "../ChartColors";

const annotationList = eventsToAnnotations(combinedEventList);

export default ({ invoices }) => {
    const [showAnnotations, setShowAnnotations] = useState(false);
    const [movingAverage, setMovingAverage] = useState(true);
    const [compensation, setCompensation] = useState(10);
    const [useFillPattern, setUseFillPattern] = useState(false);

    const fillPattern = useBunqCanvasPattern(standardBlue);

    const finalCompensation = (100 - compensation) / 100;
    let previousChange = 0;
    const invoiceChartDelta = [];
    const invoiceChartDeltaColors = [];
    const invoiceChartData = [];

    // map invoice list to x/y values
    const mappedInvoiceXY = invoices.map(invoice => {
        return {
            x: new Date(invoice.date),
            y: invoice.change * finalCompensation
        };
    });

    // calculate moving average
    const movingAverageChartData = MovingAverage(mappedInvoiceXY, 2, true);

    // wich dataset to use
    const invoiceList = movingAverage ? movingAverageChartData : mappedInvoiceXY;

    invoiceList.forEach(invoice => {
        const invoiceIdChange = invoice.y;

        // skip no change events
        if (invoiceIdChange === 0) return;

        // calculate difference in new invoices between now and last month
        const changeVsLastMonth = invoiceIdChange - previousChange;
        const color = changeVsLastMonth < 0 ? standardRed : standardGreen;
        invoiceChartDelta.push({
            x: invoice.x,
            y: changeVsLastMonth
        });
        invoiceChartDeltaColors.push(color);

        previousChange = invoiceIdChange;
        invoiceChartData.push({
            x: invoice.x,
            y: invoiceIdChange
        });
    });

    // first month always 0
    invoiceChartDelta[0].y = 0;

    const options = StandardChartOptions("label", showAnnotations ? annotationList : []);
    const dataSets = [
        StandardDataSet({
            type: "line",
            label: "Invoices",
            data: invoiceChartData,
            fill: useFillPattern,
            color: useFillPattern ? fillPattern : standardBlue
        })
    ];

    if (!useFillPattern) {
        dataSets.push(
            StandardDataSet({
                type: "bar",
                label: "Invoice change",
                data: invoiceChartDelta,
                backgroundColor: invoiceChartDeltaColors,
                fill: invoiceChartDeltaColors,
                color: invoiceChartDeltaColors,
                datalabels: true
            })
        );
    }

    return (
        <div>
            <Typography variant="body1" className="chart-description">
                These numbers show how many invoices were created compared to the previous period. This is an estimate
                based on multiple lists of invoices found under the{" "}
                <Link className="inline-link" to="/bunq/invoices/datasets">
                    data sets
                </Link>{" "}
                tab.
            </Typography>
            <Typography variant="body1" className="chart-description">
                The compensation field removes X percentage of invoices to compensate for extra invoices which are
                generated for things like buying a new card.
            </Typography>
            <div className="chart-content">
                <DefaultSwitch label="Use 5 month moving average" checked={movingAverage} onChange={setMovingAverage} />
                <DefaultSwitch label="Show annotations" checked={showAnnotations} onChange={setShowAnnotations} />
                <DefaultSwitch label="bunq mode" checked={useFillPattern} onChange={setUseFillPattern} />
                <TextField
                    min="0"
                    type="number"
                    label="Percentage compensation"
                    className="text-field"
                    value={compensation}
                    onChange={e => setCompensation(e.target.value)}
                />
            </div>
            <div className="chart-wrapper">
                <Bar
                    className="chart"
                    options={options}
                    plugins={StandardPlugins()}
                    data={{
                        datasets: dataSets
                    }}
                />
            </div>
        </div>
    );
};
