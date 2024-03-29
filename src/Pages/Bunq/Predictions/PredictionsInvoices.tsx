import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import DefaultSwitch from "../../../Components/Controls/DefaultSwitch";
import MovingAverage from "../../../Functions/MovingAverage";

import StandardChartOptions from "../StandardChartOptions";
import StandardDataSet from "../StandardDataSet";
import StandardPlugins from "../StandardPlugins";
import { standardBlue } from "../ChartColors";

const lastMonthsCount = 5;
const defaultMonthlyInterval = 1;
const defaultPercentageIncrease = 10;
const defaultMonthsShown = 24;

export default ({ invoices }) => {
    const [logScale, toggleLogScale] = useState(false);
    const [monthlyInterval, setMonthlyInterval] = useState(defaultMonthlyInterval);
    const [changePercentage, setChangePercentage] = useState(defaultPercentageIncrease);
    const [monthsShown, setMonthsShown] = useState(defaultMonthsShown);

    const invoiceChartDataRaw = invoices.map(invoice => {
        return {
            x: new Date(invoice.date),
            y: invoice.change
        };
    });
    const invoiceChartData = MovingAverage(invoiceChartDataRaw, 2, true);

    // remove the first 10 unstable months
    invoiceChartData.splice(0, 10);
    // get last 6 months;
    const lastInvoices = invoiceChartData.slice(invoiceChartData.length - lastMonthsCount);

    // get first value in sequence and exclude
    let previousChange = lastInvoices[0].y;
    lastInvoices.shift();

    // calculate difference in change values for the other 5 months
    let changeList = [];
    lastInvoices.forEach(invoice => {
        changeList.push(invoice.y - previousChange);
        previousChange = invoice.y;
    }, 0);
    const totalChangeReduced = changeList.reduce((total, change) => {
        return total + change;
    });

    // calculate average difference for these months
    let averagePerMonth = totalChangeReduced / lastInvoices.length;
    const averageMonthDisplay = averagePerMonth;

    // add the average month for the next 2 years
    const lastValue = invoiceChartData[invoiceChartData.length - 1];
    const multiplier = changePercentage / 100 + 1;
    let changeValue = lastValue.y;
    for (let i = 1; i < monthsShown; i++) {
        // every 3 months we get 20% more new users a month
        if (i % monthlyInterval === 0 && i > 0) {
            averagePerMonth = averagePerMonth * multiplier;
        }
        changeValue += Math.round(averagePerMonth);
        const changeDate = new Date(lastValue.x);
        changeDate.setMonth(changeDate.getMonth() + i);

        invoiceChartData.push({
            x: changeDate,
            y: changeValue
        });
    }

    const options = StandardChartOptions();
    options.scales.yAxes[0].type = logScale ? "logarithmic" : "linear";
    const data = StandardDataSet({
        label: "Invoice prediction",
        data: invoiceChartData,
        backgroundColor: standardBlue,
        pointRadius: 0,
        trendlineLinear: false
    });

    return (
        <div>
            <Typography variant="body1" className="chart-description">
                Last {lastMonthsCount} months of actual data have an average increase of{" "}
                {averageMonthDisplay.toLocaleString()}.
            </Typography>
            <Typography variant="body1" className="chart-description">
                This graph's data uses this monthly increase and assumes every X interval (default{" "}
                {defaultMonthlyInterval}) this amount will increase by Y percentage (default {defaultPercentageIncrease}
                ).
            </Typography>

            <div className="chart-content">
                <TextField
                    label="Monthly interval"
                    className="text-field"
                    type="number"
                    inputProps={{
                        min: 1
                    }}
                    value={monthlyInterval}
                    onChange={e => setMonthlyInterval(parseInt(e.target.value))}
                />
                <TextField
                    label="Percentage increase"
                    className="text-field"
                    type="number"
                    inputProps={{
                        min: 1
                    }}
                    value={changePercentage}
                    onChange={e => setChangePercentage(parseInt(e.target.value))}
                />
                <TextField
                    label="Months shown"
                    className="text-field"
                    type="number"
                    inputProps={{
                        min: 1
                    }}
                    value={monthsShown}
                    onChange={e => setMonthsShown(parseInt(e.target.value))}
                />
                <DefaultSwitch className="switch" label="Log scale" checked={logScale} onChange={toggleLogScale} />
            </div>
            <div className="chart-wrapper">
                <Line
                    className="chart"
                    data={{
                        datasets: [data]
                    }}
                    options={options}
                    plugins={StandardPlugins()}
                />
            </div>
        </div>
    );
};
